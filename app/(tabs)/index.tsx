import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useProgramaStore } from '../../stores/programaStore';
import { useGamificacaoStore } from '../../stores/gamificacaoStore';
import { Flame, CalendarBlank, Check, Moon, Sun, ArrowRight, Shield, Gear } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import SilhuetaHome from '../../components/silhueta/SilhuetaHome';
import { SCULPTED_EASING } from '../../constants/easing';
import { SkeletonHome } from '../../components/ui/Skeletons';


const AnimatedFlame = Animated.createAnimatedComponent(Flame);

export default function HomeScreen() {
  const { tokens, theme, toggleTheme, calmMode, toggleCalmMode } = useTheme();
  const router = useRouter();

  const {
    sessaoDoDia,
    carregando: carregandoPrograma,
    erro: erroPrograma,
    carregarProgramaInicial,
    regenerarPrograma,
    modoExpress,
    setModoExpress
  } = useProgramaStore();

  const {
    xpTotal,
    nivelAtual,
    streakAtual,
    freezesDisponiveis,
    ultimoFreezeUsado,
    carregando: carregandoGamificacao,
    mostrarPromptFreeze,
    freezeDiasStreak,
    inicializarGamificacao,
    verificarNecessidadeFreeze,
    usarFreeze,
    ignorarFreeze
  } = useGamificacaoStore();

  // Shared values para as microinterações da chama e barra de XP
  const flameScale = useSharedValue(1);
  const xpBarWidth = useSharedValue(0);

  useEffect(() => {
    // Inicialização unificada
    async function inicializarTela() {
      await carregarProgramaInicial();
      await inicializarGamificacao();
      await verificarNecessidadeFreeze();
    }
    inicializarTela();
  }, []);

  // 1. Cálculo da curva de XP logarítmica para UI do Hypertropos
  // Formula: XP acumulado para nível N = 50 * (N - 1) * N
  const obterProgressoXP = (xp: number) => {
    let lvl = 1;
    while (50 * lvl * (lvl + 1) <= xp) {
      lvl++;
    }
    const xpMinNivel = 50 * (lvl - 1) * lvl;
    const xpMaxNivel = 50 * lvl * (lvl + 1);
    const xpNoNivel = xp - xpMinNivel;
    const xpNecessarioNoNivel = xpMaxNivel - xpMinNivel;
    const proporcao = xpNoNivel / xpNecessarioNoNivel;

    return {
      nivel: lvl,
      xpNoNivel,
      xpNecessarioNoNivel,
      proporcao
    };
  };

  const progresso = obterProgressoXP(xpTotal);

  // 2. Dispara animação da chama reativa se streak > 0 (desligada no modo calmo)
  useEffect(() => {
    if (streakAtual > 0 && !calmMode) {
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1100, easing: SCULPTED_EASING }),
          withTiming(1.0, { duration: 1100, easing: SCULPTED_EASING })
        ),
        -1, // loop infinito
        true
      );
    } else {
      flameScale.value = 1;
    }
  }, [streakAtual, calmMode]);

  // 3. Dispara animação de crescimento da barra fina de XP (instantânea no modo calmo)
  useEffect(() => {
    if (calmMode) {
      xpBarWidth.value = progresso.proporcao * 100;
    } else {
      xpBarWidth.value = withTiming(progresso.proporcao * 100, {
        duration: 800,
        easing: SCULPTED_EASING,
      });
    }
  }, [progresso.proporcao, calmMode]);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const xpBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${xpBarWidth.value}%`,
  }));

  // Brilho "dopaminérgico" concentrado na ação/recompensa. Desligado no modo calmo.
  const glow = (color: string) =>
    calmMode
      ? null
      : {
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 6,
        };

  // 4. Verificação de freeze recente (últimos 7 dias)
  const freezeRecente = (() => {
    if (!ultimoFreezeUsado) return false;
    const diffMs = new Date().getTime() - new Date(ultimoFreezeUsado).getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias <= 7;
  })();

  const carregando = carregandoPrograma || carregandoGamificacao;

  if (carregando) {
    return <SkeletonHome />;
  }

  if (erroPrograma) {
    return (
      <Container className="p-6 justify-center items-center gap-4">
        <Texto variant="h2" color="error" className="text-center">Falha ao carregar</Texto>
        <Texto variant="body" color="secondary" className="text-center max-w-[280px]">
          {erroPrograma}
        </Texto>
        <Botao variant="primary" onPress={carregarProgramaInicial}>
          Tentar Novamente
        </Botao>
      </Container>
    );
  }

  // Mock de conclusão do dia (pode ser integrado com histórico diário futuro)
  const treinoConcluidoHoje = false;
  const numExercicios = sessaoDoDia
    ? (sessaoDoDia.exercicios_prescritos || sessaoDoDia.exercicios || []).length
    : 0;

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 22 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-3">
            <Texto variant="displayL" className="tracking-tight">Hypertropos</Texto>
            <Texto variant="caption" color="secondary">
              Tensão mecânica · Hipertrofia em casa
            </Texto>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/configuracoes' as any);
              }}
              className="bg-elevated rounded-full border border-border-subtle"
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
              accessibilityLabel="Configurações"
            >
              <Gear size={20} color={tokens.accent.bronze} weight="light" />
            </Pressable>
            <Pressable
              onPress={toggleTheme}
              className="bg-elevated rounded-full border border-border-subtle"
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
              accessibilityLabel="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun size={20} color={tokens.accent.bronze} weight="light" />
              ) : (
                <Moon size={20} color={tokens.accent.bronze} weight="light" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Modo calmo: reduz brilhos e animações (dias de sobrecarga) */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleCalmMode();
          }}
          className="flex-row items-center justify-end gap-2"
          accessibilityRole="switch"
          accessibilityState={{ checked: calmMode }}
          accessibilityLabel="Modo calmo"
        >
          <Texto variant="caption" color="muted">Modo calmo</Texto>
          <View
            style={{
              width: 42,
              height: 24,
              borderRadius: 99,
              padding: 2,
              backgroundColor: calmMode ? tokens.accent.bronze : tokens.bg.highlight,
              borderWidth: 1,
              borderColor: tokens.border.subtle,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: calmMode ? tokens.fg.inverse : tokens.fg.secondary,
                transform: [{ translateX: calmMode ? 18 : 0 }],
              }}
            />
          </View>
        </Pressable>

        {/* ======= AÇÃO PRIMÁRIA: TREINO DE HOJE (foco único, brilhante) ======= */}
        <View className="gap-2">
          <Texto variant="captionBold" color="secondary" className="px-1">
            TREINO DE HOJE
          </Texto>

          {sessaoDoDia ? (
            <View className="w-full rounded-lg border border-border-strong bg-elevated p-5" style={{ overflow: 'hidden' }}>
              {/* Borda de luz no topo */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: tokens.accent.gold }} />

              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <CalendarBlank size={20} color={tokens.accent.bronze} weight="light" />
                  <Texto variant="caption" color="secondary" className="capitalize">
                    {sessaoDoDia.dia_da_semana || 'Hoje'}
                  </Texto>
                </View>

                {treinoConcluidoHoje ? (
                  <View className="flex-row items-center gap-1 bg-feedback-success/10 py-1 px-2 rounded-xs border border-feedback-success/20">
                    <Check size={14} color={tokens.feedback.success} weight="bold" />
                    <Texto variant="caption" color="success">Concluído</Texto>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1 bg-accent-bronze/10 py-1 px-2 rounded-xs">
                    <Texto variant="caption" color="bronze">Pendente</Texto>
                  </View>
                )}
              </View>

              <Texto variant="h3" className="mb-1">{sessaoDoDia.nome}</Texto>

              <View className="flex-row items-center gap-3 mt-2">
                <Texto variant="body" color="secondary">
                  {numExercicios} exercícios
                </Texto>
                <Texto variant="caption" color="muted">·</Texto>
                <Texto variant="caption" color="muted">~45 min</Texto>
              </View>

              {/* CTA dourado — o elemento mais brilhante da tela */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/treino/pre-treino');
                }}
                accessibilityRole="button"
                accessibilityLabel="Começar treino"
                style={[
                  {
                    marginTop: 18,
                    backgroundColor: tokens.accent.gold,
                    borderRadius: 14,
                    paddingVertical: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  },
                  glow(tokens.accent.gold),
                ]}
              >
                <Texto variant="bodyBold" style={{ color: tokens.fg.inverse }}>
                  Começar treino
                </Texto>
                <ArrowRight size={18} color={tokens.fg.inverse} weight="bold" />
              </Pressable>
            </View>
          ) : (
            // Dia de descanso — calmo por design (baixo estímulo)
            <Card padding="lg" elevated className="w-full">
              <View className="flex-row items-center gap-2 mb-2">
                <CalendarBlank size={20} color={tokens.accent.bronze} weight="light" />
                <Texto variant="caption" color="secondary">Descanso Científico</Texto>
              </View>
              <Texto variant="h3" className="mb-2">Hoje é dia de descanso</Texto>
              <Texto variant="body" color="secondary">
                Aproveite para recuperar. O crescimento muscular acontece durante a recuperação e síntese proteica (Schoenfeld et al. 2017).
              </Texto>
            </Card>
          )}
        </View>

        {/* ======= PROGRESSO CALMO + RSD-SAFE (sequência + XP) ======= */}
        <View className="bg-elevated border border-border-subtle rounded-lg p-4">
          {/* Sequência — enquadrada como acúmulo, sem linguagem de "quebra" */}
          <View className="flex-row items-center gap-3">
            <View
              style={[
                {
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: tokens.bg.highlight,
                },
                streakAtual > 0 ? glow(tokens.accent.bronze) : null,
              ]}
            >
              <AnimatedFlame
                size={24}
                color={streakAtual > 0 ? tokens.accent.gold : tokens.fg.muted}
                weight={streakAtual > 0 ? 'fill' : 'light'}
                style={flameAnimatedStyle}
              />
            </View>
            <View className="flex-1">
              <Texto variant="bodyBold">
                {streakAtual > 0
                  ? `${streakAtual} ${streakAtual === 1 ? 'dia' : 'dias'} de treino acumulados`
                  : 'Vamos começar sua jornada'}
              </Texto>
              <Texto variant="caption" color="muted">
                {streakAtual > 0 ? 'Continue no seu ritmo' : 'Cada treino conta — sem pressão'}
              </Texto>
            </View>
            {/* Freezes como rede de proteção (cor calma) */}
            <View className="items-end">
              <View className="flex-row items-center gap-1">
                <Shield size={15} color={tokens.feedback.success} weight="fill" />
                <Texto variant="caption" style={{ color: tokens.feedback.success }}>
                  {freezesDisponiveis}
                </Texto>
              </View>
              <Texto variant="caption" color="muted" className="text-[10px]">
                {freezesDisponiveis > 0 ? 'freezes protegem' : 'sem freezes'}
              </Texto>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: tokens.border.subtle, marginVertical: 14 }} />

          {/* XP — enquadrado como conquista (distância percorrida) */}
          <View className="flex-row justify-between items-end mb-2">
            <Texto variant="captionBold">Nível {progresso.nivel}</Texto>
            <Texto variant="caption" color="muted">
              {Math.round(progresso.xpNoNivel)} XP conquistados
            </Texto>
          </View>
          <View className="h-[8px] bg-canvas rounded-full overflow-hidden w-full border border-border-subtle">
            <Animated.View
              style={[
                { height: '100%', backgroundColor: tokens.accent.gold, borderRadius: 99 },
                xpBarAnimatedStyle,
                glow(tokens.accent.gold),
              ]}
            />
          </View>
          <Texto variant="caption" style={{ color: tokens.feedback.success, marginTop: 8 }}>
            {Math.round(progresso.proporcao * 100)}% rumo ao Nível {progresso.nivel + 1}
          </Texto>
        </View>

        {/* ======= SECUNDÁRIO: silhueta / tier (calmo, não compete) ======= */}
        <SilhuetaHome />

        {/* Link auxiliar — semana completa */}
        <View className="items-center mt-1">
          <Botao
            variant="ghost"
            onPress={() => router.push('/treino/semana')}
            className="flex-row items-center gap-2"
          >
            <Texto variant="body" color="bronze">Ver semana completa</Texto>
            <ArrowRight size={16} color={tokens.accent.bronze} weight="light" />
          </Botao>
        </View>

        {/* Ação de desenvolvimento — visível apenas em builds de dev */}
        {__DEV__ && (
          <View className="mt-8 opacity-40">
            <Botao variant="destructive" size="sm" onPress={regenerarPrograma}>
              Regenerar Rotina Semanal
            </Botao>
          </View>
        )}
      </ScrollView>

      {/* 5. MODAL / SHEET PROMPT DE FREEZE PROTETOR (copy RSD-safe) */}
      {mostrarPromptFreeze && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={[StyleSheet.absoluteFill, styles.modalContainer]}
          className="justify-center items-center px-6"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={ignorarFreeze} />

          <Animated.View
            entering={FadeIn.duration(400).delay(100)}
            style={{ backgroundColor: tokens.bg.elevated, borderColor: tokens.border.strong }}
            className="w-full max-w-[320px] rounded-[28px] border p-6 items-center"
          >
            <View className="w-14 h-14 rounded-full bg-accent-bronze/15 justify-center items-center mb-4">
              <Shield size={30} color={tokens.accent.bronze} weight="regular" />
            </View>

            <Texto variant="h2" className="text-center font-bold mb-2 tracking-tight">
              Proteger sua sequência?
            </Texto>

            <Texto variant="body" color="secondary" className="text-center mb-6 leading-[21px]">
              Faltou ontem — tudo bem. Quer usar 1 freeze para manter seus {freezeDiasStreak} dias acumulados?
            </Texto>

            <View className="w-full gap-2">
              <Botao variant="primary" size="md" onPress={usarFreeze} className="w-full">
                Usar 1 Freeze
              </Botao>
              <Botao variant="ghost" size="md" onPress={ignorarFreeze} className="w-full">
                Agora não
              </Botao>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(26, 23, 21, 0.80)',
    zIndex: 99999,
  },
});
