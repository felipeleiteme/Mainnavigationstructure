import { TrendingUp, Calendar, BookOpen, Users, Clock, Plus, Sun, Moon, Sunrise, Sunset, User, Star, CheckCircle, Zap, BarChart3, Target, Medal, Gift, Play, Pause, Square, ChevronRight, AlertCircle, Info, Rabbit, Footprints, Turtle, CloudSun, Sprout } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import DashboardEmptyState from '../inicio/DashboardEmptyState';
import EstatisticasPage from '../pages/EstatisticasPage';
import CronogramaPage from '../pages/CronogramaPage';
import ProgressoPage from '../pages/ProgressoPage';
import CadastrarTempoPage from '../pages/CadastrarTempoPage';
import EstudosDetalhes from '../estatisticas/EstudosDetalhes';
import RevisitasDetalhes from '../estatisticas/RevisitasDetalhes';
import DiaDetalhes from '../cronograma/DiaDetalhes';
import { DataService } from '../../services/dataService';
import { seedDemoData } from '../../services/seedData';
import FAB from '../shared/FAB';
import ControlesSessaoModal from '../shared/ControlesSessaoModal';
import ResumoSessaoModal from '../shared/ResumoSessaoModal';
import { ThemeService } from '../../services/themeService';
import { toast } from 'sonner';
import { useTranslations } from '../../utils/i18n/translations';

interface InicioTabProps {
  onNavigateToTab?: (tab: string, options?: any) => void;
}

export default function InicioTab({ onNavigateToTab }: InicioTabProps) {
  const t = useTranslations();
  const [hasData, setHasData] = useState(true); // Check if user has any data
  const [paginaAtual, setPaginaAtual] = useState<'home' | 'estatisticas' | 'cronograma' | 'progresso' | 'cadastrar-tempo'>('home');
  const [diaSelecionado, setDiaSelecionado] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização das estatísticas
  const [showEstudosDetalhes, setShowEstudosDetalhes] = useState(false);
  const [showRevisitasDetalhes, setShowRevisitasDetalhes] = useState(false);
  const [showDiaDetalhes, setShowDiaDetalhes] = useState(false);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Estados da sessão de ministério
  const [showControlesSessao, setShowControlesSessao] = useState(false);
  const [showResumoSessao, setShowResumoSessao] = useState(false);
  const [sessaoAtiva, setSessaoAtiva] = useState(DataService.getSessaoAtiva());
  
  // Estado para cronograma da semana
  const [diasSemana, setDiasSemana] = useState<any[]>([]);

  // Carregar dados do cronograma da semana
  useEffect(() => {
    carregarCronogramaSemana();
    
    // Listen for data changes
    const handleDataChange = () => carregarCronogramaSemana();
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, []);
  
  const carregarCronogramaSemana = () => {
    const hoje = new Date();
    const primeiroDiaSemana = new Date(hoje);
    primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay() + 1); // Monday
    primeiroDiaSemana.setHours(0, 0, 0, 0);

    const todosEstudos = DataService.getEstudos();
    const todasRevisitas = DataService.getRevisitas();
    
    const diasNomes = [
      t.home.dayMonday,
      t.home.dayTuesday,
      t.home.dayWednesday,
      t.home.dayThursday,
      t.home.dayFriday,
      t.home.daySaturday,
      t.home.daySunday
    ];
    const diasData: any[] = [];

    for (let i = 0; i < 7; i++) {
      const diaAtual = new Date(primeiroDiaSemana);
      diaAtual.setDate(primeiroDiaSemana.getDate() + i);
      
      const dataStr = diaAtual.toISOString().split('T')[0];
      const hojeStr = hoje.toISOString().split('T')[0];
      
      // Filter estudos and revisitas for this day
      const estudosDoDia = todosEstudos.filter(e => {
        const estudoDate = e.data.split('T')[0];
        return estudoDate === dataStr;
      });
      
      const revisitasDoDia = todasRevisitas.filter(r => {
        if (!r.proximaVisita) return false;
        const proximaVisitaDate = r.proximaVisita.split('T')[0];
        return proximaVisitaDate === dataStr;
      });
      
      const totalAgendamentos = estudosDoDia.length + revisitasDoDia.length;
      const isPast = diaAtual < hoje && dataStr !== hojeStr;
      const isToday = dataStr === hojeStr;
      
      diasData.push({
        dia: diasNomes[i],
        data: diaAtual.getDate().toString(),
        estudos: estudosDoDia.length,
        revisitas: revisitasDoDia.length,
        totalAgendamentos,
        isPast,
        isToday,
        status: totalAgendamentos > 0 
          ? isToday 
            ? `${totalAgendamentos} ${totalAgendamentos > 1 ? 'agendamentos' : 'agendamento'} hoje`
            : `${totalAgendamentos} ${totalAgendamentos > 1 ? 'agendamentos' : 'agendamento'}`
          : 'Livre'
      });
    }
    
    // Filter out past days
    setDiasSemana(diasData.filter(d => !d.isPast));
  };

  const handleIniciarSessao = (tipo: string) => {
    const novaSessao = DataService.iniciarSessaoAtiva(tipo);
    setSessaoAtiva(novaSessao);
    toast.success('Sessão iniciada. Boa pregação!');
  };

  const handlePausarSessao = () => {
    DataService.pausarSessaoAtiva();
    setSessaoAtiva(prev => prev ? { ...prev, pausada: true } : null);
    setShowControlesSessao(false);
    toast.info('Sessão pausada');
  };

  const handleRetomarSessao = () => {
    DataService.retomarSessaoAtiva();
    setSessaoAtiva(prev => prev ? { ...prev, pausada: false } : null);
    setShowControlesSessao(false);
    toast.success('Sessão retomada');
  };

  const handleAdicionarVisita = () => {
    // Fechar modal de controles e navegar para campo
    setShowControlesSessao(false);
    onNavigateToTab?.('campo', { acao: 'adicionar-revisita' });
  };

  const handleFinalizarSessao = () => {
    setShowControlesSessao(false);
    setShowResumoSessao(true);
  };

  const handleSalvarResumo = (dados: any) => {
    try {
      console.log('=== DEBUG SALVAR SESSÃO ===');
      console.log('1. Dados recebidos:', dados);
      console.log('2. Sessão ativa:', sessaoAtiva);
      
      // Verificar sessão ativa no localStorage antes
      const sessaoAtivalocalStorage = localStorage.getItem('sessaoAtiva');
      console.log('3. Sessão ativa no localStorage ANTES:', sessaoAtivalocalStorage);
      
      // Salvar sessão completa no DataService
      const sessaoSalva = DataService.finalizarSessaoAtiva(dados);
      console.log('4. Sessão retornada por finalizarSessaoAtiva:', sessaoSalva);
      
      // Verificar todas as sessões no localStorage
      const todasSessoes = localStorage.getItem('sessoes');
      console.log('5. TODAS as sessões no localStorage:', todasSessoes);
      
      // Verificar o que getTotalHorasMes está retornando
      const horasMes = DataService.getTotalHorasMes();
      console.log('6. Total de horas do mês:', horasMes);
      
      // Verificar sessões do mês
      const sessoesMes = DataService.getSessoesMes();
      console.log('7. Sessões do mês atual:', sessoesMes);
      
      toast.success(`Sessão salva! +${Math.floor(sessaoAtiva!.tempoDecorrido / 60)}h${sessaoAtiva!.tempoDecorrido % 60}min no relatório`);
      
      // Limpar sessão local
      setSessaoAtiva(null);
      setShowResumoSessao(false);
      
      // Forçar atualização das estatísticas
      setRefreshKey(prev => prev + 1);
      console.log('8. RefreshKey atualizado');
    } catch (error) {
      console.error('❌ Erro ao salvar sessão:', error);
      toast.error('Erro ao salvar sessão. Verifique o console.');
    }
  };
  
  const handleNavigateFromAcoes = (destino: any) => {
    if (destino.acao === 'abrir-tema') {
      // Navegar para a aba Espiritual onde está o Tema do Mês agora
      onNavigateToTab?.('espiritual');
      return;
    }

    if (onNavigateToTab) {
      onNavigateToTab(destino.tab, {
        filtro: destino.filtro,
        scroll: destino.scroll,
        acao: destino.acao,
      });
    }
  };
  
  // Check if user has data
  useEffect(() => {
    // Popular dados de demo se não houver dados
    const revisitas = localStorage.getItem('revisitas');
    const estudos = localStorage.getItem('estudosBiblicos');
    const diario = localStorage.getItem('diarioEspiritual');
    
    // Se não tem dados, popular dados de exemplo
    if (!revisitas && !estudos && !diario) {
      seedDemoData();
      setHasData(true); // Agora tem dados
    } else {
      setHasData(true);
    }
  }, []);
  
  // Atualizar quando refreshKey mudar
  useEffect(() => {
    // Este effect força re-renderização das estatísticas
    // quando refreshKey é atualizado
  }, [refreshKey]);

  // Calcular estatísticas reais do DataService
  const totalEstudos = DataService.getTotalEstudosMes();
  const totalRevisitasNovas = DataService.getTotalRevisitasNovasMes();
  const horasCampo = DataService.getTotalHorasCampo();
  const horasCredito = DataService.getTotalHorasCredito();
  const horasTotal = horasCampo + horasCredito;
  const metaMensal = DataService.getMetaMensal(); // Meta dinâmica baseada no tipo de publicador
  const progressoPercentual = (horasTotal / metaMensal) * 100;
  const progressoCampo = (horasCampo / metaMensal) * 100;
  const ofensivaLeitura = DataService.getOfensivaLeitura();
  const alvosAtivos = DataService.getAlvosAtivos().length;
  
  // Calcular estatísticas anuais
  const anoAtual = new Date().getFullYear();
  const horasAno = DataService.getTotalHorasAno(anoAtual);
  const metaAnual = DataService.getMetaAnual();
  const progressoAnual = (horasAno / metaAnual) * 100;
  
  // Format hours
  const formatarHoras = (horas: number) => {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };
  
  // Get publisher type label
  const getTipoPublicadorLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'publicador-regular': t.home.publisherRegular,
      'pioneiro-auxiliar-30': `${t.home.publisherAuxiliary} (30h)`,
      'pioneiro-auxiliar-50': `${t.home.publisherAuxiliary} (50h)`,
      'pioneiro-regular': t.home.publisherRegularPioneer,
      'pioneiro-especial': t.home.publisherSpecialPioneer,
      'superintendente-circuito': t.home.publisherCircuitOverseer,
    };
    return tipos[tipo] || tipo;
  };

  // Função inteligente para calcular status do progresso
  const getStatusProgresso = () => {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    
    // Progresso esperado baseado no dia do mês
    const progressoEsperado = (diaAtual / ultimoDiaMes) * 100;
    
    // Progresso real
    const progressoReal = progressoPercentual;
    
    // Se não tem nenhum registro ainda (0h), mostrar status neutro
    if (progressoReal === 0 && horasTotal === 0) {
      return {
        status: 'no-caminho',
        label: t.home.statusOnTrack,
        icone: Footprints,
        cor: {
          bg: 'bg-secondary-100',
          text: 'text-secondary-800',
          border: 'border-secondary-300',
          iconColor: '#C8E046' // verde lima
        },
        mensagem: t.home.messageOnTrack,
        mensagemIcone: Zap,
        mensagemIconeCor: '#C8E046'
      };
    }
    
    // Calcular diferença
    const diferenca = progressoReal - progressoEsperado;
    
    // Definir status com margem de tolerância de 15%
    if (diferenca < -15) {
      // ATRASADO: mais de 15% abaixo do esperado
      return {
        status: 'atrasado',
        label: t.home.statusBehind,
        icone: Turtle,
        cor: {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          iconColor: '#ea580c' // orange-600
        },
        mensagem: t.home.messageBehind,
        mensagemIcone: AlertCircle,
        mensagemIconeCor: '#ea580c'
      };
    } else if (diferenca > 15) {
      // ADIANTADO: mais de 15% acima do esperado
      return {
        status: 'adiantado',
        label: t.home.statusAhead,
        icone: Rabbit,
        cor: {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          iconColor: '#2563eb' // blue-600
        },
        mensagem: t.home.messageAhead,
        mensagemIcone: Star,
        mensagemIconeCor: '#2563eb'
      };
    } else {
      // NO CAMINHO: dentro da margem de -15% a +15%
      return {
        status: 'no-caminho',
        label: t.home.statusOnTrack,
        icone: Footprints,
        cor: {
          bg: 'bg-secondary-100',
          text: 'text-secondary-800',
          border: 'border-secondary-300',
          iconColor: '#C8E046' // verde lima
        },
        mensagem: t.home.messageOnTrack,
        mensagemIcone: Zap,
        mensagemIconeCor: '#84cc16' // lime-500 (mais escuro que verde lima para legibilidade)
      };
    }
  };

  const statusProgresso = getStatusProgresso();

  const currentHour = new Date().getHours();
  let greeting = t.home.greetingEvening;
  let GreetingIcon = Moon;
  
  if (currentHour < 12) {
    greeting = t.home.greetingMorning;
    GreetingIcon = Sun;
  } else if (currentHour < 18) {
    greeting = t.home.greetingAfternoon;
    GreetingIcon = CloudSun;
  }

  // Show empty state for first-time users
  if (!hasData) {
    return (
      <div className="min-h-full bg-neutral">
        {/* Header Padrão */}
        <div className="sticky top-0 z-50 bg-primary-500 text-white">
          <div className="px-6 pt-12 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg text-primary-100 flex items-center gap-2">
                  <GreetingIcon className="w-5 h-5" /> {greeting},
                </p>
                <h1 className="text-2xl">Felipe!</h1>
              </div>
            </div>
          </div>
        </div>

        <DashboardEmptyState
          userName="Felipe"
          onAddRevisita={() => {
            // Navigate to Campo tab
            if (onNavigateToTab) {
              onNavigateToTab('campo');
            }
          }}
          onConfigureAlvos={() => {
            // Navigate to Espiritual tab
            if (onNavigateToTab) {
              onNavigateToTab('espiritual');
            }
          }}
          onIniciarSessao={() => {
            // Open sessao modal
          }}
        />
      </div>
    );
  }

  // Navegação: Se não estiver na home, mostrar a página correspondente
  if (paginaAtual === 'estatisticas') {
    return <EstatisticasPage onVoltar={() => setPaginaAtual('home')} />;
  }

  if (paginaAtual === 'cronograma') {
    return <CronogramaPage 
      onVoltar={() => setPaginaAtual('home')} 
      diaSelecionado={diaSelecionado}
      onNavigateToEstudo={(estudoId) => {
        // Navegar para aba de estudos e abrir detalhes
        onNavigateToTab?.('estudos', { estudoId, abrirDetalhes: true });
      }}
      onNavigateToRevisita={(revisitaId) => {
        // Navegar para aba de campo e abrir detalhes
        onNavigateToTab?.('campo', { revisitaId, abrirDetalhes: true });
      }}
    />;
  }

  if (paginaAtual === 'progresso') {
    return <ProgressoPage onVoltar={() => setPaginaAtual('home')} />;
  }

  if (paginaAtual === 'cadastrar-tempo') {
    return <CadastrarTempoPage onVoltar={() => setPaginaAtual('home')} />;
  }

  return (
    <div className="min-h-full bg-neutral">
      {/* Header Padrão Consistente */}
      <div 
        className="sticky top-0 z-50 text-white"
        style={{
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'
        }}
      >
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : 'rgba(255, 255, 255, 0.2)'
              }}
            >
              {DataService.getPerfil().avatar ? (
                <img 
                  src={DataService.getPerfil().avatar} 
                  alt={DataService.getPerfil().nome} 
                  className="w-16 h-16 rounded-full object-cover"
                  style={{
                    border: temaAtual === 'escuro' ? '2px solid rgba(200, 224, 70, 0.3)' : '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <p 
                className="text-lg flex items-center gap-2"
                style={{
                  color: temaAtual === 'escuro' ? '#C8E046' : 'rgba(255, 255, 255, 0.85)'
                }}
              >
                <GreetingIcon className="w-5 h-5" /> {greeting},
              </p>
              <h1 className="text-2xl font-bold">{DataService.getPerfil().nome}!</h1>
            </div>
          </div>
          
          {/* Versículo do Ano */}
          <div 
            className="rounded-xl p-4"
            style={{
              backgroundColor: temaAtual === 'escuro' ? 'rgba(60, 45, 80, 0.5)' : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p 
              className="text-xs mb-1"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : 'rgba(255, 255, 255, 0.75)'
              }}
            >
              {t.home.yearText}
            </p>
            <p className="text-sm italic" style={{ opacity: 0.9 }}>
              "{DataService.getPerfil().textoAno?.texto || 'Dêem a Jeová a glória que o seu nome merece.'}"
            </p>
            <p 
              className="text-xs mt-1"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : 'rgba(255, 255, 255, 0.75)'
              }}
            >
              — {DataService.getPerfil().textoAno?.referencia || 'Sal. 96:8'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Card: Progresso*/}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-white border-primary-100"
          onClick={() => setPaginaAtual('progresso')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="flex items-center gap-2 text-primary-700">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                {t.home.progressTitle}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {getTipoPublicadorLabel(DataService.getPerfil().tipoPublicador)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Não mostrar badge quando estiver em 0h para não desmotivar */}
              {horasTotal > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`flex items-center gap-1 ${statusProgresso.cor.bg} ${statusProgresso.cor.text} ${statusProgresso.cor.border}`}
                >
                  <statusProgresso.icone className="w-3 h-3" style={{ color: statusProgresso.cor.iconColor }} /> 
                  {statusProgresso.label}
                </Badge>
              )}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl text-primary-600">{formatarHoras(horasTotal)}</p>
                <p className="text-sm text-gray-500">{t.home.progressOf} {metaMensal}h/{t.home.progressMonth}</p>
              </div>
            </div>
            
            {/* Barra de progresso com visualização dupla */}
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-secondary-400">
              {/* Barra de campo (roxo sólido) */}
              <div 
                className="absolute top-0 left-0 h-full bg-primary-600"
                style={{ width: `${progressoCampo}%` }}
              />
              {/* Barra de crédito (verde lima, sobreposta) */}
              <div 
                className="absolute top-0 left-0 h-full bg-secondary-500"
                style={{ width: `${progressoPercentual}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <statusProgresso.mensagemIcone className="w-4 h-4" style={{ color: statusProgresso.mensagemIconeCor }} /> 
              {statusProgresso.mensagem}
            </p>
          </div>
        </Card>

        {/* Card: Cronograma da Semana */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-white border-primary-100"
          onClick={() => setPaginaAtual('cronograma')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-primary-700">
              <Calendar className="w-5 h-5 text-primary-600" />
              {t.home.scheduleTitle}
            </h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {diasSemana.map((dia, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-28 p-3 rounded-lg border pointer-events-none ${
                  dia.status !== 'Livre' 
                    ? 'bg-secondary-50 border-secondary-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <p className="text-xs text-gray-600">{dia.dia}</p>
                <p className="text-lg text-primary-700">{dia.data}</p>
                {dia.estudos > 0 && (
                  <p className="text-xs mt-1 text-primary-600">
                    {dia.estudos} {dia.estudos > 1 ? t.home.scheduleStudies : t.home.scheduleStudy}
                  </p>
                )}
                {dia.revisitas > 0 && (
                  <p className="text-xs mt-1 text-primary-600">
                    {dia.revisitas} {dia.revisitas > 1 ? t.home.scheduleReturnVisits : t.home.scheduleReturnVisit}
                  </p>
                )}
                {dia.totalAgendamentos === 0 && (
                  <p className="text-xs text-gray-700 mt-1">{t.home.scheduleFree}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Card: Estatísticas do Mês */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-white border-primary-100"
          onClick={() => setPaginaAtual('estatisticas')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <h3 className="text-primary-700">{t.home.statisticsTitle}</h3>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Meta Anual */}
          <div className="mb-4 p-4 rounded-xl bg-white border-2 border-primary-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-primary-700">{t.home.annualGoal} {anoAtual}</span>
              <span className="text-2xl text-primary-700">{metaAnual}h</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600">{t.home.accomplished}</span>
                <span className="text-lg text-primary-800">{formatarHoras(horasAno)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-700">{progressoAnual.toFixed(0)}% {t.home.completed}</span>
                <span className="text-gray-600">
                  {t.home.remaining} {formatarHoras(metaAnual - horasAno)}
                </span>
              </div>
            </div>
          </div>

          {/* Grid de estatísticas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-secondary-50 border-2 border-secondary-200">
              <BookOpen className="w-6 h-6 mx-auto mb-1 text-secondary-700" />
              <p className="text-2xl text-secondary-700">{totalEstudos}</p>
              <p className="text-xs text-gray-600">{t.home.studies}</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-secondary-50 border-2 border-secondary-200">
              <Sprout className="w-6 h-6 mx-auto mb-1 text-secondary-700" />
              <p className="text-2xl text-secondary-700">{totalRevisitasNovas}</p>
              <p className="text-xs text-gray-600">{t.home.returnVisits}</p>
            </div>
          </div>

          {/* Footer hint */}
          <div className="mt-4 pt-3 border-t border-gray-100 text-[rgb(10,10,10)]">
            <p className="text-xs text-gray-500 opacity-30 text-center">
              {t.home.tapForDetails}
            </p>
          </div>
        </Card>

        {/* Espaço para o FAB não sobrepor conteúdo */}
        <div className="h-20" />
      </div>

      {/* Botão Flutuante */}
      <FAB 
        variant="inicio-ministerio"
        sessaoAtiva={sessaoAtiva ? {
          tempoDecorrido: sessaoAtiva.tempoDecorrido,
          pausada: sessaoAtiva.pausada,
        } : undefined}
        onIniciarMinisterio={() => setPaginaAtual('cadastrar-tempo')}
        onAbrirControles={() => setShowControlesSessao(true)}
      />
      
      {/* Modal Detalhes de Estudos */}
      {showEstudosDetalhes && (
        <EstudosDetalhes 
          onClose={() => setShowEstudosDetalhes(false)}
          onNavigateToEstudos={() => {
            setShowEstudosDetalhes(false);
            onNavigateToTab?.('estudos');
          }}
        />
      )}
      
      {/* Modal Detalhes de Revisitas */}
      {showRevisitasDetalhes && (
        <RevisitasDetalhes 
          onClose={() => setShowRevisitasDetalhes(false)}
          onNavigateToRevisitas={() => {
            setShowRevisitasDetalhes(false);
            onNavigateToTab?.('revisitas');
          }}
        />
      )}
      
      {/* Modal Detalhes do Dia */}
      {showDiaDetalhes && (
        <DiaDetalhes 
          onClose={() => setShowDiaDetalhes(false)}
          dia={diaSelecionado}
        />
      )}
      
      {/* Modal Controles de Sessão */}
      {showControlesSessao && (
        <ControlesSessaoModal
          onClose={() => setShowControlesSessao(false)}
          onPausarSessao={handlePausarSessao}
          onRetomarSessao={handleRetomarSessao}
          onAdicionarVisita={handleAdicionarVisita}
          onFinalizarSessao={handleFinalizarSessao}
          sessao={sessaoAtiva}
        />
      )}
      
      {/* Modal Resumo de Sessão */}
      {showResumoSessao && (
        <ResumoSessaoModal
          onClose={() => setShowResumoSessao(false)}
          onSalvarResumo={handleSalvarResumo}
          sessao={sessaoAtiva}
        />
      )}
    </div>
  );
}