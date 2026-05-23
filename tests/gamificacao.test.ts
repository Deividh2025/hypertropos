import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processarPosSessao } from '../lib/motor-gamificacao';

// Mock de async-storage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
}));

// Mock do cache local SQLite e sincronização
vi.mock('../db/local-cache', () => ({
  executarQuery: vi.fn().mockResolvedValue({ insertId: 1, rowsAffected: 1 }),
  obterLinha: vi.fn(),
  obterLinhas: vi.fn().mockResolvedValue([]),
}));

vi.mock('../db/sync-engine', () => ({
  enqueueChange: vi.fn().mockResolvedValue(true),
}));

// Mock das queries do banco
vi.mock('../db/queries/gamificacao', () => ({
  obterEstado: vi.fn().mockResolvedValue({
    id: 'default',
    xp_total: 150,
    nivel_atual: 2,
    streak_atual: 5,
    streak_maximo: 5,
    freezes_disponiveis: 1,
    ultima_atividade: new Date().toISOString()
  }),
}));

vi.mock('../db/queries/perfil', () => ({
  obterPerfil: vi.fn().mockResolvedValue({
    id: 'default',
    split_atual: 'full_body',
    restricoes_articulares: '[]'
  }),
}));

vi.mock('../db/queries/exercicios', () => ({
  listarExercicios: vi.fn().mockResolvedValue([])
}));

describe('Motor 2 — Orquestrador de Gamificação Dopaminérgica', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Deve processar treino completo com cálculo de XP base e bônus de RIR', async () => {
    const series = [
      { exercicio_id: 'push_standard', reps_executadas: 10, rir_realizado: 2, rir_alvo: 2 }, // bônus (+5 XP)
      { exercicio_id: 'push_standard', reps_executadas: 10, rir_realizado: 3, rir_alvo: 2 }, // sem bônus
    ];

    const resultado = await processarPosSessao('default', 'reg_123', false, series);

    // Contas de XP:
    // - Sessão completa: +50 XP
    // - 2 séries completas: +20 XP
    // - 1 bônus RIR atingido: +5 XP
    // - Streak de 6 dias: +50 XP bônus (streakNovo * 10 = 60, limitado a 50)
    // Total XP ganho = 50 + 20 + 5 + 50 = 125 XP
    expect(resultado.xp_ganho).toBe(125);
    expect(resultado.streak_novo).toBe(6);
  });

  it('2. Deve processar treino express com menos XP base e streak mantido', async () => {
    const series = [
      { exercicio_id: 'push_standard', reps_executadas: 8, rir_realizado: 2, rir_alvo: 2 }, // bônus (+5 XP)
    ];

    const resultado = await processarPosSessao('default', 'reg_124', true, series);

    // Contas de XP (Express):
    // - Sessão Express: +20 XP
    // - 1 série completa: +10 XP
    // - 1 bônus RIR atingido: +5 XP
    // - Streak de 6 dias: +50 XP bônus (streakNovo * 10 = 60, limitado a 50)
    // Total XP ganho = 20 + 10 + 5 + 50 = 85 XP
    expect(resultado.xp_ganho).toBe(85);
    expect(resultado.streak_novo).toBe(6);
  });

  it('3. Deve detectar novo nível com base na curva logarítmica', async () => {
    const { obterEstado } = await import('../db/queries/gamificacao');
    
    // Nível atual: 1, XP atual: 90
    (obterEstado as any).mockResolvedValueOnce({
      id: 'default',
      xp_total: 90,
      nivel_atual: 1,
      streak_atual: 1,
      streak_maximo: 1,
      freezes_disponiveis: 2,
      ultima_atividade: new Date().toISOString()
    });

    const series = [
      { exercicio_id: 'push_standard', reps_executadas: 10, rir_realizado: 2, rir_alvo: 2 },
    ];

    const resultado = await processarPosSessao('default', 'reg_125', false, series);

    // XP Ganho = 50 (Completa) + 10 (1 série) + 5 (RIR bônus) + 20 (streak de 2) = 85 XP
    // Novo XP = 90 + 85 = 175 XP
    // Nível para 175 XP -> 50 * lvl * (lvl+1) <= 175 -> lvl=2
    // Subiu de nível 1 -> 2!
    expect(resultado.novo_nivel).toBe(2);
  });

  it('4. Deve desbloquear Primeira Suada no primeiro treino científico', async () => {
    const { obterLinhas } = await import('../db/local-cache');
    // Nenhuma conquista desbloqueada
    (obterLinhas as any).mockResolvedValueOnce([]); // para select conquistas
    
    const series = [
      { exercicio_id: 'push_standard', reps_executadas: 10, rir_realizado: 2, rir_alvo: 2 },
    ];

    const resultado = await processarPosSessao('default', 'reg_126', false, series);

    expect(resultado.conquistas_desbloqueadas.some(c => c.id === 'primeiro_treino')).toBe(true);
  });
});
