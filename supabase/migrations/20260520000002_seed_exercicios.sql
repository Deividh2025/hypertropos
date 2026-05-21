-- Migration 20260520000002_seed_exercicios.sql\n-- Seed dos exercícios listados no Apêndice A\n\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_wall', 'Flexão na parede', 'Wall Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_inclined_table', 'Flexão inclinada em mesa', 'Incline Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_knees', 'Flexão de joelhos', 'Knee Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_standard', 'Flexão padrão', 'Standard Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_declined_feet_elevated', 'Flexão declinada pés elevados', 'Decline Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_diamond', 'Flexão diamante', 'Diamond Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_deficit', 'Flexão com déficit em livros', 'Deficit Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_archer', 'Archer push-up', 'Archer Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_pseudo_planche', 'Pseudo-planche push-up', 'Pseudo-planche Push-up', 'peito', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_horizontal', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pike_inclined', 'Pike push-up inclinado', 'Incline Pike Push-up', 'ombros', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_vertical', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pike_standard', 'Pike push-up', 'Pike Push-up', 'ombros', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_vertical', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'wall_walk', 'Wall walk', 'Wall Walk', 'ombros', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_vertical', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pike_feet_elevated', 'Pike push-up com pés elevados', 'Elevated Pike Push-up', 'ombros', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_vertical', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hspu_eccentric', 'Handstand push-up excêntrico', 'Eccentric Handstand Push-up', 'ombros', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_vertical', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hspu_full', 'Handstand push-up completo', 'Handstand Push-up', 'ombros', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'push_vertical', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pull_floor_sliding', 'Sliding floor pulldown', 'Sliding Floor Pulldown', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_sheet_doorway', 'Remada com lençol na porta', 'Sheet Doorway Row', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_table_inverted', 'Inverted row em mesa', 'Table Inverted Row', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_doorway_unilateral', 'Doorway row unilateral', 'One-arm Doorway Row', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_feet_elevated', 'Inverted row pés elevados', 'Elevated Inverted Row', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'reverse_snow_angels', 'Snow angels reverso', 'Reverse Snow Angels', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'superman', 'Superman', 'Superman', 'costas', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'pull_horizontal', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'squat_slow', 'Agachamento livre lento', 'Bodyweight Squat', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'squat_assisted', 'Agachamento profundo assistido', 'Assisted Squat', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'lunge', 'Passada', 'Lunge', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'reverse_lunge', 'Reverse lunge', 'Reverse Lunge', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'split_squat', 'Split squat', 'Split Squat', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'bss_quad_bias', 'Bulgarian Split Squat (viés quadríceps)', 'Bulgarian Split Squat (Quad)', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'bss_glute_bias', 'Bulgarian Split Squat (viés glúteo)', 'Bulgarian Split Squat (Glute)', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'sissy_squat_assisted', 'Sissy squat assistido', 'Assisted Sissy Squat', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pistol_assisted', 'Pistol squat assistido', 'Assisted Pistol Squat', 'quadriceps', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'joelho_dominante', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'glute_bridge', 'Glute bridge', 'Glute Bridge', 'gluteo', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'glute_bridge_unilateral', 'Glute bridge unilateral', 'Single-leg Glute Bridge', 'gluteo', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hip_thrust_chair', 'Hip thrust em cadeira', 'Chair Hip Thrust', 'gluteo', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hip_thrust_unilateral', 'Hip thrust unilateral', 'Single-leg Hip Thrust', 'gluteo', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'single_leg_rdl', 'Single-leg Romanian Deadlift', 'Single-leg RDL', 'posterior', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'slider_hamstring_curl', 'Slider hamstring curl', 'Slider Hamstring Curl', 'posterior', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'nordic_assisted', 'Nordic curl assistido', 'Assisted Nordic Curl', 'posterior', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'nordic_full', 'Nordic curl completo', 'Nordic Curl', 'posterior', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'quadril_dominante', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_bilateral', 'Calf raise bilateral', 'Bilateral Calf Raise', 'panturrilha', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'panturrilha', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_single', 'Calf raise unilateral', 'Single-leg Calf Raise', 'panturrilha', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'panturrilha', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_deficit', 'Calf raise unilateral em déficit', 'Deficit Single-leg Calf Raise', 'panturrilha', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'panturrilha', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_deficit_paused', 'Calf raise unilateral em déficit (pausa)', 'Paused Deficit Single-leg Calf Raise', 'panturrilha', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'panturrilha', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'plank', 'Plank', 'Plank', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'iniciante', 1, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'plank_rkc', 'Plank RKC', 'RKC Plank', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'iniciante', 2, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hollow_body', 'Hollow body hold', 'Hollow Body Hold', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'reverse_crunch', 'Reverse crunch', 'Reverse Crunch', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'intermediario', 3, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'leg_raise', 'Leg raise', 'Leg Raise', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'long_lever_plank', 'Long-lever plank', 'Long-lever Plank', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'avancado', 4, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'ab_rollout_towel', 'Ab rollout com toalha', 'Towel Ab Rollout', 'core', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    'core', 'avancado', 5, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;