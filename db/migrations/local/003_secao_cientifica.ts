import * as SQLite from 'expo-sqlite';

/**
 * Migration 003: Criação das tabelas de artigos_cientificos e artigos_lidos no SQLite local.
 * Essencial para o funcionamento offline-first e persistência local da Fase 8.
 */
export async function migration003(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS artigos_cientificos (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      conteudo_markdown TEXT NOT NULL,
      tags TEXT, -- JSON contendo array de tags (ex: ["principios", "hipertrofia"])
      tags_perfil_relacionadas TEXT, -- JSON contendo array de tags relacionadas ao perfil (ex: ["predisposicao_aquiles"])
      tempo_leitura_min INTEGER,
      data_publicacao TEXT, -- Formato YYYY-MM-DD
      referencias TEXT -- JSON contendo array de IDs de referências relacionadas (ex: ["schoenfeld_2016"])
    );

    CREATE TABLE IF NOT EXISTS artigos_lidos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      artigo_id TEXT NOT NULL,
      data_leitura TEXT NOT NULL -- Formato ISO
    );

    -- Índices para otimização de consultas e ordenação reativa
    CREATE INDEX IF NOT EXISTS idx_artigos_lidos_user ON artigos_lidos(user_id);
    CREATE INDEX IF NOT EXISTS idx_artigos_lidos_artigo ON artigos_lidos(artigo_id);
    CREATE INDEX IF NOT EXISTS idx_artigos_lidos_data ON artigos_lidos(data_leitura);
  `);
}
