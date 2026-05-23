import React, { useState } from 'react';
import { View, Pressable, Modal, StyleSheet } from 'react-native';
import { Texto } from '../ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { useSessaoStore } from '../../stores/sessaoStore';
import { DotsThreeVertical, Play, Pause, SkipForward, XCircle, Question } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { BotaoMusica } from './BotaoMusica';

export function HeaderProgresso() {
  const { tokens } = useTheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    exerciciosPrescritos,
    exercicioAtualIndex,
    serieAtualIndex,
    isPausado,
    pausarSessao,
    retomarSessao,
    cancelarSessao,
    statusSessao,
    finalizarTransicao
  } = useSessaoStore();

  if (exerciciosPrescritos.length === 0 || statusSessao === 'finalizada') return null;

  const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
  const numExercicios = exerciciosPrescritos.length;

  const handleTogglePausa = () => {
    if (isPausado) {
      retomarSessao();
    } else {
      pausarSessao();
    }
    setMenuVisible(false);
  };

  const handlePularExercicio = () => {
    setMenuVisible(false);
    // Pular exercício: avança o exercício ou encerra se for o último
    const store = useSessaoStore.getState();
    const nextIndex = store.exercicioAtualIndex + 1;
    if (nextIndex < store.exerciciosPrescritos.length) {
      // Vai para transição ou direto
      useSessaoStore.setState({
        exercicioAtualIndex: nextIndex,
        serieAtualIndex: 0,
        statusSessao: 'executando',
        tempoDescansoRestante: 0
      });
    } else {
      // Encerra
      useSessaoStore.setState({
        statusSessao: 'finalizada'
      });
      store.salvarSessaoBanco();
    }
  };

  const handleCancelar = () => {
    setMenuVisible(false);
    cancelarSessao();
    router.replace('/');
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-subtle bg-elevated h-[70px]">
      {/* Indicador de progresso */}
      <View className="flex-row items-center gap-2">
        <View className="w-2.5 h-2.5 rounded-full bg-accent-bronze" />
        <Texto variant="captionBold" color="secondary">
          Exercício {exercicioAtualIndex + 1} de {numExercicios} · Série {serieAtualIndex + 1} de {currentPrescricao?.series_alvo || 3}
        </Texto>
      </View>

      {/* Botões de Ação na Direita */}
      <View className="flex-row items-center gap-2">
        <BotaoMusica style={{ width: 38, height: 38, borderRadius: 19 }} />
        <Pressable 
          onPress={() => setMenuVisible(true)}
          className="p-2 -mr-2 w-[44px] h-[44px] justify-center items-center rounded-full"
          style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
        >
          <DotsThreeVertical size={24} color={tokens.fg.primary} weight="bold" />
        </Pressable>
      </View>

      {/* Modal Dropdown do Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={StyleSheet.absoluteFill}
          className="bg-black/50 justify-center items-center p-6"
          onPress={() => setMenuVisible(false)}
        >
          {/* Card do Menu */}
          <View 
            className="w-full max-w-[280px] rounded-md border border-border-subtle p-4 gap-2"
            style={{ backgroundColor: tokens.bg.overlay }}
          >
            <Texto variant="h3" className="mb-2 text-center">Opções de Sessão</Texto>
            
            {/* Pausar / Retomar */}
            <Pressable 
              onPress={handleTogglePausa}
              className="flex-row items-center gap-3 py-3 px-2 rounded-sm"
              style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
            >
              {isPausado ? (
                <>
                  <Play size={20} color={tokens.accent.bronze} weight="bold" />
                  <Texto variant="bodyBold" color="bronze">Retomar Sessão</Texto>
                </>
              ) : (
                <>
                  <Pause size={20} color={tokens.fg.secondary} weight="bold" />
                  <Texto variant="bodyBold" color="secondary">Pausar Sessão</Texto>
                </>
              )}
            </Pressable>

            {/* Pular Exercício */}
            <Pressable 
              onPress={handlePularExercicio}
              className="flex-row items-center gap-3 py-3 px-2 rounded-sm"
              style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
            >
              <SkipForward size={20} color={tokens.fg.secondary} weight="bold" />
              <Texto variant="bodyBold" color="secondary">Pular Exercício</Texto>
            </Pressable>

            {/* Ajuda */}
            <Pressable 
              onPress={() => {
                setMenuVisible(false);
                alert('Mantenha o foco. O descanso induz a ressíntese de ATP e remoção de metabólitos.');
              }}
              className="flex-row items-center gap-3 py-3 px-2 rounded-sm"
              style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
            >
              <Question size={20} color={tokens.fg.secondary} weight="bold" />
              <Texto variant="bodyBold" color="secondary">Ajuda Científica</Texto>
            </Pressable>

            {/* Divisor */}
            <View className="h-[1px] bg-border-subtle my-1" />

            {/* Cancelar Sessão */}
            <Pressable 
              onPress={handleCancelar}
              className="flex-row items-center gap-3 py-3 px-2 rounded-sm"
              style={({ pressed }) => pressed && { backgroundColor: tokens.bg.highlight }}
            >
              <XCircle size={20} color={tokens.feedback.error} weight="bold" />
              <Texto variant="bodyBold" color="error">Cancelar Sessão</Texto>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
