import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Texto } from './Texto';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class SkiaErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorMessage: error?.message || 'Erro desconhecido no módulo do Skia' };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('CRITICAL: Erro no rendering do React Native Skia:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={styles.errorFallbackContainer}>
          <Texto variant="caption" color="muted" style={styles.errorText}>
            Visualização Gráfica Indisponível
          </Texto>
          <Texto variant="caption" color="muted" style={styles.subtext}>
            (Erro de carregamento do Skia nativo)
          </Texto>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorFallbackContainer: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#1E1B18',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    minHeight: 180,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
  },
});
