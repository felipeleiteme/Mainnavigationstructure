import { X, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { DataService, TipoPublicador } from '../../services/dataService';
import { toast } from 'sonner';

interface EditarTipoPublicadorModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function EditarTipoPublicadorModal({ onClose, onSave }: EditarTipoPublicadorModalProps) {
  const perfil = DataService.getPerfil();
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPublicador>(perfil.tipoPublicador);

  const opcoes: { valor: TipoPublicador; label: string; meta: number; descricao: string }[] = [
    {
      valor: 'publicador-regular',
      label: 'Publicador Regular',
      meta: 10,
      descricao: 'Meta sugerida de 10 horas mensais'
    },
    {
      valor: 'pioneiro-auxiliar-30',
      label: 'Pioneiro Auxiliar (30h)',
      meta: 30,
      descricao: 'Compromisso de 30 horas mensais'
    },
    {
      valor: 'pioneiro-auxiliar-50',
      label: 'Pioneiro Auxiliar (50h)',
      meta: 50,
      descricao: 'Compromisso de 50 horas mensais'
    },
    {
      valor: 'pioneiro-regular',
      label: 'Pioneiro Regular',
      meta: 70,
      descricao: 'Compromisso de 70 horas mensais'
    },
  ];

  const handleSalvar = () => {
    DataService.updatePerfil({ tipoPublicador: tipoSelecionado });
    toast.success('Tipo de publicador atualizado!', {
      description: `Meta mensal: ${DataService.getMetaMensal()}h`,
    });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6 pt-6 pb-4 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl">Tipo de Publicador</h2>
              <p className="text-sm opacity-90 mt-1">Escolha seu tipo de serviço</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-6 space-y-3">
          {opcoes.map((opcao) => (
            <button
              key={opcao.valor}
              onClick={() => setTipoSelecionado(opcao.valor)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                tipoSelecionado === opcao.valor
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`mb-1 ${tipoSelecionado === opcao.valor ? 'text-indigo-900' : 'text-gray-900'}`}>
                    {opcao.label}
                  </p>
                  <p className="text-sm text-gray-600">{opcao.descricao}</p>
                </div>
                {tipoSelecionado === opcao.valor && (
                  <div className="ml-3 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  Meta: {opcao.meta}h/mês
                </div>
              </div>
            </button>
          ))}

          <div className="p-4 rounded-lg border mt-4" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-500" />
              <span><strong>Dica:</strong> A meta mensal é ajustada automaticamente de acordo com o tipo selecionado.
              Você pode acompanhar seu progresso na tela Início.</span>
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSalvar}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}