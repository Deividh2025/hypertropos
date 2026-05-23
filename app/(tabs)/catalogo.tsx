import React from 'react';
import { View } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { BookOpen } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';

export default function CatalogoScreen() {
  const { tokens } = useTheme();

  return (
    <Container className="justify-center items-center p-6">
      <View className="items-center gap-4">
        <BookOpen size={48} color={tokens.accent.bronze} weight="light" />
        <Texto variant="h2" className="text-center">Catálogo de Exercícios</Texto>
        <Texto variant="body" color="secondary" className="text-center max-w-[280px]">
          Fichas científicas, dicas de execução e escada de progressão disponíveis na Fase 5.
        </Texto>
      </View>
    </Container>
  );
}
