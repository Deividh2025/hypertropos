import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { Card } from '../ui/Card';
import { useSessaoStore } from '../../stores/sessaoStore';
import { SCULPTED_EASING } from '../../constants/easing';
import { Info, Metronome, ArrowCircleRight } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';

export function InfoSerie() {
  const { tokens } = useTheme();
  const { exerciciosPrescritos, exercicioAtualIndex, serieAtualIndex, exerciciosCatalogMap } = useSessaoStore();

  if (exerciciosPrescritos.length === 0) return null;

  const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
  const exercicioDetalhes = exerciciosCatalogMap[currentPrescricao.exercicio_id];

  const repsMin = currentPrescricao.reps_alvo_min || 8;
  const repsMax = currentPrescricao.reps_alvo_max || 12;
  const rirAlvo = currentPrescricao.rir_alvo ?? 2;

  // Cadência recomendada obtida do banco local
  const excentrica = exercicioDetalhes?.cadencia_excentrica ?? 3;
  const isometrica = exercicioDetalhes?.cadencia_isometrica ?? 0;
  const concentrica = exercicioDetalhes?.cadencia_concentrica ?? 1;

  const cadenciaTexto = isometrica > 0 
    ? `Excêntrica ${excentrica}s · Isométrica ${isometrica}s · Concêntrica ${concentrica}s`
    : `Excêntrica ${excentrica}s · Concêntrica ${concentrica}s`;

  // Chave exclusiva para disparar a animação de entrada do Reanimated toda vez que a série ou exercício mudar
  const animKey = `${exercicioAtualIndex}_${serieAtualIndex}`;

  return (
    <Animated.View
      key={animKey}
      entering={FadeInDown.duration(300).easing(SCULPTED_EASING)}
      className="px-6 py-4 gap-3 bg-canvas justify-center"
      style={{ height: 'auto' }}
    >
      <Card padding="md" elevated className="border border-border-subtle/80 rounded-md">
        {/* Titulo Série e Faixa */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="gap-0.5">
            <Texto variant="h2" color="bronze" className="text-[20px] font-bold">
              Série {serieAtualIndex + 1} de {currentPrescricao.series_alvo}
            </Texto>
            <Texto variant="caption" color="secondary">Instruções de Esforço</Texto>
          </View>
          <View className="px-3 py-1.5 rounded-sm bg-accent-bronze/10 border border-accent-bronze/20">
            <Texto variant="h3" color="bronze" className="font-bold text-[16px]">
              {repsMin}-{repsMax} reps
            </Texto>
          </View>
        </View>

        {/* Divisor */}
        <View className="h-[1px] bg-border-subtle/50 my-2" />

        {/* Cadência e RIR Alvo */}
        <View className="gap-3">
          {/* Cadência */}
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-bg-highlight justify-center items-center">
              <Metronome size={18} color={tokens.accent.bronze} weight="light" />
            </View>
            <View className="flex-1">
              <Texto variant="caption" color="muted">Cadência sugerida</Texto>
              <Texto variant="body" className="font-medium">
                {cadenciaTexto}
              </Texto>
            </View>
          </View>

          {/* RIR Alvo */}
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-bg-highlight justify-center items-center">
              <ArrowCircleRight size={18} color={tokens.accent.bronze} weight="fill" />
            </View>
            <View className="flex-1">
              <Texto variant="caption" color="muted">Alvo de Proximidade da Falha</Texto>
              <Texto variant="bodyBold" color="primary">
                RIR alvo: {rirAlvo} {rirAlvo === 0 ? '(Até a Falha Total)' : `(reserve ${rirAlvo} reps)`}
              </Texto>
            </View>
          </View>
        </View>

        {/* Nota técnica ou observação se houver */}
        {currentPrescricao.notas && (
          <View className="mt-3 flex-row gap-2 bg-canvas/60 border border-border-subtle/40 p-3 rounded-sm items-start">
            <Info size={16} color={tokens.fg.muted} className="mt-0.5" />
            <Texto variant="caption" color="muted" className="flex-1 italic leading-[18px]">
              {currentPrescricao.notas}
            </Texto>
          </View>
        )}
      </Card>
    </Animated.View>
  );
}
