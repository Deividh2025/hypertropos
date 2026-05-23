import React from 'react';
import { View } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { GraduationCap } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';

export default function CienciaScreen() {
  const { tokens } = useTheme();

  return (
    <Container className="justify-center items-center p-6">
      <View className="items-center gap-4">
        <GraduationCap size={48} color={tokens.accent.bronze} weight="light" />
        <Texto variant="h2" className="text-center">Biblioteca Científica</Texto>
        <Texto variant="body" color="secondary" className="text-center max-w-[280px]">
          Meta-análises e estudos primários traduzidos para recomendações práticas de treino e nutrição na Fase 7.
        </Texto>
      </View>
    </Container>
  );
}
