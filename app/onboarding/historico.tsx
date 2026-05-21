import React, { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { SelectableCard } from '../../components/onboarding/SelectableCard';
import { Texto } from '../../components/ui/Texto';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { HistoricoClinicoOpcao } from '../../types/onboarding';

export default function HistoricoScreen() {
  const router = useRouter();
  const { data, togglePredisposicao, setNotaClinica, setStep } = useOnboardingStore();
  
  const [modo, setModo] = useState<'nenhum' | 'lista' | 'texto'>('nenhum');
  const [nota, setNota] = useState(data.nota_clinica || '');

  useEffect(() => {
    setStep(13);
  }, []);

  const handleNext = () => {
    if (modo === 'texto' && nota) {
      setNotaClinica(nota);
    }
    router.push('/onboarding/gerando');
  };

  const hasPredisposicao = (opcao: HistoricoClinicoOpcao) => {
    return (data.historico_clinico || []).includes(opcao);
  };

  return (
    <OnboardingScreen
      title="Histórico clínico (opcional)"
      subtitle="Tem mais alguma coisa que precisamos saber?"
      currentStep={13}
      totalSteps={14}
      onNext={handleNext}
    >
      <View className="pt-6 pb-20">
        <SelectableCard
          title="Pular esta etapa"
          selected={modo === 'nenhum'}
          onPress={() => setModo('nenhum')}
        />
        <SelectableCard
          title="Marcar predisposições conhecidas"
          selected={modo === 'lista'}
          onPress={() => setModo('lista')}
        />
        <SelectableCard
          title="Adicionar nota detalhada"
          selected={modo === 'texto'}
          onPress={() => setModo('texto')}
        />

        {modo === 'lista' && (
          <View className="mt-4 pt-4 border-t border-border-subtle">
            <Texto variant="h3" className="mb-4">Selecione as que se aplicam:</Texto>
            
            <SelectableCard
              title="Predisposição no joelho"
              selected={hasPredisposicao(HistoricoClinicoOpcao.PREDISPOSICAO_JOELHO)}
              onPress={() => togglePredisposicao(HistoricoClinicoOpcao.PREDISPOSICAO_JOELHO)}
            />
            <SelectableCard
              title="Predisposição no quadril"
              selected={hasPredisposicao(HistoricoClinicoOpcao.PREDISPOSICAO_QUADRIL)}
              onPress={() => togglePredisposicao(HistoricoClinicoOpcao.PREDISPOSICAO_QUADRIL)}
            />
            <SelectableCard
              title="Predisposição no tendão de Aquiles"
              selected={hasPredisposicao(HistoricoClinicoOpcao.PREDISPOSICAO_AQUILES)}
              onPress={() => togglePredisposicao(HistoricoClinicoOpcao.PREDISPOSICAO_AQUILES)}
            />
            <SelectableCard
              title="Condromalácia patelar"
              selected={hasPredisposicao(HistoricoClinicoOpcao.CONDROMALACIA_PATELAR)}
              onPress={() => togglePredisposicao(HistoricoClinicoOpcao.CONDROMALACIA_PATELAR)}
            />
            <SelectableCard
              title="Hérnia de disco prévia"
              selected={hasPredisposicao(HistoricoClinicoOpcao.HERNIA_DE_DISCO_PREVIA)}
              onPress={() => togglePredisposicao(HistoricoClinicoOpcao.HERNIA_DE_DISCO_PREVIA)}
            />
            <SelectableCard
              title="Lesão no ombro prévia"
              selected={hasPredisposicao(HistoricoClinicoOpcao.LESAO_OMBRO_PREVIA)}
              onPress={() => togglePredisposicao(HistoricoClinicoOpcao.LESAO_OMBRO_PREVIA)}
            />
          </View>
        )}

        {modo === 'texto' && (
          <View className="mt-4 pt-4 border-t border-border-subtle">
            <Texto variant="h3" className="mb-4">Descreva sua situação:</Texto>
            <View className="bg-elevated border border-border-subtle rounded-md p-4 min-h-[120px]">
              <TextInput
                value={nota}
                onChangeText={setNota}
                placeholder="Ex: Tive uma cirurgia no joelho esquerdo em 2021..."
                placeholderTextColor="var(--color-fg-muted)"
                multiline
                className="font-body text-[15px] leading-[22.5px] text-fg-primary w-full h-full text-left align-top"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>
        )}
      </View>
    </OnboardingScreen>
  );
}
