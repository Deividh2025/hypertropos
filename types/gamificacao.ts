export interface Conquista {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  tipo: string;
  xp_recompensa: number;
  desbloqueada_em?: string;
}

export interface EstadoSilhueta {
  id: string;
  peito: number;
  costas: number;
  ombros: number;
  bracos: number;
  quadriceps: number;
  posterior: number;
  gluteo: number;
  panturrilha: number;
  core: number;
  tier_atual: 'bronze' | 'pedra' | 'marmore' | 'dourada';
  ultima_atualizacao: string;
}

export interface Gamificacao {
  id: string;
  xp_total: number;
  nivel_atual: number;
  streak_atual: number;
  streak_maximo: number;
  freezes_disponiveis: number;
  ultima_atividade: string;
}
