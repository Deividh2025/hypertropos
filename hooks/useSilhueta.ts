import { useState, useEffect, useCallback } from 'react';
import { obterLinha, executarQuery } from '../db/local-cache';
import { EstadoSilhueta } from '../types/gamificacao';
import { usePerfilStore } from '../stores/perfilStore';
import { enqueueChange } from '../db/sync-engine';

const PERFIL_PADRAO_ID = 'default';

const ESTADO_SILHUETA_INICIAL: EstadoSilhueta = {
  id: PERFIL_PADRAO_ID,
  peito: 0,
  costas: 0,
  ombros: 0,
  bracos: 0,
  quadriceps: 0,
  posterior: 0,
  gluteo: 0,
  panturrilha: 0,
  core: 0,
  tier_atual: 'bronze',
  ultima_atualizacao: new Date().toISOString()
};

export function useSilhueta() {
  const [estadoSilhueta, setEstadoSilhueta] = useState<EstadoSilhueta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { perfil } = usePerfilStore();

  const perfilId = perfil?.id || PERFIL_PADRAO_ID;

  // 1. Carrega o estado atual da silhueta do SQLite local
  const carregarEstado = useCallback(async () => {
    setIsLoading(true);
    try {
      let data = await obterLinha<EstadoSilhueta>(
        'SELECT * FROM estado_silhueta WHERE id = ?', 
        [perfilId]
      );

      if (!data) {
        // Caso "Primeira Vez" (sem registros): Inicializa e grava estado zerado no SQLite
        data = {
          ...ESTADO_SILHUETA_INICIAL,
          id: perfilId,
          ultima_atualizacao: new Date().toISOString()
        };

        await executarQuery(`
          INSERT INTO estado_silhueta (
            id, peito, costas, ombros, bracos, quadriceps, posterior, gluteo, panturrilha, core, tier_atual, ultima_atualizacao
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          data.id, data.peito, data.costas, data.ombros, data.bracos,
          data.quadriceps, data.posterior, data.gluteo, data.panturrilha,
          data.core, data.tier_atual, data.ultima_atualizacao
        ]);

        // Envia ao motor de sincronização offline-first
        await enqueueChange('estado_silhueta', 'INSERT', data);
      }

      setEstadoSilhueta(data);
    } catch (error) {
      console.error('Erro ao carregar estado da silhueta no hook:', error);
      // Fallback gracioso para evitar crash no aplicativo
      setEstadoSilhueta(ESTADO_SILHUETA_INICIAL);
    } finally {
      setIsLoading(false);
    }
  }, [perfilId]);

  // 2. Atualiza a silhueta gravando novos valores (usado após completar treinos ou simular evolução)
  const atualizarEstado = useCallback(async (novosDados: Partial<EstadoSilhueta>) => {
    if (!estadoSilhueta) return;

    try {
      const estadoAtualizado: EstadoSilhueta = {
        ...estadoSilhueta,
        ...novosDados,
        ultima_atualizacao: new Date().toISOString()
      };

      await executarQuery(`
        INSERT OR REPLACE INTO estado_silhueta (
          id, peito, costas, ombros, bracos, quadriceps, posterior, gluteo, panturrilha, core, tier_atual, ultima_atualizacao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        estadoAtualizado.id,
        estadoAtualizado.peito,
        estadoAtualizado.costas,
        estadoAtualizado.ombros,
        estadoAtualizado.bracos,
        estadoAtualizado.quadriceps,
        estadoAtualizado.posterior,
        estadoAtualizado.gluteo,
        estadoAtualizado.panturrilha,
        estadoAtualizado.core,
        estadoAtualizado.tier_atual,
        estadoAtualizado.ultima_atualizacao
      ]);

      await enqueueChange('estado_silhueta', 'UPDATE', estadoAtualizado);
      setEstadoSilhueta(estadoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar estado da silhueta no hook:', error);
    }
  }, [estadoSilhueta]);

  // 3. Simula uma transição ou animação modificando temporariamente o estado local
  const animarTransicao = useCallback((novaDefinicao: Partial<EstadoSilhueta>) => {
    setEstadoSilhueta(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...novaDefinicao
      };
    });
  }, []);

  useEffect(() => {
    carregarEstado();
  }, [carregarEstado]);

  return {
    estadoSilhueta,
    isLoading,
    atualizarEstado,
    animarTransicao,
    recarregarSilhueta: carregarEstado
  };
}
