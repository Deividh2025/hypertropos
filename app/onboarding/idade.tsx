import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SliderInput } from '../../components/onboarding/SliderInput';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function IdadeScreen() {
  const router = useRouter();
  const { data, setIdade, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(2);
    if (!data.idade) {
      setIdade(30); // Default value
    }
  }, []);

  const handleNext = () => {
    router.push('/onboarding/genero');
  };

  return (
    <OnboardingScreen
      title="Qual a sua idade?"
      currentStep={2}
      totalSteps={14}
      onNext={handleNext}
    >
      <View className="flex-1 justify-center pb-20">
        <SliderInput
          value={data.idade || 30}
          onChange={setIdade}
          min={15}
          max={80}
          unit="anos"
        />
      </View>
    </OnboardingScreen>
  );
}
