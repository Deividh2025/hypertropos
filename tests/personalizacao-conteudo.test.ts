import { describe, it, expect } from 'vitest';
import {
  obterTagsInteresseDoPerfil,
  ordenarArtigosPorPerfil,
  obterArtigosSugeridos,
} from '../lib/personalizacao-conteudo';
import { Perfil, Genero, Nivel, NivelAtividade, HorarioTreino, ArtigoCientifico } from '../types';

const MOCK_PERFIL_BASE: Perfil = {
  idade: 25,
  genero_biologico: Genero.MASCULINO,
  peso_corporal_kg: 75,
  altura_cm: 175,
  nivel: Nivel.INTERMEDIARIO,
  nivel_atividade_extra_treino: NivelAtividade.MODERADO,
  dias_disponiveis_semana: 4,
  duracao_alvo_sessao_min: 45,
  horario_preferido_treino: HorarioTreino.TARDE,
};

describe('Algoritmo de Personalização de Conteúdo Científico', () => {
  describe('obterTagsInteresseDoPerfil', () => {
    it('1. Deve retornar lista vazia para perfil básico sem restrições ou suplementos', () => {
      const tags = obterTagsInteresseDoPerfil(MOCK_PERFIL_BASE);
      expect(tags).toEqual([]);
    });

    it('2. Deve adicionar tags para suplementação ativa (creatina e cafeína)', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        usa_creatina: true,
        usa_cafeina: true,
      };
      const tags = obterTagsInteresseDoPerfil(perfil);
      expect(tags).toContain('usa_creatina');
      expect(tags).toContain('usa_cafeina');
      expect(tags).toHaveLength(2);
    });

    it('3. Deve adicionar tag de retorno ao treino quando nível for iniciante', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        nivel: Nivel.INICIANTE,
      };
      const tags = obterTagsInteresseDoPerfil(perfil);
      expect(tags).toContain('retorno_ao_treino');
      expect(tags).toHaveLength(1);
    });

    it('4. Deve identificar predisposições articulares quando restrições forem passadas como array de objetos', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        restricoes_articulares: [
          { articulacao: 'joelho' as any, nivel_severidade: 'baixo' as any },
          { articulacao: 'quadril' as any, nivel_severidade: 'medio' as any },
          { articulacao: 'aquiles' as any, nivel_severidade: 'alto' as any },
        ],
      };
      const tags = obterTagsInteresseDoPerfil(perfil);
      expect(tags).toContain('predisposicao_joelho');
      expect(tags).toContain('predisposicao_quadril');
      expect(tags).toContain('predisposicao_aquiles');
      expect(tags).toHaveLength(3);
    });

    it('5. Deve fazer parse e identificar restrições articulares salvas como JSON string', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        restricoes_articulares: '[{"articulacao":"joelho"},"aquiles"]' as any,
      };
      const tags = obterTagsInteresseDoPerfil(perfil);
      expect(tags).toContain('predisposicao_joelho');
      expect(tags).toContain('predisposicao_aquiles');
      expect(tags).toHaveLength(2);
    });

    it('6. Deve tratar erros de JSON parse graciosamente', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        restricoes_articulares: '{invalido}' as any,
      };
      const tags = obterTagsInteresseDoPerfil(perfil);
      expect(tags).toEqual([]);
    });
  });

  describe('ordenarArtigosPorPerfil', () => {
    const artigosMock: ArtigoCientifico[] = [
      {
        id: '1',
        titulo: 'Artigo B - Hipertrofia para Iniciantes',
        conteudo_markdown: '',
        tags: [],
        tags_perfil_relacionadas: ['retorno_ao_treino'],
        tempo_leitura_min: 5,
        data_publicacao: '2025-01-01',
        referencias: [],
      },
      {
        id: '2',
        titulo: 'Artigo A - Guia de Creatina',
        conteudo_markdown: '',
        tags: [],
        tags_perfil_relacionadas: ['usa_creatina'],
        tempo_leitura_min: 6,
        data_publicacao: '2025-02-01',
        referencias: [],
      },
      {
        id: '3',
        titulo: 'Artigo C - Dor no Joelho',
        conteudo_markdown: '',
        tags: [],
        tags_perfil_relacionadas: ['predisposicao_joelho', 'usa_creatina'],
        tempo_leitura_min: 7,
        data_publicacao: '2025-03-01',
        referencias: [],
      },
    ];

    it('1. Deve ordenar alfabeticamente se o perfil for nulo', () => {
      const ordenados = ordenarArtigosPorPerfil(artigosMock, null);
      expect(ordenados[0].titulo).toBe('Artigo A - Guia de Creatina');
      expect(ordenados[1].titulo).toBe('Artigo B - Hipertrofia para Iniciantes');
      expect(ordenados[2].titulo).toBe('Artigo C - Dor no Joelho');
    });

    it('2. Deve priorizar artigos com mais matches de tag com o perfil', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        usa_creatina: true,
        restricoes_articulares: [{ articulacao: 'joelho' as any, nivel_severidade: 'baixo' as any }],
      };

      const ordenados = ordenarArtigosPorPerfil(artigosMock, perfil);
      // Artigo C tem 2 matches ('predisposicao_joelho', 'usa_creatina')
      // Artigo A tem 1 match ('usa_creatina')
      // Artigo B tem 0 matches
      expect(ordenados[0].id).toBe('3'); // Artigo C no topo
      expect(ordenados[1].id).toBe('2'); // Artigo A em segundo
      expect(ordenados[2].id).toBe('1'); // Artigo B por último
    });

    it('3. Deve usar data de publicação como critério de desempate (mais recente primeiro)', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        usa_creatina: true,
        nivel: Nivel.INICIANTE, // retorno_ao_treino = true
      };

      const artigosEmpatados: ArtigoCientifico[] = [
        {
          id: '1',
          titulo: 'Antigo',
          conteudo_markdown: '',
          tags: [],
          tags_perfil_relacionadas: ['retorno_ao_treino'],
          tempo_leitura_min: 5,
          data_publicacao: '2024-01-01',
          referencias: [],
        },
        {
          id: '2',
          titulo: 'Novo',
          conteudo_markdown: '',
          tags: [],
          tags_perfil_relacionadas: ['usa_creatina'],
          tempo_leitura_min: 5,
          data_publicacao: '2025-01-01',
          referencias: [],
        },
      ];

      const ordenados = ordenarArtigosPorPerfil(artigosEmpatados, perfil);
      expect(ordenados[0].id).toBe('2'); // Mais recente primeiro
      expect(ordenados[1].id).toBe('1');
    });

    it('4. Deve usar o título do artigo como desempate alfabético se tags e datas forem iguais', () => {
      const perfil: Perfil = {
        ...MOCK_PERFIL_BASE,
        usa_creatina: true,
      };

      const artigosEmpatados: ArtigoCientifico[] = [
        {
          id: '2',
          titulo: 'B Artigo',
          conteudo_markdown: '',
          tags: [],
          tags_perfil_relacionadas: ['usa_creatina'],
          tempo_leitura_min: 5,
          data_publicacao: '2025-01-01',
          referencias: [],
        },
        {
          id: '1',
          titulo: 'A Artigo',
          conteudo_markdown: '',
          tags: [],
          tags_perfil_relacionadas: ['usa_creatina'],
          tempo_leitura_min: 5,
          data_publicacao: '2025-01-01',
          referencias: [],
        },
      ];

      const ordenados = ordenarArtigosPorPerfil(artigosEmpatados, perfil);
      expect(ordenados[0].id).toBe('1'); // 'A Artigo' vem antes de 'B Artigo'
      expect(ordenados[1].id).toBe('2');
    });
  });

  describe('obterArtigosSugeridos', () => {
    const artigosMock: ArtigoCientifico[] = [
      { id: '1', titulo: 'Artigo 1', conteudo_markdown: '', tags: [], tags_perfil_relacionadas: [], tempo_leitura_min: 5, data_publicacao: '2025-01-01', referencias: [] },
      { id: '2', titulo: 'Artigo 2', conteudo_markdown: '', tags: [], tags_perfil_relacionadas: [], tempo_leitura_min: 5, data_publicacao: '2025-01-02', referencias: [] },
      { id: '3', titulo: 'Artigo 3', conteudo_markdown: '', tags: [], tags_perfil_relacionadas: [], tempo_leitura_min: 5, data_publicacao: '2025-01-03', referencias: [] },
      { id: '4', titulo: 'Artigo 4', conteudo_markdown: '', tags: [], tags_perfil_relacionadas: [], tempo_leitura_min: 5, data_publicacao: '2025-01-04', referencias: [] },
    ];

    it('1. Deve filtrar os artigos já lidos', () => {
      const sugeridos = obterArtigosSugeridos(artigosMock, null, ['1', '3']);
      const ids = sugeridos.map(s => s.id);
      expect(ids).not.toContain('1');
      expect(ids).not.toContain('3');
      expect(ids).toContain('2');
      expect(ids).toContain('4');
    });

    it('2. Deve respeitar o limite padrão de sugestões (3) e o limite customizado', () => {
      const sugeridosPadrao = obterArtigosSugeridos(artigosMock, null, []);
      expect(sugeridosPadrao).toHaveLength(3);

      const sugeridosCustom = obterArtigosSugeridos(artigosMock, null, [], 2);
      expect(sugeridosCustom).toHaveLength(2);
    });
  });
});
