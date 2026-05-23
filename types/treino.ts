export interface ExercicioPrescrito {
  id: string;
  exercicio_id: string;
  ordem: number;
  series_alvo: number;
  reps_alvo_min: number;
  reps_alvo_max: number;
  rir_alvo: number;
  descanso_segundos: number;
  substituicao_de_id?: string | null;
  // Extensões para o algoritmo científico de hipertrofia
  substituido_por_restricao?: boolean;
  exercicio_ideal_id?: string | null;
  notas?: string;
}

export interface SessaoTemplate {
  id: string;
  nome: string;
  descricao?: string;
  ordem_na_semana: number;
  exercicios_prescritos: ExercicioPrescrito[];
  // Extensões do algoritmo
  dia_da_semana?: string;
  exercicios?: ExercicioPrescrito[];
}

export interface ProgramaAtivo {
  id: string;
  nome: string;
  split_tipo: string;
  sessoes: SessaoTemplate[];
  data_inicio: string;
  data_fim?: string;
  // Extensões de compatibilidade com a especificação do algoritmo
  split?: string;
  sessoes_template?: SessaoTemplate[];
  semana_atual?: number;
}

export interface SerieExecutada {
  id: string;
  registro_exercicio_id: string;
  ordem: number;
  repeticoes: number;
  rir: number;
  peso_adicional_kg?: number;
  tempo_descanso_real_seg?: number;
}

export interface RegistroExercicio {
  id: string;
  registro_sessao_id: string;
  exercicio_id: string;
  ordem: number;
  series: SerieExecutada[];
  feedback_esforco?: number;
  notas?: string;
}

export interface RegistroSessao {
  id: string;
  sessao_template_id: string;
  data_inicio: string;
  data_fim?: string;
  duracao_segundos?: number;
  exercicios_realizados: RegistroExercicio[];
  concluida: boolean;
}
