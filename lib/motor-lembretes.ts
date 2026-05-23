import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { obterLinhas, executarQuery } from '../db/local-cache';
import { enqueueChange } from '../db/sync-engine';

// Configuração do handler para exibir notificações mesmo com o app em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface Lembrete {
  id: string;
  perfil_id: string;
  tipo: string; // Ex: 'treino', 'agua', 'proteina'
  hora_disparo: string; // Formato HH:MM ou HH:MM:SS
  dias_semana?: string[]; // Array contendo ex: ['seg', 'qua', 'sex'] ou nulo para diário
  ativo: boolean;
  mensagem_personalizada?: string;
  notification_id?: string; // IDs das notificações agendadas concatenadas por vírgula
}

/**
 * Solicita de forma resiliente permissão para disparar notificações locais.
 * Lida com negativas do sistema e retorna se o app possui a autorização final.
 */
export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const { status: statusExistente } = await Notifications.getPermissionsAsync();
    let statusFinal = statusExistente;

    if (statusExistente !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      statusFinal = status;
    }

    if (statusFinal !== 'granted') {
      console.warn('Permissão de notificações locais negada pelo usuário.');
      return false;
    }

    // Configuração especial necessária para Android no canal de notificações padrão
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Erro ao obter permissão de notificações:', error);
    return false;
  }
}

/**
 * Mapeia dias da semana curtos/longos em português para os números do Expo (1 = Domingo, 2 = Segunda, ..., 7 = Sábado).
 */
function mapearDiaSemanaParaExpo(dia: string): number {
  const diaNormalizado = dia.toLowerCase().trim();
  if (diaNormalizado.startsWith('dom')) return 1;
  if (diaNormalizado.startsWith('seg')) return 2;
  if (diaNormalizado.startsWith('ter')) return 3;
  if (diaNormalizado.startsWith('qua')) return 4;
  if (diaNormalizado.startsWith('qui')) return 5;
  if (diaNormalizado.startsWith('sex')) return 6;
  if (diaNormalizado.startsWith('sab')) return 7;
  return 2; // Fallback para Segunda-feira
}

/**
 * Agenda uma notificação local no SO e persiste os IDs gerados pelo Expo no banco local e remoto.
 * 
 * Se o lembrete tiver dias da semana definidos, agenda notificações semanais individuais.
 * Se não tiver, agenda uma notificação diária recorrente.
 */
export async function agendarLembrete(lembrete: Lembrete): Promise<string | null> {
  const autorizado = await solicitarPermissaoNotificacoes();
  if (!autorizado) {
    console.warn('Lembrete não agendado: sem permissão de notificações.');
    return null;
  }

  // 1. Cancela agendamentos pré-existentes deste lembrete se houver
  if (lembrete.notification_id) {
    await cancelarLembrete(lembrete.notification_id);
  }

  // 2. Extrai hora e minuto do disparo
  const partes = lembrete.hora_disparo.split(':');
  const hora = parseInt(partes[0], 10);
  const minuto = parseInt(partes[1], 10);

  if (isNaN(hora) || isNaN(minuto)) {
    console.error('Hora de disparo inválida:', lembrete.hora_disparo);
    return null;
  }

  const idsNotificacao: string[] = [];

  try {
    const titulo = `Hora do seu ${lembrete.tipo === 'treino' ? 'Treino!' : lembrete.tipo === 'proteina' ? 'Consumo Proteico!' : 'Foco!'}`;
    const corpo = lembrete.mensagem_personalizada || 
      (lembrete.tipo === 'treino' 
        ? 'Hora de manter a consistência e buscar a hipertrofia!' 
        : lembrete.tipo === 'proteina'
        ? 'Lembrete de bater sua meta proteica da próxima refeição.'
        : 'Hora de agir pelo seu objetivo físico!');

    // 3. Agenda as notificações locais com base nos dias da semana
    if (lembrete.dias_semana && lembrete.dias_semana.length > 0) {
      // Notificações semanais para cada dia selecionado
      for (const dia of lembrete.dias_semana) {
        const expoWeekday = mapearDiaSemanaParaExpo(dia);
        
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: titulo,
            body: corpo,
            sound: true,
            data: { lembreteId: lembrete.id, tipo: lembrete.tipo },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: expoWeekday,
            hour: hora,
            minute: minuto,
          },
        });
        idsNotificacao.push(id);
      }
    } else {
      // Notificação diária recorrente se dias da semana não estiver especificado
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: titulo,
          body: corpo,
          sound: true,
          data: { lembreteId: lembrete.id, tipo: lembrete.tipo },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hora,
          minute: minuto,
        },
      });
      idsNotificacao.push(id);
    }

    const notificationIdConcatenado = idsNotificacao.join(',');

    // 4. Salva a associação no banco de dados SQLite local
    await executarQuery(
      'UPDATE lembretes SET notification_id = ?, ativo = 1, updated_at = ? WHERE id = ?',
      [notificationIdConcatenado, new Date().toISOString(), lembrete.id]
    );

    // 5. Envia alteração ao sync-engine offline-first para sincronizar com o Supabase
    const lembreteAtualizado = {
      ...lembrete,
      ativo: true,
      notification_id: notificationIdConcatenado,
      dias_semana: lembrete.dias_semana ? JSON.stringify(lembrete.dias_semana) : null,
      updated_at: new Date().toISOString()
    };
    await enqueueChange('lembretes', 'UPDATE', lembreteAtualizado);

    return notificationIdConcatenado;
  } catch (error) {
    console.error('Erro ao agendar notificação no Expo:', error);
    return null;
  }
}

/**
 * Remove o agendamento local de notificação do sistema operacional.
 * 
 * @param notificationId ID(s) retornado(s) pelo Expo concatenados por vírgula
 */
export async function cancelarLembrete(notificationId: string): Promise<boolean> {
  if (!notificationId) return false;

  try {
    const ids = notificationId.split(',');
    for (const id of ids) {
      if (id.trim()) {
        await Notifications.cancelScheduledNotificationAsync(id.trim());
      }
    }
    return true;
  } catch (error) {
    console.error('Erro ao cancelar notificação local:', error);
    return false;
  }
}

/**
 * Desativa o lembrete no banco de dados e remove suas notificações nativas no SO.
 */
export async function desativarLembrete(lembrete: Lembrete): Promise<boolean> {
  try {
    if (lembrete.notification_id) {
      await cancelarLembrete(lembrete.notification_id);
    }

    // Marca inativo localmente
    await executarQuery(
      'UPDATE lembretes SET ativo = 0, notification_id = NULL, updated_at = ? WHERE id = ?',
      [new Date().toISOString(), lembrete.id]
    );

    // Envia alteração ao sync-engine offline-first
    const lembreteInativo = {
      ...lembrete,
      ativo: false,
      notification_id: null,
      dias_semana: lembrete.dias_semana ? JSON.stringify(lembrete.dias_semana) : null,
      updated_at: new Date().toISOString()
    };
    await enqueueChange('lembretes', 'UPDATE', lembreteInativo);

    return true;
  } catch (error) {
    console.error('Erro ao desativar lembrete no banco/SO:', error);
    return false;
  }
}

/**
 * Sincroniza e recria todos os lembretes ativos a partir do banco de dados local SQLite.
 * Cancela todas as notificações agendadas do app no SO e remarca cada uma das ativas.
 * Útil para inicialização ou pós-reinício do dispositivo móvel.
 */
export async function recriarLembretes(): Promise<void> {
  try {
    // 1. Limpa todas as notificações agendadas deste aplicativo no SO
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Fila de notificações nativas limpa com sucesso.');

    // 2. Busca os lembretes ativos salvos localmente
    const linhas = await obterLinhas<any>(
      'SELECT * FROM lembretes WHERE ativo = 1'
    );

    if (linhas.length === 0) {
      console.log('Nenhum lembrete ativo encontrado para reagendamento.');
      return;
    }

    console.log(`Reagendando ${linhas.length} lembretes ativos...`);

    // 3. Reagenda cada lembrete de forma sequencial e resiliente
    for (const linha of linhas) {
      const lembrete: Lembrete = {
        id: linha.id,
        perfil_id: linha.perfil_id,
        tipo: linha.tipo,
        hora_disparo: linha.hora_disparo,
        dias_semana: linha.dias_semana ? JSON.parse(linha.dias_semana) : undefined,
        ativo: linha.ativo === 1,
        mensagem_personalizada: linha.mensagem_personalizada,
        notification_id: linha.notification_id || undefined,
      };

      await agendarLembrete(lembrete);
    }

    console.log('Todos os lembretes ativos foram recriados e sincronizados com o SO.');
  } catch (error) {
    console.error('Erro crítico ao recriar e sincronizar lembretes no startup:', error);
  }
}
