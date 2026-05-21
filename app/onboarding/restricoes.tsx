import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SilhuetaTocavel } from '../../components/onboarding/SilhuetaTocavel';
import { RegiaoBottomSheet } from '../../components/onboarding/RegiaoBottomSheet';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { RegiaoCorpo, SeveridadeRestricao } from '../../types/onboarding';

export default function RestricoesScreen() {
  const router = useRouter();
  const { data, addRestricao, removeRestricao, setStep } = useOnboardingStore();
  const [selectedRegiao, setSelectedRegiao] = useState<RegiaoCorpo | null>(null);

  useEffect(() => {
    setStep(12);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/historico');
  };

  const handlePressRegiao = (regiao: RegiaoCorpo) => {
    setSelectedRegiao(regiao);
  };

  const handleConfirmRestricao = (regiao: RegiaoCorpo, severidade: SeveridadeRestricao) => {
    addRestricao(regiao, severidade);
  };

  const handleRemoveRestricao = (regiao: RegiaoCorpo) => {
    removeRestricao(regiao);
  };

  const existingRestricao = data.restricoes_articulares?.find(r => r.regiao === selectedRegiao);

  const totalRestricoes = data.restricoes_articulares?.length || 0;

  return (
    <>
      <OnboardingScreen
        title="Restrições articulares"
        subtitle="Toque nas áreas onde você tem alguma limitação. Você pode ter nenhuma, uma, ou várias."
        currentStep={12}
        totalSteps={14}
        onNext={handleNext}
        nextLabel={totalRestricoes === 0 ? "Continuar sem restrições" : "Avançar"}
      >
        <View className="pt-6 items-center flex-1">
          <SilhuetaTocavel 
            restricoes={data.restricoes_articulares || []} 
            onPressRegiao={handlePressRegiao} 
          />
        </View>
      </OnboardingScreen>

      <RegiaoBottomSheet
        visible={!!selectedRegiao}
        regiao={selectedRegiao}
        initialSeveridade={existingRestricao?.severidade}
        onClose={() => setSelectedRegiao(null)}
        onConfirm={handleConfirmRestricao}
        onRemove={handleRemoveRestricao}
      />
    </>
  );
}
