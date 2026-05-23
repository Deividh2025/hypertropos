import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { 
  Canvas, 
  Path, 
  Group, 
  LinearGradient, 
  RadialGradient, 
  vec, 
  Fill, 
  Turbulence 
} from '@shopify/react-native-skia';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useDerivedValue, 
  interpolateColor,
  SharedValue
} from 'react-native-reanimated';
import { EstadoSilhueta } from '../../types/gamificacao';
import { 
  PATH_CORPO_BASE_FRENTE, 
  PATH_CORPO_BASE_COSTAS, 
  PATH_VEIAS_FRENTE,
  PATH_VEIAS_COSTAS,
  PATHS_FRENTE, 
  PATHS_COSTAS,
  PathMuscular
} from './PathsEstatua';

export interface EstatuaSVGProps {
  estado: EstadoSilhueta;
  largura: number;
  altura: number;
  frente?: boolean;
  interativo?: boolean;
  onRegiaoTocada?: (regiao: string) => void;
}

// Definição estática de cores por Tier para interpolação nativa na GPU
const TIER_COLORS = {
  bronze: {
    sombra: '#322418',
    meioTom: '#8E6F4E',
    highlight: '#C19A6B',
    highlightMax: '#FADCB4',
    contorno: '#2A1A0F'
  },
  pedra: {
    sombra: '#4E463C',
    meioTom: '#92887A',
    highlight: '#B8AB9B',
    highlightMax: '#D2C8BC',
    contorno: '#38332E'
  },
  marmore: {
    sombra: '#CFC2B0',
    meioTom: '#EFE6D9',
    highlight: '#F2EAE0',
    highlightMax: '#FFFFFF',
    contorno: '#A39686'
  },
  dourada: {
    sombra: '#5E4620',
    meioTom: '#B8935A',
    highlight: '#D4AF7A',
    highlightMax: '#FFF0B5',
    contorno: '#4A3410'
  }
};

/**
 * Subcomponente especializado para renderizar um path muscular de forma isolada,
 * contendo sua própria lógica de animação GPU via Reanimated + Skia.
 */
function MusculoPath({
  regiao,
  definicao,
  tierIndexAnim,
  tier_atual,
  frente,
  scale
}: {
  regiao: PathMuscular;
  definicao: number;
  tierIndexAnim: SharedValue<number>;
  tier_atual: string;
  frente: boolean;
  scale: number;
}) {
  // 1. Animação suave de 500ms para a definição muscular
  const definicaoAnim = useSharedValue(definicao);
  useEffect(() => {
    definicaoAnim.value = withTiming(definicao, { duration: 500 });
  }, [definicao]);

  // 2. Interpolação nativa das cores de gradiente com base no Tier e na Definição
  const corSombra = useDerivedValue(() => {
    return interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.sombra,
        TIER_COLORS.pedra.sombra,
        TIER_COLORS.marmore.sombra,
        TIER_COLORS.dourada.sombra
      ]
    );
  });

  const corMeioTom = useDerivedValue(() => {
    return interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.meioTom,
        TIER_COLORS.pedra.meioTom,
        TIER_COLORS.marmore.meioTom,
        TIER_COLORS.dourada.meioTom
      ]
    );
  });

  const corHighlight = useDerivedValue(() => {
    const tHighlight = interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.highlight,
        TIER_COLORS.pedra.highlight,
        TIER_COLORS.marmore.highlight,
        TIER_COLORS.dourada.highlight
      ]
    );

    const tHighlightMax = interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.highlightMax,
        TIER_COLORS.pedra.highlightMax,
        TIER_COLORS.marmore.highlightMax,
        TIER_COLORS.dourada.highlightMax
      ]
    );

    // Conforme a definição aumenta (0-100), o highlight atinge seu brilho máximo (extrema tridimensionalidade)
    return interpolateColor(
      definicaoAnim.value / 100,
      [0, 1],
      [tHighlight, tHighlightMax]
    );
  });

  const corContorno = useDerivedValue(() => {
    return interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.contorno,
        TIER_COLORS.pedra.contorno,
        TIER_COLORS.marmore.contorno,
        TIER_COLORS.dourada.contorno
      ]
    );
  });

  // Opacidade do músculo: quanto mais definido, mais visíveis são suas sombras internas e contornos
  const opacidadeMuscular = useDerivedValue(() => {
    return 0.35 + (definicaoAnim.value / 100) * 0.65;
  });

  const espessuraContorno = useDerivedValue(() => {
    // Definição mais alta reduz o contorno geral e melhora o realce de sombras internas
    return 0.8 + (definicaoAnim.value / 100) * 0.4;
  });

  const coresGradiente = useDerivedValue(() => {
    return [corSombra.value, corMeioTom.value, corHighlight.value];
  });

  const coresRadial = useDerivedValue(() => {
    return [corHighlight.value, corMeioTom.value, corSombra.value];
  });

  // Mapeia coordenadas dos vetores de gradiente baseados nas dimensões da região
  const p1 = vec(regiao.centro.x - 20, regiao.centro.y - 20);
  const p2 = vec(regiao.centro.x + 20, regiao.centro.y + 20);

  return (
    <Group opacity={opacidadeMuscular}>
      <Path 
        path={regiao.path}
        style="fill"
      >
        {/* Usamos gradiente radial para Mármore e linear para os demais, provendo a melhor iluminação */}
        {tier_atual === 'marmore' ? (
          <RadialGradient 
            c={vec(regiao.centro.x, regiao.centro.y)}
            r={35}
            colors={coresRadial}
            positions={[0.0, 0.6, 1.0]}
          />
        ) : (
          <LinearGradient 
            start={p1}
            end={p2}
            colors={coresGradiente}
            positions={[0.0, 0.45, 1.0]}
          />
        )}
      </Path>

      <Path 
        path={regiao.path}
        color={corContorno}
        style="stroke"
        strokeWidth={espessuraContorno}
      />
    </Group>
  );
}

export default function EstatuaSVG({
  estado,
  largura,
  altura,
  frente = true,
  interativo = false,
  onRegiaoTocada
}: EstatuaSVGProps) {
  // 1. Calcula a escala ideal mantendo o aspect ratio do viewBox padrão (240x480)
  const scale = useMemo(() => {
    const scaleX = largura / 240;
    const scaleY = altura / 480;
    return Math.min(scaleX, scaleY);
  }, [largura, altura]);

  const dx = (largura - 240 * scale) / 2;
  const dy = (altura - 480 * scale) / 2;

  // 2. Determina o índice de Tier para animação interpolada
  const tierIndex = useMemo(() => {
    switch (estado.tier_atual) {
      case 'bronze': return 0;
      case 'pedra': return 1;
      case 'marmore': return 2;
      case 'dourada': return 3;
      default: return 0;
    }
  }, [estado.tier_atual]);

  const tierIndexAnim = useSharedValue(tierIndex);
  useEffect(() => {
    tierIndexAnim.value = withTiming(tierIndex, { duration: 500 });
  }, [tierIndex]);

  // 3. Define os caminhos ativos com base na direção
  const pathsAtivos = useMemo(() => {
    return frente ? PATHS_FRENTE : PATHS_COSTAS;
  }, [frente]);

  const pathBase = useMemo(() => {
    return frente ? PATH_CORPO_BASE_FRENTE : PATH_CORPO_BASE_COSTAS;
  }, [frente]);

  const pathVeias = useMemo(() => {
    return frente ? PATH_VEIAS_FRENTE : PATH_VEIAS_COSTAS;
  }, [frente]);

  // 4. Animação de cores do contorno corporal base
  const corContornoBase = useDerivedValue(() => {
    return interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.contorno,
        TIER_COLORS.pedra.contorno,
        TIER_COLORS.marmore.contorno,
        TIER_COLORS.dourada.contorno
      ]
    );
  });

  const corPreenchimentoBase = useDerivedValue(() => {
    return interpolateColor(
      tierIndexAnim.value,
      [0, 1, 2, 3],
      [
        TIER_COLORS.bronze.sombra,
        TIER_COLORS.pedra.sombra,
        TIER_COLORS.marmore.meioTom,
        TIER_COLORS.dourada.sombra
      ]
    );
  });

  const coresBase = useDerivedValue(() => {
    return [corPreenchimentoBase.value, corContornoBase.value];
  });

  // Opacidade do shader de ruído para Pedra (só ativa quando tierIndex = 1)
  const noiseOpacity = useDerivedValue(() => {
    // Retorna pico de opacidade em 1.0 (Pedra), senão decai para 0
    const dist = Math.abs(tierIndexAnim.value - 1);
    return Math.max(0, 0.08 - dist * 0.08);
  });

  // Opacidade dos veios de mármore (só ativa quando tierIndex = 2)
  const veiasOpacity = useDerivedValue(() => {
    const dist = Math.abs(tierIndexAnim.value - 2);
    // Base 0.15 a 0.50 dependendo da média de definição muscular geral
    const mediaDefinicao = (
      estado.peito + estado.costas + estado.ombros + estado.bracos + 
      estado.quadriceps + estado.posterior + estado.gluteo + 
      estado.panturrilha + estado.core
    ) / 900; // Normalizado 0 a 1
    
    const maxVeiasOpacity = 0.15 + mediaDefinicao * 0.35;
    return Math.max(0, maxVeiasOpacity - dist * maxVeiasOpacity);
  });

  // Opacidade do brilho de contorno dourado (só ativa quando tierIndex = 3)
  const brilhoDouradoOpacity = useDerivedValue(() => {
    const dist = Math.abs(tierIndexAnim.value - 3);
    return Math.max(0, 0.7 - dist * 0.7);
  });

  // Acessibilidade: Gera o accessibilityLabel dinamicamente baseando-se no estado real do banco
  const labelAcessibilidade = useMemo(() => {
    const muscularInfo = pathsAtivos
      .map(reg => {
        const baseId = reg.id.replace("_esq", "").replace("_dir", "");
        const val = estado[baseId as keyof EstadoSilhueta] as number ?? 0;
        return `${reg.nome}: ${val}%`;
      })
      .join(', ');
    return `Estátua clássica estilo ${estado.tier_atual.toUpperCase()} mostrando ${frente ? 'frente' : 'costas'}. Níveis de definição: ${muscularInfo}.`;
  }, [estado, frente, pathsAtivos]);

  return (
    <View 
      style={[styles.container, { width: largura, height: altura }]}
      accessible={true}
      accessibilityLabel={labelAcessibilidade}
      accessibilityRole="image"
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Group transform={[{ translateX: dx }, { translateY: dy }, { scale: scale }]}>
          
          {/* 1. BRILHO DOURADO DE CONTORNO (Glow efeito dopaminérgico para Dourado) */}
          <Group opacity={brilhoDouradoOpacity}>
            <Path 
              path={pathBase}
              color="#FFF0B5"
              style="stroke"
              strokeWidth={3}
            />
          </Group>

          {/* 2. SILHUETA BASE INTEGRAL DE FUNDO */}
          <Path 
            path={pathBase}
            style="fill"
          >
            <LinearGradient
              start={vec(60, 50)}
              end={vec(180, 430)}
              colors={coresBase}
            />
          </Path>

          <Path 
            path={pathBase}
            color={corContornoBase}
            style="stroke"
            strokeWidth={1.5}
          />

          {/* 3. CAMADA DE MICROTEXTURA DE PEDRA (Shader GPU Turbulência) */}
          <Group blendMode="colorBurn" opacity={noiseOpacity}>
            <Fill>
              <Turbulence freqX={0.35} freqY={0.35} octaves={3} />
            </Fill>
          </Group>

          {/* 4. MÚSCULOS EVOLUTIVOS SOBREPOSTOS */}
          {pathsAtivos.map((regiao) => {
            const baseId = regiao.id.replace("_esq", "").replace("_dir", "");
            const definicao = estado[baseId as keyof EstadoSilhueta] as number ?? 0;

            return (
              <MusculoPath 
                key={regiao.id}
                regiao={regiao}
                definicao={definicao}
                tierIndexAnim={tierIndexAnim}
                tier_atual={estado.tier_atual}
                frente={frente}
                scale={scale}
              />
            );
          })}

          {/* 5. VEIOS DE MÁRMORE SOBREPOSTOS */}
          <Group opacity={veiasOpacity}>
            <Path 
              path={pathVeias}
              color="#9A8E7D"
              style="stroke"
              strokeWidth={0.8}
            />
          </Group>

        </Group>
      </Canvas>

      {/* 6. CAMADA INTERATIVA ACESSÍVEL (TOUCH TARGETS) */}
      {interativo && onRegiaoTocada && (
        <View style={[StyleSheet.absoluteFill, { marginLeft: dx, marginTop: dy, width: 240 * scale, height: 480 * scale }]}>
          {pathsAtivos.map((regiao) => {
            // Garantindo touch targets ≥ 48dp conforme Touch Psychology / HIG
            const size = Math.max(48, 52 * scale);
            const x = regiao.centro.x * scale - size / 2;
            const y = regiao.centro.y * scale - size / 2;

            return (
              <Pressable
                key={regiao.id}
                onPress={() => onRegiaoTocada(regiao.id)}
                style={[
                  styles.touchTarget,
                  {
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                  }
                ]}
                accessibilityLabel={`Mapear grupo muscular: ${regiao.nome}`}
                accessibilityRole="button"
              >
                {/* Pulsação sutil indicando toque disponível no onboarding */}
                <View style={styles.indicatorPulse} />
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  touchTarget: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  indicatorPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C19A6B',
    backgroundColor: 'rgba(193, 154, 107, 0.15)',
    opacity: 0.7,
  }
});
