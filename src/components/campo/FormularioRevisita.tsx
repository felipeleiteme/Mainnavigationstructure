import { X, Sprout, User, Phone, MapPin, Save, Trash2, Home, Building2, Store, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { DataService, Revisita } from '../../services/dataService';
import { toast } from 'sonner';

interface FormularioRevisitaProps {
  onClose: () => void;
  onSave?: () => void;
  revisita?: Revisita; // Para edição
}

export default function FormularioRevisita({ onClose, onSave, revisita }: FormularioRevisitaProps) {
  const isEdicao = !!revisita;

  // Form state
  const [formData, setFormData] = useState({
    nome: revisita?.nome || '',
    telefone: revisita?.telefone || '',
    endereco: revisita?.endereco || '',
    origem: revisita?.origem || 'casa-em-casa' as const,
    primeiraConversa: revisita?.primeiraConversa || '',
    publicacoesEntregues: revisita?.publicacoesEntregues || [],
    interesseEstudo: revisita?.interesseEstudo || false,
    status: revisita?.status || 'nova' as const
  });

  const [novaPublicacao, setNovaPublicacao] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Origens disponíveis
  const origens = [
    { value: 'casa-em-casa', label: 'Casa em Casa', icon: Home },
    { value: 'testemunho-publico', label: 'Testemunho Público', icon: Building2 },
    { value: 'testemunho-informal', label: 'Testemunho Informal', icon: Store },
    { value: 'outro', label: 'Outro', icon: MessageSquare }
  ];

  // Validação
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.endereco.trim()) {
      novosErros.endereco = 'Endereço é obrigatório';
    }

    if (!formData.primeiraConversa.trim()) {
      novosErros.primeiraConversa = 'Descreva a primeira conversa';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Adicionar publicação
  const adicionarPublicacao = () => {
    if (novaPublicacao.trim()) {
      setFormData({
        ...formData,
        publicacoesEntregues: [...formData.publicacoesEntregues, novaPublicacao.trim()]
      });
      setNovaPublicacao('');
    }
  };

  // Remover publicação
  const removerPublicacao = (index: number) => {
    setFormData({
      ...formData,
      publicacoesEntregues: formData.publicacoesEntregues.filter((_, i) => i !== index)
    });
  };

  // Salvar
  const handleSalvar = () => {
    if (!validarFormulario()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const novaRevisita: Omit<Revisita, 'id'> = {
        nome: formData.nome,
        avatar: formData.nome.split(' ').map(n => n[0]).join(''),
        telefone: formData.telefone,
        endereco: formData.endereco,
        origem: formData.origem,
        dataAdicao: revisita?.dataAdicao || new Date().toISOString(),
        quantidadeVisitas: revisita?.quantidadeVisitas || 1,
        status: formData.status,
        primeiraConversa: formData.primeiraConversa,
        publicacoesEntregues: formData.publicacoesEntregues,
        interesseEstudo: formData.interesseEstudo
      };

      if (isEdicao && revisita?.id) {
        DataService.atualizarRevisita(revisita.id, novaRevisita);
        toast.success('Revisita atualizada com sucesso! 🌱');
      } else {
        DataService.adicionarRevisita(novaRevisita);
        toast.success('Revisita adicionada com sucesso! 🌱');
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar revisita:', error);
      toast.error('Erro ao salvar revisita. Tente novamente.');
    }
  };

  // Deletar
  const handleDeletar = () => {
    if (!revisita?.id) return;

    if (confirm('Tem certeza que deseja remover esta revisita?')) {
      try {
        DataService.removerRevisita(revisita.id);
        toast.success('Revisita removida');
        onSave?.();
        onClose();
      } catch (error) {
        toast.error('Erro ao remover revisita');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 text-white px-6 pt-6 pb-4 z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-2xl flex items-center gap-2">
                <Sprout className="w-6 h-6" />
                {isEdicao ? 'Editar Revisita' : 'Nova Revisita'}
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {isEdicao ? 'Atualize as informações da revisita' : 'Registre uma nova revisita'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              Informações Básicas
            </h3>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="João da Silva"
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && (
                  <p className="text-xs text-red-600 mt-1">{errors.nome}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="telefone">Telefone (Opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="+55 11 99999-9999"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua das Flores, 123"
                    className={`pl-10 ${errors.endereco ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.endereco && (
                  <p className="text-xs text-red-600 mt-1">{errors.endereco}</p>
                )}
              </div>
            </div>
          </div>

          {/* Origem */}
          <div>
            <Label>Origem da Revisita *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {origens.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFormData({ ...formData, origem: value as any })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.origem === value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${
                    formData.origem === value ? 'text-green-600' : 'text-gray-600'
                  }`} />
                  <p className="text-xs text-center">{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Primeira Conversa */}
          <div>
            <Label htmlFor="primeiraConversa">Primeira Conversa *</Label>
            <textarea
              id="primeiraConversa"
              value={formData.primeiraConversa}
              onChange={(e) => setFormData({ ...formData, primeiraConversa: e.target.value })}
              placeholder="Descreva a primeira conversa e os interesses da pessoa..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                errors.primeiraConversa ? 'border-red-500' : ''
              }`}
            />
            {errors.primeiraConversa && (
              <p className="text-xs text-red-600 mt-1">{errors.primeiraConversa}</p>
            )}
          </div>

          {/* Publicações Entregues */}
          <div>
            <Label>Publicações Entregues</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={novaPublicacao}
                onChange={(e) => setNovaPublicacao(e.target.value)}
                placeholder="Ex: A Sentinela - Nov/2024"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarPublicacao())}
              />
              <Button 
                type="button"
                onClick={adicionarPublicacao}
                variant="outline"
              >
                Adicionar
              </Button>
            </div>

            {formData.publicacoesEntregues.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.publicacoesEntregues.map((pub, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm">{pub}</span>
                    <button
                      onClick={() => removerPublicacao(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status e Interesse */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="nova">Nova</option>
                <option value="quente">Quente</option>
                <option value="fria">Fria</option>
                <option value="descanso">Descanso</option>
              </select>
            </div>

            {/* Interesse em Estudo */}
            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                id="interesseEstudo"
                checked={formData.interesseEstudo}
                onChange={(e) => setFormData({ ...formData, interesseEstudo: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="interesseEstudo" className="cursor-pointer">
                Interesse em estudar
              </Label>
            </div>
          </div>

          {formData.interesseEstudo && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Dica:</strong> Quando estiver pronto, você pode converter esta revisita em um estudo bíblico!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
          {isEdicao && (
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleDeletar}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover Revisita
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleSalvar}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdicao ? 'Atualizar' : 'Salvar Revisita'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
