import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Dimensions, useWindowDimensions } from 'react-native';
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
import { ChartLineUp, Trophy, CalendarDays, Lock } from 'phosphor-react-native';
import { SCULPTED_EASING } from '../../constants/easing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProgressoScreen() {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const { conquistas, inicializarGamificacao, carregando } = useGamificacaoStore();

  const [abaAtiva, setAbaAtiva] = useState<'metricas' | 'conquistas'>('conquistas');
  const [conquistaSelecionada, setConquistaSelecionada] = useState<Conquista | null>(null);

  // Shared values para o Bottom Sheet de detalhes
  const sheetOffset = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    inicializarGamificacao();
  }, []);

  const abrirDetalhes = (conquista: Conquista) => {
    setConquistaSelecionada(conquista);
    sheetOffset.value = withTiming(0, { duration: 400, easing: SCULPTED_EASING });
  };

  const fecharDetalhes = () => {
    sheetOffset.value = withTiming(SCREEN_HEIGHT, { duration: 300, easing: SCULPTED_EASING });
    // Pequeno delay para tirar do estado após fechar a animação
    setTimeout(() => setConquistaSelecionada(null), 300);
  };

  // Grid responsivo: calcula colunas de acordo com largura da tela
  const numColunas = width > 600 ? 4 : 3;

  // Formata data brasileira
  const formatarData = (isoString?: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()} às ${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const renderConquistaItem = ({ item }: { item: Conquista }) => {
    const estaDesbloqueada = !!item.desbloqueada_em;
    const IconComponent = (Icons as any)[item.icone] || Trophy;

    // Se for surpresa e estiver trancada, ocultamos título e ícone
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

  // Detalhes da conquista selecionada para exibir no bottom sheet
  const ConquistaIconeDetalhe = conquistaSelecionada ? (Icons as any)[conquistaSelecionada.icone] || Trophy : Trophy;
  const ehSurpresaTrancadaDetalhe =
    conquistaSelecionada?.tipo === 'surpresa' && !conquistaSelecionada.desbloqueada_em;

  return (
    <Container className="bg-canvas">
      {/* 1. Header com Abas */}
      <View className="px-6 pt-6 gap-6">
        <View>
          <Texto variant="displayL" className="tracking-tight">Evolução</Texto>
          <Texto variant="caption" color="secondary">
            Consistência clássica e marcos esculpidos
          </Texto>
        </View>

        {/* Tab Selector */}
        <View className="flex-row bg-elevated/50 p-1 rounded-sm border border-border-subtle">
          <Pressable
            onPress={() => setAbaAtiva('metricas')}
            className="flex-1 py-2.5 rounded-xs items-center justify-center"
            style={{
              backgroundColor: abaAtiva === 'metricas' ? tokens.bg.elevated : 'transparent',
            }}
          >
            <Texto variant="bodyBold" color={abaAtiva === 'metricas' ? 'primary' : 'muted'}>
              Métricas
            </Texto>
          </Pressable>

          <Pressable
            onPress={() => setAbaAtiva('conquistas')}
            className="flex-1 py-2.5 rounded-xs items-center justify-center"
            style={{
              backgroundColor: abaAtiva === 'conquistas' ? tokens.bg.elevated : 'transparent',
            }}
          >
            <Texto variant="bodyBold" color={abaAtiva === 'conquistas' ? 'primary' : 'muted'}>
              Conquistas
            </Texto>
          </Pressable>
        </View>
      </View>

      {/* 2. Conteúdo Reativo de acordo com a Aba */}
      {abaAtiva === 'metricas' ? (
        <View className="flex-1 justify-center items-center p-6 gap-4">
          <ChartLineUp size={48} color={tokens.accent.bronze} weight="light" />
          <Texto variant="h2" className="text-center font-bold">Métricas do Templo</Texto>
          <Texto variant="body" color="secondary" className="text-center max-w-[290px] leading-[22px]">
            O motor de volume semanal por grupo muscular e o histórico de cargas científico da silhueta serão revelados na Fase 7.
          </Texto>
        </View>
      ) : (
        <View className="flex-1 px-4 pt-4">
          <FlatList
            data={conquistas}
            renderItem={renderConquistaItem}
            keyExtractor={(item) => item.id}
            numColumns={numColunas}
            key={`${numColunas}`} // Recria a lista se o número de colunas mudar
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
        </View>
      )}

      {/* 3. BOTTOM SHEET DE DETALHAMENTO DA CONQUISTA (Com Reanimated) */}
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
                backgroundColor: conquistaSelecionada.desbloqueada_em ? `${tokens.accent.gold}15` : 'rgba(110, 100, 87, 0.08)',
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
              <View
                style={{ backgroundColor: `${tokens.accent.bronze}15` }}
                className="px-3 py-0.5 rounded-full"
              >
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

            {/* Informações adicionais (Data ou Dica) */}
            {conquistaSelecionada.desbloqueada_em ? (
              <View className="flex-row items-center gap-1.5 mb-6">
                <CalendarDays size={16} color={tokens.fg.muted} />
                <Texto variant="caption" color="muted">
                  Conquistada em {formatarData(conquistaSelecionada.desbloqueada_em)}
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
              <Texto variant="body" color="secondary">Recompensa de XP:</Texto>
              <Texto variant="bodyBold" color="gold">+{conquistaSelecionada.xp_recompensa} XP</Texto>
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
