import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock React
vi.mock('react', () => ({
  useCallback: (fn: any) => fn,
}));

// 2. Mock usePerfilStore
const mockAtualizarCampo = vi.fn();
let mockPerfil: any = null;

vi.mock('../stores/perfilStore', () => ({
  usePerfilStore: () => ({
    perfil: mockPerfil,
    atualizarCampo: mockAtualizarCampo,
  }),
}));

import { useMetaProteina } from '../hooks/useMetaProteina';

describe('useMetaProteina Custom Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPerfil = null;
  });

  it('1. Deve usar fallbacks corretos quando o perfil for nulo', () => {
    mockPerfil = null;
    const { peso, fator, metaDiaria, refeicoesSugeridas } = useMetaProteina();

    expect(peso).toBe(70);
    expect(fator).toBe(2.0);
    expect(metaDiaria).toBe(140); // 70 * 2.0 = 140
    expect(refeicoesSugeridas).toHaveLength(4);
    expect(refeicoesSugeridas[0].quantidade).toBe(35); // 140 / 4 = 35
  });

  it('2. Deve calcular corretamente com perfil personalizado', () => {
    mockPerfil = {
      peso_corporal_kg: 85,
      meta_proteina_g_kg: 2.2,
    };
    const { peso, fator, metaDiaria, refeicoesSugeridas } = useMetaProteina();

    expect(peso).toBe(85);
    expect(fator).toBe(2.2);
    expect(metaDiaria).toBe(187); // 85 * 2.2 = 187
    expect(refeicoesSugeridas[0].quantidade).toBe(46.8); // 187 / 4 = 46.75 -> round to 1 decimal place: 46.8
  });

  it('3. Deve atualizar o fator limitando-o entre 1.4 e 2.5 g/kg', async () => {
    mockPerfil = {
      peso_corporal_kg: 80,
      meta_proteina_g_kg: 2.0,
    };
    const { setFator } = useMetaProteina();

    // Cenário A: Fator dentro da faixa
    await setFator(1.8);
    expect(mockAtualizarCampo).toHaveBeenCalledWith('meta_proteina_g_kg', 1.8);

    // Cenário B: Fator muito baixo (deve limitar para 1.4)
    await setFator(1.0);
    expect(mockAtualizarCampo).toHaveBeenCalledWith('meta_proteina_g_kg', 1.4);

    // Cenário C: Fator muito alto (deve limitar para 2.5)
    await setFator(3.0);
    expect(mockAtualizarCampo).toHaveBeenCalledWith('meta_proteina_g_kg', 2.5);

    // Cenário D: Arredondamento com uma casa decimal
    await setFator(1.86);
    expect(mockAtualizarCampo).toHaveBeenCalledWith('meta_proteina_g_kg', 1.9);
  });
});
