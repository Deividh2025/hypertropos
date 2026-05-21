import { Equipamento, Articulacao, NivelEstresse } from './exercicio';

export enum Genero {
  MASCULINO = 'masculino',
  FEMININO = 'feminino',
  NAO_DECLARADO = 'nao_declarado',
}

export enum Nivel {
  INICIANTE = 'iniciante',
  INTERMEDIARIO_RETORNANDO = 'intermediario_retornando',
  INTERMEDIARIO = 'intermediario',
  AVANCADO = 'avancado',
}

export enum NivelAtividade {
  SEDENTARIO = 'sedentario',
  LEVE = 'leve',
  MODERADO = 'moderado',
  MUITO_ATIVO = 'muito_ativo',
}

export enum HorarioTreino {
  MANHA = 'manha',
  TARDE = 'tarde',
  NOITE = 'noite',
}

export enum FaseNutricional {
  MANUTENCAO = 'manutencao',
  HIPERTROFIA = 'hipertrofia',
  DEFICIT = 'deficit',
}

export interface Perfil {
  idade: number;
  genero_biologico: Genero;
  peso_corporal_kg: number;
  altura_cm: number;
  nivel: Nivel;
  nivel_atividade_extra_treino: NivelAtividade;
  dias_disponiveis_semana: number;
  duracao_alvo_sessao_min: number;
  horario_preferido_treino: HorarioTreino;
  equipamento_disponivel?: Equipamento[];
  split_atual?: string;
  objetivo?: string;
  restricoes_articulares?: { articulacao: Articulacao; nivel_severidade: NivelEstresse }[];
  historico_clinico?: string[];
  meta_proteina_g_kg?: number;
  fase_nutricional?: FaseNutricional;
  usa_creatina?: boolean;
  usa_cafeina?: boolean;
  lembretes_ativos?: Record<string, boolean>;
  data_criacao?: string;
  ultima_atualizacao?: string;
}
