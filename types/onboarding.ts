import { Articulacao, NivelEstresse, Genero, Nivel, NivelAtividade, HorarioTreino, Equipamento } from './exercicio';

export enum RegiaoCorpo {
  JOELHO_ESQUERDO = 'joelho_esquerdo',
  JOELHO_DIREITO = 'joelho_direito',
  QUADRIL = 'quadril',
  OMBRO_ESQUERDO = 'ombro_esquerdo',
  OMBRO_DIREITO = 'ombro_direito',
  COTOVELO_ESQUERDO = 'cotovelo_esquerdo',
  COTOVELO_DIREITO = 'cotovelo_direito',
  LOMBAR = 'lombar',
  CERVICAL = 'cervical',
  AQUILES_ESQUERDO = 'aquiles_esquerdo',
  AQUILES_DIREITO = 'aquiles_direito',
}

export type SeveridadeRestricao = 'leve' | 'moderada' | 'alta';

export interface RestricaoOnboarding {
  regiao: RegiaoCorpo;
  severidade: SeveridadeRestricao;
}

export enum HistoricoClinicoOpcao {
  PREDISPOSICAO_JOELHO = 'predisposicao_joelho',
  PREDISPOSICAO_QUADRIL = 'predisposicao_quadril',
  PREDISPOSICAO_AQUILES = 'predisposicao_aquiles',
  TENDINOPATIA_AQUILES_PREVIA = 'tendinopatia_aquiles_previa',
  CONDROMALACIA_PATELAR = 'condromalacia_patelar',
  HERNIA_DE_DISCO_PREVIA = 'hernia_de_disco_previa',
  LESAO_OMBRO_PREVIA = 'lesao_ombro_previa',
}

export interface OnboardingData {
  idade?: number;
  genero_biologico?: Genero;
  peso_corporal_kg?: number;
  altura_cm?: number;
  nivel?: Nivel;
  nivel_atividade_extra_treino?: NivelAtividade;
  dias_disponiveis_semana?: number;
  duracao_alvo_sessao_min?: number;
  horario_preferido_treino?: HorarioTreino;
  equipamento_disponivel?: Equipamento[];
  restricoes_articulares?: RestricaoOnboarding[];
  historico_clinico?: string[];
  nota_clinica?: string;
}

export function mapearRegiaoParaArticulacao(regiao: RegiaoCorpo): Articulacao {
  switch (regiao) {
    case RegiaoCorpo.JOELHO_ESQUERDO:
    case RegiaoCorpo.JOELHO_DIREITO:
      return Articulacao.JOELHO;
    case RegiaoCorpo.OMBRO_ESQUERDO:
    case RegiaoCorpo.OMBRO_DIREITO:
      return Articulacao.OMBRO;
    case RegiaoCorpo.COTOVELO_ESQUERDO:
    case RegiaoCorpo.COTOVELO_DIREITO:
      return Articulacao.COTOVELO;
    case RegiaoCorpo.AQUILES_ESQUERDO:
    case RegiaoCorpo.AQUILES_DIREITO:
      return Articulacao.AQUILES;
    case RegiaoCorpo.QUADRIL:
      return Articulacao.QUADRIL;
    case RegiaoCorpo.LOMBAR:
      return Articulacao.LOMBAR;
    case RegiaoCorpo.CERVICAL:
      return Articulacao.CERVICAL;
  }
}

export function mapearSeveridadeParaNivel(severidade: SeveridadeRestricao): NivelEstresse {
  switch (severidade) {
    case 'leve': return NivelEstresse.BAIXO;
    case 'moderada': return NivelEstresse.MEDIO;
    case 'alta': return NivelEstresse.ALTO;
  }
}
