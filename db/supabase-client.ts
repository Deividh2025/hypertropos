/**
 * Cliente Supabase configurado para React Native.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import {
  Exercicio,
  Referencia,
  Perfil,
  Suplemento,
  Gamificacao,
  EstadoSilhueta,
} from '../types';

export interface Database {
  public: {
    Tables: {
      exercicios: {
        Row: Exercicio;
        Insert: Partial<Exercicio>;
        Update: Partial<Exercicio>;
      };
      referencias_cientificas: {
        Row: Referencia;
        Insert: Partial<Referencia>;
        Update: Partial<Referencia>;
      };
      perfil_usuario: {
        Row: Perfil & { id: string };
        Insert: Partial<Perfil & { id: string }>;
        Update: Partial<Perfil & { id: string }>;
      };
      estado_silhueta: {
        Row: EstadoSilhueta;
        Insert: Partial<EstadoSilhueta>;
        Update: Partial<EstadoSilhueta>;
      };
      gamificacao: {
        Row: Gamificacao;
        Insert: Partial<Gamificacao>;
        Update: Partial<Gamificacao>;
      };
      suplementos: {
        Row: Suplemento;
        Insert: Partial<Suplemento>;
        Update: Partial<Suplemento>;
      };
      // Outras tabelas do Supabase podem ser adicionadas conforme necessidade.
    };
  };
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Função auxiliar para gerar um mock inofensivo do cliente Supabase.
// Evita erros de tipo como "Cannot read property 'from' of undefined" caso as chaves estejam ausentes.
const criarClienteMockSupabase = () => {
  console.warn('[SUPABASE MOCK] Inicializando cliente mock devido a credenciais ausentes ou inválidas.');
  
  const chainable = () => new Proxy({}, {
    get(target, prop) {
      if (prop === 'then') return undefined;
      if (prop === 'catch') return undefined;
      return chainable;
    }
  });

  const mockClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => new Proxy({
      select: () => chainable(),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => chainable(),
      eq: () => chainable(),
      order: () => chainable(),
      limit: () => Promise.resolve({ data: [], error: null }),
    }, {
      get(target, prop) {
        if (prop === 'then') return undefined;
        if (prop in target) return (target as any)[prop];
        return chainable;
      }
    }),
  };

  return mockClient as any;
};

let clienteInstancia;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.error(
    'CRITICAL WARNING: Supabase URL or Anon Key is undefined or contains placeholders. ' +
    'The app will run with a mock client to prevent crash-on-startup.'
  );
  clienteInstancia = criarClienteMockSupabase();
} else {
  try {
    clienteInstancia = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    console.error('Falha catastrófica ao instanciar o cliente do Supabase:', error);
    clienteInstancia = criarClienteMockSupabase();
  }
}

export const supabase = clienteInstancia;
