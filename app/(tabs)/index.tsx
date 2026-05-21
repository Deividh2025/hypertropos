/**
 * Tela inicial de validação do setup.
 * Esta tela confirma que:
 * - O Expo Router está funcionando (rota (tabs)/index)
 * - O React Native renderiza corretamente
 * - O NativeWind está ativo (className funciona)
 *
 * Na Fase 1, esta tela será substituída pela tela de onboarding/dashboard.
 */
import { View, Text, StyleSheet } from 'react-native'

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hypertropos</Text>
      <Text style={styles.subtitle}>Setup OK ✅</Text>
      <Text style={styles.info}>Expo SDK 56 · React Native 0.85 · NativeWind v4</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
})
