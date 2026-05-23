-- Migration 20260523000001_progresso_optimizations.sql
-- Descrição: Criação de índices para otimização de queries na tela de Progresso

-- Otimiza filtros por data nas queries volumeSemanaPorGrupo e tendenciaSemanal
CREATE INDEX IF NOT EXISTS idx_registros_execucao_data_inicio ON registros_execucao(data_inicio);

-- Otimiza junções e filtros por exercício na query linhaTempoPadraoMovimento
CREATE INDEX IF NOT EXISTS idx_series_executadas_exercicio ON series_executadas(exercicio_id);
