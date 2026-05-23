import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SONS_ATIVOS = '@hypertropos:sounds_enabled';

export type SoundKey =
  | 'conclusao-serie'
  | 'fim-descanso'
  | 'conclusao-exercicio'
  | 'conclusao-sessao'
  | 'conquista'
  | 'tier-transicao'
  | 'cancelamento';

const SOUND_ASSETS: Record<SoundKey, any> = {
  'conclusao-serie': require('../assets/sounds/conclusao-serie.wav'),
  'fim-descanso': require('../assets/sounds/fim-descanso.wav'),
  'conclusao-exercicio': require('../assets/sounds/conclusao-exercicio.wav'),
  'conclusao-sessao': require('../assets/sounds/conclusao-sessao.wav'),
  'conquista': require('../assets/sounds/conquista.wav'),
  'tier-transicao': require('../assets/sounds/tier-transicao.wav'),
  'cancelamento': require('../assets/sounds/cancelamento.wav'),
};

class MotorAudio {
  private sonsCarregados: Map<SoundKey, Audio.Sound> = new Map();
  private sonsHabilitados: boolean = true;
  private inicializado: boolean = false;

  async inicializar(): Promise<void> {
    if (this.inicializado) return;

    try {
      // 1. Carrega preferência do AsyncStorage
      const valor = await AsyncStorage.getItem(CHAVE_SONS_ATIVOS);
      this.sonsHabilitados = valor !== null ? valor === 'true' : true;

      // 2. Configura modo de áudio global para permitir coexistência com ducking
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        playThroughEarpieceAndroid: false,
      });

      // 3. Pré-carrega todos os sons de forma assíncrona
      const promessas = Object.entries(SOUND_ASSETS).map(async ([key, asset]) => {
        const soundObject = new Audio.Sound();
        try {
          await soundObject.loadAsync(asset, { shouldPlay: false });
          await soundObject.setIsLoopingAsync(false);
          this.sonsCarregados.set(key as SoundKey, soundObject);
        } catch (err) {
          console.error(`Erro ao pré-carregar som [${key}]:`, err);
        }
      });

      await Promise.all(promessas);
      this.inicializado = true;
      console.log('Motor de Áudio inicializado com sucesso, sons carregados em cache.');
    } catch (error) {
      console.error('Falha ao inicializar o Motor de Áudio:', error);
    }
  }

  async setSonsHabilitados(habilitado: boolean): Promise<void> {
    this.sonsHabilitados = habilitado;
    await AsyncStorage.setItem(CHAVE_SONS_ATIVOS, String(habilitado));
  }

  isSonsHabilitados(): boolean {
    return this.sonsHabilitados;
  }

  async tocarSom(key: SoundKey): Promise<void> {
    if (!this.sonsHabilitados) {
      return;
    }

    const som = this.sonsCarregados.get(key);
    if (!som) {
      console.warn(`Som [${key}] não está carregado no cache.`);
      return;
    }

    try {
      const status = await som.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await som.stopAsync();
        }
        await som.setPositionAsync(0);
        await som.playAsync();
      } else {
        // Se descarregado por algum motivo, tenta recarregar
        await som.loadAsync(SOUND_ASSETS[key], { shouldPlay: true });
      }
    } catch (error) {
      console.error(`Erro ao reproduzir o som [${key}]:`, error);
    }
  }

  async liberarSons(): Promise<void> {
    const promessas = Array.from(this.sonsCarregados.values()).map(async (som) => {
      try {
        await som.unloadAsync();
      } catch (err) {
        console.error('Erro ao descarregar som:', err);
      }
    });
    await Promise.all(promessas);
    this.sonsCarregados.clear();
    this.inicializado = false;
  }
}

export const motorAudio = new MotorAudio();
