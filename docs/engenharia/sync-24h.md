# Plano de Ação - Registro e Sincronização 24h (sync-24h)

> **Plano Mestre de Documentação, Validação e Sincronização do Trabalho das Últimas 24h**
> Este documento detalha a coordenação entre os agentes para auditar, documentar, validar e sincronizar com segurança as alterações massivas realizadas no projeto Hypertropos.

---

## 📋 Overview

Nas últimas 24 horas, o projeto Hypertropos (um aplicativo de hipertrofia offline-first baseado em Expo) recebeu atualizações significativas em múltiplas frentes de desenvolvimento:
1. **Onboarding & Experiência de Usuário**: Refinamento do fluxo de onboarding de 14 telas, silhuetas interativas em SVG e telas de transição de tiers.
2. **Execução de Treinos & Gamificação**: UI de execução de séries passo a passo, motor de comemoração, partículas, haptics, keep-awake, transições de conquistas e celebrações.
3. **Mecanismo Científico & Artigos**: Integração de 18 artigos científicos originais de biomecânica e nutrição na pasta `content/artigos/` e vinculações nas migrações do Supabase.
4. **Infraestrutura de Dados Offline & Hooks**: Migrações de banco de dados local para nutrição, notificações e artigos, além de hooks customizados para evolução de peso, cálculo proteico e controle de sons.

Este plano fornece um roteiro estruturado para que os agentes **Explorer Agent**, **Documentation Writer**, **Test Engineer** e **DevOps Engineer** trabalhem em harmonia para consolidar essas alterações, realizar testes de integridade e subir os commits para a branch principal (`main`).

> [!IMPORTANT]
> **Regra de OS (Windows):** Como o ambiente do usuário é Windows com PowerShell, todos os comandos executados pelos agentes devem seguir estritamente as convenções de sintaxe do PowerShell.
> **Regra de Versão do Expo:** Qualquer verificação ou alteração de código subsequente deve estar em estrita conformidade com a documentação do Expo v56.0.0.

---

## 🎯 Project Type

- **Tipo de Projeto:** `MOBILE` (React Native com Expo Router, NativeWind, SQLite local via Expo SQLite/Kysely/Prisma e Supabase no backend).
- **Agente Principal:** `mobile-developer` (para lógica e interface mobile).
- **Agente de Planejamento:** `project-planner` (coordenação inicial).
- **Agente de Documentação:** `documentation-writer` (elaboração de relatórios).

---

## 🏆 Success Criteria

O projeto será considerado sincronizado e completo quando:
- [ ] Um relatório técnico detalhado (`docs/RELATORIO_24H.md`) for escrito em português detalhando todas as alterações e artigos científicos indexados.
- [ ] As validações de lint e type-checking do TypeScript passarem com zero erros estruturais.
- [ ] Os testes unitários associados às lógicas adicionadas (como `tests/calculadora-proteina.test.ts`) executarem com sucesso.
- [ ] O script de integridade e auditoria de segurança `.agent/scripts/checklist.py` retornar sucesso sem vulnerabilidades ou vazamentos críticos de segredos.
- [ ] Todas as alterações (modificadas e untracked) forem adicionadas ao Git, commitadas com mensagens semânticas claras e enviadas de forma segura ao repositório remoto na branch `main`.

---

## 🛠️ Tech Stack

A arquitetura do projeto utiliza a seguinte pilha tecnológica para as frentes alteradas:
- **Framework Mobile:** Expo v56.0.0 (React Native, Expo Router)
- **Estilização:** Tailwind CSS v4 (NativeWind) com tema customizado (Zero violetas/roxos, respeitando a *Purple Ban*)
- **Banco de Dados Local:** SQLite gerido de forma offline-first com queries SQL e migrações locais estruturadas
- **Backend / Sementes:** Supabase (PostgreSQL), migrations de dados e seeds científicos
- **Motor de Áudio e Feedback:** Expo Audio & Expo Haptics para imersão no treino

---

## 📁 File Structure (Principais Áreas Afetadas)

```plaintext
hypertropos/
├── app/
│   ├── (tabs)/                  # Telas de navegação tabulada (Home, Ciência, Nutrição, Progresso)
│   ├── onboarding/              # Telas do fluxo de onboarding de 14 etapas (Gênero, Horário, Nível)
│   ├── treino/                  # Telas de execução ativa de treino (Execução, Pre-Treino, Semana)
│   ├── artigo/[id].tsx          # Visualização dinâmica de artigos científicos (Nova!)
│   ├── exercicio/[id].tsx       # Visualização de detalhes de exercícios (Nova!)
│   └── suplemento/              # Visualização de detalhes de suplementos (Nova!)
├── assets/
│   └── sounds/                  # Arquivos de som (.wav) para feedback sonoro (Novos!)
├── components/
│   ├── feedback/                # Animações de conquista e transição de tier (CelebracaoConquista, TransicaoTier)
│   ├── silhueta/                # Elementos visuais em SVG para evolução corporal (SilhuetaHome, SilhuetaProgresso)
│   ├── treino/                  # Componentes de execução (BotaoConcluirSerie, HeaderProgresso, BotaoMusica)
│   ├── nutricao/                # Componentes para a tela de nutrição (Novos!)
│   └── ui/                      # Esqueletos (Skeletons) e indicadores (IndicadorConexao)
├── content/
│   └── artigos/                 # 18 Artigos científicos de hipertrofia em Markdown (Novos!)
├── db/
│   ├── migrations/local/        # Migrações offline do banco SQLite (Nutrition, SecaoCientifica)
│   ├── queries/                 # Consultas tipadas para treinos, suplementos, artigos e programas
│   └── schema-local.ts          # Schema do banco de dados SQLite local
├── hooks/                       # React Hooks customizados (useEvolucaoPeso, useMetaProteina, useSound, etc.)
├── lib/                         # Biblioteca de lógica pura (Calculadora de proteína, motor de áudio, personalização)
├── stores/                      # Stores de estado global do Zustand (gamificacaoStore, programaStore, sessaoStore)
├── supabase/
│   ├── migrations/              # Migrações do Supabase para seed de dados científicos
│   └── SEED_REPORT.md           # Relatório das sementes aplicadas
└── tests/                       # Testes de unidade e lógica de estados (sessaoStore, calculadora-proteina)
```

---

## 📋 Task Breakdown

A sincronização será executada de forma serial e coordenada através de 4 tarefas principais:

### 🎯 Task 1: Análise Detalhada de Diffs (Discovery)
- **ID da Tarefa:** `TSK-001`
- **Agente Responsável:** `explorer-agent`
- **Habilidades Associadas:** `clean-code`, `behavioral-modes`
- **Prioridade:** `P0` (Bloqueador Geral)
- **Dependências:** Nenhuma
- **Descrição:** Analisar o diff completo das últimas 24 horas no Git (`git diff` das modificadas e listagem das `untracked`). O objetivo é compilar o escopo exato de tudo o que foi desenvolvido para garantir que nada seja esquecido no relatório técnico.
- **INPUT:** Repositório local com modificações pendentes.
- **OUTPUT:** Lista detalhada de todos os módulos modificados, novas telas, novos arquivos de som, migrações e lista exata dos 18 artigos adicionados.
- **VERIFY:** Exibição da saída estruturada das mudanças mapeadas pelo Explorer.

---

### 🎯 Task 2: Elaboração do Relatório Técnico
- **ID da Tarefa:** `TSK-002`
- **Agente Responsável:** `documentation-writer`
- **Habilidades Associadas:** `documentation-templates`, `clean-code`
- **Prioridade:** `P1`
- **Dependências:** `TSK-001`
- **Descrição:** Redigir o arquivo `docs/RELATORIO_24H.md` em português brasileiro. O relatório deve ser exaustivo e profissional, dividindo as atualizações por blocos funcionais, listando os arquivos criados/modificados, as migrações offline e online executadas, e a listagem temática detalhada dos 18 artigos científicos integrados ao app.
- **INPUT:** Relatório de discovery gerado pela Task 1 e arquivos do repositório.
- **OUTPUT:** Arquivo `docs/RELATORIO_24H.md` criado e salvo com estrutura impecável.
- **VERIFY:** Comando `Test-Path docs/RELATORIO_24H.md` no PowerShell retornando `$true` e leitura visual de sua completude.

---

### 🎯 Task 3: Verificação de Integridade e Testes
- **ID da Tarefa:** `TSK-003`
- **Agente Responsável:** `test-engineer` / `security-auditor`
- **Habilidades Associadas:** `testing-patterns`, `vulnerability-scanner`, `lint-and-validate`
- **Prioridade:** `P1`
- **Dependências:** `TSK-002`
- **Descrição:** Rodar a suíte de verificação integrada para garantir que as alterações maciças não quebraram a tipagem do TypeScript, lint ou testes de lógica.
  1. Executar verificação de tipos e lint local.
  2. Rodar os testes unitários com Jest (`npm test`).
  3. Rodar o script `checklist.py` localizado na pasta `.agent/scripts/` para auditoria de vulnerabilidades e UX.
- **INPUT:** Código fonte modificado.
- **OUTPUT:** Relatório de testes executados com sucesso (zero erros de lint, zero falhas de testes, aprovação do scanner de segurança).
- **VERIFY:** Logs de execução bem-sucedidos dos comandos `npm run lint`, `npx tsc --noEmit`, `npm test` e `python .agent/scripts/checklist.py .`.

---

### 🎯 Task 4: Sincronização Segura do Git (Git Syncing)
- **ID da Tarefa:** `TSK-004`
- **Agente Responsável:** `devops-engineer`
- **Habilidades Associadas:** `deployment-procedures`, `powershell-windows`
- **Prioridade:** `P2`
- **Dependências:** `TSK-003`
- **Descrição:** Realizar o stage seguro das alterações, commit estruturado e semântico e upload para a branch remota.
  1. Fazer `git add .` para incluir todas as modificações, novos hooks, migrações locais, sons e artigos científicos.
  2. Criar commits semânticos separados ou um commit único massivo e bem documentado, como `feat: consolidado de atualizações das últimas 24h (onboarding, execucao, ciencia e offline DB)`.
  3. Executar o push seguro para `origin main`.
- **INPUT:** Repositório verificado e pronto para commit.
- **OUTPUT:** Mudanças sincronizadas com sucesso no Git remoto.
- **VERIFY:** Execução de `git status` retornando *working tree clean* e `git log -n 1` mostrando o commit de sincronização no topo.

---

## 🏁 Phase X: Final Verification & Audit Checklist

Esta fase final de auditoria deve ser executada de forma obrigatória antes de declarar a tarefa concluída por completo.

```powershell
# 1. Executar o Checklist Geral do Agente
python .agent/scripts/checklist.py .

# 2. Rodar Testes de Unidade
npm test

# 3. Rodar Type-Checking do TypeScript
npx tsc --noEmit
```

### Critérios de Aceitação de Design & UX (Manual Check)
- [ ] **Purple Ban:** Garantir que nenhuma alteração de UI ou componente de estilos do Tailwind utilize cores na paleta roxa/violeta.
- [ ] **Acessibilidade:** Botões de execução de treino e conclusão de séries possuem áreas de toque com no mínimo `44px` de dimensão.
- [ ] **Segurança:** O script `security_scan.py` foi executado com sucesso e não há nenhuma chave de API ou segredo exposto nos arquivos rastreados ou untracked.

### ✅ PHASE X COMPLETE
- Lint & Typecheck: [ ] Pass
- Unit Tests: [ ] Pass
- Security Check: [ ] Pass
- Audit Report: [ ] Created
- Git Sincronizado: [ ] Success
- Date: 2026-05-23
