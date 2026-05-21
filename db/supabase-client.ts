/**
 * Cliente Supabase configurado para React Native.
 *
 * Por que AsyncStorage como adapter?
 * No React Native não existe `localStorage` (API do browser).
 * O Supabase SDK usa storage para persistir a sessão de autenticação.
 * AsyncStorage é o equivalente assíncrono do localStorage no RN.
 *
 * Por que EXPO_PUBLIC_ no prefixo?
 * O Expo expõe variáveis de ambiente ao bundle do cliente SOMENTE quando
 * têm o prefixo EXPO_PUBLIC_. Sem ele, process.env retorna undefined em runtime.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usa AsyncStorage como storage adapter (obrigatório no React Native)
    storage: AsyncStorage,
    // Renova o token automaticamente antes de expirar
    autoRefreshToken: true,
    // Persiste a sessão entre reinicializações do app
    persistSession: true,
    // Desabilitado: não há URLs para detectar em ambiente mobile
    detectSessionInUrl: false,
  },
})
