import { ArrowLeft, Clock, MapPin, Building2, Phone, Mail, Briefcase, Users, BookOpen, Plus, Trash2, CheckCircle2, UserCircle, Home, Sprout, Timer, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataService, Sessao } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

interface CadastrarTempoPageProps {
  onVoltar: () => void;
  sessaoParaEditar?: Sessao | null;
}

type Passo = 'escolher-tipo' | 'selecionar-pessoa' | 'definir-tempo' | 'revisao';

interface AtividadeTemp {
  id: string;
  tipo: string;
  nome: string;
  emoji: string;
  horas: number;
  minutos: number;
  categoria: 'campo' | 'credito';
  pessoaId?: string;
  pessoaNome?: string;
}

export default function CadastrarTempoPage({ onVoltar, sessaoParaEditar }: CadastrarTempoPageProps) {
  const [passo, setPasso] = useState<Passo>('escolher-tipo');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<string | null>(null);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<{ id: string; nome: string } | null>(null);
  const [atividades, setAtividades] = useState<AtividadeTemp[]>([]);
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(30);

  // Helper para obter ícone por tipo de atividade
  const getIconForTipo = (tipoId: string) => {
    const iconClass = "w-6 h-6";
    switch (tipoId) {
      case 'casa-em-casa': return <Home className={iconClass} />;
      case 'revisita': return <Sprout className={iconClass} />;
      case 'estudo-biblico': return <BookOpen className={iconClass} />;
      case 'testemunho-publico': return <Building2 className={iconClass} />;
      case 'telefone': return <Phone className={iconClass} />;
      case 'carta': return <Mail className={iconClass} />;
      case 'informal': return <Briefcase className={iconClass} />;
      case 'credito': return <Clock className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  // Carregar dados da sessão para edição
  useEffect(() => {
    if (sessaoParaEditar) {
      // Converter as atividades da sessão para o formato temporário
      const atividadesTemp: AtividadeTemp[] = (sessaoParaEditar.atividades || []).map((ativ, idx) => {
        const tipoInfo = tiposAtividade.find(t => t.id === ativ.tipo);
        // Parse do tempo dos detalhes
        let horas = 0;
        let minutos = 0;
        let pessoaNome: string | undefined;
        
        if (ativ.detalhes) {
          const parts = ativ.detalhes.split(' - ');
          const tempoStr = parts[parts.length - 1]; // Última parte é sempre o tempo
          const tempoMatch = tempoStr.match(/(\d+)h\s*(\d+)min|(\d+)h|(\d+)min/);
          
          if (tempoMatch) {
            horas = parseInt(tempoMatch[1] || tempoMatch[3] || '0');
            minutos = parseInt(tempoMatch[2] || tempoMatch[4] || '0');
          }
          
          // Se tem mais de uma parte, a primeira é o nome da pessoa
          if (parts.length > 1) {
            pessoaNome = parts[0];
          }
        }
        
        return {
          id: `${idx}`,
          tipo: ativ.tipo,
          nome: tipoInfo?.nome || ativ.tipo,
          emoji: tipoInfo?.emoji || '📌',
          horas,
          minutos,
          categoria: sessaoParaEditar.tipo,
          pessoaNome,
        };
      });
      
      setAtividades(atividadesTemp);
      setPasso('revisao');
    }
  }, [sessaoParaEditar]);

  // Scroll para o topo quando o componente montar ou mudar de passo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [passo]);

  const tiposAtividade = [
    {
      id: 'casa-em-casa',
      nome: 'Casa em Casa',
      descricao: 'Visitação porta a porta',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'revisita',
      nome: 'Revisita',
      descricao: 'Visitar interesse',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: true,
    },
    {
      id: 'estudo-biblico',
      nome: 'Estudo Bíblico',
      descricao: 'Conduzir estudo',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: true,
    },
    {
      id: 'testemunho-publico',
      nome: 'Testemunho Público',
      descricao: 'Carrinho ou banca pública',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'telefone',
      nome: 'Por Telefone',
      descricao: 'Chamadas e mensagens',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'carta',
      nome: 'Por Carta',
      descricao: 'Cartas e mensagens escritas',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'informal',
      nome: 'Informal',
      descricao: 'Conversas casuais',
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'credito',
      nome: 'Crédito',
      descricao: 'Tempo especial (LDC, hospitalar, etc)',
      tipo: 'credito' as 'campo' | 'credito',
      requerPessoa: false,
    },
  ];

  const handleSelecionarTipo = (tipoId: string) => {
    setAtividadeSelecionada(tipoId);
    const tipo = tiposAtividade.find(t => t.id === tipoId);
    
    // Se requer pessoa, vai para seleção de pessoa; senão vai direto para tempo
    if (tipo?.requerPessoa) {
      setPasso('selecionar-pessoa');
    } else {
      setPasso('definir-tempo');
    }
  };

  const handleSelecionarPessoa = (pessoaId: string, pessoaNome: string) => {
    setPessoaSelecionada({ id: pessoaId, nome: pessoaNome });
    setPasso('definir-tempo');
  };

  const handleAdicionarAtividade = () => {
    const totalMinutos = horas * 60 + minutos;
    
    if (totalMinutos === 0) {
      toast.error('Configure um tempo maior que 0');
      return;
    }

    const tipoInfo = tiposAtividade.find(t => t.id === atividadeSelecionada);
    if (!tipoInfo) return;

    const novaAtividade: AtividadeTemp = {
      id: Date.now().toString(),
      tipo: tipoInfo.id,
      nome: tipoInfo.nome,
      emoji: tipoInfo.emoji,
      horas,
      minutos,
      categoria: tipoInfo.tipo,
      pessoaId: pessoaSelecionada?.id,
      pessoaNome: pessoaSelecionada?.nome,
    };

    setAtividades(prev => [...prev, novaAtividade]);
    
    const descricao = pessoaSelecionada 
      ? `${tipoInfo.emoji} ${pessoaSelecionada.nome} - ${formatarTempo(horas, minutos)}`
      : `${tipoInfo.emoji} ${tipoInfo.nome} - ${formatarTempo(horas, minutos)}`;
    
    toast.success('Atividade adicionada!', { description: descricao });
    
    // Resetar para adicionar outra atividade ou ir para revisão
    setAtividadeSelecionada(null);
    setPessoaSelecionada(null);
    setHoras(0);
    setMinutos(30);
    setPasso('revisao');
  };

  const handleRemoverAtividade = (id: string) => {
    setAtividades(prev => prev.filter(a => a.id !== id));
    toast.success('Atividade removida');
  };

  const handleConcluir = () => {
    if (atividades.length === 0) {
      toast.error('Adicione pelo menos uma atividade');
      return;
    }

    // Se está editando, atualiza a sessão existente
    if (sessaoParaEditar) {
      const totalMinutos = atividades.reduce(
        (sum, a) => sum + (a.horas * 60 + a.minutos), 
        0
      );
      
      const sessaoAtualizada = {
        ...sessaoParaEditar,
        duracaoMinutos: totalMinutos,
        horaFim: new Date(
          new Date(`${sessaoParaEditar.data}T${sessaoParaEditar.horaInicio}:00`).getTime() + 
          totalMinutos * 60000
        ).toTimeString().slice(0, 5),
        atividades: atividades.map(a => ({
          tipo: a.tipo as any,
          detalhes: a.pessoaNome 
            ? `${a.pessoaNome} - ${a.horas}h ${a.minutos}min` 
            : `${a.horas}h ${a.minutos}min`,
        })),
        revisitasFeitas: atividades
          .filter(a => a.tipo === 'revisita' && a.pessoaId)
          .map(a => a.pessoaId!),
        estudosRealizados: atividades
          .filter(a => a.tipo === 'estudo' && a.pessoaId)
          .map(a => a.pessoaId!),
      };
      
      DataService.atualizarSessao(sessaoParaEditar.id, sessaoAtualizada);
      
      // Atualizar revisitas visitadas
      const revisitasVisitadas = atividades.filter(a => a.tipo === 'revisita' && a.pessoaId);
      revisitasVisitadas.forEach(ativ => {
        if (ativ.pessoaId) {
          const revisita = DataService.getRevisitas().find(r => r.id === ativ.pessoaId);
          if (revisita) {
            DataService.atualizarRevisita(ativ.pessoaId, {
              ...revisita,
              ultimaVisita: sessaoParaEditar.data,
              quantidadeVisitas: revisita.quantidadeVisitas + 1,
            });
          }
        }
      });
      
      const horasGeral = Math.floor(totalMinutos / 60);
      const minutosGeral = totalMinutos % 60;
      
      toast.success('Registro atualizado com sucesso! ✏️', {
        description: `${atividades.length} atividade(s) - Total: ${horasGeral}h ${minutosGeral}min`,
      });
      
      onVoltar();
      return;
    }

    // Caso contrário, cria nova sessão
    const agora = new Date();
    const dataHoje = agora.toISOString().split('T')[0];
    const hora = agora.getHours();
    let periodo: 'manha' | 'tarde' | 'noite';
    if (hora < 12) {
      periodo = 'manha';
    } else if (hora < 18) {
      periodo = 'tarde';
    } else {
      periodo = 'noite';
    }

    // Agrupar atividades por categoria (campo vs crédito)
    const atividadesCampo = atividades.filter(a => a.categoria === 'campo');
    const atividadesCredito = atividades.filter(a => a.categoria === 'credito');

    // Criar sessão para atividades de campo
    if (atividadesCampo.length > 0) {
      const totalMinutosCampo = atividadesCampo.reduce(
        (sum, a) => sum + (a.horas * 60 + a.minutos), 
        0
      );

      const novaSessao = {
        data: dataHoje,
        periodo,
        horaInicio: agora.toTimeString().slice(0, 5),
        horaFim: new Date(agora.getTime() + totalMinutosCampo * 60000).toTimeString().slice(0, 5),
        duracaoMinutos: totalMinutosCampo,
        tipo: 'campo' as 'campo' | 'credito',
        atividades: atividadesCampo.map(a => ({
          tipo: a.tipo as any,
          detalhes: a.pessoaNome 
            ? `${a.pessoaNome} - ${a.horas}h ${a.minutos}min` 
            : `${a.horas}h ${a.minutos}min`,
        })),
        revisitasFeitas: atividadesCampo
          .filter(a => a.tipo === 'revisita' && a.pessoaId)
          .map(a => a.pessoaId!),
        estudosRealizados: atividadesCampo
          .filter(a => a.tipo === 'estudo' && a.pessoaId)
          .map(a => a.pessoaId!),
      };

      DataService.adicionarSessao(novaSessao);
    }

    // Criar sessão para atividades de crédito
    if (atividadesCredito.length > 0) {
      const totalMinutosCredito = atividadesCredito.reduce(
        (sum, a) => sum + (a.horas * 60 + a.minutos), 
        0
      );

      const novaSessao = {
        data: dataHoje,
        periodo,
        horaInicio: agora.toTimeString().slice(0, 5),
        horaFim: new Date(agora.getTime() + totalMinutosCredito * 60000).toTimeString().slice(0, 5),
        duracaoMinutos: totalMinutosCredito,
        tipo: 'credito' as 'campo' | 'credito',
        atividades: atividadesCredito.map(a => ({
          tipo: a.tipo as any,
          detalhes: `${a.horas}h ${a.minutos}min`,
        })),
      };

      DataService.adicionarSessao(novaSessao);
    }

    // ATUALIZAR REVISITAS VISITADAS
    const revisitasVisitadas = atividades.filter(a => a.tipo === 'revisita' && a.pessoaId);
    revisitasVisitadas.forEach(ativ => {
      if (ativ.pessoaId) {
        const revisita = DataService.getRevisitas().find(r => r.id === ativ.pessoaId);
        if (revisita) {
          DataService.atualizarRevisita(ativ.pessoaId, {
            ...revisita,
            ultimaVisita: dataHoje,
            quantidadeVisitas: revisita.quantidadeVisitas + 1,
          });
        }
      }
    });

    const totalGeral = atividades.reduce((sum, a) => sum + a.horas * 60 + a.minutos, 0);
    const horasGeral = Math.floor(totalGeral / 60);
    const minutosGeral = totalGeral % 60;
    
    // Mensagem personalizada se visitou revisitas
    const quantRevisitas = revisitasVisitadas.length;
    const mensagemExtra = quantRevisitas > 0 
      ? ` • ${quantRevisitas} ${quantRevisitas === 1 ? 'revisita atualizada' : 'revisitas atualizadas'} 🌱`
      : '';
    
    toast.success('Tempo cadastrado com sucesso! 🎉', {
      description: `${atividades.length} atividade(s) - Total: ${horasGeral}h ${minutosGeral}min${mensagemExtra}`,
    });
    
    onVoltar();
  };

  const formatarTempo = (h: number, m: number) => {
    if (h === 0 && m === 0) return '0min';
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  const totalGeral = atividades.reduce((sum, a) => sum + a.horas * 60 + a.minutos, 0);
  const horasGeral = Math.floor(totalGeral / 60);
  const minutosGeral = totalGeral % 60;

  // PASSO 1: Escolher Tipo de Atividade
  if (passo === 'escolher-tipo') {
    return (
      <div className="min-h-screen bg-gray-50 pb-48">
        {/* Header */}
        <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (atividades.length > 0) {
                  setPasso('revisao');
                } else {
                  onVoltar();
                }
              }}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2>Cadastrar Tempo</h2>
              <p className="text-sm opacity-90">Passo 1: Escolha a atividade</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-4">
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Selecione o tipo de atividade que você realizou
            </p>
          </Card>

          <div className="space-y-3">
            {tiposAtividade.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => handleSelecionarTipo(tipo.id)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 text-left transition-all"
                style={{
                  borderColor: 'var(--border-gray, #e5e7eb)',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4A2C60';
                  e.currentTarget.style.backgroundColor = 'rgba(74, 44, 96, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700">
                    {getIconForTipo(tipo.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">{tipo.nome}</p>
                    <p className="text-sm text-gray-600">{tipo.descricao}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PASSO 2: Selecionar Pessoa (apenas para revisitas e estudos)
  if (passo === 'selecionar-pessoa') {
    const tipoAtual = tiposAtividade.find(t => t.id === atividadeSelecionada);
    const isRevisita = atividadeSelecionada === 'revisita';
    const isEstudo = atividadeSelecionada === 'estudo-biblico';

    // Buscar pessoas do DataService
    const pessoas = isRevisita 
      ? DataService.getRevisitas()
      : isEstudo 
      ? DataService.getEstudos()
      : [];

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPessoaSelecionada(null);
                setPasso('escolher-tipo');
              }}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2>Selecione a Pessoa</h2>
              <p className="text-sm opacity-90">Passo 2: Quem foi visitado?</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-4">
          {/* Card da atividade selecionada */}
          <Card className="p-5" style={{ background: 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.05), rgba(74, 44, 96, 0.1))', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center" style={{ color: '#4A2C60' }}>
                {atividadeSelecionada && getIconForTipo(atividadeSelecionada)}
              </div>
              <div>
                <p className="text-sm text-gray-600">Atividade selecionada</p>
                <p style={{ color: '#4A2C60' }}>{tipoAtual?.nome}</p>
              </div>
            </div>
          </Card>

          {/* Lista de pessoas */}
          {pessoas.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircle className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h4 className="mb-2">Nenhuma {isRevisita ? 'revisita' : 'estudo'} cadastrado</h4>
              <p className="text-sm text-gray-600 mb-6">
                Cadastre {isRevisita ? 'uma revisita' : 'um estudo'} primeiro para continuar
              </p>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setPessoaSelecionada(null);
                  setPasso('definir-tempo');
                }}
              >
                Continuar sem selecionar
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm text-gray-700 px-1">
                {isRevisita ? 'Selecione a revisita' : 'Selecione o estudante'}
              </h3>
              {pessoas.map((pessoa) => {
                const nome = isRevisita 
                  ? (pessoa as any).nome 
                  : (pessoa as any).estudanteNome;
                const endereco = isRevisita 
                  ? (pessoa as any).endereco 
                  : (pessoa as any).publicacao;

                return (
                  <button
                    key={pessoa.id}
                    onClick={() => handleSelecionarPessoa(pessoa.id, nome)}
                    className="w-full p-4 rounded-lg border-2 border-gray-200 text-left transition-all"
                    style={{
                      borderColor: 'var(--border-gray, #e5e7eb)',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4A2C60';
                      e.currentTarget.style.backgroundColor = 'rgba(74, 44, 96, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.1), rgba(74, 44, 96, 0.2))' }}>
                        <UserCircle className="w-6 h-6" style={{ color: '#4A2C60' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">{nome}</p>
                        <p className="text-sm text-gray-600 truncate">{endereco}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Opção para continuar sem selecionar */}
              <Button
                size="lg"
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setPessoaSelecionada(null);
                  setPasso('definir-tempo');
                }}
              >
                Continuar sem selecionar pessoa
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PASSO 3: Definir Tempo
  if (passo === 'definir-tempo') {
    const tipoAtual = tiposAtividade.find(t => t.id === atividadeSelecionada);
    const totalMinutos = horas * 60 + minutos;
    const tempoFormatado = formatarTempo(horas, minutos);

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Voltar para seleção de pessoa se necessário, senão para tipo
                if (tipoAtual?.requerPessoa) {
                  setPasso('selecionar-pessoa');
                } else {
                  setAtividadeSelecionada(null);
                  setPasso('escolher-tipo');
                }
              }}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2>Quanto tempo durou?</h2>
              <p className="text-sm opacity-90">
                Passo {tipoAtual?.requerPessoa ? '3' : '2'}: Defina a duração
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-5">
          {/* Card da atividade selecionada */}
          <Card className="p-5" style={{ background: 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.05), rgba(74, 44, 96, 0.1))', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-700">
                {atividadeSelecionada && getIconForTipo(atividadeSelecionada)}
              </div>
              <div>
                <p className="text-sm text-gray-600">Atividade selecionada</p>
                <p style={{ color: '#4A2C60' }}>{tipoAtual?.nome}</p>
              </div>
            </div>
            {pessoaSelecionada && (
              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'rgba(74, 44, 96, 0.2)' }}>
                <UserCircle className="w-4 h-4" style={{ color: '#4A2C60' }} />
                <p className="text-sm" style={{ color: '#4A2C60' }}>{pessoaSelecionada.nome}</p>
              </div>
            )}
          </Card>

          {/* Seletor de tempo */}
          <Card className="p-6">
            <h3 className="mb-6 text-center flex items-center justify-center gap-2">
              <Timer className="w-5 h-5" /> Defina a duração
            </h3>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Horas */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600 mb-2">Horas</label>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setHoras(Math.min(23, horas + 1))}
                    className="w-12 h-12 rounded-lg text-white flex items-center justify-center transition-opacity"
                    style={{ backgroundColor: '#4A2C60' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    +
                  </button>
                  <div className="w-20 h-20 rounded-xl border-2 flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.3)' }}>
                    <span className="text-3xl" style={{ color: '#4A2C60' }}>{horas}</span>
                  </div>
                  <button
                    onClick={() => setHoras(Math.max(0, horas - 1))}
                    className="w-12 h-12 rounded-lg text-white flex items-center justify-center transition-opacity"
                    style={{ backgroundColor: '#4A2C60' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    −
                  </button>
                </div>
              </div>

              <span className="text-3xl mt-8" style={{ color: '#4A2C60' }}>:</span>

              {/* Minutos */}
              <div className="flex flex-col items-center">
                <label className="text-xs text-gray-600 mb-2">Minutos</label>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      const novosMinutos = minutos + 15;
                      if (novosMinutos >= 60) {
                        setHoras(Math.min(23, horas + 1));
                        setMinutos(0);
                      } else {
                        setMinutos(novosMinutos);
                      }
                    }}
                    className="w-12 h-12 rounded-lg text-white flex items-center justify-center transition-opacity"
                    style={{ backgroundColor: '#4A2C60' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    +
                  </button>
                  <div className="w-20 h-20 rounded-xl border-2 flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.3)' }}>
                    <span className="text-3xl" style={{ color: '#4A2C60' }}>{minutos.toString().padStart(2, '0')}</span>
                  </div>
                  <button
                    onClick={() => {
                      const novosMinutos = minutos - 15;
                      if (novosMinutos < 0) {
                        if (horas > 0) {
                          setHoras(horas - 1);
                          setMinutos(45);
                        } else {
                          setMinutos(0);
                        }
                      } else {
                        setMinutos(novosMinutos);
                      }
                    }}
                    className="w-12 h-12 rounded-lg text-white flex items-center justify-center transition-opacity"
                    style={{ backgroundColor: '#4A2C60' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    −
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-4 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
              <Clock className="w-5 h-5" style={{ color: '#4A2C60' }} />
              <p style={{ color: '#4A2C60' }}>
                Tempo: <strong className="text-lg">{tempoFormatado}</strong>
              </p>
            </div>
          </Card>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              style={{ backgroundColor: '#4A2C60', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              onClick={handleAdicionarAtividade}
              disabled={totalMinutos === 0}
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Atividade
            </Button>

            {atividades.length > 0 && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setPasso('revisao')}
              >
                Pular para Revisão ({atividades.length})
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // PASSO 4: Revisão
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2>Revisar e Concluir</h2>
            <p className="text-sm opacity-90">Última etapa: Confirme suas atividades</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-5">
        {/* Resumo total */}
        <Card className="p-6" style={{ background: 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.05), rgba(74, 44, 96, 0.1))', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total acumulado</p>
            <p className="text-4xl mb-1" style={{ color: '#4A2C60' }}>
              {formatarTempo(horasGeral, minutosGeral)}
            </p>
            <p className="text-sm text-gray-600">
              {atividades.length} atividade{atividades.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Card>

        {/* Lista de atividades */}
        {atividades.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ClipboardList className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h4 className="mb-2">Nenhuma atividade adicionada</h4>
            <p className="text-sm text-gray-600 mb-4">
              Adicione pelo menos uma atividade para continuar
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm text-gray-700 px-1">Atividades cadastradas</h3>
            {atividades.map((atividade) => (
              <Card key={atividade.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 text-primary-700">
                    {getIconForTipo(atividade.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-gray-900">{atividade.nome}</p>
                        {atividade.pessoaNome && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <UserCircle className="w-4 h-4" /> {atividade.pessoaNome}
                          </p>
                        )}
                      </div>
                      <Badge className="text-white" style={{ backgroundColor: '#4A2C60' }}>
                        {formatarTempo(atividade.horas, atividade.minutos)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={
                          atividade.categoria === 'campo' 
                            ? 'bg-secondary-100 text-secondary-900 flex items-center gap-1' 
                            : 'flex items-center gap-1'
                        }
                        style={atividade.categoria !== 'campo' ? { backgroundColor: 'rgba(74, 44, 96, 0.1)', color: '#4A2C60' } : {}}
                      >
                        {atividade.categoria === 'campo' ? (
                          <>
                            <Sprout className="w-3 h-3" /> Campo
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Crédito
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoverAtividade(atividade.id)}
                    className="p-2 text-red-600 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full text-white"
            style={{ backgroundColor: '#4A2C60' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            onClick={handleConcluir}
            disabled={atividades.length === 0}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Concluir Cadastro
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            style={{ borderColor: 'rgba(74, 44, 96, 0.3)', color: '#4A2C60' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(74, 44, 96, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => setPasso('escolher-tipo')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Mais Atividades
          </Button>
        </div>
      </div>
    </div>
  );
}