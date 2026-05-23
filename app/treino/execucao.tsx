import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useProgramaStore } from '../../stores/programaStore';
import { listarExercicios } from '../../db/queries/exercicios';
import { gerarSessaoExpress } from '../../lib/sessao-express';
import { Exercicio, ExercicioPrescrito } from '../../types';
import { ArrowLeft, Barbell, Clock, Lightning, ShieldCheck, CheckCircle } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

export default function ExecucaoScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  
  const { sessaoDoDia, modoExpress } = useProgramaStore();
  const [exerciciosMap, setExerciciosMap] = useState<Record<string, Exercicio>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarCatalog() {
      try {
        const catalogo = await listarExercicios();
        const map: Record<string, Exercicio> = {};
        catalogo.forEach(ex => {
          map[ex.id] = ex;
        });
        setExerciciosMap(map);
      } catch (err) {
        console.error('Erro no catálogo:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarCatalog();
  }, []);

  if (!sessaoDoDia) {
    return (
      <Container className="p-6 justify-center items-center gap-4">
        <Texto variant="h2">Sessão Inexistente</Texto>
        <Botao variant="primary" onPress={() => router.replace('/')}>
          Voltar para Home
        </Botao>
      </Container>
    );
  }

  // Se modoExpress estiver ativo, condensa dinamicamente a sessão!
  const sessaoProcessada = modoExpress ? gerarSessaoExpress(sessaoDoDia) : sessaoDoDia;
  const exerciciosPrescritos = sessaoProcessada.exercicios_prescritos || sessaoProcessada.exercicios || [];

  const handleConcluirTreino = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    AlertFinished();
  };

  const AlertFinished = () => {
    // Simula a conclusão e o acréscimo de XP na Fase 5/6
    router.replace('/');
  };

  return (
    <Container>
      {/* Header Row */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-subtle bg-elevated">
        <Pressable 
          onPress={() => router.back()} 
          className="p-2 -ml-2"
        >
          <ArrowLeft size={20} color={tokens.fg.primary} />
        </Pressable>
        <Texto variant="h2" className="flex-1 text-center pr-6">Executando Treino</Texto>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={tokens.accent.bronze} />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Sessão Title */}
          <View className="gap-1 mb-2">
            <Texto variant="h1">{sessaoProcessada.nome}</Texto>
            <Texto variant="body" color="secondary">
              {sessaoProcessada.descricao}
            </Texto>
          </View>

          {/* Express Badge Indicator */}
          {modoExpress ? (
            <Card 
              padding="sm" 
              className="flex-row items-center gap-3 border border-accent-gold/30 bg-accent-gold/10 rounded-md"
            >
              <Lightning size={22} color={tokens.accent.gold} weight="fill" />
              <View className="flex-1">
                <Texto variant="bodyBold" color="gold" className="text-[14px]">Modo Express Ativo</Texto>
                <Texto variant="caption" color="muted">
                  Treino comprimido para 3 exercícios chave de alta tensão mecânica.
                </Texto>
              </View>
            </Card>
          ) : (
            <Card 
              padding="sm" 
              className="flex-row items-center gap-3 border border-border-subtle bg-elevated rounded-md"
            >
              <ShieldCheck size={22} color={tokens.accent.bronze} weight="light" />
              <View className="flex-1">
                <Texto variant="bodyBold" className="text-[14px]">Modo Completo Científico</Texto>
                <Texto variant="caption" color="muted">
                  Volume de séries completo visando o máximo estímulo hipertrófico.
                </Texto>
              </View>
            </Card>
          )}

          {/* Prescribed List */}
          <Texto variant="captionBold" color="secondary" className="px-1 mt-2">
            LISTA DE EXERCÍCIOS ({exerciciosPrescritos.length})
          </Texto>

          {exerciciosPrescritos.map((ep, index) => {
            const exercicioDetalhes = exerciciosMap[ep.exercicio_id];
            const nomeExercicio = exercicioDetalhes?.nome || ep.exercicio_id.replace(/_/g, ' ');

            return (
              <Card 
                key={ep.id || index.toString()} 
                padding="md" 
                className="border border-border-subtle rounded-md bg-elevated"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-full bg-accent-bronze/10 justify-center items-center">
                      <Texto variant="bodyBold" color="bronze" className="text-[13px]">{index + 1}</Texto>
                    </View>
                    <Texto variant="bodyBold">{nomeExercicio}</Texto>
                  </View>
                  
                  {ep.substituido_por_restricao && (
                    <View className="px-2 py-0.5 rounded-xs bg-feedback-success/10 border border-feedback-success/20">
                      <Texto variant="caption" color="success" className="text-[10px] font-semibold">🛡️ Adaptado</Texto>
                    </View>
                  )}
                </View>

                <Texto variant="caption" color="secondary" className="mb-2">
                  Prescrição: {ep.series_alvo} séries × {ep.reps_alvo_min}-{ep.reps_alvo_max} reps · RIR {ep.rir_alvo} · {ep.descanso_segundos}s descanso
                </Texto>

                {ep.notas && (
                  <View className="bg-canvas border border-border-subtle/50 p-2.5 rounded-sm">
                    <Texto variant="caption" color="muted" className="text-[12px] leading-[16px] italic">
                      {ep.notes || ep.notas}
                    </Texto>
                  </View>
                )}
              </Card>
            );
          })}
          
          <View className="bg-elevated/40 border border-border-subtle/50 p-4 rounded-md items-center gap-2 mt-4">
            <Texto variant="h3" color="bronze">Fase 5: Execução Série a Série</Texto>
            <Texto variant="caption" color="muted" className="text-center">
              Na próxima fase implementaremos o timer interséries de alta precisão, o metrônomo de cadência e a gravação de séries concluídas no banco.
            </Texto>
          </View>
        </ScrollView>
      )}

      {/* Floating Sticky Footer */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-6 border-t border-border-subtle bg-overlay"
        style={{ backgroundColor: tokens.bg.overlay }}
      >
        <Botao 
          variant="primary" 
          size="lg"
          onPress={handleConcluirTreino}
          className="w-full flex-row gap-2"
        >
          <CheckCircle size={20} color={tokens.fg.inverse} weight="bold" />
          <Texto variant="bodyBold" color="inverse">Simular Conclusão de Treino</Texto>
        </Botao>
      </View>
    </Container>
  );
}
