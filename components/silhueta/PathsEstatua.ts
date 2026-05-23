/**
 * PathsEstatua.ts
 *
 * Contém os caminhos SVG (Paths) altamente estilizados e proporcionais da silhueta corporal
 * em estilo estátua clássica grega (inspirada na pose contrapposto do David/Doríforo).
 *
 * Os caminhos estão contidos em um viewBox padrão de 0 0 240 480.
 *
 * Divisão de Regiões frontais e traseiras para permitir a renderização independente.
 */

export interface PathMuscular {
  id: string;
  nome: string;
  path: string;
  centro: { x: number; y: number }; // Centro aproximado para efeitos visuais, tooltips ou interações
}

// Silhueta inteira de contorno frontal do corpo (usada como fundo neutral em baixo dos músculos)
export const PATH_CORPO_BASE_FRENTE = 
  "M120,30 " +
  "C130,30 135,35 135,45 C135,55 130,65 120,65 C110,65 105,55 105,45 C105,35 110,30 120,30 Z " + // Cabeça
  "M112,65 C112,72 105,74 100,75 C85,78 72,82 66,95 C62,103 62,115 64,130 C66,145 68,160 67,175 C66,190 60,205 65,215 " + // Braço e ombro esquerdo
  "C70,225 78,225 80,215 C82,205 84,185 86,170 " + // Antebraço esquerdo interno
  "C87,185 89,205 91,225 C93,240 92,255 100,265 C107,273 118,272 122,280 " + // Quadril e cintura esquerda (focada no contrapposto)
  "C128,295 125,320 123,345 C121,370 124,395 121,420 C118,440 114,450 118,455 C122,460 132,458 135,450 " + // Perna esquerda (peso)
  "C140,430 143,410 144,380 C146,350 148,320 152,295 " + // Perna esquerda interna
  "C154,320 155,345 158,370 C160,390 162,410 160,430 C158,445 152,452 156,456 C160,460 170,458 174,445 " + // Perna direita (relaxada)
  "C180,425 182,400 178,375 C174,345 170,315 166,285 C162,265 158,250 155,230 " + // Coxa direita externa e lateral
  "C157,215 159,195 157,175 C155,160 152,145 155,130 C158,115 168,103 164,95 C160,85 145,78 140,75 C135,74 128,72 128,65 Z";

// Silhueta inteira de contorno traseiro do corpo
export const PATH_CORPO_BASE_COSTAS = PATH_CORPO_BASE_FRENTE; // Usa o mesmo contorno espelhado esteticamente

// Regiões Musculares da Visão Frontal (Frente)
export const PATHS_FRENTE: PathMuscular[] = [
  {
    id: "peito",
    nome: "Peito",
    // Desenho estilizado de peitorais divididos e definidos
    path: "M120,90 " +
          "C115,90 98,92 90,95 C82,97 80,105 80,118 C80,126 95,130 120,128 " + // Peito Esquerdo
          "C145,130 160,126 160,118 C160,105 158,97 150,95 C142,92 125,90 120,90 Z " + // Peito Direito
          "M120,90 L120,128", // Linha central de separação
    centro: { x: 120, y: 110 }
  },
  {
    id: "ombro_esq",
    nome: "Ombro Esquerdo",
    path: "M78,82 C72,83 67,88 66,95 C64,103 64,112 68,118 C71,122 75,124 77,118 C80,112 82,95 78,82 Z",
    centro: { x: 72, y: 100 }
  },
  {
    id: "ombro_dir",
    nome: "Ombro Direito",
    path: "M162,82 C168,83 173,88 174,95 C176,103 176,112 172,118 C169,122 165,124 163,118 C160,112 158,95 162,82 Z",
    centro: { x: 168, y: 100 }
  },
  {
    id: "braco_esq",
    nome: "Braço Esquerdo",
    // Bíceps e antebraço esquerdo
    path: "M68,118 C64,130 65,145 67,160 C69,170 73,170 75,160 C77,145 78,130 77,118 Z " + // Bíceps
          "M67,160 C66,175 60,190 65,205 C68,212 73,212 75,205 C77,190 76,175 75,160 Z", // Antebraço
    centro: { x: 70, y: 150 }
  },
  {
    id: "braco_dir",
    nome: "Braço Direito",
    // Bíceps e antebraço direito
    path: "M172,118 C176,130 175,145 173,160 C171,170 167,170 165,160 C163,145 162,130 163,118 Z " + // Bíceps
          "M173,160 C174,175 180,190 175,205 C172,212 167,212 165,205 C163,190 164,175 165,160 Z", // Antebraço
    centro: { x: 170, y: 150 }
  },
  {
    id: "core",
    nome: "Core",
    // Linhas estilizadas de gomos do abdômen (reto abdominal e oblíquos)
    path: "M100,132 C92,132 88,140 88,155 C88,175 92,205 100,215 L140,215 C148,205 152,175 152,155 C152,140 148,132 140,132 Z " +
          "M120,132 L120,215 " + // Linha alba central
          "M100,150 L140,150 " + // Gomo superior
          "M98,172 L142,172 " +  // Gomo médio
          "M96,195 L144,195",    // Gomo inferior
    centro: { x: 120, y: 175 }
  },
  {
    id: "quadriceps_esq",
    nome: "Quadríceps Esquerdo",
    // Perna esquerda (peso - mais contraída)
    path: "M94,225 C88,235 88,255 92,275 C96,295 102,315 104,330 C108,310 114,290 118,275 C122,260 120,245 116,225 Z " +
          "M104,330 C108,335 114,335 118,330 C122,315 125,295 128,275 C131,255 128,235 126,225 Z",
    centro: { x: 110, y: 275 }
  },
  {
    id: "quadriceps_dir",
    nome: "Quadríceps Direito",
    // Perna direita (relaxada - levemente estendida para fora)
    path: "M128,225 C124,245 122,260 126,275 C130,290 136,310 140,330 C142,315 148,295 152,275 C156,255 156,235 150,225 Z " +
          "M140,330 C144,335 150,335 154,330 C156,310 160,290 162,275 C164,260 162,245 158,225 Z",
    centro: { x: 142, y: 275 }
  },
  {
    id: "panturrilha_esq",
    nome: "Panturrilha Esquerda",
    path: "M106,355 C102,370 102,390 108,415 L124,415 C126,390 128,370 124,355 Z",
    centro: { x: 115, y: 385 }
  },
  {
    id: "panturrilha_dir",
    nome: "Panturrilha Direita",
    path: "M136,355 C132,370 134,390 138,415 L154,415 C160,390 160,370 156,355 Z",
    centro: { x: 145, y: 385 }
  }
];

// Regiões Musculares da Visão Traseira (Costas)
export const PATHS_COSTAS: PathMuscular[] = [
  {
    id: "costas",
    nome: "Costas",
    // Trapézio e grande dorsal em formato de V escultural
    path: "M120,75 " +
          "C105,75 88,85 86,95 C84,105 82,125 78,145 C86,160 98,185 120,205 " + // Dorsal Esquerda
          "C142,185 154,160 162,145 C158,125 156,105 154,95 C152,85 135,75 120,75 Z " + // Dorsal Direita
          "M120,75 L120,205 " + // Espinha dorsal
          "M120,75 C115,85 105,95 95,95 M120,75 C125,85 135,95 145,95 " + // Trapézio superior
          "M120,110 C108,120 95,130 82,130 M120,110 C132,120 145,130 158,130", // Trapézio inferior / asas
    centro: { x: 120, y: 130 }
  },
  {
    id: "ombro_esq",
    nome: "Ombro Esquerdo",
    path: "M78,82 C72,83 67,88 66,95 C64,103 64,112 68,118 C71,122 75,124 77,118 C80,112 82,95 78,82 Z",
    centro: { x: 72, y: 100 }
  },
  {
    id: "ombro_dir",
    nome: "Ombro Direito",
    path: "M162,82 C168,83 173,88 174,95 C176,103 176,112 172,118 C169,122 165,124 163,118 C160,112 158,95 162,82 Z",
    centro: { x: 168, y: 100 }
  },
  {
    id: "braco_esq",
    nome: "Braço Esquerdo",
    path: "M68,118 C64,130 65,145 67,160 C69,170 73,170 75,160 C77,145 78,130 77,118 Z " +
          "M67,160 C66,175 60,190 65,205 C68,212 73,212 75,205 C77,190 76,175 75,160 Z",
    centro: { x: 70, y: 150 }
  },
  {
    id: "braco_dir",
    nome: "Braço Direito",
    path: "M172,118 C176,130 175,145 173,160 C171,170 167,170 165,160 C163,145 162,130 163,118 Z " +
          "M173,160 C174,175 180,190 175,205 C172,212 167,212 165,205 C163,190 164,175 165,160 Z",
    centro: { x: 170, y: 150 }
  },
  {
    id: "gluteo_esq",
    nome: "Glúteo Esquerdo",
    // Glúteo esquerdo arredondado
    path: "M120,210 C105,210 95,215 94,228 C92,245 100,260 120,260 Z",
    centro: { x: 108, y: 235 }
  },
  {
    id: "gluteo_dir",
    nome: "Glúteo Direito",
    // Glúteo direito arredondado
    path: "M120,210 C135,210 145,215 146,228 C148,245 140,260 120,260 Z",
    centro: { x: 132, y: 235 }
  },
  {
    id: "posterior_esq",
    nome: "Posterior de Coxa Esquerdo",
    path: "M94,262 C90,275 92,295 96,315 C98,325 104,325 106,315 C108,295 110,275 104,262 Z " +
          "M104,262 C110,275 112,295 116,315 C118,325 122,325 120,315 C118,295 116,275 114,262 Z",
    centro: { x: 107, y: 290 }
  },
  {
    id: "posterior_dir",
    nome: "Posterior de Coxa Direito",
    path: "M126,262 C124,275 122,295 124,315 C126,325 132,325 134,315 C136,295 138,275 136,262 Z " +
          "M136,262 C138,275 140,295 144,315 C146,325 152,325 154,315 C156,295 154,275 150,262 Z",
    centro: { x: 133, y: 290 }
  },
  {
    id: "panturrilha_esq",
    nome: "Panturrilha Esquerda",
    // Gastrocnêmio detalhado e proeminente da visão traseira
    path: "M104,332 C98,345 96,365 104,385 C108,395 114,395 116,385 C118,365 116,345 112,332 Z " +
          "M112,332 C116,345 118,365 120,385 C122,395 126,395 124,385 C122,365 118,345 116,332 Z",
    centro: { x: 110, y: 360 }
  },
  {
    id: "panturrilha_dir",
    nome: "Panturrilha Direita",
    // Gastrocnêmio detalhado e proeminente da visão traseira
    path: "M124,332 C122,345 118,365 120,385 C122,395 126,395 128,385 C130,365 128,345 126,332 Z " +
          "M126,332 C128,345 130,365 134,385 C138,395 144,395 142,385 C140,365 138,345 136,332 Z",
    centro: { x: 130, y: 360 }
  }
];

// Veios de Mármore para sobreposição decorativa realista (Frente e Costas)
export const PATH_VEIAS_FRENTE = 
  "M80,85 C95,110 105,140 100,175 C95,200 90,230 110,280 C115,290 120,320 118,350 " +
  "M150,90 C135,115 130,150 140,185 C145,210 135,240 130,270 C125,300 135,350 140,390 " +
  "M65,115 C75,130 70,160 75,185 " +
  "M175,115 C165,130 170,160 165,185";

export const PATH_VEIAS_COSTAS = 
  "M120,80 C110,110 95,130 90,165 C85,200 95,230 100,260 C105,290 100,320 102,360 " +
  "M140,95 C145,120 135,150 142,185 C150,210 145,250 140,290 " +
  "M70,105 C75,130 72,160 70,190 " +
  "M170,105 C165,130 168,160 170,190";

