import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  // Utiliza a API moderna de expo-sqlite
  db = await SQLite.openDatabaseAsync('hypertropos.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);
  return db;
}

export async function executarQuery(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
  const database = await getDb();
  return await database.runAsync(sql, params);
}

export async function obterLinha<T>(sql: string, params: any[] = []): Promise<T | null> {
  const database = await getDb();
  return await database.getFirstAsync<T>(sql, params);
}

export async function obterLinhas<T>(sql: string, params: any[] = []): Promise<T[]> {
  const database = await getDb();
  return await database.getAllAsync<T>(sql, params);
}
