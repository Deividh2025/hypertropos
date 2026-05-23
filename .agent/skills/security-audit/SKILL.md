---
name: Security Audit
description: Diretrizes rigorosas e auditoria para proteção de rotas no React e Row Level Security (RLS) no Supabase.
---

# Security Audit

Esta skill fornece o framework mandatório para garantir a blindagem de aplicações React conectadas ao Supabase, com foco especial em arquiteturas multi-tenant. O principal objetivo é garantir vazamento **zero** de dados entre tenants e evasão **zero** nas rotas privadas do cliente.

## 1. Protocolos de Proteção de Rotas (Frontend / React)

### A. Validação de Sessão vs Validação de Autorização
No frontend, a autenticação diz "quem" é o usuário, a autorização diz o que ele "pode fazer" e de onde ele é. Nunca confie **apenas** no frontend. Toda rota crítica no React deve agir como primeira camada de defesa, empurrando a verificação final para o backend (RLS).

### B. Proteção em Camadas

**1. Root Protectors (`ProtectedRoute`)**
A rota protegida clássica deve sempre verificar se a `session` existe. Caso contrário, rotear para `/auth`.
Em sistemas Multi-Tenant (ex: Innova Pro), a `ProtectedRoute` também tem o dever de verificar se o "onboarding" está concluído:
- Identificar se o usuário já possui um *tenant_id / office_id*.
- Em caso negativo, interceptar o render do app e redirecionar compulsoriamente para `/onboarding` ou tela de setup.

**2. Role Protectors (`AdminRoute` / Hook `useUserRole`)**
Acesso a telas administrativas não deve ser protegido apenas por ocultar um link na `Sidebar`. A rota propriamente dita precisa ser envelopada:
- A verificação de *role* do Frontend nunca pode morar apenas no cache do navegador (ex: LocalStorage), pois é facilmente adulterável.
- Use react-query ou fetch em tempo real contra uma tabela de papéis segura (ex: `user_roles` com policy rígida).

### C. Redirecionamentos de Segurança
Se uma rota que necessita de papel de `admin` for invocada por um `collaborator`, dispare o redirecionamento imediato para a página padrão permitida (ex: `/dashboard`) e opcionalmente emita um *throw/toast* ("Acesso Negado").

---

## 2. Protocolos Supabase & Row Level Security (RLS)

A regra de ouro: **O frontend é inseguro por design.** A única barreira real são as policies do banco de dados (Supabase PostgreSQL).

### A. Blindagem Total do Banco
- RLS (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`) deve estar LIGADO para rigorosamente **todas** as tabelas do `public`.
- Políticas `ALL` genéricas devem ser evitadas. Crie políticas separadas: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

### B. O Padrão Multi-Tenant Seguro

Todos os dados operacionais pertencem a um Tenant (`office_id`). O usuário também pertence a esse Tenant.
A policy suprema em qualquer consulta é garantir que o id do Tenant batendo no registro seja idêntico ao do usuário. 
Sempre force o match com funções `SECURITY DEFINER`:

```sql
CREATE POLICY "Acesso isolado ao tenant" 
ON public.cases 
FOR ALL USING (
    office_id = public.get_user_office_id()
);
```

### C. Evitando Recursões (Infinite Recursion)
Muito comum ao ler regras de acesso (RBAC). 
Se a tabela de permissões (`user_roles`) buscar se o usuário é "admin" lendo uma tabela sobre a qual tem uma policy baseada em "se ele for admin", a query quebra.

**A Solução Segura:**
Crie funções RPC com `SECURITY DEFINER` que sobem os privilégios do PostgreSQL localmente apenas durante a avaliação:

```sql
CREATE FUNCTION has_role(user_id uuid, check_role app_role) 
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = has_role.user_id 
    AND ur.role = check_role
  );
END;
$$;
```

### D. Dados Passados pelo Cliente (O Perigo do INSERT)
Usuários mal-intencionados podem montar o próprio POST pro Supabase alterando os dados.
- O `created_by` nunca pode vir do input web (json). O Supabase Database deve inferir usando `auth.uid()`.
- O `office_id` (Tenant) não deve vir no Input; o trigger do banco deve pegar o Office vinculado ao `auth.uid()` em inserções.
- Se o envio de dados for necessário no frontend, use a diretriz `WITH CHECK` no RLS para que rejeite imediatamente caso o id enviado não pertença ao dono da sessão.

## 3. Checklist Contínuo do Security Auditor:

Antes de dizer que um módulo "está pronto", faça o double-check obrigatório:
1. [ ] A tabela da nova Funcionalidade tem RLS ativado? (Confira as migrações).
2. [ ] Se um atacante fizer um `Fetch` direto na API de `/rest/v1/tabela_nova` com o token dele, ele verá os clientes do Escritório Y?
3. [ ] Existe link para a página na UI que está sendo injetada pela URL direta (`/financeiro`) mas o Router deixa o component montar sem check do cache/BD?
4. [ ] Operações de `UPDATE` bloqueiam a reescrita do campo `created_by` e do campo de tenant `office_id`? (O ideal é usar `TRIGGER` para travar que eles nunca mudem).

*- Fim das diretrizes de Security Audit -*
