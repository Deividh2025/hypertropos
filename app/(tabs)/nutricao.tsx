import React, { useState, useEffect } from 'react';
import { View, ScrollView, Switch, Pressable, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Egg, ArrowRight, Clock, Plus, Trash, TrendUp, Info, CheckCircle, Warning } from 'phosphor-react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { useMetaProteina } from '../../hooks/useMetaProteina';
import { useEvolucaoPeso } from '../../hooks/useEvolucaoPeso';
import { useLembretes } from '../../hooks/useLembretes';
import { listarSuplementos } from '../../db/queries/suplementos';
import { Suplemento } from '../../types/suplemento';
import { GraficoPesoSkia } from '../../components/nutricao/GraficoPesoSkia';
import { ModalLembrete } from '../../components/nutricao/ModalLembrete';

export default function NutricaoScreen() {
  const { tokens } = useTheme();
  const router = useRouter();

  // Hooks do domínio de nutrição
  const { peso, fator, metaDiaria, refeicoesSugeridas, setFator, justificativaCientifica } = useMetaProteina();
  const { historico, registrarNovoPeso } = useEvolucaoPeso();
  const { lembretes, agendarLembrete, alternarLembrete, excluirLembrete } = useLembretes();

  // Estados locais da UI
  const [suplementos, setSuplementos] = useState<Suplemento[]>([]);
  const [graficoVisible, setGraficoVisible] = useState(false);
  const [modalLembreteVisible, setModalLembreteVisible] = useState(false);
  const [novoPesoInput, setNovoPesoInput] = useState('');
  const [exibirInfoCientifica, setExibirInfoCientifica] = useState(false);

  // Carrega suplementos
  useEffect(() => {
    let active = true;
    listarSuplementos().then((data) => {
      if (active) setSuplementos(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // Handler para ajuste de fator com Haptics
  const incrementarFator = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFator(fator + 0.1);
  };

  const decrementarFator = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFator(fator - 0.1);
  };

  // Lógica de registro de novo peso no BottomSheet
  const handleRegistrarNovoPeso = async () => {
    const pesoNum = parseFloat(novoPesoInput.replace(',', '.'));
    if (!isNaN(pesoNum) && pesoNum > 30 && pesoNum < 250) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await registrarNovoPeso(pesoNum);
      setNovoPesoInput('');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  // Formata o tipo de lembrete
  const formatarTipoLembrete = (tipo: string) => {
    switch (tipo) {
      case 'creatina': return '🧪 Creatina';
      case 'refeicao_proteica': return '🥩 Refeição Proteica';
      case 'hora_treino': return '💪 Horário de Treino';
      default: return tipo;
    }
  };

  // Abre evolução do peso
  const abrirEvolucaoPeso = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGraficoVisible(true);
  };

  return (
    <Container className="px-0 py-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Cabeçalho da Tela */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-2 mb-1">
            <Egg size={24} color={tokens.accent.bronze} weight="fill" />
            <Texto variant="h1" color="marble">Nutrição Inteligente</Texto>
          </View>
          <Texto variant="caption" color="muted">
            Prescrição científica de macronutrientes, ergogênicos e crononutrição.
          </Texto>
        </View>

        {/* ============================================== */}
        {/* CARD 1: CALCULADORA PROTEICA E AJUSTE DINÂMICO */}
        {/* ============================================== */}
        <View className="px-6 mb-6">
          <Card className="gap-5" elevated>
            
            {/* Meta de Proteína Destaque */}
            <View className="flex-row justify-between items-start">
              <View>
                <Texto variant="caption" color="muted">META DIÁRIA CALCULADA</Texto>
                <View className="flex-row items-baseline gap-1 mt-1">
                  <Texto variant="displayL" color="bronze" className="font-bold tracking-tight">
                    {metaDiaria}
                  </Texto>
                  <Texto variant="h3" color="secondary" className="font-semibold">
                    g / dia
                  </Texto>
                </View>
              </View>

              {/* Botão de Evolução de Peso que abre BottomSheet */}
              <Pressable
                onPress={abrirEvolucaoPeso}
                className="flex-row items-center gap-1.5 py-2 px-3 rounded-full bg-elevated border border-border-subtle min-h-[48px] justify-center"
              >
                <TrendUp size={16} color={tokens.accent.bronze} weight="bold" />
                <Texto variant="captionBold" color="bronze">Peso: {peso}kg</Texto>
              </Pressable>
            </View>

            {/* Slider Tátil Customizado (Evita crash de dependência e fica extremamente elegante) */}
            <View className="border-t border-divider pt-4">
              <View className="flex-row justify-between items-center mb-3">
                <Texto variant="bodyBold" color="secondary">Fator de Ingestão</Texto>
                <Texto variant="bodyBold" color="bronze" className="font-mono bg-elevated px-2 py-0.5 rounded border border-border-subtle">
                  {fator.toFixed(1)} g / kg
                </Texto>
              </View>

              {/* Slider de Toque Confortável (Padrão Altíssima Fidelidade) */}
              <View className="flex-row items-center justify-between gap-4">
                <Pressable
                  onPress={decrementarFator}
                  disabled={fator <= 1.4}
                  className={`w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle ${fator <= 1.4 ? 'opacity-30' : ''}`}
                >
                  <Texto variant="h2" color="primary">-</Texto>
                </Pressable>

                {/* Linha visual de progresso */}
                <View className="flex-1 h-2 bg-divider rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-accent-bronze rounded-full"
                    style={{ width: `${((fator - 1.4) / (2.5 - 1.4)) * 100}%` }}
                  />
                </View>

                <Pressable
                  onPress={incrementarFator}
                  disabled={fator >= 2.5}
                  className={`w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle ${fator >= 2.5 ? 'opacity-30' : ''}`}
                >
                  <Texto variant="h2" color="primary">+</Texto>
                </Pressable>
              </View>

              {/* Rótulos do Slider */}
              <View className="flex-row justify-between px-2 mt-2">
                <Texto variant="caption" color="muted">1.4 g/kg (Leve)</Texto>
                <Texto variant="caption" color="muted">2.0 g/kg (Hipertrofia)</Texto>
                <Texto variant="caption" color="muted">2.5 g/kg (Elite/Déficit)</Texto>
              </View>
            </View>

            {/* Justificativa Científica (Colapsável para economizar espaço e carregar elegância) */}
            <View className="bg-elevated/50 p-3 rounded border border-border-subtle/50">
              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setExibirInfoCientifica(!exibirInfoCientifica);
                }}
                className="flex-row items-center justify-between min-h-[32px]"
              >
                <View className="flex-row items-center gap-2">
                  <Info size={16} color={tokens.accent.bronze} />
                  <Texto variant="captionBold" color="bronze">Justificativa Científica</Texto>
                </View>
                <Texto variant="caption" color="muted">
                  {exibirInfoCientifica ? 'Ocultar' : 'Ver'}
                </Texto>
              </Pressable>
              
              {exibirInfoCientifica && (
                <Texto variant="caption" color="muted" className="mt-2 text-justify leading-[18.2px]">
                  {justificativaCientifica}
                </Texto>
              )}
            </View>

            {/* Divisão Sugerida de Refeições */}
            <View className="border-t border-divider pt-4">
              <Texto variant="captionBold" color="secondary" className="mb-3">
                DIVISÃO SUGERIDA (4 REFEIÇÕES)
              </Texto>
              
              <View className="gap-2">
                {refeicoesSugeridas.map((ref) => (
                  <View key={ref.id} className="flex-row justify-between items-center bg-elevated p-3 rounded border border-border-subtle">
                    <View className="flex-1 pr-4">
                      <Texto variant="bodyBold" color="primary">{ref.nome}</Texto>
                      <Texto variant="caption" color="muted" numberOfLines={1}>{ref.sugestao}</Texto>
                    </View>
                    <Texto variant="bodyBold" color="bronze" className="font-mono bg-canvas px-3 py-1 rounded border border-border-subtle">
                      {ref.quantidade.toFixed(1)}g
                    </Texto>
                  </View>
                ))}
              </View>
            </View>

          </Card>
        </View>

        {/* ============================================== */}
        {/* CARD 2: SUPLEMENTOS (SCROLL HORIZONTAL)        */}
        {/* ============================================== */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-3">
            <Texto variant="h3" color="marble">Fichas de Suplementação</Texto>
            <Texto variant="caption" color="muted">Consenso ISSN</Texto>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {suplementos.map((sup) => {
              // Estilo de badge de evidência de Grau A, B ou C
              const isGrauA = sup.grau_evidencia === 'A';
              const isGrauB = sup.grau_evidencia === 'B';
              
              const badgeBg = isGrauA 
                ? 'bg-accent-gold/10 border-accent-gold' 
                : isGrauB 
                ? 'bg-accent-bronze/10 border-accent-bronze' 
                : 'bg-border-subtle border-border-strong';
              
              const badgeTextColor = isGrauA ? 'gold' : isGrauB ? 'bronze' : 'muted';

              // Recomendado para o perfil (Ex: creatina, whey, cafeína são sempre A e recomendados)
              const isRecomendado = isGrauA || sup.id === 'citrulina' || sup.id === 'beta_alanina';

              return (
                <Pressable
                  key={sup.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/suplemento/${sup.id}` as any);
                  }}
                  className="w-[185px] bg-elevated rounded-md border border-border-subtle p-4 justify-between min-h-[148px]"
                >
                  <View>
                    {/* Badge Grau de Evidência */}
                    <View className="flex-row justify-between items-center mb-2">
                      <View className={`px-2 py-0.5 rounded-full border ${badgeBg}`}>
                        <Texto variant="captionBold" color={badgeTextColor} className="text-[10px]">
                          Evidência {sup.grau_evidencia}
                        </Texto>
                      </View>
                      
                      {isRecomendado && (
                        <CheckCircle size={16} color={tokens.accent.gold} weight="fill" />
                      )}
                    </View>

                    <Texto variant="bodyBold" color="primary" numberOfLines={2} className="mb-1">
                      {sup.nome}
                    </Texto>
                  </View>

                  <View className="flex-row items-center justify-between border-t border-divider pt-2 mt-2">
                    <Texto variant="caption" color="muted" numberOfLines={1} className="flex-1 pr-1 text-[11px]">
                      {sup.dose_recomendada}
                    </Texto>
                    <ArrowRight size={12} color={tokens.accent.bronze} />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ============================================== */}
        {/* CARD 3: PAINEL DE LEMBRETES ATIVOS              */}
        {/* ============================================== */}
        <View className="px-6 mb-6">
          <Card className="gap-4" elevated>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Clock size={20} color={tokens.accent.bronze} />
                <Texto variant="h3" color="marble">Crononutrição</Texto>
              </View>
              <Botao
                variant="ghost"
                size="sm"
                onPress={() => setModalLembreteVisible(true)}
                className="flex-row items-center gap-1 min-h-[48px] px-3"
              >
                <Plus size={16} color={tokens.accent.bronze} />
                <Texto variant="captionBold" color="bronze">Adicionar</Texto>
              </Botao>
            </View>

            <Texto variant="caption" color="muted" className="-mt-2">
              Lembretes recorrentes disparados via notificação local para manter a consistência ideal.
            </Texto>

            {/* Lista de Lembretes */}
            <View className="gap-3 mt-1">
              {lembretes.length === 0 ? (
                <View className="items-center py-6 border border-dashed border-border-subtle rounded">
                  <Texto variant="caption" color="muted">Sem lembretes configurados.</Texto>
                </View>
              ) : (
                lembretes.map((lembrete) => (
                  <View 
                    key={lembrete.id}
                    className="flex-row items-center justify-between bg-elevated p-3.5 rounded border border-border-subtle min-h-[64px]"
                  >
                    <View className="flex-1 pr-4">
                      <Texto variant="bodyBold" color="primary">
                        {formatarTipoLembrete(lembrete.tipo)}
                      </Texto>
                      
                      {/* Horário e Dias de semana */}
                      <View className="flex-row items-center gap-2 mt-1">
                        <Texto variant="captionBold" color="bronze" className="font-mono">
                          {lembrete.horario}
                        </Texto>
                        <Texto variant="caption" color="muted" className="text-[10px]">
                          • {lembrete.dias_semana.length === 7 
                              ? 'Todos os dias' 
                              : lembrete.dias_semana.length === 5 && !lembrete.dias_semana.includes(0) && !lembrete.dias_semana.includes(6)
                              ? 'Seg a Sex'
                              : lembrete.dias_semana.map(d => ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][d]).join(', ')}
                        </Texto>
                      </View>
                    </View>

                    {/* Controles de Lembrete: Switch + Exclusão */}
                    <View className="flex-row items-center gap-3">
                      <Switch
                        value={lembrete.ativo}
                        onValueChange={(val) => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          alternarLembrete(lembrete.id, val);
                        }}
                        thumbColor={lembrete.ativo ? tokens.accent.bronze : tokens.fg.muted}
                        trackColor={{ false: tokens.bg.highlight, true: `${tokens.accent.bronze}50` }}
                      />
                      
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          excluirLembrete(lembrete.id);
                        }}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                        className="w-[42px] h-[42px] items-center justify-center rounded-full bg-canvas border border-border-subtle"
                      >
                        <Trash size={16} color={tokens.feedback.error} />
                      </Pressable>
                    </View>

                  </View>
                ))
              )}
            </View>
          </Card>
        </View>

      </ScrollView>

      {/* ============================================== */}
      {/* BOTTOM SHEET (MODAL): EVOLUÇÃO E GRÁFICO DE PESO */}
      {/* ============================================== */}
      <Modal
        visible={graficoVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGraficoVisible(false)}
      >
        <View className="flex-1 justify-end bg-[rgba(0,0,0,0.75)]">
          <View className="bg-canvas border-t border-border-strong rounded-t-lg max-h-[85%] p-6">
            
            {/* Header BottomSheet */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center gap-2">
                <TrendUp size={22} color={tokens.accent.bronze} weight="bold" />
                <Texto variant="h2" color="marble">Histórico de Peso</Texto>
              </View>
              <Pressable
                onPress={() => setGraficoVisible(false)}
                hitSlop={15}
                className="w-10 h-10 items-center justify-center rounded-full bg-elevated border border-border-subtle"
              >
                <Texto variant="bodyBold" color="primary">X</Texto>
              </Pressable>
            </View>

            {/* Formulário para registrar novo peso corporal */}
            <Card className="flex-row items-center justify-between gap-3 p-3.5 mb-6" elevated>
              <View className="flex-1">
                <Texto variant="captionBold" color="secondary" className="mb-1">
                  NOVO REGISTRO DE PESO
                </Texto>
                <TextInput
                  value={novoPesoInput}
                  onChangeText={setNovoPesoInput}
                  keyboardType="numeric"
                  placeholder={`Ex: ${peso.toFixed(1)}`}
                  placeholderTextColor={tokens.fg.muted}
                  style={{ color: tokens.fg.primary }}
                  className="font-mono text-xl py-1 px-2 rounded bg-canvas border border-border-subtle h-[42px]"
                />
              </View>
              
              <Botao
                variant="primary"
                onPress={handleRegistrarNovoPeso}
                className="min-h-[48px] px-6 mt-4"
              >
                Salvar
              </Botao>
            </Card>

            {/* Componente Gráfico Skia */}
            <View className="mb-6">
              <GraficoPesoSkia historico={historico} />
            </View>

            <Texto variant="caption" color="muted" className="text-center leading-[18.2px]">
              Pesagens consistentes e no mesmo horário otimizam a precisão do cálculo metabólico dinâmico.
            </Texto>

          </View>
        </View>
      </Modal>

      {/* ============================================== */}
      {/* MODAL DE AGENDAMENTO DE LEMBRETE               */}
      {/* ============================================== */}
      <ModalLembrete
        visible={modalLembreteVisible}
        onClose={() => setModalLembreteVisible(false)}
        onSalvar={agendarLembrete}
      />

    </Container>
  );
}
