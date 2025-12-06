import { ArrowLeft, Clock, MapPin, Building2, Phone, Mail, Briefcase, Users, BookOpen, Plus, Trash2, CheckCircle2, UserCircle, Home, Sprout, Timer, ClipboardList, Pencil, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataService, Sessao } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

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
  const t = useTranslations();
  
  const [passo, setPasso] = useState<Passo>('escolher-tipo');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<string | null>(null);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<{ id: string; nome: string } | null>(null);
  const [atividades, setAtividades] = useState<AtividadeTemp[]>([]);
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [atividadeEditando, setAtividadeEditando] = useState<string | null>(null);

  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Definir tipos de atividade ANTES dos useEffects
  const tiposAtividade = [
    {
      id: 'casa-em-casa',
      nome: t.registerTime.houseToHouseTitle,
      descricao: t.registerTime.houseToHouseDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'revisita',
      nome: t.registerTime.returnVisitTitle,
      descricao: t.registerTime.returnVisitDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: true,
    },
    {
      id: 'estudo-biblico',
      nome: t.registerTime.bibleStudyTitle,
      descricao: t.registerTime.bibleStudyDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: true,
    },
    {
      id: 'testemunho-publico',
      nome: t.registerTime.publicWitnessingTitle,
      descricao: t.registerTime.publicWitnessingDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'telefone',
      nome: t.registerTime.byPhoneTitle,
      descricao: t.registerTime.byPhoneDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'carta',
      nome: t.registerTime.byLetterTitle,
      descricao: t.registerTime.byLetterDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'informal',
      nome: t.registerTime.informalTitle,
      descricao: t.registerTime.informalDesc,
      tipo: 'campo' as 'campo' | 'credito',
      requerPessoa: false,
    },
    {
      id: 'credito',
      nome: t.registerTime.creditTitle,
      descricao: t.registerTime.creditDesc,
      tipo: 'credito' as 'campo' | 'credito',
      requerPessoa: false,
    },
  ];

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
        
        // Tentar obter duração de várias formas (migração de dados antigos)
        let duracaoTotal = ativ.duracaoMinutos || 0;
        
        // Se duracaoMinutos não existe, tentar extrair dos detalhes (dados antigos)
        if (duracaoTotal === 0 && ativ.detalhes) {
          // Regex para extrair tempo no formato "1h 45min", "1h", "45min"
          const regexHoras = /(\d+)h/;
          const regexMinutos = /(\d+)min/;
          const matchHoras = ativ.detalhes.match(regexHoras);
          const matchMinutos = ativ.detalhes.match(regexMinutos);
          
          const horas = matchHoras ? parseInt(matchHoras[1]) : 0;
          const minutos = matchMinutos ? parseInt(matchMinutos[1]) : 0;
          duracaoTotal = horas * 60 + minutos;
          
          // Se ainda for 0, tentar dividir tempo total igualmente
          if (duracaoTotal === 0 && sessaoParaEditar.duracaoMinutos) {
            duracaoTotal = Math.floor(sessaoParaEditar.duracaoMinutos / sessaoParaEditar.atividades.length);
          }
        }
        
        const horas = Math.floor(duracaoTotal / 60);
        const minutos = duracaoTotal % 60;
        
        // Extrair nome da pessoa dos detalhes (remover informação de tempo se existir)
        let pessoaNome = ativ.detalhes;
        if (pessoaNome) {
          // Remover tempo dos detalhes se existir (ex: "João Silva - 1h 45min" -> "João Silva")
          pessoaNome = pessoaNome.replace(/\s*-?\s*\d+h(\s+\d+min)?/g, '').replace(/\s*-?\s*\d+min/g, '').trim();
          // Se ficou vazio ou só com hífen, limpar
          if (pessoaNome === '-' || pessoaNome === '') pessoaNome = undefined;
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
      toast.error(t.registerTime.howMuchTimeDidYouDedicate, {
        icon: <AlertCircle className="w-5 h-5" />
      });
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
    
    toast.success(t.registerTime.activityAdded, { 
      description: descricao,
      icon: <Check className="w-5 h-5" />
    });
    
    // Resetar para adicionar outra atividade ou ir para revisão
    setAtividadeSelecionada(null);
    setPessoaSelecionada(null);
    setHoras(0);
    setMinutos(0);
    setPasso('revisao');
  };

  const handleRemoverAtividade = (id: string) => {
    setAtividades(prev => prev.filter(a => a.id !== id));
    toast.success(t.registerTime.activityRemoved, {
      icon: <Trash2 className="w-5 h-5" />
    });
  };

  const handleEditarAtividade = (id: string) => {
    const atividade = atividades.find(a => a.id === id);
    if (!atividade) return;

    // Carregar dados da atividade para edição
    setAtividadeEditando(id);
    setAtividadeSelecionada(atividade.tipo);
    setHoras(atividade.horas);
    setMinutos(atividade.minutos);
    
    if (atividade.pessoaId && atividade.pessoaNome) {
      setPessoaSelecionada({ id: atividade.pessoaId, nome: atividade.pessoaNome });
    }
    
    // Ir para a tela de definir tempo
    setPasso('definir-tempo');
  };

  const handleSalvarEdicao = () => {
    if (!atividadeEditando) return;

    const totalMinutos = horas * 60 + minutos;
    
    if (totalMinutos === 0) {
      toast.error(t.registerTime.howMuchTimeDidYouDedicate, {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Atualizar a atividade existente
    setAtividades(prev => prev.map(a => {
      if (a.id === atividadeEditando) {
        return {
          ...a,
          horas,
          minutos,
        };
      }
      return a;
    }));

    toast.success(t.registerTime.timeUpdated, {
      icon: <CheckCircle2 className="w-5 h-5" />
    });

    // Resetar estados
    setAtividadeEditando(null);
    setAtividadeSelecionada(null);
    setPessoaSelecionada(null);
    setHoras(0);
    setMinutos(0);
    setPasso('revisao');
  };

  const handleConcluir = () => {
    if (atividades.length === 0) {
      toast.error(t.registerTime.addAtLeastOneActivity, {
        icon: <AlertCircle className="w-5 h-5" />
      });
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
          detalhes: a.pessoaNome || undefined,
          duracaoMinutos: a.horas * 60 + a.minutos,
        })),
        revisitasFeitas: atividades
          .filter(a => a.tipo === 'revisita' && a.pessoaId)
          .map(a => a.pessoaId!),
        estudosRealizados: atividades
          .filter(a => (a.tipo === 'estudo' || a.tipo === 'estudo-biblico') && a.pessoaId)
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
      
      toast.success(t.registerTime.recordUpdatedSuccess, {
        description: `${atividades.length} ${t.registerTime.activities} - ${t.registerTime.totalTime}: ${horasGeral}h ${minutosGeral}min`,
        icon: <Pencil className="w-5 h-5" />
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
          detalhes: a.pessoaNome || undefined,
          duracaoMinutos: a.horas * 60 + a.minutos,
        })),
        revisitasFeitas: atividadesCampo
          .filter(a => a.tipo === 'revisita' && a.pessoaId)
          .map(a => a.pessoaId!),
        estudosRealizados: atividadesCampo
          .filter(a => (a.tipo === 'estudo' || a.tipo === 'estudo-biblico') && a.pessoaId)
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
      ? ` • ${quantRevisitas} ${quantRevisitas === 1 ? 'revisita atualizada' : 'revisitas atualizadas'}`
      : '';
    
    toast.success(t.registerTime.timeSavedSuccess, {
      description: `${atividades.length} ${t.registerTime.activities} - ${t.registerTime.totalTime}: ${horasGeral}h ${minutosGeral}min${mensagemExtra}`,
      icon: <CheckCircle2 className="w-5 h-5" />
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
        <div className="sticky top-0 z-10 bg-primary-500 text-white">
          <div className="flex items-center gap-4 px-6 pt-12 pb-4">
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
              <h2 className="text-xl">{t.registerTime.title}</h2>
              <p className="text-sm opacity-90">{t.registerTime.step1Title}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-4">
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> {t.registerTime.step1Description}
            </p>
          </Card>

          <div className="space-y-3">
            {tiposAtividade.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => handleSelecionarTipo(tipo.id)}
                className="w-full p-4 rounded-lg border-2 border-gray-200 bg-white text-left transition-all hover:border-primary-500 hover:bg-primary-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl text-white flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C8E046', color: '#4A2C60' }}>
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
        <div className="sticky top-0 z-10 bg-primary-500 text-white">
          <div className="flex items-center gap-4 px-6 pt-12 pb-4">
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
              <h2 className="text-xl">{t.registerTime.selectPerson}</h2>
              <p className="text-sm opacity-90">{t.registerTime.step2Description}</p>
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
                <p className="text-sm text-gray-600">{t.registerTime.selectedActivity}</p>
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
              <h4 className="mb-2">{isRevisita ? t.registerTime.noReturnVisitRegistered : t.registerTime.noStudyRegistered}</h4>
              <p className="text-sm text-gray-600 mb-6">
                {isRevisita ? t.registerTime.registerReturnVisitFirst : t.registerTime.registerStudyFirst}
              </p>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setPessoaSelecionada(null);
                  setPasso('definir-tempo');
                }}
              >
                {t.registerTime.continueWithoutSelecting}
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm text-gray-700 px-1">
                {isRevisita ? t.registerTime.selectReturnVisit : t.registerTime.selectStudent}
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
        <div className="sticky top-0 z-10 bg-primary-500 text-white">
          <div className="flex items-center gap-4 px-6 pt-12 pb-4">
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
              <h2 className="text-xl">{t.registerTime.howLongDidItTake}</h2>
              <p className="text-sm opacity-90">
                {tipoAtual?.requerPessoa ? t.registerTime.step3DescriptionWithPerson : t.registerTime.step3Description}
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-6">
          {/* Card da atividade selecionada - REFINADO */}
          <Card 
            className="p-5 border-2" 
            style={{ 
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : 'white', 
              borderColor: '#C8E046' 
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C8E046', color: '#4A2C60' }}>
                {atividadeSelecionada && getIconForTipo(atividadeSelecionada)}
              </div>
              <div className="flex-1">
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.registerTime.selectedActivity}
                </p>
                <p 
                  className="text-base" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                >
                  {tipoAtual?.nome}
                </p>
                {pessoaSelecionada && (
                  <div 
                    className="flex items-center gap-1.5 mt-2 text-sm" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>{pessoaSelecionada.nome}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Seletor de tempo - REFINADO */}
          <Card 
            className="p-6"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
              borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Timer 
                className="w-5 h-5" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
              />
              <h3 style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}>{t.registerTime.setDuration}</h3>
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Horas */}
              <div className="flex flex-col items-center">
                <label 
                  className="text-xs mb-3"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.registerTime.hours}
                </label>
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => setHoras(Math.min(23, horas + 1))}
                    className="w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#4A2C60' }}
                  >
                    +
                  </button>
                  <div 
                    className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center shadow-sm" 
                    style={{ 
                      borderColor: '#C8E046',
                      backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF'
                    }}
                  >
                    <span 
                      className="text-4xl" 
                      style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                    >
                      {horas}
                    </span>
                  </div>
                  <button
                    onClick={() => setHoras(Math.max(0, horas - 1))}
                    className="w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#4A2C60' }}
                  >
                    −
                  </button>
                </div>
              </div>

              <span 
                className="text-4xl mt-10" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                :
              </span>

              {/* Minutos */}
              <div className="flex flex-col items-center">
                <label 
                  className="text-xs mb-3"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.registerTime.minutes}
                </label>
                <div className="flex flex-col items-center gap-3">
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
                    className="w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#4A2C60' }}
                  >
                    +
                  </button>
                  <div 
                    className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center shadow-sm" 
                    style={{ 
                      borderColor: '#C8E046',
                      backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF'
                    }}
                  >
                    <span 
                      className="text-4xl" 
                      style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                    >
                      {minutos.toString().padStart(2, '0')}
                    </span>
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
                    className="w-12 h-12 rounded-xl text-white flex items-center justify-center text-xl transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: '#4A2C60' }}
                  >
                    −
                  </button>
                </div>
              </div>
            </div>

            {/* Card de tempo total - REFINADO */}
            <div 
              className="flex items-center justify-center gap-2 p-4 rounded-xl border-2" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : '#F3F9E6', 
                borderColor: '#C8E046' 
              }}
            >
              <Clock 
                className="w-5 h-5" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
              />
              <p style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}>
                Tempo: <strong className="text-xl">{tempoFormatado}</strong>
              </p>
            </div>
          </Card>

          {/* Botões de ação */}
          <div className="space-y-3">
            <button
              className="w-full h-14 rounded-md transition-all cursor-pointer border-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#C8E046',
                color: '#1F2937',
                border: 'none',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (totalMinutos > 0) {
                  e.currentTarget.style.backgroundColor = '#B5CC3D';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C8E046';
              }}
              onClick={atividadeEditando ? handleSalvarEdicao : handleAdicionarAtividade}
              disabled={totalMinutos === 0}
            >
              <Plus className="w-5 h-5 mr-2" />
              {atividadeEditando ? t.registerTime.saveEdit : t.registerTime.addActivity}
            </button>

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
    <div 
      className="min-h-screen pb-24"
      style={{
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE'
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-10 text-white"
        style={{
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'
        }}
      >
        <div className="flex items-center gap-4 px-6 pt-12 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">{t.registerTime.reviewAndComplete}</h2>
            <p className="text-sm opacity-90">{t.registerTime.lastStepConfirmActivities}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-5">
        {/* Resumo total */}
        <Card 
          className="p-6 border-0" 
          style={{ 
            background: temaAtual === 'escuro' 
              ? 'linear-gradient(to bottom right, rgba(200, 224, 70, 0.08), rgba(200, 224, 70, 0.15))'
              : 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.05), rgba(74, 44, 96, 0.1))',
            borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : 'rgba(74, 44, 96, 0.2)'
          }}
        >
          <div className="text-center">
            <p 
              className="text-sm mb-2" 
              style={{ 
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
              }}
            >
              {t.registerTime.totalAccumulated}
            </p>
            <p 
              className="text-4xl mb-1" 
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                fontWeight: 'bold'
              }}
            >
              {formatarTempo(horasGeral, minutosGeral)}
            </p>
            <p 
              className="text-sm" 
              style={{ 
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
              }}
            >
              {atividades.length} {t.registerTime.activity}{atividades.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Card>

        {/* Lista de atividades */}
        {atividades.length === 0 ? (
          <Card 
            className="p-12 text-center border-0"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
            }}
          >
            <div className="mb-4 flex justify-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : 'rgba(74, 44, 96, 0.1)'
                }}
              >
                <ClipboardList 
                  className="w-12 h-12" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C8E046' : '#9CA3AF' 
                  }} 
                />
              </div>
            </div>
            <h4 
              className="mb-2" 
              style={{ 
                color: temaAtual === 'escuro' ? '#D1D5DB' : '#1F2937' 
              }}
            >
              {t.registerTime.noActivityAdded}
            </h4>
            <p 
              className="text-sm mb-4" 
              style={{ 
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
              }}
            >
              {t.registerTime.addAtLeastOneActivityToContinue}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <h3 
              className="text-sm px-1" 
              style={{ 
                color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' 
              }}
            >
              {t.registerTime.registeredActivities}
            </h3>
            {atividades.map((atividade) => (
              <Card 
                key={atividade.id} 
                className="p-5 border-0"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: temaAtual === 'escuro' 
                        ? 'rgba(200, 224, 70, 0.15)' 
                        : 'rgba(200, 224, 70, 0.15)' 
                    }}
                  >
                    <div 
                      style={{ 
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                      }}
                    >
                      {getIconForTipo(atividade.tipo)}
                    </div>
                  </div>

                  {/* Conteúdo central */}
                  <div className="flex-1 min-w-0">
                    {/* Título da atividade */}
                    <p 
                      className="text-base mb-2 capitalize" 
                      style={{ 
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                      }}
                    >
                      {atividade.nome}
                    </p>
                    
                    {/* Badges e informações */}
                    <div className="space-y-2">
                      {/* Badge de categoria */}
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="flex items-center gap-1.5 border-0"
                          style={
                            atividade.categoria === 'campo' 
                              ? {
                                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(200, 224, 70, 0.2)',
                                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A5D0B'
                                }
                              : {
                                  backgroundColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.2)' : 'rgba(74, 44, 96, 0.1)',
                                  color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                                }
                          }
                        >
                          {atividade.categoria === 'campo' ? (
                            <>
                              <Sprout className="w-3 h-3" /> {t.registerTime.field}
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> {t.registerTime.credit}
                            </>
                          )}
                        </Badge>
                        
                        {/* Badge de tempo (movido para cá) */}
                        <Badge 
                          className="h-6 px-2.5 flex items-center gap-1 border-0" 
                          style={{ 
                            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          {formatarTempo(atividade.horas, atividade.minutos)}
                        </Badge>
                      </div>
                      
                      {/* Nome da pessoa (se houver) */}
                      {atividade.pessoaNome && (
                        <div 
                          className="flex items-center gap-1.5 text-sm"
                          style={{ 
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
                          }}
                        >
                          <UserCircle 
                            className="w-4 h-4" 
                            style={{ 
                              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                            }} 
                          />
                          <span>{atividade.pessoaNome}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botões de ação verticais */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarAtividade(atividade.id)}
                      className="p-2 h-8 w-8"
                      style={{ 
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoverAtividade(atividade.id)}
                      className="p-2 h-8 w-8"
                      style={{ 
                        color: '#EF4444',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Botões de ação */}
        <div className="space-y-3">
          <button
            className="w-full h-14 rounded-md transition-all cursor-pointer border-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#C8E046',
              color: '#1F2937',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (atividades.length > 0) {
                e.currentTarget.style.backgroundColor = '#B5CC3D';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C8E046';
            }}
            onClick={handleConcluir}
            disabled={atividades.length === 0}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {t.registerTime.completeRegistration}
          </button>

          <Button
            size="lg"
            variant="outline"
            className="w-full border-2"
            style={{ 
              borderColor: '#C8E046',
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(200, 224, 70, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={() => setPasso('escolher-tipo')}
          >
            <Plus className="w-5 h-5 mr-2" />
            {t.registerTime.addMoreActivities}
          </Button>
        </div>
      </div>
    </div>
  );
}