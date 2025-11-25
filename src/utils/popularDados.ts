/**
 * Script para popular o Mynis com dados realistas
 * Cobre todos os cenários possíveis para validação completa
 */

import { DataService } from '../services/dataService';

export function popularDadosCompletos() {
  console.log('🚀 Iniciando população de dados...');

  // Limpar dados existentes (opcional)
  // localStorage.clear();

  // 1. PERFIL DO USUÁRIO
  const perfil = {
    nome: 'João Silva',
    congregacao: 'Congregação Centro',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    tipoPublicador: 'publicador-regular' as const,
    textoAno: {
      texto: 'Confia em Jeová e faze o que é bom',
      referencia: 'Salmo 37:3'
    }
  };
  DataService.savePerfil(perfil);
  console.log('✅ Perfil criado');

  // 2. REVISITAS - Todos os cenários possíveis
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const semanaPassada = new Date(hoje);
  semanaPassada.setDate(semanaPassada.getDate() - 7);
  const quinzeDiasAtras = new Date(hoje);
  quinzeDiasAtras.setDate(quinzeDiasAtras.getDate() - 15);
  const vinteDiasAtras = new Date(hoje);
  vinteDiasAtras.setDate(vinteDiasAtras.getDate() - 20);
  const mesPassado = new Date(hoje);
  mesPassado.setDate(mesPassado.getDate() - 30);
  const doisMesesAtras = new Date(hoje);
  doisMesesAtras.setDate(doisMesesAtras.getDate() - 60);

  const revisitas = [
    // Cenário 1: Revisita NOVA - Casa em Casa - Com interesse em estudo
    {
      nome: 'Maria Santos',
      telefone: '(11) 99876-5432',
      endereco: 'Rua das Flores, 123, Apto 45 - Jardim Primavera',
      origem: 'casa-em-casa' as const,
      dataAdicao: ontem.toISOString(),
      ultimaVisita: ontem.toISOString(),
      quantidadeVisitas: 1,
      status: 'nova' as const,
      primeiraConversa: 'Conversamos sobre a esperança bíblica da ressurreição. Ela perdeu a mãe recentemente e ficou muito emocionada. Aceitou a revista A Sentinela sobre "Como Lidar com a Perda de um Ente Querido".',
      publicacoesEntregues: ['A Sentinela - Como Lidar com a Perda'],
      interesseEstudo: true,
      disponibilidade: 'Sábados pela manhã (9h-11h)',
      historicoVisitas: [
        {
          id: `${Date.now()}-hist1`,
          data: ontem.toISOString(),
          encontrou: true,
          observacoes: 'Primeira visita. Muito receptiva.',
          publicacoesDeixadas: ['A Sentinela - Como Lidar com a Perda'],
          proximaVisita: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      proximaVisita: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 2: Revisita QUENTE - Testemunho Informal - Várias visitas
    {
      nome: 'Carlos Mendes',
      telefone: '(11) 98765-1234',
      endereco: 'Av. Paulista, 1000, Torre A - Bela Vista',
      origem: 'testemunho-informal' as const,
      dataAdicao: mesPassado.toISOString(),
      ultimaVisita: semanaPassada.toISOString(),
      quantidadeVisitas: 4,
      status: 'quente' as const,
      primeiraConversa: 'Conversamos no trabalho sobre por que Deus permite o sofrimento. Ele é agnóstico mas está aberto a conversar.',
      publicacoesEntregues: [
        'Brochura - Boas Notícias de Deus',
        'Revista Despertai - Sofrimento',
        'Folheto - Por que estudar a Bíblia?',
        'A Sentinela - Quem Criou Deus?'
      ],
      interesseEstudo: true,
      disponibilidade: 'Terças e quintas depois das 18h',
      historicoVisitas: [
        {
          id: `${Date.now()}-hist2`,
          data: mesPassado.toISOString(),
          encontrou: true,
          observacoes: 'Primeira conversa no trabalho.',
          publicacoesDeixadas: ['Brochura - Boas Notícias de Deus']
        },
        {
          id: `${Date.now()}-hist3`,
          data: new Date(mesPassado.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          encontrou: true,
          observacoes: 'Leu a brochura e fez perguntas interessantes.',
          publicacoesDeixadas: ['Revista Despertai - Sofrimento']
        },
        {
          id: `${Date.now()}-hist4`,
          data: new Date(mesPassado.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          encontrou: true,
          observacoes: 'Começou a ler a Bíblia online.',
          publicacoesDeixadas: ['Folheto - Por que estudar a Bíblia?']
        },
        {
          id: `${Date.now()}-hist5`,
          data: semanaPassada.toISOString(),
          encontrou: true,
          observacoes: 'Demonstrou interesse em começar um estudo regular.',
          publicacoesDeixadas: ['A Sentinela - Quem Criou Deus?']
        }
      ],
      proximaVisita: new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 3: Revisita DESCANSO - Testemunho Público - Pediu tempo
    {
      nome: 'Ana Paula Costa',
      telefone: '(11) 97654-3210',
      endereco: 'Rua XV de Novembro, 567 - Centro',
      origem: 'testemunho-publico' as const,
      dataAdicao: doisMesesAtras.toISOString(),
      ultimaVisita: mesPassado.toISOString(),
      quantidadeVisitas: 3,
      status: 'descanso' as const,
      primeiraConversa: 'Conhecemos no carrinho de testemunho público. Pegou revistas sobre família e educação dos filhos.',
      publicacoesEntregues: [
        'Despertai - Educação dos Filhos',
        'A Sentinela - Como Ter uma Família Feliz',
        'Folheto - Respostas da Bíblia'
      ],
      interesseEstudo: false,
      disponibilidade: 'Sem disponibilidade no momento',
      observacoes: 'Pediu um tempo devido ao trabalho muito corrido. Quer que voltemos em 2 meses.',
      historicoVisitas: [
        {
          id: `${Date.now()}-hist6`,
          data: doisMesesAtras.toISOString(),
          encontrou: true,
          observacoes: 'Conhecemos no carrinho. Muito simpática.',
          publicacoesDeixadas: ['Despertai - Educação dos Filhos']
        },
        {
          id: `${Date.now()}-hist7`,
          data: new Date(doisMesesAtras.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          encontrou: true,
          observacoes: 'Gostou da revista e pediu mais material.',
          publicacoesDeixadas: ['A Sentinela - Como Ter uma Família Feliz']
        },
        {
          id: `${Date.now()}-hist8`,
          data: mesPassado.toISOString(),
          encontrou: true,
          observacoes: 'Está sem tempo devido ao trabalho. Pediu que voltássemos em 2 meses.',
          publicacoesDeixadas: ['Folheto - Respostas da Bíblia']
        }
      ]
    },

    // Cenário 4: Revisita INTERESSADO - Outro - Precisa revisitar (20 dias)
    {
      nome: 'Roberto Oliveira',
      endereco: 'Rua dos Bandeirantes, 234 - Vila Mariana',
      origem: 'outro' as const,
      dataAdicao: vinteDiasAtras.toISOString(),
      ultimaVisita: vinteDiasAtras.toISOString(),
      quantidadeVisitas: 1,
      status: 'interessado' as const,
      primeiraConversa: 'Foi indicação de um amigo da congregação. Disse que quer aprender mais sobre Deus antes de tomar decisões importantes na vida.',
      publicacoesEntregues: ['Livro - O Que a Bíblia Realmente Ensina?'],
      interesseEstudo: false,
      disponibilidade: 'Fins de semana',
      observacoes: 'Aceitou o livro mas não deu retorno. Precisa revisitar.',
      historicoVisitas: [
        {
          id: `${Date.now()}-hist9`,
          data: vinteDiasAtras.toISOString(),
          encontrou: true,
          observacoes: 'Primeira visita por indicação.',
          publicacoesDeixadas: ['Livro - O Que a Bíblia Realmente Ensina?']
        }
      ]
    },

    // Cenário 5: Revisita NOVA - Casa - Sem telefone - Primeira visita hoje
    {
      nome: 'Dona Luiza',
      endereco: 'Rua São João, 89, Casa 2 - Jardim Europa',
      origem: 'casa-em-casa' as const,
      dataAdicao: hoje.toISOString(),
      ultimaVisita: hoje.toISOString(),
      quantidadeVisitas: 1,
      status: 'nova' as const,
      primeiraConversa: 'Conversamos sobre a paz mundial e mostrei Isaías 2:4. Ela é evangélica mas demonstrou interesse.',
      publicacoesEntregues: ['Folheto - O Reino de Deus Já Governa'],
      interesseEstudo: false,
      disponibilidade: 'Manhãs de segunda a sexta',
      historicoVisitas: [
        {
          id: `${Date.now()}-hist10`,
          data: hoje.toISOString(),
          encontrou: true,
          observacoes: 'Primeira visita. Muito educada.',
          publicacoesDeixadas: ['Folheto - O Reino de Deus Já Governa'],
          proximaVisita: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      proximaVisita: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 6: Revisita QUENTE - Casa em Casa - Urgente (16 dias)
    {
      nome: 'Pedro Almeida',
      telefone: '(11) 96543-2109',
      endereco: 'Av. Brigadeiro Faria Lima, 345, Apto 102 - Pinheiros',
      origem: 'casa-em-casa' as const,
      dataAdicao: quinzeDiasAtras.toISOString(),
      ultimaVisita: quinzeDiasAtras.toISOString(),
      quantidadeVisitas: 2,
      status: 'quente' as const,
      primeiraConversa: 'Conversamos sobre depressão e ansiedade. Ele está passando por um momento difícil e gostou muito das orientações bíblicas.',
      publicacoesEntregues: [
        'Brochura - Quando um Ente Querido Morre',
        'A Sentinela - Paz Interior'
      ],
      interesseEstudo: true,
      disponibilidade: 'Domingos à tarde',
      observacoes: 'Precisa urgente de uma visita! Já passaram 16 dias.',
      historicoVisitas: [
        {
          id: `${Date.now()}-hist11`,
          data: quinzeDiasAtras.toISOString(),
          encontrou: true,
          observacoes: 'Primeira visita. Muito interessado.',
          publicacoesDeixadas: ['Brochura - Quando um Ente Querido Morre']
        },
        {
          id: `${Date.now()}-hist12`,
          data: new Date(quinzeDiasAtras.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          encontrou: true,
          observacoes: 'Segunda visita no dia seguinte a pedido dele.',
          publicacoesDeixadas: ['A Sentinela - Paz Interior']
        }
      ]
    }
  ];

  revisitas.forEach(r => {
    DataService.adicionarRevisita(r);
  });
  console.log(`✅ ${revisitas.length} revisitas criadas`);

  // 3. ESTUDOS BÍBLICOS - Todos os status possíveis
  const proximaSegunda = new Date(hoje);
  proximaSegunda.setDate(hoje.getDate() + (1 + 7 - hoje.getDay()) % 7);
  
  const estudos = [
    // Cenário 1: Estudo INICIANDO - Recém convertido de revisita
    {
      estudanteNome: 'Fernanda Lima',
      estudanteTelefone: '(11) 95432-1098',
      estudanteEndereco: 'Rua Augusta, 789, Apto 23 - Consolação',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 1,
      progresso: 10,
      data: proximaSegunda.toISOString().split('T')[0],
      horario: '19:00',
      status: 'iniciando' as const,
      observacoes: 'Ex-revisita que aceitou estudar. Primeira lição agendada para próxima segunda.',
      criadoEm: hoje.toISOString()
    },

    // Cenário 2: Estudo PROGREDINDO - No meio do livro
    {
      estudanteNome: 'Marcos Ferreira',
      estudanteTelefone: '(11) 94321-0987',
      estudanteEndereco: 'Rua Haddock Lobo, 456 - Cerqueira César',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 8,
      progresso: 53,
      data: new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      horario: '20:00',
      status: 'progredindo' as const,
      observacoes: 'Estudo regular há 4 meses. Está aplicando o aprendizado na vida. Já parou de fumar e melhorou relacionamento familiar.',
      criadoEm: new Date(hoje.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 3: Estudo com DÚVIDAS - Precisa atenção especial
    {
      estudanteNome: 'Juliana Souza',
      estudanteTelefone: '(11) 93210-9876',
      estudanteEndereco: 'Av. Rebouças, 1234, Apto 56 - Pinheiros',
      publicacao: 'Boas Notícias de Deus',
      licao: 4,
      progresso: 35,
      data: new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      horario: '15:00',
      status: 'duvidas' as const,
      observacoes: 'Está com muitas dúvidas sobre a Trindade. Precisamos revisar capítulos anteriores. Esposo não apoia o estudo.',
      criadoEm: new Date(hoje.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 4: Estudo AVANÇADO - Quase concluindo
    {
      estudanteNome: 'Ricardo Santos',
      estudanteTelefone: '(11) 92109-8765',
      estudanteEndereco: 'Rua Oscar Freire, 567 - Jardins',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 18,
      progresso: 95,
      data: hoje.toISOString().split('T')[0],
      horario: '18:30',
      status: 'avancado' as const,
      observacoes: 'Está na última lição! Já participa das reuniões há 3 meses. Demonstrou interesse em se batizar. Família toda apoia.',
      criadoEm: new Date(hoje.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 5: Estudo PROGREDINDO - Casal
    {
      estudanteNome: 'Casal: André e Paula',
      estudanteTelefone: '(11) 91098-7654',
      estudanteEndereco: 'Rua da Consolação, 890, Casa 3 - Consolação',
      publicacao: 'Boas Notícias de Deus',
      licao: 6,
      progresso: 40,
      data: new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      horario: '19:30',
      status: 'progredindo' as const,
      observacoes: 'Casal muito dedicado. Fazem pesquisa antes de cada estudo. Têm 2 filhos pequenos que também participam.',
      criadoEm: new Date(hoje.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Cenário 6: Estudo INICIANDO - Com idoso
    {
      estudanteNome: 'Sr. José Pereira',
      estudanteEndereco: 'Rua Avanhandava, 123 - Bela Vista',
      publicacao: 'Aproveite a Vida para Sempre',
      licao: 2,
      progresso: 15,
      data: new Date(hoje.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      horario: '14:00',
      status: 'iniciando' as const,
      observacoes: 'Senhor de 78 anos. Sem telefone. Precisa de paciência e falar devagar. Usa aparelho auditivo.',
      criadoEm: new Date(hoje.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  estudos.forEach(e => {
    DataService.adicionarEstudo(e);
  });
  console.log(`✅ ${estudos.length} estudos bíblicos criados`);

  // 4. REGISTROS DE TEMPO - Sessões de campo
  const sessoes = [
    // Sessão 1: Ontem - Manhã - Casa em Casa
    {
      data: ontem.toISOString().split('T')[0],
      periodo: 'manha' as const,
      horaInicio: '09:00',
      horaFim: '11:30',
      duracaoMinutos: 150,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'casa-em-casa' as const, detalhes: 'Território 15 - Ruas A, B e C' },
        { tipo: 'revisita' as const, detalhes: 'Visitamos Dona Luiza' }
      ],
      publicacoes: [
        { tipo: 'revista' as const, titulo: 'A Sentinela - Janeiro 2025', quantidade: 3 },
        { tipo: 'folheto' as const, titulo: 'O Reino de Deus', quantidade: 5 }
      ],
      videos: [
        { 
          titulo: 'Por que estudar a Bíblia?', 
          duracao: '2:30', 
          categoria: 'Introdução',
          reacao: 'positiva' as const
        }
      ],
      observacoes: 'Manhã muito produtiva. Fizemos 3 boas conversas.',
      revisitasFeitas: [],
      estudosRealizados: []
    },

    // Sessão 2: Semana passada - Tarde - Testemunho Público
    {
      data: semanaPassada.toISOString().split('T')[0],
      periodo: 'tarde' as const,
      horaInicio: '14:00',
      horaFim: '16:00',
      duracaoMinutos: 120,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'testemunho-publico' as const, detalhes: 'Carrinho na Estação Sé' }
      ],
      publicacoes: [
        { tipo: 'revista' as const, titulo: 'Despertai - Dezembro 2024', quantidade: 7 },
        { tipo: 'brochura' as const, titulo: 'Boas Notícias', quantidade: 4 }
      ],
      observacoes: 'Dia chuvoso, mas conseguimos distribuir bastante literatura.',
      revisitasFeitas: [],
      estudosRealizados: []
    },

    // Sessão 3: 10 dias atrás - Noite - Estudos
    {
      data: new Date(hoje.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodo: 'noite' as const,
      horaInicio: '19:00',
      horaFim: '21:00',
      duracaoMinutos: 120,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'Estudo com Marcos' },
        { tipo: 'estudo' as const, detalhes: 'Estudo com Casal André e Paula' }
      ],
      observacoes: 'Dois estudos na mesma noite. Ambos muito receptivos.',
      revisitasFeitas: [],
      estudosRealizados: []
    },

    // Sessão 4: 15 dias atrás - Manhã - Misto
    {
      data: quinzeDiasAtras.toISOString().split('T')[0],
      periodo: 'manha' as const,
      horaInicio: '09:30',
      horaFim: '12:00',
      duracaoMinutos: 150,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'revisita' as const, detalhes: 'Pedro Almeida' },
        { tipo: 'casa-em-casa' as const, detalhes: 'Território 12' },
        { tipo: 'revisita' as const, detalhes: 'Maria Santos' }
      ],
      publicacoes: [
        { tipo: 'revista' as const, titulo: 'A Sentinela - Dezembro 2024', quantidade: 2 },
        { tipo: 'tratado' as const, titulo: 'Precisa de Ajuda?', quantidade: 8 }
      ],
      videos: [
        { 
          titulo: 'O que acontece quando morremos?', 
          duracao: '3:15', 
          categoria: 'Ensinos Bíblicos',
          reacao: 'positiva' as const
        },
        { 
          titulo: 'Jeová se importa com você', 
          duracao: '2:45', 
          categoria: 'Encorajamento',
          reacao: 'neutra' as const
        }
      ],
      observacoes: 'Conseguimos fazer 2 revisitas e casa em casa.',
      revisitasFeitas: [],
      estudosRealizados: []
    }
  ];

  sessoes.forEach(s => {
    DataService.adicionarSessao(s);
  });
  console.log(`✅ ${sessoes.length} sessões de campo criadas`);

  // 5. DIÁRIO ESPIRITUAL - Entradas dos últimos 7 dias
  const diasDiario = [
    {
      data: hoje.toISOString().split('T')[0],
      leitura: 'Salmo 23',
      aprendizado: 'Jeová é meu pastor. Aprendi que não importa as circunstâncias, Jeová sempre cuida de mim.',
      aplicacao: 'Vou confiar mais em Jeová nas decisões importantes. Não preciso me preocupar tanto.',
      palavra: 'Confiança'
    },
    {
      data: ontem.toISOString().split('T')[0],
      leitura: '1 João 4:7-21',
      aprendizado: 'O amor é de Deus. Se amamos, mostramos que conhecemos a Deus.',
      aplicacao: 'Vou demonstrar mais amor em ações, não apenas palavras. Vou ligar para minha mãe hoje.',
      palavra: 'Amor'
    },
    {
      data: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      leitura: 'Filipenses 4:6,7',
      aprendizado: 'A oração elimina a ansiedade e traz paz.',
      aplicacao: 'Quando sentir ansiedade, vou parar e orar especificamente sobre o assunto.',
      palavra: 'Paz'
    }
  ];

  diasDiario.forEach(d => {
    DataService.adicionarReflexao(d);
  });
  console.log(`✅ ${diasDiario.length} entradas de diário criadas`);

  // IMPORTANTE: Também salvar no formato que a EspiritualTab espera (diarioGratidao)
  const gratidaoEntries = [
    {
      id: `${Date.now()}-1`,
      data: hoje.toISOString().split('T')[0],
      texto: 'Sou grato por Jeová ser meu pastor. Ele sempre cuida de mim nas circunstâncias difíceis. Hoje aprendi sobre confiança.'
    },
    {
      id: `${Date.now()}-2`,
      data: ontem.toISOString().split('T')[0],
      texto: 'Agradeço a Deus pelo amor que ele nos ensina. Vou demonstrar mais amor em ações para minha família.'
    },
    {
      id: `${Date.now()}-3`,
      data: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      texto: 'Sou grato pela paz que a oração traz. Aprendi que não preciso me preocupar tanto quando oro especificamente.'
    }
  ];
  localStorage.setItem('diarioGratidao', JSON.stringify(gratidaoEntries));

  // 5B. LEITURA DA BÍBLIA - Configurar plano e adicionar leituras
  const dadosLeitura = {
    configurado: true,
    configuracao: {
      plano: 'cronologico' as const,
      metaDiaria: '3capitulos' as const,
      notificacoesDiarias: true,
      lembreteReflexao: true,
      dataInicio: new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Começou há 30 dias
    },
    registros: [
      // Leituras da última semana
      {
        data: hoje.toISOString().split('T')[0],
        livro: 'Gênesis',
        capitulo: '5',
        concluido: true,
        reflexao: {
          aprendizado: 'Genealogia mostra continuidade do propósito de Deus',
          aplicacao: 'Valorizar minha herança espiritual',
          palavra: 'Legado'
        }
      },
      {
        data: ontem.toISOString().split('T')[0],
        livro: 'Gênesis',
        capitulo: '4',
        concluido: true
      },
      {
        data: new Date(hoje.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        livro: 'Gênesis',
        capitulo: '3',
        concluido: true
      },
      {
        data: new Date(hoje.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        livro: 'Gênesis',
        capitulo: '2',
        concluido: true
      },
      {
        data: new Date(hoje.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        livro: 'Gênesis',
        capitulo: '1',
        concluido: true
      }
    ],
    capitulosLidos: 45, // 45 capítulos em 30 dias (aprox. 3.8% de 1189 capítulos)
    livrosLidos: ['Gênesis', 'Êxodo'],
    ofensiva: {
      atual: 5, // 5 dias seguidos
      melhor: 12, // melhor foi 12 dias
      ultimaLeitura: hoje.toISOString().split('T')[0]
    },
    conquistasDesbloqueadas: ['primeira-semana']
  };
  
  localStorage.setItem('mynis_leitura_biblia', JSON.stringify(dadosLeitura));
  console.log('✅ Leitura da Bíblia configurada (45 capítulos, 5 dias de ofensiva)');

  // 6. ALVOS ESPIRITUAIS
  const alvos = [
    {
      titulo: 'Ler a Bíblia inteira em 1 ano',
      tipo: 'leitura' as const,
      descricao: 'Seguir o cronograma de leitura diária para ler toda a Bíblia até dezembro.',
      prazo: '2025-12-31',
      progresso: 25,
      concluido: false
    },
    {
      titulo: 'Participar mais nos comentários',
      tipo: 'qualidade' as const,
      descricao: 'Comentar pelo menos 2 vezes em cada reunião de meio de semana.',
      prazo: '2025-03-31',
      progresso: 60,
      concluido: false
    },
    {
      titulo: 'Ajudar no carrinho de testemunho público',
      tipo: 'servico' as const,
      descricao: 'Participar do testemunho público pelo menos 2 sábados por mês.',
      prazo: '2025-02-28',
      progresso: 80,
      concluido: false
    },
    {
      titulo: 'Memorizar textos-chave',
      tipo: 'outro' as const,
      descricao: 'Decorar 20 textos bíblicos importantes para o ministério.',
      prazo: '2025-06-30',
      progresso: 35,
      concluido: false
    },
    {
      titulo: 'Estudar publicação semanal',
      tipo: 'leitura' as const,
      descricao: 'Ler e estudar A Sentinela de Estudo toda semana antes da reunião.',
      prazo: '2025-12-31',
      progresso: 100,
      concluido: true,
      dataConclusao: new Date(hoje.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  alvos.forEach(a => {
    DataService.adicionarAlvo(a);
  });
  console.log(`✅ ${alvos.length} alvos espirituais criados`);

  // 7. EXPERIÊNCIAS DO TEMA DO MÊS
  const mesAtual = hoje.toISOString().slice(0, 7); // YYYY-MM
  const mesPassadoStr = mesPassado.toISOString().slice(0, 7);

  const experienciasData = [
    {
      id: `${Date.now()}-exp1`,
      mes: mesAtual,
      qualidade: 'Perseverança',
      data: new Date(hoje.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      situacao: 'Estava desanimado porque nenhuma revisita estava progredindo. Pensei em desistir.',
      aplicacao: 'Lembrei de Gálatas 6:9 sobre não desistir de fazer o bem. Continuei visitando as pessoas.',
      resultado: 'Na semana seguinte, Carlos Mendes aceitou começar um estudo bíblico! Valeu a pena perseverar.',
      sentimento: 'Muito grato a Jeová por me ajudar a não desistir. Aprendi que os resultados vêm no tempo dele.'
    },
    {
      id: `${Date.now()}-exp2`,
      mes: mesPassadoStr,
      qualidade: 'Coragem',
      data: mesPassado.toISOString().split('T')[0],
      situacao: 'Tive medo de testemunhar para meu chefe no trabalho, mesmo sabendo que ele é receptivo.',
      aplicacao: 'Orei pedindo coragem e lembrei de Josué 1:9. Aproveitei uma conversa sobre família para introduzir princípios bíblicos.',
      resultado: 'Ele ficou muito interessado! Agora conversamos regularmente sobre a Bíblia no horário de almoço.',
      sentimento: 'Aprendi que Jeová sempre nos ajuda quando saímos da zona de conforto para honrá-lo.'
    }
  ];

  DataService.saveTemaExperiencias(experienciasData);
  console.log(`✅ ${experienciasData.length} experiências do tema criadas`);

  // 8. ATIVIDADES DIÁRIAS - Últimos 7 dias
  const atividadesData = [];
  for (let i = 0; i < 7; i++) {
    const dataAtividade = new Date(hoje);
    dataAtividade.setDate(hoje.getDate() - i);
    
    atividadesData.push({
      data: dataAtividade.toISOString().split('T')[0],
      leituraBiblica: i !== 2, // Perdeu um dia
      textoDiario: i !== 2,
      oracao: true, // Sempre orou
      adoracaoFamilia: i === 0 || i === 6 // Segunda e segunda passada
    });
  }

  DataService.saveAtividades(atividadesData);
  console.log('✅ Atividades diárias dos últimos 7 dias criadas');

  console.log('🎉 População de dados concluída com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   • Perfil: 1`);
  console.log(`   • Revisitas: ${revisitas.length} (todos os cenários)`);
  console.log(`   • Estudos: ${estudos.length} (todos os status)`);
  console.log(`   • Sessões de Campo: ${sessoes.length}`);
  console.log(`   • Diário: ${diasDiario.length} entradas`);
  console.log(`   • Alvos: ${alvos.length}`);
  console.log(`   • Experiências: ${experienciasData.length}`);
  console.log(`   • Atividades Diárias: 7 dias`);
  
  // Disparar evento de mudança de dados
  window.dispatchEvent(new Event('mynis-data-change'));
  
  return {
    perfil,
    revisitas,
    estudos,
    sessoes,
    diasDiario,
    alvos,
    experiencias: experienciasData
  };
}

// Função para limpar todos os dados
export function limparTodosDados() {
  const confirmacao = confirm('⚠️ ATENÇÃO: Isso vai apagar TODOS os dados do Mynis. Tem certeza?');
  if (!confirmacao) {
    console.log('❌ Operação cancelada');
    return;
  }

  localStorage.clear();
  console.log('🗑️ Todos os dados foram removidos');
  
  // Disparar evento de mudança de dados
  window.dispatchEvent(new Event('mynis-data-change'));
  
  // Recarregar a página
  window.location.reload();
}

// Função para exportar dados (backup)
export function exportarDados() {
  const dados = {
    perfil: localStorage.getItem('perfil'),
    estudos: localStorage.getItem('estudosBiblicos'),
    revisitas: localStorage.getItem('revisitas'),
    sessoes: localStorage.getItem('sessoes'),
    diario: localStorage.getItem('diario'),
    alvos: localStorage.getItem('alvos'),
    experiencias: localStorage.getItem('experienciasTema'),
    atividades: localStorage.getItem('atividadesDiarias'),
    exportadoEm: new Date().toISOString()
  };

  const json = JSON.stringify(dados, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `mynis-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  console.log('✅ Dados exportados com sucesso!');
}