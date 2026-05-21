const fs = require('fs');

const exercises = [
    // Push horizontal
    ["push_wall", "Flexão na parede", "Wall Push-up", "peito", "push_horizontal", 1],
    ["push_inclined_table", "Flexão inclinada em mesa", "Incline Push-up", "peito", "push_horizontal", 2],
    ["push_knees", "Flexão de joelhos", "Knee Push-up", "peito", "push_horizontal", 2],
    ["push_standard", "Flexão padrão", "Standard Push-up", "peito", "push_horizontal", 3],
    ["push_declined_feet_elevated", "Flexão declinada pés elevados", "Decline Push-up", "peito", "push_horizontal", 4],
    ["push_diamond", "Flexão diamante", "Diamond Push-up", "peito", "push_horizontal", 4],
    ["push_deficit", "Flexão com déficit em livros", "Deficit Push-up", "peito", "push_horizontal", 5],
    ["push_archer", "Archer push-up", "Archer Push-up", "peito", "push_horizontal", 5],
    ["push_pseudo_planche", "Pseudo-planche push-up", "Pseudo-planche Push-up", "peito", "push_horizontal", 5],

    // Push vertical
    ["pike_inclined", "Pike push-up inclinado", "Incline Pike Push-up", "ombros", "push_vertical", 1],
    ["pike_standard", "Pike push-up", "Pike Push-up", "ombros", "push_vertical", 3],
    ["wall_walk", "Wall walk", "Wall Walk", "ombros", "push_vertical", 4],
    ["pike_feet_elevated", "Pike push-up com pés elevados", "Elevated Pike Push-up", "ombros", "push_vertical", 4],
    ["hspu_eccentric", "Handstand push-up excêntrico", "Eccentric Handstand Push-up", "ombros", "push_vertical", 5],
    ["hspu_full", "Handstand push-up completo", "Handstand Push-up", "ombros", "push_vertical", 5],

    // Pull horizontal
    ["pull_floor_sliding", "Sliding floor pulldown", "Sliding Floor Pulldown", "costas", "pull_horizontal", 1],
    ["row_sheet_doorway", "Remada com lençol na porta", "Sheet Doorway Row", "costas", "pull_horizontal", 2],
    ["row_table_inverted", "Inverted row em mesa", "Table Inverted Row", "costas", "pull_horizontal", 3],
    ["row_doorway_unilateral", "Doorway row unilateral", "One-arm Doorway Row", "costas", "pull_horizontal", 4],
    ["row_feet_elevated", "Inverted row pés elevados", "Elevated Inverted Row", "costas", "pull_horizontal", 4],
    ["reverse_snow_angels", "Snow angels reverso", "Reverse Snow Angels", "costas", "pull_horizontal", 1],
    ["superman", "Superman", "Superman", "costas", "pull_horizontal", 1],

    // Joelho-dominante
    ["squat_slow", "Agachamento livre lento", "Bodyweight Squat", "quadriceps", "joelho_dominante", 1],
    ["squat_assisted", "Agachamento profundo assistido", "Assisted Squat", "quadriceps", "joelho_dominante", 1],
    ["lunge", "Passada", "Lunge", "quadriceps", "joelho_dominante", 2],
    ["reverse_lunge", "Reverse lunge", "Reverse Lunge", "quadriceps", "joelho_dominante", 2],
    ["split_squat", "Split squat", "Split Squat", "quadriceps", "joelho_dominante", 3],
    ["bss_quad_bias", "Bulgarian Split Squat (viés quadríceps)", "Bulgarian Split Squat (Quad)", "quadriceps", "joelho_dominante", 4],
    ["bss_glute_bias", "Bulgarian Split Squat (viés glúteo)", "Bulgarian Split Squat (Glute)", "quadriceps", "joelho_dominante", 4],
    ["sissy_squat_assisted", "Sissy squat assistido", "Assisted Sissy Squat", "quadriceps", "joelho_dominante", 5],
    ["pistol_assisted", "Pistol squat assistido", "Assisted Pistol Squat", "quadriceps", "joelho_dominante", 5],

    // Quadril-dominante
    ["glute_bridge", "Glute bridge", "Glute Bridge", "gluteo", "quadril_dominante", 1],
    ["glute_bridge_unilateral", "Glute bridge unilateral", "Single-leg Glute Bridge", "gluteo", "quadril_dominante", 2],
    ["hip_thrust_chair", "Hip thrust em cadeira", "Chair Hip Thrust", "gluteo", "quadril_dominante", 3],
    ["hip_thrust_unilateral", "Hip thrust unilateral", "Single-leg Hip Thrust", "gluteo", "quadril_dominante", 3],
    ["single_leg_rdl", "Single-leg Romanian Deadlift", "Single-leg RDL", "posterior", "quadril_dominante", 4],
    ["slider_hamstring_curl", "Slider hamstring curl", "Slider Hamstring Curl", "posterior", "quadril_dominante", 4],
    ["nordic_assisted", "Nordic curl assistido", "Assisted Nordic Curl", "posterior", "quadril_dominante", 5],
    ["nordic_full", "Nordic curl completo", "Nordic Curl", "posterior", "quadril_dominante", 5],

    // Panturrilha
    ["calf_raise_bilateral", "Calf raise bilateral", "Bilateral Calf Raise", "panturrilha", "panturrilha", 1],
    ["calf_raise_single", "Calf raise unilateral", "Single-leg Calf Raise", "panturrilha", "panturrilha", 2],
    ["calf_raise_deficit", "Calf raise unilateral em déficit", "Deficit Single-leg Calf Raise", "panturrilha", "panturrilha", 3],
    ["calf_raise_deficit_paused", "Calf raise unilateral em déficit (pausa)", "Paused Deficit Single-leg Calf Raise", "panturrilha", "panturrilha", 4],

    // Core
    ["plank", "Plank", "Plank", "core", "core", 1],
    ["plank_rkc", "Plank RKC", "RKC Plank", "core", "core", 2],
    ["hollow_body", "Hollow body hold", "Hollow Body Hold", "core", "core", 3],
    ["reverse_crunch", "Reverse crunch", "Reverse Crunch", "core", "core", 3],
    ["leg_raise", "Leg raise", "Leg Raise", "core", "core", 4],
    ["long_lever_plank", "Long-lever plank", "Long-lever Plank", "core", "core", 4],
    ["ab_rollout_towel", "Ab rollout com toalha", "Towel Ab Rollout", "core", "core", 5],
];

let sql_statements = [
    "-- Migration 20260520000002_seed_exercicios.sql",
    "-- Seed dos exercícios listados no Apêndice A",
    ""
];

for (let i = 0; i < exercises.length; i++) {
    const [id_val, nome, nome_alt, gp, pm, nivel] = exercises[i];
    
    let nivel_minimo;
    if (nivel <= 2) {
        nivel_minimo = "iniciante";
    } else if (nivel === 3) {
        nivel_minimo = "intermediario";
    } else {
        nivel_minimo = "avancado";
    }
        
    const stmt = `INSERT INTO exercicios (
    id, nome, nome_alternativo, grupo_muscular_primario, grupos_secundarios,
    padrao_movimento, nivel_minimo, nivel_escada, equipamento_necessario,
    articulacoes_estressadas, nivel_estresse_por_articulacao,
    descricao_execucao, dicas_tecnicas, erros_comuns, midia_url, frase_cientifica_curta,
    faixa_reps_recomendada, cadencia_recomendada, descanso_recomendado_seg,
    contraindicacoes
) VALUES (
    '${id_val}', '${nome}', '${nome_alt}', '${gp}', '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '${pm}', '${nivel_minimo}', ${nivel}, '{ "[REVISAR: conteúdo a ser adicionado]" }',
    '{ "[REVISAR: conteúdo a ser adicionado]" }', '{"[REVISAR: articulação]": "medio"}'::jsonb,
    '[REVISAR: conteúdo a ser adicionado]', '{ "[REVISAR: conteúdo a ser adicionado]" }', '{ "[REVISAR: conteúdo a ser adicionado]" }', '', '[REVISAR: conteúdo a ser adicionado]',
    '{"min": 8, "max": 15}'::jsonb, '{"excentrica": 3, "isometrica": 1, "concentrica": 1}'::jsonb, 90,
    '{}'
) ON CONFLICT (id) DO NOTHING;`;
    
    sql_statements.push(stmt);
}

fs.writeFileSync('c:/Users/user/Documents/Projetos/Hypertropos/hypertropos/supabase/migrations/20260520000002_seed_exercicios.sql', sql_statements.join("\\n"));
