import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSessaoStore } from '../stores/sessaoStore';
import { SessaoTemplate, ExercicioPrescrito } from '../types/treino';
import { Exercicio, GrupoMuscular, PadraoMovimento, NivelMinimo } from '../types/exercicio';

// Mock de expo-haptics para rodar no ambiente de teste puro do Node
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
  }
}));

// Mock de db e async storage helpers para isolar o teste unitário
vi.mock('../db/queries/gamificacao', () => ({
  adicionarXP: vi.fn(),
  incrementarStreak: vi.fn(),
}));

vi.mock('../db/sync-engine', () => ({
  enqueueChange: vi.fn(),
}));

vi.mock('../db/local-cache', () => ({
  executarQuery: vi.fn(),
  obterLinha: vi.fn(),
}));

const MOCK_EXERCICIO: Exercicio = {
  id: 'push_up',
  nome: 'Flexão de Braço',
  grupo_muscular_primario: GrupoMuscular.PEITO,
  padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
  nivel_minimo: NivelMinimo.INICIANTE,
  nivel_escada: 1,
  descricao_execucao: 'Flexão convencional',
  cadencia_excentrica: 3,
  cadencia_isometrica: 0,
  cadencia_concentrica: 1
};

const MOCK_SESSAO: SessaoTemplate = {
  id: 'sessao_test',
  nome: 'Treino A',
  ordem_na_semana: 1,
  exercicios_prescritos: [
    {
      id: 'ep_1',
      exercicio_id: 'push_up',
      ordem: 1,
      series_alvo: 2,
      reps_alvo_min: 8,
      reps_alvo_max: 12,
      rir_alvo: 2,
      descanso_segundos: 60
    }
  ]
};

describe('SessaoStore — Motor Série a Série', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSessaoStore.getState().cancelarSessao();
  });

  it('1. Deve inicializar a sessão corretamente e carregar dados', () => {
    const store = useSessaoStore.getState();
    store.iniciarSessao(MOCK_SESSAO, [MOCK_EXERCICIO], false);

    const estado = useSessaoStore.getState();
    expect(estado.statusSessao).toBe('executando');
    expect(estado.exercicioAtualIndex).toBe(0);
    expect(estado.serieAtualIndex).toBe(0);
    expect(estado.exerciciosPrescritos).toHaveLength(1);
    expect(estado.exerciciosCatalogMap['push_up']).toBeDefined();
    expect(estado.tempoTotalSegundos).toBe(0);
  });

  it('2. Deve concluir série, registrar histórico e iniciar contagem de descanso', () => {
    const store = useSessaoStore.getState();
    store.iniciarSessao(MOCK_SESSAO, [MOCK_EXERCICIO], false);
    
    // Conclui a primeira série das duas prescritas
    store.concluirSerie(10, 2);

    const estado = useSessaoStore.getState();
    expect(estado.historicoSeries).toHaveLength(1);
    expect(estado.historicoSeries[0]).toEqual({
      exercicioId: 'push_up',
      ordemExercicio: 1,
      numeroSerie: 1,
      reps: 10,
      rir: 2
    });
    expect(estado.statusSessao).toBe('descansando');
    expect(estado.tempoDescansoRestante).toBe(60);
  });

  it('3. Deve pular o descanso e retornar ao estado de execução avançando a série', () => {
    const store = useSessaoStore.getState();
    store.iniciarSessao(MOCK_SESSAO, [MOCK_EXERCICIO], false);
    
    store.concluirSerie(10, 2); // Inicia descanso (status: descansando)
    store.pularDescanso(); // Pula descanso

    const estado = useSessaoStore.getState();
    expect(estado.statusSessao).toBe('executando');
    expect(estado.serieAtualIndex).toBe(1); // Avançou para a série 2 (índice 1)
  });

  it('4. Deve finalizar o treino de forma bem-sucedida ao concluir a última série', () => {
    const store = useSessaoStore.getState();
    store.iniciarSessao(MOCK_SESSAO, [MOCK_EXERCICIO], false);
    
    store.concluirSerie(10, 2); // Conclui série 1 → descanso
    store.pularDescanso(); // Volta à execução
    
    // Conclui a série 2 das duas prescritas (Último exercício e última série)
    store.concluirSerie(12, 1);

    const estado = useSessaoStore.getState();
    expect(estado.statusSessao).toBe('finalizada');
    expect(estado.historicoSeries).toHaveLength(2);
  });
});
