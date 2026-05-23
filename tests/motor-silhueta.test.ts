import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  calcularDefinicaoGrupo, 
  determinarTier, 
  detectarTransicaoTier, 
  calcularEstadoSilhueta,
  SerieComData 
} from '../lib/motor-silhueta';
import { RegistroSessao } from '../types/treino';
import { Perfil, Genero, Nivel, NivelAtividade, HorarioTreino } from '../types/perfil';
import { GrupoMuscular, PadraoMovimento, NivelMinimo } from '../types/exercicio';

// Mock de async-storage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
}));

// Mock do catálogo de exercícios do db
vi.mock('../db/queries/exercicios', () => ({
  listarExercicios: vi.fn().mockResolvedValue([
    {
      id: 'supino',
      nome: 'Supino Reto',
      grupo_muscular_primario: 'peito',
      grupos_secundarios: ['triceps', 'ombros'],
      padrao_movimento: 'push_horizontal',
      nivel_minimo: 'iniciante',
      nivel_escada: 1,
      descricao_execucao: 'Supino convencional'
    },
    {
      id: 'barra_fixa',
      nome: 'Barra Fixa',
      grupo_muscular_primario: 'costas',
      grupos_secundarios: ['biceps'],
      padrao_movimento: 'pull_vertical',
      nivel_minimo: 'iniciante',
      nivel_escada: 1,
      descricao_execucao: 'Barra convencional'
    },
    {
      id: 'rosca_direta',
      nome: 'Rosca Direta',
      grupo_muscular_primario: 'biceps',
      padrao_movimento: 'core', // Simplificado
      nivel_minimo: 'iniciante',
      nivel_escada: 1,
      descricao_execucao: 'Rosca convencional'
    },
    {
      id: 'agachamento',
      nome: 'Agachamento Livre',
      grupo_muscular_primario: 'quadriceps',
      grupos_secundarios: ['gluteo'],
      padrao_movimento: 'joelho_dominante',
      nivel_minimo: 'iniciante',
      nivel_escada: 1,
      descricao_execucao: 'Agachamento'
    }
  ])
}));

const MOCK_PERFIL: Perfil = {
  idade: 25,
  genero_biologico: Genero.MASCULINO,
  peso_corporal_kg: 80,
  altura_cm: 180,
  nivel: Nivel.INTERMEDIARIO,
  nivel_atividade_extra_treino: NivelAtividade.MODERADO,
  dias_disponiveis_semana: 4,
  duracao_alvo_sessao_min: 45,
  horario_preferido_treino: HorarioTreino.TARDE,
  split_atual: 'full_body'
};

describe('Motor 1 — Silhueta Corporal e Tiers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Deve calcular definição muscular como 0 se não houver séries', () => {
    const definicao = calcularDefinicaoGrupo([], 0);
    expect(definicao).toBe(0);
  });

  it('2. Deve calcular definição 100 para 20+ séries de alta qualidade no mesmo dia', () => {
    const series: SerieComData[] = Array.from({ length: 20 }, (_, i) => ({
      id: `s_${i}`,
      registro_exercicio_id: 'reg_1',
      ordem: i + 1,
      repeticoes: 10,
      rir: 2,
      rir_alvo: 2, // qualidade perfeita (+0.5 bônus)
      idade_dias: 0 // hoje
    }));

    // 20 séries * (1.0 + 0.5) * e^(0) = 30 pontos de contribuição
    // 30 / 30 * 100 = 100% definição
    const definicao = calcularDefinicaoGrupo(series, 0);
    expect(definicao).toBe(100);
  });

  it('3. Deve aplicar decaimento exponencial temporal de forma correta', () => {
    // Série realizada há 10 dias (janela <= 14 dias, decay = e^(-d/30))
    const serieRecente: SerieComData = {
      id: 's_recent',
      registro_exercicio_id: 'reg_1',
      ordem: 1,
      repeticoes: 10,
      rir: 2,
      rir_alvo: 2,
      idade_dias: 10
    };

    // Série realizada há 20 dias (janela entre 14 e 28 dias, decay = e^(-d/14))
    const serieAntiga: SerieComData = {
      id: 's_old',
      registro_exercicio_id: 'reg_1',
      ordem: 2,
      repeticoes: 10,
      rir: 2,
      rir_alvo: 2,
      idade_dias: 20
    };

    // Série realizada há 30 dias (fora da janela de 28 dias, decay = 0)
    const serieExpirada: SerieComData = {
      id: 's_exp',
      registro_exercicio_id: 'reg_1',
      ordem: 3,
      repeticoes: 10,
      rir: 2,
      rir_alvo: 2,
      idade_dias: 30
    };

    // Contribuições individuais:
    // recente: 1.5 * e^(-10/30) = 1.5 * 0.7165 = 1.0748
    // antiga: 1.5 * e^(-20/14) = 1.5 * 0.2397 = 0.3595
    // expirada: 0
    // Total = 1.4343
    // Mapeamento: (1.4343 / 30) * 100 = 4.78% -> Math.round -> 5
    const definicao = calcularDefinicaoGrupo([serieRecente, serieAntiga, serieExpirada], 0);
    expect(definicao).toBe(5);
  });

  it('4. Deve determinar tiers globais corretamente e respeitar regras de transição', () => {
    // bronze: < 28 dias ou < 12 treinos
    expect(determinarTier(10, 5)).toBe('bronze');
    expect(determinarTier(30, 10)).toBe('bronze');

    // pedra: >= 28 dias e >= 12 treinos
    expect(determinarTier(28, 12)).toBe('pedra');
    expect(determinarTier(50, 15)).toBe('pedra');

    // marmore: >= 84 dias e >= 36 treinos
    expect(determinarTier(84, 36)).toBe('marmore');

    // dourada: >= 182 dias e >= 78 treinos
    expect(determinarTier(185, 80)).toBe('dourada');
  });

  it('5. Deve detectar transição de tier ascendente e ignorar regressão', () => {
    // bronze -> pedra (transição de pedra)
    expect(detectarTransicaoTier('bronze', 'pedra')).toBe('pedra');

    // pedra -> marmore (transição de marmore)
    expect(detectarTransicaoTier('pedra', 'marmore')).toBe('marmore');

    // dourada -> dourada (nenhuma transição)
    expect(detectarTransicaoTier('dourada', 'dourada')).toBeNull();

    // marmore -> pedra (tentativa de regressão, deve ser ignorada / retornar null)
    expect(detectarTransicaoTier('marmore', 'pedra')).toBeNull();
  });

  it('6. Deve calcular o EstadoSilhueta completo integrando séries e grupos secundários', async () => {
    // Simulando histórico de 28 dias com treinos de peito, costas e perna
    const mockHistorico: RegistroSessao[] = [
      {
        id: 'sessao_1',
        sessao_template_id: 'temp_1',
        data_inicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        concluida: true,
        exercicios_realizados: [
          {
            id: 're_1',
            registro_sessao_id: 'sessao_1',
            exercicio_id: 'supino', // Peito primário, Tríceps/Ombro secundário
            ordem: 1,
            series: [
              { id: 'se_1', registro_exercicio_id: 're_1', ordem: 1, repeticoes: 10, rir: 2 },
              { id: 'se_2', registro_exercicio_id: 're_1', ordem: 2, repeticoes: 10, rir: 2 }
            ]
          }
        ]
      }
    ];

    const estado = await calcularEstadoSilhueta(mockHistorico, MOCK_PERFIL, 35);

    expect(estado).toBeDefined();
    // Como houve apenas 2 séries de supino com rir=2 e rir_alvo=2 (1.5 * e^(-2/30) = 1.5 * 0.935 = 1.4 pontos cada, total ~2.8 pontos)
    // Divisor 30: (2.8 / 30) * 100 = ~9% para peito
    expect(estado.peito).toBeGreaterThan(0);
    expect(estado.peito).toBeLessThan(100);
    
    // Tríceps e Ombros foram estimulados como secundários, logo acumulados no grupo bracos e ombros
    expect(estado.bracos).toBeGreaterThan(0);
    expect(estado.ombros).toBeGreaterThan(0);

    // Sem treinos de costas e quadríceps nesse histórico, deve ser 0
    expect(estado.costas).toBe(0);
    expect(estado.quadriceps).toBe(0);

    // Validar se tier calculado está correto (35 dias consistentes, 1 treino completo -> ainda bronze pois treinos < 12)
    expect(estado.tier_atual).toBe('bronze');
  });
});
