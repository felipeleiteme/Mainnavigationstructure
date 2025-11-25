import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface MarcarLeituraDialogProps {
  livro: string;
  capitulo: string;
  onConfirmar: (reflexao?: { aprendizado: string; aplicacao: string; palavra: string }) => void;
  onCancelar: () => void;
}

export default function MarcarLeituraDialog({ 
  livro, 
  capitulo, 
  onConfirmar, 
  onCancelar 
}: MarcarLeituraDialogProps) {
  const [mostrarReflexao, setMostrarReflexao] = useState(false);
  const [aprendizado, setAprendizado] = useState('');
  const [aplicacao, setAplicacao] = useState('');
  const [palavra, setPalavra] = useState('');

  const handleMarcarConcluido = () => {
    if (mostrarReflexao && (aprendizado || aplicacao || palavra)) {
      onConfirmar({ aprendizado, aplicacao, palavra });
    } else {
      onConfirmar();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl text-primary-700">Marcar Leitura</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelar}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 pb-32 space-y-6">
          {/* Info da leitura */}
          <Card className="p-5 bg-primary-50 border-2 border-primary-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Você leu:</p>
                <p className="text-xl text-primary-700">{livro} {capitulo}</p>
              </div>
            </div>
          </Card>

          {/* Opção de adicionar reflexão */}
          {!mostrarReflexao && (
            <Button
              variant="outline"
              className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50"
              onClick={() => setMostrarReflexao(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Adicionar Reflexão (opcional)
            </Button>
          )}

          {/* Formulário de reflexão */}
          {mostrarReflexao && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-primary-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary-600" />
                  Sua Reflexão
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMostrarReflexao(false)}
                  className="text-xs text-gray-500"
                >
                  Remover
                </Button>
              </div>

              <div>
                <Label htmlFor="aprendizado" className="text-sm text-gray-700 mb-2 block">
                  O que você aprendeu?
                </Label>
                <Textarea
                  id="aprendizado"
                  placeholder="Digite aqui seu aprendizado..."
                  value={aprendizado}
                  onChange={(e) => setAprendizado(e.target.value)}
                  className="min-h-[100px] bg-white"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="aplicacao" className="text-sm text-gray-700 mb-2 block">
                  Como pode aplicar?
                </Label>
                <Textarea
                  id="aplicacao"
                  placeholder="Digite como pode aplicar na sua vida..."
                  value={aplicacao}
                  onChange={(e) => setAplicacao(e.target.value)}
                  className="min-h-[100px] bg-white"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="palavra" className="text-sm text-gray-700 mb-2 block">
                  Palavra-chave do dia
                </Label>
                <input
                  id="palavra"
                  type="text"
                  placeholder="Ex: Amor, Fé, Perseverança..."
                  value={palavra}
                  onChange={(e) => setPalavra(e.target.value)}
                  className="w-full h-14 px-4 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: '#D8CEE8', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                  onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botões de ação - FIXOS NO BOTTOM */}
        <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t z-20">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancelar}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              style={{ backgroundColor: '#4A2C60', color: 'white' }}
              onClick={handleMarcarConcluido}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmar Leitura
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}