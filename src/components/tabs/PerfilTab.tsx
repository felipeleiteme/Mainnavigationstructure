import { 
  BookOpen, 
  Sprout, 
  Home, 
  User, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Target, 
  Clock, 
  FileText, 
  Edit, 
  Settings, 
  AlertCircle, 
  LogOut,
  FileHeart,
  ChevronRight,
  Palette,
  Bell,
  Cloud,
  Database,
  Download,
  Trash2,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useState, useEffect, useRef, useMemo } from 'react';
import NotificationDemo from '../notifications/NotificationDemo';
import NotificationSettings from '../shared/NotificationSettings';
import EditarTipoPublicadorModal from '../perfil/EditarTipoPublicadorModal';
import EditarTextoAnoPage from '../pages/EditarTextoAnoPage';
import EditarInformacoesPage from '../pages/EditarInformacoesPage';
import EditarEmergenciaPage from '../pages/EditarEmergenciaPage';
import EditarFotoPerfilPage from '../pages/EditarFotoPerfilPage';
import EditarTipoPublicadorPage from '../pages/EditarTipoPublicadorPage';
import RelatorioCompletoPage from '../pages/RelatorioCompletoPage';
import EnviarRelatorioPage from '../pages/EnviarRelatorioPage';
import ConfiguracoesPage from '../pages/ConfiguracoesPage';
import { toast } from 'sonner@2.0.3';
import { DataService } from '../../services/dataService';
import BackupCard from '../backup/BackupCard';
import { ThemeService } from '@/services/themeService';
import { LanguageService, LanguageCode } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';

interface PerfilTabProps {
  scrollTo?: string;
  acao?: string;
}

export default function PerfilTab({ scrollTo, acao }: PerfilTabProps) {
  const [showEnviarRelatorio, setShowEnviarRelatorio] = useState(false);
  const [showNotificationDemo, setShowNotificationDemo] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showConfiguracoes, setShowConfiguracoes] = useState(false);
  const cronogramaRef = useRef<HTMLDivElement>(null);
  const relatorioRef = useRef<HTMLDivElement>(null);
  const [showEditarPerfil, setShowEditarPerfil] = useState(false);
  const [showEditarInfo, setShowEditarInfo] = useState(false);
  const [showRelatorioCompleto, setShowRelatorioCompleto] = useState(false);
  const [showEditarEmergencia, setShowEditarEmergencia] = useState(false);
  const [showEditarTextoAno, setShowEditarTextoAno] = useState(false);
  const [showEditarFoto, setShowEditarFoto] = useState(false);
  const [showEditarTipoPublicador, setShowEditarTipoPublicador] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar re-render quando perfil mudar
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [languageCode, setLanguageCode] = useState(LanguageService.getLanguage());
  const t = useTranslations(languageCode);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageCode(LanguageService.getLanguage());
    };

    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, []);

  // Buscar perfil do DataService
  const perfil = DataService.getPerfil();
  const metaMensal = DataService.getMetaMensal();

  // Calcular estatísticas reais do DataService (igual ao InicioTab)
  const relatorioAtual = {
    horasCampo: DataService.getTotalHorasCampo(),
    horasCredito: DataService.getTotalHorasCredito(),
    estudos: DataService.getTotalEstudosMes(),
    revisitas: DataService.getTotalRevisitasNovasMes(),
    publicacoes: DataService.getTotalPublicacoesMes(),
    videos: DataService.getTotalVideosMes(),
  };
  
  // Função para formatar horas no formato "Xh Ymin" ou "XhYmin"
  const formatarHoras = (horas: number): string => {
    const h = Math.floor(horas);
    const min = Math.round((horas - h) * 60);
    if (min === 0) return `${h}h`;
    if (h === 0) return `${min}min`;
    return `${h}h${min}`;
  };

  // Forçar atualização quando perfil mudar
  const handlePerfilAtualizado = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Ações automáticas baseadas em props
  useEffect(() => {
    if (acao === 'enviar-relatorio') {
      setShowEnviarRelatorio(true);
    }
  }, [acao]);

  // Scroll automático para seção
  useEffect(() => {
    if (scrollTo === 'cronograma' && cronogramaRef.current) {
      setTimeout(() => {
        cronogramaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cronogramaRef.current?.classList.add('ring-2', 'ring-blue-500', 'animate-pulse');
        setTimeout(() => {
          cronogramaRef.current?.classList.remove('ring-2', 'ring-blue-500', 'animate-pulse');
        }, 3000);
      }, 300);
    }
    
    if (scrollTo === 'scroll-relatorio' && relatorioRef.current) {
      setTimeout(() => {
        relatorioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        relatorioRef.current?.classList.add('ring-2', 'ring-purple-500', 'animate-pulse');
        setTimeout(() => {
          relatorioRef.current?.classList.remove('ring-2', 'ring-purple-500', 'animate-pulse');
        }, 3000);
      }, 300);
    }
  }, [scrollTo]);

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
            {perfil.avatar ? (
              <img 
                src={perfil.avatar} 
                alt={perfil.nome} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl">{perfil.nome}</h1>
              <p className="text-sm opacity-90 mt-0.5">{t.profile.memberOf} {perfil.congregacao}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Informações de Contato */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              <User 
                className="w-5 h-5" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                }} 
              />
              {t.profile.contactInfo}
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setShowEditarInfo(true)}>
              <Edit 
                className="w-4 h-4" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                }} 
              />
            </Button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.congregation}
              </span>
              <span
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                {perfil.congregacao}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.email}
              </span>
              <span 
                className="text-xs"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                {perfil.email || 'felipe.silva@email.com'}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.phone}
              </span>
              <span
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                {perfil.telefone || '(11) 98765-4321'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tipo de Publicador */}
        <Card 
          className="p-6 cursor-pointer transition-all active:scale-[0.98]"
          style={{ 
            transition: 'all 0.2s ease',
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            if (temaAtual === 'escuro') {
              e.currentTarget.style.backgroundColor = 'rgba(200, 224, 70, 0.1)';
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(74, 44, 96, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (temaAtual === 'escuro') {
              e.currentTarget.style.backgroundColor = '#2A2A2A';
            } else {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
          onClick={() => setShowEditarTipoPublicador(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center" 
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : 'rgba(74, 44, 96, 0.1)'
                }}
              >
                <TrendingUp 
                  className="w-6 h-6" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                  }} 
                />
              </div>
              <div className="flex-1">
                <h3 
                  className="mb-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {t.profile.publisherType}
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {DataService.getTipoPublicadorLabel(perfil.tipoPublicador)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    className="text-xs" 
                    style={{ 
                      backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(200, 224, 70, 0.2)', 
                      color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60',
                      border: `1px solid ${temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.5)' : 'rgba(200, 224, 70, 0.4)'}`
                    }}
                  >
                    {t.profile.goal}: {metaMensal}h/mês
                  </Badge>
                </div>
              </div>
            </div>
            <ChevronRight 
              className="w-5 h-5 flex-shrink-0" 
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#9CA3AF'
              }}
            />
          </div>
        </Card>

        {/* Relatório do Mês (com ref) */}
        {/* ... remove this code ... */}

        {/* Informações de Emergência */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              <AlertCircle 
                className="w-5 h-5" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#F87171' : '#DC2626'
                }} 
              />
              {t.profile.emergencyInfo}
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setShowEditarEmergencia(true)}>
              <Edit 
                className="w-4 h-4" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                }} 
              />
            </Button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.dpaValidity}
              </span>
              <span
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                15/12/2025
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.emergencyContact}
              </span>
              <span
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                Ana Silva
              </span>
            </div>
          </div>
        </Card>

        {/* Configurações */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
          onClick={() => setShowConfiguracoes(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center" 
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                }}
              >
                <Settings 
                  className="w-6 h-6" 
                  style={{
                    color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                  }}
                />
              </div>
              <div>
                <h3 
                  className="font-normal text-[16px] mb-0.5"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {t.profile.settings}
                </h3>
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.profile.settingsSubtitle}
                </p>
              </div>
            </div>
            <ChevronRight 
              className="w-5 h-5" 
              style={{ 
                color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
              }} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div 
              className="p-3 rounded-lg border-2 transition-all" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#D8CEE8'
              }}
            >
              <Palette 
                className="w-5 h-5 mb-2" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                }} 
              />
              <p 
                className="text-xs font-medium"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#374151'
                }}
              >
                {t.profile.appearance}
              </p>
              <p 
                className="text-[10px] mt-0.5"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.appearanceDesc}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg border-2 transition-all" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#D8CEE8'
              }}
            >
              <Bell 
                className="w-5 h-5 mb-2" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                }} 
              />
              <p 
                className="text-xs font-medium"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#374151'
                }}
              >
                {t.profile.notifications}
              </p>
              <p 
                className="text-[10px] mt-0.5"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.profile.notificationsDesc}
              </p>
            </div>
          </div>
        </Card>

        {/* Texto do Ano */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              <FileText 
                className="w-5 h-5" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                }} 
              />
              {t.profile.yearText}
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setShowEditarTextoAno(true)}>
              <Edit 
                className="w-4 h-4" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                }} 
              />
            </Button>
          </div>
          
          <div 
            className="rounded-lg p-4 border" 
            style={{ 
              background: temaAtual === 'escuro' 
                ? 'linear-gradient(to bottom right, rgba(200, 224, 70, 0.1), rgba(200, 224, 70, 0.05))'
                : 'linear-gradient(to bottom right, rgba(200, 224, 70, 0.15), rgba(200, 224, 70, 0.05))',
              borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : 'rgba(200, 224, 70, 0.3)'
            }}
          >
            <p 
              className="text-xs mb-2"
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
              }}
            >
              {t.profile.currentText}
            </p>
            <p 
              className="text-sm italic mb-1"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              "{perfil.textoAno?.texto || 'Dêem a Jeová a glória que o seu nome merece.'}"
            </p>
            <p 
              className="text-xs"
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
              }}
            >
              — {perfil.textoAno?.referencia || 'Sal. 96:8'}
            </p>
          </div>
          
          <p 
            className="text-xs mt-3"
            style={{
              color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
            }}
          >
            {t.profile.yearTextNote}
          </p>
        </Card>

        {/* Backup e Sincronização */}
        <Card className="p-6">
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{
              color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
            }}
          >
            <Cloud 
              className="w-5 h-5" 
              style={{ 
                color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
              }} 
            />
            Backup e Sincronização
          </h3>
          
          <BackupCard onSyncComplete={handlePerfilAtualizado} />
        </Card>

        {/* Ferramentas de Desenvolvimento - NOVO */}
        <Card 
          className="p-6 border-2" 
          style={{ 
            borderColor: 'rgba(255, 140, 0, 0.3)', 
            backgroundColor: temaAtual === 'escuro' ? 'rgba(255, 140, 0, 0.08)' : 'rgba(255, 140, 0, 0.05)'
          }}
        >
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{
              color: temaAtual === 'escuro' ? '#FFA726' : '#FF8C00'
            }}
          >
            <Database 
              className="w-5 h-5" 
              style={{ 
                color: temaAtual === 'escuro' ? '#FFA726' : '#FF8C00'
              }} 
            />
            Ferramentas de Desenvolvimento
          </h3>
          
          <p 
            className="text-sm mb-4"
            style={{
              color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
            }}
          >
            Ferramentas para testar e validar todas as funcionalidades do aplicativo
          </p>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              style={{
                borderColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.5)' : '#D8CEE8',
                color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
              }}
              onClick={() => {
                try {
                  console.log('🚀 Iniciando população de dados...');
                  import('../../utils/popularDados').then(({ popularDadosCompletos }) => {
                    try {
                      const resultado = popularDadosCompletos();
                      console.log('✅ Resultado:', resultado);
                      
                      // Forçar atualização global disparando evento
                      window.dispatchEvent(new Event('mynis-data-change'));
                      
                      toast.success('✅ Dados Populados com Sucesso!', {
                        description: 'Todos os cenários foram criados. Verifique as abas.',
                      });
                      
                      // Forçar re-render local
                      handlePerfilAtualizado();
                      
                      // Força um refresh completo após 100ms para garantir
                      setTimeout(() => {
                        window.dispatchEvent(new Event('mynis-data-change'));
                      }, 100);
                    } catch (error) {
                      console.error('❌ Erro ao popular dados:', error);
                      toast.error('Erro ao popular dados', {
                        description: error instanceof Error ? error.message : 'Erro desconhecido'
                      });
                    }
                  }).catch(err => {
                    console.error('❌ Erro ao importar módulo:', err);
                    toast.error('Erro ao carregar módulo', {
                      description: 'Não foi possível carregar o script de população'
                    });
                  });
                } catch (error) {
                  console.error('❌ Erro geral:', error);
                  toast.error('Erro inesperado', {
                    description: 'Ocorreu um erro ao tentar popular os dados'
                  });
                }
              }}
            >
              <Database className="w-4 h-4 mr-2" />
              Popular Dados de Teste
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                import('../../utils/popularDados').then(({ exportarDados }) => {
                  exportarDados();
                });
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Backup JSON
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => {
                import('../../utils/popularDados').then(({ limparTodosDados }) => {
                  limparTodosDados();
                });
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Todos os Dados
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              style={{
                borderColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.5)' : '#D8CEE8',
                color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
              }}
              onClick={() => {
                if (confirm('Tem certeza que deseja refazer o onboarding? Você voltará para as telas de boas-vindas.')) {
                  localStorage.removeItem('onboardingComplete');
                  localStorage.removeItem('userData');
                  toast.success('Redirecionando para o onboarding...');
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }
              }}
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Refazer Onboarding
            </Button>
          </div>

          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Atenção:</strong> "Popular Dados" cria revisitas, estudos, sessões de campo e mais para validar todas as funcionalidades. "Limpar Dados" apaga TUDO permanentemente.
              </span>
            </p>
          </div>
        </Card>

        {/* Sobre o App */}
        <Card className="p-6">
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{
              color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
            }}
          >
            <Info 
              className="w-5 h-5" 
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
              }}
            />
            Sobre o App
          </h3>
          
          <div 
            className="space-y-3 text-sm"
            style={{
              color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
            }}
          >
            <p>Versão: 1.0.0</p>
            <p className="text-xs">
              Mynis é uma ferramenta pessoal, não oficial da organização.
              Não é adequado para coleta de dados sensíveis ou PII.
            </p>
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  toast.info('Termos de Uso', {
                    description: 'Mynis é uma ferramenta pessoal para fins educacionais. Use com responsabilidade.',
                  });
                }}
              >
                Termos de Uso
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  toast.info('Política de Privacidade', {
                    description: 'Seus dados são armazenados localmente no seu dispositivo.',
                  });
                }}
              >
                Privacidade
              </Button>
            </div>
          </div>
        </Card>

        {/* Demo de Notificações (apenas para teste) */}
        {showNotificationDemo && <NotificationDemo />}
        
        {!showNotificationDemo && (
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => setShowNotificationDemo(true)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Testar Notificações
          </Button>
        )}

        {/* Botão Sair */}
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>

        <div className="h-8"></div>
      </div>

      {/* Modal Enviar Relatório */}
      {showEnviarRelatorio && (
        <EnviarRelatorioPage
          onVoltar={() => setShowEnviarRelatorio(false)}
          relatorio={relatorioAtual}
          temaMes={temaAtual}
        />
      )}

      {/* Modal: Relatório Completo */}
      {showRelatorioCompleto && (
        <RelatorioCompletoPage
          onVoltar={() => setShowRelatorioCompleto(false)}
        />
      )}

      {/* Modal: Editar Emergência */}
      {showEditarEmergencia && (
        <EditarEmergenciaPage
          onVoltar={() => {
            setShowEditarEmergencia(false);
            handlePerfilAtualizado();
          }}
        />
      )}

      {/* Modal: Editar Perfil (Header) */}
      {showEditarPerfil && (
        <EditarTipoPublicadorModal
          onClose={() => setShowEditarPerfil(false)}
          onSave={handlePerfilAtualizado}
        />
      )}

      {/* Modal: Editar Informações Básicas */}
      {showEditarInfo && (
        <EditarInformacoesPage
          onVoltar={() => {
            setShowEditarInfo(false);
            handlePerfilAtualizado();
          }}
        />
      )}

      {/* Modal: Editar Texto do Ano */}
      {showEditarTextoAno && (
        <EditarTextoAnoPage
          onVoltar={() => {
            setShowEditarTextoAno(false);
            handlePerfilAtualizado();
          }}
        />
      )}

      {/* Modal: Editar Foto de Perfil */}
      {showEditarFoto && (
        <EditarFotoPerfilPage
          onVoltar={() => {
            setShowEditarFoto(false);
            handlePerfilAtualizado();
          }}
        />
      )}

      {/* Modal: Editar Tipo de Publicador */}
      {showEditarTipoPublicador && (
        <EditarTipoPublicadorPage
          onVoltar={() => {
            setShowEditarTipoPublicador(false);
            handlePerfilAtualizado();
          }}
        />
      )}

      {/* Modal: Configurações Completas */}
      {showConfiguracoes && (
        <ConfiguracoesPage
          onVoltar={() => setShowConfiguracoes(false)}
        />
      )}
    </div>
  );
}