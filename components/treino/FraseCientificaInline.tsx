import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Texto } from '../ui/Texto';
import { useSessaoStore } from '../../stores/sessaoStore';

const FRASES_CIENTIFICAS_PADRAO = [
  'Tensão na posição alongada gera mais hipertrofia — Pedrosa et al. 2022',
  'Treinar próximo à falha maximiza o recrutamento de unidades motoras — Henneman et al. 1965',
  'A cadência excêntrica controlada aumenta a sinalização hipertrófica — Schoenfeld et al. 2017',
  'Descansar 2-3 min previne a fadiga central prematura em compostos — Senna et al. 2016',
  'A sobrecarga progressiva é o motor primário da hipertrofia muscular — Goldberg et al. 1975',
  'A conexão mente-músculo aumenta a ativação por eletromiografia — Schoenfeld et al. 2018',
  'Séries levadas até a falha induzem maior estresse metabólico — Mitchell et al. 2012',
  'O volume semanal adequado é crucial para maximizar a síntese proteica — Damas et al. 2018'
];

export function FraseCientificaInline() {
  const { exerciciosPrescritos, exercicioAtualIndex, exerciciosCatalogMap } = useSessaoStore();
  const [listaFrases, setListaFrases] = useState<string[]>([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [fraseExibida, setFraseExibida] = useState('');
  
  const opacityVal = useSharedValue(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (exerciciosPrescritos.length === 0) return;

    const currentPrescricao = exerciciosPrescritos[exercicioAtualIndex];
    const exDetails = exerciciosCatalogMap[currentPrescricao.exercicio_id];
    
    // Constrói lista de frases científica relevantes
    const frases: string[] = [];
    if (exDetails?.frase_cientifica_curta) {
      frases.push(exDetails.frase_cientifica_curta);
    }
    
    // Complementa com o pool padrão para ter rotação
    FRASES_CIENTIFICAS_PADRAO.forEach(f => {
      if (!frases.includes(f)) frases.push(f);
    });

    setListaFrases(frases);
    setIndexAtual(0);
    setFraseExibida(frases[0]);
  }, [exercicioAtualIndex, exerciciosPrescritos]);

  useEffect(() => {
    if (listaFrases.length <= 1) return;

    // Configura o timer de rotação de 5 segundos com transição de Fade
    intervalRef.current = setInterval(() => {
      // 1. Fade Out
      opacityVal.value = withTiming(0, { duration: 300 }, () => {
        // Callback executado na thread nativa após Fade Out
        setIndexAtual((prev) => {
          const proximo = (prev + 1) % listaFrases.length;
          setFraseExibida(listaFrases[proximo]);
          return proximo;
        });
        
        // 2. Fade In
        opacityVal.value = withTiming(1, { duration: 300 });
      });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [listaFrases]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));

  if (listaFrases.length === 0) return null;

  return (
    <View className="h-[35px] justify-center items-center px-6 bg-canvas border-b border-border-subtle/30">
      <Animated.View style={animatedStyle} className="flex-row items-center justify-center">
        <Texto 
          variant="caption" 
          color="muted" 
          numberOfLines={1} 
          className="text-center font-medium italic text-[11px] leading-[14px]"
        >
          {fraseExibida}
        </Texto>
      </Animated.View>
    </View>
  );
}
