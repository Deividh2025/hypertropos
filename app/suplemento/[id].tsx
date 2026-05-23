import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CaretLeft, CheckCircle, Bookmark, Warning, BookOpen, Clock, Heartbeat, Flask } from 'phosphor-react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { usePerfilStore } from '../../stores/perfilStore';
import { obterSuplementoPorId } from '../../db/queries/suplementos';
import { Suplemento } from '../../types/suplemento';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalheSuplementoScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { perfil, atualizarCampo } = usePerfilStore();

  const [suplemento, setSuplemento] = useState<Suplemento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usoAtivo, setUsoAtivo] = useState(false);

  const keyUsoSuplemento = `@hypertropos:uso_suplemento:${id}`;

  // Normaliza o ID para capturar sem_evidencia ou sem-evidencia
  const normalizedId = typeof id === 'string' 
    ? (id === 'sem-evidencia' ? 'sem_evidencia' : id) 
    : 'sem_evidencia';

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    
    // 1. Carrega dados do suplemento
    obterSuplementoPorId(normalizedId).then((data) => {
      if (active) {
        setSuplemento(data);
        setIsLoading(false);
      }
    });

    // 2. Carrega estado de uso ativo
    if (normalizedId === 'creatina') {
      setUsoAtivo(!!perfil?.usa_creatina);
    } else if (normalizedId === 'cafeina') {
      setUsoAtivo(!!perfil?.usa_cafeina);
    } else {
      AsyncStorage.getItem(keyUsoSuplemento).then((val) => {
        if (active) setUsoAtivo(val === 'true');
      });
    }

    return () => {
      active = false;
    };
  }, [id, perfil, normalizedId]);

  const handleToggleUso = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const novoEstado = !usoAtivo;
    setUsoAtivo(novoEstado);

    if (normalizedId === 'creatina') {
      await atualizarCampo('usa_creatina', novoEstado);
    } else if (normalizedId === 'cafeina') {
      await atualizarCampo('usa_cafeina', novoEstado);
    } else {
      await AsyncStorage.setItem(keyUsoSuplemento, String(novoEstado));
    }
  };

  const abrirReferencia = (refId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Links reais científicos do PubMed/DOI de acordo com a referência
    const urls: Record<string, string> = {
      kreider_2017_creatine: 'https://pubmed.ncbi.nlm.nih.gov/28615996/',
      morton_2018: 'https://pubmed.ncbi.nlm.nih.gov/28642284/',
      schoenfeld_aragon_2018: 'https://pubmed.ncbi.nlm.nih.gov/29414124/',
      grgic_2018: 'https://pubmed.ncbi.nlm.nih.gov/29471131/',
      refalo_2023: 'https://pubmed.ncbi.nlm.nih.gov/36710499/',
    };

    const targetUrl = urls[refId] || 'https://pubmed.ncbi.nlm.nih.gov/';
    Linking.openURL(targetUrl).catch(err => console.error("Erro ao abrir link:", err));
  };

  if (isLoading) {
    return (
      <Container className="justify-center items-center">
        <Texto variant="body" color="secondary">Carregando ficha científica...</Texto>
      </Container>
    );
  }

  if (!suplemento) {
    return (
      <Container className="justify-center items-center p-6">
        <Texto variant="h2" className="text-center">Suplemento não localizado</Texto>
        <Botao variant="primary" onPress={() => router.back()} className="mt-6 min-h-[48px] px-8">
          Voltar para Nutrição
        </Botao>
      </Container>
    );
  }

  const isSemEvidencia = normalizedId === 'sem_evidencia';

  // Configuração visual baseada no nível de evidência
  const isGrauA = suplemento.grau_evidencia === 'A';
  const isGrauB = suplemento.grau_evidencia === 'B';
  const badgeTextColor = isGrauA ? 'gold' : isGrauB ? 'bronze' : 'muted';
  const badgeBg = isGrauA 
    ? 'bg-accent-gold/10 border-accent-gold' 
    : isGrauB 
    ? 'bg-accent-bronze/10 border-accent-bronze' 
    : 'bg-border-subtle border-border-strong';

  return (
    <Container className="px-0 py-0">
      
      {/* Top Bar Fixo com botão voltar de toque confortável */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-divider">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          className="w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle"
        >
          <CaretLeft size={20} color={tokens.fg.primary} />
        </Pressable>
        <Texto variant="bodyBold" color="marble">Ficha de Suplementação</Texto>
        <View className="w-12 h-12" /> {/* espaçador de equilíbrio */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, paddingTop: 16 }}>
        
        {/* Bloco de Título e Nível de Evidência */}
        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-2 flex-wrap">
            <View className={`px-3 py-1 rounded-full border ${badgeBg}`}>
              <Texto variant="captionBold" color={badgeTextColor}>
                Evidência Grau {suplemento.grau_evidencia}
              </Texto>
            </View>
            {usoAtivo && !isSemEvidencia && (
              <View className="px-3 py-1 rounded-full border bg-feedback-success/10 border-feedback-success">
                <Texto variant="captionBold" color="success">Uso Ativo</Texto>
              </View>
            )}
          </View>
          <Texto variant="h1" color="marble" className="tracking-tight leading-[36.4px]">
            {suplemento.nome}
          </Texto>
        </View>

        {/* ==================================================== */}
        {/* LAYOUT ESPECIAL PARA SUPLEMENTOS SEM EVIDÊNCIA FORTE */}
        {/* ==================================================== */}
        {isSemEvidencia ? (
          <View className="mb-6">
            <Card className="bg-feedback-warning/10 border border-feedback-warning gap-4 p-5">
              <View className="flex-row items-center gap-3">
                <Warning size={28} color={tokens.feedback.warning} weight="fill" />
                <Texto variant="h3" color="warning" className="font-bold">
                  Razões Científicas da Falta de Evidência
                </Texto>
              </View>
              <Texto variant="body" color="secondary" className="text-justify leading-[22.5px]">
                Suplementos como BCAAs isolados, Glutamina para hipertrofia em sadios e estimuladores de testosterona fitoterápicos (ZMA, Tribulus, Maca) são comercialmente muito populares, mas são desprovidos de sustentação empírica robusta.
              </Texto>
              <Texto variant="body" color="secondary" className="text-justify leading-[22.5px]">
                • <Texto variant="bodyBold" color="primary">BCAAs Isolados:</Texto> A síntese de proteínas musculares requer todos os 9 aminoácidos essenciais (EAAs). BCAAs sem os outros 6 EAAs são ineficazes e competem pelos mesmos transportadores, prejudicando a absorção de proteínas inteiras.
              </Texto>
              <Texto variant="body" color="secondary" className="text-justify leading-[22.5px]">
                • <Texto variant="bodyBold" color="primary">Glutamina:</Texto> O trato gastrointestinal e o sistema imune consomem praticamente toda a glutamina oral. Pouquíssimo atinge a circulação sistêmica e zero atinge o músculo esquelético para fins de síntese proteica.
              </Texto>
              <Texto variant="body" color="secondary" className="text-justify leading-[22.5px]">
                • <Texto variant="bodyBold" color="primary">Fitoterápicos / ZMA:</Texto> Não aumentam a testosterona sérica além do placebo em sadios não deficientes. Apenas revertem deficiências nutricionais pontuais (ex: Zinco ou Magnésio).
              </Texto>
              <View className="bg-canvas/50 p-3.5 rounded border border-border-subtle mt-2">
                <Texto variant="captionBold" color="warning" className="mb-1">
                  RECOMENDAÇÃO CLÍNICA
                </Texto>
                <Texto variant="caption" color="muted" className="text-justify leading-[18.2px]">
                  Evite gastos financeiros supérfluos. Atingir a meta proteica diária de 1.6-2.2g/kg através de alimentos integrais e Whey Protein anula qualquer utilidade marginal de BCAAs ou Glutamina.
                </Texto>
              </View>
            </Card>
          </View>
        ) : null}

        {/* 1. Descrição Curta */}
        <Texto variant="bodyL" color="secondary" className="mb-6 text-justify leading-[25.5px]">
          {suplemento.descricao_curta}
        </Texto>

        {/* 2. Mecanismo de Ação */}
        {suplemento.mecanismo_acao ? (
          <Card className="gap-3 mb-6" elevated>
            <View className="flex-row items-center gap-2 mb-1">
              <Flask size={18} color={tokens.accent.bronze} />
              <Texto variant="bodyBold" color="marble">Mecanismo de Ação Fisiológico</Texto>
            </View>
            <Texto variant="body" color="secondary" className="text-justify leading-[22.5px]">
              {suplemento.mecanismo_acao}
            </Texto>
          </Card>
        ) : null}

        {/* 3. Dosagem e Timing Recomendados */}
        {!isSemEvidencia && (
          <View className="flex-row gap-4 mb-6">
            <Card className="flex-1 gap-2 p-4" elevated>
              <Heartbeat size={18} color={tokens.accent.gold} />
              <Texto variant="captionBold" color="muted">DOSAGEM PADRÃO</Texto>
              <Texto variant="bodyBold" color="primary" className="text-[14px]">
                {suplemento.dose_recomendada}
              </Texto>
            </Card>
            <Card className="flex-1 gap-2 p-4" elevated>
              <Clock size={18} color={tokens.accent.bronze} />
              <Texto variant="captionBold" color="muted">TIMING / HORÁRIO</Texto>
              <Texto variant="bodyBold" color="primary" className="text-[14px]">
                {suplemento.horario_recomendado || 'Qualquer horário'}
              </Texto>
            </Card>
          </View>
        )}

        {/* 4. Benefícios Comprovados */}
        {!isSemEvidencia && (
          <Card className="gap-4 mb-6" elevated>
            <Texto variant="bodyBold" color="marble">Benefícios Cientificamente Atestados</Texto>
            <View className="gap-3">
              {(normalizedId === 'creatina' 
                ? [
                    'Aumento expressivo nas repetições calistênicas sob estresse anaeróbico explosivo.',
                    'Ganho acelerado de massa muscular magra livre de adiposidade.',
                    'Aumento do volume celular por hidratação osmótica intracelular.',
                    'Efeito protetor neurológico e melhora na recuperação cognitiva geral.'
                  ]
                : normalizedId === 'whey'
                ? [
                    'Facilita atingir a meta proteica diária com extrema conveniência.',
                    'Induz o gatilho leucínico que liga o maquinário anabólico (mTORC1).',
                    'Acelera a taxa de reparação e reconstrução de microlesões musculares.'
                  ]
                : normalizedId === 'cafeina'
                ? [
                    'Redução acentuada da fadiga percebida durante séries longas calistênicas.',
                    'Aumento agudo na força de contração e na potência neuromuscular.',
                    'Melhora no foco mental, estado de alerta e energia global da sessão.'
                  ]
                : [
                    'Melhora expressiva nas taxas de recuperação celular após microlesões.',
                    'Otimização do fluxo sanguíneo nos tecidos alvos sob estresse metabólico.',
                    'Tamponamento de íons de hidrogênio (H+), atrasando a fadiga calistênica periférica.'
                  ]
              ).map((beneficio, index) => (
                <View key={index} className="flex-row gap-3">
                  <CheckCircle size={16} color={tokens.accent.bronze} weight="fill" style={{ marginTop: 2 }} />
                  <Texto variant="body" color="secondary" className="flex-1 text-[14px] leading-[19.6px]">
                    {beneficio}
                  </Texto>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* 5. Referências Científicas Clicáveis */}
        {suplemento.referencias_ids && suplemento.referencias_ids.length > 0 ? (
          <Card className="gap-3 mb-6" elevated>
            <View className="flex-row items-center gap-2 mb-1">
              <BookOpen size={18} color={tokens.accent.bronze} />
              <Texto variant="bodyBold" color="marble">Consensos & Ensaios Clínicos</Texto>
            </View>
            <View className="gap-2">
              {suplemento.referencias_ids.map((refId) => {
                const label = refId === 'kreider_2017_creatine' 
                  ? 'Consenso de Creatina da ISSN (Kreider et al., 2017)' 
                  : refId === 'morton_2018' 
                  ? 'Meta-análise de Ingestão de Proteínas (Morton et al., 2018)' 
                  : refId === 'schoenfeld_aragon_2018' 
                  ? 'Efeito de Timing de Proteínas (Schoenfeld & Aragon, 2018)' 
                  : refId === 'grgic_2018' 
                  ? 'Efeitos de Cafeína no Desempenho (Grgic et al., 2018)' 
                  : 'Tamponamento e Recuperação de Fadiga (Refalo et al., 2023)';
                
                return (
                  <Pressable
                    key={refId}
                    onPress={() => abrirReferencia(refId)}
                    className="flex-row items-center justify-between bg-canvas p-3 rounded border border-border-subtle min-h-[48px]"
                  >
                    <Texto variant="captionBold" color="bronze" className="flex-1 pr-3">
                      {label}
                    </Texto>
                    <Texto variant="caption" color="muted">PubMed ↗</Texto>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        ) : null}

      </ScrollView>

      {/* Rodapé Fixo: Botão "Marcar que uso este suplemento" */}
      {!isSemEvidencia && (
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-canvas border-t border-border-subtle flex-row gap-3">
          <Botao
            variant={usoAtivo ? "secondary" : "primary"}
            onPress={handleToggleUso}
            className="flex-1 min-h-[48px] flex-row gap-2"
          >
            <Bookmark size={18} color={usoAtivo ? tokens.fg.primary : tokens.fg.inverse} weight={usoAtivo ? "fill" : "regular"} />
            <Texto variant="bodyBold" color={usoAtivo ? "primary" : "inverse"}>
              {usoAtivo ? 'Remover dos Meus Suplementos' : 'Marcar que Uso este Suplemento'}
            </Texto>
          </Botao>
        </View>
      )}

    </Container>
  );
}
