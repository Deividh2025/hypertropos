import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conquista, EstadoSilhueta, Gamificacao } from '../types/gamificacao';
import { processarPosSessao, obterConquistasUsuario } from '../lib/motor-gamificacao';
import { obterEstado } from '../db/queries/gamificacao';
import { executarQuery, obterLinha } from '../db/local-cache';
import { enqueueChange } from '../db/sync-engine';
import * as Haptics from 'expo-haptics';

export type CelebrationEvent =
  | { type: 'xp'; xpGanho: number }
  | { type: 'nivel'; nivel: number }
  | { type: 'conquista'; conquista: Conquista }
  | { type: 'tier'; tierAntigo: 'bronze' | 'pedra' | 'marmore' | 'dourada'; tierNovo: 'bronze' | 'pedra' | 'marmore' | 'dourada' };

interface GamificacaoState {
  // Estado básico
  xpTotal: number;
  nivelAtual: number;
  streakAtual: number;
  streakMaximo: number;
  freezesDisponiveis: number;
  ultimoFreezeUsado: string | null;
  conquistas: Conquista[];
  carregando: boolean;

  // Fila de Celebrações (Dopaminérgica Sequencial)
  filaCelebracoes: CelebrationEvent[];
  celebracaoAtiva: CelebrationEvent | null;

  // Controle do Prompt de Freeze
  mostrarPromptFreeze: boolean;
  freezeDiasStreak: number;

  // Ações
  inicializarGamificacao: () => Promise<void>;
  finalizarTreinoDopaminergico: (
    registroSessaoId: string,
    modoExpress: boolean,
    series: { exercicio_id: string; reps_executadas: number; rir_realizado: number; rir_alvo: number }[]
  ) => Promise<void>;
  desempilharCelebracao: () => void;
  verificarNecessidadeFreeze: () => Promise<void>;
  usarFreeze: () => Promise<void>;
  ignorarFreeze: () => void;
}

export const useGamificacaoStore = create<GamificacaoState>((set, get) => ({
  xpTotal: 0,
  nivelAtual: 1,
  streakAtual: 0,
  streakMaximo: 0,
  freezesDisponiveis: 0,
  ultimoFreezeUsado: null,
  conquistas: [],
  carregando: true,

  filaCelebracoes: [],
  celebracaoAtiva: null,

  mostrarPromptFreeze: false,
  freezeDiasStreak: 0,

  inicializarGamificacao: async () => {
    set({ carregando: true });
    try {
      const estado = await obterEstado();
      const todasConquistas = await obterConquistasUsuario();
      const ultimoFreeze = await AsyncStorage.getItem('ultimo_freeze_usado');

      if (estado) {
        set({
          xpTotal: estado.xp_total,
          nivelAtual: estado.nivel_atual,
          streakAtual: estado.streak_atual,
          streakMaximo: estado.streak_maximo,
          freezesDisponiveis: estado.freezes_disponiveis,
          ultimoFreezeUsado: ultimoFreeze,
          conquistas: todasConquistas,
          carregando: false,
        });
      } else {
        set({
          xpTotal: 0,
          nivelAtual: 1,
          streakAtual: 0,
          streakMaximo: 0,
          freezesDisponiveis: 2, // Padrão inicial
          ultimoFreezeUsado: ultimoFreeze,
          conquistas: todasConquistas,
          carregando: false,
        });
      }
    } catch (err) {
      console.error('Falha ao inicializar gamificação na store:', err);
      set({ carregando: false });
    }
  },

  finalizarTreinoDopaminergico: async (registroSessaoId, modoExpress, series) => {
    try {
      // 1. Processa no orquestrador do motor os ganhos pós-sessão
      const resultado = await processarPosSessao('default', registroSessaoId, modoExpress, series);

      // 2. Monta a fila de celebrações na ordem correta:
      // a) Animação de XP
      // b) Novo Nível (se houver)
      // c) Conquistas desbloqueadas (sequencialmente)
      // d) Transição de Tier da estátua (se houver)
      const fila: CelebrationEvent[] = [];
      
      fila.push({ type: 'xp', xpGanho: resultado.xp_ganho });

      if (resultado.novo_nivel !== null) {
        fila.push({ type: 'nivel', nivel: resultado.novo_nivel });
      }

      resultado.conquistas_desbloqueadas.forEach(conquista => {
        fila.push({ type: 'conquista', conquista });
      });

      if (resultado.tier_transicao !== null) {
        fila.push({
          type: 'tier',
          tierAntigo: resultado.tier_transicao.tier_antigo,
          tierNovo: resultado.tier_transicao.tier_novo,
        });
      }

      // Atualiza a store com os novos valores e a fila populada
      set({
        xpTotal: get().xpTotal + resultado.xp_ganho,
        nivelAtual: resultado.novo_nivel !== null ? resultado.novo_nivel : get().nivelAtual,
        streakAtual: resultado.streak_novo,
        filaCelebracoes: fila,
        celebracaoAtiva: fila.length > 0 ? fila[0] : null,
      });

      // Recarrega conquistas atualizadas
      const conquistasAtualizadas = await obterConquistasUsuario();
      set({ conquistas: conquistasAtualizadas });

    } catch (err) {
      console.error('Erro ao finalizar treino dopaminérgico:', err);
    }
  },

  desempilharCelebracao: () => {
    const { filaCelebracoes } = get();
    if (filaCelebracoes.length <= 1) {
      // Fim das celebrações
      set({ filaCelebracoes: [], celebracaoAtiva: null });
    } else {
      const novaFila = filaCelebracoes.slice(1);
      set({
        filaCelebracoes: novaFila,
        celebracaoAtiva: novaFila[0],
      });
    }
  },

  verificarNecessidadeFreeze: async () => {
    try {
      const estado = await obterEstado();
      if (!estado) return;

      // Verifica se houve gap de treino (ex: última atividade há mais de 36 horas)
      if (!estado.ultima_atividade) return;

      const ultimaAtividade = new Date(estado.ultima_atividade);
      const agora = new Date();
      const diffMs = agora.getTime() - ultimaAtividade.getTime();
      const diffHoras = diffMs / (1000 * 60 * 60);

      // Se passou de 36h mas menos de 72h (1 dia de atraso completo) e possui freezes
      if (diffHoras > 36 && diffHoras < 72 && estado.freezes_disponiveis > 0 && estado.streak_atual > 0) {
        set({
          mostrarPromptFreeze: true,
          freezeDiasStreak: estado.streak_atual,
        });
      }
    } catch (err) {
      console.error('Erro ao verificar necessidade de freeze:', err);
    }
  },

  usarFreeze: async () => {
    try {
      const estado = await obterEstado();
      if (!estado || estado.freezes_disponiveis <= 0) return;

      const novosFreezes = estado.freezes_disponiveis - 1;
      const novoEstado: Gamificacao = {
        ...estado,
        freezes_disponiveis: novosFreezes,
        ultima_atividade: new Date().toISOString(), // reseta a última atividade para "salvar" o streak
      };

      // Grava no banco e na fila de sincronização
      await executarQuery(`
        UPDATE gamificacao SET freezes_disponiveis = ?, ultima_atividade = ? WHERE id = ?
      `, [novosFreezes, novoEstado.ultima_atividade, estado.id]);

      await enqueueChange('gamificacao', 'UPDATE', novoEstado);

      // Registra conquista de primeiro freeze
      const conquistasDesbloqueadasRows = await obterLinhas<{ conquista_id: string }>(
        "SELECT conquista_id FROM conquistas_desbloqueadas WHERE conquista_id = 'primeiro_freeze'"
      );
      if (conquistasDesbloqueadasRows.length === 0) {
        const idUnico = Date.now().toString();
        const dataIso = new Date().toISOString();
        await executarQuery(
          'INSERT INTO conquistas_desbloqueadas (id, conquista_id, desbloqueada_em) VALUES (?, ?, ?)',
          [idUnico, 'primeiro_freeze', dataIso]
        );
        await enqueueChange('conquistas_desbloqueadas', 'INSERT', {
          id: idUnico,
          conquista_id: 'primeiro_freeze',
          desbloqueada_em: dataIso
        });
      }

      await AsyncStorage.setItem('ultimo_freeze_usado', novoEstado.ultima_atividade);

      set({
        freezesDisponiveis: novosFreezes,
        ultimoFreezeUsado: novoEstado.ultima_atividade,
        mostrarPromptFreeze: false,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('[SOM] freeze_utilizado');

    } catch (err) {
      console.error('Erro ao usar freeze na store:', err);
    }
  },

  ignorarFreeze: async () => {
    try {
      const estado = await obterEstado();
      if (!estado) return;

      // Quebra o streak! Reseta para 0
      const novoEstado: Gamificacao = {
        ...estado,
        streak_atual: 0,
        ultima_atividade: new Date().toISOString(),
      };

      await executarQuery(`
        UPDATE gamificacao SET streak_atual = 0, ultima_atividade = ? WHERE id = ?
      `, [novoEstado.ultima_atividade, estado.id]);

      await enqueueChange('gamificacao', 'UPDATE', novoEstado);

      set({
        streakAtual: 0,
        mostrarPromptFreeze: false,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (err) {
      console.error('Erro ao ignorar freeze:', err);
    }
  },
}));
