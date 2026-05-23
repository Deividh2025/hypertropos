-- Migration 20260520000004_link_exercicios_referencias.sql
-- Descrição: Popula a tabela de junção exercicio_referencias com conexões de rigor científico real

-- =========================================================================
-- 1. EMPURRAR HORIZONTAL (Push-ups) -> Kikuchi (2017), Calatayud (2015), Kotarsky (2018), Lopez (2021)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('push_wall', 'kikuchi_nakazato_2017'),
    ('push_wall', 'calatayud_2015'),
    ('push_inclined_table', 'kikuchi_nakazato_2017'),
    ('push_inclined_table', 'calatayud_2015'),
    ('push_knees', 'kikuchi_nakazato_2017'),
    ('push_knees', 'calatayud_2015'),
    ('push_standard', 'kikuchi_nakazato_2017'),
    ('push_standard', 'calatayud_2015'),
    ('push_standard', 'kotarsky_2018'),
    ('push_declined_feet_elevated', 'kikuchi_nakazato_2017'),
    ('push_declined_feet_elevated', 'calatayud_2015'),
    ('push_declined_feet_elevated', 'kotarsky_2018'),
    ('push_diamond', 'kikuchi_nakazato_2017'),
    ('push_diamond', 'calatayud_2015'),
    ('push_deficit', 'kikuchi_nakazato_2017'),
    ('push_deficit', 'calatayud_2015'),
    ('push_deficit', 'wolf_2023'), -- Alongamento profundo do peitoral
    ('push_deficit', 'pedrosa_2022'),
    ('push_archer', 'kotarsky_2018'),
    ('push_archer', 'lopez_2021'), -- Carga baixa próxima à falha (unilateral)
    ('push_pseudo_planche', 'calatayud_2015'),
    ('push_pseudo_planche', 'lopez_2021')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;

-- =========================================================================
-- 2. EMPURRAR VERTICAL (Pike/HSPU) -> Schoenfeld (2010), Refalo (2023)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('pike_inclined', 'schoenfeld_2010'),
    ('pike_standard', 'schoenfeld_2010'),
    ('pike_standard', 'refalo_2023'),
    ('wall_walk', 'schoenfeld_2010'),
    ('pike_feet_elevated', 'schoenfeld_2010'),
    ('pike_feet_elevated', 'refalo_2023'),
    ('hspu_eccentric', 'schoenfeld_2010'),
    ('hspu_eccentric', 'refalo_2023'),
    ('hspu_full', 'schoenfeld_2010'),
    ('hspu_full', 'refalo_2023')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;

-- =========================================================================
-- 3. PUXAR HORIZONTAL (澳大利亚澳洲 Australian/Rows) -> McGill/Schoenfeld (2010)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('pull_floor_sliding', 'schoenfeld_2010'),
    ('pull_floor_sliding', 'lopez_2021'),
    ('row_sheet_doorway', 'schoenfeld_2010'),
    ('row_table_inverted', 'schoenfeld_2010'),
    ('row_doorway_unilateral', 'schoenfeld_2010'),
    ('row_doorway_unilateral', 'lopez_2021'),
    ('row_feet_elevated', 'schoenfeld_2010'),
    ('row_feet_elevated', 'refalo_2023'),
    ('reverse_snow_angels', 'schoenfeld_2010'),
    ('superman', 'schoenfeld_2010')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;

-- =========================================================================
-- 4. JOELHO DOMINANTE (Pernas) -> Pedrosa (2022), Wolf (2023), Lopez (2021)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('squat_slow', 'pedrosa_2022'),
    ('squat_slow', 'wolf_2023'),
    ('squat_assisted', 'pedrosa_2022'),
    ('squat_assisted', 'wolf_2023'),
    ('lunge', 'pedrosa_2022'),
    ('reverse_lunge', 'pedrosa_2022'),
    ('split_squat', 'pedrosa_2022'),
    ('split_squat', 'wolf_2023'),
    ('bss_quad_bias', 'pedrosa_2022'),
    ('bss_quad_bias', 'wolf_2023'),
    ('bss_quad_bias', 'lopez_2021'), -- Carga corporal unilateralizada
    ('bss_glute_bias', 'pedrosa_2022'),
    ('bss_glute_bias', 'wolf_2023'),
    ('sissy_squat_assisted', 'pedrosa_2022'),
    ('sissy_squat_assisted', 'wolf_2023'),
    ('pistol_assisted', 'pedrosa_2022'),
    ('pistol_assisted', 'wolf_2023'),
    ('pistol_assisted', 'lopez_2021')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;

-- =========================================================================
-- 5. QUADRIL DOMINANTE (Posterior/Glúteo) -> Pedrosa (2022), Wolf (2023), Refalo (2023)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('glute_bridge', 'schoenfeld_2010'),
    ('glute_bridge_unilateral', 'schoenfeld_2010'),
    ('glute_bridge_unilateral', 'lopez_2021'),
    ('hip_thrust_chair', 'schoenfeld_2010'),
    ('hip_thrust_unilateral', 'schoenfeld_2010'),
    ('hip_thrust_unilateral', 'lopez_2021'),
    ('single_leg_rdl', 'pedrosa_2022'), -- Alongamento profundo isquiotibial
    ('single_leg_rdl', 'wolf_2023'),
    ('slider_hamstring_curl', 'schoenfeld_2010'),
    ('nordic_assisted', 'pedrosa_2022'), -- Força excêntrica sob alongamento
    ('nordic_assisted', 'wolf_2023'),
    ('nordic_full', 'pedrosa_2022'),
    ('nordic_full', 'wolf_2023')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;

-- =========================================================================
-- 6. PANTURRILHAS (Calf Raises) -> Pedrosa (2022), Wolf (2023)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('calf_raise_bilateral', 'pedrosa_2022'),
    ('calf_raise_single', 'pedrosa_2022'),
    ('calf_raise_deficit', 'pedrosa_2022'), -- ROM longo em déficit no degrau
    ('calf_raise_deficit', 'wolf_2023'),
    ('calf_raise_deficit_paused', 'pedrosa_2022'), -- Pausa isométrica no alongamento profundo
    ('calf_raise_deficit_paused', 'wolf_2023')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;

-- =========================================================================
-- 7. CORE (Abdominais) -> Refalo (2023), Schoenfeld (2010)
-- =========================================================================
INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES
    ('plank', 'schoenfeld_2010'),
    ('plank_rkc', 'schoenfeld_2010'),
    ('plank_rkc', 'refalo_2023'),
    ('hollow_body', 'refalo_2023'),
    ('reverse_crunch', 'schoenfeld_2010'),
    ('leg_raise', 'schoenfeld_2010'),
    ('long_lever_plank', 'refalo_2023'),
    ('ab_rollout_towel', 'refalo_2023'),
    ('ab_rollout_towel', 'schoenfeld_2010')
ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;