import React from 'react';
import { View } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Egg } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';

export default function NutricaoScreen() {
  const { tokens } = useTheme();

  return (
    <Container className="justify-center items-center p-6">
      <View className="items-center gap-4">
        <Egg size={48} color={tokens.accent.bronze} weight="light" />
        <Texto variant="h2" className="text-center">Nutrição Inteligente</Texto>
        <Texto variant="body" color="secondary" className="text-center max-w-[280px]">
          Fórmula de proteína dinâmica, fichas científicas de suplementação e alertas na Fase 8.
        </Texto>
      </View>
    </Container>
  );
}
