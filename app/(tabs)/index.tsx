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
import { Flame, CalendarBlank, Check, Moon, Sun, ArrowRight, Trophy, Shield, Gear } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import SilhuetaHome from '../../components/silhueta/SilhuetaHome';
import { SCULPTED_EASING } from '../../constants/easing';
import { SkeletonHome } from '../../components/ui/Skeletons';


const AnimatedFlame = Animated.createAnimatedComponent(Flame);

export default function HomeScreen() {
  const { tokens, theme, toggleTheme } = useTheme();
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

  // 2. Dispara animação da chama reativa se streak > 0
  useEffect(() => {
    if (streakAtual > 0) {
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
  }, [streakAtual]);

  // 3. Dispara animação de crescimento da barra fina de XP
  useEffect(() => {
    xpBarWidth.value = withTiming(progresso.proporcao * 100, {
      duration: 800,
      easing: SCULPTED_EASING,
    });
  }, [progresso.proporcao]);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const xpBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${xpBarWidth.value}%`,
  }));

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

  return (
    <Container>
      <ScrollView 
        contentContainerStyle={{ padding: 24, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row */}
        <View className="flex-row justify-between items-center">
          <View>
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
              className="p-2 bg-elevated rounded-full border border-border-subtle"
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
              accessibilityLabel="Configurações"
            >
              <Gear size={20} color={tokens.accent.bronze} weight="light" />
            </Pressable>
            <Pressable 
              onPress={toggleTheme}
              className="p-2 bg-elevated rounded-full border border-border-subtle"
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
            >
              {theme === 'dark' ? (
                <Sun size={20} color={tokens.accent.bronze} weight="light" />
              ) : (
                <Moon size={20} color={tokens.accent.bronze} weight="light" />
              )}
            </Pressable>
          </View>
        </View>

        {/* 1. SILHUETA CORPORAL VETORIAL SKIA DYNAMIC EVOLUTION */}
        <SilhuetaHome />

        {/* 2. CARD DE TREINO DE HOJE */}
        <View className="gap-2">
          <Texto variant="captionBold" color="secondary" className="px-1">
            TREINO DE HOJE
          </Texto>

          {sessaoDoDia ? (
            <Card 
              padding="lg"
              elevated
              onPress={() => router.push('/treino/pre-treino')}
              className="w-full relative"
            >
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
                  {(sessaoDoDia.exercicios_prescritos || sessaoDoDia.exercicios || []).length} exercícios
                </Texto>
                <Texto variant="caption" color="muted">
                  ·
                </Texto>
                <Texto variant="caption" color="muted">
                  ~45 min estimados
                </Texto>
              </View>

              {/* Ficha Arrow CTA */}
              <View className="absolute right-4 bottom-4 flex-row items-center gap-1">
                <Texto variant="caption" color="bronze" className="text-[12px]">Ficha</Texto>
                <ArrowRight size={14} color={tokens.accent.bronze} weight="light" />
              </View>
            </Card>
          ) : (
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

        {/* 3. STREAK E FREEZES ATUALIZADOS E ANIMADOS */}
        <View className="flex-row items-center justify-between bg-elevated/40 border border-border-subtle/50 px-4 py-3 rounded-md">
          <View className="flex-row items-center gap-3">
            <AnimatedFlame 
              size={24} 
              color={tokens.accent.bronze} 
              weight={streakAtual > 0 ? 'regular' : 'light'} 
              style={flameAnimatedStyle}
            />
            <View>
              <View className="flex-row items-center gap-1.5">
                <Texto variant="bodyBold">
                  {streakAtual > 0 ? `${streakAtual} dias seguidos` : 'Comece sua sequência hoje'}
                </Texto>
                {freezeRecente && (
                  <Shield size={16} color={tokens.feedback.warning} weight="fill" />
                )}
              </View>
              <Texto variant="caption" color="muted">
                {freezesDisponiveis > 0 ? `🛡️ ${freezesDisponiveis} freezes disponíveis` : 'Sem freezes de proteção'}
              </Texto>
            </View>
          </View>
        </View>

        {/* 4. BARRA FINA DE XP RUMO AO PRÓXIMO NÍVEL */}
        <View className="gap-2">
          <View className="flex-row justify-between items-end">
            <Texto variant="captionBold" color="secondary">
              Nível {progresso.nivel}
            </Texto>
            <Texto variant="caption" color="muted">
              {Math.round(progresso.xpNoNivel)} / {progresso.xpNecessarioNoNivel} XP
            </Texto>
          </View>
          <View className="h-[4px] bg-elevated rounded-full overflow-hidden w-full">
            <Animated.View 
              className="bg-accent-bronze h-full"
              style={xpBarAnimatedStyle}
            />
          </View>
        </View>

        {/* Auxiliary Weekly Link */}
        <View className="items-center mt-2">
          <Botao 
            variant="ghost" 
            onPress={() => router.push('/treino/semana')}
            className="flex-row items-center gap-2"
          >
            <Texto variant="body" color="bronze">Ver semana completa</Texto>
            <ArrowRight size={16} color={tokens.accent.bronze} weight="light" />
          </Botao>
        </View>

        {/* Extra option for development */}
        <View className="mt-8 opacity-20 hover:opacity-100 transition-opacity">
          <Botao variant="destructive" size="sm" onPress={regenerarPrograma}>
            Regenerar Rotina Semanal
          </Botao>
        </View>
      </ScrollView>

      {/* 5. MODAL / SHEET PROMPT DE FREEZE PROTETOR */}
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
            className="w-full max-w-[320px] rounded-[28px] border p-6 items-center shadow-overlay"
          >
            <View className="w-14 h-14 rounded-full bg-feedback-warning/15 justify-center items-center mb-4">
              <Shield size={30} color={tokens.feedback.warning} weight="regular" />
            </View>

            <Texto variant="h2" className="text-center font-bold mb-2 tracking-tight">
              Salvar sua Sequência?
            </Texto>

            <Texto variant="body" color="secondary" className="text-center mb-6 leading-[21px]">
              Você perdeu o dia ontem. Deseja utilizar 1 freeze para preservar sua sequência de {freezeDiasStreak} dias?
            </Texto>

            <View className="w-full gap-2">
              <Botao variant="primary" size="md" onPress={usarFreeze} className="w-full">
                Usar 1 Freeze
              </Botao>
              <Botao variant="ghost" size="md" onPress={ignorarFreeze} className="w-full">
                Não, deixe quebrar
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
