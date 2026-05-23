# Guia de Implementação Fase a Fase — Bloco 3

**Projeto:** App de Hipertrofia em Casa com Peso Corporal
**Bloco:** 3 de 3 (Fases 8-12) — BLOCO FINAL
**Versão:** 1.0
**Data:** Maio de 2026

**Cobertura deste bloco:**
- Fase 8 — Conteúdo Científico Integrado
- Fase 9 — Camada de Nutrição Inteligente
- Fase 10 — Design Sonoro e Atalho de Música
- Fase 11 — Polish, Estados e Edge Cases
- Fase 12 — Build APK e Instalação Final

**Blocos anteriores:**
- Bloco 1 — Setup + Fases 0-3 (Design Tokens, Modelo de Dados, Onboarding)
- Bloco 2 — Fases 4-7 (Algoritmo de Rotina, Execução, Silhueta + Dopaminérgico, Progresso)

---

## Introdução: O Que Está em Jogo Neste Bloco

Você chegou ao bloco final. Os blocos anteriores construíram a fundação (estética, dados, perfil) e o coração funcional do produto (rotina, execução, silhueta, progresso). O Bloco 3 não adiciona mais um motor pesado nem uma feature transformadora — ele **completa** o que já existe e o transforma de "app funcional rodando no Expo Go" para "app pessoal definitivo instalado no Galaxy S23".

Cinco fases compõem este bloco. Cada uma é menos densa tecnicamente do que a média do Bloco 2, mas mais densa em **decisões qualitativas finas**. Você vai passar muito tempo polindo detalhes, ajustando microcopy, escolhendo sons, ajustando timings de animação, lendo artigos para checar precisão científica. Esse trabalho não é glamouroso, mas é o que separa um app que parece "feito por IA em dois fins de semana" de um app que parece um produto deliberado.

Reserve mais tempo para validação manual nas fases deste bloco. Cada uma das telas do app vai passar por suas mãos pelo menos uma vez para refinamento. Tempo total estimado para o Bloco 3: 3 a 5 semanas de uso refinado, dependendo de quanto você quer polir antes de chamar "pronto".

---

## Fase 8 — Conteúdo Científico Integrado

### Objetivo

Implementar as três camadas de conteúdo científico definidas no PRD: a frase científica curta inline em cada exercício durante a execução (Nível 1, já parcialmente feito na Fase 5), o painel científico do exercício acessível em um toque com 2-3 parágrafos e referências (Nível 2), e a seção Ciência com biblioteca de artigos próprios de 15-20 textos cobrindo todos os princípios do app (Nível 3).

Ao final desta fase, o app não é apenas um guia de treino — é uma plataforma de aprendizado contínuo. Você abre, treina, e fica 10% mais informado a cada semana porque os princípios vão sendo internalizados por exposição repetida.

### Pré-requisitos

Blocos 1 e 2 concluídos. Tabela `referencias_cientificas` já populada com 50-80 referências (Fase 2). Catálogo de exercícios com `frase_cientifica_curta` preenchida em todos os exercícios.

### Divisão de Trabalho

**Codex (branch `feat/conteudo-artigos`):** produção dos 15-20 artigos científicos em formato markdown, extraídos dos seus quatro arquivos de pesquisa. Esse é o trabalho intelectualmente mais pesado da fase. Codex tem reasoning forte e é bom em extração estruturada de conhecimento.

**Antigravity (branch `feat/conteudo-ui`):** telas que consomem o conteúdo. Painel científico no detalhamento do exercício, leitor de artigos da seção Ciência, lógica de personalização leve por perfil (ordenação dos artigos), integração com o sistema de conquistas (conquista por ler artigos).

### Modelo Recomendado

**Codex:** Categoria Forte com reasoning High. Extração e síntese de literatura científica exige profundidade.

**Antigravity:** Categoria Média. Telas de leitura são padrão.

### Agentes, Skills e Workflows (se kit instalado)

- Antigravity: `frontend-specialist`, `documentation-writer`
- Skills: `frontend-design`, `documentation-templates`, `react-best-practices`

### Prompts Prontos

#### Prompt para Codex (artigos científicos — branch `feat/conteudo-artigos`)

```
Projeto Hypertropos. Tarefa: Produção de 18 Artigos Científicos para
a Seção Ciência.

CONTEXTO

O app tem uma seção "Ciência" que é uma biblioteca de artigos curtos
escritos por mim para educar sobre os princípios por trás de cada
recomendação do app. Os artigos têm entre 300 e 800 palavras, são
escritos para serem lidos em 2-4 minutos, e cada um cobre um princípio
específico com referências científicas.

Você vai produzir 18 artigos a partir dos quatro arquivos de pesquisa
do projeto. Os arquivos já estão no contexto do projeto (foram usados
na Fase 2 para o populamento do catálogo). Trabalhe na branch
feat/conteudo-artigos. Os artigos ficam em content/artigos/ como
arquivos .md.

ARQUIVOS DE PESQUISA EM ANEXO

[Anexe novamente aqui o conteúdo dos quatro arquivos de pesquisa do
usuário, ou referencie-os se já estão acessíveis ao Codex via o
repositório.]

LISTA COMPLETA DOS 18 ARTIGOS A PRODUZIR

Para cada artigo, dou tópico, ângulo central, autores que devem ser
citados, e tags. Use exatamente esses 18 — não invente outros nem pule.

01. "O Que de Fato Constrói Músculo"
- Ângulo: o músculo responde a tensão mecânica próxima da falha,
  não ao instrumento. Peso corporal é tão válido quanto barra se
  o estímulo for adequado.
- Citar: Schoenfeld, Wackerhage, Pedrosa.
- Tags: principios_fundamentais, hipertrofia.
- Tamanho: 500-700 palavras.

02. "Volume Semanal: Quanto Treinar Cada Grupo Muscular"
- Ângulo: MEV, MAV, MRV. Para cada nível, qual a faixa adequada de
  séries efetivas por grupo por semana.
- Citar: Schoenfeld et al. (2017 meta-analysis), Baz-Valle et al.
  (2022), Israetel.
- Tags: volume, hipertrofia, prescricao.
- Tamanho: 500-700 palavras.

03. "Frequência: Por Que 2x Por Semana é o Mínimo"
- Ângulo: frequência mínima por grupo. Por que treinar peito uma vez
  por semana não é ideal.
- Citar: Schoenfeld et al. (2016 frequency meta-analysis), Grgic et
  al. (2019).
- Tags: frequencia, hipertrofia, prescricao.
- Tamanho: 400-600 palavras.

04. "RIR e Falha: Quão Perto da Falha Treinar"
- Ângulo: RIR (Reps in Reserve), proximidade da falha, falha total
  vs falha técnica. Por que NÃO precisa falhar em toda série.
- Citar: Refalo et al. (2023), Helms.
- Tags: falha, rir, hipertrofia.
- Tamanho: 500-700 palavras.

05. "Cadência: Excêntrica Lenta e Hipertrofia Mediada por Alongamento"
- Ângulo: por que controlar a fase excêntrica importa, o conceito de
  tensão na posição alongada, exemplos práticos.
- Citar: Pedrosa et al. (2022), Maeo et al. (2021), Kassiano et al.
- Tags: cadencia, rom, hipertrofia.
- Tamanho: 500-700 palavras.

06. "Descanso Entre Séries: Por Que 2-3 Minutos, Não 60 Segundos"
- Ângulo: mitos do circuit training, evidência para descanso longo em
  hipertrofia.
- Citar: Schoenfeld et al. (2016 rest interval study).
- Tags: descanso, hipertrofia, mitos.
- Tamanho: 400-600 palavras.

07. "ROM: Amplitude Completa e Hipertrofia"
- Ângulo: por que amplitude completa supera amplitude parcial, exceções
  e nuances.
- Citar: Wolf et al. (2023), Schoenfeld.
- Tags: rom, hipertrofia, tecnica.
- Tamanho: 400-600 palavras.

08. "Progressão Sem Peso: A Escada de Variações"
- Ângulo: como progredir em calistenia, escada de 5 níveis por padrão
  de movimento, quando e como aumentar dificuldade.
- Citar: Kotarsky et al. (2018), Calatayud et al.
- Tags: progressao, calistenia, prescricao.
- Tamanho: 500-700 palavras.

09. "Recuperação e Sono: O Treino Que Não Acontece na Academia"
- Ângulo: importância do sono para síntese proteica, dor muscular tardia,
  janelas de recuperação por grupo.
- Citar: Dattilo et al. (2011), Walker (Why We Sleep).
- Tags: recuperacao, sono, fisiologia.
- Tamanho: 500-700 palavras.

10. "Hipertrofia de Costas e Bíceps Sem Implemento: Limites e Soluções"
- Ângulo: a limitação real de treinar costas/bíceps sem barra ou
  halteres, soluções com remada invertida em mesa, doorway row, lençol
  na porta, exercícios posturais.
- Citar: estudos de remada invertida.
- Tags: limitacao, costas, biceps, calistenia.
- Tamanho: 500-700 palavras.

11. "Proteína: Quanto, Quando e De Onde"
- Ângulo: meta diária (1.6-2.2 g/kg), distribuição em refeições,
  fontes animais e vegetais, valor biológico.
- Citar: Morton et al. (2018), Schoenfeld & Aragon (2018),
  Phillips.
- Tags: nutricao, proteina, hipertrofia.
- Tamanho: 600-800 palavras.

12. "Creatina Monohidratada: O Suplemento Mais Estudado"
- Ângulo: o que é creatina, mecanismo, doses, segurança a longo prazo,
  loading vs não-loading, mitos sobre cabelo e rim.
- Citar: Kreider et al. (2017 ISSN position), Antonio et al.
- Tags: nutricao, creatina, suplementos.
- Tamanho: 600-800 palavras.

13. "Cafeína Como Ergogênico: Como Usar Sem Detonar o Sono"
- Ângulo: dose efetiva (3-6 mg/kg), timing pré-treino, half-life e
  impacto no sono, tolerância individual.
- Citar: ISSN position stand sobre cafeína, Goldstein et al.
- Tags: nutricao, cafeina, suplementos, sono.
- Tamanho: 500-700 palavras.

14. "Suplementos Sem Evidência Forte: Por Que Não Vale Gastar"
- Ângulo: BCAAs isolados, glutamina, testosterona boosters (tribulus,
  ZMA, fenugreek), HMB para treinados, pré-treinos blends proprietários.
  Por que cada um tem evidência fraca ou negativa.
- Citar: ISSN reviews, Jäger et al.
- Tags: nutricao, suplementos, mitos.
- Tamanho: 600-800 palavras.

15. "Reentrada Segura ao Treino Após Pausa Longa"
- Ângulo: protocolo de retomada para quem ficou meses ou anos parado.
  Reduzir volume inicial, foco em recuperação articular, paciência
  com progressão linear.
- Citar: literatura sobre detraining e retraining.
- Tags: retorno, prescricao, lesao.
- Tamanho: 500-700 palavras.

16. "Joelho e Quadril: Proteção Articular Para Quem Tem Predisposição"
- Ângulo: biomecânica de exercícios joelho-dominantes, sinais de alerta,
  como adaptar (Bulgarian Split Squat preferível a Pistol Squat para
  patelofemoral).
- Citar: estudos de cisalhamento patelofemoral.
- Tags: articulacao, joelho, quadril, adaptacao.
- Tamanho: 500-700 palavras.

17. "Aquiles: Progressão Segura de Panturrilha"
- Ângulo: tendinopatia de Aquiles, papel do treino excêntrico
  controlado (Alfredson protocol), por que evitar saltos para quem
  tem predisposição.
- Citar: Alfredson et al., literatura sobre tendinopatia.
- Tags: articulacao, aquiles, panturrilha, adaptacao.
- Tamanho: 500-700 palavras.

18. "Mitos Comuns Refutados pela Ciência"
- Ângulo: lista curta de mitos. Janela anabólica de 30 min, alta repetição
  como única progressão para hipertrofia, falha total obrigatória,
  precisa de carga pesada para crescer, suplementos são essenciais,
  proteína em excesso destrói rim em pessoa saudável.
- Citar: várias referências.
- Tags: mitos, principios_fundamentais.
- Tamanho: 600-800 palavras.

ESTRUTURA DE CADA ARTIGO (em markdown)

Cada artigo .md tem este frontmatter no topo:

---
id: "01_o_que_constroi_musculo"
titulo: "O Que de Fato Constrói Músculo"
tags: ["principios_fundamentais", "hipertrofia"]
tempo_leitura_min: 4
tags_perfil_relacionadas: []
data_publicacao: "2026-05-25"
referencias: ["schoenfeld_2016", "wackerhage_2019", "pedrosa_2022"]
---

Depois do frontmatter, o corpo em markdown puro. Estrutura sugerida do
corpo:

- Parágrafo de abertura (1-2 sentenças capturando a tese principal).
- 2-4 seções com subtítulos pequenos (##).
- Citações inline tipo "(Schoenfeld et al. 2017)" referenciando estudos
  populados na tabela referencias_cientificas.
- Parágrafo final de síntese ("o que isso significa na prática").

TONALIDADE

- Português brasileiro, segunda pessoa do singular.
- Tom técnico-amigável (Seção 15 do PRD V3).
- Maduro, sem hipermasculinidade nem hipersimplificação.
- Cita autores e estudos com confiança.
- Não usa jargão sem explicar brevemente.
- Sem call-to-action vazio tipo "agora vai treinar!".
- Termos do glossário do PRD (Seção 15.4): treino não exercício,
  série não set, RIR sempre maiúsculo, etc.

CRITÉRIOS DE QUALIDADE

- Cada claim científica tem referência rastreável aos arquivos de
  pesquisa.
- Onde houver controvérsia legítima na literatura, mencione (ex: "alguns
  estudos sugerem X, outros Y").
- Não invente citações. Se um claim não tem base nos arquivos, omita.
- Markdown válido. Headers com hierarquia correta. Listas usadas
  apenas onde fazem sentido.

CAMPO tags_perfil_relacionadas

Use isto para personalização leve da ordem dos artigos por perfil.
Valores possíveis (use os relevantes para cada artigo):

- ["retorno_ao_treino"] — para artigo 15.
- ["predisposicao_joelho", "predisposicao_quadril"] — para artigo 16.
- ["predisposicao_aquiles"] — para artigo 17.
- ["usa_creatina"] — para artigo 12.
- ["usa_cafeina"] — para artigo 13.

Resto fica array vazio.

POPULAR NO BANCO

Depois de criar os 18 .md, popule a tabela `artigos_cientificos` no
Supabase com migration:

CREATE TABLE IF NOT EXISTS artigos_cientificos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo_markdown TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  tags_perfil_relacionadas TEXT[] DEFAULT '{}',
  tempo_leitura_min INTEGER,
  data_publicacao DATE,
  referencias TEXT[] DEFAULT '{}'
);

Insira cada artigo com SEU CORPO COMPLETO no campo `conteudo_markdown`.
Isso permite carregar o conteúdo direto do banco em vez de bundlar
todos os .md no APK (economiza espaço).

NÍVEL DE RACIOCÍNIO

Reasoning High. Produção de conteúdo científico de qualidade exige
profundidade e cuidado.

VALIDAÇÃO ESPERADA

- 18 arquivos .md em content/artigos/.
- Migration SQL criada com INSERTs dos 18 artigos.
- Tabela artigos_cientificos populada no Supabase.
- Cada artigo entre 300 e 800 palavras conforme especificado.
- Markdown válido em todos.
- Sem citações inventadas (tudo rastreável aos arquivos de pesquisa).

Comece pelo artigo 01 e me mostre antes de prosseguir para os
seguintes. Após eu aprovar o estilo, produza os outros 17.
```

#### Prompt para Antigravity (UI de conteúdo — branch `feat/conteudo-ui`)

Quando o Codex tiver entregado pelo menos 5 artigos para o estilo estar definido, abra o Antigravity em paralelo e cole:

```
Continuação do projeto Hypertropos. Fase 8 — UI de Conteúdo Científico.

CONTEXTO

O Codex está em paralelo produzindo 18 artigos científicos para a seção
Ciência. Você vai criar a UI que consome esse conteúdo:

1. Painel científico no detalhamento de cada exercício (Nível 2).
2. Tela da seção Ciência com biblioteca de artigos (Nível 3).
3. Tela de leitura de artigo individual.
4. Lógica de personalização leve da ordem dos artigos pelo perfil.

Trabalhe na branch feat/conteudo-ui.

ESPECIFICAÇÃO

Copie aqui a Seção 10 (Sistema de Conteúdo Científico) e a Seção 7.7
(Seção Ciência) do PRD V3.

TAREFAS

1. PAINEL CIENTÍFICO DO EXERCÍCIO (Nível 2)

   Refatore a tela app/exercicio/[id].tsx (deve existir desde a Fase
   2 ou criar agora se não existe). Estrutura:

   - Header com nome do exercício (Fraunces h1) e botão voltar.
   - Animação Lottie do exercício (área grande).
   - Tabs internas: Como Fazer / Ciência / Substitutos.

   Aba "Como Fazer":
   - Descrição de execução (descricao_execucao do exercício)
   - Dicas técnicas (lista)
   - Erros comuns (lista)
   - Faixa de reps e cadência sugerida

   Aba "Ciência":
   - Frase científica curta em destaque no topo (Fraunces h2).
   - Texto expandido em 2-3 parágrafos. Como o campo
     frase_cientifica_curta é curto, você vai EXPANDIR ele consultando
     o conteúdo das referências relacionadas. Use queries do tipo
     "para esse exercício, pegue as 2-3 referências e use suas
     sinteses_acessiveis para construir um texto coeso de 2-3
     parágrafos." Isso acontece em runtime, não em build.
   - Lista de referências citadas, cada uma tocável. Tocando, abre
     a URL externa (PubMed/DOI) via Linking.openURL.

   Aba "Substitutos":
   - Lista de exercícios em substitutos_mesmo_padrao.
   - Cada item: thumb + nome + nivel_escada + razão de substituição.
   - Tocar leva ao detalhamento daquele substituto.

2. SEÇÃO CIÊNCIA — BIBLIOTECA (Nível 3)

   Crie app/(tabs)/ciencia.tsx:

   - Header com Texto displayL "Ciência".
   - Subtítulo "Por trás do treino" em Texto body fg-muted.
   - Pesquisa opcional no topo (campo de texto que filtra por título
     ou tag).
   - Lista vertical de artigos. Cada item um Card pequeno mostrando:
     - Título do artigo (h3 Fraunces)
     - Tags principais como pequenas chips em accent-bronze (radius-xs)
     - Tempo estimado de leitura ("4 min de leitura")
     - Ícone de "lido" se já leu (Phosphor check em feedback-success)
   - Ordenação:
     - Artigos cujas tags_perfil_relacionadas batem com o perfil do
       usuário aparecem PRIMEIRO. Ex: usuário com predisposição
       Aquiles vê artigo 17 ("Aquiles: Progressão Segura") logo no
       topo.
     - Resto em ordem alfabética por título ou por tópico.

3. TELA DE LEITURA DO ARTIGO

   Crie app/artigo/[id].tsx:

   - Header com botão voltar e Texto caption com tags.
   - Texto display do título.
   - Subtítulo com tempo de leitura e data de publicação.
   - Corpo do artigo: renderize o conteudo_markdown usando
     react-native-markdown-display ou similar. Customize os estilos
     do markdown para usar nossos tokens:
       - h1, h2, h3 em Fraunces, com cores fg-primary.
       - parágrafos em Inter body com line-height relaxed.
       - listas com bullets em accent-bronze.
       - links em accent-bronze sublinhado.
       - blockquotes com border-left em accent-bronze leve, bg-elevated.
       - código inline em Inter tabular com bg-highlight.
   - Ao fim do artigo: lista de referências usadas (campo referencias
     do artigo). Cada uma tocável.
   - Botão "Marcar como lido" no rodapé. Quando tocado, marca artigo
     como lido no banco (cria tabela `artigos_lidos` se não existir
     com colunas user_id, artigo_id, data_leitura).
   - Animação sutil de progresso de leitura: barra fina no topo da tela
     que vai preenchendo conforme o usuário rola.

4. INTEGRAÇÃO COM SISTEMA DE CONQUISTAS

   Marcar um artigo como lido dispara o evento "artigo_lido" do motor
   de conquistas (já implementado na Fase 6). Conquistas relevantes:
   - "Primeira leitura" — primeiro artigo lido.
   - "Leitor curioso" — 5 artigos lidos.
   - "Leitor assíduo" — 10 artigos lidos.
   - "Bibliotecário" — todos os 18 artigos lidos.
   - "Leu cinco em uma semana" — 5 artigos em 7 dias (surpresa).

5. INTEGRAÇÃO COM TELA DE EXECUÇÃO

   Refatore o componente FraseCientificaInline (Fase 5):
   - Em vez de mostrar apenas a frase curta estática, agora tem um
     toque que abre o painel científico (Nível 2) em BottomSheet.
   - Visual: pequeno ícone Phosphor BookOpen ao lado da frase indicando
     que é tocável.

6. PERSONALIZAÇÃO LEVE

   Crie lib/personalizacao-conteudo.ts:
   - Função ordenarArtigosPorPerfil(artigos, perfil): retorna lista
     ordenada com matching das tags do perfil primeiro.
   - Função obterArtigosSugeridos(perfil, limit=3): retorna top N
     artigos mais relevantes não-lidos.

   Use a função obterArtigosSugeridos na Home (mostra um pequeno card
   "Sugestão de leitura: [título]" abaixo dos elementos atuais, opcional
   e dispensável se o layout ficar pesado).

CRITÉRIOS DE QUALIDADE

- Tipografia de leitura confortável (line-height generoso, contraste
  bom, fonte Fraunces ou Inter conforme variante).
- Markdown renderiza corretamente com nossos estilos.
- Performance no scroll de artigos longos.

VALIDAÇÃO ESPERADA

- Tocar em "Ciência" no rodapé abre lista com 18 artigos.
- Tocar em artigo abre tela de leitura com markdown renderizado.
- Marcar como lido funciona e dispara conquista.
- No detalhamento de exercício, aba "Ciência" mostra conteúdo expandido.
- Personalização: artigos relacionados ao seu perfil aparecem no topo.

Comece pela tela de leitura (passo 3) e me mostre com um artigo de
exemplo antes de prosseguir.
```

### Critérios de Validação Antes de Avançar para a Fase 9

- 18 artigos científicos populados no Supabase com markdown válido.
- Seção Ciência abre e lista os artigos ordenados pelo seu perfil (os relacionados a Aquiles/joelho/quadril aparecem no topo).
- Tocar em um artigo abre tela de leitura com markdown renderizado em tipografia confortável.
- Marcar como lido funciona, dispara conquista "Primeira leitura" na primeira vez.
- Painel científico no detalhamento de exercício (aba Ciência) mostra conteúdo expandido com referências clicáveis.
- Frase científica inline na tela de execução agora é tocável e abre o painel.

### Notas e Armadilhas Comuns

A armadilha principal é o Codex inventar citações. Mesmo com instrução explícita de não inventar, modelos de linguagem têm tendência a alucinar referências quando a literatura é densa. Faça um spot-check em 3-4 citações aleatórias dos artigos produzidos: pegue uma citação, vá ao arquivo de pesquisa original, e confira se ela realmente vem de lá. Se você encontrar uma única alucinação, peça para o Codex revisar todos os artigos cuidadosamente.

Segunda armadilha: artigos longos demais. O PRD especifica 300-800 palavras. Se algum artigo passa de 1000 palavras, peça para encurtar. Leitura no celular fica cansativa rápido.

Terceira armadilha: renderização de markdown em React Native. Bibliotecas como `react-native-markdown-display` ou `react-native-render-html` têm peculiaridades. Tabelas podem não renderizar bem. Se algum artigo tem tabela, considere converter para listas.

---

## Fase 9 — Camada de Nutrição Inteligente

### Objetivo

Implementar a quarta dimensão do produto: a aba Nutrição com calculadora dinâmica de proteína baseada em peso e fase, catálogo de fichas de suplementos com classificação de evidência, e sistema opcional de lembretes diários via notificações locais (creatina, refeições proteicas, hora do treino).

Esta fase materializa o pilar de Nutrição Inteligente descrito no PRD. Sem ela, o app é "só" um app de treino bom; com ela, vira o ecossistema completo que foi proposto.

### Pré-requisitos

Blocos 1, 2 e Fase 8 concluídos. Tabela `suplementos` populada (Fase 2). Perfil do usuário com `peso_corporal_kg`, `fase_nutricional`, `usa_creatina`, `usa_cafeina` preenchidos.

### Divisão de Trabalho

**Codex (branch `feat/nutricao-motor`):** motor de cálculo de proteína, motor de lembretes (agendamento via expo-notifications, cancelamento, recriação quando preferências mudam), persistência das preferências de lembretes.

**Antigravity (branch `feat/nutricao-ui`):** telas de Nutrição (calculadora, catálogo de suplementos, configuração de lembretes), modais de detalhamento de cada suplemento.

### Modelo Recomendado

Ambos: Categoria Média. Lógica não é complexa, telas são padrão.

### Agentes, Skills e Workflows (se kit instalado)

- Antigravity: `frontend-specialist`, `mobile-developer`
- Skills: `frontend-design`, `react-best-practices`

### Prompts Prontos

#### Prompt para Codex (motor de nutrição — branch `feat/nutricao-motor`)

```
Projeto Hypertropos. Tarefa: Motor de Nutrição e Lembretes.

CONTEXTO

A camada de Nutrição Inteligente do app tem duas partes lógicas:
1. Calculadora de proteína dinâmica baseada em peso corporal e fase.
2. Sistema de lembretes opcionais via notificações locais.

Você implementa as duas. Trabalhe na branch feat/nutricao-motor.

ESPECIFICAÇÃO COMPLETA

Copie aqui a Seção 11 (Sistema de Nutrição Inteligente) do PRD V3.

TAREFAS

### Motor de Cálculo de Proteína

1. Crie lib/calculadora-proteina.ts exportando:

   a. calcularMetaProteina(perfil: Perfil): { meta_total_g, fator_g_kg,
      explicacao }
      Fatores por fase:
      - manutencao: 1.6 g/kg
      - hipertrofia: 1.8 g/kg
      - deficit: 2.2 g/kg
      Meta = peso_corporal_kg × fator.
      explicacao = "1.8 g por kg de peso corporal para hipertrofia
      (Morton et al. 2018, BJSM)".

   b. distribuicaoSugerida(meta_total_g, numero_refeicoes): { por_refeicao_g,
      refeicoes }
      Distribui meta em refeições (default 4). Por refeição = total /
      número. Garante 0.3-0.4 g/kg por refeição (Schoenfeld & Aragon
      2018). Se meta / 4 fica fora desta faixa, sugere ajustar número
      de refeições.

   c. validarMetaCustomizada(meta_proposta_g, peso_kg): { valida, alerta }
      Permite usuário ajustar manualmente entre 1.4 e 2.5 g/kg. Fora
      disso, alerta.

2. Crie hooks/useMetaProteina.ts que consome o perfil atual, recalcula
   automaticamente quando peso muda, e expõe a meta atualizada.

3. Integração com histórico de peso. Toda vez que peso_corporal_kg é
   atualizado em perfil_usuario, registra entrada em
   historico_peso_corporal (timestamp + peso). Hook
   useEvolucaoPeso() retorna últimas 12 medições para gráfico.

### Motor de Lembretes

4. Crie lib/motor-lembretes.ts exportando:

   a. agendarLembrete(lembrete: Lembrete): Promise<string>
      - Recebe Lembrete (tipo, horario, dias_da_semana, mensagem).
      - Usa expo-notifications para agendar notificações locais
        recorrentes.
      - Retorna o ID da notificação (Notifications.scheduleNotificationAsync
        retorna identifier).
      - Salva o ID no campo lembrete.notification_id no Supabase para
        poder cancelar depois.

   b. cancelarLembrete(lembrete_id: string): Promise<void>
      - Cancela a notificação no expo-notifications usando o
        notification_id salvo.
      - Atualiza ativo=false no Supabase.

   c. recriarLembretes(): Promise<void>
      - Útil quando o usuário muda preferências e os lembretes precisam
        ser re-agendados.
      - Cancela todos os lembretes ativos e re-agenda com config atual.

   d. solicitarPermissaoNotificacoes(): Promise<boolean>
      - Chama Notifications.requestPermissionsAsync.
      - Retorna true se concedida.

5. Crie types/lembrete.ts (se não existe). Estrutura completa do
   Lembrete:
   - id: string
   - tipo: "creatina" | "refeicao_proteica" | "hora_treino"
   - horario: string "HH:MM"
   - dias_da_semana: number[] (0=domingo, 6=sábado)
   - ativo: boolean
   - mensagem: string
   - notification_id: string | null (ID do expo-notifications)

6. Lembretes padrão sugeridos (não criados automaticamente, mas
   disponíveis como sugestões quando o usuário ativar a configuração):

   - Creatina diária às 08:00 (se usa_creatina=true): "Hora da creatina.
     3-5g com água ou junto da refeição."
   - Refeição proteica às 08:30, 13:00, 16:00, 19:30: "Refeição proteica
     — alvo: {X}g" (X calculado da meta diária / 4).
   - Hora do treino: baseado em horario_preferido_treino do perfil.

7. Crie db/queries/nutricao.ts:
   - listarLembretes(): Promise<Lembrete[]>
   - salvarLembrete(lembrete): Promise<Lembrete>
   - atualizarLembrete(id, mudancas): Promise<Lembrete>
   - removerLembrete(id): Promise<void>

8. Tratamento de edge cases:
   - Se usuário negou permissão de notificações: não tente agendar,
     mostre estado no banco como "permissao_negada".
   - Se app é reinstalado/atualizado: a fila de notificações do
     expo-notifications pode ser limpa. No startup, verificar quais
     lembretes deveriam estar ativos e re-agendar via recriarLembretes.

9. Testes em tests/calculadora-proteina.test.ts e
   tests/motor-lembretes.test.ts cobrindo:
   - Cálculo correto para cada fase.
   - Distribuição em refeições.
   - Ajuste automático quando peso muda.
   - Agendar/cancelar lembrete (mock do expo-notifications).

CRITÉRIOS DE QUALIDADE

- Cálculos científicos exatos baseados nas referências.
- Lembretes não duplicam (cancela antes de re-agendar).
- Tratamento robusto de permissões negadas.

VALIDAÇÃO ESPERADA

- Testes passam.
- Manualmente, com peso=75kg e fase=hipertrofia, meta = 75 × 1.8 = 135g.

Comece pela calculadora.
```

#### Prompt para Antigravity (UI de nutrição — branch `feat/nutricao-ui`)

```
Continuação do projeto Hypertropos. Fase 9 — UI da Camada de Nutrição.

CONTEXTO

O Codex está em paralelo implementando o motor de nutrição
(calculadora de proteína + sistema de lembretes). Você cria as TELAS
que consomem esse motor.

Trabalhe na branch feat/nutricao-ui.

ESPECIFICAÇÃO

Copie aqui a Seção 7.8 (Seção Nutrição) e a Seção 11 inteira do PRD V3.

TAREFAS

1. TELA PRINCIPAL DA ABA NUTRIÇÃO (app/(tabs)/nutricao.tsx)

   Layout vertical com 3 cards principais grandes:

   CARD 1 — CALCULADORA DE PROTEÍNA

   - Texto displayL com a meta atual: "135g" (peso × fator).
   - Subtexto: "Sua meta diária de proteína"
   - Texto caption explicativo: "75kg × 1.8 g/kg = 135g (fase
     hipertrofia)"
   - Ícone Phosphor Info pequeno que abre BottomSheet com explicação
     longa: por que esse fator, referência científica, etc.
   - Subdiv com distribuição sugerida:
     "Distribua em 4 refeições de ~34g cada"
   - Botão pequeno "Ajustar manualmente" que abre slider de fator
     (1.4 a 2.5 g/kg) com feedback haptic.
   - Sub-link "Ver evolução do peso" que abre BottomSheet com mini
     gráfico de últimas 12 medições.

   CARD 2 — SUPLEMENTOS

   - Texto h2 "Suplementos"
   - Subtexto: "Catálogo científico"
   - Lista horizontal (scroll horizontal) de 7-8 chips de suplementos:
     creatina, whey, caseína, cafeína, beta-alanina, citrulina, vit D,
     ômega-3, sem-evidência.
   - Cada chip mostra nome + nivel_evidencia (badge grade A/B/C colorido).
   - Tocando, abre tela de detalhamento (passo 2).

   CARD 3 — LEMBRETES

   - Texto h2 "Lembretes"
   - Lista de lembretes ativos do usuário (vazia inicialmente):
     - Cada item: ícone do tipo + horário + dias da semana + toggle
       on/off.
   - Botão "+ Adicionar lembrete" que abre modal de criação (passo 4).
   - Se não há lembretes: empty state acolhedor: "Você ainda não tem
     lembretes. Quer ativar um lembrete de creatina?"

2. TELA DE DETALHAMENTO DE SUPLEMENTO (app/suplemento/[id].tsx)

   - Header com nome do suplemento (Fraunces h1) e botão voltar.
   - Badge grande de nível de evidência (Grau A em accent-gold, B em
     accent-bronze, C em fg-muted).
   - Seções:
     - Mecanismo: parágrafo do campo mecanismo_resumido.
     - Dosagem: dose_padrao, dose_dependente_peso, timing_recomendado.
     - Benefícios documentados: lista bullet.
     - Efeitos colaterais: lista bullet.
     - Referências: lista tocável (links para PubMed).
   - Se recomendado_para_perfil = true: badge no topo "Recomendado
     para hipertrofia" em accent-bronze.
   - Botão no rodapé:
     - Se suplemento_id é creatina/cafeina: "Marcar que uso este
       suplemento" (atualiza perfil.usa_creatina ou usa_cafeina).
     - Para outros: apenas botão de voltar.

3. FICHA "SUPLEMENTOS SEM EVIDÊNCIA FORTE"

   Mesma tela mas com layout ligeiramente diferente:
   - Badge "Sem evidência forte" em feedback-warning (não accent-gold).
   - Header com aviso curto: "Estes suplementos são amplamente
     comercializados mas a evidência científica não sustenta seus
     benefícios para hipertrofia."
   - Lista de itens: BCAAs, Glutamina, Testosterona boosters, HMB para
     treinados, Pré-treinos blends proprietários. Para cada um, parágrafo
     curto explicando por que a evidência é fraca.

4. MODAL DE CRIAÇÃO/EDIÇÃO DE LEMBRETE

   Componente components/nutricao/ModalLembrete.tsx:

   - Seletor de tipo: Creatina / Refeição / Treino.
   - Seletor de horário (TimePicker do React Native).
   - Seletor de dias da semana (chips multi-select).
   - Campo de mensagem customizada (opcional, com placeholder
     "Padrão: Hora da creatina").
   - Botão "Salvar" que chama agendarLembrete().
   - Antes de salvar pela primeira vez, chama
     solicitarPermissaoNotificacoes(). Se negado, mostra mensagem clara
     e abre Settings do sistema.

5. INTEGRAÇÃO COM PERFIL

   No fluxo de configurar lembrete pela primeira vez, se usuário
   marca "uso creatina" mas nunca tinha marcado antes, atualiza
   perfil.usa_creatina = true automaticamente. Também recomenda
   suplemento na primeira abertura da aba Nutrição se usa_creatina
   = false: pequeno card "Você ainda não marcou se usa creatina.
   Saiba mais."

6. INTEGRAÇÃO COM CONFIGURAÇÕES

   Adicione em app/configuracoes/index.tsx (criar se ainda não existe)
   a seção "Nutrição":
   - Atualizar peso (input numérico).
   - Mudar fase nutricional (manutenção / hipertrofia / déficit).
   - Gerenciar lembretes (link para tela de lembretes).

7. INTEGRAÇÃO COM SISTEMA DE CONQUISTAS

   Eventos que disparam verificarConquistasAposEvento:
   - Atualizar peso → conquista "Primeira pesagem registrada"
   - Ativar primeiro lembrete → conquista "Hábito construído"
   - Manter meta proteica por N dias → conquistas relacionadas
     (precisa de tracking que o usuário marcou que comeu — fora
     do escopo da V1; pode flagar para V2).

CRITÉRIOS DE QUALIDADE

- ZERO defaults visuais.
- Microcopy nutricional usa termos corretos (proteína, não "proteína
  whey"; g/kg, não "gramas por quilo" verbose).
- Permissão de notificação tratada com tela explicativa antes
  (Seção 16.4 do PRD).

VALIDAÇÃO ESPERADA

- Tela Nutrição abre com calculadora mostrando meta correta.
- Ajustar peso recalcula meta automaticamente.
- Lista de suplementos clicável, abre detalhamento.
- Criar lembrete funciona: notificação aparece no Galaxy S23 no horário
  programado.
- Cancelar lembrete remove a notificação.
- Reabrir o app não duplica lembretes.

Comece pela tela principal e me mostre antes de prosseguir.
```

### Critérios de Validação Antes de Avançar para a Fase 10

- Aba Nutrição abre com 3 cards visíveis e funcionais.
- Calculadora mostra meta correta para seu peso (faça a conta na mão para conferir).
- Mudar peso em Configurações recalcula meta automaticamente.
- Detalhamento de cada um dos 8 suplementos abre corretamente com nível de evidência.
- Criar um lembrete de creatina às 08:00 funciona: você recebe notificação no celular no dia seguinte às 08:00.
- Cancelar o lembrete remove a notificação.
- Permissão de notificações é solicitada com explicação clara antes da API nativa.
- Reabrir o app várias vezes não duplica lembretes.

### Notas e Armadilhas Comuns

A armadilha mais comum é o `expo-notifications` ter quirks em Android moderno. Versões recentes do Android requerem permissão explícita em runtime (não basta no manifest), e o canal de notificação precisa ser criado explicitamente. Cheque que o `app.json` tem a configuração do plugin de notifications, e que no startup do app você cria um canal padrão para Android.

Segunda armadilha: notificações duplicadas. Se você ativa um lembrete, fecha o app, reabre, e ele aparece "duplicado" na lista (mas a notificação é uma só), provavelmente é problema de sincronização. A função `recriarLembretes` no startup ajuda, mas use com cuidado para não cancelar e re-agendar a cada abertura (gasta bateria).

Terceira armadilha: lembrete não disparar. Se você programa um lembrete e ele não toca no horário, geralmente é uma de três causas: (1) permissão não foi concedida; (2) modo "não perturbe" do sistema está ativo; (3) Android matou o processo. A terceira é a mais frustrante e é problema conhecido do Android — algumas marcas (Xiaomi, Huawei) matam apps mais agressivamente. Galaxy S23 (Samsung) é razoável. Adicione uma instrução nas Configurações: "Para garantir que os lembretes funcionem, certifique-se que o app não está em otimização de bateria do sistema".

---

## Fase 10 — Design Sonoro e Atalho de Música

### Objetivo

Implementar o design sonoro próprio do app (sons funcionais curtos para conclusão de série, fim de descanso, conclusão de exercício, conclusão de sessão, desbloqueio de conquista, transição de tier, e cancelamento), popular o pool de microcopy variável conforme PRD Seção 15.3, e implementar o atalho para abrir apps de música externos via Android Intent.

Esta é a fase de "alma" do app — onde ele ganha presença auditiva e textual variada. Curiosamente, é uma das fases mais subestimadas mas com maior impacto perceptual.

### Pré-requisitos

Blocos 1, 2 e Fases 8-9 concluídos.

### Divisão de Trabalho

**Codex (branch `feat/microcopy`):** população dos pools de microcopy variável (~150 frases distribuídas pelos contextos), criação dos hooks/utilitários de sorteio sem repetição.

**Antigravity (branch `feat/audio-musica`):** integração dos arquivos de som via expo-av, hook de áudio centralizado, integração do atalho de música via Android Intent, configuração em Settings.

**Você (humano):** uma tarefa fora das ferramentas. Producir ou selecionar os arquivos de som propriamente ditos. Não há agente que faça isso bem — você decide. Vou explicar abaixo.

### Modelo Recomendado

Ambos: Categoria Média.

### Tarefa Manual: Obter os Sons

Antes de rodar os prompts deste, você precisa dos arquivos de som em `assets/sounds/`. Há três caminhos práticos para obter:

**Opção A — Freesound.org (recomendada).** Site gratuito com milhões de sons, todos com licença Creative Commons (CC0, CC-BY ou CC-BY-NC). Crie conta gratuita e procure por termos como "soft chime", "tibetan bowl short", "metallic click satisfying", "victory short jingle", "spark small", "wood click". Baixe em formato .mp3 ou .ogg. Atribuição é necessária só para CC-BY — verifique a licença de cada arquivo. Eu recomendaria buscar especificamente: para conclusão de série um "wood click subtle"; para fim de descanso um "soft ascending chime 3 notes"; para conclusão de exercício um "positive marimba short"; para conclusão de sessão um "victory chime warm ~1.5s"; para conquista um "tibetan bowl medium ~2s"; para cancelamento um "neutral soft tone".

**Opção B — Geração via síntese (sem download).** Use bibliotecas tipo Tone.js em React Native (ou tone para web e exportar) para gerar sons proceduralmente em código. Mais complexo mas dá controle total. Não recomendo para V1 — gasta tempo demais.

**Opção C — Pixabay Music ou ZapSplat.** Sites alternativos com sons gratuitos. ZapSplat tem coleção curada mas exige conta. Pixabay é livre.

Você baixa 6-8 arquivos pequenos (cada um <100KB idealmente, max 300KB) e coloca em `assets/sounds/` com nomes claros: `conclusao-serie.mp3`, `fim-descanso.mp3`, `conclusao-exercicio.mp3`, `conclusao-sessao.mp3`, `conquista.mp3`, `tier-transicao.mp3`, `cancelamento.mp3`.

Tempo estimado para essa curadoria: 1-2 horas escutando e selecionando.

### Prompts Prontos

#### Prompt para Codex (microcopy — branch `feat/microcopy`)

```
Projeto Hypertropos. Tarefa: Pools de Microcopy Variável.

CONTEXTO

O app usa microcopy variável (frases sorteadas sem repetição) em vários
momentos para evitar repetição e dar variedade dopaminérgica. Você
popula os pools.

Trabalhe na branch feat/microcopy. Cria/atualiza
constants/microcopy.ts.

ESPECIFICAÇÃO

Copie aqui a Seção 15.3 (Microcopy por Contexto) do PRD V3.

POOLS A POPULAR

1. FRASES_ENTRE_EXERCICIOS — 40 frases curtas (1-3 palavras ou frase
   muito curta) exibidas durante a transição entre exercícios. Mix de:
   - Neutras-celebratórias: "Mandou bem", "Tá fluindo", "Foco mantido",
     "Forma boa", "Próxima vem".
   - Técnicas-positivas: "Tensão pura", "Tijolo por tijolo", "Construção
     em andamento", "Volume na veia", "Cresceu agora".
   - Diretas: "Mais um", "Em frente", "Concluído", "Salvo no histórico".

   Tom: maduro, brasileiro, sem hipermasculinidade. Sem exclamação
   exagerada. Sem gírias datadas.

2. FRASES_FALHA_PROXIMA — 15 frases mostradas quando usuário registra
   RIR 0-1 (quase à falha). Reconhecimento de esforço alto:
   "Esforço de verdade", "Limite encontrado", "Última gota", "Tensão
   máxima alcançada", etc.

3. FRASES_FIM_SESSAO — 20 frases mais elaboradas (uma sentença
   completa) exibidas na tela de celebração final:
   - "Sessão concluída. O músculo cresce no descanso."
   - "Mais um tijolo na construção."
   - "Tensão registrada. Volume contabilizado."
   - "Treino feito. Sono importante agora."
   - "Sessão arquivada. Agora cabe ao corpo trabalhar."
   - etc.

4. FRASES_CONQUISTA — 10 frases para a tela de desbloqueio de conquista:
   - "Mais uma desbloqueada."
   - "Conquista registrada."
   - "Marco atingido."
   - etc.

5. FRASES_SESSAO_EXPRESS — 8 frases para quando o usuário usa sessão
   express (15 min), valorizando o "fez algo > não fez nada":
   - "Express conta. Streak preservado."
   - "Menos hoje, mais amanhã."
   - "Volume mantido na economia."
   - etc.

6. FRASES_FREEZE_USADO — 6 frases mostradas quando o usuário usa um
   freeze:
   - "Freeze usado. Streak intacto."
   - "Imprevisto absorvido. Em frente."
   - etc.

7. FRASES_LEMBRETE_CREATINA — 5 variações para a mensagem de
   notificação:
   - "Hora da creatina. 3-5g com água."
   - "Pílula da consistência: creatina."
   - "Creatina diária. Pode tomar agora."
   - etc.

UTILITÁRIO DE SORTEIO

Crie hooks/useMicrocopy.ts exportando hook useMicrocopy(pool: string[])
que:
- Retorna função sortear(): string que pega uma frase aleatória sem
  repetir até esgotar o pool, e então reseta.
- Mantém estado interno (useRef) do pool já sorteado nessa sessão.
- Persiste opcionalmente em AsyncStorage para não repetir entre
  sessões próximas.

CRITÉRIOS DE QUALIDADE

- Português brasileiro natural, segunda pessoa quando aplicável.
- Tom maduro: nem academia barata nem corporativo.
- Sem clichês motivacionais ("no pain no gain", "acorda guerreiro").
- Sem emojis no meio das frases (emojis só onde o PRD permite).
- Variedade real entre as frases de um mesmo pool (não 40 variações de
  "mandou bem").

NÍVEL DE RACIOCÍNIO

Reasoning Medium. Tarefa criativa mas delimitada.

VALIDAÇÃO ESPERADA

- constants/microcopy.ts tem 7 pools exportados com totais
  aproximadamente corretos (40 + 15 + 20 + 10 + 8 + 6 + 5).
- Hook useMicrocopy funciona e não repete dentro do mesmo pool.

Comece pelo FRASES_ENTRE_EXERCICIOS e me mostre 20 das 40 antes de
prosseguir.
```

#### Prompt para Antigravity (áudio e música — branch `feat/audio-musica`)

```
Continuação do projeto Hypertropos. Fase 10 — Áudio e Atalho de Música.

CONTEXTO

Você integra duas coisas neste prompt:
1. Os arquivos de som funcionais que o usuário curou (em
   assets/sounds/).
2. O atalho para abrir apps de música externos via Android Intent.

Trabalhe na branch feat/audio-musica.

ESPECIFICAÇÃO

Copie aqui a Seção 13 (Política de Áudio e Design Sonoro) do PRD V3.

TAREFAS

### Sons Funcionais

1. Verifique que assets/sounds/ tem os 7 arquivos:
   - conclusao-serie.mp3 (~200ms, click satisfatório)
   - fim-descanso.mp3 (~400ms, ding ascendente)
   - conclusao-exercicio.mp3 (~500ms, acorde positivo)
   - conclusao-sessao.mp3 (~1.2s, jingle de vitória)
   - conquista.mp3 (~1.5s, tigela tibetana ou similar)
   - tier-transicao.mp3 (~2s, som mais elaborado)
   - cancelamento.mp3 (~300ms, tom neutro)

   Se algum estiver faltando, sinalize e use placeholder de silêncio
   (arquivo vazio ou beep gerado).

2. Crie lib/motor-audio.ts usando expo-av:

   - playSound(nome: SoundName): Promise<void>
     Pré-carrega os 7 sons no startup do app (Audio.Sound.loadAsync para
     cada).
     Mantém referências em memória.
     Quando chamado, dá replayAsync no Sound correspondente.

   - desabilitarSons(): boolean
   - ativarSons(): void
   - getSomAtivo(): boolean
     Estado persiste em AsyncStorage (chave "som_ativo", default true).

3. Hook useSound() que retorna { play, ativo, toggle }.

4. Integre nas telas existentes:
   - BotaoConcluirSerie.tsx → play('conclusao-serie')
   - TimerDescanso.tsx (quando chega a 0) → play('fim-descanso')
   - TransicaoExercicio.tsx → play('conclusao-exercicio')
   - CelebracaoFinalSessao.tsx → play('conclusao-sessao')
   - CelebracaoConquista.tsx → play('conquista')
   - TransicaoTier.tsx → play('tier-transicao')
   - Cancelamento de sessão → play('cancelamento')

5. Configuração em Settings:
   - Toggle on/off para sons (já existe em Configurações da Fase 1).
   - Garanta que toggle salva e respeita imediatamente.

6. Coexistência com música externa:
   - Configure expo-av para NÃO interromper áudio externo. Use
     Audio.setAudioModeAsync com playsInSilentModeIOS=true,
     allowsRecordingIOS=false, interruptionModeIOS e
     interruptionModeAndroid="duckOthers" (reduz volume da música
     temporariamente quando o app toca, em vez de pausar).
   - Teste manualmente: abra Spotify, toque uma música, abra o app,
     comece treino. A música deve continuar tocando, e os sons do app
     se sobrepõem suavemente.

### Atalho de Música Externa

7. Crie components/treino/BotaoMusica.tsx:
   - Pequeno botão flutuante no canto superior direito da tela de
     pre-treino e na tela de execução.
   - Ícone Phosphor MusicNote em accent-bronze.
   - Ao tocar, abre o app de música preferido configurado.

8. Lógica de abertura via Android Intent:
   - Crie lib/intent-musica.ts:
     - abrirAppMusica(): Promise<void>
       Lê preferencia salva em AsyncStorage (chave
       "app_musica_preferido", default "spotify").
       Tenta abrir via Linking.openURL com URL scheme:
       - spotify: "spotify:"
       - youtube_music: "vnd.youtube://music"
       - apple_music: "music:"
       - deezer: "deezer:"
       - amazon_music: "amzn://music"
       - tidal: "tidal:"
     - Se o app não está instalado, mostra alerta sugerindo instalar
       ou escolher outro em Settings.

9. Configuração em Settings:
   - Crie tela app/configuracoes/musica.tsx ou seção em configuracoes/
     index.tsx:
     - Seletor (radio list) de qual app de música preferido.
     - Botão "Testar" que abre o app selecionado.

10. Botão "Testar":
   - Apenas durante a configuração, para o usuário verificar que o
     app abre corretamente sem precisar começar um treino.

CRITÉRIOS DE QUALIDADE

- Sons coexistem com música externa sem interromper.
- Sons curtos (não invadem o silêncio).
- Toggle de som desabilita completamente.
- Atalho de música abre o app preferido instantaneamente.

VALIDAÇÃO ESPERADA

- Cada interação relevante toca o som correto.
- Tocar Spotify antes do treino → começar treino → música continua
  + sons do app se sobrepõem.
- Desativar sons em Settings → app fica silencioso.
- Botão de música no pré-treino abre o app de música preferido.

Comece pelo motor de áudio e me mostre antes de integrar nas telas.
```

### Critérios de Validação Antes de Avançar para a Fase 11

- Os 7 arquivos de som estão em `assets/sounds/`.
- Toda interação relevante (concluir série, fim de descanso, etc) toca o som correto.
- Sons coexistem com música externa do Spotify sem interromper.
- Toggle de som em Settings funciona instantaneamente.
- Microcopy variável aparece nas transições — você nota frases diferentes em sessões diferentes.
- Botão de música na tela de pré-treino abre seu app de música preferido (Spotify ou outro) via Android Intent.
- Configuração de qual app de música usar funciona em Settings.

### Notas e Armadilhas Comuns

A armadilha número um é o `expo-av` no Android moderno. Em algumas versões, áudio em background pode ser cortado pelo sistema. Configure o modo de áudio corretamente (`Audio.setAudioModeAsync`) no startup do app, antes de qualquer som tocar. Especialmente o `interruptionModeAndroid: "duckOthers"` é o que permite coexistência com Spotify.

Segunda armadilha: arquivos de som grandes. MP3 a 128kbps de 1 segundo = ~16KB. Não baixe nada de mais de 200KB. Se um arquivo de som ficou grande (1MB+), comprima ou troque.

Terceira armadilha: Android Intent para apps de música não-instalados. Se você seleciona Spotify e não tem Spotify instalado, `Linking.openURL("spotify:")` pode crashar ou abrir Play Store. Trate com `Linking.canOpenURL` antes de chamar `openURL`, e mostre alerta amigável se não der.

Quarta armadilha: microcopy ficar repetitivo apesar do sorteio sem repetição. Se o pool tem só 5 frases, você vê todas em uma sessão de 6 exercícios. Garanta que `FRASES_ENTRE_EXERCICIOS` tem 30+ frases.

---

## Fase 11 — Polish, Estados e Edge Cases

### Objetivo

Refinamento visual final do app, implementação cuidadosa dos estados de loading/erro/vazio (Seção 16 do PRD), correção de edge cases descobertos durante o uso real, e otimização final de performance. Esta é a fase do "olhar de novo para tudo" — você passa por cada tela e refina o que ficou raw.

Diferente das fases anteriores, esta é menos "executar um prompt e validar" e mais "iterar conforme você usa". Vou estruturar como **trilhas de polish** que você vai navegando ao longo de 1-2 semanas.

### Pré-requisitos

Blocos 1, 2 e Fases 8-10 concluídos. App funcionalmente completo. Você já usou o app por pelo menos 1-2 semanas treinando de verdade — isso é essencial porque os edge cases só aparecem com uso real.

### Divisão de Trabalho

Esta fase é majoritariamente **Antigravity em sessões curtas**. Cada trilha de polish abaixo é uma sessão de Antigravity com prompt específico. Codex entra apenas para refatorações de lógica se algo apareceu.

### Modelo Recomendado

Antigravity: Categoria Média para os refinamentos visuais. Categoria Forte se algum edge case envolve refatoração grande.

### Trilhas de Polish

Em vez de um prompt grande único, esta fase tem 6 trilhas independentes. Você pode fazê-las em qualquer ordem, conforme percebe necessidade. Para cada trilha, sugiro um prompt-template que você customiza.

#### Trilha 1 — Skeleton Screens (Loading States)

```
Continuação do projeto Hypertropos. Fase 11 — Trilha 1: Skeleton Screens.

CONTEXTO

O app atualmente mostra estados de loading com spinners genéricos ou
sem feedback. Vamos substituir por skeleton screens conforme Seção
16.1 do PRD V3.

Trabalhe na branch feat/polish-skeletons.

TAREFAS

1. Crie components/ui/Skeleton.tsx — componente reutilizável que
   renderiza placeholder com shimmer animation.
   - Props: width, height, borderRadius (default radius-sm).
   - Animação: gradient de bg-elevated → bg-highlight → bg-elevated
     passando da esquerda para direita em 1200ms loop.
   - Use Reanimated 3 com Skia ou Animated linearGradient.

2. Identifique todas as telas com loading state e substitua spinners
   por skeletons apropriados:

   - Home: enquanto carrega ProgramaAtivo e EstadoSilhueta, mostrar
     skeleton com forma de silhueta + skeleton do card de hoje +
     skeletons das linhas de streak/XP.
   - Tela pre-treino: skeletons dos cards de exercício enquanto carrega
     a sessão.
   - Catálogo de exercícios: skeletons dos cards na lista vertical.
   - Tela Progresso (cada aba): skeletons apropriados.
   - Tela Ciência: skeletons dos cards de artigo.
   - Tela Nutrição: skeleton do card de calculadora.

3. Regra: skeletons aparecem apenas se a operação demora >200ms.
   Operações mais rápidas são instantâneas (sem feedback intermediário).

4. Loading de tela inteira: NUNCA. Sempre skeletons da estrutura final.

5. Quando há erro de rede (Supabase indisponível): skeleton desaparece,
   mostra banner discreto "Trabalhando offline. Dados locais
   carregados." em feedback-warning no topo.

CRITÉRIOS

- Sem spinners genéricos sobrando.
- Skeletons fluem em 60fps.
- Transição de skeleton → conteúdo real é suave (fade 200ms).

Comece pelo componente Skeleton e me mostre antes de aplicar nas telas.
```

#### Trilha 2 — Mensagens de Erro com Responsabilidade

```
Continuação do projeto Hypertropos. Fase 11 — Trilha 2: Mensagens de Erro.

CONTEXTO

Toda mensagem de erro do app deve assumir responsabilidade (não culpar
usuário), explicar consequência, e oferecer ação. Seção 16.2 do PRD V3.

Trabalhe na branch feat/polish-erros.

TAREFAS

1. Audite o app inteiro procurando por mensagens de erro. Identifique
   onde aparecem:
   - Falha de sync com Supabase
   - Erro ao salvar perfil
   - Erro ao iniciar sessão
   - Erro ao registrar série
   - Erro de permissão de notificação
   - Crash inesperado (boundary errors)

2. Para cada uma, substitua a mensagem técnica por mensagem com 3
   elementos:
   - O que aconteceu (linguagem clara)
   - O que significa para o usuário
   - O que ele pode fazer

   Exemplo:
   ANTES: "Erro 503. Falha na conexão."
   DEPOIS: "Não consegui sincronizar com a nuvem agora. Seus dados
   estão salvos no celular e vou tentar de novo automaticamente. Você
   pode continuar treinando normalmente."

3. Tipos de erro:

   ERROS RECUPERÁVEIS (rede temporária, etc): banner discreto em
   feedback-warning no topo da tela, desaparece sozinho quando
   resolve. Não bloqueia UI.

   ERROS NÃO-RECUPERÁVEIS (corrupção de dados, raríssimo):
   tela dedicada com explicação calma + opções (recuperar do Supabase,
   exportar dados, tentar de novo).

4. Crie um ErrorBoundary global em app/_layout.tsx que captura
   crashes inesperados e mostra fallback amigável em vez de tela
   branca.

5. Microcopy de cada erro deve passar pelo glossário (Seção 15.4 do
   PRD): termos consistentes, tom maduro.

CRITÉRIOS

- ZERO mensagens "Erro: [stacktrace técnico]" para o usuário.
- ZERO culpa do usuário em erros técnicos.
- Erros recuperáveis não bloqueiam ação do usuário.

Comece pelo ErrorBoundary global e depois passe pelas telas
principais.
```

#### Trilha 3 — Estados Vazios Acolhedores

```
Continuação do projeto Hypertropos. Fase 11 — Trilha 3: Estados Vazios.

CONTEXTO

Estados vazios são oportunidades de orientação, não buracos. Seção 16.3
do PRD V3.

Trabalhe na branch feat/polish-vazios.

TAREFAS

1. Identifique todas as telas que podem aparecer vazias:
   - Histórico antes do primeiro treino
   - Conquistas antes da primeira
   - Tela de busca sem resultado
   - Filtros sem match
   - Lembretes sem nenhum criado
   - Linha do tempo sem progressões

2. Para cada uma, crie estado vazio com:
   - Ilustração sutil (silhueta minimalista, ícone Phosphor grande em
     fg-muted) — NÃO use imagens stock genéricas.
   - Texto h3 com saudação acolhedora ("Ainda não tem nada por aqui").
   - Texto body com orientação ("Seu primeiro treino aparece aqui após
     a primeira sessão.").
   - Botão (opcional) com ação direta ("Começar treino agora").

3. Microcopy:
   - Tom acolhedor, não condescendente.
   - Sem gracinhas que envelhecem mal.
   - Sem "Oops!" ou exclamações vazias.

CRITÉRIOS

- Toda tela com possibilidade de vazio tem estado vazio implementado.
- Estados vazios incentivam ação, não desencorajam.

Comece pelos mais críticos (Histórico e Conquistas).
```

#### Trilha 4 — Performance e 60fps

```
Continuação do projeto Hypertropos. Fase 11 — Trilha 4: Performance.

CONTEXTO

Após uso real, identificou-se travamentos ou animações abaixo de 60fps
em pontos específicos. Vamos otimizar.

Trabalhe na branch feat/polish-performance.

TAREFAS

1. Use o profiler do Expo (npx expo run:android --profile) ou React
   Native DevTools para identificar:
   - Componentes re-renderizando excessivamente.
   - Listas longas sem virtualization (use FlatList em vez de
     ScrollView para listas com >20 itens).
   - Animações com layout thrashing.
   - Imagens não otimizadas.

2. Focos prováveis baseados em uso real:
   - Silhueta corporal pode ter overhead se re-renderiza a cada toque.
   - Lista de exercícios no catálogo se tem >50 itens.
   - Tela de execução durante transições.

3. Aplique:
   - React.memo em componentes pesados.
   - useMemo para cálculos derivados.
   - useCallback para funções passadas como props.
   - FlatList com getItemLayout para listas longas.
   - Imagens em formato webp se aplicável.

4. Animações:
   - Garanta que toda animação Reanimated roda em worklet (não no
     thread JS).
   - Evite Animated API antiga, prefira Reanimated 3.

5. Métricas alvo:
   - Inicialização <2s no Galaxy S23.
   - Transições de tela <300ms.
   - Animações em 60fps consistente.

Comece medindo as métricas atuais e mostra dados antes de otimizar.
```

#### Trilha 5 — Microajustes Visuais

```
Continuação do projeto Hypertropos. Fase 11 — Trilha 5: Microajustes
Visuais.

CONTEXTO

Após viver com o app, certos detalhes visuais incomodam ou poderiam ser
melhores. Vamos ajustar.

Trabalhe na branch feat/polish-visual.

TAREFAS — VOCÊ VAI ENVIAR ESSE PROMPT VÁRIAS VEZES COM AJUSTES
ESPECÍFICOS A CADA SESSÃO.

Modelo:

"Quero ajustar [X]. Atualmente está [como está]. Quero que fique [como
deveria]. Não mexa em outras telas — só nesse ajuste específico."

Exemplos de ajustes típicos que aparecem:

- Cor da chama do streak está muito chamativa, suavizar para
  accent-bronze menos saturado.
- Espaçamento entre o card de treino de hoje e o streak está apertado
  na Home. Aumentar para space-5.
- Animação de pulso do card pulsante está rápida demais. Ajustar para
  ciclo de 2s em vez de 1s.
- Texto "Sessão concluída" na tela final está pequeno. Aumentar para
  displayL.
- Card de exercício no pre-treino está com border-radius muito grande.
  Reduzir para radius-md.
- Ícone Phosphor X está em peso Regular mas deveria estar em Light
  conforme o sistema visual.

Faça uma sessão semanal de "microajustes" durante 2-3 semanas. Mantenha
lista de coisas que te incomodam conforme usa, vai ajustando em lote.

CRITÉRIOS

- Mudanças cirúrgicas, sem refactor amplo.
- Manter coerência com tokens de design.
- Sem adicionar novas dependências.

Para esta sessão, vou ajustar:
[liste 3-5 coisas específicas que te incomodam]
```

#### Trilha 6 — Edge Cases Descobertos

```
Continuação do projeto Hypertropos. Fase 11 — Trilha 6: Edge Cases.

CONTEXTO

Após uso real, descobriu-se cenários edge que o app não trata bem.
Vamos consertar caso a caso.

Trabalhe na branch feat/polish-edge-cases (ou nomes específicos por
caso).

EXEMPLOS DE EDGE CASES QUE COSTUMAM APARECER:

1. Sessão começada e nunca concluída (app crashed ou usuário forçou
   fechar). Ao abrir o app de novo, oferece "Você tem uma sessão
   inacabada. Retomar ou descartar?"

2. Mudança de fuso horário (raro, mas se você viaja). Streak não deve
   quebrar incorretamente.

3. Conclusão de sessão exatamente à meia-noite. Streak conta para o
   dia certo.

4. Peso corporal informado em libras por engano (>200). Detectar e
   sugerir conversão.

5. Restrições articulares marcadas para todas as articulações
   simultaneamente. Algoritmo pode falhar em gerar rotina. Mostrar
   mensagem orientando.

6. Bateria fraca durante sessão. App não deve consumir mais que
   necessário.

7. Notificação local não disparou (Android matou o app). Verificar no
   startup se há lembretes que "deveriam ter disparado" no passado e
   alertar.

8. Usuário concluiu sessão mas a sync falhou. Dados ficam pendentes
   na fila. Mostrar indicador discreto "X mudanças pendentes" se
   filha > 0.

PROMPT PARA CADA EDGE CASE:

"Identifiquei um edge case: [descrição clara do cenário]. Comportamento
atual: [como age agora]. Comportamento desejado: [como deveria agir].
Implemente a correção sem afetar outras partes do app."

CRITÉRIOS

- Correções pontuais.
- Testes manuais reproduzindo o edge case antes e depois.

Liste os edge cases que você quer corrigir agora.
```

### Critérios de Validação Antes de Avançar para a Fase 12

- Todas as 6 trilhas foram executadas pelo menos uma vez.
- Skeleton screens implementados em todas as telas de loading.
- ErrorBoundary global captura crashes.
- Estados vazios acolhedores em todas as telas relevantes.
- Performance: 60fps consistente nas transições principais.
- Pelo menos uma sessão semanal de microajustes visuais foi feita.
- Edge cases descobertos durante uso real foram tratados.

### Notas e Armadilhas Comuns

A maior armadilha desta fase é **polir para sempre**. Cada vez que você usa, encontra mais 3 coisas para refinar. Em algum momento, é preciso aceitar que está bom o suficiente e seguir para a Fase 12 (build final). Sugiro: defina um deadline (ex: 2 semanas para o Bloco 3 inteiro) e force-se a respeitar. Continuar polindo pós-launch é normal — o app cresce com o uso.

Segunda armadilha: ao otimizar performance, introduzir bugs. Cada otimização (memo, useMemo, useCallback) tem risco de criar memory leak ou stale closure. Teste manualmente após cada otimização antes de seguir.

Terceira armadilha: refactor amplo disfarçado de polish. Se uma trilha começa "preciso refatorar X para arrumar Y", pare e considere se Y vale o esforço. Polish é cirúrgico.

---

## Fase 12 — Build APK e Instalação Final

### Objetivo

Configurar EAS Build para gerar APK Android assinado, otimizar assets finais, gerar a build, instalar manualmente no Galaxy S23, validar o app rodando independentemente do Expo Go, e desativar o ciclo de desenvolvimento. Esta é a fase de **lançamento** do app.

### Pré-requisitos

Bloco inteiro (Fases 0-11) concluído. App testado em uso real por pelo menos 2-3 semanas via Expo Go. Conta EAS no Expo configurada (vinculada à sua conta Expo).

### Divisão de Trabalho

Antigravity guia toda a configuração do EAS e geração do APK. Codex pode ser usado para revisão final de código antes do build (auditoria).

### Modelo Recomendado

Antigravity: Categoria Forte para o prompt principal (decisões críticas de configuração final).
Codex (opcional): Categoria Forte para auditoria final.

### Agentes, Skills e Workflows (se kit instalado)

- Antigravity: `devops-engineer`, `mobile-developer`
- Skills: `deployment-procedures`
- Workflow: `/deploy`

### Prompts Prontos

#### Prompt Opcional para Codex (auditoria final — branch `feat/auditoria-final`)

Antes do build, opcionalmente, peça uma auditoria de código:

```
Projeto Hypertropos. Tarefa: Auditoria Final Pré-Build.

CONTEXTO

Antes de gerar o APK definitivo, quero uma revisão de qualidade do
código. Procure problemas que poderiam afetar o build, a performance, ou
a manutenibilidade.

Trabalhe na branch feat/auditoria-final.

TAREFAS

1. Audite o repositório procurando:
   - any types em TypeScript que poderiam ser tipados.
   - Imports não usados.
   - Console.log de debug deixados em produção.
   - Comentários de TODO/FIXME pendentes.
   - Hardcoded values que deveriam estar em constants/.
   - Dependências em package.json não utilizadas.
   - Arquivos órfãos não referenciados.

2. Gere um relatório AUDITORIA.md listando achados por categoria.

3. Para cada achado, sugira correção mas NÃO aplique automaticamente.
   Vou revisar manualmente quais corrigir.

4. Crie issues no GitHub para os achados importantes.

NÍVEL DE RACIOCÍNIO

Reasoning High. Auditoria profunda.

VALIDAÇÃO

- AUDITORIA.md gerado com achados.
- Issues criadas para os principais.

Esse é trabalho de auditoria, sem modificar código de produção.
```

Aplique manualmente as correções que valerem a pena e siga para o build.

#### Prompt para Antigravity (Build APK — branch `feat/build-final`)

```
Continuação do projeto Hypertropos. Fase 12 — Build APK e Instalação
Final.

CONTEXTO

É a fase final. Vou gerar o APK assinado e instalar no Galaxy S23.
Depois disso, o app é definitivo — substituo o Expo Go pelo APK.

Trabalhe na branch feat/build-final.

ESPECIFICAÇÃO

Copie aqui a Seção 22 (Fase 12) e a Seção 14 (Stack Técnico) do
PRD V3.

TAREFAS

### Setup EAS

1. Verifique que EAS CLI está instalado:
   npm install -g eas-cli
   Faça login com a conta Expo do projeto:
   eas login

2. Inicialize EAS no projeto se ainda não foi feito:
   eas build:configure

3. Crie arquivo eas.json com perfis:
   {
     "cli": { "version": ">= 5.0.0" },
     "build": {
       "preview": {
         "android": {
           "buildType": "apk",
           "gradleCommand": ":app:assembleRelease"
         },
         "distribution": "internal"
       },
       "production": {
         "android": {
           "buildType": "apk",
           "gradleCommand": ":app:assembleRelease"
         }
       }
     }
   }

   Para uso pessoal, perfil "preview" é suficiente. "production" se
   futuramente quiser publicar.

### Otimização Final

4. Verifique app.json:
   - "name": nome final do app que aparecerá no celular.
   - "slug": consistente (ex: "hypertropos").
   - "version": "1.0.0".
   - "android.versionCode": 1.
   - "android.package": "com.hypertropos.app" (mantém único).
   - "android.permissions": apenas as estritamente necessárias
     (notifications, vibrate, internet).
   - "android.icon": ícone definitivo do app (forneça PNG 1024×1024).
   - "android.adaptiveIcon": configurado.
   - "splash": configurado com bg-canvas como cor de fundo + logo.
   - "scheme": "hypertropos" para deep links.

5. Otimização de assets:
   - Comprima imagens em assets/ (use TinyPNG ou similar).
   - Otimize Lottie .json (remova frames desnecessários).
   - Confirme que arquivos de som estão em formato compacto (mp3 ou
     ogg).
   - Total estimado do APK alvo: <100MB. Se passar de 150MB, identifique
     o que pesa.

6. Configurações de produção:
   - Em metro.config.js, ative minify e tree shaking.
   - Remova console.log via babel-plugin-transform-remove-console em
     produção (não desenvolvimento).
   - Configure SourceMap não publicado (privacidade).

### Credenciais

7. EAS gera automaticamente keystore Android. Confirme criação:
   eas credentials

   Salve a chave em local seguro (cofre de senhas, etc). Sem a chave
   você não pode atualizar o app no mesmo "identity" no futuro.

### Build

8. Rode build:
   eas build --platform android --profile preview

   Vai demorar 10-25 minutos. Acompanhe no terminal e no dashboard
   Expo.

9. Ao fim, o EAS te dá link de download do .apk. Baixe.

### Instalação no Galaxy S23

10. Transfira o .apk para o Galaxy S23:
    - Via USB cabo + Files do Windows
    - Ou via link direto da EAS pelo navegador do celular
    - Ou via Google Drive

11. No Galaxy S23, permita instalação de fontes desconhecidas:
    Settings → Apps → Special access → Install unknown apps → [seu
    navegador] → Allow.

12. Toque no .apk e instale.

13. Abra o app. Deve abrir direto na Home (perfil já configurado via
    Supabase — não precisa refazer onboarding).

### Migração de Dados

14. Se você foi usando o app via Expo Go com Supabase real (não fictício),
    os dados já estão no Supabase. O app standalone vai consumir os
    mesmos dados.

15. Confirme manualmente:
    - Abra Configurações > Sobre. Versão é "1.0.0".
    - Home mostra silhueta com o estado atual.
    - Histórico tem suas sessões.
    - Lembretes ativos (re-agendar via recriarLembretes() ao abrir
      pela primeira vez).

### Pós-Instalação

16. Desinstale o Expo Go do celular (ou mantenha se vai continuar
    desenvolvendo).

17. Configure o ícone do app na home screen do Galaxy S23 em destaque
    confortável.

18. Use o app por 1 semana e veja se algum bug aparece exclusivamente
    no build de produção (alguns problemas só aparecem fora do Expo
    Go).

19. Se aparecer bug crítico:
    - Corrige o código.
    - Faz `eas build` de novo (incremente android.versionCode em
      app.json para 2).
    - Reinstala o novo APK por cima do antigo (sobrescreve, mantém
      dados).

### Documentação Final

20. Crie README.md no repositório com:
    - O que o app é (1 parágrafo).
    - Stack técnico resumido.
    - Como rodar localmente (Expo Go).
    - Como gerar build de produção (EAS Build).
    - Sem detalhes sensíveis (chaves Supabase ficam em variáveis de
      ambiente).

21. Atualize o .env.example com placeholders das variáveis necessárias.

22. Commit final na main com mensagem:
    "release: v1.0.0 — app standalone, APK em produção"

CRITÉRIOS DE QUALIDADE

- APK assinado e funcional.
- <150MB.
- Inicialização <3s em produção.
- Sem erros de runtime na primeira semana de uso.

VALIDAÇÃO ESPERADA

- APK instalado no Galaxy S23.
- App abre, treina, registra dados.
- Notificações funcionando.
- Sons funcionando.
- Silhueta renderizando.

Comece pelo passo 1 (verificar EAS CLI) e me guie passo a passo. Vou
executar cada comando junto.
```

### Critérios de Validação Antes de Concluir o Projeto

Após a Fase 12, você está oficialmente concluindo o projeto. Confirme:

- APK Hypertropos v1.0.0 instalado no Galaxy S23.
- Aberto sem necessidade do Expo Go.
- Todos os fluxos funcionais: onboarding (caso reinstale), home com silhueta, geração de rotina, execução de treino, progresso, ciência, nutrição, configurações.
- Notificações locais funcionando para os lembretes configurados.
- Sons funcionando.
- Performance em produção comparável ou melhor que em desenvolvimento.
- Dados persistindo no Supabase.
- 1 semana de uso real sem bugs críticos.

### Notas e Armadilhas Comuns

A armadilha mais comum no build EAS é incompatibilidade entre versões de dependências e a versão atual do Expo SDK que o EAS usa. Se o build falhar, leia o log com cuidado — geralmente diz qual dependência está incompatível. Use `npx expo install --fix` para forçar versões compatíveis.

Segunda armadilha: tamanho do APK. Se passa de 200MB, algo está errado. Geralmente é uma imagem ou Lottie não otimizado. Use `npx expo doctor` para diagnóstico.

Terceira armadilha: permissões Android. Se o APK pede permissões inesperadas (ex: localização, contatos), revise `app.json` e remova as desnecessárias. Para um app de uso pessoal de treino, basta `INTERNET`, `VIBRATE`, e `POST_NOTIFICATIONS`.

Quarta armadilha: keystore perdido. Se você gerar um APK com keystore X e depois perder o keystore, nunca mais conseguirá atualizar o app no mesmo identity. Salve o keystore em pelo menos 2 lugares seguros (cofre de senhas + drive criptografado).

Quinta armadilha: depender do Expo Go indefinidamente. Em algum momento o Expo Go pode atualizar e quebrar compatibilidade com sua versão de SDK. Ter o APK standalone te livra dessa dependência.

---

## Epílogo: Depois do Projeto

Você completou o projeto. O app está no celular, você treina com ele todo dia, ele evolui visualmente, te lembra de tomar creatina, te explica por que cada exercício funciona, e te impede de fazer pistol squat porque conhece sua predisposição articular. Não tem outro app assim no mundo — só o seu.

Algumas considerações sobre o ciclo de vida pós-V1:

**Manutenção contínua.** Conforme as versões do Android, Expo SDK, Supabase e bibliotecas evoluem, o app vai precisar de atualizações ocasionais. Reserve uma manhã de manutenção a cada 2-3 meses para atualizar dependências, gerar novo APK, e instalar por cima. O EAS Build simplifica isso enormemente.

**V2 hipotética.** Se em algum momento você quiser uma V2, possíveis adições incluiriam: integração nativa com Spotify (controle de música pelo próprio app durante treino), camada de Apple Health ou Samsung Health (sincronizar peso corporal automaticamente), reconhecimento de voz para registrar séries sem tocar na tela (especialmente útil com mãos suadas), wearable integration (Galaxy Watch que mostra timer de descanso direto no pulso), exportação de relatórios mensais em PDF, e modo "viajante" (rotinas com 0 equipamento para hotel). Tudo isso fica para V2 — não polua a V1.

**Calibragem fina.** Após 4-8 semanas de uso, certas calibragens podem precisar de ajuste: velocidade de progressão entre tiers da estátua, sensibilidade do decaimento de definição muscular, faixas de XP por nível, descansos automáticos. Tudo isso são números em arquivos do código — você ajusta, faz `eas build`, instala novo APK.

**Backup.** Faça backup periódico do banco Supabase. O dashboard tem opção de export. Salve em drive seguro.

**Documentação pessoal.** Considere manter um arquivo `CHANGELOG.md` no repositório registrando o que mudou em cada versão. Daqui a 1 ano você não vai lembrar por que a calibragem do XP é assim — o changelog ajuda.

**O essencial.** O essencial é que você passe a treinar de fato, consistentemente, sem lesões nas suas áreas de predisposição, com motivação dopaminérgica sustentável, com base científica real, e com alimentação adequada. Tudo isso é o produto. O código é o meio.

Bom treino.

**Fim do Bloco 3.**

**Fim do Guia de Implementação Fase a Fase.**

**Fim da entrega do projeto Hypertropos.**
