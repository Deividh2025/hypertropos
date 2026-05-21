-- Migration 20260520000005_seed_suplementos.sql\n-- Seed de suplementos\n\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'creatina', 'Creatina Monohidratada', NULL, NULL, 
    '3-5 g/dia', false, NULL,
    NULL, 'Aumento das reservas intracelulares de Fosfocreatina, regenerando rapidamente o ATP durante o esforço anaeróbico.', 
    '{"Aumento expressivo na capacidade de repetições","Ganhos de massa magra associados ao treinamento resistido","Maior volume intracelular por osmose"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'whey', 'Whey Protein', NULL, NULL, 
    '[REVISAR: dose]', false, NULL,
    NULL, 'Rápida absorção com alto teor de aminoácidos essenciais, induzindo pico insulínico leve, otimizado para o período peri-treino.', 
    '{"[REVISAR: beneficio]"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'caseina', 'Caseína', NULL, NULL, 
    '30-40 g antes de dormir', false, NULL,
    NULL, 'Lenta taxa de filtragem devido à coagulação no ambiente gástrico, mantendo perfusão crônica de aminoácidos.', 
    '{"Ampliação anabólica no repouso (sono)","Combate ao catabolismo noturno prolongado"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'cafeina', 'Cafeína', NULL, NULL, 
    '3-6 mg/kg, 30-60 min pré-treino', false, NULL,
    NULL, 'Estimulante do sistema nervoso central, bloqueador de adenosina.', 
    '{"Desempenho agudo aprimorado"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'beta_alanina', 'Beta-alanina', NULL, NULL, 
    '3,2-6,4 g/dia', false, NULL,
    NULL, '[REVISAR: mecanismo]', 
    '{"[REVISAR: beneficio]"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'citrulina', 'Citrulina Malato', NULL, NULL, 
    '6-8 g pré-treino', false, NULL,
    NULL, '[REVISAR: mecanismo]', 
    '{"[REVISAR: beneficio]"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'vitamina_d', 'Vitamina D', NULL, NULL, 
    '[REVISAR: dose]', false, NULL,
    NULL, '[REVISAR: mecanismo]', 
    '{"Evidência apenas condicional em caso de deficiência sérica"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'omega3', 'Ômega-3 EPA/DHA', NULL, NULL, 
    '2-3 g/dia', false, NULL,
    NULL, '[REVISAR: mecanismo]', 
    '{"[REVISAR: beneficio]"}', '{"[REVISAR: efeito]"}', '{}',
    false
) ON CONFLICT (id) DO UPDATE SET
    mecanismo_resumido = EXCLUDED.mecanismo_resumido,
    dose_padrao = EXCLUDED.dose_padrao,
    beneficios_documentados = EXCLUDED.beneficios_documentados;