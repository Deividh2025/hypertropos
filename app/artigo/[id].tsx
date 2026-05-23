import React, { useState, useEffect } from 'react';
import { View, Pressable, ActivityIndicator, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { ArrowLeft, Clock, Calendar, Check, GraduationCap } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { obterArtigoPorId, marcarArtigoLidoNoBanco, obterArtigosLidos } from '../../db/queries/artigos';
import { obterLinhas, executarQuery } from '../../db/local-cache';
import { enqueueChange } from '../../db/sync-engine';
import { useGamificacaoStore } from '../../stores/gamificacaoStore';
import { CATALOGO_CONQUISTAS } from '../../constants/conquistas';
import { ArtigoCientifico } from '../../types/artigo';
import { CelebracaoConquista } from '../../components/feedback/CelebracaoConquista';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArtigoLeitorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tokens } = useTheme();
  const gamificacaoStore = useGamificacaoStore();

  // Estados
  const [artigo, setArtigo] = useState<ArtigoCientifico | null>(null);
  const [lido, setLido] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [marcandoLido, setMarcandoLido] = useState(false);

  // Valores Animados para Barra de Progresso
  const scrollY = useSharedValue(0);
  const scrollViewHeight = useSharedValue(1);
  const contentHeight = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      contentHeight.value = event.contentSize.height;
      scrollViewHeight.value = event.layoutMeasurement.height;
    },
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const scrollableRange = contentHeight.value - scrollViewHeight.value;
    const progress = scrollableRange <= 0 ? 0 : Math.min(1, Math.max(0, scrollY.value / scrollableRange));
    return {
      width: progress * SCREEN_WIDTH,
    };
  });

  // Carrega o artigo
  useEffect(() => {
    async function carregarArtigo() {
      if (!id) return;
      setCarregando(true);
      try {
        const dados = await obterArtigoPorId(id);
        setArtigo(dados);
        
        const lidos = await obterArtigosLidos();
        setLido(lidos.includes(id));
      } catch (error) {
        console.error('Erro ao obter artigo no leitor:', error);
      } finally {
        setCarregando(false);
      }
    }
    carregarArtigo();
  }, [id]);

  const handleVoltar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  // Lógica dopaminérgica de marcação de leitura e conquistas
  const handleMarcarComoLido = async () => {
    if (!artigo || lido || marcandoLido) return;
    
    setMarcandoLido(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      // 1. Grava no banco local e enfileira sync
      await marcarArtigoLidoNoBanco(artigo.id);
      setLido(true);
      
      // 2. Verifica Conquistas Científicas Reativas
      const todosLidos = await obterArtigosLidos();
      const numLidos = todosLidos.length;
      
      const conquistasJaDesbloqueadasRows = await obterLinhas<{ conquista_id: string }>(
        'SELECT conquista_id FROM conquistas_desbloqueadas'
      );
      const idsJaDesbloqueados = new Set(conquistasJaDesbloqueadasRows.map(r => r.conquista_id));
      
      const tentarDesbloquearLeitura = async (conquistaId: string) => {
        if (idsJaDesbloqueados.has(conquistaId)) return;
        
        const conquistaInfo = CATALOGO_CONQUISTAS.find(c => c.id === conquistaId);
        if (!conquistaInfo) return;
        
        const idUnico = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        const dataIso = new Date().toISOString();
        
        // Insere na tabela local de conquistas desbloqueadas
        await executarQuery(
          'INSERT INTO conquistas_desbloqueadas (id, conquista_id, desbloqueada_em) VALUES (?, ?, ?)',
          [idUnico, conquistaId, dataIso]
        );
        
        // Enfileira sincronização
        await enqueueChange('conquistas_desbloqueadas', 'INSERT', {
          id: idUnico,
          conquista_id: conquistaId,
          desbloqueada_em: dataIso
        });
        
        // Empilha celebração dopaminérgica na Zustand Store
        gamificacaoStore.adicionarCelebracao({
          type: 'conquista',
          conquista: { ...conquistaInfo, desbloqueada_em: dataIso }
        });
        
        // Incrementa o XP do usuário na Zustand Store e no banco
        await executarQuery(`
          UPDATE gamificacao SET xp_total = xp_total + ? WHERE id = 'default'
        `, [conquistaInfo.xp_recompensa]);
        
        console.log(`Conquista ${conquistaId} desbloqueada e XP recompensado.`);
      };
      
      // Conquista: 1ª leitura ("primeira_leitura")
      if (numLidos >= 1) {
        await tentarDesbloquearLeitura('primeira_leitura');
      }
      // Conquista: 5 leituras ("leitor_ciencia")
      if (numLidos >= 5) {
        await tentarDesbloquearLeitura('leitor_ciencia');
      }
      // Conquista: 10 leituras ("leitor_assiduo")
      if (numLidos >= 10) {
        await tentarDesbloquearLeitura('leitor_assiduo');
      }
      // Conquista: 18 leituras ("bibliotecario")
      if (numLidos >= 18) {
        await tentarDesbloquearLeitura('bibliotecario');
      }
      
      // Inicializa gamificação na store para sincronizar o progresso dopaminérgico visual do usuário
      await gamificacaoStore.inicializarGamificacao();
      
    } catch (error) {
      console.error('Erro ao marcar artigo como lido ou verificar conquistas:', error);
    } finally {
      setMarcandoLido(false);
    }
  };

  if (carregando) {
    return (
      <Container className="justify-center items-center">
        <ActivityIndicator color={tokens.accent.bronze} size="large" />
      </Container>
    );
  }

  if (!artigo) {
    return (
      <Container className="justify-center items-center p-6 gap-4">
        <Texto variant="h2" className="text-center">Artigo não encontrado</Texto>
        <Botao onPress={handleVoltar}>Voltar à Biblioteca</Botao>
      </Container>
    );
  }

  // Estilos customizados do Markdown baseados no Design System
  const markdownStyles = {
    body: {
      color: tokens.fg.primary,
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 25.6,
    },
    heading1: {
      fontFamily: 'Fraunces',
      color: tokens.fg.primary,
      fontSize: 28,
      lineHeight: 36.4,
      marginTop: 24,
      marginBottom: 16,
      fontWeight: '600' as const,
    },
    heading2: {
      fontFamily: 'Fraunces',
      color: tokens.accent.bronze,
      fontSize: 22,
      lineHeight: 28.6,
      marginTop: 20,
      marginBottom: 12,
      fontWeight: '600' as const,
    },
    heading3: {
      fontFamily: 'Inter',
      color: tokens.fg.primary,
      fontSize: 18,
      lineHeight: 25.2,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: '600' as const,
    },
    paragraph: {
      fontFamily: 'Inter',
      fontSize: 15,
      lineHeight: 24,
      color: tokens.fg.secondary,
      marginBottom: 16,
    },
    blockquote: {
      backgroundColor: tokens.bg.elevated,
      borderLeftColor: tokens.accent.bronze,
      borderLeftWidth: 4,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 4,
      marginBottom: 16,
    },
    link: {
      color: tokens.accent.bronze,
      textDecorationLine: 'underline' as const,
    },
    code_inline: {
      fontFamily: 'Inter',
      fontSize: 13,
      fontWeight: '500' as const,
      backgroundColor: tokens.bg.highlight,
      color: tokens.accent.bronze,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 3,
    },
    bullet_list: {
      marginBottom: 16,
    },
    bullet_list_icon: {
      color: tokens.accent.bronze,
      fontSize: 20,
    },
  };

  return (
    <Container className="relative flex-1 bg-canvas">
      {/* Barra de Progresso Animada Fina */}
      <Animated.View
        className="absolute top-0 left-0 h-[3px] z-50 bg-accent-bronze"
        style={progressAnimatedStyle}
      />

      {/* Header Fixo */}
      <View 
        className="px-6 py-4 flex-row items-center border-b border-border-subtle"
        style={{ height: 60 }}
      >
        <Pressable 
          onPress={handleVoltar} 
          className="p-2 -ml-2 rounded-full active:bg-bg-highlight/30"
          style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={24} color={tokens.fg.primary} />
        </Pressable>
        
        <View className="ml-3 flex-row flex-wrap gap-1.5 flex-1 items-center">
          {artigo.tags.slice(0, 2).map(tag => (
            <View key={tag} className="bg-bg-highlight px-2.5 py-0.5 rounded-full">
              <Texto variant="caption" color="bronze" className="text-[10px] uppercase font-bold tracking-wider">
                {tag.replace('_', ' ')}
              </Texto>
            </View>
          ))}
        </View>
      </View>

      {/* Conteúdo com Scroll Animado */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Metadados e Título */}
        <View className="mb-6 gap-3">
          <Texto variant="displayL" className="font-display font-semibold leading-snug">
            {artigo.titulo}
          </Texto>
          
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-1.5">
              <Clock size={16} color={tokens.fg.muted} />
              <Texto variant="caption" color="muted" className="font-medium">
                {artigo.tempo_leitura_min} min de leitura
              </Texto>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Calendar size={16} color={tokens.fg.muted} />
              <Texto variant="caption" color="muted" className="font-medium">
                {artigo.data_publicacao}
              </Texto>
            </View>
          </View>
        </View>

        {/* Separador */}
        <View className="h-[1px] bg-border-subtle w-full mb-6" />

        {/* Markdown Renderizado */}
        <Markdown style={markdownStyles}>
          {artigo.conteudo_markdown}
        </Markdown>

        {/* Referências de Rastreabilidade */}
        {artigo.referencias && artigo.referencias.length > 0 && (
          <View className="mt-8 pt-6 border-t border-border-subtle gap-4">
            <Texto variant="h3" color="primary" className="font-display">
              Referências Científicas Citadas
            </Texto>
            <Texto variant="caption" color="muted" className="mb-2">
              Estes estudos servem como base metodológica para as diretrizes deste artigo.
            </Texto>
            <View className="gap-3">
              {artigo.referencias.map((refId, idx) => (
                <Pressable
                  key={refId}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Abre o PubMed ou DOI relacionado (para fins de simulação na V1 abre o pubmed geral)
                    Linking.openURL(`https://pubmed.ncbi.nlm.nih.gov/?term=${refId}`);
                  }}
                  className="bg-bg-elevated/40 border border-border-subtle/50 p-3 rounded-xs flex-row items-center justify-between active:bg-bg-highlight/20"
                >
                  <View className="flex-1 pr-3">
                    <Texto variant="captionBold" color="bronze">
                      [{idx + 1}] {refId.replace('_', ' ').toUpperCase()}
                    </Texto>
                    <Texto variant="caption" color="secondary" className="mt-0.5">
                      Ver publicação científica original.
                    </Texto>
                  </View>
                  <GraduationCap size={20} color={tokens.accent.bronze} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </Animated.ScrollView>

      {/* Botão de Rodapé para Marcar como Lido */}
      <View 
        className="absolute bottom-0 w-full px-6 pt-4 pb-6 bg-canvas border-t border-border-subtle"
        style={{ minHeight: 90 }}
      >
        {lido ? (
          <View className="bg-bg-highlight/30 rounded-sm py-4 px-6 flex-row items-center justify-center gap-2">
            <Check size={20} color={tokens.feedback.success} weight="bold" />
            <Texto variant="bodyBold" color="success">
              Você já leu este artigo
            </Texto>
          </View>
        ) : (
          <Botao
            variant="primary"
            onPress={handleMarcarComoLido}
            loading={marcandoLido}
            className="w-full h-12"
          >
            Marcar como lido
          </Botao>
        )}
      </View>

      {/* OVERLAY DE CELEBRAÇÃO DE CONQUISTA */}
      {gamificacaoStore.celebracaoAtiva && gamificacaoStore.celebracaoAtiva.type === 'conquista' && (
        <CelebracaoConquista
          conquista={gamificacaoStore.celebracaoAtiva.conquista}
          aoFechar={gamificacaoStore.desempilharCelebracao}
        />
      )}
    </Container>
  );
}
