import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SliderInput } from '../../components/onboarding/SliderInput';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function AlturaScreen() {
  const router = useRouter();
  const { data, setAltura, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(5);
    if (!data.altura_cm) {
      setAltura(170); // Default value
    }
  }, []);

  const handleNext = () => {
    router.push('/onboarding/nivel-treino');
  };

  return (
    <OnboardingScreen
      title="E a sua altura?"
      currentStep={5}
      totalSteps={14}
      onNext={handleNext}
    >
      <View className="flex-1 justify-center pb-20">
        <SliderInput
          value={data.altura_cm || 170}
          onChange={setAltura}
          min={140}
          max={220}
          unit="cm"
        />
      </View>
    </OnboardingScreen>
  );
}
