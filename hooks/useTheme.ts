import { colors } from '../constants/tokens';
import { useThemeStore } from '../stores/themeStore';

/**
 * Hook de tema do app. Lê da fonte única (themeStore, persistido) e devolve
 * o tema atual, os tokens de cor em hex (para estilos inline) e o modo calmo.
 *
 * A sincronização com o NativeWind (classe .dark que troca as variáveis CSS)
 * é feita em UM único ponto, no _layout raiz — não aqui — para evitar
 * dessincronia entre o "chrome" da navegação e as classes do NativeWind.
 */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const calmMode = useThemeStore((s) => s.calmMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const toggleCalmMode = useThemeStore((s) => s.toggleCalmMode);

  return { theme, tokens: colors[theme], calmMode, toggleTheme, toggleCalmMode };
}
