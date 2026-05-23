import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { usePerfilStore } from '../../stores/perfilStore';
import { useSound } from '../../hooks/useSound';
import { OPCOES_MUSICA, AppMusica, obterAppMusicaPreferido, salvarAppMusicaPreferido, abrirAppMusica } from '../../lib/intent-musica';
import { FaseNutricional } from '../../types/perfil';
import { ArrowLeft, SpeakerHigh, MusicNotes, Egg, Scales, CalendarBlank, ShieldCheck } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function ConfiguracoesScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { perfil, isLoading, carregarPerfil, atualizarCampo } = usePerfilStore();
  const { tocarSom, sonsHabilitados, alternarSons } = useSound();

  // Local states
  const [pesoLocal, setPesoLocal] = useState<string>('');
  const [appMusica, setAppMusica] = useState<AppMusica>('spotify');
  const [salvandoPeso, setSalvandoPeso] = useState<boolean>(false);

  useEffect(() => {
    carregarPerfil();
    obterAppMusicaPreferido().then(setAppMusica);
  }, []);

  useEffect(() => {
    if (perfil) {
      setPesoLocal(String(perfil.peso_corporal_kg || ''));
    }
  }, [perfil]);

  const handleSalvarPeso = async () => {
    if (!perfil) return;
    const pesoNum = parseFloat(pesoLocal.replace(',', '.'));
    if (isNaN(pesoNum) || pesoNum <= 30 || pesoNum > 250) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    try {
      setSalvandoPeso(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await atualizarCampo('peso_corporal_kg', pesoNum);
      tocarSom('conclusao-serie');
    } catch (err) {
      console.error(err);
    } finally {
      setSalvandoPeso(false);
    }
  };

  const handleMudarFase = async (fase: FaseNutricional) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await atualizarCampo('fase_nutricional', fase);
    tocarSom('conclusao-serie');
  };

  const handleMudarAppMusica = async (app: AppMusica) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await salvarAppMusicaPreferido(app);
    setAppMusica(app);
  };

  const handleTestarMusica = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await abrirAppMusica(appMusica);
  };

  if (isLoading || !perfil) {
    return (
      <Container className="justify-center items-center">
        <ActivityIndicator size="large" color={tokens.accent.bronze} />
      </Container>
    );
  }

  return (
    <Container>
      {/* Header bar */}
      <View className="flex-row items-center px-6 pt-6 pb-4 border-b border-divider">
        <Pressable 
          onPress={() => router.back()}
          className="p-2 mr-3 bg-elevated rounded-full border border-border-subtle"
          style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={20} color={tokens.accent.bronze} weight="light" />
        </Pressable>
        <Texto variant="h1" className="tracking-tight">Configurações</Texto>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 24, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Nutrição e Peso */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2 mb-1 px-1">
            <Egg size={18} color={tokens.accent.bronze} weight="light" />
            <Texto variant="captionBold" color="secondary">METAS & NUTRIÇÃO</Texto>
          </View>

          <Card padding="lg" elevated className="gap-4">
            {/* Peso Corporal Input */}
            <View>
              <Texto variant="bodyBold" className="mb-2">Peso Corporal</Texto>
              <View className="flex-row gap-3">
                <View className="flex-1 flex-row items-center bg-canvas border border-border-subtle rounded-md px-3 h-11">
                  <Scales size={20} color={tokens.fg.muted} weight="light" style={{ marginRight: 8 }} />
                  <TextInput
                    value={pesoLocal}
                    onChangeText={setPesoLocal}
                    keyboardType="numeric"
                    placeholder="Ex: 75.5"
                    placeholderTextColor={tokens.fg.muted}
                    style={{ flex: 1, color: tokens.fg.primary, fontFamily: 'Inter', fontSize: 15 }}
                  />
                  <Texto variant="caption" color="muted">kg</Texto>
                </View>
                <Botao 
                  variant="primary" 
                  size="md" 
                  onPress={handleSalvarPeso}
                  disabled={salvandoPeso}
                  style={{ height: 44 }}
                >
                  {salvandoPeso ? <ActivityIndicator size="small" color={tokens.fg.inverse} /> : 'Salvar'}
                </Botao>
              </View>
            </View>

            {/* Fase Nutricional Segmented Selector */}
            <View className="border-t border-divider pt-4">
              <Texto variant="bodyBold" className="mb-3">Objetivo Nutricional</Texto>
              <View className="flex-row bg-canvas p-1 rounded-md border border-border-subtle">
                {(['manutencao', 'hipertrofia', 'deficit'] as FaseNutricional[]).map((fase) => {
                  const ativo = perfil.fase_nutricional === fase;
                  const label = fase === 'manutencao' ? 'Manutenção' : fase === 'hipertrofia' ? 'Hipertrofia' : 'Déficit';
                  return (
                    <Pressable
                      key={fase}
                      onPress={() => handleMudarFase(fase)}
                      className="flex-1 py-2 justify-center items-center rounded-xs"
                      style={{
                        backgroundColor: ativo ? tokens.bg.overlay : 'transparent',
                        borderColor: ativo ? tokens.border.subtle : 'transparent',
                        borderWidth: ativo ? 1 : 0,
                      }}
                    >
                      <Texto variant="captionBold" color={ativo ? 'bronze' : 'muted'}>
                        {label}
                      </Texto>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Card>
        </View>

        {/* Section 2: Preferências de Áudio */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2 mb-1 px-1">
            <SpeakerHigh size={18} color={tokens.accent.bronze} weight="light" />
            <Texto variant="captionBold" color="secondary">EFEITOS SONOROS</Texto>
          </View>

          <Card padding="lg" elevated className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Texto variant="bodyBold" className="mb-1">Efeitos Sonoros</Texto>
              <Texto variant="caption" color="muted">
                Dings de fim de descanso, clique de séries concluídas e jingles.
              </Texto>
            </View>
            <Switch
              value={sonsHabilitados}
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                alternarSons(val);
              }}
              trackColor={{ false: tokens.bg.canvas, true: tokens.accent.bronze }}
              thumbColor={sonsHabilitados ? tokens.fg.primary : tokens.fg.muted}
            />
          </Card>
        </View>

        {/* Section 3: Reprodutor de Música Preferido */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2 mb-1 px-1">
            <MusicNotes size={18} color={tokens.accent.bronze} weight="light" />
            <Texto variant="captionBold" color="secondary">STREAMING DE MÚSICA</Texto>
          </View>

          <Card padding="lg" elevated className="gap-4">
            <View>
              <Texto variant="bodyBold" className="mb-1">Aplicativo Preferido</Texto>
              <Texto variant="caption" color="muted" className="mb-3">
                Escolha qual aplicativo será aberto pelo botão flutuante de música durante o treino.
              </Texto>

              <View className="gap-2">
                {Object.values(OPCOES_MUSICA).map((opcao) => {
                  const ativo = appMusica === opcao.id;
                  return (
                    <Pressable
                      key={opcao.id}
                      onPress={() => handleMudarAppMusica(opcao.id)}
                      className="flex-row justify-between items-center p-3 bg-canvas border rounded-md"
                      style={{
                        borderColor: ativo ? tokens.accent.bronze : tokens.border.subtle,
                        backgroundColor: ativo ? 'rgba(193, 154, 107, 0.05)' : tokens.bg.canvas,
                      }}
                    >
                      <Texto variant="bodyBold" color={ativo ? 'bronze' : 'primary'}>
                        {opcao.nome}
                      </Texto>
                      {ativo && <Texto variant="captionBold" color="bronze">Ativo</Texto>}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="border-t border-divider pt-4 flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <Texto variant="caption" color="muted">
                  Quer conferir se a integração está ativa? Teste agora.
                </Texto>
              </View>
              <Botao variant="secondary" size="md" onPress={handleTestarMusica}>
                Testar Abertura
              </Botao>
            </View>
          </Card>
        </View>

        {/* Section 4: Lembretes */}
        <View className="items-center mt-4">
          <Botao 
            variant="ghost" 
            onPress={() => router.push('/(tabs)/nutricao')}
            className="flex-row items-center gap-2"
          >
            <Texto variant="body" color="bronze">Gerenciar Lembretes locais</Texto>
            <CalendarBlank size={16} color={tokens.accent.bronze} weight="light" />
          </Botao>
        </View>

        <View className="items-center mt-6 opacity-30">
          <View className="flex-row items-center gap-1.5">
            <ShieldCheck size={16} color={tokens.fg.muted} weight="light" />
            <Texto variant="caption" color="muted">Hypertropos v1.0.0 · Uso Pessoal</Texto>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({});
