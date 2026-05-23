import { Perfil, FaseNutricional } from '../types';

export interface MetaProteinaResultado {
  fator_g_kg: number;
  meta_total_g: number;
  justificativa: string;
}

export interface DistribuicaoRefeicaoResultado {
  quantidade_por_refeicao_g: number;
  fator_por_refeicao_g_kg: number;
  dentro_faixa_ideal: boolean;
  faixa_ideal_min_g: number;
  faixa_ideal_max_g: number;
  mensagem_cientifica: string;
}

export interface ValidacaoMetaResultado {
  valido: boolean;
  g_kg: number;
  mensagem: string;
}

/**
 * Calcula a meta diária de proteína baseada no peso corporal e na fase nutricional do usuário.
 * 
 * Cientificamente fundamentado nos seguintes patamares:
 * - Manutenção (1.6 g/kg): Campbell et al., 2007.
 * - Hipertrofia (1.8 g/kg): Morton et al., 2018.
 * - Déficit (2.2 g/kg): Helms et al., 2014.
 * 
 * @param perfil Perfil ou dados parciais contendo peso corporal e fase nutricional
 */
export function calcularMetaProteina(perfil: Partial<Perfil>): MetaProteinaResultado {
  const peso = perfil.peso_corporal_kg || 70; // Fallback seguro para peso corporal médio
  const fase = perfil.fase_nutricional || FaseNutricional.MANUTENCAO;

  let fator_g_kg = 1.6;
  let justificativa = '';

  switch (fase) {
    case FaseNutricional.MANUTENCAO:
      fator_g_kg = 1.6;
      justificativa = 'Ingestão recomendada de 1.6 g/kg/dia é cientificamente respaldada para manter o balanço nitrogenado positivo e preservar a integridade da massa muscular em indivíduos ativos (Campbell et al., 2007).';
      break;
    case FaseNutricional.HIPERTROFIA:
      fator_g_kg = 1.8;
      justificativa = 'A ingestão de 1.8 g/kg/dia é otimizada para maximizar a síntese proteica muscular e potencializar os ganhos de hipertrofia muscular esquelética induzidos pelo treinamento de força (Morton et al., 2018).';
      break;
    case FaseNutricional.DEFICIT:
      fator_g_kg = 2.2;
      justificativa = 'Em estados de déficit calórico, uma ingestão mais elevada de 2.2 g/kg/dia é recomendada para atenuar a proteólise e preservar a massa muscular ativa contra o catabolismo acentuado (Helms et al., 2014).';
      break;
    default:
      fator_g_kg = 1.6;
      justificativa = 'Ingestão base para manutenção da integridade proteica muscular e recuperação tecidual.';
  }

  // Se o usuário já tiver uma meta customizada salva, ela pode ser usada,
  // mas o cálculo base científico se orienta pela fase nutricional.
  const meta_total_g = Math.round(peso * fator_g_kg * 10) / 10;

  return {
    fator_g_kg,
    meta_total_g,
    justificativa,
  };
}

/**
 * Distribui a meta proteica pelas refeições sugeridas, validando a faixa ideal de 0.3 a 0.4 g/kg por refeição.
 * Fundamentado em Schoenfeld & Aragon (2018), que mostram que a síntese proteica é maximizada nessa janela por refeição.
 * 
 * @param meta Meta proteica total diária em gramas
 * @param numRefeicoes Quantidade de refeições ao dia
 * @param peso Peso corporal do usuário (para validação do g/kg por refeição)
 */
export function distribuicaoSugerida(
  meta: number,
  numRefeicoes: number,
  peso: number = 70
): DistribuicaoRefeicaoResultado {
  const quantidade_por_refeicao_g = Math.round((meta / numRefeicoes) * 10) / 10;
  const fator_por_refeicao_g_kg = Math.round((quantidade_por_refeicao_g / peso) * 100) / 100;

  // Faixa ideal Schoenfeld & Aragon 2018: 0.3 a 0.4 g/kg por refeição
  const faixa_ideal_min_g = Math.round(peso * 0.3 * 10) / 10;
  const faixa_ideal_max_g = Math.round(peso * 0.4 * 10) / 10;

  const dentro_faixa_ideal = fator_por_refeicao_g_kg >= 0.3 && fator_por_refeicao_g_kg <= 0.4;

  let mensagem_cientifica = '';
  if (dentro_faixa_ideal) {
    mensagem_cientifica = `Excelente! Uma distribuição de ${quantidade_por_refeicao_g}g (${fator_por_refeicao_g_kg} g/kg) por refeição enquadra-se perfeitamente na recomendação científica de 0.3 a 0.4 g/kg por refeição para maximizar o estímulo de síntese de proteína muscular ao longo do dia (Schoenfeld & Aragon, 2018).`;
  } else if (fator_por_refeicao_g_kg < 0.3) {
    mensagem_cientifica = `Atenção: A dose de ${quantidade_por_refeicao_g}g (${fator_por_refeicao_g_kg} g/kg) por refeição está abaixo do limiar sugerido de 0.3 g/kg. Considere aumentar a proteína em refeições-chave ou reduzir o número total de refeições para consolidar doses mais robustas (Schoenfeld & Aragon, 2018).`;
  } else {
    mensagem_cientifica = `Dica: Uma dose de ${quantidade_por_refeicao_g}g (${fator_por_refeicao_g_kg} g/kg) excede o limite comum de saturação aguda (0.4 g/kg). Embora proteínas excedentes sejam convertidas em outros substratos energéticos ou ureia, esta dose é segura e muito eficaz se o seu objetivo diário for elevado (Schoenfeld & Aragon, 2018).`;
  }

  return {
    quantidade_por_refeicao_g,
    fator_por_refeicao_g_kg,
    dentro_faixa_ideal,
    faixa_ideal_min_g,
    faixa_ideal_max_g,
    mensagem_cientifica,
  };
}

/**
 * Valida se uma meta proposta personalizada se encontra em limites seguros (1.4 a 2.5 g/kg).
 * 
 * @param metaProposta Meta proposta em gramas totais ou em g/kg
 * @param peso Peso corporal do usuário
 */
export function validarMetaCustomizada(metaProposta: number, peso: number): ValidacaoMetaResultado {
  // Se for maior que 10, interpretamos como valor absoluto em gramas (ex: 150g). Caso contrário, valor relativo g/kg (ex: 2.0).
  const g_kg = metaProposta > 10 ? Math.round((metaProposta / peso) * 10) / 10 : metaProposta;
  const valido = g_kg >= 1.4 && g_kg <= 2.5;

  let mensagem = '';
  if (valido) {
    mensagem = 'A meta de proteína proposta está dentro dos parâmetros de segurança científica recomendados para atletas e indivíduos ativos (1.4 a 2.5 g/kg).';
  } else if (g_kg < 1.4) {
    mensagem = `Meta muito baixa (${g_kg} g/kg). O mínimo recomendado para indivíduos ativos ou praticantes de força é de 1.4 g/kg para mitigar a degradação e otimizar a regeneração.`;
  } else {
    mensagem = `Meta muito elevada (${g_kg} g/kg). Ingestões acima de 2.5 g/kg não apresentam benefícios comprovados de síntese proteica ou retenção de massa magra adicionais para a maioria dos indivíduos saudáveis.`;
  }

  return {
    valido,
    g_kg,
    mensagem,
  };
}
