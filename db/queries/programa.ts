import AsyncStorage from '@react-native-async-storage/async-storage';
import { enqueueChange } from '../sync-engine';
import { ProgramaAtivo, SessaoTemplate } from '../../types';
import { supabase } from '../supabase-client';

const ACTIVE_PROGRAM_KEY = 'programa_ativo_cache';

/**
 * Salva um programa completo no armazenamento local (AsyncStorage) e enfileira
 * as alterações para sincronização em background com o Supabase.
 */
export async function salvarPrograma(programa: ProgramaAtivo, perfilId: string): Promise<void> {
  try {
    // 1. Atualizar o cache local imediatamente para consistência instantânea do app
    await AsyncStorage.setItem(ACTIVE_PROGRAM_KEY, JSON.stringify(programa));

    // 2. Colocar na fila de sincronização offline-first (com compatibilidade com o esquema do banco)
    
    // 2.a. Inserir na tabela programa_ativo
    const dbPrograma = {
      id: programa.id,
      perfil_id: perfilId,
      nome: programa.nome,
      split: programa.split_tipo || programa.split || 'full_body',
      data_inicio: programa.data_inicio || new Date().toISOString().split('T')[0],
      ativo: true,
    };
    await enqueueChange('programa_ativo', 'INSERT', dbPrograma);

    // 2.b. Inserir sessoes_template e seus exercicios_prescritos correspondentes
    const sessoes = programa.sessoes || programa.sessoes_template || [];
    for (const sessao of sessoes) {
      const dbSessao = {
        id: sessao.id,
        programa_id: programa.id,
        nome: sessao.nome,
        ordem: sessao.ordem_na_semana,
        dia_referencia: sessao.dia_da_semana || '',
      };
      await enqueueChange('sessoes_template', 'INSERT', dbSessao);

      const exercicios = sessao.exercicios_prescritos || sessao.exercicios || [];
      for (const ep of exercicios) {
        const dbExercicioPrescrito = {
          id: ep.id,
          sessao_template_id: sessao.id,
          exercicio_id: ep.exercicio_id,
          ordem: ep.ordem,
          series_alvo: ep.series_alvo,
          // Tradução do range de repetições para o formato texto '8-12' esperado pelo banco
          reps_alvo: `${ep.reps_alvo_min}-${ep.reps_alvo_max}`,
          rir_alvo: ep.rir_alvo,
          descanso_seg: ep.descanso_segundos,
          notas: ep.notas || '',
        };
        await enqueueChange('exercicios_prescritos', 'INSERT', dbExercicioPrescrito);
      }
    }
  } catch (error) {
    console.error('Erro ao salvar programa:', error);
  }
}

/**
 * Retorna o programa ativo atualmente do cache local do dispositivo.
 * Também inicia uma consulta em background ao Supabase para manter o cache aquecido.
 */
export async function obterProgramaAtivo(): Promise<ProgramaAtivo | null> {
  try {
    // 1. Ler do cache local
    const cachedStr = await AsyncStorage.getItem(ACTIVE_PROGRAM_KEY);
    let cached: ProgramaAtivo | null = cachedStr ? JSON.parse(cachedStr) : null;

    // 2. Consulta de sincronização em background assíncrona (não bloqueia o retorno)
    // Na arquitetura real offline-first, o sync engine cuida disso, mas
    // esta query garante que atualizações do servidor sejam refletidas localmente
    (async () => {
      try {
        const { data, error } = await supabase.from('programa_ativo')
          .select(`
            id, nome, split, data_inicio, data_fim, ativo,
            sessoes:sessoes_template(
              id, nome, ordem, dia_referencia,
              exercicios:exercicios_prescritos(
                id, exercicio_id, ordem, series_alvo, reps_alvo, rir_alvo, descanso_seg, notas
              )
            )
          `)
          .eq('ativo', true)
          .single();

        if (!error && data) {
          const resData = data as any;
          // Converte o retorno relacional do Supabase para as interfaces amigáveis do typescript
          const programaFormatado: ProgramaAtivo = {
            id: resData.id,
            nome: resData.nome,
            split_tipo: resData.split,
            split: resData.split,
            data_inicio: resData.data_inicio,
            data_fim: resData.data_fim,
            semana_atual: 1,
            sessoes: (resData.sessoes || []).map((s: any) => {
              const exerciciosPrescritos = (s.exercicios || []).map((e: any) => {
                const parts = (e.reps_alvo || '8-12').split('-');
                return {
                  id: e.id,
                  exercicio_id: e.exercicio_id,
                  ordem: e.ordem,
                  series_alvo: e.series_alvo,
                  reps_alvo_min: parseInt(parts[0], 10) || 8,
                  reps_alvo_max: parseInt(parts[1], 10) || 12,
                  rir_alvo: e.rir_alvo,
                  descanso_segundos: e.descanso_seg,
                  notas: e.notas,
                };
              });

              return {
                id: s.id,
                nome: s.nome,
                ordem_na_semana: s.ordem,
                dia_da_semana: s.dia_referencia,
                exercicios_prescritos: exerciciosPrescritos,
                exercicios: exerciciosPrescritos,
              };
            }),
          };
          programaFormatado.sessoes_template = programaFormatado.sessoes;
          
          await AsyncStorage.setItem(ACTIVE_PROGRAM_KEY, JSON.stringify(programaFormatado));
        }
      } catch (err) {
        console.error('Falha ao sincronizar programa ativo com Supabase:', err);
      }
    })();

    return cached;
  } catch (error) {
    console.error('Erro ao obter programa ativo:', error);
    return null;
  }
}

/**
 * Retorna a sessão prescrita para um determinado dia da semana.
 * Útil para a tela principal de treino diário do app.
 */
export async function obterSessaoDoDia(diaDaSemana: string): Promise<SessaoTemplate | null> {
  try {
    const programa = await obterProgramaAtivo();
    if (!programa) return null;

    const sessoes = programa.sessoes || programa.sessoes_template || [];
    
    // Normalização das strings de comparação para robustez (ex: 'segunda-feira' vs 'Seg')
    const normalizar = (str: string) => 
      str.toLowerCase()
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '') // remove acentos
         .split('-')[0]; // pega apenas a primeira palavra (ex: 'segunda')

    const diaNormalizado = normalizar(diaDaSemana);

    const sessaoEncontrada = sessoes.find(s => {
      const ref = s.dia_da_semana || s.descricao || '';
      return normalizar(ref).includes(diaNormalizado);
    });

    return sessaoEncontrada || null;
  } catch (error) {
    console.error('Erro ao obter sessão do dia:', error);
    return null;
  }
}
