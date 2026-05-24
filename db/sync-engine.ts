import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { supabase } from './supabase-client';

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
    
    console.log(`Processando fila de sync com ${queue.length} itens...`);
    
    const failedItems: SyncOperation[] = [];
    
    for (const item of queue) {
      let success = false;
      try {
        if (item.operacao === 'INSERT' || item.operacao === 'UPDATE') {
          // Usa upsert para simplificar, com last-write-wins.
          const { error } = await supabase.from(item.tabela).upsert(item.dados);
          if (error) throw error;
        } else if (item.operacao === 'DELETE') {
          const { error } = await supabase.from(item.tabela).delete().eq('id', item.dados.id);
          if (error) throw error;
        }
        success = true;
      } catch (error) {
        console.error(`Falha ao sincronizar item ${item.id}:`, error);
        item.tentativas += 1;
        
        // Mantemos na fila para a próxima tentativa
        // A lógica de delay do backoff exponencial (1,2,4,8,16, max 60s) 
        // ditaria que não processaríamos esse item se `Date.now() < proximo_processamento`.
        // Para simplicidade e robustez na V1, deixamos os retries ocorrerem em cada ciclo (30s)
        // se o erro foi de rede.
        failedItems.push(item);
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
