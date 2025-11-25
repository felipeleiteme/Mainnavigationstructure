import { User, Users, Calendar, FileText, AlertCircle, Palette, Bell, Cloud, Info, LogOut, Edit, TrendingUp, X, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useState, useEffect, useRef } from 'react';
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
import { toast } from 'sonner@2.0.3';
import { DataService } from '../../services/dataService';
import BackupCard from '../backup/BackupCard';

interface PerfilTabProps {
  scrollTo?: string;
  acao?: string;
}

export default function PerfilTab({ scrollTo, acao }: PerfilTabProps) {
  const [showEnviarRelatorio, setShowEnviarRelatorio] = useState(false);
  const [showNotificationDemo, setShowNotificationDemo] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
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

  const temaMes = 'Brandura';

  return (
    <div className="min-h-full" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div style={{ backgroundColor: '#4A2C60' }} className="sticky top-0 z-50 text-white">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            {perfil.avatar ? (
              <img 
                src={perfil.avatar} 
                alt={perfil.nome}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <User className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl">{perfil.nome}</h2>
              <p className="text-xs opacity-90 mt-0.5">Membro da Congregação Central</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Informações de Contato */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <User className="w-5 h-5" style={{ color: '#4A2C60' }} />
              Informações de Contato
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setShowEditarInfo(true)}>
              <Edit className="w-4 h-4" style={{ color: '#4A2C60' }} />
            </Button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Congregação</span>
              <span>Congregação Central</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-xs">felipe.silva@email.com</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Telefone</span>
              <span>(11) 98765-4321</span>
            </div>
          </div>
        </Card>

        {/* Tipo de Publicador */}
        <Card 
          className="p-6 cursor-pointer transition-all active:scale-[0.98] bg-white"
          style={{ transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(74, 44, 96, 0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
          onClick={() => setShowEditarTipoPublicador(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#4A2C60' }} />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">Tipo de Publicador</h3>
                <p className="text-sm text-gray-600">{DataService.getTipoPublicadorLabel(perfil.tipoPublicador)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="text-xs" style={{ backgroundColor: 'rgba(200, 224, 70, 0.2)', color: '#4A2C60', border: '1px solid rgba(200, 224, 70, 0.4)' }}>
                    Meta: {metaMensal}h/mês
                  </Badge>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </Card>

        {/* Relatório do Mês (com ref) */}
        {/* ... remove this code ... */}

        {/* Informações de Emergência */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
              Informações de Emergência
            </h3>
            <Button size="sm" variant="ghost" onClick={() => setShowEditarEmergencia(true)}>
              <Edit className="w-4 h-4" style={{ color: '#4A2C60' }} />
            </Button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Validade do DPA</span>
              <span>15/12/2025</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Contato de emergência</span>
              <span>Ana Silva</span>
            </div>
          </div>
        </Card>

        {/* Preferências do App */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-normal text-[16px]">
              <Palette className="w-5 h-5" style={{ color: '#4A2C60' }} />
              Preferências do App
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Modo escuro</span>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Lembretes de gratidão</span>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Lembretes espirituais</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Notificações Inteligentes - NOVO */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 font-normal text-[16px]">
              <Bell className="w-5 h-5" style={{ color: '#4A2C60' }} />
              Notificações Inteligentes
            </h3>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowNotificationSettings(!showNotificationSettings)}
            >
              <ChevronRight 
                className={`w-5 h-5 transition-transform ${showNotificationSettings ? 'rotate-90' : ''}`}
                style={{ color: '#4A2C60' }}
              />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Receba lembretes 24h e 1h antes dos seus estudos e revisitas agendados
          </p>

          {showNotificationSettings && <NotificationSettings />}
        </Card>

        {/* Texto do Ano */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: '#4A2C60' }} />
              Texto do Ano
            </h3>
            <Button size="sm" variant="outline" onClick={() => setShowEditarTextoAno(true)} className="bg-[rgba(0,0,0,0)]">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="rounded-lg p-4 border" style={{ 
            background: 'linear-gradient(to bottom right, rgba(200, 224, 70, 0.15), rgba(200, 224, 70, 0.05))',
            borderColor: 'rgba(200, 224, 70, 0.3)'
          }}>
            <p className="text-xs text-gray-600 mb-2">Texto atual:</p>
            <p className="text-sm text-gray-800 italic mb-1">
              "{perfil.textoAno?.texto || 'Dêem a Jeová a glória que o seu nome merece.'}"
            </p>
            <p className="text-xs text-gray-600">
              — {perfil.textoAno?.referencia || 'Sal. 96:8'}
            </p>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Este texto é exibido na tela de Início
          </p>
        </Card>

        {/* Backup e Sincronização */}
        <Card className="p-6 bg-white">
          <h3 className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Backup e Sincronização
          </h3>
          
          <BackupCard onSyncComplete={handlePerfilAtualizado} />
        </Card>

        {/* Sobre o App */}
        <Card className="p-6 bg-white">
          <h3 className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gray-600" />
            Sobre o App
          </h3>
          
          <div className="space-y-3 text-sm text-gray-600">
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
          temaMes={temaMes}
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
    </div>
  );
}