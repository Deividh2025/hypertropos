import { SessaoTemplate, ExercicioPrescrito } from '../types/treino';
import { Exercicio, GrupoMuscular } from '../types/exercicio';
import { Perfil, Nivel } from '../types/perfil';

/**
 * Calcula o total de séries semanais acumuladas por grupo muscular principal.
 * Conta 100% (1.0) para o grupo muscular primário de cada exercício.
 */
export function calcularVolumeSemanal(
  sessoes: SessaoTemplate[],
  catalogoMap: Map<string, Exercicio>
): Record<GrupoMuscular, number> {
  const volumes: Record<GrupoMuscular, number> = {
    [GrupoMuscular.PEITO]: 0,
    [GrupoMuscular.COSTAS]: 0,
    [GrupoMuscular.OMBROS]: 0,
    [GrupoMuscular.TRICEPS]: 0,
    [GrupoMuscular.BICEPS]: 0,
    [GrupoMuscular.QUADRICEPS]: 0,
    [GrupoMuscular.POSTERIOR]: 0,
    [GrupoMuscular.GLUTEO]: 0,
    [GrupoMuscular.PANTURRILHA]: 0,
    [GrupoMuscular.CORE]: 0,
  };

  for (const sessao of sessoes) {
    const exercicios = sessao.exercicios_prescritos || [];
    for (const ep of exercicios) {
      const exercicioInfo = catalogoMap.get(ep.exercicio_id);
      if (exercicioInfo) {
        const primario = exercicioInfo.grupo_muscular_primario;
        if (primario in volumes) {
          volumes[primario] += ep.series_alvo;
        }
      }
    }
  }

  return volumes;
}

/**
 * PASSO 7: Valida se o volume mínimo semanal (MEV) foi atingido para todos os grupos principais.
 * Se houver deficiências de volume, tenta compensar adicionando séries aos exercícios existentes
 * (até o limite seguro de 4 séries por composto). Se ainda assim não for possível por restrições severas,
 * insere notas de observação no programa.
 */
export function validarEJustarVolume(
  sessoes: SessaoTemplate[],
  volumeAlvoSemanal: number,
  perfil: Perfil,
  catalogoExercicios: Exercicio[]
): SessaoTemplate[] {
  // Criar mapa do catálogo para acesso rápido O(1)
  const catalogoMap = new Map<string, Exercicio>();
  for (const ex of catalogoExercicios) {
    catalogoMap.set(ex.id, ex);
  }

  // Grupos musculares principais que exigem verificação estrita de MEV
  const gruposPrincipais = [
    GrupoMuscular.PEITO,
    GrupoMuscular.COSTAS,
    GrupoMuscular.QUADRICEPS,
    GrupoMuscular.POSTERIOR,
  ];

  let volumesAtuais = calcularVolumeSemanal(sessoes, catalogoMap);

  // Tenta compensar dinamicamente caso o volume esteja abaixo do recomendado
  for (const grupo of gruposPrincipais) {
    let volumeAtual = volumesAtuais[grupo];
    
    if (volumeAtual < volumeAlvoSemanal) {
      const deficit = volumeAlvoSemanal - volumeAtual;
      let compensado = 0;

      // Iterar pelas sessões e exercícios para encontrar onde podemos adicionar séries com segurança
      for (const sessao of sessoes) {
        const exercicios = sessao.exercicios_prescritos || [];
        for (const ep of exercicios) {
          const exInfo = catalogoMap.get(ep.exercicio_id);
          
          if (exInfo && exInfo.grupo_muscular_primario === grupo) {
            // Compostos primários e acessórios podem receber séries adicionais
            // Limite de segurança: máximo de 4 séries por exercício para evitar fadiga aguda excessiva
            if (ep.series_alvo < 4) {
              const seriesAAdicionar = Math.min(4 - ep.series_alvo, deficit - compensado);
              ep.series_alvo += seriesAAdicionar;
              compensado += seriesAAdicionar;
              
              if (compensado >= deficit) break;
            }
          }
        }
        if (compensado >= deficit) break;
      }

      // Recalcular volumes após a tentativa de ajuste
      volumesAtuais = calcularVolumeSemanal(sessoes, catalogoMap);
    }
  }

  // Edge Case 2: Se o volume total acumulado for alto e ultrapassar o tempo estimado,
  // adicionar notas e avisos científicos sugerindo técnicas avançadas de otimização de tempo.
  for (const sessao of sessoes) {
    const exercicios = sessao.exercicios_prescritos || [];
    const totalSeriesSessao = exercicios.reduce((sum, ep) => sum + ep.series_alvo, 0);

    // Se uma sessão tem mais de 15 séries de trabalho, o tempo real provavelmente excederá 45 minutos.
    if (totalSeriesSessao > 14) {
      // Schoenfeld et al. (2016): Descansos longos em compostos exigem mais tempo de sessão.
      const tempoEstimadoMinutos = Math.round(totalSeriesSessao * 2.5); // ~2.5min por série incluindo execução e descansos
      
      if (tempoEstimadoMinutos > (perfil.duracao_alvo_sessao_min || 45)) {
        const avisoTempo = `⚠️ [Aviso Científico] Para atingir o volume mínimo eficaz (MEV) de hipertrofia, esta sessão requer aproximadamente ${tempoEstimadoMinutos} minutos, ultrapassando seu alvo original. Sugerimos realizar supersets antagonistas nos acessórios para economizar até 30% do tempo.`;
        
        // Adiciona o aviso nas notas da sessão para visualização no frontend
        sessao.descricao = sessao.descricao 
          ? `${sessao.descricao}\n\n${avisoTempo}` 
          : avisoTempo;
      }
    }
  }

  return sessoes;
}
