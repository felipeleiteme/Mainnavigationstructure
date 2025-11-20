import { BookOpen, Plus, Search, Filter, Calendar, MapPin, Phone, MessageCircle, MoreVertical, Bell, Clock, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { useState, useEffect } from 'react';
import { DataService, Estudo } from '../../services/dataService';
import FormularioEstudo from '../estudos/FormularioEstudo';
import { toast } from 'sonner';
import FAB from '../shared/FAB';
import BarraSessao from '../shared/BarraSessao';
import { seedDemoData } from '../../services/seedData';

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
}

// Empty State Component
function EmptyState({ emoji, title, description, actions }: any) {
  return (
    <Card className="p-8 text-center bg-gray-50">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{description}</p>
      {actions && (
        <div className="space-y-2">
          {actions.map((action: any, idx: number) => (
            <Button key={idx} onClick={action.onClick} variant="outline">
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function EstudosTab({ filtro, onNavigateToTab, sessaoAtiva, onPausarSessao, onFinalizarSessao, onAbrirControlesSessao }: EstudosTabProps) {
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [showFormulario, setShowFormulario] = useState(false);
  const [estudoEditando, setEstudoEditando] = useState<Estudo | undefined>();
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [estudoDetalhes, setEstudoDetalhes] = useState<Estudo | undefined>();

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
    DataService.on('mynis-data-change', handleDataChange);
    
    return () => {
      DataService.off('mynis-data-change', handleDataChange);
    };
  }, []);

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
    if (busca && !e.estudanteNome.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }

    // Filtros de tempo
    if (filtroAtivo === 'hoje') {
      return e.isHoje;
    }
    
    return true;
  });

  const estudosHoje = estudosProcessados.filter(e => e.isHoje);

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
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">🌱 Iniciando</Badge>;
      case 'progredindo':
        return <Badge className="bg-green-100 text-green-700 border-green-200">📖 Progredindo</Badge>;
      case 'duvidas':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">❓ Com dúvidas</Badge>;
      case 'avancado':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">🎯 Avançado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-2xl mb-1">Estudos Bíblicos</h1>
        <p className="text-sm opacity-90">
          {estudos.length} {estudos.length === 1 ? 'estudo ativo' : 'estudos ativos'}
        </p>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Card Destaque: Estudos de Hoje */}
        {estudosHoje.length > 0 && (
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-yellow-700" />
              <h3 className="text-sm text-yellow-900">Estudos de Hoje</h3>
            </div>
            
            <div className="space-y-1.5 mb-3">
              {estudosHoje.map((estudo, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-sm">{estudo.estudanteNome}</span>
                  <span className="text-xs text-gray-600">{estudo.horario}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
              <span className="text-xs text-gray-700">Notificar 1h antes</span>
              <Switch defaultChecked className="scale-75" />
            </div>
          </Card>
        )}

        {/* Filtros */}
        <div className="px-4 flex gap-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={filtroAtivo === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('todos')}
          >
            Todos
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'hoje' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('hoje')}
            className={filtroAtivo === 'hoje' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Hoje
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'semana' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('semana')}
          >
            Esta semana
          </Button>
          <Button
            size="sm"
            variant={filtroAtivo === 'proximos' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('proximos')}
          >
            Próximos 7 dias
          </Button>
        </div>

        {/* Banner contextual quando filtro "hoje" está ativo */}
        {filtroAtivo === 'hoje' && (
          <div className="px-4">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <h3 className="text-sm mb-1">Estudos de Hoje</h3>
                  <p className="text-xs text-gray-600">
                    Prepare-se para ótimos estudos! ✨
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Lista de Estudos */}
        <div className="space-y-3">
          {estudosFiltrados.length === 0 ? (
            <EmptyState
              emoji="📚"
              title="Nenhum estudo bíblico ainda"
              description="Quando você iniciar estudos bíblicos com as pessoas, eles aparecerão aqui para você acompanhar o progresso de cada um."
              actions={[
                {
                  label: '✨ Carregar Dados de Exemplo',
                  onClick: carregarDadosExemplo,
                },
                {
                  label: 'Ver Minhas Revisitas',
                  onClick: () => {
                    if (onNavigateToTab) {
                      onNavigateToTab('campo');
                    }
                  },
                },
              ]}
            />
          ) : (
            estudosFiltrados.map((estudo, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg">{estudo.estudanteNome}</h3>
                      {estudo.lembreteAtivo && (
                        <Bell className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{estudo.publicacao}</p>
                    {getProgressoBadge(estudo.status)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className={estudo.isHoje ? 'text-orange-600' : ''}>
                      {estudo.proximoEstudo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Última conversa: {estudo.ultimaConversa}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      if (estudo.estudanteTelefone) {
                        window.location.href = `tel:${estudo.estudanteTelefone.replace(/\D/g, '')}`;
                      } else {
                        toast.error('Telefone não cadastrado');
                      }
                    }}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Ligar
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setEstudoDetalhes(estudo)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Botão Flutuante */}
      <FAB
        variant="novo-estudo"
        onNovoEstudo={() => setShowFormulario(true)}
      />

      {/* Formulário de Estudo */}
      {showFormulario && (
        <FormularioEstudo
          estudo={estudoEditando}
          onClose={() => setShowFormulario(false)}
        />
      )}

      {/* Barra de Sessão */}
      {sessaoAtiva && (
        <BarraSessao
          sessao={sessaoAtiva}
          onPausar={onPausarSessao || (() => {})}
          onFinalizar={onFinalizarSessao || (() => {})}
          onAbrirControles={onAbrirControlesSessao || (() => {})}
        />
      )}
    </div>
  );
}