import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import { Clock, SkipForward } from 'phosphor-react-native';

export function TimerDescanso() {
  const { tokens } = useTheme();
  
  const {
    exerciciosPrescritos,
    exercicioAtualIndex,
    serieAtualIndex,
    statusSessao,
    tempoDescansoRestante,
    tempoDescansoTotal,
    exerciciosCatalogMap,
    pularDescanso
  } = useSessaoStore();

  const scale = useSharedValue(1);

  useEffect(() => {
    // Timer pulsa nos últimos 3 segundos de descanso
    if (statusSessao === 'descansando' && tempoDescansoRestante <= 3 && tempoDescansoRestante > 0) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) }),
        withTiming(1.0, { duration: 200, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) })
      );
    } else {
      scale.value = 1.0;
    }
  }, [tempoDescansoRestante, statusSessao]);

  if (statusSessao !== 'descansando') return null;

  const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
  
  // Determina o texto de indicação do próximo passo
  let proximoTexto = '';
  if (serieAtualIndex + 1 < currentPrescricao?.series_alvo) {
    proximoTexto = `Próximo: Série ${serieAtualIndex + 2} de ${currentPrescricao.series_alvo}`;
  } else if (exercicioAtualIndex + 1 < exerciciosPrescritos.length) {
    const nextPresc = exerciciosPrescritos[exercicioAtualIndex + 1];
    const nextEx = exerciciosCatalogMap[nextPresc.exercicio_id];
    proximoTexto = `Próximo exercício: ${nextEx?.nome || nextPresc.exercicio_id.replace(/_/g, ' ')}`;
  } else {
    proximoTexto = 'Finalizando sessão de treino...';
  }

  // Formatador MM:SS ou SS
  const formatarTempo = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const animatedTimerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Barra de progresso circular simplificada/linear do descanso
  const progressoRestante = Math.max(0, Math.min(100, (tempoDescansoRestante / tempoDescansoTotal) * 100));

  return (
    <View className="px-6 py-6 bg-canvas border-t border-border-subtle/50 h-[240px] justify-center items-center gap-4">
      
      {/* Barra de progresso horizontal discreta */}
      <View className="w-full h-[3px] bg-bg-highlight rounded-full overflow-hidden absolute top-0 left-0 right-0">
        <View 
          className="h-full bg-accent-bronze"
          style={{ width: `${progressoRestante}%` }}
        />
      </View>

      {/* Título de descanso */}
      <View className="flex-row items-center gap-2 -mt-2">
        <Clock size={16} color={tokens.fg.muted} weight="bold" />
        <Texto variant="captionBold" color="secondary" className="uppercase tracking-widest text-[11px]">
          Tempo de Descanso Ativo
        </Texto>
      </View>

      {/* Contagem regressiva gigante animada */}
      <Animated.View style={[animatedTimerStyle, styles.timerContainer]}>
        <Texto 
          variant="numericHero" 
          color={tempoDescansoRestante <= 10 ? 'bronze' : 'primary'}
          className="font-bold tabular-nums tracking-tighter"
          style={{ fontSize: 68 }}
        >
          {formatarTempo(tempoDescansoRestante)}
        </Texto>
      </Animated.View>

      {/* Próximo passo */}
      <Texto variant="captionBold" color="muted" className="text-[13px] tracking-wide text-center">
        {proximoTexto}
      </Texto>

      {/* Botão de Pular Descanso */}
      <Botao
        variant="secondary"
        size="sm"
        onPress={pularDescanso}
        className="mt-2 w-[160px] flex-row gap-2"
        style={{ borderColor: tokens.border.subtle, height: 42, minHeight: 42 }}
      >
        <SkipForward size={16} color={tokens.fg.primary} weight="bold" />
        <Texto variant="captionBold" color="primary">Pular Descanso</Texto>
      </Botao>

    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
