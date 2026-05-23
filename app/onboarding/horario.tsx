import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { HorarioTreino } from '../../types';
import { Texto } from '../../components/ui/Texto';

export default function HorarioScreen() {
  const router = useRouter();
  const { data, setHorarioTreino, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(10);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/equipamento');
  };

  return (
    <OnboardingScreen
      title="Qual seu horário preferido?"
      subtitle="Para configurarmos lembretes e adaptar dicas de nutrição."
      currentStep={10}
      totalSteps={14}
      onNext={handleNext}
      nextDisabled={!data.horario_preferido_treino}
    >
      <View className="pt-6">
        <SelectableCard
          title="Manhã"
          icon={<Texto variant="displayL">☀️</Texto>}
          selected={data.horario_preferido_treino === HorarioTreino.MANHA}
          onPress={() => setHorarioTreino(HorarioTreino.MANHA)}
        />
        <SelectableCard
          title="Tarde"
          icon={<Texto variant="displayL">🌤️</Texto>}
          selected={data.horario_preferido_treino === HorarioTreino.TARDE}
          onPress={() => setHorarioTreino(HorarioTreino.TARDE)}
        />
        <SelectableCard
          title="Noite"
          icon={<Texto variant="displayL">🌙</Texto>}
          selected={data.horario_preferido_treino === HorarioTreino.NOITE}
          onPress={() => setHorarioTreino(HorarioTreino.NOITE)}
        />
      </View>
    </OnboardingScreen>
  );
}
