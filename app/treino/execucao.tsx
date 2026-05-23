import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';

// Componentes UI Básicos do Design System
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Botao } from '../../components/ui/Botao';

// Hooks e Stores do Sistema
import { useTheme } from '../../hooks/useTheme';
import { useProgramaStore } from '../../stores/programaStore';
import { useSessaoStore } from '../../stores/sessaoStore';
import { listarExercicios } from '../../db/queries/exercicios';

// Componentes da Tela de Execução Série a Série
import { HeaderProgresso } from '../../components/treino/HeaderProgresso';
import { VisualExercicio } from '../../components/treino/VisualExercicio';
import { InfoSerie } from '../../components/treino/InfoSerie';
import { FraseCientificaInline } from '../../components/treino/FraseCientificaInline';
import { BotaoConcluirSerie } from '../../components/treino/BotaoConcluirSerie';
import { TimerDescanso } from '../../components/treino/TimerDescanso';
import { TransicaoExercicio } from '../../components/treino/TransicaoExercicio';
import { CelebracaoFinalSessao } from '../../components/treino/CelebracaoFinalSessao';

export default function ExecucaoScreen() {
  // Impede que a tela apague enquanto o usuário realiza a sessão (TDAH e ergonomia)
  useKeepAwake();

  const { tokens } = useTheme();
  const router = useRouter();

  const { sessaoDoDia, modoExpress } = useProgramaStore();
  const { statusSessao, iniciarSessao, tickTimer } = useSessaoStore();
  const [loading, setLoading] = useState(true);

  // 1. Carregar catálogo centralizado de exercícios e inicializar motor de sessão
  useEffect(() => {
    async function inicializarMotorSessao() {
      try {
        const catalogo = await listarExercicios();
        
        if (sessaoDoDia) {
          iniciarSessao(sessaoDoDia, catalogo, modoExpress);
        }
      } catch (err) {
        console.error('Falha ao inicializar o motor de execução:', err);
      } finally {
        setLoading(false);
      }
    }
    inicializarMotorSessao();
  }, [sessaoDoDia, modoExpress]);

  // 2. Configura ticker global de 1 segundo para a duração do treino e cronômetro de descanso
  useEffect(() => {
    if (statusSessao === 'idle' || statusSessao === 'finalizada') return;

    const intervalId = setInterval(() => {
      // Executa tick na store Zustand na thread JS
      useSessaoStore.getState().tickTimer();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [statusSessao]);

  // Se a sessão do dia não existir no store de programas, convida para voltar à Home
  if (!sessaoDoDia) {
    return (
      <Container className="p-6 justify-center items-center gap-4">
        <Texto variant="h2" className="text-center font-bold">Nenhum Treino Agendado</Texto>
        <Texto variant="body" color="muted" className="text-center">
          Inicie um programa de treino ou configure sua agenda para começar.
        </Texto>
        <Botao variant="primary" size="lg" onPress={() => router.replace('/')}>
          Voltar para Home
        </Botao>
      </Container>
    );
  }

  return (
    <Container className="bg-canvas">
      {/* Maximum Immersion StatusBar light styling */}
      <StatusBar style="light" />


      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={tokens.accent.bronze} />
          <Texto variant="caption" color="muted" className="mt-3">
            Carregando inteligência mecânica...
          </Texto>
        </View>
      ) : (
        <View className="flex-1">
          {/* A. Topo: Indicador minúsculo e menu de opções */}
          <HeaderProgresso />

          {/* B. Área Central: Animação Loop Lottie ou Placeholder bronze */}
          <VisualExercicio />

          {/* C. Área de Instruções da Série: Reps, Cadência e RIR Alvo */}
          <InfoSerie />

          {/* D. Frase Científica Inline: Carrossel rotativo discreto */}
          <FraseCientificaInline />

          {/* E/F. Botão de Ação (CONCLUÍ SÉRIE) ou Timer de Descanso */}
          {statusSessao === 'executando' && <BotaoConcluirSerie />}
          {statusSessao === 'descansando' && <TimerDescanso />}

          {/* G. Overlay de Transição Curta de 3s entre Exercícios */}
          <TransicaoExercicio />

          {/* H. Tela de Finalizado / Celebração imersiva */}
          <CelebracaoFinalSessao />
        </View>
      )}
    </Container>
  );
}
