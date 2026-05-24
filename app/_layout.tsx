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

import { useColorScheme } from '@/components/useColorScheme'
import { initializeSchema } from '../db/schema-local'
import { useSyncEngine } from '../db/sync-engine'
import { usePerfilStore } from '../stores/perfilStore'
import { motorAudio } from '../lib/motor-audio'
import { ErrorBoundaryProps } from 'expo-router'
import { View, Pressable } from 'react-native'
import { Warning, ArrowCounterClockwise } from 'phosphor-react-native'
import { Texto } from '../components/ui/Texto'
import { IndicadorConexao } from '../components/ui/IndicadorConexao'

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#141210', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Warning size={64} color="#D4A373" weight="duotone" />
      
      <Texto variant="h1" color="marble" style={{ marginTop: 24, textAlign: 'center', fontSize: 24 }}>
        Ops! Algo saiu da rota científica
      </Texto>
      
      <View style={{ backgroundColor: '#1E1B18', borderWidth: 1, borderColor: '#2E2A25', padding: 16, borderRadius: 8, width: '100%', marginTop: 24, gap: 8 }}>
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
          backgroundColor: '#D4A373',
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minHeight: 48
        }}
      >
        <ArrowCounterClockwise size={20} color="#141210" weight="bold" />
        <Texto variant="bodyBold" style={{ color: '#141210' }}>
          Tentar Novamente
        </Texto>
      </Pressable>
    </View>
  )
}

export const unstable_settings = {
  // Garante que ao recarregar em /modal, o botão de voltar seja exibido.
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
  const { perfil, carregarPerfil, isLoading: carregandoPerfil } = usePerfilStore()
  const [isReady, setIsReady] = useState(false)
  
  // Inicia o engine de sincronização offline-first apenas quando o app estiver inicializado e pronto
  useSyncEngine(isReady && !carregandoPerfil)

  useEffect(() => {
    async function inicializarApp() {
      try {
        // Inicializa o banco de dados local SQLite e o motor de áudio
        await initializeSchema()
        await motorAudio.inicializar()
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
    // ThemeProvider aplica o tema claro/escuro do sistema ao Expo Router
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <IndicadorConexao />
        <Stack screenOptions={{ headerShown: false }}>
          {!onboardingComplete ? (
            // Roteamento condicional seguro: se o onboarding não estiver completo,
            // apenas o Stack do onboarding existe no roteador.
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          ) : (
            // Apenas quando o onboarding for concluído é que o app principal é exposto
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </>
          )}
        </Stack>
      </View>
    </ThemeProvider>
  )
}
