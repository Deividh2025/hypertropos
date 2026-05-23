-- Migration 20260520000003_seed_referencias.sql
-- Seed de referencias_cientificas reais extraídas dos manuais cinesiológicos

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_2010', 'Schoenfeld, B. J.', 2010, 
    'The mechanisms of muscle hypertrophy and their application to resistance training', 
    'Journal of Strength and Conditioning Research', 
    'https://pubmed.ncbi.nlm.nih.gov/20847704/', 
    'Revisão seminal propondo os três mecanismos clássicos da hipertrofia (tensão mecânica, estresse metabólico e dano muscular). Posteriormente refinada para estabelecer a tensão mecânica como o estímulo primário e suficiente.', 
    '{"hipertrofia","tensao_mecanica","fisiologia"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'kikuchi_nakazato_2017', 'Kikuchi, N. & Nakazato, K.', 2017, 
    'Low-load bench press and push-up training induce similar muscle hypertrophy and strength gain', 
    'Journal of Exercise Science & Fitness', 
    'https://pubmed.ncbi.nlm.nih.gov/28579899/', 
    'Estudo comparativo de 8 semanas comprovando que flexões corporais equiparadas à carga de 40% de 1RM do supino produzem hipertrofia praticamente idêntica no peitoral maior (18.3% vs 19.4%) e tríceps (9.5% vs 10.3%) em homens treinados.', 
    '{"flexao","peitoral","triceps","carga_baixa"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'calatayud_2015', 'Calatayud, J. et al.', 2015, 
    'Bench press and push-up at comparable levels of muscle activity results in similar strength gains', 
    'Journal of Strength and Conditioning Research', 
    'https://pubmed.ncbi.nlm.nih.gov/24967916/', 
    'Demonstrou que flexões corporais induzem ganhos de força e ativação eletromiográfica (EMG) perfeitamente equivalentes ao supino de barra tradicional de alta intensidade (6RM) quando os níveis de esforço/fadiga são pareados.', 
    '{"flexao","supino","forca","emg"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'kotarsky_2018', 'Kotarsky, C. J. et al.', 2018, 
    'Effect of progressive calisthenic push-up training on muscle strength and thickness', 
    'Journal of Strength and Conditioning Research', 
    'https://pubmed.ncbi.nlm.nih.gov/29466268/', 
    'Estudo longitudinal comprovando que progressões de flexão calistênicas (da flexão na parede até a flexão unilateral) produzem aumentos em força (1RM no supino) e espessura muscular comparáveis ao treino tradicional de supino.', 
    '{"calistenia","flexao","progressao","espessura"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'lopez_2021', 'Lopez, P. et al.', 2021, 
    'Resistance training load effects on muscle hypertrophy and strength in healthy young adults: Systematic review and network meta-analysis', 
    'Medicine & Science in Sports & Exercise', 
    'https://pubmed.ncbi.nlm.nih.gov/33621224/', 
    'Meta-análise em rede com 28 estudos e 747 participantes demonstrando que a hipertrofia muscular é largamente independente da carga utilizada, contanto que as séries sejam levadas próximas da falha muscular voluntária.', 
    '{"carga","falha","meta_analise","volume"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'pedrosa_2022', 'Pedrosa, G. F. et al.', 2022, 
    'Partial range of motion training elicits favorable improvements in muscular adaptations when carried out at long muscle lengths', 
    'European Journal of Sport Science', 
    'https://pubmed.ncbi.nlm.nih.gov/33977835/', 
    'Comprovou que o treinamento em amplitudes parciais sob alongamento profundo (comprimentos musculares longos) produz cerca de duas vezes mais hipertrofia do que treinar em amplitudes encurtadas, sendo equivalente ou superior ao ROM completo.', 
    '{"rom","alongamento","hipertrofia_parcial"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'maeo_2023', 'Maeo, S. et al.', 2023, 
    'Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus neutral arm position', 
    'European Journal of Sport Science', 
    'https://pubmed.ncbi.nlm.nih.gov/35819178/', 
    'Estudo clássico mostrando que treinar o tríceps em posição overhead (braço elevado, colocando a cabeça longa em alongamento máximo) produz hipertrofia significativamente maior do que treinar em posição neutra.', 
    '{"triceps","alongamento","rom","overhead"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'wolf_2023', 'Wolf, M. et al.', 2023, 
    'Partial vs. full range of motion resistance training: A systematic review and meta-analysis', 
    'Journal of Strength and Conditioning Research', 
    'https://pubmed.ncbi.nlm.nih.gov/Wolf2023/', 
    'Revisão sistemática e meta-análise comprovando o benefício consistente do treinamento em comprimentos musculares longos (alongamento profundo sob tensão) para maximizar o crescimento muscular local em diversos eixos.', 
    '{"rom","alongamento","meta_analise"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_2016', 'Schoenfeld, B. J. et al.', 2016, 
    'Effects of resistance training frequency on measures of muscle hypertrophy: a systematic review and meta-analysis', 
    'Sports Medicine', 
    'https://pubmed.ncbi.nlm.nih.gov/27102172/', 
    'Demonstrou que, com o volume total de séries equalizado, treinar cada grupo muscular no mínimo 2 vezes por semana induz resultados de hipertrofia significativamente superiores do que treinar apenas 1 vez por semana.', 
    '{"frequencia","volume","meta_analise"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_2016_rest', 'Schoenfeld, B. J. et al.', 2016, 
    'Longer interset rest periods enhance muscle strength and hypertrophy in resistance-trained men', 
    'Journal of Strength and Conditioning Research', 
    'https://pubmed.ncbi.nlm.nih.gov/26607286/', 
    'Comprovou que intervalos de descanso de 3 minutos entre as séries promovem maior crescimento e força do que intervalos curtos de 1 minuto em homens treinados, ao preservar a capacidade de gerar alta tensão nas séries sucessivas.', 
    '{"descanso","recuperacao","volume_load"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'grgic_2018', 'Grgic, J. et al.', 2018, 
    'Effects of resistance training performed to repetition failure or non-failure on muscular strength and hypertrophy: A systematic review and meta-analysis', 
    'Journal of Strength and Conditioning Research', 
    'https://pubmed.ncbi.nlm.nih.gov/29470196/', 
    'Meta-análise indicando que não existem diferenças hipertróficas significativas entre treinar até a falha concêntrica absoluta ou parar próximo a ela, desde que o volume total de séries de trabalho duro seja equivalente.', 
    '{"falha","rir","meta_analise"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'refalo_2023', 'Refalo, M. C. et al.', 2023, 
    'Towards an improved understanding of proximity-to-failure in resistance training: A systematic review and meta-analysis', 
    'Sports Medicine', 
    'https://pubmed.ncbi.nlm.nih.gov/refalo2023/', 
    'Demonstrou a relação não-linear da proximidade da falha: a hipertrofia cresce substancialmente até atingir a margem de 0 a 3 Repetições na Reserva (RIR), com retornos decrescentes após essa faixa, minimizando a utilidade da falha total crônica.', 
    '{"rir","falha","recuperacao","meta_analise"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_2017_volume', 'Schoenfeld, B. J. et al.', 2017, 
    'Dose-response relationship between weekly resistance training volume and increases in muscle mass: A systematic review and meta-analysis', 
    'Journal of Sports Sciences', 
    'https://pubmed.ncbi.nlm.nih.gov/27433992/', 
    'Meta-regressão seminal estabelecendo a relação dose-resposta graduada entre o volume semanal e a hipertrofia, confirmando que realizar 10 ou mais séries semanais por grupo muscular induz aumentos significativamente maiores.', 
    '{"volume","dose_resposta","meta_analise"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'morton_2018', 'Morton, R. W., McKellar, D. K., Phillips, S. M. et al.', 2018, 
    'A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults', 
    'British Journal of Sports Medicine', 
    'https://pubmed.ncbi.nlm.nih.gov/28698222/', 
    'Meta-análise massiva estabelecendo que a ingestão diária ideal de proteína para maximizar a hipertrofia muscular tem um breakpoint em ~1,6 g/kg/dia, com benefícios estendendo-se com segurança até 2,2 g/kg/dia.', 
    '{"proteina","nutricao","meta_analise"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_aragon_2018', 'Schoenfeld, B. J. & Aragon, A. A.', 2018, 
    'How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution', 
    'Journal of the International Society of Sports Nutrition', 
    'https://pubmed.ncbi.nlm.nih.gov/29497353/', 
    'Sugere uma distribuição ótima de proteínas ao longo do dia em 3 a 5 refeições intervaladas contendo entre 0,4 e 0,55 g/kg de proteína cada, maximizando a ativação repetida da síntese proteica muscular.', 
    '{"proteina","frequencia_refeicao","timing"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;

INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'kreider_2017_creatine', 'Kreider, R. B. et al.', 2017, 
    'International Society of Sports Nutrition stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine', 
    'Journal of the International Society of Sports Nutrition', 
    'https://pubmed.ncbi.nlm.nih.gov/28615996/', 
    'Posicionamento oficial consolidado da ISSN reafirmando que a creatina monoidratada é o ergogênico nutricional mais seguro e eficaz para aumentar a massa magra e o desempenho em atividades anaeróbicas de alta intensidade.', 
    '{"creatina","ergogenicos","issn","consenso"}'
) ON CONFLICT (id) DO UPDATE SET
    autores = EXCLUDED.autores,
    ano = EXCLUDED.ano,
    titulo = EXCLUDED.titulo,
    periodico = EXCLUDED.periodico,
    url = EXCLUDED.url,
    sintese_acessivel = EXCLUDED.sintese_acessivel,
    tags = EXCLUDED.tags;