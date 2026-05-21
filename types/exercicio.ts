export enum GrupoMuscular {
  PEITO = 'peito',
  COSTAS = 'costas',
  OMBROS = 'ombros',
  TRICEPS = 'triceps',
  BICEPS = 'biceps',
  QUADRICEPS = 'quadriceps',
  POSTERIOR = 'posterior',
  GLUTEO = 'gluteo',
  PANTURRILHA = 'panturrilha',
  CORE = 'core',
}

export enum PadraoMovimento {
  PUSH_HORIZONTAL = 'push_horizontal',
  PUSH_VERTICAL = 'push_vertical',
  PULL_HORIZONTAL = 'pull_horizontal',
  PULL_VERTICAL = 'pull_vertical',
  JOELHO_DOMINANTE = 'joelho_dominante',
  QUADRIL_DOMINANTE = 'quadril_dominante',
  CORE = 'core',
  PANTURRILHA = 'panturrilha',
}

export enum NivelMinimo {
  INICIANTE = 'iniciante',
  INTERMEDIARIO = 'intermediario',
  AVANCADO = 'avancado',
}

export enum Equipamento {
  NENHUM = 'nenhum',
  MESA = 'mesa',
  CADEIRA = 'cadeira',
  PAREDE = 'parede',
  PISO_LISO = 'piso_liso',
  TOALHA = 'toalha',
  LIVRO = 'livro',
}

export enum Articulacao {
  JOELHO = 'joelho',
  QUADRIL = 'quadril',
  AQUILES = 'aquiles',
  OMBRO = 'ombro',
  COTOVELO = 'cotovelo',
  LOMBAR = 'lombar',
  CERVICAL = 'cervical',
}

export enum NivelEstresse {
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto',
}

export interface Exercicio {
  id: string;
  nome: string;
  nome_alternativo?: string;
  grupo_muscular_primario: GrupoMuscular;
  grupos_secundarios?: GrupoMuscular[];
  padrao_movimento: PadraoMovimento;
  nivel_minimo: NivelMinimo;
  nivel_escada: number;
  equipamento_necessario?: Equipamento[];
  grf_percentual?: number | null;
  articulacoes_estressadas?: Articulacao[];
  nivel_estresse_por_articulacao?: Partial<Record<Articulacao, NivelEstresse>>;
  descricao_execucao: string;
  dicas_tecnicas?: string[];
  erros_comuns?: string[];
  midia_url?: string;
  frase_cientifica_curta?: string;
  referencias?: string[];
  variacao_anterior?: string | null;
  variacao_proxima?: string | null;
  substitutos_mesmo_padrao?: string[];
  faixa_reps_recomendada?: { min: number; max: number };
  cadencia_recomendada?: { excentrica: number; isometrica: number; concentrica: number };
  descanso_recomendado_seg?: number;
  contraindicacoes?: string[];
}
