import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

interface ParticulasCinzelProps {
  count?: number;
  color?: string;
  trigger?: any; // Mudar esse valor causa novo disparo do efeito
}

function Particula({ color }: { color: string }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Sorteia ângulo completo de dispersão (0 a 2*PI)
    const angle = Math.random() * Math.PI * 2;
    // Distância de voo da fagulha (entre 30 e 100px)
    const distance = 30 + Math.random() * 70;
    const destX = Math.cos(angle) * distance;
    // Viés ligeiramente para cima no eixo Y (efeito de fogo/cinzas flutuantes)
    const destY = Math.sin(angle) * distance - 15;

    // Animação nativa de voo das fagulhas a 60fps
    tx.value = withTiming(destX, { 
      duration: 350 + Math.random() * 150, 
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) 
    });
    ty.value = withTiming(destY, { 
      duration: 350 + Math.random() * 150, 
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) 
    });

    scale.value = withTiming(1.2 + Math.random() * 0.8, { duration: 200 }, () => {
      scale.value = withTiming(0, { duration: 150 });
    });
    opacity.value = withTiming(0, { 
      duration: 400 + Math.random() * 100, 
      easing: Easing.linear 
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const size = 5 + Math.random() * 5;
    return {
      position: 'absolute',
      width: size,
      height: size * (0.4 + Math.random() * 0.5), // Retangular/achatada como fagulhas de cinzel
      borderRadius: 1,
      backgroundColor: color,
      transform: [
        { translateX: tx.value },
        { translateY: ty.value },
        { scale: scale.value },
        { rotate: `${Math.random() * 360}deg` }
      ],
      opacity: opacity.value,
    };
  });

  return <Animated.View style={animatedStyle} />;
}

export function ParticulasCinzel({ count = 8, color, trigger }: ParticulasCinzelProps) {
  const { tokens } = useTheme();
  const [particleList, setParticleList] = useState<number[]>([]);
  const sparkColor = color || tokens.accent.bronze;

  useEffect(() => {
    if (trigger !== undefined) {
      // Dispara nova explosão
      setParticleList(Array.from({ length: count }, (_, i) => Date.now() + i));
      
      // Auto-limpeza após término da animação
      const timer = setTimeout(() => {
        setParticleList([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [trigger, count]);

  if (particleList.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" className="justify-center items-center">
      {particleList.map((id) => (
        <Particula key={id} color={sparkColor} />
      ))}
    </View>
  );
}
