# PRD — Aplicativo de Hipertrofia em Casa com Peso Corporal

**Versão:** 3.0 (uso pessoal)
**Data:** Maio de 2026
**Autor:** [Você]
**Codinome do projeto:** a definir (sugestões ao final)

**Histórico de revisões:**
- V1.0: primeira versão com três pilares norteadores e escopo inicial.
- V2.0: adicionou o pilar de Nutrição Inteligente, a silhueta corporal estilo estátua clássica como elemento visual integrador do sistema dopaminérgico, a arquitetura Supabase com offline-first sync, a política de áudio externa com design sonoro próprio, o card interativo de restrições articulares via silhueta corporal, e a pergunta de histórico clínico no onboarding expandido.
- V3.0 (esta): adiciona a **Direção Visual, Tipografia e Anti-Defaults** como seção dedicada (paleta de cores em tokens semânticos, sistema tipográfico com duas famílias de fonte, princípios de design, referências visuais nomeadas, especificações de microinteração, e cláusula explícita de anti-defaults); adiciona seções sobre voz e tom do produto, política de estados (loading/erro/vazio), estratégia de mídia para exercícios, estrutura de pastas e convenções de código, e estratégia de migrations.

---

## 1. Visão e Problema

Este aplicativo nasce de uma constatação prática: o usuário não encontrou no mercado um app que combinasse simultaneamente quatro características essenciais. Os apps disponíveis até atendem uma ou outra dessas características, mas nunca as quatro juntas, o que torna nenhum deles plenamente adequado.

A primeira característica é o **rigor científico real**, com cada recomendação de exercício, volume, descanso, cadência e nutriente ancorada em meta-análises e estudos primários publicados em periódicos como *Journal of Strength and Conditioning Research*, *Sports Medicine*, *British Journal of Sports Medicine*, *Medicine & Science in Sports & Exercise* e *European Journal of Sport Science*. A maioria dos apps de treino vende programas com linguagem motivacional vazia, sem citar fontes, ou pior, baseados em práticas desatualizadas (intervalos de 30-60 segundos para hipertrofia, alta repetição como única progressão, falha total obrigatória em todas as séries, BCAAs como suplemento essencial, janela anabólica de 30 minutos).

A segunda é uma **interface intencionalmente dopaminérgica e adaptada para TDAH**. O usuário tem TDAH diagnosticado e historicamente tem dificuldade de aderir a rotinas de treino quando o feedback de progresso é fraco, distante ou abstrato. A maioria dos apps mostra "tabela" e "histórico de séries", o que é informativo mas não estimulante. Este app precisa transformar cada série em micro-evento de celebração, cada treino em conquista visível, e cada semana em progresso narrável e literalmente desenhado — sem cair na infantilização que afastaria um usuário adulto e bem-informado.

A terceira é a **adaptação a restrições articulares**. O usuário tem predisposição genética a problemas em joelhos, quadril e tendão de Aquiles, e qualquer rotina de treino que ignore essas restrições é, na melhor das hipóteses, inútil, e na pior das hipóteses, lesiva. Os apps de mercado, quando muito, oferecem "modo iniciante" como filtro grosseiro, mas não permitem dizer "evite carga compressiva alta no joelho" e ver isso refletir automaticamente na seleção de exercícios.

A quarta é a **integração de nutrição inteligente** como parte do mesmo ecossistema. Não como um app de contagem de calorias separado, mas como uma camada prática de educação aplicada: calculadora dinâmica de meta diária de proteína baseada no peso corporal e fase nutricional, fichas científicas de cada suplemento com evidência forte (creatina, cafeína, whey), e lembretes opcionais de ingestão programados em horários sensatos.

A intersecção dessas quatro características é uma janela de mercado pequena e mal servida — e como o app é, por enquanto, de uso pessoal, esse fato é uma vantagem, não um problema: o produto pode ser construído exatamente para um usuário, sem o filtro de "outras pessoas também precisam disso?".

---

## 2. Persona Única

Como o app é para uso pessoal, há um único usuário-alvo, e o PRD assume-o como referência ao longo do documento.

**Perfil:** homem adulto, com TDAH diagnosticado, em retorno ao treino após mais de um ano sem atividade regular. Treina exclusivamente em casa, sem barras, halteres ou implementos de puxada. Possui Samsung Galaxy S23 (Android 14+).

**Motivação principal:** ganhar massa muscular (hipertrofia) com a maior eficácia cientificamente possível dentro das restrições de equipamento. Não busca habilidades motoras de calistenia — busca volume muscular. Em alinhamento com a frase do quarto arquivo de pesquisa: "o músculo esquelético é cego — ele responde a tensão mecânica e proximidade da falha, não ao instrumento".

**Restrições físicas:** predisposição genética a problemas em joelhos, quadril e tendão de Aquiles. Exercícios de alto cisalhamento patelofemoral, alta carga de impacto ou exigência extrema de mobilidade articular devem ser evitados ou substituídos por padrão.

**Restrições cognitivas:** TDAH. Decisões prolongadas, telas densas de informação, sequências longas sem feedback intermediário e ausência de recompensa imediata diminuem a adesão. O app precisa minimizar atrito cognitivo a todo momento.

**Conhecimento prévio:** experiência anterior em treino tradicional, mas o app pressupõe leitura recente da literatura científica compilada pelo usuário, então pode ser tecnicamente preciso sem precisar definir conceitos básicos como RIR, tensão mecânica, mTORC1 ou hipertrofia mediada por alongamento.

**Stack técnica conhecida:** já construiu duas plataformas usando Lovable + Antigravity + Codex, incluindo uma plataforma jurídica complexa. Conta ativa no Supabase e GitHub. Sem programação tradicional, mas familiarizado com ciclo de vibe coding e leitura básica de erros.

---

## 3. Os Quatro Pilares Norteadores do Produto

Toda decisão de design do app deve ser checada contra estes quatro pilares. Se uma feature não serve a pelo menos um deles, ela é desnecessária; se uma feature serve um pilar mas prejudica outro, é preciso encontrar uma alternativa.

### 3.1. Pilar Científico

Cada recomendação dada pelo app — qual exercício fazer, quantas séries, quantas repetições, quanto descansar, qual cadência, quando progredir, quanto de proteína, quanto de creatina — tem origem rastreável na literatura compilada. Cada exercício do catálogo carrega uma "ficha científica" acessível em um toque. O app nunca inventa, nunca exagera, e quando há limitação real do método é transparente. Autores e meta-análises de referência: Schoenfeld, Phillips, Krieger, Grgic, Refalo, Morton, Kreider, Calatayud, Kotarsky, Kikuchi, Pedrosa, Maeo, Baz-Valle, Israetel, Helms, Wackerhage.

### 3.2. Pilar Dopaminérgico / TDAH-Friendly

O app é construído como uma sequência de micro-recompensas, com feedback constante e variável, telas limpas com uma única ação principal por momento, e celebrações visuais e hápticas projetadas para parecer naturais e não infantis. O elemento integrador é uma **silhueta corporal estilo estátua clássica grega** que ganha definição muscular progressivamente, descrita na Seção 8. A regra: o usuário sempre sabe o que fazer agora, e cada coisa que ele faz é reconhecida pelo sistema em até 200ms.

### 3.3. Pilar Adaptativo

O perfil do usuário inclui restrições articulares, predisposições clínicas e preferências que filtram o catálogo de exercícios em tempo real. A coleta é feita via card interativo de silhueta corporal tocável (Seção 9), não via lista de checkboxes. Quando há substituição automática, há ícone visível e explicação acessível do porquê.

### 3.4. Pilar Nutrição Inteligente

Camada operacional do mesmo ecossistema, alimentada pelos arquivos de pesquisa e pelas posições oficiais da ISSN. Entrega três utilidades: calculadora dinâmica de meta diária de proteína; catálogo de fichas científicas de suplementos com classificação de evidência; sistema opcional de lembretes diários. Não inclui contagem de calorias, registro alimentar detalhado ou plano de refeições.

---

## 4. Objetivos do Produto

O app, ao ser usado consistentemente durante 8 a 12 semanas, deve permitir que o usuário treine com confiança científica, mantenha aderência mesmo em semanas de baixa motivação intrínseca (graças ao sistema dopaminérgico ancorado na silhueta evolutiva), evite lesões nas áreas de predisposição (joelho, quadril, Aquiles) através da adaptação automática, veja progresso mensurável e literalmente desenhado, receba orientação nutricional prática diária sem consultar planilhas externas, e aprenda no processo internalizando princípios científicos por exposição repetida.

---

## 5. Escopo (Versão 1.0 — Uso Pessoal)

### 5.1. Funcionalidades dentro do escopo

A versão 1.0 entrega um app completo para um único usuário rodando em Android, com Supabase como banco de dados na nuvem, GitHub privado como controle de versão do código, e arquitetura offline-first para funcionar perfeitamente mesmo sem internet durante um treino. Em linhas gerais cobre:

**Onboarding inicial expandido** que coleta uma única vez todas as informações necessárias para personalização real, dividido em 12-14 microtelas com pergunta única por tela. Conjunto de coleta: idade, gênero biológico (com opção de não declarar), peso corporal em kg, altura em cm, nível atual de treino (iniciante / intermediário-retornando / intermediário / avançado), nível de atividade física fora do treino, dias disponíveis para treino na semana (3, 4 ou 6), duração desejada por sessão, horário preferido de treino, equipamento doméstico disponível (multi-seleção), card interativo de restrições articulares via silhueta corporal tocável (Seção 9), pergunta opcional sobre histórico clínico e predisposições, e tela animada final de "gerando sua rotina". Tempo de preenchimento alvo abaixo de 120 segundos. Todos os campos editáveis depois em Configurações.

**Geração de rotina semanal** baseada no perfil completo, com algoritmo que escolhe split apropriado (Full Body 3x para iniciantes/retornando, Upper/Lower 4x para intermediário, Push/Pull/Legs 6x para avançado), distribui padrões de movimento respeitando frequência mínima de 2x por semana por grupo, e seleciona exercícios filtrando por nível, equipamento e restrições.

**Tela de execução de treino** guiando série a série, demonstração visual do exercício, timer de descanso obrigatório com feedback ao terminar, sugestão de cadência, alvo de RIR, e botão grande de "concluí esta série" com micro-celebração.

**Catálogo de exercícios completo** com todos os campos do modelo de dados preenchidos, estruturado em escada de 5 níveis por padrão de movimento.

**Sistema de progressão por escada de variações** que sugere próxima variação quando o usuário consegue completar todas as séries em RIR 1-2 com mais que o teto da faixa de repetições.

**Registro de treino concluído** gravado localmente em cache e sincronizado com Supabase em background.

**Sistema dopaminérgico integrado com silhueta corporal evolutiva** projetado para TDAH. Detalhado na Seção 8.

**Sistema de adaptação a lesões/restrições** operando em background a partir do perfil construído no onboarding. Detalhado na Seção 9.

**Camada de conteúdo científico em três níveis** (frase inline, painel científico do exercício, seção Ciência com biblioteca de artigos).

**Camada de Nutrição Inteligente** completa. Detalhada na Seção 11.

**Tela de progresso** com silhueta corporal em destaque, gráfico de volume semanal por grupo, sequência atual e recorde, conquistas, linha do tempo de progressão.

**Configurações** com refazer onboarding, edição granular de cada item do perfil, preferências de feedback, gestão de lembretes nutricionais, exportar dados em JSON.

### 5.2. Funcionalidades fora do escopo da V1

Autenticação multi-usuário; comunidade ou compartilhamento social; IA conversacional dentro do app; integração com Google Fit, Samsung Health, Apple Health; notificações push complexas (apenas locais); compras in-app, planos pagos ou anúncios; suporte a múltiplos perfis no mesmo dispositivo; publicação na Google Play Store (instalação direta via APK); suporte a tablets; tradução para outros idiomas; integração nativa com Spotify; contagem de calorias ou plano de refeições; integração com balança inteligente ou wearables.

---

## 6. Modelo de Dados

O modelo de dados é o coração técnico do app. Abaixo, as entidades principais.

### 6.1. Exercício

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | Identificador único |
| nome | string | Nome em PT-BR |
| nome_alternativo | string | Nome em inglês para referência |
| grupo_muscular_primario | enum | peito / costas / ombros / triceps / biceps / quadriceps / posterior / gluteo / panturrilha / core |
| grupos_secundarios | array de enum | |
| padrao_movimento | enum | push_horizontal / push_vertical / pull_horizontal / pull_vertical / joelho_dominante / quadril_dominante / core / panturrilha |
| nivel_minimo | enum | iniciante / intermediario / avancado |
| nivel_escada | number | 1 a 5, posição na escada de progressão |
| equipamento_necessario | array | nenhum / mesa / cadeira / parede / piso_liso / toalha / livro |
| grf_percentual | number ou null | % do peso corporal trabalhado |
| articulacoes_estressadas | array | joelho / quadril / aquiles / ombro / cotovelo / lombar / cervical |
| nivel_estresse_por_articulacao | objeto | mapeamento de articulação → baixo/medio/alto |
| descricao_execucao | texto longo | passo a passo |
| dicas_tecnicas | array de strings | |
| erros_comuns | array de strings | |
| midia_url | string | caminho local ou URL |
| frase_cientifica_curta | string | 1-2 frases |
| referencias | array de IDs | |
| variacao_anterior | string ou null | |
| variacao_proxima | string ou null | |
| substitutos_mesmo_padrao | array de IDs | |
| faixa_reps_recomendada | objeto | min e max |
| cadencia_recomendada | objeto | excentrica, isometrica, concentrica em segundos |
| descanso_recomendado_seg | number | |
| contraindicacoes | array | restrições para as quais o exercício não deve ser sugerido |

### 6.2. Referência Científica

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | |
| autores | string | Ex: "Schoenfeld, Ogborn & Krieger" |
| ano | number | |
| titulo | string | |
| periodico | string | |
| url | string | Link para PubMed/DOI |
| sintese_acessivel | texto | Explicação em linguagem clara |
| tags | array | volume, falha, frequencia, descanso, etc. |

### 6.3. Perfil do Usuário

| Campo | Tipo | Descrição |
|---|---|---|
| idade | number | |
| genero_biologico | enum | masculino / feminino / nao_declarado |
| peso_corporal_kg | number | Mantém histórico |
| altura_cm | number | |
| nivel | enum | iniciante / intermediario_retornando / intermediario / avancado |
| nivel_atividade_extra_treino | enum | sedentario / leve / moderado / muito_ativo |
| dias_disponiveis_semana | number | 3, 4 ou 6 |
| duracao_alvo_sessao_min | number | 30, 45, 60, 75 |
| horario_preferido_treino | enum | manha / tarde / noite |
| equipamento_disponivel | array | |
| split_atual | enum | full_body / upper_lower / push_pull_legs |
| objetivo | enum | hipertrofia |
| restricoes_articulares | array de objetos | {articulacao, nivel_severidade} |
| historico_clinico | array de strings | predisposicoes e condições |
| meta_proteina_g_kg | number | Calculada automaticamente |
| fase_nutricional | enum | manutencao / hipertrofia / deficit |
| usa_creatina | boolean | |
| usa_cafeina | boolean | |
| lembretes_ativos | objeto | |
| data_criacao | timestamp | |
| ultima_atualizacao | timestamp | |

### 6.4. Demais Entidades

As entidades restantes (Histórico de Peso Corporal, Programa Ativo, Sessão Template, Exercício Prescrito, Registro de Execução, Série Executada, Sistema de Gamificação, Conquista, Estado da Silhueta Corporal, Suplemento, Lembrete) seguem a estrutura descrita em detalhe na V2 do PRD, com os mesmos campos e tipos. Em particular, o Estado da Silhueta Corporal mantém os nove níveis de definição por região muscular (peito, costas, ombros, braços, quadríceps, posterior, glúteo, panturrilha, core) parametrizados de 0 a 100, e o tier global (bronze, pedra, mármore, dourada).

---

## 7. Telas e Fluxos Principais

### 7.1. Primeira abertura (Onboarding)

Sequência de 12-14 microtelas com uma pergunta única por tela, barra de progresso visível no topo, opções visuais grandes e tocáveis, feedback haptic a cada interação. A tela de histórico clínico tem três opções de profundidade (pular, marcar predisposições conhecidas, adicionar nota detalhada). A última tela antes da geração da rotina é uma animação de "preparando seu plano" de 2-3 segundos para criar sensação de processamento real.

### 7.2. Tela inicial (Home) com Silhueta

Hierarquia visual em ordem de prioridade: silhueta corporal evolutiva em destaque grande (~40% da altura útil); card de treino de hoje; streak atual com chama crescente; barra de XP rumo ao próximo nível. Rodapé com navegação para Catálogo, Progresso, Ciência, Nutrição e Configurações. Se há treino agendado e ainda não foi feito, card pulsa sutilmente.

### 7.3. Tela de Sessão Pré-Treino

Lista de exercícios da sessão com tempo estimado, dois botões principais ("Começar Agora" e "Sessão Express de 15 min") e um secundário ("Adiar para Amanhã" — oferece automaticamente uso de freeze se disponível).

### 7.4. Tela de Execução

Poucos elementos, alta hierarquia visual, botões grandes, tela que não dorme, frase científica curta visível, botão gigante "Concluí Série" que dispara animação + som + haptic. Ao final da sessão, na tela de celebração, a silhueta corporal exibe uma microanimação de "definição se manifestando" no grupo muscular trabalhado.

### 7.5. Catálogo de Exercícios

Filtros no topo, lista vertical de cards com thumbnail, nome, grupo muscular, badges de articulações. Tocar abre detalhamento completo: visual + descrição → dicas e erros → escada de progressão → "por que funciona" expandido → referências científicas → exercícios substitutos.

### 7.6. Tela de Progresso

Cinco abas internas: Silhueta (visualização ampliada da estátua com regiões tocáveis), Volume Semanal (gráfico de barras com séries efetivas), Streaks e Conquistas, Linha do Tempo, Histórico.

### 7.7. Seção Ciência

Catálogo de artigos próprios organizados por tópico (Princípios Fundamentais, Volume e Frequência, Falha e RIR, Descanso, ROM e Cadência, Progressão sem Peso, Recuperação e Sono, Proteína para Hipertrofia, Creatina, Cafeína, Suplementos Sem Evidência, Mitos Refutados). Ordenação levemente personalizada pelo perfil.

### 7.8. Seção Nutrição

Três cards principais: Calculadora de Proteína em destaque com fórmula visível, distribuição em refeições sugerida; Catálogo de Suplementos com sete fichas tocáveis; Configuração de Lembretes opcionais.

### 7.9. Configurações

Editar perfil completo (incluindo card de restrições editável e histórico clínico), preferências de feedback (som on/off, haptic on/off, tema), gestão de lembretes nutricionais, exportar backup em JSON, sobre o app.

---

## 8. Sistema Dopaminérgico Detalhado — A Silhueta Como Centro Visual

### 8.1. A Silhueta Corporal Evolutiva

Renderizada como figura masculina em pose contrapposto inspirada na estatuária grega clássica (entre o Doríforo de Policleto e o David de Michelangelo, mas estilizada e moderna, não literal). Sem feições faciais explícitas (silhueta neutra). Nove regiões musculares parametrizadas independentemente: peito, costas, ombros, braços (bíceps + tríceps), quadríceps, posterior de coxa, glúteo, panturrilha, core. Cada região tem nível de definição de 0 a 100 refletindo treino dos últimos 28 dias com decaimento temporal (volume antigo decai gradualmente após 14 dias sem estímulo, simulando destreino biológico real).

Visualmente, o nível de definição se manifesta como detalhamento progressivo da musculatura: nível 0 lisa, níveis médios com contornos visíveis, níveis altos com separação muscular detalhada. Transições suaves e contínuas. Estética sóbria, técnica, anatômica — não cartum, não hipersexualizada.

### 8.2. Os Quatro Tiers da Estátua

- **Bronze:** estado inicial, primeiras semanas. Aparência de bronze polido escuro.
- **Pedra:** desbloqueado após ~4 semanas de uso consistente. Textura de pedra cinza-clara escultural.
- **Mármore:** desbloqueado após ~12 semanas. Textura de mármore branco translúcido com veios sutis.
- **Dourada:** desbloqueado após ~26 semanas. Reflexos dourados nos contornos. Estado de mestria visual.

Transição de tier é evento dopaminérgico significativo com tela dedicada de celebração. Tiers são cumulativos.

### 8.3. XP, Streak e Conquistas

XP em segundo plano, exibido como barra fina abaixo da estátua. Concedido por: completar série (10 XP base), atingir RIR alvo (+5 XP), completar sessão (+50 XP), manter streak (+10 XP/dia consecutivo, máximo +50/dia). Níveis seguem curva logarítmica.

Streak conta dias consecutivos com treino. Freeze semanal (acumulando até 2) protege contra quebra por imprevisto. Visualmente representado por chama abaixo da estátua que cresce em intensidade.

Conquistas em dois tipos: óbvias (marcos esperados) e surpresa (recompensa variável). Catálogo inicial de 40-50 conquistas. Cada desbloqueio gera tela dedicada com card revelado em animação, som específico, e ícone único.

### 8.4. Feedback Multi-Sensorial e Sessão Express

Toda ação relevante gera feedback em pelo menos duas modalidades (visual + som/haptic). Sessão Express oferece versão condensada de 10-15 minutos para dias muito ruins de TDAH, protegendo o streak. Conta para streak mas dá menos XP e define menos a silhueta — sistema honesto sobre isso, sem penalizar mas sem premiar igualmente.

---

## 9. Sistema de Adaptação a Lesões/Restrições

### 9.1. O Card Interativo de Restrições

Coleta no onboarding usa silhueta corporal tocável com toggle frontal/traseiro. Usuário toca em cada região com restrição, abrindo sub-card com três opções de severidade: "Apenas predisposição/cuidado" (filtra alto), "Tive dor recente" (filtra alto e médio), "Em recuperação de lesão" (substitui completamente por alternativas). Regiões disponíveis: joelho E/D, quadril, ombro E/D, cotovelo E/D, lombar, cervical, tendão de Aquiles E/D.

### 9.2. Filtros Aplicados ao Algoritmo

Primeiro filtra exercícios cujo nível de estresse em qualquer articulação restrita excede o tolerado. Depois prefere baixo sobre médio quando há empate em utilidade hipertrófica. Para cada padrão de movimento sempre existe pelo menos uma opção elegível. Quando exercício é selecionado por adaptação, ícone "🛡️" aparece com explicação acessível.

### 9.3. Aplicação ao Perfil do Usuário

Joelho (predisposição): pistol squat e shrimp squat descartados; Bulgarian Split Squat torna-se principal exercício de joelho-dominante; sissy squat descartado; agachamentos profundos com calcanhar elevado permitidos com cautela.

Quadril (predisposição): exercícios com flexão extrema sob carga descartados; reverse lunge preferido sobre forward lunge; single-leg RDL com amplitude moderada.

Aquiles (predisposição): exercícios com salto ou impacto descartados; panturrilha com amplitude grande em déficit permitida mas progride lentamente com controle excêntrico forte.

### 9.4. Integração com Histórico Clínico

Histórico clínico adiciona camada além das restrições articulares: ativa alertas sutis em exercícios relevantes, promove artigos relacionados na seção Ciência, ajusta progressão de variação para ser mais conservadora naquele padrão.

---

## 10. Sistema de Conteúdo Científico

Mantém os três níveis de profundidade: frase inline no exercício, painel científico do exercício com 2-3 parágrafos + referência + link, e seção Ciência com biblioteca de artigos próprios (15-20 iniciais). Seção Ciência personaliza levemente a ordem de exibição com base no perfil — histórico clínico, restrições, suplementos usados influenciam quais artigos aparecem mais alto.

---

## 11. Sistema de Nutrição Inteligente

### 11.1. Calculadora Dinâmica de Proteína

Meta diária calculada a partir de peso corporal e fase nutricional, baseada em Morton et al. (2018). Faixas: manutenção 1,6 g/kg/dia; hipertrofia 1,8 g/kg/dia; déficit calórico 2,2 g/kg/dia. Fórmula visível, ajustável manualmente (1,4 a 2,5 g/kg). Recalculo automático quando peso muda. Sugestão de distribuição em 4-5 refeições (0,3-0,4 g/kg cada conforme Schoenfeld & Aragon 2018).

### 11.2. Catálogo de Suplementos

Sete fichas iniciais. Creatina Monohidratada (Grau A): 3-5 g/dia. Whey/Caseína/Vegetal (Grau A): ferramenta de conveniência para meta diária. Cafeína (Grau A para desempenho agudo): 3-6 mg/kg, 30-60 min pré-treino. Beta-alanina (Grau B): 3,2-6,4 g/dia. Citrulina Malato (Grau B): 6-8 g pré-treino. Vitamina D (Grau B condicional): só em caso de deficiência sérica. Ômega-3 EPA/DHA (Grau B): 2-3 g/dia. Mais ficha "Suplementos SEM Evidência Forte" cobrindo BCAAs isolados, Glutamina, Testosterona boosters, HMB para treinados, Pré-treinos blends proprietários.

### 11.3. Sistema de Lembretes Opcionais

Três tipos: lembrete de creatina (notificação diária no horário escolhido), lembretes de refeições proteicas (3-5 notificações no dia com alvo em gramas), lembrete de hora do treino (no horário preferido nos dias agendados). Todos são notificações locais, snoozable, com som suave e haptic discreto, ativáveis individualmente em Configurações.

---

## 12. Arquitetura de Dados: Supabase + Offline-First

### 12.1. Princípio Norteador

Usuário precisa treinar sem internet. Arquitetura escolhida: offline-first com sync transparente em background.

### 12.2. Camadas

**Camada 1 — Cache Local:** AsyncStorage para preferências leves; expo-sqlite para catálogo de exercícios (estático), referências científicas, suplementos. Catálogo cabe inteiro no dispositivo, sem latência de rede durante o treino.

**Camada 2 — Estado Reativo:** Zustand para state management em memória, hidratado do cache no startup. Toda escrita do usuário passa primeiro pelo Zustand (instantâneo), depois pelo cache local, finalmente entra na fila de sync.

**Camada 3 — Supabase Como Fonte de Verdade:** PostgreSQL no Supabase armazena dados de longo prazo. App busca dados antigos sob demanda quando necessário.

### 12.3. Estratégia de Sincronização

Escritas locais imediatas + fila de sync persistente com backoff exponencial. No startup, reconciliação rápida com Supabase. Conflitos resolvidos por timestamp mais recente.

### 12.4. Autenticação Simplificada

Sem login. Chave de API única configurada no app no build. Row Level Security do Supabase configurada para permitir acesso amplo a essa chave.

### 12.5. Estrutura de Tabelas no Supabase

Schema detalhado nos arquivos `supabase/migrations` do repositório. Nomes em snake_case, relações por foreign keys. Tabelas principais: `exercicios`, `referencias_cientificas`, `perfil_usuario`, `historico_peso_corporal`, `programa_ativo`, `sessoes_template`, `exercicios_prescritos`, `registros_execucao`, `series_executadas`, `gamificacao`, `conquistas`, `estado_silhueta`, `suplementos`, `lembretes`.

---

## 13. Política de Áudio e Design Sonoro

### 13.1. Princípio Norteador

O app não toca música. O app não compete com música. O app produz design sonoro funcional próprio que coexiste com qualquer fonte externa.

### 13.2. Atalho para Música Externa

Botão "🎵 Música" na tela de pré-treino abre app de música preferido via Android Intent. Configurável em Settings (Spotify, YouTube Music, Apple Music, Deezer, Amazon Music, Tidal).

### 13.3. Design Sonoro Próprio

Sons curtos de 100-500ms, frequência audível, timbres distintos entre si. Eventos: conclusão de série (clique curto agudo satisfatório), fim de descanso (ding suave subindo), conclusão de exercício (acorde curto positivo), conclusão de sessão (jingle curto de vitória ~1s), desbloqueio de conquista (som mais elaborado ~1,5s, estilo tigela tibetana), erro ou cancelamento (som curto neutro não punitivo). Todos desativáveis em Configurações.

---

## 14. Direção Visual, Tipografia e Anti-Defaults

Esta seção é nova na V3 e é uma das mais importantes para a identidade do produto. Sem direção visual explícita, qualquer agente de IA — incluindo Antigravity e Codex — produzirá o que se pode chamar de "app padrão SaaS 2024": fundo branco, paleta azul-índigo, botões com border-radius de 8-12px, tipografia Inter sem-serifa, sombras suaves Material Design. Essa estética é estatisticamente dominante nos datasets de treinamento de IA e portanto é a saída natural quando há ambiguidade. Para um app cuja identidade central é a estatuária clássica, a sobriedade científica e o equilíbrio entre escultural e dopaminérgico, o default genérico seria desastroso. Esta seção é, portanto, o conjunto de instruções deliberadas que evitam essa armadilha.

### 14.1. Filosofia Estética Central

O app deve evocar a sensação de um **museu noturno bem iluminado**, não de uma academia comercial. A inspiração estética cruza três universos: a sobriedade material da estatuária greco-romana (bronze envelhecido, pedra, mármore, dourado fosco), o rigor tipográfico de publicações acadêmicas modernas (*The Atlantic*, *MIT Technology Review*), e a precisão minimalista de software de produtividade premium (*Linear*, *Things 3*, *Reeder*). O resultado deve parecer um produto adulto, técnico, deliberado — sem cair em frieza institucional, porque o pilar dopaminérgico exige momentos de calor e celebração que devem brilhar exatamente porque o restante da interface é sóbrio.

### 14.2. Paleta de Cores em Tokens Semânticos

A paleta é definida em **tokens semânticos** com nomes que descrevem função, não cor literal. Isso permite ajustes globais futuros sem refatoração ampla, e força o agente de IA a usar tokens em vez de valores hexadecimais soltos no código. Cada token tem valores específicos para modo escuro (padrão) e modo claro.

**Modo Escuro (padrão, ideal para uso noturno e durante treino):**

| Token | Hex | Função |
|---|---|---|
| `bg-canvas` | #1A1715 | Fundo principal de telas (preto com matiz quente, não puro) |
| `bg-elevated` | #252220 | Cards, painéis, um nível de profundidade acima do canvas |
| `bg-overlay` | #2F2B28 | Modais, sheets, dialogs |
| `bg-highlight` | #3D3733 | Estados de hover, seleção sutil |
| `fg-primary` | #F2EAE0 | Texto principal, ícones em destaque (off-white quente) |
| `fg-secondary` | #B8AB9B | Texto secundário, labels (cinza-pedra claro) |
| `fg-muted` | #6E6457 | Texto auxiliar, captions, dicas (cinza-pedra escuro) |
| `fg-inverse` | #1A1715 | Texto em superfícies claras (ex: sobre botões dourados) |
| `accent-bronze` | #C19A6B | Cor de marca primária, ações principais, destaque institucional |
| `accent-marble` | #E8DED1 | Tier mármore da estátua, momentos premium |
| `accent-gold` | #D4AF7A | Tier dourado da estátua, conquistas de alto nível |
| `feedback-success` | #7FB069 | Único acento de cor viva, usado raramente para confirmação positiva (verde-tensão) |
| `feedback-warning` | #D4A574 | Avisos suaves, atenção (âmbar) |
| `feedback-error` | #C66D5A | Erros, contraindicações (terra/ferrugem, não vermelho puro) |
| `border-subtle` | #3D3733 | Bordas finas, divisores principais |
| `border-strong` | #5A4F44 | Bordas para destaque de elementos selecionados |
| `divider` | #2A2622 | Linhas divisórias muito sutis |

**Modo Claro (alternativo, ideal para uso diurno em ambientes claros):**

| Token | Hex | Função |
|---|---|---|
| `bg-canvas` | #F5F0E8 | Off-white com matiz mármore, não branco puro |
| `bg-elevated` | #FAF5ED | Superfícies elevadas |
| `bg-overlay` | #FFFFFF | Modais e sheets (único uso de branco puro) |
| `bg-highlight` | #EBE3D5 | Hover, seleção sutil |
| `fg-primary` | #2A2520 | Texto principal (quase preto, com matiz quente) |
| `fg-secondary` | #5C5247 | Texto secundário |
| `fg-muted` | #8C8073 | Texto auxiliar |
| `fg-inverse` | #FAF5ED | Texto sobre superfícies escuras |
| `accent-bronze` | #8B6F47 | Versão mais escura do bronze para garantir contraste |
| `accent-marble` | #B8AB9B | |
| `accent-gold` | #B8935A | |
| `feedback-success` | #5A8B47 | |
| `feedback-warning` | #B8853D | |
| `feedback-error` | #A05543 | |
| `border-subtle` | #DDD3C2 | |
| `border-strong` | #B8AB9B | |
| `divider` | #E5DDD0 | |

O modo escuro é o padrão por dois motivos práticos: a maior parte dos treinos do usuário acontecerá em casa (não necessariamente em ambiente muito iluminado), e telas escuras durante exercícios são mais confortáveis e menos invasivas. O modo claro existe para uso fora do treino (consultar nutrição, ler artigos da seção Ciência, configurações). A escolha entre modos é manual ou automática conforme o sistema.

### 14.3. Sistema Tipográfico

A tipografia usa **duas famílias contrastantes deliberadamente**, criando hierarquia rica e personalidade distintiva.

**Família 1 — Display (títulos, nomes de exercícios, números grandes):** **Fraunces** (Google Fonts, open source). Serifada moderna com personalidade clássica e contemporânea, com pesos variáveis. Disponível em todas as plataformas. Em casos onde Fraunces não puder ser embarcada por algum motivo técnico, fallback aceitável é Newsreader ou Crimson Pro. Fraunces tem variações ópticas (`opsz`) que renderizam de forma sutilmente diferente em tamanhos pequenos e grandes — esse refinamento deve ser usado.

**Família 2 — Body (corpo de texto, UI elements, dados):** **Inter** (Google Fonts, open source). Sans-serif neutra de alta legibilidade, projetada especificamente para UI. Disponível em variant tabular para alinhamento perfeito de dígitos em timers e contadores. Inter é deliberadamente neutra para deixar Fraunces brilhar nos títulos.

**Hierarquia Tipográfica (valores em pixels para mobile):**

| Estilo | Família | Tamanho | Peso | Line Height | Uso |
|---|---|---|---|---|---|
| Display XL | Fraunces | 48px | 500 | 1.1 | Hero numbers (timer durante descanso) |
| Display L | Fraunces | 36px | 500 | 1.2 | Títulos de tela principais |
| H1 | Fraunces | 28px | 600 | 1.3 | Títulos de seção |
| H2 | Fraunces | 22px | 600 | 1.3 | Subtítulos |
| H3 | Inter | 18px | 600 | 1.4 | Títulos menores, nomes de exercícios na lista |
| Body L | Inter | 17px | 400 | 1.5 | Texto principal em artigos longos |
| Body | Inter | 15px | 400 | 1.5 | Texto padrão de UI |
| Body Bold | Inter | 15px | 600 | 1.5 | Ênfase em corpo |
| Caption | Inter | 13px | 400 | 1.4 | Legendas, metadata |
| Caption Bold | Inter | 13px | 600 | 1.4 | Labels |
| Numeric Hero | Inter (tabular) | 72px | 700 | 1.0 | Timer principal de descanso, peso corporal grande |
| Numeric M | Inter (tabular) | 32px | 600 | 1.0 | Contadores em destaque (séries, repetições) |

Caracteres especiais: timer principal de descanso usa Inter em variant tabular com tracking ligeiramente apertado (-0.02em) para parecer mais "mecânico". Nomes de exercícios em Fraunces capturam a sensação clássica/escultural.

### 14.4. Border-Radius

Valores deliberadamente não-defaults para evitar o "look genérico de 8-12px que está em todo app":

| Token | Valor | Uso |
|---|---|---|
| `radius-xs` | 4px | Chips, badges pequenos, tags |
| `radius-sm` | 10px | Botões pequenos, inputs |
| `radius-md` | 18px | Cards regulares (note que 18 evita o default 16) |
| `radius-lg` | 28px | Cards hero, áreas de destaque |
| `radius-xl` | 36px | Bottom sheets, drawers |
| `radius-full` | 9999px | Avatares, ícones circulares, chips arredondados completos |

### 14.5. Sombras e Elevação

**Princípio: sombras quase ausentes.** A hierarquia visual é construída por contraste de fundo (`bg-canvas` → `bg-elevated` → `bg-overlay`) e bordas finas em alpha baixo, não por elevação dramática. Isso evoca o museu sóbrio, não o app comercial. Quando uma sombra for absolutamente necessária (por exemplo, em modal flutuando sobre conteúdo), usa-se uma sombra suave e ampla:

- `shadow-subtle`: 0 1px 2px rgba(0,0,0,0.08)
- `shadow-card`: 0 4px 12px rgba(0,0,0,0.12)
- `shadow-overlay`: 0 12px 32px rgba(0,0,0,0.25)

Em modo escuro, sombras têm efeito visual reduzido por natureza — o que reforça a estratégia de usar contraste de fundo como ferramenta principal.

### 14.6. Espaçamento

Sistema baseado em múltiplos de 4px:

| Token | Valor | Uso típico |
|---|---|---|
| `space-1` | 4px | Espaçamentos internos mínimos |
| `space-2` | 8px | Padding pequeno, gaps em chips |
| `space-3` | 12px | Padding médio em elementos compactos |
| `space-4` | 16px | Padding padrão em cards |
| `space-5` | 24px | Gaps entre seções |
| `space-6` | 32px | Padding generoso em telas |
| `space-7` | 48px | Separação de blocos maiores |
| `space-8` | 64px | Margens superiores de hero sections |

Densidade de informação é deliberadamente **baixa**. Telas têm muita respiração entre elementos. Para TDAH, esse "vazio elegante" é essencial — telas densas paralisam.

### 14.7. Iconografia

**Sistema único: Phosphor Icons** (open source, MIT) em peso "Light" como padrão e "Regular" para ênfase. Phosphor tem linha fina e geometria mais leve e elegante que Lucide ou Heroicons, fugindo do default. Tamanhos padrão: 16px, 20px, 24px (principal), 32px (heroes). Cor herda do contexto via tokens (`fg-primary`, `fg-secondary`, `accent-bronze`).

**Proibido**: emojis como ícones de UI (exceto no conteúdo gerado pelo usuário); ícones bold-friendly (Heroicons solid, Lucide com peso pesado); ícones com cor sólida quando o sistema é de linha.

### 14.8. Estilo da Silhueta Corporal

Renderização vetorial via **react-native-skia**, não rasterizada nem 3D. Pose contrapposto inspirada no Doríforo de Policleto. Silhueta neutra sem feições faciais (ambiguidade intencional para identificação pelo usuário). Gradiente sutil simulando material conforme o tier:

- **Bronze:** gradiente de #5A4632 a #C19A6B com brilhos sutis
- **Pedra:** gradiente de #6E6457 a #B8AB9B com microtextura granular
- **Mármore:** gradiente de #E8DED1 a #F2EAE0 com veios finos em #B8AB9B
- **Dourada:** gradiente de #B8935A a #D4AF7A com brilhos em #F0D08F

Nível de definição muscular por região controla a intensidade do contorno e profundidade do gradiente naquela área. Transições renderizadas em tempo real, suaves. A silhueta nunca é literal demais — mantém a abstração escultural.

### 14.9. Animação e Microinteração

**Curva de easing principal:** `cubic-bezier(0.32, 0.72, 0.0, 1.0)`. Esta curva específica produz a sensação que chamo de "peso esculpido" — movimento que parece deliberado, sólido, sem o efeito jiggly do `ease-in-out` padrão. É a curva usada por Things 3 e outros apps de alta qualidade.

**Curva de easing rápida (para feedbacks de toque):** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

**Durações padronizadas:**
- 100ms: feedback imediato de toque (button press scale)
- 150ms: micro-transições (estado de hover/focus)
- 300ms: transições de estado e navegação padrão
- 500ms: aparição de elementos importantes (cards, sheets)
- 800ms: celebrações maiores
- 1200ms: revelação de conquistas e transições de tier

**Especificações de microinteração:**

Tap em botão primário: `transform: scale(0.97)` + haptic light, 100ms easing rápido, retorno em 150ms.

Card pressionado: `transform: scale(0.99)` + leve mudança de `bg-elevated` para `bg-highlight`, 150ms.

Conclusão de série: check em `feedback-success` aparece com bounce sutil (scale de 0 a 1.1 a 1.0 em 400ms), partículas curtas estilo "fagulha de cinzel" (4-6 partículas pequenas em `accent-bronze` ou `accent-gold`, não confete colorido), vibração média, som curto.

Conclusão de sessão: explosão lenta de partículas estilo "cinzas e fagulhas" (12-16 partículas em tons `accent-bronze` e `accent-gold` decaindo em 800ms), fade-in do resumo (500ms), microanimação na silhueta destacando os grupos trabalhados (definição muscular se manifestando em 1200ms).

Desbloqueio de conquista: tela dedicada com fade lento (500ms), ícone aparecendo com leve glow em `accent-gold` (animação de glow pulsante 1200ms), som de tigela tibetana (~1,5s), vibração padronizada de conquista.

Transição de tier da estátua: tela inteiramente dedicada, fade do estado anterior em 600ms, fade-in do novo material em 1200ms, som elaborado, mensagem em Fraunces grande.

### 14.10. Referências Visuais Nomeadas

Para que o agente de IA tenha âncoras concretas mentalmente:

- **Tipografia e voz:** *The Atlantic* (web e iOS), *MIT Technology Review*, *Are.na* (uso de serifa em UI moderna).
- **Paleta e atmosfera (modo escuro):** *Linear* em modo escuro (sobriedade e contraste), *Reeder* (calidez), *Arc Browser* (sutileza de UI).
- **Microinteração e peso:** *Things 3* da Cultured Code (precisão e satisfação tátil), *Apple Fitness+* (sem o lado comercial).
- **Estética escultural:** referências a museus como o Met (Greek and Roman Galleries) ou o J. Paul Getty Museum.
- **O que evitar como referência:** Stripe Dashboard genérico, Material You exuberante (Google), Strava (cor laranja vibrante demais), apps de fitness comerciais com vermelhos/azuis vibrantes, Duolingo (sucesso de gamificação mas estética que seria infantil demais aqui), MyFitnessPal (densidade visual sufocante).

### 14.11. Cláusula Explícita de Anti-Defaults

Esta sub-seção é a guard-rail para o agente de IA. Lista o que **não** fazer ao construir o app. Funciona como checklist obrigatório de validação durante implementação:

- Não usar azul-índigo (#4F46E5 ou variações) como cor primária ou de marca.
- Não usar fundo branco puro (#FFFFFF) como `bg-canvas` em modo claro; usar tom off-white quente.
- Não usar preto puro (#000000) como `bg-canvas` em modo escuro; usar tom escuro com matiz quente.
- Não usar Inter (ou qualquer sans-serif) como única fonte do app; pareamento Fraunces + Inter é obrigatório.
- Não usar border-radius de 8px ou 12px em cards; usar 10, 18, 28 ou 36 conforme tabela.
- Não usar sombras dramáticas estilo Material Design 3 (`elevation 4+`). Sombras são sutis ou ausentes.
- Não usar ícones bold-friendly do Heroicons (variant solid) ou Lucide com peso pesado; usar Phosphor Light.
- Não usar emoji como ícone de UI; emojis ficam reservados para conteúdo gerado pelo usuário ou para microcopy variável.
- Não usar curvas de easing default (`ease-in-out`, `ease`, `linear`); sempre a curva `cubic-bezier(0.32, 0.72, 0.0, 1.0)`.
- Não usar confete colorido em celebrações; usar partículas estilo cinzas/fagulhas em tons bronze/dourado.
- Não usar gradientes vibrantes ou neon em nenhum elemento.
- Não usar tipografia em CAPS LOCK em botões ou labels (uppercase puro). Title case ou sentence case sempre.
- Não usar exclamações abusivas em microcopy ("Você é incrível!!!"). Máximo uma exclamação por mensagem, e raramente.
- Não usar gradient text em títulos.
- Não usar parallax decorativo, skeumorfismo, ou efeitos visuais de outras eras.
- Não usar bordas duplas, sombras internas ornamentais, ou qualquer decoração que não sirva à hierarquia.
- Não usar cores vibrantes saturadas (HSL S > 70%) em nenhuma superfície grande.
- Não permitir que duas animações de destaque ocorram simultaneamente na mesma tela.

---

## 15. Voz, Tom e Microcopy do Produto

A forma como o app fala é parte da identidade tanto quanto a paleta de cores. Esta seção define as regras de comunicação verbal.

### 15.1. Princípios de Voz

O app fala em **português brasileiro**, em **segunda pessoa do singular (você)**, com tom **direto, técnico-amigável e maduro**. Nunca usa "nós" corporativo. Nunca finge ser um treinador imaginário com nome. Nunca usa hipermasculinidade caricata ("monstro", "fera", "raça"). Nunca usa baixaria motivacional ("acorda, guerreiro", "no pain no gain"). Também não cai no oposto, que seria um tom corporativo asséptico de hospital. O equilíbrio almejado é o de um treinador experiente e cientificamente informado, que fala com você como adulto, valoriza seu tempo, e não precisa gritar para se fazer ouvir.

### 15.2. Diretrizes Concretas

Frases curtas. Verbos no presente. Voz ativa. Quando há informação técnica, ela é precisa mas acessível ("Descanse 2-3 minutos entre séries de multiarticulares" em vez de "É necessário aguardar um período de recuperação intersérie"). Quando há celebração, ela é genuína mas contida ("Mais um na conta" em vez de "PARABÉNS!!! VOCÊ É INCRÍVEL!!!"). Quando há erro ou problema, a mensagem assume responsabilidade ("Não consegui sincronizar agora, mas seus dados estão salvos. Tento de novo em alguns segundos.") em vez de culpar o usuário ("Erro de conexão. Verifique sua internet.").

### 15.3. Microcopy por Contexto

**Botões primários de ação:** verbo direto no imperativo. Exemplos: "Começar treino", "Concluir série", "Adicionar peso", "Salvar perfil".

**Botões secundários:** verbo direto, mas em tom mais neutro. "Pular", "Voltar", "Adiar".

**Confirmações destrutivas:** explicação clara da consequência + duas opções claras. "Tem certeza que quer apagar seu histórico? Essa ação não pode ser desfeita." → "Apagar" / "Cancelar".

**Estados vazios:** acolhedores, com uma frase orientadora. "Você ainda não fez nenhum treino. Toque em 'Começar treino' para sua primeira sessão." Não usar humor ou gracinhas que envelhecem mal.

**Estados de loading:** silêncio é melhor que ruído. Quando texto for necessário, neutro: "Carregando..." ou "Preparando rotina..." — não "Calculando seus gainz..." ou similar.

**Estados de erro:** assumir responsabilidade, oferecer ação. "Tive um problema ao salvar. Toque aqui para tentar de novo." Nunca culpar o usuário por problemas técnicos.

**Microfrases entre séries (pool variável de 30-50):** mistura de neutras-celebratórias e técnicas-positivas. Exemplos: "Mais uma na conta", "Tensão pura", "Tá fluindo", "Tijolo por tijolo", "Forma boa", "Volume na veia", "Cresceu agora", "Mandou bem", "Série limpa", "Foco mantido", "Recuperando", "Próxima vem", "Construção em andamento". Variar tom e evitar repetição na mesma sessão (algoritmo de sorteio sem reposição até esgotar o pool).

**Mensagens de conquista:** linguagem clara do que foi atingido + breve significado. "Primeira semana completa. Sete dias mantendo a sequência. Boa base para os próximos." Em vez de "ACHIEVEMENT UNLOCKED: WEEK WARRIOR".

**Mensagens de tier da estátua:** mais elaboradas, com pequeno texto. "Sua estátua agora é de pedra. Quatro semanas de consistência viraram materialidade visível. A próxima transformação acontece com o tempo."

### 15.4. Termos Padronizados (Glossário Interno)

Para evitar inconsistência, alguns termos têm forma canônica que deve ser usada em todo o app:

- "treino" (não "exercício" para se referir à sessão inteira)
- "sessão" (sinônimo de treino, usado em contexto técnico)
- "série" (não "set")
- "repetição" ou "rep" (ambos aceitáveis, "rep" mais conciso em UI)
- "descanso" (não "intervalo")
- "RIR" sempre maiúsculo
- "cadência" (não "tempo")
- "variação" (para alternativas do mesmo padrão de movimento)
- "padrão de movimento" (não "categoria")
- "grupo muscular" (não "músculo" para se referir ao agrupamento)
- "silhueta" ou "estátua" (ambos aceitáveis para o elemento visual)
- "tier" (mantido em inglês por concisão)
- "streak" (mantido em inglês — "sequência" é alternativa aceitável)

---

## 16. Política de Estados (Loading, Erro, Vazio)

A consistência no tratamento de estados não-felizes é o que separa um app que parece sólido de um que parece colcha de retalhos. Esta seção define a política.

### 16.1. Estados de Loading

**Princípio:** indicadores de loading só aparecem quando uma operação demora mais que 200ms. Operações mais rápidas que isso devem ser instantâneas perceptualmente, sem feedback intermediário.

**Skeleton screens em vez de spinners.** Quando o usuário abre uma tela que precisa carregar dados, o que aparece é uma versão "esqueleto" da tela com placeholders em `bg-highlight` no formato dos elementos reais que virão. Spinners genéricos só aparecem em ações pontuais (gerando rotina, sincronizando manualmente), não em transições de tela.

**Animação do skeleton:** shimmer sutil em 1200ms loop, com gradient passando da esquerda para a direita usando `bg-elevated` para `bg-highlight`.

**Texto de loading quando necessário:** sempre neutro e específico. "Carregando seus treinos...", "Preparando rotina...", "Sincronizando...". Nunca humor ou metafísica.

### 16.2. Estados de Erro

**Princípio:** o app assume responsabilidade, não culpa o usuário. Toda mensagem de erro tem três elementos: o que aconteceu (em linguagem clara), o que isso significa para o usuário (consequência prática), e o que ele pode fazer (ação concreta).

**Exemplo de mensagem completa:** "Não consegui sincronizar com a nuvem agora. Seus dados estão salvos no celular e vou tentar de novo automaticamente. Você pode continuar treinando normalmente."

**Exemplo do que evitar:** "Erro 503. Conexão falhou."

**Estados de erro recuperáveis** (problema temporário de rede, por exemplo) mostram um banner discreto no topo da tela em `feedback-warning` que desaparece sozinho quando a operação é resolvida. Não bloqueiam a UI.

**Estados de erro não-recuperáveis** (corrupção de dados local, por exemplo, raríssimo) mostram tela dedicada com explicação calma e opções claras (recuperar do Supabase, exportar dados existentes, reportar problema).

### 16.3. Estados Vazios

**Princípio:** estados vazios são oportunidades de orientação, não buracos visuais.

**Exemplo na tela Histórico antes do primeiro treino:** ilustração sutil de uma silhueta corporal em bronze (tier inicial, sem definição), com texto "Seu primeiro treino aparecerá aqui. Bora começar?" e botão para iniciar a sessão de hoje.

**Exemplo na tela Conquistas antes da primeira:** "Conquistas aparecem aqui conforme você avança. Continue treinando para desbloquear as primeiras."

**Exemplo na tela Nutrição se peso corporal ainda não foi informado:** "Para calcular sua meta de proteína, preciso saber seu peso. Adicione em Configurações > Perfil." com link direto.

### 16.4. Estados de Permissão

Quando o app precisa de permissão (notificações para lembretes), explicar o porquê **antes** de chamar a API nativa de permissão. Tela ou modal pré-permissão diz: "Para mandar lembretes de creatina e refeições, preciso da sua permissão para notificações. Você pode ajustar depois em Configurações." Botão "Continuar" dispara a permissão nativa. Isso evita a armadilha clássica de o usuário negar a permissão sem entender e nunca mais conceder.

---

## 17. Estratégia de Mídia e Assets dos Exercícios

A qualidade visual das demonstrações de exercício é crítica — é o que separa um app utilizável de um adivinhação. Esta seção define a estratégia.

### 17.1. Formato Preferido

**Animações Lottie (.json) embarcadas no APK** como formato principal. Vantagens: vetoriais (escalam perfeitamente em qualquer resolução), arquivo pequeno (tipicamente 20-100KB), perfomáticas, customizáveis em runtime (cor, velocidade), e renderizáveis nativamente via biblioteca `lottie-react-native`.

**Fallback aceitável:** GIFs otimizados (sem áudio) com 4-6 frames-chave do movimento, comprimidos para abaixo de 300KB cada. Usar apenas para exercícios onde uma animação vetorial seria complexa demais para o ganho.

**Não usar:** vídeos MP4 ou similar (peso excessivo, complexidade de player, sem ganho hipertrófico real); imagens estáticas únicas (insuficientes para mostrar movimento).

### 17.2. Estratégia de Produção

**Opção A — Geração via IA:** ferramentas como LottieFiles AI ou prompts diretos em ferramentas de animação podem gerar animações Lottie estilizadas. Para a estética escultural do app, animações de figura humana simplificada (silhueta sem rosto) executando o movimento, em monocromático com tons de `accent-bronze`, ficariam coerentes com a paleta.

**Opção B — Repositório público:** plataformas como LottieFiles têm catálogos de animações de exercícios. Validar licença antes de uso.

**Opção C — Curadoria manual com referências visuais:** screenshots ou frames de vídeos demonstrativos confiáveis (canais como Athlean-X, Jeff Nippard, Squat University), refeitos como animações vetoriais estilizadas. Mais trabalho mas garantia de precisão técnica.

A escolha entre A, B e C pode variar exercício a exercício. Os ~40 exercícios essenciais da lista do Apêndice A são prioridade — exercícios secundários podem ser adicionados ao longo do tempo.

### 17.3. Especificações Técnicas

- Formato: Lottie JSON (.json) ou GIF otimizado
- Dimensões: 600x600px lógico (Lottie escala; GIF deve ser nessa proporção)
- Tamanho de arquivo: alvo de 50-100KB por animação (até 300KB no máximo para GIF)
- Cor: monocromática usando `accent-bronze` em modo escuro e versão escura em modo claro
- Duração do loop: 2-4 segundos por ciclo completo do exercício
- Frame rate: 30fps (Lottie) ou 12fps (GIF)
- Loop infinito

### 17.4. Onde Armazenar

**Animações dos ~40 exercícios essenciais:** embarcadas no APK em `/assets/animations/` para garantir disponibilidade offline desde o primeiro uso.

**Animações de exercícios adicionais (futuro):** Supabase Storage com download sob demanda na primeira visualização, cache local depois. Não relevante para V1.

---

## 18. Estrutura de Pastas e Convenções de Código

A consistência estrutural do projeto facilita a vida do agente de IA durante toda a construção. Esta seção define o padrão.

### 18.1. Estrutura de Pastas (Expo Router + TypeScript)

```
projeto/
├── app/                          # Rotas (Expo Router file-based)
│   ├── (tabs)/                   # Tabs principais (rodapé)
│   │   ├── index.tsx             # Home com silhueta
│   │   ├── catalogo.tsx
│   │   ├── progresso.tsx
│   │   ├── ciencia.tsx
│   │   └── nutricao.tsx
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── idade.tsx
│   │   ├── peso.tsx
│   │   └── ...                   # Demais telas do onboarding
│   ├── treino/
│   │   ├── pre-treino.tsx
│   │   └── execucao.tsx
│   ├── exercicio/[id].tsx        # Detalhamento de exercício
│   ├── artigo/[id].tsx           # Leitura de artigo da seção Ciência
│   ├── configuracoes/
│   │   ├── index.tsx
│   │   └── perfil.tsx
│   └── _layout.tsx               # Root layout
│
├── components/                   # Componentes compartilhados
│   ├── silhueta/
│   │   ├── EstatuaSVG.tsx        # Renderização Skia da silhueta
│   │   └── RegiaoMuscular.tsx
│   ├── treino/
│   │   ├── BotaoConcluirSerie.tsx
│   │   ├── TimerDescanso.tsx
│   │   └── CardExercicio.tsx
│   ├── ui/                       # Building blocks de UI
│   │   ├── Botao.tsx
│   │   ├── Card.tsx
│   │   └── Texto.tsx
│   └── feedback/
│       ├── ParticulasCinzel.tsx
│       └── CelebracaoSessao.tsx
│
├── lib/                          # Utilidades, lógica de domínio
│   ├── algoritmo-rotina.ts       # Geração de rotina semanal
│   ├── filtro-restricoes.ts      # Filtros de adaptação
│   ├── calculadora-proteina.ts
│   ├── motor-silhueta.ts         # Cálculo de definição muscular
│   └── motor-gamificacao.ts      # XP, streaks, conquistas
│
├── db/                           # Persistência
│   ├── supabase-client.ts
│   ├── local-cache.ts            # AsyncStorage + expo-sqlite
│   ├── sync-engine.ts            # Sincronização offline-first
│   └── queries/
│       ├── exercicios.ts
│       ├── perfil.ts
│       └── treinos.ts
│
├── hooks/                        # Custom React hooks
│   ├── usePerfil.ts
│   ├── useTreino.ts
│   ├── useSilhueta.ts
│   └── useTema.ts
│
├── stores/                       # Zustand stores
│   ├── perfilStore.ts
│   ├── treinoAtualStore.ts
│   └── gamificacaoStore.ts
│
├── types/                        # Tipos TypeScript
│   ├── exercicio.ts
│   ├── perfil.ts
│   ├── treino.ts
│   └── index.ts
│
├── assets/                       # Mídia estática
│   ├── animations/               # Lottie dos exercícios
│   ├── fonts/                    # Fraunces e Inter
│   ├── sounds/                   # Sons funcionais
│   └── images/                   # Outras imagens
│
├── constants/                    # Design tokens, configurações
│   ├── tokens.ts                 # Paleta, tipografia, espaçamentos
│   ├── easing.ts                 # Curvas de animação
│   └── microcopy.ts              # Pool de frases variáveis
│
├── supabase/
│   ├── migrations/               # Migrations SQL versionadas
│   └── seed.sql                  # Dados iniciais (catálogo)
│
├── content/                      # Conteúdo do app (markdown)
│   ├── artigos/                  # Artigos da seção Ciência
│   └── suplementos/              # Fichas de suplementos
│
└── ...                           # Configs (app.json, eas.json, etc.)
```

### 18.2. Convenções de Nomenclatura

- **Arquivos de componentes React:** PascalCase (`BotaoConcluirSerie.tsx`)
- **Arquivos de utilidades, hooks, stores:** camelCase (`algoritmo-rotina.ts` ou `usePerfil.ts`)
- **Componentes React:** PascalCase (`BotaoConcluirSerie`)
- **Funções:** camelCase (`gerarRotinaSemanal`)
- **Constantes globais:** SCREAMING_SNAKE_CASE (`META_PROTEINA_HIPERTROFIA`)
- **Tipos e interfaces TypeScript:** PascalCase (`Exercicio`, `PerfilUsuario`)
- **Enums:** PascalCase com valores em camelCase (`enum PadraoMovimento { pushHorizontal, pushVertical, ... }`)
- **Tabelas Supabase:** snake_case (`exercicios`, `historico_peso_corporal`)
- **Colunas de tabelas:** snake_case (`peso_corporal_kg`, `data_criacao`)

### 18.3. Convenções de Código

**TypeScript estrito.** `strict: true` no `tsconfig.json`. Sem `any` exceto em casos justificados com comentário. Tipos explícitos em assinaturas de função pública. Inferência aceitável em escopo local.

**Imports organizados em três blocos** separados por linha em branco: bibliotecas externas, módulos internos absolutos (com alias `@/`), imports relativos.

**Comentários em português brasileiro** sempre que explicarem **por que** algo é feito (decisão de negócio, referência científica). Para **o que** o código faz, o código deve ser autoexplicativo via nomenclatura. Exemplo bom: `// Schoenfeld et al. (2016) mostrou que 3 min de descanso superam 1 min para hipertrofia em treinados`. Exemplo desnecessário: `// incrementa o contador`.

**Tamanho de função:** alvo de até 50 linhas. Quando uma função cresce, refatorar em funções menores nomeadas.

**Componentes React:** alvo de até 200 linhas. Quando crescem, extrair sub-componentes.

**Imutabilidade preferida:** usar `const` quase sempre. Spreads e novas instâncias em vez de mutação.

---

## 19. Estratégia de Migrations e Versionamento de Schema

Como o app vai evoluir ao longo do tempo, mudanças no schema do banco são inevitáveis. Esta seção define como tratar.

### 19.1. Migrations no Supabase

Toda mudança de schema do Supabase é registrada como arquivo SQL versionado em `supabase/migrations/`, com nome no formato `YYYYMMDDHHMMSS_descricao.sql`. As migrations são aplicadas via Supabase CLI ou via dashboard, sempre na ordem correta. Nunca editar uma migration já aplicada — sempre criar uma nova migration que ajuste o estado.

### 19.2. Schema Local (SQLite)

O cache local mantém uma versão de schema registrada em AsyncStorage (`schema_version: 1`, por exemplo). No startup, o app compara a versão registrada com a versão esperada pelo código atual. Se diferentes, executa migrations locais necessárias (DROP/CREATE/ALTER em SQLite, com cuidado para preservar dados existentes). Migrations locais ficam em `db/migrations/local/` como funções TypeScript versionadas.

### 19.3. Compatibilidade

Toda mudança de schema deve ser **backward-compatible por pelo menos 2 versões**. Em vez de remover um campo, marcá-lo como deprecated. Em vez de renomear, manter o antigo e adicionar o novo, depois remover o antigo em versão futura. Isso evita quebrar dados existentes quando o app é atualizado.

### 19.4. Versionamento do App

Versionamento semântico (MAJOR.MINOR.PATCH). MAJOR para mudanças incompatíveis (forçam migração de dados); MINOR para features novas backward-compatible; PATCH para correções. A versão é exibida em Configurações > Sobre.

---

## 20. Requisitos Não-Funcionais

**Offline-first.** App funciona 100% sem internet, exceto links externos para PubMed. Mídia de demonstração embarcada no APK.

**Performance.** Inicialização abaixo de 2s no Galaxy S23. Transições <200ms. Animações 60fps. Timer de descanso preciso em background.

**Ergonomia no treino.** Tela não dorme durante sessão ativa. Botões com toque mínimo 56dp. Contraste alto.

**Acessibilidade.** Suporte a fontes maiores do sistema sem quebra. WCAG AA mínimo. Hierarquia tipográfica clara.

**Bateria.** Background timer não drena bateria significativamente. Sync em janelas curtas e espaçadas.

**Armazenamento.** Cache local abaixo de 50MB. APK final abaixo de 150MB com assets.

**Privacidade.** Sem analytics, sem tracking, sem terceiros. Histórico clínico fica apenas no Supabase do usuário e cache local.

---

## 21. Stack Técnico

**Framework:** React Native via Expo (managed workflow, prebuild se necessário).

**Linguagem:** TypeScript estrito.

**Armazenamento local:** expo-sqlite + AsyncStorage. Schema versionado.

**Backend:** Supabase (PostgreSQL + Auth simplificada + Storage opcional).

**Estado:** Zustand para state global. React Query opcional para sync.

**Navegação:** Expo Router (file-based).

**Estilização:** NativeWind (Tailwind para RN) primeira escolha.

**Animações:** React Native Reanimated 3 (transições, microinterações), Lottie (animações vetoriais complexas, demos de exercícios), react-native-skia (silhueta corporal parametrizada).

**Haptic:** expo-haptics.

**Som:** expo-av.

**Notificações locais:** expo-notifications.

**Build:** EAS Build para gerar APK. Instalação direta no Galaxy S23.

**Versionamento:** Git no GitHub privado, conectado ao Antigravity.

**Ambiente de Desenvolvimento:** Antigravity (IDE agêntico Google) com Claude e Gemini disponíveis. Codex (OpenAI) como agente secundário paralelo.

---

## 22. Roadmap de Implementação em Fases

Construção dividida em fases que produzem incrementos funcionais. Cada fase tem entregável testável. Prompts específicos no Guia de Implementação separado.

**Fase 0 — Setup do Projeto.** Inicializar Expo + TypeScript, configurar Expo Router, instalar todas as dependências (Zustand, NativeWind, Reanimated 3, Lottie, react-native-skia, expo-sqlite, AsyncStorage, expo-haptics, expo-av, expo-notifications, Supabase client SDK), configurar GitHub privado, validar Expo Go no Galaxy S23, criar projeto no Supabase. **Entregável:** app "Hello World" rodando no celular conectado ao Supabase.

**Fase 1 — Sistema de Design Tokens.** Implementar todos os tokens da Seção 14 em `constants/tokens.ts`. Configurar fontes Fraunces e Inter via expo-font. Implementar componentes base de UI (Botao, Card, Texto) usando os tokens. Configurar dark mode automático com fallback manual. **Entregável:** biblioteca de componentes base visualmente coerentes com a direção visual.

**Fase 2 — Modelo de Dados e Catálogo Inicial.** Definir todos os tipos TypeScript, criar migrations do Supabase, schema SQLite local, popular banco com catálogo de exercícios, referências científicas, suplementos. **Entregável:** app que sincroniza com Supabase e lista exercícios reais.

**Fase 3 — Onboarding Expandido.** 12-14 microtelas com fluxo guiado, persistência de perfil completo, card interativo de restrições articulares via silhueta tocável, captura de histórico clínico. **Entregável:** usuário preenche perfil completo e persiste.

**Fase 4 — Algoritmo de Geração de Rotina.** Lógica que gera programa semanal com filtros de nível, equipamento, restrições, histórico clínico. **Entregável:** rotina semanal gerada automaticamente ao terminar onboarding.

**Fase 5 — Tela de Execução do Treino.** Tela mais importante e complexa. Demonstração visual via Lottie, timer de descanso preciso em background, registro de séries em tempo real, frase científica inline, microinterações com partículas estilo cinzel. **Entregável:** treino completo executável com dados sincronizados.

**Fase 6 — Silhueta Corporal e Sistema Dopaminérgico.** Renderização Skia da silhueta com nove regiões parametrizáveis e quatro tiers. Motor de cálculo de definição muscular com decaimento temporal. XP, streak com freezes, sistema de conquistas (40-50 do catálogo inicial), Sessão Express. Microanimações de celebração. **Entregável:** silhueta evoluindo visivelmente com o treino, conquistas desbloqueando.

**Fase 7 — Tela de Progresso.** Visualizações de volume semanal, linha do tempo, histórico, silhueta detalhada com regiões tocáveis. **Entregável:** progresso multidimensional consultável.

**Fase 8 — Conteúdo Científico.** Painéis científicos de exercícios, seção Ciência com biblioteca de 15-20 artigos iniciais em formato markdown carregado dinamicamente, personalização leve por perfil. **Entregável:** âncoras científicas em cada exercício e biblioteca navegável.

**Fase 9 — Camada de Nutrição Inteligente.** Tela de Nutrição com calculadora dinâmica, catálogo de fichas de suplementos, configuração e disparo de lembretes locais via expo-notifications. **Entregável:** orientação nutricional prática funcionando.

**Fase 10 — Design Sonoro, Microcopy e Atalho de Música.** Criação ou licenciamento dos sons funcionais (clicks, dings, jingles, conquista, tier). População do pool de microcopy variável. Implementação do atalho de música externa via Android Intent. **Entregável:** áudio e copy do app polidos.

**Fase 11 — Polish, Estados e Edge Cases.** Implementação cuidadosa de estados de loading (skeletons), erro (mensagens com responsabilidade e ação), vazio (orientação acolhedora). Refinamento visual final, ajustes de animação, otimização de assets. **Entregável:** app robusto em todos os cenários.

**Fase 12 — Build APK e Instalação Final.** Configuração do EAS Build, geração do APK assinado, instalação no Galaxy S23, testes em uso real. **Entregável:** APK em uso diário no celular do usuário.

---

## 23. Métricas de Sucesso Pessoal

O app será bem-sucedido se, ao final de 12 semanas de uso, o usuário tiver treinado consistentemente (mínimo 70% dos treinos planejados); não tiver tido lesão ou dor articular significativa nas áreas de predisposição; tiver progredido de variação em pelo menos 3 padrões de movimento; tiver mantido streak médio acima de 5 dias; tiver explorado o conteúdo científico em pelo menos 10 ocasiões; tiver mantido meta diária de proteína em pelo menos 60% dos dias; tiver consumido creatina em pelo menos 80% dos dias; tiver alcançado o tier "Pedra" da silhueta; e tiver sentido subjetivamente que o app foi motivador em pelo menos 80% das vezes que o abriu.

---

## 24. Sugestões de Codinome

**Hypertropos** (hipertrofia + grego, sério e técnico, alinhado com estátua), **Sarc** (sarcômero, curto), **Casa Forte** (PT, claro), **BodyStack**, **Tensão** (referência à tensão mecânica), **Maxima**, **Tijolo** ("tijolo por tijolo se constrói um físico"), **Mármore** (tier aspiracional), **Telos** (grego, propósito/fim). A escolha pode ser ajustada na primeira semana de implementação.

---

## Apêndice A — Lista Mínima Inicial de Exercícios para a V1

Estrutura em escada de 5 níveis por padrão de movimento.

**Push horizontal:** Nível 1 Flexão na parede (`push_wall`). Nível 2 Flexão inclinada em mesa (`push_inclined_table`), Flexão de joelhos (`push_knees`). Nível 3 Flexão padrão (`push_standard`). Nível 4 Flexão declinada pés elevados (`push_declined_feet_elevated`), Flexão diamante (`push_diamond`). Nível 5 Flexão com déficit em livros (`push_deficit`), Archer push-up (`push_archer`), Pseudo-planche push-up (`push_pseudo_planche`).

**Push vertical:** Nível 1-2 Pike push-up inclinado (`pike_inclined`). Nível 3 Pike push-up (`pike_standard`). Nível 4 Wall walk (`wall_walk`), Pike push-up com pés elevados (`pike_feet_elevated`). Nível 5 Handstand push-up excêntrico contra parede (`hspu_eccentric`), Handstand push-up completo (`hspu_full`).

**Pull horizontal:** Nível 1 Sliding floor pulldown (`pull_floor_sliding`). Nível 2 Remada com lençol na porta (`row_sheet_doorway`). Nível 3 Inverted row em mesa (`row_table_inverted`). Nível 4 Doorway row unilateral (`row_doorway_unilateral`), Inverted row pés elevados (`row_feet_elevated`). Acessórios posturais Snow angels reverso (`reverse_snow_angels`), Superman (`superman`).

**Joelho-dominante:** Nível 1 Agachamento livre lento (`squat_slow`), Agachamento profundo assistido (`squat_assisted`). Nível 2 Passada/Lunge (`lunge`), Reverse lunge (`reverse_lunge`). Nível 3 Split squat (`split_squat`). Nível 4 Bulgarian Split Squat com viés quadríceps (`bss_quad_bias`), Bulgarian Split Squat com viés glúteo (`bss_glute_bias`). Nível 5 (desativado por padrão para o usuário) Sissy squat assistido (`sissy_squat_assisted`), Pistol squat assistido (`pistol_assisted`).

**Quadril-dominante:** Nível 1 Glute bridge (`glute_bridge`). Nível 2 Glute bridge unilateral (`glute_bridge_unilateral`). Nível 3 Hip thrust em cadeira (`hip_thrust_chair`), Hip thrust unilateral (`hip_thrust_unilateral`). Nível 4 Single-leg Romanian Deadlift (`single_leg_rdl`), Slider hamstring curl (`slider_hamstring_curl`). Nível 5 Nordic curl assistido (`nordic_assisted`), Nordic curl completo (`nordic_full`).

**Panturrilha:** Nível 1 Calf raise bilateral (`calf_raise_bilateral`). Nível 2 Calf raise unilateral (`calf_raise_single`). Nível 3 Calf raise unilateral em déficit (`calf_raise_deficit`). Nível 4 Calf raise unilateral em déficit com pausa de 2s (`calf_raise_deficit_paused`).

**Core:** Plank (`plank`), Plank RKC com ativação ativa (`plank_rkc`), Hollow body hold (`hollow_body`), Reverse crunch (`reverse_crunch`), Leg raise (`leg_raise`), Long-lever plank (`long_lever_plank`), Ab rollout com toalha (`ab_rollout_towel`).

---

## Apêndice B — Catálogo Inicial de Suplementos

Sete fichas iniciais: Creatina Monohidratada (Grau A), Whey Protein (Grau A), Caseína (Grau A), Cafeína (Grau A para desempenho agudo), Beta-alanina (Grau B), Citrulina Malato (Grau B), Vitamina D (Grau B condicional), Ômega-3 EPA/DHA (Grau B). Ficha adicional "Suplementos SEM Evidência Forte" cobrindo BCAAs isolados, Glutamina, Testosterona boosters, HMB para treinados, Pré-treinos blends proprietários.

---

## Apêndice C — Catálogo Inicial de Conquistas

Aproximadamente 40-50 conquistas iniciais.

**Óbvias (marcos esperados):** Primeiro treino concluído. Primeira semana completa. Primeiro mês. Três meses de uso. Seis meses de uso. Primeira progressão de variação em qualquer padrão. Atingiu tier Pedra. Atingiu tier Mármore. Atingiu tier Dourada. Streak de 7 dias. Streak de 30 dias. Streak de 100 dias. Primeira meta diária de proteína atingida. 30 dias seguidos com meta proteica. Primeiro uso de creatina. 30 dias consecutivos com creatina.

**Surpresa (recompensa variável):** Treinou antes das 7h da manhã. Treinou em três horários diferentes em uma semana. Completou 100 flexões em uma sessão. Completou 200 agachamentos em uma sessão. Manteve cadência perfeita em todas as séries de uma sessão (RIR alvo atingido em 100%). Salvou o streak com freeze pela primeira vez. Usou Sessão Express três vezes em uma semana sem quebrar streak. Leu cinco artigos da seção Ciência em uma semana. Treinou todos os 9 grupos musculares em uma única semana. Atingiu nível 50 de XP. Atingiu nível 100 de XP. Completou primeiro treino com restrição articular ativa. Atualizou peso corporal pela primeira vez.

---

## Apêndice D — Tokens de Design Consolidados

Referência rápida dos valores definidos na Seção 14, em formato compacto para implementação direta.

```typescript
// constants/tokens.ts (estrutura sugerida)

export const colors = {
  dark: {
    bg: { canvas: '#1A1715', elevated: '#252220', overlay: '#2F2B28', highlight: '#3D3733' },
    fg: { primary: '#F2EAE0', secondary: '#B8AB9B', muted: '#6E6457', inverse: '#1A1715' },
    accent: { bronze: '#C19A6B', marble: '#E8DED1', gold: '#D4AF7A' },
    feedback: { success: '#7FB069', warning: '#D4A574', error: '#C66D5A' },
    border: { subtle: '#3D3733', strong: '#5A4F44' },
    divider: '#2A2622',
  },
  light: {
    bg: { canvas: '#F5F0E8', elevated: '#FAF5ED', overlay: '#FFFFFF', highlight: '#EBE3D5' },
    fg: { primary: '#2A2520', secondary: '#5C5247', muted: '#8C8073', inverse: '#FAF5ED' },
    accent: { bronze: '#8B6F47', marble: '#B8AB9B', gold: '#B8935A' },
    feedback: { success: '#5A8B47', warning: '#B8853D', error: '#A05543' },
    border: { subtle: '#DDD3C2', strong: '#B8AB9B' },
    divider: '#E5DDD0',
  },
};

export const typography = {
  family: { display: 'Fraunces', body: 'Inter', mono: 'Inter' }, // mono usa Inter tabular
  size: { displayXL: 48, displayL: 36, h1: 28, h2: 22, h3: 18, bodyL: 17, body: 15, caption: 13, numericHero: 72, numericM: 32 },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.0, snug: 1.2, normal: 1.4, relaxed: 1.5 },
};

export const radius = { xs: 4, sm: 10, md: 18, lg: 28, xl: 36, full: 9999 };

export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 };

export const easing = {
  sculpted: 'cubic-bezier(0.32, 0.72, 0.0, 1.0)',
  quick: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

export const duration = { instant: 100, micro: 150, normal: 300, expressive: 500, celebration: 800, tierTransition: 1200 };

export const shadows = {
  subtle: '0 1px 2px rgba(0,0,0,0.08)',
  card: '0 4px 12px rgba(0,0,0,0.12)',
  overlay: '0 12px 32px rgba(0,0,0,0.25)',
};
```

---

## Apêndice E — Checklist de Anti-Defaults

Lista compactada para validação rápida durante implementação. Imprimir mentalmente antes de cada revisão de UI.

Anti-defaults visuais:
- ❌ Cor primária azul-índigo
- ❌ Fundo branco puro ou preto puro
- ❌ Apenas Inter como fonte
- ❌ Border-radius 8px ou 12px
- ❌ Sombras dramáticas
- ❌ Ícones bold-friendly
- ❌ Emojis como ícones de UI
- ❌ Easing default
- ❌ Confete colorido
- ❌ Gradientes vibrantes ou neon
- ❌ Caps lock em botões
- ❌ Exclamações múltiplas em mensagens
- ❌ Cores saturadas em superfícies grandes
- ❌ Duas animações de destaque simultâneas
- ❌ Skeumorfismo ou efeitos visuais de outras eras

Anti-defaults de copy:
- ❌ "Nós" corporativo
- ❌ Hipermasculinidade caricata
- ❌ Humor que envelhece mal em estados de loading/erro
- ❌ Culpar usuário por erros técnicos
- ❌ Linguagem corporativa asséptica
- ❌ Promessas exageradas
- ❌ Termos inconsistentes (set vs série, etc.)

---

## Apêndice F — Próximo Documento

O próximo entregável após aprovação deste PRD é o **Guia de Implementação Fase a Fase**, com:

Prompt inicial completo para colar no Antigravity ao começar a Fase 0, incluindo o contexto do projeto, a stack escolhida, e as primeiras tarefas concretas. Prompts específicos para cada subtarefa de cada fase, otimizados para o modelo de agente em uso (Claude no Antigravity, Codex em paralelo). Critérios de validação para cada fase. Pontos de verificação onde usar Codex em paralelo. Estratégia para popular o catálogo de exercícios usando IA como aceleradora a partir dos arquivos de pesquisa. Estratégia específica para a renderização da silhueta corporal via react-native-skia. Instruções de build de APK via EAS Build no final, e instalação manual no Galaxy S23.

**Fim do documento.**
