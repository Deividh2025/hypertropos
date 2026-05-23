import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  useWindowDimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useGamificacaoStore } from '../../stores/gamificacaoStore';
import { Conquista } from '../../types/gamificacao';
import * as Icons from 'phosphor-react-native';
import {
  Trophy,
  Calendar,
  Lock,
  Flame,
  Clock,
  Barbell,
  User,
  ChartBar,
  TrendUp,
  ClockCounterClockwise,
} from 'phosphor-react-native';
import { SCULPTED_EASING } from '../../constants/easing';
import { estatisticasGerais, volumeSemanaPorGrupo, historicoSessoes, linhaTempoPadraoMovimento, SessaoComResumo } from '../../db/queries/agregacoes';
import SilhuetaProgresso from '../../components/silhueta/SilhuetaProgresso';
import {
  Skeleton,
  SkeletonKPIs,
  SkeletonSilhueta,
  SkeletonVolume,
  SkeletonConquistas,
  SkeletonLinhaTempo,
  SkeletonHistorico,
} from '../../components/ui/Skeletons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type AbaType = 'silhueta' | 'volume' | 'conquistas' | 'linha_tempo' | 'historico';

interface KPIsData {
  total_treinos: number;
  total_series: number;
  total_tempo_horas: number;
  streak_maximo: number;
  conquistas_desbloqueadas: number;
}

const BarraProgressoVolume = React.memo(({ grupo, series, alvo, tokens }: {
  grupo: string;
  series: number;
  alvo: number;
  tokens: any;
}) => {
  const percentual = alvo > 0 ? Math.round((series / alvo) * 100) : 0;
  const percentualLimitado = Math.min(100, percentual);

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(percentualLimitado, {
      duration: 800,
      easing: SCULPTED_EASING,
    });
  }, [percentualLimitado, progressWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  let corFill = tokens.feedback.error;
  if (percentual >= 100) {
    corFill = tokens.feedback.success;
  } else if (percentual >= 50) {
    corFill = tokens.accent.gold;
  }

  const obterNomeGrupo = (g: string) => {
    switch (g) {
      case 'peito': return 'Peito';
      case 'costas': return 'Costas';
      case 'ombros': return 'Ombros';
      case 'triceps': return 'Tríceps';
      case 'biceps': return 'Bíceps';
      case 'quadriceps': return 'Quadríceps';
      case 'posterior': return 'Posterior';
      case 'gluteo': return 'Glúteo';
      case 'panturrilha': return 'Panturrilha';
      case 'core': return 'Core';
      default: return g.charAt(0).toUpperCase() + g.slice(1);
    }
  };

  return (
    <View className="mb-4.5">
      <View className="flex-row justify-between items-center mb-1.5">
        <Texto variant="bodyBold" className="text-[13px] tracking-wide">
          {obterNomeGrupo(grupo)}
        </Texto>
        <View className="flex-row items-center gap-1.5">
          <Texto variant="captionBold" color={percentual >= 100 ? 'success' : 'secondary'} className="text-[12px]">
            {series} / {alvo}
          </Texto>
          <Texto variant="caption" color="muted" className="text-[11px]">
            séries ({percentual}%)
          </Texto>
          {percentual >= 100 && (
            <Icons.CheckCircle size={14} color={tokens.feedback.success} weight="fill" />
          )}
        </View>
      </View>
      <View 
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', height: 8 }} 
        className="w-full rounded-full overflow-hidden"
      >
        <Animated.View 
          style={[{ backgroundColor: corFill, height: '100%' }, animatedStyle]} 
          className="rounded-full"
        />
      </View>
    </View>
  );
});

export default function ProgressoScreen() {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const { conquistas, inicializarGamificacao, carregando: carregandoGamificacao } = useGamificacaoStore();

  // Estados principais
  const [abaAtiva, setAbaAtiva] = useState<AbaType>('volume'); // Começa pela aba Volume por especificação
  const [carregandoKPIs, setCarregandoKPIs] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState<KPIsData>({
    total_treinos: 0,
    total_series: 0,
    total_tempo_horas: 0,
    streak_maximo: 0,
    conquistas_desbloqueadas: 0,
  });

  const [semanaOffset, setSemanaOffset] = useState<number>(0);
  const [volumeData, setVolumeData] = useState<{ grupo: string; series_efetivas: number; alvo: number }[]>([]);
  const [carregandoVolume, setCarregandoVolume] = useState<boolean>(true);

  // Estados para histórico e linha do tempo
  const [historicoData, setHistoricoData] = useState<SessaoComResumo[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState<boolean>(true);
  const [linhaTempoData, setLinhaTempoData] = useState<Record<string, any[]>>({});
  const [carregandoLinhaTempo, setCarregandoLinhaTempo] = useState<boolean>(true);

  // Conquista selecionada para o bottom sheet
  const [conquistaSelecionada, setConquistaSelecionada] = useState<Conquista | null>(null);

  // Reanimated shared values
  const sheetOffset = useSharedValue(SCREEN_HEIGHT);

  // Carrega todos os dados da tela
  const carregarDados = useCallback(async () => {
    try {
      await Promise.all([
        inicializarGamificacao(),
        (async () => {
          setCarregandoKPIs(true);
          const stats = await estatisticasGerais();
          setKpis(stats);
          setCarregandoKPIs(false);
        })(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do progresso:', error);
      setCarregandoKPIs(false);
    }
  }, [inicializarGamificacao]);

  const carregarVolume = useCallback(async (offset: number) => {
    setCarregandoVolume(true);
    try {
      const data = await volumeSemanaPorGrupo(offset);
      setVolumeData(data);
    } catch (error) {
      console.error('Erro ao carregar volume:', error);
    } finally {
      setCarregandoVolume(false);
    }
  }, []);

  const carregarHistorico = useCallback(async () => {
    setCarregandoHistorico(true);
    try {
      const data = await historicoSessoes();
      setHistoricoData(data);
    } catch (error) {
      console.error('Erro ao carregar historico:', error);
    } finally {
      setCarregandoHistorico(false);
    }
  }, []);

  const carregarLinhaTempo = useCallback(async () => {
    setCarregandoLinhaTempo(true);
    try {
      const padroes = [
        'push_horizontal',
        'push_vertical',
        'pull_horizontal',
        'pull_vertical',
        'joelho_dominante',
        'quadril_dominante',
        'panturrilha',
        'core',
      ];
      const results: Record<string, any[]> = {};
      await Promise.all(
        padroes.map(async (padrao) => {
          const res = await linhaTempoPadraoMovimento(padrao);
          results[padrao] = res;
        })
      );
      setLinhaTempoData(results);
    } catch (error) {
      console.error('Erro ao carregar linha do tempo:', error);
    } finally {
      setCarregandoLinhaTempo(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (abaAtiva === 'volume') {
      carregarVolume(semanaOffset);
    } else if (abaAtiva === 'historico') {
      carregarHistorico();
    } else if (abaAtiva === 'linha_tempo') {
      carregarLinhaTempo();
    }
  }, [abaAtiva, semanaOffset, carregarVolume, carregarHistorico, carregarLinhaTempo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const promises: Promise<any>[] = [carregarDados()];
    if (abaAtiva === 'volume') promises.push(carregarVolume(semanaOffset));
    if (abaAtiva === 'historico') promises.push(carregarHistorico());
    if (abaAtiva === 'linha_tempo') promises.push(carregarLinhaTempo());
    await Promise.all(promises);
    setRefreshing(false);
  }, [carregarDados, abaAtiva, semanaOffset, carregarVolume, carregarHistorico, carregarLinhaTempo]);

  // Abre e fecha detalhes da conquista
  const abrirDetalhes = (conquista: Conquista) => {
    setConquistaSelecionada(conquista);
    sheetOffset.value = withTiming(0, { duration: 400, easing: SCULPTED_EASING });
  };

  const fecharDetalhes = () => {
    sheetOffset.value = withTiming(SCREEN_HEIGHT, { duration: 300, easing: SCULPTED_EASING });
    setTimeout(() => setConquistaSelecionada(null), 300);
  };

  // Configuração das abas
  const abas: { id: AbaType; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'silhueta', label: 'Silhueta', icon: User },
    { id: 'volume', label: 'Volume', icon: ChartBar },
    { id: 'conquistas', label: 'Conquistas', icon: Trophy },
    { id: 'linha_tempo', label: 'Linha Tempo', icon: TrendUp },
    { id: 'historico', label: 'Histórico', icon: ClockCounterClockwise },
  ];

  const obterNomeExibicaoPadrao = (padrao: string) => {
    switch (padrao) {
      case 'push_horizontal': return 'Empurrar Horizontal (Peito, Tríceps)';
      case 'push_vertical': return 'Empurrar Vertical (Ombros)';
      case 'pull_horizontal': return 'Puxar Horizontal (Costas, Bíceps)';
      case 'pull_vertical': return 'Puxar Vertical (Costas Altas)';
      case 'joelho_dominante': return 'Joelho Dominante (Quadríceps)';
      case 'quadril_dominante': return 'Quadril Dominante (Glúteos, Posterior)';
      case 'panturrilha': return 'Panturrilha';
      case 'core': return 'Core / Abdômen';
      default: return padrao;
    }
  };

  // Renderizador do conteúdo da aba selecionada (com transições animadas)
  const renderConteudoAba = () => {
    const isCarregando = carregandoGamificacao || carregandoKPIs;

    switch (abaAtiva) {
      case 'silhueta':
        if (isCarregando) return <SkeletonSilhueta />;
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-6 pt-2">
            <SilhuetaProgresso />
          </Animated.View>
        );

      case 'volume':
        if (carregandoVolume) return <SkeletonVolume />;
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-6 pt-2">
            {/* Seletor de Período Horizontal */}
            <View 
              style={{ borderColor: tokens.border.subtle, backgroundColor: `${tokens.bg.elevated}50` }} 
              className="flex-row p-1 rounded-md border mb-5"
            >
              {[
                { label: 'Esta Semana', offset: 0 },
                { label: 'Semana Passada', offset: -1 },
                { label: '2 Semanas Atrás', offset: -2 },
              ].map((periodo) => {
                const ativo = semanaOffset === periodo.offset;
                return (
                  <Pressable
                    key={periodo.offset}
                    onPress={() => setSemanaOffset(periodo.offset)}
                    style={{
                      backgroundColor: ativo ? tokens.bg.elevated : 'transparent',
                    }}
                    className="flex-1 py-2 rounded-sm items-center justify-center min-h-[40px]"
                  >
                    <Texto
                      variant="captionBold"
                      color={ativo ? 'bronze' : 'muted'}
                      className="text-[12px]"
                    >
                      {periodo.label}
                    </Texto>
                  </Pressable>
                );
              })}
            </View>

            {/* Listagem de Volumes por Grupo Muscular */}
            <View className="mb-6">
              {volumeData.map((item) => (
                <BarraProgressoVolume
                  key={item.grupo}
                  grupo={item.grupo}
                  series={item.series_efetivas}
                  alvo={item.alvo}
                  tokens={tokens}
                />
              ))}
            </View>
          </Animated.View>
        );

      case 'conquistas':
        if (isCarregando) return <SkeletonConquistas />;
        
        // Mapeamento temporário do Grid de Conquistas da Fase 6 para validação da TabBar
        const numColunas = width > 600 ? 4 : 3;
        const renderConquistaItem = ({ item }: { item: Conquista }) => {
          const estaDesbloqueada = !!item.desbloqueada_em;
          const IconComponent = (Icons as any)[item.icone] || Trophy;
          const ehSurpresaTrancada = item.tipo === 'surpresa' && !estaDesbloqueada;
          const tituloExibido = ehSurpresaTrancada ? '???' : item.titulo;

          return (
            <Pressable
              onPress={() => abrirDetalhes(item)}
              className="flex-1 items-center p-3 m-1.5 rounded-md relative overflow-hidden"
              style={{
                backgroundColor: estaDesbloqueada ? `${tokens.accent.bronze}12` : 'rgba(110, 100, 87, 0.08)',
                borderWidth: 1,
                borderColor: estaDesbloqueada ? tokens.border.strong : 'transparent',
                height: 110,
                justifyContent: 'center',
              }}
            >
              <View
                className="w-12 h-12 rounded-full justify-center items-center mb-2"
                style={{
                  backgroundColor: estaDesbloqueada ? `${tokens.accent.gold}15` : 'transparent',
                }}
              >
                {ehSurpresaTrancada ? (
                  <Lock size={20} color={tokens.fg.muted} weight="light" />
                ) : (
                  <IconComponent
                    size={24}
                    color={estaDesbloqueada ? tokens.accent.gold : tokens.fg.muted}
                    weight={estaDesbloqueada ? 'regular' : 'light'}
                  />
                )}
              </View>
              <Texto
                variant="captionBold"
                color={estaDesbloqueada ? 'primary' : 'muted'}
                numberOfLines={1}
                className="text-center text-[11px]"
              >
                {tituloExibido}
              </Texto>
            </Pressable>
          );
        };

        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-4 pt-4">
            <FlatList
              data={conquistas}
              renderItem={renderConquistaItem}
              keyExtractor={(item) => item.id}
              numColumns={numColunas}
              key={`${numColunas}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListHeaderComponent={
                <View className="px-2 mb-4">
                  <Texto variant="caption" color="secondary">
                    Desbloqueou {conquistas.filter((c) => c.desbloqueada_em).length} de {conquistas.length} conquistas
                  </Texto>
                </View>
              }
            />
          </Animated.View>
        );

      case 'linha_tempo':
        if (carregandoLinhaTempo) return <SkeletonLinhaTempo />;
        
        const padroes = [
          'push_horizontal',
          'push_vertical',
          'pull_horizontal',
          'pull_vertical',
          'joelho_dominante',
          'quadril_dominante',
          'panturrilha',
          'core'
        ];

        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-6 pt-2">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {padroes.map((padrao) => {
                const itens = linhaTempoData[padrao] || [];
                const temHistorico = itens.length > 0;
                
                return (
                  <Card key={padrao} padding="md" className="mb-4 border border-border-subtle/50">
                    <View className="flex-row justify-between items-center mb-3">
                      <Texto variant="bodyBold" color="primary">{obterNomeExibicaoPadrao(padrao)}</Texto>
                      <View className={`px-2 py-0.5 rounded-full ${temHistorico ? 'bg-accent-bronze/10' : 'bg-elevated'}`}>
                        <Texto variant="caption" color={temHistorico ? 'bronze' : 'muted'} className="text-[10px] font-semibold">
                          {temHistorico ? `${itens.length} nível(is)` : 'Não iniciado'}
                        </Texto>
                      </View>
                    </View>

                    {!temHistorico ? (
                      <Texto variant="caption" color="muted" className="italic py-2 px-1">
                        Nenhum exercício executado para este padrão nos registros.
                      </Texto>
                    ) : (
                      <View className="pl-2 gap-4 relative">
                        {/* Linha vertical conectora */}
                        <View 
                          style={{ 
                            position: 'absolute', 
                            left: 11, 
                            top: 8, 
                            bottom: 8, 
                            width: 2, 
                            backgroundColor: 'rgba(193, 154, 107, 0.2)' 
                          }} 
                        />
                        {itens.map((item, index) => {
                          const isUltimo = index === itens.length - 1;
                          const d = new Date(item.semana);
                          const dataFormatada = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                          
                          return (
                            <View key={item.semana + index} className="flex-row items-center gap-3.5">
                              <View 
                                style={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: 4, 
                                  backgroundColor: isUltimo ? tokens.accent.gold : tokens.accent.bronze,
                                  borderWidth: isUltimo ? 2 : 0,
                                  borderColor: '#1A1715',
                                  marginLeft: 8,
                                  zIndex: 10
                                }} 
                              />
                              <View className="flex-1">
                                <View className="flex-row justify-between items-center">
                                  <Texto variant={isUltimo ? 'bodyBold' : 'body'} color={isUltimo ? 'primary' : 'secondary'}>
                                    {item.exercicio_nome}
                                  </Texto>
                                  <Texto variant="caption" color="muted">Semana {dataFormatada}</Texto>
                                </View>
                                <Texto variant="caption" color="muted" className="text-[11px]">
                                  Nível de Escada: {item.nivel_escada}
                                </Texto>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </Card>
                );
              })}
            </ScrollView>
          </Animated.View>
        );

      case 'historico':
        if (carregandoHistorico) return <SkeletonHistorico />;
        
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 px-6 pt-2">
            {historicoData.length === 0 ? (
              <View className="items-center justify-center py-10 gap-2">
                <ClockCounterClockwise size={48} color={tokens.fg.muted} weight="light" />
                <Texto variant="bodyBold" className="text-center mt-2">Sem treinos realizados</Texto>
                <Texto variant="caption" color="muted" className="text-center max-w-[240px]">
                  Seu primeiro treino concluído aparecerá aqui. Vamos começar?
                </Texto>
              </View>
            ) : (
              <FlatList
                data={historicoData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => {
                  const d = new Date(item.data);
                  const dataFormatada = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                  const duracaoMinutos = Math.round(item.duracao_segundos / 60);

                  return (
                    <Card padding="md" className="mb-3 border border-border-subtle/50">
                      <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center gap-2">
                          <Calendar size={16} color={tokens.accent.bronze} />
                          <Texto variant="captionBold" color="secondary">{dataFormatada}</Texto>
                        </View>
                        <View className={`flex-row items-center gap-1 py-0.5 px-2 rounded-xs ${item.concluida ? 'bg-feedback-success/10 border border-feedback-success/20' : 'bg-feedback-warning/10 border border-feedback-warning/20'}`}>
                          {item.concluida ? (
                            <Icons.CheckCircle size={12} color={tokens.feedback.success} weight="fill" />
                          ) : (
                            <Icons.Warning size={12} color={tokens.feedback.warning} weight="fill" />
                          )}
                          <Texto variant="caption" color={item.concluida ? 'success' : 'warning'} className="text-[10px] font-semibold">
                            {item.concluida ? 'Concluído' : 'Incompleto'}
                          </Texto>
                        </View>
                      </View>
                      <Texto variant="bodyBold" className="mb-2">{item.nome}</Texto>
                      <View className="flex-row justify-between items-center pt-2 border-t border-border-subtle/30">
                        <View className="flex-row items-center gap-1.5">
                          <Clock size={14} color={tokens.fg.muted} />
                          <Texto variant="caption" color="muted">{duracaoMinutos} min</Texto>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <Barbell size={14} color={tokens.fg.muted} />
                          <Texto variant="caption" color="muted">{item.series_totais} séries</Texto>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <Icons.Sparkle size={14} color={tokens.fg.muted} />
                          <Texto variant="caption" color="muted">{item.percentual_conclusao}% concluído</Texto>
                        </View>
                      </View>
                    </Card>
                  );
                }}
              />
            )}
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const ConquistaIconeDetalhe = conquistaSelecionada ? (Icons as any)[conquistaSelecionada.icone] || Trophy : Trophy;
  const ehSurpresaTrancadaDetalhe =
    conquistaSelecionada?.tipo === 'surpresa' && !conquistaSelecionada.desbloqueada_em;

  return (
    <Container className="bg-canvas flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[tokens.accent.bronze]}
            tintColor={tokens.accent.bronze}
          />
        }
      >
        {/* Header principal */}
        <View className="px-6 pt-6 gap-2">
          <Texto variant="displayL" className="tracking-tight">
            Evolução
          </Texto>
          <Texto variant="caption" color="secondary">
            Consistência clássica e marcos esculpidos
          </Texto>
        </View>

        {/* 1. KPIs no topo da tela */}
        {carregandoKPIs ? (
          <SkeletonKPIs />
        ) : (
          <View className="flex-row gap-2.5 px-6 my-4">
            {/* Card 1: Total de Treinos */}
            <View
              style={{ borderColor: tokens.border.subtle, backgroundColor: `${tokens.bg.elevated}80` }}
              className="flex-1 p-3 rounded-sm border items-start justify-between gap-1.5"
            >
              <Barbell size={20} color={tokens.accent.bronze} weight="light" />
              <View>
                <Texto variant="caption" color="muted" className="text-[10px] uppercase tracking-wider">
                  Treinos
                </Texto>
                <Texto variant="h2" className="font-bold tracking-tight">
                  {kpis.total_treinos}
                </Texto>
              </View>
            </View>

            {/* Card 2: Streak Máximo */}
            <View
              style={{ borderColor: tokens.border.subtle, backgroundColor: `${tokens.bg.elevated}80` }}
              className="flex-1 p-3 rounded-sm border items-start justify-between gap-1.5"
            >
              <Flame size={20} color={tokens.accent.gold} weight="light" />
              <View>
                <Texto variant="caption" color="muted" className="text-[10px] uppercase tracking-wider">
                  Streak
                </Texto>
                <Texto variant="h2" className="font-bold tracking-tight">
                  {kpis.streak_maximo}
                </Texto>
              </View>
            </View>

            {/* Card 3: Horas Totais */}
            <View
              style={{ borderColor: tokens.border.subtle, backgroundColor: `${tokens.bg.elevated}80` }}
              className="flex-1 p-3 rounded-sm border items-start justify-between gap-1.5"
            >
              <Clock size={20} color={tokens.accent.bronze} weight="light" />
              <View>
                <Texto variant="caption" color="muted" className="text-[10px] uppercase tracking-wider">
                  Horas
                </Texto>
                <Texto variant="h2" className="font-bold tracking-tight">
                  {kpis.total_tempo_horas}h
                </Texto>
              </View>
            </View>

            {/* Card 4: Conquistas */}
            <View
              style={{ borderColor: tokens.border.subtle, backgroundColor: `${tokens.bg.elevated}80` }}
              className="flex-1 p-3 rounded-sm border items-start justify-between gap-1.5"
            >
              <Trophy size={20} color={tokens.accent.gold} weight="light" />
              <View>
                <Texto variant="caption" color="muted" className="text-[10px] uppercase tracking-wider">
                  Marcos
                </Texto>
                <Texto variant="h2" className="font-bold tracking-tight">
                  {kpis.conquistas_desbloqueadas}
                </Texto>
              </View>
            </View>
          </View>
        )}

        {/* 2. CustomTabBar no topo (Scrollable horizontalmente para garantir toque ergonômico no mobile) */}
        <View className="px-6 mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            className="flex-row py-1"
          >
            <View
              style={{ borderColor: tokens.border.subtle, backgroundColor: `${tokens.bg.elevated}50` }}
              className="flex-row p-1.5 rounded-md border"
            >
              {abas.map((aba) => {
                const isAtiva = abaAtiva === aba.id;
                const IconComponent = aba.icon;
                return (
                  <Pressable
                    key={aba.id}
                    onPress={() => setAbaAtiva(aba.id)}
                    style={{
                      backgroundColor: isAtiva ? tokens.bg.elevated : 'transparent',
                      paddingHorizontal: width > 380 ? 14 : 10,
                    }}
                    className="flex-row items-center py-2.5 rounded-sm justify-center mr-1 gap-1.5 min-w-[70px] min-h-[44px]"
                  >
                    <IconComponent
                      size={16}
                      color={isAtiva ? tokens.accent.bronze : tokens.fg.muted}
                      weight={isAtiva ? 'regular' : 'light'}
                    />
                    <Texto
                      variant="captionBold"
                      color={isAtiva ? 'primary' : 'muted'}
                      className="text-[12px] tracking-wide"
                    >
                      {aba.label}
                    </Texto>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* 3. Conteúdo Reativo de acordo com a Aba */}
        <View className="flex-1">{renderConteudoAba()}</View>
      </ScrollView>

      {/* 4. Bottom Sheet de detalhes da conquista selecionada */}
      {conquistaSelecionada && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[StyleSheet.absoluteFill, styles.bottomSheetOverlay]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={fecharDetalhes} />

          <Animated.View
            entering={SlideInDown.duration(400).easing(SCULPTED_EASING)}
            style={{ backgroundColor: tokens.bg.elevated, borderColor: tokens.border.strong }}
            className="absolute bottom-0 left-0 right-0 rounded-t-[36px] border-t p-8 items-center shadow-overlay"
          >
            {/* Linha indicadora superior */}
            <View className="w-12 h-1 bg-border-subtle rounded-full mb-6" />

            {/* Ícone */}
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-4"
              style={{
                backgroundColor: conquistaSelecionada.desbloqueada_em
                  ? `${tokens.accent.gold}15`
                  : 'rgba(110, 100, 87, 0.08)',
              }}
            >
              {ehSurpresaTrancadaDetalhe ? (
                <Lock size={28} color={tokens.fg.muted} weight="light" />
              ) : (
                <ConquistaIconeDetalhe
                  size={32}
                  color={conquistaSelecionada.desbloqueada_em ? tokens.accent.gold : tokens.fg.muted}
                  weight={conquistaSelecionada.desbloqueada_em ? 'regular' : 'light'}
                />
              )}
            </View>

            {/* Nome */}
            <Texto variant="h2" className="text-center font-bold mb-2">
              {ehSurpresaTrancadaDetalhe ? 'Conquista Surpresa' : conquistaSelecionada.titulo}
            </Texto>

            {/* Tipo Tag */}
            <View className="mb-4 flex-row gap-2">
              <View style={{ backgroundColor: `${tokens.accent.bronze}15` }} className="px-3 py-0.5 rounded-full">
                <Texto variant="caption" color="bronze" className="capitalize text-[11px]">
                  {conquistaSelecionada.tipo === 'obvia' ? 'Marco Técnico' : 'Recompensa Surpresa'}
                </Texto>
              </View>
              {conquistaSelecionada.desbloqueada_em && (
                <View className="bg-feedback-success/15 px-3 py-0.5 rounded-full">
                  <Texto variant="caption" color="success" className="text-[11px]">
                    Desbloqueada
                  </Texto>
                </View>
              )}
            </View>

            {/* Descrição */}
            <Texto variant="body" color="secondary" className="text-center mb-6 px-4 leading-[22.5px]">
              {ehSurpresaTrancadaDetalhe
                ? 'Esta conquista é uma recompensa surpresa oculta. Continue treinando cientificamente para descobri-la!'
                : conquistaSelecionada.descricao}
            </Texto>

            {/* Informações adicionais */}
            {conquistaSelecionada.desbloqueada_em ? (
              <View className="flex-row items-center gap-1.5 mb-6">
                <Calendar size={16} color={tokens.fg.muted} />
                <Texto variant="caption" color="muted">
                  Conquistada em{' '}
                  {(() => {
                    const d = new Date(conquistaSelecionada.desbloqueada_em);
                    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
                      .toString()
                      .padStart(2, '0')}/${d.getFullYear()}`;
                  })()}
                </Texto>
              </View>
            ) : (
              !ehSurpresaTrancadaDetalhe && (
                <View className="mb-6 px-4 py-2 bg-bg-highlight/50 rounded-xs border border-border-subtle">
                  <Texto variant="caption" color="muted" className="text-center italic">
                    Dica: Progrida e treine de forma consistente para alcançar este marco.
                  </Texto>
                </View>
              )
            )}

            {/* XP Tag */}
            <View className="w-full flex-row justify-between items-center border-t border-border-subtle pt-6 mt-2 mb-6">
              <Texto variant="body" color="secondary">
                Recompensa de XP:
              </Texto>
              <Texto variant="bodyBold" color="gold">
                +{conquistaSelecionada.xp_recompensa} XP
              </Texto>
            </View>

            {/* Botão de Fechar */}
            <Botao variant="primary" size="lg" onPress={fecharDetalhes} className="w-full">
              Entendido
            </Botao>
          </Animated.View>
        </Animated.View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  bottomSheetOverlay: {
    backgroundColor: 'rgba(26, 23, 21, 0.70)',
    zIndex: 15000,
  },
});
