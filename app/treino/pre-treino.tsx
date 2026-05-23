import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useProgramaStore } from '../../stores/programaStore';
import { listarExercicios } from '../../db/queries/exercicios';
import { Exercicio, ExercicioPrescrito } from '../../types';
import { CaretDown, CaretUp, ShieldCheck, Clock, Barbell, ArrowLeft } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { SkeletonPreTreino } from '../../components/ui/Skeletons';


// Componente de Exercício Prescrito com expansão inline memoizado
const ExercicioItem = React.memo(({ 
  ep, 
  exercicioDetalhes, 
  isExpanded, 
  onToggle, 
  tokens 
}: { 
  ep: ExercicioPrescrito; 
  exercicioDetalhes?: Exercicio; 
  isExpanded: boolean; 
  onToggle: () => void; 
  tokens: any;
}) => {
  const nomeExercicio = exercicioDetalhes?.nome || ep.exercicio_id.replace(/_/g, ' ');
  const totalSeries = ep.series_alvo;
  const repsText = ep.reps_alvo_min === ep.reps_alvo_max ? `${ep.reps_alvo_min}` : `${ep.reps_alvo_min}-${ep.reps_alvo_max}`;
  const descansoText = `${ep.descanso_segundos}s descanso`;

  return (
    <Card padding="none" className="overflow-hidden border border-border-subtle rounded-md bg-canvas">
      <Pressable 
        onPress={onToggle}
        className="p-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3 flex-1 pr-4">
          <View 
            className="w-10 h-10 bg-elevated rounded-sm justify-center items-center"
            style={{ backgroundColor: tokens.bg.elevated }}
          >
            <Barbell size={20} color={tokens.accent.bronze} weight="light" />
          </View>
          
          <View className="flex-1">
            <Texto variant="bodyBold" numberOfLines={1}>{nomeExercicio}</Texto>
            <Texto variant="caption" color="secondary">
              {totalSeries} séries × {repsText} reps · {descansoText}
            </Texto>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {ep.substituido_por_restricao && (
            <View 
              className="px-2 py-0.5 rounded-xs flex-row items-center gap-1"
              style={{ backgroundColor: tokens.feedback.success + '20' }}
            >
              <ShieldCheck size={12} color={tokens.feedback.success} weight="fill" />
              <Texto variant="caption" color="success" className="text-[10px] font-semibold">Adaptado</Texto>
            </View>
          )}
          {isExpanded ? (
            <CaretUp size={16} color={tokens.fg.muted} />
          ) : (
            <CaretDown size={16} color={tokens.fg.muted} />
          )}
        </View>
      </Pressable>

      {isExpanded && (
        <View 
          className="border-t border-divider p-4 gap-3"
          style={{ backgroundColor: tokens.bg.elevated }}
        >
          {/* Cadência */}
          {exercicioDetalhes?.cadencia_recomendada && (
            <View className="gap-0.5">
              <Texto variant="captionBold" color="secondary">Cadência Excêntrica Alongada</Texto>
              <Texto variant="caption" color="muted">
                {exercicioDetalhes.cadencia_recomendada.excentrica}s descida · {exercicioDetalhes.cadencia_recomendada.isometrica}s alongamento · {exercicioDetalhes.cadencia_recomendada.concentrica}s subida
              </Texto>
            </View>
          )}

          {/* Dicas técnicas */}
          {exercicioDetalhes?.dicas_tecnicas && exercicioDetalhes.dicas_tecnicas.length > 0 && (
            <View className="gap-1">
              <Texto variant="captionBold" color="secondary">Dicas Técnicas</Texto>
              {exercicioDetalhes.dicas_tecnicas.slice(0, 3).map((dica, idx) => (
                <Texto key={idx} variant="caption" color="muted">
                  · {dica}
                </Texto>
              ))}
            </View>
          )}

          {/* Notas científicas da prescrição */}
          {ep.notas && (
            <View className="bg-canvas border border-border-subtle/50 p-3 rounded-sm">
              <Texto variant="caption" color="secondary" className="italic leading-[18px]">
                {ep.notas}
              </Texto>
            </View>
          )}
        </View>
      )}
    </Card>
  );
});

export default function PreTreinoScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  
  const { 
    sessaoDoDia, 
    setModoExpress, 
    streak, 
    freezes,
    carregarProgramaInicial
  } = useProgramaStore();

  const [exerciciosMap, setExerciciosMap] = useState<Record<string, Exercicio>>({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega catálogo para resolver nomes e detalhes de execução
  useEffect(() => {
    async function carregarDetalhes() {
      try {
        const catalogo = await listarExercicios();
        const map: Record<string, Exercicio> = {};
        catalogo.forEach(ex => {
          map[ex.id] = ex;
        });
        setExerciciosMap(map);
      } catch (err) {
        console.error('Erro ao carregar detalhes do catálogo:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDetalhes();
  }, []);

  const handleToggle = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex(prev => prev === index ? null : index);
  }, []);

  const handleComecarAgora = () => {
    setModoExpress(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/treino/execucao');
  };

  const handleComecarExpress = () => {
    setModoExpress(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/treino/execucao');
  };

  const handleAdiarTreino = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (streak > 0 && freezes > 0) {
      Alert.alert(
        'Adiar Treino',
        `Você tem ${streak} dias de sequência ativa e ${freezes} freezes de proteção. Deseja usar 1 freeze para proteger seu streak?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sim, Usar Freeze 🛡️',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Sucesso', 'Freeze ativado com sucesso! Sua sequência está protegida. Até amanhã!');
              router.back();
            },
          },
          {
            text: 'Não, Adiar sem Freeze',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Aviso', 'Sua sequência de dias foi reiniciada. Recuperação faz parte do processo, mantenha o foco.');
              router.back();
            },
          }
        ]
      );
    } else {
      Alert.alert(
        'Adiar Treino',
        'Adiar treino para amanhã? Isso não afetará sua saúde, mas tente se manter constante.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => router.back() }
        ]
      );
    }
  };

  if (!sessaoDoDia) {
    return (
      <Container className="p-6 justify-center items-center gap-4">
        <Texto variant="h2">Sessão Inexistente</Texto>
        <Texto variant="body" color="secondary" className="text-center">
          Não há nenhuma sessão agendada para hoje no programa ativo.
        </Texto>
        <Botao variant="primary" onPress={() => router.back()}>
          Voltar para Home
        </Botao>
      </Container>
    );
  }

  const exerciciosPrescritos = sessaoDoDia.exercicios_prescritos || sessaoDoDia.exercicios || [];

  return (
    <Container>
      {/* Header Row */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-subtle bg-elevated">
        <Pressable 
          onPress={() => router.back()} 
          className="p-2 -ml-2"
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <ArrowLeft size={20} color={tokens.fg.primary} />
        </Pressable>
        <Texto variant="h2" className="flex-1 text-center pr-6">{sessaoDoDia.nome}</Texto>
      </View>

      {loading ? (
        <SkeletonPreTreino />
      ) : (

        <ScrollView 
          contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Metadata Card */}
          <Card padding="md" elevated className="mb-2 flex-row justify-between items-center bg-elevated">
            <View className="gap-1 flex-1">
              <Texto variant="captionBold" color="secondary">DETALHES DA SESSÃO</Texto>
              <Texto variant="body" color="secondary">
                Volume ideal para hipertrofia tensionar. Foco em amplitude total.
              </Texto>
            </View>
            <View className="flex-row items-center gap-1.5 ml-4 bg-accent-bronze/10 px-3 py-1.5 rounded-sm">
              <Clock size={16} color={tokens.accent.bronze} weight="light" />
              <Texto variant="captionBold" color="bronze">~45 min</Texto>
            </View>
          </Card>

          {/* Exercise List */}
          <Texto variant="captionBold" color="secondary" className="px-1 mt-2">
            EXERCÍCIOS DA SESSÃO
          </Texto>

          {exerciciosPrescritos.map((ep, index) => (
            <ExercicioItem
              key={ep.id || index.toString()}
              ep={ep}
              exercicioDetalhes={exerciciosMap[ep.exercicio_id]}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
              tokens={tokens}
            />
          ))}
        </ScrollView>
      )}

      {/* Floating Sticky Footer */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-6 gap-3 border-t border-border-subtle bg-overlay"
        style={{ backgroundColor: tokens.bg.overlay }}
      >
        <View className="flex-row gap-3">
          <Botao 
            variant="primary" 
            className="flex-1"
            size="lg"
            onPress={handleComecarAgora}
          >
            Começar Agora
          </Botao>
          <Botao 
            variant="secondary" 
            className="flex-1"
            size="lg"
            onPress={handleComecarExpress}
          >
            Sessão Express
          </Botao>
        </View>

        <Botao 
          variant="ghost" 
          size="sm"
          onPress={handleAdiarTreino}
          className="mt-1"
        >
          Adiar para amanhã
        </Botao>
      </View>
    </Container>
  );
}
