import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { supabase } from './supabase-client';
import { getSyncUserId } from './identity';

const SYNC_QUEUE_KEY = 'sync_queue';

interface SyncOperation {
  id: string;
  tabela: string;
  operacao: 'INSERT' | 'UPDATE' | 'DELETE';
  dados: any;
  timestamp: number;
  tentativas: number;
}

export async function enqueueChange(tabela: string, operacao: 'INSERT' | 'UPDATE' | 'DELETE', dados: any) {
  try {
    const queueStr = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const queue: SyncOperation[] = queueStr ? JSON.parse(queueStr) : [];

    queue.push({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      tabela,
      operacao,
      dados,
      timestamp: Date.now(),
      tentativas: 0,
    });

    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    console.log(`Mutação adicionada à fila: ${operacao} em ${tabela}`);
  } catch (error) {
    console.error('Erro ao adicionar à fila de sync:', error);
  }
}

// ============================================================================
// Camada de tradução local -> Supabase
// ----------------------------------------------------------------------------
// O esquema do SQLite local e o do Supabase divergem em nomes de colunas,
// identidade (perfil_id) e tipos. Centralizamos AQUI toda a normalização para
// que os call sites continuem enfileirando no formato local, sem duplicar
// lógica de tradução por todo o código.
// ============================================================================

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseMaybeJson(v: any): any {
  if (typeof v !== 'string') return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

function toDateOnly(v: any): string | null {
  if (!v) return null;
  try {
    return new Date(v).toISOString().split('T')[0];
  } catch {
    return null;
  }
}

/**
 * Converte o payload local para o formato exato esperado pelo Supabase.
 * Retorna `null` quando o item não deve ser sincronizado (ex.: id inválido
 * ou tabela desconhecida) — nesse caso ele é descartado da fila com segurança.
 */
function transformarParaSupabase(tabela: string, dados: any, uid: string): any | null {
  switch (tabela) {
    case 'perfil_usuario': {
      const d = { ...dados };
      // Colunas locais que não existem no Supabase (lá são created_at/updated_at)
      delete d.data_criacao;
      delete d.ultima_atualizacao;
      return {
        ...d,
        id: uid,
        equipamento_disponivel: parseMaybeJson(d.equipamento_disponivel) ?? [],
        historico_clinico: parseMaybeJson(d.historico_clinico) ?? [],
        restricoes_articulares: parseMaybeJson(d.restricoes_articulares) ?? [],
        lembretes_ativos: parseMaybeJson(d.lembretes_ativos) ?? {},
        usa_creatina: d.usa_creatina === 1 || d.usa_creatina === true,
        usa_cafeina: d.usa_cafeina === 1 || d.usa_cafeina === true,
      };
    }

    case 'gamificacao':
      // 1:1 com o perfil -> usamos o uid como id e perfil_id (upsert por PK)
      return {
        id: uid,
        perfil_id: uid,
        xp_total: dados.xp_total ?? 0,
        nivel_atual: dados.nivel_atual ?? 1,
        streak_atual: dados.streak_atual ?? 0,
        maior_streak: dados.streak_maximo ?? dados.maior_streak ?? 0,
        freezes_disponiveis: dados.freezes_disponiveis ?? 0,
        ultimo_treino_data: toDateOnly(dados.ultima_atividade ?? dados.ultimo_treino_data),
      };

    case 'estado_silhueta':
      // 1:1 com o perfil; colunas locais sem sufixo -> *_nivel no Supabase
      return {
        id: uid,
        perfil_id: uid,
        tier_atual: dados.tier_atual ?? 'bronze',
        peito_nivel: dados.peito ?? dados.peito_nivel ?? 0,
        costas_nivel: dados.costas ?? dados.costas_nivel ?? 0,
        ombros_nivel: dados.ombros ?? dados.ombros_nivel ?? 0,
        bracos_nivel: dados.bracos ?? dados.bracos_nivel ?? 0,
        quadriceps_nivel: dados.quadriceps ?? dados.quadriceps_nivel ?? 0,
        posterior_nivel: dados.posterior ?? dados.posterior_nivel ?? 0,
        gluteo_nivel: dados.gluteo ?? dados.gluteo_nivel ?? 0,
        panturrilha_nivel: dados.panturrilha ?? dados.panturrilha_nivel ?? 0,
        core_nivel: dados.core ?? dados.core_nivel ?? 0,
        ultima_atualizacao: dados.ultima_atualizacao ?? new Date().toISOString(),
      };

    case 'conquistas_desbloqueadas':
      // PK composta (perfil_id, conquista_id); sem coluna id no Supabase
      return {
        perfil_id: uid,
        conquista_id: dados.conquista_id,
        data_desbloqueio: dados.desbloqueada_em ?? dados.data_desbloqueio ?? new Date().toISOString(),
      };

    case 'registros_execucao':
      return { ...dados, perfil_id: uid };

    case 'series_executadas':
      // Shape já compatível; escopo de RLS vem via registro_id
      return { ...dados };

    case 'historico_peso_corporal':
      return { ...dados, perfil_id: uid };

    case 'lembretes': {
      // id precisa ser UUID válido (PK uuid no Supabase); senão, descarta com segurança
      if (!UUID_RE.test(String(dados.id || ''))) return null;
      const d = { ...dados };
      delete d.notification_id; // coluna não existe no Supabase
      return {
        ...d,
        perfil_id: uid,
        dias_semana: Array.isArray(d.dias_semana) ? d.dias_semana : parseMaybeJson(d.dias_semana) ?? [],
        ativo: d.ativo === 1 || d.ativo === true,
      };
    }

    case 'artigos_lidos':
      return {
        id: dados.id,
        perfil_id: uid,
        artigo_id: dados.artigo_id,
        data_leitura: dados.data_leitura ?? new Date().toISOString(),
      };

    case 'programa_ativo':
      return { ...dados, perfil_id: uid, ativo: dados.ativo !== false };

    case 'sessoes_template':
    case 'exercicios_prescritos':
      // Shapes já compatíveis; escopo de RLS vem via tabela-pai
      return { ...dados };

    default:
      console.warn(`[SYNC] Tabela desconhecida na fila ("${tabela}"). Item descartado.`);
      return null;
  }
}

let isSyncing = false;

export async function processSyncQueue() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const queueStr = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    let queue: SyncOperation[] = queueStr ? JSON.parse(queueStr) : [];

    if (queue.length === 0) {
      isSyncing = false;
      return;
    }

    // Sem identidade de sync, os writes seriam bloqueados pela RLS.
    // Mantemos a fila intacta para reenviar quando a identidade existir.
    const uid = getSyncUserId();
    if (!uid) {
      console.log(`Sync adiado: ${queue.length} itens aguardando identidade (login anônimo).`);
      isSyncing = false;
      return;
    }

    console.log(`Processando fila de sync com ${queue.length} itens...`);

    const failedItems: SyncOperation[] = [];

    for (const item of queue) {
      let success = false;
      try {
        if (item.operacao === 'INSERT' || item.operacao === 'UPDATE') {
          const payload = transformarParaSupabase(item.tabela, item.dados, uid);
          if (payload === null) {
            // Item não-sincronizável (id inválido / tabela desconhecida): descarta
            success = true;
          } else {
            const { error } = await supabase.from(item.tabela).upsert(payload);
            if (error) throw error;
            success = true;
          }
        } else if (item.operacao === 'DELETE') {
          const { error } = await supabase.from(item.tabela).delete().eq('id', item.dados.id);
          if (error) throw error;
          success = true;
        }
      } catch (error) {
        console.error(`Falha ao sincronizar item ${item.id} (${item.tabela}):`, error);
        item.tentativas += 1;

        if (item.tentativas < 10) {
          failedItems.push(item);
        } else {
          console.warn(
            `Descartando item ${item.id} da tabela ${item.tabela} após 10 tentativas malsucedidas.`,
            item.dados
          );
        }
      }

      if (!success) {
        // já tratado acima (failedItems / descarte)
      }
    }

    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(failedItems));
    if (failedItems.length > 0) {
      console.log(`${failedItems.length} itens falharam e continuam na fila.`);
    } else {
      console.log('Fila de sync processada com sucesso.');
    }
  } catch (error) {
    console.error('Erro crítico no processSyncQueue:', error);
  } finally {
    isSyncing = false;
  }
}

export function useSyncEngine(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    // Processa na inicialização
    processSyncQueue();

    // Configura polling a cada 30 segundos
    const intervalId = setInterval(() => {
      if (AppState.currentState === 'active') {
        processSyncQueue();
      }
    }, 30000);

    // Escuta mudanças de estado do app
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        processSyncQueue();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [enabled]);
}
