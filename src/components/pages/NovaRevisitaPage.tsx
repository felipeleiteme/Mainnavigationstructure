import { ArrowLeft, Save, Home, Building2, Store, Trash2, Calendar, User, MapPin, Target, MessageSquare, ClipboardList, Star, AlertTriangle, Sparkles, Zap, ShoppingBag, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { DataService, Revisita } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

interface NovaRevisitaPageProps {
  onVoltar: () => void;
  revisitaEditar?: Revisita;
}

export default function NovaRevisitaPage({ onVoltar, revisitaEditar }: NovaRevisitaPageProps) {
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const t = useTranslations();

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  const [formData, setFormData] = useState({
    nome: revisitaEditar?.nome || '',
    telefone: revisitaEditar?.telefone || '',
    endereco: revisitaEditar?.endereco || '',
    origem: revisitaEditar?.origem || 'casa',
    status: revisitaEditar?.status || 'nova',
    primeiraConversa: revisitaEditar?.primeiraConversa || '',
    interesseEstudo: revisitaEditar?.interesseEstudo || false,
    disponibilidade: revisitaEditar?.disponibilidade || '',
    proximaVisita: revisitaEditar?.proximaVisita || '',
    observacoes: revisitaEditar?.observacoes || '',
    publicacoesDeixadas: revisitaEditar?.publicacoesDeixadas?.join(', ') || '',
  });

  const [hoveredOrigem, setHoveredOrigem] = useState<string | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    // Validações
    if (!formData.nome.trim()) {
      toast.error(t.returnVisitForm.validationErrors.nameRequired);
      return;
    }
    if (!formData.endereco.trim()) {
      toast.error(t.returnVisitForm.validationErrors.addressRequired);
      return;
    }
    if (!formData.primeiraConversa.trim()) {
      toast.error(t.returnVisitForm.validationErrors.firstConversationRequired);
      return;
    }

    // Preparar dados para salvar
    const novaRevisita: Revisita = {
      id: revisitaEditar?.id || Date.now().toString(),
      nome: formData.nome,
      telefone: formData.telefone,
      endereco: formData.endereco,
      origem: formData.origem as 'casa' | 'predio' | 'comercio' | 'rua',
      status: formData.status as 'nova' | 'quente' | 'comercio' | 'descanso',
      primeiraConversa: formData.primeiraConversa,
      interesseEstudo: formData.interesseEstudo,
      quantidadeVisitas: revisitaEditar?.quantidadeVisitas || 1,
      ultimaVisita: revisitaEditar?.ultimaVisita || new Date().toISOString().split('T')[0],
      dataAdicao: revisitaEditar?.dataAdicao || new Date().toISOString().split('T')[0],
      disponibilidade: formData.disponibilidade,
      proximaVisita: formData.proximaVisita,
      observacoes: formData.observacoes,
      publicacoesDeixadas: formData.publicacoesDeixadas
        ? formData.publicacoesDeixadas.split(',').map(p => p.trim()).filter(Boolean)
        : undefined,
    };

    // Salvar no DataService
    if (revisitaEditar) {
      // Atualizar existente
      DataService.atualizarRevisita(novaRevisita.id, novaRevisita);
      toast.success(t.returnVisitForm.successMessages.updated);
    } else {
      // Criar nova
      DataService.adicionarRevisita(novaRevisita);
      toast.success(t.returnVisitForm.successMessages.created);
    }

    onVoltar();
  };

  const handleExcluir = () => {
    if (!revisitaEditar) return;

    const confirmar = window.confirm(
      t.returnVisitForm.deleteConfirmation(formData.nome)
    );

    if (confirmar) {
      DataService.removerRevisita(revisitaEditar.id);
      toast.success(t.returnVisitForm.successMessages.deleted);
      onVoltar();
    }
  };

  const tiposOrigem = [
    { value: 'casa', label: 'Casa', icon: Home },
    { value: 'predio', label: 'Prédio', icon: Building2 },
    { value: 'comercio', label: 'Comércio', icon: Store },
  ];

  const statusOptions = [
    { value: 'nova', label: 'Nova', icon: Sparkles },
    { value: 'interessado', label: 'Interessado', icon: ShoppingBag },
    { value: 'quente', label: 'Quente', icon: Zap },
    { value: 'descanso', label: 'Descanso', icon: Moon },
  ];

  return (
    <div 
      className="min-h-screen pb-48" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' }}
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
            <h2 className="text-xl">{revisitaEditar ? t.returnVisitForm.editTitle : t.returnVisitForm.newTitle}</h2>
            <p className="text-sm opacity-90">{revisitaEditar ? t.returnVisitForm.editSubtitle : t.returnVisitForm.newSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-5">
        {/* Card: Informações Básicas */}
        <Card className="p-5" style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF' }}>
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{ color: temaAtual === 'escuro' ? '#E5E5E5' : '#111827' }}
          >
            <User className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} />
            Informações de Contato
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="nome"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Nome completo *
              </Label>
              <Input
                id="nome"
                placeholder="Ex: Maria Silva"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="h-14 px-4 border-2"
                style={
                  temaAtual === 'escuro'
                    ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                }
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="telefone"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Telefone (opcional)
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="h-14 px-4 border-2"
                style={
                  temaAtual === 'escuro'
                    ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                }
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="endereco"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Endereço completo *
              </Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro, cidade"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className="h-14 px-4 border-2"
                style={
                  temaAtual === 'escuro'
                    ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                }
              />
            </div>
          </div>
        </Card>

        {/* Card: Tipo de Local */}
        <Card className="p-5" style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF' }}>
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{ color: temaAtual === 'escuro' ? '#E5E5E5' : '#111827' }}
          >
            <MapPin className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} />
            Tipo de Local
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {tiposOrigem.map((tipo) => {
              const Icon = tipo.icon;
              const isSelected = formData.origem === tipo.value;
              const isHovered = hoveredOrigem === tipo.value;
              
              return (
                <button
                  key={tipo.value}
                  onClick={() => handleChange('origem', tipo.value)}
                  onMouseEnter={() => setHoveredOrigem(tipo.value)}
                  onMouseLeave={() => setHoveredOrigem(null)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer`}
                  style={
                    isSelected
                      ? temaAtual === 'escuro'
                        ? { 
                            borderColor: isHovered ? '#D4ED5A' : '#C8E046', 
                            backgroundColor: isHovered ? 'rgba(200, 224, 70, 0.25)' : 'rgba(200, 224, 70, 0.15)' 
                          }
                        : { 
                            borderColor: isHovered ? '#3A1C50' : '#4A2C60', 
                            backgroundColor: isHovered ? '#EDE8F2' : '#F5F2F7' 
                          }
                      : temaAtual === 'escuro'
                        ? { 
                            borderColor: isHovered ? '#C8E046' : '#4A4A4A', 
                            backgroundColor: isHovered ? 'rgba(200, 224, 70, 0.08)' : '#1C1C1C' 
                          }
                        : { 
                            borderColor: isHovered ? '#4A2C60' : '#E5E7EB', 
                            backgroundColor: isHovered ? '#FAFAFA' : '#FFFFFF' 
                          }
                  }
                >
                  <Icon 
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ 
                      color: isSelected 
                        ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                        : (temaAtual === 'escuro' ? (isHovered ? '#C8E046' : '#9CA3AF') : (isHovered ? '#4A2C60' : '#6B7280'))
                    }}
                  />
                  <p 
                    className="text-xs text-center"
                    style={{ 
                      color: temaAtual === 'escuro' 
                        ? (isSelected ? '#C8E046' : (isHovered ? '#E5E5E5' : '#D1D5DB'))
                        : (isSelected ? '#4A2C60' : (isHovered ? '#1F2937' : '#374151'))
                    }}
                  >
                    {tipo.label}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Card: Status */}
        <Card className="p-5" style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF' }}>
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{ color: temaAtual === 'escuro' ? '#E5E5E5' : '#111827' }}
          >
            <Target className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} />
            Status da Revisita
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((status) => {
              const StatusIcon = status.icon;
              const isSelected = formData.status === status.value;
              const isHovered = hoveredStatus === status.value;
              
              return (
                <button
                  key={status.value}
                  onClick={() => handleChange('status', status.value)}
                  onMouseEnter={() => setHoveredStatus(status.value)}
                  onMouseLeave={() => setHoveredStatus(null)}
                  className="p-3 rounded-lg border-2 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={
                    isSelected
                      ? temaAtual === 'escuro'
                        ? { 
                            backgroundColor: isHovered ? 'rgba(200, 224, 70, 0.25)' : 'rgba(200, 224, 70, 0.15)', 
                            borderColor: isHovered ? '#D4ED5A' : '#C8E046',
                            color: '#C8E046'
                          }
                        : { 
                            backgroundColor: isHovered ? '#3A1C50' : '#4A2C60', 
                            borderColor: isHovered ? '#3A1C50' : '#4A2C60',
                            color: 'white'
                          }
                      : temaAtual === 'escuro'
                        ? { 
                            backgroundColor: isHovered ? 'rgba(200, 224, 70, 0.08)' : '#1C1C1C',
                            borderColor: isHovered ? '#C8E046' : '#4A4A4A',
                            color: isHovered ? '#C8E046' : '#D1D5DB'
                          }
                        : { 
                            backgroundColor: isHovered ? '#FAFAFA' : 'white',
                            borderColor: isHovered ? '#4A2C60' : '#E5E7EB',
                            color: isHovered ? '#1F2937' : '#374151'
                          }
                  }
                >
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Card: Primeira Conversa */}
        <Card className="p-5" style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF' }}>
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{ color: temaAtual === 'escuro' ? '#E5E5E5' : '#111827' }}
          >
            <MessageSquare className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} />
            Primeira Conversa
          </h3>
          <div className="space-y-2">
            <Label 
              htmlFor="primeiraConversa"
              style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
            >
              Sobre o que vocês conversaram? *
            </Label>
            <Textarea
              id="primeiraConversa"
              placeholder="Ex: Demonstrou interesse em saber sobre o Reino de Deus..."
              value={formData.primeiraConversa}
              onChange={(e) => handleChange('primeiraConversa', e.target.value)}
              className="resize-none min-h-[100px] border-2"
              style={
                temaAtual === 'escuro'
                  ? {
                      backgroundColor: '#1C1C1C',
                      borderColor: '#4A4A4A',
                      color: '#E5E5E5'
                    }
                  : {
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D8CEE8',
                      color: '#111827'
                    }
              }
              rows={4}
            />
          </div>
        </Card>

        {/* Card: Detalhes Adicionais */}
        <Card className="p-5" style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF' }}>
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{ color: temaAtual === 'escuro' ? '#E5E5E5' : '#111827' }}
          >
            <ClipboardList className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} />
            Detalhes Adicionais
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="disponibilidade"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Disponibilidade
              </Label>
              <Input
                id="disponibilidade"
                placeholder="Ex: Sábados pela manhã"
                value={formData.disponibilidade}
                onChange={(e) => handleChange('disponibilidade', e.target.value)}
                className="h-14 px-4 border-2"
                style={
                  temaAtual === 'escuro'
                    ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                }
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="proximaVisita"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Data Combinada para Retornar
              </Label>
              <div className="relative">
                <Input
                  id="proximaVisita"
                  type="date"
                  value={formData.proximaVisita}
                  onChange={(e) => handleChange('proximaVisita', e.target.value)}
                  className="h-14 px-4 pr-12 border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={
                    temaAtual === 'escuro'
                      ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                      : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                  }
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} />
                </div>
              </div>
              <p 
                className="text-xs"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                Quando o morador pediu para você voltar?
              </p>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="publicacoes"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Publicações Deixadas
              </Label>
              <Input
                id="publicacoes"
                placeholder="Ex: Bom dia!, O que a Bíblia diz?"
                value={formData.publicacoesDeixadas}
                onChange={(e) => handleChange('publicacoesDeixadas', e.target.value)}
                className="h-14 px-4 border-2"
                style={
                  temaAtual === 'escuro'
                    ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                }
              />
              <p 
                className="text-xs"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                Separe por vírgula
              </p>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="observacoes"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                Observações
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Outras anotações importantes..."
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                className="resize-none min-h-[120px] border-2"
                style={
                  temaAtual === 'escuro'
                    ? { backgroundColor: '#1C1C1C', borderColor: '#4A4A4A', color: '#E5E5E5' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#D8CEE8', color: '#111827' }
                }
                rows={5}
              />
            </div>

            <div 
              className="flex items-center gap-3 p-4 rounded-lg border"
              style={
                temaAtual === 'escuro'
                  ? { backgroundColor: 'rgba(200, 224, 70, 0.1)', borderColor: 'rgba(200, 224, 70, 0.3)' }
                  : { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }
              }
            >
              <input
                type="checkbox"
                id="interesseEstudo"
                checked={formData.interesseEstudo}
                onChange={(e) => handleChange('interesseEstudo', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
                style={{ accentColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              />
              <Label 
                htmlFor="interesseEstudo" 
                className="cursor-pointer flex-1 flex items-center gap-2"
                style={{ color: temaAtual === 'escuro' ? '#E5E5E5' : '#92400E' }}
              >
                <Star className="w-4 h-4" style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#D97706' }} />
                Esta pessoa demonstrou interesse em estudar a Bíblia
              </Label>
            </div>
          </div>
        </Card>

        {/* Card: Zona de Perigo (apenas ao editar) */}
        {revisitaEditar && (
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
              className="flex items-center gap-2 mb-4"
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
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#FCA5A5',
                backgroundColor: 'rgba(239, 68, 68, 0.15)'
              } : {
                borderColor: '#FCA5A5',
                color: '#B91C1C',
                backgroundColor: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                if (temaAtual === 'escuro') {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.7)';
                } else {
                  e.currentTarget.style.backgroundColor = '#FEE2E2';
                  e.currentTarget.style.borderColor = '#F87171';
                }
              }}
              onMouseLeave={(e) => {
                if (temaAtual === 'escuro') {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                } else {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#FCA5A5';
                }
              }}
              onClick={handleExcluir}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Revisita
            </Button>
          </Card>
        )}

        {/* Botão Salvar */}
        <button 
          className="w-full shadow-lg h-14 text-lg rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
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
          onClick={handleSalvar}
        >
          <Save className="w-5 h-5 mr-2" />
          {revisitaEditar ? 'Salvar Alterações' : 'Cadastrar Revisita'}
        </button>
      </div>
    </div>
  );
}