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
      let db;
      try {
        db = await getDb();
      } catch (dbError) {
        console.error('Erro crítico ao abrir conexão do banco de dados para migrações:', dbError);
        return;
      }
      
      for (const migration of migrations) {
        if (migration.version > currentVersion) {
          console.log(`Rodando migration ${migration.version}...`);
          try {
            await migration.up(db);
            currentVersion = migration.version;
            await AsyncStorage.setItem(SCHEMA_VERSION_KEY, currentVersion.toString());
          } catch (migrationError) {
            console.error(`Falha crítica na migração versão ${migration.version}:`, migrationError);
            // Interrompe o loop de migrações para evitar novos erros sequenciais, mas sem crashar.
            break;
          }
        }
      }
      console.log('Migrações locais concluídas ou tratadas de forma resiliente.');
    }
  } catch (error) {
    console.error('Erro ao inicializar schema local:', error);
  }
}
