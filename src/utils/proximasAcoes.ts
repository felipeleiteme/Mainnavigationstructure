export interface ProximaAcao {
  id: string;
  tipo: 'estudo' | 'revisita' | 'leitura' | 'cronograma' | 'relatorio' | 'tema';
  icone: string;
  titulo: string;
  subtexto: string;
  badge?: number;
  cor: string;
  urgencia: number; // 1-10
  importancia: number; // 1-10
  contexto: number; // 1-10
  destino: {
    tab: string;
    filtro?: string;
    scroll?: string;
    acao?: string;
  };
  dados?: any;
}

export function calcularScore(acao: ProximaAcao): number {
  return (acao.urgencia * 5) + (acao.importancia * 3) + (acao.contexto * 2);
}

export function gerarProximasAcoes(): ProximaAcao[] {
  const acoes: ProximaAcao[] = [];
  const hoje = new Date();
  const hora = hoje.getHours();
  const diaSemana = hoje.getDay();

  // 1. Verificar estudos de hoje
  const estudos = JSON.parse(localStorage.getItem('estudosBiblicos') || '[]');
  const estudosHoje = estudos.filter((e: any) => {
    if (!e.proximaVisitaData) return false;
    const dataEstudo = new Date(e.proximaVisitaData);
    return dataEstudo.toDateString() === hoje.toDateString();
  });

  if (estudosHoje.length > 0) {
    const proximoEstudo = estudosHoje[0];
    const horaEstudo = proximoEstudo.proximaVisitaHora || '14:00';
    const [h, m] = horaEstudo.split(':').map(Number);
    const tempoAte = (h * 60 + m) - (hora * 60 + hoje.getMinutes());
    
    let urgencia = 5;
    if (tempoAte < 60) urgencia = 10; // Menos de 1h
    else if (tempoAte < 120) urgencia = 8; // Menos de 2h
    else if (tempoAte < 240) urgencia = 6; // Menos de 4h

    const nomes = estudosHoje.slice(0, 3).map((e: any) => {
      const hora = e.proximaVisitaHora || '14h';
      return `${e.nome} (${hora})`;
    }).join(', ');

    acoes.push({
      id: 'estudos-hoje',
      tipo: 'estudo',
      icone: '🎓',
      titulo: `${estudosHoje.length} estudo${estudosHoje.length > 1 ? 's' : ''} hoje`,
      subtexto: nomes,
      badge: estudosHoje.length,
      cor: 'bg-blue-50 border-blue-200',
      urgencia,
      importancia: 9,
      contexto: 8,
      destino: {
        tab: 'estudos',
        filtro: 'hoje',
      },
      dados: { estudosHoje },
    });
  }

  // 2. Verificar leitura da Bíblia
  const ultimaLeitura = localStorage.getItem('ultima_leitura_data');
  const diasSemLeitura = ultimaLeitura
    ? Math.floor((hoje.getTime() - new Date(ultimaLeitura).getTime()) / (1000 * 60 * 60 * 24))
    : 3;

  if (diasSemLeitura > 0) {
    acoes.push({
      id: 'leitura-biblia',
      tipo: 'leitura',
      icone: '📖',
      titulo: diasSemLeitura === 1 
        ? 'Leitura da Bíblia hoje' 
        : `${diasSemLeitura} dias sem leitura da Bíblia`,
      subtexto: 'Que tal ler Lucas 10 hoje?',
      cor: 'bg-yellow-50 border-yellow-200',
      urgencia: Math.min(diasSemLeitura * 2, 10),
      importancia: 7,
      contexto: hora >= 15 && hora <= 21 ? 8 : 5,
      destino: {
        tab: 'espiritual',
        scroll: 'leitura',
      },
    });
  }

  // 3. Verificar revisitas disponíveis
  const revisitas = JSON.parse(localStorage.getItem('revisitas') || '[]');
  const revisitasDisponiveis = revisitas.filter((r: any) => {
    if (!r.disponibilidade) return false;
    
    const periodo = hora < 12 ? 'Manhã' : hora < 18 ? 'Tarde' : 'Noite';
    const diasDisponiveis = r.disponibilidade[periodo] || [];
    
    return diasDisponiveis.includes(diaSemana);
  });

  if (revisitasDisponiveis.length > 0) {
    acoes.push({
      id: 'revisitas-disponiveis',
      tipo: 'revisita',
      icone: '🌱',
      titulo: `${revisitasDisponiveis.length} revisita${revisitasDisponiveis.length > 1 ? 's' : ''} disponível${revisitasDisponiveis.length > 1 ? 'eis' : ''} agora`,
      subtexto: 'Pessoas que você pode visitar agora',
      badge: revisitasDisponiveis.length,
      cor: 'bg-green-50 border-green-200',
      urgencia: 6,
      importancia: 7,
      contexto: 9,
      destino: {
        tab: 'campo',
        filtro: 'disponiveis',
      },
      dados: { revisitasDisponiveis },
    });
  }

  // 4. Verificar cronograma ideal
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const cronograma = userData.cronograma;
  
  if (cronograma) {
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    const diaAmanha = amanha.getDay();
    
    // Verificar se tem algo planejado para amanhã
    let temPlanoCronograma = false;
    let periodo = '';
    
    if (cronograma[0] && cronograma[0][diaAmanha]) {
      temPlanoCronograma = true;
      periodo = 'Manhã (9h)';
    } else if (cronograma[1] && cronograma[1][diaAmanha]) {
      temPlanoCronograma = true;
      periodo = 'Tarde (14h)';
    } else if (cronograma[2] && cronograma[2][diaAmanha]) {
      temPlanoCronograma = true;
      periodo = 'Noite (19h)';
    }

    if (temPlanoCronograma) {
      acoes.push({
        id: 'cronograma-amanha',
        tipo: 'cronograma',
        icone: '⏰',
        titulo: `Lembre-se: saída ao campo amanhã`,
        subtexto: `Baseado no seu Cronograma Ideal - ${periodo}`,
        cor: 'bg-blue-50 border-blue-200',
        urgencia: 7,
        importancia: 6,
        contexto: hora >= 18 ? 8 : 5,
        destino: {
          tab: 'perfil',
          scroll: 'cronograma',
        },
      });
    }
  }

  // 5. Verificar relatório
  const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const diasAteRelatorio = ultimoDiaMes - hoje.getDate();

  if (diasAteRelatorio <= 5 && diasAteRelatorio >= 0) {
    const relatorioEnviado = localStorage.getItem(`relatorio_${hoje.getMonth()}_enviado`);
    
    if (!relatorioEnviado) {
      acoes.push({
        id: 'enviar-relatorio',
        tipo: 'relatorio',
        icone: '📝',
        titulo: diasAteRelatorio === 0 
          ? 'Último dia para enviar relatório!'
          : `Enviar relatório em ${diasAteRelatorio} dia${diasAteRelatorio > 1 ? 's' : ''}`,
        subtexto: 'Lembre-se de enviar seu relatório mensal',
        cor: diasAteRelatorio <= 2 ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200',
        urgencia: 10 - diasAteRelatorio * 2,
        importancia: 10,
        contexto: 7,
        destino: {
          tab: 'perfil',
          acao: diasAteRelatorio <= 2 ? 'enviar-relatorio' : 'scroll-relatorio',
        },
      });
    }
  }

  // 6. Verificar tema do mês
  const qualidadeMes = JSON.parse(localStorage.getItem('userData') || '{}').qualidadeMes || 'brandura';
  const experiencias = JSON.parse(localStorage.getItem(`experiencias_${qualidadeMes}`) || '[]');
  const diasDesdeUltimaExp = experiencias.length > 0
    ? Math.floor((hoje.getTime() - new Date(experiencias[0].data).getTime()) / (1000 * 60 * 60 * 24))
    : 7;

  if (diasDesdeUltimaExp >= 3) {
    acoes.push({
      id: 'tema-mes',
      tipo: 'tema',
      icone: '🕊️',
      titulo: 'Cultive Brandura esta semana',
      subtexto: 'Registre suas experiências',
      cor: 'bg-indigo-50 border-indigo-200',
      urgencia: 4,
      importancia: 6,
      contexto: 7,
      destino: {
        tab: 'inicio',
        acao: 'abrir-tema',
      },
    });
  }

  // Ordenar por score
  return acoes
    .sort((a, b) => calcularScore(b) - calcularScore(a))
    .slice(0, 5); // Top 5
}

export function marcarAcaoConcluida(acaoId: string) {
  const concluidas = JSON.parse(localStorage.getItem('acoes_concluidas') || '[]');
  concluidas.push({
    id: acaoId,
    data: new Date().toISOString(),
  });
  localStorage.setItem('acoes_concluidas', JSON.stringify(concluidas));
}

export function adiarAcao(acaoId: string, novaData: Date) {
  const adiadas = JSON.parse(localStorage.getItem('acoes_adiadas') || '{}');
  adiadas[acaoId] = novaData.toISOString();
  localStorage.setItem('acoes_adiadas', JSON.stringify(adiadas));
}

export function removerAcao(acaoId: string) {
  const removidas = JSON.parse(localStorage.getItem('acoes_removidas') || '[]');
  removidas.push(acaoId);
  localStorage.setItem('acoes_removidas', JSON.stringify(removidas));
}
