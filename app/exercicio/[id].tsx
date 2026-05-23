import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Linking, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { ArrowLeft, BookOpen, GraduationCap, Info, Warning, ArrowRight, ShieldCheck } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { obterExercicioPorId, buscarSubstitutos } from '../../db/queries/exercicios';
import { obterLinhas } from '../../db/local-cache';
import { Exercicio, Referencia } from '../../types';
import { SkeletonExercicioDetalhe } from '../../components/ui/Skeletons';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type AbaAtiva = 'como_fazer' | 'ciencia' | 'substitutos';

export default function ExercicioDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tokens } = useTheme();

  // Estados
  const [exercicio, setExercicio] = useState<Exercicio | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('como_fazer');
  const [referencias, setReferencias] = useState<Referencia[]>([]);
  const [substitutos, setSubstitutos] = useState<Exercicio[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega dados do exercício
  useEffect(() => {
    async function carregarDados() {
      if (!id) return;
      setCarregando(true);
      try {
        const ex = await obterExercicioPorId(id);
        if (ex) {
          setExercicio(ex);

          // Puxa referências associadas em runtime do SQLite local
          let refsList: Referencia[] = [];
          if (ex.referencias && ex.referencias.length > 0) {
            const placeholders = ex.referencias.map(() => '?').join(',');
            const queryRefs = `SELECT * FROM referencias_cientificas WHERE id IN (${placeholders})`;
            const linhas = await obterLinhas<any>(queryRefs, ex.referencias);
            refsList = linhas.map(l => ({
              ...l,
              tags: l.tags ? JSON.parse(l.tags) : []
            }));
          }
          setReferencias(refsList);

          // Puxa substitutos
          const subs = await buscarSubstitutos(id);
          setSubstitutos(subs);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do exercício:', error);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [id]);

  const handleVoltar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleMudarAba = (aba: AbaAtiva) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAbaAtiva(aba);
  };

  const handlePressSubstituto = (subId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navegação recursiva
    router.push(`/exercicio/${subId}` as any);
  };

  if (carregando) {
    return <SkeletonExercicioDetalhe />;
  }


  if (!exercicio) {
    return (
      <Container className="justify-center items-center p-6 gap-4">
        <Texto variant="h2" className="text-center">Exercício não encontrado</Texto>
        <Pressable onPress={handleVoltar} className="bg-accent-bronze py-3 px-6 rounded-sm">
          <Texto color="inverse">Voltar</Texto>
        </Pressable>
      </Container>
    );
  }

  // Consolidado de sínteses científicas
  const textoCienciaConsolidado = referencias.length > 0
    ? referencias.map(r => r.sintese_acessivel).join('\n\n')
    : 'A fundamentação fisiológica deste exercício baseia-se na tensão mecânica progressiva sob amplitude completa. O padrão de movimento estimula o recrutamento ideal das fibras alvo e preserva a integridade articular sob o vetor de gravidade adequado.';

  return (
    <Container className="flex-1 bg-canvas">
      {/* Header Fixo */}
      <View 
        className="px-6 py-4 flex-row items-center border-b border-border-subtle bg-canvas/90"
        style={{ height: 60, zIndex: 10 }}
      >
        <Pressable 
          onPress={handleVoltar} 
          className="p-2 -ml-2 rounded-full active:bg-bg-highlight/30"
          style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={24} color={tokens.fg.primary} />
        </Pressable>
        <Texto variant="h3" color="primary" className="ml-3 font-display font-semibold flex-1 truncate">
          {exercicio.nome}
        </Texto>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Visual do Exercício (Área Grande) */}
        <View className="relative justify-center items-center overflow-hidden bg-canvas/80 border-b border-border-subtle" style={{ height: SCREEN_HEIGHT * 0.35 }}>
          {/* Blur central simulado */}
          <View 
            className="absolute w-[180px] h-[180px] rounded-full opacity-[0.06]"
            style={{
              backgroundColor: tokens.accent.bronze,
              transform: [{ scale: 2 }],
            }}
          />

          {exercicio.midia_url ? (
            <LottieView
              source={{ uri: exercicio.midia_url }}
              autoPlay
              loop
              style={styles.lottie}
              resizeMode="cover"
            />
          ) : (
            // Desenho SVG do Boneco Clássico Executando Padrão
            <View style={styles.placeholderContainer}>
              <Svg width="160" height="160" viewBox="0 0 100 100">
                <Circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke={tokens.accent.bronze} 
                  strokeWidth="0.5" 
                  strokeDasharray="2, 4"
                  fill="none" 
                  opacity="0.3"
                />
                <Path
                  d="M 50 15 
                     C 53 15, 53 21, 50 21 
                     C 47 21, 47 15, 50 15 
                     Z 
                     M 50 22 
                     L 50 42 
                     M 50 25 
                     L 32 30 
                     C 30 31, 28 35, 34 37 
                     M 50 25 
                     L 68 30 
                     C 70 31, 72 35, 66 37 
                     M 50 42 
                     L 35 60 
                     L 37 78 
                     M 50 42 
                     L 65 60 
                     L 63 78"
                  stroke={tokens.accent.bronze}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <Circle cx="50" cy="22" r="1.5" fill={tokens.accent.gold} />
                <Circle cx="32" cy="30" r="1.5" fill={tokens.accent.gold} />
                <Circle cx="68" cy="30" r="1.5" fill={tokens.accent.gold} />
              </Svg>
            </View>
          )}
        </View>

        {/* Abas */}
        <View className="flex-row border-b border-border-subtle bg-bg-elevated/40">
          <Pressable 
            onPress={() => handleMudarAba('como_fazer')}
            className={`flex-1 py-4 justify-center items-center border-b-2 ${abaAtiva === 'como_fazer' ? 'border-accent-bronze' : 'border-transparent'}`}
            style={{ height: 50 }}
          >
            <Texto variant="captionBold" color={abaAtiva === 'como_fazer' ? 'bronze' : 'muted'}>
              Como Fazer
            </Texto>
          </Pressable>

          <Pressable 
            onPress={() => handleMudarAba('ciencia')}
            className={`flex-1 py-4 justify-center items-center border-b-2 ${abaAtiva === 'ciencia' ? 'border-accent-bronze' : 'border-transparent'}`}
            style={{ height: 50 }}
          >
            <Texto variant="captionBold" color={abaAtiva === 'ciencia' ? 'bronze' : 'muted'}>
              Ciência
            </Texto>
          </Pressable>

          <Pressable 
            onPress={() => handleMudarAba('substitutos')}
            className={`flex-1 py-4 justify-center items-center border-b-2 ${abaAtiva === 'substitutos' ? 'border-accent-bronze' : 'border-transparent'}`}
            style={{ height: 50 }}
          >
            <Texto variant="captionBold" color={abaAtiva === 'substitutos' ? 'bronze' : 'muted'}>
              Substitutos
            </Texto>
          </Pressable>
        </View>

        {/* Conteúdo da Aba */}
        <View className="p-6">
          {abaAtiva === 'como_fazer' && (
            <Animated.View entering={FadeIn.duration(200)} className="gap-6">
              {/* Descrição Execução */}
              <View className="gap-2">
                <Texto variant="h2" color="primary" className="font-display font-semibold">Execução Recomendada</Texto>
                <Texto variant="body" color="secondary" className="leading-relaxed text-justify">
                  {exercicio.descricao_execucao}
                </Texto>
              </View>

              {/* Dicas Técnicas */}
              {exercicio.dicas_tecnicas && exercicio.dicas_tecnicas.length > 0 && (
                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <Info size={20} color={tokens.accent.bronze} />
                    <Texto variant="h3" color="primary" className="font-semibold">Dicas de Controle</Texto>
                  </View>
                  <View className="bg-bg-elevated/40 border border-border-subtle p-4 rounded-md gap-2.5">
                    {exercicio.dicas_tecnicas.map((dica, idx) => (
                      <View key={idx} className="flex-row items-start gap-2.5">
                        <Texto color="bronze" variant="bodyBold">•</Texto>
                        <Texto variant="body" color="secondary" className="flex-1 leading-normal">
                          {dica}
                        </Texto>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Erros Comuns */}
              {exercicio.erros_comuns && exercicio.erros_comuns.length > 0 && (
                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <Warning size={20} color={tokens.feedback.error} />
                    <Texto variant="h3" color="primary" className="font-semibold">Erros a Evitar</Texto>
                  </View>
                  <View className="bg-feedback-error/5 border border-feedback-error/20 p-4 rounded-md gap-2.5">
                    {exercicio.erros_comuns.map((erro, idx) => (
                      <View key={idx} className="flex-row items-start gap-2.5">
                        <Texto color="error" variant="bodyBold">•</Texto>
                        <Texto variant="body" color="secondary" className="flex-1 leading-normal">
                          {erro}
                        </Texto>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Cadência e Repetições */}
              <View className="bg-bg-highlight/30 p-4 rounded-md flex-row justify-between items-center">
                <View className="gap-1 flex-1">
                  <Texto variant="captionBold" color="muted" className="uppercase tracking-wider">Cadência Alvo</Texto>
                  <Texto variant="h3" className="font-semibold">
                    {exercicio.cadencia_recomendada?.excentrica}s excêntrica
                  </Texto>
                </View>
                <View className="w-[1px] h-8 bg-border-subtle mx-4" />
                <View className="gap-1 flex-1">
                  <Texto variant="captionBold" color="muted" className="uppercase tracking-wider">Reps Recomendadas</Texto>
                  <Texto variant="h3" className="font-semibold">
                    {exercicio.faixa_reps_recomendada?.min} - {exercicio.faixa_reps_recomendada?.max} reps
                  </Texto>
                </View>
              </View>
            </Animated.View>
          )}

          {abaAtiva === 'ciencia' && (
            <Animated.View entering={FadeIn.duration(200)} className="gap-6">
              {/* Frase Científica Curta em Destaque */}
              {exercicio.frase_cientifica_curta && (
                <View className="bg-accent-bronze/10 border-l-4 border-accent-bronze p-5 rounded-r-md">
                  <Texto variant="h2" color="bronze" className="font-display font-semibold italic leading-snug text-justify text-[20px]">
                    "{exercicio.frase_cientifica_curta}"
                  </Texto>
                </View>
              )}

              {/* Texto Científico Expandido Consolidado */}
              <View className="gap-3">
                <Texto variant="h3" color="primary" className="font-semibold">Síntese Fisiológica e Evidência</Texto>
                <Texto variant="body" color="secondary" className="leading-relaxed text-justify">
                  {textoCienciaConsolidado}
                </Texto>
              </View>

              {/* Lista de Referências Clicáveis */}
              {referencias.length > 0 && (
                <View className="gap-3 mt-4">
                  <Texto variant="h3" color="primary" className="font-semibold">Referências e Estudos Primários</Texto>
                  {referencias.map(ref => (
                    <Pressable
                      key={ref.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (ref.url) Linking.openURL(ref.url);
                      }}
                      className="bg-bg-elevated border border-border-subtle p-4 rounded-md flex-row items-center justify-between active:bg-bg-highlight/30"
                    >
                      <View className="flex-1 pr-4 gap-1">
                        <Texto variant="bodyBold" color="primary">
                          {ref.autores} ({ref.ano})
                        </Texto>
                        <Texto variant="caption" color="secondary" className="leading-normal italic">
                          "{ref.titulo}" — {ref.periodico}
                        </Texto>
                      </View>
                      <GraduationCap size={24} color={tokens.accent.bronze} />
                    </Pressable>
                  ))}
                </View>
              )}
            </Animated.View>
          )}

          {abaAtiva === 'substitutos' && (
            <Animated.View entering={FadeIn.duration(200)} className="gap-4">
              <Texto variant="h2" color="primary" className="font-display font-semibold mb-2">Exercícios Substitutos</Texto>
              <Texto variant="body" color="muted" className="mb-4">
                Caso você tenha alguma restrição de mobilidade ou indisponibilidade mecânica local.
              </Texto>

              {substitutos.length === 0 ? (
                <View className="py-8 items-center">
                  <Texto variant="body" color="muted">Sem substitutos recomendados para o mesmo padrão.</Texto>
                </View>
              ) : (
                substitutos.map(sub => (
                  <Pressable
                    key={sub.id}
                    onPress={() => handlePressSubstituto(sub.id)}
                    className="flex-row items-center justify-between bg-bg-elevated border border-border-subtle p-4 rounded-md active:scale-[0.99]"
                  >
                    <View className="flex-row items-center gap-3.5 flex-1">
                      {/* Thumnbail Fallback SVG */}
                      <View className="w-12 h-12 rounded-sm bg-bg-highlight/40 justify-center items-center">
                        <Svg width="30" height="30" viewBox="0 0 100 100">
                          <Path
                            d="M 50 15 C 53 15, 53 21, 50 21 C 47 21, 47 15, 50 15 Z M 50 22 L 50 42 M 50 25 L 32 30 M 50 25 L 68 30 M 50 42 L 35 60 M 50 42 L 65 60"
                            stroke={tokens.accent.bronze}
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </Svg>
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Texto variant="bodyBold" color="primary">{sub.nome}</Texto>
                        <Texto variant="caption" color="muted">Nível da Escada: {sub.nivel_escada}</Texto>
                      </View>
                    </View>
                    <ArrowRight size={20} color={tokens.accent.bronze} />
                  </Pressable>
                ))
              )}
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
