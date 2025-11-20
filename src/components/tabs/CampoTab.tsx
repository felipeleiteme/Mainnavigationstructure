import { 
  Sprout, 
  Plus, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  MessageSquare, 
  MoreVertical, 
  Filter, 
  Search, 
  List, 
  Map as MapIcon,
  Home,
  Building2,
  Store,
  Navigation,
  Clock,
  BookOpen
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';
import { DataService, Revisita as RevisitaType } from '../../services/dataService';
import FormularioRevisita from '../campo/FormularioRevisita';
import FormularioEstudo from '../estudos/FormularioEstudo';
import FAB from '../shared/FAB';
import BarraSessao from '../shared/BarraSessao';

interface CampoTabProps {
  filtro?: string;
  onNavigateToTab?: (tab: string) => void;
}

export default function CampoTab({ filtro, onNavigateToTab }: CampoTabProps) {
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');
  const [showFormularioRevisita, setShowFormularioRevisita] = useState(false);
  const [showFormularioEstudo, setShowFormularioEstudo] = useState(false);
  const [revisitaEditando, setRevisitaEditando] = useState<RevisitaType | undefined>();
  const [revisitaParaEstudo, setRevisitaParaEstudo] = useState<RevisitaType | undefined>();
  const [revisitas, setRevisitas] = useState<RevisitaType[]>([]);

  // Aplicar filtro passado como prop
  useEffect(() => {
    if (filtro) {
      setFiltroAtivo(filtro);
    }
  }, [filtro]);

  // Carregar revisitas do DataService
  const carregarRevisitas = () => {
    const todasRevisitas = DataService.getRevisitas();
    setRevisitas(todasRevisitas);
  };

  useEffect(() => {
    carregarRevisitas();
    
    // Escutar mudanças nos dados
    const handleDataChange = () => carregarRevisitas();
    DataService.on('mynis-data-change', handleDataChange);
    
    return () => {
      DataService.off('mynis-data-change', handleDataChange);
    };
  }, []);

  // Processar revisitas para exibição
  const revisitasProcessadas = revisitas.map(r => {
    const ultimaVisita = r.ultimaVisita ? calcularTempoAtras(r.ultimaVisita) : 'Primeira visita';
    const diasDesdeVisita = r.ultimaVisita ? calcularDias(r.ultimaVisita) : 0;
    
    return {
      ...r,
      ultimaVisitaTexto: ultimaVisita,
      diasDesdeVisita,
      precisaRevisitar: diasDesdeVisita > 14
    };
  });

  // Filtrar revisitas
  const revisitasFiltradas = revisitasProcessadas.filter(r => {
    // Filtro de busca
    if (busca && !r.nome.toLowerCase().includes(busca.toLowerCase()) && 
        !r.endereco.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }

    // Filtros específicos
    if (filtroAtivo === 'quentes') {
      return r.status === 'quente';
    }
    
    if (filtroAtivo === 'revisitar') {
      return r.precisaRevisitar;
    }

    if (filtroAtivo === 'disponiveis') {
      return r.status !== 'descanso' && !r.interesseEstudo;
    }
    
    return true;
  });

  // Estatísticas
  const revisitasQuentes = revisitasProcessadas.filter(r => r.status === 'quente').length;
  const revisitasComInteresse = revisitasProcessadas.filter(r => r.interesseEstudo).length;

  // Helper: calcular tempo atrás
  function calcularTempoAtras(data: string) {
    const agora = new Date();
    const dataVisita = new Date(data);
    const diff = Math.floor((agora.getTime() - dataVisita.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Há 1 dia';
    return `Há ${diff} dias`;
  }

  function calcularDias(data: string) {
    const agora = new Date();
    const dataVisita = new Date(data);
    return Math.floor((agora.getTime() - dataVisita.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Abrir formulário de edição
  const handleEditarRevisita = (revisita: RevisitaType) => {
    setRevisitaEditando(revisita);
    setShowFormularioRevisita(true);
  };

  // Iniciar estudo a partir da revisita
  const handleIniciarEstudo = (revisita: RevisitaType) => {
    setRevisitaParaEstudo(revisita);
    setShowFormularioEstudo(true);
  };

  // Handlers para fechar formulários
  const handleFecharFormularioRevisita = () => {
    setShowFormularioRevisita(false);
    setRevisitaEditando(undefined);
  };

  const handleFecharFormularioEstudo = () => {
    setShowFormularioEstudo(false);
    setRevisitaParaEstudo(undefined);
  };

  // Handler para quando estudo é criado
  const handleEstudoCriado = () => {
    handleFecharFormularioEstudo();
    // Navegar para EstudosTab
    onNavigateToTab?.('estudos');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'quente': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'comercio': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'descanso': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nova': return '🆕 Nova';
      case 'quente': return '⚡ Quente';
      case 'comercio': return '🏪 Comércio';
      case 'descanso': return '💤 Descanso';
      default: return status;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'casa': return <Home className="w-4 h-4" />;
      case 'predio': return <Building2 className="w-4 h-4" />;
      case 'comercio': return <Store className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl mb-1">Campo</h1>
        <p className="text-sm opacity-90">
          {revisitas.length} {revisitas.length === 1 ? 'revisita' : 'revisitas'}
        </p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Buscar por nome, endereço..." 
            className="pl-10 pr-12"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Button 
            size="sm" 
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Toggle Lista/Mapa */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('lista')}
            className="flex-1"
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === 'mapa' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mapa')}
            className="flex-1"
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Mapa
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={filtroAtivo === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('todos')}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'disponiveis' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('disponiveis')}
            className={filtroAtivo === 'disponiveis' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Disponíveis Agora
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'quentes' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('quentes')}
          >
            Quentes
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'revisitar' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('revisitar')}
          >
            Para Revisitar
          </Button>
        </div>

        {/* Banner contextual quando filtro "disponiveis" está ativo */}
        {filtroAtivo === 'disponiveis' && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-sm text-gray-700">
                  Estas pessoas estão <strong>disponíveis agora</strong> segundo a disponibilidade cadastrada. 
                  Aproveite para visitá-las!
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Conteúdo */}
      {viewMode === 'lista' ? (
        <div className="px-4 py-4 space-y-3">
          {revisitasFiltradas.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-lg mb-2">Vamos começar sua jornada!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ainda não há revisitas aqui. Que tal adicionar as primeiras pessoas que você conheceu no ministério?
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowFormularioRevisita(true)}
              >
                + Adicionar Primeira Revisita
              </Button>
            </Card>
          ) : (
            <>
              {revisitasFiltradas.map((revisita) => (
                <Card 
                  key={revisita.id} 
                  className="p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base">{revisita.nome}</h3>
                        {revisita.interesseEstudo && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                            ⭐ Interesse
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        {getTipoIcon(revisita.origem)}
                        <span className="line-clamp-1">{revisita.endereco}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`text-xs border ${getStatusColor(revisita.status)}`}>
                      {getStatusLabel(revisita.status)}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {revisita.quantidadeVisitas} {revisita.quantidadeVisitas === 1 ? 'visita' : 'visitas'}
                    </span>
                  </div>

                  {/* Primeira Conversa */}
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {revisita.primeiraConversa}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className={revisita.precisaRevisitar ? 'text-orange-600' : ''}>
                        {revisita.ultimaVisitaTexto}
                      </span>
                    </div>
                    {revisita.precisaRevisitar && (
                      <span className="text-xs text-orange-600">⚠️ Precisa revisitar</span>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {revisita.telefone && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 h-8 text-xs"
                        onClick={() => window.open(`https://wa.me/${revisita.telefone?.replace(/\D/g, '')}`, '_blank')}
                      >
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        WhatsApp
                      </Button>
                    )}
                    {revisita.interesseEstudo && (
                      <Button 
                        size="sm" 
                        className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleIniciarEstudo(revisita)}
                      >
                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                        Iniciar Estudo
                      </Button>
                    )}
                    {!revisita.interesseEstudo && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        onClick={() => handleEditarRevisita(revisita)}
                      >
                        Ver Detalhes
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-320px)] bg-gray-200 flex items-center justify-center p-6">
          <div className="text-center text-gray-500">
            <MapIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Visualização em Mapa</p>
            <p className="text-sm">(Em breve você poderá ver suas revisitas no mapa 🗺️)</p>
          </div>
        </div>
      )}

      {/* Botão Flutuante */}
      <Button 
        size="lg"
        className="fixed bottom-20 right-4 rounded-full h-14 px-6 shadow-lg bg-green-600 hover:bg-green-700 z-40 transition-all duration-300 hover:scale-110"
        onClick={() => setShowFormularioRevisita(true)}
      >
        <Plus className="w-5 h-5 mr-2" />
        Nova Revisita
      </Button>

      {/* Formulários */}
      {showFormularioRevisita && (
        <FormularioRevisita
          revisita={revisitaEditando}
          onClose={handleFecharFormularioRevisita}
          onSave={() => {
            handleFecharFormularioRevisita();
            carregarRevisitas();
          }}
        />
      )}
      {showFormularioEstudo && (
        <FormularioEstudo
          revisitaConversao={revisitaParaEstudo ? {
            nome: revisitaParaEstudo.nome,
            telefone: revisitaParaEstudo.telefone,
            endereco: revisitaParaEstudo.endereco
          } : undefined}
          onClose={handleFecharFormularioEstudo}
          onSave={handleEstudoCriado}
        />
      )}
    </div>
  );
}