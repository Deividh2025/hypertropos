import { obterLinhas, obterLinha } from '../local-cache';
import { Suplemento } from '../../types';

export async function listarSuplementos(): Promise<Suplemento[]> {
  try {
    const linhas = await obterLinhas<any>('SELECT * FROM suplementos');
    return linhas.map(parseSuplemento);
  } catch (error) {
    console.error('Erro ao listar suplementos:', error);
    return [];
  }
}

export async function obterSuplementoPorId(id: string): Promise<Suplemento | null> {
  try {
    const linha = await obterLinha<any>('SELECT * FROM suplementos WHERE id = ?', [id]);
    if (!linha) return null;
    return parseSuplemento(linha);
  } catch (error) {
    console.error(`Erro ao obter suplemento ${id}:`, error);
    return null;
  }
}

function parseSuplemento(linha: any): Suplemento {
  return {
    ...linha,
    referencias_ids: linha.referencias_ids ? JSON.parse(linha.referencias_ids) : undefined,
  };
}
