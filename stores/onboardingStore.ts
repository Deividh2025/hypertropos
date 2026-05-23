import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData, RegiaoCorpo, SeveridadeRestricao, HistoricoClinicoOpcao } from '../types/onboarding';
import { Genero, Nivel, NivelAtividade, HorarioTreino, Equipamento } from '../types';

interface OnboardingState {
  data: OnboardingData;
  currentStep: number;
  
  // Setters
  setIdade: (idade: number) => void;
  setGenero: (genero: Genero) => void;
  setPeso: (peso: number) => void;
  setAltura: (altura: number) => void;
  setNivelTreino: (nivel: Nivel) => void;
  setNivelAtividade: (nivel: NivelAtividade) => void;
  setDiasSemana: (dias: number) => void;
  setDuracaoSessao: (duracao: number) => void;
  setHorarioTreino: (horario: HorarioTreino) => void;
  toggleEquipamento: (equipamento: Equipamento) => void;
  
  // Restrições
  addRestricao: (regiao: RegiaoCorpo, severidade: SeveridadeRestricao) => void;
  removeRestricao: (regiao: RegiaoCorpo) => void;
  updateRestricao: (regiao: RegiaoCorpo, severidade: SeveridadeRestricao) => void;
  
  // Histórico Clínico
  togglePredisposicao: (opcao: HistoricoClinicoOpcao) => void;
  setNotaClinica: (nota: string) => void;
  
  // Navegação
  setStep: (step: number) => void;
  
  // Utilitários
  clearOnboarding: () => void;
  isComplete: () => boolean;
}

const initialState: OnboardingData = {
  equipamento_disponivel: [],
  restricoes_articulares: [],
  historico_clinico: [],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      data: initialState,
      currentStep: 1,

      setIdade: (idade) => set((state) => ({ data: { ...state.data, idade } })),
      setGenero: (genero_biologico) => set((state) => ({ data: { ...state.data, genero_biologico } })),
      setPeso: (peso_corporal_kg) => set((state) => ({ data: { ...state.data, peso_corporal_kg } })),
      setAltura: (altura_cm) => set((state) => ({ data: { ...state.data, altura_cm } })),
      setNivelTreino: (nivel) => set((state) => ({ data: { ...state.data, nivel } })),
      setNivelAtividade: (nivel_atividade_extra_treino) => set((state) => ({ data: { ...state.data, nivel_atividade_extra_treino } })),
      setDiasSemana: (dias_disponiveis_semana) => set((state) => ({ data: { ...state.data, dias_disponiveis_semana } })),
      setDuracaoSessao: (duracao_alvo_sessao_min) => set((state) => ({ data: { ...state.data, duracao_alvo_sessao_min } })),
      setHorarioTreino: (horario_preferido_treino) => set((state) => ({ data: { ...state.data, horario_preferido_treino } })),
      
      toggleEquipamento: (equipamento) => set((state) => {
        const atual = state.data.equipamento_disponivel || [];
        const existe = atual.includes(equipamento);
        return {
          data: {
            ...state.data,
            equipamento_disponivel: existe 
              ? atual.filter(e => e !== equipamento)
              : [...atual, equipamento]
          }
        };
      }),

      addRestricao: (regiao, severidade) => set((state) => {
        const restricoes = state.data.restricoes_articulares || [];
        // Se já existe, atualiza
        const index = restricoes.findIndex(r => r.regiao === regiao);
        if (index >= 0) {
          const novas = [...restricoes];
          novas[index] = { regiao, severidade };
          return { data: { ...state.data, restricoes_articulares: novas } };
        }
        return { data: { ...state.data, restricoes_articulares: [...restricoes, { regiao, severidade }] } };
      }),

      removeRestricao: (regiao) => set((state) => ({
        data: {
          ...state.data,
          restricoes_articulares: (state.data.restricoes_articulares || []).filter(r => r.regiao !== regiao)
        }
      })),

      updateRestricao: (regiao, severidade) => set((state) => {
        const restricoes = state.data.restricoes_articulares || [];
        return {
          data: {
            ...state.data,
            restricoes_articulares: restricoes.map(r => r.regiao === regiao ? { regiao, severidade } : r)
          }
        };
      }),

      togglePredisposicao: (opcao) => set((state) => {
        const atual = state.data.historico_clinico || [];
        const existe = atual.includes(opcao);
        return {
          data: {
            ...state.data,
            historico_clinico: existe 
              ? atual.filter(h => h !== opcao)
              : [...atual, opcao]
          }
        };
      }),

      setNotaClinica: (nota_clinica) => set((state) => ({ data: { ...state.data, nota_clinica } })),

      setStep: (currentStep) => set({ currentStep }),

      clearOnboarding: () => set({ data: initialState, currentStep: 1 }),

      isComplete: () => {
        const { data } = get();
        return !!(
          data.idade &&
          data.genero_biologico &&
          data.peso_corporal_kg &&
          data.altura_cm &&
          data.nivel &&
          data.nivel_atividade_extra_treino &&
          data.dias_disponiveis_semana &&
          data.duracao_alvo_sessao_min &&
          data.horario_preferido_treino
        );
      }
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
