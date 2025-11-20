import { User, Users, Calendar, FileText, AlertCircle, Palette, Bell, Cloud, Info, LogOut, Edit, TrendingUp, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useState, useEffect, useRef } from 'react';
import EnviarRelatorioFlow from '../perfil/EnviarRelatorioFlow';
import NotificationDemo from '../notifications/NotificationDemo';
import EditarTipoPublicadorModal from '../perfil/EditarTipoPublicadorModal';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';

interface PerfilTabProps {
  scrollTo?: string;
  acao?: string;
}

export default function PerfilTab({ scrollTo, acao }: PerfilTabProps) {
  const [showEnviarRelatorio, setShowEnviarRelatorio] = useState(false);
  const [showNotificationDemo, setShowNotificationDemo] = useState(false);
  const cronogramaRef = useRef<HTMLDivElement>(null);
  const relatorioRef = useRef<HTMLDivElement>(null);
  const [showEditarPerfil, setShowEditarPerfil] = useState(false);
  const [showEditarInfo, setShowEditarInfo] = useState(false);
  const [showRelatorioCompleto, setShowRelatorioCompleto] = useState(false);
  const [showEditarEmergencia, setShowEditarEmergencia] = useState(false);
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
    <div className="min-h-full bg-gray-50">
      {/* Header de Perfil */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl">{perfil.nome}</h1>
            <Badge className="bg-white/20 border-white/30 text-white mt-1">
              🌟 {DataService.getTipoPublicadorLabel(perfil.tipoPublicador)}
            </Badge>
          </div>
          <Button size="sm" variant="ghost" className="text-white" onClick={() => setShowEditarPerfil(true)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Informações de Contato */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Informações de Contato
            </h3>
            <Button size="sm" variant="outline" onClick={() => setShowEditarInfo(true)}>
              <Edit className="w-4 h-4" />
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

        {/* Relatório do Mês (com ref) */}
        <div ref={relatorioRef} className="transition-all duration-300">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Relatório do Mês
              </h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {formatarHoras(relatorioAtual.horasCampo + relatorioAtual.horasCredito)} de {DataService.getMetaMensal()}h
                  </span>
                  <span className="text-xs text-gray-600">
                    Campo: {formatarHoras(relatorioAtual.horasCampo)} | Crédito: {formatarHoras(relatorioAtual.horasCredito)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, ((relatorioAtual.horasCampo + relatorioAtual.horasCredito) / DataService.getMetaMensal()) * 100)} 
                  className="h-3" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl text-blue-900">{relatorioAtual.estudos}</p>
                  <p className="text-xs text-gray-600">Estudos</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl text-green-900">{relatorioAtual.revisitas}</p>
                  <p className="text-xs text-gray-600">Revisitas Novas</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl text-purple-900">{relatorioAtual.publicacoes}</p>
                  <p className="text-xs text-gray-600">Publicações</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <p className="text-2xl text-orange-900">{relatorioAtual.videos}</p>
                  <p className="text-xs text-gray-600">Vídeos</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowRelatorioCompleto(true)}>Ver Completo</Button>
              <Button 
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={() => setShowEnviarRelatorio(true)}
              >
                Enviar Relatório
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-3">
              <span className="text-sm">Lembrar de enviar</span>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        {/* Informações de Emergência */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Informações de Emergência
            </h3>
            <Button size="sm" variant="outline" onClick={() => setShowEditarEmergencia(true)}>Editar</Button>
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
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-600">Grupo sanguíneo</span>
              <span>O+</span>
            </div>
          </div>
        </Card>

        {/* Preferências do App */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-600" />
            Preferências do App
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Modo escuro</span>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Notificações de estudos</span>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Notificações de progresso</span>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Lembretes espirituais</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Backup e Sincronização */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-blue-600" />
            Backup e Sincronização
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Última sincronização: Agora mesmo</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Seus dados estão seguros na nuvem
          </p>

          <Button variant="outline" className="w-full"
            onClick={() => {
              toast.success('Sincronização iniciada...', {
                description: 'Dados atualizados com sucesso!',
              });
            }}
          >
            Forçar Sincronização
          </Button>
        </Card>

        {/* Sobre o App */}
        <Card className="p-6">
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
        <EnviarRelatorioFlow
          onClose={() => setShowEnviarRelatorio(false)}
          relatorio={relatorioAtual}
          temaMes={temaMes}
        />
      )}

      {/* Modal: Relatório Completo */}
      {showRelatorioCompleto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-br from-orange-600 to-orange-700 text-white px-6 pt-6 pb-4 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl mb-1">Relatório Completo</h2>
                  <p className="text-sm opacity-90">Novembro 2025</p>
                </div>
                <button 
                  onClick={() => setShowRelatorioCompleto(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              {/* Resumo de Horas */}
              <div>
                <h3 className="text-sm mb-3">⏱️ Resumo de Horas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Horas de Campo</span>
                    <span className="text-sm">{formatarHoras(relatorioAtual.horasCampo)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Horas de Crédito</span>
                    <span className="text-sm">{formatarHoras(relatorioAtual.horasCredito)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm">Total</span>
                    <span className="text-sm">{formatarHoras(relatorioAtual.horasCampo + relatorioAtual.horasCredito)}</span>
                  </div>
                  <Progress value={64} className="h-2 mt-2" />
                  <p className="text-xs text-gray-600 text-center">64% da meta (70h)</p>
                </div>
              </div>

              {/* Atividades */}
              <div>
                <h3 className="text-sm mb-3">📊 Atividades</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-3xl text-blue-900 mb-1">{relatorioAtual.estudos}</p>
                    <p className="text-xs text-gray-600">Estudos Bíblicos</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-3xl text-green-900 mb-1">{relatorioAtual.revisitas}</p>
                    <p className="text-xs text-gray-600">Revisitas Novas</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-3xl text-purple-900 mb-1">{relatorioAtual.publicacoes}</p>
                    <p className="text-xs text-gray-600">Publicações</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <p className="text-3xl text-orange-900 mb-1">{relatorioAtual.videos}</p>
                    <p className="text-xs text-gray-600">Vídeos</p>
                  </div>
                </div>
              </div>

              {/* Progresso Semanal */}
              <div>
                <h3 className="text-sm mb-3">📅 Progresso Semanal</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-600">Semana 1</span>
                      <span className="text-xs">12h</span>
                    </div>
                    <Progress value={80} className="h-1" />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-600">Semana 2</span>
                      <span className="text-xs">10h</span>
                    </div>
                    <Progress value={67} className="h-1" />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-600">Semana 3</span>
                      <span className="text-xs">15h</span>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-600">Semana 4</span>
                      <span className="text-xs">8h (em andamento)</span>
                    </div>
                    <Progress value={53} className="h-1" />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <h3 className="text-sm mb-3">💭 Observações</h3>
                <p className="text-sm text-gray-600 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  Mês produtivo! Consegui iniciar 2 novos estudos e fazer 5 revisitas novas. 
                  Continuar focando na qualidade das conversas.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setShowRelatorioCompleto(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Emergência */}
      {showEditarEmergencia && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-br from-red-600 to-red-700 text-white px-6 pt-6 pb-4 z-10">
              <div className="flex items-start justify-between">
                <h2 className="text-xl">Editar Emergência</h2>
                <button 
                  onClick={() => setShowEditarEmergencia(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm mb-2">Validade do DPA:</label>
                <input
                  type="date"
                  defaultValue="2025-12-15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Contato de Emergência:</label>
                <input
                  type="text"
                  defaultValue="Ana Silva"
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Telefone de Emergência:</label>
                <input
                  type="tel"
                  defaultValue="(11) 98765-4321"
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Grupo Sanguíneo:</label>
                <select
                  defaultValue="O+"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Alergias (opcional):</label>
                <textarea
                  placeholder="Ex: Penicilina, frutos do mar..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowEditarEmergencia(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  toast.success('Informações atualizadas!', {
                    description: 'Dados de emergência salvos com sucesso.',
                  });
                  setShowEditarEmergencia(false);
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6 pt-6 pb-4 z-10">
              <div className="flex items-start justify-between">
                <h2 className="text-xl">Editar Informações</h2>
                <button 
                  onClick={() => setShowEditarInfo(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm mb-2">Nome Completo:</label>
                <input
                  type="text"
                  defaultValue="Felipe Silva"
                  placeholder="Seu nome completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Tipo de Publicador:</label>
                <select
                  defaultValue="pioneiro-regular"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="publicador">Publicador</option>
                  <option value="pioneiro-auxiliar">Pioneiro Auxiliar</option>
                  <option value="pioneiro-regular">Pioneiro Regular</option>
                  <option value="pioneiro-especial">Pioneiro Especial</option>
                  <option value="missionario">Missionário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Congregação:</label>
                <input
                  type="text"
                  defaultValue="Congregação Central"
                  placeholder="Nome da congregação"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Email:</label>
                <input
                  type="email"
                  defaultValue="felipe.silva@email.com"
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Telefone:</label>
                <input
                  type="tel"
                  defaultValue="(11) 98765-4321"
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowEditarInfo(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  toast.success('Informações atualizadas!', {
                    description: 'Seus dados foram salvos com sucesso.',
                  });
                  setShowEditarInfo(false);
                }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}