import { create } from 'zustand';
import { SessaoTemplate, ExercicioPrescrito, RegistroSessao, SerieExecutada } from '../types/treino';
import { Exercicio } from '../types/exercicio';
import { gerarSessaoExpress } from '../lib/sessao-express';
import { adicionarXP, incrementarStreak } from '../db/queries/gamificacao';
import { enqueueChange } from '../db/sync-engine';
import { executarQuery, obterLinha } from '../db/local-cache';
import * as Haptics from 'expo-haptics';
import { motorAudio } from '../lib/motor-audio';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface ExecutedSetRecord {
  exercicioId: string;
  ordemExercicio: number;
  numeroSerie: number;
  reps: number;
  rir: number;
}

interface SessaoState {
  sessaoTemplate: SessaoTemplate | null;
  exerciciosPrescritos: ExercicioPrescrito[];
  exerciciosCatalogMap: Record<string, Exercicio>;
  exercicioAtualIndex: number;
  serieAtualIndex: number;
  statusSessao: 'idle' | 'executando' | 'descansando' | 'transicao_exercicio' | 'finalizada';
  modoExpress: boolean;
  tempoDescansoRestante: number;
  tempoDescansoTotal: number;
  tempoTotalSegundos: number;
  historicoSeries: ExecutedSetRecord[];
  isPausado: boolean;
  
  // Ações
  iniciarSessao: (sessaoTemplate: SessaoTemplate, catalog: Exercicio[], modoExpress: boolean) => void;
  concluirSerie: (reps: number, rir: number) => void;
  pularDescanso: () => void;
  finalizarTransicao: () => void;
  pausarSessao: () => void;
  retomarSessao: () => void;
  cancelarSessao: () => void;
  tickTimer: () => void;
  salvarSessaoBanco: () => Promise<void>;
}

export const useSessaoStore = create<SessaoState>((set, get) => ({
  sessaoTemplate: null,
  exerciciosPrescritos: [],
  exerciciosCatalogMap: {},
  exercicioAtualIndex: 0,
  serieAtualIndex: 0,
  statusSessao: 'idle',
  modoExpress: false,
  tempoDescansoRestante: 0,
  tempoDescansoTotal: 0,
  tempoTotalSegundos: 0,
  historicoSeries: [],
  isPausado: false,

  iniciarSessao: (sessaoTemplate, catalog, modoExpress) => {
    const catalogMap: Record<string, Exercicio> = {};
    catalog.forEach(ex => {
      catalogMap[ex.id] = ex;
    });

    const sessaoProcessada = modoExpress ? gerarSessaoExpress(sessaoTemplate) : sessaoTemplate;
    const exercicios = sessaoProcessada.exercicios_prescritos || sessaoProcessada.exercicios || [];

    set({
      sessaoTemplate,
      exerciciosPrescritos: exercicios,
      exerciciosCatalogMap: catalogMap,
      exercicioAtualIndex: 0,
      serieAtualIndex: 0,
      statusSessao: 'executando',
      modoExpress,
      tempoDescansoRestante: 0,
      tempoDescansoTotal: 0,
      tempoTotalSegundos: 0,
      historicoSeries: [],
      isPausado: false,
    });
  },

  concluirSerie: (reps, rir) => {
    const { 
      exerciciosPrescritos, 
      exercicioAtualIndex, 
      serieAtualIndex, 
      historicoSeries 
    } = get();

    if (exerciciosPrescritos.length === 0) return;

    const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
    const currentExercicioId = currentPrescricao.exercicio_id;

    // Dispara haptic padrão de conclusão de série (light + heavy após 200ms)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 200);

    // Se atingiu RIR alvo ou falha (RIR 0), adiciona Haptic extra de sucesso
    if (rir === currentPrescricao.rir_alvo || rir === 0) {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 450);
    }

    // Registra no histórico da sessão ativa
    const novaSerie: ExecutedSetRecord = {
      exercicioId: currentExercicioId,
      ordemExercicio: exercicioAtualIndex + 1,
      numeroSerie: serieAtualIndex + 1,
      reps,
      rir,
    };

    const novoHistorico = [...historicoSeries, novaSerie];
    set({ historicoSeries: novoHistorico });

    // Verifica se há mais séries para realizar no exercício corrente
    if (serieAtualIndex + 1 < currentPrescricao.series_alvo) {
      // Inicia contagem de descanso
      set({
        statusSessao: 'descansando',
        tempoDescansoRestante: currentPrescricao.descanso_segundos || 90,
        tempoDescansoTotal: currentPrescricao.descanso_segundos || 90,
      });
    } else {
      // Finalizou o exercício inteiro!
      // Verifica se há próximos exercícios
      if (exercicioAtualIndex + 1 < exerciciosPrescritos.length) {
        // Transiciona para próximo exercício
        set({
          statusSessao: 'transicao_exercicio',
          tempoDescansoRestante: 0,
        });
        motorAudio.tocarSom('conclusao-exercicio');
      } else {
        // Finalizou o treino inteiro!
        set({
          statusSessao: 'finalizada'
        });
        motorAudio.tocarSom('conclusao-sessao');
        // Dispara o haptic de conclusão da sessão inteira
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Persiste tudo no banco offline-first
        get().salvarSessaoBanco();
      }
    }
  },

  pularDescanso: () => {
    const { statusSessao } = get();
    if (statusSessao === 'descansando') {
      set({
        statusSessao: 'executando',
        serieAtualIndex: get().serieAtualIndex + 1,
        tempoDescansoRestante: 0
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  finalizarTransicao: () => {
    const { statusSessao, exercicioAtualIndex } = get();
    if (statusSessao === 'transicao_exercicio') {
      set({
        statusSessao: 'executando',
        exercicioAtualIndex: exercicioAtualIndex + 1,
        serieAtualIndex: 0
      });
    }
  },

  pausarSessao: () => {
    set({ isPausado: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  retomarSessao: () => {
    set({ isPausado: false });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  cancelarSessao: () => {
    motorAudio.tocarSom('cancelamento');
    set({
      sessaoTemplate: null,
      exerciciosPrescritos: [],
      statusSessao: 'idle',
      tempoTotalSegundos: 0,
      historicoSeries: [],
      isPausado: false
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  tickTimer: () => {
    const { statusSessao, isPausado, tempoDescansoRestante } = get();
    if (isPausado || statusSessao === 'idle' || statusSessao === 'finalizada') return;

    // Incrementa tempo total do treino
    set((state) => ({ tempoTotalSegundos: state.tempoTotalSegundos + 1 }));

    // Decrementa o descanso se estiver descansando
    if (statusSessao === 'descansando') {
      const proximoTempo = tempoDescansoRestante - 1;
      
      if (proximoTempo <= 0) {
        // Fim do descanso! Avança automaticamente para próxima série
        set({
          statusSessao: 'executando',
          serieAtualIndex: get().serieAtualIndex + 1,
          tempoDescansoRestante: 0,
        });
        
        // Feedbacks multissensoriais
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        motorAudio.tocarSom('fim-descanso');
        console.log('play sound: ding - descanso concluído');
      } else {
        set({ tempoDescansoRestante: proximoTempo });
        
        // Vibração curta preventiva com 10 segundos restantes
        if (proximoTempo === 10) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    }
  },

  salvarSessaoBanco: async () => {
    const { 
      sessaoTemplate, 
      modoExpress, 
      tempoTotalSegundos, 
      historicoSeries,
      exerciciosCatalogMap 
    } = get();

    if (!sessaoTemplate) return;

    try {
      const registroSessaoId = generateUUID();
      const perfilId = 'default'; // Padrão no Hypertropos local
      
      // 1. Calcular o XP com base no Modo Express / Normal
      // Normal = 100 XP, Express = 40 XP
      const xpGanho = modoExpress ? 40 : 100;

      // 2. Montar objeto registros_execucao
      const dataInicio = new Date(Date.now() - tempoTotalSegundos * 1000).toISOString();
      const dataFim = new Date().toISOString();

      const registroExecucao = {
        id: registroSessaoId,
        sessao_template_id: sessaoTemplate.id,
        perfil_id: perfilId,
        data_inicio: dataInicio,
        data_fim: dataFim,
        duracao_seg: tempoTotalSegundos,
        xp_ganho: xpGanho,
        concluida: true,
        notas_sessao: modoExpress ? 'Sessão Express condensada.' : 'Sessão completa concluída.',
      };

      // Adiciona na fila de sync offline-first
      await enqueueChange('registros_execucao', 'INSERT', registroExecucao);

      // 3. Montar e salvar cada série executada
      const querySeriesPromises = historicoSeries.map(async (setRec, idx) => {
        const serieExecutada = {
          id: generateUUID(),
          registro_id: registroSessaoId,
          exercicio_id: setRec.exercicioId,
          ordem_exercicio: setRec.ordemExercicio,
          numero_serie: setRec.numeroSerie,
          reps_executadas: setRec.reps,
          peso_adicional_kg: 0,
          rir_realizado: setRec.rir,
          completada: true,
        };

        // Adiciona na fila de sync offline-first
        await enqueueChange('series_executadas', 'INSERT', serieExecutada);
      });

      await Promise.all(querySeriesPromises);

      // 4. Atualizar Gamificação (XP e Streak)
      await adicionarXP(xpGanho);
      await incrementarStreak();

      // 5. Atualizar definição muscular na silhueta
      // Mapear grupos musculares e acumular pontos
      const gruposAfetados = new Set<string>();
      historicoSeries.forEach((setRec) => {
        const exDetails = exerciciosCatalogMap[setRec.exercicioId];
        if (exDetails) {
          gruposAfetados.add(exDetails.grupo_muscular_primario);
          if (exDetails.grupos_secundarios) {
            exDetails.grupos_secundarios.forEach((g) => gruposAfetados.add(g));
          }
        }
      });

      // Puxa o estado atual da silhueta local
      let estadoSilhueta = await obterLinha<any>('SELECT * FROM estado_silhueta WHERE id = ?', [perfilId]);
      if (!estadoSilhueta) {
        estadoSilhueta = {
          id: perfilId,
          peito: 0, costas: 0, ombros: 0, bracos: 0, quadriceps: 0, posterior: 0, gluteo: 0, panturrilha: 0, core: 0,
          tier_atual: 'bronze',
          ultima_atualizacao: new Date().toISOString()
        };
      }

      // Soma o progresso da definição (+5 para completo, +2 para express)
      const acrescimo = modoExpress ? 2 : 5;
      
      const mapper = (g: string): string | null => {
        switch (g) {
          case 'peito': return 'peito';
          case 'costas': return 'costas';
          case 'ombros': return 'ombros';
          case 'triceps':
          case 'biceps':
          case 'bracos': return 'bracos';
          case 'quadriceps': return 'quadriceps';
          case 'posterior': return 'posterior';
          case 'gluteo': return 'gluteo';
          case 'panturrilha': return 'panturrilha';
          case 'core': return 'core';
          default: return null;
        }
      };

      gruposAfetados.forEach((g) => {
        const key = mapper(g);
        if (key && key in estadoSilhueta) {
          estadoSilhueta[key] = Math.min(100, (estadoSilhueta[key] || 0) + acrescimo);
        }
      });

      estadoSilhueta.ultima_atualizacao = new Date().toISOString();

      // Salva no banco de cache SQLite local
      await executarQuery(`
        INSERT OR REPLACE INTO estado_silhueta (
          id, peito, costas, ombros, bracos, quadriceps, posterior, gluteo, panturrilha, core, tier_atual, ultima_atualizacao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        perfilId,
        estadoSilhueta.peito, estadoSilhueta.costas, estadoSilhueta.ombros, estadoSilhueta.bracos,
        estadoSilhueta.quadriceps, estadoSilhueta.posterior, estadoSilhueta.gluteo, estadoSilhueta.panturrilha,
        estadoSilhueta.core, estadoSilhueta.tier_atual, estadoSilhueta.ultima_atualizacao
      ]);

      // Envia ao sync-engine para persistência na nuvem
      await enqueueChange('estado_silhueta', 'UPDATE', estadoSilhueta);

      console.log('Treino e gamificação salvos com sucesso.');
    } catch (err) {
      console.error('Falha ao gravar sessão e gamificação no banco:', err);
    }
  }
}));
