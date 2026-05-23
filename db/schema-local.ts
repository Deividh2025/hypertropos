import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDb } from './local-cache';
import { migration001 } from './migrations/local/001_initial_schema';
import { migration002 } from './migrations/local/002_nutrition_notifications';
import { migration003 } from './migrations/local/003_secao_cientifica';

export const LOCAL_SCHEMA_VERSION = 3;
const SCHEMA_VERSION_KEY = 'local_schema_version';

const migrations = [
  { version: 1, up: migration001 },
  { version: 2, up: migration002 },
  { version: 3, up: migration003 },
];

export async function initializeSchema() {
  try {
    const versionStr = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    let currentVersion = versionStr ? parseInt(versionStr, 10) : 0;

    if (currentVersion < LOCAL_SCHEMA_VERSION) {
      console.log(`Atualizando schema local da versão ${currentVersion} para ${LOCAL_SCHEMA_VERSION}`);
      const db = await getDb();
      
      for (const migration of migrations) {
        if (migration.version > currentVersion) {
          console.log(`Rodando migration ${migration.version}...`);
          await migration.up(db);
          currentVersion = migration.version;
          await AsyncStorage.setItem(SCHEMA_VERSION_KEY, currentVersion.toString());
        }
      }
      console.log('Migrações locais concluídas com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao inicializar schema local:', error);
  }
}
