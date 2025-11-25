import { ArrowLeft, Edit, Phone, MessageSquare, MapPin, Calendar, Clock, BookOpen, TrendingUp, Bell, Trash2, User, Zap, AlertTriangle, Flame, Sprout, HelpCircle, Target, BarChart3 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

interface DetalhesEstudoPageProps {
  estudoId: string;
  onVoltar: () => void;
  onEditar: (estudo: Estudo) => void;
}

export default function DetalhesEstudoPage({ estudoId, onVoltar, onEditar }: DetalhesEstudoPageProps) {
  const [estudo, setEstudo] = useState<Estudo | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    carregarEstudo();
  }, [estudoId]);

  const carregarEstudo = () => {
    const estudoEncontrado = DataService.getEstudos().find(e => e.id === estudoId);
    setEstudo(estudoEncontrado || null);
  };

  if (!estudo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-sm text-gray-600">Estudo não encontrado</p>
          <Button onClick={onVoltar} variant="outline" className="mt-4">Voltar</Button>
        </Card>
      </div>
    );
  }

  const handleExcluir = () => {
    DataService.removerEstudo(estudoId);
    toast.success('Estudo removido', {
      description: `${estudo.estudanteNome} foi removido da lista`,
    });
    onVoltar();
  };

  const handleLigar = () => {
    if (estudo.estudanteTelefone) {
      window.location.href = `tel:${estudo.estudanteTelefone.replace(/\D/g, '')}`;
    } else {
      toast.error('Telefone não cadastrado');
    }
  };

  const handleWhatsApp = () => {
    if (estudo.estudanteTelefone) {
      const numero = estudo.estudanteTelefone.replace(/\D/g, '');
      window.open(`https://wa.me/55${numero}`, '_blank');
    } else {
      toast.error('Telefone não cadastrado');
    }
  };

  const handleVerNoMapa = () => {
    if (estudo.estudanteEndereco) {
      const enderecoEncoded = encodeURIComponent(estudo.estudanteEndereco);
      window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoEncoded}`, '_blank');
    } else {
      toast.error('Endereço não cadastrado');
    }
  };

  const getProgressoBadge = (status: string) => {
    switch (status) {
      case 'iniciando':
        return (
          <Badge className="bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
            <Sprout className="w-3 h-3" /> Iniciando
          </Badge>
        );
      case 'progredindo':
        return (
          <Badge className="bg-green-50 text-green-600 border border-green-100 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Progredindo
          </Badge>
        );
      case 'duvidas':
        return (
          <Badge className="bg-yellow-50 text-yellow-600 border border-yellow-100 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Com dúvidas
          </Badge>
        );
      case 'avancado':
        return (
          <Badge 
            className="border flex items-center gap-1"
            style={{ 
              backgroundColor: '#F5F2F7',
              color: '#4A2C60',
              borderColor: '#D8CEE8'
            }}
          >
            <Target className="w-3 h-3" /> Avançado
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatarData = (data: string) => {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const isHoje = () => {
    const hoje = new Date();
    const dataEstudo = new Date(estudo.data);
    return hoje.toDateString() === dataEstudo.toDateString();
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
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
            <h2>{estudo.estudanteNome}</h2>
            <p className="text-sm opacity-90">Estudo Bíblico</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditar(estudo)}
            className="p-2 text-white hover:bg-white/20"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-4">
        {/* Card: Informações do Estudante */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#F5F2F7', borderColor: '#D8CEE8' }}>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4A2C60' }}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-4">Informações de Contato</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Nome completo</p>
              <p className="text-sm">{estudo.estudanteNome}</p>
            </div>

            {estudo.estudanteTelefone && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Telefone</p>
                <p className="text-sm mb-3">{estudo.estudanteTelefone}</p>
                
                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleLigar}
                    className="h-14 w-full flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: '#4A2C60', color: 'white' }}
                  >
                    <Phone className="w-5 h-5" />
                    Ligar
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    className="h-14 w-full flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: '#4A2C60', color: 'white' }}
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            )}

            {estudo.estudanteEndereco && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Endereço completo</p>
                <p className="text-sm mb-2">{estudo.estudanteEndereco}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs"
                  style={{ color: '#4A2C60' }}
                  onClick={handleVerNoMapa}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Ver no mapa
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Card: Detalhes do Estudo */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Detalhes do Estudo
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Publicação</p>
              <p className="text-sm">{estudo.publicacao}</p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-2">Progresso</p>
              {getProgressoBadge(estudo.status)}
            </div>

            <div className={`p-3 rounded-lg border ${isHoje() ? 'bg-orange-50 border-orange-200' : ''}`} style={!isHoje() ? { backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.15)' } : {}}>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-700" />
                <p className="text-xs text-gray-700">Próximo estudo</p>
              </div>
              <p className="text-sm">
                {isHoje() ? (
                  <span className="flex items-center gap-1 text-orange-700">
                    <Flame className="w-4 h-4" /> Hoje
                  </span>
                ) : (
                  formatarData(estudo.data)
                )} às {estudo.horario}
              </p>
            </div>

            {estudo.observacoes && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Observações</p>
                <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {estudo.observacoes}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Card: Zona de Perigo */}
        <Card className="p-5 border-red-200 bg-red-50">
          <h3 className="mb-4 text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </h3>
          <p className="text-sm text-red-700 mb-4">
            Ao excluir este estudo, todos os dados serão removidos permanentemente. Esta ação não pode ser desfeita.
          </p>
          <Button 
            variant="outline" 
            className="w-full text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover Estudo
          </Button>
        </Card>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full animate-scale-in">
            <h3 className="mb-2">Confirmar Remoção</h3>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja remover o estudo com <strong>{estudo.estudanteNome}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleExcluir}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Remover
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}