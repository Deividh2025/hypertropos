import { obterLinhas, obterLinha, executarQuery } from '../local-cache';
import { enqueueChange } from '../sync-engine';
import { supabase } from '../supabase-client';
import { ArtigoCientifico, ArtigoLido } from '../../types/artigo';

const ARTIGOS_MOCK_SEEDS = [
  {
    id: "01_o_que_constroi_musculo",
    titulo: "O Que de Fato Constrói Músculo",
    conteudo_markdown: "# O Que de Fato Constrói Músculo\n\nO músculo esquelético humano é um tecido altamente adaptável que responde a estímulos mecânicos específicos. Ao contrário do que a indústria do fitness frequentemente propaga, o músculo não reconhece o instrumento utilizado — seja ele uma barra de 100 kg, um halter emborrachado ou o peso do seu próprio corpo contra a gravidade.\n\n## 1. O Estímulo Central: Tensão Mecânica\n\nA literatura científica consolidada (Schoenfeld, 2016; Wackerhage, 2019) demonstra que o principal driver da hipertrofia muscular é a **tensão mecânica**. A tensão mecânica ocorre quando as fibras musculares são forçadas a produzir força enquanto são alongadas ou encurtadas. \n\nPara que essa tensão resulte em sinalização anabólica significativa (ativando vias como a mTORC1), as séries de exercícios precisam ser realizadas com um alto nível de esforço, aproximando-se da falha muscular concêntrica.\n\n## 2. Equivalência de Carga\n\nEstudos marcantes (como os de Schoenfeld et al.) confirmam que treinar com cargas leves (por exemplo, 30% de 1RM, típicas de exercícios calistênicos com muitas repetições) gera um ganho de massa muscular equivalente a treinar com cargas pesadas (80% de 1RM), desde que o esforço de cada série seja similar (ou seja, levando a série próximo do limite de falha técnica).\n\n> **Regra de Ouro:** A gravidade é o seu halter. A forma como você posiciona seu corpo no espaço determina a sobrecarga aplicada sobre cada articulação.\n\n## 3. Aplicação Prática\n\nSe você realizar flexões de braço com controle, cadência excêntrica intencional e amplitude completa, indo até restarem apenas 1 ou 2 repetições na reserva (RIR 1-2), o sinal hipertrófico gerado em seu peitoral e tríceps será indistinguível daquele gerado por um supino com barra na mesma intensidade relativa.",
    tags: ["principios_fundamentais", "hipertrofia"],
    tags_perfil_relacionadas: [],
    tempo_leitura_min: 3,
    data_publicacao: "2026-05-25",
    referencias: ["schoenfeld_2016", "wackerhage_2019", "pedrosa_2022"]
  }
];

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
      for (const art of ARTIGOS_MOCK_SEEDS) {
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
    return [];
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
