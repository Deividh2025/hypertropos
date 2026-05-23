/**
 * MateriaisTier.ts
 * 
 * Contém a lógica matemática e de cores para os quatro tiers de materiais
 * da estátua clássica (Bronze, Pedra, Mármore, Dourada).
 * 
 * Retorna as cores, paradas (stops) e configurações do Skia com base no 
 * nível de definição muscular (0-100) para acentuar contrastes e highlights.
 */

export interface ConfigGradiente {
  colors: string[];
  stops: number[];
  style: 'linear' | 'radial';
  veiasOpacity?: number; // Para mármore: opacidade dos veios
  noiseIntensity?: number; // Para pedra: intensidade do ruído
  brilhoContorno?: string; // Para dourado: cor e intensidade do brilho nos contornos
}

/**
 * Auxiliar para interpolar linearmente entre duas cores hexadecimais
 */
function interpolarCor(c1: string, c2: string, fator: number): string {
  const f = Math.min(1, Math.max(0, fator));
  
  const parseHex = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  };

  const color1 = parseHex(c1);
  const color2 = parseHex(c2);

  const r = Math.round(color1.r + (color2.r - color1.r) * f);
  const g = Math.round(color1.g + (color2.g - color1.g) * f);
  const b = Math.round(color1.b + (color2.b - color1.b) * f);

  const toHex = (num: number) => num.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 1. Material Bronze
 * Aparência de bronze polido escuro. A definição muscular acentua os highlights.
 * - Cores básicas: #5A4632 a #C19A6B
 */
export function obterGradienteBronze(definicao: number): ConfigGradiente {
  const fator = definicao / 100;
  
  // Sombra fica mais escura com alta definição (aumentando o contraste tridimensional)
  const sombra = interpolarCor('#5A4632', '#322418', fator);
  // Meio tom representativo do bronze escuro
  const meioTom = '#8E6F4E';
  // Highlight fica extremamente polido e brilhante com alta definição
  const highlight = interpolarCor('#C19A6B', '#FADCB4', fator);

  return {
    colors: [sombra, meioTom, highlight],
    stops: [0.0, 0.5, 1.0],
    style: 'linear'
  };
}

/**
 * 2. Material Pedra
 * Textura de pedra cinza-clara escultural. Textura granular simulada.
 * - Cores básicas: #6E6457 a #B8AB9B
 */
export function obterGradientePedra(definicao: number): ConfigGradiente {
  const fator = definicao / 100;

  const sombra = interpolarCor('#6E6457', '#4E463C', fator);
  const meioTom = '#92887A';
  const highlight = interpolarCor('#B8AB9B', '#D2C8BC', fator);

  // A intensidade do ruído aumenta ligeiramente em áreas de maior definição para destacar o relevo da pedra esculpida
  const noiseIntensity = 0.05 + fator * 0.08;

  return {
    colors: [sombra, meioTom, highlight],
    stops: [0.0, 0.5, 1.0],
    style: 'linear',
    noiseIntensity
  };
}

/**
 * 3. Material Mármore
 * Mármore branco translúcido com veios finos.
 * - Cores básicas: #E8DED1 a #F2EAE0. Veios em #B8AB9B
 */
export function obterGradienteMarmore(definicao: number): ConfigGradiente {
  const fator = definicao / 100;

  // Base do mármore ganha translucidez e pureza (mais branca) com a definição
  const sombra = interpolarCor('#E8DED1', '#DED2C2', fator);
  const meioTom = '#EFE6D9';
  const highlight = interpolarCor('#F2EAE0', '#FFFFFF', fator);

  // A opacidade e contraste das veias do mármore aumentam com a definição muscular naquela região
  const veiasOpacity = 0.15 + fator * 0.45;

  return {
    colors: [sombra, meioTom, highlight],
    stops: [0.0, 0.65, 1.0],
    style: 'radial',
    veiasOpacity
  };
}

/**
 * 4. Material Dourada
 * Reflexos dourados nos contornos. Estado de maestria.
 * - Cores básicas: #B8935A a #D4AF7A com brilhos em #F0D08F
 */
export function obterGradienteDourado(definicao: number): ConfigGradiente {
  const fator = definicao / 100;

  // Ouro profundo na sombra, ouro polido no meio-tom, brilho estelar dourado no highlight
  const sombra = interpolarCor('#8C6C38', '#5E4620', fator);
  const meioTom = '#B8935A';
  const highlight = interpolarCor('#D4AF7A', '#FFF0B5', fator);
  
  // Brilho dourado nos contornos (contour glow) ganha intensidade vibrante com a definição
  const brilhoContorno = interpolarCor('rgba(240, 208, 143, 0.2)', 'rgba(255, 235, 180, 0.95)', fator);

  return {
    colors: [sombra, meioTom, highlight],
    stops: [0.0, 0.45, 1.0],
    style: 'linear',
    brilhoContorno
  };
}

/**
 * Função unificada para retornar a configuração baseada no Tier e na definição muscular
 */
export function obterConfigMaterial(
  tier: 'bronze' | 'pedra' | 'marmore' | 'dourada',
  definicao: number
): ConfigGradiente {
  switch (tier) {
    case 'bronze':
      return obterGradienteBronze(definicao);
    case 'pedra':
      return obterGradientePedra(definicao);
    case 'marmore':
      return obterGradienteMarmore(definicao);
    case 'dourada':
      return obterGradienteDourado(definicao);
    default:
      return obterGradienteBronze(definicao);
  }
}
