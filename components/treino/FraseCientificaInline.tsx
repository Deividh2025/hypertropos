import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Modal, ScrollView, Linking, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  SlideInDown,
  SlideOutDown,
  FadeOut
} from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { useSessaoStore } from '../../stores/sessaoStore';
import { useTheme } from '../../hooks/useTheme';
import { BookOpen, GraduationCap, X } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { obterLinhas } from '../../db/local-cache';
import { Referencia } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FRASES_CIENTIFICAS_PADRAO = [
  'Tensão na posição alongada gera mais hipertrofia — Pedrosa et al. 2022',
  'Treinar próximo à falha maximiza o recrutamento de unidades motoras — Henneman et al. 1965',
  'A cadência excêntrica controlada aumenta a sinalização hipertrófica — Schoenfeld et al. 2017',
  'Descansar 2-3 min previne a fadiga central prematura em compostos — Senna et al. 2016',
  'A sobrecarga progressiva é o motor primário da hipertrofia muscular — Goldberg et al. 1975',
  'A conexão mente-músculo aumenta a ativação por eletromiografia — Schoenfeld et al. 2018',
  'Séries levadas até a falha induzem maior estresse metabólico — Mitchell et al. 2012',
  'O volume semanal adequado é crucial para maximizar a síntese proteica — Damas et al. 2018'
];

export function FraseCientificaInline() {
  const { tokens } = useTheme();
  const { exerciciosPrescritos, exercicioAtualIndex, exerciciosCatalogMap } = useSessaoStore();
  const [listaFrases, setListaFrases] = useState<string[]>([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [fraseExibida, setFraseExibida] = useState('');
  
  const opacityVal = useSharedValue(1);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados do BottomSheet Científico
  const [bottomSheetVisivel, setBottomSheetVisivel] = useState(false);
  const [referencias, setReferencias] = useState<Referencia[]>([]);
  const [carregandoRefs, setCarregandoRefs] = useState(false);

  const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
  const exercicioDetalhes = currentPrescricao ? exerciciosCatalogMap[currentPrescricao.exercicio_id] : null;

  useEffect(() => {
    if (exerciciosPrescritos.length === 0 || !currentPrescricao) return;

    const exDetails = exerciciosCatalogMap[currentPrescricao.exercicio_id];
    
    // Constrói lista de frases científica relevantes
    const frases: string[] = [];
    if (exDetails?.frase_cientifica_curta) {
      frases.push(exDetails.frase_cientifica_curta);
    }
    
    // Complementa com o pool padrão para ter rotação
    FRASES_CIENTIFICAS_PADRAO.forEach(f => {
      if (!frases.includes(f)) frases.push(f);
    });

    setListaFrases(frases);
    setIndexAtual(0);
    setFraseExibida(frases[0]);
  }, [exercicioAtualIndex, exerciciosPrescritos]);

  useEffect(() => {
    if (listaFrases.length <= 1) return;

    // Configura o timer de rotação de 6 segundos com transição de Fade
    intervalRef.current = setInterval(() => {
      opacityVal.value = withTiming(0, { duration: 300 }, () => {
        setIndexAtual((prev) => {
          const proximo = (prev + 1) % listaFrases.length;
          setFraseExibida(listaFrases[proximo]);
          return proximo;
        });
        opacityVal.value = withTiming(1, { duration: 300 });
      });
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [listaFrases]);

  // Carrega as referências em runtime quando o BottomSheet é aberto
  const handleOpenBottomSheet = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBottomSheetVisivel(true);
    
    if (!exercicioDetalhes) return;
    
    setCarregandoRefs(true);
    try {
      let refsList: Referencia[] = [];
      
      // Parse ou lê referências do catálogo de exercícios
      let refsIds: string[] = [];
      if (exercicioDetalhes.referencias) {
        refsIds = typeof exercicioDetalhes.referencias === 'string'
          ? JSON.parse(exercicioDetalhes.referencias)
          : exercicioDetalhes.referencias;
      }

      if (refsIds && refsIds.length > 0) {
        const placeholders = refsIds.map(() => '?').join(',');
        const queryRefs = `SELECT * FROM referencias_cientificas WHERE id IN (${placeholders})`;
        const linhas = await obterLinhas<any>(queryRefs, refsIds);
        refsList = linhas.map(l => ({
          ...l,
          tags: l.tags ? JSON.parse(l.tags) : []
        }));
      }
      setReferencias(refsList);
    } catch (e) {
      console.error('Erro ao buscar referências científicas no BottomSheet:', e);
    } finally {
      setCarregandoRefs(false);
    }
  };

  const handleCloseBottomSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBottomSheetVisivel(false);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));

  if (listaFrases.length === 0) return null;

  const textoCienciaConsolidado = referencias.length > 0
    ? referencias.map(r => r.sintese_acessivel).join('\n\n')
    : 'Este exercício estimula a hipertrofia através da tensão mecânica aplicada sob amplitude de movimento otimizada. A mecânica calistênica protege as articulações enquanto estimula o recrutamento ideal das fibras alvo.';

  return (
    <>
      <Pressable 
        onPress={handleOpenBottomSheet}
        className="h-[40px] justify-center items-center px-6 bg-canvas border-b border-border-subtle/30 active:bg-bg-highlight/20"
      >
        <Animated.View style={animatedStyle} className="flex-row items-center justify-center gap-2">
          <BookOpen size={13} color={tokens.accent.bronze} weight="fill" />
          <Texto 
            variant="caption" 
            color="muted" 
            numberOfLines={1} 
            className="text-center font-medium italic text-[11px] leading-[14px] max-w-[85%]"
          >
            {fraseExibida}
          </Texto>
        </Animated.View>
      </Pressable>

      {/* BottomSheet Científico Customizado */}
      <Modal
        visible={bottomSheetVisivel}
        transparent
        animationType="none"
        onRequestClose={handleCloseBottomSheet}
      >
        <View style={StyleSheet.absoluteFill}>
          {/* Overlay de fundo */}
          <Animated.View 
            entering={FadeIn} 
            exiting={FadeOut}
            className="flex-1 bg-black/75"
          >
            <Pressable className="flex-1" onPress={handleCloseBottomSheet} />
          </Animated.View>

          {/* Painel do BottomSheet */}
          <Animated.View 
            entering={SlideInDown.springify().damping(20).stiffness(180)}
            exiting={SlideOutDown}
            className="absolute bottom-0 w-full bg-canvas rounded-t-3xl pt-2 px-6 pb-bottom shadow-overlay"
            style={{ maxHeight: SCREEN_HEIGHT * 0.75 }}
          >
            <View className="w-12 h-1 bg-border-strong rounded-full self-center mb-5" />
            
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-1 pr-3 gap-0.5">
                <Texto variant="captionBold" color="bronze" className="uppercase tracking-wider">
                  Painel de Evidência Científica
                </Texto>
                <Texto variant="h2" color="primary" className="font-display font-semibold truncate leading-snug">
                  {exercicioDetalhes?.nome || 'Exercício'}
                </Texto>
              </View>
              <Pressable 
                onPress={handleCloseBottomSheet} 
                className="p-2 bg-bg-elevated rounded-full border border-border-subtle"
                style={{ width: 38, height: 38, justifyContent: 'center', alignItems: 'center' }}
              >
                <X size={18} color={tokens.fg.primary} />
              </Pressable>
            </View>

            {/* Conteúdo com Scroll */}
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {/* Frase Científica Curta */}
              {exercicioDetalhes?.frase_cientifica_curta && (
                <View className="bg-accent-bronze/10 border-l-4 border-accent-bronze p-4 rounded-r-md mb-6">
                  <Texto variant="body" color="bronze" className="font-display font-semibold italic text-[16px] leading-relaxed text-justify">
                    "{exercicioDetalhes.frase_cientifica_curta}"
                  </Texto>
                </View>
              )}

              {/* Síntese Coesa Consolidada */}
              {carregandoRefs ? (
                <View className="py-12 justify-center items-center">
                  <ActivityIndicator color={tokens.accent.bronze} size="small" />
                </View>
              ) : (
                <View className="gap-5">
                  <View className="gap-2">
                    <Texto variant="h3" color="primary" className="font-semibold">Mecanismo e Biomecânica</Texto>
                    <Texto variant="body" color="secondary" className="leading-relaxed text-justify text-[15px]">
                      {textoCienciaConsolidado}
                    </Texto>
                  </View>

                  {/* Estudos Primários */}
                  {referencias.length > 0 && (
                    <View className="gap-3 mt-2">
                      <Texto variant="h3" color="primary" className="font-semibold">Citações e Estudos Primários</Texto>
                      {referencias.map(ref => (
                        <Pressable
                          key={ref.id}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            if (ref.url) Linking.openURL(ref.url);
                          }}
                          className="bg-bg-elevated border border-border-subtle p-3.5 rounded-md flex-row items-center justify-between active:bg-bg-highlight/30"
                        >
                          <View className="flex-1 pr-3 gap-0.5">
                            <Texto variant="captionBold" color="primary" className="text-[14px]">
                              {ref.autores} ({ref.ano})
                            </Texto>
                            <Texto variant="caption" color="secondary" className="leading-normal italic text-[12px]">
                              "{ref.titulo}" — {ref.periodico}
                            </Texto>
                          </View>
                          <GraduationCap size={22} color={tokens.accent.bronze} />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Rodapé Botão Entendi */}
            <View className="mt-2 pt-2 pb-4">
              <Botao 
                variant="secondary" 
                className="w-full h-11" 
                onPress={handleCloseBottomSheet}
              >
                Concluir Leitura Rápida
              </Botao>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
