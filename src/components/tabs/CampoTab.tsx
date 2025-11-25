import { 
  Plus, 
  Search, 
  Filter, 
  Home,
  Building2,
  Store,
  Clock,
  BookOpen,
  Phone,
  ChevronRight,
  Calendar,
  Sparkles,
  Zap,
  ShoppingBag,
  Moon,
  Star,
  AlertTriangle,
  Lightbulb,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';
import { DataService, Revisita as RevisitaType } from '../../services/dataService';
import FormularioEstudo from '../estudos/FormularioEstudo';
import DetalhesRevisitaPage from '../pages/DetalhesRevisitaPage';
import NovaRevisitaPage from '../pages/NovaRevisitaPage';
import NovoEstudoPage from '../pages/NovoEstudoPage';
import RegistrarVisitaPage from '../pages/RegistrarVisitaPage';
import FAB from '../shared/FAB';

interface CampoTabProps {
  filtro?: string;
  onNavigateToTab?: (tab: string) => void;
  revisitaId?: string;
  abrirDetalhes?: boolean;
}

type PaginaCampo = 'home' | 'detalhes' | 'nova-revisita' | 'editar-revisita' | 'novo-estudo' | 'registrar-visita';

export default function CampoTab({ filtro, onNavigateToTab, revisitaId, abrirDetalhes }: CampoTabProps) {
  const [paginaAtual, setPaginaAtual] = useState<PaginaCampo>('home');
  const [revisitaSelecionada, setRevisitaSelecionada] = useState<string>('');
  const [revisitaEditando, setRevisitaEditando] = useState<RevisitaType | undefined>();
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [showFormularioEstudo, setShowFormularioEstudo] = useState(false);
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
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, []);

  // Abrir detalhes automaticamente se revisitaId e abrirDetalhes forem passados
  useEffect(() => {
    if (revisitaId && abrirDetalhes) {
      handleAbrirDetalhes(revisitaId);
    }
  }, [revisitaId, abrirDetalhes]);

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
  }).sort((a, b) => {
    // Ordenar do mais recente para o mais antigo
    // Extrai timestamp do ID (formato: "timestamp-random")
    const timestampA = parseInt(a.id.split('-')[0]);
    const timestampB = parseInt(b.id.split('-')[0]);
    return timestampB - timestampA; // Decrescente (mais recente primeiro)
  });

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

  // Handlers de navegação
  const handleAbrirDetalhes = (revisitaId: string) => {
    setRevisitaSelecionada(revisitaId);
    setPaginaAtual('detalhes');
  };

  const handleAbrirNovaRevisita = () => {
    setRevisitaEditando(undefined);
    setPaginaAtual('nova-revisita');
  };

  const handleEditarRevisita = (revisita: RevisitaType) => {
    setRevisitaEditando(revisita);
    setPaginaAtual('editar-revisita');
  };

  const handleIniciarEstudo = (revisita: RevisitaType) => {
    // Converter revisita em estudo
    const novoEstudo = {
      estudanteNome: revisita.nome,
      estudanteTelefone: revisita.telefone || '',
      estudanteEndereco: revisita.endereco,
      publicacao: 'O Que a Bíblia Realmente Ensina?',
      status: 'iniciando' as const,
      data: new Date().toISOString().split('T')[0],
      horario: '19:00',
      observacoes: revisita.primeiraConversa || '',
      sessoes: []
    };

    // Adicionar o novo estudo
    DataService.adicionarEstudo(novoEstudo);
    
    // Remover a revisita
    DataService.removerRevisita(revisita.id);
    
    // Mostrar mensagem de sucesso
    import('sonner@2.0.3').then(({ toast }) => {
      toast.success('Estudo Bíblico Iniciado! 📖', {
        description: `${revisita.nome} agora está na lista de Estudos Bíblicos`,
      });
    });
    
    // Navegar para a aba de Estudos
    if (onNavigateToTab) {
      onNavigateToTab('estudos');
    }
  };

  const handleFecharFormularioEstudo = () => {
    setShowFormularioEstudo(false);
    setRevisitaParaEstudo(undefined);
  };

  const handleEstudoCriado = () => {
    handleFecharFormularioEstudo();
    onNavigateToTab?.('estudos');
  };

  const handleVoltarParaLista = () => {
    setPaginaAtual('home');
    setRevisitaSelecionada('');
    setRevisitaEditando(undefined);
    carregarRevisitas(); // Recarregar lista
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-green-50 text-green-600 border-green-100';
      case 'quente': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'comercio': return 'border'; // Será estilizado inline com roxo primário
      case 'descanso': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nova': return (
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Nova
        </span>
      );
      case 'quente': return (
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Quente
        </span>
      );
      case 'comercio': return (
        <span className="flex items-center gap-1">
          <ShoppingBag className="w-3 h-3" />
          Comércio
        </span>
      );
      case 'descanso': return (
        <span className="flex items-center gap-1">
          <Moon className="w-3 h-3" />
          Descanso
        </span>
      );
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

  // Renderizar páginas
  if (paginaAtual === 'detalhes') {
    return (
      <DetalhesRevisitaPage 
        revisitaId={revisitaSelecionada}
        onVoltar={handleVoltarParaLista}
        onEditar={handleEditarRevisita}
        onIniciarEstudo={handleIniciarEstudo}
        onRegistrarVisita={(id) => {
          setRevisitaSelecionada(id);
          setPaginaAtual('registrar-visita');
        }}
      />
    );
  }

  if (paginaAtual === 'nova-revisita' || paginaAtual === 'editar-revisita') {
    return (
      <NovaRevisitaPage 
        onVoltar={handleVoltarParaLista}
        revisitaEditar={revisitaEditando}
      />
    );
  }

  if (paginaAtual === 'novo-estudo') {
    return (
      <NovoEstudoPage 
        onVoltar={handleVoltarParaLista}
        revisitaConversao={revisitaParaEstudo ? {
          nome: revisitaParaEstudo.nome,
          telefone: revisitaParaEstudo.telefone,
          endereco: revisitaParaEstudo.endereco
        } : undefined}
      />
    );
  }

  if (paginaAtual === 'registrar-visita') {
    return (
      <RegistrarVisitaPage 
        onVoltar={handleVoltarParaLista}
        revisitaId={revisitaSelecionada}
      />
    );
  }

  // Página Home (Lista)
  return (
    <div className="min-h-full" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div style={{ backgroundColor: '#4A2C60' }} className="sticky top-0 z-50 text-white">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <Sprout className="w-7 h-7" />
            <div>
              <h2 className="text-xl">Campo</h2>
              <p className="text-xs opacity-90">
                {revisitas.length} {revisitas.length === 1 ? 'revisita' : 'revisitas'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Buscar por nome, endereço..." 
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
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filtros - Scroll Horizontal */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            size="sm"
            variant={filtroAtivo === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('todos')}
            className={`whitespace-nowrap ${filtroAtivo === 'todos' ? '' : 'bg-white border-gray-200'}`}
            style={filtroAtivo === 'todos' ? { backgroundColor: '#4A2C60' } : {}}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'disponiveis' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('disponiveis')}
            className="whitespace-nowrap bg-white border-gray-200"
            style={filtroAtivo === 'disponiveis' ? { backgroundColor: '#4A2C60' } : {}}
          >
            Disponíveis Agora
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'quentes' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('quentes')}
            className={`whitespace-nowrap ${filtroAtivo === 'quentes' ? '' : 'bg-white border-gray-200'}`}
            style={filtroAtivo === 'quentes' ? { backgroundColor: '#4A2C60' } : {}}
          >
            Quentes
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'revisitar' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('revisitar')}
            className={`whitespace-nowrap ${filtroAtivo === 'revisitar' ? '' : 'bg-white border-gray-200'}`}
            style={filtroAtivo === 'revisitar' ? { backgroundColor: '#4A2C60' } : {}}
          >
            Para Revisitar
          </Button>
        </div>

        {/* Banner contextual quando filtro "disponiveis" está ativo */}
        {filtroAtivo === 'disponiveis' && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0" />
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

      {/* Lista de Revisitas */}
      <div className="px-4 pb-24 space-y-3">
        {revisitasFiltradas.length === 0 ? (
          <Card className="p-8 text-center bg-white border-0 shadow-sm">
            <div className="flex justify-center mb-4">
              <Sprout className="w-16 h-16" style={{ color: '#4A2C60' }} />
            </div>
            <h3 className="text-lg mb-2">Vamos começar sua jornada!</h3>
            <p className="text-sm text-gray-600 mb-4">
              {busca 
                ? 'Nenhuma revisita encontrada com esses critérios.'
                : 'Ainda não há revisitas aqui. Que tal adicionar as primeiras pessoas que você conheceu no ministério?'}
            </p>
            {!busca && (
              <p className="text-sm text-gray-500 mb-4">
                Clique no botão + abaixo para adicionar sua primeira revisita
              </p>
            )}
          </Card>
        ) : (
          <>
            {revisitasFiltradas.map((revisita) => (
              <Card 
                key={revisita.id} 
                className="p-4 bg-white border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
                onClick={() => handleAbrirDetalhes(revisita.id)}
              >
                {/* Nome + Badge + Seta */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h3 className="truncate">{revisita.nome}</h3>
                    {revisita.interesseEstudo && (
                      <Star className="w-5 h-5 flex-shrink-0" style={{ color: '#C8E046' }} />
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>

                {/* Primeira conversa / Publicação entregue */}
                {revisita.publicacoesEntregues && revisita.publicacoesEntregues.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {revisita.publicacoesEntregues[0]}
                  </p>
                )}

                {/* Badge de Status */}
                <div className="mb-2">
                  <Badge 
                    className={`text-xs border ${getStatusColor(revisita.status)}`}
                    style={revisita.status === 'comercio' ? { 
                      backgroundColor: '#F5F2F7',
                      color: '#4A2C60',
                      borderColor: '#D8CEE8'
                    } : {}}
                  >
                    {getStatusLabel(revisita.status)}
                  </Badge>
                </div>

                {/* Informações com ícones (última visita + endereço) */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={revisita.precisaRevisitar ? 'text-orange-600' : 'text-gray-600'}>
                      {revisita.ultimaVisitaTexto}
                      {revisita.precisaRevisitar && ' • Revisitar urgente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getTipoIcon(revisita.origem)}
                    <span className="line-clamp-1">{revisita.endereco}</span>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* FAB - Botão de Ação Flutuante */}
      <Button
        size="lg"
        onClick={handleAbrirNovaRevisita}
        className="fixed bottom-20 right-4 rounded-full h-14 px-6 shadow-lg z-40 transition-all duration-300 hover:scale-110 border-0"
        style={{ backgroundColor: '#4A2C60', color: 'white' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#3D234D';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#4A2C60';
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Nova Revisita
      </Button>

      {/* Formulário de Estudo (Modal) */}
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