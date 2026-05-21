import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function DuracaoSessaoScreen() {
  const router = useRouter();
  const { data, setDuracaoSessao, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(9);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/horario');
  };

  return (
    <OnboardingScreen
      title="Quanto tempo você tem por sessão?"
      subtitle="Vamos ajustar o volume de treino a esse tempo."
      currentStep={9}
      totalSteps={14}
      onNext={handleNext}
      nextDisabled={!data.duracao_alvo_sessao_min}
    >
      <View className="pt-6">
        <SelectableCard
          title="30 minutos"
          selected={data.duracao_alvo_sessao_min === 30}
          onPress={() => setDuracaoSessao(30)}
        />
        <SelectableCard
          title="45 minutos"
          selected={data.duracao_alvo_sessao_min === 45}
          onPress={() => setDuracaoSessao(45)}
        />
        <SelectableCard
          title="60 minutos"
          selected={data.duracao_alvo_sessao_min === 60}
          onPress={() => setDuracaoSessao(60)}
        />
        <SelectableCard
          title="75 minutos"
          selected={data.duracao_alvo_sessao_min === 75}
          onPress={() => setDuracaoSessao(75)}
        />
      </View>
    </OnboardingScreen>
  );
}
