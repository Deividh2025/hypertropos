import { useCallback } from 'react';
import { usePerfilStore } from '../stores/perfilStore';

export function useMetaProteina() {
  const { perfil, atualizarCampo } = usePerfilStore();

  const peso = perfil?.peso_corporal_kg || 70; // fallback se não houver
  const fator = perfil?.meta_proteina_g_kg || 2.0; // default 2.0 g/kg

  const metaDiaria = Math.round(peso * fator);

  // Divisão sugerida em refeições (ex: 4 refeições)
  const numRefeicoes = 4;
  const proteinaPorRefeicao = Math.round((metaDiaria / numRefeicoes) * 10) / 10;

  const refeicoesSugeridas = Array.from({ length: numRefeicoes }, (_, index) => ({
    id: `ref-${index + 1}`,
    nome: `Refeição ${index + 1}`,
    quantidade: proteinaPorRefeicao,
    sugestao: index === 0 
      ? 'Foco em absorção rápida (Whey/Ovos + Carboidratos)' 
      : index === numRefeicoes - 1 
      ? 'Foco em absorção lenta (Caseína/Iogurte grego/Carne)'
      : 'Proteína sólida (Frango/Peixe/Leguminosas)'
  }));

  const setFator = useCallback(async (novoFator: number) => {
    // Limita o fator entre 1.4 e 2.5 g/kg de acordo com os limites fisiológicos
    const fatorValido = Math.min(Math.max(novoFator, 1.4), 2.5);
    const fatorArredondado = Math.round(fatorValido * 10) / 10;
    
    await atualizarCampo('meta_proteina_g_kg', fatorArredondado);
  }, [atualizarCampo]);

  const justificativaCientifica = 
    "Um fator de ingestão diária de proteína na faixa de 1.6 a 2.2 g/kg é amplamente aceito como o limite superior ideal para a hipertrofia de acordo com a clássica meta-análise sistemática de Morton et al. (2018). Atletas avançados ou em restrição calórica sob severo estresse calistênico se beneficiam de até 2.5 g/kg para atenuar o catabolismo muscular e maximizar a regeneração de tecidos.";

  return {
    peso,
    fator,
    metaDiaria,
    refeicoesSugeridas,
    setFator,
    justificativaCientifica,
  };
}
