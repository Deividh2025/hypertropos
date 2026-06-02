import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  try {
    // Utiliza a API moderna de expo-sqlite
    db = await SQLite.openDatabaseAsync('hypertropos.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);
    return db;
  } catch (error) {
    console.error('Erro crítico ao instanciar ou configurar o banco SQLite:', error);
    throw error;
  }
}

export async function executarQuery(sql: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
  try {
    const database = await getDb();
    return await database.runAsync(sql, params);
  } catch (error) {
    console.error(`Erro ao executar query [${sql}] com params [${params}]:`, error);
    // Retorna resultado vazio padrão para evitar quebra de fluxo
    return { changes: 0, lastInsertRowId: 0 };
  }
}

export async function obterLinha<T>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    const database = await getDb();
    return await database.getFirstAsync<T>(sql, params);
  } catch (error) {
    console.error(`Erro ao obter primeira linha de [${sql}] com params [${params}]:`, error);
    return null;
  }
}

export async function obterLinhas<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const database = await getDb();
    return await database.getAllAsync<T>(sql, params);
  } catch (error) {
    console.error(`Erro ao obter linhas de [${sql}] com params [${params}]:`, error);
    return [];
  }
}
