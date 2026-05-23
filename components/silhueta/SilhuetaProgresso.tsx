import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useSilhueta } from '../../hooks/useSilhueta';
import EstatuaSVG from './EstatuaSVG';
import { Texto } from '../ui/Texto';
import { useTheme } from '../../hooks/useTheme';
import { ShieldCheck, Info } from 'phosphor-react-native';

export interface SilhuetaProgressoProps {
  onRegiaoTocada?: (regiao: string) => void;
}

export default function SilhuetaProgresso({ onRegiaoTocada }: SilhuetaProgressoProps) {
  const { tokens } = useTheme();
  const { estadoSilhueta, isLoading } = useSilhueta();
  const [frente, setFrente] = useState(true);
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string | null>(null);

  if (isLoading || !estadoSilhueta) {
    return (
      <View style={[styles.card, styles.center]}>
        <ActivityIndicator size="large" color={tokens.accent.bronze} />
        <Texto variant="body" color="secondary" style={styles.loadingText}>
          Sintonizando anatomia...
        </Texto>
      </View>
    );
  }

  // Mapeador de nomes internos para exibição elegante em português
  const obterNomeExibicao = (id: string) => {
    const baseId = id.replace("_esq", "").replace("_dir", "");
    switch (baseId) {
      case 'peito': return 'Peito';
      case 'costas': return 'Costas';
      case 'ombros': return 'Ombros';
      case 'bracos': return 'Braços';
      case 'quadriceps': return 'Quadríceps';
      case 'posterior': return 'Posterior de Coxa';
      case 'gluteo': return 'Glúteo';
      case 'panturrilha': return 'Panturrilha';
      case 'core': return 'Core / Abdômen';
      default: return id;
    }
  };

  const handleRegiaoTocada = (id: string) => {
    const baseId = id.replace("_esq", "").replace("_dir", "");
    setRegiaoSelecionada(baseId);
    if (onRegiaoTocada) {
      onRegiaoTocada(baseId);
    }
  };

  // Obtém o nível e descrição biológica de destreino real conforme os 28 dias do PRD
  const obterDadosBiologicos = (grupo: string) => {
    const definicao = estadoSilhueta[grupo as keyof typeof estadoSilhueta] as number ?? 0;
    
    let status = 'Destreinado';
    let descricao = 'Sem estímulos significativos nos últimos 28 dias. Fibra muscular lisa.';
    
    if (definicao > 80) {
      status = 'Definição Extrema (Elite)';
      descricao = 'Fibras musculares altamente densas com separação visível. Nível máximo de tônus.';
    } else if (definicao > 50) {
      status = 'Definição Avançada';
      descricao = 'Hipertrofia consistente. Contornos nítidos e ótima resistência muscular.';
    } else if (definicao > 25) {
      status = 'Definição Moderada';
      descricao = 'Tônus muscular ativo. Adaptação biológica em progresso constante.';
    } else if (definicao > 0) {
      status = 'Adaptação Inicial';
      descricao = 'Primeiros estímulos mecânicos detectados. Transição para contorno firme.';
    }

    return { definicao, status, descricao };
  };

  const dadosGrupo = regiaoSelecionada ? obterDadosBiologicos(regiaoSelecionada) : null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Título informativo sutil */}
        <View style={styles.header}>
          <Texto variant="bodyBold" style={styles.title}>
            Mapeamento Muscular 3D
          </Texto>
          <Texto variant="caption" color="muted">
            Toque nos indicadores para analisar as regiões
          </Texto>
        </View>

        {/* Estatua Skia Interativa */}
        <View style={styles.canvasContainer}>
          <EstatuaSVG 
            estado={estadoSilhueta}
            largura={240}
            altura={340}
            frente={frente}
            interativo={true}
            onRegiaoTocada={handleRegiaoTocada}
          />
        </View>

        {/* Toggle Segmentado de Orientação */}
        <View style={styles.toggleContainer}>
          <Pressable 
            onPress={() => setFrente(true)}
            style={[styles.toggleBtn, frente && styles.toggleBtnActive]}
          >
            <Texto 
              variant="caption" 
              style={[styles.toggleBtnText, frente ? styles.toggleBtnTextActive : { color: tokens.text.muted }]}
            >
              Frente
            </Texto>
          </Pressable>
          <Pressable 
            onPress={() => setFrente(false)}
            style={[styles.toggleBtn, !frente && styles.toggleBtnActive]}
          >
            <Texto 
              variant="caption" 
              style={[styles.toggleBtnText, !frente ? styles.toggleBtnTextActive : { color: tokens.text.muted }]}
            >
              Costas
            </Texto>
          </Pressable>
        </View>
      </View>

      {/* Painel de Análise Científica Avançada do Grupo Muscular Selecionado */}
      {regiaoSelecionada && dadosGrupo ? (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelTitleRow}>
              <ShieldCheck size={20} color={tokens.accent.bronze} weight="bold" />
              <Texto variant="h3" style={styles.panelTitle}>
                {obterNomeExibicao(regiaoSelecionada)}
              </Texto>
            </View>
            <Texto variant="captionBold" style={{ color: tokens.accent.bronze }}>
              {dadosGrupo.definicao}% definição
            </Texto>
          </View>

          <Texto variant="caption" style={[styles.statusBadge, { color: tokens.accent.bronze }]}>
            {dadosGrupo.status}
          </Texto>

          <Texto variant="body" color="secondary" style={styles.panelDesc}>
            {dadosGrupo.descricao}
          </Texto>

          <View style={styles.scientificTip}>
            <Info size={14} color={tokens.text.muted} style={styles.tipIcon} />
            <Texto variant="caption" color="muted" style={styles.tipText}>
              Janela biológica de 28 dias com decaimento exponencial após 14 dias sem treino mecânico.
            </Texto>
          </View>
        </View>
      ) : (
        <View style={[styles.panel, styles.panelPlaceholder]}>
          <Texto variant="body" color="muted" style={styles.placeholderText}>
            Selecione uma região da estátua acima para auditar dados de destreino biológico e tônus.
          </Texto>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: '100%',
  },
  card: {
    height: 440,
    backgroundColor: '#1E1B18', // bg-elevated
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  header: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 15,
  },
  canvasContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    zIndex: 10,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#E8DED1',
  },
  panel: {
    backgroundColor: '#1E1B18', // bg-elevated
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  panelPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 13,
    paddingHorizontal: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    paddingBottom: 10,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelTitle: {
    fontSize: 18,
    letterSpacing: -0.5,
  },
  statusBadge: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  panelDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  scientificTip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 14,
  }
});
