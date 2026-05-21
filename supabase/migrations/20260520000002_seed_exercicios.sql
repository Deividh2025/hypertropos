-- Migration 20260520000002_seed_exercicios.sql\n-- Seed dos exercícios listados no Apêndice A\n\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_wall', 'Flexão na parede', '[REVISAR: Wall Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'iniciante', 1, 
    '{"parede"}',
    41, '{"[REVISAR: cotovelo]","[REVISAR: ombro]"}', '{"[REVISAR: cotovelo]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_inclined_table', 'Flexão inclinada em mesa', '[REVISAR: Incline Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'iniciante', 2, 
    '{"mesa"}',
    55, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_knees', 'Flexão de joelhos', '[REVISAR: Knee Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    49, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_standard', 'Flexão padrão', '[REVISAR: Standard Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'intermediario', 3, 
    '{"nenhum"}',
    64, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'A flexão padrão impõe ~64% de carga relativa, sendo equiparável ao supino para hipertrofia do peitoral maior.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_declined_feet_elevated', 'Flexão declinada pés elevados', '[REVISAR: Decline Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'intermediario', 4, 
    '{"cadeira"}',
    74, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_diamond', 'Flexão diamante', '[REVISAR: Diamond Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'intermediario', 4, 
    '{"nenhum"}',
    64, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_deficit', 'Flexão com déficit em livros', '[REVISAR: Deficit Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'avancado', 5, 
    '{"livro"}',
    64, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_archer', 'Archer push-up', '[REVISAR: Archer Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'avancado', 5, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_pseudo_planche', 'Pseudo-planche push-up', '[REVISAR: Pseudo-planche Push-up]', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'avancado', 5, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pike_inclined', 'Pike push-up inclinado', '[REVISAR: Incline Pike Push-up]', 
    'ombros', '{"triceps"}',
    'push_vertical', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pike_standard', 'Pike push-up', '[REVISAR: Pike Push-up]', 
    'ombros', '{"triceps"}',
    'push_vertical', 'intermediario', 3, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    'Configura-se o corpo num formato de V invertido, flexionando os quadris e aproximando as mãos dos pés, verticalizando a angulação do tronco.', '{"Cotovelos devem rastrear uma diagonal de aproximadamente 45 graus com relação às costelas."}', '{"[REVISAR: erro]"}', 
    '', 'A angulação verticaliza o eixo tensional para as porções anterior e média do deltoide e tríceps.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'wall_walk', 'Wall walk', '[REVISAR: Wall Walk]', 
    'ombros', '{"triceps"}',
    'push_vertical', 'intermediario', 4, 
    '{"parede"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pike_feet_elevated', 'Pike push-up com pés elevados', '[REVISAR: Elevated Pike Push-up]', 
    'ombros', '{"triceps"}',
    'push_vertical', 'intermediario', 4, 
    '{"cadeira"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hspu_eccentric', 'Handstand push-up excêntrico contra parede', '[REVISAR: Eccentric HSPU]', 
    'ombros', '{"triceps"}',
    'push_vertical', 'avancado', 5, 
    '{"parede"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hspu_full', 'Handstand push-up completo', '[REVISAR: Full HSPU]', 
    'ombros', '{"triceps"}',
    'push_vertical', 'avancado', 5, 
    '{"parede"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pull_floor_sliding', 'Sliding floor pulldown', '[REVISAR: Sliding Pulldown]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 1, 
    '{"piso_liso","toalha"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    'Em decúbito ventral, pressione palmas das mãos contra toalhas num piso liso e arraste a inércia do corpo simulando um pulldown.', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'Emulação biomecanicamente exata do movimento circular do Pulldown usando a fricção do piso.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_sheet_doorway', 'Remada com lençol na porta', '[REVISAR: Doorway Sheet Row]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_table_inverted', 'Inverted row em mesa', '[REVISAR: Inverted Table Row]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'intermediario', 3, 
    '{"mesa"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    'Sob uma mesa resistente, segure a borda com mãos pronadas ou supinadas e puxe o esterno contra a superfície mantendo os calcanhares no solo.', '{"Retração vigorosa e depressão das escápulas são fundamentais."}', '{"[REVISAR: erro]"}', 
    '', 'Provoca altíssima ativação do latíssimo com a mais baixa carga de cisalhamento lombar comparado a outras remadas.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_doorway_unilateral', 'Doorway row unilateral', '[REVISAR: Unilateral Doorway Row]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'intermediario', 4, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    'No limite vertical de uma porta, trave a borda com uma mão na altura do peito, incline-se e puxe ritmicamente em direção ao batente.', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'Recruta assimetrias e isola mecanicamente cada asa do grande dorsal num estiramento profundo.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'row_feet_elevated', 'Inverted row pés elevados', '[REVISAR: Elevated Inverted Row]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'intermediario', 4, 
    '{"mesa","cadeira"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'reverse_snow_angels', 'Snow angels reverso', '[REVISAR: Reverse Snow Angels]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'Postural isométrico para espessura do meio das costas e ativação dos romboides menores.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'superman', 'Superman', '[REVISAR: Superman]', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: articulacao]"}', '{"[REVISAR: articulacao]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'Extensão combinada da pelve e complexo do ombro ativando os potentes eretores espinhais.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'squat_slow', 'Agachamento livre lento', '[REVISAR: Slow Bodyweight Squat]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 1, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'squat_assisted', 'Agachamento profundo assistido', '[REVISAR: Assisted Deep Squat]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 1, 
    '{"parede"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'lunge', 'Passada/Lunge', '[REVISAR: Forward Lunge]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"medio"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'reverse_lunge', 'Reverse lunge', '[REVISAR: Reverse Lunge]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'split_squat', 'Split squat', '[REVISAR: Split Squat]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'intermediario', 3, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"medio"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'bss_quad_bias', 'Bulgarian Split Squat com viés quadríceps', '[REVISAR: Quad-Biased BSS]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'intermediario', 4, 
    '{"cadeira"}',
    85, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"medio"}'::jsonb,
    'Pé de trás apoiado em uma cadeira, tronco ereto e o joelho avança consideravelmente sobre os dedos do pé da frente.', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'Coloca ~85% da massa corporal sobre a perna frontal com compressão patelofemoral menor que o agachamento livre.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'bss_glute_bias', 'Bulgarian Split Squat com viés glúteo', '[REVISAR: Glute-Biased BSS]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'intermediario', 4, 
    '{"cadeira"}',
    85, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"baixo"}'::jsonb,
    'Pé de trás apoiado, passada mais longa e tronco fletido frontalmente (inclinação pélvica anterógrada) durante a descida.', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'A inclinação fletida recruta a magnitude completa do glúteo máximo e cadeia isquiotibial.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'sissy_squat_assisted', 'Sissy squat assistido', '[REVISAR: Assisted Sissy Squat]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'avancado', 5, 
    '{"parede"}',
    NULL, '{"joelho"}', '{"joelho":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"joelho"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'pistol_assisted', 'Pistol squat assistido', '[REVISAR: Assisted Pistol Squat]', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'avancado', 5, 
    '{"parede"}',
    NULL, '{"joelho"}', '{"joelho":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"joelho"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'glute_bridge', 'Glute bridge', '[REVISAR: Glute Bridge]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'iniciante', 1, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'glute_bridge_unilateral', 'Glute bridge unilateral', '[REVISAR: Single-leg Glute Bridge]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hip_thrust_chair', 'Hip thrust em cadeira', '[REVISAR: Chair Hip Thrust]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 3, 
    '{"cadeira"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hip_thrust_unilateral', 'Hip thrust unilateral', '[REVISAR: Single-leg Hip Thrust]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 3, 
    '{"cadeira"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'single_leg_rdl', 'Single-leg Romanian Deadlift', '[REVISAR: SLRDL]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 4, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'slider_hamstring_curl', 'Slider hamstring curl', '[REVISAR: Slider Hamstring Curl]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 4, 
    '{"piso_liso","toalha"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"medio"}'::jsonb,
    'Eleve a pélvis em decúbito dorsal e, com toalhas sob os pés num piso liso, puxe os calcanhares na direção dos glúteos contra o atrito.', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', 'Recruta os isquiotibiais em estresse isocinético comparável à cadeira flexora devido à fricção prolongada.',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'nordic_assisted', 'Nordic curl assistido', '[REVISAR: Assisted Nordic Curl]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'avancado', 5, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'nordic_full', 'Nordic curl completo', '[REVISAR: Full Nordic Curl]', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'avancado', 5, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: joelho]"}', '{"[REVISAR: joelho]":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_bilateral', 'Calf raise bilateral', '[REVISAR: Bilateral Calf Raise]', 
    'panturrilha', '{}',
    'panturrilha', 'iniciante', 1, 
    '{"nenhum"}',
    NULL, '{"aquiles"}', '{"aquiles":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"aquiles"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_single', 'Calf raise unilateral', '[REVISAR: Single-leg Calf Raise]', 
    'panturrilha', '{}',
    'panturrilha', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"aquiles"}', '{"aquiles":"medio"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"aquiles"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_deficit', 'Calf raise unilateral em déficit', '[REVISAR: Deficit Single-leg Calf Raise]', 
    'panturrilha', '{}',
    'panturrilha', 'intermediario', 3, 
    '{"livro"}',
    NULL, '{"aquiles"}', '{"aquiles":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"aquiles"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'calf_raise_deficit_paused', 'Calf raise unilateral em déficit com pausa de 2s', '[REVISAR: Paused Deficit Single-leg Calf Raise]', 
    'panturrilha', '{}',
    'panturrilha', 'intermediario', 4, 
    '{"livro"}',
    NULL, '{"aquiles"}', '{"aquiles":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"aquiles"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'plank', 'Plank', '[REVISAR: Plank]', 
    'core', '{}',
    'core', 'iniciante', 1, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'plank_rkc', 'Plank RKC com ativação ativa', '[REVISAR: RKC Plank]', 
    'core', '{}',
    'core', 'iniciante', 2, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'hollow_body', 'Hollow body hold', '[REVISAR: Hollow Body Hold]', 
    'core', '{}',
    'core', 'intermediario', 3, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'reverse_crunch', 'Reverse crunch', '[REVISAR: Reverse Crunch]', 
    'core', '{}',
    'core', 'intermediario', 3, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"baixo"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'leg_raise', 'Leg raise', '[REVISAR: Leg Raise]', 
    'core', '{}',
    'core', 'intermediario', 4, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"medio"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'long_lever_plank', 'Long-lever plank', '[REVISAR: Long-lever Plank]', 
    'core', '{}',
    'core', 'avancado', 5, 
    '{"nenhum"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;\nINSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'ab_rollout_towel', 'Ab rollout com toalha', '[REVISAR: Towel Ab Rollout]', 
    'core', '{}',
    'core', 'avancado', 5, 
    '{"piso_liso","toalha"}',
    NULL, '{"[REVISAR: lombar]"}', '{"[REVISAR: lombar]":"alto"}'::jsonb,
    '[REVISAR: descricao_execucao]', '{"[REVISAR: dica]"}', '{"[REVISAR: erro]"}', 
    '', '[REVISAR: frase_cientifica_curta]',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"[REVISAR: contraindicacao]"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;