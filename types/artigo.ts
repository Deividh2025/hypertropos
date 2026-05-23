export interface ArtigoCientifico {
  id: string;
  titulo: string;
  conteudo_markdown: string;
  tags: string[]; // No SQLite guardamos JSON e no TypeScript mapeamos para string[]
  tags_perfil_relacionadas: string[]; // No SQLite guardamos JSON e no TypeScript mapeamos para string[]
  tempo_leitura_min: number;
  data_publicacao: string; // Formato YYYY-MM-DD
  referencias: string[]; // IDs de referências científicas do artigo
}

export interface ArtigoLido {
  id: string;
  user_id: string;
  artigo_id: string;
  data_leitura: string; // Formato ISO
}
