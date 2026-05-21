import { obterLinhas, obterLinha } from '../local-cache';
import { Exercicio } from '../../types';

export async function listarExercicios(filtros?: Partial<Exercicio>): Promise<Exercicio[]> {
  try {
    // Para simplificar na V1 local, trazemos todos e filtramos em memória.
    const linhas = await obterLinhas<any>('SELECT * FROM exercicios');
    const exercicios = linhas.map(parseExercicio);
    
    if (!filtros) return exercicios;

    return exercicios.filter(ex => {
      let matches = true;
      if (filtros.grupo_muscular_primario && ex.grupo_muscular_primario !== filtros.grupo_muscular_primario) matches = false;
      if (filtros.padrao_movimento && ex.padrao_movimento !== filtros.padrao_movimento) matches = false;
      if (filtros.nivel_minimo && ex.nivel_minimo !== filtros.nivel_minimo) matches = false;
      return matches;
    });
  } catch (error) {
    console.error('Erro ao listar exercícios:', error);
    return [];
  }
}

export async function obterExercicioPorId(id: string): Promise<Exercicio | null> {
  try {
    const linha = await obterLinha<any>('SELECT * FROM exercicios WHERE id = ?', [id]);
    if (!linha) return null;
    return parseExercicio(linha);
  } catch (error) {
    console.error(`Erro ao obter exercício ${id}:`, error);
    return null;
  }
}

export async function buscarSubstitutos(exercicioId: string): Promise<Exercicio[]> {
  try {
    const exercicio = await obterExercicioPorId(exercicioId);
    if (!exercicio || !exercicio.substitutos_mesmo_padrao || exercicio.substitutos_mesmo_padrao.length === 0) {
      return [];
    }
    
    const placeholders = exercicio.substitutos_mesmo_padrao.map(() => '?').join(',');
    const linhas = await obterLinhas<any>(`SELECT * FROM exercicios WHERE id IN (${placeholders})`, exercicio.substitutos_mesmo_padrao);
    return linhas.map(parseExercicio);
  } catch (error) {
    console.error(`Erro ao buscar substitutos para ${exercicioId}:`, error);
    return [];
  }
}

function parseExercicio(linha: any): Exercicio {
  return {
    ...linha,
    grupos_secundarios: linha.grupos_secundarios ? JSON.parse(linha.grupos_secundarios) : undefined,
    equipamento_necessario: linha.equipamento_necessario ? JSON.parse(linha.equipamento_necessario) : undefined,
    articulacoes_estressadas: linha.articulacoes_estressadas ? JSON.parse(linha.articulacoes_estressadas) : undefined,
    nivel_estresse_por_articulacao: linha.nivel_estresse_por_articulacao ? JSON.parse(linha.nivel_estresse_por_articulacao) : undefined,
    dicas_tecnicas: linha.dicas_tecnicas ? JSON.parse(linha.dicas_tecnicas) : undefined,
    erros_comuns: linha.erros_comuns ? JSON.parse(linha.erros_comuns) : undefined,
    referencias: linha.referencias ? JSON.parse(linha.referencias) : undefined,
    substitutos_mesmo_padrao: linha.substitutos_mesmo_padrao ? JSON.parse(linha.substitutos_mesmo_padrao) : undefined,
    contraindicacoes: linha.contraindicacoes ? JSON.parse(linha.contraindicacoes) : undefined,
    faixa_reps_recomendada: linha.faixa_reps_min ? { min: linha.faixa_reps_min, max: linha.faixa_reps_max } : undefined,
    cadencia_recomendada: linha.cadencia_excentrica ? { 
      excentrica: linha.cadencia_excentrica, 
      isometrica: linha.cadencia_isometrica, 
      concentrica: linha.cadencia_concentrica 
    } : undefined,
  };
}
