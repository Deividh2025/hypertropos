import { supabase } from '../supabase-client';
import { obterPerfil } from './perfil';
import { obterEstado } from './gamificacao';

// --- Interfaces ---

export interface SessaoComResumo {
  id: string;
  nome: string;
  data: string;
  duracao_segundos: number;
  series_totais: number;
  percentual_conclusao: number;
  concluida: boolean;
}

// --- Helpers de Data ---

/**
 * Retorna as datas de início (segunda-feira) e fim (domingo) em formato ISO para o offset de semanas fornecido.
 * Offset 0 é a semana atual, -1 é a anterior, etc.
 */
function obterDatasSemana(semanaOffset: number = 0) {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  const diaAjustado = diaSemana === 0 ? 7 : diaSemana;

  const segunda = new Date(agora);
  segunda.setDate(agora.getDate() - diaAjustado + 1);
  segunda.setHours(0, 0, 0, 0);
  segunda.setDate(segunda.getDate() + semanaOffset * 7);

  const domingo = new Date(segunda);
  domingo.setDate(segunda.getDate() + 6);
  domingo.setHours(23, 59, 59, 999);

  return {
    inicio: segunda.toISOString(),
    fim: domingo.toISOString(),
  };
}

/**
 * Retorna a data correspondente à segunda-feira da semana de uma data qualquer no formato YYYY-MM-DD.
 */
function obterSegundaFeira(dataStr: string): string {
  const data = new Date(dataStr);
  const diaSemana = data.getDay();
  const diaAjustado = diaSemana === 0 ? 7 : diaSemana;

  const segunda = new Date(data);
  segunda.setDate(data.getDate() - diaAjustado + 1);
  segunda.setHours(0, 0, 0, 0);

  return segunda.toISOString().split('T')[0];
}

// --- Funções de Query e Agregação ---

/**
 * Calcula o volume de séries efetivas (RIR <= 3) agrupadas por grupo muscular primário para a semana dada.
 * Alvo é dinamicamente calculado com base no nível do usuário no perfil.
 */
export async function volumeSemanaPorGrupo(
  semanaOffset: number = 0
): Promise<{ grupo: string; series_efetivas: number; alvo: number }[]> {
  try {
    const { inicio, fim } = obterDatasSemana(semanaOffset);

    // 1. Obter nível do usuário (tenta local e usa iniciante como padrão)
    const perfil = await obterPerfil();
    const nivel = perfil?.nivel || 'iniciante';

    const determinarAlvo = (lvl: string): number => {
      switch (lvl) {
        case 'iniciante':
        case 'intermediario_retornando':
          return 8;
        case 'intermediario':
          return 12;
        case 'avancado':
          return 16;
        default:
          return 8;
      }
    };
    const alvo = determinarAlvo(nivel);

    // 2. Lista padrão de grupos musculares suportados no Hypertropos
    const gruposMusculares = [
      'peito',
      'costas',
      'ombros',
      'triceps',
      'biceps',
      'quadriceps',
      'posterior',
      'gluteo',
      'panturrilha',
      'core',
    ];

    const volumes = gruposMusculares.map(grupo => ({
      grupo,
      series_efetivas: 0,
      alvo,
    }));

    // 3. Buscar séries realizadas dentro da semana correspondente no Supabase (com cast para as any)
    const { data, error } = await (supabase.from('series_executadas' as any) as any)
      .select(`
        rir_realizado,
        completada,
        exercicios (
          grupo_muscular_primario
        ),
        registros_execucao!inner (
          data_inicio,
          concluida
        )
      `)
      .gte('registros_execucao.data_inicio', inicio)
      .lte('registros_execucao.data_inicio', fim)
      .eq('registros_execucao.concluida', true)
      .eq('completada', true) as any;

    if (error) throw error;

    // 4. Somar as séries efetivas (RIR <= 3)
    if (data) {
      for (const serie of data) {
        if (serie.rir_realizado !== null && serie.rir_realizado !== undefined && serie.rir_realizado <= 3) {
          const grupoPrimario = (serie.exercicios as any)?.grupo_muscular_primario;
          if (grupoPrimario) {
            const item = volumes.find(v => v.grupo === grupoPrimario);
            if (item) {
              item.series_efetivas++;
            }
          }
        }
      }
    }

    return volumes;
  } catch (error) {
    console.error('Erro no volumeSemanaPorGrupo:', error);
    return [];
  }
}

/**
 * Retorna a lista de sessões executadas, ordenadas por data desc, com resumo estruturado das métricas.
 */
export async function historicoSessoes(filtros?: {
  dataInicio?: string;
  dataFim?: string;
  concluida?: boolean;
}): Promise<SessaoComResumo[]> {
  try {
    let query = (supabase.from('registros_execucao' as any) as any)
      .select(`
        id,
        data_inicio,
        data_fim,
        duracao_seg,
        concluida,
        sessoes_template (
          id,
          nome,
          exercicios_prescritos (
            series_alvo
          )
        ),
        series_executadas (
          id,
          completada
        )
      `)
      .order('data_inicio', { ascending: false });

    if (filtros) {
      if (filtros.dataInicio) {
        query = query.gte('data_inicio', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        query = query.lte('data_inicio', filtros.dataFim);
      }
      if (filtros.concluida !== undefined) {
        query = query.eq('concluida', filtros.concluida);
      }
    }

    const { data, error } = await query as any;
    if (error) throw error;
    if (!data) return [];

    return data.map((reg: any) => {
      // Soma o total de séries prescritas na sessão original
      const seriesPrescritas = (reg.sessoes_template as any)?.exercicios_prescritos?.reduce(
        (sum: number, ep: any) => sum + (ep.series_alvo || 0),
        0
      ) || 0;

      // Soma o total de séries efetivamente completadas na execução real
      const seriesCompletas = reg.series_executadas?.filter((s: any) => s.completada !== false).length || 0;

      // Calcula o percentual de conclusão (evita divisão por zero)
      const percentual_conclusao = seriesPrescritas > 0
        ? Math.min(100, Math.round((seriesCompletas / seriesPrescritas) * 100))
        : (reg.concluida ? 100 : 0);

      return {
        id: reg.id,
        nome: (reg.sessoes_template as any)?.nome || 'Treino Avulso',
        data: reg.data_inicio,
        duracao_segundos: reg.duracao_seg || 0,
        series_totais: seriesCompletas,
        percentual_conclusao,
        concluida: reg.concluida || false,
      };
    });
  } catch (error) {
    console.error('Erro no historicoSessoes:', error);
    return [];
  }
}

/**
 * Retorna uma linha do tempo mostrando o progresso (exercício mais avançado) para um padrão de movimento específico.
 * Retorna uma lista agrupada por semana (segunda-feira).
 */
export async function linhaTempoPadraoMovimento(
  padraoMovimento: string
): Promise<{ semana: string; exercicio_mais_avancado_id: string; exercicio_nome: string; nivel_escada: number }[]> {
  try {
    const { data, error } = await (supabase.from('series_executadas' as any) as any)
      .select(`
        created_at,
        exercicios!inner (
          id,
          nome,
          padrao_movimento,
          nivel_escada
        ),
        registros_execucao!inner (
          data_inicio,
          concluida
        )
      `)
      .eq('exercicios.padrao_movimento', padraoMovimento)
      .eq('registros_execucao.concluida', true)
      .eq('completada', true) as any;

    if (error) throw error;
    if (!data) return [];

    const semanasMap: Record<string, { exercicio_mais_avancado_id: string; exercicio_nome: string; nivel_escada: number }> = {};

    for (const row of data) {
      const dataInicio = row.registros_execucao?.data_inicio || row.created_at;
      if (!dataInicio) continue;
      const semanaStr = obterSegundaFeira(dataInicio);

      const exercicio = row.exercicios as any;
      if (!exercicio) continue;

      const nivel = exercicio.nivel_escada || 1;

      // Mantém apenas o exercício de maior nível de escada executado naquela semana
      if (!semanasMap[semanaStr] || nivel > semanasMap[semanaStr].nivel_escada) {
        semanasMap[semanaStr] = {
          exercicio_mais_avancado_id: exercicio.id,
          exercicio_nome: exercicio.nome,
          nivel_escada: nivel,
        };
      }
    }

    return Object.entries(semanasMap)
      .map(([semana, val]) => ({
        semana,
        exercicio_mais_avancado_id: val.exercicio_mais_avancado_id,
        exercicio_nome: val.exercicio_nome,
        nivel_escada: val.nivel_escada,
      }))
      .sort((a, b) => a.semana.localeCompare(b.semana));
  } catch (error) {
    console.error('Erro no linhaTempoPadraoMovimento:', error);
    return [];
  }
}

/**
 * Retorna as estatísticas semanais consolidadas para as últimas 12 semanas (contando com a atual).
 */
export async function tendenciaSemanal(): Promise<{
  semana: string;
  total_series: number;
  total_tempo: number;
  sessoes_completas: number;
}[]> {
  try {
    const agora = new Date();
    const day = agora.getDay();
    const diff = agora.getDate() - day + (day === 0 ? -6 : 1);
    const segundaAtual = new Date(agora);
    segundaAtual.setDate(diff);
    segundaAtual.setHours(0, 0, 0, 0);

    const inicio = new Date(segundaAtual);
    inicio.setDate(segundaAtual.getDate() - 11 * 7); // 11 semanas atrás

    // Buscar registros concluídos no período
    const { data, error } = await (supabase.from('registros_execucao' as any) as any)
      .select(`
        data_inicio,
        duracao_seg,
        concluida,
        series_executadas (
          id,
          completada
        )
      `)
      .gte('data_inicio', inicio.toISOString())
      .eq('concluida', true) as any;

    if (error) throw error;

    // Inicializar as 12 semanas (ordem cronológica)
    const semanas: { semana: string; total_series: number; total_tempo: number; sessoes_completas: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i * 7);
      semanas.push({
        semana: d.toISOString().split('T')[0],
        total_series: 0,
        total_tempo: 0,
        sessoes_completas: 0,
      });
    }

    // Preenche os volumes de cada semana
    if (data) {
      for (const reg of data) {
        const semStr = obterSegundaFeira(reg.data_inicio);
        const semanaObj = semanas.find(s => s.semana === semStr);
        if (semanaObj) {
          semanaObj.sessoes_completas++;
          semanaObj.total_tempo += reg.duracao_seg || 0;
          const seriesCompletas = reg.series_executadas?.filter((s: any) => s.completada !== false).length || 0;
          semanaObj.total_series += seriesCompletas;
        }
      }
    }

    return semanas;
  } catch (error) {
    console.error('Erro no tendenciaSemanal:', error);
    return [];
  }
}

/**
 * Agrega KPIs gerais e recordes globais de treino para exibição nos painéis principais.
 */
export async function estatisticasGerais(): Promise<{
  total_treinos: number;
  total_series: number;
  total_tempo_horas: number;
  streak_maximo: number;
  conquistas_desbloqueadas: number;
}> {
  try {
    // 1. Obter treinos executados
    const { data: treinosData, error: treinosError } = await (supabase.from('registros_execucao' as any) as any)
      .select('duracao_seg')
      .eq('concluida', true) as any;

    if (treinosError) throw treinosError;

    const total_treinos = treinosData?.length || 0;
    const total_tempo_segundos = treinosData?.reduce((sum: number, r: any) => sum + (r.duracao_seg || 0), 0) || 0;
    const total_tempo_horas = Number((total_tempo_segundos / 3600).toFixed(1));

    // 2. Obter total de séries
    const { count: seriesCount, error: seriesError } = await (supabase.from('series_executadas' as any) as any)
      .select('*', { count: 'exact', head: true })
      .eq('completada', true) as any;

    if (seriesError) throw seriesError;
    const total_series = seriesCount || 0;

    // 3. Obter streak máximo (local com fallback Supabase)
    let streak_maximo = 0;
    try {
      const estadoGamificacaoLocal = await obterEstado();
      if (estadoGamificacaoLocal) {
        streak_maximo = estadoGamificacaoLocal.streak_maximo || 0;
      }
    } catch (e) {
      console.warn('Erro ao obter gamificação local, usando fallback Supabase:', e);
    }

    if (streak_maximo === 0) {
      const { data: gamificacaoData } = await (supabase.from('gamificacao' as any) as any)
        .select('maior_streak, streak_maximo')
        .limit(1) as any;

      streak_maximo = gamificacaoData?.[0]?.maior_streak ?? gamificacaoData?.[0]?.streak_maximo ?? 0;
    }

    // 4. Obter conquistas desbloqueadas
    const { count: conquistasCount, error: conquistasError } = await (supabase.from('conquistas_desbloqueadas' as any) as any)
      .select('*', { count: 'exact', head: true }) as any;

    if (conquistasError) throw conquistasError;
    const conquistas_desbloqueadas = conquistasCount || 0;

    return {
      total_treinos,
      total_series,
      total_tempo_horas,
      streak_maximo,
      conquistas_desbloqueadas,
    };
  } catch (error) {
    console.error('Erro no estatisticasGerais:', error);
    return {
      total_treinos: 0,
      total_series: 0,
      total_tempo_horas: 0,
      streak_maximo: 0,
      conquistas_desbloqueadas: 0,
    };
  }
}
