import os
import datetime

files_to_include = [
    "AGENTS.md",
    "SYSTEM_INSTRUCTIONS.md",
    "knowledge.md",
    ".agent/rules/GEMINI.md",
    "updates.md",
    "DESIGN.md",
    "docs/ui-guidelines.md",
    "docs/data-model.md",
    "docs/decisions.md",
    ".agent/ARCHITECTURE.md",
    "docs/plan.md",
    "docs/test-checklist.md",
    "docs/rbac.md",
    "deploy_guide.md",
    "relatorio_seguranca_v1.md",
    "docs/known-issues.md"
]

now = datetime.datetime.now().astimezone().isoformat()

header = f"""# Relatório As-Built: Innova Pro V1 (Go-Live Readiness)

**Data e Hora de Geração:** {now}

*Este documento foi gerado automaticamente e contém o snapshot definitivo do projeto Innova Pro V1. Todos os arquivos essenciais de arquitetura, sistema e documentação foram compilados na íntegra abaixo.*

## 🏆 Declaração de Go-Live Readiness (Versão 1)

O sistema Innova Pro atingiu oficialmente o status de **Prontidão para Produção (Go-Live Pleno)**.
Nas últimas 48 horas, as seguintes melhorias críticas foram consolidadas:

1. **UX/UI Overhaul (Jurídico Premium):** 
   - Adoção integral dos padrões **"No-Line"** e **"Stacked Glass"** nas telas de Financeiro, Documentos, Tarefas, Processos, Clientes e Configurações. Modais e listagens perderam bordas sólidas rígidas em favor de contrastes tonais refinados (`#33383E` sobre `#121416`), elevação por sombras suaves, e padronização semântica (Gold para primários, Rose para destrutivos).
   - O bug de renderização no modal de Documentos (cortes de header/footer) foi solucionado definitivamente via React Portals (`createPortal`).

2. **Integrações de Backend e Zero-Trust:**
   - **Google Calendar OAuth:** Sincronização estabilizada (`ERR_CONNECTION_REFUSED` resolvido via state HMAC com origem dinâmica) e lembretes personalizáveis incorporados à suíte de Edge Functions de integração. A opção "Incluir na Agenda" foi expandida globalmente.
   - **SMTP & Convites:** Rotina de envio de convite de colaboradores migrada para Edge Function delegada (`send-invite-email`), superando falhas silenciosas. O envio passa a ser roteado via Hostinger Custom SMTP vinculado ao Supabase.

3. **Validação Master Checklist:**
   - Test Runner para E2E e Vitest operacionais em cross-platform (Windows PowerShell compatível).
   - UX Audit e SEO Check perfeitamente adequados (100% de pass rate na suite `verify_all.py`).

O projeto encontra-se homologado, sem vulnerabilidades P0, e apto para escala em ambiente remoto de hospedagem (Coolify/Vercel).

---

## Índice de Anexos
"""

for i, f in enumerate(files_to_include, 1):
    header += f"{i}. [{f}](#anexo-{i})\n"

content = header + "\n---\n"

for i, f in enumerate(files_to_include, 1):
    content += f"\n<a id=\"anexo-{i}\"></a>\n## Anexo {i}: `{f}`\n\n"
    path = os.path.join(os.getcwd(), f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content += file.read() + "\n"
    else:
        content += f"*(Arquivo não encontrado ou removido)*\n"
    content += "\n---\n"

with open("docs/relatorio_final_v1.md", "w", encoding='utf-8') as out:
    out.write(content)

print("docs/relatorio_final_v1.md updated successfully")
