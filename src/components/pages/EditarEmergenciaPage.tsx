import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';

interface EditarEmergenciaPageProps {
  onVoltar: () => void;
}

export default function EditarEmergenciaPage({ onVoltar }: EditarEmergenciaPageProps) {
  const [validadeDPA, setValidadeDPA] = useState('2025-12-15');
  const [contatoEmergencia, setContatoEmergencia] = useState('Ana Silva');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('(11) 98765-4321');
  const [alergias, setAlergias] = useState('');

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSalvar = () => {
    if (!validadeDPA) {
      toast.error('A validade do DPA é obrigatória');
      return;
    }

    if (!contatoEmergencia.trim()) {
      toast.error('O contato de emergência é obrigatório');
      return;
    }

    if (!telefoneEmergencia.trim()) {
      toast.error('O telefone de emergência é obrigatório');
      return;
    }

    // Aqui seria onde salvamos no DataService
    toast.success('Informações atualizadas! 🚨', {
      description: 'Dados de emergência salvos com sucesso.',
    });

    onVoltar();
  };

  // Formatar data para exibição
  const formatarData = (data: string) => {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pb-20" style={{ backgroundColor: '#FDF8EE' }}>
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
            <h2 className="text-xl">Editar Emergência</h2>
            <p className="text-sm opacity-90">Informações médicas importantes</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Aviso */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#FFF5F5', borderColor: '#FEB2B2' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" style={{ color: '#DC2626' }} />
            <div>
              <h3 className="mb-2">Informações Sensíveis</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Estes dados são importantes para situações de emergência médica. 
                Certifique-se de mantê-los sempre atualizados.
              </p>
            </div>
          </div>
        </Card>

        {/* Formulário */}
        <Card className="p-6">
          <div className="space-y-5">
            {/* Campo: Validade DPA */}
            <div>
              <label className="block text-sm mb-2">
                Validade do DPA: <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={validadeDPA}
                onChange={(e) => setValidadeDPA(e.target.value)}
                className="w-full h-14 px-4 pr-12 bg-white border-2 rounded-lg [&::-webkit-calendar-picker-indicator]:opacity-0"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Data de validade do documento
              </p>
            </div>

            {/* Campo: Contato de Emergência */}
            <div>
              <label className="block text-sm mb-2">
                Contato de Emergência: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={contatoEmergencia}
                onChange={(e) => setContatoEmergencia(e.target.value)}
                placeholder="Nome do contato"
                className="w-full h-14 px-4 bg-white border-2 rounded-lg"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pessoa para contatar em caso de emergência
              </p>
            </div>

            {/* Campo: Telefone de Emergência */}
            <div>
              <label className="block text-sm mb-2">
                Telefone de Emergência: <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={telefoneEmergencia}
                onChange={(e) => setTelefoneEmergencia(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full h-14 px-4 bg-white border-2 rounded-lg"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Número do contato de emergência
              </p>
            </div>

            {/* Campo: Alergias */}
            <div>
              <label className="block text-sm mb-2">
                Alergias (opcional):
              </label>
              <textarea
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                placeholder="Ex: Penicilina, frutos do mar, pólen..."
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-lg resize-none"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Liste quaisquer alergias médicas ou alimentares
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <h3 className="mb-4">Pré-visualização</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Validade do DPA:</span>
              <span className="font-medium">{formatarData(validadeDPA)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Contato de emergência:</span>
              <span className="font-medium">{contatoEmergencia || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">{telefoneEmergencia || '—'}</span>
            </div>
            {alergias && (
              <div className="py-3">
                <span className="text-gray-600 block mb-2">Alergias:</span>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{alergias}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          className="w-full py-6 hover:opacity-90 text-white"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={handleSalvar}
        >
          Salvar Informações de Emergência
        </Button>
      </div>
    </div>
  );
}