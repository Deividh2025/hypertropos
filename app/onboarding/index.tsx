import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { Texto } from '../../components/ui/Texto';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function BoasVindasScreen() {
  const router = useRouter();
  const setStep = useOnboardingStore(state => state.setStep);
  const clearOnboarding = useOnboardingStore(state => state.clearOnboarding);

  useEffect(() => {
    // Reset any previous onboarding state when starting
    clearOnboarding();
    setStep(1);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/idade');
  };

  return (
    <OnboardingScreen
      title="Bem-vindo ao Hypertropos"
      subtitle="Vamos criar uma rotina escultural para você."
      currentStep={1}
      totalSteps={14}
      onNext={handleNext}
      onBack={undefined} // No back button on first screen
      nextLabel="Começar"
    >
      <View className="flex-1 justify-center py-10">
        <Texto variant="bodyL" color="secondary" className="mb-6">
          Para moldar o seu plano ideal, precisamos conhecer o seu corpo, seus hábitos e suas limitações.
        </Texto>
        
        <Texto variant="bodyL" color="secondary">
          Este processo leva cerca de 2 minutos. Suas informações serão usadas exclusivamente para personalizar seus treinos.
        </Texto>
      </View>
    </OnboardingScreen>
  );
}
