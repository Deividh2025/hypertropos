import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MusicNotes } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';
import { abrirAppMusica } from '../../lib/intent-musica';
import * as Haptics from 'expo-haptics';

interface BotaoMusicaProps {
  style?: any;
}

export function BotaoMusica({ style }: BotaoMusicaProps) {
  const { tokens } = useTheme();

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await abrirAppMusica();
    } catch (err) {
      console.error('Erro ao acionar atalho de música:', err);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.75 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          backgroundColor: tokens.bg.overlay,
          borderColor: tokens.border.subtle,
        },
        styles.botao,
        style,
      ]}
      accessibilityLabel="Abrir reprodutor de música"
      accessibilityRole="button"
    >
      <MusicNotes size={22} color={tokens.accent.bronze} weight="light" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
});
