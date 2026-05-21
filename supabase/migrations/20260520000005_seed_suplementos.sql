-- Migration 20260520000005_seed_suplementos.sql\n-- Seed de suplementos\n\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'creatina_monohidratada', 'Creatina Monohidratada', 'creatina', 'A', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    true
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'whey_protein', 'Whey Protein', 'proteina', 'A', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    true
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'caseina', 'Caseína', 'proteina', 'A', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    false
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'cafeina', 'Cafeína', 'cafeina', 'A', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    true
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'beta_alanina', 'Beta-alanina', 'beta_alanina', 'B', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    false
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'citrulina_malato', 'Citrulina Malato', 'citrulina', 'B', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    false
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'vitamina_d', 'Vitamina D', 'vit_d', 'B', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    false
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'omega_3', 'Ômega-3 EPA/DHA', 'omega_3', 'B', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    false
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    'sem_evidencia', 'Suplementos SEM Evidência Forte', 'sem_evidencia', 'C', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    false
) ON CONFLICT (id) DO NOTHING;