import React from 'react'
import 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Importação obrigatória do NativeWind v4:
// O CSS global deve ser importado no layout raiz para que o compilador
// Tailwind inicialize e as classes className funcionem em toda a árvore.
import '../global.css'

import { useColorScheme as useNativeWindColorScheme } from 'nativewind'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useTheme } from '../hooks/useTheme'
import { useThemeStore } from '../stores/themeStore'
import { initializeSchema } from '../db/schema-local'
import { useSyncEngine } from '../db/sync-engine'
import { inicializarIdentidade } from '../db/identity'
import { usePerfilStore } from '../stores/perfilStore'
import { motorAudio } from '../lib/motor-audio'
import { ErrorBoundaryProps } from 'expo-router'
import { View, Pressable } from 'react-native'
import { Warning, ArrowCounterClockwise } from 'phosphor-react-native'
import { Texto } from '../components/ui/Texto'
import { IndicadorConexao } from '../components/ui/IndicadorConexao'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#1A1715', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Warning size={64} color="#C19A6B" weight="duotone" />
      
      <Texto variant="h1" color="marble" style={{ marginTop: 24, textAlign: 'center', fontSize: 24 }}>
        Ops! Algo saiu da rota científica
      </Texto>
      
      <View style={{ backgroundColor: '#252220', borderWidth: 1, borderColor: '#3D3733', padding: 16, borderRadius: 8, width: '100%', marginTop: 24, gap: 8 }}>
        <Texto variant="bodyBold" color="bronze">O que houve:</Texto>
        <Texto variant="caption" color="secondary" style={{ fontSize: 13, fontFamily: 'monospace' }}>
          {error.message || 'Ocorreu uma falha de rendering ou de estado interno.'}
        </Texto>
        
        <Texto variant="bodyBold" color="bronze" style={{ marginTop: 8 }}>Consequência:</Texto>
        <Texto variant="caption" color="secondary">
          A visualização foi interrompida para evitar corrupção dos seus dados locais.
        </Texto>

        <Texto variant="bodyBold" color="bronze" style={{ marginTop: 8 }}>Ação sugerida:</Texto>
        <Texto variant="caption" color="secondary">
          Tente recarregar a tela ou reinicie o aplicativo se o erro persistir.
        </Texto>
      </View>
      
      <Pressable
        onPress={retry}
        style={{
          marginTop: 32,
          backgroundColor: '#C19A6B',
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minHeight: 48
        }}
      >
        <ArrowCounterClockwise size={20} color="#1A1715" weight="bold" />
        <Texto variant="bodyBold" style={{ color: '#1A1715' }}>
          Tentar Novamente
        </Texto>
      </Pressable>
    </View>
  )
}

class GlobalLayoutErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('CRITICAL: Erro capturado no nível mais alto do RootLayout:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorBoundary 
          error={this.state.error} 
          retry={async () => { this.setState({ hasError: false, error: null }) }} 
        />
      )
    }
    return this.props.children
  }
}

// Temas de navegação alinhados aos tokens do app, para que o "chrome" do
// React Navigation e o fundo de fallback usem as cores corretas (mármore/
// bronze) em vez do cinza/preto genéricos dos temas padrão.
const NavDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1A1715',
    card: '#252220',
    text: '#F2EAE0',
    border: '#3D3733',
    primary: '#C19A6B',
  },
}

const NavLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5F0E8',
    card: '#FAF5ED',
    text: '#2A2520',
    border: '#DDD3C2',
    primary: '#8B6F47',
  },
}

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

// Previne que a splash screen se esconda antes dos assets carregarem.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  useEffect(() => {
    async function hideSplash() {
      try {
        if (loaded || error) {
          if (error) {
            console.error('Erro ao carregar fontes do Google Fonts (usando fallback do sistema):', error);
          }
          await SplashScreen.hideAsync();
        }
      } catch (splashError) {
        console.warn('Erro ao ocultar o SplashScreen de forma síncrona/assíncrona:', splashError);
      }
    }
    hideSplash();
  }, [loaded, error]);

  // Hidrata o tema e o modo calmo (persistidos) uma única vez ao iniciar.
  useEffect(() => {
    useThemeStore.getState().hydrate()
  }, [])

  if (!loaded && !error) {
    return null;
  }

  return (
    <GlobalLayoutErrorBoundary>
      <RootLayoutNav />
    </GlobalLayoutErrorBoundary>
  )
}

function RootLayoutNav() {
  const { theme } = useTheme()
  const { setColorScheme } = useNativeWindColorScheme()
  const { perfil, carregarPerfil, isLoading: carregandoPerfil } = usePerfilStore()
  const [isReady, setIsReady] = useState(false)

  // Ponto ÚNICO de sincronização do tema com o NativeWind (classe .dark).
  // Resolve a dessincronia que fazia o texto do tema claro aparecer sobre
  // o fundo escuro (o "lodo" de baixo contraste).
  useEffect(() => {
    setColorScheme(theme)
  }, [theme, setColorScheme])
  
  // Inicia o engine de sincronização offline-first apenas quando o app estiver inicializado e pronto
  useSyncEngine(isReady && !carregandoPerfil)

  useEffect(() => {
    async function inicializarApp() {
      try {
        // Inicializa o banco de dados local SQLite e o motor de áudio
        await initializeSchema()
        await motorAudio.inicializar()
        // Inicializa a identidade de sincronização (login anônimo) para o backup na nuvem.
        // É resiliente: se falhar, o app segue em modo local-only.
        await inicializarIdentidade()
        // Carrega o perfil do usuário
        await carregarPerfil()
      } catch (err) {
        console.error('Erro ao inicializar app:', err)
      } finally {
        setIsReady(true)
      }
    }
    
    inicializarApp()
  }, [])

  if (!isReady || carregandoPerfil) {
    return null; // Carregamento seguro para evitar qualquer flash ou vazamento
  }

  const onboardingComplete = perfil !== null

  return (
    <SafeAreaProvider>
      {/* ThemeProvider alimentado pela fonte ÚNICA de tema (themeStore) */}
      <ThemeProvider value={theme === 'dark' ? NavDarkTheme : NavLightTheme}>
        <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1A1715' : '#F5F0E8' }}>
          <IndicadorConexao />
          <Stack screenOptions={{ headerShown: false }}>
            {!onboardingComplete ? (
              // Roteamento condicional seguro: se o onboarding não estiver completo,
              // apenas o Stack do onboarding existe no roteador.
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            ) : (
              // Apenas quando o onboarding for concluído é que o app principal é exposto
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )}
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
