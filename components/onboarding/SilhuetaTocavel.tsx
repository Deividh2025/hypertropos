import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Texto } from '../ui/Texto';
import { RegiaoCorpo, RestricaoOnboarding } from '../../types/onboarding';

interface SilhuetaTocavelProps {
  restricoes: RestricaoOnboarding[];
  onPressRegiao: (regiao: RegiaoCorpo) => void;
}

export function SilhuetaTocavel({ restricoes, onPressRegiao }: SilhuetaTocavelProps) {
  const [viewFrente, setViewFrente] = useState(true);

  const toggleView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewFrente(!viewFrente);
  };

  const handlePress = (regiao: RegiaoCorpo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPressRegiao(regiao);
  };

  const hasRestricao = (regiao: RegiaoCorpo) => {
    return restricoes.some(r => r.regiao === regiao);
  };

  const getStyle = (regiao: RegiaoCorpo) => {
    const isSelected = hasRestricao(regiao);
    return {
      fill: isSelected ? 'var(--color-accent-bronze)' : 'var(--color-bg-elevated)',
      stroke: 'var(--color-fg-primary)',
      strokeWidth: isSelected ? 2 : 1,
      fillOpacity: isSelected ? 0.4 : 0.1,
      strokeOpacity: 0.6,
    };
  };

  return (
    <View className="items-center w-full">
      <View className="flex-row bg-elevated rounded-full p-1 mb-8 shadow-sm">
        <Pressable 
          onPress={() => !viewFrente && toggleView()}
          className={`px-6 py-2 rounded-full ${viewFrente ? 'bg-canvas shadow-sm border border-border-subtle' : ''}`}
        >
          <Texto variant="bodyBold" color={viewFrente ? 'primary' : 'muted'}>Frente</Texto>
        </Pressable>
        <Pressable 
          onPress={() => viewFrente && toggleView()}
          className={`px-6 py-2 rounded-full ${!viewFrente ? 'bg-canvas shadow-sm border border-border-subtle' : ''}`}
        >
          <Texto variant="bodyBold" color={!viewFrente ? 'primary' : 'muted'}>Costas</Texto>
        </Pressable>
      </View>

      <View className="w-full h-[400px] items-center justify-center">
        <Svg width="100%" height="100%" viewBox="0 0 200 400">
          <G transform="translate(0, 20)">
            {/* Generic Body Outline (Non-interactive) */}
            <Path
              d="M100 10 C120 10, 120 40, 100 40 C80 40, 80 10, 100 10 Z" // Head
              fill="var(--color-bg-elevated)" stroke="var(--color-fg-primary)" fillOpacity={0.05} strokeOpacity={0.3} strokeWidth={1}
            />
            <Path
              d="M80 50 L120 50 L140 120 L130 180 L110 180 L100 120 L90 180 L70 180 L60 120 Z" // Torso & Arms
              fill="var(--color-bg-elevated)" stroke="var(--color-fg-primary)" fillOpacity={0.05} strokeOpacity={0.3} strokeWidth={1}
            />
            <Path
              d="M80 180 L120 180 L125 350 L105 350 L100 220 L95 350 L75 350 Z" // Legs
              fill="var(--color-bg-elevated)" stroke="var(--color-fg-primary)" fillOpacity={0.05} strokeOpacity={0.3} strokeWidth={1}
            />

            {/* Interactive Regions - Simplified geometries placed over the outline */}
            {viewFrente ? (
              <>
                {/* Ombros Frente */}
                <Circle cx="75" cy="65" r="15" {...getStyle(RegiaoCorpo.OMBRO_ESQUERDO)} onPress={() => handlePress(RegiaoCorpo.OMBRO_ESQUERDO)} />
                <Circle cx="125" cy="65" r="15" {...getStyle(RegiaoCorpo.OMBRO_DIREITO)} onPress={() => handlePress(RegiaoCorpo.OMBRO_DIREITO)} />
                
                {/* Cotovelos Frente */}
                <Circle cx="65" cy="120" r="12" {...getStyle(RegiaoCorpo.COTOVELO_ESQUERDO)} onPress={() => handlePress(RegiaoCorpo.COTOVELO_ESQUERDO)} />
                <Circle cx="135" cy="120" r="12" {...getStyle(RegiaoCorpo.COTOVELO_DIREITO)} onPress={() => handlePress(RegiaoCorpo.COTOVELO_DIREITO)} />
                
                {/* Quadril (Centro) */}
                <Circle cx="100" cy="170" r="20" {...getStyle(RegiaoCorpo.QUADRIL)} onPress={() => handlePress(RegiaoCorpo.QUADRIL)} />
                
                {/* Joelhos */}
                <Circle cx="85" cy="260" r="15" {...getStyle(RegiaoCorpo.JOELHO_ESQUERDO)} onPress={() => handlePress(RegiaoCorpo.JOELHO_ESQUERDO)} />
                <Circle cx="115" cy="260" r="15" {...getStyle(RegiaoCorpo.JOELHO_DIREITO)} onPress={() => handlePress(RegiaoCorpo.JOELHO_DIREITO)} />
              </>
            ) : (
              <>
                {/* Cervical */}
                <Circle cx="100" cy="45" r="15" {...getStyle(RegiaoCorpo.CERVICAL)} onPress={() => handlePress(RegiaoCorpo.CERVICAL)} />

                {/* Ombros Costas */}
                <Circle cx="75" cy="65" r="15" {...getStyle(RegiaoCorpo.OMBRO_ESQUERDO)} onPress={() => handlePress(RegiaoCorpo.OMBRO_ESQUERDO)} />
                <Circle cx="125" cy="65" r="15" {...getStyle(RegiaoCorpo.OMBRO_DIREITO)} onPress={() => handlePress(RegiaoCorpo.OMBRO_DIREITO)} />
                
                {/* Lombar */}
                <Circle cx="100" cy="145" r="18" {...getStyle(RegiaoCorpo.LOMBAR)} onPress={() => handlePress(RegiaoCorpo.LOMBAR)} />
                
                {/* Aquiles */}
                <Circle cx="80" cy="330" r="12" {...getStyle(RegiaoCorpo.AQUILES_ESQUERDO)} onPress={() => handlePress(RegiaoCorpo.AQUILES_ESQUERDO)} />
                <Circle cx="120" cy="330" r="12" {...getStyle(RegiaoCorpo.AQUILES_DIREITO)} onPress={() => handlePress(RegiaoCorpo.AQUILES_DIREITO)} />
              </>
            )}
          </G>
        </Svg>
      </View>
    </View>
  );
}
