# Plano Mestre de Auditoria, Segurança e Varredura Completa

Este plano detalha o escopo de execução da auditoria massiva solicitada pelo usuário para o projeto **Hypertropos**. A execução envolve a coordenação paralela de múltiplos agentes especialistas após a aprovação.

---

## 📋 Mapeamento de Domínios & Agentes

A varredura abrangerá as seguintes frentes técnicas:

| Domínio | Foco da Auditoria | Agente Especialista |
|:---|:---|:---|
| **Segurança & Dados** | Vazamentos de chaves de API, segredos EAS, permissões e Row Level Security (RLS) no Supabase. | `security-auditor` |
| **Integridade de Lógica** | Análise de hooks customizados, motor de áudio/ducking, Zustand stores e migrações SQLite. | `debugger` / `explorer-agent` |
| **Qualidade & Cobertura** | Testes de unidade, detecção de lacunas de cobertura e novas suítes Jest/Vitest. | `test-engineer` |
| **Automação & Sincronização** | Execução de checklists de CI/CD, lint, type-checking e commit/push seguro. | `devops-engineer` |

---

## 🛠️ Fases de Execução

### Fase 1: Planejamento & Portão Socrático (Fase Atual)
- [x] Mapeamento inicial da estrutura do repositório.
- [x] Criação do plano de ação técnica e do artefato de implementação (`implementation_plan.md`).
- [ ] Obtenção de respostas ao **Portão Socrático** e aprovação do usuário.

### Fase 2: Auditoria & Varredura Prática (Pós-Aprovação)
- [ ] **Execução Paralela de Agentes:**
  - `security-auditor` executa `security_scan.py` e analisa arquivos de configuração (`app.json`, `.env`).
  - `debugger` analisa arquivos React Native, hooks e stores por bugs ou loops de estado.
  - `test-engineer` executa `npm test` e cria suítes de teste de unidade adicionais para componentes críticos.
- [ ] **Ajustes Automáticos & Correções:**
  - Correção de lints e problemas de tipagem.
  - Ajuste de brechas de segurança ou segredos expostos.
  - Otimização do design Tailwind para conformidade estrita com o *Purple Ban*.
- [ ] **Verificação de Regressão e Qualidade:**
  - Execução bem-sucedida do script `.agent/scripts/checklist.py .`.
  - Zero erros em `npx tsc --noEmit`.

### Fase 3: Sincronização Git Final (DevOps)
- [ ] Execução de `git status` e stage de todas as correções de forma granular.
- [ ] Criação de commits semânticos robustos e profissionais (ex: `sec: correções de segurança no roteamento e chaves API` ou `fix: correções de lint e tratamento de erros no motor de áudio`).
- [ ] Push seguro para o repositório remoto na branch aprovada.

---

## 🏆 Critérios de Aceitação

A auditoria e varredura serão consideradas concluídas com sucesso total quando:
1. **Zero Vulnerabilidades:** `security_scan.py` e scanner de dependências retornarem aprovação total com zero segredos expostos.
2. **Qualidade Total:** Lint e type-checking passarem sem qualquer erro estrutural.
3. **Robustez de Testes:** A suíte de testes unitários existente e os novos testes criados executarem com 100% de sucesso.
4. **Sincronização Segura:** O repositório local estiver completamente limpo e sincronizado via Git commit/push com o repositório remoto.
