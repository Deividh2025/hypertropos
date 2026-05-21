import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SliderInput } from '../../components/onboarding/SliderInput';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function PesoScreen() {
  const router = useRouter();
  const { data, setPeso, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(4);
    if (!data.peso_corporal_kg) {
      setPeso(70); // Default value
    }
  }, []);

  const handleNext = () => {
    router.push('/onboarding/altura');
  };

  return (
    <OnboardingScreen
      title="Qual o seu peso?"
      currentStep={4}
      totalSteps={14}
      onNext={handleNext}
    >
      <View className="flex-1 justify-center pb-20">
        <SliderInput
          value={data.peso_corporal_kg || 70}
          onChange={setPeso}
          min={40}
          max={150}
          unit="kg"
        />
      </View>
    </OnboardingScreen>
  );
}
