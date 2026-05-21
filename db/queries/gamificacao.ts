import { executarQuery, obterLinha } from '../local-cache';
import { enqueueChange } from '../sync-engine';
import { Gamificacao } from '../../types';

const GAMIFICACAO_ID = 'default';

export async function obterEstado(): Promise<Gamificacao | null> {
  try {
    const linha = await obterLinha<Gamificacao>('SELECT * FROM gamificacao WHERE id = ?', [GAMIFICACAO_ID]);
    return linha || null;
  } catch (error) {
    console.error('Erro ao obter estado de gamificação:', error);
    return null;
  }
}

export async function adicionarXP(xp: number): Promise<void> {
  const estado = await obterEstado();
  if (estado) {
    const novoXP = estado.xp_total + xp;
    // Logica simplificada de nível (ex: a cada 100xp sobe 1 nivel)
    const novoNivel = Math.floor(novoXP / 100) + 1;
    
    const novoEstado = { 
      ...estado, 
      xp_total: novoXP, 
      nivel_atual: novoNivel,
      ultima_atividade: new Date().toISOString()
    };
    
    await salvarEstado(novoEstado);
  }
}

export async function incrementarStreak(): Promise<void> {
  const estado = await obterEstado();
  if (estado) {
    // Na vida real, verificaríamos a data da ultima_atividade pra ver se é consecutiva
    const novoStreak = estado.streak_atual + 1;
    const maxStreak = Math.max(novoStreak, estado.streak_maximo);
    
    const novoEstado = { 
      ...estado, 
      streak_atual: novoStreak, 
      streak_maximo: maxStreak,
      ultima_atividade: new Date().toISOString()
    };
    
    await salvarEstado(novoEstado);
  }
}

async function salvarEstado(estado: Gamificacao): Promise<void> {
  try {
    await executarQuery(`
      INSERT OR REPLACE INTO gamificacao (
        id, xp_total, nivel_atual, streak_atual, streak_maximo, freezes_disponiveis, ultima_atividade
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      estado.id, estado.xp_total, estado.nivel_atual, estado.streak_atual, 
      estado.streak_maximo, estado.freezes_disponiveis, estado.ultima_atividade
    ]);
    
    await enqueueChange('gamificacao', 'UPDATE', estado);
  } catch (error) {
    console.error('Erro ao salvar gamificação:', error);
  }
}

export async function desbloquearConquista(conquistaId: string): Promise<void> {
  try {
    const id = Date.now().toString();
    const data = new Date().toISOString();
    
    await executarQuery(`
      INSERT INTO conquistas_desbloqueadas (id, conquista_id, desbloqueada_em)
      VALUES (?, ?, ?)
    `, [id, conquistaId, data]);
    
    await enqueueChange('conquistas_desbloqueadas', 'INSERT', {
      id,
      conquista_id: conquistaId,
      desbloqueada_em: data
    });
  } catch (error) {
    console.error('Erro ao desbloquear conquista:', error);
  }
}
