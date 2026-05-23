import { describe, it, expect } from 'vitest';
import { calcularVolumeSemanal, validarEJustarVolume } from '../lib/calculadora-volume';
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
  SessaoTemplate
} from '../types';

const MOCK_CATALOGO: Exercicio[] = [
  {
    id: 'supino',
    nome: 'Supino Reto',
    grupo_muscular_primario: GrupoMuscular.PEITO,
    padrao_movimento: PadraoMovimento.PUSH_HORIZONTAL,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    descricao_execucao: 'Supino',
  },
  {
    id: 'barra_fixa',
    nome: 'Barra Fixa',
    grupo_muscular_primario: GrupoMuscular.COSTAS,
    padrao_movimento: PadraoMovimento.PULL_VERTICAL,
    nivel_minimo: NivelMinimo.INTERMEDIARIO,
    nivel_escada: 2,
    descricao_execucao: 'Barra Fixa',
  },
  {
    id: 'agachamento',
    nome: 'Agachamento',
    grupo_muscular_primario: GrupoMuscular.QUADRICEPS,
    padrao_movimento: PadraoMovimento.JOELHO_DOMINANTE,
    nivel_minimo: NivelMinimo.INICIANTE,
    nivel_escada: 1,
    descricao_execucao: 'Agachamento',
  }
];

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
};

describe('Calculadora e Motor de Volume de Treino', () => {
  describe('calcularVolumeSemanal', () => {
    it('1. Deve inicializar todos os volumes em zero se não houver sessões', () => {
      const catalogoMap = new Map<string, Exercicio>(MOCK_CATALOGO.map(e => [e.id, e]));
      const volumes = calcularVolumeSemanal([], catalogoMap);
      
      expect(volumes[GrupoMuscular.PEITO]).toBe(0);
      expect(volumes[GrupoMuscular.COSTAS]).toBe(0);
      expect(volumes[GrupoMuscular.QUADRICEPS]).toBe(0);
    });

    it('2. Deve somar corretamente as séries para cada grupo muscular primário', () => {
      const catalogoMap = new Map<string, Exercicio>(MOCK_CATALOGO.map(e => [e.id, e]));
      const sessoes: SessaoTemplate[] = [
        {
          id: 's1',
          nome: 'Treino A',
          ordem_na_semana: 1,
          exercicios_prescritos: [
            { id: 'ep1', exercicio_id: 'supino', ordem: 1, series_alvo: 3, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
            { id: 'ep2', exercicio_id: 'agachamento', ordem: 2, series_alvo: 4, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
          ]
        },
        {
          id: 's2',
          nome: 'Treino B',
          ordem_na_semana: 2,
          exercicios_prescritos: [
            { id: 'ep3', exercicio_id: 'supino', ordem: 1, series_alvo: 2, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
            { id: 'ep4', exercicio_id: 'barra_fixa', ordem: 2, series_alvo: 3, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
          ]
        }
      ];

      const volumes = calcularVolumeSemanal(sessoes, catalogoMap);
      expect(volumes[GrupoMuscular.PEITO]).toBe(5); // 3 + 2
      expect(volumes[GrupoMuscular.QUADRICEPS]).toBe(4); // 4
      expect(volumes[GrupoMuscular.COSTAS]).toBe(3); // 3
      expect(volumes[GrupoMuscular.POSTERIOR]).toBe(0);
    });
  });

  describe('validarEJustarVolume', () => {
    it('1. Não deve alterar séries se o volume semanal estiver acima ou igual ao alvo', () => {
      const sessoes: SessaoTemplate[] = [
        {
          id: 's1',
          nome: 'Treino A',
          ordem_na_semana: 1,
          exercicios_prescritos: [
            { id: 'ep1', exercicio_id: 'supino', ordem: 1, series_alvo: 4, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
          ]
        }
      ];

      const ajustadas = validarEJustarVolume(sessoes, 4, MOCK_PERFIL, MOCK_CATALOGO);
      expect(ajustadas[0].exercicios_prescritos![0].series_alvo).toBe(4);
    });

    it('2. Deve adicionar séries até o limite de 4 séries por composto quando volume estiver abaixo do alvo', () => {
      const sessoes: SessaoTemplate[] = [
        {
          id: 's1',
          nome: 'Treino A',
          ordem_na_semana: 1,
          exercicios_prescritos: [
            { id: 'ep1', exercicio_id: 'supino', ordem: 1, series_alvo: 2, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
          ]
        }
      ];

      // Alvo = 4, atual = 2. Deve compensar adicionando 2 séries para o supino (limite de 4)
      const ajustadas = validarEJustarVolume(sessoes, 4, MOCK_PERFIL, MOCK_CATALOGO);
      expect(ajustadas[0].exercicios_prescritos![0].series_alvo).toBe(4);
    });

    it('3. Não deve ultrapassar o limite seguro de 4 séries por exercício, mesmo com déficit pendente', () => {
      const sessoes: SessaoTemplate[] = [
        {
          id: 's1',
          nome: 'Treino A',
          ordem_na_semana: 1,
          exercicios_prescritos: [
            { id: 'ep1', exercicio_id: 'supino', ordem: 1, series_alvo: 3, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
          ]
        }
      ];

      // Alvo = 6, atual = 3. Deve aumentar o supino de 3 para 4 apenas, deixando o resto pendente devido ao limite de fadiga.
      const ajustadas = validarEJustarVolume(sessoes, 6, MOCK_PERFIL, MOCK_CATALOGO);
      expect(ajustadas[0].exercicios_prescritos![0].series_alvo).toBe(4);
    });

    it('4. Deve gerar aviso científico nas notas da sessão se o total de séries exceder 14 e ultrapassar tempo alvo', () => {
      const sessoes: SessaoTemplate[] = [
        {
          id: 's1',
          nome: 'Treino Extremo',
          ordem_na_semana: 1,
          exercicios_prescritos: [
            { id: 'ep1', exercicio_id: 'supino', ordem: 1, series_alvo: 4, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
            { id: 'ep2', exercicio_id: 'barra_fixa', ordem: 2, series_alvo: 4, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
            { id: 'ep3', exercicio_id: 'agachamento', ordem: 3, series_alvo: 4, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 },
            { id: 'ep4', exercicio_id: 'supino', ordem: 4, series_alvo: 4, reps_alvo_min: 8, reps_alvo_max: 12, rir_alvo: 2, descanso_segundos: 90 }
          ],
          descricao: 'Treino desafiador.'
        }
      ];

      // 16 séries totais. tempoEstimado = 16 * 2.5 = 40 min.
      // Se alterarmos duracao_alvo_sessao_min para 30 min, deve emitir aviso.
      const perfilCurto: Perfil = { ...MOCK_PERFIL, duracao_alvo_sessao_min: 30 };
      const ajustadas = validarEJustarVolume(sessoes, 10, perfilCurto, MOCK_CATALOGO);
      
      expect(ajustadas[0].descricao).toContain('Aviso Científico');
      expect(ajustadas[0].descricao).toContain('supersets antagonistas');
    });
  });
});
