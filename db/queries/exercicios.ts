import { obterLinhas, obterLinha, executarQuery } from '../local-cache';
import { Exercicio } from '../../types';
import { supabase } from '../supabase-client';
import exerciciosSeed from '../seeds/exercicios.json';

function safeStringify(val: any): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}

async function salvarExercicioLocal(exe: any) {
  try {
    await executarQuery(`
      INSERT OR REPLACE INTO exercicios (
        id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
        padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
        grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
        descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
        referencias, variacao_anterior, variacao_proxima, substitutos_mesmo_padrao,
        faixa_reps_min, faixa_reps_max, cadencia_excentrica, cadencia_isometrica,
        cadencia_concentrica, descanso_recomendado_seg, contraindicacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      exe.id,
      exe.nome,
      exe.nome_alternativo,
      exe.grupo_muscular_primario,
      safeStringify(exe.grupos_secundarios),
      exe.padrao_movimento,
      exe.nivel_minimo,
      exe.nivel_escada,
      safeStringify(exe.equipamento_necessario),
      exe.grf_percentual,
      safeStringify(exe.articulacoes_estressadas),
      safeStringify(exe.nivel_estresse_por_articulacao),
      exe.descricao_execucao,
      safeStringify(exe.dicas_tecnicas),
      safeStringify(exe.erros_comuns),
      exe.midia_url,
      exe.frase_cientifica_curta,
      safeStringify(exe.referencias),
      exe.variacao_anterior,
      exe.variacao_proxima,
      safeStringify(exe.substitutos_mesmo_padrao),
      exe.faixa_reps_recomendada?.min ?? null,
      exe.faixa_reps_recomendada?.max ?? null,
      exe.cadencia_recomendada?.excentrica ?? null,
      exe.cadencia_recomendada?.isometrica ?? null,
      exe.cadencia_recomendada?.concentrica ?? null,
      exe.descanso_recomendado_seg ?? null,
      safeStringify(exe.contraindicacoes)
    ]);
  } catch (error) {
    console.error(`Erro ao salvar exercício ${exe.id} localmente:`, error);
  }
}

export async function listarExercicios(filtros?: Partial<Exercicio>): Promise<Exercicio[]> {
  try {
    let linhas = await obterLinhas<any>('SELECT * FROM exercicios');
    
    // Se o banco local estiver vazio, tentamos buscar no Supabase
    if (linhas.length === 0) {
      console.log('Exercícios não encontrados no SQLite. Buscando no Supabase...');
      try {
        const { data, error } = await supabase
          .from('exercicios')
          .select('*');
          
        if (!error && data && data.length > 0) {
          console.log(`Puxados ${data.length} exercícios do Supabase. Salvando localmente...`);
          for (const exe of data) {
            await salvarExercicioLocal(exe);
          }
          linhas = await obterLinhas<any>('SELECT * FROM exercicios');
        }
      } catch (err) {
        console.error('Erro ao sincronizar exercícios do Supabase:', err);
      }
    }

    // Fallback para sementes locais caso continue vazio (offline absoluto)
    if (linhas.length === 0) {
      console.log('Sem internet e sem cache local de exercícios. Inicializando com sementes JSON...');
      for (const exe of exerciciosSeed) {
        await salvarExercicioLocal(exe);
      }
      linhas = await obterLinhas<any>('SELECT * FROM exercicios');
    }

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
    // Último recurso síncrono absoluto
    const fallbacks = (exerciciosSeed as any[]).map(x => ({
      ...x,
      referencias: x.referencias || [],
      contraindicacoes: x.contraindicacoes || [],
    } as Exercicio));

    if (!filtros) return fallbacks;
    return fallbacks.filter(ex => {
      let matches = true;
      if (filtros.grupo_muscular_primario && ex.grupo_muscular_primario !== filtros.grupo_muscular_primario) matches = false;
      if (filtros.padrao_movimento && ex.padrao_movimento !== filtros.padrao_movimento) matches = false;
      if (filtros.nivel_minimo && ex.nivel_minimo !== filtros.nivel_minimo) matches = false;
      return matches;
    });
  }
}

export async function obterExercicioPorId(id: string): Promise<Exercicio | null> {
  try {
    const linha = await obterLinha<any>('SELECT * FROM exercicios WHERE id = ?', [id]);
    if (linha) return parseExercicio(linha);

    // Tenta obter do Supabase se não estiver no banco local
    console.log(`Exercício ${id} não encontrado localmente. Buscando no Supabase...`);
    const { data, error } = await supabase
      .from('exercicios')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      await salvarExercicioLocal(data);
      return parseExercicio(data);
    }

    // Fallback final: busca no JSON local
    const seed = exerciciosSeed.find(e => e.id === id);
    if (seed) {
      return {
        ...seed,
        referencias: seed.referencias || [],
        contraindicacoes: seed.contraindicacoes || [],
      } as Exercicio;
    }

    return null;
  } catch (error) {
    console.error(`Erro ao obter exercício ${id}:`, error);
    const seed = exerciciosSeed.find(e => e.id === id);
    if (seed) {
      return {
        ...seed,
        referencias: seed.referencias || [],
        contraindicacoes: seed.contraindicacoes || [],
      } as Exercicio;
    }
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
    
    // Se o banco local retornou menos itens que a lista de substitutos, busca os faltantes
    if (linhas.length < exercicio.substitutos_mesmo_padrao.length) {
      const resultados: Exercicio[] = [];
      for (const id of exercicio.substitutos_mesmo_padrao) {
        const sub = await obterExercicioPorId(id);
        if (sub) resultados.push(sub);
      }
      return resultados;
    }
    
    return linhas.map(parseExercicio);
  } catch (error) {
    console.error(`Erro ao buscar substitutos para ${exercicioId}:`, error);
    return [];
  }
}

function parseExercicio(linha: any): Exercicio {
  return {
    ...linha,
    grupos_secundarios: typeof linha.grupos_secundarios === 'string' ? JSON.parse(linha.grupos_secundarios) : (linha.grupos_secundarios || []),
    equipamento_necessario: typeof linha.equipamento_necessario === 'string' ? JSON.parse(linha.equipamento_necessario) : (linha.equipamento_necessario || []),
    articulacoes_estressadas: typeof linha.articulacoes_estressadas === 'string' ? JSON.parse(linha.articulacoes_estressadas) : (linha.articulacoes_estressadas || []),
    nivel_estresse_por_articulacao: typeof linha.nivel_estresse_por_articulacao === 'string' ? JSON.parse(linha.nivel_estresse_por_articulacao) : (linha.nivel_estresse_por_articulacao || {}),
    dicas_tecnicas: typeof linha.dicas_tecnicas === 'string' ? JSON.parse(linha.dicas_tecnicas) : (linha.dicas_tecnicas || []),
    erros_comuns: typeof linha.erros_comuns === 'string' ? JSON.parse(linha.erros_comuns) : (linha.erros_comuns || []),
    referencias: typeof linha.referencias === 'string' ? JSON.parse(linha.referencias) : (linha.referencias || []),
    substitutos_mesmo_padrao: typeof linha.substitutos_mesmo_padrao === 'string' ? JSON.parse(linha.substitutos_mesmo_padrao) : (linha.substitutos_mesmo_padrao || []),
    contraindicacoes: typeof linha.contraindicacoes === 'string' ? JSON.parse(linha.contraindicacoes) : (linha.contraindicacoes || []),
    faixa_reps_recomendada: linha.faixa_reps_min ? { min: linha.faixa_reps_min, max: linha.faixa_reps_max } : undefined,
    cadencia_recomendada: linha.cadencia_excentrica ? { 
      excentrica: linha.cadencia_excentrica, 
      isometrica: linha.cadencia_isometrica, 
      concentrica: linha.cadencia_concentrica 
    } : undefined,
  };
}
