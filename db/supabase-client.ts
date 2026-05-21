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

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://url-placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'key-placeholder';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
