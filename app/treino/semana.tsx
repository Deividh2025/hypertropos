import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { useProgramaStore } from '../../stores/programaStore';
import { ArrowLeft, Calendar, Check, Clock } from 'phosphor-react-native';

const DIAS_SEMANA_MAP: Record<string, number> = {
  'domingo': 0,
  'segunda-feira': 1,
  'terça-feira': 2,
  'quarta-feira': 3,
  'quinta-feira': 4,
  'sexta-feira': 5,
  'sábado': 6
};

export default function SemanaScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { programaAtual } = useProgramaStore();

  const getStatus = (diaReferencia: string) => {
    if (!diaReferencia) return 'pendente';
    
    const normalizar = (str: string) => 
      str.toLowerCase()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .split('-')[0];

    const diaNorm = normalizar(diaReferencia);
    const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const diaHojeIndex = new Date().getDay();
    const diaHojeNorm = diasSemana[diaHojeIndex];

    if (diaNorm === diaHojeNorm) {
      return 'hoje';
    }

    // Calcular se o dia de referência é anterior ou posterior ao dia de hoje na semana
    // Mapeamento simples de dias da semana para comparação cronológica
    const getDiaValor = (d: string) => {
      if (d.includes('segunda')) return 1;
      if (d.includes('terca') || d.includes('terça')) return 2;
      if (d.includes('quarta')) return 3;
      if (d.includes('quinta')) return 4;
      if (d.includes('sexta')) return 5;
      if (d.includes('sabado') || d.includes('sábado')) return 6;
      return 0; // domingo
    };

    const valorSessao = getDiaValor(diaNorm);
    const valorHoje = getDiaValor(diaHojeNorm);

    return valorSessao < valorHoje ? 'concluido' : 'pendente';
  };

  if (!programaAtual) {
    return (
      <Container className="p-6 justify-center items-center gap-4">
        <Texto variant="h2">Nenhum Programa Ativo</Texto>
        <Texto variant="body" color="secondary" className="text-center">
          Inicie a geração de rotina na Home para ver sua semana.
        </Texto>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Texto variant="bodyBold" color="bronze">Voltar</Texto>
        </Pressable>
      </Container>
    );
  }

  const sessoes = programaAtual.sessoes || programaAtual.sessoes_template || [];

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
        <Texto variant="h2" className="flex-1 text-center pr-6">Minha Semana</Texto>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-2">
          <Texto variant="captionBold" color="secondary">PROGRAMA ATIVO</Texto>
          <Texto variant="h3" className="mt-1">{programaAtual.nome}</Texto>
          <Texto variant="caption" color="muted">
            Split: {programaAtual.split_tipo?.toUpperCase() || 'PERSONALIZADO'}
          </Texto>
        </View>

        {sessoes.map((sessao, index) => {
          const status = getStatus(sessao.dia_da_semana || '');
          const exercicios = sessao.exercicios_prescritos || sessao.exercicios || [];
          
          let statusBadge = null;
          let cardBorderClass = 'border-border-subtle';
          
          if (status === 'concluido') {
            cardBorderClass = 'border-feedback-success/20';
            statusBadge = (
              <View className="flex-row items-center gap-1 bg-feedback-success/10 py-1 px-2 rounded-xs border border-feedback-success/20">
                <Check size={12} color={tokens.feedback.success} weight="bold" />
                <Texto variant="caption" color="success" className="text-[11px] font-semibold">Concluído</Texto>
              </View>
            );
          } else if (status === 'hoje') {
            cardBorderClass = 'border-accent-bronze/40 bg-elevated';
            statusBadge = (
              <View className="flex-row items-center gap-1.5 bg-accent-bronze/10 py-1 px-2 rounded-xs border border-accent-bronze/20">
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.accent.bronze }} />
                <Texto variant="caption" color="bronze" className="text-[11px] font-semibold">Hoje</Texto>
              </View>
            );
          } else {
            statusBadge = (
              <View className="flex-row items-center gap-1 bg-elevated border border-border-subtle py-1 px-2 rounded-xs">
                <Texto variant="caption" color="muted" className="text-[11px]">Pendente</Texto>
              </View>
            );
          }

          return (
            <Card 
              key={sessao.id || index.toString()} 
              padding="lg" 
              className={`border ${cardBorderClass}`}
            >
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Calendar size={18} color={tokens.accent.bronze} weight="light" />
                  <Texto variant="captionBold" color="secondary" className="capitalize">
                    {sessao.dia_da_semana || `Treino ${index + 1}`}
                  </Texto>
                </View>
                {statusBadge}
              </View>

              <Texto variant="h3" className="mb-2">{sessao.nome}</Texto>

              <View className="flex-row items-center gap-3">
                <Texto variant="body" color="secondary">
                  {exercicios.length} exercícios
                </Texto>
                <Texto variant="caption" color="muted">
                  ·
                </Texto>
                <View className="flex-row items-center gap-1">
                  <Clock size={14} color={tokens.fg.muted} weight="light" />
                  <Texto variant="caption" color="muted">~45 min estimados</Texto>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </Container>
  );
}
