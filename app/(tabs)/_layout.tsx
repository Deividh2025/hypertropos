/**
 * Layout das abas principais do Hypertropos.
 *
 * Por enquanto uma aba só (índice) para validação do setup.
 * As demais abas (Treino, Progresso, Nutrição, Config) serão adicionadas na Fase 1.
 */
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Header oculto — a tela index cuida do próprio visual por enquanto
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />
    </Tabs>
  )
}
