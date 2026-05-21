import * as SQLite from 'expo-sqlite';

export async function migration001(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS exercicios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      nome_alternativo TEXT,
      grupo_muscular_primario TEXT NOT NULL,
      grupos_secundarios TEXT, -- JSON
      padrao_movimento TEXT NOT NULL,
      nivel_minimo TEXT NOT NULL,
      nivel_escada INTEGER NOT NULL,
      equipamento_necessario TEXT, -- JSON
      grf_percentual REAL,
      articulacoes_estressadas TEXT, -- JSON
      nivel_estresse_por_articulacao TEXT, -- JSON
      descricao_execucao TEXT NOT NULL,
      dicas_tecnicas TEXT, -- JSON
      erros_comuns TEXT, -- JSON
      midia_url TEXT,
      frase_cientifica_curta TEXT,
      referencias TEXT, -- JSON
      variacao_anterior TEXT,
      variacao_proxima TEXT,
      substitutos_mesmo_padrao TEXT, -- JSON
      faixa_reps_min INTEGER,
      faixa_reps_max INTEGER,
      cadencia_excentrica INTEGER,
      cadencia_isometrica INTEGER,
      cadencia_concentrica INTEGER,
      descanso_recomendado_seg INTEGER,
      contraindicacoes TEXT -- JSON
    );

    CREATE TABLE IF NOT EXISTS referencias_cientificas (
      id TEXT PRIMARY KEY,
      autores TEXT NOT NULL,
      ano INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      periodico TEXT NOT NULL,
      url TEXT,
      sintese_acessivel TEXT NOT NULL,
      tags TEXT -- JSON
    );

    CREATE TABLE IF NOT EXISTS suplementos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      grau_evidencia TEXT NOT NULL,
      dose_recomendada TEXT NOT NULL,
      horario_recomendado TEXT,
      descricao_curta TEXT NOT NULL,
      mecanismo_acao TEXT,
      referencias_ids TEXT -- JSON
    );

    CREATE TABLE IF NOT EXISTS perfil_usuario (
      id TEXT PRIMARY KEY,
      idade INTEGER NOT NULL,
      genero_biologico TEXT NOT NULL,
      peso_corporal_kg REAL NOT NULL,
      altura_cm REAL NOT NULL,
      nivel TEXT NOT NULL,
      nivel_atividade_extra_treino TEXT NOT NULL,
      dias_disponiveis_semana INTEGER NOT NULL,
      duracao_alvo_sessao_min INTEGER NOT NULL,
      horario_preferido_treino TEXT NOT NULL,
      equipamento_disponivel TEXT, -- JSON
      split_atual TEXT,
      objetivo TEXT,
      restricoes_articulares TEXT, -- JSON
      historico_clinico TEXT, -- JSON
      meta_proteina_g_kg REAL,
      fase_nutricional TEXT,
      usa_creatina INTEGER,
      usa_cafeina INTEGER,
      lembretes_ativos TEXT, -- JSON
      data_criacao TEXT,
      ultima_atualizacao TEXT
    );

    CREATE TABLE IF NOT EXISTS estado_silhueta (
      id TEXT PRIMARY KEY,
      peito INTEGER NOT NULL,
      costas INTEGER NOT NULL,
      ombros INTEGER NOT NULL,
      bracos INTEGER NOT NULL,
      quadriceps INTEGER NOT NULL,
      posterior INTEGER NOT NULL,
      gluteo INTEGER NOT NULL,
      panturrilha INTEGER NOT NULL,
      core INTEGER NOT NULL,
      tier_atual TEXT NOT NULL,
      ultima_atualizacao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS gamificacao (
      id TEXT PRIMARY KEY,
      xp_total INTEGER NOT NULL,
      nivel_atual INTEGER NOT NULL,
      streak_atual INTEGER NOT NULL,
      streak_maximo INTEGER NOT NULL,
      freezes_disponiveis INTEGER NOT NULL,
      ultima_atividade TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conquistas_desbloqueadas (
      id TEXT PRIMARY KEY,
      conquista_id TEXT NOT NULL,
      desbloqueada_em TEXT NOT NULL
    );
  `);
}
