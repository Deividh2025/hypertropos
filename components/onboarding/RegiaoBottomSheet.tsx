import React from 'react';
import { View, Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInDown, SlideOutDown, FadeOut } from 'react-native-reanimated';
import { RegiaoCorpo, SeveridadeRestricao } from '../../types/onboarding';
import { Texto } from '../ui/Texto';
import { SelectableCard } from './SelectableCard';
import { Botao } from '../ui/Botao';

interface RegiaoBottomSheetProps {
  visible: boolean;
  regiao: RegiaoCorpo | null;
  onClose: () => void;
  onConfirm: (regiao: RegiaoCorpo, severidade: SeveridadeRestricao) => void;
  onRemove?: (regiao: RegiaoCorpo) => void;
  initialSeveridade?: SeveridadeRestricao;
}

const REGIAO_NOMES: Record<RegiaoCorpo, string> = {
  [RegiaoCorpo.JOELHO_ESQUERDO]: 'Joelho Esquerdo',
  [RegiaoCorpo.JOELHO_DIREITO]: 'Joelho Direito',
  [RegiaoCorpo.QUADRIL]: 'Quadril',
  [RegiaoCorpo.OMBRO_ESQUERDO]: 'Ombro Esquerdo',
  [RegiaoCorpo.OMBRO_DIREITO]: 'Ombro Direito',
  [RegiaoCorpo.COTOVELO_ESQUERDO]: 'Cotovelo Esquerdo',
  [RegiaoCorpo.COTOVELO_DIREITO]: 'Cotovelo Direito',
  [RegiaoCorpo.LOMBAR]: 'Lombar',
  [RegiaoCorpo.CERVICAL]: 'Cervical',
  [RegiaoCorpo.AQUILES_ESQUERDO]: 'Tendão de Aquiles Esquerdo',
  [RegiaoCorpo.AQUILES_DIREITO]: 'Tendão de Aquiles Direito',
};

export function RegiaoBottomSheet({ 
  visible, 
  regiao, 
  onClose, 
  onConfirm,
  onRemove,
  initialSeveridade
}: RegiaoBottomSheetProps) {
  const [selected, setSelected] = React.useState<SeveridadeRestricao | null>(initialSeveridade || null);

  // Update selected when initialSeveridade changes
  React.useEffect(() => {
    setSelected(initialSeveridade || null);
  }, [initialSeveridade, visible]);

  if (!visible || !regiao) return null;

  const handleConfirm = () => {
    if (selected) {
      onConfirm(regiao, selected);
      onClose();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(regiao);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          className="flex-1 bg-black/60"
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          exiting={SlideOutDown}
          className="absolute bottom-0 w-full bg-canvas rounded-t-3xl pt-2 px-6 pb-bottom shadow-overlay"
        >
          <View className="w-12 h-1 bg-border-strong rounded-full self-center mb-6" />
          
          <Texto variant="h2" className="mb-6">
            Restrição em {REGIAO_NOMES[regiao]}
          </Texto>

          <SelectableCard
            title="Apenas predisposição/cuidado"
            description="Leve desconforto ocasional ou cuidado extra necessário."
            selected={selected === 'leve'}
            onPress={() => setSelected('leve')}
          />

          <SelectableCard
            title="Tive dor recente"
            description="Dor moderada que afeta alguns movimentos."
            selected={selected === 'moderada'}
            onPress={() => setSelected('moderada')}
          />

          <SelectableCard
            title="Em recuperação de lesão"
            description="Restrição alta, evitar exercícios que estressem a região."
            selected={selected === 'alta'}
            onPress={() => setSelected('alta')}
          />

          <View className="flex-row gap-4 mt-4 pt-4 pb-4">
            {initialSeveridade && onRemove ? (
              <Botao variant="secondary" className="flex-1" onPress={handleRemove}>
                Remover
              </Botao>
            ) : (
              <Botao variant="secondary" className="flex-1" onPress={onClose}>
                Cancelar
              </Botao>
            )}
            <Botao 
              variant="primary" 
              className="flex-1" 
              disabled={!selected}
              onPress={handleConfirm}
            >
              Confirmar
            </Botao>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
