import React, { useState, useEffect } from 'react';
import { View, Modal, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeInDown,
  FadeOut
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import { SCULPTED_EASING } from '../../constants/easing';
import { Check, Plus, Minus, Trophy } from 'phosphor-react-native';
import { ParticulasCinzel } from '../feedback/ParticulasCinzel';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function BotaoConcluirSerie() {
  const { tokens } = useTheme();
  const { 
    exerciciosPrescritos, 
    exercicioAtualIndex, 
    statusSessao, 
    isPausado,
    concluirSerie 
  } = useSessaoStore();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [reps, setReps] = useState(10);
  const [rir, setRir] = useState(2);
  const [explosaoTrigger, setExplosaoTrigger] = useState(0);

  // Reanimated button scale
  const buttonScale = useSharedValue(1);

  const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
  
  useEffect(() => {
    if (currentPrescricao) {
      setReps(currentPrescricao.reps_alvo_max || 12);
      setRir(currentPrescricao.rir_alvo ?? 2);
    }
  }, [currentPrescricao, exercicioAtualIndex]);

  if (exerciciosPrescritos.length === 0 || statusSessao !== 'executando') return null;

  const handlePressIn = () => {
    if (isPausado) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    buttonScale.value = withTiming(0.95, { duration: 100, easing: SCULPTED_EASING });
  };

  const handlePressOut = () => {
    if (isPausado) return;
    buttonScale.value = withTiming(1.0, { duration: 150, easing: SCULPTED_EASING });
    setSheetVisible(true);
  };

  const handleConfirmar = () => {
    // Dispara animação de partículas de cinzel
    setExplosaoTrigger(prev => prev + 1);
    
    // Dispara haptic médio imediato de sucesso no botão
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Fecha o modal após uma pequena janela para ver a animação e depois avança
    setTimeout(() => {
      setSheetVisible(false);
      concluirSerie(reps, rir);
    }, 450);
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const repsMin = currentPrescricao?.reps_alvo_min || 8;
  const repsMax = currentPrescricao?.reps_alvo_max || 12;
  const rirAlvo = currentPrescricao?.rir_alvo ?? 2;

  // Lista rápida de reps recomendadas para toque único (Fitts' Law)
  const quickReps = Array.from(
    { length: 5 }, 
    (_, i) => Math.max(1, repsMax - 2 + i)
  );

  return (
    <View className="px-6 py-6 bg-canvas border-t border-border-subtle/50 h-[120px] justify-center items-center">
      {/* Botão Gigante de Conclusão */}
      <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isPausado}
          className="w-full flex-row justify-center items-center bg-accent-bronze rounded-md"
          style={[styles.giantButton, isPausado && { opacity: 0.4 }]}
        >
          <Texto 
            variant="h3" 
            color="inverse" 
            className="text-[18px] font-semibold text-center uppercase tracking-wider"
          >
            CONCLUÍ SÉRIE
          </Texto>
        </Pressable>
      </Animated.View>

      {/* Sheet Modal Inferior */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          {/* Fundo do modal clicável para cancelar */}
          <Pressable className="flex-1" onPress={() => setSheetVisible(false)} />

          <Animated.View
            entering={FadeInDown.duration(300).easing(SCULPTED_EASING)}
            exiting={FadeOut.duration(200)}
            className="w-full rounded-t-lg p-6 pb-8 border-t border-border-strong/70"
            style={{ backgroundColor: tokens.bg.overlay, minHeight: SCREEN_HEIGHT * 0.52 }}
          >
            {/* Linha indicadora de arrastar */}
            <View className="w-12 h-1 bg-border-subtle rounded-full align-self-center mb-6 mx-auto" />

            <Texto variant="h2" className="text-center font-bold mb-6">Registrar Esforço Real</Texto>

            {/* SELETOR DE REPETIÇÕES (Massivo, touch-first com botões +/- e pílulas rápidas) */}
            <View className="mb-6 gap-2">
              <Texto variant="captionBold" color="secondary" className="text-center">REPETIÇÕES REALIZADAS</Texto>
              
              <View className="flex-row justify-center items-center gap-6 py-2">
                {/* Botão de Menos */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setReps(prev => Math.max(1, prev - 1));
                  }}
                  className="w-12 h-12 rounded-full bg-bg-highlight justify-center items-center"
                  style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
                >
                  <Minus size={22} color={tokens.fg.primary} weight="bold" />
                </Pressable>

                {/* Exibição Gigante do Número */}
                <View className="w-20 items-center">
                  <Texto variant="numericHero" className="text-[48px] font-bold tracking-tighter">
                    {reps}
                  </Texto>
                </View>

                {/* Botão de Mais */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setReps(prev => prev + 1);
                  }}
                  className="w-12 h-12 rounded-full bg-bg-highlight justify-center items-center"
                  style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
                >
                  <Plus size={22} color={tokens.fg.primary} weight="bold" />
                </Pressable>
              </View>

              {/* Pílulas rápidas de Fitts' Law */}
              <View className="flex-row justify-center gap-2 mt-1">
                {quickReps.map((val) => (
                  <Pressable
                    key={val}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setReps(val);
                    }}
                    className={`px-4 py-2 rounded-sm border ${
                      reps === val 
                        ? 'bg-accent-bronze/10 border-accent-bronze' 
                        : 'bg-canvas border-border-subtle'
                    }`}
                  >
                    <Texto variant="captionBold" color={reps === val ? 'bronze' : 'secondary'}>
                      {val} reps
                    </Texto>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* SELETOR DE RIR (Reserva de Repetições) */}
            <View className="mb-8 gap-2">
              <View className="flex-row justify-between px-1">
                <Texto variant="captionBold" color="secondary">PERCEPÇÃO DE RIR (Reps de Reserva)</Texto>
                <Texto variant="captionBold" color="bronze">Alvo: RIR {rirAlvo}</Texto>
              </View>

              <View className="flex-row justify-between mt-2">
                {[0, 1, 2, 3, 4, 5].map((val) => {
                  const isSelected = rir === val;
                  const isAlvo = val === rirAlvo;

                  return (
                    <Pressable
                      key={val}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setRir(val);
                      }}
                      className={`w-11 h-11 rounded-full justify-center items-center border ${
                        isSelected 
                          ? 'bg-accent-bronze border-accent-bronze' 
                          : isAlvo 
                            ? 'bg-accent-bronze/10 border-accent-bronze/40'
                            : 'bg-bg-highlight border-border-subtle'
                      }`}
                    >
                      <Texto 
                        variant="bodyBold" 
                        color={isSelected ? 'inverse' : isAlvo ? 'bronze' : 'primary'}
                      >
                        {val}
                      </Texto>
                      {val === 0 && (
                        <Texto 
                          className="absolute -bottom-5 text-[8px] font-bold"
                          color={isSelected ? 'bronze' : 'muted'}
                        >
                          Falha
                        </Texto>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Botão de Confirmar e Partículas de Celebração */}
            <View className="relative mt-auto">
              <Botao
                variant="primary"
                size="lg"
                onPress={handleConfirmar}
                className="w-full flex-row gap-2"
              >
                <Check size={20} color={tokens.fg.inverse} weight="bold" />
                <Texto variant="bodyBold" color="inverse">Confirmar Série</Texto>
              </Botao>
              
              {/* Partículas acopladas disparadas no Confirmar */}
              <ParticulasCinzel count={10} trigger={explosaoTrigger} />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
  },
  giantButton: {
    height: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
