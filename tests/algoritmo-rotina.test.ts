import { describe, it, expect } from 'vitest';
import { gerarProgramaSemanal } from '../lib/algoritmo-rotina';
import { Perfil, Nivel, FaseNutricional, Genero, NivelAtividade, HorarioTreino } from '../types/perfil';
import { Exercicio, GrupoMuscular, PadraoMovimento, NivelMinimo, Equipamento, Articulacao, NivelEstresse } from '../types/exercicio';

// Catálogo de Exercícios Mock baseado exatamente nos seeds reais do Supabase do Hypertropos
const CATALOGO_MOCK: Exercicio[] = [
  // Padrão: Push Horizontal
  {
    id: 'push_wall',
    nome: 'Flexão na parede',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.PAREDE],
    descricao_execucao: 'Flexão em parede',
  },
  {
    id: 'push_inclined_table',
    nome: 'Flexão inclinada em mesa',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 2,
    equipamento_necessario: [Equipamento.MESA],
    descricao_execucao: 'Flexão inclinada',
  },
  {
    id: 'push_knees',
    nome: 'Flexão de joelhos',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 2,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Flexão ajoelhado',
  },
  {
    id: 'push_standard',
    nome: 'Flexão padrão',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INTERMEDIARIO,
    nivel_escada: 3,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Flexão no solo',
  },
  {
    id: 'push_declined_feet_elevated',
    nome: 'Flexão declinada pés elevados',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INTERMEDIARIO,
    nivel_escada: 4,
    equipamento_necessario: [Equipamento.CADEIRA],
    descricao_execucao: 'Flexão com pés elevados',
  },

  // Padrão: Push Vertical
  {
    id: 'pike_inclined',
    nome: 'Pike push-up inclinado',
    grupo_muscular_primario: GrupoMuscular.OMBROS,
    padrao_movimento: PadraoMovimento.PUSH_VERTICAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 2,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Pike inclinado',
  },
  {
    id: 'pike_standard',
    nome: 'Pike push-up',
    grupo_muscular_primario: GrupoMuscular.OMBROS,
    padrao_movimento: PadraoMovimento.PUSH_VERTICAL,
    nivel_minimo: NivelMinimo.INTERMEDIARIO,
    nivel_escada: 3,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Pike no chão',
  },

  // Padrão: Pull Horizontal
  {
    id: 'pull_floor_sliding',
    nome: 'Sliding floor pulldown',
    grupo_muscular_primario: GrupoMuscular.COSTAS,
    padrao_movimento: PadraoMovimento.PULL_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.PISO_LISO, Equipamento.TOALHA],
    descricao_execucao: 'Arraste de latíssimo',
  },
  {
    id: 'row_sheet_doorway',
    nome: 'Remada com lençol na porta',
    grupo_muscular_primario: GrupoMuscular.COSTAS,
    padrao_movimento: PadraoMovimento.PULL_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 2,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Remada na porta',
  },
  {
    id: 'row_table_inverted',
    nome: 'Inverted row em mesa',
    grupo_muscular_primario: GrupoMuscular.COSTAS,
    padrao_movimento: PadraoMovimento.PULL_HORIZONTAL,
    nivel_minimo: NivelMinimo.INTERMEDIARIO,
    nivel_escada: 3,
    equipamento_necessario: [Equipamento.MESA],
    descricao_execucao: 'Remada na mesa',
  },

  // Padrão: Joelho Dominante
  {
    id: 'squat_slow',
    nome: 'Agachamento livre lento',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.BAIXO },
    descricao_execucao: 'Agachamento com peso do corpo',
  },
  {
    id: 'squat_assisted',
    nome: 'Agachamento profundo assistido',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.PAREDE],
    nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.BAIXO },
    descricao_execucao: 'Agachamento assistido por parede',
  },
  {
    id: 'reverse_lunge',
    nome: 'Reverse lunge',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 2,
    equipamento_necessario: [Equipamento.NENHUM],
    nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.BAIXO },
    descricao_execucao: 'Lunge para trás',
  },
  {
    id: 'bss_quad_bias',
    nome: 'Bulgarian Split Squat com viés quadríceps',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INTERMEDIARIO,
    nivel_escada: 4,
    equipamento_necessario: [Equipamento.CADEIRA],
    nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.MEDIO },
    descricao_execucao: 'Agachamento búlgaro quadríceps',
  },
  {
    id: 'sissy_squat_assisted',
    nome: 'Sissy squat assistido',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.AVANCADO,
    nivel_escada: 5,
    equipamento_necessario: [Equipamento.PAREDE],
    articulacoes_estressadas: [Articulacao.JOELHO],
    nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.ALTO },
    contraindicacoes: ['joelho'],
    descricao_execucao: 'Sissy squat de alto impacto articular',
  },

  // Padrão: Quadril Dominante
  {
    id: 'glute_bridge',
    nome: 'Glute bridge',
    grupo_muscular_primario: GrupoMuscular.POSTERIOR,
    padrao_movimento: PadraoMovimento.QUADRIL_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Ponte de glúteo',
  },

  // Padrão: Panturrilha
  {
    id: 'calf_raise',
    nome: 'Elevação de calcanhares',
    grupo_muscular_primario: GrupoMuscular.PANTURRILHA,
    padrao_movimento: PadraoMovimento.PANTURRILHA,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Panturrilha solo',
  },

  // Padrão: Core
  {
    id: 'plank',
    nome: 'Prancha abdominal',
    grupo_muscular_primario: GrupoMuscular.CORE,
    padrao_movimento: PadraoMovimento.CORE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Prancha',
  },
];

// Perfil de base padrão (intermediário, sem restrições, todos os equipamentos)
const PERFIL_BASE: Perfil = {
  idade: 28,
  genero_biologico: Genero.MASCULINO,
  peso_corporal_kg: 80,
  altura_cm: 180,
  nivel: Nivel.INTERMEDIARIO,
  nivel_atividade_extra_treino: NivelAtividade.MODERADO,
  dias_disponiveis_semana: 4,
  duracao_alvo_sessao_min: 45,
  horario_preferido_treino: HorarioTreino.NOITE,
  equipamento_disponivel: [
    Equipamento.NENHUM,
    Equipamento.PAREDE,
    Equipamento.CADEIRA,
    Equipamento.MESA,
    Equipamento.PISO_LISO,
    Equipamento.TOALHA,
  ],
  fase_nutricional: FaseNutricional.HIPERTROFIA,
  restricoes_articulares: [],
};

describe('Algoritmo de Geração de Rotina Semanal de Hipertrofia', () => {
  
  it('1. Perfil iniciante com 3 dias → gera Full Body com 3 sessões', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      nivel: Nivel.INICIANTE,
      dias_disponiveis_semana: 3,
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);

    expect(programa.split_tipo).toBe('full_body');
    expect(programa.sessoes).toHaveLength(3);
    expect(programa.sessoes[0].nome).toBe('Full Body A');
    expect(programa.sessoes[1].nome).toBe('Full Body B');
    expect(programa.sessoes[2].nome).toBe('Full Body C');
  });

  it('2. Perfil intermediário com 4 dias → gera Upper/Lower com 4 sessões', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      nivel: Nivel.INTERMEDIARIO,
      dias_disponiveis_semana: 4,
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);

    expect(programa.split_tipo).toBe('upper_lower');
    expect(programa.sessoes).toHaveLength(4);
    expect(programa.sessoes[0].nome).toBe('Upper A');
    expect(programa.sessoes[1].nome).toBe('Lower A');
    expect(programa.sessoes[2].nome).toBe('Upper B');
    expect(programa.sessoes[3].nome).toBe('Lower B');
  });

  it('3. Perfil avançado com 6 dias → gera PPL com 6 sessões', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      nivel: Nivel.AVANCADO,
      dias_disponiveis_semana: 6,
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);

    expect(programa.split_tipo).toBe('push_pull_legs');
    expect(programa.sessoes).toHaveLength(6);
    expect(programa.sessoes[0].nome).toBe('Push A');
    expect(programa.sessoes[1].nome).toBe('Pull A');
    expect(programa.sessoes[2].nome).toBe('Legs A');
    expect(programa.sessoes[3].nome).toBe('Push B');
    expect(programa.sessoes[4].nome).toBe('Pull B');
    expect(programa.sessoes[5].nome).toBe('Legs B');
  });

  it('4. Perfil com restrição "joelho leve" (moderada) → não inclui pistol_squat ou sissy_squat, inclui Bulgarian Split Squat', () => {
    // Definimos severidade "moderada" de joelho (elimina médio e alto)
    // Sissy squat e pistol squat são de alto impacto / estresse joelho e são eliminados.
    // Bulgarian Split Squat (estresse joelho médio) é eliminado. Mas o reverse_lunge ou squat_slow (baixo estresse) devem passar.
    const perfil: Perfil = {
      ...PERFIL_BASE,
      nivel: Nivel.INTERMEDIARIO,
      dias_disponiveis_semana: 4,
      restricoes_articulares: [
        { articulacao: Articulacao.JOELHO, nivel_severidade: NivelEstresse.MEDIO }, // "moderada"
      ],
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);
    
    // Varre todas as sessões para garantir que sissy_squat_assisted ou pistol_assisted não foram incluídos
    const exerciciosIds = programa.sessoes.flatMap(s => 
      (s.exercicios_prescritos || []).map(ep => ep.exercicio_id)
    );

    expect(exerciciosIds).not.toContain('sissy_squat_assisted');
    expect(exerciciosIds).not.toContain('pistol_assisted');
    expect(exerciciosIds).not.toContain('bss_quad_bias'); // médio estresse eliminado em severidade moderada!
    expect(exerciciosIds).toContain('reverse_lunge'); // passou por ser baixo estresse
  });

  it('5. Perfil sem mesa → não inclui exercícios que requerem mesa', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      equipamento_disponivel: [
        Equipamento.NENHUM,
        Equipamento.PAREDE,
        Equipamento.CADEIRA,
      ], // Sem Equipamento.MESA
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);
    
    const exerciciosIds = programa.sessoes.flatMap(s => 
      (s.exercicios_prescritos || []).map(ep => ep.exercicio_id)
    );

    expect(exerciciosIds).not.toContain('push_inclined_table');
    expect(exerciciosIds).not.toContain('row_table_inverted');
  });

  it('6. Perfil sem parede livre → não inclui exercícios que requerem parede', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      equipamento_disponivel: [
        Equipamento.NENHUM,
        Equipamento.CADEIRA,
        Equipamento.MESA,
      ], // Sem Equipamento.PAREDE
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);
    
    const exerciciosIds = programa.sessoes.flatMap(s => 
      (s.exercicios_prescritos || []).map(ep => ep.exercicio_id)
    );

    expect(exerciciosIds).not.toContain('push_wall');
    expect(exerciciosIds).not.toContain('squat_assisted');
  });

  it('7. Volume semanal para iniciante somando ≥ 6 séries por grupo principal', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      nivel: Nivel.INICIANTE,
      dias_disponiveis_semana: 3, // Full Body 3 dias
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);

    // Contabiliza volume do grupo Peito
    let totalSeriesPeito = 0;
    for (const sessao of programa.sessoes) {
      const exercicios = sessao.exercicios_prescritos || [];
      for (const ep of exercicios) {
        const ex = CATALOGO_MOCK.find(e => e.id === ep.exercicio_id);
        if (ex && ex.grupo_muscular_primario === GrupoMuscular.PEITO) {
          totalSeriesPeito += ep.series_alvo;
        }
      }
    }

    // Para iniciante o MEV é ≥ 6 séries por semana
    expect(totalSeriesPeito).toBeGreaterThanOrEqual(6);
  });

  it('8. Sessões Upper A e Upper B na mesma semana têm exercícios diferentes para o mesmo padrão', () => {
    const perfil: Perfil = {
      ...PERFIL_BASE,
      nivel: Nivel.INTERMEDIARIO,
      dias_disponiveis_semana: 4, // Upper/Lower
    };

    const programa = gerarProgramaSemanal(perfil, CATALOGO_MOCK);

    const upperA = programa.sessoes.find(s => s.nome === 'Upper A')!;
    const upperB = programa.sessoes.find(s => s.nome === 'Upper B')!;

    // Pega o primeiro exercício de empurrar (push_horizontal) da Sessão Upper A
    const pushA = upperA.exercicios_prescritos.find(ep => {
      const ex = CATALOGO_MOCK.find(e => e.id === ep.exercicio_id);
      return ex && ex.padrao_movimento === PadraoMovimento.PUSH_HORIZONTAL;
    });

    // Pega o primeiro exercício de empurrar (push_horizontal) da Sessão Upper B
    const pushB = upperB.exercicios_prescritos.find(ep => {
      const ex = CATALOGO_MOCK.find(e => e.id === ep.exercicio_id);
      return ex && ex.padrao_movimento === PadraoMovimento.PUSH_HORIZONTAL;
    });

    expect(pushA).toBeDefined();
    expect(pushB).toBeDefined();
    // Variações devem ser diferentes para evitar monotonia de estímulo muscular!
    expect(pushA?.exercicio_id).not.toBe(pushB?.exercicio_id);
  });

});
