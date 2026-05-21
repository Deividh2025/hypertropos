import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function DiasSemanaScreen() {
  const router = useRouter();
  const { data, setDiasSemana, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(8);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/duracao-sessao');
  };

  return (
    <OnboardingScreen
      title="Quantos dias por semana você vai treinar?"
      subtitle="Escolha uma frequência que você consegue manter."
      currentStep={8}
      totalSteps={14}
      onNext={handleNext}
      nextDisabled={!data.dias_disponiveis_semana}
    >
      <View className="pt-6">
        <SelectableCard
          title="3 dias"
          description="Gera uma rotina Full Body — treino completo a cada sessão."
          selected={data.dias_disponiveis_semana === 3}
          onPress={() => setDiasSemana(3)}
        />
        <SelectableCard
          title="4 dias"
          description="Gera uma rotina Upper/Lower — alternância entre membros superiores e inferiores."
          selected={data.dias_disponiveis_semana === 4}
          onPress={() => setDiasSemana(4)}
        />
        <SelectableCard
          title="6 dias"
          description="Gera uma rotina PPL — Push, Pull, Legs em rotação constante."
          selected={data.dias_disponiveis_semana === 6}
          onPress={() => setDiasSemana(6)}
        />
      </View>
    </OnboardingScreen>
  );
}
