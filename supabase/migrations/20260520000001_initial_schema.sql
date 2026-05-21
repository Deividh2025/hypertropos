-- Migration 20260520000001_initial_schema.sql
-- Descrição: Criação do schema inicial do Hypertropos em PostgreSQL

-- Função genérica para atualizar a coluna updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. exercicios
CREATE TABLE exercicios (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    nome_alternativo TEXT,
    grupo_muscular_primario TEXT NOT NULL,
    grupos_secundarios TEXT[] DEFAULT '{}',
    padrao_movimento TEXT NOT NULL,
    nivel_minimo TEXT NOT NULL,
    nivel_escada INTEGER CHECK (nivel_escada BETWEEN 1 AND 5),
    equipamento_necessario TEXT[] DEFAULT '{}',
    grf_percentual NUMERIC,
    articulacoes_estressadas TEXT[] DEFAULT '{}',
    nivel_estresse_por_articulacao JSONB DEFAULT '{}'::jsonb,
    descricao_execucao TEXT,
    dicas_tecnicas TEXT[] DEFAULT '{}',
    erros_comuns TEXT[] DEFAULT '{}',
    midia_url TEXT,
    frase_cientifica_curta TEXT,
    -- referências são na junction table
    variacao_anterior TEXT REFERENCES exercicios(id) ON DELETE SET NULL,
    variacao_proxima TEXT REFERENCES exercicios(id) ON DELETE SET NULL,
    substitutos_mesmo_padrao TEXT[] DEFAULT '{}',
    faixa_reps_recomendada JSONB,
    cadencia_recomendada JSONB,
    descanso_recomendado_seg INTEGER,
    contraindicacoes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE exercicios IS 'Catálogo central de exercícios corporais para hipertrofia.';

-- Indices para `exercicios`
CREATE INDEX idx_exercicios_grupo_primario ON exercicios(grupo_muscular_primario);
CREATE INDEX idx_exercicios_padrao_movimento ON exercicios(padrao_movimento);
CREATE INDEX idx_exercicios_nivel_minimo ON exercicios(nivel_minimo);

CREATE TRIGGER set_timestamp_exercicios
BEFORE UPDATE ON exercicios
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 2. referencias_cientificas
CREATE TABLE referencias_cientificas (
    id TEXT PRIMARY KEY,
    autores TEXT NOT NULL,
    ano INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    periodico TEXT NOT NULL,
    url TEXT,
    sintese_acessivel TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE referencias_cientificas IS 'Catálogo de artigos científicos embasando as decisões do app.';

CREATE TRIGGER set_timestamp_referencias_cientificas
BEFORE UPDATE ON referencias_cientificas
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 3. exercicio_referencias
CREATE TABLE exercicio_referencias (
    exercicio_id TEXT REFERENCES exercicios(id) ON DELETE CASCADE,
    referencia_id TEXT REFERENCES referencias_cientificas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (exercicio_id, referencia_id)
);
COMMENT ON TABLE exercicio_referencias IS 'Tabela de junção entre exercícios e referências.';

-- 4. suplementos
CREATE TABLE suplementos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    nivel_evidencia TEXT CHECK (nivel_evidencia IN ('A', 'B', 'C')),
    dose_padrao TEXT,
    dose_dependente_peso BOOLEAN DEFAULT false,
    dose_formula TEXT,
    timing_recomendado TEXT,
    mecanismo_resumido TEXT,
    beneficios_documentados TEXT[] DEFAULT '{}',
    efeitos_colaterais TEXT[] DEFAULT '{}',
    referencias TEXT[] DEFAULT '{}',
    recomendado_para_perfil BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE suplementos IS 'Catálogo de suplementos com níveis de evidência e dosagens.';

CREATE TRIGGER set_timestamp_suplementos
BEFORE UPDATE ON suplementos
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 5. perfil_usuario
CREATE TABLE perfil_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idade INTEGER,
    genero_biologico TEXT,
    peso_corporal_kg NUMERIC,
    altura_cm INTEGER,
    nivel TEXT,
    nivel_atividade_extra_treino TEXT,
    dias_disponiveis_semana INTEGER,
    duracao_alvo_sessao_min INTEGER,
    horario_preferido_treino TEXT,
    equipamento_disponivel TEXT[] DEFAULT '{}',
    split_atual TEXT,
    objetivo TEXT DEFAULT 'hipertrofia',
    restricoes_articulares JSONB DEFAULT '[]'::jsonb,
    historico_clinico TEXT[] DEFAULT '{}',
    meta_proteina_g_kg NUMERIC,
    fase_nutricional TEXT,
    usa_creatina BOOLEAN DEFAULT false,
    usa_cafeina BOOLEAN DEFAULT false,
    lembretes_ativos JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE perfil_usuario IS 'Perfil principal do usuário do app.';

CREATE TRIGGER set_timestamp_perfil_usuario
BEFORE UPDATE ON perfil_usuario
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 6. historico_peso_corporal
CREATE TABLE historico_peso_corporal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    peso_kg NUMERIC NOT NULL,
    data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE historico_peso_corporal IS 'Registro temporal do peso corporal do usuário.';
CREATE INDEX idx_historico_peso_perfil ON historico_peso_corporal(perfil_id);
CREATE INDEX idx_historico_peso_data ON historico_peso_corporal(data_registro);

-- 7. programa_ativo
CREATE TABLE programa_ativo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    split TEXT NOT NULL,
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    data_fim DATE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE programa_ativo IS 'Programa de treino atual do usuário.';
CREATE INDEX idx_programa_ativo_perfil ON programa_ativo(perfil_id);

CREATE TRIGGER set_timestamp_programa_ativo
BEFORE UPDATE ON programa_ativo
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 8. sessoes_template
CREATE TABLE sessoes_template (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    programa_id UUID REFERENCES programa_ativo(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    dia_referencia TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE sessoes_template IS 'Template de uma sessão específica no programa ativo.';
CREATE INDEX idx_sessoes_template_programa ON sessoes_template(programa_id);

CREATE TRIGGER set_timestamp_sessoes_template
BEFORE UPDATE ON sessoes_template
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 9. exercicios_prescritos
CREATE TABLE exercicios_prescritos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sessao_template_id UUID REFERENCES sessoes_template(id) ON DELETE CASCADE,
    exercicio_id TEXT REFERENCES exercicios(id) ON DELETE RESTRICT,
    ordem INTEGER NOT NULL,
    series_alvo INTEGER NOT NULL,
    reps_alvo TEXT NOT NULL,
    rir_alvo INTEGER,
    descanso_seg INTEGER,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE exercicios_prescritos IS 'Exercícios dentro de um template de sessão.';
CREATE INDEX idx_exercicios_prescritos_sessao ON exercicios_prescritos(sessao_template_id);

CREATE TRIGGER set_timestamp_exercicios_prescritos
BEFORE UPDATE ON exercicios_prescritos
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 10. registros_execucao
CREATE TABLE registros_execucao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sessao_template_id UUID REFERENCES sessoes_template(id) ON DELETE SET NULL,
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    data_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fim TIMESTAMPTZ,
    duracao_seg INTEGER,
    xp_ganho INTEGER DEFAULT 0,
    concluida BOOLEAN DEFAULT false,
    notas_sessao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE registros_execucao IS 'Sessões de treino executadas pelo usuário.';
CREATE INDEX idx_registros_execucao_perfil ON registros_execucao(perfil_id);

CREATE TRIGGER set_timestamp_registros_execucao
BEFORE UPDATE ON registros_execucao
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 11. series_executadas
CREATE TABLE series_executadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registro_id UUID REFERENCES registros_execucao(id) ON DELETE CASCADE,
    exercicio_id TEXT REFERENCES exercicios(id) ON DELETE RESTRICT,
    ordem_exercicio INTEGER NOT NULL,
    numero_serie INTEGER NOT NULL,
    reps_executadas INTEGER NOT NULL,
    peso_adicional_kg NUMERIC DEFAULT 0,
    rir_realizado INTEGER,
    completada BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE series_executadas IS 'Séries individuais executadas.';
CREATE INDEX idx_series_executadas_registro ON series_executadas(registro_id);

-- 12. gamificacao
CREATE TABLE gamificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE UNIQUE,
    xp_total INTEGER DEFAULT 0,
    nivel_atual INTEGER DEFAULT 1,
    streak_atual INTEGER DEFAULT 0,
    maior_streak INTEGER DEFAULT 0,
    freezes_disponiveis INTEGER DEFAULT 0,
    ultimo_treino_data DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE gamificacao IS 'Estado atual de gamificação.';

CREATE TRIGGER set_timestamp_gamificacao
BEFORE UPDATE ON gamificacao
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 13. conquistas
CREATE TABLE conquistas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo TEXT NOT NULL,
    icone TEXT,
    pontos_xp INTEGER DEFAULT 0,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE conquistas IS 'Catálogo de conquistas possíveis.';

CREATE TABLE conquistas_desbloqueadas (
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    conquista_id TEXT REFERENCES conquistas(id) ON DELETE CASCADE,
    data_desbloqueio TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (perfil_id, conquista_id)
);

-- 14. estado_silhueta
CREATE TABLE estado_silhueta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE UNIQUE,
    tier_atual TEXT DEFAULT 'bronze',
    peito_nivel INTEGER DEFAULT 0 CHECK (peito_nivel BETWEEN 0 AND 100),
    costas_nivel INTEGER DEFAULT 0 CHECK (costas_nivel BETWEEN 0 AND 100),
    ombros_nivel INTEGER DEFAULT 0 CHECK (ombros_nivel BETWEEN 0 AND 100),
    bracos_nivel INTEGER DEFAULT 0 CHECK (bracos_nivel BETWEEN 0 AND 100),
    quadriceps_nivel INTEGER DEFAULT 0 CHECK (quadriceps_nivel BETWEEN 0 AND 100),
    posterior_nivel INTEGER DEFAULT 0 CHECK (posterior_nivel BETWEEN 0 AND 100),
    gluteo_nivel INTEGER DEFAULT 0 CHECK (gluteo_nivel BETWEEN 0 AND 100),
    panturrilha_nivel INTEGER DEFAULT 0 CHECK (panturrilha_nivel BETWEEN 0 AND 100),
    core_nivel INTEGER DEFAULT 0 CHECK (core_nivel BETWEEN 0 AND 100),
    ultima_atualizacao TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE estado_silhueta IS 'Estado atual de definição muscular por região.';

CREATE TRIGGER set_timestamp_estado_silhueta
BEFORE UPDATE ON estado_silhueta
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- 15. lembretes
CREATE TABLE lembretes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES perfil_usuario(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    hora_disparo TIME NOT NULL,
    dias_semana TEXT[] DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    mensagem_personalizada TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE lembretes IS 'Lembretes programados pelo usuário.';
CREATE INDEX idx_lembretes_perfil ON lembretes(perfil_id);

CREATE TRIGGER set_timestamp_lembretes
BEFORE UPDATE ON lembretes
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
