/**
 * Motor de Áudio — Hypertropos
 *
 * Gerencia reprodução de sons de feedback (conclusão de série, fim de
 * descanso, conquistas, etc.) usando a API imperativa do expo-audio.
 *
 * Migrado de expo-av para expo-audio em Jun/2026 para compatibilidade
 * com Expo SDK 56. A expo-av foi removida no SDK 56 e substituída por
 * expo-audio (playback) e expo-video (vídeo).
 *
 * NOTA: Os arquivos .wav em assets/sounds/ ainda não existem (Fase 10).
 * Todos os loads são envoltos em try/catch para que a ausência de um
 * arquivo de áudio NÃO derrube o app — apenas logamos console.warn.
 */

import { createAudioPlayer, AudioPlayer } from 'expo-audio';
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

const SOUND_ASSETS: Record<SoundKey, number> = {
  'conclusao-serie': require('../assets/sounds/conclusao-serie.wav'),
  'fim-descanso': require('../assets/sounds/fim-descanso.wav'),
  'conclusao-exercicio': require('../assets/sounds/conclusao-exercicio.wav'),
  'conclusao-sessao': require('../assets/sounds/conclusao-sessao.wav'),
  'conquista': require('../assets/sounds/conquista.wav'),
  'tier-transicao': require('../assets/sounds/tier-transicao.wav'),
  'cancelamento': require('../assets/sounds/cancelamento.wav'),
};

class MotorAudio {
  private players: Map<SoundKey, AudioPlayer> = new Map();
  private sonsHabilitados: boolean = true;
  private inicializado: boolean = false;

  /**
   * Inicializa o motor de áudio: carrega preferência do AsyncStorage e
   * cria um AudioPlayer para cada som do app.
   *
   * expo-audio não possui setAudioModeAsync em runtime — a configuração
   * de ducking/background é feita pelo config plugin no app.json.
   */
  async inicializar(): Promise<void> {
    if (this.inicializado) return;

    try {
      // 1. Carrega preferência do AsyncStorage
      const valor = await AsyncStorage.getItem(CHAVE_SONS_ATIVOS);
      this.sonsHabilitados = valor !== null ? valor === 'true' : true;

      // 2. Cria um AudioPlayer para cada som (pré-carrega)
      const entries = Object.entries(SOUND_ASSETS) as [SoundKey, number][];

      for (const [key, asset] of entries) {
        try {
          const player = createAudioPlayer(asset);
          player.volume = 1.0;
          this.players.set(key, player);
        } catch (err) {
          console.warn(`[MotorAudio] Falha ao criar player para [${key}]. Arquivo pode não existir ainda.`, err);
        }
      }

      this.inicializado = true;
      console.log(`Motor de Áudio inicializado (expo-audio). ${this.players.size}/${entries.length} players criados.`);
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

    const player = this.players.get(key);
    if (!player) {
      console.warn(`[MotorAudio] Som [${key}] não está carregado no cache.`);
      return;
    }

    try {
      // Rebobina para o início e reproduz
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error(`[MotorAudio] Erro ao reproduzir o som [${key}]:`, error);
    }
  }

  async liberarSons(): Promise<void> {
    for (const [key, player] of this.players) {
      try {
        player.release();
      } catch (err) {
        console.error(`[MotorAudio] Erro ao liberar player [${key}]:`, err);
      }
    }
    this.players.clear();
    this.inicializado = false;
  }
}

export const motorAudio = new MotorAudio();
