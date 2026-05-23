import { ArtigoCientifico } from '../types/artigo';
import { Perfil } from '../types/perfil';

/**
 * Mapeia o perfil do usuário para uma lista de tags de interesse correspondentes.
 */
export function obterTagsInteresseDoPerfil(perfil: Perfil): string[] {
  const tagsInteresse: string[] = [];

  if (perfil.usa_creatina) {
    tagsInteresse.push('usa_creatina');
  }
  if (perfil.usa_cafeina) {
    tagsInteresse.push('usa_cafeina');
  }

  // Parse restrições articulares
  let restricoes: any[] = [];
  if (perfil.restricoes_articulares) {
    try {
      restricoes = typeof perfil.restricoes_articulares === 'string'
        ? JSON.parse(perfil.restricoes_articulares)
        : perfil.restricoes_articulares;
    } catch (e) {
      console.error('Erro ao fazer parse das restrições no personalizador:', e);
    }
  }

  if (Array.isArray(restricoes)) {
    for (const rest of restricoes) {
      if (!rest) continue;
      const regiao = (typeof rest === 'string'
        ? rest
        : rest.regiao || rest.articulacao || ''
      ).toLowerCase();
      if (regiao.includes('joelho')) {
        tagsInteresse.push('predisposicao_joelho');
      }
      if (regiao.includes('quadril')) {
        tagsInteresse.push('predisposicao_quadril');
      }
      if (regiao.includes('aquiles')) {
        tagsInteresse.push('predisposicao_aquiles');
      }
    }
  }

  // Se o nível for iniciante ou tem histórico clínico de pausa longa
  if (perfil.nivel === 'iniciante') {
    tagsInteresse.push('retorno_ao_treino');
  }

  return tagsInteresse;
}

/**
 * Ordena a lista de artigos científicos colocando os que dão match com o perfil do usuário no topo.
 */
export function ordenarArtigosPorPerfil(artigos: ArtigoCientifico[], perfil: Perfil | null): ArtigoCientifico[] {
  if (!perfil) return [...artigos].sort((a, b) => a.titulo.localeCompare(b.titulo));

  const tagsInteresse = obterTagsInteresseDoPerfil(perfil);

  return [...artigos].sort((a, b) => {
    // Conta quantos matches a tem com o perfil do usuário
    const matchesA = a.tags_perfil_relacionadas.filter(tag => tagsInteresse.includes(tag)).length;
    const matchesB = b.tags_perfil_relacionadas.filter(tag => tagsInteresse.includes(tag)).length;

    if (matchesA !== matchesB) {
      return matchesB - matchesA; // Ordem decrescente de matches (mais matches no topo)
    }

    // Se empatar, ordena por data de publicação (mais recentes primeiro) ou por título
    const dataA = new Date(a.data_publicacao || '1970-01-01').getTime();
    const dataB = new Date(b.data_publicacao || '1970-01-01').getTime();
    
    if (dataA !== dataB) {
      return dataB - dataA;
    }
    
    return a.titulo.localeCompare(b.titulo);
  });
}

/**
 * Retorna as sugestões de artigos não lidos mais relevantes para o usuário.
 */
export function obterArtigosSugeridos(
  artigos: ArtigoCientifico[],
  perfil: Perfil | null,
  artigosLidosIds: string[],
  limit: number = 3
): ArtigoCientifico[] {
  // Filtra apenas os não lidos
  const naoLidos = artigos.filter(art => !artigosLidosIds.includes(art.id));
  
  // Ordena por afinidade ao perfil
  const ordenados = ordenarArtigosPorPerfil(naoLidos, perfil);
  
  // Retorna os top N
  return ordenados.slice(0, limit);
}
