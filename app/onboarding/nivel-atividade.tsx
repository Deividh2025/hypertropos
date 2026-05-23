import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { NivelAtividade } from '../../types';

export default function NivelAtividadeScreen() {
  const router = useRouter();
  const { data, setNivelAtividade, setStep } = useOnboardingStore();

  useEffect(() => {
    setStep(7);
  }, []);

  const handleNext = () => {
    router.push('/onboarding/dias-semana');
  };

  return (
    <OnboardingScreen
      title="E como é seu dia a dia fora do treino?"
      subtitle="Isso define seu gasto calórico basal."
      currentStep={7}
      totalSteps={14}
      onNext={handleNext}
      nextDisabled={!data.nivel_atividade_extra_treino}
    >
      <View className="pt-6">
        <SelectableCard
          title="Sedentário"
          description="Trabalho sentado, pouco movimento diário."
          selected={data.nivel_atividade_extra_treino === NivelAtividade.SEDENTARIO}
          onPress={() => setNivelAtividade(NivelAtividade.SEDENTARIO)}
        />
        <SelectableCard
          title="Leve"
          description="Caminhadas eventuais ou trabalho com pouco movimento."
          selected={data.nivel_atividade_extra_treino === NivelAtividade.LEVE}
          onPress={() => setNivelAtividade(NivelAtividade.LEVE)}
        />
        <SelectableCard
          title="Moderado"
          description="Ativo no dia a dia, caminha bastante."
          selected={data.nivel_atividade_extra_treino === NivelAtividade.MODERADO}
          onPress={() => setNivelAtividade(NivelAtividade.MODERADO)}
        />
        <SelectableCard
          title="Muito ativo"
          description="Trabalho físico intenso ou muita atividade aeróbica extra."
          selected={data.nivel_atividade_extra_treino === NivelAtividade.MUITO_ATIVO}
          onPress={() => setNivelAtividade(NivelAtividade.MUITO_ATIVO)}
        />
      </View>
    </OnboardingScreen>
  );
}
