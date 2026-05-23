import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { Genero } from '../../types';

export default function GeneroScreen() {
  const router = useRouter();
  const { data, setGenero, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(3);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/peso');
  };

  return (
    <OnboardingScreen
      title="Gênero biológico"
      subtitle="Isso nos ajuda a estimar seu metabolismo basal e potencial de força."
      currentStep={3}
      totalSteps={14}
      onNext={handleNext}
      nextDisabled={!data.genero_biologico}
    >
      <View className="pt-6">
        <SelectableCard
          title="Masculino"
          selected={data.genero_biologico === Genero.MASCULINO}
          onPress={() => setGenero(Genero.MASCULINO)}
        />
        <SelectableCard
          title="Feminino"
          selected={data.genero_biologico === Genero.FEMININO}
          onPress={() => setGenero(Genero.FEMININO)}
        />
        <SelectableCard
          title="Prefiro não declarar"
          description="Usaremos valores medianos para cálculos."
          selected={data.genero_biologico === Genero.NAO_DECLARADO}
          onPress={() => setGenero(Genero.NAO_DECLARADO)}
        />
      </View>
    </OnboardingScreen>
  );
}
