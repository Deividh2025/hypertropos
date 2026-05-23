-- Migration 20260523000003_enable_rls_all_tables.sql
-- Descrição: Ativação massiva de Row Level Security (RLS) e políticas de acesso seguro
-- para todas as tabelas operacionais e de catálogo do Hypertropos.

--------------------------------------------------------------------------------
-- 1. ATIVAÇÃO DO ROW LEVEL SECURITY (RLS)
--------------------------------------------------------------------------------

-- Tabelas de Catálogo (Públicas para leitura, protegidas contra modificações)
ALTER TABLE exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE referencias_cientificas ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicio_referencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE suplementos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistas ENABLE ROW LEVEL SECURITY;

-- Tabelas Operacionais do Usuário (Isoladas estritamente por perfil_id / auth.uid())
ALTER TABLE perfil_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_peso_corporal ENABLE ROW LEVEL SECURITY;
ALTER TABLE programa_ativo ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicios_prescritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_execucao ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_executadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistas_desbloqueadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estado_silhueta ENABLE ROW LEVEL SECURITY;
ALTER TABLE lembretes ENABLE ROW LEVEL SECURITY;


--------------------------------------------------------------------------------
-- 2. POLÍTICAS PARA TABELAS DE CATÁLOGO (PÚBLICAS)
--------------------------------------------------------------------------------

-- exercicios
CREATE POLICY "Permitir leitura publica de exercicios" ON exercicios
  FOR SELECT USING (true);

-- referencias_cientificas
CREATE POLICY "Permitir leitura publica de referencias" ON referencias_cientificas
  FOR SELECT USING (true);

-- exercicio_referencias
CREATE POLICY "Permitir leitura publica de exercicio_referencias" ON exercicio_referencias
  FOR SELECT USING (true);

-- suplementos
CREATE POLICY "Permitir leitura publica de suplementos" ON suplementos
  FOR SELECT USING (true);

-- conquistas
CREATE POLICY "Permitir leitura publica de conquistas" ON conquistas
  FOR SELECT USING (true);


--------------------------------------------------------------------------------
-- 3. POLÍTICAS PARA TABELAS PRIVADAS DO USUÁRIO (ISOLAMENTO MULTI-TENANT)
--------------------------------------------------------------------------------

-- perfil_usuario
CREATE POLICY "Acesso total ao próprio perfil" ON perfil_usuario
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- historico_peso_corporal
CREATE POLICY "Acesso total ao próprio histórico de peso" ON historico_peso_corporal
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);

-- programa_ativo
CREATE POLICY "Acesso total aos próprios programas" ON programa_ativo
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);

-- sessoes_template
CREATE POLICY "Acesso total às próprias sessões template" ON sessoes_template
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM programa_ativo p 
      WHERE p.id = programa_id AND p.perfil_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM programa_ativo p 
      WHERE p.id = programa_id AND p.perfil_id = auth.uid()
    )
  );

-- exercicios_prescritos
CREATE POLICY "Acesso total aos próprios exercícios prescritos" ON exercicios_prescritos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sessoes_template s
      JOIN programa_ativo p ON s.programa_id = p.id
      WHERE s.id = sessao_template_id AND p.perfil_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessoes_template s
      JOIN programa_ativo p ON s.programa_id = p.id
      WHERE s.id = sessao_template_id AND p.perfil_id = auth.uid()
    )
  );

-- registros_execucao
CREATE POLICY "Acesso total aos próprios registros de execução" ON registros_execucao
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);

-- series_executadas
CREATE POLICY "Acesso total às próprias séries executadas" ON series_executadas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM registros_execucao r
      WHERE r.id = registro_id AND r.perfil_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM registros_execucao r
      WHERE r.id = registro_id AND r.perfil_id = auth.uid()
    )
  );

-- gamificacao
CREATE POLICY "Acesso total à própria gamificação" ON gamificacao
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);

-- conquistas_desbloqueadas
CREATE POLICY "Acesso total às próprias conquistas desbloqueadas" ON conquistas_desbloqueadas
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);

-- estado_silhueta
CREATE POLICY "Acesso total ao próprio estado de silhueta" ON estado_silhueta
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);

-- lembretes
CREATE POLICY "Acesso total aos próprios lembretes" ON lembretes
  FOR ALL USING (auth.uid() = perfil_id) WITH CHECK (auth.uid() = perfil_id);
