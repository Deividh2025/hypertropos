import { Perfil, Nivel } from '../types/perfil';
import { Exercicio, Equipamento, Articulacao, NivelEstresse, PadraoMovimento } from '../types/exercicio';

export interface ExercicioElegivel extends Exercicio {
  original_id: string;
}

const MAPA_NIVEL: Record<string, number> = {
  iniciante: 1,
  intermediario_retornando: 1,
  intermediario: 2,
  avancado: 3,
};

/**
 * Filtra os exercícios elegíveis para o perfil do usuário respeitando:
 * 1. Nível mínimo de treino
 * 2. Equipamentos disponíveis
 * 3. Restrições articulares e severidades
 * 4. Contraindicações explícitas
 * 
 * Cientificamente balanceado para maximizar a segurança articular.
 */
export function filtrarExerciciosElegiveis(
  catalogo: Exercicio[],
  perfil: Perfil
): ExercicioElegivel[] {
  const elegiveis: ExercicioElegivel[] = [];

  for (const exercicio of catalogo) {
    if (exercicioPassaFiltros(exercicio, perfil)) {
      elegiveis.push({
        ...exercicio,
        original_id: exercicio.id,
      });
    }
  }

  return elegiveis;
}

/**
 * Função interna para validar se um único exercício passa em todos os filtros regulatórios
 */
function exercicioPassaFiltros(exercicio: Exercicio, perfil: Perfil): boolean {
  // a. Filtragem por Nível de Treino
  const nivelUsuario = MAPA_NIVEL[perfil.nivel] || 1;
  const nivelExercicio = MAPA_NIVEL[exercicio.nivel_minimo] || 1;
  if (nivelExercicio > nivelUsuario) {
    return false; // Exercício muito avançado para o perfil atual
  }

  // b. Filtragem por Equipamentos Disponíveis
  const equipDisponivel = perfil.equipamento_disponivel || [];
  const equipNecessario = exercicio.equipamento_necessario || [];
  
  const reqsFiltrados = equipNecessario.filter(e => e !== Equipamento.NENHUM);
  if (reqsFiltrados.length > 0) {
    const temTodos = reqsFiltrados.every(e => equipDisponivel.includes(e));
    if (!temTodos) {
      return false; // Usuário não possui todos os equipamentos necessários
    }
  }

  // c e d. Filtragem por Restrições Articulares e Contraindicações
  const restricoes = perfil.restricoes_articulares || [];
  
  for (const restricao of restricoes) {
    const { articulacao, nivel_severidade } = restricao;

    // d. Contraindicações explícitas (qualquer severidade elimina imediatamente)
    const contraindicado = exercicio.contraindicacoes?.includes(articulacao);
    if (contraindicado) {
      return false;
    }

    // c. Regras de Severidade de estresse articular
    const estresseMap = exercicio.nivel_estresse_por_articulacao || {};
    const estresseArticulacao = estresseMap[articulacao];

    if (estresseArticulacao) {
      if (nivel_severidade === NivelEstresse.BAIXO) {
        // "leve": permite baixo e medio, elimina alto
        if (estresseArticulacao === NivelEstresse.ALTO) {
          return false;
        }
      } else if (nivel_severidade === NivelEstresse.MEDIO) {
        // "moderada": permite apenas baixo, elimina medio e alto
        if (estresseArticulacao === NivelEstresse.MEDIO || estresseArticulacao === NivelEstresse.ALTO) {
          return false;
        }
      } else if (nivel_severidade === NivelEstresse.ALTO) {
        // "alta": permite apenas baixo, elimina medio e alto
        if (estresseArticulacao === NivelEstresse.MEDIO || estresseArticulacao === NivelEstresse.ALTO) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * LÓGICA DE FALLBACK (Edge Case 1) - Resgatar exercício de menor estresse
 * Se para um padrão de movimento não houver nenhum exercício elegível, o algoritmo tenta resgatar
 * uma opção segura (baixo/nenhum estresse e compatível com equipamentos), mesmo que viole a restrição de nível.
 */
export function resgatarExercicioDeBaixoEstresse(
  catalogo: Exercicio[],
  perfil: Perfil,
  padrao: PadraoMovimento
): ExercicioElegivel | null {
  const candidatos = catalogo.filter(e => e.padrao_movimento === padrao);
  if (candidatos.length === 0) return null;

  // Filtrar apenas pelos equipamentos que o usuário possui
  const equipDisponivel = perfil.equipamento_disponivel || [];
  const compativeisEquip = candidatos.filter(exercicio => {
    const equipNecessario = exercicio.equipamento_necessario || [];
    const reqsFiltrados = equipNecessario.filter(e => e !== Equipamento.NENHUM);
    return reqsFiltrados.length === 0 || reqsFiltrados.every(e => equipDisponivel.includes(e));
  });

  if (compativeisEquip.length === 0) return null;

  const restricoes = perfil.restricoes_articulares || [];

  // Avalia o estresse de cada exercício nas articulações restritas do usuário
  // e calcula um score de estresse acumulado.
  // menor score = menor estresse
  const scored = compativeisEquip.map(exercicio => {
    let score = 0;
    let contraindicado = false;

    for (const restricao of restricoes) {
      const { articulacao } = restricao;
      
      // Contraindicações absolutas ainda devem ser respeitadas se possível
      if (exercicio.contraindicacoes?.includes(articulacao)) {
        contraindicado = true;
      }

      const estresseMap = exercicio.nivel_estresse_por_articulacao || {};
      const estresse = estresseMap[articulacao];

      if (estresse === NivelEstresse.ALTO) score += 10;
      else if (estresse === NivelEstresse.MEDIO) score += 5;
      else if (estresse === NivelEstresse.BAIXO) score += 1;
      
      // Se a articulação está explicitamente listada como estressada
      if (exercicio.articulacoes_estressadas?.includes(articulacao)) {
        score += 2;
      }
    }

    return { exercicio, score, contraindicado };
  });

  // Ordena prioritariamente por não contraindicados e menor score de estresse
  scored.sort((a, b) => {
    if (a.contraindicado !== b.contraindicado) {
      return a.contraindicado ? 1 : -1;
    }
    return a.score - b.score;
  });

  if (scored.length > 0) {
    const melhor = scored[0].exercicio;
    return {
      ...melhor,
      original_id: melhor.id,
    };
  }

  return null;
}
