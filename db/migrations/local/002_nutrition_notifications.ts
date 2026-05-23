import * as SQLite from 'expo-sqlite';

/**
 * Migration 002: Criação das tabelas de historico_peso_corporal e lembretes no SQLite local.
 * Essencial para o funcionamento offline-first e persistência local da Fase 9.
 */
export async function migration002(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS historico_peso_corporal (
      id TEXT PRIMARY KEY,
      perfil_id TEXT NOT NULL,
      peso_kg REAL NOT NULL,
      data_registro TEXT NOT NULL, -- Formato YYYY-MM-DD para compatibilidade e agrupamento
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lembretes (
      id TEXT PRIMARY KEY,
      perfil_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      hora_disparo TEXT NOT NULL, -- Formato HH:MM
      dias_semana TEXT, -- JSON contendo array de dias da semana (ex: ["seg", "qua", "sex"])
      ativo INTEGER DEFAULT 1, -- 0 para inativo, 1 para ativo
      mensagem_personalizada TEXT,
      notification_id TEXT, -- ID retornado pelo expo-notifications para cancelamento do SO
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Índices para otimização de consultas
    CREATE INDEX IF NOT EXISTS idx_historico_peso_perfil ON historico_peso_corporal(perfil_id);
    CREATE INDEX IF NOT EXISTS idx_historico_peso_data ON historico_peso_corporal(data_registro);
    CREATE INDEX IF NOT EXISTS idx_lembretes_perfil ON lembretes(perfil_id);
  `);
}
