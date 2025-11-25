import { ArrowLeft, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';

interface EditarTextoAnoPageProps {
  onVoltar: () => void;
}

export default function EditarTextoAnoPage({ onVoltar }: EditarTextoAnoPageProps) {
  const perfil = DataService.getPerfil();
  
  const [texto, setTexto] = useState(
    perfil.textoAno?.texto || 'Dêem a Jeová a glória que o seu nome merece.'
  );
  const [referencia, setReferencia] = useState(
    perfil.textoAno?.referencia || 'Sal. 96:8'
  );

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSalvar = () => {
    if (!texto.trim()) {
      toast.error('O texto não pode estar vazio');
      return;
    }

    if (!referencia.trim()) {
      toast.error('A referência não pode estar vazia');
      return;
    }

    DataService.updatePerfil({
      textoAno: {
        texto: texto.trim(),
        referencia: referencia.trim()
      }
    });

    toast.success('Texto do Ano atualizado! 📖', {
      description: 'Visível na tela de Início',
    });

    onVoltar();
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
            <h2 className="text-xl">Editar Texto do Ano</h2>
            <p className="text-sm opacity-90">Personalize o versículo da tela inicial</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Dica */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#F5F2F7', borderColor: '#D8CEE8' }}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-8 h-8 flex-shrink-0" style={{ color: '#4A2C60' }} />
            <div>
              <h3 className="mb-2">Como funciona?</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Este texto aparecerá no topo da tela de Início, logo abaixo da saudação. 
                Escolha um versículo que inspire sua jornada espiritual.
              </p>
              <p className="text-xs text-gray-600 italic">
                Dica: Você pode usar o tema anual da Organização ou escolher um texto pessoal.
              </p>
            </div>
          </div>
        </Card>

        {/* Formulário */}
        <Card className="p-6">
          <div className="space-y-5">
            {/* Campo: Texto */}
            <div>
              <label className="block text-sm mb-2">
                Texto Bíblico: <span className="text-red-600">*</span>
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex: Dêem a Jeová a glória que o seu nome merece."
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-lg resize-none"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o versículo completo entre aspas
              </p>
            </div>

            {/* Campo: Referência Bíblica */}
            <div>
              <label className="block text-sm mb-2">
                Referência Bíblica: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                placeholder="Ex: Filipenses 4:13"
                className="w-full h-14 px-4 bg-white border-2 rounded-lg"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o livro, capítulo e versículo
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <h3 className="mb-4">Pré-visualização</h3>
          <div className="text-white rounded-xl p-4" style={{ backgroundColor: '#4A2C60' }}>
            <p className="text-xs font-medium opacity-75 mb-1">Texto do Ano</p>
            <p className="text-sm opacity-90 italic">
              "{texto || 'Seu texto aparecerá aqui...'}"
            </p>
            <p className="text-xs opacity-75 mt-1">
              — {referencia || 'Referência'}
            </p>
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          className="w-full py-6 hover:opacity-90"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={handleSalvar}
        >
          Salvar Texto do Ano
        </Button>
      </div>
    </div>
  );
}