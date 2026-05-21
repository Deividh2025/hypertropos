import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { Equipamento } from '../../types/exercicio';
import { Texto } from '../../components/ui/Texto';

export default function EquipamentoScreen() {
  const router = useRouter();
  const { data, toggleEquipamento, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(11);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/restricoes');
  };

  const hasItem = (item: Equipamento) => {
    return (data.equipamento_disponivel || []).includes(item);
  };

  return (
    <OnboardingScreen
      title="O que você tem disponível?"
      subtitle="Pode marcar mais de um. Nossos exercícios usarão a mobília da sua casa."
      currentStep={11}
      totalSteps={14}
      onNext={handleNext}
      // Not disabling the button here, as "nothing" is a valid bodyweight choice
      nextLabel={data.equipamento_disponivel?.length === 0 ? "Continuar sem equipamento extra" : "Avançar"}
    >
      <View className="pt-6">
        <SelectableCard
          title="Mesa robusta"
          description="Para remadas invertidas."
          selected={hasItem(Equipamento.MESA)}
          onPress={() => toggleEquipamento(Equipamento.MESA)}
          icon={<Texto variant="displayL">🪑</Texto>} // Using chair emoji as fallback, could be better
        />
        <SelectableCard
          title="Cadeira firme"
          description="Para dips, step-ups e apoio."
          selected={hasItem(Equipamento.CADEIRA)}
          onPress={() => toggleEquipamento(Equipamento.CADEIRA)}
          icon={<Texto variant="displayL">🪑</Texto>}
        />
        <SelectableCard
          title="Piso encerado/liso"
          description="Para exercícios com sliders ou toalhas."
          selected={hasItem(Equipamento.PISO_LISO)}
          onPress={() => toggleEquipamento(Equipamento.PISO_LISO)}
          icon={<Texto variant="displayL">✨</Texto>}
        />
        <SelectableCard
          title="Parede livre"
          description="Para handstands e wall sits."
          selected={hasItem(Equipamento.PAREDE)}
          onPress={() => toggleEquipamento(Equipamento.PAREDE)}
          icon={<Texto variant="displayL">🧱</Texto>}
        />
        <SelectableCard
          title="Livros pesados"
          description="Para déficit em flexões e agachamentos."
          selected={hasItem(Equipamento.LIVRO)}
          onPress={() => toggleEquipamento(Equipamento.LIVRO)}
          icon={<Texto variant="displayL">📚</Texto>}
        />
      </View>
    </OnboardingScreen>
  );
}
