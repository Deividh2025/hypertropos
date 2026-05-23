import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSilhueta } from '../../hooks/useSilhueta';
import EstatuaSVG from './EstatuaSVG';
import { Texto } from '../ui/Texto';
import { useTheme } from '../../hooks/useTheme';

export default function SilhuetaHome() {
  const { tokens } = useTheme();
  const { estadoSilhueta, isLoading } = useSilhueta();
  const [frente, setFrente] = useState(true);

  if (isLoading || !estadoSilhueta) {
    return (
      <View style={[styles.card, styles.center]}>
        <ActivityIndicator size="small" color={tokens.accent.bronze} />
        <Texto variant="caption" color="muted" style={styles.loadingText}>
          Despertando estátua...
        </Texto>
      </View>
    );
  }

  // Estilo estético para o Badge de Tier do Material
  const obterBadgeEstilo = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return {
          bg: 'rgba(90, 70, 50, 0.15)',
          border: 'rgba(193, 154, 107, 0.3)',
          texto: tokens.accent.bronze,
          nome: 'Bronze'
        };
      case 'pedra':
        return {
          bg: 'rgba(110, 100, 87, 0.15)',
          border: 'rgba(184, 171, 155, 0.3)',
          texto: '#92887A',
          nome: 'Pedra'
        };
      case 'marmore':
        return {
          bg: 'rgba(232, 222, 209, 0.15)',
          border: 'rgba(163, 150, 134, 0.3)',
          texto: '#A39686',
          nome: 'Mármore'
        };
      case 'dourada':
        return {
          bg: 'rgba(184, 147, 90, 0.15)',
          border: 'rgba(212, 175, 122, 0.4)',
          texto: '#D4AF7A',
          nome: 'Dourada'
        };
      default:
        return {
          bg: 'rgba(90, 70, 50, 0.15)',
          border: 'rgba(193, 154, 107, 0.3)',
          texto: tokens.accent.bronze,
          nome: 'Bronze'
        };
    }
  };

  const badge = obterBadgeEstilo(estadoSilhueta.tier_atual);

  return (
    <View style={styles.card}>
      {/* Badge de Tier de Material superior esquerdo */}
      <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
        <Texto variant="caption" style={[styles.badgeText, { color: badge.texto }]}>
          Tier {badge.nome}
        </Texto>
      </View>

      {/* Renderizador Vetorial performático Skia */}
      <View style={styles.canvasContainer}>
        <EstatuaSVG 
          estado={estadoSilhueta}
          largura={200}
          altura={270}
          frente={frente}
          interativo={false}
        />
      </View>

      {/* Toggle Segmentado Moderno inferior direito (Thumb Zone amigável) */}
      <View style={styles.toggleContainer}>
        <Pressable 
          onPress={() => setFrente(true)}
          style={[styles.toggleBtn, frente && styles.toggleBtnActive]}
        >
          <Texto 
            variant="caption" 
            style={[styles.toggleBtnText, frente ? styles.toggleBtnTextActive : { color: tokens.text.muted }]}
          >
            Frente
          </Texto>
        </Pressable>
        <Pressable 
          onPress={() => setFrente(false)}
          style={[styles.toggleBtn, !frente && styles.toggleBtnActive]}
        >
          <Texto 
            variant="caption" 
            style={[styles.toggleBtnText, !frente ? styles.toggleBtnTextActive : { color: tokens.text.muted }]}
          >
            Costas
          </Texto>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 310,
    backgroundColor: '#1E1B18', // bg-elevated da paleta de design do Hypertropos
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  canvasContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    left: 16,
    top: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toggleContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    zIndex: 10,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#E8DED1',
  }
});
