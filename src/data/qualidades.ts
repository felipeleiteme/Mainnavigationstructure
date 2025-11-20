export interface Qualidade {
  id: string;
  nome: string;
  emoji: string;
  mes: number; // 1-12
  cor: {
    primaria: string;
    secundaria: string;
    texto: string;
  };
  significado: string;
  versiculo: {
    texto: string;
    referencia: string;
  };
  reflexoesSemanais: {
    semana1: {
      titulo: string;
      exemplos: string[];
    };
    semana2: {
      titulo: string;
      meta: number;
    };
    semana3: {
      titulo: string;
      estudos: Array<{
        titulo: string;
        referencia: string;
      }>;
    };
    semana4: {
      titulo: string;
    };
  };
}

export const QUALIDADES: Qualidade[] = [
  {
    id: 'brandura',
    nome: 'Brandura',
    emoji: '🕊️',
    mes: 11, // novembro
    cor: {
      primaria: '#A8D5E2',
      secundaria: '#E8EEF2',
      texto: '#2C3E50',
    },
    significado:
      'A brandura é a gentileza com força. Não é fraqueza, mas sim o poder de escolher responder com calma mesmo quando poderíamos reagir com dureza. É imitar a Jeová, que é "misericordioso e compassivo".',
    versiculo: {
      texto: 'A resposta branda desvia o furor, mas a palavra dura faz subir a ira.',
      referencia: 'Provérbios 15:1',
    },
    reflexoesSemanais: {
      semana1: {
        titulo: 'Onde você pode cultivar brandura esta semana?',
        exemplos: [
          'No trânsito caótico',
          'Com familiares sob pressão',
          'Ao ensinar alguém com dificuldade',
          'Em reuniões tensas no trabalho',
          'Com clientes impacientes',
          'Ao receber críticas',
        ],
      },
      semana2: {
        titulo: 'Desafio: Responda com brandura 3 vezes hoje',
        meta: 3,
      },
      semana3: {
        titulo: 'Como Jesus demonstrou brandura?',
        estudos: [
          { titulo: 'O convite de Jesus', referencia: 'Mateus 11:28-30' },
          { titulo: 'A mulher adúltera', referencia: 'João 8:1-11' },
        ],
      },
      semana4: {
        titulo: 'Como você cresceu em brandura este mês?',
      },
    },
  },
  {
    id: 'amor',
    nome: 'Amor',
    emoji: '❤️',
    mes: 2,
    cor: {
      primaria: '#FFB6C1',
      secundaria: '#FFE4E8',
      texto: '#8B0000',
    },
    significado:
      'O amor cristão vai além do sentimento. É a disposição de agir no melhor interesse de outros, mesmo quando é difícil. É o maior mandamento e a identificação dos verdadeiros discípulos.',
    versiculo: {
      texto: 'Nisto todos conhecerão que sois meus discípulos: se tiverdes amor uns pelos outros.',
      referencia: 'João 13:35',
    },
    reflexoesSemanais: {
      semana1: {
        titulo: 'Como demonstrar amor esta semana?',
        exemplos: [
          'Dedicar tempo de qualidade à família',
          'Ajudar alguém sem esperar retorno',
          'Perdoar quem te magoou',
          'Ouvir atentamente alguém que precisa',
          'Fazer algo especial por quem você ama',
        ],
      },
      semana2: {
        titulo: 'Desafio: Demonstre amor de forma prática 3 vezes',
        meta: 3,
      },
      semana3: {
        titulo: 'Exemplos de amor na Bíblia',
        estudos: [
          { titulo: 'O amor de Deus', referencia: 'João 3:16' },
          { titulo: 'O amor em ação', referencia: '1 João 3:16-18' },
        ],
      },
      semana4: {
        titulo: 'Como o amor transformou suas ações este mês?',
      },
    },
  },
  {
    id: 'paciencia',
    nome: 'Paciência',
    emoji: '🕰️',
    mes: 5,
    cor: {
      primaria: '#B8E6D5',
      secundaria: '#D5F2E8',
      texto: '#2C5F2D',
    },
    significado:
      'A paciência é a capacidade de suportar provações, atrasos e imperfeições sem perder a calma. É confiar no tempo de Jeová e no desenvolvimento gradual das coisas.',
    versiculo: {
      texto: 'Sejam pacientes, irmãos, até a presença do Senhor.',
      referencia: 'Tiago 5:7',
    },
    reflexoesSemanais: {
      semana1: {
        titulo: 'Onde praticar paciência esta semana?',
        exemplos: [
          'Com processos demorados',
          'No desenvolvimento espiritual',
          'Com pessoas que aprendem devagar',
          'Em situações fora do seu controle',
          'Esperando respostas de orações',
        ],
      },
      semana2: {
        titulo: 'Desafio: Pratique paciência conscientemente 3 vezes',
        meta: 3,
      },
      semana3: {
        titulo: 'Exemplos de paciência',
        estudos: [
          { titulo: 'A paciência de Jeová', referencia: '2 Pedro 3:9' },
          { titulo: 'Jó mantém integridade', referencia: 'Jó 1:20-22' },
        ],
      },
      semana4: {
        titulo: 'Como a paciência te ajudou este mês?',
      },
    },
  },
];

export function getQualidadeMes(mes?: number): Qualidade {
  const mesAtual = mes || new Date().getMonth() + 1;
  return QUALIDADES.find((q) => q.mes === mesAtual) || QUALIDADES[0];
}

export function getProximaQualidade(): Qualidade {
  const proximoMes = new Date().getMonth() + 2;
  const mes = proximoMes > 12 ? 1 : proximoMes;
  return QUALIDADES.find((q) => q.mes === mes) || QUALIDADES[0];
}
