const fs = require('fs');

const autores = [
    "Schoenfeld", "Phillips", "Krieger", "Grgic", "Refalo", 
    "Morton", "Kreider", "Calatayud", "Kotarsky", "Kikuchi", 
    "Pedrosa", "Maeo", "Baz-Valle", "Israetel", "Helms", "Wackerhage"
];

let sql_ref = [
    "-- Migration 20260520000003_seed_referencias.sql",
    "-- Seed de referencias_cientificas",
    ""
];

for (let i = 0; i < autores.length; i++) {
    const autor = autores[i];
    const id_val = `${autor.toLowerCase()}_placeholder`;
    const stmt = `INSERT INTO referencias_cientificas (
    id, autores, ano, titulo, periodico, url, sintese_acessivel, tags
) VALUES (
    '${id_val}', '${autor} et al.', 2020, '[REVISAR: título a ser adicionado]', '[REVISAR: periódico]', '[REVISAR: URL]', '[REVISAR: síntese a ser adicionada]', '{ "[REVISAR: tags]" }'
) ON CONFLICT (id) DO NOTHING;`;
    sql_ref.push(stmt);
}

fs.writeFileSync('c:/Users/user/Documents/Projetos/Hypertropos/hypertropos/supabase/migrations/20260520000003_seed_referencias.sql', sql_ref.join("\\n"));

let sql_link = [
    "-- Migration 20260520000004_link_exercicios_referencias.sql",
    "-- Exercicio_referencias",
    ""
];

// We will just link push_wall to schoenfeld_placeholder as an example of linking.
// The user will need to revise this entirely.
sql_link.push(`INSERT INTO exercicio_referencias (exercicio_id, referencia_id) VALUES ('push_wall', 'schoenfeld_placeholder') ON CONFLICT (exercicio_id, referencia_id) DO NOTHING;`);

fs.writeFileSync('c:/Users/user/Documents/Projetos/Hypertropos/hypertropos/supabase/migrations/20260520000004_link_exercicios_referencias.sql', sql_link.join("\\n"));

// 8 fichas de suplementos
const suplementos = [
    ["creatina_monohidratada", "Creatina Monohidratada", "creatina", "A", true],
    ["whey_protein", "Whey Protein", "proteina", "A", true],
    ["caseina", "Caseína", "proteina", "A", false],
    ["cafeina", "Cafeína", "cafeina", "A", true],
    ["beta_alanina", "Beta-alanina", "beta_alanina", "B", false],
    ["citrulina_malato", "Citrulina Malato", "citrulina", "B", false],
    ["vitamina_d", "Vitamina D", "vit_d", "B", false],
    ["omega_3", "Ômega-3 EPA/DHA", "omega_3", "B", false],
    ["sem_evidencia", "Suplementos SEM Evidência Forte", "sem_evidencia", "C", false]
];

let sql_sup = [
    "-- Migration 20260520000005_seed_suplementos.sql",
    "-- Seed de suplementos",
    ""
];

for (let i = 0; i < suplementos.length; i++) {
    const [id_val, nome, categoria, nivel, recomendado] = suplementos[i];
    const rec_str = recomendado ? "true" : "false";
    
    const stmt = `INSERT INTO suplementos (
    id, nome, categoria, nivel_evidencia, dose_padrao, dose_dependente_peso, dose_formula,
    timing_recomendado, mecanismo_resumido, beneficios_documentados, efeitos_colaterais, referencias,
    recomendado_para_perfil
) VALUES (
    '${id_val}', '${nome}', '${categoria}', '${nivel}', '[REVISAR: dose padrão]', false, '[REVISAR: formula]',
    '[REVISAR: timing]', '[REVISAR: mecanismo resumido]', '{ "[REVISAR: benefícios]" }', '{ "[REVISAR: colaterais]" }', '{ "[REVISAR: referencias]" }',
    ${rec_str}
) ON CONFLICT (id) DO NOTHING;`;
    sql_sup.push(stmt);
}

fs.writeFileSync('c:/Users/user/Documents/Projetos/Hypertropos/hypertropos/supabase/migrations/20260520000005_seed_suplementos.sql', sql_sup.join("\\n"));

