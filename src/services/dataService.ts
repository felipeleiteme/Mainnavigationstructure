/**
 * DataService - Fonte Única de Verdade para todos os dados do Mynis
 * 
 * Responsabilidades:
 * - Gerenciar CRUD para todas as entidades
 * - Sincronizar com localStorage
 * - Calcular estatísticas e agregações
 * - Emitir eventos para mudanças de dados
 */

// ===== INTERFACES =====

export interface Estudo {
  id: string;
  estudanteNome: string;
  estudanteAvatar?: string;
  estudanteTelefone?: string;
  estudanteEndereco?: string;
  publicacao: string;
  licao?: number;
  progresso?: number; // 0-100
  data: string; // ISO date
  horario: string;
  observacoes?: string;
  status: 'iniciando' | 'progredindo' | 'duvidas' | 'avancado';
  criadoEm?: string;
}

export interface Revisita {
  id: string;
  nome: string;
  avatar?: string;
  telefone?: string;
  endereco: string;
  coordenadas?: { lat: number; lng: number };
  origem: 'casa-em-casa' | 'testemunho-informal' | 'testemunho-publico' | 'outro';
  dataAdicao: string;
  ultimaVisita?: string;
  proximaVisita?: string;
  quantidadeVisitas: number;
  status: 'nova' | 'interessado' | 'quente' | 'descanso';
  primeiraConversa: string;
  publicacoesEntregues: string[];
  interesseEstudo: boolean;
  observacoes?: string;
  disponibilidade?: string;
  historicoVisitas?: HistoricoVisita[];
}

export interface HistoricoVisita {
  id: string;
  data: string; // ISO date
  encontrou: boolean;
  observacoes?: string;
  publicacoesDeixadas?: string[];
  proximaVisita?: string;
}

export interface Sessao {
  id: string;
  data: string;
  periodo: 'manha' | 'tarde' | 'noite';
  horaInicio: string;
  horaFim?: string;
  duracaoMinutos?: number;
  tipo: 'campo' | 'credito';
  atividades: {
    tipo: 'revisita' | 'casa-em-casa' | 'testemunho-publico' | 'estudo' | 'outro';
    detalhes?: string;
  }[];
  publicacoes?: {
    tipo: 'revista' | 'brochura' | 'livro' | 'tratado';
    titulo: string;
    quantidade: number;
  }[];
  videos?: {
    titulo: string;
    duracao: string;
    categoria: string;
    reacao?: 'positiva' | 'neutra' | 'negativa';
  }[];
  revisitasFeitas?: string[]; // IDs de revisitas
  estudosRealizados?: string[]; // IDs de estudos
  observacoes?: string;
}

export interface SessaoAtiva {
  tempoDecorrido: number; // em minutos
  pausada: boolean;
  tipo: string;
  revisitasVisitadas: number;
  estudosRealizados: number;
  iniciadaEm: number;
  ultimaAtualizacao: number;
  publicacoes: number;
  videos: number;
}

export interface DiarioEntry {
  id: string;
  data: string;
  leitura: string;
  aprendizado: string;
  aplicacao: string;
  palavra: string;
}

export interface Alvo {
  id: string;
  titulo: string;
  tipo: 'leitura' | 'qualidade' | 'servico' | 'outro';
  descricao: string;
  prazo: string;
  progresso: number;
  concluido: boolean;
  dataCriacao: string;
  dataConclusao?: string;
}

export interface TemaExperiencia {
  id: string;
  mes: string; // 'YYYY-MM'
  qualidade: string;
  data: string;
  situacao: string;
  aplicacao: string;
  resultado: string;
  sentimento: string;
}

export interface AtividadeDiaria {
  data: string;
  leituraBiblica: boolean;
  textoDiario: boolean;
  oracao: boolean;
  adoracaoFamilia: boolean;
}

export type TipoPublicador = 
  | 'publicador-regular'
  | 'pioneiro-auxiliar-30'
  | 'pioneiro-auxiliar-50'
  | 'pioneiro-regular';

export interface Perfil {
  nome: string;
  congregacao: string;
  email?: string;
  telefone?: string;
  tipoPublicador: TipoPublicador;
  avatar?: string;
  textoAno?: {
    texto: string;
    referencia: string;
  };
}

// ===== DATA SERVICE =====

class DataServiceClass {
  // ===== MÉTODOS PRIVADOS =====
  
  private gerarIdUnico(): string {
    // Combina timestamp com um número aleatório para garantir unicidade
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Corrigir IDs duplicados em qualquer array de objetos
  private corrigirIdsDuplicados<T extends { id: string }>(items: T[]): T[] {
    const idsVistos = new Set<string>();
    const corrigidos: T[] = [];
    
    for (const item of items) {
      if (idsVistos.has(item.id)) {
        // ID duplicado encontrado, gerar novo ID único
        corrigidos.push({ ...item, id: this.gerarIdUnico() });
      } else {
        idsVistos.add(item.id);
        corrigidos.push(item);
      }
    }
    
    return corrigidos;
  }

  // ===== ESTUDOS BÍBLICOS =====
  
  getEstudos(): Estudo[] {
    const data = localStorage.getItem('estudosBiblicos');
    const estudos = data ? JSON.parse(data) : [];
    // Corrigir IDs duplicados automaticamente
    const estudosCorrigidos = this.corrigirIdsDuplicados(estudos);
    if (estudosCorrigidos.length !== estudos.length || 
        estudosCorrigidos.some((e, i) => e.id !== estudos[i]?.id)) {
      // Se houve correções, salvar
      localStorage.setItem('estudosBiblicos', JSON.stringify(estudosCorrigidos));
    }
    return estudosCorrigidos;
  }

  saveEstudos(estudos: Estudo[]): void {
    localStorage.setItem('estudosBiblicos', JSON.stringify(estudos));
    this.emitChange('estudos');
  }

  getEstudosPorMes(mes: number, ano: number): Estudo[] {
    const estudos = this.getEstudos();
    return estudos.filter(e => {
      const data = new Date(e.data);
      return data.getMonth() === mes && data.getFullYear() === ano;
    });
  }

  getTotalEstudosMes(mes?: number, ano?: number): number {
    if (mes === undefined) {
      const hoje = new Date();
      mes = hoje.getMonth();
      ano = hoje.getFullYear();
    }
    return this.getEstudosPorMes(mes, ano!).length;
  }

  getEstudantesPorEstudo(mes?: number, ano?: number): Map<string, Estudo[]> {
    const estudos = mes !== undefined 
      ? this.getEstudosPorMes(mes, ano!) 
      : this.getEstudos();
    
    const map = new Map<string, Estudo[]>();
    estudos.forEach(estudo => {
      const key = estudo.estudanteNome;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(estudo);
    });
    return map;
  }

  adicionarEstudo(estudo: Omit<Estudo, 'id' | 'criadoEm'>): Estudo {
    const estudos = this.getEstudos();
    const novoEstudo: Estudo = {
      ...estudo,
      id: this.gerarIdUnico(),
      criadoEm: new Date().toISOString()
    };
    estudos.push(novoEstudo);
    this.saveEstudos(estudos);
    return novoEstudo;
  }

  atualizarEstudo(id: string, estudoAtualizado: Estudo): void {
    const estudos = this.getEstudos();
    const index = estudos.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Estudo não encontrado');
    estudos[index] = estudoAtualizado;
    this.saveEstudos(estudos);
  }

  removerEstudo(id: string): void {
    const estudos = this.getEstudos();
    const estudosFiltrados = estudos.filter(e => e.id !== id);
    this.saveEstudos(estudosFiltrados);
  }

  // ===== REVISITAS =====
  
  getRevisitas(): Revisita[] {
    const data = localStorage.getItem('revisitas');
    const revisitas = data ? JSON.parse(data) : [];
    
    // Migração: Preencher dataAdicao para revisitas antigas
    let precisaSalvar = false;
    const revisitasMigradas = revisitas.map((r: any) => {
      if (!r.dataAdicao) {
        precisaSalvar = true;
        // Se não tem dataAdicao, usar ultimaVisita ou data atual
        return {
          ...r,
          dataAdicao: r.ultimaVisita || new Date().toISOString().split('T')[0]
        };
      }
      return r;
    });
    
    // Corrigir IDs duplicados automaticamente
    const revisitasCorrigidas = this.corrigirIdsDuplicados(revisitasMigradas);
    
    if (precisaSalvar || 
        revisitasCorrigidas.length !== revisitas.length || 
        revisitasCorrigidas.some((r, i) => r.id !== revisitas[i]?.id)) {
      // Se houve correções, salvar
      localStorage.setItem('revisitas', JSON.stringify(revisitasCorrigidas));
    }
    return revisitasCorrigidas;
  }

  saveRevisitas(revisitas: Revisita[]): void {
    localStorage.setItem('revisitas', JSON.stringify(revisitas));
    this.emitChange('revisitas');
  }

  getRevisitasNovasMes(mes?: number, ano?: number): Revisita[] {
    if (mes === undefined) {
      const hoje = new Date();
      mes = hoje.getMonth();
      ano = hoje.getFullYear();
    }
    
    const revisitas = this.getRevisitas();
    return revisitas.filter(r => {
      const data = new Date(r.dataAdicao);
      return data.getMonth() === mes && data.getFullYear() === ano;
    });
  }

  getTotalRevisitasNovasMes(): number {
    return this.getRevisitasNovasMes().length;
  }

  adicionarRevisita(revisita: Omit<Revisita, 'id'>): Revisita {
    const revisitas = this.getRevisitas();
    const novaRevisita: Revisita = {
      ...revisita,
      id: this.gerarIdUnico()
    };
    revisitas.push(novaRevisita);
    this.saveRevisitas(revisitas);
    return novaRevisita;
  }

  atualizarRevisita(id: string, revisitaAtualizada: Revisita): void {
    const revisitas = this.getRevisitas();
    const index = revisitas.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Revisita não encontrada');
    revisitas[index] = revisitaAtualizada;
    this.saveRevisitas(revisitas);
  }

  removerRevisita(id: string): void {
    const revisitas = this.getRevisitas();
    const revisitasFiltradas = revisitas.filter(r => r.id !== id);
    this.saveRevisitas(revisitasFiltradas);
  }

  registrarVisita(
    revisitaId: string, 
    visita: { 
      encontrou: boolean; 
      observacoes?: string; 
      publicacoesDeixadas?: string[];
      proximaVisita?: string;
    }
  ): void {
    const revisitas = this.getRevisitas();
    const index = revisitas.findIndex(r => r.id === revisitaId);
    
    if (index === -1) throw new Error('Revisita não encontrada');
    
    const revisita = revisitas[index];
    const hoje = new Date().toISOString().split('T')[0];
    
    // Criar registro de visita
    const novaVisita: HistoricoVisita = {
      id: this.gerarIdUnico(),
      data: hoje,
      encontrou: visita.encontrou,
      observacoes: visita.observacoes,
      publicacoesDeixadas: visita.publicacoesDeixadas,
      proximaVisita: visita.proximaVisita,
    };
    
    // Atualizar revisita
    revisitas[index] = {
      ...revisita,
      ultimaVisita: hoje,
      quantidadeVisitas: revisita.quantidadeVisitas + 1,
      proximaVisita: visita.proximaVisita || revisita.proximaVisita,
      historicoVisitas: [...(revisita.historicoVisitas || []), novaVisita],
    };
    
    this.saveRevisitas(revisitas);
  }

  converterRevisitaEmEstudo(revisitaId: string, estudo: Omit<Estudo, 'id' | 'criadoEm'>): Estudo {
    const revisita = this.getRevisitas().find(r => r.id === revisitaId);
    if (!revisita) throw new Error('Revisita não encontrada');

    // Marcar revisita como convertida
    const revisitas = this.getRevisitas();
    const index = revisitas.findIndex(r => r.id === revisitaId);
    revisitas[index].interesseEstudo = true;
    this.saveRevisitas(revisitas);

    // Criar estudo
    return this.adicionarEstudo(estudo);
  }

  // ===== SESSÕES DE CAMPO =====
  
  getSessoes(): Sessao[] {
    const data = localStorage.getItem('sessoes');
    return data ? JSON.parse(data) : [];
  }

  saveSessoes(sessoes: Sessao[]): void {
    localStorage.setItem('sessoes', JSON.stringify(sessoes));
    this.emitChange('sessoes');
  }

  getSessoesMes(mes?: number, ano?: number): Sessao[] {
    if (mes === undefined) {
      const hoje = new Date();
      mes = hoje.getMonth();
      ano = hoje.getFullYear();
    }
    
    const sessoes = this.getSessoes();
    return sessoes.filter(s => {
      const data = new Date(s.data);
      return data.getMonth() === mes && data.getFullYear() === ano;
    });
  }

  getTotalHorasMes(): number {
    const sessoes = this.getSessoesMes();
    return sessoes.reduce((total, s) => total + (s.duracaoMinutos || 0), 0) / 60;
  }

  getTotalHorasCampo(): number {
    const sessoes = this.getSessoesMes();
    return sessoes
      .filter(s => s.tipo === 'campo')
      .reduce((total, s) => total + (s.duracaoMinutos || 0), 0) / 60;
  }

  getTotalHorasCredito(): number {
    const sessoes = this.getSessoesMes();
    return sessoes
      .filter(s => s.tipo === 'credito')
      .reduce((total, s) => total + (s.duracaoMinutos || 0), 0) / 60;
  }

  getTotalHorasAno(ano: number): number {
    const sessoes = this.getSessoes();
    return sessoes
      .filter(s => {
        const data = new Date(s.data);
        return data.getFullYear() === ano;
      })
      .reduce((total, s) => total + (s.duracaoMinutos || 0), 0) / 60;
  }

  adicionarSessao(sessao: Omit<Sessao, 'id'>): Sessao {
    const sessoes = this.getSessoes();
    const novaSessao: Sessao = {
      ...sessao,
      id: this.gerarIdUnico()
    };
    sessoes.push(novaSessao);
    this.saveSessoes(sessoes);
    return novaSessao;
  }

  atualizarSessao(id: string, sessaoAtualizada: Partial<Sessao>): void {
    const sessoes = this.getSessoes();
    const index = sessoes.findIndex(s => s.id === id);
    if (index !== -1) {
      sessoes[index] = { ...sessoes[index], ...sessaoAtualizada };
      this.saveSessoes(sessoes);
    }
  }

  excluirSessao(id: string): void {
    const sessoes = this.getSessoes();
    const novasSessoes = sessoes.filter(s => s.id !== id);
    this.saveSessoes(novasSessoes);
  }

  getSessaoPorId(id: string): Sessao | undefined {
    const sessoes = this.getSessoes();
    return sessoes.find(s => s.id === id);
  }

  getSessoesPorMes(mesCompleto: string): Sessao[] {
    const sessoes = this.getSessoes();
    return sessoes.filter(s => s.data.startsWith(mesCompleto));
  }

  // ===== SESSÃO ATIVA =====

  getSessaoAtiva(): SessaoAtiva | null {
    const data = localStorage.getItem('sessaoAtiva');
    if (!data) return null;
    
    const sessao = JSON.parse(data);
    // Calcular tempo decorrido desde última atualização
    const agora = Date.now();
    const tempoPassado = Math.floor((agora - sessao.ultimaAtualizacao) / 60000); // minutos
    sessao.tempoDecorrido = (sessao.tempoDecorrido || 0) + (sessao.pausada ? 0 : tempoPassado);
    sessao.ultimaAtualizacao = agora;
    
    return sessao;
  }

  iniciarSessaoAtiva(tipo: string): SessaoAtiva {
    const sessao: SessaoAtiva = {
      tempoDecorrido: 0,
      pausada: false,
      tipo,
      revisitasVisitadas: 0,
      estudosRealizados: 0,
      iniciadaEm: Date.now(),
      ultimaAtualizacao: Date.now(),
      publicacoes: 0,
      videos: 0,
    };
    localStorage.setItem('sessaoAtiva', JSON.stringify(sessao));
    this.emitChange('sessaoAtiva');
    return sessao;
  }

  atualizarSessaoAtiva(updates: Partial<SessaoAtiva>): void {
    const sessao = this.getSessaoAtiva();
    if (!sessao) return;
    
    const sessaoAtualizada = {
      ...sessao,
      ...updates,
      ultimaAtualizacao: Date.now(),
    };
    
    localStorage.setItem('sessaoAtiva', JSON.stringify(sessaoAtualizada));
    this.emitChange('sessaoAtiva');
  }

  pausarSessaoAtiva(): void {
    this.atualizarSessaoAtiva({ pausada: true });
  }

  retomarSessaoAtiva(): void {
    this.atualizarSessaoAtiva({ pausada: false });
  }

  finalizarSessaoAtiva(dados: {
    publicacoes: number;
    videos: number;
    observacoes: string;
    categoria: 'campo' | 'credito';
  }): Sessao {
    const sessaoAtiva = this.getSessaoAtiva();
    if (!sessaoAtiva) throw new Error('Nenhuma sessão ativa');

    // Determinar período do dia
    const hora = new Date(sessaoAtiva.iniciadaEm).getHours();
    let periodo: 'manha' | 'tarde' | 'noite' = 'tarde';
    if (hora < 12) periodo = 'manha';
    else if (hora >= 18) periodo = 'noite';

    // Criar sessão completa
    const sessao: Omit<Sessao, 'id'> = {
      data: new Date(sessaoAtiva.iniciadaEm).toISOString().split('T')[0],
      periodo,
      horaInicio: new Date(sessaoAtiva.iniciadaEm).toTimeString().slice(0, 5),
      horaFim: new Date().toTimeString().slice(0, 5),
      duracaoMinutos: sessaoAtiva.tempoDecorrido,
      tipo: dados.categoria,
      atividades: [
        {
          tipo: sessaoAtiva.tipo as any,
          detalhes: dados.observacoes,
        }
      ],
      publicacoes: dados.publicacoes > 0 ? [{
        tipo: 'revista',
        titulo: 'Publicações diversas',
        quantidade: dados.publicacoes,
      }] : undefined,
      videos: dados.videos > 0 ? [{
        titulo: 'Vídeos mostrados',
        duracao: '5min',
        categoria: 'Ensino',
      }] : undefined,
      observacoes: dados.observacoes,
    };

    // Salvar sessão no histórico
    const sessaoSalva = this.adicionarSessao(sessao);

    // Limpar sessão ativa
    localStorage.removeItem('sessaoAtiva');
    this.emitChange('sessaoAtiva');

    return sessaoSalva;
  }

  // ===== PUBLICAÇÕES =====

  getTotalPublicacoesMes(): number {
    const sessoes = this.getSessoesMes();
    return sessoes.reduce((total, s) => {
      return total + (s.publicacoes?.reduce((sum, p) => sum + p.quantidade, 0) || 0);
    }, 0);
  }

  getPublicacoesPorTipo(): Map<string, number> {
    const sessoes = this.getSessoesMes();
    const map = new Map<string, number>();
    
    sessoes.forEach(s => {
      s.publicacoes?.forEach(p => {
        const atual = map.get(p.tipo) || 0;
        map.set(p.tipo, atual + p.quantidade);
      });
    });
    
    return map;
  }

  // ===== VÍDEOS =====

  getTotalVideosMes(): number {
    const sessoes = this.getSessoesMes();
    return sessoes.reduce((total, s) => total + (s.videos?.length || 0), 0);
  }

  getVideosPorCategoria(): Map<string, number> {
    const sessoes = this.getSessoesMes();
    const map = new Map<string, number>();
    
    sessoes.forEach(s => {
      s.videos?.forEach(v => {
        const atual = map.get(v.categoria) || 0;
        map.set(v.categoria, atual + 1);
      });
    });
    
    return map;
  }

  // ===== DIÁRIO ESPIRITUAL =====

  getDiario(): DiarioEntry[] {
    const data = localStorage.getItem('diarioEspiritual');
    return data ? JSON.parse(data) : [];
  }

  saveDiario(entries: DiarioEntry[]): void {
    localStorage.setItem('diarioEspiritual', JSON.stringify(entries));
    this.emitChange('diario');
  }

  adicionarReflexao(entry: Omit<DiarioEntry, 'id'>): DiarioEntry {
    const diario = this.getDiario();
    const novaEntry: DiarioEntry = {
      ...entry,
      id: this.gerarIdUnico()
    };
    diario.push(novaEntry);
    this.saveDiario(diario);
    return novaEntry;
  }

  // ===== ALVOS =====

  getAlvos(): Alvo[] {
    const data = localStorage.getItem('alvos');
    return data ? JSON.parse(data) : [];
  }

  saveAlvos(alvos: Alvo[]): void {
    localStorage.setItem('alvos', JSON.stringify(alvos));
    this.emitChange('alvos');
  }

  getAlvosAtivos(): Alvo[] {
    return this.getAlvos().filter(a => !a.concluido);
  }

  adicionarAlvo(alvo: Omit<Alvo, 'id' | 'dataCriacao'>): Alvo {
    const alvos = this.getAlvos();
    const novoAlvo: Alvo = {
      ...alvo,
      id: this.gerarIdUnico(),
      dataCriacao: new Date().toISOString(),
      progresso: alvo.progresso || 0,
      concluido: false,
    };
    alvos.push(novoAlvo);
    this.saveAlvos(alvos);
    return novoAlvo;
  }

  atualizarAlvo(id: string, alvoAtualizado: Partial<Alvo>): void {
    const alvos = this.getAlvos();
    const index = alvos.findIndex(a => a.id === id);
    if (index !== -1) {
      alvos[index] = { ...alvos[index], ...alvoAtualizado };
      if (alvoAtualizado.concluido) {
        alvos[index].dataConclusao = new Date().toISOString();
      }
      this.saveAlvos(alvos);
    }
  }

  excluirAlvo(id: string): void {
    const alvos = this.getAlvos();
    const novosAlvos = alvos.filter(a => a.id !== id);
    this.saveAlvos(novosAlvos);
  }

  // ===== TEMA DO MÊS =====

  getTemaExperiencias(): TemaExperiencia[] {
    const data = localStorage.getItem('temaExperiencias');
    return data ? JSON.parse(data) : [];
  }

  saveTemaExperiencias(experiencias: TemaExperiencia[]): void {
    localStorage.setItem('temaExperiencias', JSON.stringify(experiencias));
    this.emitChange('tema');
  }

  getTemaExperienciasMes(mes: string): TemaExperiencia[] {
    return this.getTemaExperiencias().filter(e => e.mes === mes);
  }

  // ===== ATIVIDADES DIÁRIAS =====

  getAtividades(): AtividadeDiaria[] {
    const data = localStorage.getItem('atividadesDiarias');
    return data ? JSON.parse(data) : [];
  }

  saveAtividades(atividades: AtividadeDiaria[]): void {
    localStorage.setItem('atividadesDiarias', JSON.stringify(atividades));
    this.emitChange('atividades');
  }

  getAtividadeDia(data: string): AtividadeDiaria | undefined {
    return this.getAtividades().find(a => a.data === data);
  }

  marcarAtividade(data: string, tipo: keyof Omit<AtividadeDiaria, 'data'>, valor: boolean): void {
    const atividades = this.getAtividades();
    const index = atividades.findIndex(a => a.data === data);
    
    if (index >= 0) {
      atividades[index][tipo] = valor;
    } else {
      atividades.push({
        data,
        leituraBiblica: tipo === 'leituraBiblica' ? valor : false,
        textoDiario: tipo === 'textoDiario' ? valor : false,
        oracao: tipo === 'oracao' ? valor : false,
        adoracaoFamilia: tipo === 'adoracaoFamilia' ? valor : false
      });
    }
    
    this.saveAtividades(atividades);
  }

  // ===== OFENSIVA DE LEITURA =====

  getOfensivaLeitura(): number {
    let diasSeguidos = 0;
    const hoje = new Date();
    
    for (let i = 0; i < 365; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      const atividade = this.getAtividadeDia(dataStr);
      if (atividade?.leituraBiblica) {
        diasSeguidos++;
      } else {
        break;
      }
    }
    
    return diasSeguidos;
  }

  // ===== PERFIL =====

  getPerfil(): Perfil {
    const data = localStorage.getItem('perfil');
    if (data) {
      return JSON.parse(data);
    }
    
    // Perfil padrão
    return {
      nome: 'Felipe Silva',
      congregacao: 'Congregação Central',
      email: 'felipe.silva@email.com',
      telefone: '(11) 98765-4321',
      tipoPublicador: 'pioneiro-regular',
    };
  }

  savePerfil(perfil: Perfil): void {
    localStorage.setItem('perfil', JSON.stringify(perfil));
    this.emitChange('perfil');
  }

  updatePerfil(updates: Partial<Perfil>): void {
    const perfil = this.getPerfil();
    const perfilAtualizado = { ...perfil, ...updates };
    this.savePerfil(perfilAtualizado);
  }

  getMetaMensal(): number {
    const perfil = this.getPerfil();
    
    switch (perfil.tipoPublicador) {
      case 'publicador-regular':
        return 10; // Meta sugerida para publicadores
      case 'pioneiro-auxiliar-30':
        return 30;
      case 'pioneiro-auxiliar-50':
        return 50;
      case 'pioneiro-regular':
        return 70;
      default:
        return 10;
    }
  }

  getMetaAnual(): number {
    // Meta anual = meta mensal * 12
    return this.getMetaMensal() * 12;
  }

  getTipoPublicadorLabel(tipo: TipoPublicador): string {
    switch (tipo) {
      case 'publicador-regular':
        return 'Publicador Regular';
      case 'pioneiro-auxiliar-30':
        return 'Pioneiro Auxiliar (30h)';
      case 'pioneiro-auxiliar-50':
        return 'Pioneiro Auxiliar (50h)';
      case 'pioneiro-regular':
        return 'Pioneiro Regular';
      default:
        return 'Publicador Regular';
    }
  }

  // ===== EVENTOS =====

  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emitChange(entity: string): void {
    this.listeners.get('change')?.forEach(cb => cb(entity));
    this.listeners.get(`change:${entity}`)?.forEach(cb => cb());
    
    // Também emitir evento global
    window.dispatchEvent(new CustomEvent('mynis-data-change', { 
      detail: { entity } 
    }));
  }

  // ===== UTILIDADES =====

  limparTodosDados(): void {
    const keys = [
      'estudosBiblicos',
      'revisitas',
      'sessoes',
      'diarioEspiritual',
      'alvos',
      'temaExperiencias',
      'atividadesDiarias'
    ];
    keys.forEach(key => localStorage.removeItem(key));
    this.emitChange('all');
  }

  exportarDados(): string {
    return JSON.stringify({
      estudos: this.getEstudos(),
      revisitas: this.getRevisitas(),
      sessoes: this.getSessoes(),
      diario: this.getDiario(),
      alvos: this.getAlvos(),
      temaExperiencias: this.getTemaExperiencias(),
      atividades: this.getAtividades()
    }, null, 2);
  }

  importarDados(json: string): void {
    const data = JSON.parse(json);
    if (data.temaExperiencias) this.saveTemaExperiencias(data.temaExperiencias);
    if (data.atividades) this.saveAtividades(data.atividades);
    this.emitChange('all');
  }

  // ===== BACKUP E RESTAURAÇÃO =====

  /**
   * Exporta todos os dados do app em formato JSON
   * Retorna uma string JSON com todos os dados + metadados
   */
  exportarBackup(): string {
    const backup = {
      versao: '1.0.0',
      dataExportacao: new Date().toISOString(),
      appName: 'Mynis',
      dados: {
        perfil: this.getPerfil(),
        metaMensal: this.getMetaMensal(),
        estudos: this.getEstudos(),
        revisitas: this.getRevisitas(),
        sessoes: this.getSessoes(),
        diario: this.getDiario(),
        alvos: this.getAlvos(),
        temaExperiencias: this.getTemaExperiencias(),
        atividades: this.getAtividades(),
        leituraBiblica: {
          planoAtual: localStorage.getItem('planoLeituraAtual') || null,
          leituras: JSON.parse(localStorage.getItem('leiturasBiblicas') || '[]'),
          configuracoes: JSON.parse(localStorage.getItem('configuracoesLeitura') || '{}'),
        }
      }
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Baixa o backup como arquivo JSON
   */
  baixarBackup(): void {
    try {
      const backupJson = this.exportarBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      const dataFormatada = new Date().toISOString().split('T')[0];
      link.download = `mynis-backup-${dataFormatada}.json`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
      
      // Salvar timestamp da última sincronização
      localStorage.setItem('ultimaSync', new Date().toISOString());
      
      this.emitChange('backup');
    } catch (error) {
      console.error('Erro ao baixar backup:', error);
      throw new Error('Falha ao criar arquivo de backup');
    }
  }

  /**
   * Importa dados de um arquivo de backup
   * Valida a estrutura antes de restaurar
   */
  async importarBackup(arquivo: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const conteudo = e.target?.result as string;
          const backup = JSON.parse(conteudo);
          
          // Validação básica
          if (!backup.appName || backup.appName !== 'Mynis') {
            throw new Error('Arquivo de backup inválido');
          }
          
          if (!backup.dados) {
            throw new Error('Dados de backup não encontrados');
          }
          
          // Confirmar antes de restaurar
          const confirmar = window.confirm(
            `Restaurar backup de ${new Date(backup.dataExportacao).toLocaleDateString('pt-BR')}?\n\n` +
            `⚠️ ATENÇÃO: Todos os dados atuais serão substituídos!\n\n` +
            `Dados no backup:\n` +
            `• ${backup.dados.estudos?.length || 0} estudos\n` +
            `• ${backup.dados.revisitas?.length || 0} revisitas\n` +
            `• ${backup.dados.sessoes?.length || 0} sessões de campo\n` +
            `• ${backup.dados.diario?.length || 0} entradas de gratidão\n` +
            `• ${backup.dados.alvos?.length || 0} alvos espirituais`
          );
          
          if (!confirmar) {
            reject(new Error('Restauração cancelada pelo usuário'));
            return;
          }
          
          // Restaurar dados
          const dados = backup.dados;
          
          if (dados.perfil) localStorage.setItem('perfil', JSON.stringify(dados.perfil));
          if (dados.metaMensal) localStorage.setItem('metaMensal', JSON.stringify(dados.metaMensal));
          if (dados.estudos) localStorage.setItem('estudos', JSON.stringify(dados.estudos));
          if (dados.revisitas) localStorage.setItem('revisitas', JSON.stringify(dados.revisitas));
          if (dados.sessoes) localStorage.setItem('sessoes', JSON.stringify(dados.sessoes));
          if (dados.diario) localStorage.setItem('diario', JSON.stringify(dados.diario));
          if (dados.alvos) localStorage.setItem('alvos', JSON.stringify(dados.alvos));
          if (dados.temaExperiencias) localStorage.setItem('temaExperiencias', JSON.stringify(dados.temaExperiencias));
          if (dados.atividades) localStorage.setItem('atividades', JSON.stringify(dados.atividades));
          
          // Restaurar dados de leitura bíblica
          if (dados.leituraBiblica) {
            if (dados.leituraBiblica.planoAtual) {
              localStorage.setItem('planoLeituraAtual', dados.leituraBiblica.planoAtual);
            }
            if (dados.leituraBiblica.leituras) {
              localStorage.setItem('leiturasBiblicas', JSON.stringify(dados.leituraBiblica.leituras));
            }
            if (dados.leituraBiblica.configuracoes) {
              localStorage.setItem('configuracoesLeitura', JSON.stringify(dados.leituraBiblica.configuracoes));
            }
          }
          
          // Salvar timestamp da restauração
          localStorage.setItem('ultimaSync', new Date().toISOString());
          
          this.emitChange('all');
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(arquivo);
    });
  }

  /**
   * Retorna a data da última sincronização
   */
  getUltimaSync(): Date | null {
    const timestamp = localStorage.getItem('ultimaSync');
    return timestamp ? new Date(timestamp) : null;
  }

  /**
   * Retorna texto amigável da última sincronização
   */
  getTextoUltimaSync(): string {
    const ultimaSync = this.getUltimaSync();
    
    if (!ultimaSync) {
      return 'Nunca sincronizado';
    }
    
    const agora = new Date();
    const diffMs = agora.getTime() - ultimaSync.getTime();
    const diffMinutos = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);
    
    if (diffMinutos < 1) return 'Agora mesmo';
    if (diffMinutos === 1) return 'Há 1 minuto';
    if (diffMinutos < 60) return `Há ${diffMinutos} minutos`;
    if (diffHoras === 1) return 'Há 1 hora';
    if (diffHoras < 24) return `Há ${diffHoras} horas`;
    if (diffDias === 1) return 'Ontem';
    if (diffDias < 7) return `Há ${diffDias} dias`;
    
    return ultimaSync.toLocaleDateString('pt-BR');
  }
}

// Singleton
export const DataService = new DataServiceClass();