import { useState, useEffect, useCallback } from 'react';
import { motorAudio, SoundKey } from '../lib/motor-audio';

export function useSound() {
  const [sonsHabilitados, setSonsHabilitadosState] = useState<boolean>(true);

  // Inicializa o estado com base no motor de áudio
  useEffect(() => {
    setSonsHabilitadosState(motorAudio.isSonsHabilitados());
  }, []);

  // Função para tocar som com useCallback para não causar re-renderizações desnecessárias
  const tocarSom = useCallback((key: SoundKey) => {
    motorAudio.tocarSom(key).catch((err) => {
      console.error(`Erro ao tentar tocar som [${key}] no hook:`, err);
    });
  }, []);

  // Função para alternar preferência de som
  const alternarSons = useCallback(async (habilitado: boolean) => {
    try {
      await motorAudio.setSonsHabilitados(habilitado);
      setSonsHabilitadosState(habilitado);
    } catch (err) {
      console.error('Erro ao alternar sons no hook:', err);
    }
  }, []);

  return {
    tocarSom,
    sonsHabilitados,
    alternarSons,
  };
}
