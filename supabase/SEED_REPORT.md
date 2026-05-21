# Relatório de Seed (SEED_REPORT.md)

Este relatório compila os dados populados nos scripts de migração iniciais para o projeto Hypertropos.

## Resumo Quantitativo
- **Exercícios Populados:** 41
- **Referências Populadas:** 16
- **Suplementos Populados:** 9
- **Junções (Exercício-Referência):** 1 (Apenas exemplo ilustrativo)

> [!WARNING]
> **Aviso Importante: Conteúdo Faltante**
> Como os 4 arquivos de pesquisa não foram fornecidos no contexto, todos os campos que dependiam de extração direta dessas pesquisas foram preenchidos com placeholders do tipo `[REVISAR: ...]`.

## Campos com Placeholders que exigem revisão manual

### 1. Exercícios (`20260520000002_seed_exercicios.sql`)
- `nome_alternativo`: Nomes em inglês foram deduzidos, favor revisar.
- `grupos_secundarios`: `{"[REVISAR: conteúdo a ser adicionado]"}`
- `equipamento_necessario`: `{"[REVISAR: conteúdo a ser adicionado]"}`
- `articulacoes_estressadas`: `{"[REVISAR: conteúdo a ser adicionado]"}`
- `nivel_estresse_por_articulacao`: `'{"[REVISAR: articulação]": "medio"}'::jsonb`
- `descricao_execucao`: `'[REVISAR: conteúdo a ser adicionado]'`
- `dicas_tecnicas`: `{"[REVISAR: conteúdo a ser adicionado]"}`
- `erros_comuns`: `{"[REVISAR: conteúdo a ser adicionado]"}`
- `frase_cientifica_curta`: `'[REVISAR: conteúdo a ser adicionado]'`
- *(Faltou grf_percentual em todos, estão nulos por não haver dado base).*

### 2. Referências (`20260520000003_seed_referencias.sql`)
- IDs criados com formato genérico (ex: `schoenfeld_placeholder`).
- `titulo`: `'[REVISAR: título a ser adicionado]'`
- `periodico`: `'[REVISAR: periódico]'`
- `url`: `'[REVISAR: URL]'`
- `sintese_acessivel`: `'[REVISAR: síntese a ser adicionada]'`
- `tags`: `{"[REVISAR: tags]"}`

### 3. Ligação Exercícios-Referências (`20260520000004_link_exercicios_referencias.sql`)
- Foi gerado apenas um insert de exemplo associando o `push_wall` à referência `schoenfeld_placeholder`.
- **Ação Necessária:** Completar as conexões reais quando as referências forem importadas corretamente.

### 4. Suplementos (`20260520000005_seed_suplementos.sql`)
- `dose_padrao`: `'[REVISAR: dose padrão]'`
- `dose_formula`: `'[REVISAR: formula]'`
- `timing_recomendado`: `'[REVISAR: timing]'`
- `mecanismo_resumido`: `'[REVISAR: mecanismo resumido]'`
- `beneficios_documentados`: `{"[REVISAR: benefícios]"}`
- `efeitos_colaterais`: `{"[REVISAR: colaterais]"}`
- `referencias`: `{"[REVISAR: referencias]"}`

---
**Próximos Passos:** 
Para aplicar estas mudanças no Supabase:
Se o Supabase CLI estiver configurado, execute:
```bash
supabase db reset
```
Caso contrário, você pode copiar e colar o conteúdo dos 5 scripts SQL diretamente no Editor SQL do dashboard do Supabase (em ordem sequencial de 01 a 05).
