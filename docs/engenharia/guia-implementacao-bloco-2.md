# Guia de Implementação Fase a Fase — Bloco 2

**Projeto:** App de Hipertrofia em Casa com Peso Corporal
**Bloco:** 2 de 3 (Fases 4-7)
**Versão:** 1.0
**Data:** Maio de 2026

**Cobertura deste bloco:**
- Fase 4 — Algoritmo de Geração de Rotina Semanal
- Fase 5 — Tela de Execução do Treino
- Fase 6 — Silhueta Corporal via Skia + Sistema Dopaminérgico
- Fase 7 — Tela de Progresso

**Bloco anterior:** Setup do Ambiente + Fases 0-3 (Setup, Design Tokens, Modelo de Dados, Onboarding).

**Bloco seguinte:** Bloco 3 — Fases 8-12 (Conteúdo Científico, Nutrição, Design Sonoro, Polish, APK Final).

---

## Introdução: O Que Está em Jogo Neste Bloco

Você concluiu o Bloco 1 — o app abre, tem identidade visual estabelecida, o catálogo de exercícios está populado no Supabase, e o onboarding salva seu perfil. Mas o app ainda não **faz nada** do ponto de vista do usuário: não gera rotina, não executa treino, não mostra progresso.

O Bloco 2 muda isso radicalmente. Ao final dele, você consegue abrir o app no Galaxy S23, ver a Home com a silhueta corporal em bronze polido, tocar em "Treino de Hoje", e executar uma sessão completa de exercícios com timer, registro de séries, micro-celebrações dopaminérgicas, e ao final ver sua silhueta ganhando definição muscular nos grupos trabalhados. Isso é o produto.

Por isso este bloco é o mais delicado dos três. Cada fase aqui tem mais decisões de arquitetura, mais lógica de domínio, e mais polimento visual do que qualquer fase do Bloco 1. Vou ser mais detalhado nos prompts e mais cuidadoso nas armadilhas. Reserve mais tempo por fase do que reservou no Bloco 1.

A divisão de trabalho entre Antigravity e Codex se intensifica. A Fase 4 (algoritmo de geração) é predominantemente do Codex. A Fase 5 (tela de execução) é colaborativa — Antigravity faz a UI, Codex faz a lógica de progresso de sessão. A Fase 6 (silhueta + dopaminérgico) é a mais densa: três frentes paralelas, com Antigravity cuidando da renderização Skia, Codex cuidando do motor de cálculo, e um terceiro agente paralelo no Agent Manager do Antigravity cuidando do sistema de conquistas. A Fase 7 (progresso) é principalmente Antigravity, com Codex apenas em queries específicas.

---

## Fase 4 — Algoritmo de Geração de Rotina Semanal

### Objetivo

Implementar o algoritmo que, a partir do perfil completo do usuário (salvo na Fase 3), gera um **programa semanal** com sessões e exercícios prescritos. O algoritmo escolhe o split apropriado (Full Body, Upper/Lower, Push/Pull/Legs), distribui os padrões de movimento ao longo da semana respeitando frequência mínima de 2x por grupo, e seleciona exercícios concretos filtrando por nível, equipamento disponível, restrições articulares e histórico clínico. Ao final, a Home substitui o placeholder por um card real do "Treino de Hoje".

### Pré-requisitos

Fases 0-3 concluídas e validadas. Perfil do usuário persistindo no Supabase. Tabela `exercicios` populada com ~40 exercícios e seus campos completos (especialmente `padrao_movimento`, `nivel_minimo`, `equipamento_necessario`, `nivel_estresse_por_articulacao`, e `nivel_escada`).

### Divisão de Trabalho

**Codex** lidera nesta fase. O algoritmo de geração de rotina é lógica de domínio pura — sem UI, sem animação, sem chamada a API externa. É o tipo de tarefa onde o Codex brilha: regras claras, output testável, refatoração progressiva.

**Antigravity** entra ao final em paralelo para fazer duas coisas: criar a Home real substituindo o placeholder (com card de "Treino de Hoje"), e criar uma tela simples de "Minha Rotina" listando as sessões da semana planejada. Mas a inteligência de seleção fica toda no Codex.

### Modelo Recomendado

**Codex:** Categoria Forte com reasoning **High ou Extra High** para o prompt principal. Este algoritmo tem várias decisões aninhadas e regras científicas que precisam ser respeitadas com precisão. Não economize aqui.

**Antigravity:** Categoria Média para o prompt de Home e tela de rotina (telas relativamente simples).

### Agentes, Skills e Workflows (se kit instalado)

- Codex: agente padrão, com reasoning alto
- Antigravity: `frontend-specialist`, `mobile-developer`
- Skills: `mobile-design`, `react-best-practices`, `clean-code`

### Prompts Prontos

#### Prompt para Codex (algoritmo de geração — branch `feat/algoritmo-rotina`)

Abra o Codex, crie task na branch `feat/algoritmo-rotina`, configure modelo Forte com reasoning Extra High, e cole:

```
Projeto Hypertropos. Tarefa: Algoritmo de Geração de Rotina Semanal.

CONTEXTO

O usuário concluiu o onboarding e tem um perfil completo salvo na tabela
perfil_usuario do Supabase. Agora precisamos gerar a rotina semanal:
escolher o split apropriado, distribuir padrões de movimento pelos dias,
e selecionar exercícios concretos para cada sessão respeitando todas as
restrições e preferências.

Trabalhe na branch feat/algoritmo-rotina. Você vai criar arquivos novos
em lib/ e tipos novos em types/treino.ts (já existe parcialmente, vai
estender).

REGRAS CIENTÍFICAS QUE GOVERNAM O ALGORITMO

Estas vêm dos arquivos de pesquisa do projeto e são INVIOLÁVEIS:

1. Frequência mínima por grupo muscular: 2x por semana. Frequência ideal:
   2-3x. Treinar um grupo só 1x na semana NÃO é suficiente para
   maximizar hipertrofia (Schoenfeld et al. 2016, Grgic et al. 2019).

2. Volume semanal por grupo muscular:
   - Iniciante / intermediário retornando: MEV (Minimum Effective Volume)
     6-10 séries efetivas/semana por grupo.
   - Intermediário: 10-16 séries efetivas/semana por grupo.
   - Avançado: 12-20 séries efetivas/semana por grupo (MAV - Maximum
     Adaptive Volume).

   Volume efetivo = séries levadas próximas à falha (RIR 0-3). Acima de
   20 séries/semana entra território de overreaching (MRV).

3. Splits recomendados conforme dias disponíveis:
   - 3 dias: Full Body (cada sessão trabalha todos os grupos principais).
   - 4 dias: Upper/Lower (2x Upper, 2x Lower).
   - 6 dias: Push/Pull/Legs 2x (PPL/PPL).

   PPL com 4 dias não funciona bem (apenas 1.33 freq por grupo). Splits
   "bro split" tipo "segunda peito, terça costas" estão fora porque
   violam frequência mínima.

4. Padrões de movimento que precisam ser cobertos por semana:
   - push_horizontal (peito, tríceps, deltoide anterior)
   - push_vertical (ombros, tríceps)
   - pull_horizontal (costas, bíceps) — limitação: sem barra/halteres,
     exercícios disponíveis são limitados. Documente isso.
   - pull_vertical (costas altas, bíceps) — limitação ainda maior sem
     pull-up bar. Pode não estar coberto adequadamente — algoritmo deve
     sinalizar essa limitação ao usuário.
   - joelho_dominante (quadríceps, glúteos)
   - quadril_dominante (glúteos, isquios)
   - panturrilha
   - core

5. Descanso entre séries:
   - Multiarticulares (compostos): 120-180 segundos (Schoenfeld et al.
     2016).
   - Isolados ou exercícios menos exigentes: 60-120 segundos.

6. Cadência:
   - Excêntrica controlada (2-4s) para maximizar tensão na fase
     alongada (Pedrosa et al. 2022, Maeo et al. 2021).
   - Concêntrica controlada (1-2s).
   - Pausa isométrica opcional (0-1s) na posição alongada para alguns
     exercícios.

7. RIR alvo:
   - Primeiras séries do exercício: RIR 2-3.
   - Últimas séries (especialmente isolados): RIR 0-1 ou falha técnica.
   - Falha total em compostos não é recomendada por aumentar fadiga
     sistêmica sem ganho de hipertrofia proporcional (Refalo et al. 2023).

ESPECIFICAÇÃO DO ALGORITMO

Crie lib/algoritmo-rotina.ts exportando uma função pura:

   gerarProgramaSemanal(perfil: Perfil, catalogoExercicios: Exercicio[])
   : ProgramaAtivo

A função NÃO faz chamadas a banco. Recebe o perfil e o catálogo já
carregados, e retorna o programa. Isso facilita testes e mantém a função
puramente determinística.

PASSOS INTERNOS DO ALGORITMO

PASSO 1 — Determinar Split

Baseado em perfil.dias_disponiveis_semana:
- 3 dias → split = "full_body"
- 4 dias → split = "upper_lower"
- 6 dias → split = "push_pull_legs"

PASSO 2 — Determinar Volume Alvo por Grupo

Baseado em perfil.nivel:
- iniciante: 8 séries/semana por grupo
- intermediario_retornando: 8 séries/semana (conservador para retorno
  seguro)
- intermediario: 12 séries/semana
- avancado: 16 séries/semana

PASSO 3 — Filtrar Catálogo por Restrições

Crie uma função interna filtrarExerciciosElegiveis(catalogo, perfil)
que aplica os filtros em ordem:

a. Nível: exercício.nivel_minimo deve ser ≤ perfil.nivel.
   Mapeamento: iniciante=1, intermediario_retornando=1, intermediario=2,
   avancado=3. Exercício com nivel_minimo "avancado" só passa se
   perfil.nivel for "avancado".

b. Equipamento: exercício.equipamento_necessario deve ser subconjunto
   de perfil.equipamento_disponivel. Se exercício precisa de "mesa" e
   usuário não tem mesa marcada, exercício é eliminado.

c. Restrições articulares: para cada articulação em
   perfil.restricoes_articulares com severidade marcada, eliminar
   exercícios cujo nivel_estresse_por_articulacao[articulacao] excede o
   tolerado:
   - severidade "leve": permite baixo e medio, elimina alto.
   - severidade "moderada": permite apenas baixo, elimina medio e alto.
   - severidade "alta": permite apenas baixo, e adicionalmente prefere
     exercícios com a articulação NÃO em articulacoes_estressadas.

d. Contraindicações explícitas: se exercício.contraindicacoes contém
   qualquer articulação em perfil.restricoes_articulares (qualquer
   severidade), eliminar.

Retorne lista filtrada com flag indicando o original_id de cada
exercício para rastreamento posterior.

PASSO 4 — Distribuir Padrões de Movimento pela Semana

Conforme split:

Para FULL BODY (3 dias):
- Cada sessão trabalha: push_horizontal, pull_horizontal,
  joelho_dominante, quadril_dominante, push_vertical OU panturrilha
  (alternando), e 1 exercício de core.
- 3 sessões idênticas em estrutura, mas com exercícios variando entre
  elas para fornecer estímulo diverso.

Para UPPER/LOWER (4 dias):
- Upper A: push_horizontal (2 exercícios), pull_horizontal (2),
  push_vertical (1), core (1).
- Lower A: joelho_dominante (2 exercícios), quadril_dominante (2),
  panturrilha (1).
- Upper B: variações diferentes dos mesmos padrões da Upper A.
- Lower B: variações diferentes dos mesmos padrões da Lower A.
- Distribuição na semana: Seg=Upper A, Ter=Lower A, Qui=Upper B,
  Sex=Lower B.

Para PUSH/PULL/LEGS (6 dias):
- Push: push_horizontal (2), push_vertical (2), tríceps adicional via
  exercícios primários, opcional core.
- Pull: pull_horizontal (2-3), pull_vertical se disponível (1), bíceps
  via primários, opcional core.
- Legs: joelho_dominante (2), quadril_dominante (2), panturrilha (1),
  opcional core.
- 6 dias = 2 ciclos PPL na semana. Domingo descanso.

PASSO 5 — Selecionar Exercícios Concretos

Para cada padrão em cada sessão, selecionar exercício específico:

a. Da lista filtrada do PASSO 3, pegar exercícios desse padrão_movimento.

b. Calcular nivel_escada apropriado: começar com o exercício no nivel_escada
   correspondente ao nivel do usuário (iniciante=1-2, intermediario=2-3,
   avancado=3-4).

c. Para sessões da mesma semana com mesmo padrão (Upper A vs Upper B,
   por exemplo): selecionar VARIAÇÕES diferentes. Ex: Upper A pode ter
   Flexão Padrão, Upper B pode ter Flexão Declinada. Isso fornece
   estímulo diverso e cobre diferentes ângulos.

d. Se um exercício foi selecionado por adaptação (não era o "ideal", mas
   foi escolhido para respeitar restrições), marcar
   exercicioPrescrito.substituido_por_restricao = true e
   exercicioPrescrito.exercicio_ideal_id = ID do exercício que seria
   o primeiro escolhido sem restrição.

PASSO 6 — Configurar Prescrição de Cada Exercício

Para cada exercicio_prescrito:

- series_alvo: 3 para compostos primários, 2-3 para acessórios.
- reps_min e reps_max: usar exercicio.faixa_reps_recomendada.
- rir_alvo: 2 nas primeiras séries, 1 ou 0 na última.
- descanso_seg: usar exercicio.descanso_recomendado_seg (override apenas
  se for um exercício acessório onde 60s é suficiente).
- ordem: compostos primeiro, isolados depois, core no final.
- notas: vazio por padrão. Pode receber notas como "foco em pausa de 2s
  no fundo" se a cadência sugerir.

PASSO 7 — Validar Cobertura Final

Antes de retornar, somar séries por grupo muscular ao longo da semana.
Verificar:

- Cada grupo muscular principal tem ≥ 2 séries por sessão e ≥ 6 séries/
  semana (para iniciantes; ≥ 10 para intermediário; ≥ 12 para avançado).
- Se algum grupo não bate o volume mínimo (pode acontecer com restrições
  severas que limitaram opções), adicionar 1-2 séries acessórias se
  possível ou flaggar no programa.

Retorne ProgramaAtivo com:
- id (UUID gerado)
- data_inicio (timestamp atual)
- split (escolhido no Passo 1)
- semana_atual = 1
- sessoes_template (array das sessões, cada uma com nome, dia_da_semana,
  e exercicios array de ExercicioPrescrito).

OUTROS ARQUIVOS A CRIAR

1. lib/algoritmo-rotina.ts — função principal documentada acima.

2. lib/filtro-restricoes.ts — função filtrarExerciciosElegiveis isolada,
   exportada (pode ser reutilizada em outras telas, ex: "trocar
   exercício").

3. lib/calculadora-volume.ts — funções utilitárias para somar séries por
   grupo, validar cobertura, calcular volume efetivo.

4. db/queries/programa.ts — funções salvarPrograma(programa),
   obterProgramaAtivo(), obterSessaoDoDia(dia_da_semana).

5. tests/algoritmo-rotina.test.ts — pelo menos 8 testes unitários
   cobrindo:
   - Perfil iniciante com 3 dias → gera Full Body com 3 sessões.
   - Perfil intermediário com 4 dias → gera Upper/Lower com 4 sessões.
   - Perfil avançado com 6 dias → gera PPL com 6 sessões.
   - Perfil com restrição "joelho leve" → não inclui pistol_squat ou
     sissy_squat, inclui Bulgarian Split Squat.
   - Perfil sem mesa → não inclui exercícios que requerem mesa.
   - Perfil sem parede livre → não inclui pike push-up assistido.
   - Volume semanal para iniciante somando ≥ 6 séries por grupo
     principal.
   - Sessões Upper A e Upper B na mesma semana têm exercícios
     diferentes para o mesmo padrão.

   Use jest ou vitest, conforme já está configurado no projeto. Se não
   estiver configurado ainda, configure (pode usar vitest, é mais
   moderno e rápido).

NÍVEL DE RACIOCÍNIO

Reasoning Extra High. Não corte caminhos. Este algoritmo vai ser usado
todo dia pelo usuário, qualquer bug aqui é dor crônica.

CRITÉRIOS DE QUALIDADE

- Função principal é pura (sem side effects, sem chamadas a banco).
- Tipos TypeScript estritos. Nenhum any.
- Comentários em PT-BR explicando POR QUE de cada regra científica,
  com nome dos autores. Ex: "// 2-3min de descanso entre séries de
  compostos maximiza hipertrofia (Schoenfeld et al. 2016)."
- Não invente exercícios que não estão no catálogo. Se um padrão de
  movimento não tem exercício elegível para o perfil, sinalize em vez
  de inventar.
- Funções pequenas e nomeadas claramente.

VALIDAÇÃO ESPERADA

- Todos os 8 testes passam (npm test).
- Manualmente, ao invocar gerarProgramaSemanal com um perfil hipotético
  (intermediario retornando, 4 dias, restrição leve joelho/quadril/Aquiles,
  equipamento mesa + cadeira + parede + piso), o programa retornado tem:
  - split = "upper_lower"
  - 4 sessoes_template
  - Cada sessão com 5-7 exercícios prescritos
  - Volume total semanal entre 8-12 séries por grupo principal
  - Nenhum pistol squat, sissy squat ou exercício de impacto

Comece pelo passo 1 (determinar split) e me mostre o esqueleto da função
principal antes de implementar a lógica completa.
```

#### Prompt para Antigravity (Home + Tela de Rotina — branch `feat/ui-rotina`)

Após o Codex terminar e mergear `feat/algoritmo-rotina` na main, abra o Antigravity em paralelo na branch `feat/ui-rotina`. Cole:

```
Continuação do projeto Hypertropos. Fase 4 — UI da Home + Tela de Rotina.

CONTEXTO

O Codex acabou de implementar o algoritmo de geração de rotina semanal
em lib/algoritmo-rotina.ts. Agora você vai criar a Home real do app
(substituindo o placeholder atual) e uma tela simples de "Minha Rotina"
listando as sessões da semana.

Trabalhe na branch feat/ui-rotina.

CONTEXTO DO PRD

Copie aqui as Seções 7.2 (Tela inicial Home) e 7.3 (Tela de Sessão
Pré-Treino) do PRD V3.

TAREFAS

1. Substitua app/(tabs)/index.tsx (a sandbox da Fase 1) pela Home real
   conforme PRD Seção 7.2. Hierarquia visual em ordem de prioridade:

   - No topo (~40% da altura útil), área reservada para a SILHUETA
     CORPORAL. Por enquanto, mostre um PLACEHOLDER nessa área: um
     retângulo sutil com fundo bg-elevated e border-radius radius-lg,
     contendo um Texto variant caption centralizado: "Sua silhueta
     aparece aqui (Fase 6)". A silhueta real será implementada na
     Fase 6. NÃO tente fazer Skia agora — apenas o espaço reservado
     com tamanho e posição corretos.

   - Logo abaixo, o card de TREINO DE HOJE. Use o Card já criado.
     Conteúdo: ícone do dia da semana (use Phosphor Icons), Texto h3
     com nome da sessão (ex: "Upper A" ou "Full Body 1"), Texto body
     com número de exercícios (ex: "6 exercícios"), Texto caption com
     tempo estimado (ex: "~45 min"). O card é tocável e leva à tela
     de Sessão Pré-Treino (criada no passo 3). Se já foi treinado hoje,
     mostra estado de conclusão (check verde sutil em
     feedback-success).

   - Abaixo do card, em destaque secundário, o STREAK ATUAL. Um pequeno
     row com ícone de chama (Phosphor Flame, peso Light se streak=0,
     peso Regular se streak>0, em accent-bronze), e Texto bodyBold
     "X dias seguidos". Se streak = 0, mostra apenas "Comece sua
     sequência hoje" sem número.

   - Abaixo, a barra de XP RUMO AO PRÓXIMO NÍVEL. Barra fina (4px de
     altura) em bg-elevated, com fill em accent-bronze proporcional ao
     XP atual / XP necessário. Acima da barra, label pequeno
     "Nível 3 — 230 / 500 XP" (números fictícios por enquanto, vamos
     conectar ao motor de XP na Fase 6).

   No rodapé, navegação por tabs (Expo Router): Home, Catálogo,
   Progresso, Ciência, Nutrição. Use ícones Phosphor Light. Tab ativa
   destacada em accent-bronze.

2. Lógica de carregamento da Home:

   - Ao montar, verifica se existe ProgramaAtivo no banco
     (obterProgramaAtivo do db/queries/programa.ts criado pelo Codex).
   - Se NÃO existe (primeiro acesso pós-onboarding), gera um chamando
     gerarProgramaSemanal(perfil, catalogoExercicios), salva via
     salvarPrograma(programa), e usa esse.
   - Identifica a sessão do dia atual chamando
     obterSessaoDoDia(diaDaSemana).
   - Se não há sessão hoje (dia de descanso), mostra mensagem "Hoje é
     descanso. Aproveite para recuperar."

3. Crie app/treino/pre-treino.tsx (tela de Sessão Pré-Treino) conforme
   PRD Seção 7.3. Estrutura:

   - Header com botão voltar e Texto h2 com nome da sessão
     (ex: "Upper A").
   - Lista vertical de exercícios da sessão, cada item um Card pequeno
     com:
     - Thumbnail/ícone do exercício (use ícone Phosphor genérico por
       enquanto — Lottie reais entram na Fase 5/8).
     - Nome do exercício (Texto body).
     - Configuração (Texto caption): "3 séries × 8-15 reps · 120s
       descanso".
     - Se o exercício foi substituído por restrição, badge pequeno 🛡️
       no canto direito.
   - Tocar em um item expande inline mostrando dicas técnicas, faixa de
     reps detalhada, e cadência sugerida.
   - Rodapé fixo com dois botões principais lado a lado:
     - "Começar agora" (variant primary, accent-bronze)
     - "Sessão Express 15 min" (variant secondary)
   - Um terceiro botão menor abaixo: "Adiar para amanhã" (variant
     ghost). Se streak > 0 e freezes_disponiveis > 0, oferece "Usar
     freeze para preservar streak".

4. Crie uma tela auxiliar app/(tabs)/index.tsx mostrando "Minha Semana"
   (não precisa ser tab separada, pode ser tela secundária). Lista as 3-6
   sessões do programa atual, cada uma com Card mostrando:
   - Dia da semana
   - Nome da sessão
   - Número de exercícios
   - Status (Concluído / Hoje / Pendente)

   Pode ser acessada via gesto ou botão pequeno na Home tipo "Ver semana
   completa".

5. Crie stores/programaStore.ts (Zustand) para o programa ativo:
   - Estado: programaAtual, sessaoDoDia, carregando, erro.
   - Ações: carregarProgramaInicial(), regenerarPrograma() — útil para
     quando o usuário muda perfil em Settings e quer regerar.

6. Botões da tela pre-treino:
   - "Começar agora": navega para app/treino/execucao.tsx (vamos
     implementar na Fase 5). POR ENQUANTO, navega para uma tela
     placeholder com Texto "Tela de Execução — Fase 5".
   - "Sessão Express 15 min": chama uma função
     gerarSessaoExpress(sessaoOriginal) que retorna sessão condensada
     com 3-4 exercícios principais. Implemente em lib/sessao-express.ts.

7. Commit e push em feat/ui-rotina. Após validação, merge na main.

CRITÉRIOS DE QUALIDADE

- ZERO defaults visuais. Todas as cores via tokens, todas as fontes
  Fraunces/Inter, border-radius dos tokens.
- Hierarquia visual MUITO clara: silhueta área >> card de hoje >>
  streak >> XP. Não amontoar.
- Densidade BAIXA. Bastante respiração. TDAH-friendly.
- Animações usando SCULPTED_EASING já configurado.
- Microcopy seguindo Seção 15 do PRD V3.

VALIDAÇÃO ESPERADA

- Home abre mostrando placeholder de silhueta no topo + card de hoje
  preenchido + streak (provavelmente 0 inicialmente) + barra de XP em 0.
- Tocando no card de hoje, abre pre-treino com lista correta de
  exercícios.
- Exercícios substituídos por restrição mostram badge 🛡️.
- Botão "Começar agora" navega para placeholder da execução.
- No Supabase, tabela programa_ativo tem 1 linha com o programa gerado.
- Tabela sessoes_template tem N linhas (3, 4 ou 6 conforme split).
- Tabela exercicios_prescritos tem 15-30 linhas.

Comece pelo passo 1 (refatoração da Home) e me mostre antes de prosseguir.
```

### Critérios de Validação Antes de Avançar para a Fase 5

- Todos os testes unitários do algoritmo passam.
- A Home real substitui o placeholder, com a área da silhueta reservada visualmente.
- Card de "Treino de Hoje" mostra a sessão correta para o dia da semana atual.
- Pré-treino lista exercícios reais com configurações específicas.
- Pelo menos um exercício na sua rotina deve ter sido substituído por restrição (por causa das suas predisposições) e mostra o badge 🛡️.
- Tocando no botão 🛡️, abre explicação clara do porquê da substituição.
- Tabelas `programa_ativo`, `sessoes_template` e `exercicios_prescritos` do Supabase têm linhas reais.
- Streak inicial em 0, barra de XP em 0, placeholder de silhueta visível.

### Notas e Armadilhas Comuns

A armadilha mais comum é o algoritmo do Codex gerar rotinas tecnicamente válidas mas que não fazem sentido prático. Exemplo: gera uma sessão com 8 exercícios todos de joelho-dominante porque o filtro foi muito agressivo em outros padrões. Validação manual da primeira rotina gerada é essencial. Se algo ficou estranho, leia os testes e adicione mais — provavelmente o algoritmo tem um edge case não coberto.

Segunda armadilha: regenerar a rotina toda hora. O programa ativo é persistente. Não rode `gerarProgramaSemanal` a cada abertura do app — só quando não existe programa ainda ou quando o usuário pede explicitamente. Caso contrário, o app fica imprevisível.

Terceira armadilha: o algoritmo pode falhar silenciosamente em perfis com muitas restrições. Se o usuário marcou restrição alta em joelho, quadril e Aquiles ao mesmo tempo, alguns padrões de movimento podem ficar sem opções elegíveis. O algoritmo deve sinalizar isso explicitamente (talvez com uma propriedade `cobertura_incompleta: ['pull_vertical']` no programa) em vez de gerar uma sessão incompleta sem aviso.

---

## Fase 5 — Tela de Execução do Treino

### Objetivo

Implementar a tela mais importante do app: a tela onde o treino acontece. O usuário toca em "Começar agora", entra nessa tela, e é guiado série a série até o fim da sessão, com demonstração visual de cada exercício, timer de descanso preciso em background, registro de séries em tempo real, frase científica inline, microinterações dopaminérgicas (partículas estilo cinzel, haptic, sons), e ao final uma tela de celebração com resumo da sessão.

### Pré-requisitos

Fases 0-4 concluídas. Programa ativo gerado e sessão do dia disponível. Tela pre-treino funcionando.

### Divisão de Trabalho

Esta fase é altamente colaborativa. Duas frentes paralelas:

**Antigravity (branch `feat/execucao-ui`)** — UI da tela: layout, navegação entre exercícios e séries, demonstração visual do exercício, botões grandes ergonômicos, microinterações com partículas Reanimated, transições, tela de celebração final.

**Codex (branch `feat/execucao-engine`)** — Engine de sessão: máquina de estados controlando fluxo (preparando → executando série → descansando → próxima série → próximo exercício → finalizado), timer preciso com background, registro automático de cada série, integração com sync engine para persistir.

Merge na main quando ambos terminarem.

### Modelo Recomendado

**Antigravity:** Categoria Forte para o prompt principal (tela complexa com muitas interações). Use modelo mais forte disponível.

**Codex:** Categoria Forte com reasoning High para o engine. É lógica de máquina de estados que precisa estar correta.

### Agentes, Skills e Workflows (se kit instalado)

- Antigravity: `mobile-developer`, `frontend-specialist`, `ui-ux-pro-max`
- Skills: `mobile-design`, `react-best-practices`, `frontend-design`,
  `performance-profiling`
- Codex: agente padrão, reasoning High

### Prompts Prontos

#### Prompt para Codex (engine de sessão — branch `feat/execucao-engine`)

```
Projeto Hypertropos. Tarefa: Engine de Sessão de Treino.

CONTEXTO

A tela de execução do treino é onde o usuário passa a maior parte do
tempo dentro do app. Ela guia série a série de cada exercício até o fim
da sessão. Você vai implementar o ENGINE que controla o fluxo: uma
máquina de estados que mantém estado da sessão, controla timer de
descanso, registra séries executadas, e dispara eventos que a UI
consome.

Trabalhe na branch feat/execucao-engine. Você cria arquivos em
lib/ e stores/. Não toca em arquivos de tela (UI fica com Antigravity em
paralelo).

ESTADOS DA SESSÃO

A sessão passa pelos seguintes estados:

1. PREPARANDO — sessão carregada mas usuário ainda não começou. Mostra
   primeiro exercício e botão "Começar série".

2. EXECUTANDO_SERIE — usuário está fazendo a série. Conta tempo
   decorrido. Botão "Concluí série".

3. DESCANSANDO — usuário concluiu uma série. Timer regressivo conta o
   descanso prescrito. Pode pular descanso. Ao fim do descanso, transita
   automaticamente para EXECUTANDO_SERIE da próxima série (ou para
   próximo exercício se essa foi a última série).

4. TRANSICAO_EXERCICIO — entre exercícios, mostra micro-celebração e
   prepara o próximo. Dura ~3 segundos antes de transitar
   automaticamente para EXECUTANDO_SERIE do próximo exercício.

5. PAUSADO — usuário pausou. Conserva estado interno mas pausa timer.

6. FINALIZADO — todos exercícios completos. Salva registro final no
   banco e dispara cálculos pós-sessão (XP, conquistas, atualização de
   silhueta — esses cálculos rodam na Fase 6, aqui só dispara evento).

EVENTOS DO USUÁRIO QUE A ENGINE PROCESSA

- iniciarSessao(sessaoTemplate)
- concluirSerie(repsRealizadas, rirPercebido)
- pularDescanso()
- pausarSessao()
- retomarSessao()
- cancelarSessao() — usuário decide abortar. Salva como
  registro.concluida = false.
- pularExercicio() — pula para próximo exercício se quiser.

TAREFAS

1. Crie types/execucao.ts com tipos:
   - EstadoSessao (enum dos 6 estados)
   - SessaoEmExecucao (interface contendo: sessao_template_id,
     exercicio_atual_index, serie_atual_index, estado,
     tempo_inicio_serie, tempo_inicio_descanso, descanso_alvo_seg,
     series_executadas array, observacao opcional)
   - EventoSessao (union type dos eventos acima)

2. Crie lib/engine-sessao.ts exportando uma classe ou conjunto de funções
   puras que implementam a máquina de estados. Funções principais:

   - inicializarSessao(sessaoTemplate): SessaoEmExecucao
   - processarEvento(estado: SessaoEmExecucao, evento: EventoSessao):
     SessaoEmExecucao
   - obterProximoExercicio(estado): Exercicio | null
   - obterProximaSerie(estado): SerieInfo | null
   - calcularProgressoSessao(estado): { exerciciosCompletos, total,
     seriesCompletas, totalSeries }

   Função pura: dado estado atual + evento, retorna novo estado. Sem
   side effects. Facilita testes.

3. Crie stores/sessaoStore.ts (Zustand) que mantém o estado reativo da
   sessão em execução. O store EXPÕE:

   - sessaoAtual: SessaoEmExecucao | null
   - tempoDescansoRestante: number (atualizado a cada segundo via
     setInterval interno)
   - tempoDecorridoSessao: number
   - estaPausada: boolean

   E AÇÕES:
   - iniciarSessao(sessaoTemplate)
   - concluirSerie(reps, rir)
   - pularDescanso()
   - pausar()
   - retomar()
   - cancelar()
   - pularExercicio()

   Internamente o store gerencia o setInterval para os timers. Importante:
   o setInterval precisa continuar rodando mesmo se o app vai para
   background (use AppState do React Native para detectar e ajustar).

4. Crie lib/timer-precisao.ts com uma implementação ROBUSTA de timer que
   funciona em background. O problema: setInterval no JS thread do React
   Native pode pausar quando o app vai para background. Solução:
   armazenar timestamp de início, e a cada cálculo, calcular elapsed =
   Date.now() - timestamp_inicio. Isso é resistente a pausas do JS thread.

   Exportar:
   - iniciarTimer(duracaoSeg): retorna handle
   - obterRestante(handle): retorna segundos restantes
   - cancelarTimer(handle)

   Não dependa de setInterval para precisão. Use Date.now() como fonte
   de verdade.

5. Integração com persistência. Cada série concluída dispara
   registrarSerie(serieExecutada) que:
   - Adiciona à array em memória (estado atual da sessão).
   - Persiste localmente em SQLite imediatamente.
   - Adiciona à fila de sync para Supabase em background.

   Use as funções já criadas na Fase 2 (registrarSessao,
   adicionarSerie). Se não existir adicionarSerie ainda, crie em
   db/queries/treinos.ts.

6. Ao FINALIZADO, dispara um evento que a UI pode escutar via subscribe
   do Zustand. O evento inclui o resumo completo da sessão:
   - exercicios_completados
   - total_series
   - tempo_total_seg
   - volume_total_estimado (soma de reps × grupos trabalhados)
   - grupos_musculares_trabalhados (array com grupos únicos)

   Esse resumo será consumido pela Fase 6 para calcular XP, atualizar
   silhueta, verificar conquistas.

7. Tratamento de cancelamento e dados parciais. Se usuário cancela:
   - Salva registro com concluida=false.
   - Mantém todas as séries que JÁ tinham sido feitas.
   - Não bloqueia o streak (cancelamento conta como "treinou um pouco"
     se ≥ 50% das séries foram feitas; se menos, conta como pulado).

8. Testes unitários em tests/engine-sessao.test.ts com pelo menos:
   - Inicialização carrega sessão corretamente.
   - Após concluir 3 séries do primeiro exercício (de 3 total), transita
     para próximo exercício automaticamente.
   - Pular descanso transita imediatamente.
   - Pausar e retomar conserva estado.
   - Cancelar com 0 séries feitas vs com 5 séries feitas tem
     comportamentos diferentes.
   - Sessão com 5 exercícios × 3 séries = 15 transições corretas até
     FINALIZADO.

NÍVEL DE RACIOCÍNIO

Reasoning High. Máquina de estados precisa estar correta — bug aqui
estraga a experiência de treino.

CRITÉRIOS DE QUALIDADE

- Funções de máquina de estados são puras e testáveis.
- Timer é robusto a background/foreground transitions.
- Persistência acontece a cada série, não só no final (resiliente a
  crashes).
- Tipos estritos.

VALIDAÇÃO ESPERADA

- Todos os testes passam.
- Manualmente, criando uma sessão fake em memória e chamando os métodos
  da store, o estado transita corretamente pelos 6 estados.

Comece pelo passo 1 e me mostre os tipos antes de prosseguir.
```

#### Prompt para Antigravity (UI da execução — branch `feat/execucao-ui`)

```
Continuação do projeto Hypertropos. Fase 5 — UI da Tela de Execução.

CONTEXTO

A tela de execução é a tela mais importante do app — onde o usuário
passa a maior parte do tempo. Ela precisa ser ergonômica (botões
gigantes, mãos suadas, tela que não dorme), satisfatória dopaminergicamente
(microcelebrações em cada série), e clara em hierarquia.

Em paralelo, o Codex está implementando o engine de sessão em
stores/sessaoStore.ts. Você vai consumir esse store. Estará disponível
após o merge da branch feat/execucao-engine.

Trabalhe na branch feat/execucao-ui.

ESPECIFICAÇÃO COMPLETA

Copie aqui a Seção 7.4 (Tela de Execução) e a parte relevante da Seção
8.6 (Feedback Multi-Sensorial) do PRD V3.

ESTRUTURA DA TELA

Tela cheia, fundo bg-canvas. Configuração crítica:
- expo-keep-awake ativo durante toda a sessão (não deixa tela apagar).
- StatusBar oculta ou no estilo "dark-content" para máxima
  imersão.

Layout vertical de cima para baixo:

A. Topo (10% da altura): indicador minúsculo de progresso na sessão.
   Texto caption "Exercício 3 de 6 · Série 2 de 3" + botão pequeno de
   menu (3 pontos) no canto direito que abre opções (pausar, cancelar,
   pular exercício, ajuda).

B. Área central de exercício (50% da altura):
   - Animação Lottie do exercício atual em loop (use lottie-react-native).
     Se midia_url estiver vazia no banco, mostra placeholder
     genérico em accent-bronze (silhueta executando o padrão).
   - Sobreposto à animação, Texto displayL com o nome do exercício
     (Fraunces 36px). Pode ter um pequeno overlay/shadow para
     legibilidade sobre a animação.

C. Área de instruções de série (15% da altura):
   - Texto h2 com a SÉRIE ATUAL em formato grande: "Série 2 de 3"
   - Texto h3 com alvo de reps: "8-15 reps"
   - Texto body com cadência sugerida: "Excêntrica 3s · Concêntrica 1s"
   - Texto bodyBold com RIR alvo: "RIR alvo: 2 (reserve 2 reps)"

D. Frase científica inline (5% da altura):
   - Texto caption em fg-muted: "Tensão na posição alongada gera mais
     hipertrofia — Pedrosa et al. 2022". Conteúdo vem de
     exercicio.frase_cientifica_curta. Em uma linha, fade in/out a cada
     5s se houver mais de uma frase disponível.

E. Botão de ação principal (20% da altura):
   - Botão GIGANTE em accent-bronze. Tamanho mínimo 72dp de altura.
     Texto "CONCLUÍ SÉRIE" em Inter SemiBold 18px, fg-inverse.
     Border-radius radius-md (18px).
   - Ao tocar: dispara concluirSerie() no store. Mas ANTES, abre um
     micro-modal/sheet pedindo:
     a) Quantas reps fez? (input numérico com slider, default = max
        da faixa)
     b) Qual RIR percebido? (slider 0-5, default = rir_alvo)
     - Botão "Confirmar". Ao confirmar: micro-celebração (descrita
        abaixo) e timer de descanso inicia.

F. Aprovar uma série quando timer de descanso está rodando:
   - Substitui o botão "CONCLUÍ SÉRIE" por uma CONTAGEM REGRESSIVA
     GIGANTE em Inter tabular numericHero (72px) mostrando segundos
     restantes (ex: "1:48").
   - Abaixo: texto "Próximo: Série 3 de 3" ou "Próximo exercício:
     Flexão Diamante".
   - Botão menor "Pular descanso" abaixo.
   - Quando o timer chega a 10s, vibração curta de alerta.
   - Quando chega a 0, ding sonoro (placeholder por enquanto, vai ser
     populado na Fase 10 — agora pode usar um beep simples) +
     vibração média + transição automática para próxima série.

G. Transição entre exercícios (TRANSICAO_EXERCICIO):
   - Tela toma over por 3 segundos.
   - Centralizado: animação curta de partículas estilo "cinzas e
     fagulhas" em accent-bronze (use Reanimated 3 ou Lottie).
   - Texto displayL em Fraunces: microfrase variável (sortear de pool
     de 30-50 frases definido em constants/microcopy.ts conforme PRD
     Seção 15.3): "Mandou bem", "Tensão pura", "Tijolo por tijolo",
     etc.
   - Após 3s, transita para próximo exercício automaticamente.

H. Tela de FINALIZADO (sessão completa):
   - Tela cheia de celebração.
   - Animação Lottie de "explosão de cinzas e fagulhas" lenta (~800ms)
     em accent-bronze + accent-gold.
   - Vibração média acompanhando.
   - Texto displayL em Fraunces: "Sessão concluída".
   - Card com resumo:
     - Exercícios completos: N
     - Total de séries: N
     - Tempo total: MM:SS
     - Grupos trabalhados: peito · ombros · tríceps (ícones bronze)
   - Placeholder por enquanto para XP ganho, conquistas, mudança na
     silhueta. Esses serão implementados na Fase 6.
   - Botão grande "Concluído" volta para Home.

TAREFAS

1. Crie app/treino/execucao.tsx como a tela principal. Consome
   sessaoStore do Codex.

2. Crie componentes auxiliares em components/treino/:
   - HeaderProgresso.tsx — o item A
   - VisualExercicio.tsx — o item B (com Lottie)
   - InfoSerie.tsx — o item C
   - FraseCientificaInline.tsx — o item D
   - BotaoConcluirSerie.tsx — o item E (com modal de input de reps/RIR)
   - TimerDescanso.tsx — o item F
   - TransicaoExercicio.tsx — o item G
   - CelebracaoFinalSessao.tsx — o item H

3. Crie components/feedback/ParticulasCinzel.tsx — partículas animadas
   estilo "fagulhas de cinzel batendo em pedra". Use Reanimated 3 com
   ~6-10 partículas em accent-bronze que aparecem e somem com fade +
   movimento em ~400ms. Reutilizável: usado em conclusão de série
   (versão pequena, 4-6 partículas) e em celebração final (versão
   grande, 12-16 partículas).

4. Crie components/feedback/MicrocopyVariavel.tsx — componente que
   sorteia uma frase de um pool sem repetir até esgotar o pool. Estado
   interno do pool sorteado, reseta quando esgota.

5. Crie constants/microcopy.ts exportando os pools:
   - FRASES_ENTRE_EXERCICIOS: array de 30-50 frases curtas (PRD Seção
     15.3).
   - FRASES_FINAL_SESSAO: array de 15-20 frases mais elaboradas.
   - FRASES_FALHA_PROXIMA: array para quando o usuário registra RIR 0
     (quase à falha).

6. Integração com expo-keep-awake e expo-haptics:
   - useKeepAwake hook no início da tela execucao.tsx.
   - Cada ação relevante dispara Haptics.impactAsync com tipo apropriado:
     - Concluir série: ImpactFeedbackStyle.Light + Heavy 200ms depois
     - Conclusão de série bem-sucedida (RIR alvo atingido): adiciona
       SuccessFeedback após o Light
     - Fim de descanso: Medium
     - Conclusão de sessão: NotificationFeedbackType.Success

7. Integração com expo-av para sons (placeholders):
   - Sons em assets/sounds/ ainda vazios — use beeps gerados ou Tone.js
     web equivalente em React Native, ou simplesmente console.log
     "play sound: X" por enquanto. A Fase 10 vai popular sons reais.

8. Animações via Reanimated 3:
   - Botão CONCLUÍ SÉRIE: ao tocar, scale 0.97 → 1.0 em 100ms com
     SCULPTED_EASING.
   - Card de série atual aparece com fade + slide up 300ms.
   - Timer de descanso pulsa sutilmente nos últimos 3 segundos.
   - Transição entre estados é suave, nada de cortes abruptos.

9. Testes manuais críticos:
   - Tela não apaga durante sessão inteira.
   - Botões grandes ergonomicamente confortáveis.
   - Microcelebrações satisfatórias mas não exageradas.
   - Frase científica não invade o espaço cognitivo durante o esforço.
   - Cancelar sessão pelo menu funciona e volta para Home corretamente.

10. Commit e push em feat/execucao-ui. Após merge com feat/execucao-engine
    (que o Codex está fazendo em paralelo), merge na main.

CRITÉRIOS DE QUALIDADE

- ZERO defaults visuais.
- Botão CONCLUÍ SÉRIE é o MAIOR e mais óbvio elemento da tela —
  ergonomia para mãos suadas.
- Microcopy sempre passa pela MicrocopyVariavel para não repetir.
- Sem haptic acompanhando cada toque trivial (apenas eventos
  significativos).
- Performance: animações fluidas a 60fps no Galaxy S23.

VALIDAÇÃO ESPERADA

Vou fazer uma sessão completa real no Galaxy S23 e verificar:
- 6 exercícios × 3 séries = 18 transições corretas.
- Timer descansa precisamente os segundos prescritos (use cronômetro
  externo para conferir).
- Tela não apaga.
- Microcelebrações satisfatórias.
- Tela final de "Sessão Concluída" mostra resumo correto.
- No Supabase, tabela registros_execucao tem 1 nova linha com
  concluida=true, e tabela series_executadas tem 18 linhas.

Comece pelo passo 2 (componentes auxiliares) — implemente um a um e me
mostre. Depois junte tudo em execucao.tsx.
```

### Critérios de Validação Antes de Avançar para a Fase 6

- Você fez pelo menos uma sessão completa de treino real no Galaxy S23.
- Tela não apagou durante a sessão.
- Timer de descanso foi preciso (verifique com cronômetro externo de celular).
- Botão CONCLUÍ SÉRIE confortável de pressionar com mão suada (teste literalmente isso após algumas séries).
- Microcelebrações são satisfatórias mas não exageradas — você sentiu vontade de fazer mais uma série.
- Tela final mostra resumo correto.
- `registros_execucao` no Supabase tem 1 linha com `concluida=true`.
- `series_executadas` tem N linhas (uma para cada série feita).
- Cancelar sessão no meio funciona e salva como `concluida=false` preservando as séries já feitas.
- Pular descanso funciona.
- Pular exercício funciona.
- Pausar e retomar funciona.

### Notas e Armadilhas Comuns

A maior armadilha aqui é o timer perder precisão quando o app vai para background. Se você está treinando e olha o celular durante o descanso, depois aperta o botão home para abrir música, e volta — o timer pode estar errado. A solução está nos prompts (usar `Date.now()` como fonte de verdade, não setInterval cumulativo), mas verifique manualmente nesse cenário específico.

Segunda armadilha: a tela apagar no meio do treino. Se aconteceu, é porque `useKeepAwake` não está sendo chamado ou foi desativado prematuramente. Cheque que ele está ativo enquanto `estadoSessao !== 'FINALIZADO' && estadoSessao !== null`.

Terceira armadilha: Lottie em React Native pode ter problemas de performance se a animação for pesada. Se a animação do exercício travar a tela, simplifique (menos frames, menos camadas).

Quarta armadilha: ergonomia dos botões. Faça um treino real, com suor de verdade, e veja se o botão Concluí Série é grande o suficiente. Aposte na ergonomia. Em caso de dúvida, aumente.

---

## Fase 6 — Silhueta Corporal via Skia + Sistema Dopaminérgico

### Objetivo

Implementar tecnicamente a parte mais arriscada do projeto: a renderização da silhueta corporal estilo estátua clássica via react-native-skia, com nove regiões musculares parametrizadas independentemente, quatro tiers materiais (bronze, pedra, mármore, dourada) que evoluem com o tempo, e gradientes que simulam material em tempo real. Junto disso, implementar o sistema dopaminérgico completo: motor de cálculo de definição muscular por região com decaimento temporal, motor de XP/níveis, sistema de streak com freezes, catálogo de 40-50 conquistas (obvias + surpresa) com lógica de desbloqueio.

Esta é a fase mais densa do bloco e a mais tecnicamente arriscada. Reserve tempo extra. Vale a pena.

### Pré-requisitos

Fases 0-5 concluídas. Engine de sessão funcionando. Tela final de sessão disparando evento com resumo.

### Divisão de Trabalho

Três frentes paralelas usando o **Agent Manager do Antigravity** mais o Codex:

**Frente 1 — Antigravity Agent A (branch `feat/silhueta-render`):** renderização Skia da silhueta. Nove regiões parametrizadas, quatro materiais (gradientes), transições suaves entre níveis de definição, integração com o estado em tempo real.

**Frente 2 — Codex (branch `feat/dopaminergico-motor`):** motor de cálculo de definição muscular por região (dose-resposta com decaimento temporal), motor de XP/níveis (curva logarítmica), sistema de streak com freezes semanais, motor de detecção de conquistas (verifica condições a cada evento da sessão).

**Frente 3 — Antigravity Agent B (branch `feat/conquistas-ui`):** tela de conquistas em "Progresso", tela de celebração quando conquista é desbloqueada (overlay com card revelado em animação), tela de transição de tier (evento maior, tela inteiramente dedicada).

Após todos terminarem, merge sequencial: motor → render → conquistas → main.

### Modelo Recomendado

**Codex (motor):** Categoria Forte com reasoning Extra High. Lógica matemática complexa (decaimento exponencial, curva logarítmica de XP).

**Antigravity Agent A (Skia):** Categoria Forte (Gemini Pro High ou Claude Opus). react-native-skia é uma biblioteca nova e o agente precisa de raciocínio profundo para construir corretamente.

**Antigravity Agent B (conquistas):** Categoria Média. Telas relativamente padrão, lógica já está no motor.

### Agentes, Skills e Workflows (se kit instalado)

- Antigravity: `frontend-specialist`, `mobile-developer`, `ui-ux-pro-max`,
  `performance-optimizer`
- Skills: `frontend-design`, `react-best-practices`, `mobile-design`,
  `performance-profiling`
- Codex: agente padrão, reasoning Extra High

### Prompts Prontos

#### Prompt para Codex (motor dopaminérgico — branch `feat/dopaminergico-motor`)

```
Projeto Hypertropos. Tarefa: Motor Completo do Sistema Dopaminérgico.

CONTEXTO

O sistema dopaminérgico do app tem 4 componentes principais:
1. Motor de cálculo de definição muscular por grupo (alimenta a silhueta
   corporal visual que será renderizada por outro agente).
2. Motor de XP e níveis.
3. Sistema de streak com freezes semanais.
4. Motor de detecção e desbloqueio de conquistas.

Você implementa TODOS os 4. Trabalhe na branch feat/dopaminergico-motor.
Cria arquivos em lib/ e queries em db/queries/.

ESPECIFICAÇÃO COMPLETA

Copie aqui a Seção 8 inteira (Sistema Dopaminérgico Detalhado) do PRD V3.

TAREFAS DETALHADAS

### Motor 1 — Definição Muscular por Grupo

Crie lib/motor-silhueta.ts exportando:

a. Função calcularDefinicaoGrupo(historicoSeriesGrupo: SerieExecutada[],
   diasAteHoje: number): number — retorna 0-100.

   Fórmula:
   - Para cada série no histórico, calcula sua "contribuição" baseada em:
     - peso da série = 1 (série completada conta como 1).
     - bonus de qualidade = 0.5 extra se RIR alvo foi atingido (ou
       superado).
     - decaimento temporal: contribuição = peso × decay(idade_dias),
       onde decay(d) = e^(-d/30) para d ≤ 14, e e^(-d/14) para d > 14.
       Isso significa: séries dos últimos 14 dias contam quase
       integralmente, séries entre 14-28 dias decaem rapidamente, e
       séries > 28 dias praticamente não contam (~5%).

   - Soma todas as contribuições e mapeia para escala 0-100.
   - Mapping: 0 séries efetivas no período = 0. 20+ séries efetivas
     com qualidade = 100. Linear entre.

   Retorna inteiro 0-100.

b. Função calcularEstadoSilhueta(historicoCompleto, perfil):
   EstadoSilhueta. Retorna o estado completo dos 9 grupos musculares +
   tier global.

   Os 9 grupos: peito, costas, ombros, bracos (= bíceps + tríceps
   combinado, somando séries dos dois), quadriceps, posterior, gluteo,
   panturrilha, core.

c. Função determinarTier(diasUsoConsistente: number, treinosCompletos:
   number): TierEstatua.
   - bronze: 0-28 dias OU < 12 treinos completos.
   - pedra: ≥ 28 dias E ≥ 12 treinos.
   - marmore: ≥ 84 dias (12 semanas) E ≥ 36 treinos.
   - dourada: ≥ 182 dias (26 semanas) E ≥ 78 treinos.

   Tier é cumulativo: uma vez atingido, não regride mesmo em hiato.

d. Função detectarTransicaoTier(estadoAnterior, estadoNovo): TierEstatua
   | null. Retorna o novo tier se houve transição, senão null. Usado
   para disparar tela de celebração de transição.

e. Exporte ainda funções utilitárias:
   - somarSeriesPorGrupo(historico, grupos, janelaTemporal): number
   - listarHistoricoRecente(diasAtras): Promise<SerieExecutada[]>

### Motor 2 — XP e Níveis

Crie lib/motor-xp.ts exportando:

a. Função calcularXPSerie(serie: SerieExecutada, rirAlvo: number):
   number.
   - Base: 10 XP por série completada.
   - Bônus: +5 XP se RIR percebido = RIR alvo (preciso) ou se foi
     melhor (RIR menor = mais perto da falha).

b. Função calcularXPSessao(registroSessao): number.
   - Soma de XP das séries.
   - +50 XP de bônus se sessão foi completada inteiramente.
   - +25 XP se foi Sessão Express completa.
   - Cap diário: 200 XP por dia (impede stacking de múltiplas sessões
     no mesmo dia).

c. Função calcularNivel(xpTotal: number): number.
   - Curva logarítmica: nível 1 = 0 XP, nível 2 = 100 XP, nível 3 = 250
     XP, nível 4 = 500 XP, nível N = 100 × N × log2(N+1) (ou similar).
   - Calibrar para que após 12 semanas de uso consistente, usuário
     esteja entre nível 15-20.

d. Função xpParaProximoNivel(xpAtual): { proximoNivel, xpFaltando,
   xpTotal }.

### Motor 3 — Streak com Freezes

Crie lib/motor-streak.ts exportando:

a. Função atualizarStreak(estadoAtual, dataUltimoTreino, dataTreinoAtual):
   { streak_atual, streak_recorde, freezes_utilizados }.

   Lógica:
   - Se data_ultimo_treino é "ontem": streak += 1.
   - Se data_ultimo_treino é "hoje": streak não muda (já treinou hoje).
   - Se data_ultimo_treino é > 1 dia atrás:
     - Se freezes_disponiveis > 0 e gap = 1 dia: oferece freeze, retorna
       state com prompt_freeze=true. UI decide.
     - Se freezes_disponiveis > 0 e gap ≤ 2 dias: pode usar 2 freezes.
     - Se gap > 2 dias OU sem freezes: quebra streak (streak = 1).
   - Atualizar streak_recorde se streak_atual > streak_recorde.

b. Função recarregarFreezes(dataAtual): number.
   - 1 freeze por semana (segunda-feira de manhã).
   - Máximo 2 freezes acumulados.

c. Função usarFreeze(estadoAtual): novo estado com freeze decrementado
   e streak preservado.

### Motor 4 — Sistema de Conquistas

Crie lib/motor-conquistas.ts.

Crie tambem content/conquistas/catalogo.ts (ou .json) com pelo menos 40
conquistas conforme Apêndice C do PRD V3. Cada conquista:

- id (string)
- nome (string)
- descricao (string)
- icone (string id de Phosphor icon)
- tipo (obvio | surpresa)
- xp_bonus (number)
- condicao (objeto descrevendo como verificar)

Exemplos de condições:
- { tipo: "treinos_totais", valor: 1 } — primeiro treino.
- { tipo: "streak_atingido", valor: 7 } — 7 dias seguidos.
- { tipo: "transicao_tier", tier: "pedra" } — atingiu tier pedra.
- { tipo: "treino_antes_de", horario: "07:00" } — treinou antes das 7h.
- { tipo: "todos_grupos_em_semana" } — treinou todos os 9 grupos em
  uma semana.
- { tipo: "leu_artigos_semana", quantidade: 5 } — leu 5 artigos.
- { tipo: "rir_alvo_perfeito_sessao" } — atingiu RIR alvo em 100% das
  séries de uma sessão.

Funções exportadas:

a. verificarConquistasAposEvento(evento: EventoApp, estadoAtual):
   ConquistaDesbloqueada[].

   evento pode ser:
   - sessao_concluida
   - tier_atingido
   - streak_atualizado
   - artigo_lido (para Fase 8)
   - freeze_usado
   - peso_atualizado

   Para cada evento, percorre o catálogo de conquistas que ainda NÃO
   foram desbloqueadas (consultando estadoAtual.conquistas_desbloqueadas),
   e verifica se a condição de cada uma é satisfeita pelo estado atual.
   Retorna lista das recém-desbloqueadas.

b. desbloquearConquista(id: string): Promise<ConquistaDesbloqueada>.
   - Adiciona ao Supabase.
   - Adiciona XP bonus.
   - Retorna objeto com info da conquista para a UI mostrar
     celebração.

### Integração Pós-Sessão

Crie lib/processar-pos-sessao.ts com uma função MASTER que é chamada
quando o engine de sessão dispara FINALIZADO. Ela:

1. Calcula XP da sessão (motor XP).
2. Atualiza streak (motor streak).
3. Recalcula estado da silhueta (motor silhueta).
4. Detecta possível transição de tier.
5. Verifica conquistas desbloqueadas (motor conquistas).
6. Persiste tudo no Supabase via queries existentes.
7. Retorna objeto com tudo que a UI precisa mostrar:
   { xp_ganho, novo_nivel?, streak_novo, freeze_usado?,
   tier_transicao?, conquistas_desbloqueadas[], silhueta_atualizada }.

### Testes

tests/motor-silhueta.test.ts — pelo menos 5 testes (cálculo correto de
definição, decaimento temporal funcionando, tier transitions).

tests/motor-xp.test.ts — pelo menos 4 testes.

tests/motor-streak.test.ts — pelo menos 6 testes (incluindo cenários
de freeze, gap de 1 dia, gap de 2 dias, gap >2).

tests/motor-conquistas.test.ts — pelo menos 8 testes cobrindo
diferentes tipos de condição.

CRITÉRIOS DE QUALIDADE

- Lógica matemática correta e documentada com comentários.
- Decisões cientificamente sensatas (calibragem do XP, decaimento da
  silhueta, etc).
- Tipos estritos.
- Testes cobrindo edge cases.

NÍVEL DE RACIOCÍNIO

Reasoning Extra High. Esta fase é o coração lúdico do app. Bugs aqui
estragam a experiência inteira.

VALIDAÇÃO ESPERADA

- Todos os testes passam.
- Manualmente, simulando uma sessão completa e chamando
  processarPosSessao, o retorno faz sentido (XP entre 100-200, streak
  incrementa, possíveis conquistas desbloqueadas se for primeira
  sessão).

Comece pelo Motor 1 e me mostre antes de prosseguir para o 2.
```

#### Prompt para Antigravity Agent A (renderização Skia — branch `feat/silhueta-render`)

```
Continuação do projeto Hypertropos. Fase 6 — Renderização Skia da
Silhueta Corporal.

CONTEXTO

A silhueta corporal estilo estátua clássica é o elemento visual central
do app. Ela ocupa ~40% da Home e evolui visualmente conforme o usuário
treina. Esta tarefa é tecnicamente a mais arriscada do projeto inteiro.

Em paralelo, o Codex está implementando o motor de cálculo
(lib/motor-silhueta.ts) que vai te alimentar com os estados. Você foca
PURAMENTE na renderização Skia.

Trabalhe na branch feat/silhueta-render.

ESPECIFICAÇÃO COMPLETA

Copie aqui as Seções 8.1, 8.2 e 14.8 do PRD V3 (A Silhueta Evolutiva,
Os Quatro Tiers, e Estilo da Silhueta Corporal).

ABORDAGEM RECOMENDADA

react-native-skia (@shopify/react-native-skia) permite renderização
vetorial performática em React Native. Para a silhueta:

1. Estrutura geral: um Path SVG da silhueta humana em pose contrapposto
   (similar ao Doríforo de Policleto), dividido em 9 regiões anatômicas:
   - peito (área frontal central superior)
   - costas (área traseira superior, mostrada só de costas)
   - ombros (deltoides esquerdo e direito)
   - braços (bíceps + tríceps esquerdo e direito)
   - quadriceps (frente das coxas)
   - posterior (atrás das coxas)
   - gluteo (nádegas)
   - panturrilha (atrás das pernas baixas)
   - core (abdômen)

2. Cada região é um Path independente que recebe nível de definição
   (0-100) e renderiza com gradient diferente conforme o nível e o
   tier global.

3. Pose contrapposto: peso no pé direito, quadril deslocado, ombros
   levemente em rotação oposta — o clássico da estatuária grega.
   Silhueta neutra sem feições faciais (cabeça simplificada, sem
   detalhes).

TAREFAS

1. Instale react-native-skia se ainda não está instalado:
   npx expo install @shopify/react-native-skia

2. Crie components/silhueta/EstatuaSVG.tsx — componente principal.

   Props:
   - estado: EstadoSilhueta (vindo do motor do Codex)
   - largura: number
   - altura: number
   - frente?: boolean (default true, false mostra costas)
   - interativo?: boolean (default false, true permite toque em regiões)
   - onRegiaoTocada?: (regiao: string) => void

3. Crie components/silhueta/PathsEstatua.ts exportando os Paths SVG de
   cada região anatômica em forma de string. Para gerar esses paths,
   você pode:
   - Opção A: usar uma imagem de referência de uma estátua clássica
     simplificada e traçar manualmente os paths em código (mais
     trabalhoso mas dá controle).
   - Opção B: usar uma silhueta SVG existente de domínio público,
     dividir em regiões. Pesquisar bibliotecas tipo "BodyParts SVG" ou
     "Anatomy SVG free".
   - Opção C: gerar via prompts em geradores de SVG (mas verificar
     anatomia).

   Para esta fase, recomendo Opção C ou B. Não passe muito tempo na
   silhueta perfeita — uma silhueta estilizada e razoável é
   suficiente.

   Cada path deve ter um id correspondente: "peito", "costas",
   "ombro_esq", "ombro_dir", "biceps_esq", etc. Note: para algumas
   regiões como braços, mantenha esquerdo e direito separados para
   permitir visualização de assimetria.

4. Crie components/silhueta/MateriaisTier.ts com 4 funções que retornam
   configurações de gradiente Skia para cada tier:

   - obterGradienteBronze(definicaoMuscular: number): SkGradient
   - obterGradientePedra(definicaoMuscular: number): SkGradient
   - obterGradienteMarmore(definicaoMuscular: number): SkGradient
   - obterGradienteDourado(definicaoMuscular: number): SkGradient

   Cada um cria um gradient com cores e stops apropriados para o
   material:
   - Bronze: cores #5A4632 (sombra) a #C19A6B (highlight). Definição
     alta acentua os highlights.
   - Pedra: cores #6E6457 a #B8AB9B. Microtextura granular pode ser
     simulada com noise overlay.
   - Mármore: cores #E8DED1 a #F2EAE0 com veios finos em #B8AB9B (use
     paths secundários para veios).
   - Dourado: cores #B8935A a #D4AF7A com brilhos pontuais em #F0D08F.

   O nivel de definição afeta:
   - Intensidade dos highlights (mais definição = highlights mais
     pronunciados).
   - Contraste interno do gradient.
   - Detalhamento das sombras musculares.

5. Implemente a lógica de rendering em EstatuaSVG.tsx:

   - Use Canvas de Skia como container raiz.
   - Para cada região, renderize seu Path com o gradient apropriado ao
     tier global + nível de definição daquela região.
   - Transições suaves entre estados: quando estado muda (definição
     ou tier), anima a transição em ~500ms usando withTiming do
     Reanimated 3 combinado com Skia.

6. Modo "interativo" para uso no card de restrições do onboarding:
   - Se props.interativo = true, cada path tem onPress handler.
   - Quando tocado, chama props.onRegiaoTocada com o id da região.
   - Visualmente, regiões tocáveis têm leve "indicador" (talvez uma
     pulsação muito sutil em accent-bronze) para o usuário saber que
     pode tocar.

7. Crie components/silhueta/SilhuetaHome.tsx — wrapper específico para
   a Home, que:
   - Carrega o estado atual via useSilhueta hook (hook que você cria
     em hooks/useSilhueta.ts, consumindo o store de gamificação).
   - Renderiza EstatuaSVG não-interativo com tamanho otimizado para
     ~40% de altura da Home.
   - Tem um toggle pequeno e discreto "Frente / Costas" no canto.
   - Quando o estado muda (após uma sessão), anima a transição.

8. Crie components/silhueta/SilhuetaProgresso.tsx — versão maior para
   a aba Progresso (Fase 7), com interatividade: tocando em cada
   região, abre detalhamento daquele grupo (volume semanal,
   tendência).

9. Substitua o placeholder na Home (app/(tabs)/index.tsx — área da
   silhueta) pelo componente SilhuetaHome real.

10. Crie hooks/useSilhueta.ts que consome o store da gamificação e
    expõe { estadoSilhueta, atualizarEstado, animarTransicao }.

11. Trate o caso "primeira vez": quando o usuário acabou de concluir
    onboarding e não tem séries registradas ainda, a silhueta deve
    aparecer em tier bronze com TODAS as regiões em 0% de definição
    (silhueta lisa, sem relevos). Conforme treina, vai ganhando
    definição.

12. Otimização de performance:
    - Memoize os paths (são estáticos).
    - Use o sistema de cache de Skia para gradients.
    - Limite re-renders: o componente só re-renderiza quando o estado
      muda significativamente (use deepEqual ou similar).

13. Acessibilidade: a silhueta inteira tem accessibilityLabel descritivo
    para leitores de tela: "Estátua em tier pedra com peito definido
    em 60%, costas em 40%, ombros em 80%..."

14. Testes manuais críticos:
    - Renderização fluida no Galaxy S23 sem travamento.
    - Transição entre tiers visualmente clara (bronze → pedra → mármore
      → dourado).
    - Regiões reagem corretamente ao mudar definição (ex: simular
      mudar peito de 0 para 100 e ver a evolução).
    - Performance ≥ 50fps durante transições animadas.

15. Commit e push em feat/silhueta-render. Merge na main após Codex
    mergear feat/dopaminergico-motor primeiro.

CRITÉRIOS DE QUALIDADE

- Estética escultural, NUNCA cartum ou hipersexualizada.
- Paleta fiel aos tokens (bronze, marble, gold).
- Performance: 60fps no Galaxy S23.
- Acessível.

NÍVEL DE RACIOCÍNIO

Reasoning High ou Extra High. react-native-skia é complexo, e a
estética importa.

VALIDAÇÃO ESPERADA

- Silhueta renderiza na Home ocupando ~40% de altura.
- Visualmente em bronze polido inicialmente.
- Após simular completar várias sessões, definição muscular dos grupos
  trabalhados aumenta visivelmente.
- Toggle frente/costas funciona.
- Performance fluida.

Comece pelos paths (passo 3) e me mostre uma silhueta básica antes de
ir para os materiais e gradients.
```

#### Prompt para Antigravity Agent B (UI de conquistas — branch `feat/conquistas-ui`)

```
Continuação do projeto Hypertropos. Fase 6 — UI de Conquistas e
Celebrações.

CONTEXTO

Em paralelo, outro agente está renderizando a silhueta corporal via
Skia, e o Codex está implementando o motor dopaminérgico. Você foca
NAS TELAS DE CELEBRAÇÃO E EXIBIÇÃO DE CONQUISTAS.

Trabalhe na branch feat/conquistas-ui.

ESPECIFICAÇÃO

Copie aqui as Seções 8.3, 8.4, 8.5 e 8.6 do PRD V3 (XP/Níveis, Streak,
Conquistas, Feedback Multi-Sensorial).

TAREFAS

1. Tela de celebração de conquista desbloqueada
   (components/feedback/CelebracaoConquista.tsx):

   - Componente que recebe { conquista: Conquista } e renderiza
     overlay fullscreen.
   - Fundo escurecido em rgba(0,0,0,0.6) com blur sutil sobre o conteúdo
     atrás.
   - Card central com bg-elevated, border-radius radius-lg.
   - Animação de entrada: fade + scale 0.8 → 1.0 com bounce sutil,
     500ms, easing SCULPTED.
   - Conteúdo do card:
     - Ícone da conquista (Phosphor, peso Regular) em accent-gold,
       tamanho ~64px, com glow sutil pulsante.
     - Texto h1 (Fraunces 28px) com nome da conquista.
     - Texto body com descrição.
     - Texto caption "+50 XP" abaixo.
   - Som: placeholder por enquanto (Fase 10).
   - Vibração: NotificationFeedbackType.Success.
   - Botão "Continuar" no rodapé do card.

2. Tela de transição de tier (components/feedback/TransicaoTier.tsx):

   Diferente de uma conquista comum. É um EVENTO maior.

   - Componente fullscreen.
   - Sequência animada de 4-5 segundos:
     a. Fade do conteúdo anterior (1s).
     b. Estátua em tier antigo aparece centralizada.
     c. Transição visual lenta do tier antigo para o novo (1.5s) —
        material literalmente se transforma (bronze → pedra, pedra →
        mármore, etc).
     d. Texto displayL em Fraunces aparece: "Sua estátua agora é de
        pedra" (ou material correspondente).
     e. Texto body explicativo abaixo: "Quatro semanas de consistência
        viraram materialidade visível. A próxima transformação
        acontece com o tempo."
   - Vibração: pattern customizado significativo.
   - Som: placeholder.
   - Após 5s, botão "Continuar" aparece com fade.

3. Atualize a tela final de sessão (app/treino/execucao.tsx,
   componente CelebracaoFinalSessao da Fase 5) para integrar com o
   motor dopaminérgico:

   - Após sessão FINALIZADO, chama processarPosSessao() do motor.
   - Recebe objeto com xp_ganho, novo_nivel, streak_novo,
     conquistas_desbloqueadas, tier_transicao, silhueta_atualizada.
   - Exibe em sequência:
     a. Resumo da sessão (já implementado na Fase 5).
     b. XP ganho com animação de contagem (3 segundos contando até o
        valor final).
     c. Se novo_nivel: mini-celebração de novo nível com Texto h2
        "Nível X alcançado!".
     d. Se conquistas_desbloqueadas.length > 0: mostra cada uma
        sequencialmente usando CelebracaoConquista.
     e. Se tier_transicao: mostra TransicaoTier (overlay maior).
     f. Botão "Concluído" volta para Home.

4. Atualize a Home para mostrar:
   - Silhueta no topo (já feito por outro agente).
   - Card de hoje (já feito).
   - Linha de streak: ícone de chama animada (se streak > 0, pulsa
     suavemente) + Texto bodyBold com número de dias. Se freeze foi
     usado recentemente (últimos 7 dias), pequeno indicador 🛡️ ao
     lado.
   - Barra de XP: barra fina + label "Nível X · Y / Z XP" abaixo
     dela. Animação sutil quando XP atualiza após sessão.

5. Subscriba para eventos do motor:
   - Quando streak é atualizado, anima a chama (intensifica
     temporariamente).
   - Quando XP muda, anima a barra crescendo.
   - Quando tier transita, redireciona automaticamente para
     TransicaoTier.

6. Implemente prompt de freeze:
   - Se usuário abre o app e detectou-se que pode quebrar streak (gap
     de 1 dia + freezes_disponiveis > 0), mostra modal/sheet:
     "Você perdeu o dia ontem. Usar 1 freeze para preservar sua
     sequência de N dias?"
     - Botão "Usar freeze" (primary)
     - Botão "Não, deixe quebrar" (ghost)
   - Se o usuário aceita, chama usarFreeze(). Streak preservado.

7. Tela de Lista de Conquistas (app/(tabs)/progresso.tsx — aba
   conquistas):
   - Grid 2 colunas ou 3 (responsivo).
   - Cards de conquista, alguns "desbloqueados" (cores vivas, com
     ícone destacado) e outros "trancados" (silhueta cinza, ícone com
     fundo).
   - Tocando em desbloqueada: abre detalhamento com data de desbloqueio.
   - Tocando em trancada: mostra dica do tipo "Treine 7 dias seguidos
     para desbloquear" (para conquistas óbvias). Conquistas SURPRESA
     ficam ocultas ("???") até serem desbloqueadas — mantém efeito
     dopaminérgico.

8. Commit e push em feat/conquistas-ui. Merge na main após silhueta
   estar mergeada.

CRITÉRIOS DE QUALIDADE

- Microcelebrações satisfatórias mas NÃO INFANTIS.
- Conquistas surpresa permanecem ocultas até desbloqueio.
- Animações fluidas no Galaxy S23.

VALIDAÇÃO ESPERADA

- Completar uma sessão de treino desbloqueia "Primeira Suada"
  (conquista óbvia).
- Tela de celebração de conquista aparece com animação satisfatória.
- Após algumas sessões, atinge tier "pedra" (se a calibragem do motor
  for adequada) e mostra a TransicaoTier.
- Lista de conquistas mostra mix de desbloqueadas e ocultas.

Comece pelos componentes de celebração e me mostre antes de prosseguir.
```

### Critérios de Validação Antes de Avançar para a Fase 7

- Silhueta corporal renderiza fluidamente na Home, em tier bronze inicialmente.
- Após você fazer 2-3 sessões reais, definição muscular dos grupos trabalhados aumentou visualmente.
- Toggle frente/costas funciona.
- Tela final de sessão mostra XP ganho com animação de contagem.
- Pelo menos uma conquista (provavelmente "Primeira Suada") foi desbloqueada e mostrou tela de celebração.
- Streak mostra valor correto na Home.
- Lista de conquistas em Progresso mostra mix de desbloqueadas e ocultas.
- Conquistas surpresa permanecem como "???" até desbloqueio.
- Todos os testes unitários dos 4 motores passam.
- Performance: silhueta animada a ≥ 50fps no Galaxy S23.

### Notas e Armadilhas Comuns

A maior armadilha da Fase 6 é a complexidade da Skia. Se em 2-3 dias trabalhando com Skia você não conseguiu uma silhueta razoável, considere temporariamente substituir por SVG estático estilizado (similar ao do onboarding) com tonalidade mudando conforme tier. É melhor lançar V1 com silhueta SVG decente do que travar duas semanas tentando perfeição em Skia. Você pode migrar para Skia depois.

Segunda armadilha: calibragem do motor de XP e tier. Se calibrar errado, usuário pode subir muito rápido (e tier vira trivial) ou muito devagar (e perde motivação). Aposte na calibragem do prompt do Codex e ajuste após uso real de 1-2 semanas.

Terceira armadilha: conquistas surpresa. É tentador mostrar todas para "motivar". Mas o efeito dopaminérgico depende exatamente do mistério. Mantenha-as ocultas. Mostre apenas após desbloqueio.

Quarta armadilha: o motor de silhueta usar dados errados de série. Confirme que séries com `concluida = false` (sessão cancelada) NÃO contam para definição muscular.

---

## Fase 7 — Tela de Progresso

### Objetivo

Implementar a tela onde o usuário consulta seu progresso multidimensional: visualização ampliada e interativa da silhueta, gráfico de volume semanal por grupo muscular versus alvo, histórico de sessões com filtros, conquistas (já em parte feito na Fase 6), e linha do tempo de progressão por padrão de movimento.

### Pré-requisitos

Fases 0-6 concluídas. Silhueta renderizando. Motor dopaminérgico funcionando. Pelo menos 1 sessão completa registrada para ter dados para visualizar.

### Divisão de Trabalho

Predominantemente Antigravity. Codex apenas em queries de agregação (somatórias por grupo e período).

### Modelo Recomendado

Antigravity: Categoria Média.
Codex: Categoria Média.

### Prompts Prontos

#### Prompt para Codex (queries de agregação — branch `feat/progresso-queries`)

```
Projeto Hypertropos. Tarefa: Queries de Agregação para Tela de Progresso.

CONTEXTO

A tela de Progresso vai mostrar várias visualizações agregadas dos dados
de treino. Você cria as funções de query e agregação. Antigravity em
paralelo monta a UI.

Trabalhe na branch feat/progresso-queries.

TAREFAS

1. Em db/queries/agregacoes.ts:

   a. volumeSemanaPorGrupo(semanaOffset: number = 0): Promise<{ grupo:
      string, series_efetivas: number, alvo: number }[]>
      - semanaOffset = 0 é a semana atual, -1 a anterior, etc.
      - Conta séries com RIR ≤ 3 (efetivas) agrupadas por
        grupo_muscular_primario do exercício.
      - Alvo: baseado no nível do usuário (perfil.nivel).

   b. historicoSessoes(filtros?: { dataInicio?, dataFim?, concluida? }):
      Promise<SessaoComResumo[]>
      - Lista sessões com resumo (nome, data, duração, séries totais,
        completion %).
      - Ordenado por data desc.

   c. linhaTempoPadraoMovimento(padraoMovimento: string):
      Promise<{ semana, exercicio_mais_avancado_id, nivel_escada }[]>
      - Para cada semana desde o início do programa, qual o exercício
        mais avançado naquele padrão de movimento que o usuário
        executou.
      - Permite ver "comecei na flexão na parede, hoje estou na flexão
        diamante".

   d. tendenciaSemanal(): Promise<{ semana, total_series, total_tempo,
      sessoes_completas }[]>
      - Visão geral dos últimos 12 semanas.

   e. estatisticasGerais(): Promise<{ total_treinos, total_series,
      total_tempo_horas, streak_maximo, conquistas_desbloqueadas }>
      - Para exibir nos KPIs no topo da tela.

2. Otimização:
   - Use índices apropriados nas tabelas (verifique migrations).
   - Para agregações pesadas, considere usar VIEWS no Supabase ou
     materializar cálculos.

3. Testes em tests/agregacoes.test.ts com pelo menos 5 testes (mock de
   dados).

NÍVEL DE RACIOCÍNIO

Reasoning Medium ou High.

VALIDAÇÃO ESPERADA

- Funções retornam dados corretos quando há histórico real no banco.

Comece pela primeira (volumeSemanaPorGrupo).
```

#### Prompt para Antigravity (UI de Progresso — branch `feat/progresso-ui`)

```
Continuação do projeto Hypertropos. Fase 7 — Tela de Progresso.

CONTEXTO

A tela de Progresso é onde o usuário consulta seu próprio progresso em
múltiplas dimensões: silhueta detalhada, volume por grupo, histórico de
sessões, conquistas, linha do tempo de variações.

Codex está em paralelo criando queries em db/queries/agregacoes.ts.

Trabalhe na branch feat/progresso-ui.

ESPECIFICAÇÃO

Copie aqui a Seção 7.6 (Tela de Progresso) do PRD V3.

TAREFAS

1. Refatore app/(tabs)/progresso.tsx para ter 5 abas internas usando
   uma TabBar customizada no topo:
   - Silhueta
   - Volume
   - Conquistas (já parcialmente feito na Fase 6 — integre aqui)
   - Linha do tempo
   - Histórico

2. Aba SILHUETA:
   - SilhuetaProgresso (do Agente A da Fase 6) ocupando 60% da altura,
     interativa.
   - Toque em uma região do corpo abre BottomSheet com:
     - Nome do grupo muscular
     - Definição atual (0-100%)
     - Tendência das últimas 4 semanas (gráfico mini de linha)
     - Volume semanal médio
     - Próximo passo sugerido ("Adicione mais 2 séries semanais para
       acelerar o crescimento")

3. Aba VOLUME:
   - Header com seletor de período: Esta semana / Semana passada /
     Mês atual.
   - Para cada grupo muscular, uma barra horizontal:
     - Label do grupo (Texto bodyBold)
     - Barra com 2 cores: bg-elevated como fundo (representa "alvo"),
       accent-bronze preenchendo proporcionalmente ao volume atual.
     - À direita: "X / Y séries" (X = atual, Y = alvo).
   - Cores:
     - Volume < 50% do alvo: feedback-warning.
     - Volume 50-100% do alvo: accent-bronze.
     - Volume > 100% do alvo: feedback-success.
     - Volume > 130% do alvo: feedback-warning (excesso).
   - Tap em uma barra: detalhamento daquele grupo.

4. Aba CONQUISTAS (já parcialmente feita na Fase 6):
   - Integre aqui.

5. Aba LINHA DO TEMPO:
   - Lista vertical, cada item um padrão de movimento.
   - Para cada padrão, mostra evolução visual: "Push horizontal:
     Flexão na parede (sem 1) → Flexão padrão (sem 4) → Flexão
     declinada (sem 8) → atual: Flexão diamante (sem 12)".
   - Marcações em escada visual.

6. Aba HISTÓRICO:
   - Lista vertical de sessões, mais recente primeiro.
   - Cada card:
     - Data (relativa: "Hoje", "Ontem", "Há 3 dias" para recentes; data
       absoluta para antigas).
     - Nome da sessão.
     - Tempo total, séries totais, taxa de conclusão.
     - Ícone de estado: ✓ verde para completas, ⚠ amarelo para
       parciais (cancelada), ⊘ cinza para puladas.
   - Tap abre detalhamento da sessão com lista completa de exercícios
     e séries.

7. KPIs no topo de toda a tela (acima das abas):
   - 4 mini-cards horizontais com:
     - Total de treinos
     - Streak máximo
     - Total de horas
     - Conquistas

8. Pull-to-refresh em cada aba para recarregar dados.

9. Loading states com skeleton screens (não spinners genéricos).

10. Empty states acolhedores. Ex: aba Histórico sem sessões: "Seu
    primeiro treino aparece aqui. Bora começar?"

11. Commit e push.

CRITÉRIOS DE QUALIDADE

- ZERO defaults visuais.
- Animações suaves entre abas.
- Performance: scrolling suave mesmo com muitos dados.

VALIDAÇÃO ESPERADA

- Após algumas sessões reais, a tela mostra dados úteis e satisfatórios.
- Você consegue ver o progresso por grupo muscular.
- Histórico lista sessões.

Comece pela aba Volume (mais simples) e progride para Silhueta detalhada.
```

### Critérios de Validação Antes de Avançar para o Bloco 3

- Tela de Progresso abre e tem 5 abas funcionais.
- Aba Volume mostra barras com dados reais.
- Aba Silhueta mostra a estátua interativa, e tocar em uma região abre detalhamento.
- Aba Histórico lista as sessões reais que você fez.
- Aba Conquistas integra com o sistema da Fase 6.
- KPIs no topo mostram totais corretos.
- Empty states e loading states funcionam.

### Notas e Armadilhas Comuns

A armadilha aqui é exibir dados desordenadamente — TDAH-friendly significa hierarquia clara e respiração visual. Cheque que cada aba tem 1-2 elementos principais e o resto é apoio. Não amontoar gráficos.

Segunda armadilha: queries pesadas. Se a aba demora >1s para carregar, é melhor materializar cálculos no banco ou cachear localmente.

---

## Fim do Bloco 2

Você concluiu o Bloco 2. O que você tem nas mãos agora:

Um app de hipertrofia em casa **funcionalmente completo**: gera rotina semanal personalizada baseada em ciência, guia treinos passo a passo com timer e microcelebrações, calcula progresso visual via silhueta corporal escultural que evolui em tempo real, sistema de XP e conquistas funcionando, tela de progresso multidimensional com volume semanal por grupo, histórico, e linha do tempo de variações.

Tempo estimado real: 3 a 5 semanas de trabalho consistente após o Bloco 1, considerando que a Fase 6 (silhueta + dopaminérgico) tem a maior complexidade técnica do projeto.

### Antes de Passar Para o Bloco 3

Me dá retorno sobre os mesmos três pontos do bloco anterior:

Primeiro, o que funcionou bem — quais prompts foram diretos, quais fases foram mais suaves.

Segundo, o que travou — onde você teve que voltar atrás, refazer, debugar. Especialmente curioso sobre a Fase 6 (Skia + dopaminérgico) que é a mais arriscada.

Terceiro, o que mudou de opinião — depois de usar o app nesse estado, alguma decisão do PRD que você quer revisar antes de polir? Talvez a calibragem do XP ficou fora, talvez a silhueta precisa de mais detalhamento, talvez você descobriu uma feature óbvia que não estava prevista.

Com esse retorno, produzo o **Bloco 3 (Fases 8-12)**: Conteúdo Científico integrado nas três camadas, Camada de Nutrição Inteligente completa (calculadora de proteína, fichas de suplementos, lembretes), Design Sonoro próprio + atalho para apps de música externos, Polish final + tratamento de estados, e finalmente o Build APK e instalação no Galaxy S23.

Quando o Bloco 3 terminar, você instala o APK no celular, desinstala o Expo Go, e passa a usar o app pessoal definitivo. Esse é o destino do projeto.

**Fim do Bloco 2.**
