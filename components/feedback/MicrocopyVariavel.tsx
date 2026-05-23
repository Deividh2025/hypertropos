import React, { useState, useEffect, useCallback } from 'react';
import { Texto } from '../ui/Texto';

interface MicrocopyVariavelProps {
  pool: string[];
  variant?: any;
  color?: any;
  className?: string;
}

/**
 * Componente que exibe uma frase sorteada de um pool sem repetir até esgotar.
 * Reseta o pool de forma inteligente quando todas as opções forem consumidas.
 */
export function MicrocopyVariavel({
  pool,
  variant = 'body',
  color = 'primary',
  className = '',
}: MicrocopyVariavelProps) {
  const [poolRestante, setPoolRestante] = useState<string[]>([]);
  const [fraseExibida, setFraseExibida] = useState('');

  const sortearSemRepetir = useCallback(() => {
    if (pool.length === 0) return '';
    
    setPoolRestante((prevRestante) => {
      let list = prevRestante.length === 0 ? [...pool] : [...prevRestante];
      const index = Math.floor(Math.random() * list.length);
      const selecionada = list[index];
      list.splice(index, 1);
      
      setFraseExibida(selecionada);
      return list;
    });
  }, [pool]);

  useEffect(() => {
    sortearSemRepetir();
  }, [pool]);

  return (
    <Texto variant={variant} color={color} className={className}>
      {fraseExibida}
    </Texto>
  );
}

/**
 * Hook customizado para obter frases únicas de um pool de maneira imperativa.
 */
export function useMicrocopy(pool: string[]) {
  const [restante, setRestante] = useState<string[]>(() => [...pool]);

  const obterFraseUnica = useCallback(() => {
    if (pool.length === 0) return '';
    let listaAtual = [...restante];
    
    if (listaAtual.length === 0) {
      listaAtual = [...pool];
    }
    
    const index = Math.floor(Math.random() * listaAtual.length);
    const frase = listaAtual[index];
    listaAtual.splice(index, 1);
    
    setRestante(listaAtual);
    return frase;
  }, [restante, pool]);

  return obterFraseUnica;
}
