import { create } from 'zustand';
import { ProgramaAtivo, SessaoTemplate, Perfil, Exercicio } from '../types';
import { obterProgramaAtivo, salvarPrograma, obterSessaoDoDia } from '../db/queries/programa';
import { obterPerfil } from '../db/queries/perfil';
import { listarExercicios } from '../db/queries/exercicios';
import { obterEstado } from '../db/queries/gamificacao';

interface ProgramaState {
  programaAtual: ProgramaAtivo | null;
  sessaoDoDia: SessaoTemplate | null;
  modoExpress: boolean;
  carregando: boolean;
  erro: string | null;
  
  // Dados de gamificação acoplados para conveniência na Home
  streak: number;
  xpTotal: number;
  nivelAtual: number;
  freezes: number;

  carregarProgramaInicial: () => Promise<void>;
  regenerarPrograma: () => Promise<void>;
  setModoExpress: (modoExpress: boolean) => void;
}

// Fallback Perfil in case onboarding was not completed in local development db
const FALLBACK_PERFIL: Perfil = {
  id: 'default',
  idade: 30,
  genero_biologico: 'masculino',
  peso_corporal_kg: 75,
  altura_cm: 175,
  nivel: 'iniciante' as any,
  nivel_atividade_extra_treino: 'moderado' as any,
  dias_disponiveis_semana: 3,
  duracao_alvo_sessao_min: 45,
  horario_preferido_treino: '18:00',
  equipamento_disponivel: ['nenhum'] as any[],
  split_atual: 'full_body',
  objetivo: 'hipertrofia',
  restricoes_articulares: [],
  historico_clinico: [],
  meta_proteina_g_kg: 1.6,
  fase_nutricional: 'manutencao',
  usa_creatina: false,
  usa_cafeina: false,
  lembretes_ativos: [],
  data_criacao: new Date().toISOString(),
  ultima_atualizacao: new Date().toISOString(),
};

export const useProgramaStore = create<ProgramaState>((set, get) => ({
  programaAtual: null,
  sessaoDoDia: null,
  modoExpress: false,
  carregando: true,
  erro: null,
  
  streak: 0,
  xpTotal: 0,
  nivelAtual: 1,
  freezes: 0,

  setModoExpress: (modoExpress: boolean) => set({ modoExpress }),

  carregarProgramaInicial: async () => {
    set({ carregando: true, erro: null });
    try {
      // 1. Carregar gamificação para Home
      const gamificacao = await obterEstado();
      if (gamificacao) {
        set({
          streak: gamificacao.streak_atual,
          xpTotal: gamificacao.xp_total,
          nivelAtual: gamificacao.nivel_atual,
          freezes: gamificacao.freezes_disponiveis,
        });
      } else {
        // Estado inicial de gamificação padrão
        set({
          streak: 0,
          xpTotal: 0,
          nivelAtual: 1,
          freezes: 0,
        });
      }

      // 2. Tentar obter programa ativo do cache/banco
      let programa = await obterProgramaAtivo();

      if (!programa) {
        console.log('Nenhum programa ativo encontrado. Gerando novo programa semanal científico...');
        
        // Obter Perfil
        let perfil = await obterPerfil();
        if (!perfil) {
          console.warn('Perfil de usuário não encontrado! Usando perfil de fallback.');
          perfil = FALLBACK_PERFIL;
        }

        // Listar Exercícios
        const exercicios = await listarExercicios();
        if (!exercicios || exercicios.length === 0) {
          throw new Error('Nenhum exercício cadastrado no banco de dados local. Falha ao gerar programa.');
        }

        // Importar dinamicamente para evitar referências circulares em runtime
        const { gerarProgramaSemanal } = require('../lib/algoritmo-rotina');
        const novoPrograma = gerarProgramaSemanal(perfil, exercicios);

        // Salvar programa gerado
        await salvarPrograma(novoPrograma, perfil.id || 'default');
        programa = novoPrograma;
      }

      // 3. Identificar a sessão de treino do dia
      const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      const diaDeHoje = diasSemana[new Date().getDay()];
      
      const sessao = await obterSessaoDoDia(diaDeHoje);

      set({
        programaAtual: programa,
        sessaoDoDia: sessao,
        carregando: false,
      });
    } catch (error: any) {
      console.error('Erro ao carregar programa inicial:', error);
      set({
        erro: error?.message || 'Erro ao inicializar programa de rotina.',
        carregando: false,
      });
    }
  },

  regenerarPrograma: async () => {
    set({ carregando: true, erro: null });
    try {
      let perfil = await obterPerfil();
      if (!perfil) {
        perfil = FALLBACK_PERFIL;
      }

      const exercicios = await listarExercicios();
      if (!exercicios || exercicios.length === 0) {
        throw new Error('Sem exercícios cadastrados no banco para regenerar.');
      }

      const { gerarProgramaSemanal } = require('../lib/algoritmo-rotina');
      const novoPrograma = gerarProgramaSemanal(perfil, exercicios);

      await salvarPrograma(novoPrograma, perfil.id || 'default');

      const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      const diaDeHoje = diasSemana[new Date().getDay()];
      const sessao = await obterSessaoDoDia(diaDeHoje);

      set({
        programaAtual: novoPrograma,
        sessaoDoDia: sessao,
        modoExpress: false,
        carregando: false,
      });
    } catch (error: any) {
      console.error('Erro ao regenerar programa:', error);
      set({
        erro: error?.message || 'Erro ao regenerar programa de rotina.',
        carregando: false,
      });
    }
  },
}));
