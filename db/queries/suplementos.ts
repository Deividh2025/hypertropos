import { obterLinhas, obterLinha } from '../local-cache';
import { Suplemento } from '../../types/suplemento';

const SUPLEMENTOS_FALLBACK: Suplemento[] = [
  {
    id: 'creatina',
    nome: 'Creatina Monohidratada',
    grau_evidencia: 'A',
    dose_recomendada: '3-5 g/dia continuamente (0.07g/kg)',
    horario_recomendado: 'Uso diário contínuo, pós-treino com carboidratos otimiza absorção',
    descricao_curta: 'Aumenta a ressíntese rápida de ATP muscular por meio do sistema de Fosfocreatina.',
    mecanismo_acao: 'Aumenta as reservas musculares de Fosfocreatina (PCr). Durante esforços anaeróbicos explosivos, ela doa um grupo fosfato para ressintetizar rapidamente o ADP em ATP, ampliando a capacidade de séries longas calistênicas e promovendo retenção hídrica intracelular anabólica osmótica.',
    referencias_ids: ['kreider_2017_creatine']
  },
  {
    id: 'whey',
    nome: 'Whey Protein',
    grau_evidencia: 'A',
    dose_recomendada: '20-40 g por dose, ajustado para meta proteica',
    horario_recomendado: 'Pós-treino ou facilitador de conveniência a qualquer hora do dia',
    descricao_curta: 'Proteína de elevadíssimo valor biológico que fornece leucina para ativação do mTORC1.',
    mecanismo_acao: 'Proteína extraída do soro do leite com rápida absorção gastrointestinal. Fornece uma alta concentração de Aminoácidos Essenciais (EAAs), com destaque para a Leucina, que sinaliza diretamente via cascata enzimática mTORC1 a ativação da síntese de novas proteínas miofibrilares.',
    referencias_ids: ['morton_2018', 'schoenfeld_aragon_2018']
  },
  {
    id: 'caseina',
    nome: 'Caseína Micelar',
    grau_evidencia: 'A',
    dose_recomendada: '30-40 g antes do sono noturno',
    horario_recomendado: '30 a 60 minutos antes de dormir',
    descricao_curta: 'Fração proteica do leite de digestão extremamente lenta para liberação gradual.',
    mecanismo_acao: 'Fração proteica do leite de digestão extremamente lenta. Ao entrar em contato com o ambiente ácido do estômago, forma coágulos que liberam aminoácidos de forma gradual na corrente sanguínea (taxa de liberação sustentada por até 7-8 horas), ideal para combater o catabolismo proteico durante o jejum do sono.',
    referencias_ids: ['morton_2018']
  },
  {
    id: 'cafeina',
    nome: 'Cafeína Anidra / Pré-Treino',
    grau_evidencia: 'A',
    dose_recomendada: '3-6 mg/kg pré-treino',
    horario_recomendado: '30 a 60 minutos antes do treino',
    descricao_curta: 'Estimulante do sistema nervoso central que posterga a fadiga e aumenta a força.',
    mecanismo_acao: 'Estimulante do sistema nervoso central de rápida absorção. Atua como antagonista competitivo dos receptores de adenosina no cérebro, reduzindo a percepção de esforço, postergando a fadiga central, e aumentando a liberação de catecolaminas que elevam o recrutamento de unidades motoras e a força de contração.',
    referencias_ids: ['grgic_2018']
  },
  {
    id: 'beta_alanina',
    nome: 'Beta-alanina',
    grau_evidencia: 'B',
    dose_recomendada: '3.2-6.4 g/dia continuamente (fracionado)',
    horario_recomendado: 'Diário contínuo, fracionado para mitigar a parestesia (coceira)',
    descricao_curta: 'Precursor de Carnosina que atua como tamponador contra a acidose lática.',
    mecanismo_acao: 'Aminoácido precursor limitante da síntese de Carnosina intramuscular. O acúmulo contínuo de carnosina atua como um potente tamponador intracelular de íons de hidrogênio (H+), neutralizando a acidose lática que bloqueia a contratilidade muscular durante séries longas calistênicas (>60 segundos).',
    referencias_ids: ['refalo_2023']
  },
  {
    id: 'citrulina',
    nome: 'Citrulina Malato',
    grau_evidencia: 'B',
    dose_recomendada: '6-8 g pré-treino',
    horario_recomendado: '60 minutos antes do início do treino',
    descricao_curta: 'Promove vasodilatação e melhora o fluxo sanguíneo local no tecido sob estresse.',
    mecanismo_acao: 'Precursor endógeno da L-Arginina na via de síntese de Óxido Nítrico (NO). Eleva os níveis de arginina plasmática de forma mais eficaz do que a própria arginina oral. Promove vasodilatação e melhora o fluxo sanguíneo local no tecido sob estresse, acelerando o aporte de nutrientes e a remoção de metabólitos.',
    referencias_ids: ['refalo_2023']
  },
  {
    id: 'vitamina_d',
    nome: 'Vitamina D3',
    grau_evidencia: 'B',
    dose_recomendada: '1.000-4.000 UI/dia continuamente',
    horario_recomendado: 'Consumir junto com uma refeição rica em gorduras saudáveis',
    descricao_curta: 'Suporta a força muscular, densidade óssea e síntese de hormônios androgênicos.',
    mecanismo_acao: 'Atua como um hormônio esteroide envolvido na transcrição de centenas de genes. Promove a regulação dos canais de cálcio no sarcômero (essencial para a contratilidade de força muscular) e apoia a síntese endógena de hormônios androgênicos. Sua utilidade ergogênica está estritamente condicionada à reversão de estados de deficiência sérica.',
    referencias_ids: ['morton_2018']
  },
  {
    id: 'omega3',
    nome: 'Ômega-3 EPA/DHA',
    grau_evidencia: 'B',
    dose_recomendada: '2-3 g/dia continuamente',
    horario_recomendado: 'Fracionado junto com as principais refeições do dia',
    descricao_curta: 'Reduz a inflamação sistêmica e acelera a recuperação das dores musculares.',
    mecanismo_acao: 'Ácidos graxos poli-insaturados que se incorporam à bicamada lipídica da membrana celular. Reduzem a expressão de citocinas pró-inflamatórias (resposta anti-inflamatória sistêmica saudável) e ativam as cascatas de sinalização de sensibilidade anabólica (MPS), reduzindo a dor muscular tardia induzida pelas excêntricas e melhorando a recuperação articular.',
    referencias_ids: ['morton_2018']
  },
  {
    id: 'sem_evidencia',
    nome: 'Outros (Sem Evidência Forte)',
    grau_evidencia: 'C',
    dose_recomendada: 'Não recomendado / Evitar gastos desnecessários',
    horario_recomendado: 'Nenhum',
    descricao_curta: 'Suplementos populares com fins estéticos, mas sem forte respaldo empírico.',
    mecanismo_acao: 'Substâncias comercialmente populares, mas desprovidas de sustentação empírica ou comprovadamente inertes em indivíduos com ingestão proteica equilibrada. Incluem BCAAs isolados, Glutamina para fins hipertróficos em sadios e pró-hormonais ou estimuladores de testosterona fitoterápicos (ZMA, Tribulus, Fenugreek).',
    referencias_ids: ['morton_2018']
  }
];

export async function listarSuplementos(): Promise<Suplemento[]> {
  try {
    const linhas = await obterLinhas<any>('SELECT * FROM suplementos');
    if (linhas && linhas.length > 0) {
      return linhas.map(parseSuplemento);
    }
    return SUPLEMENTOS_FALLBACK;
  } catch (error) {
    console.warn('Usando fallback offline para listar suplementos devido a:', error);
    return SUPLEMENTOS_FALLBACK;
  }
}

export async function obterSuplementoPorId(id: string): Promise<Suplemento | null> {
  try {
    const linha = await obterLinha<any>('SELECT * FROM suplementos WHERE id = ?', [id]);
    if (linha) {
      return parseSuplemento(linha);
    }
    const fallback = SUPLEMENTOS_FALLBACK.find(s => s.id === id);
    return fallback || null;
  } catch (error) {
    console.warn(`Usando fallback offline para obter suplemento ${id} devido a:`, error);
    const fallback = SUPLEMENTOS_FALLBACK.find(s => s.id === id);
    return fallback || null;
  }
}

function parseSuplemento(linha: any): Suplemento {
  return {
    ...linha,
    referencias_ids: linha.referencias_ids 
      ? (typeof linha.referencias_ids === 'string' ? JSON.parse(linha.referencias_ids) : linha.referencias_ids)
      : undefined,
  };
}
