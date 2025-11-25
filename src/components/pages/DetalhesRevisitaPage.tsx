import { ArrowLeft, Phone, MapPin, Calendar, MessageSquare, Edit, BookOpen, Clock, User, Home, Building2, Store, FileText, BarChart3, Star, Sparkles, Flame, Moon, Trash2, AlertTriangle, CheckCircle2, XCircle, Plus, BookMarked } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Revisita, DataService } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

interface DetalhesRevisitaPageProps {
  revisitaId: string;
  onVoltar: () => void;
  onEditar: (revisita: Revisita) => void;
  onIniciarEstudo: (revisita: Revisita) => void;
  onRegistrarVisita?: (revisitaId: string) => void;
}

export default function DetalhesRevisitaPage({ 
  revisitaId, 
  onVoltar, 
  onEditar,
  onIniciarEstudo,
  onRegistrarVisita
}: DetalhesRevisitaPageProps) {
  const [revisita, setRevisita] = useState<Revisita | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Carregar dados da revisita
  useEffect(() => {
    const carregarRevisita = () => {
      const revisitas = DataService.getRevisitas();
      const revisitaEncontrada = revisitas.find(r => r.id === revisitaId);
      if (revisitaEncontrada) {
        setRevisita(revisitaEncontrada);
      }
    };

    carregarRevisita();

    // Listen for data changes
    const handleDataChange = () => carregarRevisita();
    window.addEventListener('mynis-data-change', handleDataChange);

    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, [revisitaId]);

  if (!revisita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  const calcularTempoAtras = (data: string) => {
    if (!data) return 'Nunca visitado';
    
    const agora = new Date();
    const dataVisita = new Date(data);
    
    // Verificar se a data é válida
    if (isNaN(dataVisita.getTime())) return 'Data inválida';
    
    const diff = Math.floor((agora.getTime() - dataVisita.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Há 1 dia';
    if (diff < 0) return 'Data futura';
    return `Há ${diff} dias`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return '';
      case 'quente': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'comercio': return '';
      case 'descanso': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nova': return 'Nova';
      case 'quente': return 'Quente';
      case 'comercio': return 'Comércio';
      case 'descanso': return 'Descanso';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nova': return <Sparkles className="w-3 h-3" />;
      case 'quente': return <Flame className="w-3 h-3" />;
      case 'comercio': return <Store className="w-3 h-3" />;
      case 'descanso': return <Moon className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'casa': return <Home className="w-5 h-5" />;
      case 'predio': return <Building2 className="w-5 h-5" />;
      case 'comercio': return <Store className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const handleLigar = () => {
    if (revisita.telefone) {
      window.open(`tel:${revisita.telefone}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (revisita.telefone) {
      window.open(`https://wa.me/${revisita.telefone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleVerNoMapa = () => {
    const enderecoEncoded = encodeURIComponent(revisita.endereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoEncoded}`, '_blank');
  };

  const getOrigemLabel = (origem: string) => {
    switch (origem) {
      case 'casa-em-casa': return 'Casa em Casa';
      case 'testemunho-informal': return 'Testemunho Informal';
      case 'testemunho-publico': return 'Testemunho Público';
      case 'outro': return 'Outro';
      default: return origem;
    }
  };

  const handleExcluir = () => {
    DataService.removerRevisita(revisitaId);
    toast.success('Revisita removida', {
      description: `${revisita?.nome} foi removida da lista`,
    });
    onVoltar();
  };

  return (
    <div className="min-h-screen pb-20 bg-neutral">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-primary-500 text-white">
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
            <h2 className="text-xl">{revisita.nome}</h2>
            <p className="text-sm opacity-90">{revisita.quantidadeVisitas} {revisita.quantidadeVisitas === 1 ? 'visita' : 'visitas'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditar(revisita)}
            className="p-2 text-white hover:bg-white/20"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-4">
        {/* Status e Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {revisita.status === 'nova' ? (
            <Badge variant="nova" className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {getStatusLabel(revisita.status)}
            </Badge>
          ) : revisita.status === 'comercio' ? (
            <Badge variant="comercio" className="flex items-center gap-1.5">
              <Store className="w-3 h-3" />
              {getStatusLabel(revisita.status)}
            </Badge>
          ) : (
            <Badge className={`border flex items-center gap-1.5 ${getStatusColor(revisita.status)}`}>
              {getStatusIcon(revisita.status)}
              {getStatusLabel(revisita.status)}
            </Badge>
          )}
          {revisita.interesseEstudo && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1.5">
              <Star className="w-3 h-3" />
              Interesse em Estudar
            </Badge>
          )}
        </div>

        {/* Card: Informações de Contato */}
        <Card className="p-6 bg-primary-50 border-2 border-primary-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-4">Informações de Contato</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Nome completo</p>
              <p className="text-sm">{revisita.nome}</p>
            </div>
            
            {revisita.telefone && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Telefone</p>
                <p className="text-sm mb-3">{revisita.telefone}</p>
                
                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleLigar}
                    className="h-14 w-full bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Ligar
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    className="h-14 w-full bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-600 mb-1">Endereço completo</p>
              <p className="text-sm mb-2">{revisita.endereco}</p>
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

            {revisita.disponibilidade && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Disponibilidade</p>
                <p className="text-sm">{revisita.disponibilidade}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Card de Ação: Converter em Estudo Bíblico */}
        {revisita.interesseEstudo && (
          <Card 
            className="p-6 border-2 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, #4A2C60 0%, #5E3877 100%)',
              borderColor: '#4A2C60'
            }}
            onClick={() => onIniciarEstudo(revisita)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C8E046' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#4A2C60' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">Converter em Estudo Bíblico</h3>
                <p className="text-sm text-white/80">
                  Esta pessoa demonstrou interesse em estudar a Bíblia. Clique para iniciar o acompanhamento.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Card: Última Visita */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Última Visita
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Data</p>
              <p className="text-sm">
                {revisita.ultimaVisita 
                  ? new Date(revisita.ultimaVisita).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Nunca visitado'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {calcularTempoAtras(revisita.ultimaVisita || '')}
              </p>
            </div>
            {revisita.proximaVisita && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Próxima Visita Agendada</p>
                <p className="text-sm">
                  {new Date(revisita.proximaVisita).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                  <Calendar className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-700">Lembrete registrado</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Card: Primeira Conversa */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            Primeira Conversa
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {revisita.primeiraConversa}
          </p>
        </Card>

        {/* Card: Detalhes Adicionais */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2" style={{ color: '#4A2C60' }}>
            <FileText className="w-5 h-5" />
            Detalhes Adicionais
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Origem do contato</p>
              <p className="text-sm capitalize">{getOrigemLabel(revisita.origem)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-600 mb-1">Data de adição</p>
              <p className="text-sm">
                {revisita.dataAdicao ? new Date(revisita.dataAdicao).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Não informada'}
              </p>
            </div>

            {revisita.publicacoesEntregues && revisita.publicacoesEntregues.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-2">Publicações entregues</p>
                <div className="flex flex-wrap gap-2">
                  {revisita.publicacoesEntregues.map((pub, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" />
                      {pub}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Card: Observações */}
        {revisita.observacoes && (
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2" style={{ color: '#4A2C60' }}>
              <FileText className="w-5 h-5" />
              Observações
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {revisita.observacoes}
            </p>
          </Card>
        )}

        {/* Card: Publicações Deixadas */}
        {revisita.publicacoesDeixadas && revisita.publicacoesDeixadas.length > 0 && (
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2" style={{ color: '#4A2C60' }}>
              <BookOpen className="w-5 h-5" />
              Publicações Deixadas
            </h3>
            <div className="space-y-2">
              {revisita.publicacoesDeixadas.map((pub, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4A2C60' }} />
                  <span>{pub}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Card: Estatísticas */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2" style={{ color: '#4A2C60' }}>
            <BarChart3 className="w-5 h-5" />
            Resumo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F5F2F7' }}>
              <p className="text-3xl" style={{ color: '#4A2C60' }}>{revisita.quantidadeVisitas}</p>
              <p className="text-xs text-gray-600 mt-1">Total de visitas</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F5F2F7' }}>
              <p className="text-3xl" style={{ color: '#4A2C60' }}>
                {(() => {
                  if (!revisita.ultimaVisita) return '-';
                  const dataVisita = new Date(revisita.ultimaVisita);
                  if (isNaN(dataVisita.getTime())) return '-';
                  const dias = Math.floor((new Date().getTime() - dataVisita.getTime()) / (1000 * 60 * 60 * 24));
                  return dias >= 0 ? dias : 0;
                })()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Dias desde última</p>
            </div>
          </div>
        </Card>

        {/* Card: Histórico de Visitas */}
        {revisita.historicoVisitas && revisita.historicoVisitas.length > 0 && (
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2" style={{ color: '#4A2C60' }}>
              <Calendar className="w-5 h-5" />
              Histórico de Visitas ({revisita.historicoVisitas.length})
            </h3>
            
            <div className="space-y-3">
              {[...revisita.historicoVisitas].reverse().map((visita, index) => (
                <div 
                  key={visita.id} 
                  className="border-l-4 pl-4 py-2"
                  style={{ borderColor: visita.encontrou ? '#C8E046' : '#E5E7EB' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {visita.encontrou ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm">{new Date(visita.data).toLocaleDateString('pt-BR')}</p>
                        <p className="text-xs text-gray-500">
                          {visita.encontrou ? 'Encontrou' : 'Não encontrou'}
                        </p>
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)', color: '#4A2C60' }}
                      >
                        Mais recente
                      </Badge>
                    )}
                  </div>

                  {visita.observacoes && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2">
                      {visita.observacoes}
                    </p>
                  )}

                  {visita.publicacoesDeixadas && visita.publicacoesDeixadas.length > 0 && (
                    <div className="flex items-start gap-2 mt-2">
                      <BookMarked className="w-4 h-4 mt-0.5" style={{ color: '#4A2C60' }} />
                      <div>
                        <p className="text-xs text-gray-600">Publicações deixadas:</p>
                        <p className="text-sm">{visita.publicacoesDeixadas.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {visita.proximaVisita && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Agendou para: {new Date(visita.proximaVisita).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Botão de Registrar Visita */}
        {onRegistrarVisita && (
          <Button
            onClick={() => onRegistrarVisita(revisitaId)}
            className="w-full text-white h-14"
            style={{ backgroundColor: '#4A2C60' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Nova Visita
          </Button>
        )}

        {/* Card: Zona de Perigo */}
        <Card className="p-5 border-red-200 bg-red-50">
          <h3 className="mb-4 text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </h3>
          <p className="text-sm text-red-700 mb-4">
            Ao excluir esta revisita, todos os dados serão removidos permanentemente. Esta ação não pode ser desfeita.
          </p>
          <Button 
            variant="outline" 
            className="w-full text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover Revisita
          </Button>
        </Card>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full animate-scale-in">
            <h3 className="mb-2">Confirmar Remoção</h3>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja remover a revisita com <strong>{revisita.nome}</strong>? 
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