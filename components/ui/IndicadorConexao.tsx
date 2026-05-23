import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Texto } from './Texto';
import { useTheme } from '../../hooks/useTheme';
import { WifiSlash, ArrowsClockwise } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function IndicadorConexao() {
  const { tokens } = useTheme();
  const [online, setOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    let active = true;

    async function checkConnectivity() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Pings a lightweight endpoint to verify real internet transit
        const res = await fetch('https://clients3.google.com/generate_204', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        if (active) setOnline(res.status === 204 || res.ok);
      } catch (err) {
        if (active) setOnline(false);
      }

      // Also check if sync queue is pending
      try {
        const queueStr = await AsyncStorage.getItem('sync_queue');
        const queue = queueStr ? JSON.parse(queueStr) : [];
        if (active) setSyncPending(queue.length > 0);
      } catch (e) {
        // Ignore
      }
    }

    // Initial check
    checkConnectivity();

    // Polling check every 12 seconds
    const interval = setInterval(checkConnectivity, 12000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const shouldShow = !online || syncPending;
    Animated.spring(slideAnim, {
      toValue: shouldShow ? 0 : -60,
      useNativeDriver: true,
      tension: 40,
      friction: 8
    }).start();
  }, [online, syncPending]);

  const bgStyle = {
    backgroundColor: !online 
      ? 'rgba(235, 94, 85, 0.95)' // Warm red HSL for offline
      : 'rgba(212, 163, 115, 0.95)' // Bronze/Gold HSL for syncing
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        bgStyle,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View className="flex-row items-center justify-center gap-2 py-1.5 px-4">
        {!online ? (
          <>
            <WifiSlash size={14} color="#141210" weight="bold" />
            <Texto variant="captionBold" style={{ color: '#141210', fontSize: 11 }}>
              Sem conexão com a internet • Modo local ativo
            </Texto>
          </>
        ) : (
          <>
            <View className="animate-spin">
              <ArrowsClockwise size={14} color="#141210" weight="bold" />
            </View>
            <Texto variant="captionBold" style={{ color: '#141210', fontSize: 11 }}>
              Sincronizando dados locais com o Supabase...
            </Texto>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Sits beautifully under the native header area
    left: 16,
    right: 16,
    borderRadius: 99,
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});
