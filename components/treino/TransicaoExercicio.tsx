import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import { FRASES_ENTRE_EXERCICIOS } from '../../constants/microcopy';
import { ParticulasCinzel } from '../feedback/ParticulasCinzel';
import { useMicrocopy } from '../feedback/MicrocopyVariavel';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function TransicaoExercicio() {
  const { tokens } = useTheme();
  const { statusSessao, exercicioAtualIndex, exerciciosPrescritos, exerciciosCatalogMap, finalizarTransicao } = useSessaoStore();
  const [frase, setFrase] = useState('');
  const [particulaTrigger, setParticulaTrigger] = useState(0);

  const obterFraseUnica = useMicrocopy(FRASES_ENTRE_EXERCICIOS);

  useEffect(() => {
    if (statusSessao === 'transicao_exercicio') {
      // Sorteia frase e inicia animação
      const fraseSorteada = obterFraseUnica();
      setFrase(fraseSorteada);
      setParticulaTrigger(prev => prev + 1);

      // Auto transição após 3 segundos
      const timer = setTimeout(() => {
        finalizarTransicao();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [statusSessao, obterFraseUnica, finalizarTransicao]);

  if (statusSessao !== 'transicao_exercicio') return null;

  // Próximo exercício a ser executado
  const nextPresc = exerciciosPrescritos[exercicioAtualIndex + 1];
  const nextEx = nextPresc ? exerciciosCatalogMap[nextPresc.exercicio_id] : null;
  const nextExNome = nextEx?.nome || nextPresc?.exercicio_id?.replace(/_/g, ' ') || 'Próximo Exercício';

  return (
    <Animated.View 
      entering={FadeIn.duration(400)} 
      exiting={FadeOut.duration(400)}
      style={[StyleSheet.absoluteFill, { backgroundColor: tokens.bg.canvas, zIndex: 9999 }]}
      className="justify-center items-center px-8"
    >
      {/* Background Cinzas/Fagulhas */}
      <ParticulasCinzel count={16} trigger={particulaTrigger} color={tokens.accent.bronze} />

      {/* Box de transição */}
      <View className="items-center gap-6 max-w-[90%]">
        
        {/* Badge Indicadora */}
        <View className="px-3 py-1 rounded-sm bg-accent-bronze/10 border border-accent-bronze/20">
          <Texto variant="captionBold" color="bronze" className="uppercase tracking-widest text-[10px]">
            Transição
          </Texto>
        </View>

        {/* Citação Inspiradora do Cinzel */}
        <Texto 
          variant="displayL" 
          color="bronze" 
          className="text-center font-bold tracking-tight text-[36px] leading-[44px] my-2 italic"
        >
          “{frase}”
        </Texto>

        {/* Divisor ornamental */}
        <View className="w-16 h-[1.5px] bg-accent-bronze/30 my-2" />

        {/* Nome do Próximo Exercício */}
        <View className="items-center gap-1">
          <Texto variant="caption" color="muted" className="uppercase tracking-wider">
            A seguir:
          </Texto>
          <Texto variant="h2" color="primary" className="text-center font-bold text-[22px]">
            {nextExNome}
          </Texto>
          <Texto variant="caption" color="secondary" className="mt-1 text-center">
            {nextPresc?.series_alvo} séries × {nextPresc?.reps_alvo_min}-{nextPresc?.reps_alvo_max} reps
          </Texto>
        </View>

      </View>
    </Animated.View>
  );
}
