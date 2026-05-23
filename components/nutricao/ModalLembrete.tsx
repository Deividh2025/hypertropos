import React, { useState } from 'react';
import { View, Modal, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Plus, Minus, Bell } from 'phosphor-react-native';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';

interface ModalLembreteProps {
  visible: boolean;
  onClose: () => void;
  onSalvar: (lembrete: {
    tipo: 'creatina' | 'refeicao_proteica' | 'hora_treino';
    horario: string;
    dias_semana: number[];
  }) => Promise<void>;
}

const DIAS_SEMANA_ABREV = [
  { label: 'D', valor: 0, nome: 'Domingo' },
  { label: 'S', valor: 1, nome: 'Segunda' },
  { label: 'T', valor: 2, nome: 'Terça' },
  { label: 'Q', valor: 3, nome: 'Quarta' },
  { label: 'Q', valor: 4, nome: 'Quinta' },
  { label: 'S', valor: 5, nome: 'Sexta' },
  { label: 'S', valor: 6, nome: 'Sábado' },
];

export function ModalLembrete({ visible, onClose, onSalvar }: ModalLembreteProps) {
  const { tokens } = useTheme();

  const [tipo, setTipo] = useState<'creatina' | 'refeicao_proteica' | 'hora_treino'>('creatina');
  const [hora, setHora] = useState(10);
  const [minuto, setMinuto] = useState(0);
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([1, 2, 3, 4, 5]); // segunda a sexta default
  const [isSalvando, setIsSalvando] = useState(false);

  // Manipulação tátil do horário
  const alterarHora = (incremento: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHora((prev) => {
      let nova = prev + incremento;
      if (nova > 23) nova = 0;
      if (nova < 0) nova = 23;
      return nova;
    });
  };

  const alterarMinuto = (incremento: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMinuto((prev) => {
      let novo = prev + incremento;
      if (novo > 59) novo = 0;
      if (novo < 0) novo = 59;
      return novo;
    });
  };

  // Seleção múltipla de dias da semana
  const toggleDia = (dia: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDiasSelecionados((prev) => {
      if (prev.includes(dia)) {
        // Garante que pelo menos um dia fique selecionado
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== dia);
      } else {
        return [...prev, dia].sort();
      }
    });
  };

  const handleSalvar = async () => {
    if (diasSelecionados.length === 0) return;
    
    setIsSalvando(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const horarioStr = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
    
    try {
      await onSalvar({
        tipo,
        horario: horarioStr,
        dias_semana: diasSelecionados,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-[rgba(0,0,0,0.75)]">
        
        {/* Container Principal do Modal */}
        <View className="bg-canvas border-t border-border-strong rounded-t-lg max-h-[90%] p-6">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-2">
              <Bell size={20} color={tokens.accent.bronze} weight="bold" />
              <Texto variant="h2" color="marble">Novo Lembrete</Texto>
            </View>
            <Pressable 
              onPress={onClose}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              className="w-10 h-10 items-center justify-center rounded-full bg-elevated border border-border-subtle"
            >
              <X size={18} color={tokens.fg.primary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
            
            {/* 1. Seletor de Tipo */}
            <Texto variant="bodyBold" color="secondary" className="mb-3">
              Tipo de Lembrete
            </Texto>
            <View className="flex-row gap-2 mb-6">
              {(['creatina', 'refeicao_proteica', 'hora_treino'] as const).map((t) => {
                const label = t === 'creatina' ? '🧪 Creatina' : t === 'refeicao_proteica' ? '🥩 Refeição' : '💪 Treino';
                const ativo = tipo === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setTipo(t);
                    }}
                    className={`flex-1 py-3 px-2 rounded-sm items-center justify-center border min-h-[48px] ${
                      ativo 
                        ? 'bg-accent-bronze/10 border-accent-bronze' 
                        : 'bg-elevated border-border-subtle'
                    }`}
                  >
                    <Texto variant="captionBold" color={ativo ? 'bronze' : 'secondary'}>
                      {label}
                    </Texto>
                  </Pressable>
                );
              })}
            </View>

            {/* 2. Seletor de Horário Customizado Tátil */}
            <Texto variant="bodyBold" color="secondary" className="mb-3">
              Horário de Disparo
            </Texto>
            <Card className="flex-row justify-center items-center gap-6 py-6 mb-6" elevated>
              
              {/* Horas */}
              <View className="items-center">
                <Pressable
                  onPress={() => alterarHora(1)}
                  className="w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle"
                  hitSlop={15}
                >
                  <Plus size={18} color={tokens.fg.primary} />
                </Pressable>
                <Texto variant="displayL" className="font-mono my-2 tracking-widest text-[40px] leading-[48px]">
                  {String(hora).padStart(2, '0')}
                </Texto>
                <Pressable
                  onPress={() => alterarHora(-1)}
                  className="w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle"
                  hitSlop={15}
                >
                  <Minus size={18} color={tokens.fg.primary} />
                </Pressable>
              </View>

              <Texto variant="displayL" color="muted" className="text-[40px] leading-[48px] mb-8">
                :
              </Texto>

              {/* Minutos */}
              <View className="items-center">
                <Pressable
                  onPress={() => alterarMinuto(5)}
                  className="w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle"
                  hitSlop={15}
                >
                  <Plus size={18} color={tokens.fg.primary} />
                </Pressable>
                <Texto variant="displayL" className="font-mono my-2 tracking-widest text-[40px] leading-[48px]">
                  {String(minuto).padStart(2, '0')}
                </Texto>
                <Pressable
                  onPress={() => alterarMinuto(-5)}
                  className="w-12 h-12 items-center justify-center rounded-full bg-elevated border border-border-subtle"
                  hitSlop={15}
                >
                  <Minus size={18} color={tokens.fg.primary} />
                </Pressable>
              </View>
            </Card>

            {/* 3. Multi-select de Dias da Semana */}
            <Texto variant="bodyBold" color="secondary" className="mb-3">
              Dias da Semana
            </Texto>
            <View className="flex-row justify-between mb-4">
              {DIAS_SEMANA_ABREV.map((dia) => {
                const ativo = diasSelecionados.includes(dia.valor);
                return (
                  <Pressable
                    key={dia.valor}
                    onPress={() => toggleDia(dia.valor)}
                    className={`w-[42px] h-[42px] items-center justify-center rounded-full border ${
                      ativo
                        ? 'bg-accent-bronze border-accent-bronze'
                        : 'bg-elevated border-border-subtle'
                    }`}
                  >
                    <Texto 
                      variant="captionBold" 
                      color={ativo ? 'inverse' : 'secondary'}
                    >
                      {dia.label}
                    </Texto>
                  </Pressable>
                );
              })}
            </View>

          </ScrollView>

          {/* Botões de Ação no Rodapé */}
          <View className="flex-row gap-3 pt-2">
            <Botao
              variant="secondary"
              onPress={onClose}
              className="flex-1 min-h-[48px]"
              disabled={isSalvando}
            >
              Cancelar
            </Botao>
            <Botao
              variant="primary"
              onPress={handleSalvar}
              className="flex-1 min-h-[48px]"
              loading={isSalvando}
            >
              Confirmar
            </Botao>
          </View>

        </View>
      </View>
    </Modal>
  );
}
