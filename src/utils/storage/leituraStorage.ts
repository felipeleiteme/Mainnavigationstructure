// Utilitários para gerenciar dados da Leitura da Bíblia no localStorage

export interface ConfiguracaoLeitura {
  plano: 'cronologico' | 'tematico' | 'sequencial';
  metaDiaria: '1capitulo' | '3capitulos' | '5capitulos';
  notificacoesDiarias: boolean;
  lembreteReflexao: boolean;
  dataInicio: string; // ISO date
}

export interface RegistroLeitura {
  data: string; // ISO date (YYYY-MM-DD)
  livro: string;
  capitulo: string;
  concluido: boolean;
  reflexao?: {
    aprendizado: string;
    aplicacao: string;
    palavra: string;
  };
}

export interface DadosLeitura {
  configurado: boolean;
  configuracao?: ConfiguracaoLeitura;
  registros: RegistroLeitura[];
  capitulosLidos: number;
  livrosLidos: string[];
  ofensiva: {
    atual: number; // dias seguidos
    melhor: number; // maior sequência
    ultimaLeitura: string | null; // ISO date
  };
  conquistasDesbloqueadas: string[];
}

const STORAGE_KEY = 'mynis_leitura_biblia';

// Planos de leitura (simplificado - primeiros capítulos de cada plano)
export const PLANOS_LEITURA = {
  cronologico: [
    { livro: 'Gênesis', capitulos: [1, 2, 3, 4, 5] },
    { livro: 'Jó', capitulos: [1, 2] },
    { livro: 'Gênesis', capitulos: [6, 7, 8, 9] },
    // ... mais capítulos
  ],
  sequencial: [
    { livro: 'Gênesis', capitulos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { livro: 'Gênesis', capitulos: [11, 12, 13, 14, 15] },
    // ... continua sequencialmente
  ],
  tematico: [
    { livro: 'Salmos', capitulos: [1, 23, 91] },
    { livro: 'Provérbios', capitulos: [1, 2, 3] },
    { livro: 'Mateus', capitulos: [5, 6, 7] },
    // ... temas específicos
  ],
};

// Obter próxima leitura baseada no plano
export function obterProximaLeitura(
  plano: ConfiguracaoLeitura['plano'],
  capitulosLidos: number
): { livro: string; capitulo: string } {
  const planoArray = PLANOS_LEITURA[plano];
  let contador = 0;
  
  for (const item of planoArray) {
    for (const cap of item.capitulos) {
      if (contador === capitulosLidos) {
        return { livro: item.livro, capitulo: `${cap}` };
      }
      contador++;
    }
  }
  
  // Se chegou ao fim, reinicia
  return { livro: planoArray[0].livro, capitulo: `${planoArray[0].capitulos[0]}` };
}

// Carregar dados do localStorage
export function carregarDados(): DadosLeitura {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);
  
  if (dadosSalvos) {
    return JSON.parse(dadosSalvos);
  }
  
  // Dados padrão para novo usuário
  return {
    configurado: false,
    registros: [],
    capitulosLidos: 0,
    livrosLidos: [],
    ofensiva: {
      atual: 0,
      melhor: 0,
      ultimaLeitura: null,
    },
    conquistasDesbloqueadas: [],
  };
}

// Salvar dados no localStorage
export function salvarDados(dados: DadosLeitura): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

// Salvar configuração inicial
export function salvarConfiguracao(config: ConfiguracaoLeitura): void {
  const dados = carregarDados();
  dados.configurado = true;
  dados.configuracao = config;
  salvarDados(dados);
}

// Marcar leitura como concluída
export function marcarLeituraConcluida(
  livro: string,
  capitulo: string,
  reflexao?: RegistroLeitura['reflexao']
): { novasConquistas: string[] } {
  const dados = carregarDados();
  const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Adicionar registro
  const registro: RegistroLeitura = {
    data: hoje,
    livro,
    capitulo,
    concluido: true,
    reflexao,
  };
  
  dados.registros.push(registro);
  dados.capitulosLidos++;
  
  // Adicionar livro à lista se ainda não estiver
  if (!dados.livrosLidos.includes(livro)) {
    dados.livrosLidos.push(livro);
  }
  
  // Atualizar ofensiva
  const ofensivaAtualizada = calcularOfensiva(dados);
  dados.ofensiva = ofensivaAtualizada;
  
  // Verificar conquistas
  const conquistasAntigas = new Set(dados.conquistasDesbloqueadas);
  const conquistasAtuais = verificarConquistas(dados);
  
  // Encontrar novas conquistas
  const novasConquistas = conquistasAtuais.filter(c => !conquistasAntigas.has(c));
  dados.conquistasDesbloqueadas = conquistasAtuais;
  
  salvarDados(dados);
  
  return { novasConquistas };
}

// Calcular ofensiva (dias seguidos)
function calcularOfensiva(dados: DadosLeitura): DadosLeitura['ofensiva'] {
  if (dados.registros.length === 0) {
    return { atual: 0, melhor: 0, ultimaLeitura: null };
  }
  
  const hoje = new Date().toISOString().split('T')[0];
  const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Ordenar registros por data (mais recente primeiro)
  const registrosOrdenados = [...dados.registros].sort((a, b) => 
    b.data.localeCompare(a.data)
  );
  
  const ultimaLeitura = registrosOrdenados[0].data;
  
  // Se última leitura não foi hoje nem ontem, ofensiva quebrada
  if (ultimaLeitura !== hoje && ultimaLeitura !== ontem) {
    return {
      atual: ultimaLeitura === hoje ? 1 : 0,
      melhor: dados.ofensiva.melhor,
      ultimaLeitura: hoje,
    };
  }
  
  // Contar dias seguidos
  let diasSeguidos = 0;
  const datasUnicas = new Set<string>();
  
  for (const registro of registrosOrdenados) {
    datasUnicas.add(registro.data);
  }
  
  const datasArray = Array.from(datasUnicas).sort().reverse();
  let dataEsperada = new Date(hoje);
  
  for (const data of datasArray) {
    const dataRegistro = new Date(data);
    const dataEsperadaStr = dataEsperada.toISOString().split('T')[0];
    
    if (data === dataEsperadaStr) {
      diasSeguidos++;
      dataEsperada = new Date(dataEsperada.getTime() - 86400000); // -1 dia
    } else {
      break;
    }
  }
  
  const melhorOfensiva = Math.max(diasSeguidos, dados.ofensiva.melhor);
  
  return {
    atual: diasSeguidos,
    melhor: melhorOfensiva,
    ultimaLeitura: hoje,
  };
}

// Verificar quais conquistas foram desbloqueadas
function verificarConquistas(dados: DadosLeitura): string[] {
  const conquistas: string[] = [];
  const ofensiva = dados.ofensiva.atual;
  
  if (ofensiva >= 3) conquistas.push('primeira-semana');
  if (ofensiva >= 7) conquistas.push('semana-completa');
  if (ofensiva >= 14) conquistas.push('duas-semanas');
  if (ofensiva >= 30) conquistas.push('mes-completo');
  
  return conquistas;
}

// Obter progresso geral (0-100%)
export function calcularProgresso(dados: DadosLeitura): number {
  // Total aproximado de capítulos da Bíblia: 1189
  const totalCapitulos = 1189;
  const progresso = (dados.capitulosLidos / totalCapitulos) * 100;
  return Math.min(Math.round(progresso), 100);
}

// Verificar se já leu hoje
export function jaLeuHoje(dados: DadosLeitura): boolean {
  const hoje = new Date().toISOString().split('T')[0];
  return dados.registros.some(r => r.data === hoje && r.concluido);
}
