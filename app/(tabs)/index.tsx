import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useProgramaStore } from '../../stores/programaStore';
import { Flame, CalendarBlank, Check, Moon, Sun, ArrowRight, Trophy } from 'phosphor-react-native';

export default function HomeScreen() {
  const { tokens, theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  const {
    programaAtual,
    sessaoDoDia,
    carregando,
    erro,
    streak,
    xpTotal,
    nivelAtual,
    freezes,
    carregarProgramaInicial,
    regenerarPrograma
  } = useProgramaStore();

  useEffect(() => {
    carregarProgramaInicial();
  }, []);

  if (carregando) {
    return (
      <Container className="justify-center items-center">
        <ActivityIndicator size="large" color={tokens.accent.bronze} />
        <Texto variant="body" color="secondary" className="mt-4">
          Orquestrando sua rotina científica...
        </Texto>
      </Container>
    );
  }

  if (erro) {
    return (
      <Container className="p-6 justify-center items-center gap-4">
        <Texto variant="h2" color="error" className="text-center">Falha ao carregar</Texto>
        <Texto variant="body" color="secondary" className="text-center max-w-[280px]">
          {erro}
        </Texto>
        <Botao variant="primary" onPress={carregarProgramaInicial}>
          Tentar Novamente
        </Botao>
      </Container>
    );
  }

  // Valores de gamificação fictícios conforme especificado no PRD para exibição inicial
  const mockXPAtual = 230;
  const mockXPNecessario = 500;
  const mockNivel = 3;
  const xpProporcao = mockXPAtual / mockXPNecessario;

  // Mock de conclusão do dia
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

        {/* 1. SILHUETA CORPORAL PLACEHOLDER (~40% of standard viewport) */}
        <View 
          className="bg-elevated border border-border-subtle rounded-lg justify-center items-center"
          style={{ height: 280 }}
        >
          <Trophy size={48} color={tokens.accent.bronze} weight="light" className="mb-3 opacity-60" />
          <Texto variant="caption" color="muted" className="text-center px-6">
            Sua silhueta aparece aqui (Fase 6)
          </Texto>
          <Texto variant="caption" color="muted" className="text-center px-6 text-[11px] mt-1 opacity-50">
            Estátua clássica greco-romana evolutiva
          </Texto>
        </View>

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

              {/* Pulse / Accent bar border subtle inside card */}
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

        {/* 3. STREAK ATUAL */}
        <View className="flex-row items-center justify-between bg-elevated/40 border border-border-subtle/50 px-4 py-3 rounded-md">
          <View className="flex-row items-center gap-3">
            <Flame 
              size={24} 
              color={tokens.accent.bronze} 
              weight={streak > 0 ? 'regular' : 'light'} 
            />
            <View>
              <Texto variant="bodyBold">
                {streak > 0 ? `${streak} dias seguidos` : 'Comece sua sequência hoje'}
              </Texto>
              <Texto variant="caption" color="muted">
                {freezes > 0 ? `🛡️ ${freezes} freezes disponíveis` : 'Sem freezes de proteção'}
              </Texto>
            </View>
          </View>
        </View>

        {/* 4. BARRA DE XP RUMO AO PRÓXIMO NÍVEL */}
        <View className="gap-2">
          <View className="flex-row justify-between items-end">
            <Texto variant="captionBold" color="secondary">
              Nível {mockNivel}
            </Texto>
            <Texto variant="caption" color="muted">
              {mockXPAtual} / {mockXPNecessario} XP
            </Texto>
          </View>
          <View className="h-[4px] bg-elevated rounded-full overflow-hidden w-full">
            <View 
              className="bg-accent-bronze h-full"
              style={{ width: `${xpProporcao * 100}%` }}
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
    </Container>
  );
}
