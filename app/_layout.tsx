import { useFonts } from 'expo-font'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

// Importação obrigatória do NativeWind v4:
// O CSS global deve ser importado no layout raiz para que o compilador
// Tailwind inicialize e as classes className funcionem em toda a árvore.
import '../global.css'

import { useColorScheme } from '@/components/useColorScheme'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  // Garante que ao recarregar em /modal, o botão de voltar seja exibido.
  initialRouteName: '(tabs)',
}

// Previne que a splash screen se esconda antes dos assets carregarem.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    // ThemeProvider aplica o tema claro/escuro do sistema ao Expo Router
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* (tabs) é a rota principal — sem header próprio, gerenciado pelo Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  )
}
