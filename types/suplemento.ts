export interface Suplemento {
  id: string;
  nome: string;
  grau_evidencia: 'A' | 'B' | 'C' | 'Sem Evidencia';
  dose_recomendada: string;
  horario_recomendado?: string;
  descricao_curta: string;
  mecanismo_acao?: string;
  referencias_ids?: string[];
}

export interface Lembrete {
  id: string;
  tipo: 'creatina' | 'refeicao_proteica' | 'hora_treino';
  horario: string;
  ativo: boolean;
  dias_semana: number[]; // 0-6 (domingo-sabado)
}
