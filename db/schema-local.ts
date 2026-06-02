import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDb } from './local-cache';
import { migration001 } from './migrations/local/001_initial_schema';
import { migration002 } from './migrations/local/002_nutrition_notifications';
import { migration003 } from './migrations/local/003_secao_cientifica';

import exerciciosSeed from './seeds/exercicios.json';
import referenciasSeed from './seeds/referencias.json';
import suplementosSeed from './seeds/suplementos.json';
import artigosSeed from './seeds/artigos.json';

export const LOCAL_SCHEMA_VERSION = 3;
const SCHEMA_VERSION_KEY = 'local_schema_version';

const migrations = [
  { version: 1, up: migration001 },
  { version: 2, up: migration002 },
  { version: 3, up: migration003 },
];

function safeStringify(val: any): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}

async function seedDatabaseIfNeeded(db: any) {
  console.log('Verificando necessidade de popular dados locais...');
  
  // 1. Referencias
  try {
    const rowRef = await db.getFirstAsync('SELECT COUNT(*) as count FROM referencias_cientificas');
    if (rowRef && rowRef.count === 0) {
      console.log('Populando referencias_cientificas...');
      await db.withTransactionAsync(async () => {
        for (const ref of (referenciasSeed as any[])) {
          await db.runAsync(`
            INSERT OR REPLACE INTO referencias_cientificas (
              id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            ref.id,
            ref.autores,
            ref.ano,
            ref.titulo,
            ref.periodico,
            ref.url,
            ref.sintese_acessivel,
            safeStringify(ref.tags)
          ]);
        }
      });
      console.log('referencias_cientificas populado com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao popular referencias_cientificas:', err);
  }

  // 2. Exercicios
  try {
    const rowExe = await db.getFirstAsync('SELECT COUNT(*) as count FROM exercicios');
    if (rowExe && rowExe.count === 0) {
      console.log('Populando exercicios...');
      await db.withTransactionAsync(async () => {
        for (const exe of (exerciciosSeed as any[])) {
          await db.runAsync(`
            INSERT OR REPLACE INTO exercicios (
              id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
              padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
              grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
              descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
              referencias, variacao_anterior, variacao_proxima, substitutos_mesmo_padrao,
              faixa_reps_min, faixa_reps_max, cadencia_excentrica, cadencia_isometrica,
              cadencia_concentrica, descanso_recomendado_seg, contraindicacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            exe.id,
            exe.nome,
            exe.nome_alternativo,
            exe.grupo_muscular_primario,
            safeStringify(exe.grupos_secundarios),
            exe.padrao_movimento,
            exe.nivel_minimo,
            exe.nivel_escada,
            safeStringify(exe.equipamento_necessario),
            exe.grf_percentual,
            safeStringify(exe.articulacoes_estressadas),
            safeStringify(exe.nivel_estresse_por_articulacao),
            exe.descricao_execucao,
            safeStringify(exe.dicas_tecnicas),
            safeStringify(exe.erros_comuns),
            exe.midia_url,
            exe.frase_cientifica_curta,
            safeStringify(exe.referencias),
            exe.variacao_anterior,
            exe.variacao_proxima,
            safeStringify(exe.substitutos_mesmo_padrao),
            exe.faixa_reps_recomendada?.min ?? null,
            exe.faixa_reps_recomendada?.max ?? null,
            exe.cadencia_recomendada?.excentrica ?? null,
            exe.cadencia_recomendada?.isometrica ?? null,
            exe.cadencia_recomendada?.concentrica ?? null,
            exe.descanso_recomendado_seg ?? null,
            safeStringify(exe.contraindicacoes)
          ]);
        }
      });
      console.log('exercicios populado com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao popular exercicios:', err);
  }

  // 3. Suplementos
  try {
    const rowSup = await db.getFirstAsync('SELECT COUNT(*) as count FROM suplementos');
    if (rowSup && rowSup.count === 0) {
      console.log('Populando suplementos...');
      await db.withTransactionAsync(async () => {
        for (const sup of (suplementosSeed as any[])) {
          await db.runAsync(`
            INSERT OR REPLACE INTO suplementos (
              id, nome, grau_evidencia, dose_recomendada, horario_recomendado,
              descricao_curta, mecanismo_acao, referencias_ids
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            sup.id,
            sup.nome,
            sup.nivel_evidencia || sup.grau_evidencia,
            sup.dose_padrao || sup.dose_recomendada,
            sup.timing_recomendado || sup.horario_recomendado,
            sup.mecanismo_resumido || sup.descricao_curta,
            sup.mecanismo_acao,
            safeStringify(sup.referencias || sup.referencias_ids)
          ]);
        }
      });
      console.log('suplementos populado com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao popular suplementos:', err);
  }

  // 4. Artigos cientificos
  try {
    const rowArt = await db.getFirstAsync('SELECT COUNT(*) as count FROM artigos_cientificos');
    if (rowArt && rowArt.count === 0) {
      console.log('Populando artigos_cientificos...');
      await db.withTransactionAsync(async () => {
        for (const art of (artigosSeed as any[])) {
          await db.runAsync(`
            INSERT OR REPLACE INTO artigos_cientificos (
              id, titulo, conteudo_markdown, tags, tags_perfil_relacionadas,
              tempo_leitura_min, data_publicacao, referencias
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            art.id,
            art.titulo,
            art.conteudo_markdown,
            safeStringify(art.tags),
            safeStringify(art.tags_perfil_relacionadas),
            art.tempo_leitura_min,
            art.data_publicacao,
            safeStringify(art.referencias)
          ]);
        }
      });
      console.log('artigos_cientificos populado com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao popular artigos_cientificos:', err);
  }
}

export async function initializeSchema() {
  try {
    const versionStr = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    let currentVersion = versionStr ? parseInt(versionStr, 10) : 0;

    let db;
    try {
      db = await getDb();
    } catch (dbError) {
      console.error('Erro crítico ao abrir conexão do banco de dados para migrações:', dbError);
      return;
    }

    if (currentVersion < LOCAL_SCHEMA_VERSION) {
      console.log(`Atualizando schema local da versão ${currentVersion} para ${LOCAL_SCHEMA_VERSION}`);
      for (const migration of migrations) {
        if (migration.version > currentVersion) {
          console.log(`Rodando migration ${migration.version}...`);
          try {
            await migration.up(db);
            currentVersion = migration.version;
            await AsyncStorage.setItem(SCHEMA_VERSION_KEY, currentVersion.toString());
          } catch (migrationError) {
            console.error(`Falha crítica na migração versão ${migration.version}:`, migrationError);
            break;
          }
        }
      }
      console.log('Migrações locais concluídas ou tratadas de forma resiliente.');
    }

    // Sempre verifica e popula os dados estáticos locais se estiverem vazios
    await seedDatabaseIfNeeded(db);

  } catch (error) {
    console.error('Erro ao inicializar schema local:', error);
  }
}
