export interface Referencia {
  id: string;
  autores: string;
  ano: number;
  titulo: string;
  periodico: string;
  url?: string;
  sintese_acessivel: string;
  tags?: string[];
}
