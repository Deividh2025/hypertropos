import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Container } from '../../components/ui/Container';
import { Texto } from '../../components/ui/Texto';
import { Card } from '../../components/ui/Card';
import { Botao } from '../../components/ui/Botao';
import { useTheme } from '../../hooks/useTheme';
import { supabase } from '../../db/supabase-client';

export default function HomePlaceholderScreen() {
  const { toggleTheme } = useTheme();
  const router = useRouter();

  const testarSupabase = async () => {
    try {
      const { error, count } = await supabase
        .from('perfil_usuario')
        .select('*', { count: 'exact', head: true });

      if (error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Sucesso', `Perfis na base remota: ${count}`);
      }
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const limparOnboarding = async () => {
    await AsyncStorage.removeItem('onboarding_complete');
    router.replace('/onboarding');
  };

  return (
    <Container>
      <ScrollView contentContainerClassName="p-6 gap-6 items-center flex-1 justify-center">
        <View className="items-center mb-8">
          <Texto variant="h1" className="text-center mb-2">Perfil Salvo.</Texto>
          <Texto variant="bodyL" color="secondary" className="text-center">
            Sua rotina personalizada será gerada na Fase 4.
          </Texto>
        </View>

        <Card className="w-full mb-4">
          <Texto variant="h3" className="mb-4">Ferramentas de Teste (Fase 3)</Texto>
          
          <Botao variant="secondary" onPress={testarSupabase} className="mb-4">
            Verificar Supabase
          </Botao>
          
          <Botao variant="destructive" onPress={limparOnboarding}>
            Resetar Onboarding
          </Botao>
        </Card>

        <View className="mt-8">
          <Botao variant="ghost" onPress={toggleTheme}>
            Alternar Tema
          </Botao>
        </View>
      </ScrollView>
    </Container>
  );
}
