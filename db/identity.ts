/**
 * Módulo de identidade do Hypertropos.
 *
 * O app é local-first e single-user, mas o backup na nuvem (Supabase) exige
 * uma identidade real para que as políticas de RLS (auth.uid() = perfil_id)
 * autorizem a gravação dos dados do usuário.
 *
 * Usamos login anônimo do Supabase: na primeira execução cria-se um usuário
 * anônimo persistente; nas próximas, a sessão é recuperada do AsyncStorage.
 * Esse uid é então usado como perfil_id em toda a sincronização.
 *
 * Se o login anônimo falhar (ex.: "Anonymous Sign-ins" desabilitado no painel
 * do Supabase), o app continua funcionando 100% localmente — apenas o sync
 * na nuvem fica suspenso até a identidade existir.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase-client';

const SYNC_USER_ID_KEY = 'sync_user_id';

let cachedUserId: string | null = null;

/**
 * Retorna o uid de sincronização já resolvido (ou null se ainda não houver
 * sessão ativa). Síncrono — usado pelo sync-engine a cada ciclo.
 */
export function getSyncUserId(): string | null {
  return cachedUserId;
}

/**
 * Inicializa a identidade de sincronização. Deve ser chamada uma vez no
 * startup do app, antes do sync-engine começar a processar a fila.
 *
 * É resiliente: nunca lança. Em qualquer falha, retorna null e o app segue
 * em modo local-only.
 */
export async function inicializarIdentidade(): Promise<string | null> {
  try {
    // 1. Tenta recuperar uma sessão já persistida (logins anteriores)
    const { data: sessionData } = await supabase.auth.getSession();
    let uid = sessionData?.session?.user?.id ?? null;

    // 2. Sem sessão? Cria um usuário anônimo (se o cliente suportar)
    if (!uid && typeof supabase.auth.signInAnonymously === 'function') {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.warn(
          '[IDENTITY] Login anônimo falhou. O backup na nuvem ficará suspenso até ' +
            'habilitar "Anonymous Sign-ins" em Authentication > Sign In / Providers ' +
            'no painel do Supabase. Detalhe:',
          error.message
        );
      } else {
        uid = data?.user?.id ?? null;
      }
    }

    cachedUserId = uid;

    if (uid) {
      await AsyncStorage.setItem(SYNC_USER_ID_KEY, uid);
      console.log('[IDENTITY] Identidade de sync ativa. Backup na nuvem habilitado.');
    } else {
      console.log('[IDENTITY] Sem identidade de sync — operando em modo local-only.');
    }

    return uid;
  } catch (err) {
    console.error('[IDENTITY] Erro ao inicializar identidade:', err);
    cachedUserId = null;
    return null;
  }
}
