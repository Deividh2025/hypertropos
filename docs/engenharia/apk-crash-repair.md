# Plano de Reparo: Falha de Inicialização do APK (Crash de Startup)

🤖 **Applying knowledge of `@[project-planner]`...**

Este plano de ação foi criado para estruturar o diagnóstico e correção do aplicativo **Hypertropos** (Expo/React Native) que está sofrendo crash na inicialização após a compilação do APK de produção.

---

## 1. Overview
O aplicativo calistênico e científico **Hypertropos** falha ao abrir após a instalação de seu arquivo APK em dispositivos físicos. O objetivo deste plano é identificar e reparar a falha nativa ou Javascript na inicialização, reestabelecendo a estabilidade total do ecossistema mobile.

---

## 2. Project Type
**MOBILE** (React Native / Expo v56.0.0 & SQLite / Supabase)

---

## 3. Success Criteria
- O APK gerado abre com sucesso no celular do usuário sem sofrer crashes de inicialização.
- O SplashScreen do Expo carrega, é ocultado e a tela de Onboarding ou Home é renderizada corretamente.
- A sincronização local SQLite e as chamadas offline-first não travam o fluxo síncrono principal.
- Todos os 39 testes unitários existentes continuam passando com sucesso total (`npm test`).
- O código compila sem nenhum erro estático de tipagem TypeScript (`npx tsc --noEmit`).

---

## 4. Tech Stack
- **Framework:** React Native + Expo v56.0.0 (Expo Router + NativeWind v4 para UI reativa)
- **Database:** SQLite (local-first via `expo-sqlite`) & Supabase (remoto-first via `@supabase/supabase-js`)
- **Animations:** `react-native-reanimated` v4 (worklets nativos) & Skia para gráficos nutricionais
- **Feedback:** `expo-haptics` e áudio nativo via `expo-av`

---

## 5. File Structure (Área de Foco)
```
hypertropos/
├── app/
│   ├── _layout.tsx           <-- Fluxo de inicialização do app, SQLite e áudio
│   └── (tabs)/
│       └── index.tsx          <-- Tela principal com microanimações e Skia
├── babel.config.js           <-- Configuração de transpilador do Reanimated e NativeWind
├── db/
│   ├── schema-local.ts        <-- Inicialização de esquemas de migração SQLite
│   └── supabase-client.ts     <-- Configuração de cliente e tratamento de variáveis de ambiente
├── package.json               <-- Sincronia de dependências nativas
└── scratch/
    └── stream_crash_logs.ps1 <-- Script de suporte para captura de logcat via USB
```

---

## 6. Task Breakdown

### 📋 Fase 1: Análise e Diagnóstico (project-planner & debugger)
* **Tarefa 1.1: Identificação de dependências críticas no Babel**
  * **Agente Recomendado:** `mobile-developer` (Skill: `clean-code`)
  * **INPUT:** `babel.config.js` e `package.json`
  * **OUTPUT:** Confirmação da presença do plugin do Reanimated no Babel
  * **VERIFY:** O arquivo `babel.config.js` deve conter `'react-native-reanimated/plugin'` como o último item no array de plugins.
  
* **Tarefa 1.2: Revisão do ciclo de vida de inicialização em `RootLayout`**
  * **Agente Recomendado:** `debugger` (Skill: `systematic-debugging`)
  * **INPUT:** `app/_layout.tsx` e `db/sync-engine.ts`
  * **OUTPUT:** Identificação de chamadas concorrentes ou síncronas bloqueantes (ex: `useSyncEngine` tentando ler dados antes do banco ser inicializado).
  * **VERIFY:** Fluxograma de concorrência e injeção de proteções `try-catch` em todas as rotinas.

### 🛠️ Fase 2: Implementação e Reparo (mobile-developer & debugger)
* **Tarefa 2.1: Registro do plugin do Reanimated**
  * **Agente Recomendado:** `mobile-developer` (Skill: `clean-code`)
  * **INPUT:** `babel.config.js` atual
  * **OUTPUT:** `babel.config.js` atualizado com o plugin correto
  * **VERIFY:** `grep_search` pelo termo `'react-native-reanimated/plugin'` no arquivo.
  
* **Tarefa 2.2: Blindagem do `RootLayout` e do `useSyncEngine`**
  * **Agente Recomendado:** `debugger` (Skill: `systematic-debugging`)
  * **INPUT:** `app/_layout.tsx` e `db/sync-engine.ts`
  * **OUTPUT:** Fluxo de inicialização sequencial e seguro com fallback de erro
  * **VERIFY:** Rodar a verificação de código local e certificar que `isReady` bloqueia interações até a total conclusão das rotinas nativas.

### 🧪 Fase 3: Validação Estática e Execução de Testes (test-engineer)
* **Tarefa 3.1: Validação de Regressões**
  * **Agente Recomendado:** `test-engineer` (Skill: `testing-patterns`)
  * **INPUT:** Código fonte alterado
  * **OUTPUT:** Execução da suíte completa de testes
  * **VERIFY:** `npm test` retornando sucesso para todos os 39 testes unitários.

* **Tarefa 3.2: Verificação Estática de Tipos**
  * **Agente Recomendado:** `test-engineer` (Skill: `testing-patterns`)
  * **INPUT:** Código fonte alterado
  * **OUTPUT:** Compilação do TypeScript
  * **VERIFY:** `npx tsc --noEmit` executado sem erros.

---

## 7. Phase X: Final Verification Checklist
- [ ] O plugin do Reanimated foi devidamente configurado e o cache do Babel limpo?
- [ ] A inicialização em `_layout.tsx` foi desacoplada de chamadas de rede externas?
- [ ] O script de suporte para captura de logs via USB `scratch/stream_crash_logs.ps1` foi gravado?
- [ ] A suíte de 39 testes unitários do Vitest passou com 100% de sucesso?
- [ ] O TypeScript compiler finalizou com sucesso total (`npx tsc --noEmit`)?
- [ ] As regras do design system terroso e metálico (sem qualquer uso de roxo/violeta) foram mantidas intactas?

---

> [!IMPORTANT]
> **Status do Plano:** AGUARDANDO APROVAÇÃO DO USUÁRIO.  
> Por favor, avalie a quebra de tarefas e responda às perguntas do portão socrático apresentadas no arquivo principal `implementation_plan.md` para que possamos iniciar a Phase 2 com a orquestração ativa dos agentes de execução!
