import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { salvarPerfil } from '../../db/queries/perfil';
import { FaseNutricional, Perfil } from '../../types';
import { mapearRegiaoParaArticulacao, mapearSeveridadeParaNivel } from '../../types/onboarding';

const FRASES = [
  "Analisando seu perfil...",
  "Selecionando exercícios ideais...",
  "Montando sua rotina semanal..."
];

export default function GerandoScreen() {
  const router = useRouter();
  const [fraseIndex, setFraseIndex] = useState(0);
  const { data, clearOnboarding, setStep } = useOnboardingStore();
  
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.8);

  useEffect(() => {
    setStep(14);

    // Animação de pulso no centro
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    );
    
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0.8, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    );

    // Rotação de frases
    const fraseInterval = setInterval(() => {
      setFraseIndex((prev) => (prev < FRASES.length - 1 ? prev + 1 : prev));
    }, 800);

    // Processar e salvar após 2.5s
    const salvarTimeout = setTimeout(async () => {
      await finalizarOnboarding();
    }, 2500);

    return () => {
      clearInterval(fraseInterval);
      clearTimeout(salvarTimeout);
    };
  }, []);

  const finalizarOnboarding = async () => {
    try {
      // Mapeamento dos dados do Zustand para o tipo Perfil da DB
      const perfilParaSalvar: Perfil = {
        idade: data.idade!,
        genero_biologico: data.genero_biologico!,
        peso_corporal_kg: data.peso_corporal_kg!,
        altura_cm: data.altura_cm!,
        nivel: data.nivel!,
        nivel_atividade_extra_treino: data.nivel_atividade_extra_treino!,
        dias_disponiveis_semana: data.dias_disponiveis_semana!,
        duracao_alvo_sessao_min: data.duracao_alvo_sessao_min!,
        horario_preferido_treino: data.horario_preferido_treino!,
        equipamento_disponivel: data.equipamento_disponivel,
        
        // Mapear restrições (separa por região com lateralidade -> Articulação s/ lateralidade)
        restricoes_articulares: data.restricoes_articulares?.map(r => ({
          articulacao: mapearRegiaoParaArticulacao(r.regiao),
          nivel_severidade: mapearSeveridadeParaNivel(r.severidade)
        })) || [],
        
        historico_clinico: data.historico_clinico || [],
        
        // Defaults e deduções
        fase_nutricional: FaseNutricional.HIPERTROFIA,
        meta_proteina_g_kg: 1.8,
        data_criacao: new Date().toISOString(),
        ultima_atualizacao: new Date().toISOString(),
      };

      // Adicionar a nota livre ao histórico clínico se existir
      if (data.nota_clinica) {
        perfilParaSalvar.historico_clinico?.push(`NOTA: ${data.nota_clinica}`);
      }

      await salvarPerfil(perfilParaSalvar);
      await AsyncStorage.setItem('onboarding_complete', 'true');
      
      clearOnboarding(); // Limpa a store parcial
      
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error);
      // Se falhar, vamos para home mesmo assim ou mostrar erro? Indo para home por ora.
      router.replace('/(tabs)');
    }
  };

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Container className="flex-1 items-center justify-center bg-canvas">
      <View className="items-center w-full px-6">
        <View className="h-32 items-center justify-center mb-8 relative">
          <Animated.View 
            className="absolute w-16 h-16 rounded-full bg-accent-bronze"
            style={animatedPulseStyle}
          />
          <View className="w-8 h-8 rounded-full bg-accent-bronze shadow-overlay" />
        </View>

        <Texto variant="h2" className="mb-4 text-center">
          Preparando seu plano
        </Texto>

        <View className="h-8 items-center justify-center">
          <Animated.View key={fraseIndex} entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <Texto variant="body" color="secondary" className="text-center">
              {FRASES[fraseIndex]}
            </Texto>
          </Animated.View>
        </View>
      </View>
    </Container>
  );
}
