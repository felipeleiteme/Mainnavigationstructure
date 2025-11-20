import { useState } from 'react';
import { X, BookOpen, Clock, MapPin, Phone, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface Revisita {
  id: string;
  nome: string;
  endereco: string;
  telefone?: string;
  disponibilidade: string;
  [key: string]: any;
}

interface IniciarEstudoFlowProps {
  revisita: Revisita;
  onClose: () => void;
  onComplete: (estudo: any) => void;
}

export default function IniciarEstudoFlow({ revisita, onClose, onComplete }: IniciarEstudoFlowProps) {
  const [step, setStep] = useState<'confirmacao' | 'formulario' | 'lembretes'>('confirmacao');
  const [formData, setFormData] = useState({
    nome: revisita.nome,
    endereco: revisita.endereco,
    telefone: revisita.telefone || '',
    disponibilidade: revisita.disponibilidade,
    publicacao: '',
    licao: '',
    diaSemana: '',
    horario: '',
  });

  const handleConfirmar = () => {
    setStep('formulario');
  };

  const handleCriarEstudo = () => {
    setStep('lembretes');
  };

  const handleFinalizarComLembretes = (ativar: boolean) => {
    const novoEstudo = {
      id: revisita.id,
      nome: formData.nome,
      endereco: formData.endereco,
      telefone: formData.telefone,
      publicacao: formData.publicacao,
      licaoAtual: formData.licao,
      proximoEstudo: `${formData.diaSemana}, ${formData.horario}`,
      ultimaConversa: 'Hoje',
      progresso: 'iniciando',
      lembreteAtivo: ativar,
      isHoje: false,
      disponibilidade: formData.disponibilidade,
    };

    // Salvar no localStorage
    const estudosExistentes = JSON.parse(localStorage.getItem('estudosBiblicos') || '[]');
    const novosEstudos = [...estudosExistentes, novoEstudo];
    localStorage.setItem('estudosBiblicos', JSON.stringify(novosEstudos));

    // Atualizar status da revisita
    const revisitasExistentes = JSON.parse(localStorage.getItem('revisitas') || '[]');
    const revisitasAtualizadas = revisitasExistentes.map((r: any) => 
      r.id === revisita.id ? { ...r, emEstudo: true } : r
    );
    localStorage.setItem('revisitas', JSON.stringify(revisitasAtualizadas));

    toast.success('Estudo bíblico iniciado! 🎉', {
      description: `${formData.nome} agora está na aba Estudos`,
      duration: 3000,
    });

    onComplete(novoEstudo);
    onClose();
  };

  // Modal de Confirmação
  if (step === 'confirmacao') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Iniciar Estudo Bíblico?</h3>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Transformar <strong>{revisita.nome}</strong> em estudo bíblico?
            </p>
            <p className="text-sm text-gray-600">
              Todos os dados serão mantidos e a pessoa aparecerá na aba de Estudos. É só isso! 😊
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirmar}
            >
              Sim, iniciar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Formulário de Criação
  if (step === 'formulario') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl">Criar Estudo Bíblico</h2>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            {/* Dados pessoais (pré-preenchidos) */}
            <Card className="p-4 bg-green-50 border-green-200">
              <p className="text-sm text-green-800 mb-2">✓ Informações já preenchidas</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Nome:</span>
                  <span>{formData.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Endereço:</span>
                  <span className="text-sm">{formData.endereco}</span>
                </div>
                {formData.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Telefone:</span>
                    <span>{formData.telefone}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Novos campos */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="publicacao" className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4" />
                  Publicação sendo estudada
                </Label>
                <Select 
                  value={formData.publicacao}
                  onValueChange={(value) => setFormData({ ...formData, publicacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a publicação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boas Notícias de Deus">Boas Notícias de Deus</SelectItem>
                    <SelectItem value="O Que a Bíblia Ensina">O Que a Bíblia Ensina</SelectItem>
                    <SelectItem value="Bíblia">Bíblia</SelectItem>
                    <SelectItem value="Desfrute a Vida">Desfrute a Vida</SelectItem>
                    <SelectItem value="Outra">Outra publicação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="licao">Lição/Capítulo inicial</Label>
                <Input
                  id="licao"
                  placeholder="Ex: Lição 1"
                  value={formData.licao}
                  onChange={(e) => setFormData({ ...formData, licao: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="diaSemana" className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    Dia da semana
                  </Label>
                  <Select
                    value={formData.diaSemana}
                    onValueChange={(value) => setFormData({ ...formData, diaSemana: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Segunda">Segunda</SelectItem>
                      <SelectItem value="Terça">Terça</SelectItem>
                      <SelectItem value="Quarta">Quarta</SelectItem>
                      <SelectItem value="Quinta">Quinta</SelectItem>
                      <SelectItem value="Sexta">Sexta</SelectItem>
                      <SelectItem value="Sábado">Sábado</SelectItem>
                      <SelectItem value="Domingo">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="horario">Horário</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              onClick={handleCriarEstudo}
              disabled={!formData.publicacao || !formData.licao || !formData.diaSemana || !formData.horario}
            >
              Criar Estudo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Configurar Lembretes
  if (step === 'lembretes') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl mb-2">Ativar Lembretes?</h3>
            <p className="text-sm text-gray-600">
              Receba notificações 1 hora antes do estudo com {formData.nome}
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handleFinalizarComLembretes(true)}
            >
              Sim, ativar lembretes
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => handleFinalizarComLembretes(false)}
            >
              Agora não
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}