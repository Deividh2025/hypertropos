import { executarQuery, obterLinha } from '../local-cache';
import { enqueueChange } from '../sync-engine';
import { Perfil } from '../../types';

const PERFIL_ID = 'default';

export async function obterPerfil(): Promise<Perfil | null> {
  try {
    const linha = await obterLinha<any>('SELECT * FROM perfil_usuario WHERE id = ?', [PERFIL_ID]);
    if (!linha) return null;
    return parsePerfil(linha);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    return null;
  }
}

export async function salvarPerfil(perfil: Perfil): Promise<void> {
  try {
    const dados = serializePerfil(perfil);
    
    // Atualiza local cache
    await executarQuery(`
      INSERT OR REPLACE INTO perfil_usuario (
        id, idade, genero_biologico, peso_corporal_kg, altura_cm, nivel,
        nivel_atividade_extra_treino, dias_disponiveis_semana, duracao_alvo_sessao_min,
        horario_preferido_treino, equipamento_disponivel, split_atual, objetivo,
        restricoes_articulares, historico_clinico, meta_proteina_g_kg, fase_nutricional,
        usa_creatina, usa_cafeina, lembretes_ativos, data_criacao, ultima_atualizacao
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      PERFIL_ID,
      dados.idade, dados.genero_biologico, dados.peso_corporal_kg, dados.altura_cm,
      dados.nivel, dados.nivel_atividade_extra_treino, dados.dias_disponiveis_semana,
      dados.duracao_alvo_sessao_min, dados.horario_preferido_treino,
      dados.equipamento_disponivel, dados.split_atual, dados.objetivo,
      dados.restricoes_articulares, dados.historico_clinico, dados.meta_proteina_g_kg,
      dados.fase_nutricional, dados.usa_creatina, dados.usa_cafeina,
      dados.lembretes_ativos, dados.data_criacao, dados.ultima_atualizacao
    ]);
    
    // Dispara sync offline-first
    await enqueueChange('perfil_usuario', 'UPDATE', { id: PERFIL_ID, ...dados });
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
  }
}

export async function atualizarCampo(campo: keyof Perfil, valor: any): Promise<void> {
  const perfil = await obterPerfil();
  if (perfil) {
    const perfilAtualizado = { ...perfil, [campo]: valor, ultima_atualizacao: new Date().toISOString() };
    await salvarPerfil(perfilAtualizado);
  }
}

function parsePerfil(linha: any): Perfil {
  return {
    ...linha,
    equipamento_disponivel: linha.equipamento_disponivel ? JSON.parse(linha.equipamento_disponivel) : undefined,
    restricoes_articulares: linha.restricoes_articulares ? JSON.parse(linha.restricoes_articulares) : undefined,
    historico_clinico: linha.historico_clinico ? JSON.parse(linha.historico_clinico) : undefined,
    lembretes_ativos: linha.lembretes_ativos ? JSON.parse(linha.lembretes_ativos) : undefined,
    usa_creatina: linha.usa_creatina === 1,
    usa_cafeina: linha.usa_cafeina === 1,
  };
}

function serializePerfil(perfil: Perfil): any {
  return {
    ...perfil,
    equipamento_disponivel: perfil.equipamento_disponivel ? JSON.stringify(perfil.equipamento_disponivel) : null,
    restricoes_articulares: perfil.restricoes_articulares ? JSON.stringify(perfil.restricoes_articulares) : null,
    historico_clinico: perfil.historico_clinico ? JSON.stringify(perfil.historico_clinico) : null,
    lembretes_ativos: perfil.lembretes_ativos ? JSON.stringify(perfil.lembretes_ativos) : null,
    usa_creatina: perfil.usa_creatina ? 1 : 0,
    usa_cafeina: perfil.usa_cafeina ? 1 : 0,
    data_criacao: perfil.data_criacao || new Date().toISOString(),
    ultima_atualizacao: new Date().toISOString(),
  };
}
