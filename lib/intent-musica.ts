import { Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVE_APP_MUSICA = '@hypertropos:app_musica_preferido';

export type AppMusica =
  | 'spotify'
  | 'youtube_music'
  | 'apple_music'
  | 'deezer'
  | 'amazon_music'
  | 'tidal';

export interface OpcaoMusica {
  id: AppMusica;
  nome: string;
  scheme: string;
  fallbackUrl: string;
  packageName?: string;
}

export const OPCOES_MUSICA: Record<AppMusica, OpcaoMusica> = {
  spotify: {
    id: 'spotify',
    nome: 'Spotify',
    scheme: 'spotify://',
    fallbackUrl: 'https://open.spotify.com',
    packageName: 'com.spotify.music',
  },
  youtube_music: {
    id: 'youtube_music',
    nome: 'YouTube Music',
    scheme: 'vnd.youtube.music://',
    fallbackUrl: 'https://music.youtube.com',
    packageName: 'com.google.android.apps.youtube.music',
  },
  apple_music: {
    id: 'apple_music',
    nome: 'Apple Music',
    scheme: 'music://',
    fallbackUrl: 'https://music.apple.com',
    packageName: 'com.apple.android.music',
  },
  deezer: {
    id: 'deezer',
    nome: 'Deezer',
    scheme: 'deezer://',
    fallbackUrl: 'https://www.deezer.com',
    packageName: 'deezer.android',
  },
  amazon_music: {
    id: 'amazon_music',
    nome: 'Amazon Music',
    scheme: 'amznmp3://',
    fallbackUrl: 'https://music.amazon.com',
    packageName: 'com.amazon.mp3',
  },
  tidal: {
    id: 'tidal',
    nome: 'Tidal',
    scheme: 'tidal://',
    fallbackUrl: 'https://tidal.com',
    packageName: 'com.aspiro.tidal',
  },
};

export async function obterAppMusicaPreferido(): Promise<AppMusica> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE_APP_MUSICA);
    return (valor as AppMusica) || 'spotify';
  } catch {
    return 'spotify';
  }
}

export async function salvarAppMusicaPreferido(app: AppMusica): Promise<void> {
  await AsyncStorage.setItem(CHAVE_APP_MUSICA, app);
}

export async function abrirAppMusica(appInput?: AppMusica): Promise<void> {
  const app = appInput || (await obterAppMusicaPreferido());
  const opcao = OPCOES_MUSICA[app];

  try {
    // Tenta abrir o scheme nativo diretamente
    // Em muitos SOs, Linking.canOpenURL retorna falso sem queries explícitas no AndroidManifest/Info.plist,
    // então a melhor prática no Expo é tentar o Linking.openURL direto dentro de um try/catch.
    await Linking.openURL(opcao.scheme);
  } catch (error) {
    console.warn(`Não foi possível abrir o app nativo [${opcao.nome}]:`, error);
    // Se falhar, exibe um alerta amigável oferecendo abrir o site
    Alert.alert(
      'Aplicativo não encontrado',
      `Não conseguimos abrir o ${opcao.nome} nativamente. Gostaria de abri-lo no navegador?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir no Navegador',
          onPress: () => Linking.openURL(opcao.fallbackUrl).catch(() => {}),
        },
      ]
    );
  }
}
