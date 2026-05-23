import { SessaoTemplate, ExercicioPrescrito } from '../types/treino';

/**
 * Condensa uma sessão de treino original para uma versão de 15 minutos (Express),
 * retendo apenas os exercícios multiarticulares primários de maior impacto hipertrófico
 * e eficiência mecânica.
 *
 * Como o algoritmo científico de rotina já ordena os exercícios da sessão colocando
 * os compostos primários no topo (ordem menor) e os isolados/acessórios no final,
 * a condensação consiste em manter os 3 primeiros exercícios principais.
 */
export function gerarSessaoExpress(sessaoOriginal: SessaoTemplate): SessaoTemplate {
  const exercicios = sessaoOriginal.exercicios_prescritos || sessaoOriginal.exercicios || [];
  
  if (exercicios.length <= 3) {
    return {
      ...sessaoOriginal,
      nome: `${sessaoOriginal.nome} Express`,
      descricao: `Sessão condensada de 15 minutos focada nos exercícios multiarticulares de maior eficiência mecânica.`,
      exercicios_prescritos: exercicios,
      exercicios: exercicios,
    };
  }

  // Pegar os 3 primeiros exercícios que são compostos primários de alta ativação
  const exerciciosExpress = exercicios.slice(0, 3).map((ep, index) => ({
    ...ep,
    ordem: index + 1,
    // Reduz ligeiramente a quantidade de séries de 3 para 2 em casos de pressa extrema, ou mantém
    series_alvo: Math.max(2, ep.series_alvo - 1),
    notas: `⏱️ [Modo Express] ${ep.notas || ''}`,
  }));

  return {
    ...sessaoOriginal,
    nome: `${sessaoOriginal.nome} Express`,
    descricao: `Sessão condensada de 15 minutos focada nos 3 exercícios multiarticulares de maior tensão mecânica.`,
    exercicios_prescritos: exerciciosExpress,
    exercicios: exerciciosExpress,
  };
}
