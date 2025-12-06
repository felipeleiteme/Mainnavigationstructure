import { ArrowLeft, Phone, MapPin, Calendar, MessageSquare, Edit, BookOpen, Clock, User, Home, Building2, Store, FileText, BarChart3, Star, Sparkles, Flame, Moon, Trash2, AlertTriangle, CheckCircle2, XCircle, Plus, BookMarked, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Revisita, DataService } from '../../services/dataService';
import { ThemeService } from '../../services/themeService';
import { LanguageService } from '@/services/languageService';
import { useTranslations } from '@/utils/i18n/translations';
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
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [idiomaAtual, setIdiomaAtual] = useState(LanguageService.getLanguage());
  const t = useTranslations(idiomaAtual);

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleIdiomaChange = () => {
      setIdiomaAtual(LanguageService.getLanguage());
    };
    LanguageService.on('mynis-language-change', handleIdiomaChange);
    return () => LanguageService.off('mynis-language-change', handleIdiomaChange);
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
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <p className="text-gray-600">{t.messages.loading}</p>
      </div>
    );
  }

  const calcularTempoAtras = (data: string) => {
    if (!data) return t.returnVisitDetails.firstConversation;
    
    const agora = new Date();
    const dataVisita = new Date(data);
    
    // Verificar se a data é válida
    if (isNaN(dataVisita.getTime())) return 'Data inválida';
    
    const diff = Math.floor((agora.getTime() - dataVisita.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return t.fieldTab.today;
    if (diff === 1) return t.fieldTab.daysAgo(1);
    if (diff < 0) return 'Data futura';
    return t.returnVisitDetails.daysAgo(diff);
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
      case 'nova': return t.returnVisitDetails.statusNew;
      case 'quente': return t.returnVisitDetails.statusHot;
      case 'comercio': return t.returnVisitDetails.statusBusiness;
      case 'descanso': return t.returnVisitDetails.statusRest;
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
      case 'casa-em-casa': return t.returnVisitDetails.originHouseToHouse;
      case 'testemunho-informal': return t.returnVisitDetails.originInformalWitnessing;
      case 'testemunho-publico': return t.returnVisitDetails.originPublicWitnessing;
      case 'comercio': return t.returnVisitDetails.originBusiness;
      case 'outro': return t.returnVisitDetails.originOther;
      default: return origem;
    }
  };

  const handleExcluir = () => {
    DataService.removerRevisita(revisitaId);
    toast.success('Você removeu a revisita', {
      icon: <Trash2 className="w-5 h-5" />
    });
    onVoltar();
  };

  return (
    <div className="min-h-screen pb-20 bg-neutral">
      {/* Header Fixo - Padrão Brandbook */}
      <div 
        className="sticky top-0 z-50 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
      >
        <div className="flex items-center gap-4 px-6 pt-12 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl truncate">{revisita.nome}</h2>
            <p className="text-sm opacity-90">
              {t.returnVisitDetails.visits(revisita.quantidadeVisitas)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditar(revisita)}
            className="p-2 text-white hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <Edit className="w-6 h-6" />
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
              {t.returnVisitDetails.interestInStudyBadge}
            </Badge>
          )}
        </div>

        {/* Card: Informações de Contato */}
        <Card 
          className="p-6 border-2"
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(200, 224, 70, 0.3)'
          } : {
            backgroundColor: '#FFFFFF',
            borderColor: '#E5D7F5'
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 
                className="mb-4"
                style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
              >
                {t.returnVisitDetails.contactInfo}
              </h3>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.returnVisitDetails.fullName}
              </p>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {revisita.nome}
              </p>
            </div>
            
            {revisita.telefone && (
              <div>
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.returnVisitDetails.phone}
                </p>
                <p 
                  className="text-sm mb-3"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
                >
                  {revisita.telefone}
                </p>
                
                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleLigar}
                    className="h-14 w-full flex items-center justify-center gap-2 transition-all rounded-md cursor-pointer"
                    style={{
                      backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                      color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      if (temaAtual === 'escuro') {
                        e.currentTarget.style.backgroundColor = '#B5CC3D';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#5D3775';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (temaAtual === 'escuro') {
                        e.currentTarget.style.backgroundColor = '#C8E046';
                        e.currentTarget.style.transform = 'scale(1)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#4A2C60';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Phone className="w-5 h-5" />
                    {t.returnVisitDetails.call}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="h-14 w-full flex items-center justify-center gap-2 transition-all rounded-md cursor-pointer"
                    style={{
                      backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                      color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      if (temaAtual === 'escuro') {
                        e.currentTarget.style.backgroundColor = '#B5CC3D';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#5D3775';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (temaAtual === 'escuro') {
                        e.currentTarget.style.backgroundColor = '#C8E046';
                        e.currentTarget.style.transform = 'scale(1)';
                      } else {
                        e.currentTarget.style.backgroundColor = '#4A2C60';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <MessageSquare className="w-5 h-5" />
                    {t.returnVisitDetails.whatsapp}
                  </button>
                </div>
              </div>
            )}

            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.returnVisitDetails.fullAddress}
              </p>
              <p 
                className="text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {revisita.endereco}
              </p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                style={{ color: '#C8E046' }}
                onClick={handleVerNoMapa}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {t.returnVisitDetails.viewOnMap}
              </Button>
            </div>

            {revisita.disponibilidade && (
              <div>
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.returnVisitDetails.availability}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
                >
                  {revisita.disponibilidade}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Card de Ação: Converter em Estudo Bíblico */}
        {revisita.interesseEstudo && (
          <Card 
            className="p-6 border-2 cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
            style={{ 
              backgroundColor: '#4A2C60',
              borderColor: '#C8E046'
            }}
            onClick={() => onIniciarEstudo(revisita)}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C8E046' }}>
                <BookOpen className="w-7 h-7" style={{ color: '#4A2C60' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-base">{t.returnVisitDetails.convertToStudy}</h3>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Card: Última Visita */}
        <Card 
          className="p-5"
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(200, 224, 70, 0.3)'
          } : {}}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            <Clock className="w-5 h-5" />
            {t.returnVisitDetails.lastVisit}
          </h3>
          <div className="space-y-3">
            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.returnVisitDetails.date}
              </p>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {revisita.ultimaVisita 
                  ? new Date(revisita.ultimaVisita).toLocaleDateString(idiomaAtual, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Nunca visitado'
                }
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF' }}
              >
                {calcularTempoAtras(revisita.ultimaVisita || '')}
              </p>
            </div>
            {revisita.proximaVisita && (
              <div 
                className="pt-3 border-t"
                style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
              >
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.returnVisitDetails.nextVisitScheduled}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
                >
                  {new Date(revisita.proximaVisita).toLocaleDateString(idiomaAtual, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                  <Calendar className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-700">{t.returnVisitDetails.reminderSet}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Card: Primeira Conversa */}
        <Card 
          className="p-5"
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(200, 224, 70, 0.3)'
          } : {}}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            <MessageSquare className="w-5 h-5" />
            {t.returnVisitDetails.firstConversationTitle}
          </h3>
          <p 
            className="text-sm leading-relaxed"
            style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
          >
            {revisita.primeiraConversa}
          </p>
        </Card>

        {/* Card: Detalhes Adicionais */}
        <Card 
          className="p-5"
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(200, 224, 70, 0.3)'
          } : {}}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            <FileText className="w-5 h-5" />
            {t.returnVisitDetails.additionalDetails}
          </h3>
          <div className="space-y-4">
            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.returnVisitDetails.contactOrigin}
              </p>
              <p 
                className="text-sm capitalize"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {getOrigemLabel(revisita.origem)}
              </p>
            </div>
            
            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.returnVisitDetails.dateAdded}
              </p>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {revisita.dataAdicao ? new Date(revisita.dataAdicao).toLocaleDateString(idiomaAtual, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : t.returnVisitDetails.notInformed}
              </p>
            </div>

            {revisita.publicacoesEntregues && revisita.publicacoesEntregues.length > 0 && (
              <div>
                <p 
                  className="text-xs mb-2"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.returnVisitDetails.publicationsDelivered}
                </p>
                <div className="flex flex-wrap gap-2">
                  {revisita.publicacoesEntregues.map((pub, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="flex items-center gap-1.5 border"
                      style={temaAtual === 'escuro' ? {
                        backgroundColor: 'rgba(200, 224, 70, 0.15)',
                        color: '#C8E046',
                        borderColor: 'rgba(200, 224, 70, 0.3)'
                      } : {
                        backgroundColor: '#F0FDF4',
                        color: '#15803D',
                        borderColor: '#BBF7D0'
                      }}
                    >
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
          <Card 
            className="p-5"
            style={temaAtual === 'escuro' ? {
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(200, 224, 70, 0.3)'
            } : {}}
          >
            <h3 
              className="mb-4 flex items-center gap-2"
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
            >
              <FileText className="w-5 h-5" />
              {t.returnVisitDetails.observations}
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
            >
              {revisita.observacoes}
            </p>
          </Card>
        )}

        {/* Card: Publicações Deixadas */}
        {revisita.publicacoesDeixadas && revisita.publicacoesDeixadas.length > 0 && (
          <Card 
            className="p-5"
            style={temaAtual === 'escuro' ? {
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(200, 224, 70, 0.3)'
            } : {}}
          >
            <h3 
              className="mb-4 flex items-center gap-2"
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
            >
              <BookOpen className="w-5 h-5" />
              {t.returnVisitDetails.publicationsLeft}
            </h3>
            <div className="space-y-2">
              {revisita.publicacoesDeixadas.map((pub, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 text-sm"
                  style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
                  />
                  <span>{pub}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Card: Estatísticas */}
        <Card 
          className="p-5"
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(200, 224, 70, 0.3)'
          } : {}}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
          >
            <BarChart3 className="w-5 h-5" />
            {t.returnVisitDetails.summary}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="text-center p-4 rounded-lg"
              style={temaAtual === 'escuro' ? {
                backgroundColor: '#1F1F1F'
              } : {
                backgroundColor: '#FDF8EE'
              }}
            >
              <p 
                className="text-3xl font-semibold"
                style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
              >
                {revisita.quantidadeVisitas}
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#6B7280' }}
              >
                {t.returnVisitDetails.totalVisitsLabel}
              </p>
            </div>
            <div 
              className="text-center p-4 rounded-lg"
              style={temaAtual === 'escuro' ? {
                backgroundColor: '#1F1F1F'
              } : {
                backgroundColor: '#FDF8EE'
              }}
            >
              <p 
                className="text-3xl font-semibold"
                style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
              >
                {(() => {
                  if (!revisita.ultimaVisita) return '-';
                  const dataVisita = new Date(revisita.ultimaVisita);
                  if (isNaN(dataVisita.getTime())) return '-';
                  const dias = Math.floor((new Date().getTime() - dataVisita.getTime()) / (1000 * 60 * 60 * 24));
                  return dias >= 0 ? dias : 0;
                })()}
              </p>
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#6B7280' }}
              >
                {t.returnVisitDetails.daysSinceLastLabel}
              </p>
            </div>
          </div>
        </Card>

        {/* Card: Histórico de Visitas */}
        {revisita.historicoVisitas && revisita.historicoVisitas.length > 0 && (
          <Card 
            className="p-5"
            style={temaAtual === 'escuro' ? {
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(200, 224, 70, 0.3)'
            } : {}}
          >
            <h3 
              className="mb-4 flex items-center gap-2"
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
            >
              <Calendar className="w-5 h-5" />
              {t.returnVisitDetails.visitHistoryTitle(revisita.historicoVisitas.length)}
            </h3>
            
            <div className="space-y-3">
              {[...revisita.historicoVisitas].reverse().map((visita, index) => (
                <div 
                  key={visita.id} 
                  className="border-l-4 pl-4 py-2"
                  style={{
                    borderColor: visita.encontrou 
                      ? '#C8E046' 
                      : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB')
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {visita.encontrou ? (
                        <CheckCircle2 
                          className="w-5 h-5" 
                          style={{ color: '#C8E046' }}
                        />
                      ) : (
                        <XCircle 
                          className="w-5 h-5" 
                          style={{ color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF' }}
                        />
                      )}
                      <div>
                        <p 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
                        >
                          {new Date(visita.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p 
                          className="text-xs"
                          style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                        >
                          {visita.encontrou ? 'Encontrou' : 'Não encontrou'}
                        </p>
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs border"
                        style={temaAtual === 'escuro' ? {
                          backgroundColor: 'rgba(167, 139, 202, 0.15)',
                          color: '#A78BCA',
                          borderColor: 'rgba(167, 139, 202, 0.3)'
                        } : {
                          backgroundColor: '#F5F3FF',
                          color: '#4A2C60',
                          borderColor: '#E5D7F5'
                        }}
                      >
                        Mais recente
                      </Badge>
                    )}
                  </div>

                  {visita.observacoes && (
                    <p 
                      className="text-sm p-2 rounded mt-2"
                      style={temaAtual === 'escuro' ? {
                        color: '#D1D5DB',
                        backgroundColor: '#1F1F1F'
                      } : {
                        color: '#374151',
                        backgroundColor: '#F9FAFB'
                      }}
                    >
                      {visita.observacoes}
                    </p>
                  )}

                  {visita.publicacoesDeixadas && visita.publicacoesDeixadas.length > 0 && (
                    <div className="flex items-start gap-2 mt-2">
                      <BookMarked className="w-4 h-4 mt-0.5 text-primary-500" />
                      <div>
                        <p className="text-xs text-gray-600">Publicações deixadas:</p>
                        <p className="text-sm text-gray-900">{visita.publicacoesDeixadas.join(', ')}</p>
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
          <button
            onClick={() => onRegistrarVisita(revisitaId)}
            className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (temaAtual === 'escuro') {
                e.currentTarget.style.backgroundColor = '#B5CC3D';
              } else {
                e.currentTarget.style.backgroundColor = '#5A3C70';
              }
            }}
            onMouseLeave={(e) => {
              if (temaAtual === 'escuro') {
                e.currentTarget.style.backgroundColor = '#C8E046';
              } else {
                e.currentTarget.style.backgroundColor = '#4A2C60';
              }
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Nova Visita
          </button>
        )}

        {/* Card: Zona de Perigo */}
        <Card 
          className="p-5 border-2"
          style={temaAtual === 'escuro' ? {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
          } : {
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#FCA5A5' : '#991B1B' }}
          >
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </h3>
          <p 
            className="text-sm mb-4"
            style={{ color: temaAtual === 'escuro' ? '#FCA5A5' : '#B91C1C' }}
          >
            Ao excluir esta revisita, todos os dados serão removidos permanentemente. Esta ação não pode ser desfeita.
          </p>
          <Button 
            variant="outline" 
            className="w-full border-2"
            style={temaAtual === 'escuro' ? {
              color: '#FCA5A5',
              borderColor: 'rgba(239, 68, 68, 0.5)',
              backgroundColor: 'rgba(239, 68, 68, 0.05)'
            } : {
              color: '#B91C1C',
              borderColor: '#FCA5A5',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              if (temaAtual === 'escuro') {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.7)';
              } else {
                e.currentTarget.style.backgroundColor = '#FEE2E2';
                e.currentTarget.style.borderColor = '#F87171';
              }
            }}
            onMouseLeave={(e) => {
              if (temaAtual === 'escuro') {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              } else {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#FCA5A5';
              }
            }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover Revisita
          </Button>
        </Card>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <Card 
            className="p-6 max-w-sm w-full animate-scale-in"
            style={temaAtual === 'escuro' ? {
              backgroundColor: '#2A2A2A',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            } : {}}
          >
            <h3 
              className="mb-2"
              style={{ color: temaAtual === 'escuro' ? '#FCA5A5' : '#4A2C60' }}
            >
              Confirmar Remoção
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#6B7280' }}
            >
              Tem certeza que deseja remover a revisita com{' '}
              <strong style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}>
                {revisita.nome}
              </strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border-2"
                style={temaAtual === 'escuro' ? {
                  color: '#D1D5DB',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'transparent'
                } : {}}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleExcluir}
                className="flex-1 text-white border-0"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#DC2626' : '#DC2626'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B91C1C' : '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }}
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