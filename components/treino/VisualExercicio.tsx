import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import Svg, { Path, Circle } from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VisualExercicio() {
  const { tokens } = useTheme();
  const { exerciciosPrescritos, exercicioAtualIndex, exerciciosCatalogMap } = useSessaoStore();

  const pulse = useSharedValue(1);
  const strokeOffset = useSharedValue(0);

  useEffect(() => {
    // Animação de pulso para o placeholder de silhueta
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1.0, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      false
    );

    // Efeito de linha se desenhando (dashoffset) no SVG
    strokeOffset.value = withRepeat(
      withTiming(100, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  if (exerciciosPrescritos.length === 0) return null;

  const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
  const exercicioDetalhes = exerciciosCatalogMap[currentPrescricao.exercicio_id];
  const nomeExercicio = exercicioDetalhes?.nome || currentPrescricao.exercicio_id.replace(/_/g, ' ');
  const midiaUrl = exercicioDetalhes?.midia_url;

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: withTiming(1, { duration: 300 }),
  }));

  return (
    <View className="relative justify-center items-center overflow-hidden bg-canvas border-b border-border-subtle" style={{ height: SCREEN_HEIGHT * 0.40 }}>
      {/* Background radial gradient overlay simulated with blurred circle */}
      <View 
        className="absolute w-[200px] h-[200px] rounded-full opacity-[0.08]"
        style={{
          backgroundColor: tokens.accent.bronze,
          transform: [{ scale: 2 }],
        }}
      />

      {/* Lottie Animation or Placeholder */}
      {midiaUrl ? (
        <LottieView
          source={{ uri: midiaUrl }}
          autoPlay
          loop
          style={styles.lottie}
          resizeMode="cover"
        />
      ) : (
        // Placeholder Vector Silhueta Científica Animada
        <Animated.View style={[styles.placeholderContainer, pulseStyle]}>
          <Svg width="180" height="180" viewBox="0 0 100 100">
            {/* Círculo de fundo estilizado */}
            <Circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke={tokens.accent.bronze} 
              strokeWidth="0.5" 
              strokeDasharray="2, 4"
              fill="none" 
              opacity="0.3"
            />
            {/* Silhueta Humana Abstrata Executando Padrão (Flexão/Agachamento Abstrato) */}
            <Path
              d="M 50 15 
                 C 53 15, 53 21, 50 21 
                 C 47 21, 47 15, 50 15 
                 Z 
                 M 50 22 
                 L 50 42 
                 M 50 25 
                 L 32 30 
                 C 30 31, 28 35, 34 37 
                 M 50 25 
                 L 68 30 
                 C 70 31, 72 35, 66 37 
                 M 50 42 
                 L 35 60 
                 L 37 78 
                 M 50 42 
                 L 65 60 
                 L 63 78"
              stroke={tokens.accent.bronze}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Detalhes de Conexão Óssea/Tensão (Pontos de Bronze) */}
            <Circle cx="50" cy="22" r="1.5" fill={tokens.accent.gold} />
            <Circle cx="32" cy="30" r="1.5" fill={tokens.accent.gold} />
            <Circle cx="68" cy="30" r="1.5" fill={tokens.accent.gold} />
            <Circle cx="35" cy="60" r="1.5" fill={tokens.accent.gold} />
            <Circle cx="65" cy="60" r="1.5" fill={tokens.accent.gold} />
          </Svg>
        </Animated.View>
      )}

      {/* Nome do Exercício Sobreposto com Degradê de Sombra */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-6 justify-end items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        style={styles.shadowOverlay}
      >
        <Texto 
          variant="displayL" 
          color="primary" 
          className="text-center drop-shadow-md text-[30px] font-semibold text-white tracking-wide"
        >
          {nomeExercicio}
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowOverlay: {
    height: 100,
    backgroundColor: 'rgba(26, 23, 21, 0.4)', // Overlay sutil para legibilidade em light/dark
  }
});
