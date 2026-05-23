import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import { FRASES_FINAL_SESSAO } from '../../constants/microcopy';
import { useMicrocopy } from '../feedback/MicrocopyVariavel';
import { ParticulasCinzel } from '../feedback/ParticulasCinzel';
import { Trophy, Barbell, Clock, CalendarDays, Flame, Lightning } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function CelebracaoFinalSessao() {
  const { tokens } = useTheme();
  const router = useRouter();
  
  const {
    statusSessao,
    exerciciosPrescritos,
    historicoSeries,
    tempoTotalSegundos,
    modoExpress,
    exerciciosCatalogMap,
    cancelarSessao
  } = useSessaoStore();

  const [frase, setFrase] = useState('');
  const [celebTrigger, setCelebTrigger] = useState(0);

  const obterFraseCeleb = useMicrocopy(FRASES_FINAL_SESSAO);

  useEffect(() => {
    if (statusSessao === 'finalizada') {
      setFrase(obterFraseCeleb());
      
      // Gatilho inicial da animação lenta de fagulhas douradas (~800ms)
      setCelebTrigger(1);
      const timerParticulas = setTimeout(() => {
        setCelebTrigger(2);
      }, 500);

      // Vibração de notificação de sucesso
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      return () => clearTimeout(timerParticulas);
    }
  }, [statusSessao, obterFraseCeleb]);

  if (statusSessao !== 'finalizada') return null;

  const handleConcluido = () => {
    // Reseta o estado da store para idle e volta à Home
    cancelarSessao();
    router.replace('/');
  };

  // Formatador MM:SS
  const formatarTempo = (segundos: number) => {
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Mapeia os grupos musculares exercitados no treino
  const gruposTrabalhados = new Set<string>();
  historicoSeries.forEach((setRec) => {
    const exDetails = exerciciosCatalogMap[setRec.exercicioId];
    if (exDetails) {
      gruposTrabalhados.add(exDetails.grupo_muscular_primario);
    }
  });

  const arrayGrupos = Array.from(gruposTrabalhados);

  return (
    <Animated.View 
      entering={FadeIn.duration(600)} 
      style={[StyleSheet.absoluteFill, { backgroundColor: tokens.bg.canvas, zIndex: 10000 }]}
      className="justify-center items-center px-6 py-10"
    >
      {/* Explosão de Cinzas e Fagulhas Douradas (Alta Densidade) */}
      <ParticulasCinzel count={28} trigger={celebTrigger} color={tokens.accent.gold} />

      <View className="w-full flex-1 justify-center gap-6 max-w-[450px]">
        {/* Ícone de Troféu */}
        <View className="items-center mb-2">
          <View className="w-20 h-20 rounded-full bg-accent-gold/10 border border-accent-gold/20 justify-center items-center shadow-lg">
            <Trophy size={42} color={tokens.accent.gold} weight="fill" />
          </View>
        </View>

        {/* Cabeçalho */}
        <View className="gap-2 items-center">
          <Texto variant="displayL" className="text-center font-bold tracking-tight text-[32px] text-fg-primary">
            Sessão Concluída!
          </Texto>
          <Texto variant="caption" color="muted" className="text-center italic px-4 leading-[18px]">
            “{frase}”
          </Texto>
        </View>

        {/* Card Resumo do Treino */}
        <Animated.View entering={SlideInDown.delay(200).duration(500).easing(SCULPTED_EASING)}>
          <Card padding="lg" elevated className="border border-border-strong rounded-md gap-4 shadow-xl">
            <Texto variant="h3" color="bronze" className="font-bold border-b border-border-subtle/50 pb-2">
              Resumo Técnico do Treino
            </Texto>

            {/* Grid de Estatísticas */}
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {/* Exercícios */}
              <View className="w-[46%] flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-full bg-bg-highlight justify-center items-center">
                  <Barbell size={18} color={tokens.accent.bronze} weight="bold" />
                </View>
                <View>
                  <Texto variant="caption" color="muted">Exercícios</Texto>
                  <Texto variant="bodyBold">{exerciciosPrescritos.length} concluídos</Texto>
                </View>
              </View>

              {/* Séries */}
              <View className="w-[46%] flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-full bg-bg-highlight justify-center items-center">
                  <Flame size={18} color={tokens.accent.bronze} weight="fill" />
                </View>
                <View>
                  <Texto variant="caption" color="muted">Séries Totais</Texto>
                  <Texto variant="bodyBold">{historicoSeries.length} séries</Texto>
                </View>
              </View>

              {/* Duração */}
              <View className="w-[46%] flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-full bg-bg-highlight justify-center items-center">
                  <Clock size={18} color={tokens.accent.bronze} weight="bold" />
                </View>
                <View>
                  <Texto variant="caption" color="muted">Tempo Total</Texto>
                  <Texto variant="bodyBold">{formatarTempo(tempoTotalSegundos)}</Texto>
                </View>
              </View>

              {/* Express ou Completo */}
              <View className="w-[46%] flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-full bg-bg-highlight justify-center items-center">
                  <Lightning size={18} color={tokens.accent.gold} weight="fill" />
                </View>
                <View>
                  <Texto variant="caption" color="muted">Formato</Texto>
                  <Texto variant="bodyBold" color={modoExpress ? 'gold' : 'primary'}>
                    {modoExpress ? 'Sessão Express' : 'Científico Completo'}
                  </Texto>
                </View>
              </View>
            </View>

            {/* Músculos Trabalhados */}
            <View className="border-t border-border-subtle/50 pt-3 gap-2">
              <Texto variant="captionBold" color="secondary">Grupos Musculares Ativados:</Texto>
              <View className="flex-row flex-wrap gap-2 mt-1">
                {arrayGrupos.map((g) => (
                  <View key={g} className="px-3 py-1 rounded-full bg-accent-bronze/10 border border-accent-bronze/20">
                    <Texto variant="captionBold" color="bronze" className="text-[10px] uppercase font-bold tracking-wider">
                      {g}
                    </Texto>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Card Gamificação (Fase 6 Placeholders Reais integrados na store) */}
        <Animated.View entering={SlideInDown.delay(350).duration(500).easing(SCULPTED_EASING)}>
          <Card padding="md" className="border border-border-subtle rounded-md bg-elevated flex-row items-center gap-4 shadow-md">
            <View className="w-12 h-12 rounded-full bg-feedback-success/15 justify-center items-center">
              <Lightning size={24} color={tokens.feedback.success} weight="fill" />
            </View>
            <View className="flex-1 gap-0.5">
              <Texto variant="bodyBold" color="success">
                {modoExpress ? '+40 XP Obtidos' : '+100 XP Obtidos'}
              </Texto>
              <Texto variant="caption" color="muted">
                {modoExpress 
                  ? 'Streak protegido! Treinar express protege o streak em dias ruins.' 
                  : 'Sessão científica completa! Progresso total acumulado.'}
              </Texto>
            </View>
          </Card>
        </Animated.View>

        {/* Botão de Conclusão */}
        <Animated.View 
          entering={SlideInDown.delay(500).duration(500).easing(SCULPTED_EASING)}
          className="mt-4"
        >
          <Botao
            variant="primary"
            size="lg"
            onPress={handleConcluido}
            className="w-full flex-row gap-2"
          >
            <Texto variant="bodyBold" color="inverse">Concluído</Texto>
          </Botao>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
