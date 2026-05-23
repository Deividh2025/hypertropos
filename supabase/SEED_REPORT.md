# Relatório de Seed e Rigor Científico (SEED_REPORT.md)

Este relatório compila os dados científicos, cinesiológicos e nutricionais populados com sucesso nos scripts de migração iniciais para o projeto Hypertropos.

## Resumo Quantitativo
- **Exercícios de Calistenia Populados:** 50 (Cobrem integralmente o currículo do Apêndice A)
- **Referências Científicas Cadastradas:** 16 (Estudos reais e meta-análises de Brad Schoenfeld, Stuart Phillips, etc.)
- **Fichas de Suplementos Esportivos:** 9 (Creatina, Whey, Caseína, Cafeína, Beta-Alanina, Citrulina, Vitamina D, Ômega-3, mais o controle de Sem Evidência)
- **Associações Exercício-Referência (Junction Table):** 86 junções criadas na matriz de rigor científico

---

## ✅ Resolução Completa de Placeholders e Dados Reais

> [!NOTE]
> **Status do Banco de Dados: PRONTO PARA PRODUÇÃO (Production Ready)**
> Todos os placeholders provisórios (`[REVISAR: ...]`) foram **eliminados** e substituídos por dados de alta fidelidade extraídos diretamente dos quatro manuais cinesiológicos e de pesquisa científica localizados na pasta `docs/`.

### 1. Exercícios (`20260520000002_seed_exercicios.sql`)
- **Fidelidade Cinesiológica**: Descrições de execução minuciosas e orientações técnicas escritas em linguagem profissional (PT-BR).
- **Métricas de GRF%**: Integrada a porcentagem exata de Força de Reação do Solo com base científica para as variações (ex: Flexão de Joelhos = 49% BW, Flexão Padrão = 64% BW, Flexão Declinada = 74% BW, Flexão Arqueiro = 78% BW, HSPU Excêntrica = 90% BW).
- **Perfil de Estresse Articular**: Mapeamento preciso por região do nível de estresse físico para proteção em caso de restrições (ex: `sissy_squat_assisted` mapeado com estresse alto em "joelho", `push_pseudo_planche` com estresse alto em "ombro" e "punho").
- **Tipagem Estrita**: Nomes alternativos corrigidos, arrays de dicas técnicas, contraindicações articulares e faixas de repetição devidamente estruturados em JSONB.

### 2. Referências (`20260520000003_seed_referencias.sql`)
- IDs corrigidos de formato genérico para registros reais da literatura médica (ex: `schoenfeld_2016_rest`, `kikuchi_nakazato_2017`, `lopez_2021`, etc.).
- Informações completas de autoria, periódico, DOI/PubMed e uma **síntese acessível e instrutiva** para exibição direta ao usuário final.

### 3. Junções de Rigor (`20260520000004_link_exercicios_referencias.sql`)
- Mapeamento de 1 a 3 das referências reais para cada um dos 50 exercícios cadastrados. Garante que ao visualizar qualquer exercício no catálogo, o app exiba as bases científicas que justificam sua presença no plano.

### 4. Suplementos Esportivos (`20260520000005_seed_suplementos.sql`)
- Fichas preenchidas com as posições oficiais consolidadas da **ISSN (International Society of Sports Nutrition)**.
- Adicionadas dosagens funcionais, timings e fórmulas de dosagem dinâmica vinculadas ao peso corporal do usuário.

---

## 🚀 Como Aplicar as Migrações no Supabase

Para aplicar todas as migrações e popular as sementes em seu banco de dados Supabase:

1. **Se você possui o Supabase CLI instalado localmente:**
   Execute o comando de reset para reiniciar o banco local e aplicar migrations/seeds sequenciais:
   ```bash
   supabase db reset
   ```

2. **Caso esteja utilizando o painel web do Supabase:**
   Você pode copiar e executar o conteúdo dos arquivos SQL diretamente no **SQL Editor** do dashboard do Supabase na seguinte ordem sequencial para evitar conflito de chaves:
   1. `20260520000001_initial_schema.sql`
   2. `20260520000002_seed_exercicios.sql`
   3. `20260520000003_seed_referencias.sql`
   4. `20260520000004_link_exercicios_referencias.sql`
   5. `20260520000005_seed_suplementos.sql`
   6. `20260523000001_progresso_optimizations.sql`
