import { describe, it, expect } from 'vitest';
import {
  calcularMetaProteina,
  distribuicaoSugerida,
  validarMetaCustomizada
} from '../lib/calculadora-proteina';
import { Perfil, Genero, Nivel, NivelAtividade, HorarioTreino, FaseNutricional } from '../types';

const MOCK_PERFIL_BASE: Perfil = {
  idade: 25,
  genero_biologico: Genero.MASCULINO,
  peso_corporal_kg: 80, // 80 kg
  altura_cm: 180,
  nivel: Nivel.INTERMEDIARIO,
  nivel_atividade_extra_treino: NivelAtividade.MODERADO,
  dias_disponiveis_semana: 4,
  duracao_alvo_sessao_min: 45,
  horario_preferido_treino: HorarioTreino.TARDE,
};

describe('Calculadora Científica de Proteínas', () => {
  
  describe('calcularMetaProteina', () => {
    it('Deve retornar 1.6 g/kg e justificativa correta para a fase de Manutenção', () => {
      const perfilManutencao: Perfil = {
        ...MOCK_PERFIL_BASE,
        fase_nutricional: FaseNutricional.MANUTENCAO
      };

      const resultado = calcularMetaProteina(perfilManutencao);

      expect(resultado.fator_g_kg).toBe(1.6);
      expect(resultado.meta_total_g).toBe(128); // 80 * 1.6 = 128g
      expect(resultado.justificativa).toContain('Campbell et al., 2007');
    });

    it('Deve retornar 1.8 g/kg e justificativa correta para a fase de Hipertrofia', () => {
      const perfilHipertrofia: Perfil = {
        ...MOCK_PERFIL_BASE,
        fase_nutricional: FaseNutricional.HIPERTROFIA
      };

      const resultado = calcularMetaProteina(perfilHipertrofia);

      expect(resultado.fator_g_kg).toBe(1.8);
      expect(resultado.meta_total_g).toBe(144); // 80 * 1.8 = 144g
      expect(resultado.justificativa).toContain('Morton et al., 2018');
    });

    it('Deve retornar 2.2 g/kg e justificativa correta para a fase de Déficit Calórico', () => {
      const perfilDeficit: Perfil = {
        ...MOCK_PERFIL_BASE,
        fase_nutricional: FaseNutricional.DEFICIT
      };

      const resultado = calcularMetaProteina(perfilDeficit);

      expect(resultado.fator_g_kg).toBe(2.2);
      expect(resultado.meta_total_g).toBe(176); // 80 * 2.2 = 176g
      expect(resultado.justificativa).toContain('Helms et al., 2014');
    });

    it('Deve adotar manutenção de 1.6 g/kg como padrão quando a fase for omitida', () => {
      const resultado = calcularMetaProteina({ peso_corporal_kg: 70 });

      expect(resultado.fator_g_kg).toBe(1.6);
      expect(resultado.meta_total_g).toBe(112); // 70 * 1.6 = 112g
    });

    it('Deve adotar peso de 70kg e manutenção de 1.6 g/kg de fallback em perfil vazio', () => {
      const resultado = calcularMetaProteina({});

      expect(resultado.fator_g_kg).toBe(1.6);
      expect(resultado.meta_total_g).toBe(112); // 70 * 1.6 = 112g
    });
  });

  describe('distribuicaoSugerida', () => {
    it('Deve identificar quando a distribuição está perfeitamente na faixa ideal (0.3 - 0.4 g/kg)', () => {
      // 120g de proteína dividida em 4 refeições = 30g por refeição
      // Para um peso de 80kg: 30g / 80kg = 0.375 g/kg (arredondado para 0.38 g/kg)
      const resultado = distribuicaoSugerida(120, 4, 80);

      expect(resultado.quantidade_por_refeicao_g).toBe(30);
      expect(resultado.fator_por_refeicao_g_kg).toBe(0.38);
      expect(resultado.dentro_faixa_ideal).toBe(true);
      expect(resultado.faixa_ideal_min_g).toBe(24); // 80 * 0.3 = 24g
      expect(resultado.faixa_ideal_max_g).toBe(32); // 80 * 0.4 = 32g
      expect(resultado.mensagem_cientifica).toContain('Schoenfeld & Aragon, 2018');
      expect(resultado.mensagem_cientifica).toContain('enquadra-se perfeitamente');
    });

    it('Deve alertar se a dose por refeição for inferior ao limiar ideal de 0.3 g/kg', () => {
      // 80g de proteína dividida em 4 refeições = 20g por refeição
      // Para um peso de 80kg: 20g / 80kg = 0.25 g/kg
      const resultado = distribuicaoSugerida(80, 4, 80);

      expect(resultado.quantidade_por_refeicao_g).toBe(20);
      expect(resultado.fator_por_refeicao_g_kg).toBe(0.25);
      expect(resultado.dentro_faixa_ideal).toBe(false);
      expect(resultado.mensagem_cientifica).toContain('abaixo do limiar sugerido');
    });

    it('Deve notificar de forma descritiva se a dose por refeição exceder o limiar de saturação aguda de 0.4 g/kg', () => {
      // 160g de proteína dividida em 4 refeições = 40g por refeição
      // Para um peso de 80kg: 40g / 80kg = 0.50 g/kg
      const resultado = distribuicaoSugerida(160, 4, 80);

      expect(resultado.quantidade_por_refeicao_g).toBe(40);
      expect(resultado.fator_por_refeicao_g_kg).toBe(0.5);
      expect(resultado.dentro_faixa_ideal).toBe(false);
      expect(resultado.mensagem_cientifica).toContain('excede o limite comum de saturação');
    });
  });

  describe('validarMetaCustomizada', () => {
    it('Deve considerar válido se a meta informada em g/kg estiver entre 1.4 e 2.5', () => {
      const resultado = validarMetaCustomizada(2.0, 80); // 2.0 g/kg

      expect(resultado.valido).toBe(true);
      expect(resultado.g_kg).toBe(2.0);
      expect(resultado.mensagem).toContain('dentro dos parâmetros de segurança');
    });

    it('Deve converter a meta absoluta em gramas para g/kg e validar corretamente', () => {
      // 160g para peso 80kg = 2.0 g/kg (Válido)
      const resultado = validarMetaCustomizada(160, 80);

      expect(resultado.valido).toBe(true);
      expect(resultado.g_kg).toBe(2.0);
      expect(resultado.mensagem).toContain('dentro dos parâmetros de segurança');
    });

    it('Deve invalidar meta customizada menor que 1.4 g/kg', () => {
      const resultado = validarMetaCustomizada(1.2, 80); // 1.2 g/kg

      expect(resultado.valido).toBe(false);
      expect(resultado.g_kg).toBe(1.2);
      expect(resultado.mensagem).toContain('Meta muito baixa');
    });

    it('Deve invalidar meta customizada maior que 2.5 g/kg', () => {
      const resultado = validarMetaCustomizada(2.7, 80); // 2.7 g/kg

      expect(resultado.valido).toBe(false);
      expect(resultado.g_kg).toBe(2.7);
      expect(resultado.mensagem).toContain('Meta muito elevada');
    });
  });

});
