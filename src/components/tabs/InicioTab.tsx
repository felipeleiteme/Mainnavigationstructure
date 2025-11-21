import { Calendar, TrendingUp, BookOpen, Sprout, Video, FileText, User } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import DashboardEmptyState from '../inicio/DashboardEmptyState';
import EstatisticasPage from '../pages/EstatisticasPage';
import CronogramaPage from '../pages/CronogramaPage';
import ProgressoPage from '../pages/ProgressoPage';
import EstudosDetalhes from '../estatisticas/EstudosDetalhes';
import RevisitasDetalhes from '../estatisticas/RevisitasDetalhes';
import PublicacoesDetalhes from '../estatisticas/PublicacoesDetalhes';
import VideosDetalhes from '../estatisticas/VideosDetalhes';
import DiaDetalhes from '../cronograma/DiaDetalhes';
import { DataService } from '../../services/dataService';
import { seedDemoData } from '../../services/seedData';
import FAB from '../shared/FAB';
import IniciarSessaoModal from '../shared/IniciarSessaoModal';
import ControlesSessaoModal from '../shared/ControlesSessaoModal';
import ResumoSessaoModal from '../shared/ResumoSessaoModal';
import { toast } from 'sonner';

interface InicioTabProps {
  onNavigateToTab?: (tab: string, options?: any) => void;
}

export default function InicioTab({ onNavigateToTab }: InicioTabProps) {
  const [hasData, setHasData] = useState(true); // Check if user has any data
  const [paginaAtual, setPaginaAtual] = useState<'home' | 'estatisticas' | 'cronograma' | 'progresso'>('home');
  const [diaSelecionado, setDiaSelecionado] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização das estatísticas
  const [showEstudosDetalhes, setShowEstudosDetalhes] = useState(false);
  const [showRevisitasDetalhes, setShowRevisitasDetalhes] = useState(false);
  const [showPublicacoesDetalhes, setShowPublicacoesDetalhes] = useState(false);
  const [showVideosDetalhes, setShowVideosDetalhes] = useState(false);
  const [showDiaDetalhes, setShowDiaDetalhes] = useState(false);

  // Estados da sessão de ministério
  const [showIniciarSessao, setShowIniciarSessao] = useState(false);
  const [showControlesSessao, setShowControlesSessao] = useState(false);
  const [showResumoSessao, setShowResumoSessao] = useState(false);
  const [sessaoAtiva, setSessaoAtiva] = useState<{
    tempoDecorrido: number;
    pausada: boolean;
    tipo: string;
    revisitasVisitadas: number;
    estudosRealizados: number;
    iniciadaEm: number;
  } | null>(null);

  // Carregar sessão salva ao montar componente
  useEffect(() => {
    const sessaoSalva = localStorage.getItem('sessaoAtiva');
    if (sessaoSalva) {
      const sessao = JSON.parse(sessaoSalva);
      // Calcular tempo decorrido desde quando foi salva
      const agora = Date.now();
      const tempoPassado = Math.floor((agora - sessao.ultimaAtualizacao) / 60000); // minutos
      sessao.tempoDecorrido = (sessao.tempoDecorrido || 0) + (sessao.pausada ? 0 : tempoPassado);
      setSessaoAtiva(sessao);
    }
  }, []);

  // Atualizar cronômetro a cada minuto
  useEffect(() => {
    if (sessaoAtiva && !sessaoAtiva.pausada) {
      const interval = setInterval(() => {
        setSessaoAtiva(prev => {
          if (!prev) return null;
          const novaSessao = {
            ...prev,
            tempoDecorrido: prev.tempoDecorrido + 1,
          };
          // Salvar no localStorage
          localStorage.setItem('sessaoAtiva', JSON.stringify({
            ...novaSessao,
            ultimaAtualizacao: Date.now(),
          }));
          return novaSessao;
        });
      }, 60000); // 1 minuto

      return () => clearInterval(interval);
    }
  }, [sessaoAtiva]);

  const handleIniciarSessao = (tipo: string) => {
    const novaSessao = DataService.iniciarSessaoAtiva(tipo);
    setSessaoAtiva(novaSessao);
    setShowIniciarSessao(false);
    toast.success('Sessão iniciada! Boa pregação! 🙏');
  };

  const handleCadastroManual = (dados: { tipo: string; horas: number; minutos: number }) => {
    // Criar uma "sessão virtual" com o tempo já preenchido
    const tempoTotal = dados.horas * 60 + dados.minutos;
    
    const sessaoVirtual = {
      tempoDecorrido: tempoTotal,
      pausada: false,
      tipo: dados.tipo,
      revisitasVisitadas: 0,
      estudosRealizados: 0,
      iniciadaEm: Date.now(),
      ultimaAtualizacao: Date.now(),
      publicacoes: 0,
      videos: 0,
    };
    
    // Salvar no localStorage para que finalizarSessaoAtiva possa acessar
    localStorage.setItem('sessaoAtiva', JSON.stringify(sessaoVirtual));
    
    // Definir sessão como "manual" para mostrar no resumo
    setSessaoAtiva(sessaoVirtual);
    setShowIniciarSessao(false);
    
    // Ir direto para o resumo
    setShowResumoSessao(true);
    
    toast.success(`Tempo registrado: ${dados.horas}h ${dados.minutos}min ⏱️`, {
      description: 'Complete as informações para salvar no relatório',
    });
  };

  const handlePausarSessao = () => {
    DataService.pausarSessaoAtiva();
    setSessaoAtiva(prev => prev ? { ...prev, pausada: true } : null);
    setShowControlesSessao(false);
    toast.info('Sessão pausada ⏸️');
  };

  const handleRetomarSessao = () => {
    DataService.retomarSessaoAtiva();
    setSessaoAtiva(prev => prev ? { ...prev, pausada: false } : null);
    setShowControlesSessao(false);
    toast.success('Sessão retomada! ▶️');
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
      
      toast.success(`Sessão salva! +${Math.floor(sessaoAtiva!.tempoDecorrido / 60)}h${sessaoAtiva!.tempoDecorrido % 60}min no relatório 🎉`);
      
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
  const totalPublicacoes = DataService.getTotalPublicacoesMes();
  const totalVideos = DataService.getTotalVideosMes();
  const horasCampo = DataService.getTotalHorasCampo();
  const horasCredito = DataService.getTotalHorasCredito();
  const horasTotal = horasCampo + horasCredito;
  const metaMensal = DataService.getMetaMensal(); // Meta dinâmica baseada no tipo de publicador
  const progressoPercentual = (horasTotal / metaMensal) * 100;
  const progressoCampo = (horasCampo / metaMensal) * 100;
  const ofensivaLeitura = DataService.getOfensivaLeitura();
  const alvosAtivos = DataService.getAlvosAtivos().length;
  
  // Função para formatar horas no formato "Xh Ymin" ou "XhYmin"
  const formatarHoras = (horas: number): string => {
    const h = Math.floor(horas);
    const min = Math.round((horas - h) * 60);
    if (min === 0) return `${h}h`;
    if (h === 0) return `${min}min`;
    return `${h}h${min}`;
  };

  const currentHour = new Date().getHours();
  let greeting = 'Boa noite';
  let greetingIcon = '🌙';
  
  if (currentHour < 12) {
    greeting = 'Bom dia';
    greetingIcon = '☀️';
  } else if (currentHour < 18) {
    greeting = 'Boa tarde';
    greetingIcon = '🌤️';
  }

  // Show empty state for first-time users
  if (!hasData) {
    return (
      <div className="min-h-full bg-gradient-to-b from-green-50 to-gray-50">
        {/* Cabeçalho Caloroso */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg opacity-90">{greetingIcon} {greeting},</p>
              <h1 className="text-2xl">Felipe!</h1>
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
    return <CronogramaPage onVoltar={() => setPaginaAtual('home')} diaSelecionado={diaSelecionado} />;
  }

  if (paginaAtual === 'progresso') {
    return <ProgressoPage onVoltar={() => setPaginaAtual('home')} />;
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-green-50 to-gray-50">
      {/* Cabeçalho Caloroso */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg opacity-90">{greetingIcon} {greeting},</p>
            <h1 className="text-2xl">{DataService.getPerfil().nome}!</h1>
          </div>
        </div>
        
        {/* Versículo do Ano */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
          <p className="text-xs font-medium opacity-75 mb-1">Texto do Ano</p>
          <p className="text-sm opacity-90 italic">
            "Dêem a Jeová a glória que o seu nome merece."
          </p>
          <p className="text-xs opacity-75 mt-1">— Sal. 96:8</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Card: Progresso do Mês */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Progresso do Mês
            </h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              ✅ No ritmo!
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl text-green-600">{formatarHoras(horasTotal)}</p>
                <p className="text-sm text-gray-500">de {formatarHoras(metaMensal)}h</p>
              </div>
              <p className="text-xs text-gray-600">
                Campo: {formatarHoras(horasCampo)} | Crédito: {formatarHoras(horasCredito)}
              </p>
            </div>
            
            {/* Barra de progresso com visualização dupla */}
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              {/* Barra de campo (verde sólido) */}
              <div 
                className="absolute top-0 left-0 h-full bg-green-600"
                style={{ width: `${progressoCampo}%` }}
              />
              {/* Barra de crédito (verde hachurado) */}
              <div 
                className="absolute top-0 h-full bg-green-300 opacity-60"
                style={{ 
                  left: `${progressoCampo}%`,
                  width: `${progressoPercentual - progressoCampo}%`,
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
                }}
              />
              {/* Linha de meta */}
              <div 
                className="absolute top-0 h-full border-r-2 border-dashed border-gray-500"
                style={{ left: '100%' }}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              💪 Você está no caminho certo! Continue assim.
            </p>
          </div>
        </Card>

        {/* Card: Cronograma da Semana */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Cronograma da Semana
          </h3>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
            {[
              { dia: 'Seg', data: '18', status: 'Manhã planejada', estudos: 2 },
              { dia: 'Ter', data: '19', status: 'Livre', estudos: 0 },
              { dia: 'Qua', data: '20', status: 'Tarde planejada', estudos: 1 },
              { dia: 'Qui', data: '21', status: 'Manhã planejada', estudos: 3 },
              { dia: 'Sex', data: '22', status: 'Livre', estudos: 0 },
              { dia: 'Sáb', data: '23', status: 'Manhã planejada', estudos: 2 },
              { dia: 'Dom', data: '24', status: 'Livre', estudos: 0 },
            ].map((dia, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 w-24 p-3 rounded-lg border transition-all ${
                  dia.status !== 'Livre' 
                    ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setDiaSelecionado(dia);
                  setShowDiaDetalhes(true);
                }}
              >
                <p className="text-xs text-gray-600">{dia.dia}</p>
                <p className="text-lg">{dia.data}</p>
                <p className="text-xs text-gray-700 mt-1">{dia.status}</p>
                {dia.estudos > 0 && (
                  <p className="text-xs text-green-700 mt-1">{dia.estudos} estudos</p>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Card: Estatísticas do Mês */}
        <Card className="p-6">
          <h3 className="mb-4">Estatísticas do Mês</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              onClick={() => setShowEstudosDetalhes(true)}
            >
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl text-blue-900">{totalEstudos}</p>
              <p className="text-sm text-gray-600">Estudos</p>
            </button>
            
            <button 
              className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              onClick={() => setShowRevisitasDetalhes(true)}
            >
              <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl text-green-900">{totalRevisitasNovas}</p>
              <p className="text-sm text-gray-600">Revisitas Novas</p>
            </button>
            
            <button className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              onClick={() => setShowPublicacoesDetalhes(true)}
            >
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl text-purple-900">{totalPublicacoes}</p>
              <p className="text-sm text-gray-600">Publicações</p>
            </button>
            
            <button className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              onClick={() => setShowVideosDetalhes(true)}
            >
              <Video className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl text-orange-900">{totalVideos}</p>
              <p className="text-sm text-gray-600">Vídeos</p>
            </button>
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
        onIniciarMinisterio={() => setShowIniciarSessao(true)}
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
      
      {/* Modal Detalhes de Publicações */}
      {showPublicacoesDetalhes && (
        <PublicacoesDetalhes 
          onClose={() => setShowPublicacoesDetalhes(false)}
          onNavigateToPublicacoes={() => {
            setShowPublicacoesDetalhes(false);
            onNavigateToTab?.('publicacoes');
          }}
        />
      )}
      
      {/* Modal Detalhes de Vídeos */}
      {showVideosDetalhes && (
        <VideosDetalhes 
          onClose={() => setShowVideosDetalhes(false)}
          onNavigateToVideos={() => {
            setShowVideosDetalhes(false);
            onNavigateToTab?.('videos');
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
      
      {/* Modal Iniciar Sessão */}
      {showIniciarSessao && (
        <IniciarSessaoModal
          onClose={() => setShowIniciarSessao(false)}
          onIniciarSessao={handleIniciarSessao}
          onCadastroManual={handleCadastroManual}
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