import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeName = 'light' | 'dark';

interface ThemeState {
  theme: ThemeName;
  /** Modo calmo: reduz brilhos e animações (bi-directional scaffolding p/ TDAH). */
  calmMode: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  setCalmMode: (v: boolean) => void;
  toggleCalmMode: () => void;
}

/**
 * Fonte ÚNICA de verdade para tema e modo calmo.
 * Antes existiam duas fontes de tema (Navigation x NativeWind), que divergiam
 * e produziam texto do tema claro sobre fundo escuro. Tudo passa por aqui.
 * Padrão: escuro (design dark-first; evita o flash do tema claro).
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  calmMode: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const [savedTheme, savedCalm] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('calmMode'),
      ]);
      set({
        theme: savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark',
        calmMode: savedCalm === '1',
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },

  setTheme: (t) => {
    set({ theme: t });
    AsyncStorage.setItem('theme', t).catch(() => {});
  },

  toggleTheme: () => {
    const next: ThemeName = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    AsyncStorage.setItem('theme', next).catch(() => {});
  },

  setCalmMode: (v) => {
    set({ calmMode: v });
    AsyncStorage.setItem('calmMode', v ? '1' : '0').catch(() => {});
  },

  toggleCalmMode: () => {
    const next = !get().calmMode;
    set({ calmMode: next });
    AsyncStorage.setItem('calmMode', next ? '1' : '0').catch(() => {});
  },
}));
