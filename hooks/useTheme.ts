import { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/tokens';

export function useTheme() {
  const systemColorScheme = useNativeColorScheme();
  const systemTheme: 'light' | 'dark' = systemColorScheme === 'light' ? 'light' : 'dark';
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [theme, setThemeState] = useState<'light' | 'dark'>(systemTheme);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((savedTheme) => {
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
        setColorScheme(savedTheme);
      } else {
        setThemeState(systemTheme);
        setColorScheme(systemTheme);
      }
    });
  }, [systemTheme, setColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    setColorScheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const themeColors = colors[theme];

  return { theme, tokens: themeColors, toggleTheme };
}
