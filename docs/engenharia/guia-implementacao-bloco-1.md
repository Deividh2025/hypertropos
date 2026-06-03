# Guia de Implementação Fase a Fase — Bloco 1

**Projeto:** App de Hipertrofia em Casa com Peso Corporal
**Bloco:** 1 de 3 (Setup + Fases 0-3)
**Versão:** 1.0
**Data:** Maio de 2026

**Cobertura deste bloco:**
- Setup do Ambiente (Antigravity, Codex, Antigravity Kit, GitHub, Supabase)
- Fase 0 — Setup do Projeto Expo
- Fase 1 — Sistema de Design Tokens e Componentes Base
- Fase 2 — Modelo de Dados e Catálogo Inicial
- Fase 3 — Onboarding Expandido

**Blocos seguintes:**
- Bloco 2 — Fases 4-7 (Algoritmo de Rotina, Tela de Execução, Silhueta + Dopaminérgico, Tela de Progresso)
- Bloco 3 — Fases 8-12 (Conteúdo Científico, Nutrição, Design Sonoro, Polish, APK Final)

---

## Introdução: Como Usar Este Playbook

Este documento é seu manual operacional para construir o app fase por fase. Ele não substitui o PRD — o PRD V3 é a fonte de verdade do produto, este playbook é o roteiro de execução. Você terá o PRD aberto numa aba e este playbook em outra durante todo o processo.

Cada fase deste bloco tem oito componentes:

1. **Objetivo da fase** — o que se entrega ao final.
2. **Pré-requisitos** — o que precisa estar pronto antes de começar.
3. **Divisão de trabalho** — o que vai no Antigravity e o que vai no Codex.
4. **Modelo recomendado** — qual modelo e nível de raciocínio usar para cada prompt.
5. **Agentes, skills e workflows** — recursos do Antigravity Kit quando aplicável (opcional).
6. **Prompts prontos** — texto literal para colar nas ferramentas.
7. **Critérios de validação** — checklist do que precisa estar funcionando antes de avançar.
8. **Notas e armadilhas comuns** — o que tipicamente dá errado nessa fase e como evitar.

Leia uma fase inteira antes de começá-la. Não pule direto para o prompt, porque o contexto das outras seções é o que faz o prompt funcionar.

---

## Setup do Ambiente — Antes de Começar Qualquer Fase

Esta seção é uma única vez, antes da Fase 0. Reserve uma tarde ou uma manhã para fazer com calma — fazer setup com pressa custa caro nas semanas seguintes.

### 1. Sobre os Modelos de IA — Conceitos Que Vão Te Servir o Projeto Inteiro

Antes de mexer em ferramenta, deixa eu te alinhar mentalmente sobre como escolher modelos de IA, porque essa escolha vai aparecer em quase todo prompt deste playbook.

**Três categorias de modelo, não nomes específicos:**

Em vez de decorar "Gemini 3.1 Pro High" ou "Claude Sonnet 4.6 Thinking", pense em três categorias funcionais:

**Categoria Forte (reasoning alto):** modelo mais capaz, para arquitetura, design de sistemas, debugging difícil, auditoria crítica, decisões sensíveis. Custa mais tokens, demora mais, mas pensa profundamente. Quando estamos no Antigravity, isso é o Gemini Pro nível alto ou Claude Opus Thinking. No Codex, é o GPT-5 mais forte disponível com reasoning High ou Extra High.

**Categoria Média (reasoning padrão):** modelo de implementação cotidiana, quando o plano já está claro e o agente só precisa executar bem. Bom equilíbrio entre custo e qualidade. No Antigravity, é o Claude Sonnet Thinking. No Codex, é o GPT-5 médio com reasoning Medium.

**Categoria Rápida (reasoning baixo):** ajustes pontuais, microcopy, CSS pequeno, correção de label. Use quando a tarefa é trivial e localizada. No Antigravity, é Gemini Flash. No Codex, é o GPT-5 com reasoning Low.

**Regra de bolso para escolher:** se você está pedindo para o agente **decidir como fazer algo**, use Forte. Se está pedindo para **executar algo já decidido**, use Médio. Se é **um ajuste de uma linha ou retoque visual**, use Rápido.

Cada prompt deste playbook vai indicar qual categoria usar. Quando você abrir a ferramenta, escolha o modelo mais recente da categoria correspondente disponível na data — os nomes podem ter mudado desde a redação deste documento.

### 2. Divisão de Trabalho Entre Antigravity e Codex

Você vai usar as duas ferramentas em paralelo, e elas têm papéis bem distintos no nosso playbook:

**Antigravity é o construtor visual e de UI.** Tudo que envolve telas, componentes React Native, animações, microinterações, silhueta corporal via Skia, integração com Lottie, design tokens aplicados em componentes, fluxo de onboarding visual, configuração de fontes e tema, navegação Expo Router. O Antigravity é melhor nisso porque o Agent Manager dele permite múltiplos agentes trabalhando em telas separadas em paralelo, e a renderização visual está integrada ao IDE.

**Codex é o motor de lógica e dados.** Schema do Supabase, migrations SQL, algoritmo de geração de rotina, motor de cálculo de definição muscular da silhueta, sistema de XP/streak/conquistas, sync engine offline-first, queries SQL, tipos TypeScript do modelo de dados, populamento do catálogo de exercícios a partir dos seus 4 arquivos de pesquisa, e qualquer refatoração ou auditoria de código. O Codex é melhor nisso porque tem reasoning mais previsível para lógica de domínio, integra bem com Git para PRs de código, e a app de desktop dele tem fluxo de auditoria de código superior.

**Eles se encontram no Git.** O Antigravity trabalha em branches de UI (`feat/ui-onboarding`, `feat/ui-silhueta`), o Codex em branches de domínio (`feat/db-schema`, `feat/algoritmo-rotina`), e o merge acontece em pontos planejados do roadmap. Em alguns momentos eles trabalham na mesma branch — vou sinalizar quando.

### 3. Sobre o Antigravity Kit (Opcional, Recomendado para Skills Específicas)

O guia ARCHITECTURE.md que você compartilhou descreve o **Antigravity Kit**, um conjunto open-source de 20 agentes especializados, 36 skills temáticas e 11 workflows (slash commands) que estende o Antigravity. Não é feature nativa do Google — é uma extensão de comunidade que você instala no seu projeto.

**Vale a pena instalar?** Para o seu projeto, vale, mas com **adoção parcial**. Tentar usar os 20 agentes do dia 1 vai te sobrecarregar. Você vai usar de verdade uns 5-6, e estes sim agregam valor:

- `mobile-developer` — para tudo que é React Native específico
- `frontend-specialist` — para componentes e padrões React
- `database-architect` — para schema do Supabase
- `debugger` — quando algo der errado e precisar de root cause analysis
- `ui-ux-pro-max` — para inspiração visual e validação de design

E destas skills:

- `mobile-design` — padrões de UI/UX mobile
- `react-best-practices` — otimizações React/Next
- `frontend-design` — UI/UX, design systems
- `database-design` — schema e otimização
- `systematic-debugging` — quando algo quebrar
- `tailwind-patterns` — para NativeWind
- `clean-code` — padrões gerais
- `testing-patterns` — quando for hora de testes
- `performance-profiling` — perto do polish final

Você invoca um agente do kit dentro do Antigravity com `@nome-do-agente` na conversa (sintaxe pode variar — confirme na documentação do kit). Invoca uma skill colocando ela no contexto ou citando explicitamente. Invoca um workflow com `/nome-do-workflow`.

Como instalar o kit fica fora do escopo deste playbook porque a instalação varia conforme a versão do kit e configuração do Antigravity. O caminho geral é clonar o repositório do kit, copiar a pasta `.agent/` para a raiz do seu projeto, e o Antigravity passa a reconhecer os agentes e skills automaticamente. Procure pela documentação atualizada do kit antes de instalar.

**Se você decidir não instalar:** sem problemas. Os prompts deste playbook funcionam sem o kit, porque eles já carregam o contexto necessário diretamente. Os campos "Agentes, skills e workflows" nas fases serão apenas referenciais opcionais.

### 4. Setup Concreto Passo a Passo

Agora as ações práticas:

**Passo 1 — Conta GitHub e repositório privado.** Crie um repositório privado no GitHub com nome do seu app (vamos chamar de `hypertropos` daqui por diante, mas substitua pelo nome que escolher). Não inicialize com README — Expo vai gerar tudo.

**Passo 2 — Conta Supabase e projeto.** Acesse supabase.com, crie um novo projeto com nome do app, escolha região mais próxima (São Paulo / sa-east-1 se disponível), guarde a Project URL e a Anon Key num lugar seguro. Você vai precisar delas no Passo 6.

**Passo 3 — Antigravity instalado e configurado.** Baixe o Antigravity, faça login com sua conta Google, conecte sua conta GitHub à plataforma (Settings → Integrations → GitHub), e confirme que você consegue clonar repositórios no Antigravity. Familiarize-se com o Agent Manager (Manager Surface) — é a aba onde você pode rodar múltiplos agentes em paralelo. No projeto, deixe-a aberta porque vamos usar muito.

**Passo 4 — Codex instalado e configurado.** Baixe o app de desktop do Codex (para sua plataforma) ou use a versão web. Faça login, conecte sua conta GitHub, e confirme que consegue ver seus repositórios. Familiarize-se com a interface de criação de task, com os controles de modelo e reasoning level.

**Passo 5 — Node.js e ferramentas locais.** Para que o Expo funcione no seu computador, você precisa de Node.js 20+ instalado localmente. Instale via instalador oficial (nodejs.org) ou via gerenciador de versão (nvm). Depois, instale o Expo CLI globalmente: `npm install -g expo`. Esse passo é necessário mesmo que o Antigravity faça a maior parte do trabalho — o build e os comandos de execução acontecem na sua máquina.

**Passo 6 — Expo Go no Galaxy S23.** Instale o app **Expo Go** da Google Play Store no seu celular. É grátis. Esse é o app que vai executar a versão de desenvolvimento do seu app — você edita código no computador, o Expo manda para o celular via QR Code, e em segundos você vê as mudanças. É o ciclo de iteração mais rápido para mobile.

**Passo 7 — Antigravity Kit (opcional).** Se decidir adotar, instale conforme a documentação atual do kit. Recomendo deixar para depois da Fase 0 — primeiro estabelece o projeto, depois adiciona o kit.

**Pronto. Tempo total estimado: 2 a 3 horas se nunca fez antes, 30 min se já tem GitHub/Supabase configurados.**

---

## Fase 0 — Setup do Projeto Expo

### Objetivo

Sair do zero (repositório vazio) e chegar num app "Hello World" rodando no Galaxy S23 via Expo Go, conectado ao Supabase, com todas as dependências principais instaladas e Git configurado.

### Pré-requisitos

Setup do ambiente concluído (seção anterior). Você tem: GitHub com repositório `hypertropos` (ou nome escolhido) vazio. Supabase com projeto criado, URL e Anon Key em mãos. Antigravity e Codex instalados e logados. Node.js 20+ instalado localmente. Expo Go instalado no Galaxy S23.

### Divisão de Trabalho Nesta Fase

Toda a Fase 0 acontece no **Antigravity**. Codex fica de fora — esta fase é setup e configuração, não requer lógica complexa. Antigravity é melhor aqui porque tem visibilidade do projeto inteiro e pode executar comandos de terminal observando os resultados em tempo real.

### Modelo Recomendado

**Categoria Forte** para o prompt inicial (você está pedindo para o agente projetar a estrutura inicial, decidir como organizar coisas, justificar escolhas). Especificamente, use Gemini Pro High ou Claude Opus Thinking — o que estiver disponível como modelo mais forte do Antigravity na data.

### Agentes, Skills e Workflows (se kit instalado)

- Agente: `project-planner` (para a estruturação inicial) e depois `mobile-developer` (para o setup React Native)
- Skills: `mobile-design`, `react-best-practices`, `clean-code`
- Workflow opcional: `/create` para criar o projeto base

### Prompt Pronto Para Antigravity

Abra o Antigravity, clone o repositório `hypertropos` vazio, e na conversa cole o seguinte prompt. Substitua os placeholders entre `<...>` pelos seus valores reais antes de enviar:

```
Você vai me ajudar a iniciar um projeto React Native com Expo. Este é o
primeiro setup do app, então atenção máxima aos fundamentos.

CONTEXTO DO PROJETO

Estou construindo um app pessoal de hipertrofia muscular em casa com peso
corporal. Ele tem quatro pilares: rigor científico real, interface
dopaminérgica e TDAH-friendly, adaptação a restrições articulares, e
nutrição inteligente. Uso pessoal apenas, sem distribuição na Play Store,
sem multi-usuário, sem autenticação tradicional. Vai rodar num Samsung
Galaxy S23 com Android 14+. O PRD completo está disponível, mas para esta
fase você só precisa saber o stack e os fundamentos.

STACK DEFINIDA NO PRD

Framework: React Native via Expo (managed workflow inicialmente).
Linguagem: TypeScript estrito.
Navegação: Expo Router (file-based).
Estilização: NativeWind (Tailwind para React Native).
Estado: Zustand.
Banco local: expo-sqlite + AsyncStorage para preferências.
Backend: Supabase (PostgreSQL).
Animações: React Native Reanimated 3 e Lottie (lottie-react-native).
Renderização vetorial customizada: react-native-skia (para a silhueta
corporal evolutiva — vamos usar nas fases futuras).
Haptic: expo-haptics.
Som: expo-av.
Notificações locais: expo-notifications.
Build: EAS Build para gerar APK no final.

CREDENCIAIS DO SUPABASE

Project URL: <COLE_SUA_PROJECT_URL_AQUI>
Anon Key: <COLE_SUA_ANON_KEY_AQUI>

TAREFAS DESTA FASE 0

1. Inicialize um projeto Expo TypeScript usando o template mais recente
   compatível com Expo SDK estável atual e Expo Router. Use o comando
   apropriado (npx create-expo-app com template tabs) e me explique cada
   escolha antes de executar.

2. Configure o tsconfig.json para modo estrito (strict: true) e adicione
   aliases de path (@/components, @/lib, @/db, @/hooks, @/stores, @/types,
   @/constants, @/assets).

3. Instale todas as dependências listadas acima como devDependencies ou
   dependencies conforme apropriado. Use as versões compatíveis com a SDK
   do Expo escolhida — verifique compatibilidade antes de instalar (Expo
   tem uma matriz de compatibilidade conhecida).

4. Crie a estrutura de pastas conforme especificado abaixo. Crie pastas
   vazias quando não houver conteúdo ainda (com .gitkeep dentro):

   projeto/
   ├── app/
   │   ├── (tabs)/
   │   ├── onboarding/
   │   ├── treino/
   │   ├── exercicio/
   │   ├── artigo/
   │   ├── configuracoes/
   │   └── _layout.tsx
   ├── components/
   │   ├── silhueta/
   │   ├── treino/
   │   ├── ui/
   │   └── feedback/
   ├── lib/
   ├── db/
   │   └── queries/
   ├── hooks/
   ├── stores/
   ├── types/
   ├── assets/
   │   ├── animations/
   │   ├── fonts/
   │   ├── sounds/
   │   └── images/
   ├── constants/
   ├── supabase/
   │   └── migrations/
   └── content/
       ├── artigos/
       └── suplementos/

5. Configure o cliente do Supabase em db/supabase-client.ts. Use a URL e
   a Anon Key dadas acima. Configure-o para usar AsyncStorage como
   storage adapter (necessário para React Native, não localStorage). Não
   habilite Row Level Security ainda — vamos configurar depois.

6. Configure NativeWind seguindo a documentação oficial mais recente.
   Crie o arquivo tailwind.config.js, o babel.config.js apropriado, e o
   global.css. Por enquanto, mantenha a configuração default do Tailwind
   — vamos sobrescrever com nossos tokens na Fase 1.

7. Configure expo-router. O _layout.tsx raiz deve ter Stack como
   navegador raiz. O _layout.tsx dentro de (tabs)/ deve ter Tabs como
   navegador. Crie um arquivo index.tsx dentro de (tabs)/ que mostre
   apenas "Hypertropos — Setup OK" centralizado na tela, em texto
   simples por enquanto.

8. Configure o app.json com os campos básicos: name "Hypertropos" (ou o
   nome que eu escolher), slug "hypertropos", version "0.1.0", orientation
   "portrait", icon e splash placeholder por enquanto, scheme
   "hypertropos", platforms ["android"], android com package
   "com.hypertropos.app" e versionCode 1.

9. Configure o .gitignore apropriado para projeto Expo, incluindo node_modules,
   .expo, dist, e qualquer arquivo de credenciais sensíveis. Crie um
   .env.example com placeholders das variáveis Supabase para o caso de
   futuramente movermos as credenciais para variáveis de ambiente.

10. Faça o primeiro commit com mensagem "chore: setup inicial do projeto
    Expo com TypeScript, NativeWind, Supabase e estrutura de pastas". Push
    para a branch main do GitHub.

CRITÉRIOS DE QUALIDADE

- Não invente dependências que não existem. Use somente bibliotecas
  oficialmente suportadas e atualizadas.
- Verifique compatibilidade de versão antes de instalar. Expo tem matriz
  de versões compatíveis — use as versões corretas para a SDK escolhida.
- Comentários em português brasileiro explicando POR QUE algo é feito,
  quando não for óbvio.
- Não execute comandos destrutivos sem me avisar antes.
- Se algum passo falhar, pare, me mostre o erro, e proponha duas
  alternativas antes de prosseguir.

VALIDAÇÃO ESPERADA AO FINAL

Depois de tudo configurado, rode "npx expo start" e gere um QR Code para
eu escanear com o Expo Go no meu Galaxy S23. Vou verificar que:
- O app abre no celular sem crash.
- Vejo a tela "Hypertropos — Setup OK" centralizada.
- O console do Expo não mostra erros graves.

Comece pelo passo 1 e me explique cada decisão antes de executar comandos
que modifiquem o repositório.
```

### Critérios de Validação Antes de Avançar para a Fase 1

Antes de seguir, confirme manualmente:

- O comando `npx expo start` roda sem erros no terminal.
- O QR Code aparece e você consegue escanear com Expo Go.
- O app abre no Galaxy S23 e mostra "Hypertropos — Setup OK".
- Não há erros vermelhos no console do Expo.
- O repositório GitHub tem o primeiro commit com toda a estrutura.
- `tsconfig.json` está com `strict: true` e os aliases configurados.
- A pasta `assets/fonts/` existe mesmo que vazia (vai receber Fraunces e Inter na Fase 1).
- O arquivo `db/supabase-client.ts` existe e tem o cliente configurado.

Se algum desses não bater, não avance — volte ao Antigravity e diga "o passo X falhou, vamos corrigir". Não acumule problemas técnicos.

### Notas e Armadilhas Comuns

A armadilha mais comum nessa fase é versionamento de dependências. Expo tem matriz de compatibilidade — se você instalar uma versão de `react-native-reanimated` incompatível com a SDK do Expo escolhida, o app trava no startup com erro críptico. Se o agente do Antigravity sugerir instalar bibliotecas com versões específicas, e elas falharem, peça para ele usar `npx expo install` em vez de `npm install` para essas bibliotecas — o `expo install` consulta a matriz de compatibilidade automaticamente.

A segunda armadilha é o NativeWind. Tem duas versões majoritárias (v2 e v4) e elas são incompatíveis em configuração. A v4 é a recomendada hoje. Se o agente configurar a v2 por hábito do dataset, o estilo não vai aplicar. Peça explicitamente para usar NativeWind v4.

A terceira armadilha é o Expo Router. Ele só funciona se o `package.json` tiver `"main": "expo-router/entry"` (não `"main": "node_modules/expo/AppEntry.js"`). Se você ver erro de "rotas não encontradas", essa é provavelmente a causa.

---

## Fase 1 — Sistema de Design Tokens e Componentes Base

### Objetivo

Implementar os tokens de design da Seção 14 do PRD (paleta de cores, tipografia, espaçamento, border-radius, easing, durations, shadows) e criar uma biblioteca pequena de componentes base de UI (Botao, Card, Texto, Container) que usam esses tokens. Configurar fontes Fraunces e Inter via expo-font. Implementar modo escuro/claro automático com fallback manual.

Esta fase é **estratégica**: investir em design tokens **antes** de construir telas garante que cada tela já nasça com a identidade visual correta, em vez de você descobrir lá na Fase 8 que tudo tem aparência genérica e precisa refatorar.

### Pré-requisitos

Fase 0 concluída e validada. App "Hello World" rodando no Galaxy S23.

### Divisão de Trabalho

Antigravity faz tudo nesta fase — é puramente UI e infraestrutura visual. Codex fica de fora.

### Modelo Recomendado

**Categoria Forte** para o prompt inicial (decisões de arquitetura de design system). Use Gemini Pro High ou Claude Opus Thinking.

### Agentes, Skills e Workflows (se kit instalado)

- Agente: `frontend-specialist` ou `ui-ux-pro-max`
- Skills: `frontend-design`, `tailwind-patterns`, `react-best-practices`, `ui-ux-pro-max`
- Workflow opcional: `/ui-ux-pro-max` para validar coerência visual ao final

### Prompt Pronto Para Antigravity

Para esta fase, você vai precisar copiar e colar partes da **Seção 14 do PRD V3** dentro do prompt, porque os tokens específicos estão lá. Abra o PRD em uma aba e copie a Seção 14 inteira quando o prompt pedir.

```
Continuação do projeto Hypertropos. Fase 1: Sistema de Design Tokens e
Componentes Base.

CONTEXTO

O app tem uma identidade visual deliberada e ANTI-DEFAULT. Não pode parecer
"app SaaS 2024 azul-índigo com border-radius 12px e fonte Inter". A
identidade é "museu noturno bem iluminado", com paleta inspirada nos
materiais da estatuária greco-romana (bronze, pedra, mármore, dourado fosco),
tipografia pareando Fraunces serifada com Inter sem-serifa, e princípios
visuais sóbrios e técnicos.

Você precisa ler atentamente e implementar com fidelidade a especificação
abaixo. Não invente valores. Não "melhore" os hex codes. Não substitua
fontes. Não use defaults do Material Design.

ESPECIFICAÇÃO COMPLETA — copie e cole aqui a Seção 14 inteira do PRD V3,
incluindo todas as sub-seções (Filosofia, Paleta em Tokens Semânticos com
as tabelas de modo escuro e claro, Sistema Tipográfico com a tabela de
hierarquia, Border-Radius, Sombras, Espaçamento, Iconografia, Estilo da
Silhueta, Animação e Microinteração, Referências Visuais, e a Cláusula de
Anti-Defaults).

E copie também o Apêndice D do PRD V3 (Tokens de Design Consolidados em
formato TypeScript).

TAREFAS DESTA FASE 1

1. Crie o arquivo constants/tokens.ts com todos os tokens da especificação
   acima. Use exatamente os valores e nomes do Apêndice D. Adicione tipos
   TypeScript para os tokens (export type ColorToken, etc.) para
   autocompletar e type safety.

2. Configure o Tailwind (tailwind.config.js do NativeWind) para usar os
   tokens. Mapeie os tokens semânticos para classes Tailwind:
   bg-canvas → bg-canvas, bg-elevated → bg-elevated, fg-primary →
   text-fg-primary, accent-bronze → bg-accent-bronze, etc. Configure
   também os espaçamentos (space-1 a space-8), border-radius (radius-xs
   a radius-full), e a typography como font families (font-display
   para Fraunces, font-body para Inter).

3. Configure expo-font para carregar Fraunces e Inter. Use Google Fonts:
   - Fraunces: pesos 400, 500, 600, 700 (com variant óptica opsz se a
     biblioteca suportar). Pacote @expo-google-fonts/fraunces.
   - Inter: pesos 400, 500, 600, 700, e variant tabular se disponível.
     Pacote @expo-google-fonts/inter.

   Carregue as fontes no _layout.tsx raiz, e mostre uma SplashScreen ou
   tela em branco enquanto as fontes carregam. Quando carregadas, libera
   o app.

4. Crie um hook useTheme em hooks/useTheme.ts que retorna o tema atual
   (dark/light), os tokens correspondentes, e uma função para alternar
   manualmente. Por padrão, segue o tema do sistema (useColorScheme do
   React Native), mas pode ser sobrescrito manualmente via AsyncStorage.

5. Crie os seguintes componentes base em components/ui/. Cada um usa os
   tokens via NativeWind classes, é tipado em TypeScript, e segue as
   especificações abaixo:

   5.1. Texto.tsx — props: variant (displayXL, displayL, h1, h2, h3,
   bodyL, body, bodyBold, caption, captionBold, numericHero, numericM),
   color (primary, secondary, muted, inverse, bronze, marble, gold,
   success, warning, error), children. Renderiza um <Text> do React
   Native com a fonte, tamanho, peso e cor corretos do token. Use
   Fraunces para variantes display, h1, h2 (e Inter tabular para
   numericHero e numericM).

   5.2. Botao.tsx — props: variant (primary, secondary, ghost,
   destructive), size (sm, md, lg), onPress, children, disabled, loading.
   Variante primary usa accent-bronze como fundo e fg-inverse como texto.
   Secondary é outline com border-strong e texto em fg-primary. Ghost é
   sem fundo e sem borda. Destructive usa feedback-error. Border-radius
   é radius-sm (10px) para tamanho sm e md, radius-md (18px) para lg. Em
   onPress dispara haptic feedback light (expo-haptics) e anima
   transform scale 0.97 com easing sculpted, duração 100ms. Tamanho de
   toque mínimo 56dp em altura para tamanho lg.

   5.3. Card.tsx — props: padding (sm, md, lg), elevated (boolean),
   onPress (opcional). Quando elevated true, usa bg-elevated; senão,
   bg-canvas com border-subtle. Border-radius é radius-md (18px) por
   padrão. Padding padrão é space-4 (16px) para padding md. Se onPress
   for passado, vira tocável com animação scale 0.99 e haptic light.

   5.4. Container.tsx — wrapper que aplica bg-canvas como fundo e
   SafeAreaView. Usado como wrapper de cada tela.

6. Crie um arquivo constants/easing.ts com as curvas de easing exportadas
   para uso com Reanimated 3. Em Reanimated 3, curvas customizadas se
   definem como Easing.bezier(0.32, 0.72, 0.0, 1.0). Exporte duas
   constantes: SCULPTED_EASING e QUICK_EASING.

7. Atualize a tela index.tsx em app/(tabs)/ para demonstrar os componentes
   base. Quero ver:
   - Um Container envolvendo tudo.
   - Um Texto variant displayL "Hypertropos" no topo.
   - Um Texto variant bodyL "Sistema de Design Tokens em funcionamento."
   - Três Cards lado a lado mostrando uma cor (bronze, marble, gold) e
     o nome dela em Texto variant caption.
   - Quatro Botões (primary, secondary, ghost, destructive) com onPress
     que apenas faz console.log "Botão X clicado".
   - Texto demonstrando cada variante tipográfica com pequenos exemplos
     (uma linha cada).
   - Um botão "Alternar tema" no rodapé que chama a função do useTheme.

   Essa tela vai servir como showcase/sandbox dos tokens durante a Fase 1
   e vai ser substituída na Fase 4 pela Home real com a silhueta.

8. Commit e push com mensagem "feat(design): sistema de design tokens
   e biblioteca de componentes base".

CRITÉRIOS DE QUALIDADE OBRIGATÓRIOS

Aplique RIGOROSAMENTE a cláusula de Anti-Defaults da especificação:
- ZERO uso de cor azul-índigo ou similares em qualquer lugar.
- ZERO fundo branco puro ou preto puro.
- ZERO border-radius com valor 8 ou 12 — use somente os tokens.
- ZERO sombras dramáticas com elevation 4 ou maior.
- ZERO uso de Inter como única fonte — Fraunces tem que estar nos títulos.
- ZERO emoji como ícone.
- ZERO easing default (ease-in-out, ease). Use sempre SCULPTED_EASING.

Se algum dos critérios acima for violado em qualquer arquivo, refaça antes
de me entregar.

VALIDAÇÃO ESPERADA

Rode "npx expo start" e me peça para verificar no celular:
- Fontes Fraunces e Inter carregando corretamente (visível no displayL
  Hypertropos — deve ter aparência serifada moderna, NÃO sans-serif).
- Modo escuro como padrão, com fundo cor de pedra escura quente (não
  preto puro).
- Botão de alternar tema mudando entre escuro e claro corretamente.
- Os três cards de paleta mostrando bronze, mármore e dourado distintos
  e fiéis aos hex codes.
- Botões com aparência sóbria, sem azul-índigo, com micro animação de
  scale ao tocar.
- Nenhum erro de console.

Comece criando o constants/tokens.ts e me mostre o arquivo antes de
prosseguir com os demais passos.
```

### Critérios de Validação Antes de Avançar para a Fase 2

Confirme visualmente no celular:

- Fonte Fraunces renderizando nos títulos (aparência serifada moderna).
- Fonte Inter renderizando no corpo (sans-serif neutra).
- Modo escuro como padrão, com cor de fundo `#1A1715` (pedra escura quente, não preto puro).
- Os três cards de paleta mostrando bronze, mármore e dourado visivelmente distintos.
- Botão primary com fundo `accent-bronze`, não azul nem nenhuma outra cor.
- Toque em botão produz animação sutil de scale e vibração suave (haptic).
- Alternância de tema funciona e o modo claro mostra fundo `#F5F0E8` (off-white quente, não branco puro).
- Border-radius dos cards é 18px (visualmente arredondado mas não excessivo).
- Nenhum erro vermelho no console.

Abra também o código e cheque manualmente:

- `constants/tokens.ts` existe e tem todos os tokens da Seção 14.
- `tailwind.config.js` mapeia os tokens para classes utilitárias.
- Componentes `Botao`, `Card`, `Texto`, `Container` existem em `components/ui/`.
- Hook `useTheme` existe em `hooks/useTheme.ts`.
- `_layout.tsx` raiz carrega Fraunces e Inter antes de renderizar.

### Notas e Armadilhas Comuns

Armadilha um: o agente pode tentar usar valores hex direto nos componentes em vez dos tokens. Sempre passe por NativeWind class (`bg-canvas`, `text-fg-primary`) ou pela referência ao token (`tokens.colors.dark.bg.canvas`). Cheque os arquivos depois de o agente entregar.

Armadilha dois: NativeWind v4 tem uma sintaxe ligeiramente diferente da v3 para temas. Confirme que está usando v4 e a configuração de dark mode está correta.

Armadilha três: Fraunces e Inter precisam ser carregadas antes de qualquer Texto renderizar, senão você vê fontes default piscando antes de aparecer a correta (FOIT — Flash of Invisible Text). Use `<SplashScreen.preventAutoHideAsync()>` no início do `_layout.tsx` e `<SplashScreen.hideAsync()>` quando as fontes estiverem carregadas, ou um loading state explícito.

Armadilha quatro: Reanimated 3 precisa de configuração específica no `babel.config.js` (plugin `react-native-reanimated/plugin` na lista de plugins, geralmente como último). Se animações não funcionarem, é provavelmente isso.

---

## Fase 2 — Modelo de Dados e Catálogo Inicial

### Objetivo

Implementar todo o modelo de dados do PRD (Seção 6) tanto no Supabase (PostgreSQL com migrations versionadas) quanto no cache local (expo-sqlite com schema espelhado), criar tipos TypeScript correspondentes, e popular o catálogo inicial com os ~40 exercícios essenciais (Apêndice A do PRD), com as referências científicas correspondentes (extraídas dos seus 4 arquivos de pesquisa) e o catálogo de 7 suplementos (Apêndice B do PRD).

Esta é provavelmente a fase mais densa do bloco, e a primeira em que o **Codex entra em paralelo** com o Antigravity.

### Pré-requisitos

Fases 0 e 1 concluídas e validadas.

### Divisão de Trabalho — A Primeira Paralelização

**Antigravity** trabalha na branch `feat/db-infra`: definição dos tipos TypeScript, configuração do cliente Supabase (já feita parcialmente na Fase 0, agora completa), implementação do schema SQLite local, das queries de leitura/escrita, e do sync engine offline-first básico (versão simples — apenas push de mudanças locais para Supabase, sem reconciliação complexa ainda).

**Codex** trabalha **em paralelo** na branch `feat/db-content`: criação dos arquivos SQL de migration para Supabase com todas as tabelas do modelo de dados, populamento do catálogo de exercícios (os ~40 do Apêndice A, com todos os campos preenchidos a partir dos arquivos de pesquisa), populamento das referências científicas (50-80 referências extraídas dos arquivos), e populamento das 7 fichas de suplementos.

Quando os dois terminam, fazem merge na branch principal. O Codex é particularmente bom no trabalho de populamento porque é tarefa intensiva em precisão (extrair dados estruturados de texto científico) e ele tem reasoning robusto para isso.

### Modelo Recomendado

**Antigravity (infra):** Categoria Forte para o prompt de schema e sync (decisões de arquitetura). Categoria Média para queries individuais.

**Codex (conteúdo):** Categoria Forte com reasoning High ou Extra High para o populamento do catálogo. É um trabalho longo e que exige precisão.

### Agentes, Skills e Workflows (se kit instalado)

- Agentes Antigravity: `database-architect`, `mobile-developer`
- Agentes Codex: o próprio Codex já é o agente
- Skills: `database-design`, `clean-code`
- Workflow opcional: `/plan` para quebrar o trabalho em subtarefas

### Prompts Prontos

#### Prompt para Antigravity (infraestrutura de dados)

```
Continuação do projeto Hypertropos. Fase 2 — Infraestrutura de Dados.

CONTEXTO

Vou rodar este prompt no Antigravity em paralelo com um trabalho no Codex.
Você é responsável pela infraestrutura de dados do app: tipos TypeScript,
schema SQLite local, queries, e sync engine offline-first. O Codex está
em paralelo trabalhando no schema SQL do Supabase e no populamento do
catálogo de exercícios — não mexa nessas partes. Foque exclusivamente no
que está abaixo.

Estamos na branch feat/db-infra. Não toque na branch feat/db-content que
o Codex está manipulando.

ESPECIFICAÇÃO DO MODELO DE DADOS

Copie aqui as Seções 6.1 a 6.4 do PRD V3 (Exercício, Referência Científica,
Perfil do Usuário, Demais Entidades).

TAREFAS

1. Crie types/ com arquivos separados por entidade:
   - types/exercicio.ts (interface Exercicio, enums GrupoMuscular,
     PadraoMovimento, NivelMinimo, Equipamento, Articulacao,
     NivelEstresse)
   - types/referencia.ts (interface Referencia)
   - types/perfil.ts (interface Perfil, enums Genero, Nivel,
     NivelAtividade, HorarioTreino, FaseNutricional)
   - types/treino.ts (interfaces ProgramaAtivo, SessaoTemplate,
     ExercicioPrescrito, RegistroExecucao, SerieExecutada)
   - types/gamificacao.ts (interface Gamificacao, Conquista,
     EstadoSilhueta)
   - types/suplemento.ts (interface Suplemento, Lembrete)
   - types/index.ts (re-exporta tudo)

   Tipos estritos, com optional fields marcados explicitamente. Use enums
   string-based (não numeric).

2. Crie db/schema-local.ts com o schema SQLite local. Use expo-sqlite (a
   API mais recente — confira se é openDatabaseSync ou openDatabaseAsync
   dependendo da versão). Crie tabelas SQLite espelhando as principais
   entidades. Foque em entidades que precisam de cache local imediato:
   - exercicios (catálogo completo, é estático, cabe local)
   - referencias_cientificas (catálogo)
   - suplementos (catálogo)
   - perfil_usuario (single row)
   - estado_silhueta (single row)
   - gamificacao (single row)
   - conquistas_desbloqueadas (lista)

   Outras entidades (registros de execução, histórico de peso, programa
   ativo, sessões) ficam principalmente no Supabase com cache mínimo
   local apenas para dados ativos (sessão de hoje).

3. Crie db/migrations/local/ com a primeira migration versionada
   (001_initial_schema.ts) que cria as tabelas listadas acima. Inclua um
   sistema de versão de schema armazenado em AsyncStorage (chave
   "local_schema_version") que permite rodar migrations futuras
   incrementalmente.

4. Atualize db/supabase-client.ts (já existe da Fase 0). Refatore para
   exportar uma instância configurada de createClient do
   @supabase/supabase-js, com tipagem baseada nos tipos TypeScript do
   passo 1. Use Database como tipo genérico se possível.

5. Crie db/queries/ com arquivos por entidade:
   - db/queries/exercicios.ts: listarExercicios(filtros),
     obterExercicioPorId(id), buscarSubstitutos(exercicioId).
   - db/queries/perfil.ts: obterPerfil(), salvarPerfil(perfil),
     atualizarCampo(campo, valor).
   - db/queries/treinos.ts: registrarSessao(registro),
     listarRegistrosRecentes(limite).
   - db/queries/gamificacao.ts: obterEstado(), adicionarXP(xp),
     incrementarStreak(), desbloquearConquista(id).
   - db/queries/suplementos.ts: listarSuplementos(),
     obterSuplementoPorId(id).

   Cada função: primeiro consulta o cache local SQLite, retorna o
   resultado instantâneo. Em paralelo (sem await), dispara uma sync com
   o Supabase em background. Para escritas, escreve no cache local e
   coloca na fila de sync.

6. Crie db/sync-engine.ts com uma implementação SIMPLES de sync
   offline-first:
   - Função enqueueChange(tabela, operacao, dados): adiciona uma
     mutação à fila persistente (AsyncStorage com chave "sync_queue").
   - Função processSyncQueue(): pega itens da fila, envia para Supabase,
     remove do fila se sucesso. Com backoff exponencial em caso de falha
     (1s, 2s, 4s, 8s, 16s, max 60s).
   - useSyncEngine hook que roda processSyncQueue a cada 30 segundos
     quando o app está em foreground.

   Não implemente reconciliação de conflitos sofisticada agora. Last-
   write-wins por timestamp é suficiente para uso single-user.

7. Crie db/local-cache.ts com helpers para leitura/escrita no SQLite local:
   - executarQuery(sql, params): wrapper sobre expo-sqlite com promise.
   - obterLinha(sql, params): retorna primeira linha ou null.
   - obterLinhas(sql, params): retorna array de linhas.

8. Crie stores/perfilStore.ts (Zustand) com estado reativo do perfil.
   Hidrata do cache local no startup, persiste mudanças.

9. Adicione um teste simples na tela index.tsx (a sandbox da Fase 1):
   um botão "Testar conexão Supabase" que tenta uma query simples
   (count na tabela exercicios) e mostra o resultado em um Toast ou
   alert. Isso vai validar que o cliente está configurado corretamente.

10. Commit e push na branch feat/db-infra. NÃO faça merge na main ainda
    — o Codex está trabalhando em paralelo na feat/db-content e vamos
    fazer merge coordenado depois.

CRITÉRIOS DE QUALIDADE

- Use tipos estritos. Sem any. Sem casting desnecessário.
- Comentários em português explicando POR QUE certas decisões foram
  tomadas (ex: por que cache local de exercicios mas não de registros
  de execução).
- Cada query tem tratamento de erro explícito.
- Sync engine tem logging em console.log durante desenvolvimento (vamos
  remover depois).

VALIDAÇÃO ESPERADA

- npx expo start roda sem erros.
- App abre no Galaxy S23.
- Botão "Testar conexão Supabase" responde com erro ou sucesso
  apropriado (vai dar erro de tabela inexistente se as migrations SQL do
  Codex ainda não rodaram — isso é esperado, é só validação do
  cliente).
- Console mostra logs do sync engine rodando a cada 30s.

Pode começar.
```

#### Prompt para Codex (rodar em paralelo no Codex desktop)

Abra o Codex, conecte ao mesmo repositório `hypertropos`, crie uma task na branch `feat/db-content`. Cole o seguinte prompt:

```
Projeto Hypertropos. Tarefa: Schema SQL do Supabase + Populamento do
Catálogo de Exercícios, Referências Científicas, e Suplementos.

CONTEXTO

Este é um app pessoal de hipertrofia muscular em casa com peso corporal.
O modelo de dados está definido no PRD V3 (Seções 6.1 a 6.4) e a lista
de exercícios essenciais está no Apêndice A do PRD. O conteúdo
científico vem de 4 arquivos de pesquisa que vou anexar abaixo. Outro
agente está trabalhando em paralelo no Antigravity criando os tipos
TypeScript e o schema SQLite local — você foca somente no Supabase e no
populamento dos dados.

Trabalhe na branch feat/db-content. NÃO toque em arquivos fora de
supabase/migrations/ e supabase/seed.sql.

ARQUIVOS DE PESQUISA EM ANEXO

[Cole aqui o conteúdo dos 4 arquivos de pesquisa do usuário. Como o
prompt vai ficar longo, você pode ou colar tudo, ou subir os arquivos
diretamente no contexto do Codex se a interface permitir.]

ESPECIFICAÇÕES DAS TABELAS — copie aqui as Seções 6.1 a 6.4 do PRD V3.

LISTA DE EXERCÍCIOS ESSENCIAIS — copie aqui o Apêndice A do PRD V3.

LISTA DE SUPLEMENTOS — copie aqui o Apêndice B do PRD V3.

TAREFAS

1. Crie supabase/migrations/20260520000001_initial_schema.sql com todas
   as tabelas do modelo de dados. Schema PostgreSQL. Cada tabela:
   - Primary key apropriada (id como TEXT ou UUID conforme entidade).
   - Foreign keys com ON DELETE apropriado.
   - Índices em colunas frequentemente filtradas (grupo_muscular_primario,
     padrao_movimento, nivel_minimo em exercicios, por exemplo).
   - Constraints CHECK quando aplicável (ex: nivel_estresse só pode ser
     baixo/medio/alto).
   - Timestamps created_at e updated_at em tabelas que mudam.
   - Comentários SQL explicando cada tabela.

   Tabelas a criar (snake_case): exercicios, referencias_cientificas,
   exercicio_referencias (junction), suplementos, perfil_usuario,
   historico_peso_corporal, programa_ativo, sessoes_template,
   exercicios_prescritos, registros_execucao, series_executadas,
   gamificacao, conquistas, estado_silhueta, lembretes.

   Não habilite RLS ainda — vamos configurar depois para uso pessoal.

2. Crie supabase/migrations/20260520000002_seed_exercicios.sql contendo
   INSERT statements para todos os ~40 exercícios listados no Apêndice A,
   com TODOS os campos preenchidos:
   - id (use os IDs do Apêndice A)
   - nome em PT-BR e nome_alternativo em inglês
   - grupo_muscular_primario e grupos_secundarios
   - padrao_movimento
   - nivel_minimo e nivel_escada (1 a 5)
   - equipamento_necessario (array)
   - grf_percentual quando aplicável (consulte arquivos de pesquisa
     para valores aproximados — flexão padrão é ~64% do peso corporal,
     flexão declinada chega a ~75%, etc.)
   - articulacoes_estressadas (array das articulações relevantes)
   - nivel_estresse_por_articulacao (objeto JSON com cada articulação
     mapeada para baixo/medio/alto baseado na biomecânica conhecida)
   - descricao_execucao (extrair dos arquivos de pesquisa, 1-3 parágrafos
     em PT-BR, claros e didáticos)
   - dicas_tecnicas (array de 3-5 dicas curtas, extraídas dos arquivos)
   - erros_comuns (array de 2-4 erros típicos, extraídos dos arquivos)
   - midia_url (deixe como string vazia "" por enquanto — vamos popular
     com Lottie depois)
   - frase_cientifica_curta (1-2 frases explicando por que o exercício
     funciona, com mini-citação tipo "Pedrosa et al. 2022")
   - referencias (array de IDs de referencias_cientificas, populado via
     junction table na próxima migration)
   - variacao_anterior e variacao_proxima (IDs dos exercícios na escada
     do mesmo padrão)
   - substitutos_mesmo_padrao (array de IDs de exercícios do mesmo padrão
     que servem como alternativa em caso de restrição)
   - faixa_reps_recomendada (JSON {min, max} — geralmente 8-15 para
     compostos, 12-20 para isolados, 30-40 para casos onde a alavanca
     é leve)
   - cadencia_recomendada (JSON {excentrica, isometrica, concentrica}
     em segundos — geralmente 3-1-1 ou 4-2-1 para hipertrofia mediada
     por alongamento)
   - descanso_recomendado_seg (90-180 para compostos, 60-120 para
     isolados, baseado em Schoenfeld)
   - contraindicacoes (array de restrições articulares para as quais o
     exercício não deve ser sugerido — ex: pistol_squat tem contraindicacoes
     ["joelho"])

   IMPORTANTE: extraia o conteúdo dos campos textuais (descricao_execucao,
   dicas_tecnicas, erros_comuns, frase_cientifica_curta) dos arquivos de
   pesquisa em anexo. Não invente conteúdo que não esteja nos arquivos.
   Se algum campo não puder ser preenchido com base nos arquivos, deixe
   um placeholder claro tipo "[REVISAR: conteúdo a ser adicionado]" para
   eu revisar depois.

3. Crie supabase/migrations/20260520000003_seed_referencias.sql com 50-80
   referências científicas extraídas dos arquivos de pesquisa. Cada uma
   com:
   - id (ex: "schoenfeld_2016_volume")
   - autores
   - ano
   - titulo
   - periodico
   - url (link PubMed/DOI se disponível nos arquivos)
   - sintese_acessivel (1-2 parágrafos em PT-BR, linguagem clara,
     explicando o que o estudo mostrou)
   - tags (array de tags relevantes: volume, falha, frequencia, descanso,
     cadencia, rom, nutricao, creatina, proteina, etc.)

   Foque nos autores mais citados nos arquivos: Schoenfeld, Phillips,
   Krieger, Grgic, Refalo, Morton, Kreider, Calatayud, Kotarsky, Kikuchi,
   Pedrosa, Maeo, Baz-Valle, Israetel, Helms, Wackerhage.

4. Crie supabase/migrations/20260520000004_link_exercicios_referencias.sql
   com INSERTs na tabela junction exercicio_referencias, ligando cada
   exercício a 1-3 referências relevantes.

5. Crie supabase/migrations/20260520000005_seed_suplementos.sql com as 7
   fichas de suplementos (mais a ficha "Suplementos Sem Evidência Forte"
   como 8º registro), cada uma com:
   - id (ex: "creatina_monohidratada")
   - nome
   - categoria (proteina, creatina, cafeina, beta_alanina, citrulina,
     vit_d, omega_3, sem_evidencia)
   - nivel_evidencia (A, B, ou C — esta última para sem_evidencia)
   - dose_padrao
   - dose_dependente_peso (boolean)
   - dose_formula (string com fórmula se aplicável)
   - timing_recomendado
   - mecanismo_resumido (1-2 parágrafos)
   - beneficios_documentados (array)
   - efeitos_colaterais (array)
   - referencias (array de IDs)
   - recomendado_para_perfil (boolean — true para creatina, whey,
     cafeina; false para os outros como default conservador)

   Extraia o conteúdo dos arquivos de pesquisa. Use as recomendações do
   PRD Seção 11.2 como guia.

6. Rode as migrations contra o Supabase do projeto (você tem acesso via
   Supabase CLI ou pode me dar as instruções para eu rodar manualmente
   no dashboard).

7. Crie um relatório curto em supabase/SEED_REPORT.md listando:
   - Total de exercícios populados
   - Total de referências populadas
   - Total de suplementos populados
   - Lista de campos com placeholder [REVISAR: ...] que ficaram para
     completar manualmente
   - Inconsistências encontradas nos arquivos de pesquisa (se houver)

8. Commit e push na branch feat/db-content. NÃO faça merge na main —
   vou coordenar o merge com o Antigravity depois.

NÍVEL DE RACIOCÍNIO

Use reasoning High ou Extra High. Este trabalho exige precisão e
extração cuidadosa de dados estruturados de texto científico. Não
acelere.

CRITÉRIOS DE QUALIDADE

- Nunca invente uma referência científica. Se um claim não tem base nos
  arquivos, deixe placeholder.
- IDs consistentes (snake_case, sem espaços, sem caracteres especiais).
- INSERTs idempotentes (ON CONFLICT DO NOTHING ou similar) para permitir
  reaplicação se necessário.
- SQL formatado e legível.

Comece pelo passo 1 (schema) e quando terminar me mostre antes de passar
para o populamento.
```

### Coordenação Antigravity + Codex Durante a Fase

Enquanto os dois agentes trabalham em paralelo, sua tarefa é principalmente acompanhar e revisar. Algumas dicas:

Quando o Antigravity perguntar "como você quer que a tabela X seja consultada?", a resposta tipicamente vem do PRD — abra a Seção 6 ou 7 e copie a parte relevante para o Antigravity.

Quando o Codex marcar um campo com `[REVISAR: ...]`, anote para revisar manualmente depois do merge. Não force ele a inventar.

Se o Codex demorar muito num exercício específico tentando entender uma nuance científica, peça para ele pular e seguir, deixando placeholder. Mais vale ter o catálogo completo com 5 placeholders do que parar para resolver 1.

Quando os dois terminarem, **você** faz o merge das duas branches na `main`, em ordem: primeiro `feat/db-content` (o conteúdo SQL), depois `feat/db-infra` (a infra que consome o conteúdo). O Antigravity pode te ajudar com o merge se houver conflito — normalmente não haverá, porque trabalharam em arquivos diferentes.

### Critérios de Validação Antes de Avançar para a Fase 3

- Migrations rodaram com sucesso no Supabase (verifique no dashboard que as tabelas existem com os campos esperados).
- Tabela `exercicios` tem ~40 linhas.
- Tabela `referencias_cientificas` tem 50-80 linhas.
- Tabela `suplementos` tem 8 linhas.
- Botão "Testar conexão Supabase" na tela de teste agora retorna sucesso com a contagem real de exercícios.
- Cache local SQLite criado com sucesso (verifique no console que a primeira execução criou as tabelas).
- Sync engine rodando sem erros (logs no console).
- Tipos TypeScript em `types/` cobrindo todas as entidades.
- Queries em `db/queries/` funcionam quando chamadas (você pode testar criando um botão temporário que liste 5 exercícios).
- `SEED_REPORT.md` revisado e placeholders anotados para correção futura.

### Notas e Armadilhas Comuns

A maior armadilha é o populamento ficar mal feito. Recomendo fortemente: depois que o Codex terminar, abra você mesmo o `seed_exercicios.sql` e leia 5-10 exercícios completos. Confira se a descrição faz sentido, se as restrições articulares estão corretas (especialmente para os exercícios que tocam joelho/quadril/Aquiles que são as suas predisposições), e se as referências científicas batem. Investir tempo aqui economiza dor depois.

Segunda armadilha: incompatibilidade entre o schema do Supabase e o schema SQLite local. Idealmente, eles têm a mesma estrutura para os mesmos campos. Cheque que nomes de coluna são iguais nas duas pontas.

Terceira armadilha: o sync engine simples pode duplicar dados se não for cuidadoso. Use IDs únicos consistentes (mesmo ID no SQLite local e no Supabase) e operações UPSERT em vez de INSERT puro.

---

## Fase 3 — Onboarding Expandido

### Objetivo

Implementar o fluxo completo de onboarding com 12-14 microtelas, cada uma coletando uma única informação, com a estética escultural definida nos tokens, transições suaves, barra de progresso, feedback haptic, e o card interativo de restrições articulares via silhueta corporal tocável. Ao final, o perfil completo do usuário é salvo no Supabase e no cache local, e o app está pronto para gerar a primeira rotina (que será na Fase 4).

### Pré-requisitos

Fases 0, 1 e 2 concluídas e validadas. Tipos `Perfil` e queries `salvarPerfil` funcionando.

### Divisão de Trabalho

Antigravity faz tudo nesta fase. É puramente UI e fluxo. O componente da silhueta corporal tocável é a parte mais complexa — pode usar um agente paralelo no Agent Manager do Antigravity dedicado só a esse componente.

### Modelo Recomendado

**Categoria Forte** para o prompt inicial (estruturação do fluxo de 14 telas exige decisões de arquitetura). Use Gemini Pro High ou Claude Opus Thinking.

**Para o componente da silhueta tocável** especificamente: Categoria Forte. É um componente custom não-trivial.

### Agentes, Skills e Workflows (se kit instalado)

- Agente: `mobile-developer`, e `frontend-specialist` para os componentes
- Skills: `mobile-design`, `react-best-practices`, `frontend-design`
- Workflow opcional: `/plan` para quebrar as 14 telas antes de implementar

### Prompt Pronto Para Antigravity

```
Continuação do projeto Hypertropos. Fase 3 — Onboarding Expandido.

CONTEXTO

O onboarding é a primeira impressão do app e tem múltiplas funções
estratégicas: coletar todos os dados necessários para personalização real,
estabelecer a estética escultural do produto desde o primeiro segundo,
demonstrar que o app é diferente dos defaults genéricos, e introduzir o
elemento visual da silhueta corporal (que vai ser central na Home depois).

Estamos na main após o merge das fases anteriores. Crie a branch
feat/onboarding.

ESPECIFICAÇÃO COMPLETA — copie aqui as Seções 5.1 (parte sobre Onboarding),
7.1 (Primeira abertura), 9.1 (Card Interativo de Restrições) do PRD V3.

ESTRUTURA DO FLUXO — 14 MICROTELAS

Cada tela coleta uma informação. Ordem:

01. Boas-vindas — texto sucinto explicando o que vai vir, sem coletar
    dado. Botão "Começar".
02. Idade — input numérico, slider de 15 a 80.
03. Gênero — três opções: Masculino, Feminino, Prefiro não declarar.
04. Peso atual — input numérico em kg, slider de 40 a 150.
05. Altura — input numérico em cm, slider de 140 a 220.
06. Nível atual de treino — quatro cards tocáveis: Iniciante,
    Intermediário retornando, Intermediário, Avançado. Com descrição
    curta em cada um.
07. Nível de atividade fora do treino — quatro opções: Sedentário, Leve,
    Moderado, Muito ativo. Com explicação curta.
08. Dias por semana disponíveis — três cards: 3 dias, 4 dias, 6 dias.
    Com explicação do split que cada um habilita (Full Body, Upper/Lower,
    PPL).
09. Duração desejada por sessão — quatro opções: 30, 45, 60, 75 min.
10. Horário preferido de treino — três opções: Manhã, Tarde, Noite.
11. Equipamento disponível — multi-seleção visual com cards tocáveis:
    Mesa robusta, Cadeira firme, Espaço de chão liso, Piso encerado para
    sliders, Parede livre, Livros para déficit.
12. Restrições articulares (CARD INTERATIVO DA SILHUETA) — descrito em
    detalhes abaixo.
13. Histórico clínico (opcional) — três opções no topo: "Pular esta
    etapa", "Marcar predisposições conhecidas", "Adicionar nota
    detalhada". Se segunda opção: lista curta de predisposições
    (predisposicao_joelho, predisposicao_quadril, predisposicao_aquiles,
    tendinopatia_aquiles_previa, condromalacia_patelar,
    hernia_de_disco_previa, lesao_ombro_previa). Multi-seleção. Se
    terceira opção: campo de texto livre.
14. Gerando rotina — tela animada de 2-3 segundos com sensação de
    processamento (não apenas spinner) e feedback de "Preparando seu
    plano". Ao final, navega para a Home (vai mostrar um placeholder
    de "Rotina gerada" por enquanto, porque a Fase 4 vai implementar a
    geração real).

REQUISITOS GERAIS DE TODAS AS TELAS

- Cada tela usa o Container já criado, com bg-canvas.
- Barra de progresso fina no topo (1px de altura, em accent-bronze
  preenchendo conforme avança) mostrando passo atual / total.
- Botão "Voltar" pequeno no canto superior esquerdo (exceto na 01).
- Botão "Avançar" grande no rodapé, em accent-bronze, com 56dp+ de altura.
  Desabilitado quando a tela exige seleção e nada foi selecionado.
- Toque em qualquer opção: haptic light (expo-haptics) e transição visual
  imediata.
- Transição entre telas: fade + slide horizontal sutil com SCULPTED_EASING,
  duração 300ms.
- Título da tela em Texto variant h1 (Fraunces, 28px).
- Pergunta em Texto variant bodyL (Inter, 17px).
- Opções com Texto variant body (Inter, 15px).
- Densidade BAIXA: cada tela tem MUITA respiração, máximo 3-4 elementos
  visuais por tela. Não amontoar.

TAREFAS

1. Crie app/onboarding/_layout.tsx como Stack navigator simples sem
   header (cada tela tem seu próprio header customizado com barra de
   progresso).

2. Crie um componente components/onboarding/ProgressBar.tsx que recebe
   currentStep e totalSteps e renderiza a barra fina.

3. Crie um componente components/onboarding/OnboardingScreen.tsx como
   layout base usado por todas as 14 telas. Props: title, subtitle,
   children, onNext, onBack (opcional), nextDisabled, currentStep,
   totalSteps. Estrutura interna: Container > ProgressBar > Header
   (back button + título + subtítulo) > children (área de seleção) >
   Footer (botão Avançar).

4. Crie stores/onboardingStore.ts (Zustand) que mantém o estado parcial
   do perfil sendo construído, com setters para cada campo. Hidrata do
   AsyncStorage para permitir continuar de onde parou se o app fechar.

5. Implemente as 14 telas em app/onboarding/. Use roteamento sequencial
   simples: cada tela navega para a próxima ao "Avançar" com
   router.push("/onboarding/proxima-tela"). Implementação ordenada por
   complexidade — comece pelas mais simples (boas-vindas, idade, etc.)
   e termine pelas complexas (restrições, histórico, gerando).

6. PARA A TELA 12 (RESTRIÇÕES ARTICULARES) — Componente especial:

   Crie components/onboarding/SilhuetaTocavel.tsx. É uma silhueta corporal
   vetorial em SVG (use react-native-svg, não Skia ainda — Skia entra na
   Fase 6 para a Home). Silhueta simplificada com regiões clicáveis bem
   demarcadas:

   - Joelho esquerdo e direito (separados)
   - Quadril (centro)
   - Ombro esquerdo e direito
   - Cotovelo esquerdo e direito
   - Lombar
   - Cervical
   - Tendão de Aquiles esquerdo e direito

   Toggle frontal/traseiro: dois botões no topo do componente
   alternando entre "Frente" e "Costas". Frente mostra peito, abdômen,
   joelhos, etc. Costas mostra ombros traseiros, lombar, cervical,
   panturrilhas/Aquiles.

   Cada região é um <Path> ou <Circle> SVG com onPress. Quando tocada,
   abre um BottomSheet (use @gorhom/bottom-sheet ou um modal simples)
   com:
   - Título "Restrição em [região]"
   - Três opções selecionáveis:
     a) "Apenas predisposição/cuidado" → severidade "leve"
     b) "Tive dor recente" → severidade "moderada"
     c) "Em recuperação de lesão" → severidade "alta"
   - Botão "Confirmar" e "Cancelar"

   Quando confirmado, a região na silhueta fica marcada visualmente com
   ícone 🛡️ pequeno e tonalidade ligeiramente diferente (em
   accent-bronze leve). Regiões podem ser editadas tocando novamente.

   Estética da silhueta: linha fina em fg-primary com preenchimento
   muito sutil em bg-elevated. Pose contrapposto simplificada, sem
   feições faciais. Tamanho ~70% da altura útil da tela.

   Texto auxiliar no topo: "Toque nas áreas onde você tem alguma
   limitação. Você pode ter nenhuma, uma, ou várias."

   Botão "Continuar sem restrições" para quem não tem nenhuma.

7. PARA A TELA 14 (GERANDO ROTINA) — Animação de "processamento":

   Tela cheia com fundo bg-canvas, no centro um pequeno conjunto de
   elementos animados:
   - Texto Fraunces variant h2 "Preparando seu plano"
   - Abaixo: três textos curtos rotativos que aparecem e desaparecem
     em sequência (cada um 800ms), passando a sensação de etapas:
     "Analisando seu perfil..." → "Selecionando exercícios
     ideais..." → "Montando sua rotina semanal..."
   - Pequeno pulso bronze no centro (animado com Reanimated 3)
   Total de duração: 2.5 segundos. Ao final, chama a função de salvar
   o perfil no Supabase + cache local, e navega para
   app/(tabs)/index.tsx.

   POR ENQUANTO, app/(tabs)/index.tsx mostra apenas um placeholder:
   "Perfil salvo. Rotina será gerada na Fase 4." Vamos substituir
   pela Home real depois.

8. Implemente a função de salvar perfil completa: ao final do
   onboarding, pega o estado do onboardingStore, faz salvarPerfil(perfil)
   usando a query de db/queries/perfil.ts. Também calcula automaticamente
   meta_proteina_g_kg baseado na fase_nutricional (hipertrofia por
   padrão = 1.8 g/kg) e popula o campo.

9. Trate o caso de re-abertura do app durante o onboarding: ao abrir,
   verifica se perfil_usuario já existe no cache local. Se sim, vai
   direto para Home. Se não, vai para app/onboarding/index.tsx (tela
   01).

10. Commit e push na branch feat/onboarding. Merge para main após
    validação.

CRITÉRIOS DE QUALIDADE

- ZERO defaults visuais: nenhuma cor azul-índigo, nenhum border-radius
  8/12, nenhuma fonte que não seja Fraunces ou Inter.
- Microcopy seguindo a Seção 15 do PRD V3: tom direto, técnico-amigável,
  segunda pessoa, sem hipermasculinidade.
- Cada tela tem foco em uma única decisão.
- Tempo total de preenchimento alvo: 90-120 segundos para um usuário
  que conhece as respostas.
- Transições suaves, sem saltos.
- Haptic em cada interação.

VALIDAÇÃO ESPERADA

Eu vou fazer o onboarding inteiro no celular e verificar:
- 14 telas em ordem, cada uma com pergunta única.
- Barra de progresso visível e fiel.
- Botão voltar funciona em todas exceto 01.
- Botão avançar desabilitado quando seleção é obrigatória e nada foi
  selecionado.
- Silhueta tocável renderiza corretamente com toggle frente/costas.
- Tocar em uma região abre o BottomSheet de severidade.
- Ao confirmar restrição, região marca visualmente.
- Tela de "gerando rotina" anima por 2.5s e navega.
- Reabrindo o app depois, vai direto para Home (placeholder), não
  repete onboarding.
- Dados do perfil aparecem no dashboard do Supabase (tabela
  perfil_usuario com 1 linha).

Comece pelo passo 1 e me mostre cada tela conforme implementa antes
de avançar para a próxima.
```

### Critérios de Validação Antes de Avançar para a Fase 4 (próximo Bloco)

- Você fez o onboarding inteiro no Galaxy S23 sem travamentos.
- Cada uma das 14 telas tem hierarquia visual clara, fontes Fraunces/Inter, paleta correta.
- A silhueta tocável renderizou e respondeu a toques em diferentes regiões.
- BottomSheet de severidade abriu e marcou as restrições corretamente.
- Suas restrições reais (joelho, quadril, Aquiles) ficaram marcadas com severidade "leve".
- Tela de "gerando rotina" animou suavemente por 2-3s.
- Após onboarding, abrindo o Supabase, a tabela `perfil_usuario` tem uma linha com seus dados.
- Reabrir o app não repete o onboarding — vai direto para a Home placeholder.
- Botão de "voltar" funciona em todas as telas exceto a primeira.

### Notas e Armadilhas Comuns

A armadilha principal é a silhueta tocável. SVG complexo em React Native pode ter problemas de performance ou de hit-detection (a área tocável não bater com a área visual). Solução: comece simples — use shapes geométricos básicos (círculos para joelhos, retângulos para lombar) sobrepostos numa silhueta de fundo decorativa. Não tente fazer SVG anatômico fotorrealista nesta fase.

Segunda armadilha: BottomSheet em Expo pode requerer configuração específica de plugin. Se `@gorhom/bottom-sheet` der problema, use um Modal padrão do React Native ou da própria Expo. Funciona igualmente bem.

Terceira armadilha: persistência parcial do onboarding. Se o usuário fecha o app no meio, ao reabrir deveria continuar de onde parou. Isso requer que o onboardingStore (Zustand) tenha persist middleware com AsyncStorage. Veja a documentação do Zustand para `persist`.

---

## Fim do Bloco 1

Você concluiu o Bloco 1. O que você tem nas mãos ao final:

App Expo TypeScript rodando no Galaxy S23 via Expo Go. Sistema de design tokens completo aplicado, com fontes Fraunces e Inter, paleta escultural, e biblioteca de componentes base. Modelo de dados completo no Supabase e cache local SQLite. Catálogo de ~40 exercícios populados com referências científicas reais e 8 fichas de suplementos. Onboarding de 14 microtelas funcionando, com card interativo de silhueta para restrições, salvando o perfil completo no Supabase.

Tempo estimado real para alguém com sua experiência: 2 a 4 semanas de trabalho consistente, considerando que você está aprendendo o fluxo Antigravity + Codex em paralelo pela primeira vez nesse projeto e que vai ter pelo menos algumas idas e voltas com o agente.

### Antes de Passar Para o Bloco 2

Me dá um retorno honesto sobre as três coisas mais importantes:

Primeiro, **o que funcionou bem**. Quais prompts deram saída de qualidade direto? Quais fases foram mais suaves? Isso me ajuda a manter o mesmo padrão nos próximos blocos.

Segundo, **o que travou**. Quais momentos exigiram refazer prompts, debugar erros, ou voltar duas fases atrás. Em quais momentos o agente do Antigravity ou do Codex teve dificuldade de entender o que você queria. Isso me ajuda a calibrar os prompts do Bloco 2 para evitar as mesmas armadilhas.

Terceiro, **o que mudou de opinião**. Depois de usar o app nesse estado inicial, alguma coisa do PRD você quer ajustar? Talvez a paleta de cores ficou diferente do que imaginava, talvez a estrutura do onboarding ficou pesada demais, talvez você quer adicionar uma feature que não estava prevista. Tudo pode ser ajustado antes do Bloco 2.

Com esse retorno, eu produzo o **Bloco 2 (Fases 4-7)** calibrado: Algoritmo de Geração de Rotina, Tela de Execução do Treino (a mais importante e complexa do app), Silhueta Corporal Evolutiva via Skia + Sistema Dopaminérgico completo, e Tela de Progresso. Esse é o coração do produto — quando ele terminar, o app está utilizável de verdade. O Bloco 3 (Fases 8-12) é refinamento, polimento, e build final do APK.

Boa sorte na construção. Estou aqui quando precisar.

**Fim do Bloco 1.**
