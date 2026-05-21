import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { Nivel } from '../../types/exercicio';

export default function NivelTreinoScreen() {
  const router = useRouter();
  const { data, setNivelTreino, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(6);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/nivel-atividade');
  };

  return (
    <OnboardingScreen
      title="Qual seu nível de treino atual?"
      subtitle="Baseado nos últimos 6 meses."
      currentStep={6}
      totalSteps={14}
      onNext={handleNext}
      nextDisabled={!data.nivel}
    >
      <View className="pt-6">
        <SelectableCard
          title="Iniciante"
          description="Nunca treinei ou parei há mais de 1 ano."
          selected={data.nivel === Nivel.INICIANTE}
          onPress={() => setNivelTreino(Nivel.INICIANTE)}
        />
        <SelectableCard
          title="Intermediário (Retornando)"
          description="Treinei antes, mas estou voltando agora."
          selected={data.nivel === Nivel.INTERMEDIARIO_RETORNANDO}
          onPress={() => setNivelTreino(Nivel.INTERMEDIARIO_RETORNANDO)}
        />
        <SelectableCard
          title="Intermediário"
          description="Treino consistente há pelo menos 6 meses."
          selected={data.nivel === Nivel.INTERMEDIARIO}
          onPress={() => setNivelTreino(Nivel.INTERMEDIARIO)}
        />
        <SelectableCard
          title="Avançado"
          description="Treino há 2+ anos com progressão documentada."
          selected={data.nivel === Nivel.AVANCADO}
          onPress={() => setNivelTreino(Nivel.AVANCADO)}
        />
      </View>
    </OnboardingScreen>
  );
}
