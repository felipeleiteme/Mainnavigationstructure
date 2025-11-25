import { ArrowLeft, Save, Home, Building2, Store, Trash2, Calendar, User, MapPin, Target, MessageSquare, ClipboardList, Star, AlertTriangle, Sparkles, Zap, ShoppingBag, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { DataService, Revisita } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

interface NovaRevisitaPageProps {
  onVoltar: () => void;
  revisitaEditar?: Revisita;
}

export default function NovaRevisitaPage({ onVoltar, revisitaEditar }: NovaRevisitaPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    // Validações
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.endereco.trim()) {
      toast.error('Endereço é obrigatório');
      return;
    }
    if (!formData.primeiraConversa.trim()) {
      toast.error('Primeira conversa é obrigatória');
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
      toast.success('Revisita atualizada! ✅');
    } else {
      // Criar nova
      DataService.adicionarRevisita(novaRevisita);
      toast.success('Revisita cadastrada! 🌱', {
        description: 'Que Jeová abençoe suas visitas',
      });
    }

    onVoltar();
  };

  const handleExcluir = () => {
    if (!revisitaEditar) return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a revisita de ${formData.nome}?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmar) {
      DataService.removerRevisita(revisitaEditar.id);
      toast.success('Revisita excluída', {
        description: 'Os dados foram removidos permanentemente',
      });
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
    <div className="min-h-screen pb-48" style={{ backgroundColor: '#FDF8EE' }}>
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
            <h2 className="text-xl">{revisitaEditar ? 'Editar Revisita' : 'Nova Revisita'}</h2>
            <p className="text-sm opacity-90">{revisitaEditar ? 'Atualize as informações' : 'Preencha as informações'}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-5">
        {/* Card: Informações Básicas */}
        <Card className="p-5">
          <h3 className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Informações de Contato
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                placeholder="Ex: Maria Silva"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="h-14 px-4 bg-white border-2"
                style={{ borderColor: '#D8CEE8' }}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (opcional)</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="h-14 px-4 bg-white border-2"
                style={{ borderColor: '#D8CEE8' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço completo *</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro, cidade"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className="h-14 px-4 bg-white border-2"
                style={{ borderColor: '#D8CEE8' }}
              />
            </div>
          </div>
        </Card>

        {/* Card: Tipo de Local */}
        <Card className="p-5">
          <h3 className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Tipo de Local
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {tiposOrigem.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <button
                  key={tipo.value}
                  onClick={() => handleChange('origem', tipo.value)}
                  className={`p-4 rounded-lg border-2 transition-all`}
                  style={
                    formData.origem === tipo.value
                      ? { borderColor: '#4A2C60', backgroundColor: '#F5F2F7' }
                      : { borderColor: '#E5E7EB' }
                  }
                >
                  <Icon 
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: formData.origem === tipo.value ? '#4A2C60' : '#6B7280' }}
                  />
                  <p className="text-xs text-center">{tipo.label}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Card: Status */}
        <Card className="p-5">
          <h3 className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Status da Revisita
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((status) => {
              const StatusIcon = status.icon;
              const isSelected = formData.status === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => handleChange('status', status.value)}
                  className="p-3 rounded-lg border-2 text-sm transition-all flex items-center justify-center gap-2"
                  style={
                    isSelected
                      ? { 
                          backgroundColor: '#4A2C60', 
                          borderColor: '#4A2C60',
                          color: 'white'
                        }
                      : { 
                          backgroundColor: 'white',
                          borderColor: '#E5E7EB',
                          color: '#374151'
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
        <Card className="p-5">
          <h3 className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Primeira Conversa
          </h3>
          <div className="space-y-2">
            <Label htmlFor="primeiraConversa">
              Sobre o que vocês conversaram? *
            </Label>
            <Textarea
              id="primeiraConversa"
              placeholder="Ex: Demonstrou interesse em saber sobre o Reino de Deus..."
              value={formData.primeiraConversa}
              onChange={(e) => handleChange('primeiraConversa', e.target.value)}
              className="resize-none min-h-[100px]"
              rows={4}
            />
          </div>
        </Card>

        {/* Card: Detalhes Adicionais */}
        <Card className="p-5">
          <h3 className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Detalhes Adicionais
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disponibilidade">Disponibilidade</Label>
              <Input
                id="disponibilidade"
                placeholder="Ex: Sábados pela manhã"
                value={formData.disponibilidade}
                onChange={(e) => handleChange('disponibilidade', e.target.value)}
                className="h-14 px-4 bg-white border-2"
                style={{ borderColor: '#D8CEE8' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proximaVisita">Data Combinada para Retornar</Label>
              <div className="relative">
                <Input
                  id="proximaVisita"
                  type="date"
                  value={formData.proximaVisita}
                  onChange={(e) => handleChange('proximaVisita', e.target.value)}
                  className="h-14 px-4 pr-12 bg-white border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={{ borderColor: '#D8CEE8' }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="w-5 h-5" style={{ color: '#4A2C60' }} />
                </div>
              </div>
              <p className="text-xs text-gray-500">Quando o morador pediu para você voltar?</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicacoes">Publicações Deixadas</Label>
              <Input
                id="publicacoes"
                placeholder="Ex: Bom dia!, O que a Bíblia diz?"
                value={formData.publicacoesDeixadas}
                onChange={(e) => handleChange('publicacoesDeixadas', e.target.value)}
                className="h-14 px-4 bg-white border-2"
                style={{ borderColor: '#D8CEE8' }}
              />
              <p className="text-xs text-gray-500">Separe por vírgula</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Outras anotações importantes..."
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                className="resize-none min-h-[120px] bg-white border-2"
                style={{ borderColor: '#D8CEE8' }}
                rows={5}
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <input
                type="checkbox"
                id="interesseEstudo"
                checked={formData.interesseEstudo}
                onChange={(e) => handleChange('interesseEstudo', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
                style={{ accentColor: '#4A2C60' }}
              />
              <Label htmlFor="interesseEstudo" className="cursor-pointer flex-1 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                Esta pessoa demonstrou interesse em estudar a Bíblia
              </Label>
            </div>
          </div>
        </Card>

        {/* Card: Zona de Perigo (apenas ao editar) */}
        {revisitaEditar && (
          <Card className="p-5 border-red-200 bg-red-50">
            <h3 className="flex items-center gap-2 mb-4 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Zona de Perigo
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Ao excluir esta revisita, todos os dados serão removidos permanentemente. Esta ação não pode ser desfeita.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
              onClick={handleExcluir}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Revisita
            </Button>
          </Card>
        )}

        {/* Botão Salvar */}
        <Button 
          className="w-full hover:opacity-90 text-white shadow-lg py-6 text-lg"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={handleSalvar}
        >
          <Save className="w-5 h-5 mr-2" />
          {revisitaEditar ? 'Salvar Alterações' : 'Cadastrar Revisita'}
        </Button>
      </div>
    </div>
  );
}