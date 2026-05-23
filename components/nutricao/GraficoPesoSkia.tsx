import React, { useState, useMemo } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Canvas, Path, LinearGradient, vec } from '@shopify/react-native-skia';
import { Texto } from '../ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { RegistroPeso } from '../../hooks/useEvolucaoPeso';

interface GraficoPesoSkiaProps {
  historico: RegistroPeso[];
}

export function GraficoPesoSkia({ historico }: GraficoPesoSkiaProps) {
  const { tokens } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const screenWidth = Dimensions.get('window').width - 32; // margens da tela
  const height = 180; // altura do canvas
  const paddingX = 16;
  const paddingY = 24;

  const chartWidth = screenWidth - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // 1. Calcula limites de Peso
  const { minPeso, maxPeso, list } = useMemo(() => {
    if (historico.length === 0) {
      return { minPeso: 60, maxPeso: 80, list: [] as RegistroPeso[] };
    }
    
    // Pega os últimos 12 registros de peso
    const listData = historico.slice(-12);
    
    let min = Infinity;
    let max = -Infinity;
    listData.forEach((h) => {
      if (h.peso_kg < min) min = h.peso_kg;
      if (h.peso_kg > max) max = h.peso_kg;
    });

    // Margens visuais superior e inferior de +/- 1kg para não esmagar a curva
    min = Math.floor(min - 1);
    max = Math.ceil(max + 1);

    if (min === max) {
      min -= 5;
      max += 5;
    }

    return { minPeso: min, maxPeso: max, list: listData };
  }, [historico]);

  // 2. Mapeia os pontos de peso para coordenadas (X, Y) do Canvas
  const pontosCoordenadas = useMemo(() => {
    if (list.length === 0) return [];
    
    const count = list.length;
    const stepX = count > 1 ? chartWidth / (count - 1) : chartWidth;

    return list.map((item, index) => {
      const x = paddingX + index * stepX;
      // Inverte o Y porque no Canvas o (0,0) é no topo
      const y = paddingY + chartHeight - ((item.peso_kg - minPeso) / (maxPeso - minPeso)) * chartHeight;
      return { x, y, peso: item.peso_kg, data: item.data_registro };
    });
  }, [list, minPeso, maxPeso, chartWidth, chartHeight]);

  // 3. Monta a curva Bezier cúbica suave
  const { pathLine, pathArea } = useMemo(() => {
    if (pontosCoordenadas.length === 0) return { pathLine: '', pathArea: '' };

    let linePath = `M ${pontosCoordenadas[0].x} ${pontosCoordenadas[0].y}`;
    
    for (let i = 0; i < pontosCoordenadas.length - 1; i++) {
      const p1 = pontosCoordenadas[i];
      const p2 = pontosCoordenadas[i + 1];
      
      // Pontos de controle para suavizar a curva Bezier cúbica (estilo ticker financeiro)
      const cp1x = p1.x + (p2.x - p1.x) / 2;
      const cp1y = p1.y;
      const cp2x = p1.x + (p2.x - p1.x) / 2;
      const cp2y = p2.y;

      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    // Path fechado para o preenchimento em gradiente
    const firstPoint = pontosCoordenadas[0];
    const lastPoint = pontosCoordenadas[pontosCoordenadas.length - 1];
    
    const areaPath = `${linePath} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`;

    return { pathLine: linePath, pathArea: areaPath };
  }, [pontosCoordenadas, height]);

  // 4. Linhas de grade horizontais e rótulos do eixo Y
  const linhasGrade = useMemo(() => {
    const subdivisoes = 3; // 3 linhas (min, meio, max)
    const linhas = [];
    
    for (let i = 0; i <= subdivisoes; i++) {
      const pesoGrade = minPeso + (i * (maxPeso - minPeso)) / subdivisoes;
      const y = paddingY + chartHeight - (i * chartHeight) / subdivisoes;
      linhas.push({
        y,
        pesoLabel: `${pesoGrade.toFixed(0)} kg`
      });
    }
    
    return linhas;
  }, [minPeso, maxPeso, chartHeight]);

  // 5. Interação de Toque (Pan e Detecção de ponto mais próximo)
  const handleTouch = (e: any) => {
    if (pontosCoordenadas.length === 0) return;
    
    const touchX = e.nativeEvent.locationX;
    
    // Encontra o ponto cuja coordenada X está mais próxima do toque do usuário
    let closestIndex = 0;
    let minDistance = Infinity;

    pontosCoordenadas.forEach((pt, index) => {
      const dist = Math.abs(pt.x - touchX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
  };

  const handleTouchEnd = () => {
    setSelectedIndex(null);
  };

  const selectedPoint = selectedIndex !== null ? pontosCoordenadas[selectedIndex] : null;

  return (
    <View className="bg-elevated p-4 rounded-md border border-border-subtle overflow-hidden">
      
      {/* Cabeçalho do Gráfico e Tooltip interativo */}
      <View className="flex-row justify-between items-center mb-3 h-[42px]">
        {selectedPoint ? (
          <View>
            <Texto variant="caption" color="muted">REGISTRO EM {selectedPoint.data}</Texto>
            <Texto variant="h3" color="bronze" className="font-bold">
              {selectedPoint.peso.toFixed(1)} <Texto variant="caption" color="secondary">kg</Texto>
            </Texto>
          </View>
        ) : (
          <View>
            <Texto variant="caption" color="muted">EVOLUÇÃO DO PESO (ÚLTIMOS 12 REGISTROS)</Texto>
            <Texto variant="bodyBold" color="primary">
              Deslize o dedo para inspecionar
            </Texto>
          </View>
        )}

        <View className="items-end">
          <Texto variant="caption" color="muted">PESO ATUAL</Texto>
          <Texto variant="h3" color="marble" className="font-bold">
            {historico[historico.length - 1]?.peso_kg.toFixed(1) || '--'} kg
          </Texto>
        </View>
      </View>

      {/* Área do Gráfico */}
      <View
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        style={{ width: screenWidth - 8, height }}
      >
        {/* Rótulos do Eixo Y - Posicionados de forma sutil por baixo do Canvas */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {linhasGrade.map((linha, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                top: linha.y - 10,
                left: 0,
                right: 0,
                height: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {/* Linha tracejada horizontal decorativa */}
              <View 
                className="flex-1 border-t border-dashed border-border-subtle" 
                style={{ height: 1, opacity: 0.4, marginRight: 8 }}
              />
              <Texto variant="caption" color="muted" className="text-right w-[42px] text-[10px]">
                {linha.pesoLabel}
              </Texto>
            </View>
          ))}
        </View>

        {/* Canvas de Renderização Skia */}
        <Canvas style={{ width: screenWidth - 8, height }}>
          
          {/* 1. Preenchimento do Gradiente sob a Curva (Bronze Translúcido) */}
          {pathArea ? (
            <Path path={pathArea} style="fill">
              <LinearGradient
                start={vec(0, paddingY)}
                end={vec(0, height - paddingY)}
                colors={[`rgba(${tokens.accent.bronze === '#C19A6B' ? '193, 154, 107' : '139, 111, 71'}, 0.28)`, 'rgba(0, 0, 0, 0)']}
              />
            </Path>
          ) : null}

          {/* 2. Curva Bezier principal (Bronze sólido de alta nítidez) */}
          {pathLine ? (
            <Path
              path={pathLine}
              style="stroke"
              strokeWidth={3}
              color={tokens.accent.bronze}
              strokeCap="round"
            />
          ) : null}

          {/* 3. Renderiza o cursor vertical sutil do ponto selecionado */}
          {selectedPoint ? (
            <>
              {/* Linha vertical de foco */}
              <Path
                path={`M ${selectedPoint.x} ${paddingY} L ${selectedPoint.x} ${height - paddingY}`}
                style="stroke"
                strokeWidth={1}
                color={tokens.border.strong}
              />
              {/* Círculo indicador no ponto da curva */}
              <Path
                path={`M ${selectedPoint.x - 5} ${selectedPoint.y} A 5 5 0 1 0 ${selectedPoint.x + 5} ${selectedPoint.y}`}
                style="fill"
                color={tokens.accent.marble}
              />
              <Path
                path={`M ${selectedPoint.x - 2} ${selectedPoint.y} A 2 2 0 1 0 ${selectedPoint.x + 2} ${selectedPoint.y}`}
                style="fill"
                color={tokens.accent.bronze}
              />
            </>
          ) : null}
        </Canvas>
      </View>

      {/* Rótulos do Eixo X (Datas dos registros) */}
      <View className="flex-row justify-between px-4 mt-2 border-t border-divider pt-2">
        {pontosCoordenadas.length > 0 && (
          <>
            <Texto variant="caption" color="muted" className="text-[10px]">
              {pontosCoordenadas[0].data}
            </Texto>
            <Texto variant="caption" color="muted" className="text-[10px]">
              {pontosCoordenadas[Math.floor(pontosCoordenadas.length / 2)].data}
            </Texto>
            <Texto variant="caption" color="muted" className="text-[10px]">
              {pontosCoordenadas[pontosCoordenadas.length - 1].data}
            </Texto>
          </>
        )}
      </View>
    </View>
  );
}
