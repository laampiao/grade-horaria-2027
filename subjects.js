const defaultSubjectsData = [
  {
    "semestre": "1º Semestre",
    "disciplinas": [
      {"id": "metodologia", "nome": "Metodologia Científica", "professor": "Edilaine", "horarios": ["Sex 09:00-10:40"], "verificado": true, "salasPorDia": {}},
      {"id": "ingles1", "nome": "Inglês Instrumental I", "professor": "Eduardo Oliv.", "horarios": ["Seg 09:00-10:40"], "verificado": true, "salasPorDia": {}},
      {"id": "leitura", "nome": "Leitura e Produção de Textos Acadêmicos", "professor": "Edilaine", "horarios": ["Qui 09:00-10:40"], "verificado": true, "salasPorDia": {}},
      {"id": "contexto", "nome": "Contexto Social e Profissional do Bacharel em Sistemas de Informação", "professor": "Eduardo G.", "horarios": ["Seg 07:00-08:40"], "verificado": true, "salasPorDia": {}},
      {"id": "calc_fvr", "nome": "Cálculo com Funções de uma Variável Real", "professor": "Matusalém", "horarios": ["Ter 10:50-12:30", "Qua 10:50-12:30", "Qui 10:50-12:30"], "verificado": true, "salasPorDia": {}},
      {"id": "lab_prog", "nome": "Laboratório de Programação de Computadores I", "correquisitos": ["prog1"], "professor": "G1: Weider / G2: Marcelo M.", "horarios": ["Seg 10:50-12:30"], "verificado": true, "salasPorDia": {"Seg": "G1: S114 / G2: S116"}},
      {"id": "gaal", "nome": "Geometria Analítica e Álgebra Linear", "professor": "Edilene", "horarios": ["Ter 09:00-10:40", "Sex 10:50-12:30"], "verificado": true, "salasPorDia": {}},
      {"id": "prog1", "nome": "Programação de Computadores I", "correquisitos": ["lab_prog"], "professor": "Weider", "horarios": ["Qua 09:00-10:40"], "verificado": true, "salasPorDia": {}}
    ]
  },
  {
    "semestre": "2º Semestre",
    "disciplinas": [
      {"id": "bd1", "nome": "Banco de Dados I", "correquisitos": ["lab_bd1"], "professor": "Deisymar", "horarios": ["Seg 13:50-15:30"], "verificado": true, "salasPorDia": {"Seg": "S317"}},
      {"id": "arq1", "nome": "Arquitetura e Organização de Computadores", "professor": "Visitante BSI 2", "horarios": ["Ter 13:50-15:30", "Qua 09:00-10:40"], "verificado": true, "salasPorDia": {"Ter": "S304,S107", "Qua": "S314,S107"}},
      {"id": "info_soc", "nome": "Informática e Sociedade", "professor": "Cristiano", "horarios": ["Sex 13:50-15:30"], "verificado": true, "salasPorDia": {"Sex": "S302"}},
      {"id": "lab_prog2", "nome": "Laboratório de Programação de Computadores II", "requisitos": ["prog1", "lab_prog"], "correquisitos": ["prog2"], "professor": "G1: Eduardo G. / G2: Marcelo M.", "horarios": ["Seg 15:50-17:30"], "verificado": true, "salasPorDia": {"Seg": "G1: S112 / G2: S116"}},
      {"id": "int_series", "nome": "Integração e Séries", "requisitos": ["calc_fvr"], "professor": "Nilton", "horarios": ["Ter 15:50-17:30", "Qui 15:50-17:30"], "verificado": true, "salasPorDia": {"Ter": "S307", "Qui": "S303"}},
      {"id": "calc_vv1", "nome": "Cálculo com Funções de Várias Variáveis I", "requisitos": ["calc_fvr", "gaal"], "professor": "Edilene", "horarios": ["Ter 10:50-12:30", "Qui 13:50-15:30"], "verificado": true, "salasPorDia": {"Ter": "S302", "Qui": "S302"}},
      {"id": "prog2", "nome": "Programação de Computadores II", "requisitos": ["prog1", "lab_prog"], "correquisitos": ["lab_prog2"], "professor": "Eduardo G.", "horarios": ["Qui 10:50-12:30"], "verificado": true, "salasPorDia": {"Qui": "S309"}},
      {"id": "lab_bd1", "nome": "Laboratório de Banco de Dados I", "correquisitos": ["bd1"], "professor": "G1: Deisymar / G2: Weider", "horarios": ["Qua 10:50-12:30"], "verificado": true, "salasPorDia": {"Qua": "G1: S112 / G2: S108"}},
      {"id": "naf", "nome": "NAF", "optativa": true, "horarios": ["Qua 13:50-17:30"], "salasPorDia": {"Qua": "S302"}, "professor": "Weider"}
    ]
  },
  {
    "semestre": "3º Semestre",
    "disciplinas": [
      {"id": "lab_prog3", "nome": "Laboratório de Programação de Computadores III", "requisitos": ["prog2", "lab_prog2"], "correquisitos": ["prog3"], "professor": "G1: Marcelo M. / G2: Eduardo G.", "horarios": ["Seg 13:50-15:30"], "verificado": true, "salasPorDia": {"Seg": "G1: S116 / G2: S112"}},
      {"id": "metodos_num", "nome": "Métodos Numéricos Computacionais", "requisitos": ["prog1", "lab_prog"], "correquisitos": ["edo"], "professor": "Paulo M.", "horarios": ["Ter 15:50-17:30", "Qui 10:50-12:30"], "verificado": true, "salasPorDia": {"Ter": "S116,S309", "Qui": "S110,S314"}},
      {"id": "sociologia", "nome": "Introdução à Sociologia", "professor": "Carlos", "horarios": ["Qui 15:50-17:30"], "verificado": true, "salasPorDia": {"Qui": "S315"}},
      {"id": "bd2", "nome": "Banco de Dados II", "requisitos": ["bd1", "lab_bd1"], "correquisitos": ["lab_bd2"], "professor": "Michael Tadeu", "horarios": ["Seg 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S314"}},
      {"id": "algebra_lin", "nome": "Álgebra Linear", "requisitos": ["gaal"], "professor": "Matusalém", "horarios": ["Seg 10:50-12:30", "Sex 15:50-17:30"], "verificado": true, "salasPorDia": {"Seg": "S314", "Sex": "S303"}},
      {"id": "lab_bd2", "nome": "Laboratório de Banco de Dados II", "requisitos": ["bd1", "lab_bd1"], "correquisitos": ["bd2"], "professor": "G1: Michael Tadeu / G2: Weider", "horarios": ["Ter 10:50-12:30"], "verificado": true, "salasPorDia": {"Ter": "G1: S114 / G2: S108"}},
      {"id": "edo", "nome": "Equações Diferenciais Ordinárias", "requisitos": ["calc_vv1", "int_series"], "professor": "Nilton", "horarios": ["Seg 15:50-17:30", "Ter 13:50-15:30"], "verificado": true, "salasPorDia": {"Seg": "S314", "Ter": "S316"}},
      {"id": "prog3", "nome": "Programação de Computadores III", "requisitos": ["prog2", "lab_prog2"], "correquisitos": ["lab_prog3"], "professor": "Marcelo M.", "horarios": ["Qui 13:50-15:30"], "verificado": true, "salasPorDia": {"Qui": "S307"}}
    ]
  },
  {
    "semestre": "4º Semestre",
    "disciplinas": [
      {"id": "so", "nome": "Sistemas Operacionais", "requisitos": ["arq1"], "professor": "Visitante BSI 1", "horarios": ["Qui 10:50-12:30", "Sex 10:50-12:30"], "verificado": true, "salasPorDia": {"Qui": "S316,S107", "Sex": "S302,S107"}},
      {"id": "design", "nome": "Design de Interação", "professor": "Wanderson", "horarios": ["Ter 10:50-12:30", "Qui 13:50-15:30"], "verificado": true, "salasPorDia": {"Ter": "S314", "Qui": "S110"}},
      {"id": "lab_eng_soft", "nome": "Laboratório de Engenharia de Software", "requisitos": ["prog1", "lab_prog"], "correquisitos": ["eng_soft"], "professor": "Deisymar", "horarios": ["Seg 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S108"}},
      {"id": "estatistica", "nome": "Estatística", "requisitos": ["int_series"], "professor": "Nilton", "horarios": ["Seg 13:50-15:30", "Ter 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S305", "Ter": "S314"}},
      {"id": "lab_redes", "nome": "Laboratório de Redes de Computadores", "correquisitos": ["redes"], "professor": "Michael Tadeu", "horarios": ["Qua 10:50-12:30"], "verificado": true, "salasPorDia": {"Qua": "S107"}},
      {"id": "redes", "nome": "Redes de Computadores", "correquisitos": ["lab_redes", "so"], "professor": "Michael Tadeu", "horarios": ["Seg 10:50-12:30", "Qui 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S309", "Qui": "S314"}},
      {"id": "eng_soft", "nome": "Engenharia de Software", "requisitos": ["prog1", "lab_prog"], "correquisitos": ["lab_eng_soft"], "professor": "Bruno Couto", "horarios": ["Qua 09:00-10:40"], "verificado": true, "salasPorDia": {"Qua": "S309"}}
    ]
  },
  {
    "semestre": "5º Semestre",
    "disciplinas": [
      {"id": "ger_proj", "nome": "Gerenciamento de Projetos", "requisitos": ["eng_soft", "lab_eng_soft"], "correquisitos": ["lab_ger_proj"], "professor": "Wanderson", "horarios": ["Qui 09:00-10:40"], "verificado": true, "salasPorDia": {"Qui": "S316"}},
      {"id": "probabilidade", "nome": "Teoria da Probabilidade", "requisitos": ["estatistica"], "professor": "Nilton", "horarios": ["Seg 09:00-10:40", "Qui 13:50-15:30"], "verificado": true, "salasPorDia": {"Seg": "S309", "Qui": "S319"}},
      {"id": "filosofia", "nome": "Filosofia da Tecnologia", "professor": "Paulo Bicalho", "horarios": ["Ter 09:00-10:40"], "verificado": true, "salasPorDia": {"Ter": "S309"}},
      {"id": "lab_prog_web", "nome": "Laboratório de Programação Web", "requisitos": ["prog3", "lab_prog3", "bd2", "lab_bd2"], "correquisitos": ["prog_web"], "professor": "Lázaro", "horarios": ["Ter 10:50-12:30", "Qua 09:00-10:40"], "verificado": true, "salasPorDia": {"Ter": "S112", "Qua": "S108"}},
      {"id": "lab_ger_proj", "nome": "Laboratório de Gerenciamento de Projetos", "requisitos": ["eng_soft", "lab_eng_soft"], "correquisitos": ["ger_proj"], "professor": "Wanderson", "horarios": ["Qua 10:50-12:30"], "verificado": true, "salasPorDia": {"Qua": "S114"}},
      {"id": "metodologia_pesq", "nome": "Metodologia da Pesquisa", "requisitos": ["metodologia"], "professor": "Eduardo G.", "horarios": ["Sex 09:00-10:40"], "verificado": true, "salasPorDia": {"Sex": "S319"}},
      {"id": "prog_web", "nome": "Programação Web", "requisitos": ["prog3", "lab_prog3", "bd2", "lab_bd2"], "correquisitos": ["lab_prog_web"], "professor": "Lázaro", "horarios": ["Seg 10:50-12:30"], "verificado": true, "salasPorDia": {"Seg": "S318"}},
      {"id": "prototipacao", "nome": "Introdução à Experimentação e ao Desenvolvimento de Protótipos e Projetos", "professor": "", "horarios": [], "verificado": true, "semOferta": true},
      {"id": "est_dados", "nome": "Estrutura de Dados", "requisitos": ["prog2", "lab_prog2"], "correquisitos": ["lab_est_dados"], "professor": "João Carlos", "horarios": ["Qui 10:50-12:30"], "verificado": true, "salasPorDia": {"Qui": "S302"}},
      {"id": "lab_est_dados", "nome": "Laboratório de Estrutura de Dados", "requisitos": ["prog2", "lab_prog2"], "correquisitos": ["est_dados"], "professor": "João Carlos", "horarios": ["Sex 10:50-12:30"], "verificado": true, "salasPorDia": {"Sex": "S108"}}
    ]
  },
  {
    "semestre": "6º Semestre",
    "disciplinas": [
      {"id": "emp1", "nome": "Empreendedorismo I", "professor": "Cristiano", "horarios": ["Qui 15:50-17:30", "Sex 15:50-17:30"], "verificado": true, "salasPorDia": {"Qui": "S314", "Sex": "S306"}},
      {"id": "nuvem", "nome": "Computação em Nuvem", "requisitos": ["redes", "lab_redes"], "correquisitos": ["lab_nuvem"], "professor": "Bruno Perillo", "horarios": ["Ter 15:50-17:30"], "verificado": true, "salasPorDia": {"Ter": "S304"}},
      {"id": "ml", "nome": "Análise Multivariada", "requisitos": ["probabilidade"], "professor": "André", "horarios": ["Ter 13:50-15:30", "Qua 10:50-12:30"], "verificado": true, "salasPorDia": {"Ter": "S112", "Qua": "S110"}},
      {"id": "lab_mobile", "nome": "Laboratório de Desenvolvimento de Aplicações para Dispositivos Móveis", "requisitos": ["prog_web", "lab_prog_web"], "correquisitos": ["mobile"], "professor": "Michael Tadeu", "horarios": ["Qua 09:00-10:40", "Qui 10:50-12:30"], "verificado": true, "salasPorDia": {"Qua": "S116", "Qui": "S108"}},
      {"id": "lab_nuvem", "nome": "Laboratório de Computação em Nuvem", "requisitos": ["redes", "lab_redes"], "correquisitos": ["nuvem"], "professor": "Bruno Perillo", "horarios": ["Ter 09:00-10:40"], "verificado": true, "salasPorDia": {"Ter": "S116"}},
      {"id": "mobile", "nome": "Desenvolvimento de Aplicações para Dispositivos Móveis", "requisitos": ["prog_web", "lab_prog_web"], "correquisitos": ["lab_mobile"], "professor": "Michael Tadeu", "horarios": ["Seg 13:50-15:30"], "verificado": true, "salasPorDia": {"Seg": "S307"}},
      {"id": "discreta", "nome": "Matemática Discreta", "requisitos": ["prog2", "lab_prog2", "probabilidade"], "professor": "Visitante BSI 1", "horarios": ["Seg 15:50-17:30", "Qui 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S318", "Qui": "S309"}},
      {"id": "teerc", "nome": "TEeRC", "optativa": true, "ofertaSujeitaAAlteracao": true, "horarios": ["Seg 09:00-10:40", "Qui 13:50-15:30"], "salasPorDia": {"Seg": "S302", "Qui": "S303"}, "professor": "Eduardo G. / Lázaro"},
      {"id": "teadsco", "nome": "TEAdScO", "optativa": true, "ofertaSujeitaAAlteracao": true, "horarios": ["Seg 10:50-12:30", "Sex 13:50-15:30"], "salasPorDia": {"Seg": "S110", "Sex": "S110"}, "professor": "João Carlos"},
      {"id": "teldmhds", "nome": "TELdMHdS", "optativa": true, "ofertaSujeitaAAlteracao": true, "horarios": ["Ter 10:50-12:30", "Sex 10:50-12:30"], "salasPorDia": {"Ter": "S110", "Sex": "S112"}, "professor": "Deisymar"}
    ]
  },
  {
    "semestre": "7º Semestre",
    "disciplinas": [
      {"id": "lab_mineracao", "nome": "Laboratório de Mineração de Dados", "requisitos": ["est_dados", "bd2"], "correquisitos": ["mineracao"], "professor": "Bruno Perillo", "horarios": ["Seg 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S112"}},
      {"id": "emp2", "nome": "Empreendedorismo II", "requisitos": ["emp1"], "professor": "Cristiano", "horarios": ["Seg 15:50-17:30", "Qui 13:50-15:30"], "verificado": true, "salasPorDia": {"Seg": "S309", "Qui": "S309"}},
      {"id": "lab_ling_prog", "nome": "Laboratório de Linguagens de Programação", "requisitos": ["prog2", "lab_prog2"], "correquisitos": ["ling_prog"], "professor": "Visitante BSI 2", "horarios": ["Qui 10:50-12:30"], "verificado": true, "salasPorDia": {"Qui": "S112"}},
      {"id": "econ", "nome": "Engenharia Econômica", "professor": "Bruno Perillo", "horarios": ["Qua 07:50-10:40"], "verificado": true, "salasPorDia": {"Qua": "S319"}},
      {"id": "iai", "nome": "Inteligência Artificial I", "requisitos": ["est_dados", "lab_est_dados", "ml"], "correquisitos": ["lab_iai"], "professor": "Lázaro / Marcelo M.", "horarios": ["Ter 09:00-10:40", "Qui 15:50-17:30"], "verificado": true, "salasPorDia": {"Ter": "S307", "Qui": "S319"}},
      {"id": "mineracao", "nome": "Mineração de Dados", "requisitos": ["est_dados", "lab_est_dados", "bd2", "lab_bd2"], "correquisitos": ["lab_mineracao"], "professor": "Bruno Perillo", "horarios": ["Ter 13:50-15:30"], "verificado": true, "salasPorDia": {"Ter": "S307"}},
      {"id": "lab_iai", "nome": "Laboratório de Inteligência Artificial I", "requisitos": ["est_dados", "lab_est_dados", "ml"], "correquisitos": ["iai"], "professor": "Lázaro / Marcelo M.", "horarios": ["Qua 10:50-12:30"], "verificado": true, "salasPorDia": {"Qua": "S116"}},
      {"id": "ling_prog", "nome": "Linguagens de Programação", "requisitos": ["prog2", "lab_prog2"], "correquisitos": ["lab_ling_prog"], "professor": "Visitante BSI 2", "horarios": ["Ter 15:50-17:30"], "verificado": true, "salasPorDia": {"Ter": "S318"}},
      {"id": "teemdn", "nome": "TEeMdN", "optativa": true, "ofertaSujeitaAAlteracao": true, "horarios": ["Ter 10:50-12:30"], "salasPorDia": {"Ter": "S309"}, "professor": "Elisabeth"}
    ]
  },
  {
    "semestre": "8º Semestre",
    "disciplinas": [
      {"id": "sist_info", "nome": "Sistemas de Informação", "correquisitos": ["seguranca_aud"], "professor": "Wanderson", "horarios": ["Ter 07:00-08:40", "Qua 07:00-08:40"], "verificado": true, "salasPorDia": {}},
      {"id": "gestao_ti", "nome": "Gestão de TI", "correquisitos": ["sist_info"], "professor": "Wanderson", "horarios": ["Qua 09:00-10:40", "Qui 07:00-08:40"], "verificado": true, "salasPorDia": {}},
      {"id": "lab_cien_dados", "nome": "Laboratório de Ciência de Dados", "requisitos": ["mineracao", "lab_mineracao", "ml"], "correquisitos": ["cien_dados"], "professor": "Bruno Perillo", "horarios": ["Seg 07:00-08:40"], "verificado": true, "salasPorDia": {"Seg": "S108"}},
      {"id": "gest_tec_seg", "nome": "Seminários de SI", "professor": "", "horarios": [], "verificado": true, "semOferta": true},
      {"id": "iaii", "nome": "Inteligência Artificial II", "requisitos": ["iai", "lab_iai"], "correquisitos": ["lab_iaii"], "professor": "Douglas", "horarios": ["Ter 09:00-10:40", "Qui 09:00-10:40"], "verificado": true, "salasPorDia": {"Ter": "S110"}},
      {"id": "lab_iaii", "nome": "Laboratório de Inteligência Artificial II", "requisitos": ["iai", "lab_iai"], "correquisitos": ["iaii"], "professor": "Douglas", "horarios": ["Seg 09:00-10:40"], "verificado": true, "salasPorDia": {"Seg": "S110"}},
      {"id": "cien_dados", "nome": "Ciência de Dados", "requisitos": ["mineracao", "lab_mineracao", "ml"], "correquisitos": ["lab_cien_dados"], "professor": "Bruno Perillo", "horarios": ["Seg 10:50-12:30"], "verificado": true, "salasPorDia": {}},
      {"id": "psic_organ", "nome": "Psicologia Aplicada às Organizações", "professor": "Evelyn", "horarios": ["Qua 10:50-12:30"], "verificado": true, "salasPorDia": {}},
      {"id": "seguranca_aud", "nome": "Segurança e Auditoria de Sistemas", "correquisitos": ["gestao_ti"], "professor": "Visitante BSI 2", "horarios": ["Ter 10:50-12:30"], "verificado": true, "salasPorDia": {"Ter": "S116"}}
    ]
  }
];
