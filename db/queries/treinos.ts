import AsyncStorage from '@react-native-async-storage/async-storage';
import { enqueueChange } from '../sync-engine';
import { RegistroSessao } from '../../types';
import { supabase } from '../supabase-client';

const RECENT_SESSIONS_KEY = 'recent_sessions_cache';

export async function registrarSessao(registro: RegistroSessao): Promise<void> {
  try {
    // 1. Atualiza cache local de sessões recentes (dados ativos)
    const recent = await listarRegistrosRecentes(10);
    const updated = [registro, ...recent.filter(r => r.id !== registro.id)].slice(0, 10);
    await AsyncStorage.setItem(RECENT_SESSIONS_KEY, JSON.stringify(updated));

    // 2. Coloca na fila de sincronização offline-first
    // Na arquitetura real do Supabase, teríamos que separar registro_sessao, 
    // registros_execucao e series_executadas. Para manter simples no engine V1:
    await enqueueChange('registros_sessao', 'INSERT', registro);
  } catch (error) {
    console.error('Erro ao registrar sessão:', error);
  }
}

export async function listarRegistrosRecentes(limite: number = 10): Promise<RegistroSessao[]> {
  try {
    // 1. Consulta cache local (AsyncStorage para entidades sem tabela SQLite)
    const cachedStr = await AsyncStorage.getItem(RECENT_SESSIONS_KEY);
    let cached: RegistroSessao[] = cachedStr ? JSON.parse(cachedStr) : [];
    
    // 2. Em paralelo (sem await), busca do Supabase para manter cache atualizado
    (async () => {
      try {
        const { data, error } = await supabase.from('registros_sessao')
          .select('*')
          .order('data_inicio', { ascending: false })
          .limit(limite);
        if (!error && data && data.length > 0) {
          // Na implementação real os relacionamentos viriam em um select aninhado
          await AsyncStorage.setItem(RECENT_SESSIONS_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error('Background fetch falhou:', err);
      }
    })();
      
    return cached.slice(0, limite);
  } catch (error) {
    console.error('Erro ao listar registros recentes:', error);
    return [];
  }
}
