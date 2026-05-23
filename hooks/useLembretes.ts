import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Lembrete } from '../types/suplemento';

const LEMBRETES_KEY = '@hypertropos:lembretes';

// Configuração padrão do comportamento de notificação quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useLembretes() {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  // Solicita permissão de notificação em tempo de execução
  const solicitarPermissao = useCallback(async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      const granted = finalStatus === 'granted';
      setHasPermission(granted);

      if (granted && Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Lembretes de Nutrição e Treino',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#C19A6B', // Bronze do Hypertropos
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error);
      return false;
    }
  }, []);

  // Carrega lembretes salvos localmente
  const carregarLembretes = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(LEMBRETES_KEY);
      if (data) {
        setLembretes(JSON.parse(data));
      } else {
        // Lembretes padrão iniciais para não vir vazio
        const padroes: Lembrete[] = [
          {
            id: 'default-creatina',
            tipo: 'creatina',
            horario: '10:00',
            ativo: false,
            dias_semana: [1, 2, 3, 4, 5, 6, 0], // todos os dias
          },
          {
            id: 'default-refeicao',
            tipo: 'refeicao_proteica',
            horario: '13:00',
            ativo: false,
            dias_semana: [1, 2, 3, 4, 5], // segunda a sexta
          }
        ];
        setLembretes(padroes);
        await AsyncStorage.setItem(LEMBRETES_KEY, JSON.stringify(padroes));
      }

      // Checa permissão silenciosamente
      const { status } = await Notifications.getPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    }
  }, []);

  // Cancela todos os agendamentos de notificação associados a um lembrete específico
  const cancelarNotificacoesLembrete = useCallback(async (lembreteId: string) => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const notif of scheduled) {
        const data = notif.content.data;
        if (data && data.lembreteId === lembreteId) {
          await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        }
      }
    } catch (e) {
      console.error(`Erro ao cancelar notificações do lembrete ${lembreteId}:`, e);
    }
  }, []);

  // Agenda as notificações semanais recorrentes no expo-notifications
  const agendarNotificacoesLembrete = useCallback(async (lembrete: Lembrete) => {
    if (!lembrete.ativo) return;

    try {
      const [horaStr, minutoStr] = lembrete.horario.split(':');
      const hour = parseInt(horaStr, 10);
      const minute = parseInt(minutoStr, 10);

      const titulos = {
        creatina: 'Creatina Monohidratada 🧪',
        refeicao_proteica: 'Gatilho Anabólico! 🥩',
        hora_treino: 'Hora do Show! 💪',
      };

      const mensagens = {
        creatina: 'Mantenha seus estoques de fosfocreatina saturados. Consistência gera hipertrofia!',
        refeicao_proteica: 'Hora de fornecer aminoácidos e sinalizar a síntese de proteínas via mTORC1.',
        hora_treino: 'Sua sessão de treinamento está agendada. Prepare a mente e esmague as séries!',
      };

      // Para cada dia selecionado (0 = Domingo, 1 = Segunda, etc.)
      for (const dia of lembrete.dias_semana) {
        // O expo-notifications usa 1 = Domingo, 2 = Segunda, ..., 7 = Sábado para gatilhos semanais
        const weekdayExpo = dia === 0 ? 1 : dia + 1;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: titulos[lembrete.tipo],
            body: mensagens[lembrete.tipo],
            data: { lembreteId: lembrete.id },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            hour,
            minute,
            weekday: weekdayExpo,
          },
        });
      }
    } catch (e) {
      console.error(`Erro ao agendar notificações para o lembrete ${lembrete.id}:`, e);
    }
  }, []);

  // Adiciona ou edita um lembrete
  const agendarLembrete = useCallback(async (novoLembrete: Omit<Lembrete, 'id' | 'ativo'>): Promise<void> => {
    const granted = await solicitarPermissao();
    
    const lembreteCompleto: Lembrete = {
      ...novoLembrete,
      id: Math.random().toString(36).substring(2, 9),
      ativo: true, // ativo por padrão na criação
    };

    setLembretes((prev) => {
      const atualizados = [...prev, lembreteCompleto];
      AsyncStorage.setItem(LEMBRETES_KEY, JSON.stringify(atualizados)).catch(console.error);
      return atualizados;
    });

    if (granted) {
      await agendarNotificacoesLembrete(lembreteCompleto);
    }
  }, [solicitarPermissao, agendarNotificacoesLembrete]);

  // Alterna toggle ativo/inativo do lembrete
  const alternarLembrete = useCallback(async (id: string, ativo: boolean) => {
    let granted = hasPermission;
    if (ativo && !hasPermission) {
      granted = await solicitarPermissao();
    }

    setLembretes((prev) => {
      const atualizados = prev.map((lembrete) => {
        if (lembrete.id === id) {
          const atualizado = { ...lembrete, ativo };
          
          // Lida com o agendamento real em background
          if (ativo && granted) {
            agendarNotificacoesLembrete(atualizado).catch(console.error);
          } else {
            cancelarNotificacoesLembrete(id).catch(console.error);
          }
          
          return atualizado;
        }
        return lembrete;
      });

      AsyncStorage.setItem(LEMBRETES_KEY, JSON.stringify(atualizados)).catch(console.error);
      return atualizados;
    });
  }, [hasPermission, solicitarPermissao, agendarNotificacoesLembrete, cancelarNotificacoesLembrete]);

  // Exclui um lembrete
  const excluirLembrete = useCallback(async (id: string) => {
    await cancelarNotificacoesLembrete(id);

    setLembretes((prev) => {
      const filtrados = prev.filter(l => l.id !== id);
      AsyncStorage.setItem(LEMBRETES_KEY, JSON.stringify(filtrados)).catch(console.error);
      return filtrados;
    });
  }, [cancelarNotificacoesLembrete]);

  useEffect(() => {
    carregarLembretes();
  }, [carregarLembretes]);

  return {
    lembretes,
    hasPermission,
    solicitarPermissao,
    agendarLembrete,
    alternarLembrete,
    excluirLembrete,
    recarregarLembretes: carregarLembretes,
  };
}
