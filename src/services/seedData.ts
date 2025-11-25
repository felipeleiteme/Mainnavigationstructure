/**
 * Seed Data - Popular dados de exemplo para demonstração
 */

import { DataService } from './dataService';

export function seedDemoData() {
  // Limpar TODOS os dados existentes para recarregar
  localStorage.removeItem('mynis-data');
  localStorage.removeItem('estudos');
  localStorage.removeItem('revisitas');
  localStorage.removeItem('sessoes');
  localStorage.removeItem('reflexoes');
  
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const diaAtual = hoje.getDate();

  // ===== ESTUDOS BÍBLICOS =====
  const estudos = [
    // João Silva - Estudo HOJE às 14h
    {
      estudanteNome: 'João Silva',
      estudanteAvatar: 'JS',
      estudanteTelefone: '+55 11 99999-1111',
      publicacao: 'Boas Notícias do Reino de Deus',
      licao: 8,
      progresso: 55,
      data: new Date(anoAtual, mesAtual, diaAtual, 14, 0).toISOString(),
      horario: '14:00',
      endereco: 'Rua das Flores, 123',
      observacoes: 'Estudante está muito interessado em profecia',
      status: 'progredindo' as const
    },
    
    // Maria Santos - Estudo HOJE às 16h
    {
      estudanteNome: 'Maria Santos',
      estudanteAvatar: 'MS',
      estudanteTelefone: '+55 11 99999-2222',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 5,
      progresso: 30,
      data: new Date(anoAtual, mesAtual, diaAtual, 16, 0).toISOString(),
      horario: '16:00',
      endereco: 'Av. Central, 456',
      observacoes: 'Gosta de fazer muitas perguntas',
      status: 'iniciando' as const
    },
    
    // Ana Oliveira - Estudo HOJE às 19h
    {
      estudanteNome: 'Ana Oliveira',
      estudanteAvatar: 'AO',
      estudanteTelefone: '+55 11 99999-4444',
      publicacao: 'Desfrute da Vida',
      licao: 12,
      progresso: 75,
      data: new Date(anoAtual, mesAtual, diaAtual, 19, 0).toISOString(),
      horario: '19:00',
      endereco: 'Rua das Acácias, 321',
      observacoes: 'Estudo muito avançado, considera batismo',
      status: 'avancado' as const
    },

    // Pedro Costa - Amanhã às 10h
    {
      estudanteNome: 'Pedro Costa',
      estudanteAvatar: 'PC',
      estudanteTelefone: '+55 11 99999-3333',
      publicacao: 'Boas Notícias do Reino de Deus',
      licao: 10,
      progresso: 65,
      data: new Date(anoAtual, mesAtual, diaAtual + 1, 10, 0).toISOString(),
      horario: '10:00',
      endereco: 'Rua dos Pinheiros, 789',
      observacoes: 'Jovem muito dedicado',
      status: 'avancado' as const
    },

    // Carla Mendes - Daqui a 2 dias
    {
      estudanteNome: 'Carla Mendes',
      estudanteAvatar: 'CM',
      estudanteTelefone: '+55 11 99999-5555',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 2,
      progresso: 12,
      data: new Date(anoAtual, mesAtual, diaAtual + 2, 15, 30).toISOString(),
      horario: '15:30',
      endereco: 'Rua Aurora, 234',
      observacoes: 'Primeira vez estudando a Bíblia',
      status: 'iniciando' as const
    },

    // Roberto Silva - Daqui a 3 dias
    {
      estudanteNome: 'Roberto Silva',
      estudanteAvatar: 'RS',
      estudanteTelefone: '+55 11 99999-6666',
      publicacao: 'Boas Notícias do Reino de Deus',
      licao: 6,
      progresso: 40,
      data: new Date(anoAtual, mesAtual, diaAtual + 3, 18, 0).toISOString(),
      horario: '18:00',
      endereco: 'Av. Paulista, 567',
      status: 'progredindo' as const
    },

    // Luciana Pereira - Daqui a 4 dias
    {
      estudanteNome: 'Luciana Pereira',
      estudanteAvatar: 'LP',
      estudanteTelefone: '+55 11 99999-7777',
      publicacao: 'Desfrute da Vida',
      licao: 3,
      progresso: 20,
      data: new Date(anoAtual, mesAtual, diaAtual + 4, 14, 30).toISOString(),
      horario: '14:30',
      endereco: 'Rua São Paulo, 890',
      observacoes: 'Tem dúvidas sobre a Trindade',
      status: 'iniciando' as const
    },

    // Fernando Alves - Daqui a 5 dias
    {
      estudanteNome: 'Fernando Alves',
      estudanteAvatar: 'FA',
      estudanteTelefone: '+55 11 99999-8888',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 9,
      progresso: 58,
      data: new Date(anoAtual, mesAtual, diaAtual + 5, 16, 0).toISOString(),
      horario: '16:00',
      endereco: 'Rua das Palmeiras, 123',
      status: 'progredindo' as const
    },

    // Juliana Costa - Daqui a 6 dias
    {
      estudanteNome: 'Juliana Costa',
      estudanteAvatar: 'JC',
      estudanteTelefone: '+55 11 99999-9999',
      publicacao: 'Boas Notícias do Reino de Deus',
      licao: 14,
      progresso: 88,
      data: new Date(anoAtual, mesAtual, diaAtual + 6, 11, 0).toISOString(),
      horario: '11:00',
      endereco: 'Av. Brasil, 456',
      observacoes: 'Quer começar a assistir reuniões',
      status: 'avancado' as const
    },
    
    // Estudos passados para estatísticas
    {
      estudanteNome: 'João Silva',
      estudanteAvatar: 'JS',
      estudanteTelefone: '+55 11 99999-1111',
      publicacao: 'Boas Notícias do Reino de Deus',
      licao: 7,
      progresso: 50,
      data: new Date(anoAtual, mesAtual, diaAtual - 7, 14, 0).toISOString(),
      horario: '14:00',
      endereco: 'Rua das Flores, 123',
      status: 'progredindo' as const
    },
    {
      estudanteNome: 'Maria Santos',
      estudanteAvatar: 'MS',
      estudanteTelefone: '+55 11 99999-2222',
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      licao: 4,
      progresso: 25,
      data: new Date(anoAtual, mesAtual, diaAtual - 7, 16, 0).toISOString(),
      horario: '16:00',
      endereco: 'Av. Central, 456',
      status: 'iniciando' as const
    },
    {
      estudanteNome: 'Pedro Costa',
      estudanteAvatar: 'PC',
      estudanteTelefone: '+55 11 99999-3333',
      publicacao: 'Boas Notícias do Reino de Deus',
      licao: 9,
      progresso: 60,
      data: new Date(anoAtual, mesAtual, diaAtual - 8, 10, 0).toISOString(),
      horario: '10:00',
      endereco: 'Rua dos Pinheiros, 789',
      status: 'avancado' as const
    },
    {
      estudanteNome: 'Ana Oliveira',
      estudanteAvatar: 'AO',
      estudanteTelefone: '+55 11 99999-4444',
      publicacao: 'Desfrute da Vida',
      licao: 11,
      progresso: 70,
      data: new Date(anoAtual, mesAtual, diaAtual - 7, 19, 0).toISOString(),
      horario: '19:00',
      endereco: 'Rua das Acácias, 321',
      status: 'avancado' as const
    },
  ];

  estudos.forEach(e => DataService.adicionarEstudo(e));

  // Aguardar um momento para garantir IDs únicos
  const aguardarUmMomento = () => new Promise(resolve => setTimeout(resolve, 1));

  // ===== REVISITAS =====
  const revisitas = [
    {
      nome: 'Carlos Mendes',
      avatar: 'CM',
      telefone: '+55 11 98888-1111',
      endereco: 'Rua Nova, 100',
      origem: 'casa-em-casa' as const,
      dataAdicao: new Date(anoAtual, mesAtual, 5).toISOString(),
      ultimaVisita: new Date(anoAtual, mesAtual, diaAtual - 3).toISOString(),
      proximaVisita: new Date(anoAtual, mesAtual, diaAtual + 1, 15, 0).toISOString(), // Amanhã às 15h
      quantidadeVisitas: 2,
      status: 'nova' as const,
      primeiraConversa: 'Interessado em família',
      publicacoesEntregues: ['A Sentinela - Nov/2024'],
      interesseEstudo: false
    },
    {
      nome: 'Lucia Ferreira',
      avatar: 'LF',
      telefone: '+55 11 98888-2222',
      endereco: 'Av. Paulista, 200',
      origem: 'testemunho-publico' as const,
      dataAdicao: new Date(anoAtual, mesAtual, 8).toISOString(),
      ultimaVisita: new Date(anoAtual, mesAtual, diaAtual - 5).toISOString(),
      proximaVisita: new Date(anoAtual, mesAtual, diaAtual + 2, 16, 30).toISOString(), // Daqui a 2 dias às 16h30
      quantidadeVisitas: 3,
      status: 'quente' as const,
      primeiraConversa: 'Pergunta sobre sofrimento',
      publicacoesEntregues: ['Despertai! - Nov/2024', 'Folheto'],
      interesseEstudo: true
    },
    {
      nome: 'Roberto Alves',
      avatar: 'RA',
      telefone: '+55 11 98888-3333',
      endereco: 'Rua São João, 300',
      origem: 'casa-em-casa' as const,
      dataAdicao: new Date(anoAtual, mesAtual, 12).toISOString(),
      ultimaVisita: new Date(anoAtual, mesAtual, diaAtual - 7).toISOString(),
      proximaVisita: new Date(anoAtual, mesAtual, diaAtual + 4, 10, 30).toISOString(), // Daqui a 4 dias às 10h30
      quantidadeVisitas: 1,
      status: 'nova' as const,
      primeiraConversa: 'Aceitou revista',
      publicacoesEntregues: ['A Sentinela - Out/2024'],
      interesseEstudo: false
    },
    {
      nome: 'Sandra Lima',
      avatar: 'SL',
      telefone: '+55 11 98888-4444',
      endereco: 'Rua das Palmeiras, 400',
      origem: 'testemunho-informal' as const,
      dataAdicao: new Date(anoAtual, mesAtual, 14).toISOString(),
      ultimaVisita: new Date(anoAtual, mesAtual, diaAtual - 2).toISOString(),
      proximaVisita: new Date(anoAtual, mesAtual, diaAtual, 11, 0).toISOString(), // HOJE às 11h
      quantidadeVisitas: 2,
      status: 'nova' as const,
      primeiraConversa: 'Vizinha que perguntou sobre reuniões',
      publicacoesEntregues: ['Folheto'],
      interesseEstudo: false
    },
    {
      nome: 'Maria da Silva',
      avatar: 'MS',
      telefone: '+55 11 98888-6666',
      endereco: 'Rua da Silva',
      origem: 'casa-em-casa' as const,
      dataAdicao: new Date(anoAtual, mesAtual, 10).toISOString(),
      ultimaVisita: new Date(anoAtual, mesAtual, diaAtual - 7).toISOString(),
      proximaVisita: new Date(anoAtual, mesAtual, diaAtual, 14, 30).toISOString(), // HOJE às 14h30
      quantidadeVisitas: 1,
      status: 'nova' as const,
      primeiraConversa: 'Sim',
      publicacoesEntregues: [],
      interesseEstudo: true
    },
    {
      nome: 'José Pereira',
      avatar: 'JP',
      telefone: '+55 11 98888-5555',
      endereco: 'Av. Brigadeiro, 500',
      origem: 'casa-em-casa' as const,
      dataAdicao: new Date(anoAtual, mesAtual, 19).toISOString(),
      quantidadeVisitas: 1,
      status: 'nova' as const,
      primeiraConversa: 'Interessado em profecia',
      publicacoesEntregues: [],
      interesseEstudo: false
    },
  ];

  revisitas.forEach(r => DataService.adicionarRevisita(r));

  // ===== SESSÕES DE CAMPO =====
  const sessoes = [
    // Semana 1
    {
      data: new Date(anoAtual, mesAtual, 4).toISOString(),
      periodo: 'manha' as const,
      horaInicio: '09:00',
      horaFim: '11:30',
      duracaoMinutos: 150,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'João Silva' },
        { tipo: 'casa-em-casa' as const }
      ],
      publicacoes: [
        { tipo: 'revista' as const, titulo: 'A Sentinela', quantidade: 2 }
      ],
      videos: [],
      estudosRealizados: [estudos[0].estudanteNome]
    },
    {
      data: new Date(anoAtual, mesAtual, 6).toISOString(),
      periodo: 'tarde' as const,
      horaInicio: '14:00',
      horaFim: '16:45',
      duracaoMinutos: 165,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'Maria Santos' },
        { tipo: 'revisita' as const }
      ],
      publicacoes: [
        { tipo: 'brochura' as const, titulo: 'Boas Notícias', quantidade: 1 }
      ],
      videos: [
        { titulo: 'Por que estudar a Bíblia?', duracao: '5:30', categoria: 'Ensino', reacao: 'positiva' as const }
      ]
    },

    // Semana 2
    {
      data: new Date(anoAtual, mesAtual, 11).toISOString(),
      periodo: 'manha' as const,
      horaInicio: '09:30',
      horaFim: '12:00',
      duracaoMinutos: 150,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'João Silva' },
        { tipo: 'testemunho-publico' as const }
      ],
      publicacoes: [
        { tipo: 'tratado' as const, titulo: 'Há um Criador?', quantidade: 5 },
        { tipo: 'revista' as const, titulo: 'Despertai!', quantidade: 3 }
      ],
      videos: [
        { titulo: 'De onde viemos?', duracao: '4:15', categoria: 'Crença', reacao: 'positiva' as const },
        { titulo: 'A vida tem propósito?', duracao: '3:45', categoria: 'Propósito', reacao: 'neutra' as const }
      ]
    },
    {
      data: new Date(anoAtual, mesAtual, 13).toISOString(),
      periodo: 'tarde' as const,
      horaInicio: '15:00',
      horaFim: '17:15',
      duracaoMinutos: 135,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'Maria Santos' },
        { tipo: 'casa-em-casa' as const }
      ],
      publicacoes: [
        { tipo: 'revista' as const, titulo: 'A Sentinela', quantidade: 2 }
      ],
      videos: []
    },

    // Semana 3
    {
      data: new Date(anoAtual, mesAtual, 18).toISOString(),
      periodo: 'manha' as const,
      horaInicio: '09:00',
      horaFim: '11:30',
      duracaoMinutos: 150,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'João Silva' },
        { tipo: 'revisita' as const }
      ],
      publicacoes: [
        { tipo: 'brochura' as const, titulo: 'Quem Realmente Controla o Mundo?', quantidade: 1 }
      ],
      videos: [
        { titulo: 'O que é o Reino de Deus?', duracao: '6:20', categoria: 'Reino', reacao: 'positiva' as const }
      ]
    },
    {
      data: new Date(anoAtual, mesAtual, 20).toISOString(),
      periodo: 'tarde' as const,
      horaInicio: '14:30',
      horaFim: '16:45',
      duracaoMinutos: 135,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'Maria Santos' },
        { tipo: 'testemunho-publico' as const }
      ],
      publicacoes: [
        { tipo: 'tratado' as const, titulo: 'Há Esperança!', quantidade: 4 }
      ],
      videos: [
        { titulo: 'A Bíblia muda vidas', duracao: '5:10', categoria: 'Testemunho', reacao: 'positiva' as const }
      ]
    },

    // Semana 4
    {
      data: new Date(anoAtual, mesAtual, 25).toISOString(),
      periodo: 'manha' as const,
      horaInicio: '09:15',
      horaFim: '11:00',
      duracaoMinutos: 105,
      tipo: 'campo' as const,
      atividades: [
        { tipo: 'estudo' as const, detalhes: 'João Silva' },
        { tipo: 'casa-em-casa' as const }
      ],
      publicacoes: [
        { tipo: 'revista' as const, titulo: 'A Sentinela', quantidade: 1 }
      ],
      videos: []
    },

    // Crédito de tempo
    {
      data: new Date(anoAtual, mesAtual, 10).toISOString(),
      periodo: 'noite' as const,
      horaInicio: '19:00',
      horaFim: '21:00',
      duracaoMinutos: 120,
      tipo: 'credito' as const,
      atividades: [
        { tipo: 'outro' as const, detalhes: 'Preparação de reunião' }
      ]
    },
    {
      data: new Date(anoAtual, mesAtual, 17).toISOString(),
      periodo: 'noite' as const,
      horaInicio: '20:00',
      horaFim: '22:00',
      duracaoMinutos: 120,
      tipo: 'credito' as const,
      atividades: [
        { tipo: 'outro' as const, detalhes: 'Preparação de designação' }
      ]
    }
  ];

  sessoes.forEach(s => DataService.adicionarSessao(s));

  // ===== DIÁRIO ESPIRITUAL =====
  const diarioEntries = [
    {
      data: new Date(anoAtual, mesAtual, 1).toISOString(),
      leitura: 'Lucas 10',
      aprendizado: 'Jesus enviou 70 discípulos em duplas. Importante trabalhar em equipe.',
      aplicacao: 'Vou convidar alguém para sair comigo no campo.',
      palavra: 'Equipe'
    },
    {
      data: new Date(anoAtual, mesAtual, 8).toISOString(),
      leitura: 'Mateus 6',
      aprendizado: 'A oração modelo nos ensina sobre as prioridades certas.',
      aplicacao: 'Focar primeiro no Reino em minhas orações.',
      palavra: 'Prioridades'
    },
    {
      data: new Date(anoAtual, mesAtual, 15).toISOString(),
      leitura: 'Provérbios 3',
      aprendizado: 'Confiar em Jeová de todo o coração traz paz.',
      aplicacao: 'Confiar mais, me preocupar menos.',
      palavra: 'Confiança'
    }
  ];

  diarioEntries.forEach(d => DataService.adicionarReflexao(d));

  // ===== ATIVIDADES DIÁRIAS =====
  const atividades = [];
  for (let i = 1; i <= 15; i++) {
    atividades.push({
      data: new Date(anoAtual, mesAtual, i).toISOString().split('T')[0],
      leituraBiblica: true,
      textoDiario: true,
      oracao: true,
      adoracaoFamilia: i % 2 === 0 // A cada 2 dias
    });
  }

  DataService.saveAtividades(atividades);

  console.log('✅ Dados de demonstração populados com sucesso!');
  console.log('📊 Estatísticas:');
  console.log(`   - Estudos: ${DataService.getTotalEstudosMes()}`);
  console.log(`   - Revisitas Novas: ${DataService.getTotalRevisitasNovasMes()}`);
  console.log(`   - Horas de Campo: ${DataService.getTotalHorasCampo().toFixed(1)}h`);
  console.log(`   - Publicações: ${DataService.getTotalPublicacoesMes()}`);
  console.log(`   - Vídeos: ${DataService.getTotalVideosMes()}`);
  console.log(`   - Ofensiva de Leitura: ${DataService.getOfensivaLeitura()} dias`);
}