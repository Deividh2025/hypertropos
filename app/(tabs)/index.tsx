import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../db/supabase-client';

export default function HomeSandboxScreen() {
  const { toggleTheme } = useTheme();
  const [loadingDb, setLoadingDb] = useState(false);

  const testarSupabase = async () => {
    setLoadingDb(true);
    try {
      const { error, count } = await supabase
        .from('exercicios')
        .select('*', { count: 'exact', head: true });

      if (error) {
        Alert.alert('Erro Supabase', error.message);
      } else {
        Alert.alert('Sucesso', `Conexão bem-sucedida! Exercícios na base: ${count}`);
      }
    } catch (err: any) {
      Alert.alert('Erro Inesperado', err.message);
    } finally {
      setLoadingDb(false);
    }
  };

  return (
    <Container>
      <ScrollView contentContainerClassName="p-6 gap-6">
        <View className="gap-2">
          <Texto variant="displayL">Hypertropos</Texto>
          <Texto variant="bodyL" color="secondary">
            Sistema de Design Tokens e Dados em funcionamento.
          </Texto>
        </View>

        {/* Teste de Dados */}
        <View className="gap-4">
          <Texto variant="h3">Infraestrutura de Dados</Texto>
          <Botao 
            variant="primary" 
            onPress={testarSupabase}
            disabled={loadingDb}
          >
            {loadingDb ? 'Testando...' : 'Testar conexão Supabase'}
          </Botao>
        </View>

        {/* Cards de Cores */}
        <View className="flex-row gap-4">
          <Card padding="none" className="flex-1 overflow-hidden">
            <View className="bg-accent-bronze p-4 items-center justify-center">
              <Texto variant="captionBold" color="inverse">Bronze</Texto>
            </View>
          </Card>
          <Card padding="none" className="flex-1 overflow-hidden">
            <View className="bg-accent-marble p-4 items-center justify-center">
              <Texto variant="captionBold" color="inverse">Marble</Texto>
            </View>
          </Card>
          <Card padding="none" className="flex-1 overflow-hidden">
            <View className="bg-accent-gold p-4 items-center justify-center">
              <Texto variant="captionBold" color="inverse">Gold</Texto>
            </View>
          </Card>
        </View>

        {/* Botões */}
        <View className="gap-4">
          <Texto variant="h3">Botões</Texto>
          <Botao variant="primary" onPress={() => console.log('Botão Primary clicado')}>
            Primary Action
          </Botao>
          <Botao variant="secondary" onPress={() => console.log('Botão Secondary clicado')}>
            Secondary Action
          </Botao>
          <Botao variant="ghost" onPress={() => console.log('Botão Ghost clicado')}>
            Ghost Action
          </Botao>
          <Botao variant="destructive" onPress={() => console.log('Botão Destructive clicado')}>
            Destructive Action
          </Botao>
        </View>

        {/* Tipografia */}
        <View className="gap-4">
          <Texto variant="h3">Tipografia</Texto>
          <Texto variant="displayXL">Display XL</Texto>
          <Texto variant="displayL">Display L</Texto>
          <Texto variant="h1">Heading 1</Texto>
          <Texto variant="h2">Heading 2</Texto>
          <Texto variant="h3">Heading 3</Texto>
          <Texto variant="bodyL">Body Large</Texto>
          <Texto variant="body">Body Normal</Texto>
          <Texto variant="bodyBold">Body Bold</Texto>
          <Texto variant="caption">Caption</Texto>
          <Texto variant="captionBold">Caption Bold</Texto>
          <Texto variant="numericHero">00:45</Texto>
          <Texto variant="numericM">12</Texto>
        </View>

        {/* Alternar Tema */}
        <View className="pt-6 pb-12">
          <Botao variant="secondary" onPress={toggleTheme}>
            Alternar Tema
          </Botao>
        </View>
      </ScrollView>
    </Container>
  );
}
