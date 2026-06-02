import { obterLinhas, obterLinha, executarQuery } from '../local-cache';
import { enqueueChange } from '../sync-engine';
import { supabase } from '../supabase-client';
import { ArtigoCientifico, ArtigoLido } from '../../types/artigo';
import artigosSeed from '../seeds/artigos.json';

function parseArtigoSeed(seed: any): ArtigoCientifico {
  return {
    ...seed,
    tags: seed.tags || [],
    tags_perfil_relacionadas: seed.tags_perfil_relacionadas || [],
    referencias: seed.referencias || []
  };
}

export async function listarArtigos(): Promise<ArtigoCientifico[]> {
  try {
    let linhas = await obterLinhas<any>('SELECT * FROM artigos_cientificos');
    
    // Se o banco local estiver vazio, tentamos buscar no Supabase
    if (linhas.length === 0) {
      console.log('Artigos científicos não encontrados no SQLite. Buscando no Supabase...');
      try {
        const { data, error } = await supabase
          .from('artigos_cientificos')
          .select('*');
          
        if (!error && data && data.length > 0) {
          console.log(`Puxados ${data.length} artigos do Supabase. Salvando localmente...`);
          const artList = data as any[];
          for (const art of artList) {
            await executarQuery(`
              INSERT OR REPLACE INTO artigos_cientificos (
                id, titulo, conteudo_markdown, tags, tags_perfil_relacionadas, tempo_leitura_min, data_publicacao, referencias
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              art.id,
              art.titulo,
              art.conteudo_markdown,
              JSON.stringify(art.tags || []),
              JSON.stringify(art.tags_perfil_relacionadas || []),
              art.tempo_leitura_min,
              art.data_publicacao,
              JSON.stringify(art.referencias || [])
            ]);
          }
          linhas = await obterLinhas<any>('SELECT * FROM artigos_cientificos');
        }
      } catch (err) {
        console.error('Erro ao sincronizar artigos do Supabase:', err);
      }
    }

    // Fallback para sementes locais caso continue vazio (garantia offline absoluta antes do primeiro sync)
    if (linhas.length === 0) {
      console.log('Sem internet e sem cache local. Inicializando com sementes locais...');
      for (const art of artigosSeed) {
        await executarQuery(`
          INSERT OR REPLACE INTO artigos_cientificos (
            id, titulo, conteudo_markdown, tags, tags_perfil_relacionadas, tempo_leitura_min, data_publicacao, referencias
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          art.id,
          art.titulo,
          art.conteudo_markdown,
          JSON.stringify(art.tags),
          JSON.stringify(art.tags_perfil_relacionadas),
          art.tempo_leitura_min,
          art.data_publicacao,
          JSON.stringify(art.referencias)
        ]);
      }
      linhas = await obterLinhas<any>('SELECT * FROM artigos_cientificos');
    }

    return linhas.map(parseArtigo);
  } catch (error) {
    console.error('Erro ao listar artigos científicos:', error);
    return (artigosSeed as any[]).map(parseArtigoSeed);
  }
}

export async function obterArtigoPorId(id: string): Promise<ArtigoCientifico | null> {
  try {
    const linha = await obterLinha<any>('SELECT * FROM artigos_cientificos WHERE id = ?', [id]);
    if (linha) {
      return parseArtigo(linha);
    }

    // Se não achou local, tenta buscar no Supabase
    console.log(`Artigo ${id} não achado localmente. Buscando no Supabase...`);
    const { data, error } = await supabase
      .from('artigos_cientificos')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const resData = data as any;
      await executarQuery(`
        INSERT OR REPLACE INTO artigos_cientificos (
          id, titulo, conteudo_markdown, tags, tags_perfil_relacionadas, tempo_leitura_min, data_publicacao, referencias
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        resData.id,
        resData.titulo,
        resData.conteudo_markdown,
        JSON.stringify(resData.tags || []),
        JSON.stringify(resData.tags_perfil_relacionadas || []),
        resData.tempo_leitura_min,
        resData.data_publicacao,
        JSON.stringify(resData.referencias || [])
      ]);
      return parseArtigo(resData);
    }

    return null;
  } catch (error) {
    console.error(`Erro ao obter artigo ${id}:`, error);
    return null;
  }
}

export async function marcarArtigoLidoNoBanco(artigoId: string, userId: string = 'default'): Promise<void> {
  try {
    const id = `${userId}_${artigoId}`;
    const dataLeitura = new Date().toISOString();

    // Salva no SQLite local
    await executarQuery(`
      INSERT OR REPLACE INTO artigos_lidos (id, user_id, artigo_id, data_leitura)
      VALUES (?, ?, ?, ?)
    `, [id, userId, artigoId, dataLeitura]);

    // Enfileira sincronização remota
    await enqueueChange('artigos_lidos', 'INSERT', {
      id,
      user_id: userId,
      artigo_id: artigoId,
      data_leitura: dataLeitura
    });

    console.log(`Artigo ${artigoId} marcado como lido localmente e enfileirado para sync.`);
  } catch (error) {
    console.error('Erro ao marcar artigo como lido no banco:', error);
    throw error;
  }
}

export async function obterArtigosLidos(userId: string = 'default'): Promise<string[]> {
  try {
    const rows = await obterLinhas<{ artigo_id: string }>(
      'SELECT artigo_id FROM artigos_lidos WHERE user_id = ?',
      [userId]
    );
    return rows.map(r => r.artigo_id);
  } catch (error) {
    console.error('Erro ao carregar artigos lidos:', error);
    return [];
  }
}

function parseArtigo(linha: any): ArtigoCientifico {
  return {
    ...linha,
    tags: typeof linha.tags === 'string' ? JSON.parse(linha.tags) : (linha.tags || []),
    tags_perfil_relacionadas: typeof linha.tags_perfil_relacionadas === 'string' 
      ? JSON.parse(linha.tags_perfil_relacionadas) 
      : (linha.tags_perfil_relacionadas || []),
    referencias: typeof linha.referencias === 'string' ? JSON.parse(linha.referencias) : (linha.referencias || [])
  };
}
