import { Perfil, Nivel } from '../types/perfil';
import { Exercicio, PadraoMovimento, NivelMinimo } from '../types/exercicio';
import { ProgramaAtivo, SessaoTemplate, ExercicioPrescrito } from '../types/treino';
import { filtrarExerciciosElegiveis, resgatarExercicioDeBaixoEstresse, ExercicioElegivel } from './filtro-restricoes';
import { validarEJustarVolume } from './calculadora-volume';

/**
 * Gera um UUID v4 puro em TypeScript sem dependências externas.
 */
function gerarUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mapeamento de score de nível para determinação do nível de escada
 */
const SCORE_NIVEL: Record<string, number> = {
  iniciante: 1,
  intermediario_retornando: 1,
  intermediario: 2,
  avancado: 3,
};

/**
 * Função determinística principal para gerar um programa de hipertrofia semanal científico.
 */
export function gerarProgramaSemanal(
  perfil: Perfil,
  catalogoExercicios: Exercicio[]
): ProgramaAtivo {
  // PASSO 1 — Determinar Split
  const split = determinarSplit(perfil.dias_disponiveis_semana);

  // PASSO 2 — Determinar Volume Alvo Semanal por grupo muscular baseado no nível
  const volumeAlvoGrupo = determinarVolumeAlvo(perfil.nivel);

  // PASSO 3 — Filtrar Catálogo por Restrições
  const exerciciosElegiveis = filtrarExerciciosElegiveis(catalogoExercicios, perfil);

  // PASSO 4 — Distribuir Padrões de Movimento pela Semana
  const estruturaSessoes = obterEstruturaSessoes(split);

  // PASSO 5 & 6 — Selecionar Exercícios Concretos e Configurar Prescrição
  const sessoesTemplate = construirSessoes(
    estruturaSessoes,
    exerciciosElegiveis,
    catalogoExercicios,
    perfil
  );

  // PASSO 7 — Validar Cobertura Final de volume e ajustar dinamicamente
  const sessoesValidadas = validarEJustarVolume(sessoesTemplate, volumeAlvoGrupo, perfil, catalogoExercicios);

  const programaId = gerarUUID();

  // Mapeia as sessões para a estrutura final ajustando IDs e aliases
  const sessoesFormatadas = sessoesValidadas.map((sessao, index) => {
    const sId = gerarUUID();
    return {
      ...sessao,
      id: sId,
      programa_id: programaId,
      ordem_na_semana: index + 1,
      // Garante retrocompatibilidade com ambas as assinaturas do template
      exercicios_prescritos: sessao.exercicios_prescritos.map((ep, i) => ({
        ...ep,
        id: gerarUUID(),
        ordem: i + 1,
      })),
      exercicios: sessao.exercicios_prescritos.map((ep, i) => ({
        ...ep,
        id: gerarUUID(),
        ordem: i + 1,
      })),
    };
  });

  return {
    id: programaId,
    nome: `Hipertrofia Baseada em Ciência - ${split.toUpperCase()}`,
    split_tipo: split,
    split: split, // Alias
    sessoes: sessoesFormatadas,
    sessoes_template: sessoesFormatadas, // Alias
    data_inicio: new Date().toISOString().split('T')[0],
    semana_atual: 1,
  };
}

/**
 * PASSO 1: Determina o tipo de split com base nos dias disponíveis
 */
function determinarSplit(diasDisponiveis: number): 'full_body' | 'upper_lower' | 'push_pull_legs' {
  if (diasDisponiveis === 3) return 'full_body';
  if (diasDisponiveis === 4) return 'upper_lower';
  if (diasDisponiveis === 6) return 'push_pull_legs';
  
  if (diasDisponiveis < 3) return 'full_body';
  return 'push_pull_legs';
}

/**
 * PASSO 2: Determina o volume de séries semanais alvo por grupo muscular principal
 */
function determinarVolumeAlvo(nivel: Nivel): number {
  switch (nivel) {
    case Nivel.INICIANTE:
    case Nivel.INTERMEDIARIO_RETORNANDO:
      return 8; // MEV conservador (6-10 séries)
    case Nivel.INTERMEDIARIO:
      return 12; // MAV intermediário (10-16 séries)
    case Nivel.AVANCADO:
      return 16; // MAV avançado (12-20 séries)
    default:
      return 8;
  }
}

interface EstruturaSessao {
  nome: string;
  diaReferencia: string;
  padroes: PadraoMovimento[];
}

/**
 * PASSO 4: Define a distribuição semanal de padrões de movimento conforme o split
 */
function obterEstruturaSessoes(split: 'full_body' | 'upper_lower' | 'push_pull_legs'): EstruturaSessao[] {
  switch (split) {
    case 'full_body':
      return [
        {
          nome: 'Full Body A',
          diaReferencia: 'Segunda-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Full Body B',
          diaReferencia: 'Quarta-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.PANTURRILHA,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Full Body C',
          diaReferencia: 'Sexta-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.CORE,
          ],
        },
      ];

    case 'upper_lower':
      return [
        {
          nome: 'Upper A',
          diaReferencia: 'Segunda-feira',
          padroes: [
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.PUSH_HORIZONTAL, // Segundo exercício para volume eficaz
            PadraoMovimento.PULL_HORIZONTAL, // Segundo exercício para volume eficaz
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Lower A',
          diaReferencia: 'Terça-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.JOELHO_DOMINANTE, // Segundo exercício
            PadraoMovimento.QUADRIL_DOMINANTE, // Segundo exercício
            PadraoMovimento.PANTURRILHA,
          ],
        },
        {
          nome: 'Upper B',
          diaReferencia: 'Quinta-feira',
          padroes: [
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Lower B',
          diaReferencia: 'Sexta-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.PANTURRILHA,
          ],
        },
      ];

    case 'push_pull_legs':
      return [
        {
          nome: 'Push A',
          diaReferencia: 'Segunda-feira',
          padroes: [
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Pull A',
          diaReferencia: 'Terça-feira',
          padroes: [
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.PULL_VERTICAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Legs A',
          diaReferencia: 'Quarta-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.PANTURRILHA,
          ],
        },
        {
          nome: 'Push B',
          diaReferencia: 'Quinta-feira',
          padroes: [
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.PUSH_HORIZONTAL,
            PadraoMovimento.PUSH_VERTICAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Pull B',
          diaReferencia: 'Sexta-feira',
          padroes: [
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.PULL_VERTICAL,
            PadraoMovimento.PULL_HORIZONTAL,
            PadraoMovimento.CORE,
          ],
        },
        {
          nome: 'Legs B',
          diaReferencia: 'Sábado-feira',
          padroes: [
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.JOELHO_DOMINANTE,
            PadraoMovimento.QUADRIL_DOMINANTE,
            PadraoMovimento.PANTURRILHA,
          ],
        },
      ];
  }
}

/**
 * PASSO 5 & 6: Constrói as sessões de treino selecionando exercícios do catálogo e configurando prescrições
 */
function construirSessoes(
  estruturaSessoes: EstruturaSessao[],
  exerciciosElegiveis: ExercicioElegivel[],
  catalogoExercicios: Exercicio[],
  perfil: Perfil
): SessaoTemplate[] {
  const sessoes: SessaoTemplate[] = [];
  const exerciciosSelecionadosNaSemana = new Set<string>();

  for (const estrut of estruturaSessoes) {
    const prescritos: ExercicioPrescrito[] = [];
    let ordem = 1;

    // Acompanha a contagem do mesmo padrão na sessão atual para evitar repetir o exato mesmo exercício na mesma sessão
    const padroesNaSessao: Record<string, number> = {};

    for (const padrao of estrut.padroes) {
      padroesNaSessao[padrao] = (padroesNaSessao[padrao] || 0) + 1;
      const indiceDoPadrao = padroesNaSessao[padrao];

      // Busca todos os elegíveis daquele padrão
      let candidatos = exerciciosElegiveis.filter(e => e.padrao_movimento === padrao);

      // PASSO 5.b: Filtragem e ordenação por nível de escada recomendado
      // iniciante: 1-2, intermediário: 2-3, avançado: 3-4
      const nivelUserVal = SCORE_NIVEL[perfil.nivel] || 1;
      let minEscada = 1;
      let maxEscada = 2;
      if (nivelUserVal === 2) {
        minEscada = 2;
        maxEscada = 3;
      } else if (nivelUserVal === 3) {
        minEscada = 3;
        maxEscada = 5;
      }

      // Ordenar candidatos dando preferência para os exercícios na faixa ideal de escada
      candidatos.sort((a, b) => {
        const aNaFaixa = a.nivel_escada >= minEscada && a.nivel_escada <= maxEscada;
        const bNaFaixa = b.nivel_escada >= minEscada && b.nivel_escada <= maxEscada;

        if (aNaFaixa !== bNaFaixa) {
          return aNaFaixa ? -1 : 1; // Prioriza a faixa ideal
        }
        return b.nivel_escada - a.nivel_escada; // Se ambos na faixa, ordena pelo maior nível de escada
      });

      // PASSO 5.c: Evitar monotonia - tentar selecionar uma variação ainda não utilizada na semana
      let selecionado: ExercicioElegivel | null = null;

      // Primeiro, tenta buscar um que não tenha sido usado na semana e que não seja igual ao já colocado nesta sessão
      const naoUsadosNaSemana = candidatos.filter(e => !exerciciosSelecionadosNaSemana.has(e.id));
      
      if (naoUsadosNaSemana.length >= indiceDoPadrao) {
        selecionado = naoUsadosNaSemana[indiceDoPadrao - 1] || naoUsadosNaSemana[0];
      } else if (candidatos.length > 0) {
        // Se todas as variações acabaram, repetimos candidatos
        const outrosNaoNaSessao = candidatos.filter(e => !prescritos.some(p => p.exercicio_id === e.id));
        selecionado = outrosNaoNaSessao[0] || candidatos[0];
      }

      // LÓGICA DE FALLBACK (Edge Case 1)
      let substituidoPorRestricao = false;
      let exercicioIdealId: string | null = null;

      if (!selecionado) {
        // Tenta resgatar um exercício de baixíssimo estresse do catálogo completo
        const resgatado = resgatarExercicioDeBaixoEstresse(exerciciosElegiveis, perfil, padrao);
        if (resgatado) {
          selecionado = resgatado;
          substituidoPorRestricao = true;
          
          // Encontra o exercício "ideal" que seria selecionado se não houvesse nenhuma restrição
          const ideais = exerciciosElegiveis.filter(e => e.padrao_movimento === padrao);
          exercicioIdealId = ideais[0]?.id || null;
        }
      }

      // Se conseguirmos um exercício (elegível padrão ou resgatado)
      if (selecionado) {
        exerciciosSelecionadosNaSemana.add(selecionado.id);

        // PASSO 6: Configurar prescrição científica
        // series_alvo: 3 para compostos primários, 2 para acessórios (core/panturrilha ou secundários)
        const isAcessorio = padrao === PadraoMovimento.CORE || padrao === PadraoMovimento.PANTURRILHA || indiceDoPadrao > 1;
        const seriesAlvo = isAcessorio ? 2 : 3;

        // reps_alvo_min e reps_alvo_max recomendadas
        const repsMin = selecionado.faixa_reps_recomendada?.min || 8;
        const repsMax = selecionado.faixa_reps_recomendada?.max || 12;

        // descanso científico: 120s para compostos primários (Schoenfeld et al. 2016), 60s para isolados/acessórios
        const descansoSeg = selecionado.descanso_recomendado_seg || (isAcessorio ? 60 : 120);

        // Notas de execução, incluindo cadência científica focando na fase excêntrica alongada (Maeo et al. 2021)
        const cadencia = selecionado.cadencia_recomendada || { excentrica: 3, isometrica: 1, concentrica: 1 };
        const notaCadencia = `Realize a fase de descida (excêntrica) em ${cadencia.excentrica}s de forma controlada, segurando ${cadencia.isometrica}s na posição de máximo alongamento.`;
        
        let notaPrescricao = notaCadencia;
        if (substituidoPorRestricao) {
          notaPrescricao = `⚠️ [Adaptado] Exercício de baixo impacto articular recomendado devido a restrições de mobilidade ou desconforto.\n${notaPrescricao}`;
        }

        prescritos.push({
          id: gerarUUID(),
          exercicio_id: selecionado.id,
          ordem: ordem++,
          series_alvo: seriesAlvo,
          reps_alvo_min: repsMin,
          reps_alvo_max: repsMax,
          rir_alvo: 2, // RIR 2 nas primeiras séries, instruído a falhar na última via notas
          descanso_segundos: descansoSeg,
          substituido_por_restricao: substituidoPorRestricao,
          exercicio_ideal_id: exercicioIdealId,
          notas: notaPrescricao,
        });
      } else {
        // Se mesmo com fallback não foi encontrado nenhum exercício para o padrão (equipamentos ou restrições extremas),
        // sinalizamos o usuário na descrição da sessão que o padrão não pôde ser coberto de forma segura.
        prescritos.push({
          id: gerarUUID(),
          exercicio_id: `sem_opcao_${padrao}`,
          ordem: ordem++,
          series_alvo: 0,
          reps_alvo_min: 0,
          reps_alvo_max: 0,
          rir_alvo: 0,
          descanso_segundos: 0,
          notas: `⚠️ Não foi possível encontrar um exercício seguro para o padrão '${padrao}' que respeite suas restrições articulares e equipamentos disponíveis.`,
        });
      }
    }

    // Ordena os exercícios: compostos primários primeiro, seguidos de acessórios e core no final
    prescritos.sort((a, b) => {
      const getScorePadrao = (exercicioId: string) => {
        // Extrai o padrão do exercício real ou da flag sem_opcao
        const exId = exercicioId.startsWith('sem_opcao_') ? exercicioId.replace('sem_opcao_', '') : exercicioId;
        const ex = exerciciosElegiveis.find(e => e.id === exId) || catalogoExercicios.find(e => e.id === exId);
        if (!ex) return 10;

        const p = ex.padrao_movimento;
        if (p === PadraoMovimento.CORE) return 3; // Core por último
        if (p === PadraoMovimento.PANTURRILHA) return 2; // Panturrilhas antes do core
        return 1; // Compostos principais primeiro
      };

      return getScorePadrao(a.exercicio_id) - getScorePadrao(b.exercicio_id);
    });

    // Reajusta o índice final de ordem após ordenação
    prescritos.forEach((p, idx) => {
      p.ordem = idx + 1;
    });

    sessoes.push({
      id: gerarUUID(),
      nome: estrut.nome,
      descricao: `Sessão voltada para hipertrofia científica. Foco na tensão mecânica e excelente amplitude de movimento.`,
      ordem_na_semana: sessoes.length + 1,
      dia_da_semana: estrut.diaReferencia,
      exercicios_prescritos: prescritos,
      exercicios: prescritos, // Alias
    });
  }

  return sessoes;
}
