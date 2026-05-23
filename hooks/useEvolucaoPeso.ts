import { useState, useEffect, useCallback, useMemo } from 'react';
import { executarQuery, obterLinhas } from '../db/local-cache';
import { enqueueChange } from '../db/sync-engine';
import { usePerfilStore } from '../stores/perfilStore';

export interface RegistroPeso {
  id: string;
  perfil_id: string;
  peso_kg: number;
  data_registro: string; // Formato YYYY-MM-DD
  created_at: string; // ISO Timestamp
}

export interface UseEvolucaoPesoResultado {
  historico: RegistroPeso[]; // Mais recentes primeiro (para listas)
  dadosGrafico: RegistroPeso[]; // Ordem cronológica (mais antigas para mais recentes, perfeito para o gráfico)
  isLoading: boolean;
  error: string | null;
  registrarNovoPeso: (peso: number) => Promise<boolean>;
  recarregarHistorico: () => Promise<void>;
}

const PERFIL_PADRAO_ID = 'default';

/**
 * Helper para geração resiliente de UUID v4 em JavaScript.
 */
function gerarUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback se falhar
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Hook para persistência, rastreamento e plotagem da evolução do peso corporal do usuário.
 * Integra-se perfeitamente com a sincronização offline-first e recálculos reativos de proteína.
 */
export function useEvolucaoPeso(): UseEvolucaoPesoResultado {
  const [historico, setHistorico] = useState<RegistroPeso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { perfil, atualizarCampo } = usePerfilStore();
  const perfilId = perfil?.id || PERFIL_PADRAO_ID;

  // 1. Busca os últimos 12 registros de peso no SQLite local
  const carregarHistorico = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Busca as últimas 12 pesagens ordenando decrescente por data e criação
      const linhas = await obterLinhas<any>(
        `SELECT * FROM historico_peso_corporal 
         WHERE perfil_id = ? 
         ORDER BY data_registro DESC, created_at DESC 
         LIMIT 12`,
        [perfilId]
      );

      const dadosFormatados: RegistroPeso[] = linhas.map((linha) => ({
        id: linha.id,
        perfil_id: linha.perfil_id,
        peso_kg: Number(linha.peso_kg),
        data_registro: linha.data_registro,
        created_at: linha.created_at,
      }));

      setHistorico(dadosFormatados);
    } catch (err: any) {
      console.error('Erro ao buscar histórico de peso corporal:', err);
      setError('Falha ao carregar histórico de peso corporal.');
    } finally {
      setIsLoading(false);
    }
  }, [perfilId]);

  // 2. Registra um novo peso de forma otimista no local, atualiza o perfil e agenda o sync offline-first
  const registrarNovoPeso = useCallback(
    async (peso: number): Promise<boolean> => {
      if (!peso || peso <= 0) {
        setError('O peso corporal fornecido é inválido.');
        return false;
      }

      try {
        const novoId = gerarUUID();
        const dataRegistro = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const createdAt = new Date().toISOString();

        const novoRegistro: RegistroPeso = {
          id: novoId,
          perfil_id: perfilId,
          peso_kg: peso,
          data_registro: dataRegistro,
          created_at: createdAt,
        };

        // Grava localmente no SQLite
        await executarQuery(
          `INSERT INTO historico_peso_corporal (id, perfil_id, peso_kg, data_registro, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [novoId, perfilId, peso, dataRegistro, createdAt]
        );

        // Dispara sincronização offline-first para o Supabase
        await enqueueChange('historico_peso_corporal', 'INSERT', novoRegistro);

        // Atualiza reativamente o peso_corporal_kg no perfil do usuário
        // Isso recalcula de forma reativa a meta de proteína no hook useMetaProteina!
        await atualizarCampo('peso_corporal_kg', peso);

        // Recarrega o histórico na view local (otimista/instantâneo)
        await carregarHistorico();

        return true;
      } catch (err: any) {
        console.error('Erro ao registrar novo peso corporal:', err);
        setError('Erro ao salvar nova pesagem.');
        return false;
      }
    },
    [perfilId, carregarHistorico, atualizarCampo]
  );

  // 3. Produz um array com ordem cronológica crescente (das datas antigas para as recentes) para o gráfico
  const dadosGrafico = useMemo(() => {
    return [...historico].reverse();
  }, [historico]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  return {
    historico,
    dadosGrafico,
    isLoading,
    error,
    registrarNovoPeso,
    recarregarHistorico: carregarHistorico,
  };
}
