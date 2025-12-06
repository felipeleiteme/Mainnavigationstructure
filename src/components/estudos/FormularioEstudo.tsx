import { X, BookOpen, User, Phone, MapPin, Calendar, Clock, Save, Trash2, Sprout, HelpCircle, Target, AlertCircle, Check, PartyPopper } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useState, useEffect, useRef } from 'react';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner';
import { SmartNotificationManager } from '../../utils/notifications/smartNotifications';

interface FormularioEstudoProps {
  onClose: () => void;
  onSave?: () => void;
  estudo?: Estudo; // Para edição
  revisitaConversao?: {
    nome: string;
    telefone?: string;
    endereco?: string;
  };
}

export default function FormularioEstudo({ onClose, onSave, estudo, revisitaConversao }: FormularioEstudoProps) {
  const isEdicao = !!estudo;
  const isConversao = !!revisitaConversao;

  // Form state
  const [formData, setFormData] = useState({
    estudanteNome: estudo?.estudanteNome || revisitaConversao?.nome || '',
    estudanteTelefone: estudo?.estudanteTelefone || revisitaConversao?.telefone || '',
    endereco: estudo?.endereco || revisitaConversao?.endereco || '',
    publicacao: estudo?.publicacao || 'Seja Feliz para Sempre!',
    licao: estudo?.licao || 1,
    data: estudo?.data ? new Date(estudo.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    horario: estudo?.horario || '14:00',
    status: estudo?.status || 'iniciando' as const,
    progresso: estudo?.progresso || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Publicações disponíveis
  const publicacoes = [
    'Seja Feliz para Sempre!',
    'Aprenda com as Histórias da Bíblia',
    'Aprenda do Grande Instrutor',
    'Outra publicação',
  ];

  // Validação
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.estudanteNome.trim()) {
      novosErros.estudanteNome = 'Nome do estudante é obrigatório';
    }

    if (!formData.publicacao) {
      novosErros.publicacao = 'Selecione uma publicação';
    }

    if (!formData.data) {
      novosErros.data = 'Data é obrigatória';
    }

    if (!formData.horario) {
      novosErros.horario = 'Horário é obrigatório';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Salvar
  const handleSalvar = () => {
    if (!validarFormulario()) {
      toast.error('Por favor, preencha todos os campos obrigatórios', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    try {
      const dataEstudo = new Date(`${formData.data}T${formData.horario}`);
      
      const novoEstudo: Omit<Estudo, 'id'> = {
        estudanteNome: formData.estudanteNome,
        estudanteAvatar: formData.estudanteNome.split(' ').map(n => n[0]).join(''),
        estudanteTelefone: formData.estudanteTelefone,
        publicacao: formData.publicacao,
        licao: formData.licao,
        progresso: formData.progresso,
        data: dataEstudo.toISOString(),
        horario: formData.horario,
        endereco: formData.endereco,
        status: formData.status
      };

      if (isEdicao && estudo?.id) {
        // Atualizar estudo existente
        DataService.atualizarEstudo(estudo.id, novoEstudo);
        
        // Remover notificações antigas e reagendar
        SmartNotificationManager.removeSchedulesByEntity(estudo.id);
        SmartNotificationManager.scheduleEstudoNotification(
          estudo.id,
          formData.estudanteNome,
          formData.data,
          formData.horario,
          formData.endereco
        );
        
        toast.success('Você atualizou o estudo', {
          icon: <Check className="w-5 h-5" />
        });
      } else {
        // Adicionar novo estudo
        const estudoCriado = DataService.adicionarEstudo(novoEstudo);
        
        // Agendar notificações inteligentes (24h e 1h antes)
        SmartNotificationManager.scheduleEstudoNotification(
          estudoCriado.id,
          formData.estudanteNome,
          formData.data,
          formData.horario,
          formData.endereco
        );
        
        toast.success(
          isConversao 
            ? 'Revisita convertida em estudo! Parabéns!' 
            : 'Estudo adicionado com sucesso!',
          {
            icon: isConversao ? <PartyPopper className="w-5 h-5" /> : <Check className="w-5 h-5" />
          }
        );
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar estudo:', error);
      toast.error('Erro ao salvar estudo. Tente novamente.', {
        icon: <AlertCircle className="w-5 h-5" />
      });
    }
  };

  // Deletar
  const handleDeletar = () => {
    if (!estudo?.id) return;

    if (confirm('Tem certeza que deseja remover este estudo?')) {
      try {
        DataService.removerEstudo(estudo.id);
        
        // Remover notificações agendadas
        SmartNotificationManager.removeSchedulesByEntity(estudo.id);
        
        toast.success('Estudo removido', {
          icon: <Trash2 className="w-5 h-5" />
        });
        onSave?.();
        onClose();
      } catch (error) {
        toast.error('Erro ao remover estudo', {
          icon: <AlertCircle className="w-5 h-5" />
        });
      }
    }
  };

  // Atualizar progresso baseado na lição
  useEffect(() => {
    if (formData.publicacao === 'Boas Notícias do Reino de Deus' && formData.licao) {
      const progresso = Math.min((formData.licao / 10) * 100, 100);
      setFormData(prev => ({ ...prev, progresso: Math.round(progresso) }));
    }
  }, [formData.licao, formData.publicacao]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header - Roxo Brandbook - REFATORADO COMPLETO */}
        <div 
          style={{ 
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#4A2C60',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '24px',
            paddingBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <h2 
                style={{ 
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                  padding: 0
                }}
              >
                <BookOpen style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
                {isConversao ? 'Iniciar Estudo Bíblico' : isEdicao ? 'Editar Estudo' : 'Novo Estudo Bíblico'}
              </h2>
              <p 
                style={{ 
                  fontSize: '14px',
                  color: '#FFFFFF',
                  opacity: 0.9,
                  marginTop: '4px',
                  margin: 0,
                  padding: 0
                }}
              >
                {isConversao 
                  ? 'Parabéns! Uma revisita se tornou estudante!' 
                  : isEdicao 
                  ? 'Atualize as informações do estudo' 
                  : 'Registre um novo estudo bíblico'}
              </p>
            </div>
            <button 
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <X style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-6">
          {/* Informações do Estudante */}
          <div>
            <h3 className="flex items-center gap-2 mb-4 text-primary-500">
              <User className="w-5 h-5" />
              Informações do Estudante
            </h3>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <Label htmlFor="nome">Nome do Estudante *</Label>
                <Input
                  id="nome"
                  value={formData.estudanteNome}
                  onChange={(e) => setFormData({ ...formData, estudanteNome: e.target.value })}
                  placeholder="João da Silva"
                  className={`h-14 px-4 bg-white border-2 ${
                    errors.estudanteNome 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-primary-200 focus:border-primary-500'
                  }`}
                />
                {errors.estudanteNome && (
                  <p className="text-xs text-red-600 mt-1">{errors.estudanteNome}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="telefone">Telefone (Opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="telefone"
                    value={formData.estudanteTelefone}
                    onChange={(e) => setFormData({ ...formData, estudanteTelefone: e.target.value })}
                    placeholder="+55 11 99999-9999"
                    className="h-14 pl-12 pr-4 bg-white border-2 border-primary-200 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <Label htmlFor="endereco">Endereço (Opcional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua das Flores, 123"
                    className="h-14 pl-12 pr-4 bg-white border-2 border-primary-200 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Publicação e Progresso */}
          <div>
            <h3 className="flex items-center gap-2 mb-4 text-primary-500">
              <BookOpen className="w-5 h-5" />
              Publicação
            </h3>

            <div className="space-y-4">
              {/* Publicação */}
              <div>
                <Label htmlFor="publicacao">Publicação *</Label>
                <div className="relative">
                  <select
                    id="publicacao"
                    value={formData.publicacao}
                    onChange={(e) => setFormData({ ...formData, publicacao: e.target.value })}
                    className="w-full h-14 px-4 pr-10 bg-white border-2 border-primary-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {publicacoes.map(pub => (
                      <option key={pub} value={pub}>{pub}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lição (apenas para Boas Notícias) */}
              {formData.publicacao === 'Boas Notícias do Reino de Deus' && (
                <div>
                  <Label htmlFor="licao">Lição Atual</Label>
                  <Input
                    id="licao"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.licao}
                    onChange={(e) => setFormData({ ...formData, licao: parseInt(e.target.value) || 1 })}
                    className="h-14 px-4 bg-white border-2 border-primary-200 focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">Lições de 1 a 10</p>
                </div>
              )}

              {/* Status do Progresso */}
              <div>
                <Label className="mb-3 block">Status do progresso</Label>
                <div className="space-y-2">
                  {/* Iniciando */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'iniciando' })}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      formData.status === 'iniciando' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Sprout className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-500">Iniciando</p>
                      <p className="text-xs text-gray-600">Primeiras lições</p>
                    </div>
                    {formData.status === 'iniciando' && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Progredindo */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'progredindo' })}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      formData.status === 'progredindo' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-500">Progredindo</p>
                      <p className="text-xs text-gray-600">Avançando bem</p>
                    </div>
                    {formData.status === 'progredindo' && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Com dúvidas */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'duvidas' })}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      formData.status === 'duvidas' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-500">Com dúvidas</p>
                      <p className="text-xs text-gray-600">Precisa de atenção</p>
                    </div>
                    {formData.status === 'duvidas' && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Avançado */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'avancado' })}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      formData.status === 'avancado' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-500">Avançado</p>
                      <p className="text-xs text-gray-600">Próximo do batismo</p>
                    </div>
                    {formData.status === 'avancado' && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Progresso */}
              <div>
                <Label>Progresso: {formData.progresso}%</Label>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden border-2 border-secondary-500">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${formData.progresso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Agendamento */}
          <div>
            <h3 className="flex items-center gap-2 mb-4 text-primary-500">
              <Calendar className="w-5 h-5" />
              {isEdicao ? 'Último Estudo' : 'Próximo Estudo'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Data */}
              <div>
                <Label htmlFor="data">Data *</Label>
                <div className="relative">
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className={`h-14 px-4 pr-12 bg-white border-2 [&::-webkit-calendar-picker-indicator]:opacity-0 ${
                      errors.data 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-primary-200 focus:border-primary-500'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar className="w-5 h-5 text-primary-500" />
                  </div>
                </div>
              </div>

              {/* Horário */}
              <div>
                <Label htmlFor="horario">Horário *</Label>
                <div className="relative">
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    className={`h-14 px-4 pr-12 bg-white border-2 [&::-webkit-calendar-picker-indicator]:opacity-0 ${
                      errors.horario 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-primary-200 focus:border-primary-500'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
          {isEdicao && (
            <Button 
              variant="outline" 
              className="w-full h-14 text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center gap-2"
              onClick={handleDeletar}
            >
              <Trash2 className="w-5 h-5" />
              Remover Estudo
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-14 flex items-center justify-center"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              className="h-14 flex items-center justify-center gap-2"
              onClick={handleSalvar}
            >
              <Save className="w-5 h-5" />
              {isEdicao ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}