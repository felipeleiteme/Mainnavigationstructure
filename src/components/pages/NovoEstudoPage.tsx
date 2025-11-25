import { ArrowLeft, BookOpen, User, Phone, MapPin, Calendar, Clock, Trash2, Sprout, HelpCircle, Target, MessageCircle, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { DataService, Estudo } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

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
      toast.error('Preencha o nome do estudante');
      return;
    }

    if (!formData.estudanteEndereco.trim()) {
      toast.error('Preencha o endereço completo');
      return;
    }

    if (!formData.publicacao.trim()) {
      toast.error('Selecione a publicação');
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
      toast.success('Estudo atualizado! 🎉', {
        description: 'As informações foram salvas',
      });
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
      toast.success('Estudo criado! 🎉', {
        description: `${formData.estudanteNome} foi adicionado à lista`,
      });
    }

    onVoltar();
  };

  const handleExcluir = () => {
    if (!estudoEditar) return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o estudo bíblico com ${formData.estudanteNome}?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmar) {
      DataService.removerEstudo(estudoEditar.id);
      toast.success('Estudo excluído', {
        description: 'Os dados foram removidos permanentemente',
      });
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
      {/* Header Fixo - Padrão Brandbook */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-primary-600 to-primary-500 text-white">
        <div className="flex items-center gap-4 px-6 pt-12 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl truncate">{modoEdicao ? 'Editar Estudo' : 'Novo Estudo Bíblico'}</h2>
            <p className="text-sm opacity-90">
              {modoEdicao ? 'Atualize as informações' : 'Cadastre um novo estudante'}
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
              <span className="text-2xl">🎉</span>
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
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-primary-700">
            <User className="w-5 h-5" />
            Informações de Contato
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                placeholder="Ex: Maria Silva"
                value={formData.estudanteNome}
                onChange={(e) => handleChange('estudanteNome', e.target.value)}
                className="h-14 px-4 bg-white border-2 border-primary-200 focus:border-primary-500"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (opcional)</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.estudanteTelefone}
                onChange={(e) => handleChange('estudanteTelefone', e.target.value)}
                className="h-14 px-4 bg-white border-2 border-primary-200 focus:border-primary-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço completo *</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro, cidade"
                value={formData.estudanteEndereco}
                onChange={(e) => handleChange('estudanteEndereco', e.target.value)}
                className="h-14 px-4 bg-white border-2 border-primary-200 focus:border-primary-500"
              />
            </div>
          </div>
        </Card>

        {/* Card: Detalhes do Estudo */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-primary-700">
            <BookOpen className="w-5 h-5" />
            Detalhes do Estudo
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="publicacao">Publicação *</Label>
              <div className="relative">
                <select
                  id="publicacao"
                  value={formData.publicacao}
                  onChange={(e) => handleChange('publicacao', e.target.value)}
                  className="w-full h-14 px-4 pr-10 bg-white border-2 border-primary-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {publicacoes.map((pub, idx) => (
                    <option key={idx} value={pub}>{pub}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Status do progresso</Label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleChange('status', status.id)}
                    type="button"
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      formData.status === status.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <status.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary-700">
                        {status.nome}
                      </p>
                      <p className="text-xs text-gray-600">{status.descricao}</p>
                    </div>
                    {formData.status === status.id && (
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-primary-700">
            <Calendar className="w-5 h-5" />
            Agendamento
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data">Próxima data</Label>
              <div className="relative">
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleChange('data', e.target.value)}
                  className="h-14 px-4 pr-12 bg-white border-2 border-primary-200 focus:border-primary-500 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <div className="relative">
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => handleChange('horario', e.target.value)}
                  className="h-14 px-4 pr-12 bg-white border-2 border-primary-200 focus:border-primary-500 [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Clock className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Observações */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-primary-700">
            <MessageSquare className="w-5 h-5" />
            Observações
          </h3>
          
          <Textarea
            placeholder="Ex: Estudante muito interessado, faz boas perguntas..."
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            className="resize-none min-h-[120px] bg-white border-2 border-primary-200 focus:border-primary-500"
            rows={5}
          />
        </Card>

        {/* Card: Zona de Perigo (apenas ao editar) */}
        {modoEdicao && (
          <Card className="p-5 border-red-200 bg-red-50">
            <h3 className="mb-4 text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Zona de Perigo
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Ao excluir este estudo bíblico, todos os dados do estudante e histórico serão removidos permanentemente. Esta ação não pode ser desfeita.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
              onClick={handleExcluir}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Estudo
            </Button>
          </Card>
        )}

        {/* Botão Salvar */}
        <Button 
          variant="default"
          className="w-full py-6 text-lg shadow-lg"
          onClick={handleSalvar}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {modoEdicao ? 'Salvar Alterações' : 'Criar Estudo Bíblico'}
        </Button>
      </div>
    </div>
  );
}
