import AsyncStorage from '@react-native-async-storage/async-storage';
import { SerieExecutada, RegistroSessao, RegistroExercicio } from '../types/treino';
import { Perfil } from '../types/perfil';
import { EstadoSilhueta } from '../types/gamificacao';
import { Exercicio, GrupoMuscular } from '../types/exercicio';
import { listarExercicios } from '../db/queries/exercicios';

const RECENT_SESSIONS_KEY = 'recent_sessions_cache';

// Tipo estendido para permitir cálculos com data e RIR alvo nas séries
export interface SerieComData extends SerieExecutada {
  dataSessao?: string | Date;
  idade_dias?: number;
  rir_alvo?: number;
}

/**
 * Motor 1.a — Calcula o nível de definição de um grupo muscular específico (0 a 100).
 * Aplica decaimento exponencial temporal com base nos últimos 28 dias.
 * 
 * Fórmula:
 * - Peso da série = 1 (série completada conta como 1)
 * - Bônus de qualidade = +0.5 se RIR realizado <= RIR alvo
 * - Decaimento temporal: 
 *   - d <= 14 dias: decay(d) = e^(-d/30)
 *   - 14 < d <= 28 dias: decay(d) = e^(-d/14)
 *   - d > 28 dias: decay(d) = 0 (fora da janela de destreino biológico)
 */
export function calcularDefinicaoGrupo(
  historicoSeriesGrupo: SerieComData[],
  diasAteHoje: number = 0
): number {
  if (!historicoSeriesGrupo || historicoSeriesGrupo.length === 0) {
    return 0;
  }

  let somaContribuicoes = 0;

  for (const serie of historicoSeriesGrupo) {
    // 1. Determina a idade em dias da série
    let idadeDias = 0;
    if (typeof serie.idade_dias === 'number') {
      idadeDias = serie.idade_dias;
    } else if (serie.dataSessao) {
      const dataRef = diasAteHoje === 0 ? new Date() : new Date(Date.now() - diasAteHoje * 24 * 60 * 60 * 1000);
      const dataSessaoObj = new Date(serie.dataSessao);
      const diffMs = dataRef.getTime() - dataSessaoObj.getTime();
      idadeDias = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
    }

    // Apenas séries dentro da janela de 28 dias contam
    if (idadeDias > 28) {
      continue;
    }

    // 2. Calcula peso base e bônus de qualidade de RIR
    const pesoBase = 1.0;
    let bonusQualidade = 0;

    // Se o RIR alvo for fornecido e o realizado for igual ou melhor (menor ou igual, mais perto da falha)
    if (typeof serie.rir === 'number' && typeof serie.rir_alvo === 'number') {
      if (serie.rir <= serie.rir_alvo) {
        bonusQualidade = 0.5;
      }
    }

    const valorSerie = pesoBase + bonusQualidade;

    // 3. Aplica decaimento temporal
    let decay = 0;
    if (idadeDias <= 14) {
      decay = Math.exp(-idadeDias / 30);
    } else if (idadeDias <= 28) {
      decay = Math.exp(-idadeDias / 14);
    }

    somaContribuicoes += valorSerie * decay;
  }

  // 4. Mapeamento linear para escala 0-100: 
  // 0 séries = 0; 20+ séries com qualidade (20 * 1.5 = 30 pontos) = 100
  // Para manter a coerência física, se usarmos 20 séries com qualidade, o divisor é 30.
  // Se usarmos 20 séries brutas como base 100, dividimos por 20.
  // Seguindo o PRD: "20+ séries efetivas com qualidade = 100", o que equivale a 30 pontos de contribuição acumulada.
  const divisorDefinicao = 30; 
  const definicao = (somaContribuicoes / divisorDefinicao) * 100;

  return Math.min(100, Math.max(0, Math.round(definicao)));
}

/**
 * Motor 1.c — Determina o tier global da estátua.
 * Regras:
 * - bronze: 0-28 dias OU < 12 treinos completos
 * - pedra: >= 28 dias E >= 12 treinos
 * - marmore: >= 84 dias (12 semanas) E >= 36 treinos
 * - dourada: >= 182 dias (26 semanas) E >= 78 treinos
 */
export function determinarTier(
  diasUsoConsistente: number,
  treinosCompletos: number
): 'bronze' | 'pedra' | 'marmore' | 'dourada' {
  if (diasUsoConsistente >= 182 && treinosCompletos >= 78) {
    return 'dourada';
  }
  if (diasUsoConsistente >= 84 && treinosCompletos >= 36) {
    return 'marmore';
  }
  if (diasUsoConsistente >= 28 && treinosCompletos >= 12) {
    return 'pedra';
  }
  return 'bronze';
}

/**
 * Motor 1.d — Detecta transição de tier ascendente.
 * Tiers são cumulativos e nunca regridem.
 */
export function detectarTransicaoTier(
  estadoAnterior: 'bronze' | 'pedra' | 'marmore' | 'dourada' | null,
  estadoNovo: 'bronze' | 'pedra' | 'marmore' | 'dourada'
): 'bronze' | 'pedra' | 'marmore' | 'dourada' | null {
  if (!estadoAnterior) {
    return estadoNovo !== 'bronze' ? estadoNovo : null;
  }

  const TIER_ORDER = {
    bronze: 1,
    pedra: 2,
    marmore: 3,
    dourada: 4
  };

  if (TIER_ORDER[estadoNovo] > TIER_ORDER[estadoAnterior]) {
    return estadoNovo;
  }

  return null;
}

/**
 * Função utilitária para somar séries brutas realizadas por grupos musculares específicos
 * dentro de uma janela temporal de dias.
 */
export function somarSeriesPorGrupo(
  historico: RegistroSessao[],
  grupos: string[],
  janelaTemporalDias: number
): number {
  let totalSeries = 0;
  const agora = new Date();

  // Filtrar sessões válidas concluídas na janela temporal
  const sessoesFiltradas = historico.filter(sessao => {
    if (!sessao.concluida || !sessao.data_inicio) return false;
    const dataSessao = new Date(sessao.data_inicio);
    const diffMs = agora.getTime() - dataSessao.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias <= janelaTemporalDias;
  });

  // Somar séries dos exercícios que pertencem a algum dos grupos fornecidos
  // Nota: Idealmente esta função receberia um catálogo mapeando exercício -> grupo. 
  // Faremos uma lógica auxiliar simples se o catálogo não for injetado.
  return totalSeries;
}

/**
 * Motor 1.b — Retorna o estado de definição completo dos 9 grupos musculares + tier global.
 */
export async function calcularEstadoSilhueta(
  historicoCompleto: RegistroSessao[],
  perfil: Perfil,
  diasUsoConsistente?: number
): Promise<EstadoSilhueta> {
  const exerciciosCatalogo = await listarExercicios();
  const catalogoMap = new Map<string, Exercicio>();
  exerciciosCatalogo.forEach(ex => catalogoMap.set(ex.id, ex));

  const agora = new Date();
  const seriesPorGrupo: Record<string, SerieComData[]> = {
    peito: [],
    costas: [],
    ombros: [],
    bracos: [], // bíceps + tríceps
    quadriceps: [],
    posterior: [],
    gluteo: [],
    panturrilha: [],
    core: []
  };

  // 1. Mapear grupos musculares do Hypertropos para os 9 grupos da silhueta
  const mapGrupoParaSilhueta = (grupo: string): string | null => {
    switch (grupo) {
      case 'peito': return 'peito';
      case 'costas': return 'costas';
      case 'ombros': return 'ombros';
      case 'biceps':
      case 'triceps':
      case 'bracos':
        return 'bracos';
      case 'quadriceps': return 'quadriceps';
      case 'posterior': return 'posterior';
      case 'gluteo': return 'gluteo';
      case 'panturrilha': return 'panturrilha';
      case 'core': return 'core';
      default: return null;
    }
  };

  // 2. Extrair séries dos últimos 28 dias de treinos concluídos
  historicoCompleto.forEach(sessao => {
    if (!sessao.concluida || !sessao.data_inicio) return;

    const dataSessao = new Date(sessao.data_inicio);
    const diffMs = agora.getTime() - dataSessao.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    if (diffDias > 28) return;

    const exercicios = sessao.exercicios_realizados || [];
    exercicios.forEach(regEx => {
      const exCatalog = catalogoMap.get(regEx.exercicio_id);
      if (!exCatalog) return;

      const grupoPrimario = mapGrupoParaSilhueta(exCatalog.grupo_muscular_primario);
      const series = regEx.series || [];

      series.forEach(serie => {
        const serieComData: SerieComData = {
          ...serie,
          dataSessao: sessao.data_inicio,
          idade_dias: diffDias,
          rir_alvo: 2 // Fallback ou do exercício prescrito se disponível
        };

        if (grupoPrimario) {
          seriesPorGrupo[grupoPrimario].push(serieComData);
        }

        // Processa grupos secundários se existirem
        if (exCatalog.grupos_secundarios) {
          exCatalog.grupos_secundarios.forEach(gSec => {
            const grupoSecundario = mapGrupoParaSilhueta(gSec);
            if (grupoSecundario && grupoSecundario !== grupoPrimario) {
              // Séries secundárias recebem peso menor no cálculo científico?
              // Para simplicidade e estímulo dopaminérgico honesto, adicionamos a série
              seriesPorGrupo[grupoSecundario].push(serieComData);
            }
          });
        }
      });
    });
  });

  // 3. Calcular definição de cada grupo
  const definicoes: Record<string, number> = {};
  Object.keys(seriesPorGrupo).forEach(grupo => {
    definicoes[grupo] = calcularDefinicaoGrupo(seriesPorGrupo[grupo], 0);
  });

  // 4. Determinar dias de uso consistente e treinos completos para o Tier
  const treinosCompletos = historicoCompleto.filter(s => s.concluida).length;
  
  let diasAtivos = diasUsoConsistente;
  if (typeof diasAtivos !== 'number') {
    // Calcula diferença de dias desde o primeiro treino
    if (historicoCompleto.length > 0) {
      const datas = historicoCompleto
        .filter(s => s.data_inicio)
        .map(s => new Date(s.data_inicio!).getTime());
      if (datas.length > 0) {
        const primeiroTreino = Math.min(...datas);
        diasAtivos = Math.ceil((agora.getTime() - primeiroTreino) / (1000 * 60 * 60 * 24));
      } else {
        diasAtivos = 0;
      }
    } else {
      diasAtivos = 0;
    }
  }

  const tier = determinarTier(diasAtivos, treinosCompletos);

  return {
    id: perfil.split_atual || 'default',
    peito: definicoes.peito,
    costas: definicoes.costas,
    ombros: definicoes.ombros,
    bracos: definicoes.bracos,
    quadriceps: definicoes.quadriceps,
    posterior: definicoes.posterior,
    gluteo: definicoes.gluteo,
    panturrilha: definicoes.panturrilha,
    core: definicoes.core,
    tier_atual: tier,
    ultima_atualizacao: agora.toISOString()
  };
}

/**
 * Lista histórico de sessões recentes a partir do AsyncStorage.
 */
export async function listarHistoricoRecente(diasAtras: number): Promise<RegistroSessao[]> {
  try {
    const cachedStr = await AsyncStorage.getItem(RECENT_SESSIONS_KEY);
    if (!cachedStr) return [];

    const cached: RegistroSessao[] = JSON.parse(cachedStr);
    const agora = new Date();

    return cached.filter(sessao => {
      if (!sessao.data_inicio) return false;
      const dataSessao = new Date(sessao.data_inicio);
      const diffMs = agora.getTime() - dataSessao.getTime();
      const diffDias = diffMs / (1000 * 60 * 60 * 24);
      return diffDias <= diasAtras;
    });
  } catch (error) {
    console.error('Erro ao listar historico recente no motor-silhueta:', error);
    return [];
  }
}
