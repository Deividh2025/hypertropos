import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import { useGamificacaoStore } from '../../stores/gamificacaoStore';
import { FRASES_FINAL_SESSAO } from '../../constants/microcopy';
import { useMicrocopy } from '../feedback/MicrocopyVariavel';
import { ParticulasCinzel } from '../feedback/ParticulasCinzel';
import { CelebracaoConquista } from '../feedback/CelebracaoConquista';
import { TransicaoTier } from '../feedback/TransicaoTier';
import { Trophy, Barbell, Clock, Flame, Lightning, Star } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SCULPTED_EASING } from '../../constants/easing';

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

  const {
    celebracaoAtiva,
    filaCelebracoes,
    finalizarTreinoDopaminergico,
    desempilharCelebracao
  } = useGamificacaoStore();

  const [frase, setFrase] = useState('');
  const [celebTrigger, setCelebTrigger] = useState(0);
  const [xpContador, setXpContador] = useState(0);
  const [hasProcessed, setHasProcessed] = useState(false);

  const obterFraseCeleb = useMicrocopy(FRASES_FINAL_SESSAO);
  const totalXPGanho = modoExpress ? 40 : 100; // XP estimado base para contagem imediata

  // 1. Processar o treino no motor dopaminérgico assim que finalizado
  useEffect(() => {
    if (statusSessao === 'finalizada' && !hasProcessed) {
      setHasProcessed(true);
      setFrase(obterFraseCeleb());
      
      // Gatilho inicial da animação lenta de fagulhas douradas (~800ms)
      setCelebTrigger(1);
      const timerParticulas = setTimeout(() => {
        setCelebTrigger(2);
      }, 500);

      // Vibração de notificação de sucesso
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Mapeamento e disparo da gamificação reativa pos-sessão
      const seriesMapeadas = historicoSeries.map(s => {
        const prescrito = exerciciosPrescritos.find(ep => ep.exercicio_id === s.exercicioId);
        return {
          exercicio_id: s.exercicioId,
          reps_executadas: s.reps,
          rir_realizado: s.rir,
          rir_alvo: prescrito?.rir_alvo || 2
        };
      });

      // Dispara o orquestrador do motor de gamificação
      finalizarTreinoDopaminergico(Date.now().toString(), modoExpress, seriesMapeadas);

      return () => clearTimeout(timerParticulas);
    }
  }, [statusSessao, hasProcessed, obterFraseCeleb]);

  // 2. Animação de contagem de XP de 3 segundos
  useEffect(() => {
    if (statusSessao === 'finalizada') {
      let start = 0;
      const end = totalXPGanho;
      const duration = 3000; // 3 segundos
      const stepTime = Math.max(Math.floor(duration / end), 25);
      
      const timer = setInterval(() => {
        start += Math.ceil(end / (duration / stepTime));
        if (start >= end) {
          setXpContador(end);
          clearInterval(timer);
        } else {
          setXpContador(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [statusSessao]);

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

        {/* Card Gamificação - XP Progressivo Animado */}
        <Animated.View entering={SlideInDown.delay(350).duration(500).easing(SCULPTED_EASING)}>
          <Card padding="md" className="border border-border-subtle rounded-md bg-elevated flex-row items-center gap-4 shadow-md">
            <View className="w-12 h-12 rounded-full bg-feedback-success/15 justify-center items-center">
              <Lightning size={24} color={tokens.feedback.success} weight="fill" />
            </View>
            <View className="flex-1 gap-0.5">
              <Texto variant="bodyBold" color="success">
                +{xpContador} XP Obtidos
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
            onPress={celebracaoAtiva ? desempilharCelebracao : handleConcluido}
            className="w-full flex-row gap-2"
          >
            <Texto variant="bodyBold" color="inverse">
              {celebracaoAtiva ? 'Avançar Celebração' : 'Concluir'}
            </Texto>
          </Botao>
        </Animated.View>
      </View>

      {/* OVERLAYS SEQUENCIAIS DE CELEBRAÇÃO (Só mostram um por vez) */}
      {celebracaoAtiva && (
        <View style={StyleSheet.absoluteFill} className="justify-center items-center">
          
          {/* A. Novo Nível */}
          {celebracaoAtiva.type === 'nivel' && (
            <Animated.View
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(300)}
              style={[StyleSheet.absoluteFill, styles.localOverlay]}
              className="justify-center items-center px-6"
            >
              <Card className="w-full max-w-[320px] rounded-[28px] p-8 items-center shadow-overlay bg-bg-elevated border border-border-strong">
                <View className="w-16 h-16 rounded-full bg-feedback-success/15 justify-center items-center mb-6">
                  <Star size={36} color={tokens.feedback.success} weight="fill" />
                </View>
                <Texto variant="h1" className="text-center font-bold mb-2 tracking-tight">
                  Evolução Nível {celebracaoAtiva.nivel}!
                </Texto>
                <Texto variant="body" color="secondary" className="text-center mb-8 px-4">
                  Sua capacidade adaptativa aumentou. Novos limites biológicos alcançados!
                </Texto>
                <Botao variant="primary" size="lg" onPress={desempilharCelebracao} className="w-full">
                  Excelente
                </Botao>
              </Card>
            </Animated.View>
          )}

          {/* B. Conquista Desbloqueada */}
          {celebracaoAtiva.type === 'conquista' && (
            <CelebracaoConquista
              conquista={celebracaoAtiva.conquista}
              aoFechar={desempilharCelebracao}
            />
          )}

          {/* C. Transição de Tier */}
          {celebracaoAtiva.type === 'tier' && (
            <TransicaoTier
              tierAntigo={celebracaoAtiva.tierAntigo}
              tierNovo={celebracaoAtiva.tierNovo as any}
              aoFechar={desempilharCelebracao}
            />
          )}

        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  localOverlay: {
    backgroundColor: 'rgba(26, 23, 21, 0.85)',
    zIndex: 10500,
  },
});
