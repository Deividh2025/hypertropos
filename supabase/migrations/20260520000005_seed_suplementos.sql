-- Migration 20260520000005_seed_suplementos.sql
-- Seed de suplementos baseados nos consensos da ISSN e nos manuais científicos do projeto

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'creatina', 'Creatina Monohidratada', 'creatina', 'A', 
    '3-5 g/dia continuamente', true, '0.07 * peso_kg',
    'Timing de ingestão irrelevante, desde que seja consumida de uso diário e crônico. O consumo pós-treino com carboidratos pode otimizar ligeiramente a captação depletada.', 
    'Aumenta as reservas musculares de Fosfocreatina (PCr). Durante esforços anaeróbicos explosivos, ela doa um grupo fosfato para ressintetizar rapidamente o ADP em ATP, ampliando a capacidade de séries longas calistênicas e promovendo retenção hídrica intracelular anabólica osmótica.', 
    '{"Aumento expressivo nas repetições e volume total de treino","Ganho acelerado de massa muscular magra livre de adiposidade","Aumento do volume celular por hidratação osmótica intra-hídrica","Efeito protetor neurológico e melhora na recuperação depletada"}', 
    '{"Retenção de água intracelular (benéfica para o diâmetro e anabolismo)","Eventual desconforto gastrointestinal leve se ingerida em doses altas sem água suficiente"}', 
    '{"kreider_2017_creatine"}',
    true
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'whey', 'Whey Protein', 'proteina', 'A', 
    '20-40 g por dose, visando atingir de 1,6 a 2,2 g/kg/dia de proteínas', false, NULL,
    'Consumir no pós-treino ou como facilitador de conveniência em qualquer horário do dia para atingir a meta diária proteica.', 
    'Proteína extraída do soro do leite com elevadíssimo valor biológico e rápida absorção gastrointestinal. Fornece uma alta concentração de Aminoácidos Essenciais (EAAs), com destaque para a Leucina, que sinaliza diretamente via cascata enzimática mTORC1 a ativação da síntese de novas proteínas miofibrilares.', 
    '{"Facilita atingir a meta proteica diária com extrema conveniência","Induz o gatilho leucínico para ligar o maquinário anabólico (mTORC1)","Acelera a taxa de reparação e reconstrução das microlesões musculares"}', 
    '{"Desconforto estomacal ou gases em indivíduos com intolerância moderada a severa à lactose (recomenda-se versão isolada ou hidrolisada nestes casos)"}', 
    '{"morton_2018","schoenfeld_aragon_2018"}',
    true
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'caseina', 'Caseína Micelar', 'proteina', 'A', 
    '30-40 g antes de dormir', false, NULL,
    'Ingerir nos 30 a 60 minutos anteriores ao sono noturno.', 
    'Fração proteica do leite de digestão extremamente lenta. Ao entrar em contato com o ambiente ácido do estômago, forma coágulos que liberam aminoácidos de forma gradual na corrente sanguínea (taxa de liberação sustentada por até 7-8 horas), ideal para combater o catabolismo proteico durante o jejum do sono.', 
    '{"Perfusão contínua de aminoácidos durante as horas de jejum noturno","Redução drástica do catabolismo proteico noturno prolongado","Otimização das taxas de reconstrução muscular em repouso basal"}', 
    '{"Desconforto em alérgicos à proteína do leite (caseína) ou intolerantes severos à lactose"}', 
    '{"morton_2018"}',
    true
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'cafeina', 'Cafeína Anidra / Pré-Treino', 'cafeina', 'A', 
    '3-6 mg/kg pré-treino', true, '3 * peso_kg',
    'Consumir 30 a 60 minutos antes da sessão de treinamento.', 
    'Estimulante do sistema nervoso central de rápida absorção. Atua como antagonista competitivo dos receptores de adenosina no cérebro, reduzindo a percepção de esforço, postergando a fadiga central, e aumentando a liberação de catecolaminas que elevam o recrutamento de unidades motoras e a força de contração.', 
    '{"Redução acentuada da fadiga percebida durante séries exaustivas","Aumento agudo na força de contração e na potência neuromuscular","Melhora no foco mental, estado de alerta e energia global da sessão"}', 
    '{"Insônia ou perda de qualidade do sono se ingerida perto do horário de dormir","Taquicardia ou ansiedade leve em indivíduos sensíveis à substância","Desidratação marginal por efeito diurético leve"}', 
    '{"grgic_2018"}',
    true
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'beta_alanina', 'Beta-alanina', 'beta_alanina', 'B', 
    '3,2-6,4 g/dia continuamente', false, NULL,
    'O consumo diário contínuo e fracionado em doses menores (para mitigar a parestesia) é o mais importante, independentemente do horário de treino.', 
    'Aminoácido precursor limitante da síntese de Carnosina intramuscular. O acúmulo contínuo de carnosina atua como um potente tamponador intracelular de íons de hidrogênio (H+), neutralizando a acidose lática que bloqueia a contratilidade muscular durante séries longas calistênicas (>60 segundos).', 
    '{"Tamponamento da acidez muscular prolongando séries calistênicas de altas repetições","Aumento do volume de treino em repetições sob estresse metabólico","Postergação da queimação periférica dolorosa em sets intensos"}', 
    '{"Parestesia (coceira ou formigamento inofensivo na pele) se tomada em dose cheia de uma vez; controlável fracionando a dosagem em porções de 1.6 g"}', 
    '{"refalo_2023"}',
    false
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'citrulina', 'Citrulina Malato', 'citrulina', 'B', 
    '6-8 g pré-treino', false, NULL,
    'Ingerir cerca de 60 minutos antes da sessão de treinamento.', 
    'Precursor endógeno da L-Arginina na via de síntese de Óxido Nítrico (NO). Eleva os níveis de arginina plasmática de forma mais eficaz do que a própria arginina oral. Promove vasodilatação e melhora o fluxo sanguíneo local no tecido sob estresse, acelerando o aporte de nutrientes e a remoção de metabólitos.', 
    '{"Efeito vasodilatador (aumento do bombeamento/pump muscular)","Aumento discreto na capacidade de repetições acumuladas em séries calistênicas avançadas","Redução sutil das dores musculares tardias pós-treino"}', 
    '{"Pode provocar desconforto gastrointestinal leve ou refluxo em doses cheias devido ao caráter ácido do malato"}', 
    '{"refalo_2023"}',
    false
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'vitamina_d', 'Vitamina D3', 'vit_d', 'B', 
    '1.000-4.000 UI/dia continuamente', false, NULL,
    'Consumir preferencialmente junto com uma refeição rica em gorduras saudáveis para maximizar a absorção lipossolúvel.', 
    'Atua como um hormônio esteroide envolvido na transcrição de centenas de genes. Promove a regulação dos canais de cálcio no sarcômero (essencial para a contratilidade de força muscular) e apoia a síntese endógena de hormônios androgênicos. Sua utilidade ergogênica está estritamente condicionada à reversão de estados de deficiência sérica.', 
    '{"Otimização da força e contratilidade de cálcio celular em deficientes","Apoio à síntese hormonal endógena e suporte ao sistema imunológico","Preservação e suporte da saúde e densidade mineral dos ossos"}', 
    '{"Praticamente inexistentes nas faixas posológicas recomendadas; toxicidade por hipercalcemia ocorre apenas em megadoses crônicas extralimitadas"}', 
    '{"morton_2018"}',
    false
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'omega3', 'Ômega-3 EPA/DHA', 'omega_3', 'B', 
    '2-3 g/dia continuamente', false, NULL,
    'Ingerir fracionado junto com as principais refeições do dia.', 
    'Ácidos graxos poli-insaturados que se incorporam à bicamada lipídica da membrana celular. Reduzem a expressão de citocinas pró-inflamatórias (resposta anti-inflamatória sistêmica saudável) e ativam as cascatas de sinalização de sensibilidade anabólica (MPS), reduzindo a dor muscular tardia induzida pelas excêntricas e melhorando a recuperação articular.', 
    '{"Ação anti-inflamatória auxiliando na saúde articular e de tendões","Aceleração da melhora na dor muscular tardia pós-treino (excêntrica)","Suporte cardiovascular geral e otimização da sensibilidade à insulina"}', 
    '{"Refluxo com sabor residual de peixe; mitigado consumindo cápsulas entéricas ou durante as refeições principais"}', 
    '{"morton_2018"}',
    false
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;

INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'sem_evidencia', 'Outros (Sem Evidência Forte)', 'sem_evidencia', 'C', 
    'Não recomendado / Evitar gastos desnecessários', false, NULL,
    'Nenhum', 
    'Substâncias comercialmente populares, mas desprovidas de sustentação empírica ou comprovadamente inertes em indivíduos com ingestão proteica equilibrada. Incluem BCAAs isolados, Glutamina para fins hipertróficos em sadios e pró-hormonais ou estimuladores de testosterona fitoterápicos (ZMA, Tribulus, Fenugreek).', 
    '{"Nenhum benefício hipertrófico direto atestado cientificamente sobre o placebo"}', 
    '{"Gasto financeiro inútil e frustração de expectativa ergogênica"}', 
    '{"morton_2018"}',
    false
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    categoria = EXCLUDED.categoria,
    nivel_evidencia = EXCLUDED.nivel_evidencia,
    dose_padrao = EXCLUDED.dose_padrao,
    dose_dependente_peso = EXCLUDED.dose_dependente_peso,
    dose_formula = EXCLUDED.dose_formula,
    timing_recomendado = EXCLUDED.timing_recomendado,
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    beneficios_documentados = EXCLUDED.beneficios_documentados,
    efeitos_colaterais = EXCLUDED.efeitos_colaterais,
    referencias = EXCLUDED.referencias,
    recomendado_para_perfil = EXCLUDED.recomendado_para_perfil;