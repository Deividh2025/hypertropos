import React from 'react';
import { View } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { ChartLineUp } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';

export default function ProgressoScreen() {
  const { tokens } = useTheme();

  return (
    <Container className="justify-center items-center p-6">
      <View className="items-center gap-4">
        <ChartLineUp size={48} color={tokens.accent.bronze} weight="light" />
        <Texto variant="h2" className="text-center">Seu Progresso</Texto>
        <Texto variant="body" color="secondary" className="text-center max-w-[280px]">
          Acompanhamento de volume semanal, histórico de cargas e evolução da silhueta disponível na Fase 6.
        </Texto>
      </View>
    </Container>
  );
}
