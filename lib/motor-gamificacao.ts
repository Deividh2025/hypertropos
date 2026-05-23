import { Conquista, EstadoSilhueta, Gamificacao } from '../types/gamificacao';
import { RegistroSessao, SerieExecutada } from '../types/treino';
import { Perfil } from '../types/perfil';
import { CATALOGO_CONQUISTAS } from '../constants/conquistas';
import { obterEstado } from '../db/queries/gamificacao';
import { obterPerfil } from '../db/queries/perfil';
import { calcularEstadoSilhueta, detectarTransicaoTier } from './motor-silhueta';
import { executarQuery, obterLinhas } from '../db/local-cache';
import { enqueueChange } from '../db/sync-engine';

export interface ResultadoPosSessao {
  xp_ganho: number;
  novo_nivel: number | null;
  streak_novo: number;
  conquistas_desbloqueadas: Conquista[];
  tier_transicao: { tier_antigo: 'bronze' | 'pedra' | 'marmore' | 'dourada'; tier_novo: 'bronze' | 'pedra' | 'marmore' | 'dourada' } | null;
  silhueta_atualizada: EstadoSilhueta;
}

/**
 * Motor 2.0 — Orquestrador do Sistema Dopaminérgico do Hypertropos.
 * Processa o pós-treino científico e calcula todos os ganhos reativos locais.
 */
export async function processarPosSessao(
  perfilId: string = 'default',
  registroSessaoId: string,
  modoExpress: boolean,
  seriesExecutadas: { exercicio_id: string; reps_executadas: number; rir_realizado: number; rir_alvo: number }[]
): Promise<ResultadoPosSessao> {
  // 1. Obter estado atual do Perfil e Gamificação do banco local SQLite
  const perfil = await obterPerfil() || { id: perfilId, split_atual: 'full_body' } as Perfil;
  
  // Obter ou inicializar gamificação
  let estadoGamificacao = await obterEstado();
  if (!estadoGamificacao) {
    estadoGamificacao = {
      id: perfilId,
      xp_total: 0,
      nivel_atual: 1,
      streak_atual: 0,
      streak_maximo: 0,
      freezes_disponiveis: 2,
      ultima_atividade: new Date().toISOString()
    };
  }

  // 2. CALCULAR XP DA SESSÃO
  // - Completar sessão: +50 XP base (normal) ou +20 XP (express)
  const xpBaseSessao = modoExpress ? 20 : 50;
  // - Completar série: 10 XP base cada
  const xpSeries = seriesExecutadas.length * 10;
  // - Atingir RIR alvo ou falha (<= alvo): +5 XP bônus cada
  const xpRir = seriesExecutadas.filter(s => s.rir_realizado <= s.rir_alvo).length * 5;
  
  // Calculamos novo streak primeiro para saber o bônus de consistência
  const streakNovo = estadoGamificacao.streak_atual + 1;
  // - Manter streak: +10 XP por dia consecutivo (máximo +50/dia)
  const xpStreakBonus = Math.min(50, streakNovo * 10);

  const totalXPGanho = xpBaseSessao + xpSeries + xpRir + xpStreakBonus;
  
  // 3. ATUALIZAR NÍVEL (Curva Logarítmica)
  // Cada nível requer progresivamente mais XP.
  // Usamos uma curva logarítmica clássica: nivel = Math.floor(1 + Math.log2(xp_total / 100 + 1))
  // Para manter compatibilidade com db simplificado (+100xp/nivel), usamos a fórmula da query ou uma mais robusta
  const xpAntigo = estadoGamificacao.xp_total;
  const xpNovo = xpAntigo + totalXPGanho;
  const nivelAntigo = estadoGamificacao.nivel_atual;
  
  // Fórmula de curva logarítmica calibrada do Hypertropos
  // Nível 1: 0 - 100 XP
  // Nível 2: 100 - 300 XP
  // Nível 3: 300 - 600 XP (incrementos de 100, 200, 300, 400...)
  // Formula: XP acumulado para nível N = 50 * (N-1) * N
  const calcularNivelDeXP = (xp: number): number => {
    let lvl = 1;
    while (50 * lvl * (lvl + 1) <= xp) {
      lvl++;
    }
    return lvl;
  };
  
  const nivelNovo = calcularNivelDeXP(xpNovo);
  const subiuNivel = nivelNovo > nivelAntigo ? nivelNovo : null;

  // 4. ATUALIZAR STREAK E HISTÓRICO
  const streakMaxNovo = Math.max(streakNovo, estadoGamificacao.streak_maximo);
  const novaUltimaAtividade = new Date().toISOString();

  // Salvar novo estado de gamificação
  const novaGamificacao: Gamificacao = {
    ...estadoGamificacao,
    xp_total: xpNovo,
    nivel_atual: nivelNovo,
    streak_atual: streakNovo,
    streak_maximo: streakMaxNovo,
    ultima_atividade: novaUltimaAtividade
  };

  await executarQuery(`
    INSERT OR REPLACE INTO gamificacao (
      id, xp_total, nivel_atual, streak_atual, streak_maximo, freezes_disponiveis, ultima_atividade
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    novaGamificacao.id, novaGamificacao.xp_total, novaGamificacao.nivel_atual,
    novaGamificacao.streak_atual, novaGamificacao.streak_maximo,
    novaGamificacao.freezes_disponiveis, novaGamificacao.ultima_atividade
  ]);
  await enqueueChange('gamificacao', 'UPDATE', novaGamificacao);

  // 5. CALCULAR SILHUETA E TIER
  // Carrega histórico completo de treinos para reavaliação científica
  const queryHistorico = `
    SELECT id, sessao_template_id, perfil_id, data_inicio, data_fim, duracao_seg, xp_ganho, concluida
    FROM registros_execucao WHERE perfil_id = ? AND concluida = 1
  `;
  const linhasHistorico = await obterLinhas<any>(queryHistorico, [perfilId]);
  
  // Adiciona a sessão atual que acabamos de fazer na lista se ela ainda não estiver salva fisicamente
  if (!linhasHistorico.some(h => h.id === registroSessaoId)) {
    linhasHistorico.push({
      id: registroSessaoId,
      perfil_id: perfilId,
      data_inicio: new Date().toISOString(),
      concluida: true
    });
  }

  // Mapeamos linhas para RegistroSessao
  const historicoSessoes: RegistroSessao[] = linhasHistorico.map(l => ({
    id: l.id,
    sessao_template_id: l.sessao_template_id || '',
    perfil_id: l.perfil_id,
    data_inicio: l.data_inicio,
    data_fim: l.data_fim || l.data_inicio,
    duracao_seg: l.duracao_seg || 0,
    xp_ganho: l.xp_ganho || 0,
    concluida: l.concluida === 1 || l.concluida === true,
    exercicios_realizados: [] // será populado pelo motor se necessário
  }));

  // Puxa o tier antigo da silhueta antes da reavaliação
  const estadoSilhuetaAntigo = await obterLinhas<any>('SELECT * FROM estado_silhueta WHERE id = ?', [perfilId]);
  const tierAntigo = estadoSilhuetaAntigo[0]?.tier_atual || 'bronze';

  // Calcula novo estado da silhueta
  const silhuetaNova = await calcularEstadoSilhueta(historicoSessoes, perfil);
  
  // Salva no banco a nova silhueta
  await executarQuery(`
    INSERT OR REPLACE INTO estado_silhueta (
      id, peito, costas, ombros, bracos, quadriceps, posterior, gluteo, panturrilha, core, tier_atual, ultima_atualizacao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    perfilId,
    silhuetaNova.peito, silhuetaNova.costas, silhuetaNova.ombros, silhuetaNova.bracos,
    silhuetaNova.quadriceps, silhuetaNova.posterior, silhuetaNova.gluteo, silhuetaNova.panturrilha,
    silhuetaNova.core, silhuetaNova.tier_atual, silhuetaNova.ultima_atualizacao
  ]);
  await enqueueChange('estado_silhueta', 'UPDATE', silhuetaNova);

  // Verifica transição de tier
  const tierNovo = silhuetaNova.tier_atual;
  const transicaoDetectada = detectarTransicaoTier(tierAntigo, tierNovo);
  const tierTransicaoObj = transicaoDetectada ? { tier_antigo: tierAntigo, tier_novo: tierNovo } : null;

  // 6. DETECTAR NOVAS CONQUISTAS DESBLOQUEADAS
  // Puxa id de conquistas que o usuário já desbloqueou no passado
  const conquistasJaDesbloqueadasRows = await obterLinhas<{ conquista_id: string }>(
    'SELECT conquista_id FROM conquistas_desbloqueadas'
  );
  const idsJaDesbloqueados = new Set(conquistasJaDesbloqueadasRows.map(r => r.conquista_id));
  
  const novasConquistasDesbloqueadas: Conquista[] = [];

  // Verificações automáticas baseadas em regras de negócio para desbloquear
  const tentarDesbloquear = async (conquistaId: string) => {
    if (idsJaDesbloqueados.has(conquistaId)) return;

    const conquistaInfo = CATALOGO_CONQUISTAS.find(c => c.id === conquistaId);
    if (!conquistaInfo) return;

    const idUnico = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const dataIso = new Date().toISOString();

    // Insere localmente
    await executarQuery(
      'INSERT INTO conquistas_desbloqueadas (id, conquista_id, desbloqueada_em) VALUES (?, ?, ?)',
      [idUnico, conquistaId, dataIso]
    );

    await enqueueChange('conquistas_desbloqueadas', 'INSERT', {
      id: idUnico,
      conquista_id: conquistaId,
      desbloqueada_em: dataIso
    });

    novasConquistasDesbloqueadas.push({
      ...conquistaInfo,
      desbloqueada_em: dataIso
    });
  };

  // Regra 1: Primeira Suada (Primeiro treino concluído)
  if (historicoSessoes.length >= 1) {
    await tentarDesbloquear('primeiro_treino');
  }

  // Regra 2: Consistência Inicial (1 semana completa)
  if (historicoSessoes.length >= 3) { // Supondo split de 3 dias/semana
    await tentarDesbloquear('primeira_semana');
  }

  // Regra 3: Hábito Formado (1 mês)
  if (historicoSessoes.length >= 12) {
    await tentarDesbloquear('primeiro_mes');
  }

  // Regra 4: Estreak de 7 dias
  if (streakNovo >= 7) {
    await tentarDesbloquear('streak_7');
  }

  // Regra 5: Estreak de 30 dias
  if (streakNovo >= 30) {
    await tentarDesbloquear('streak_30');
  }

  // Regra 6: Tiers da Estátua
  if (tierNovo === 'pedra') await tentarDesbloquear('tier_pedra');
  if (tierNovo === 'marmore') await tentarDesbloquear('tier_marmore');
  if (tierNovo === 'dourada') await tentarDesbloquear('tier_dourada');

  // Regra 7: Treino Adaptado (se houver restrições no perfil)
  if (perfil.restricoes_articulares && JSON.parse(typeof perfil.restricoes_articulares === 'string' ? perfil.restricoes_articulares : '[]').length > 0) {
    await tentarDesbloquear('treino_adaptado');
  }

  // Regra 8: Níveis de XP altos
  if (nivelNovo >= 50) await tentarDesbloquear('nivel_50');
  if (nivelNovo >= 100) await tentarDesbloquear('nivel_100');

  // Regras de contador de repetições / séries
  let repsTotaisPeitoOuFlexoes = 0;
  let repsTotaisAgachamentos = 0;
  seriesExecutadas.forEach(s => {
    // Nós não temos o padrão exato ou grupo no objeto simple de séries, mas se soubermos o id do exercício:
    if (s.exercicio_id.includes('push') || s.exercicio_id.includes('flexao')) {
      repsTotaisPeitoOuFlexoes += s.reps_executadas;
    }
    if (s.exercicio_id.includes('squat') || s.exercicio_id.includes('agachamento') || s.exercicio_id.includes('lunge') || s.exercicio_id.includes('passada')) {
      repsTotaisAgachamentos += s.reps_executadas;
    }
  });

  if (repsTotaisPeitoOuFlexoes >= 100) {
    await tentarDesbloquear('cem_flexoes');
  }
  if (repsTotaisAgachamentos >= 200) {
    await tentarDesbloquear('duzentos_agachamentos');
  }

  // Se usou express no treino de hoje e temos histórico recente de express
  if (modoExpress) {
    // Supondo verificar se usou express 3x na semana (esse contador pode ser incrementado)
    await tentarDesbloquear('express_trio');
  }

  return {
    xp_ganho: totalXPGanho,
    novo_nivel: subiuNivel,
    streak_novo: streakNovo,
    conquistas_desbloqueadas: novasConquistasDesbloqueadas,
    tier_transicao: tierTransicaoObj as any,
    silhueta_atualizada: silhuetaNova
  };
}

/**
 * Retorna as conquistas desbloqueadas do usuário mapeadas com seus dados estáticos do catálogo.
 */
export async function obterConquistasUsuario(): Promise<Conquista[]> {
  try {
    const rows = await obterLinhas<{ conquista_id: string; desbloqueada_em: string }>(
      'SELECT conquista_id, desbloqueada_em FROM conquistas_desbloqueadas'
    );
    
    return CATALOGO_CONQUISTAS.map(conquista => {
      const row = rows.find(r => r.conquista_id === conquista.id);
      if (row) {
        return {
          ...conquista,
          desbloqueada_em: row.desbloqueada_em
        };
      }
      return conquista;
    });
  } catch (error) {
    console.error('Erro ao obter conquistas do usuário no motor:', error);
    return CATALOGO_CONQUISTAS;
  }
}
