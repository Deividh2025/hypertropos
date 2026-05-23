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
  CalendarDays,
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
import { estatisticasGerais } from '../../db/queries/agregacoes';
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

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }, [carregarDados]);

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

  // Renderizador do conteúdo da aba selecionada (com transições animadas)
  const renderConteudoAba = () => {
    const isCarregando = carregandoGamificacao || carregandoKPIs;

    switch (abaAtiva) {
      case 'silhueta':
        if (isCarregando) return <SkeletonSilhueta />;
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 p-6 items-center justify-center">
            <User size={64} color={tokens.accent.bronze} weight="light" />
            <Texto variant="h2" className="mt-4 font-bold">Silhueta Progresso</Texto>
            <Texto variant="body" color="secondary" className="text-center mt-2 max-w-[280px]">
              Aba Silhueta com estátua vetorial Skia interativa e auditoria de destreino biológico.
            </Texto>
          </Animated.View>
        );

      case 'volume':
        if (isCarregando) return <SkeletonVolume />;
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 p-6 items-center justify-center">
            <ChartBar size={64} color={tokens.accent.bronze} weight="light" />
            <Texto variant="h2" className="mt-4 font-bold">Volume Semanal</Texto>
            <Texto variant="body" color="secondary" className="text-center mt-2 max-w-[280px]">
              Gráfico de barras horizontais com metas dinâmicas por grupo muscular e seletor de período.
            </Texto>
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
        if (isCarregando) return <SkeletonLinhaTempo />;
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 p-6 items-center justify-center">
            <TrendUp size={64} color={tokens.accent.bronze} weight="light" />
            <Texto variant="h2" className="mt-4 font-bold">Linha do Tempo</Texto>
            <Texto variant="body" color="secondary" className="text-center mt-2 max-w-[280px]">
              Progressão visual de variações organizadas em escadas por padrão de movimento (PadraoMovimento).
            </Texto>
          </Animated.View>
        );

      case 'historico':
        if (isCarregando) return <SkeletonHistorico />;
        return (
          <Animated.View entering={FadeIn.duration(200)} className="flex-1 p-6 items-center justify-center">
            <ClockCounterClockwise size={64} color={tokens.accent.bronze} weight="light" />
            <Texto variant="h2" className="mt-4 font-bold">Histórico de Sessões</Texto>
            <Texto variant="body" color="secondary" className="text-center mt-2 max-w-[280px]">
              Histórico cronológico de sessões com estatísticas de duração, séries concluídas e modal de auditoria.
            </Texto>
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
          style={[StyleSheet.absoluteFillObject, styles.bottomSheetOverlay]}
        >
          <Pressable style={StyleSheet.absoluteFillObject} onPress={fecharDetalhes} />

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
                <CalendarDays size={16} color={tokens.fg.muted} />
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
