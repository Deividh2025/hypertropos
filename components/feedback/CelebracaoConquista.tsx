import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Icons from 'phosphor-react-native';
import { Conquista } from '../../types/gamificacao';
import { useTheme } from '../../hooks/useTheme';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { SCULPTED_EASING } from '../../constants/easing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CelebracaoConquistaProps {
  conquista: Conquista;
  aoFechar: () => void;
}

export function CelebracaoConquista({ conquista, aoFechar }: CelebracaoConquistaProps) {
  const { tokens } = useTheme();

  // Shared values para a entrada do card
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  // Shared value para a pulsação do glow do ícone
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.2);

  useEffect(() => {
    // 1. Dispara animação de entrada do card
    scale.value = withTiming(1, { duration: 500, easing: SCULPTED_EASING });
    opacity.value = withTiming(1, { duration: 500, easing: SCULPTED_EASING });

    // 2. Dispara a pulsação contínua do glow
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200 }),
        withTiming(1.0, { duration: 1200 })
      ),
      -1, // infinito
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1200 }),
        withTiming(0.2, { duration: 1200 })
      ),
      -1, // infinito
      true
    );

    // 3. Dispara Haptics e Som (placeholder)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log(`[SOM] conquista: ${conquista.titulo} desbloqueada`);
  }, [conquista]);

  // Estilo animado do Card central
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Estilo animado do brilho pulsante atrás do ícone
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  // Mapeamento dinâmico do ícone da conquista
  const IconComponent = (Icons as any)[conquista.icone] || Icons.Trophy;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[StyleSheet.absoluteFillObject, styles.overlay]}
      className="justify-center items-center px-6"
    >
      <Pressable style={StyleSheet.absoluteFillObject} onPress={aoFechar} />

      <Animated.View
        style={[
          cardAnimatedStyle,
          {
            backgroundColor: tokens.bg.elevated,
            borderColor: tokens.border.strong,
          },
        ]}
        className="w-full max-w-[340px] rounded-[28px] border p-8 items-center shadow-overlay relative overflow-hidden"
      >
        {/* Glow de fundo pulsante */}
        <Animated.View
          style={[
            glowAnimatedStyle,
            {
              backgroundColor: tokens.accent.gold,
            },
          ]}
          className="absolute w-24 h-24 rounded-full blur-[24px] top-6"
        />

        {/* Ícone da conquista */}
        <View className="w-20 h-20 rounded-full justify-center items-center mb-6" style={{ zIndex: 1 }}>
          <IconComponent size={64} color={tokens.accent.gold} weight="regular" />
        </View>

        {/* Textos da conquista */}
        <Texto variant="h1" className="text-center font-bold mb-3 tracking-tight">
          {conquista.titulo}
        </Texto>

        <Texto variant="body" color="secondary" className="text-center mb-6 leading-[21px]">
          {conquista.descricao}
        </Texto>

        {/* XP Recompensa */}
        <View
          style={{ backgroundColor: `${tokens.accent.gold}15` }}
          className="px-4 py-1.5 rounded-full border border-accent-gold/20 mb-8"
        >
          <Texto variant="captionBold" color="gold" className="tracking-wider uppercase">
            +{conquista.xp_recompensa} XP
          </Texto>
        </View>

        {/* Botão para continuar */}
        <Botao variant="primary" size="lg" onPress={aoFechar} className="w-full">
          Continuar
        </Botao>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(26, 23, 21, 0.85)',
    zIndex: 11000,
  },
});
