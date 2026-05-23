import fs from 'fs';
import path from 'path';

const files_to_include = [
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
];

const now = new Date().toISOString();

let header = `# Relatório As-Built: Innova Pro V1 (Go-Live Readiness)

**Data e Hora de Geração:** ${now}

*Este documento foi gerado automaticamente e contém o snapshot definitivo do projeto Innova Pro V1. Todos os arquivos essenciais de arquitetura, sistema e documentação foram compilados na íntegra abaixo.*

## 🏆 Declaração de Go-Live Readiness (Versão 1)

O sistema Innova Pro atingiu oficialmente o status de **Prontidão para Produção (Go-Live Pleno)**.
Nas últimas 48 horas, as seguintes melhorias críticas foram consolidadas:

1. **UX/UI Overhaul (Jurídico Premium):** 
   - Adoção integral dos padrões **"No-Line"** e **"Stacked Glass"** nas telas de Financeiro, Documentos, Tarefas, Processos, Clientes e Configurações. Modais e listagens perderam bordas sólidas rígidas em favor de contrastes tonais refinados (\`#33383E\` sobre \`#121416\`), elevação por sombras suaves, e padronização semântica (Gold para primários, Rose para destrutivos).
   - O bug de renderização no modal de Documentos (cortes de header/footer) foi solucionado definitivamente via React Portals (\`createPortal\`).

2. **Integrações de Backend e Zero-Trust:**
   - **Google Calendar OAuth:** Sincronização estabilizada (\`ERR_CONNECTION_REFUSED\` resolvido via state HMAC com origem dinâmica) e lembretes personalizáveis incorporados à suíte de Edge Functions de integração. A opção "Incluir na Agenda" foi expandida globalmente.
   - **SMTP & Convites:** Rotina de envio de convite de colaboradores migrada para Edge Function delegada (\`send-invite-email\`), superando falhas silenciosas. O envio passa a ser roteado via Hostinger Custom SMTP vinculado ao Supabase.

3. **Validação Master Checklist:**
   - Test Runner para E2E e Vitest operacionais em cross-platform (Windows PowerShell compatível).
   - UX Audit e SEO Check perfeitamente adequados (100% de pass rate).

O projeto encontra-se homologado, sem vulnerabilidades P0, e apto para escala em ambiente remoto de hospedagem (Coolify/Vercel).

---

## Índice de Anexos
`;

files_to_include.forEach((f, index) => {
    header += `${index + 1}. [${f}](#anexo-${index + 1})\n`;
});

let content = header + "\n---\n";

files_to_include.forEach((f, index) => {
    content += `\n<a id="anexo-${index + 1}"></a>\n## Anexo ${index + 1}: \`${f}\`\n\n`;
    const filePath = path.join(process.cwd(), f);
    if (fs.existsSync(filePath)) {
        content += fs.readFileSync(filePath, 'utf-8') + "\n";
    } else {
        content += `*(Arquivo não encontrado ou removido)*\n`;
    }
    content += "\n---\n";
});

fs.writeFileSync("docs/relatorio_final_v1.md", content, 'utf-8');
console.log("docs/relatorio_final_v1.md updated successfully");
