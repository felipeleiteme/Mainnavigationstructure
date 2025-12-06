import { BookOpen, Plus, Search, Filter, Calendar, MapPin, Phone, MessageCircle, MoreVertical, Bell, Clock, X, ChevronRight, Sparkles, BookMarked, HelpCircle, GraduationCap, Lightbulb, MessageSquare } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { useState, useEffect, useMemo } from 'react';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner';
import FAB from '../shared/FAB';
import BarraSessao from '../shared/BarraSessao';
import { seedDemoData } from '../../services/seedData';
import DetalhesEstudoPage from '../pages/DetalhesEstudoPage';
import NovoEstudoPage from '../pages/NovoEstudoPage';
import EmptyState from '../shared/EmptyState';
import { ThemeService } from '@/services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

interface EstudosTabProps {
  filtro?: string;
  onNavigateToTab?: (tab: string) => void;
  sessaoAtiva?: {
    tempoDecorrido: number;
    pausada: boolean;
  } | null;
  onPausarSessao?: () => void;
  onFinalizarSessao?: () => void;
  onAbrirControlesSessao?: () => void;
  estudoId?: string;
  abrirDetalhes?: boolean;
}

type PaginaEstudos = 'home' | 'detalhes' | 'novo-estudo' | 'editar-estudo';

export default function EstudosTab({ filtro, onNavigateToTab, sessaoAtiva, onPausarSessao, onFinalizarSessao, onAbrirControlesSessao, estudoId, abrirDetalhes }: EstudosTabProps) {
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<PaginaEstudos>('home');
  const [estudoSelecionado, setEstudoSelecionado] = useState<string>('');
  const [estudoEditando, setEstudoEditando] = useState<Estudo | undefined>();
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  
  // Hook de traduções - DEVE ser chamado no topo do componente
  const t = useTranslations();

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Aplicar filtro passado como prop
  useEffect(() => {
    if (filtro) {
      setFiltroAtivo(filtro);
    }
  }, [filtro]);

  // Carregar estudos do DataService
  const carregarEstudos = () => {
    const todosEstudos = DataService.getEstudos();
    setEstudos(todosEstudos);
  };

  // Função para carregar dados de exemplo
  const carregarDadosExemplo = () => {
    seedDemoData();
    // Recarregar a página para garantir IDs únicos
    window.location.reload();
  };

  useEffect(() => {
    carregarEstudos();
    
    // Escutar mudanças nos dados
    const handleDataChange = () => carregarEstudos();
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, []);

  // Abrir detalhes automaticamente se estudoId e abrirDetalhes forem passados
  useEffect(() => {
    if (estudoId && abrirDetalhes) {
      handleAbrirDetalhes(estudoId);
    }
  }, [estudoId, abrirDetalhes]);

  // Processar estudos para exibição
  const estudosProcessados = estudos.map(e => {
    const dataEstudo = new Date(e.data);
    const hoje = new Date();
    const isHoje = dataEstudo.toDateString() === hoje.toDateString();
    
    return {
      ...e,
      isHoje,
      proximoEstudo: isHoje 
        ? `Hoje, ${e.horario}` 
        : dataEstudo.toLocaleDateString('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
      ultimaConversa: calcularTempoAtras(e.data),
      lembreteAtivo: true
    };
  });

  // Filtrar estudos
  const estudosFiltrados = estudosProcessados.filter(e => {
    // Filtro de busca
    if (busca && !e.estudanteNome?.toLowerCase().includes(busca.toLowerCase()) && !e.estudanteEndereco?.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }

    // Filtros de tempo e status
    if (filtroAtivo === 'hoje') {
      return e.isHoje;
    }
    
    if (filtroAtivo === 'semana') {
      // Filtrar estudos "quentes" - estudos com status 'duvidas' ou 'progredindo'
      return e.status === 'duvidas' || e.status === 'progredindo';
    }
    
    if (filtroAtivo === 'pausados') {
      // Filtrar estudos que não tiveram atividade recente (mais de 30 dias)
      const diasDesdeEstudo = Math.floor((new Date().getTime() - new Date(e.data).getTime()) / (1000 * 60 * 60 * 24));
      return diasDesdeEstudo > 30;
    }
    
    return true;
  }).sort((a, b) => {
    // Ordenar do mais recente para o mais antigo
    // Extrai timestamp do ID (formato: "timestamp-random")
    const timestampA = parseInt(a.id.split('-')[0]);
    const timestampB = parseInt(b.id.split('-')[0]);
    return timestampB - timestampA; // Decrescente (mais recente primeiro)
  });

  const estudosHoje = estudosProcessados.filter(e => e.isHoje);
  const totalEstudos = estudos.length;

  // Helper: calcular tempo atrás
  function calcularTempoAtras(data: string) {
    const agora = new Date();
    const dataEstudo = new Date(data);
    const diff = Math.floor((agora.getTime() - dataEstudo.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Há 1 dia';
    return `Há ${diff} dias`;
  }

  const getProgressoBadge = (progresso: string) => {
    switch (progresso) {
      case 'iniciando':
        return (
          <Badge className="bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1 w-fit">
            <Sparkles className="w-3 h-3" />
            {t.studies.statusStarting}
          </Badge>
        );
      case 'progredindo':
        return (
          <Badge className="bg-green-50 text-green-600 border border-green-100 flex items-center gap-1 w-fit">
            <BookMarked className="w-3 h-3" />
            {t.studies.statusProgressing}
          </Badge>
        );
      case 'duvidas':
        return (
          <Badge className="bg-yellow-50 text-yellow-600 border border-yellow-100 flex items-center gap-1 w-fit">
            <HelpCircle className="w-3 h-3" />
            {t.studiesTab.statusWithDoubt}
          </Badge>
        );
      case 'avancado':
        return (
          <Badge 
            className="border flex items-center gap-1 w-fit"
            style={{ 
              backgroundColor: '#F5F2F7',
              color: '#4A2C60',
              borderColor: '#D8CEE8'
            }}
          >
            <GraduationCap className="w-3 h-3" />
            {t.studies.statusAdvanced}
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handlers de navegação
  const handleAbrirDetalhes = (estudoId: string) => {
    setEstudoSelecionado(estudoId);
    setPaginaAtual('detalhes');
  };

  const handleAbrirNovoEstudo = () => {
    setEstudoEditando(undefined);
    setPaginaAtual('novo-estudo');
  };

  const handleEditarEstudo = (estudo: Estudo) => {
    setEstudoEditando(estudo);
    setPaginaAtual('editar-estudo');
  };

  const handleVoltarParaLista = () => {
    setPaginaAtual('home');
    setEstudoSelecionado('');
    setEstudoEditando(undefined);
    carregarEstudos(); // Recarregar lista
  };

  // Renderizar páginas
  if (paginaAtual === 'detalhes') {
    return (
      <DetalhesEstudoPage 
        estudoId={estudoSelecionado}
        onVoltar={handleVoltarParaLista}
        onEditar={handleEditarEstudo}
      />
    );
  }

  if (paginaAtual === 'novo-estudo' || paginaAtual === 'editar-estudo') {
    return (
      <NovoEstudoPage 
        onVoltar={handleVoltarParaLista}
        estudoEditar={estudoEditando}
      />
    );
  }

  // Página Home (Lista)
  return (
    <div 
      className="min-h-full" 
      style={{ 
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' 
      }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-50 text-white" 
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' 
        }}
      >
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            <div>
              <h1 className="text-2xl">{t.studies.title}</h1>
              <p className="text-sm opacity-90">
                {t.studies.activeStudies(totalEstudos)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder={t.studies.searchPlaceholder} 
            className="h-14 pl-12 pr-16 bg-white border-2"
            style={{ borderColor: '#D8CEE8' }}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Button 
            size="sm" 
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
          </Button>
        </div>

        {/* Filtros - Scroll Horizontal */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            size="sm"
            variant={filtroAtivo === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('todos')}
            className={`whitespace-nowrap ${
              filtroAtivo === 'todos' 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-white border-gray-200'
            }`}
          >
            {t.studies.filterAll}
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'hoje' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('hoje')}
            className={`whitespace-nowrap ${
              filtroAtivo === 'hoje' 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-white border-gray-200'
            }`}
          >
            {t.studies.filterAvailable}
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'semana' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('semana')}
            className={`whitespace-nowrap ${
              filtroAtivo === 'semana' 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-white border-gray-200'
            }`}
          >
            {t.studies.filterHot}
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'pausados' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('pausados')}
            className={`whitespace-nowrap ${
              filtroAtivo === 'pausados' 
                ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                : 'bg-white border-gray-200'
            }`}
          >
            {t.studies.filterPaused}
          </Button>
        </div>

        {/* Banner contextual quando filtro "hoje" está ativo */}
        {filtroAtivo === 'hoje' && estudosHoje.length > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  {t.studiesTab.todayBanner(estudosHoje.length)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Lista de Estudos */}
      <div className="px-6 pb-24 space-y-4">
        {estudosFiltrados.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title={t.studiesTab.emptyTitle}
            description={t.studiesTab.emptyDescription}
          />
        ) : (
          estudosFiltrados.map((estudo) => (
            <Card 
              key={estudo.id} 
              className="p-4 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => handleAbrirDetalhes(estudo.id)}
            >
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base">{estudo.estudanteNome}</h3>
                    {estudo.lembreteAtivo && (
                      <Bell className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{estudo.publicacao}</p>
                  {getProgressoBadge(estudo.status)}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              {/* Corpo do Card */}
              <div className="space-y-2">
                {/* Próximo estudo */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className={estudo.isHoje ? 'text-orange-600' : 'text-gray-600'}>
                    {estudo.proximoEstudo}
                  </span>
                </div>

                {/* Endereço */}
                {estudo.estudanteEndereco && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{estudo.estudanteEndereco}</span>
                  </div>
                )}

                {/* Destaque para estudos de hoje */}
                {estudo.isHoje && (
                  <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-orange-700">{t.studiesTab.studyScheduledToday}</p>
                    </div>
                    <p className="text-sm text-orange-900 ml-6">
                      {t.studiesTab.prepareConversation}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Botão Flutuante */}
      <FAB
        variant="novo-estudo"
        onNovoEstudo={handleAbrirNovoEstudo}
      />

      {/* Barra de Sessão */}
      {sessaoAtiva && (
        <BarraSessao
          sessao={sessaoAtiva}
          onPausar={onPausarSessao || (() => {})}
          onFinalizar={onFinalizarSessao || (() => {})}
          onAbrirControles={onAbrirControlesSessao || (() => {})}
        />
      )}

      {/* CSS para esconder scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}