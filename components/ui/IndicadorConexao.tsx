import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Texto } from './Texto';
import { useTheme } from '../../hooks/useTheme';
import { WifiSlash, ArrowsClockwise } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Indicador de conexão/sincronização.
 * Renderizado EM FLUXO no topo (empurra o conteúdo em vez de sobrepor o
 * cabeçalho) e respeitando a área segura via insets — sem número mágico.
 */
export function IndicadorConexao() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [online, setOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;

    async function checkConnectivity() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        // Ping de endpoint leve para verificar trânsito real de internet
        const res = await fetch('https://clients3.google.com/generate_204', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeoutId);
        if (active) setOnline(res.status === 204 || res.ok);
      } catch (err) {
        if (active) setOnline(false);
      }

      try {
        const queueStr = await AsyncStorage.getItem('sync_queue');
        const queue = queueStr ? JSON.parse(queueStr) : [];
        if (active) setSyncPending(queue.length > 0);
      } catch (e) {
        // Ignora
      }
    }

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 12000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const shouldShow = !online || syncPending;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: shouldShow ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [shouldShow, opacity]);

  if (!shouldShow) return null;

  const barColor = !online ? tokens.feedback.error : tokens.accent.bronze;

  return (
    <Animated.View
      style={{
        opacity,
        backgroundColor: barColor,
        paddingTop: insets.top + 6,
        paddingBottom: 8,
        paddingHorizontal: 16,
      }}
    >
      <View className="flex-row items-center justify-center gap-2">
        {!online ? (
          <WifiSlash size={14} color={tokens.fg.inverse} weight="bold" />
        ) : (
          <ArrowsClockwise size={14} color={tokens.fg.inverse} weight="bold" />
        )}
        <Texto variant="captionBold" style={{ color: tokens.fg.inverse, fontSize: 11 }}>
          {!online ? 'Sem conexão • Modo local ativo' : 'Sincronizando com o Supabase'}
        </Texto>
      </View>
    </Animated.View>
  );
}
