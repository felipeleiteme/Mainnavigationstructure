import { X, BookOpen, User, Phone, MapPin, Calendar, Clock, Save, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { useState, useEffect } from 'react';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner';

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
    publicacao: estudo?.publicacao || 'Boas Notícias do Reino de Deus',
    licao: estudo?.licao || 1,
    data: estudo?.data ? new Date(estudo.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    horario: estudo?.horario || '14:00',
    status: estudo?.status || 'iniciando' as const,
    progresso: estudo?.progresso || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Publicações disponíveis
  const publicacoes = [
    'Boas Notícias do Reino de Deus',
    'O Que a Bíblia Realmente Ensina?',
    'Desfrute da Vida',
    'Achegue-se a Jeová',
    'Bíblia'
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
      toast.error('Por favor, preencha todos os campos obrigatórios');
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
        toast.success('Estudo atualizado com sucesso! 📖');
      } else {
        // Adicionar novo estudo
        DataService.adicionarEstudo(novoEstudo);
        toast.success(
          isConversao 
            ? '🎉 Revisita convertida em estudo! Parabéns!' 
            : 'Estudo adicionado com sucesso! 📖'
        );
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar estudo:', error);
      toast.error('Erro ao salvar estudo. Tente novamente.');
    }
  };

  // Deletar
  const handleDeletar = () => {
    if (!estudo?.id) return;

    if (confirm('Tem certeza que deseja remover este estudo?')) {
      try {
        DataService.removerEstudo(estudo.id);
        toast.success('Estudo removido');
        onSave?.();
        onClose();
      } catch (error) {
        toast.error('Erro ao remover estudo');
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
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 pt-6 pb-4 z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                {isConversao ? 'Iniciar Estudo Bíblico' : isEdicao ? 'Editar Estudo' : 'Novo Estudo Bíblico'}
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {isConversao 
                  ? '🎉 Parabéns! Uma revisita se tornou estudante!' 
                  : isEdicao 
                  ? 'Atualize as informações do estudo' 
                  : 'Registre um novo estudo bíblico'}
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
          {/* Informações do Estudante */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
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
                  className={errors.estudanteNome ? 'border-red-500' : ''}
                />
                {errors.estudanteNome && (
                  <p className="text-xs text-red-600 mt-1">{errors.estudanteNome}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="telefone">Telefone (Opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="telefone"
                    value={formData.estudanteTelefone}
                    onChange={(e) => setFormData({ ...formData, estudanteTelefone: e.target.value })}
                    placeholder="+55 11 99999-9999"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <Label htmlFor="endereco">Endereço (Opcional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua das Flores, 123"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Publicação e Progresso */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Publicação
            </h3>

            <div className="space-y-4">
              {/* Publicação */}
              <div>
                <Label htmlFor="publicacao">Publicação *</Label>
                <select
                  id="publicacao"
                  value={formData.publicacao}
                  onChange={(e) => setFormData({ ...formData, publicacao: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {publicacoes.map(pub => (
                    <option key={pub} value={pub}>{pub}</option>
                  ))}
                </select>
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
                  />
                  <p className="text-xs text-gray-600 mt-1">Lições de 1 a 10</p>
                </div>
              )}

              {/* Status */}
              <div>
                <Label htmlFor="status">Status do Estudo</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="iniciando">Iniciando</option>
                  <option value="progredindo">Progredindo</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              {/* Progresso */}
              <div>
                <Label>Progresso: {formData.progresso}%</Label>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${formData.progresso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Agendamento */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              {isEdicao ? 'Último Estudo' : 'Próximo Estudo'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Data */}
              <div>
                <Label htmlFor="data">Data *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className={`pl-10 ${errors.data ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Horário */}
              <div>
                <Label htmlFor="horario">Horário *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    className={`pl-10 ${errors.horario ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
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
              Remover Estudo
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSalvar}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEdicao ? 'Atualizar' : 'Salvar Estudo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
