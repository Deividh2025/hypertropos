import { describe, it, expect } from 'vitest';
import { filtrarExerciciosElegiveis, resgatarExercicioDeBaixoEstresse } from '../lib/filtro-restricoes';
import {
  Perfil,
  Genero,
  Nivel,
  NivelAtividade,
  HorarioTreino,
  Exercicio,
  GrupoMuscular,
  PadraoMovimento,
  NivelMinimo,
  Equipamento,
  Articulacao,
  NivelEstresse
} from '../types';

const MOCK_PERFIL_BASE: Perfil = {
  idade: 30,
  genero_biologico: Genero.FEMININO,
  peso_corporal_kg: 60,
  altura_cm: 165,
  nivel: Nivel.INTERMEDIARIO,
  nivel_atividade_extra_treino: NivelAtividade.LEVE,
  dias_disponiveis_semana: 3,
  duracao_alvo_sessao_min: 45,
  horario_preferido_treino: HorarioTreino.MANHA,
  equipamento_disponivel: [Equipamento.CADEIRA, Equipamento.PAREDE],
};

const MOCK_CATALOGO: Exercicio[] = [
  {
    id: 'push_up_iniciante',
    nome: 'Flexão Iniciante',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Flexão básica',
  },
  {
    id: 'push_up_avancado',
    nome: 'Flexão Avançada',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.AVANCADO,
    nivel_escada: 3,
    equipamento_necessario: [Equipamento.NENHUM],
    descricao_execucao: 'Flexão com salto',
  },
  {
    id: 'triceps_dip',
    nome: 'Mergulho Cadeira',
    grupo_muscular_primario: GrupoMuscular.TRICEPS,
    padrao_movimento: PadraoMovimento.PUSH_VERTICAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.CADEIRA],
    descricao_execucao: 'Mergulho na cadeira',
  },
  {
    id: 'towel_pull',
    nome: 'Remada Toalha',
    grupo_muscular_primario: GrupoMuscular.COSTAS,
    padrao_movimento: PadraoMovimento.PULL_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.TOALHA],
    descricao_execucao: 'Puxada com toalha',
  },
  {
    id: 'pistol_squat',
    nome: 'Pistol Squat',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.AVANCADO,
    nivel_escada: 3,
    equipamento_necessario: [Equipamento.NENHUM],
    nivel_estresse_por_articulacao: {
      [Articulacao.JOELHO]: NivelEstresse.ALTO,
    },
    articulacoes_estressadas: [Articulacao.JOELHO],
    descricao_execucao: 'Agachamento unilateral profundo',
  },
  {
    id: 'squat_safe',
    nome: 'Agachamento Leve',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    nivel_estresse_por_articulacao: {
      [Articulacao.JOELHO]: NivelEstresse.BAIXO,
    },
    descricao_execucao: 'Agachamento com amplitude curta',
  },
  {
    id: 'squat_contraindicated',
    nome: 'Agachamento Contraindicado',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    equipamento_necessario: [Equipamento.NENHUM],
    contraindicacoes: [Articulacao.JOELHO],
    descricao_execucao: 'Agachamento profundo com carga',
  }
];

describe('Filtro de Elegibilidade e Restrições Articulares', () => {
  describe('filtrarExerciciosElegiveis', () => {
    it('1. Deve filtrar exercícios que exigem nível de treino acima do usuário', () => {
      const perfil: Perfil = { ...MOCK_PERFIL_BASE, nivel: Nivel.INTERMEDIARIO };
      const elegiveis = filtrarExerciciosElegiveis(MOCK_CATALOGO, perfil);
      const ids = elegiveis.map(e => e.id);
      
      expect(ids).toContain('push_up_iniciante');
      expect(ids).not.toContain('push_up_avancado'); // Exclui nível avançado
    });

    it('2. Deve filtrar exercícios que exigem equipamentos indisponíveis', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        equipamento_disponivel: [Equipamento.CADEIRA], // Sem TOALHA
      };
      const elegiveis = filtrarExerciciosElegiveis(MOCK_CATALOGO, perfil);
      const ids = elegiveis.map(e => e.id);

      expect(ids).toContain('triceps_dip'); // Requer cadeira - ok
      expect(ids).not.toContain('towel_pull'); // Requer toalha - excluído
    });

    it('3. Deve excluir exercícios que possuem contraindicação explícita para articulação restrita', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        restricoes_articulares: [
          { articulacao: Articulacao.JOELHO, nivel_severidade: NivelEstresse.BAIXO }
        ]
      };
      const elegiveis = filtrarExerciciosElegiveis(MOCK_CATALOGO, perfil);
      const ids = elegiveis.map(e => e.id);

      expect(ids).not.toContain('squat_contraindicated'); // Contraindicação explícita
    });

    it('4. Deve filtrar exercícios por severidade de estresse articular (BAIXO)', () => {
      // Nível de severidade BAIXO (dor leve): permite BAIXO e MEDIO, elimina ALTO
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        nivel: Nivel.AVANCADO, // Para permitir pistol_squat por nível
        restricoes_articulares: [
          { articulacao: Articulacao.JOELHO, nivel_severidade: NivelEstresse.BAIXO }
        ]
      };
      
      const elegiveis = filtrarExerciciosElegiveis(MOCK_CATALOGO, perfil);
      const ids = elegiveis.map(e => e.id);

      expect(ids).toContain('squat_safe'); // Joelho = BAIXO (Permitido)
      expect(ids).not.toContain('pistol_squat'); // Joelho = ALTO (Excluído)
    });

    it('5. Deve filtrar exercícios por severidade de estresse articular (MEDIO/ALTO)', () => {
      // Nível de severidade MEDIO/ALTO (dor moderada/alta): permite apenas BAIXO, elimina MEDIO e ALTO
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        restricoes_articulares: [
          { articulacao: Articulacao.JOELHO, nivel_severidade: NivelEstresse.MEDIO }
        ]
      };

      const elegiveis = filtrarExerciciosElegiveis(MOCK_CATALOGO, perfil);
      const ids = elegiveis.map(e => e.id);

      expect(ids).toContain('squat_safe'); // Joelho = BAIXO (Permitido)
      expect(ids).not.toContain('pistol_squat'); // Joelho = ALTO (Excluído)
    });
  });

  describe('resgatarExercicioDeBaixoEstresse', () => {
    it('1. Deve retornar null se não houver exercícios com o padrão de movimento', () => {
      const resgatado = resgatarExercicioDeBaixoEstresse(MOCK_CATALOGO, MOCK_PERFIL_BASE, PadraoMovimento.PANTURRILHA);
      expect(resgatado).toBeNull();
    });

    it('2. Deve resgatar o exercício de menor estresse respeitando os equipamentos do usuário', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        equipamento_disponivel: [Equipamento.NENHUM], // Sem CADEIRA, sem TOALHA
        restricoes_articulares: [
          { articulacao: Articulacao.JOELHO, nivel_severidade: NivelEstresse.MEDIO }
        ]
      };

      const catalogoResgate: Exercicio[] = [
        {
          id: 'squat_heavy',
          nome: 'Agachamento Pesado',
          grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
          padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
          nivel_minimo: NivelMinimo.INICIANTE,
          nivel_escada: 1,
          equipamento_necessario: [Equipamento.NENHUM],
          nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.ALTO },
          descricao_execucao: 'Heavy squat',
        },
        {
          id: 'squat_light',
          nome: 'Agachamento Seguro',
          grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
          padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
          nivel_minimo: NivelMinimo.INICIANTE,
          nivel_escada: 1,
          equipamento_necessario: [Equipamento.NENHUM],
          nivel_estresse_por_articulacao: { [Articulacao.JOELHO]: NivelEstresse.BAIXO },
          descricao_execucao: 'Light squat',
        }
      ];

      const resgatado = resgatarExercicioDeBaixoEstresse(catalogoResgate, perfil, PadraoMovimento.JOELHO_DOMINANTE);
      expect(resgatado).not.toBeNull();
      expect(resgatado!.id).toBe('squat_light'); // Selecionou o de menor estresse (BAIXO vs ALTO)
    });
  });
});
