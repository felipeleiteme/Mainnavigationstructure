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

// Função auxiliar para gerar array de capítulos
function caps(inicio: number, fim: number): number[] {
  return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
}

// ================================================================================
// PLANO DE LEITURA CRONOLÓGICA COMPLETA (1189 capítulos)
// Ordem histórica dos eventos bíblicos - Alinhado com JW.ORG
// ================================================================================

export const PLANOS_LEITURA = {
  cronologico: [
    // ========== ESCRITURAS HEBRAICAS (Antigo Testamento) ==========
    
    // 1. CRIAÇÃO E DILÚVIO (Gênesis 1-11)
    { livro: 'Gênesis', capitulos: caps(1, 11) }, // 11 caps
    
    // 2. JÓ - Época Patriarcal (durante tempo de Abraão)
    { livro: 'Jó', capitulos: caps(1, 42) }, // 42 caps
    
    // 3. PATRIARCAS (Gênesis 12-50)
    { livro: 'Gênesis', capitulos: caps(12, 50) }, // 39 caps
    
    // 4. ÊXODO E LEI MOSAICA
    { livro: 'Êxodo', capitulos: caps(1, 40) }, // 40 caps
    { livro: 'Levítico', capitulos: caps(1, 27) }, // 27 caps
    { livro: 'Números', capitulos: caps(1, 36) }, // 36 caps
    { livro: 'Deuteronômio', capitulos: caps(1, 34) }, // 34 caps
    
    // 5. CONQUISTA DE CANAÃ
    { livro: 'Josué', capitulos: caps(1, 24) }, // 24 caps
    
    // 6. PERÍODO DOS JUÍZES
    { livro: 'Juízes', capitulos: caps(1, 21) }, // 21 caps
    { livro: 'Rute', capitulos: caps(1, 4) }, // 4 caps
    
    // 7. INÍCIO DO REINO - SAMUEL E SAUL
    { livro: '1 Samuel', capitulos: caps(1, 31) }, // 31 caps
    
    // 8. REINO DE DAVI
    { livro: '2 Samuel', capitulos: caps(1, 24) }, // 24 caps
    { livro: '1 Crônicas', capitulos: caps(1, 29) }, // 29 caps (paralelo de 2 Samuel)
    
    // SALMOS DE DAVI (escritos durante seu reinado)
    { livro: 'Salmos', capitulos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, // Salmos 1-10
    { livro: 'Salmos', capitulos: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }, // 11-20
    { livro: 'Salmos', capitulos: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }, // 21-30
    { livro: 'Salmos', capitulos: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }, // 31-40
    { livro: 'Salmos', capitulos: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] }, // 41-50
    { livro: 'Salmos', capitulos: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60] }, // 51-60
    { livro: 'Salmos', capitulos: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70] }, // 61-70
    { livro: 'Salmos', capitulos: [71, 72] }, // 71-72
    
    // 9. REINO DE SALOMÃO
    { livro: '1 Reis', capitulos: caps(1, 11) }, // 11 caps (início do reino de Salomão)
    { livro: '2 Crônicas', capitulos: caps(1, 9) }, // 9 caps (paralelo de 1 Reis 1-11)
    
    // LITERATURA SAPIENCIAL DE SALOMÃO
    { livro: 'Provérbios', capitulos: caps(1, 31) }, // 31 caps
    { livro: 'Eclesiastes', capitulos: caps(1, 12) }, // 12 caps
    { livro: 'Cântico de Salomão', capitulos: caps(1, 8) }, // 8 caps
    
    // Mais SALMOS (incluindo de Salomão e outros)
    { livro: 'Salmos', capitulos: [73, 74, 75, 76, 77, 78, 79, 80] }, // 73-80
    { livro: 'Salmos', capitulos: [81, 82, 83, 84, 85, 86, 87, 88, 89, 90] }, // 81-90
    
    // 10. REINO DIVIDIDO - Israel e Judá
    { livro: '1 Reis', capitulos: caps(12, 22) }, // 11 caps
    { livro: '2 Reis', capitulos: caps(1, 25) }, // 25 caps
    { livro: '2 Crônicas', capitulos: caps(10, 36) }, // 27 caps (paralelo)
    
    // PROFETAS DO REINO DIVIDIDO (ordem cronológica aproximada)
    { livro: 'Obadias', capitulos: [1] }, // 1 cap
    { livro: 'Joel', capitulos: caps(1, 3) }, // 3 caps
    { livro: 'Jonas', capitulos: caps(1, 4) }, // 4 caps
    { livro: 'Amós', capitulos: caps(1, 9) }, // 9 caps
    { livro: 'Oséias', capitulos: caps(1, 14) }, // 14 caps
    { livro: 'Isaías', capitulos: caps(1, 66) }, // 66 caps
    { livro: 'Miquéias', capitulos: caps(1, 7) }, // 7 caps
    { livro: 'Naum', capitulos: caps(1, 3) }, // 3 caps
    { livro: 'Sofonias', capitulos: caps(1, 3) }, // 3 caps
    { livro: 'Habacuque', capitulos: caps(1, 3) }, // 3 caps
    
    // 11. QUEDA DE JERUSALÉM E EXÍLIO
    { livro: 'Jeremias', capitulos: caps(1, 52) }, // 52 caps
    { livro: 'Lamentações', capitulos: caps(1, 5) }, // 5 caps
    
    // PROFETAS DO EXÍLIO
    { livro: 'Ezequiel', capitulos: caps(1, 48) }, // 48 caps
    { livro: 'Daniel', capitulos: caps(1, 12) }, // 12 caps
    
    // 12. RETORNO DO EXÍLIO E RESTAURAÇÃO
    { livro: 'Esdras', capitulos: caps(1, 10) }, // 10 caps
    { livro: 'Ester', capitulos: caps(1, 10) }, // 10 caps
    { livro: 'Neemias', capitulos: caps(1, 13) }, // 13 caps
    
    // PROFETAS PÓS-EXÍLICOS
    { livro: 'Ageu', capitulos: caps(1, 2) }, // 2 caps
    { livro: 'Zacarias', capitulos: caps(1, 14) }, // 14 caps
    { livro: 'Malaquias', capitulos: caps(1, 4) }, // 4 caps (último livro AT)
    
    // SALMOS FINAIS (vários autores)
    { livro: 'Salmos', capitulos: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100] }, // 91-100
    { livro: 'Salmos', capitulos: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110] }, // 101-110
    { livro: 'Salmos', capitulos: [111, 112, 113, 114, 115, 116, 117, 118, 119, 120] }, // 111-120
    { livro: 'Salmos', capitulos: [121, 122, 123, 124, 125, 126, 127, 128, 129, 130] }, // 121-130
    { livro: 'Salmos', capitulos: [131, 132, 133, 134, 135, 136, 137, 138, 139, 140] }, // 131-140
    { livro: 'Salmos', capitulos: [141, 142, 143, 144, 145, 146, 147, 148, 149, 150] }, // 141-150
    
    // ========== ESCRITURAS GREGAS (Novo Testamento) ==========
    
    // 13. VIDA E MINISTÉRIO DE JESUS - Evangelhos Sinóticos
    { livro: 'Mateus', capitulos: caps(1, 28) }, // 28 caps
    { livro: 'Marcos', capitulos: caps(1, 16) }, // 16 caps
    { livro: 'Lucas', capitulos: caps(1, 24) }, // 24 caps
    { livro: 'João', capitulos: caps(1, 21) }, // 21 caps
    
    // 14. IGREJA PRIMITIVA
    { livro: 'Atos', capitulos: caps(1, 28) }, // 28 caps
    
    // 15. CARTAS DE PAULO (ordem cronológica aproximada)
    { livro: 'Gálatas', capitulos: caps(1, 6) }, // 6 caps (48-49 dC)
    { livro: 'Tiago', capitulos: caps(1, 5) }, // 5 caps (antes de 50 dC)
    { livro: '1 Tessalonicenses', capitulos: caps(1, 5) }, // 5 caps (50 dC)
    { livro: '2 Tessalonicenses', capitulos: caps(1, 3) }, // 3 caps (51 dC)
    { livro: '1 Coríntios', capitulos: caps(1, 16) }, // 16 caps (55 dC)
    { livro: '2 Coríntios', capitulos: caps(1, 13) }, // 13 caps (55 dC)
    { livro: 'Romanos', capitulos: caps(1, 16) }, // 16 caps (56 dC)
    { livro: 'Efésios', capitulos: caps(1, 6) }, // 6 caps (60-61 dC)
    { livro: 'Filipenses', capitulos: caps(1, 4) }, // 4 caps (60-61 dC)
    { livro: 'Colossenses', capitulos: caps(1, 4) }, // 4 caps (60-61 dC)
    { livro: 'Filemom', capitulos: [1] }, // 1 cap (60-61 dC)
    { livro: '1 Timóteo', capitulos: caps(1, 6) }, // 6 caps (61-64 dC)
    { livro: 'Tito', capitulos: caps(1, 3) }, // 3 caps (61-64 dC)
    { livro: '2 Timóteo', capitulos: caps(1, 4) }, // 4 caps (65 dC)
    
    // 16. CARTAS GERAIS
    { livro: 'Hebreus', capitulos: caps(1, 13) }, // 13 caps (antes de 70 dC)
    { livro: '1 Pedro', capitulos: caps(1, 5) }, // 5 caps (62-64 dC)
    { livro: '2 Pedro', capitulos: caps(1, 3) }, // 3 caps (64-66 dC)
    { livro: 'Judas', capitulos: [1] }, // 1 cap (65 dC)
    { livro: '1 João', capitulos: caps(1, 5) }, // 5 caps (98 dC)
    { livro: '2 João', capitulos: [1] }, // 1 cap (98 dC)
    { livro: '3 João', capitulos: [1] }, // 1 cap (98 dC)
    
    // 17. REVELAÇÃO FINAL
    { livro: 'Apocalipse', capitulos: caps(1, 22) }, // 22 caps (96 dC)
  ],
  
  // ================================================================================
  // PLANO DE LEITURA SEQUENCIAL (ordem tradicional dos livros)
  // ================================================================================
  sequencial: [
    // Antigo Testamento
    { livro: 'Gênesis', capitulos: caps(1, 50) },
    { livro: 'Êxodo', capitulos: caps(1, 40) },
    { livro: 'Levítico', capitulos: caps(1, 27) },
    { livro: 'Números', capitulos: caps(1, 36) },
    { livro: 'Deuteronômio', capitulos: caps(1, 34) },
    { livro: 'Josué', capitulos: caps(1, 24) },
    { livro: 'Juízes', capitulos: caps(1, 21) },
    { livro: 'Rute', capitulos: caps(1, 4) },
    { livro: '1 Samuel', capitulos: caps(1, 31) },
    { livro: '2 Samuel', capitulos: caps(1, 24) },
    { livro: '1 Reis', capitulos: caps(1, 22) },
    { livro: '2 Reis', capitulos: caps(1, 25) },
    { livro: '1 Crônicas', capitulos: caps(1, 29) },
    { livro: '2 Crônicas', capitulos: caps(1, 36) },
    { livro: 'Esdras', capitulos: caps(1, 10) },
    { livro: 'Neemias', capitulos: caps(1, 13) },
    { livro: 'Ester', capitulos: caps(1, 10) },
    { livro: 'Jó', capitulos: caps(1, 42) },
    { livro: 'Salmos', capitulos: caps(1, 150) },
    { livro: 'Provérbios', capitulos: caps(1, 31) },
    { livro: 'Eclesiastes', capitulos: caps(1, 12) },
    { livro: 'Cântico de Salomão', capitulos: caps(1, 8) },
    { livro: 'Isaías', capitulos: caps(1, 66) },
    { livro: 'Jeremias', capitulos: caps(1, 52) },
    { livro: 'Lamentações', capitulos: caps(1, 5) },
    { livro: 'Ezequiel', capitulos: caps(1, 48) },
    { livro: 'Daniel', capitulos: caps(1, 12) },
    { livro: 'Oséias', capitulos: caps(1, 14) },
    { livro: 'Joel', capitulos: caps(1, 3) },
    { livro: 'Amós', capitulos: caps(1, 9) },
    { livro: 'Obadias', capitulos: [1] },
    { livro: 'Jonas', capitulos: caps(1, 4) },
    { livro: 'Miquéias', capitulos: caps(1, 7) },
    { livro: 'Naum', capitulos: caps(1, 3) },
    { livro: 'Habacuque', capitulos: caps(1, 3) },
    { livro: 'Sofonias', capitulos: caps(1, 3) },
    { livro: 'Ageu', capitulos: caps(1, 2) },
    { livro: 'Zacarias', capitulos: caps(1, 14) },
    { livro: 'Malaquias', capitulos: caps(1, 4) },
    // Novo Testamento
    { livro: 'Mateus', capitulos: caps(1, 28) },
    { livro: 'Marcos', capitulos: caps(1, 16) },
    { livro: 'Lucas', capitulos: caps(1, 24) },
    { livro: 'João', capitulos: caps(1, 21) },
    { livro: 'Atos', capitulos: caps(1, 28) },
    { livro: 'Romanos', capitulos: caps(1, 16) },
    { livro: '1 Coríntios', capitulos: caps(1, 16) },
    { livro: '2 Coríntios', capitulos: caps(1, 13) },
    { livro: 'Gálatas', capitulos: caps(1, 6) },
    { livro: 'Efésios', capitulos: caps(1, 6) },
    { livro: 'Filipenses', capitulos: caps(1, 4) },
    { livro: 'Colossenses', capitulos: caps(1, 4) },
    { livro: '1 Tessalonicenses', capitulos: caps(1, 5) },
    { livro: '2 Tessalonicenses', capitulos: caps(1, 3) },
    { livro: '1 Timóteo', capitulos: caps(1, 6) },
    { livro: '2 Timóteo', capitulos: caps(1, 4) },
    { livro: 'Tito', capitulos: caps(1, 3) },
    { livro: 'Filemom', capitulos: [1] },
    { livro: 'Hebreus', capitulos: caps(1, 13) },
    { livro: 'Tiago', capitulos: caps(1, 5) },
    { livro: '1 Pedro', capitulos: caps(1, 5) },
    { livro: '2 Pedro', capitulos: caps(1, 3) },
    { livro: '1 João', capitulos: caps(1, 5) },
    { livro: '2 João', capitulos: [1] },
    { livro: '3 João', capitulos: [1] },
    { livro: 'Judas', capitulos: [1] },
    { livro: 'Apocalipse', capitulos: caps(1, 22) },
  ],
  
  // ================================================================================
  // PLANO DE LEITURA TEMÁTICO (temas de crescimento espiritual)
  // ================================================================================
  tematico: [
    // Tema 1: FÉ E CONFIANÇA
    { livro: 'Salmos', capitulos: [23, 27, 46, 91, 121] },
    { livro: 'Provérbios', capitulos: [3] },
    { livro: 'Hebreus', capitulos: [11] },
    
    // Tema 2: SABEDORIA
    { livro: 'Provérbios', capitulos: [1, 2, 4, 8, 9] },
    { livro: 'Eclesiastes', capitulos: [3, 12] },
    { livro: 'Tiago', capitulos: [1, 3] },
    
    // Tema 3: AMOR E COMPAIXÃO
    { livro: '1 Coríntios', capitulos: [13] },
    { livro: '1 João', capitulos: [3, 4] },
    { livro: 'João', capitulos: [13, 15] },
    
    // Tema 4: ORAÇÃO
    { livro: 'Salmos', capitulos: [4, 5, 17, 25, 86] },
    { livro: 'Mateus', capitulos: [6, 7] },
    { livro: 'Lucas', capitulos: [11, 18] },
    
    // Tema 5: MINISTÉRIO E PREGAÇÃO
    { livro: 'Mateus', capitulos: [28] },
    { livro: 'Atos', capitulos: [1, 2, 8, 17, 26] },
    { livro: 'Romanos', capitulos: [10] },
    
    // Tema 6: PERSEVERANÇA
    { livro: 'Salmos', capitulos: [37, 73, 84, 119] },
    { livro: 'Romanos', capitulos: [5, 8] },
    { livro: 'Filipenses', capitulos: [3, 4] },
    
    // Tema 7: PROFECIA E FUTURO
    { livro: 'Isaías', capitulos: [11, 65, 66] },
    { livro: 'Daniel', capitulos: [2, 7, 12] },
    { livro: 'Apocalipse', capitulos: [21, 22] },
    
    // Tema 8: CRIAÇÃO E LOUVOR
    { livro: 'Gênesis', capitulos: [1, 2] },
    { livro: 'Salmos', capitulos: [8, 19, 104, 148] },
    { livro: 'Jó', capitulos: [38, 39] },
    
    // Tema 9: PERDÃO E RESTAURAÇÃO
    { livro: 'Salmos', capitulos: [32, 51, 103] },
    { livro: 'Isaías', capitulos: [1, 55] },
    { livro: 'Lucas', capitulos: [15] },
    
    // Tema 10: VIDA DE JESUS
    { livro: 'Lucas', capitulos: [1, 2, 3, 4] },
    { livro: 'João', capitulos: [1, 3, 14, 17] },
    { livro: 'Mateus', capitulos: [5, 6, 7, 26, 27, 28] },
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
  // Total exato de capítulos da Bíblia: 1189
  const totalCapitulos = 1189;
  const progresso = (dados.capitulosLidos / totalCapitulos) * 100;
  return Math.min(Math.round(progresso), 100);
}

// Verificar se já leu hoje
export function jaLeuHoje(dados: DadosLeitura): boolean {
  const hoje = new Date().toISOString().split('T')[0];
  return dados.registros.some(r => r.data === hoje && r.concluido);
}
