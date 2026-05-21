import { create } from 'zustand';
import { Perfil } from '../types';
import { obterPerfil, salvarPerfil, atualizarCampo as atualizarCampoDb } from '../db/queries/perfil';

interface PerfilState {
  perfil: Perfil | null;
  isLoading: boolean;
  carregarPerfil: () => Promise<void>;
  atualizarPerfil: (novoPerfil: Perfil) => Promise<void>;
  atualizarCampo: <K extends keyof Perfil>(campo: K, valor: Perfil[K]) => Promise<void>;
}

export const usePerfilStore = create<PerfilState>((set, get) => ({
  perfil: null,
  isLoading: true,
  
  carregarPerfil: async () => {
    set({ isLoading: true });
    try {
      const perfilLocal = await obterPerfil();
      set({ perfil: perfilLocal, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar perfil na store:', error);
      set({ isLoading: false });
    }
  },
  
  atualizarPerfil: async (novoPerfil: Perfil) => {
    try {
      // Atualiza estado local imediatamente (otimista)
      set({ perfil: novoPerfil });
      // Salva no banco local + fila de sync
      await salvarPerfil(novoPerfil);
    } catch (error) {
      console.error('Erro ao atualizar perfil na store:', error);
    }
  },
  
  atualizarCampo: async (campo, valor) => {
    const { perfil } = get();
    if (!perfil) return;
    
    try {
      const perfilAtualizado = { ...perfil, [campo]: valor };
      set({ perfil: perfilAtualizado });
      await atualizarCampoDb(campo, valor);
    } catch (error) {
      console.error(`Erro ao atualizar campo ${campo} na store:`, error);
    }
  }
}));
