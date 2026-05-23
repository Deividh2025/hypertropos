const fs = require('fs');
const path = require('path');

// Helper to escape strings for SQL
function escapeSql(val) {
    if (val === null || val === undefined) {
        return "NULL";
    }
    return val.replace(/'/g, "''");
}

// Helper to format PostgreSQL array literal
function toPgArray(lst) {
    const escaped = lst.map(item => item.replace(/"/g, '\\"'));
    const joined = escaped.map(item => `"${item}"`).join(",");
    return escapeSql(`{${joined}}`);
}

// Helper to format JSONB literal for SQL
function toJsonb(obj) {
    const jsStr = JSON.stringify(obj);
    return escapeSql(jsStr);
}

const EXERCISES_DATA = {
    // 1. PUSH HORIZONTAL (FLEXÕES)
    "push_wall": {
        "nome_alternativo": "Wall Push-up",
        "grf_percentual": 41,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo"},
        "descricao": "Posicione-se em pé de frente para uma parede a uma distância de aproximadamente um braço. Apoie as mãos na parede alinhadas à altura dos ombros e ligeiramente mais afastadas que a largura deles. Mantenha os pés juntos e o core ativo, estabelecendo uma linha reta dos calcanhares à cabeça. Flexione os cotovelos de forma controlada, aproximando o peitoral da parede em um ângulo de 45 graus em relação ao tronco. Empurre a parede de volta de forma contínua para retornar à posição inicial.",
        "dicas": [
            "Mantenha os cotovelos apontando para baixo e para trás em diagonal, não para os lados.",
            "Mantenha o abdômen e glúteos contraídos para evitar a hiperextensão lombar.",
            "Foque na contração ativa do peitoral na fase concêntrica."
        ],
        "erros": [
            "Abertura excessiva dos cotovelos (ângulo próximo de 90°), gerando sobrecarga acromial.",
            "Projeção anterior excessiva do quadril por falta de contração do core.",
            "Execução com velocidade excessiva, eliminando a tensão excêntrica."
        ],
        "frase_cientifica": "A flexão na parede impõe ~41% da força de reação do solo (GRF), sendo ideal para o desenvolvimento de padrões motores iniciais e reabilitação capsular (Kikuchi & Nakazato, 2017).",
        "contraindicacoes": []
    },
    "push_inclined_table": {
        "nome_alternativo": "Incline Push-up",
        "grf_percentual": 55,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo"},
        "descricao": "Apoie as mãos na borda de uma mesa firme e estável, com os braços estendidos e mãos ligeiramente mais afastadas que a largura dos ombros. Afaste os pés para trás até que o corpo fique inclinado em diagonal, mantendo uma linha reta sólida dos calcanhares à cabeça. Flexione os cotovelos, descendo o peitoral em direção à mesa com controle. Mantenha os cotovelos em ângulo de 45° em relação ao tronco. Empurre a mesa com força para retornar ao início.",
        "dicas": [
            "Mantenha a escápula retraída durante a fase excêntrica do movimento.",
            "Estabilize a pelve ativando os glúteos e o transverso do abdômen.",
            "Pressione ativamente a borda da mesa para maior estabilidade articular."
        ],
        "erros": [
            "Bater a mesa na região abdominal em vez do peitoral inferior.",
            "Deixar a cabeça projetar-se excessivamente à frente do peito.",
            "Perda de alinhamento pélvico (quadril caído)."
        ],
        "frase_cientifica": "A flexão inclinada em mesa de 60cm reduz a carga relativa para ~55% da força de reação do solo (GRF), permitindo volume de trabalho adequado para iniciantes (Lopez et al., 2021).",
        "contraindicacoes": []
    },
    "push_knees": {
        "nome_alternativo": "Knee Push-up",
        "grf_percentual": 49,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo"},
        "descricao": "Fique de joelhos no solo, com as mãos apoiadas um pouco além da largura dos ombros. Desloque o quadril à frente até alinhar as coxas e o tronco em uma linha reta contínua. Flexione os cotovelos a 45°, descendo o peitoral de forma controlada até quase tocar o chão. Mantenha as escápulas estáveis. Empurre o solo de volta para estender os braços completamente.",
        "dicas": [
            "Use um colchonete sob os joelhos para evitar desconforto patelar.",
            "Não cruze os tornozelos atrás do corpo para evitar rotações pélvicas compensatórias.",
            "Mantenha o pescoço neutro, olhando ligeiramente à frente das mãos no solo."
        ],
        "erros": [
            "Agachar o quadril para trás durante a descida (movimento de quatro apoios).",
            "Hiperextensão da coluna lombar por falta de ativação do core.",
            "Cotovelos muito abertos gerando atrito no manguito rotador."
        ],
        "frase_cientifica": "Flexionar os joelhos reduz a alavanca corporal, impondo ~49% da força de reação do solo (GRF) e diminuindo o estresse articular inicial (Kikuchi & Nakazato, 2017).",
        "contraindicacoes": []
    },
    "push_standard": {
        "nome_alternativo": "Standard Push-up",
        "grf_percentual": 64,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "medio", "punho": "medio"},
        "descricao": "Apoie as mãos no solo em largura ligeiramente superior à dos ombros, estendendo as pernas e apoiando a ponta dos pés. Estabeleça uma prancha corporal rígida com glúteos e abdômen contraídos. Flexione os cotovelos descendo o esterno em direção ao solo de forma controlada até que ele fique a poucos centímetros do chão. Empurre o solo com força para estender totalmente os braços.",
        "dicas": [
            "Os cotovelos devem apontar para trás formando um ângulo de 45° com o tronco, nunca de 90°.",
            "Pressione ativamente as pontas dos dedos contra o solo para proteger a articulação do punho.",
            "Expire durante a fase concêntrica (subida) e inspire na fase excêntrica (descida)."
        ],
        "erros": [
            "Cair a pelve (hiperextensão da coluna lombar) por fraqueza do transverso do abdômen.",
            "Executar repetições incompletas por falta de amplitude profunda.",
            "Encolher os ombros indevidamente (falta de depressão escapular)."
        ],
        "frase_cientifica": "A flexão padrão impõe ~64% de carga relativa da força de reação do solo (GRF), sendo equiparável ao supino para hipertrofia do peitoral maior (Calatayud et al., 2015).",
        "contraindicacoes": []
    },
    "push_declined_feet_elevated": {
        "nome_alternativo": "Decline Push-up",
        "grf_percentual": 74,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "alto", "punho": "medio"},
        "descricao": "Posicione as mãos no chão ligeiramente além da largura dos ombros e apoie os pés elevados sobre uma cadeira ou banco estável. Mantenha o corpo rígido em linha reta e o olhar direcionado ligeiramente à frente no chão. Desça o peitoral controladamente em direção ao solo, mantendo a angulação interna dos cotovelos a 45 graus. Empurre o solo estendendo os cotovelos ativamente.",
        "dicas": [
            "A elevação dos pés desloca o vetor gravitacional para a porção superior do peito.",
            "Mantenha o pescoço alinhado com a coluna durante toda a execução.",
            "Controle rigidamente a velocidade da descida para otimizar o tempo sob tensão no feixe clavicular."
        ],
        "erros": [
            "Permitir o relaxamento da pelve, que gera compensação e hiperextensão da coluna lombar.",
            "Cotovelos excessivamente projetados para fora, gerando atrito no complexo do ombro.",
            "Encurtamento da amplitude de movimento devido à fadiga neurológica."
        ],
        "frase_cientifica": "Ao elevar os pés a 60cm, a força de reação do solo (GRF) sobe para ~74% do peso corporal, aumentando a tensão na porção clavicular do peitoral (Maia et al., 2023).",
        "contraindicacoes": ["ombro"]
    },
    "push_diamond": {
        "nome_alternativo": "Diamond Push-up",
        "grf_percentual": 64,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "alto", "ombro": "medio", "punho": "alto"},
        "descricao": "Posicione-se em prancha com as mãos centralizadas sob o peitoral, aproximando os indicadores e polegares para formar o desenho de um diamante. Flexione os cotovelos mantendo-os bem rentes às costelas durante toda a descida, aproximando o peitoral da região das mãos. Empurre o solo de volta estendendo os braços.",
        "dicas": [
            "Mantenha os cotovelos apontando estritamente para trás, maximizando a extensão do cotovelo.",
            "Se sentir dor nos punhos, afaste as mãos ligeiramente mantendo a pegada fechada.",
            "Pressione ativamente as mãos uma contra a outra de forma isométrica durante a execução."
        ],
        "erros": [
            "Cotovelos abrindo lateralmente, sobrecarregando a articulação do punho e ombro.",
            "Não estender completamente os cotovelos no topo, limitando a contração do tríceps.",
            "Deixar o quadril cair em direção ao chão devido ao foco exclusivo nos braços."
        ],
        "frase_cientifica": "A pegada fechada altera a biomecânica articular, elevando drasticamente a atividade eletromiográfica do tríceps braquial e porção medial do peitoral (Schoenfeld, 2024).",
        "contraindicacoes": ["punho", "cotovelo"]
    },
    "push_deficit": {
        "nome_alternativo": "Deficit Push-up",
        "grf_percentual": 64,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "alto", "punho": "medio"},
        "descricao": "Posicione as mãos apoiadas sobre duas superfícies elevadas e estáveis (como dois livros grossos ou blocos) ligeiramente além da largura dos ombros. Afaste os pés e firme o core. Flexione os cotovelos descendo o peitoral além do nível das mãos, gerando um alongamento profundo nas fibras do peitoral maior. Empurre de volta até a extensão total.",
        "dicas": [
            "O déficit permite descer abaixo da linha neutra, aumentando a amplitude ativa.",
            "Foque em sentir o estiramento profundo do peitoral no ponto mais baixo da descida.",
            "Mantenha o movimento altamente controlado na transição excêntrica-concêntrica."
        ],
        "erros": [
            "Descer rápido demais e perder o controle no ponto de estiramento profundo.",
            "Perder a estabilização escapular, gerando rotação anterior dos ombros no ponto baixo.",
            "Usar superfícies instáveis que escorregam ou causam acidentes."
        ],
        "frase_cientifica": "O treinamento em comprimentos musculares longos proporcionado pelo déficit potencializa a hipertrofia mediada pelo alongamento sob tensão (Pedrosa et al., 2022).",
        "contraindicacoes": ["ombro"]
    },
    "push_archer": {
        "nome_alternativo": "Archer Push-up",
        "grf_percentual": 78,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "alto", "ombro": "alto", "punho": "medio"},
        "descricao": "Abra os braços em uma largura bem superior à da flexão tradicional, com as pontas dos dedos apontando ligeiramente para fora. Mantendo a linha rígida do corpo, desça lateralmente flexionando apenas um braço, enquanto o braço oposto se mantém esticado, servindo como guia lateral. Retorne ao topo empurrando ativamente com o braço flexionado.",
        "dicas": [
            "Foque em direcionar a maior parte da força de empurrão para o braço flexionado.",
            "O braço esticado deve funcionar apenas como uma muleta estabilizadora de apoio.",
            "Alterne os lados de forma controlada ou execute séries unilaterais completas."
        ],
        "erros": [
            "Flexionar o cotovelo do braço que deveria permanecer totalmente estendido.",
            "Rotação pélvica excessiva para compensar a falta de força unilateral.",
            "Executar o movimento sem controle, caindo sobre a articulação do ombro ativo."
        ],
        "frase_cientifica": "A flexão arqueiro transfere unilateralmente ~78% da carga relativa sobre o membro de empurrão ativo, gerando sobrecarga progressiva sem pesos (Lopez et al., 2021).",
        "contraindicacoes": ["ombro", "cotovelo"]
    },
    "push_pseudo_planche": {
        "nome_alternativo": "Pseudo-planche Push-up",
        "grf_percentual": 80,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "alto", "punho": "alto"},
        "descricao": "Posicione-se in prancha com as mãos voltadas para trás ou para os lados. Desloque o centro de gravidade e o tronco à frente de modo que as mãos fiquem alinhadas abaixo da cintura ou abdômen. Mantendo essa inclinação anterior rígida, flexione os cotovelos trazendo-os rentes ao tronco até o peitoral quase tocar o solo. Empurre mantendo o avanço.",
        "dicas": [
            "A inclinação anterior gera um braço de alavanca maciço sobre os deltoides anteriores.",
            "Mantenha a coluna torácica protraída (arredondada no topo) na posição inicial e final.",
            "Inicie com uma inclinação modesta e avance gradualmente à medida que os punhos se adaptarem."
        ],
        "erros": [
            "Perder o deslocamento anterior (inclinação) durante a descida, voltando à flexão comum.",
            "Hiperextensão lombar por incapacidade de manter a retroversão pélvica ativa.",
            "Dores agudas no punho por falta de mobilidade prévia de flexão dorsal."
        ],
        "frase_cientifica": "Deslocar o centro de gravidade anterioriza o vetor de torque, resultando em ativação excepcional do deltoide anterior e feixes claviculares do peito (Schoenfeld, 2024).",
        "contraindicacoes": ["punho", "ombro"]
    },

    // 2. PUSH VERTICAL (OMBROS)
    "pike_inclined": {
        "nome_alternativo": "Incline Pike Push-up",
        "grf_percentual": 60,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo"},
        "descricao": "Apoie as mãos sobre uma superfície elevada e firme (como um banco ou mesa baixa). Caminhe com os pés em direção à base até elevar o quadril em formato de V invertido. Flexione os cotovelos trazendo a cabeça à frente das mãos de forma controlada. Empurre a base estendendo os cotovelos e elevando o quadril.",
        "dicas": [
            "A inclinação inicial reduz a sobrecarga vertical comparada à versão no solo.",
            "Garanta que a cabeça desça à frente das mãos formando a ponta de um triângulo.",
            "Mantenha as pernas esticadas e o quadril fixo no topo."
        ],
        "erros": [
            "Descer o topo da cabeça diretamente entre as mãos, sobrecarregando o acrômio.",
            "Dobrar os joelhos excessivamente em vez de flexionar os quadris.",
            "Perda de alinhamento cervical (olhar para a parede em vez do banco)."
        ],
        "frase_cientifica": "A flexão pike inclinada oferece transição segura para o padrão de empurrar vertical, reduzindo a força compressiva acromioclavicular (Calatayud et al., 2015).",
        "contraindicacoes": []
    },
    "pike_standard": {
        "nome_alternativo": "Pike Push-up",
        "grf_percentual": 68,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "medio", "punho": "medio"},
        "descricao": "No solo, adote a posição de V invertido aproximando os pés das mãos e empinando o quadril com o tronco o mais vertical possível. Mantenha os joelhos e cotovelos estendidos. Flexione os cotovelos de forma controlada trazendo a cabeça à frente da linha das mãos no solo. Empurre com força para retornar à posição inicial.",
        "dicas": [
            "Cotovelos devem rastrear uma diagonal de aproximadamente 45 graus com relação às costelas.",
            "Foque em empurrar o solo para longe, direcionando a força através dos deltoides.",
            "Mantenha o core rígido para evitar compensações e oscilações da pelve."
        ],
        "erros": [
            "Abrir os cotovelos para os lados (ângulo de 90°), gerando estresse e impacto subacromial.",
            "Descer a cabeça diretamente entre as mãos eliminando a trajetória em triângulo.",
            "Arredondamento excessivo da coluna lombar por falta de flexibilidade de isquiotibiais."
        ],
        "frase_cientifica": "A angulação verticaliza o eixo tensional para as porções anterior e média do deltoide e tríceps, emulando o desenvolvimento com barra (Kotarsky et al., 2018).",
        "contraindicacoes": ["ombro"]
    },
    "wall_walk": {
        "nome_alternativo": "Wall Walk",
        "grf_percentual": 85,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "alto", "punho": "alto"},
        "descricao": "Inicie em posição de flexão padrão com os pés apoiados na base de uma parede sólida. Faça uma flexão e caminhe com as mãos para trás enquanto sobe com os pés pela parede, verticalizando o corpo. Aproxime-se da parede o máximo possível mantendo o core ativado de forma isométrica. Caminhe de volta controladamente.",
        "dicas": [
            "Foque em manter as escápulas empurradas ativamente para cima (protração e elevação).",
            "Mantenha o core contraído o tempo todo para anular a hiperextensão da coluna.",
            "Execute passos pequenos com as mãos para manter o equilíbrio sob controle."
        ],
        "erros": [
            "Deixar o quadril ceder gerando hiperextensão lombar severa (formato de banana).",
            "Prender a respiração (valsa de Valsalva excessiva) durante a permanência de cabeça para baixo.",
            "Descer de forma rápida ou descontrolada, com risco de queda sobre o pescoço."
        ],
        "frase_cientifica": "O wall walk recruta maciçamente o trapézio, deltoides e estabilizadores do manguito rotador sob estresse compressivo vertical elevado (Schoenfeld, 2024).",
        "contraindicacoes": ["ombro", "punho", "cervical"]
    },
    "pike_feet_elevated": {
        "nome_alternativo": "Elevated Pike Push-up",
        "grf_percentual": 75,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "medio", "ombro": "medio", "punho": "medio"},
        "descricao": "Apoie as pontas dos pés em uma cadeira firme e as mãos no chão. Caminhe com as mãos para trás, flexionando o quadril em 90 graus até que o tronco fique perpendicular ao solo. Mantendo as pernas elevadas, flexione os cotovelos e desça a cabeça à frente das mãos. Empurre o solo estendendo os braços.",
        "dicas": [
            "A elevação dos pés verticaliza o vetor de carga e aumenta a fração do peso empurrada.",
            "Desça lentamente até o topo da cabeça quase encostar no solo de forma controlada.",
            "Empurre ativamente o solo no topo da repetição para encaixar os ombros."
        ],
        "erros": [
            "Não manter o quadril flexionado a 90 graus, transformando o exercício em uma flexão declinada comum.",
            "Cotovelos abertos para os lados gerando alto estresse compressivo anterior do ombro.",
            "Olhar para o chão de forma tensionada, estressando a musculatura cervical posterior."
        ],
        "frase_cientifica": "A elevação de pés na flexão pike verticaliza a carga gravitacional a ~75% do peso corporal, gerando alta ativação do deltoide e tríceps (Kotarsky et al., 2018).",
        "contraindicacoes": ["ombro"]
    },
    "hspu_eccentric": {
        "nome_alternativo": "Eccentric Wall HSPU",
        "grf_percentual": 90,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "alto", "ombro": "alto", "punho": "alto"},
        "descricao": "Fique em posição de parada de mão (bananeira) com os calcanhares apoiados contra a parede. Com o corpo rígido e calcanhares deslizando sutilmente, execute a descida controlando a queda por 4 a 6 segundos, até que o topo da cabeça toque suavemente o solo. Desça os pés de forma segura e reinicie.",
        "dicas": [
            "Use um colchonete ou almofada macia sob a cabeça para proteção de impacto capsular.",
            "Desça em trajetória triangular: as mãos formam a base e a cabeça forma o ápice anterior.",
            "Foque em frear ativamente com o tríceps e deltoides em toda a amplitude de descida."
        ],
        "erros": [
            "Descer rápido demais na metade final do movimento por perda de força excêntrica.",
            "Deixar os cotovelos abrirem lateralmente de forma perpendicular à parede.",
            "Bater a cabeça com violência contra o solo por falta de força amortecedora."
        ],
        "frase_cientifica": "O foco excêntrico sobrecarrega as fibras em comprimentos musculares longos, estimulando síntese miofibrilar mesmo com limitações de força concêntrica (Maeo et al., 2023).",
        "contraindicacoes": ["ombro", "punho", "cotovelo", "cervical"]
    },
    "hspu_full": {
        "nome_alternativo": "Full Wall HSPU",
        "grf_percentual": 92,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "alto", "ombro": "alto", "punho": "alto"},
        "descricao": "Adote a posição de parada de mão com apoio na parede. Flexione os cotovelos de forma controlada trazendo a cabeça à frente das mãos até o leve toque no solo. Em seguida, empurre o solo de forma explosiva estendendo totalmente os cotovelos e retornando à verticalidade plena.",
        "dicas": [
            "Mantenha o core rígido de forma isométrica para evitar oscilações pélvicas.",
            "Empurre com força através das palmas das mãos, focando em afastar o chão.",
            "Use a parede apenas como estabilizador leve do equilíbrio dos calcanhares."
        ],
        "erros": [
            "Executar repetições curtas sem encostar a cabeça próximo ao solo.",
            "Curvar excessivamente as costas na subida, convertendo o vetor de carga em supino inclinado.",
            "Perder o controle do equilíbrio e chocar o quadril contra a parede lateral."
        ],
        "frase_cientifica": "O Handstand Push-up completo impõe ~92% de carga relativa sobre o eixo vertical, representando o ápice biomecânico de empurrar sem pesos (Schoenfeld, 2024).",
        "contraindicacoes": ["ombro", "punho", "cotovelo", "cervical"]
    },

    // 3. PULL (COSTAS E BÍCEPS)
    "pull_floor_sliding": {
        "nome_alternativo": "Sliding Floor Pulldown",
        "grf_percentual": 50,
        "articulacoes": ["cotovelo", "ombro"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo"},
        "descricao": "Deite-se de bruços (decúbito ventral) em um piso liso, com duas toalhas ou panos sob as palmas das mãos com os braços totalmente estendidos à frente. Contraia os glúteos e eretores da espinha de forma isométrica. Pressione as mãos contra as toalhas e use a musculatura das costas para puxar o corpo à frente, arrastando-o no solo. Retorne empurrando o corpo para trás.",
        "dicas": [
            "Pressione firmemente as palmas das mãos contra o chão para criar a fricção necessária.",
            "Mantenha os ombros deprimidos e ative as asas das costas (latíssimo) ao puxar.",
            "Use a fricção deliberada do solo como regulador da intensidade da remada."
        ],
        "erros": [
            "Dobrar as pernas ou usá-las para ajudar no empuxo do corpo.",
            "Executar o movimento com o pescoço tensionado e hiperextendido à frente.",
            "Realizar no piso áspero, que anula a capacidade de deslizamento fluído das toalhas."
        ],
        "frase_cientifica": "Este movimento emula biomecanicamente o pulldown usando o atrito dinâmico horizontal como elemento gerador de tensão no latíssimo do dorso (Stuart McGill, 2019).",
        "contraindicacoes": []
    },
    "row_sheet_doorway": {
        "nome_alternativo": "Doorway Sheet Row",
        "grf_percentual": 45,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo"},
        "descricao": "Dê um nó firme no meio de um lençol resistente e trave-o atrás de uma porta sólida trancada. Segure as pontas do lençol com ambas as mãos, apoie os pés próximos à base da porta e incline o corpo para trás até estender totalmente os braços. Realize a remada tracionando o peitoral em direção às mãos com controle. Retorne lentamente.",
        "dicas": [
            "Aproxime os pés da base da porta para aumentar a inclinação e a sobrecarga gravitacional.",
            "Mantenha o corpo perfeitamente ereto como uma prancha sólida em todas as fases.",
            "Deprima e retraia as escápulas no final da fase concêntrica (puxada)."
        ],
        "erros": [
            "Permitir que o quadril ceda para trás durante a remada (flexão lombar compensatória).",
            "Executar a puxada usando apenas a força do bíceps, sem ativar a musculatura das costas.",
            "Ignorar a segurança do nó e da porta, gerando riscos reais de queda."
        ],
        "frase_cientifica": "A remada em lençol na porta ativa a musculatura posterior da cintura escapular com cisalhamento espinhal mínimo, ideal para iniciantes (Stuart McGill, 2019).",
        "contraindicacoes": []
    },
    "row_table_inverted": {
        "nome_alternativo": "Inverted Table Row",
        "grf_percentual": 60,
        "articulacoes": ["cotovelo", "ombro", "punho", "lombar"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo", "lombar": "baixo"},
        "descricao": "Posicione-se deitado sob uma mesa de jantar muito estável e resistente. Segure a borda com ambas as mãos em pronação ou supinação na largura dos ombros. Mantendo os calcanhares no solo e o corpo totalmente estendido e reto, puxe o esterno contra a superfície inferior da mesa ativando as costas. Desça controladamente até estender os braços.",
        "dicas": [
            "Mantenha uma retração e depressão escapular vigorosas no pico da contração.",
            "Use a pegada supinada para recrutar mais intensamente o bíceps braquial.",
            "Mantenha o quadril alto e os glúteos ativos em toda a amplitude de movimento."
        ],
        "erros": [
            "Deixar o quadril ceder por falta de ativação dos glúteos e cadeia posterior.",
            "Tocar o abdômen na mesa em vez do peitoral inferior por perda de alinhamento.",
            "Desça soltando o peso sem controle na fase excêntrica do movimento."
        ],
        "frase_cientifica": "A remada invertida recruta intensamente o latíssimo do dorso e romboides com a menor carga de cisalhamento lombar medida em laboratório (McGill et al., 2019).",
        "contraindicacoes": []
    },
    "row_doorway_unilateral": {
        "nome_alternativo": "Unilateral Doorway Row",
        "grf_percentual": 50,
        "articulacoes": ["cotovelo", "ombro", "punho"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo"},
        "descricao": "Fique de pé de lado em relação a um batente de porta aberta. Segure o batente firmemente com uma das mãos na altura do peito, apoie os pés próximos à parede da porta e incline o corpo para trás até estender totalmente o braço ativo. Puxe o corpo em direção ao batente de forma controlada. Retorne estendendo totalmente.",
        "dicas": [
            "Aproxime os pés do batente para intensificar o braço de alavanca e a resistência.",
            "Use o braço livre para estabilizar e guiar o quadril sem ajudar na puxada.",
            "Controle a rotação do tronco para isolar de forma pura o latíssimo unilateral."
        ],
        "erros": [
            "Puxar rápido demais e bater o ombro contra o batente da porta.",
            "Rotação excessiva e descontrolada da pelve para compensar a fraqueza do dorsal.",
            "Falta de firmeza na pegada, o que pode causar fadiga excessiva e precoce do antebraço."
        ],
        "frase_cientifica": "Isolar cada lado unilateralmente no batente de porta equilibra assimetrias musculares e aprofunda o estiramento ativo do latíssimo do dorso (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "row_feet_elevated": {
        "nome_alternativo": "Elevated Inverted Row",
        "grf_percentual": 70,
        "articulacoes": ["cotovelo", "ombro", "punho", "lombar"],
        "estresse": {"cotovelo": "baixo", "ombro": "baixo", "punho": "baixo", "lombar": "baixo"},
        "descricao": "Sob uma mesa estável e resistente, segure a borda com as mãos enquanto apoia os calcanhares elevados sobre uma cadeira firme. Alinhe o corpo perfeitamente paralelo ao solo de forma rígida. Realize a puxada tracionando o esterno em direção à mesa. Desça controladamente na fase excêntrica.",
        "dicas": [
            "Elevar os pés no banco remove a ajuda das pernas e aumenta a carga relativa de tração.",
            "Execute pausas isométricas de 1 a 2 segundos no pico de contração no topo.",
            "Mantenha o peito aberto e a coluna alinhada durante todo o ciclo."
        ],
        "erros": [
            "Pele pélvica caída devido à falta de contração lombar e dos glúteos.",
            "Cotovelos muito abertos gerando estresse na cápsula articular posterior do ombro.",
            "Encurtar a fase de descida, sem estender totalmente os cotovelos."
        ],
        "frase_cientifica": "A elevação de calcanhares eleva o peso relativo suspenso a ~70% do peso corporal, potencializando a tensão nas fibras dorsais superiores (McGill, 2019).",
        "contraindicacoes": []
    },
    "reverse_snow_angels": {
        "nome_alternativo": "Reverse Snow Angels",
        "grf_percentual": 10,
        "articulacoes": ["ombro", "cotovelo"],
        "estresse": {"ombro": "baixo", "cotovelo": "baixo"},
        "descricao": "Deite-se de bruços com a testa apoiada em um colchonete fino e os braços esticados ao lado do corpo, palmas para baixo. Eleve os braços do solo retraindo as escápulas. Movimente os braços em círculo para a frente até as mãos quase se encontrarem sobre a cabeça. Retorne em arco ao início sem tocar as mãos no chão.",
        "dicas": [
            "Mantenha as mãos e braços elevados do solo durante todo o trajeto circular.",
            "Foque na contração consciente dos romboides, trapézio e deltoide posterior.",
            "Realize o movimento de forma lenta e cadenciada, maximizando a isometria posterior."
        ],
        "erros": [
            "Hiperestender o pescoço olhando para a frente, tensionando a cervical superior.",
            "Tocar as mãos ou antebraços no solo durante a fase de retorno excêntrico.",
            "Usar impulsos e balanços em vez de força muscular posterior pura e sustentada."
        ],
        "frase_cientifica": "Este exercício postural dinâmico ativa intensamente os romboides, deltoide posterior e eretores superiores sob tensão gravitacional pura (Pedrosa et al., 2022).",
        "contraindicacoes": []
    },
    "superman": {
        "nome_alternativo": "Superman",
        "grf_percentual": 15,
        "articulacoes": ["lombar", "ombro"],
        "estresse": {"lombar": "medio", "ombro": "baixo"},
        "descricao": "Deite-se de bruços no solo com braços esticados à frente e pernas estendidas atrás. Contraia simultaneamente os eretores espinhais, glúteos e posteriores para elevar o peitoral e as coxas do solo, mantendo o corpo apoiado apenas no abdômen. Pause por 2 segundos no pico e retorne.",
        "dicas": [
            "Foque em alongar o corpo (esticar à frente e atrás) enquanto realiza a elevação.",
            "Mantenha a cabeça neutra olhando para o solo para evitar sobrecarga cervical.",
            "Execute a descida de forma totalmente controlada e sem despencar contra o chão."
        ],
        "erros": [
            "Dobrar excessivamente os joelhos em vez de elevar a coxa inteira pela articulação do quadril.",
            "Hiperextensão cervical aguda (olhar para cima tensionando o pescoço).",
            "Movimentos rápidos de balanço em vez de contração estática e controlada."
        ],
        "frase_cientifica": "A extensão combinada da pelve e complexo do ombro gera alta ativação isométrica nos eretores da espinha e multífidos lombares (Schoenfeld, 2024).",
        "contraindicacoes": ["lombar"]
    },

    // 4. JOELHO DOMINANTE (QUADRÍCEPS E GLÚTEOS)
    "squat_slow": {
        "nome_alternativo": "Slow Bodyweight Squat",
        "grf_percentual": 85,
        "articulacoes": ["joelho", "quadril", "tornozelo"],
        "estresse": {"joelho": "baixo", "quadril": "baixo", "tornozelo": "baixo"},
        "descricao": "Fique de pé com os pés afastados na largura dos ombros, pontas ligeiramente apontadas para fora. Inicie a descida projetando o quadril para trás e flexionando os joelhos de forma extremamente lenta (4 segundos de descida), até que as coxas fiquem paralelas ou abaixo da linha do solo. Suba estendendo joelhos de forma contínua.",
        "dicas": [
            "Mantenha o peito aberto e o tronco o mais verticalizado possível durante toda a execução.",
            "Empurre os joelhos para fora na mesma direção apontada pelas pontas dos pés.",
            "Distribua o peso igualmente sobre toda a planta dos pés (trípode do pé)."
        ],
        "erros": [
            "Desabar o peito à frente flexionando excessivamente a coluna lombar.",
            "Valgo dinâmico (joelhos convergindo para dentro na fase de subida concêntrica).",
            "Retirar os calcanhares do solo devido à falta de mobilidade do tornozelo."
        ],
        "frase_cientifica": "Controlar deliberadamente a fase excêntrica de descida em 4 segundos aumenta o tempo sob tensão e fadiga de fibras sem cargas extras (Maeo et al., 2023).",
        "contraindicacoes": []
    },
    "squat_assisted": {
        "nome_alternativo": "Assisted Deep Squat",
        "grf_percentual": 60,
        "articulacoes": ["joelho", "quadril"],
        "estresse": {"joelho": "baixo", "quadril": "baixo"},
        "descricao": "Segure levemente em uma estrutura firme (como um batente de porta ou parede) na altura da cintura. Com os pés bem apoiados, realize um agachamento profundo descendo o quadril ao máximo possível de forma controlada. Use a força dos braços apenas para auxiliar no equilíbrio e na subida.",
        "dicas": [
            "O suporte permite verticalizar totalmente o tronco, focando a tensão no quadríceps.",
            "Desça até a amplitude profunda máxima permitida pela articulação do joelho.",
            "Pressione ativamente os calcanhares contra o solo durante toda a subida concêntrica."
        ],
        "erros": [
            "Usar excessivamente os braços para puxar o corpo, reduzindo o trabalho das pernas.",
            "Deixar os calcanhares subirem mesmo com o apoio estabilizador das mãos.",
            "Não manter os joelhos alinhados com a ponta dos pés na fase profunda."
        ],
        "frase_cientifica": "O suporte externo reduz a demanda de equilíbrio estabilizador, viabilizando o agachamento profundo com excelente amplitude e segurança articular (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "lunge": {
        "nome_alternativo": "Forward Lunge",
        "grf_percentual": 75,
        "articulacoes": ["joelho", "quadril"],
        "estresse": {"joelho": "medio", "quadril": "baixo"},
        "descricao": "Fique de pé com pés juntos. Dê um passo largo à frente e flexione ambos os joelhos simultaneamente até que a coxa da perna da frente fique paralela ao solo e o joelho de trás fique a poucos centímetros do chão. Empurre o solo com a perna da frente retornando à posição inicial.",
        "dicas": [
            "Mantenha o tronco levemente inclinado à frente para maior estabilização mecânica.",
            "O joelho da perna da frente deve seguir o mesmo alinhamento do segundo dedo do pé.",
            "Mantenha os quadris paralelos apontando diretamente à frente durante o passo."
        ],
        "erros": [
            "Dar um passo muito curto, fazendo o calcanhar da perna da frente se elevar do solo.",
            "Bater o joelho de trás contra o chão de forma abrupta e sem controle.",
            "Inclinar o tronco excessivamente para o lado da perna ativa devido a desequilíbrio."
        ],
        "frase_cientifica": "A passada impõe sobrecarga unilateral alternada dinâmica, ativando intensamente o quadríceps e estabilizadores pélvicos (Kotarsky et al., 2018).",
        "contraindicacoes": []
    },
    "reverse_lunge": {
        "nome_alternativo": "Reverse Lunge",
        "grf_percentual": 75,
        "articulacoes": ["joelho", "quadril"],
        "estresse": {"joelho": "baixo", "quadril": "baixo"},
        "descricao": "A partir da posição em pé, dê um passo largo para trás de forma controlada. Flexione ambos os joelhos até que o joelho traseiro fique rente ao solo e a coxa frontal fique paralela ao chão. Empurre o solo de volta projetando a força na perna frontal para retornar ao início.",
        "dicas": [
            "Dar o passo para trás reduz significativamente a força de cisalhamento patelar no joelho.",
            "Projete o peito ligeiramente à frente para otimizar a ativação da cadeia posterior.",
            "Mantenha a base firme distribuindo o peso na perna da frente durante a descida."
        ],
        "erros": [
            "Deixar o quadril rodar externamente durante o passo para trás por falta de estabilidade.",
            "Descer rápido demais de forma desalinhada, perdendo a firmeza na transição concêntrica.",
            "Colocar o pé traseiro diretamente atrás do frontal (falta de largura na passada)."
        ],
        "frase_cientifica": "O lunge reverso reduz a força compressiva patelofemoral inicial em comparação ao lunge frontal, preservando a articulação do joelho (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "split_squat": {
        "nome_alternativo": "Split Squat",
        "grf_percentual": 75,
        "articulacoes": ["joelho", "quadril"],
        "estresse": {"joelho": "medio", "quadril": "baixo"},
        "descricao": "Adote uma postura de passada estática com um pé avançado à frente e o pé oposto posicionado atrás. Sem mover os pés do solo, flexione os joelhos descendo o quadril na vertical até que a coxa frontal fique paralela ao chão. Empurre com a perna da frente subindo verticalmente.",
        "dicas": [
            "Mantenha o calcanhar do pé traseiro sempre elevado do solo em todas as fases.",
            "Distribua ~75% de toda a força do empuxo na perna posicionada à frente.",
            "Mantenha os quadris perfeitamente alinhados e apontados diretamente à frente."
        ],
        "erros": [
            "Permitir o joelho frontal desabar para dentro (valgo dinâmico) devido a glúteo fraco.",
            "Deslocar o tronco lateralmente para compensar desequilíbrios na base unilateral.",
            "Não descer na vertical, projetando o corpo diagonalmente à frente e elevando o calcanhar."
        ],
        "frase_cientifica": "A execução estática unilateral no split squat isola a musculatura agonista com alta ativação proprioceptiva e estabilização pélvica (Lopez et al., 2021).",
        "contraindicacoes": []
    },
    "bss_quad_bias": {
        "nome_alternativo": "Quad-Biased BSS",
        "grf_percentual": 85,
        "articulacoes": ["joelho", "quadril"],
        "estresse": {"joelho": "medio", "quadril": "baixo"},
        "descricao": "Fique de costas para uma cadeira estável, apoie o peito de um dos pés sobre o assento e posicione a perna da frente a uma distância média. Mantendo o tronco rigorosamente ereto, desça verticalmente flexionando o joelho frontal até que ele avance ligeiramente além da linha dos dedos do pé. Empurre com o quadríceps frontal.",
        "dicas": [
            "A passada mais curta e tronco ereto direcionam as tensões mecânicas para o quadríceps.",
            "Mantenha o peito aberto e a pelve neutra de forma estável durante o ciclo.",
            "Use o pé de trás na cadeira apenas como um ponto de equilíbrio proprioceptivo leve."
        ],
        "erros": [
            "Descer inclinando o tronco à frente, o que remove a tensão do quadríceps frontal.",
            "Executar em superfície traseira instável ou muito alta, desalinhando o quadril.",
            "Não permitir o avanço controlado do joelho patelar frontal à frente do pé."
        ],
        "frase_cientifica": "A postura ereta com passada curta eleva a compressão patelar frontal e isola o vasto lateral e reto femoral (Pedrosa et al., 2022).",
        "contraindicacoes": ["joelho"]
    },
    "bss_glute_bias": {
        "nome_alternativo": "Glute-Biased BSS",
        "grf_percentual": 85,
        "articulacoes": ["joelho", "quadril"],
        "estresse": {"joelho": "baixo", "quadril": "medio"},
        "descricao": "Apoie o pé traseiro na cadeira estável e projete a perna da frente em um passo significativamente longo. Durante a descida do quadril, incline o tronco à frente (cerca de 30 a 45 graus) de forma rígida, mantendo a coluna alinhada. Mantenha a canela da frente quase vertical no ponto baixo. Suba empurrando com o calcanhar.",
        "dicas": [
            "A inclinação fletida do tronco maximiza o alongamento e recrutamento das fibras do glúteo.",
            "Evite arredondar as costas; a inclinação deve ocorrer unicamente pela articulação do quadril.",
            "Desça até sentir o glúteo e os posteriores da perna da frente se alongarem profundamente."
        ],
        "erros": [
            "Arredondar a coluna lombar (cifose compensatória) ao inclinar o tronco à frente.",
            "Encurtar a passada traseira, empurrando o joelho frontal muito à frente do tornozelo.",
            "Utilizar o membro traseiro elevado para empurrar o corpo para cima na subida."
        ],
        "frase_cientifica": "A flexão pélvica anteriorizada alonga profundamente o glúteo maior sob carga de ~85% BW na perna ativa frontal (Schoenfeld, 2024).",
        "contraindicacoes": ["quadril", "lombar"]
    },
    "sissy_squat_assisted": {
        "nome_alternativo": "Assisted Sissy Squat",
        "grf_percentual": 70,
        "articulacoes": ["joelho", "tornozelo"],
        "estresse": {"joelho": "alto", "tornozelo": "baixo"},
        "descricao": "Segure com uma das mãos em uma estrutura firme na altura do peitoral. Eleve-se sobre a ponta dos pés flexionando os joelhos para a frente e projetando o tronco para trás em linha reta firme (dos joelhos aos ombros). Desça os joelhos em direção ao solo com controle absoluto. Empurre estendendo joelhos.",
        "dicas": [
            "Foque em manter os quadris totalmente estendidos durante toda a execução.",
            "Inicie com amplitudes curtas de movimento até fortalecer a fáscia e tendão patelares.",
            "Use o apoio da mão apenas para estabilizar o equilíbrio no plano de descão."
        ],
        "erros": [
            "Flexionar o quadril (sentar para trás), eliminando toda a tensão no quadríceps e reto femoral.",
            "Realizar de forma explosiva ou descontrolada, com alto risco de impacto capsular interno.",
            "Tentar descer sem aquecimento prévio das articulações do joelho e tornozelos."
        ],
        "frase_cientifica": "O sissy squat gera máxima tensão de estiramento no reto femoral ao combinar extensão de quadril e flexão profunda de joelho (Maeo et al., 2023).",
        "contraindicacoes": ["joelho"]
    },
    "pistol_assisted": {
        "nome_alternativo": "Assisted Pistol Squat",
        "grf_percentual": 80,
        "articulacoes": ["joelho", "quadril", "tornozelo"],
        "estresse": {"joelho": "alto", "quadril": "medio", "tornozelo": "baixo"},
        "descricao": "Fique em um pé só, com a mão oposta apoiada levemente em uma parede ou suporte firme. Estenda a perna livre à frente. Execute um agachamento profundo unilateral na perna ativa, descendo de forma controlada até onde a mobilidade permitir. Empurre o solo retornando ao topo.",
        "dicas": [
            "Use o calcanhar da perna ativa firmemente ancorado contra o chão em todas as fases.",
            "O suporte lateral elimina a exigência limitante de equilíbrio, focando o estímulo no quadríceps.",
            "Mantenha o abdômen contraído para estabilizar o tronco no ponto profundo de descida."
        ],
        "erros": [
            "Deixar o calcanhar da perna ativa elevar-se do solo durante a descida profunda.",
            "Valgo dinâmico agudo (joelho ativo desabando para dentro) na transição de subida.",
            "Puxar-se ativamente com as mãos no suporte em vez de usar a musculatura da coxa."
        ],
        "frase_cientifica": "O suporte neutraliza a barreira proprioceptiva do equilíbrio, permitindo o isolamento neuromuscular unilateral do quadríceps frontal (Lopez et al., 2021).",
        "contraindicacoes": ["joelho"]
    },

    // 5. QUADRIL DOMINANTE (POSTERIOR E GLÚTEOS)
    "glute_bridge": {
        "nome_alternativo": "Glute Bridge",
        "grf_percentual": 55,
        "articulacoes": ["lombar", "quadril"],
        "estresse": {"lombar": "baixo", "quadril": "baixo"},
        "descricao": "Deite-se de costas (decúbito dorsal) com os joelhos flexionados e os pés apoiados no solo próximos aos glúteos. Com os braços estendidos ao lado do corpo, contraia ativamente o core e os glúteos para elevar o quadril até que ele fique alinhado com os joelhos e ombros. Esmerilhe a contração no topo e desça.",
        "dicas": [
            "Pressione ativamente os calcanhares contra o solo para recrutar a cadeia isquiotibial.",
            "Execute uma retroversão pélvica ativa (encaixar o quadril) no pico da contração.",
            "Evite usar as mãos e braços no chão para empurrar o quadril para cima."
        ],
        "erros": [
            "Hiperextender la coluna lombar (criar arco nas costas) no topo em vez de estender o quadril.",
            "Executar de forma rápida, sem contrair ativamente os glúteos no pico de contração.",
            "Afastar os pés excessivamente à frente, o que retira a dominância mecânica do glúteo."
        ],
        "frase_cientifica": "A ponte de glúteos ativa a cadeia posterior de forma isolada com excelente segurança e baixo cisalhamento lombar (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "glute_bridge_unilateral": {
        "nome_alternativo": "Single-leg Glute Bridge",
        "grf_percentual": 75,
        "articulacoes": ["lombar", "quadril"],
        "estresse": {"lombar": "baixo", "quadril": "baixo"},
        "descricao": "Em decúbito dorsal com joelhos flexionados, eleve uma das pernas do solo estendendo-a ou mantendo o joelho flexionado. Pressione o calcanhar da perna de apoio firmemente contra o chão e eleve o quadril de forma controlada até alinhar a pelve. Segure 1 segundo no topo e desça lentamente.",
        "dicas": [
            "Mantenha a pelve perfeitamente nivelada, sem deixar o lado sem apoio desabar lateralmente.",
            "Foque em espremer ativamente o glúteo da perna ativa no ponto mais alto da subida.",
            "Pressione as escápulas contra o solo para estabilizar a cintura escapular superior."
        ],
        "erros": [
            "Rotação lateral ou desalinhamento da pelve por fraqueza do glúteo médio estabilizador.",
            "Uso de impulsos rápidos para subir o quadril em vez de contração controlada unilateral.",
            "Arredondamento cervical por tensionar o pescoço ao subir o quadril."
        ],
        "frase_cientifica": "O trabalho unilateral isola assimetrias e dobra a carga relativa sobre o glúteo maior e isquiotibiais da perna ativa (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "hip_thrust_chair": {
        "nome_alternativo": "Chair Hip Thrust",
        "grf_percentual": 65,
        "articulacoes": ["lombar", "quadril"],
        "estresse": {"lombar": "baixo", "quadril": "baixo"},
        "descricao": "Apoie a porção média das costas (região escapular inferior) na beirada de uma cadeira firme ou sofá. Flexione os joelhos e apoie os pés no solo. Desça o quadril de forma controlada mantendo o olhar à frente. Empurre ativamente com os calcanhares elevando o quadril até alinhar o tronco paralelo ao solo.",
        "dicas": [
            "O apoio elevado das costas aumenta a amplitude de flexão e extensão do quadril.",
            "Mantenha o queixo apontado em direção ao peitoral (olhar fixo à frente) durante todo o ciclo.",
            "Pressione firmemente os calcanhares no solo no ponto de máxima extensão do quadril."
        ],
        "erros": [
            "Olhar para o teto durante a subida, gerando hiperextensão severa da coluna lombar.",
            "Apoiar as costas incorretamente na cadeira, com risco de escorregar ou perder a base.",
            "Não alcançar a extensão pélvica completa por fadiga do glúteo máximo."
        ],
        "frase_cientifica": "O hip thrust em cadeira otimiza o braço de alavanca para o glúteo maior, gerando excelente tensão na posição encurtada (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "hip_thrust_unilateral": {
        "nome_alternativo": "Single-leg Hip Thrust",
        "grf_percentual": 80,
        "articulacoes": ["lombar", "quadril"],
        "estresse": {"lombar": "baixo", "quadril": "baixo"},
        "descricao": "Apoie a porção média das costas na cadeira e eleve uma perna do solo. Con o pé da perna ativa bem apoiado, desça o quadril lentamente. Empurre com o calcanhar ativo elevando o quadril com força e controle até alinhar a pelve com os ombros de forma horizontal. Pause e desça controladamente.",
        "dicas": [
            "Estabilize rigidamente o core para prevenir qualquer rotação compensatória do quadril.",
            "A elevação unilateral é uma das melhores ferramentas para hipertrofia isolada do glúteo em casa.",
            "Controle rigorosamente a velocidade da descida excêntrica para maior tempo sob tensão."
        ],
        "erros": [
            "Deixar o quadril da perna suspensa cair lateralmente durante a fase de subida.",
            "Executar o movimento com amplitude reduzida por falta de força pura no membro ativo.",
            "Balançar os braços ou usar força escapular para ajudar no empuxo pélvico."
        ],
        "frase_cientifica": "A elevação pélvica unilateral proporciona sobrecarga de ~80% BW focada na cadeia posterior, com ativação recorde do glúteo máximo (Lopez et al., 2021).",
        "contraindicacoes": []
    },
    "single_leg_rdl": {
        "nome_alternativo": "SLRDL",
        "grf_percentual": 80,
        "articulacoes": ["lombar", "quadril"],
        "estresse": {"lombar": "baixo", "quadril": "medio"},
        "descricao": "Fique em pé em uma perna, mantendo o joelho ativo ligeiramente flexionado (cerca de 15 graus). Flexione o quadril inclinando o tronco à frente de forma reta, enquanto estende a perna livre para trás, paralela ao solo, formando uma linha reta. Desça até sentir os isquiotibiais alongarem. Suba pelo quadril.",
        "dicas": [
            "Mantenha a coluna vertebral perfeitamente alinhada e reta durante toda a execução.",
            "Projete o quadril para trás como se estivesse tentando fechar uma porta com o glúteo.",
            "Se tiver dificuldade de equilíbrio, execute próximo a uma parede apoiando um dedo levemente."
        ],
        "erros": [
            "Arredondar a coluna lombar durante a descida (cifose espinhal por falta de controle).",
            "Girar o quadril da perna traseira aberta para o lado, perdendo o alinhamento pélvico neutro.",
            "Flexionar excessivamente o joelho da perna ativa, transformando o exercício em um lunge."
        ],
        "frase_cientifica": "O Romanian Deadlift unilateral estressa intensamente os isquiotibiais em alongamento ativo sob controle excêntrico primário (Pedrosa et al., 2022).",
        "contraindicacoes": []
    },
    "slider_hamstring_curl": {
        "nome_alternativo": "Slider Hamstring Curl",
        "grf_percentual": 60,
        "articulacoes": ["joelho", "quadril", "lombar"],
        "estresse": {"joelho": "medio", "quadril": "baixo", "lombar": "baixo"},
        "descricao": "Em decúbito dorsal, posicione duas toalhas sob os calcanhares em um piso liso. Eleve o quadril na posição de ponte de glúteos. Mantendo o quadril alto, deslize lentamente as pernas para a frente estendendo os joelhos. Em seguida, puxe os calcanhares com força na direção dos glúteos.",
        "dicas": [
            "Mantenha os glúteos e abdômen contraídos para que o quadril não encoste no chão no ponto final.",
            "Foque na flexão ativa do joelho sob atrito cinético constante no retorno concêntrico.",
            "Controle a fase de deslizamento à frente para um estímulo excêntrico de alta tensão."
        ],
        "erros": [
            "Deixar o quadril despencar no solo no momento em que as pernas se estendem à frente.",
            "Puxar as pernas rápido demais sem controle de atrito no retorno concêntrico.",
            "Sentir dores lombares por falta de contração abdominal estável durante as extensões."
        ],
        "frase_cientifica": "A remada deslizante de pernas recruta os isquiotibiais com alta ativação eletromiográfica por ação isocinética contra o atrito cinético (Maeo et al., 2023).",
        "contraindicacoes": []
    },
    "nordic_assisted": {
        "nome_alternativo": "Assisted Nordic Curl",
        "grf_percentual": 85,
        "articulacoes": ["joelho", "quadril", "lombar"],
        "estresse": {"joelho": "alto", "quadril": "baixo", "lombar": "baixo"},
        "descricao": "Ajoelhe-se em um colchonete macio com os tornozelos firmemente travados sob uma estrutura pesada (como um sofá ou com a ajuda de um parceiro). Mantendo o corpo reto do joelho à cabeça, incline-se à frente controlando a descida com os isquiotibiais. Use as mãos para empurrar o solo levemente no início do retorno concêntrico.",
        "dicas": [
            "Mantenha o quadril totalmente estendido e reto, sem flexionar a cintura pélvica à frente.",
            "Use as mãos prontas em posição de flexão para amortecer a queda de forma segura.",
            "Amorteça a queda com os posteriores e dê um empurrão leve no solo para ajudar na subida."
        ],
        "erros": [
            "Dobrar o quadril para trás ao descer (sentar-se), eliminando o estresse mecânico nos isquiotibiais.",
            "Perder o controle total no início da queda por falta de força excêntrica inicial.",
            "Não travar os calcanhares de forma firme, gerando instabilidade articular nos joelhos."
        ],
        "frase_cientifica": "O Nordic Curl assistido promove alto torque excêntrico na articulação do joelho, estimulando a hipertrofia e prevenindo estiramentos (Schoenfeld, 2024).",
        "contraindicacoes": ["joelho"]
    },
    "nordic_full": {
        "nome_alternativo": "Full Nordic Curl",
        "grf_percentual": 95,
        "articulacoes": ["joelho", "quadril", "lombar"],
        "estresse": {"joelho": "alto", "quadril": "baixo", "lombar": "baixo"},
        "descricao": "Ajoelhado com os tornozelos rigidamente travados e corpo perfeitamente reto, incline o tronco à frente controlando a descida unicamente através da força excêntrica dos isquiotibiais até quase tocar o solo. Em seguida, puxe o corpo de volta à verticalidade usando apenas a contração concêntrica dos posteriores.",
        "dicas": [
            "Esta é uma das variações mais difíceis da calistenia para a cadeia posterior de pernas.",
            "Mantenha a rigidez isométrica total de toda a musculatura do core e glúteos.",
            "Foque em 'puxar o chão com os pés' para ativar a contracão máxima dos posteriores."
        ],
        "erros": [
            "Flexionar o quadril em qualquer fase do movimento para facilitar a subida concêntrica.",
            "Despencar contra o solo na metade final por perda brusca de controle tensional.",
            "Realizar sem o colchonete de proteção sob as patelas dos joelhos."
        ],
        "frase_cientifica": "O Nordic Curl completo representa a maior ativação excêntrica de isquiotibiais documentada em literatura científica de força (Schoenfeld, 2024).",
        "contraindicacoes": ["joelho"]
    },

    // 6. PANTURRILHA (TORNOZELO)
    "calf_raise_bilateral": {
        "nome_alternativo": "Bilateral Calf Raise",
        "grf_percentual": 100,
        "articulacoes": ["aquiles", "tornozelo"],
        "estresse": {"aquiles": "baixo", "tornozelo": "baixo"},
        "descricao": "Fique de pé com os pés afastados na largura dos quadris e braços ao lado do corpo. Contraia as panturrilhas para elevar o corpo sobre as pontas dos pés ao ponto mais alto possível. Segure a contração isométrica por 1 segundo no topo e desça os calcanhares lentamente.",
        "dicas": [
            "Empurre o solo através da articulação do dedão do pé (primeiro metatarso) para maior eficiência.",
            "Mantenha os joelhos totalmente estendidos para recrutar o músculo gastrocnêmio.",
            "Execute o movimento de forma lenta e cadenciada, mantendo o controle total no topo."
        ],
        "erros": [
            "Usar impulsos e rebotes rápidos (efeito elástico do tendão) sem realizar pausas.",
            "Desviar o apoio lateralmente para os dedos menores (supinação excessiva do pé).",
            "Amplitude de movimento curta por fadiga ou pressa na execução."
        ],
        "frase_cientifica": "A elevação bilateral de panturrilhas desenvolve o padrão neuromotor inicial e fortalece a fáscia plantar (Kikuchi & Nakazato, 2017).",
        "contraindicacoes": ["aquiles"]
    },
    "calf_raise_single": {
        "nome_alternativo": "Single-leg Calf Raise",
        "grf_percentual": 100,
        "articulacoes": ["aquiles", "tornozelo"],
        "estresse": {"aquiles": "medio", "tornozelo": "baixo"},
        "descricao": "Fique em um pé só no solo, com o pé oposto flexionado atrás. Se necessário, apoie um dedo levemente na parede para manter o equilíbrio. Realize a flexão plantar completa elevando o calcanhar ao ponto máximo. Segure 1 segundo no topo e desça de forma controlada.",
        "dicas": [
            "A execução unilateral dobra a carga relativa do corpo sobre a panturrilha ativa.",
            "Mantenha o joelho da perna ativa totalmente reto em todas as fases da elevação.",
            "Foque em contrair ativamente o ventre da panturrilha na fase concêntrica máxima."
        ],
        "erros": [
            "Dobrar o joelho ativo durante a subida, usando a força do quadríceps para ajudar.",
            "Puxar-se ativamente na parede em que deveria apenas apoiar o equilíbrio leve.",
            "Movimento rápido que ignora a fase isométrica no pico de contração."
        ],
        "frase_cientifica": "A elevação unilateral impõe 100% BW sobre o complexo sóleo-gastrocnêmio, promovendo alta tensão mecânica (Lopez et al., 2021).",
        "contraindicacoes": ["aquiles"]
    },
    "calf_raise_deficit": {
        "nome_alternativo": "Deficit Single-leg Calf Raise",
        "grf_percentual": 100,
        "articulacoes": ["aquiles", "tornozelo"],
        "estresse": {"aquiles": "alto", "tornozelo": "medio"},
        "descricao": "Posicione a metade anterior do pé ativo na beirada de um degrau firme ou livro grosso estável, deixando o calcanhar suspenso no ar. Realize uma dorsiflexão profunda descendo o calcanhar abaixo do nível do degrau para alongamento máximo. Suba até a extensão total.",
        "dicas": [
            "Desça o calcanhar ao limite máximo permitido pela mobilidade para alongar profundamente.",
            "Realize uma subida explosiva e mantenha o topo por 1 segundo.",
            "Apoie-se suavemente em uma parede para focar unicamente na panturrilha."
        ],
        "erros": [
            "Não descer o calcanhar abaixo da linha do degrau, eliminando o déficit e a fase alongada.",
            "Realizar rebotes rápidos no ponto baixo aproveitando o reflexo de estiramento miotático.",
            "Girar o tornozelo para fora durante a subida (supinação descontrolada do retropé)."
        ],
        "frase_cientifica": "O treinamento em déficit alonga profundamente o gastrocnêmio, estimulando hipertrofia superior pelo comprimento muscular longo (Pedrosa et al., 2022).",
        "contraindicacoes": ["aquiles"]
    },
    "calf_raise_deficit_paused": {
        "nome_alternativo": "Paused Deficit Single-leg Calf Raise",
        "grf_percentual": 100,
        "articulacoes": ["aquiles", "tornozelo"],
        "estresse": {"aquiles": "alto", "tornozelo": "medio"},
        "descricao": "Na beirada do degrau com calcanhar suspenso em um pé só, desça ao alongamento máximo profundo e mantenha a posição de forma totalmente estática e imóvel por exatos 2 segundos (pausa). Em seguida, empurre subindo até o topo e contraia mais 1 segundo.",
        "dicas": [
            "A pausa de 2 segundos no alongamento dissipa a energia elástica do tendão de Aquiles.",
            "Esta dissipação força a panturrilha a gerar tensão contrátil pura na subida concêntrica.",
            "Mantenha o corpo ereto e a canela alinhada em todas as repetições."
        ],
        "erros": [
            "Ignorar ou encurtar a pausa estática de 2 segundos no ponto de máximo alongamento profundo.",
            "Balançar o tronco para a frente para gerar empuxo inercial no degrau.",
            "Amplitude incompleta na fase concêntrica superior por fadiga muscular."
        ],
        "frase_cientifica": "Pausar por 2s anula o reflexo elástico do tendão, forçando o gastrocnêmio a sustentar tensão mecânica pura e ativa (Schoenfeld, 2024).",
        "contraindicacoes": ["aquiles"]
    },

    // 7. CORE
    "plank": {
        "nome_alternativo": "Plank",
        "grf_percentual": 64,
        "articulacoes": ["lombar", "ombro"],
        "estresse": {"lombar": "baixo", "ombro": "baixo"},
        "descricao": "Apoie os antebraços no solo alinhados abaixo dos ombros. Estenda as pernas apoiando as pontas dos pés. Mantenha os cotovelos a 90 graus e contraia ativamente o core, glúteos e pernas para formar uma linha horizontal rígida da cabeça aos calcanhares. Sustente de forma isométrica.",
        "dicas": [
            "Evite deixar a cabeça cair, mantenha o olhar neutro direcionado entre as mãos.",
            "Foque em empurrar os cotovelos contra o solo para manter as escápulas estáveis.",
            "Mantenha a pelve neutra ou com uma leve retroversão pélvica ativa."
        ],
        "erros": [
            "Deixar o quadril ceder em direção ao solo (formato de ponte invertida com dor lombar).",
            "Elevar excessivamente o quadril para cima para aliviar a carga sobre o abdômen.",
            "Reter a respiração (bloqueio respiratório completo) durante a isometria."
        ],
        "frase_cientifica": "A prancha clássica promove alto recrutamento isométrico estável do reto abdominal e transverso (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "plank_rkc": {
        "nome_alternativo": "RKC Plank",
        "grf_percentual": 68,
        "articulacoes": ["lombar", "ombro"],
        "estresse": {"lombar": "baixo", "ombro": "medio"},
        "descricao": "Em posição de prancha tradicional nos antebraços, entrelace as mãos. Caminhe levemente com os pés para trás e posicione os cotovelos um pouco à frente da linha dos ombros. Contraia ativamente os glúteos e abdômen, e tente puxar isométrica e violentamente os cotovelos em direção aos pés.",
        "dicas": [
            "Esta contração ativa de aproximação puxando cotovelos e pés eleva a intensidade drástica do core.",
            "Mantenha uma retroversão pélvica ativa máxima (esmagar os glúteos) durante todo o ciclo.",
            "A RKC plank foca na intensidade muscular extrema, não na duração prolongada de tempo."
        ],
        "erros": [
            "Ignorar a contração isométrica ativa puxando pés e cotovelos simultaneamente.",
            "Perder o alinhamento da pelve por fraqueza diante da alta tensão gerada.",
            "Sustentar por tempo prolongado perdendo a rigidez técnica e ativa exigida."
        ],
        "frase_cientifica": "A prancha RKC gera ativação eletromiográfica do reto abdominal e oblíquos até 4 vezes superior à prancha comum (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "hollow_body": {
        "nome_alternativo": "Hollow Body Hold",
        "grf_percentual": 35,
        "articulacoes": ["lombar"],
        "estresse": {"lombar": "baixo"},
        "descricao": "Deitado de costas no solo, estenda os braços atrás da cabeça e pernas esticadas à frente. Contraia o abdômen para colar a coluna lombar firmemente contra o chão. Eleve ligeiramente os ombros, braços e pernas do solo, formando uma curvatura em formato de canoa. Sustente de forma isométrica estável.",
        "dicas": [
            "A coluna lombar deve permanecer 100% do tempo colada contra o solo (flat back).",
            "Se a lombar descolar do chão, flexione levemente os joelhos ou eleve mais as pernas.",
            "Aponte as pontas dos pés à frente e mantenha os braços colados ao lado das orelhas."
        ],
        "erros": [
            "Deixar a coluna lombar arquear e descolar do solo por fraqueza do transverso abdominal.",
            "Tensionar excessivamente o pescoço curvando a cabeça à frente em direção ao peito.",
            "Executar com pernas muito baixas sem o controle prévio de estabilização da pelve."
        ],
        "frase_cientifica": "O Hollow Body estabiliza dinamicamente a pelve em retroversão ativa, blindando a coluna lombar contra cisalhamentos (Stuart McGill, 2019).",
        "contraindicacoes": ["lombar"]
    },
    "reverse_crunch": {
        "nome_alternativo": "Reverse Crunch",
        "grf_percentual": 30,
        "articulacoes": ["lombar"],
        "estresse": {"lombar": "baixo"},
        "descricao": "Deite-se de costas com braços ao lado do corpo e joelhos flexionados a 90 graus com pés elevados. Contraia o abdômen inferior para girar a pelve para trás, elevando o quadril levemente do solo em direção ao peitoral. Mantenha os joelhos flexionados. Retorne lentamente estendendo o quadril.",
        "dicas": [
            "O movimento deve ser focado na rotação pélvica posterior, não apenas em chutar as pernas.",
            "Controle rigidamente a descida do quadril de volta ao solo de forma lenta.",
            "Mantenha a cabeça e os ombros relaxados e apoiados contra o chão."
        ],
        "erros": [
            "Usar impulsos e balanços de pernas para erguer o quadril, eliminando o trabalho abdominal.",
            "Despencar o quadril contra o solo de forma rápida e sem controle na excêntrica.",
            "Pressionar os braços contra o solo com força excessiva para ajudar na flexão pélvica."
        ],
        "frase_cientifica": "O reverse crunch foca no reto abdominal com ênfase na porção infraumbilical através da flexão pélvica reversa (Schoenfeld, 2024).",
        "contraindicacoes": []
    },
    "leg_raise": {
        "nome_alternativo": "Leg Raise",
        "grf_percentual": 40,
        "articulacoes": ["lombar"],
        "estresse": {"lombar": "medio"},
        "descricao": "Deite-se de costas com pernas estendidas juntas e mãos apoiadas ao lado do quadril para suporte. Mantendo as pernas esticadas, contraia o abdômen e eleve as pernas na vertical até que fiquem perpendiculares ao solo. Desça lentamente as pernas estendidas até quase tocar o chão.",
        "dicas": [
            "Mantenha a coluna lombar pressionada contra o solo durante toda a descida das pernas.",
            "Se sentir a lombar arquear, limite a descida ou flexione ligeiramente os joelhos.",
            "Execute de forma cadenciada e lenta para maior tempo sob tensão excêntrica abdominal."
        ],
        "erros": [
            "Arquear a coluna lombar no momento da descida profunda das pernas.",
            "Usar impulsos e balanços rápidos na subida concêntrica das pernas.",
            "Tensionar a região dos ombros e trapézio por falta de estabilização do core."
        ],
        "frase_cientifica": "A elevação de pernas demanda alta estabilização isométrica do reto abdominal contra o torque de extensão imposto pelos flexores do quadril (Schoenfeld, 2024).",
        "contraindicacoes": ["lombar"]
    },
    "long_lever_plank": {
        "nome_alternativo": "Long-lever Plank",
        "grf_percentual": 75,
        "articulacoes": ["lombar", "ombro"],
        "estresse": {"lombar": "alto", "ombro": "medio"},
        "descricao": "A partir de uma posição de prancha tradicional nos antebraços, caminhe com os cotovelos para a frente e pés para trás até que os cotovelos fiquem posicionados abaixo do nariz ou testa. Mantenha o corpo reto em prancha alinhada de forma estática. Sustente de forma isométrica.",
        "dicas": [
            "Afastar os cotovelos alonga extraordinariamente o braço de alavanca gravitacional sobre o core.",
            "Mantenha a musculatura do glúteo máximo e abdômen contraída na intensidade limite.",
            "Inicie com pequenos afastamentos e aumente o lever à medida que a lombar se mantiver estável."
        ],
        "erros": [
            "Deixar o quadril despencar gerando hiperlordose e alta dor na coluna lombar.",
            "Encurtar a alavanca caminhando com os cotovelos de volta para baixo dos ombros.",
            "Falta de estabilização escapular, gerando dores nos ombros durante a isometria."
        ],
        "frase_cientifica": "A prancha com alavanca longa eleva o torque de extensão sobre a coluna, multiplicando o recrutamento do reto do abdômen e oblíquos (Schoenfeld, 2024).",
        "contraindicacoes": ["lombar"]
    },
    "ab_rollout_towel": {
        "nome_alternativo": "Towel Ab Rollout",
        "grf_percentual": 70,
        "articulacoes": ["lombar", "ombro"],
        "estresse": {"lombar": "alto", "ombro": "medio"},
        "descricao": "Ajoelhe-se em um colchonete macio, apoie ambas as mãos sobre uma toalha dobrada em um piso liso diretamente abaixo dos ombros. Mantendo os quadris estendidos e coluna neutra, deslize as mãos para a frente estendendo os braços e descendo o tronco de forma controlada. Puxe de volta pela força do abdômen.",
        "dicas": [
            "Evite dobrar os quadris para trás durante o retorno; a força deve partir unicamente do core.",
            "Desça apenas até o limite onde consiga manter a coluna estável e neutra sem dor.",
            "Mantenha o queixo levemente recolhido e os glúteos ativos em toda a amplitude de movimento."
        ],
        "erros": [
            "Arquear a coluna lombar na extensão máxima à frente por perda de rigidez do core.",
            "Puxar o corpo flexionando o quadril para trás (movimento de prece) em vez de usar o abdômen.",
            "Perder o controle do deslizamento no piso liso, despencando de bruços no solo."
        ],
        "frase_cientifica": "O rollout com toalha induz contração excêntrica extrema no reto abdominal sob estabilização de alavanca variável (Schoenfeld, 2024).",
        "contraindicacoes": ["lombar", "ombro"]
    }
};

const targetFilePath = path.resolve("c:\\Users\\user\\Documents\\Projetos Antigravity\\Hypotros\\hypertropos\\supabase\\migrations\\20260520000002_seed_exercicios.sql");

if (!fs.existsSync(targetFilePath)) {
    console.error(`Error: Target file not found at ${targetFilePath}!`);
    process.exit(1);
}

let sqlContent = fs.readFileSync(targetFilePath, 'utf8');

// Split SQL by INSERT statements to isolate each exercise insert block
const blocks = sqlContent.split("INSERT INTO exercicios (");
const header = blocks[0];
const exerciseBlocks = blocks.slice(1);

const processedBlocks = [];

for (const block of exerciseBlocks) {
    // Find the lines of the block
    const lines = block.split(/\r?\n/);
    
    // Locate ") VALUES ("
    let valuesIdx = -1;
    for (let idx = 0; idx < lines.length; idx++) {
        if (lines[idx].includes(") VALUES (")) {
            valuesIdx = idx;
            break;
        }
    }
            
    if (valuesIdx === -1) {
        processedBlocks.push(block);
        continue;
    }
        
    // Extract the exercise ID from the first line after VALUES (
    const idLine = lines[valuesIdx + 1];
    const idMatch = idLine.match(/'\s*([^']+)\s*'/);
    if (!idMatch) {
        processedBlocks.push(block);
        continue;
    }
        
    const exId = idMatch[1];
    
    if (!EXERCISES_DATA[exId]) {
        console.warn(`Warning: Biomechanics data not found for exercise ID '${exId}'. Cleaning default placeholders only.`);
        // Just clean default placeholders (e.g. remove [REVISAR: ])
        const cleanedBlock = block.replace(/'\[REVISAR:\s*([^\]]+)\]'/g, "'$1'");
        processedBlocks.push(cleanedBlock);
        continue;
    }
        
    const exData = EXERCISES_DATA[exId];
    
    // We will replace values at specific lines relative to valuesIdx
    // 1. Clean alternative name on line valuesIdx + 1
    lines[valuesIdx + 1] = lines[valuesIdx + 1].replace(/'\[REVISAR:\s*([^\]]+)\]'/g, "'$1'");
    
    // 2. Update GRF, articulations, and joint stress on line valuesIdx + 5
    const grfVal = exData.grf_percentual !== null ? exData.grf_percentual : "NULL";
    const artVal = toPgArray(exData.articulacoes);
    const stressVal = toJsonb(exData.estresse);
    lines[valuesIdx + 5] = `    ${grfVal}, '${artVal}', '${stressVal}'::jsonb,`;
    
    // 3. Update description, tips, and errors on line valuesIdx + 6
    const descVal = escapeSql(exData.descricao);
    const tipsVal = toPgArray(exData.dicas);
    const errVal = toPgArray(exData.erros);
    lines[valuesIdx + 6] = `    '${descVal}', '${tipsVal}', '${errVal}',`;
    
    // 4. Update scientific phrase on line valuesIdx + 7
    const phraseVal = escapeSql(exData.frase_cientifica);
    lines[valuesIdx + 7] = `    '', '${phraseVal}',`;
    
    // 5. Update contraindications on line valuesIdx + 9
    const contraVal = toPgArray(exData.contraindicacoes);
    lines[valuesIdx + 9] = `    '${contraVal}'`;
    
    // Join lines back together
    const updatedBlock = lines.join("\n");
    processedBlocks.push(updatedBlock);
}

// Combine everything back
const outputContent = header + processedBlocks.join("INSERT INTO exercicios (");

// Check for any remaining "[REVISAR:" in the output file to make sure it's 100% clean
const remainingMatches = outputContent.match(/\[REVISAR:[^\]]*\]/g);
if (remainingMatches) {
    console.error(`Error! There are still ${remainingMatches.length} placeholders left in the generated file:`);
    remainingMatches.slice(0, 10).forEach(ph => console.error(`  - ${ph}`));
} else {
    console.log("Flawless! Zero placeholders remaining.");
}

// Save back to the migration file
fs.writeFileSync(targetFilePath, outputContent, 'utf8');
console.log(`Migration file successfully written at ${targetFilePath}`);
