import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { SCULPTED_EASING } from '../../constants/easing';
import { useSound } from '../../hooks/useSound';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TransicaoTierProps {
  tierAntigo: 'bronze' | 'pedra' | 'marmore' | 'dourada';
  tierNovo: 'bronze' | 'pedra' | 'marmore' | 'dourada';
  aoFechar: () => void;
}

interface MaterialDetails {
  nome: string;
  descricao: string;
  colors: [string, string];
  glow: string;
}

export function TransicaoTier({ tierAntigo, tierNovo, aoFechar }: TransicaoTierProps) {
  const { tokens } = useTheme();
  const { tocarSom } = useSound();
  const [fase, setFase] = useState<'inicio' | 'transicao' | 'revelado' | 'concluido'>('inicio');

  // Shared values para controlar as opacidades
  const opacityAntigo = useSharedValue(1);
  const opacityNovo = useSharedValue(0);
  const scaleAntigo = useSharedValue(1.0);
  const scaleNovo = useSharedValue(0.9);

  // Mapeamento dos detalhes estéticos dos materiais
  const MATERIAL_MAP: Record<'bronze' | 'pedra' | 'marmore' | 'dourada', MaterialDetails> = {
    bronze: {
      nome: 'Bronze',
      descricao: 'A base maleável mas persistente. O primeiro degrau rumo à solidez.',
      colors: ['#C19A6B', '#5A4632'],
      glow: '#C19A6B',
    },
    pedra: {
      nome: 'Pedra',
      descricao: 'Quatro semanas de consistência viraram materialidade visível. A próxima transformação acontece com o tempo.',
      colors: ['#B8AB9B', '#6E6457'],
      glow: '#B8AB9B',
    },
    marmore: {
      nome: 'Mármore',
      descricao: 'Doze semanas esculpindo cada fibra. O mármore brilha sob o peso do rigor científico.',
      colors: ['#F2EAE0', '#E8DED1'],
      glow: '#E8DED1',
    },
    dourada: {
      nome: 'Ouro',
      descricao: 'Vinte e seis semanas desafiando a gravidade. A síntese perfeita de força, persistência e biologia.',
      colors: ['#D4AF7A', '#B8935A'],
      glow: '#F0D08F',
    },
  };

  const antigo = MATERIAL_MAP[tierAntigo];
  const novo = MATERIAL_MAP[tierNovo];

  useEffect(() => {
    // === CRONOGRAMA DE ANIMAÇÃO CINEMATOGRÁFICA ===
    tocarSom('tier-transicao');

    // Haptic inicial sutil
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 1. Fase Inicial: Mostrar material antigo brilhando (0s a 1.0s)
    const timerTransicao = setTimeout(() => {
      setFase('transicao');
      // Inicia fusão/transformação (1.0s a 2.5s)
      opacityAntigo.value = withTiming(0, { duration: 1500, easing: SCULPTED_EASING });
      opacityNovo.value = withTiming(1, { duration: 1500, easing: SCULPTED_EASING });
      scaleAntigo.value = withTiming(0.9, { duration: 1500, easing: SCULPTED_EASING });
      scaleNovo.value = withTiming(1.0, { duration: 1500, easing: SCULPTED_EASING });

      // Haptic rítmico simulando cinzelamento e transformação
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 400);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 900);
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        console.log('[SOM] transicao_tier: impacto da revelação');
      }, 1500);
    }, 1000);

    // 2. Fase de Revelação de Texto (em 2.5s)
    const timerRevelado = setTimeout(() => {
      setFase('revelado');
    }, 2500);

    // 3. Fase do Botão Concluir (em 4.5s)
    const timerConcluido = setTimeout(() => {
      setFase('concluido');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 4500);

    return () => {
      clearTimeout(timerTransicao);
      clearTimeout(timerRevelado);
      clearTimeout(timerConcluido);
    };
  }, [tierAntigo, tierNovo]);

  // Estilos de animação Reanimated
  const antigoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAntigo.value,
    transform: [{ scale: scaleAntigo.value }],
  }));

  const novoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityNovo.value,
    transform: [{ scale: scaleNovo.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(500)}
      style={[StyleSheet.absoluteFill, styles.container]}
      className="justify-center items-center px-8 py-12"
    >
      <View className="flex-1 justify-center items-center w-full max-w-[450px] gap-8">
        
        {/* Bloco Central: Estátua/Esfera de Transformação de Material */}
        <View className="relative w-48 h-48 justify-center items-center">
          
          {/* Material Antigo */}
          <Animated.View
            style={[antigoAnimatedStyle, styles.materialOverlay]}
            className="absolute w-40 h-40 justify-center items-center"
          >
            {/* Sutil glow de fundo */}
            <View
              style={{ backgroundColor: antigo.glow, opacity: 0.15 }}
              className="absolute w-36 h-36 rounded-full blur-[20px]"
            />
            <Svg width="150" height="150" viewBox="0 0 150 150">
              <Defs>
                <LinearGradient id="gradAntigo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={antigo.colors[0]} />
                  <Stop offset="100%" stopColor={antigo.colors[1]} />
                </LinearGradient>
              </Defs>
              <Circle cx="75" cy="75" r="60" fill="url(#gradAntigo)" />
            </Svg>
          </Animated.View>

          {/* Material Novo */}
          <Animated.View
            style={[novoAnimatedStyle, styles.materialOverlay]}
            className="absolute w-40 h-40 justify-center items-center"
          >
            {/* Glow glorioso de fundo para o novo tier */}
            <View
              style={{ backgroundColor: novo.glow, opacity: 0.3 }}
              className="absolute w-44 h-44 rounded-full blur-[30px]"
            />
            <Svg width="150" height="150" viewBox="0 0 150 150">
              <Defs>
                <LinearGradient id="gradNovo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={novo.colors[0]} />
                  <Stop offset="100%" stopColor={novo.colors[1]} />
                </LinearGradient>
              </Defs>
              <Circle cx="75" cy="75" r="65" fill="url(#gradNovo)" />
            </Svg>
          </Animated.View>
        </View>

        {/* Textos Informativos */}
        <View className="gap-4 w-full items-center min-h-[140px]">
          {fase !== 'inicio' && (
            <Animated.View
              entering={FadeIn.duration(800).easing(SCULPTED_EASING)}
              className="items-center gap-3 w-full"
            >
              <Texto variant="displayL" className="text-center font-bold text-fg-primary tracking-tight">
                Sua estátua agora é de {novo.nome.toLowerCase()}
              </Texto>
              
              <Texto variant="body" color="secondary" className="text-center px-4 leading-[22.5px]">
                {novo.descricao}
              </Texto>
            </Animated.View>
          )}
        </View>

        {/* Botão de Conclusão com delay */}
        <View className="w-full h-14 mt-6 justify-center">
          {fase === 'concluido' && (
            <Animated.View entering={FadeIn.duration(400)} className="w-full">
              <Botao variant="primary" size="lg" onPress={aoFechar} className="w-full">
                Continuar
              </Botao>
            </Animated.View>
          )}
        </View>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1715',
    zIndex: 12000,
  },
  materialOverlay: {
    backfaceVisibility: 'hidden',
  },
});
