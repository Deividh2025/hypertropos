-- Migration 20260520000003_seed_referencias.sql\n-- Seed de referencias_cientificas\n\nINSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_2016', 'Schoenfeld, Ogborn & Krieger', 2016, '[REVISAR: titulo]', 
    '[REVISAR: periodico]', '[REVISAR: url]', '[REVISAR: sintese]', '{"volume","falha"}'
) ON CONFLICT (id) DO UPDATE SET
    sintese_acessivel = EXCLUDED.sintese_acessivel;\nINSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'morton_2018', 'Morton et al.', 2018, '[REVISAR: titulo]', 
    '[REVISAR: periodico]', '[REVISAR: url]', 'Base para a meta de proteína (1,6 a 2,2 g/kg/dia dependendo da fase nutricional).', '{"proteina","nutricao"}'
) ON CONFLICT (id) DO UPDATE SET
    sintese_acessivel = EXCLUDED.sintese_acessivel;\nINSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'schoenfeld_aragon_2018', 'Schoenfeld & Aragon', 2018, '[REVISAR: titulo]', 
    '[REVISAR: periodico]', '[REVISAR: url]', 'Sugestão de distribuição em 4-5 refeições de 0,3-0,4 g/kg cada.', '{"proteina","frequencia"}'
) ON CONFLICT (id) DO UPDATE SET
    sintese_acessivel = EXCLUDED.sintese_acessivel;\nINSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    'kikuchi_nakazato_2017', 'Kikuchi e Nakazato', 2017, '[REVISAR: titulo]', 
    '[REVISAR: periodico]', '[REVISAR: url]', 'Corroborou a hipertrofia gerada por flexões equivalente ao supino com a mesma carga relativa (~40% de 1RM).', '{"flexao","peitoral"}'
) ON CONFLICT (id) DO UPDATE SET
    sintese_acessivel = EXCLUDED.sintese_acessivel;