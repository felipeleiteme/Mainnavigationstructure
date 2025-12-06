import { ArrowLeft, BookOpen, User, Phone, MapPin, Calendar, Clock, Trash2, Sprout, HelpCircle, Target, MessageCircle, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

interface NovoEstudoPageProps {
  onVoltar: () => void;
  estudoEditar?: Estudo;
  revisitaConversao?: {
    nome: string;
    telefone?: string;
    endereco?: string;
  };
}

export default function NovoEstudoPage({ onVoltar, estudoEditar, revisitaConversao }: NovoEstudoPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  
  // Hook de traduções - DEVE ser chamado no topo do componente
  const t = useTranslations();

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  const [formData, setFormData] = useState({
    estudanteNome: estudoEditar?.estudanteNome || revisitaConversao?.nome || '',
    estudanteTelefone: estudoEditar?.estudanteTelefone || revisitaConversao?.telefone || '',
    estudanteEndereco: estudoEditar?.estudanteEndereco || revisitaConversao?.endereco || '',
    publicacao: estudoEditar?.publicacao || 'Seja Feliz para Sempre!',
    status: estudoEditar?.status || 'iniciando',
    data: estudoEditar?.data || new Date().toISOString().split('T')[0],
    horario: estudoEditar?.horario || '19:00',
    observacoes: estudoEditar?.observacoes || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    // Validações
    if (!formData.estudanteNome.trim()) {
      toast.error(t.studyForm.validationErrors.nameRequired);
      return;
    }

    if (!formData.estudanteEndereco.trim()) {
      toast.error(t.studyForm.validationErrors.addressRequired);
      return;
    }

    if (!formData.publicacao.trim()) {
      toast.error(t.studyForm.validationErrors.publicationRequired);
      return;
    }

    if (estudoEditar) {
      // Editar estudo existente
      const estudoAtualizado: Estudo = {
        ...estudoEditar,
        estudanteNome: formData.estudanteNome,
        estudanteTelefone: formData.estudanteTelefone,
        estudanteEndereco: formData.estudanteEndereco,
        publicacao: formData.publicacao,
        status: formData.status as any,
        data: formData.data,
        horario: formData.horario,
        observacoes: formData.observacoes,
      };
      
      DataService.atualizarEstudo(estudoEditar.id, estudoAtualizado);
      toast.success(t.studyForm.successMessages.updated);
    } else {
      // Criar novo estudo
      const novoEstudo: Estudo = {
        id: Date.now().toString(),
        estudanteNome: formData.estudanteNome,
        estudanteTelefone: formData.estudanteTelefone,
        estudanteEndereco: formData.estudanteEndereco,
        publicacao: formData.publicacao,
        status: formData.status as any,
        data: formData.data,
        horario: formData.horario,
        observacoes: formData.observacoes,
      };
      
      DataService.adicionarEstudo(novoEstudo);
      toast.success(t.studyForm.successMessages.created, {
        description: t.studyForm.successMessages.createdDescription(formData.estudanteNome),
      });
    }

    onVoltar();
  };

  const handleExcluir = () => {
    if (!estudoEditar) return;

    const confirmar = window.confirm(t.studyForm.deleteConfirmation(formData.estudanteNome));

    if (confirmar) {
      DataService.removerEstudo(estudoEditar.id);
      toast.success(t.studyForm.successMessages.deleted);
      onVoltar();
    }
  };

  const publicacoes = [
    'Seja Feliz para Sempre!',
    'Aprenda com as Histórias da Bíblia',
    'Aprenda do Grande Instrutor',
    'Outra publicação',
  ];

  const statusOptions = [
    { 
      id: 'iniciando', 
      nome: 'Iniciando', 
      icon: Sprout, 
      descricao: 'Primeiras lições' 
    },
    { 
      id: 'progredindo', 
      nome: 'Progredindo', 
      icon: BookOpen, 
      descricao: 'Avançando bem' 
    },
    { 
      id: 'duvidas', 
      nome: 'Com dúvidas', 
      icon: HelpCircle, 
      descricao: 'Precisa de atenção' 
    },
    { 
      id: 'avancado', 
      nome: 'Avançado', 
      icon: Target, 
      descricao: 'Próximo do batismo' 
    },
  ];

  const modoEdicao = !!estudoEditar;

  return (
    <div className="min-h-screen pb-48 bg-neutral">
      {/* Header Fixo - Padrão Brandbook - REFATORADO COM INLINE STYLES PUROS */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60',
          color: '#FFFFFF'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '48px',
            paddingBottom: '24px'
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl truncate">{modoEdicao ? t.studyForm.editStudyTitle : t.studyForm.newStudyTitle}</h2>
            <p className="text-sm opacity-90">
              {modoEdicao ? t.studyForm.editStudySubtitle : t.studyForm.newStudySubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-5">
        {/* Banner de conversão de revisita */}
        {revisitaConversao && (
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-3">
              <Sprout className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm mb-1 text-primary-700">
                  <strong>Parabéns!</strong> Você está convertendo uma revisita em estudo bíblico.
                </p>
                <p className="text-xs text-gray-600">
                  Os dados de <strong>{revisitaConversao.nome}</strong> já foram preenchidos para facilitar.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Card: Informações do Estudante */}
        <Card 
          className="p-5"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <User 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
            {t.studyForm.contactInfo}
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="nome"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.studyForm.fullNameLabel}
              </Label>
              <Input
                id="nome"
                placeholder={t.studyForm.fullNamePlaceholder}
                value={formData.estudanteNome}
                onChange={(e) => handleChange('estudanteNome', e.target.value)}
                className="h-14 px-4 border-2"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                  borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000'
                }}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="telefone"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.studyForm.phoneLabel}
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder={t.studyForm.phonePlaceholder}
                value={formData.estudanteTelefone}
                onChange={(e) => handleChange('estudanteTelefone', e.target.value)}
                className="h-14 px-4 border-2"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                  borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000'
                }}
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="endereco"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.studyForm.addressLabel}
              </Label>
              <Input
                id="endereco"
                placeholder={t.studyForm.addressPlaceholder}
                value={formData.estudanteEndereco}
                onChange={(e) => handleChange('estudanteEndereco', e.target.value)}
                className="h-14 px-4 border-2"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                  borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000'
                }}
              />
            </div>
          </div>
        </Card>

        {/* Card: Detalhes do Estudo */}
        <Card 
          className="p-5"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <BookOpen 
              className="w-5 h-5"
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
            Detalhes do Estudo
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label 
                htmlFor="publicacao"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Publicação *
              </Label>
              <div className="relative">
                <select
                  id="publicacao"
                  value={formData.publicacao}
                  onChange={(e) => handleChange('publicacao', e.target.value)}
                  className="w-full h-14 px-4 pr-10 border-2 rounded-md appearance-none focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                    borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000'
                  }}
                >
                  {publicacoes.map((pub, idx) => (
                    <option key={idx} value={pub}>{pub}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <Label 
                className="mb-3 block" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#374151'
                }}
              >
                Status do progresso
              </Label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleChange('status', status.id)}
                    type="button"
                    className="w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all"
                    style={{
                      borderColor: formData.status === status.id 
                        ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                        : (temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8'),
                      backgroundColor: formData.status === status.id
                        ? (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)')
                        : (temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF')
                    }}
                  >
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: temaAtual === 'escuro' 
                          ? 'rgba(200, 224, 70, 0.15)' 
                          : 'rgba(74, 44, 96, 0.1)'
                      }}
                    >
                      <status.icon 
                        className="w-5 h-5" 
                        style={{ 
                          color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        }} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="font-medium" 
                        style={{ 
                          color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        }}
                      >
                        {status.nome}
                      </p>
                      <p 
                        className="text-xs" 
                        style={{ 
                          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        {status.descricao}
                      </p>
                    </div>
                    {formData.status === status.id && (
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        }}
                      >
                        <svg 
                          className="w-3.5 h-3.5" 
                          style={{ 
                            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                          }} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Agendamento */}
        <Card 
          className="p-5"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <Calendar 
              className="w-5 h-5"
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
            Agendamento
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="data"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Próxima data
              </Label>
              <div className="relative">
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange('data', e.target.value)}
                  className="h-14 px-4 pr-12 border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                    borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000',
                    colorScheme: temaAtual === 'escuro' ? 'dark' : 'light'
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar 
                    className="w-5 h-5" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="horario"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Horário
              </Label>
              <div className="relative">
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleChange('horario', e.target.value)}
                  className="h-14 px-4 pr-12 border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                    borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000',
                    colorScheme: temaAtual === 'escuro' ? 'dark' : 'light'
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Clock 
                    className="w-5 h-5"
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Observações */}
        <Card 
          className="p-5"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <MessageSquare 
              className="w-5 h-5"
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
            Observações
          </h3>
          
          <Textarea
            placeholder="Ex: Estudante muito interessado, faz boas perguntas..."
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            className="resize-none min-h-[120px] border-2"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
              borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)',
              color: temaAtual === 'escuro' ? '#D1D5DB' : '#000000'
            }}
            rows={5}
          />
        </Card>

        {/* Card: Zona de Perigo (apenas ao editar) */}
        {modoEdicao && (
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
              Ao excluir este estudo bíblico, todos os dados do estudante e histórico serão removidos permanentemente. Esta ação não pode ser desfeita.
            </p>
            <Button
              variant="outline"
              className="w-full border-2"
              style={temaAtual === 'escuro' ? {
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#FCA5A5',
                backgroundColor: 'transparent'
              } : {
                borderColor: '#FCA5A5',
                color: '#B91C1C',
                backgroundColor: 'transparent'
              }}
              onClick={handleExcluir}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Estudo
            </Button>
          </Card>
        )}

        {/* Botão Salvar */}
        <button 
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer"
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
            border: 'none',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
          }}
          onClick={handleSalvar}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {modoEdicao ? 'Salvar Alterações' : 'Criar Estudo Bíblico'}
        </button>
      </div>
    </div>
  );
}