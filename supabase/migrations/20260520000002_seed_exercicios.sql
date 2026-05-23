-- Migration 20260520000002_seed_exercicios.sql\n-- Seed dos exercícios listados no Apêndice A\n\n
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    grf_percentual, articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    'push_wall', 'Flexão na parede', 'Wall Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'iniciante', 1, 
    '{"parede"}',
    41, '{"cotovelo","ombro","punho"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo"}'::jsonb,
    'Posicione-se em pé de frente para uma parede a uma distância de aproximadamente um braço. Apoie as mãos na parede alinhadas à altura dos ombros e ligeiramente mais afastadas que a largura deles. Mantenha os pés juntos e o core ativo, estabelecendo uma linha reta dos calcanhares à cabeça. Flexione os cotovelos de forma controlada, aproximando o peitoral da parede em um ângulo de 45 graus em relação ao tronco. Empurre a parede de volta de forma contínua para retornar à posição inicial.', '{"Mantenha os cotovelos apontando para baixo e para trás em diagonal, não para os lados.","Mantenha o abdômen e glúteos contraídos para evitar a hiperextensão lombar.","Foque na contração ativa do peitoral na fase concêntrica."}', '{"Abertura excessiva dos cotovelos (ângulo próximo de 90°), gerando sobrecarga acromial.","Projeção anterior excessiva do quadril por falta de contração do core.","Execução com velocidade excessiva, eliminando a tensão excêntrica."}',
    '', 'A flexão na parede impõe ~41% da força de reação do solo (GRF), sendo ideal para o desenvolvimento de padrões motores iniciais e reabilitação capsular (Kikuchi & Nakazato, 2017).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'push_inclined_table', 'Flexão inclinada em mesa', 'Incline Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'iniciante', 2, 
    '{"mesa"}',
    55, '{"cotovelo","ombro","punho"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo"}'::jsonb,
    'Apoie as mãos na borda de uma mesa firme e estável, com os braços estendidos e mãos ligeiramente mais afastadas que a largura dos ombros. Afaste os pés para trás até que o corpo fique inclinado em diagonal, mantendo uma linha reta sólida dos calcanhares à cabeça. Flexione os cotovelos, descendo o peitoral em direção à mesa com controle. Mantenha os cotovelos em ângulo de 45° em relação ao tronco. Empurre a mesa com força para retornar ao início.', '{"Mantenha a escápula retraída durante a fase excêntrica do movimento.","Estabilize a pelve ativando os glúteos e o transverso do abdômen.","Pressione ativamente a borda da mesa para maior estabilidade articular."}', '{"Bater a mesa na região abdominal em vez do peitoral inferior.","Deixar a cabeça projetar-se excessivamente à frente do peito.","Perda de alinhamento pélvico (quadril caído)."}',
    '', 'A flexão inclinada em mesa de 60cm reduz a carga relativa para ~55% da força de reação do solo (GRF), permitindo volume de trabalho adequado para iniciantes (Lopez et al., 2021).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'push_knees', 'Flexão de joelhos', 'Knee Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    49, '{"cotovelo","ombro","punho"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo"}'::jsonb,
    'Fique de joelhos no solo, com as mãos apoiadas um pouco além da largura dos ombros. Desloque o quadril à frente até alinhar as coxas e o tronco em uma linha reta contínua. Flexione os cotovelos a 45°, descendo o peitoral de forma controlada até quase tocar o chão. Mantenha as escápulas estáveis. Empurre o solo de volta para estender os braços completamente.', '{"Use um colchonete sob os joelhos para evitar desconforto patelar.","Não cruze os tornozelos atrás do corpo para evitar rotações pélvicas compensatórias.","Mantenha o pescoço neutro, olhando ligeiramente à frente das mãos no solo."}', '{"Agachar o quadril para trás durante a descida (movimento de quatro apoios).","Hiperextensão da coluna lombar por falta de ativação do core.","Cotovelos muito abertos gerando atrito no manguito rotador."}',
    '', 'Flexionar os joelhos reduz a alavanca corporal, impondo ~49% da força de reação do solo (GRF) e diminuindo o estresse articular inicial (Kikuchi & Nakazato, 2017).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'push_standard', 'Flexão padrão', 'Standard Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'intermediario', 3, 
    '{"nenhum"}',
    64, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"medio","punho":"medio"}'::jsonb,
    'Apoie as mãos no solo em largura ligeiramente superior à dos ombros, estendendo as pernas e apoiando a ponta dos pés. Estabeleça uma prancha corporal rígida com glúteos e abdômen contraídos. Flexione os cotovelos descendo o esterno em direção ao solo de forma controlada até que ele fique a poucos centímetros do chão. Empurre o solo com força para estender totalmente os braços.', '{"Os cotovelos devem apontar para trás formando um ângulo de 45° com o tronco, nunca de 90°.","Pressione ativamente as pontas dos dedos contra o solo para proteger a articulação do punho.","Expire durante a fase concêntrica (subida) e inspire na fase excêntrica (descida)."}', '{"Cair a pelve (hiperextensão da coluna lombar) por fraqueza do transverso do abdômen.","Executar repetições incompletas por falta de amplitude profunda.","Encolher os ombros indevidamente (falta de depressão escapular)."}',
    '', 'A flexão padrão impõe ~64% de carga relativa da força de reação do solo (GRF), sendo equiparável ao supino para hipertrofia do peitoral maior (Calatayud et al., 2015).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'push_declined_feet_elevated', 'Flexão declinada pés elevados', 'Decline Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'intermediario', 4, 
    '{"cadeira"}',
    74, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"alto","punho":"medio"}'::jsonb,
    'Posicione as mãos no chão ligeiramente além da largura dos ombros e apoie os pés elevados sobre uma cadeira ou banco estável. Mantenha o corpo rígido em linha reta e o olhar direcionado ligeiramente à frente no chão. Desça o peitoral controladamente em direção ao solo, mantendo a angulação interna dos cotovelos a 45 graus. Empurre o solo estendendo os cotovelos ativamente.', '{"A elevação dos pés desloca o vetor gravitacional para a porção superior do peito.","Mantenha o pescoço alinhado com a coluna durante toda a execução.","Controle rigidamente a velocidade da descida para otimizar o tempo sob tensão no feixe clavicular."}', '{"Permitir o relaxamento da pelve, que gera compensação e hiperextensão da coluna lombar.","Cotovelos excessivamente projetados para fora, gerando atrito no complexo do ombro.","Encurtamento da amplitude de movimento devido à fadiga neurológica."}',
    '', 'Ao elevar os pés a 60cm, a força de reação do solo (GRF) sobe para ~74% do peso corporal, aumentando a tensão na porção clavicular do peitoral (Maia et al., 2023).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro"}'
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
    'push_diamond', 'Flexão diamante', 'Diamond Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'intermediario', 4, 
    '{"nenhum"}',
    64, '{"cotovelo","ombro","punho"}', '{"cotovelo":"alto","ombro":"medio","punho":"alto"}'::jsonb,
    'Posicione-se em prancha com as mãos centralizadas sob o peitoral, aproximando os indicadores e polegares para formar o desenho de um diamante. Flexione os cotovelos mantendo-os bem rentes às costelas durante toda a descida, aproximando o peitoral da região das mãos. Empurre o solo de volta estendendo os braços.', '{"Mantenha os cotovelos apontando estritamente para trás, maximizando a extensão do cotovelo.","Se sentir dor nos punhos, afaste as mãos ligeiramente mantendo a pegada fechada.","Pressione ativamente as mãos uma contra a outra de forma isométrica durante a execução."}', '{"Cotovelos abrindo lateralmente, sobrecarregando a articulação do punho e ombro.","Não estender completamente os cotovelos no topo, limitando a contração do tríceps.","Deixar o quadril cair em direção ao chão devido ao foco exclusivo nos braços."}',
    '', 'A pegada fechada altera a biomecânica articular, elevando drasticamente a atividade eletromiográfica do tríceps braquial e porção medial do peitoral (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"punho","cotovelo"}'
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
    'push_deficit', 'Flexão com déficit em livros', 'Deficit Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'avancado', 5, 
    '{"livro"}',
    64, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"alto","punho":"medio"}'::jsonb,
    'Posicione as mãos apoiadas sobre duas superfícies elevadas e estáveis (como dois livros grossos ou blocos) ligeiramente além da largura dos ombros. Afaste os pés e firme o core. Flexione os cotovelos descendo o peitoral além do nível das mãos, gerando um alongamento profundo nas fibras do peitoral maior. Empurre de volta até a extensão total.', '{"O déficit permite descer abaixo da linha neutra, aumentando a amplitude ativa.","Foque em sentir o estiramento profundo do peitoral no ponto mais baixo da descida.","Mantenha o movimento altamente controlado na transição excêntrica-concêntrica."}', '{"Descer rápido demais e perder o controle no ponto de estiramento profundo.","Perder a estabilização escapular, gerando rotação anterior dos ombros no ponto baixo.","Usar superfícies instáveis que escorregam ou causam acidentes."}',
    '', 'O treinamento em comprimentos musculares longos proporcionado pelo déficit potencializa a hipertrofia mediada pelo alongamento sob tensão (Pedrosa et al., 2022).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro"}'
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
    'push_archer', 'Archer push-up', 'Archer Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'avancado', 5, 
    '{"nenhum"}',
    78, '{"cotovelo","ombro","punho"}', '{"cotovelo":"alto","ombro":"alto","punho":"medio"}'::jsonb,
    'Abra os braços em uma largura bem superior à da flexão tradicional, com as pontas dos dedos apontando ligeiramente para fora. Mantendo a linha rígida do corpo, desça lateralmente flexionando apenas um braço, enquanto o braço oposto se mantém esticado, servindo como guia lateral. Retorne ao topo empurrando ativamente com o braço flexionado.', '{"Foque em direcionar a maior parte da força de empurrão para o braço flexionado.","O braço esticado deve funcionar apenas como uma muleta estabilizadora de apoio.","Alterne os lados de forma controlada ou execute séries unilaterais completas."}', '{"Flexionar o cotovelo do braço que deveria permanecer totalmente estendido.","Rotação pélvica excessiva para compensar a falta de força unilateral.","Executar o movimento sem controle, caindo sobre a articulação do ombro ativo."}',
    '', 'A flexão arqueiro transfere unilateralmente ~78% da carga relativa sobre o membro de empurrão ativo, gerando sobrecarga progressiva sem pesos (Lopez et al., 2021).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro","cotovelo"}'
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
    'push_pseudo_planche', 'Pseudo-planche push-up', 'Pseudo-planche Push-up', 
    'peito', '{"ombros","triceps"}',
    'push_horizontal', 'avancado', 5, 
    '{"nenhum"}',
    80, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"alto","punho":"alto"}'::jsonb,
    'Posicione-se in prancha com as mãos voltadas para trás ou para os lados. Desloque o centro de gravidade e o tronco à frente de modo que as mãos fiquem alinhadas abaixo da cintura ou abdômen. Mantendo essa inclinação anterior rígida, flexione os cotovelos trazendo-os rentes ao tronco até o peitoral quase tocar o solo. Empurre mantendo o avanço.', '{"A inclinação anterior gera um braço de alavanca maciço sobre os deltoides anteriores.","Mantenha a coluna torácica protraída (arredondada no topo) na posição inicial e final.","Inicie com uma inclinação modesta e avance gradualmente à medida que os punhos se adaptarem."}', '{"Perder o deslocamento anterior (inclinação) durante a descida, voltando à flexão comum.","Hiperextensão lombar por incapacidade de manter a retroversão pélvica ativa.","Dores agudas no punho por falta de mobilidade prévia de flexão dorsal."}',
    '', 'Deslocar o centro de gravidade anterioriza o vetor de torque, resultando em ativação excepcional do deltoide anterior e feixes claviculares do peito (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"punho","ombro"}'
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
    'pike_inclined', 'Pike push-up inclinado', 'Incline Pike Push-up', 
    'ombros', '{"triceps"}',
    'push_vertical', 'iniciante', 2, 
    '{"nenhum"}',
    60, '{"cotovelo","ombro","punho"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo"}'::jsonb,
    'Apoie as mãos sobre uma superfície elevada e firme (como um banco ou mesa baixa). Caminhe com os pés em direção à base até elevar o quadril em formato de V invertido. Flexione os cotovelos trazendo a cabeça à frente das mãos de forma controlada. Empurre a base estendendo os cotovelos e elevando o quadril.', '{"A inclinação inicial reduz a sobrecarga vertical comparada à versão no solo.","Garanta que a cabeça desça à frente das mãos formando a ponta de um triângulo.","Mantenha as pernas esticadas e o quadril fixo no topo."}', '{"Descer o topo da cabeça diretamente entre as mãos, sobrecarregando o acrômio.","Dobrar os joelhos excessivamente em vez de flexionar os quadris.","Perda de alinhamento cervical (olhar para a parede em vez do banco)."}',
    '', 'A flexão pike inclinada oferece transição segura para o padrão de empurrar vertical, reduzindo a força compressiva acromioclavicular (Calatayud et al., 2015).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'pike_standard', 'Pike push-up', 'Pike Push-up', 
    'ombros', '{"triceps"}',
    'push_vertical', 'intermediario', 3, 
    '{"nenhum"}',
    68, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"medio","punho":"medio"}'::jsonb,
    'No solo, adote a posição de V invertido aproximando os pés das mãos e empinando o quadril com o tronco o mais vertical possível. Mantenha os joelhos e cotovelos estendidos. Flexione os cotovelos de forma controlada trazendo a cabeça à frente da linha das mãos no solo. Empurre com força para retornar à posição inicial.', '{"Cotovelos devem rastrear uma diagonal de aproximadamente 45 graus com relação às costelas.","Foque em empurrar o solo para longe, direcionando a força através dos deltoides.","Mantenha o core rígido para evitar compensações e oscilações da pelve."}', '{"Abrir os cotovelos para os lados (ângulo de 90°), gerando estresse e impacto subacromial.","Descer a cabeça diretamente entre as mãos eliminando a trajetória em triângulo.","Arredondamento excessivo da coluna lombar por falta de flexibilidade de isquiotibiais."}',
    '', 'A angulação verticaliza o eixo tensional para as porções anterior e média do deltoide e tríceps, emulando o desenvolvimento com barra (Kotarsky et al., 2018).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro"}'
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
    'wall_walk', 'Wall walk', 'Wall Walk', 
    'ombros', '{"triceps"}',
    'push_vertical', 'intermediario', 4, 
    '{"parede"}',
    85, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"alto","punho":"alto"}'::jsonb,
    'Inicie em posição de flexão padrão com os pés apoiados na base de uma parede sólida. Faça uma flexão e caminhe com as mãos para trás enquanto sobe com os pés pela parede, verticalizando o corpo. Aproxime-se da parede o máximo possível mantendo o core ativado de forma isométrica. Caminhe de volta controladamente.', '{"Foque em manter as escápulas empurradas ativamente para cima (protração e elevação).","Mantenha o core contraído o tempo todo para anular a hiperextensão da coluna.","Execute passos pequenos com as mãos para manter o equilíbrio sob controle."}', '{"Deixar o quadril ceder gerando hiperextensão lombar severa (formato de banana).","Prender a respiração (valsa de Valsalva excessiva) durante a permanência de cabeça para baixo.","Descer de forma rápida ou descontrolada, com risco de queda sobre o pescoço."}',
    '', 'O wall walk recruta maciçamente o trapézio, deltoides e estabilizadores do manguito rotador sob estresse compressivo vertical elevado (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro","punho","cervical"}'
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
    'pike_feet_elevated', 'Pike push-up com pés elevados', 'Elevated Pike Push-up', 
    'ombros', '{"triceps"}',
    'push_vertical', 'intermediario', 4, 
    '{"cadeira"}',
    75, '{"cotovelo","ombro","punho"}', '{"cotovelo":"medio","ombro":"medio","punho":"medio"}'::jsonb,
    'Apoie as pontas dos pés em uma cadeira firme e as mãos no chão. Caminhe com as mãos para trás, flexionando o quadril em 90 graus até que o tronco fique perpendicular ao solo. Mantendo as pernas elevadas, flexione os cotovelos e desça a cabeça à frente das mãos. Empurre o solo estendendo os braços.', '{"A elevação dos pés verticaliza o vetor de carga e aumenta a fração do peso empurrada.","Desça lentamente até o topo da cabeça quase encostar no solo de forma controlada.","Empurre ativamente o solo no topo da repetição para encaixar os ombros."}', '{"Não manter o quadril flexionado a 90 graus, transformando o exercício em uma flexão declinada comum.","Cotovelos abertos para os lados gerando alto estresse compressivo anterior do ombro.","Olhar para o chão de forma tensionada, estressando a musculatura cervical posterior."}',
    '', 'A elevação de pés na flexão pike verticaliza a carga gravitacional a ~75% do peso corporal, gerando alta ativação do deltoide e tríceps (Kotarsky et al., 2018).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro"}'
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
    'hspu_eccentric', 'Handstand push-up excêntrico contra parede', 'Eccentric HSPU', 
    'ombros', '{"triceps"}',
    'push_vertical', 'avancado', 5, 
    '{"parede"}',
    90, '{"cotovelo","ombro","punho"}', '{"cotovelo":"alto","ombro":"alto","punho":"alto"}'::jsonb,
    'Fique em posição de parada de mão (bananeira) com os calcanhares apoiados contra a parede. Com o corpo rígido e calcanhares deslizando sutilmente, execute a descida controlando a queda por 4 a 6 segundos, até que o topo da cabeça toque suavemente o solo. Desça os pés de forma segura e reinicie.', '{"Use um colchonete ou almofada macia sob a cabeça para proteção de impacto capsular.","Desça em trajetória triangular: as mãos formam a base e a cabeça forma o ápice anterior.","Foque em frear ativamente com o tríceps e deltoides em toda a amplitude de descida."}', '{"Descer rápido demais na metade final do movimento por perda de força excêntrica.","Deixar os cotovelos abrirem lateralmente de forma perpendicular à parede.","Bater a cabeça com violência contra o solo por falta de força amortecedora."}',
    '', 'O foco excêntrico sobrecarrega as fibras em comprimentos musculares longos, estimulando síntese miofibrilar mesmo com limitações de força concêntrica (Maeo et al., 2023).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro","punho","cotovelo","cervical"}'
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
    'hspu_full', 'Handstand push-up completo', 'Full HSPU', 
    'ombros', '{"triceps"}',
    'push_vertical', 'avancado', 5, 
    '{"parede"}',
    92, '{"cotovelo","ombro","punho"}', '{"cotovelo":"alto","ombro":"alto","punho":"alto"}'::jsonb,
    'Adote a posição de parada de mão com apoio na parede. Flexione os cotovelos de forma controlada trazendo a cabeça à frente das mãos até o leve toque no solo. Em seguida, empurre o solo de forma explosiva estendendo totalmente os cotovelos e retornando à verticalidade plena.', '{"Mantenha o core rígido de forma isométrica para evitar oscilações pélvicas.","Empurre com força através das palmas das mãos, focando em afastar o chão.","Use a parede apenas como estabilizador leve do equilíbrio dos calcanhares."}', '{"Executar repetições curtas sem encostar a cabeça próximo ao solo.","Curvar excessivamente as costas na subida, convertendo o vetor de carga em supino inclinado.","Perder o controle do equilíbrio e chocar o quadril contra a parede lateral."}',
    '', 'O Handstand Push-up completo impõe ~92% de carga relativa sobre o eixo vertical, representando o ápice biomecânico de empurrar sem pesos (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"ombro","punho","cotovelo","cervical"}'
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
    'pull_floor_sliding', 'Sliding floor pulldown', 'Sliding Pulldown', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 1, 
    '{"piso_liso","toalha"}',
    50, '{"cotovelo","ombro"}', '{"cotovelo":"baixo","ombro":"baixo"}'::jsonb,
    'Deite-se de bruços (decúbito ventral) em um piso liso, com duas toalhas ou panos sob as palmas das mãos com os braços totalmente estendidos à frente. Contraia os glúteos e eretores da espinha de forma isométrica. Pressione as mãos contra as toalhas e use a musculatura das costas para puxar o corpo à frente, arrastando-o no solo. Retorne empurrando o corpo para trás.', '{"Pressione firmemente as palmas das mãos contra o chão para criar a fricção necessária.","Mantenha os ombros deprimidos e ative as asas das costas (latíssimo) ao puxar.","Use a fricção deliberada do solo como regulador da intensidade da remada."}', '{"Dobrar as pernas ou usá-las para ajudar no empuxo do corpo.","Executar o movimento com o pescoço tensionado e hiperextendido à frente.","Realizar no piso áspero, que anula a capacidade de deslizamento fluído das toalhas."}',
    '', 'Este movimento emula biomecanicamente o pulldown usando o atrito dinâmico horizontal como elemento gerador de tensão no latíssimo do dorso (Stuart McGill, 2019).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'row_sheet_doorway', 'Remada com lençol na porta', 'Doorway Sheet Row', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    45, '{"cotovelo","ombro","punho"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo"}'::jsonb,
    'Dê um nó firme no meio de um lençol resistente e trave-o atrás de uma porta sólida trancada. Segure as pontas do lençol com ambas as mãos, apoie os pés próximos à base da porta e incline o corpo para trás até estender totalmente os braços. Realize a remada tracionando o peitoral em direção às mãos com controle. Retorne lentamente.', '{"Aproxime os pés da base da porta para aumentar a inclinação e a sobrecarga gravitacional.","Mantenha o corpo perfeitamente ereto como uma prancha sólida em todas as fases.","Deprima e retraia as escápulas no final da fase concêntrica (puxada)."}', '{"Permitir que o quadril ceda para trás durante a remada (flexão lombar compensatória).","Executar a puxada usando apenas a força do bíceps, sem ativar a musculatura das costas.","Ignorar a segurança do nó e da porta, gerando riscos reais de queda."}',
    '', 'A remada em lençol na porta ativa a musculatura posterior da cintura escapular com cisalhamento espinhal mínimo, ideal para iniciantes (Stuart McGill, 2019).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'row_table_inverted', 'Inverted row em mesa', 'Inverted Table Row', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'intermediario', 3, 
    '{"mesa"}',
    60, '{"cotovelo","ombro","punho","lombar"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo","lombar":"baixo"}'::jsonb,
    'Posicione-se deitado sob uma mesa de jantar muito estável e resistente. Segure a borda com ambas as mãos em pronação ou supinação na largura dos ombros. Mantendo os calcanhares no solo e o corpo totalmente estendido e reto, puxe o esterno contra a superfície inferior da mesa ativando as costas. Desça controladamente até estender os braços.', '{"Mantenha uma retração e depressão escapular vigorosas no pico da contração.","Use a pegada supinada para recrutar mais intensamente o bíceps braquial.","Mantenha o quadril alto e os glúteos ativos em toda a amplitude de movimento."}', '{"Deixar o quadril ceder por falta de ativação dos glúteos e cadeia posterior.","Tocar o abdômen na mesa em vez do peitoral inferior por perda de alinhamento.","Desça soltando o peso sem controle na fase excêntrica do movimento."}',
    '', 'A remada invertida recruta intensamente o latíssimo do dorso e romboides com a menor carga de cisalhamento lombar medida em laboratório (McGill et al., 2019).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'row_doorway_unilateral', 'Doorway row unilateral', 'Unilateral Doorway Row', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'intermediario', 4, 
    '{"nenhum"}',
    50, '{"cotovelo","ombro","punho"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo"}'::jsonb,
    'Fique de pé de lado em relação a um batente de porta aberta. Segure o batente firmemente com uma das mãos na altura do peito, apoie os pés próximos à parede da porta e incline o corpo para trás até estender totalmente o braço ativo. Puxe o corpo em direção ao batente de forma controlada. Retorne estendendo totalmente.', '{"Aproxime os pés do batente para intensificar o braço de alavanca e a resistência.","Use o braço livre para estabilizar e guiar o quadril sem ajudar na puxada.","Controle a rotação do tronco para isolar de forma pura o latíssimo unilateral."}', '{"Puxar rápido demais e bater o ombro contra o batente da porta.","Rotação excessiva e descontrolada da pelve para compensar a fraqueza do dorsal.","Falta de firmeza na pegada, o que pode causar fadiga excessiva e precoce do antebraço."}',
    '', 'Isolar cada lado unilateralmente no batente de porta equilibra assimetrias musculares e aprofunda o estiramento ativo do latíssimo do dorso (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'row_feet_elevated', 'Inverted row pés elevados', 'Elevated Inverted Row', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'intermediario', 4, 
    '{"mesa","cadeira"}',
    70, '{"cotovelo","ombro","punho","lombar"}', '{"cotovelo":"baixo","ombro":"baixo","punho":"baixo","lombar":"baixo"}'::jsonb,
    'Sob uma mesa estável e resistente, segure a borda com as mãos enquanto apoia os calcanhares elevados sobre uma cadeira firme. Alinhe o corpo perfeitamente paralelo ao solo de forma rígida. Realize a puxada tracionando o esterno em direção à mesa. Desça controladamente na fase excêntrica.', '{"Elevar os pés no banco remove a ajuda das pernas e aumenta a carga relativa de tração.","Execute pausas isométricas de 1 a 2 segundos no pico de contração no topo.","Mantenha o peito aberto e a coluna alinhada durante todo o ciclo."}', '{"Pele pélvica caída devido à falta de contração lombar e dos glúteos.","Cotovelos muito abertos gerando estresse na cápsula articular posterior do ombro.","Encurtar a fase de descida, sem estender totalmente os cotovelos."}',
    '', 'A elevação de calcanhares eleva o peso relativo suspenso a ~70% do peso corporal, potencializando a tensão nas fibras dorsais superiores (McGill, 2019).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'reverse_snow_angels', 'Snow angels reverso', 'Reverse Snow Angels', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    10, '{"ombro","cotovelo"}', '{"ombro":"baixo","cotovelo":"baixo"}'::jsonb,
    'Deite-se de bruços com a testa apoiada em um colchonete fino e os braços esticados ao lado do corpo, palmas para baixo. Eleve os braços do solo retraindo as escápulas. Movimente os braços em círculo para a frente até as mãos quase se encontrarem sobre a cabeça. Retorne em arco ao início sem tocar as mãos no chão.', '{"Mantenha as mãos e braços elevados do solo durante todo o trajeto circular.","Foque na contração consciente dos romboides, trapézio e deltoide posterior.","Realize o movimento de forma lenta e cadenciada, maximizando a isometria posterior."}', '{"Hiperestender o pescoço olhando para a frente, tensionando a cervical superior.","Tocar as mãos ou antebraços no solo durante a fase de retorno excêntrico.","Usar impulsos e balanços em vez de força muscular posterior pura e sustentada."}',
    '', 'Este exercício postural dinâmico ativa intensamente os romboides, deltoide posterior e eretores superiores sob tensão gravitacional pura (Pedrosa et al., 2022).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'superman', 'Superman', 'Superman', 
    'costas', '{"biceps"}',
    'pull_horizontal', 'iniciante', 2, 
    '{"nenhum"}',
    15, '{"lombar","ombro"}', '{"lombar":"medio","ombro":"baixo"}'::jsonb,
    'Deite-se de bruços no solo com braços esticados à frente e pernas estendidas atrás. Contraia simultaneamente os eretores espinhais, glúteos e posteriores para elevar o peitoral e as coxas do solo, mantendo o corpo apoiado apenas no abdômen. Pause por 2 segundos no pico e retorne.', '{"Foque em alongar o corpo (esticar à frente e atrás) enquanto realiza a elevação.","Mantenha a cabeça neutra olhando para o solo para evitar sobrecarga cervical.","Execute a descida de forma totalmente controlada e sem despencar contra o chão."}', '{"Dobrar excessivamente os joelhos em vez de elevar a coxa inteira pela articulação do quadril.","Hiperextensão cervical aguda (olhar para cima tensionando o pescoço).","Movimentos rápidos de balanço em vez de contração estática e controlada."}',
    '', 'A extensão combinada da pelve e complexo do ombro gera alta ativação isométrica nos eretores da espinha e multífidos lombares (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"lombar"}'
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
    'squat_slow', 'Agachamento livre lento', 'Slow Bodyweight Squat', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 1, 
    '{"nenhum"}',
    85, '{"joelho","quadril","tornozelo"}', '{"joelho":"baixo","quadril":"baixo","tornozelo":"baixo"}'::jsonb,
    'Fique de pé com os pés afastados na largura dos ombros, pontas ligeiramente apontadas para fora. Inicie a descida projetando o quadril para trás e flexionando os joelhos de forma extremamente lenta (4 segundos de descida), até que as coxas fiquem paralelas ou abaixo da linha do solo. Suba estendendo joelhos de forma contínua.', '{"Mantenha o peito aberto e o tronco o mais verticalizado possível durante toda a execução.","Empurre os joelhos para fora na mesma direção apontada pelas pontas dos pés.","Distribua o peso igualmente sobre toda a planta dos pés (trípode do pé)."}', '{"Desabar o peito à frente flexionando excessivamente a coluna lombar.","Valgo dinâmico (joelhos convergindo para dentro na fase de subida concêntrica).","Retirar os calcanhares do solo devido à falta de mobilidade do tornozelo."}',
    '', 'Controlar deliberadamente a fase excêntrica de descida em 4 segundos aumenta o tempo sob tensão e fadiga de fibras sem cargas extras (Maeo et al., 2023).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'squat_assisted', 'Agachamento profundo assistido', 'Assisted Deep Squat', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 1, 
    '{"parede"}',
    60, '{"joelho","quadril"}', '{"joelho":"baixo","quadril":"baixo"}'::jsonb,
    'Segure levemente em uma estrutura firme (como um batente de porta ou parede) na altura da cintura. Com os pés bem apoiados, realize um agachamento profundo descendo o quadril ao máximo possível de forma controlada. Use a força dos braços apenas para auxiliar no equilíbrio e na subida.', '{"O suporte permite verticalizar totalmente o tronco, focando a tensão no quadríceps.","Desça até a amplitude profunda máxima permitida pela articulação do joelho.","Pressione ativamente os calcanhares contra o solo durante toda a subida concêntrica."}', '{"Usar excessivamente os braços para puxar o corpo, reduzindo o trabalho das pernas.","Deixar os calcanhares subirem mesmo com o apoio estabilizador das mãos.","Não manter os joelhos alinhados com a ponta dos pés na fase profunda."}',
    '', 'O suporte externo reduz a demanda de equilíbrio estabilizador, viabilizando o agachamento profundo com excelente amplitude e segurança articular (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'lunge', 'Passada/Lunge', 'Forward Lunge', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 2, 
    '{"nenhum"}',
    75, '{"joelho","quadril"}', '{"joelho":"medio","quadril":"baixo"}'::jsonb,
    'Fique de pé com pés juntos. Dê um passo largo à frente e flexione ambos os joelhos simultaneamente até que a coxa da perna da frente fique paralela ao solo e o joelho de trás fique a poucos centímetros do chão. Empurre o solo com a perna da frente retornando à posição inicial.', '{"Mantenha o tronco levemente inclinado à frente para maior estabilização mecânica.","O joelho da perna da frente deve seguir o mesmo alinhamento do segundo dedo do pé.","Mantenha os quadris paralelos apontando diretamente à frente durante o passo."}', '{"Dar um passo muito curto, fazendo o calcanhar da perna da frente se elevar do solo.","Bater o joelho de trás contra o chão de forma abrupta e sem controle.","Inclinar o tronco excessivamente para o lado da perna ativa devido a desequilíbrio."}',
    '', 'A passada impõe sobrecarga unilateral alternada dinâmica, ativando intensamente o quadríceps e estabilizadores pélvicos (Kotarsky et al., 2018).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'reverse_lunge', 'Reverse lunge', 'Reverse Lunge', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'iniciante', 2, 
    '{"nenhum"}',
    75, '{"joelho","quadril"}', '{"joelho":"baixo","quadril":"baixo"}'::jsonb,
    'A partir da posição em pé, dê um passo largo para trás de forma controlada. Flexione ambos os joelhos até que o joelho traseiro fique rente ao solo e a coxa frontal fique paralela ao chão. Empurre o solo de volta projetando a força na perna frontal para retornar ao início.', '{"Dar o passo para trás reduz significativamente a força de cisalhamento patelar no joelho.","Projete o peito ligeiramente à frente para otimizar a ativação da cadeia posterior.","Mantenha a base firme distribuindo o peso na perna da frente durante a descida."}', '{"Deixar o quadril rodar externamente durante o passo para trás por falta de estabilidade.","Descer rápido demais de forma desalinhada, perdendo a firmeza na transição concêntrica.","Colocar o pé traseiro diretamente atrás do frontal (falta de largura na passada)."}',
    '', 'O lunge reverso reduz a força compressiva patelofemoral inicial em comparação ao lunge frontal, preservando a articulação do joelho (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'split_squat', 'Split squat', 'Split Squat', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'intermediario', 3, 
    '{"nenhum"}',
    75, '{"joelho","quadril"}', '{"joelho":"medio","quadril":"baixo"}'::jsonb,
    'Adote uma postura de passada estática com um pé avançado à frente e o pé oposto posicionado atrás. Sem mover os pés do solo, flexione os joelhos descendo o quadril na vertical até que a coxa frontal fique paralela ao chão. Empurre com a perna da frente subindo verticalmente.', '{"Mantenha o calcanhar do pé traseiro sempre elevado do solo em todas as fases.","Distribua ~75% de toda a força do empuxo na perna posicionada à frente.","Mantenha os quadris perfeitamente alinhados e apontados diretamente à frente."}', '{"Permitir o joelho frontal desabar para dentro (valgo dinâmico) devido a glúteo fraco.","Deslocar o tronco lateralmente para compensar desequilíbrios na base unilateral.","Não descer na vertical, projetando o corpo diagonalmente à frente e elevando o calcanhar."}',
    '', 'A execução estática unilateral no split squat isola a musculatura agonista com alta ativação proprioceptiva e estabilização pélvica (Lopez et al., 2021).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'bss_quad_bias', 'Bulgarian Split Squat com viés quadríceps', 'Quad-Biased BSS', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'intermediario', 4, 
    '{"cadeira"}',
    85, '{"joelho","quadril"}', '{"joelho":"medio","quadril":"baixo"}'::jsonb,
    'Fique de costas para uma cadeira estável, apoie o peito de um dos pés sobre o assento e posicione a perna da frente a uma distância média. Mantendo o tronco rigorosamente ereto, desça verticalmente flexionando o joelho frontal até que ele avance ligeiramente além da linha dos dedos do pé. Empurre com o quadríceps frontal.', '{"A passada mais curta e tronco ereto direcionam as tensões mecânicas para o quadríceps.","Mantenha o peito aberto e a pelve neutra de forma estável durante o ciclo.","Use o pé de trás na cadeira apenas como um ponto de equilíbrio proprioceptivo leve."}', '{"Descer inclinando o tronco à frente, o que remove a tensão do quadríceps frontal.","Executar em superfície traseira instável ou muito alta, desalinhando o quadril.","Não permitir o avanço controlado do joelho patelar frontal à frente do pé."}',
    '', 'A postura ereta com passada curta eleva a compressão patelar frontal e isola o vasto lateral e reto femoral (Pedrosa et al., 2022).',
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
    'bss_glute_bias', 'Bulgarian Split Squat com viés glúteo', 'Glute-Biased BSS', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'intermediario', 4, 
    '{"cadeira"}',
    85, '{"joelho","quadril"}', '{"joelho":"baixo","quadril":"medio"}'::jsonb,
    'Apoie o pé traseiro na cadeira estável e projete a perna da frente em um passo significativamente longo. Durante a descida do quadril, incline o tronco à frente (cerca de 30 a 45 graus) de forma rígida, mantendo a coluna alinhada. Mantenha a canela da frente quase vertical no ponto baixo. Suba empurrando com o calcanhar.', '{"A inclinação fletida do tronco maximiza o alongamento e recrutamento das fibras do glúteo.","Evite arredondar as costas; a inclinação deve ocorrer unicamente pela articulação do quadril.","Desça até sentir o glúteo e os posteriores da perna da frente se alongarem profundamente."}', '{"Arredondar a coluna lombar (cifose compensatória) ao inclinar o tronco à frente.","Encurtar a passada traseira, empurrando o joelho frontal muito à frente do tornozelo.","Utilizar o membro traseiro elevado para empurrar o corpo para cima na subida."}',
    '', 'A flexão pélvica anteriorizada alonga profundamente o glúteo maior sob carga de ~85% BW na perna ativa frontal (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"quadril","lombar"}'
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
    'sissy_squat_assisted', 'Sissy squat assistido', 'Assisted Sissy Squat', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'avancado', 5, 
    '{"parede"}',
    70, '{"joelho","tornozelo"}', '{"joelho":"alto","tornozelo":"baixo"}'::jsonb,
    'Segure com uma das mãos em uma estrutura firme na altura do peitoral. Eleve-se sobre a ponta dos pés flexionando os joelhos para a frente e projetando o tronco para trás em linha reta firme (dos joelhos aos ombros). Desça os joelhos em direção ao solo com controle absoluto. Empurre estendendo joelhos.', '{"Foque em manter os quadris totalmente estendidos durante toda a execução.","Inicie com amplitudes curtas de movimento até fortalecer a fáscia e tendão patelares.","Use o apoio da mão apenas para estabilizar o equilíbrio no plano de descão."}', '{"Flexionar o quadril (sentar para trás), eliminando toda a tensão no quadríceps e reto femoral.","Realizar de forma explosiva ou descontrolada, com alto risco de impacto capsular interno.","Tentar descer sem aquecimento prévio das articulações do joelho e tornozelos."}',
    '', 'O sissy squat gera máxima tensão de estiramento no reto femoral ao combinar extensão de quadril e flexão profunda de joelho (Maeo et al., 2023).',
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
    'pistol_assisted', 'Pistol squat assistido', 'Assisted Pistol Squat', 
    'quadriceps', '{"gluteo"}',
    'joelho_dominante', 'avancado', 5, 
    '{"parede"}',
    80, '{"joelho","quadril","tornozelo"}', '{"joelho":"alto","quadril":"medio","tornozelo":"baixo"}'::jsonb,
    'Fique em um pé só, com a mão oposta apoiada levemente em uma parede ou suporte firme. Estenda a perna livre à frente. Execute um agachamento profundo unilateral na perna ativa, descendo de forma controlada até onde a mobilidade permitir. Empurre o solo retornando ao topo.', '{"Use o calcanhar da perna ativa firmemente ancorado contra o chão em todas as fases.","O suporte lateral elimina a exigência limitante de equilíbrio, focando o estímulo no quadríceps.","Mantenha o abdômen contraído para estabilizar o tronco no ponto profundo de descida."}', '{"Deixar o calcanhar da perna ativa elevar-se do solo durante a descida profunda.","Valgo dinâmico agudo (joelho ativo desabando para dentro) na transição de subida.","Puxar-se ativamente com as mãos no suporte em vez de usar a musculatura da coxa."}',
    '', 'O suporte neutraliza a barreira proprioceptiva do equilíbrio, permitindo o isolamento neuromuscular unilateral do quadríceps frontal (Lopez et al., 2021).',
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
    'glute_bridge', 'Glute bridge', 'Glute Bridge', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'iniciante', 1, 
    '{"nenhum"}',
    55, '{"lombar","quadril"}', '{"lombar":"baixo","quadril":"baixo"}'::jsonb,
    'Deite-se de costas (decúbito dorsal) com os joelhos flexionados e os pés apoiados no solo próximos aos glúteos. Com os braços estendidos ao lado do corpo, contraia ativamente o core e os glúteos para elevar o quadril até que ele fique alinhado com os joelhos e ombros. Esmerilhe a contração no topo e desça.', '{"Pressione ativamente os calcanhares contra o solo para recrutar a cadeia isquiotibial.","Execute uma retroversão pélvica ativa (encaixar o quadril) no pico da contração.","Evite usar as mãos e braços no chão para empurrar o quadril para cima."}', '{"Hiperextender la coluna lombar (criar arco nas costas) no topo em vez de estender o quadril.","Executar de forma rápida, sem contrair ativamente os glúteos no pico de contração.","Afastar os pés excessivamente à frente, o que retira a dominância mecânica do glúteo."}',
    '', 'A ponte de glúteos ativa a cadeia posterior de forma isolada com excelente segurança e baixo cisalhamento lombar (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'glute_bridge_unilateral', 'Glute bridge unilateral', 'Single-leg Glute Bridge', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'iniciante', 2, 
    '{"nenhum"}',
    75, '{"lombar","quadril"}', '{"lombar":"baixo","quadril":"baixo"}'::jsonb,
    'Em decúbito dorsal com joelhos flexionados, eleve uma das pernas do solo estendendo-a ou mantendo o joelho flexionado. Pressione o calcanhar da perna de apoio firmemente contra o chão e eleve o quadril de forma controlada até alinhar a pelve. Segure 1 segundo no topo e desça lentamente.', '{"Mantenha a pelve perfeitamente nivelada, sem deixar o lado sem apoio desabar lateralmente.","Foque em espremer ativamente o glúteo da perna ativa no ponto mais alto da subida.","Pressione as escápulas contra o solo para estabilizar a cintura escapular superior."}', '{"Rotação lateral ou desalinhamento da pelve por fraqueza do glúteo médio estabilizador.","Uso de impulsos rápidos para subir o quadril em vez de contração controlada unilateral.","Arredondamento cervical por tensionar o pescoço ao subir o quadril."}',
    '', 'O trabalho unilateral isola assimetrias e dobra a carga relativa sobre o glúteo maior e isquiotibiais da perna ativa (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'hip_thrust_chair', 'Hip thrust em cadeira', 'Chair Hip Thrust', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 3, 
    '{"cadeira"}',
    65, '{"lombar","quadril"}', '{"lombar":"baixo","quadril":"baixo"}'::jsonb,
    'Apoie a porção média das costas (região escapular inferior) na beirada de uma cadeira firme ou sofá. Flexione os joelhos e apoie os pés no solo. Desça o quadril de forma controlada mantendo o olhar à frente. Empurre ativamente com os calcanhares elevando o quadril até alinhar o tronco paralelo ao solo.', '{"O apoio elevado das costas aumenta a amplitude de flexão e extensão do quadril.","Mantenha o queixo apontado em direção ao peitoral (olhar fixo à frente) durante todo o ciclo.","Pressione firmemente os calcanhares no solo no ponto de máxima extensão do quadril."}', '{"Olhar para o teto durante a subida, gerando hiperextensão severa da coluna lombar.","Apoiar as costas incorretamente na cadeira, com risco de escorregar ou perder a base.","Não alcançar a extensão pélvica completa por fadiga do glúteo máximo."}',
    '', 'O hip thrust em cadeira otimiza o braço de alavanca para o glúteo maior, gerando excelente tensão na posição encurtada (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'hip_thrust_unilateral', 'Hip thrust unilateral', 'Single-leg Hip Thrust', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 3, 
    '{"cadeira"}',
    80, '{"lombar","quadril"}', '{"lombar":"baixo","quadril":"baixo"}'::jsonb,
    'Apoie a porção média das costas na cadeira e eleve uma perna do solo. Con o pé da perna ativa bem apoiado, desça o quadril lentamente. Empurre com o calcanhar ativo elevando o quadril com força e controle até alinhar a pelve com os ombros de forma horizontal. Pause e desça controladamente.', '{"Estabilize rigidamente o core para prevenir qualquer rotação compensatória do quadril.","A elevação unilateral é uma das melhores ferramentas para hipertrofia isolada do glúteo em casa.","Controle rigorosamente a velocidade da descida excêntrica para maior tempo sob tensão."}', '{"Deixar o quadril da perna suspensa cair lateralmente durante a fase de subida.","Executar o movimento com amplitude reduzida por falta de força pura no membro ativo.","Balançar os braços ou usar força escapular para ajudar no empuxo pélvico."}',
    '', 'A elevação pélvica unilateral proporciona sobrecarga de ~80% BW focada na cadeia posterior, com ativação recorde do glúteo máximo (Lopez et al., 2021).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'single_leg_rdl', 'Single-leg Romanian Deadlift', 'SLRDL', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 4, 
    '{"nenhum"}',
    80, '{"lombar","quadril"}', '{"lombar":"baixo","quadril":"medio"}'::jsonb,
    'Fique em pé em uma perna, mantendo o joelho ativo ligeiramente flexionado (cerca de 15 graus). Flexione o quadril inclinando o tronco à frente de forma reta, enquanto estende a perna livre para trás, paralela ao solo, formando uma linha reta. Desça até sentir os isquiotibiais alongarem. Suba pelo quadril.', '{"Mantenha a coluna vertebral perfeitamente alinhada e reta durante toda a execução.","Projete o quadril para trás como se estivesse tentando fechar uma porta com o glúteo.","Se tiver dificuldade de equilíbrio, execute próximo a uma parede apoiando um dedo levemente."}', '{"Arredondar a coluna lombar durante a descida (cifose espinhal por falta de controle).","Girar o quadril da perna traseira aberta para o lado, perdendo o alinhamento pélvico neutro.","Flexionar excessivamente o joelho da perna ativa, transformando o exercício em um lunge."}',
    '', 'O Romanian Deadlift unilateral estressa intensamente os isquiotibiais em alongamento ativo sob controle excêntrico primário (Pedrosa et al., 2022).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'slider_hamstring_curl', 'Slider hamstring curl', 'Slider Hamstring Curl', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'intermediario', 4, 
    '{"piso_liso","toalha"}',
    60, '{"joelho","quadril","lombar"}', '{"joelho":"medio","quadril":"baixo","lombar":"baixo"}'::jsonb,
    'Em decúbito dorsal, posicione duas toalhas sob os calcanhares em um piso liso. Eleve o quadril na posição de ponte de glúteos. Mantendo o quadril alto, deslize lentamente as pernas para a frente estendendo os joelhos. Em seguida, puxe os calcanhares com força na direção dos glúteos.', '{"Mantenha os glúteos e abdômen contraídos para que o quadril não encoste no chão no ponto final.","Foque na flexão ativa do joelho sob atrito cinético constante no retorno concêntrico.","Controle a fase de deslizamento à frente para um estímulo excêntrico de alta tensão."}', '{"Deixar o quadril despencar no solo no momento em que as pernas se estendem à frente.","Puxar as pernas rápido demais sem controle de atrito no retorno concêntrico.","Sentir dores lombares por falta de contração abdominal estável durante as extensões."}',
    '', 'A remada deslizante de pernas recruta os isquiotibiais com alta ativação eletromiográfica por ação isocinética contra o atrito cinético (Maeo et al., 2023).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'nordic_assisted', 'Nordic curl assistido', 'Assisted Nordic Curl', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'avancado', 5, 
    '{"nenhum"}',
    85, '{"joelho","quadril","lombar"}', '{"joelho":"alto","quadril":"baixo","lombar":"baixo"}'::jsonb,
    'Ajoelhe-se em um colchonete macio com os tornozelos firmemente travados sob uma estrutura pesada (como um sofá ou com a ajuda de um parceiro). Mantendo o corpo reto do joelho à cabeça, incline-se à frente controlando a descida com os isquiotibiais. Use as mãos para empurrar o solo levemente no início do retorno concêntrico.', '{"Mantenha o quadril totalmente estendido e reto, sem flexionar a cintura pélvica à frente.","Use as mãos prontas em posição de flexão para amortecer a queda de forma segura.","Amorteça a queda com os posteriores e dê um empurrão leve no solo para ajudar na subida."}', '{"Dobrar o quadril para trás ao descer (sentar-se), eliminando o estresse mecânico nos isquiotibiais.","Perder o controle total no início da queda por falta de força excêntrica inicial.","Não travar os calcanhares de forma firme, gerando instabilidade articular nos joelhos."}',
    '', 'O Nordic Curl assistido promove alto torque excêntrico na articulação do joelho, estimulando a hipertrofia e prevenindo estiramentos (Schoenfeld, 2024).',
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
    'nordic_full', 'Nordic curl completo', 'Full Nordic Curl', 
    'posterior', '{"gluteo"}',
    'quadril_dominante', 'avancado', 5, 
    '{"nenhum"}',
    95, '{"joelho","quadril","lombar"}', '{"joelho":"alto","quadril":"baixo","lombar":"baixo"}'::jsonb,
    'Ajoelhado com os tornozelos rigidamente travados e corpo perfeitamente reto, incline o tronco à frente controlando a descida unicamente através da força excêntrica dos isquiotibiais até quase tocar o solo. Em seguida, puxe o corpo de volta à verticalidade usando apenas a contração concêntrica dos posteriores.', '{"Esta é uma das variações mais difíceis da calistenia para a cadeia posterior de pernas.","Mantenha a rigidez isométrica total de toda a musculatura do core e glúteos.","Foque em ''puxar o chão com os pés'' para ativar a contracão máxima dos posteriores."}', '{"Flexionar o quadril em qualquer fase do movimento para facilitar a subida concêntrica.","Despencar contra o solo na metade final por perda brusca de controle tensional.","Realizar sem o colchonete de proteção sob as patelas dos joelhos."}',
    '', 'O Nordic Curl completo representa a maior ativação excêntrica de isquiotibiais documentada em literatura científica de força (Schoenfeld, 2024).',
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
    'calf_raise_bilateral', 'Calf raise bilateral', 'Bilateral Calf Raise', 
    'panturrilha', '{}',
    'panturrilha', 'iniciante', 1, 
    '{"nenhum"}',
    100, '{"aquiles","tornozelo"}', '{"aquiles":"baixo","tornozelo":"baixo"}'::jsonb,
    'Fique de pé com os pés afastados na largura dos quadris e braços ao lado do corpo. Contraia as panturrilhas para elevar o corpo sobre as pontas dos pés ao ponto mais alto possível. Segure a contração isométrica por 1 segundo no topo e desça os calcanhares lentamente.', '{"Empurre o solo através da articulação do dedão do pé (primeiro metatarso) para maior eficiência.","Mantenha os joelhos totalmente estendidos para recrutar o músculo gastrocnêmio.","Execute o movimento de forma lenta e cadenciada, mantendo o controle total no topo."}', '{"Usar impulsos e rebotes rápidos (efeito elástico do tendão) sem realizar pausas.","Desviar o apoio lateralmente para os dedos menores (supinação excessiva do pé).","Amplitude de movimento curta por fadiga ou pressa na execução."}',
    '', 'A elevação bilateral de panturrilhas desenvolve o padrão neuromotor inicial e fortalece a fáscia plantar (Kikuchi & Nakazato, 2017).',
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
    'calf_raise_single', 'Calf raise unilateral', 'Single-leg Calf Raise', 
    'panturrilha', '{}',
    'panturrilha', 'iniciante', 2, 
    '{"nenhum"}',
    100, '{"aquiles","tornozelo"}', '{"aquiles":"medio","tornozelo":"baixo"}'::jsonb,
    'Fique em um pé só no solo, com o pé oposto flexionado atrás. Se necessário, apoie um dedo levemente na parede para manter o equilíbrio. Realize a flexão plantar completa elevando o calcanhar ao ponto máximo. Segure 1 segundo no topo e desça de forma controlada.', '{"A execução unilateral dobra a carga relativa do corpo sobre a panturrilha ativa.","Mantenha o joelho da perna ativa totalmente reto em todas as fases da elevação.","Foque em contrair ativamente o ventre da panturrilha na fase concêntrica máxima."}', '{"Dobrar o joelho ativo durante a subida, usando a força do quadríceps para ajudar.","Puxar-se ativamente na parede em que deveria apenas apoiar o equilíbrio leve.","Movimento rápido que ignora a fase isométrica no pico de contração."}',
    '', 'A elevação unilateral impõe 100% BW sobre o complexo sóleo-gastrocnêmio, promovendo alta tensão mecânica (Lopez et al., 2021).',
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
    'calf_raise_deficit', 'Calf raise unilateral em déficit', 'Deficit Single-leg Calf Raise', 
    'panturrilha', '{}',
    'panturrilha', 'intermediario', 3, 
    '{"livro"}',
    100, '{"aquiles","tornozelo"}', '{"aquiles":"alto","tornozelo":"medio"}'::jsonb,
    'Posicione a metade anterior do pé ativo na beirada de um degrau firme ou livro grosso estável, deixando o calcanhar suspenso no ar. Realize uma dorsiflexão profunda descendo o calcanhar abaixo do nível do degrau para alongamento máximo. Suba até a extensão total.', '{"Desça o calcanhar ao limite máximo permitido pela mobilidade para alongar profundamente.","Realize uma subida explosiva e mantenha o topo por 1 segundo.","Apoie-se suavemente em uma parede para focar unicamente na panturrilha."}', '{"Não descer o calcanhar abaixo da linha do degrau, eliminando o déficit e a fase alongada.","Realizar rebotes rápidos no ponto baixo aproveitando o reflexo de estiramento miotático.","Girar o tornozelo para fora durante a subida (supinação descontrolada do retropé)."}',
    '', 'O treinamento em déficit alonga profundamente o gastrocnêmio, estimulando hipertrofia superior pelo comprimento muscular longo (Pedrosa et al., 2022).',
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
    'calf_raise_deficit_paused', 'Calf raise unilateral em déficit com pausa de 2s', 'Paused Deficit Single-leg Calf Raise', 
    'panturrilha', '{}',
    'panturrilha', 'intermediario', 4, 
    '{"livro"}',
    100, '{"aquiles","tornozelo"}', '{"aquiles":"alto","tornozelo":"medio"}'::jsonb,
    'Na beirada do degrau com calcanhar suspenso em um pé só, desça ao alongamento máximo profundo e mantenha a posição de forma totalmente estática e imóvel por exatos 2 segundos (pausa). Em seguida, empurre subindo até o topo e contraia mais 1 segundo.', '{"A pausa de 2 segundos no alongamento dissipa a energia elástica do tendão de Aquiles.","Esta dissipação força a panturrilha a gerar tensão contrátil pura na subida concêntrica.","Mantenha o corpo ereto e a canela alinhada em todas as repetições."}', '{"Ignorar ou encurtar a pausa estática de 2 segundos no ponto de máximo alongamento profundo.","Balançar o tronco para a frente para gerar empuxo inercial no degrau.","Amplitude incompleta na fase concêntrica superior por fadiga muscular."}',
    '', 'Pausar por 2s anula o reflexo elástico do tendão, forçando o gastrocnêmio a sustentar tensão mecânica pura e ativa (Schoenfeld, 2024).',
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
    'plank', 'Plank', 'Plank', 
    'core', '{}',
    'core', 'iniciante', 1, 
    '{"nenhum"}',
    64, '{"lombar","ombro"}', '{"lombar":"baixo","ombro":"baixo"}'::jsonb,
    'Apoie os antebraços no solo alinhados abaixo dos ombros. Estenda as pernas apoiando as pontas dos pés. Mantenha os cotovelos a 90 graus e contraia ativamente o core, glúteos e pernas para formar uma linha horizontal rígida da cabeça aos calcanhares. Sustente de forma isométrica.', '{"Evite deixar a cabeça cair, mantenha o olhar neutro direcionado entre as mãos.","Foque em empurrar os cotovelos contra o solo para manter as escápulas estáveis.","Mantenha a pelve neutra ou com uma leve retroversão pélvica ativa."}', '{"Deixar o quadril ceder em direção ao solo (formato de ponte invertida com dor lombar).","Elevar excessivamente o quadril para cima para aliviar a carga sobre o abdômen.","Reter a respiração (bloqueio respiratório completo) durante a isometria."}',
    '', 'A prancha clássica promove alto recrutamento isométrico estável do reto abdominal e transverso (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'plank_rkc', 'Plank RKC com ativação ativa', 'RKC Plank', 
    'core', '{}',
    'core', 'iniciante', 2, 
    '{"nenhum"}',
    68, '{"lombar","ombro"}', '{"lombar":"baixo","ombro":"medio"}'::jsonb,
    'Em posição de prancha tradicional nos antebraços, entrelace as mãos. Caminhe levemente com os pés para trás e posicione os cotovelos um pouco à frente da linha dos ombros. Contraia ativamente os glúteos e abdômen, e tente puxar isométrica e violentamente os cotovelos em direção aos pés.', '{"Esta contração ativa de aproximação puxando cotovelos e pés eleva a intensidade drástica do core.","Mantenha uma retroversão pélvica ativa máxima (esmagar os glúteos) durante todo o ciclo.","A RKC plank foca na intensidade muscular extrema, não na duração prolongada de tempo."}', '{"Ignorar a contração isométrica ativa puxando pés e cotovelos simultaneamente.","Perder o alinhamento da pelve por fraqueza diante da alta tensão gerada.","Sustentar por tempo prolongado perdendo a rigidez técnica e ativa exigida."}',
    '', 'A prancha RKC gera ativação eletromiográfica do reto abdominal e oblíquos até 4 vezes superior à prancha comum (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'hollow_body', 'Hollow body hold', 'Hollow Body Hold', 
    'core', '{}',
    'core', 'intermediario', 3, 
    '{"nenhum"}',
    35, '{"lombar"}', '{"lombar":"baixo"}'::jsonb,
    'Deitado de costas no solo, estenda os braços atrás da cabeça e pernas esticadas à frente. Contraia o abdômen para colar a coluna lombar firmemente contra o chão. Eleve ligeiramente os ombros, braços e pernas do solo, formando uma curvatura em formato de canoa. Sustente de forma isométrica estável.', '{"A coluna lombar deve permanecer 100% do tempo colada contra o solo (flat back).","Se a lombar descolar do chão, flexione levemente os joelhos ou eleve mais as pernas.","Aponte as pontas dos pés à frente e mantenha os braços colados ao lado das orelhas."}', '{"Deixar a coluna lombar arquear e descolar do solo por fraqueza do transverso abdominal.","Tensionar excessivamente o pescoço curvando a cabeça à frente em direção ao peito.","Executar com pernas muito baixas sem o controle prévio de estabilização da pelve."}',
    '', 'O Hollow Body estabiliza dinamicamente a pelve em retroversão ativa, blindando a coluna lombar contra cisalhamentos (Stuart McGill, 2019).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"lombar"}'
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
    'reverse_crunch', 'Reverse crunch', 'Reverse Crunch', 
    'core', '{}',
    'core', 'intermediario', 3, 
    '{"nenhum"}',
    30, '{"lombar"}', '{"lombar":"baixo"}'::jsonb,
    'Deite-se de costas com braços ao lado do corpo e joelhos flexionados a 90 graus com pés elevados. Contraia o abdômen inferior para girar a pelve para trás, elevando o quadril levemente do solo em direção ao peitoral. Mantenha os joelhos flexionados. Retorne lentamente estendendo o quadril.', '{"O movimento deve ser focado na rotação pélvica posterior, não apenas em chutar as pernas.","Controle rigidamente a descida do quadril de volta ao solo de forma lenta.","Mantenha a cabeça e os ombros relaxados e apoiados contra o chão."}', '{"Usar impulsos e balanços de pernas para erguer o quadril, eliminando o trabalho abdominal.","Despencar o quadril contra o solo de forma rápida e sem controle na excêntrica.","Pressionar os braços contra o solo com força excessiva para ajudar na flexão pélvica."}',
    '', 'O reverse crunch foca no reto abdominal com ênfase na porção infraumbilical através da flexão pélvica reversa (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{}'
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
    'leg_raise', 'Leg raise', 'Leg Raise', 
    'core', '{}',
    'core', 'intermediario', 4, 
    '{"nenhum"}',
    40, '{"lombar"}', '{"lombar":"medio"}'::jsonb,
    'Deite-se de costas com pernas estendidas juntas e mãos apoiadas ao lado do quadril para suporte. Mantendo as pernas esticadas, contraia o abdômen e eleve as pernas na vertical até que fiquem perpendiculares ao solo. Desça lentamente as pernas estendidas até quase tocar o chão.', '{"Mantenha a coluna lombar pressionada contra o solo durante toda a descida das pernas.","Se sentir a lombar arquear, limite a descida ou flexione ligeiramente os joelhos.","Execute de forma cadenciada e lenta para maior tempo sob tensão excêntrica abdominal."}', '{"Arquear a coluna lombar no momento da descida profunda das pernas.","Usar impulsos e balanços rápidos na subida concêntrica das pernas.","Tensionar a região dos ombros e trapézio por falta de estabilização do core."}',
    '', 'A elevação de pernas demanda alta estabilização isométrica do reto abdominal contra o torque de extensão imposto pelos flexores do quadril (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"lombar"}'
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
    'long_lever_plank', 'Long-lever plank', 'Long-lever Plank', 
    'core', '{}',
    'core', 'avancado', 5, 
    '{"nenhum"}',
    75, '{"lombar","ombro"}', '{"lombar":"alto","ombro":"medio"}'::jsonb,
    'A partir de uma posição de prancha tradicional nos antebraços, caminhe com os cotovelos para a frente e pés para trás até que os cotovelos fiquem posicionados abaixo do nariz ou testa. Mantenha o corpo reto em prancha alinhada de forma estática. Sustente de forma isométrica.', '{"Afastar os cotovelos alonga extraordinariamente o braço de alavanca gravitacional sobre o core.","Mantenha a musculatura do glúteo máximo e abdômen contraída na intensidade limite.","Inicie com pequenos afastamentos e aumente o lever à medida que a lombar se mantiver estável."}', '{"Deixar o quadril despencar gerando hiperlordose e alta dor na coluna lombar.","Encurtar a alavanca caminhando com os cotovelos de volta para baixo dos ombros.","Falta de estabilização escapular, gerando dores nos ombros durante a isometria."}',
    '', 'A prancha com alavanca longa eleva o torque de extensão sobre a coluna, multiplicando o recrutamento do reto do abdômen e oblíquos (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"lombar"}'
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
    'ab_rollout_towel', 'Ab rollout com toalha', 'Towel Ab Rollout', 
    'core', '{}',
    'core', 'avancado', 5, 
    '{"piso_liso","toalha"}',
    70, '{"lombar","ombro"}', '{"lombar":"alto","ombro":"medio"}'::jsonb,
    'Ajoelhe-se em um colchonete macio, apoie ambas as mãos sobre uma toalha dobrada em um piso liso diretamente abaixo dos ombros. Mantendo os quadris estendidos e coluna neutra, deslize as mãos para a frente estendendo os braços e descendo o tronco de forma controlada. Puxe de volta pela força do abdômen.', '{"Evite dobrar os quadris para trás durante o retorno; a força deve partir unicamente do core.","Desça apenas até o limite onde consiga manter a coluna estável e neutra sem dor.","Mantenha o queixo levemente recolhido e os glúteos ativos em toda a amplitude de movimento."}', '{"Arquear a coluna lombar na extensão máxima à frente por perda de rigidez do core.","Puxar o corpo flexionando o quadril para trás (movimento de prece) em vez de usar o abdômen.","Perder o controle do deslizamento no piso liso, despencando de bruços no solo."}',
    '', 'O rollout com toalha induz contração excêntrica extrema no reto abdominal sob estabilização de alavanca variável (Schoenfeld, 2024).',
    '{"min":8,"max":15}'::jsonb, '{"excentrica":3,"isometrica":1,"concentrica":1}'::jsonb, 90,
    '{"lombar","ombro"}'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao_execucao = EXCLUDED.descricao_execucao,
    dicas_tecnicas = EXCLUDED.dicas_tecnicas,
    erros_comuns = EXCLUDED.erros_comuns,
    nivel_estresse_por_articulacao = EXCLUDED.nivel_estresse_por_articulacao,
    frase_cientifica_curta = EXCLUDED.frase_cientifica_curta,
    grf_percentual = EXCLUDED.grf_percentual;