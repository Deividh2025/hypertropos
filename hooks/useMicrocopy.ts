import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MICROCOPY_POOLS, MicrocopyCategory } from '../constants/microcopy';

const CHAVE_PERSISTENCIA_POOL = '@hypertropos:microcopy_pools';

type PoolState = Record<MicrocopyCategory, number[]>;

export function useMicrocopy() {
  const poolsRef = useRef<PoolState>({
    transicao: [],
    fimSessao: [],
    streak: [],
    conquistas: [],
    tier: [],
    falha: [],
    cancelamento: []
  });

  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    async function carregarPools() {
      try {
        const dados = await AsyncStorage.getItem(CHAVE_PERSISTENCIA_POOL);
        if (dados) {
          const poolsSalvos = JSON.parse(dados) as PoolState;
          const poolsValidados = { ...poolsRef.current };

          (Object.keys(MICROCOPY_POOLS) as MicrocopyCategory[]).forEach((cat) => {
            const totalFrases = MICROCOPY_POOLS[cat].length;
            const salvos = poolsSalvos[cat] || [];

            if (salvos.length === 0 || salvos.some(i => i >= totalFrases)) {
              poolsValidados[cat] = Array.from({ length: totalFrases }, (_, idx) => idx);
            } else {
              poolsValidados[cat] = salvos;
            }
          });

          poolsRef.current = poolsValidados;
        } else {
          reiniciarTodosPools();
        }
      } catch (err) {
        console.error('Erro ao carregar pools de microcopy:', err);
        reiniciarTodosPools();
      } finally {
        setInicializado(true);
      }
    }

    function reiniciarTodosPools() {
      const novosPools = { ...poolsRef.current };
      (Object.keys(MICROCOPY_POOLS) as MicrocopyCategory[]).forEach((cat) => {
        novosPools[cat] = Array.from({ length: MICROCOPY_POOLS[cat].length }, (_, idx) => idx);
      });
      poolsRef.current = novosPools;
    }

    carregarPools();
  }, []);

  const salvarPoolsEmBackground = async () => {
    try {
      await AsyncStorage.setItem(CHAVE_PERSISTENCIA_POOL, JSON.stringify(poolsRef.current));
    } catch (err) {
      console.error('Erro ao persistir pools de microcopy:', err);
    }
  };

  const obterFrase = useCallback((categoria: MicrocopyCategory): string => {
    const pool = MICROCOPY_POOLS[categoria];
    const disponiveis = poolsRef.current[categoria];

    if (!pool || pool.length === 0) {
      return '';
    }

    // Se o pool de disponíveis estiver vazio, reinicia e sorteia
    if (disponiveis.length === 0) {
      const todosIndices = Array.from({ length: pool.length }, (_, idx) => idx);
      const posicaoSorteada = Math.floor(Math.random() * todosIndices.length);
      const indiceReal = todosIndices[posicaoSorteada];

      poolsRef.current[categoria] = todosIndices.filter(i => i !== indiceReal);
      salvarPoolsEmBackground();
      return pool[indiceReal];
    }

    // Sorteia um índice aleatório dentre os disponíveis
    const posicaoDisponivel = Math.floor(Math.random() * disponiveis.length);
    const indiceReal = disponiveis[posicaoDisponivel];

    // Remove da lista de disponíveis
    const novosDisponiveis = disponiveis.filter((_, idx) => idx !== posicaoDisponivel);

    if (novosDisponiveis.length === 0) {
      poolsRef.current[categoria] = Array.from({ length: pool.length }, (_, idx) => idx);
    } else {
      poolsRef.current[categoria] = novosDisponiveis;
    }

    salvarPoolsEmBackground();
    return pool[indiceReal];
  }, []);

  return {
    obterFrase,
    inicializado
  };
}
