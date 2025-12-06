import { ArrowLeft, Edit, Phone, MessageSquare, MapPin, Calendar, Clock, BookOpen, TrendingUp, Bell, Trash2, User, Zap, AlertTriangle, Flame, Sprout, HelpCircle, Target, BarChart3, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '@/services/themeService';
import { useTranslations } from '@/utils/i18n/translations';

interface DetalhesEstudoPageProps {
  estudoId: string;
  onVoltar: () => void;
  onEditar: (estudo: Estudo) => void;
}

export default function DetalhesEstudoPage({ estudoId, onVoltar, onEditar }: DetalhesEstudoPageProps) {
  const [estudo, setEstudo] = useState<Estudo | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  
  // Hook de traduções - DEVE ser chamado no topo do componente
  const t = useTranslations();

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

  useEffect(() => {
    carregarEstudo();
  }, [estudoId]);

  const carregarEstudo = () => {
    const estudoEncontrado = DataService.getEstudos().find(e => e.id === estudoId);
    setEstudo(estudoEncontrado || null);
  };

  if (!estudo) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: temaAtual === 'escuro' ? '#1A1A1A' : '#FDF8EE' }}
      >
        <Card 
          className="p-8 text-center"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <p 
            className="text-sm"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            {t.studyDetails.studyNotFound}
          </p>
          <Button onClick={onVoltar} variant="outline" className="mt-4">{t.studyDetails.back}</Button>
        </Card>
      </div>
    );
  }

  const handleExcluir = () => {
    DataService.removerEstudo(estudoId);
    toast.success(t.studyDetails.studyRemoved, {
      icon: <Trash2 className="w-5 h-5" />
    });
    onVoltar();
  };

  const handleLigar = () => {
    if (estudo.estudanteTelefone) {
      window.location.href = `tel:${estudo.estudanteTelefone.replace(/\D/g, '')}`;
    } else {
      toast.error(t.studyDetails.phoneNotRegistered, {
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }
  };

  const handleWhatsApp = () => {
    if (estudo.estudanteTelefone) {
      const numero = estudo.estudanteTelefone.replace(/\D/g, '');
      window.open(`https://wa.me/55${numero}`, '_blank');
    } else {
      toast.error(t.studyDetails.phoneNotRegistered, {
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }
  };

  const handleVerNoMapa = () => {
    if (estudo.estudanteEndereco) {
      const enderecoEncoded = encodeURIComponent(estudo.estudanteEndereco);
      window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoEncoded}`, '_blank');
    } else {
      toast.error(t.studyDetails.addressNotRegistered, {
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }
  };

  const getProgressoBadge = (status: string) => {
    switch (status) {
      case 'iniciando':
        return (
          <Badge 
            className="border flex items-center gap-1"
            style={temaAtual === 'escuro' ? {
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#93C5FD',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            } : {
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              borderColor: '#DBEAFE'
            }}
          >
            <Sprout className="w-3 h-3" /> Iniciando
          </Badge>
        );
      case 'progredindo':
        return (
          <Badge 
            className="border flex items-center gap-1"
            style={temaAtual === 'escuro' ? {
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#86EFAC',
              borderColor: 'rgba(34, 197, 94, 0.3)'
            } : {
              backgroundColor: '#F0FDF4',
              color: '#16A34A',
              borderColor: '#DCFCE7'
            }}
          >
            <BookOpen className="w-3 h-3" /> Progredindo
          </Badge>
        );
      case 'duvidas':
        return (
          <Badge 
            className="border flex items-center gap-1"
            style={temaAtual === 'escuro' ? {
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              color: '#FDE047',
              borderColor: 'rgba(234, 179, 8, 0.3)'
            } : {
              backgroundColor: '#FEFCE8',
              color: '#CA8A04',
              borderColor: '#FEF9C3'
            }}
          >
            <HelpCircle className="w-3 h-3" /> Com dúvidas
          </Badge>
        );
      case 'avancado':
        return (
          <Badge 
            className="border flex items-center gap-1"
            style={temaAtual === 'escuro' ? { 
              backgroundColor: 'rgba(167, 139, 202, 0.15)',
              color: '#A78BCA',
              borderColor: 'rgba(167, 139, 202, 0.3)'
            } : {
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
    <div 
      className="min-h-screen pb-24"
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1A1A1A' : '#FDF8EE' }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
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
            <h2>{estudo.estudanteNome}</h2>
            <p className="text-sm opacity-90">{t.studyDetails.title}</p>
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
        <Card 
          className="p-6 border-2"
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(167, 139, 202, 0.3)'
          } : {
            backgroundColor: '#F5F2F7',
            borderColor: '#D8CEE8'
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 
                className="mb-4"
                style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
              >
                {t.studyDetails.contactInfo}
              </h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.studyDetails.fullName}
              </p>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {estudo.estudanteNome}
              </p>
            </div>

            {estudo.estudanteTelefone && (
              <div>
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.studyDetails.phone}
                </p>
                <p 
                  className="text-sm mb-3"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
                >
                  {estudo.estudanteTelefone}
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
                    {t.studyDetails.call}
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
                    {t.studyDetails.whatsapp}
                  </button>
                </div>
              </div>
            )}

            {estudo.estudanteEndereco && (
              <div>
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.studyDetails.fullAddress}
                </p>
                <p 
                  className="text-sm mb-2"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
                >
                  {estudo.estudanteEndereco}
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs"
                  style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
                  onClick={handleVerNoMapa}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {t.studyDetails.viewOnMap}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Card: Detalhes do Estudo */}
        <Card 
          className="p-5"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            <BookOpen className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            {t.studyDetails.studyDetails}
          </h3>
          
          <div className="space-y-4">
            <div>
              <p 
                className="text-xs mb-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.studyDetails.publication}
              </p>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {estudo.publicacao}
              </p>
            </div>

            <div>
              <p 
                className="text-xs mb-2"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.studyDetails.progress}
              </p>
              {getProgressoBadge(estudo.status)}
            </div>

            <div 
              className="p-3 rounded-lg border"
              style={isHoje() 
                ? (temaAtual === 'escuro' 
                  ? { backgroundColor: 'rgba(249, 115, 22, 0.15)', borderColor: 'rgba(249, 115, 22, 0.3)' }
                  : { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' })
                : (temaAtual === 'escuro'
                  ? { backgroundColor: 'rgba(167, 139, 202, 0.1)', borderColor: 'rgba(167, 139, 202, 0.2)' }
                  : { backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.15)' })
              }
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar 
                  className="w-4 h-4" 
                  style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                />
                <p 
                  className="text-xs"
                  style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                >
                  {t.studyDetails.nextStudy}
                </p>
              </div>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {isHoje() ? (
                  <span className="flex items-center gap-1" style={{ color: temaAtual === 'escuro' ? '#FB923C' : '#C2410C' }}>
                    <Flame className="w-4 h-4" /> {t.studyDetails.today}
                  </span>
                ) : (
                  formatarData(estudo.data)
                )} às {estudo.horario}
              </p>
            </div>

            {estudo.observacoes && (
              <div>
                <p 
                  className="text-xs mb-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.studyDetails.observations}
                </p>
                <p 
                  className="text-sm p-3 rounded-lg"
                  style={temaAtual === 'escuro' ? {
                    color: '#D1D5DB',
                    backgroundColor: '#1F1F1F'
                  } : {
                    color: '#374151',
                    backgroundColor: '#F9FAFB'
                  }}
                >
                  {estudo.observacoes}
                </p>
              </div>
            )}
          </div>
        </Card>

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
            {t.studyDetails.dangerZone}
          </h3>
          <p 
            className="text-sm mb-4"
            style={{ color: temaAtual === 'escuro' ? '#FCA5A5' : '#B91C1C' }}
          >
            {t.studyDetails.dangerZoneWarning}
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
            {t.studyDetails.removeStudy}
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
              {t.studyDetails.confirmRemoval}
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#6B7280' }}
            >
              {t.studyDetails.confirmRemovalMessage(estudo.estudanteNome)}
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
                {t.studyDetails.cancel}
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
                {t.studyDetails.remove}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}