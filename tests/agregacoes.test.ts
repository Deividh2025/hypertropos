import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  volumeSemanaPorGrupo,
  historicoSessoes,
  linhaTempoPadraoMovimento,
  tendenciaSemanal,
  estatisticasGerais
} from '../db/queries/agregacoes';

// Mock de async-storage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
}));

// Mock do cache local SQLite
vi.mock('../db/local-cache', () => ({
  executarQuery: vi.fn(),
  obterLinha: vi.fn(),
  obterLinhas: vi.fn(),
}));

// Mock do supabase client
const mockSupabaseQuery: any = {
  select: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  then: vi.fn(),
};

vi.mock('../db/supabase-client', () => {
  return {
    supabase: {
      from: vi.fn(() => mockSupabaseQuery),
    }
  };
});

// Mock das dependências locais de queries
vi.mock('../db/queries/perfil', () => ({
  obterPerfil: vi.fn().mockResolvedValue({ nivel: 'intermediario' }),
}));

vi.mock('../db/queries/gamificacao', () => ({
  obterEstado: vi.fn().mockResolvedValue({ streak_maximo: 10 }),
}));

describe('Queries de Agregação da Tela de Progresso', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. volumeSemanaPorGrupo — Deve agregar séries efetivas (RIR <= 3) e mapear alvo por nível', async () => {
    // Simula resposta do Supabase contendo 7 séries executadas no peito e costas
    const mockData = [
      { rir_realizado: 1, completada: true, exercicios: { grupo_muscular_primario: 'peito' } },
      { rir_realizado: 2, completada: true, exercicios: { grupo_muscular_primario: 'peito' } },
      { rir_realizado: 3, completada: true, exercicios: { grupo_muscular_primario: 'peito' } },
      { rir_realizado: 4, completada: true, exercicios: { grupo_muscular_primario: 'peito' } }, // não efetiva (RIR > 3)
      { rir_realizado: 0, completada: true, exercicios: { grupo_muscular_primario: 'costas' } },
      { rir_realizado: 2, completada: true, exercicios: { grupo_muscular_primario: 'costas' } },
    ];
    mockSupabaseQuery.then.mockImplementationOnce((callback: any) => {
      return Promise.resolve(callback({ data: mockData, error: null }));
    });

    const resultado = await volumeSemanaPorGrupo(0);

    // Esperado para o nível "intermediario" -> Alvo = 12 séries semanais
    const peito = resultado.find(r => r.grupo === 'peito');
    const costas = resultado.find(r => r.grupo === 'costas');
    const core = resultado.find(r => r.grupo === 'core');

    expect(peito).toBeDefined();
    expect(peito?.series_efetivas).toBe(3); // Apenas as RIR 1, 2 e 3
    expect(peito?.alvo).toBe(12);

    expect(costas).toBeDefined();
    expect(costas?.series_efetivas).toBe(2); // RIR 0 e 2
    expect(costas?.alvo).toBe(12);

    expect(core).toBeDefined();
    expect(core?.series_efetivas).toBe(0); // Nenhum treino realizado
    expect(core?.alvo).toBe(12);
  });

  it('2. historicoSessoes — Deve listar histórico ordenado e calcular percentuais de conclusão', async () => {
    const mockData = [
      {
        id: 'sessao_1',
        data_inicio: '2026-05-23T10:00:00Z',
        data_fim: '2026-05-23T11:00:00Z',
        duracao_seg: 3600,
        concluida: true,
        sessoes_template: {
          id: 'template_1',
          nome: 'Push Day A',
          exercicios_prescritos: [
            { series_alvo: 3 },
            { series_alvo: 3 },
            { series_alvo: 2 },
          ] // Total prescrito = 8 séries
        },
        series_executadas: [
          { id: 's1', completada: true },
          { id: 's2', completada: true },
          { id: 's3', completada: true },
          { id: 's4', completada: true },
          { id: 's5', completada: true },
          { id: 's6', completada: true },
          { id: 's7', completada: true },
          { id: 's8', completada: true },
        ] // Total concluído = 8
      },
      {
        id: 'sessao_2',
        data_inicio: '2026-05-21T09:00:00Z',
        data_fim: '2026-05-21T09:45:00Z',
        duracao_seg: 2700,
        concluida: false,
        sessoes_template: {
          id: 'template_2',
          nome: 'Pull Day B',
          exercicios_prescritos: [
            { series_alvo: 4 },
            { series_alvo: 4 },
          ] // Total prescrito = 8 séries
        },
        series_executadas: [
          { id: 's9', completada: true },
          { id: 's10', completada: true },
          { id: 's11', completada: true },
          { id: 's12', completada: true },
        ] // Total concluído = 4 (50%)
      }
    ];

    mockSupabaseQuery.then.mockImplementationOnce((callback: any) => {
      return Promise.resolve(callback({ data: mockData, error: null }));
    });

    const resultado = await historicoSessoes();

    expect(resultado).toHaveLength(2);

    expect(resultado[0].id).toBe('sessao_1');
    expect(resultado[0].nome).toBe('Push Day A');
    expect(resultado[0].duracao_segundos).toBe(3600);
    expect(resultado[0].percentual_conclusao).toBe(100);
    expect(resultado[0].concluida).toBe(true);

    expect(resultado[1].id).toBe('sessao_2');
    expect(resultado[1].nome).toBe('Pull Day B');
    expect(resultado[1].duracao_segundos).toBe(2700);
    expect(resultado[1].percentual_conclusao).toBe(50);
    expect(resultado[1].concluida).toBe(false);
  });

  it('3. linhaTempoPadraoMovimento — Deve retornar a evolução para o exercício mais avançado na semana', async () => {
    const mockData = [
      // Semana de 2026-05-11
      {
        created_at: '2026-05-11T14:00:00Z',
        exercicios: { id: 'push_wall', nome: 'Flexão na Parede', padrao_movimento: 'push_horizontal', nivel_escada: 1 },
        registros_execucao: { data_inicio: '2026-05-11T14:00:00Z', concluida: true }
      },
      // Semana de 2026-05-18 - executou flexão na parede e tradicional
      {
        created_at: '2026-05-18T14:00:00Z',
        exercicios: { id: 'push_wall', nome: 'Flexão na Parede', padrao_movimento: 'push_horizontal', nivel_escada: 1 },
        registros_execucao: { data_inicio: '2026-05-18T14:00:00Z', concluida: true }
      },
      {
        created_at: '2026-05-20T15:00:00Z',
        exercicios: { id: 'push_standard', nome: 'Flexão Tradicional', padrao_movimento: 'push_horizontal', nivel_escada: 2 },
        registros_execucao: { data_inicio: '2026-05-20T15:00:00Z', concluida: true }
      }
    ];

    mockSupabaseQuery.then.mockImplementationOnce((callback: any) => {
      return Promise.resolve(callback({ data: mockData, error: null }));
    });

    const resultado = await linhaTempoPadraoMovimento('push_horizontal');

    expect(resultado).toHaveLength(2);

    expect(resultado[0].semana).toBe('2026-05-11');
    expect(resultado[0].exercicio_mais_avancado_id).toBe('push_wall');
    expect(resultado[0].nivel_escada).toBe(1);

    expect(resultado[1].semana).toBe('2026-05-18');
    expect(resultado[1].exercicio_mais_avancado_id).toBe('push_standard');
    expect(resultado[1].nivel_escada).toBe(2);
  });

  it('4. tendenciaSemanal — Deve retornar histórico agregado das últimas 12 semanas', async () => {
    // Determinar segunda-feira atual para bater com as datas do teste
    const agora = new Date();
    const day = agora.getDay();
    const diff = agora.getDate() - day + (day === 0 ? -6 : 1);
    const segundaAtual = new Date(agora);
    segundaAtual.setDate(diff);
    segundaAtual.setHours(0, 0, 0, 0);

    // Simula 2 treinos realizados na semana atual
    const dataTreino1 = segundaAtual.toISOString();
    const dataTreino2 = new Date(segundaAtual.getTime() + 24 * 3600 * 1000).toISOString();

    const mockData = [
      {
        data_inicio: dataTreino1,
        duracao_seg: 1800,
        concluida: true,
        series_executadas: [{ id: 's1', completada: true }, { id: 's2', completada: true }]
      },
      {
        data_inicio: dataTreino2,
        duracao_seg: 2400,
        concluida: true,
        series_executadas: [{ id: 's3', completada: true }]
      }
    ];

    mockSupabaseQuery.then.mockImplementationOnce((callback: any) => {
      return Promise.resolve(callback({ data: mockData, error: null }));
    });

    const resultado = await tendenciaSemanal();

    expect(resultado).toHaveLength(12);

    const semanaAtualStr = segundaAtual.toISOString().split('T')[0];
    const semanaAtualObj = resultado.find(r => r.semana === semanaAtualStr);

    expect(semanaAtualObj).toBeDefined();
    expect(semanaAtualObj?.sessoes_completas).toBe(2);
    expect(semanaAtualObj?.total_tempo).toBe(4200); // 1800 + 2400
    expect(semanaAtualObj?.total_series).toBe(3); // 2 + 1
  });

  it('5. estatisticasGerais — Deve calcular e retornar KPIs globais a partir do banco e gamificação', async () => {
    // 1. Mock de registros_execucao (para treinos e horas totais)
    const mockTreinos = [
      { duracao_seg: 3600 },
      { duracao_seg: 3600 },
      { duracao_seg: 3600 }, // Total = 10800 segundos (3.0 horas)
    ];

    // 2. Setup mocks no supabase client em ordem consecutiva de chamadas
    mockSupabaseQuery.then
      // Primeira chamada: do().from('registros_execucao')
      .mockImplementationOnce((callback: any) => {
        return Promise.resolve(callback({ data: mockTreinos, error: null }));
      })
      // Segunda chamada: do().from('series_executadas') para contagem de séries
      .mockImplementationOnce((callback: any) => {
        return Promise.resolve(callback({ count: 24, error: null }));
      })
      // Terceira chamada: do().from('conquistas_desbloqueadas') para contagem de conquistas
      .mockImplementationOnce((callback: any) => {
        return Promise.resolve(callback({ count: 5, error: null }));
      });

    const resultado = await estatisticasGerais();

    expect(resultado.total_treinos).toBe(3);
    expect(resultado.total_tempo_horas).toBe(3.0);
    expect(resultado.total_series).toBe(24);
    expect(resultado.streak_maximo).toBe(10); // Resgatado do mock do obterEstado local (10)
    expect(resultado.conquistas_desbloqueadas).toBe(5);
  });
});
