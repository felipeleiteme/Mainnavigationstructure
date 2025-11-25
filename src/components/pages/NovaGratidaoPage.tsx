import { ArrowLeft, Heart, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

interface NovaGratidaoPageProps {
  onVoltar: () => void;
  onSalvar: (data: string, texto: string) => void;
}

export default function NovaGratidaoPage({ onVoltar, onSalvar }: NovaGratidaoPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [novaGratidao, setNovaGratidao] = useState({ 
    data: new Date().toISOString().split('T')[0], 
    texto: '' 
  });

  const handleSalvar = () => {
    if (novaGratidao.texto.trim()) {
      onSalvar(novaGratidao.data, novaGratidao.texto);
      toast.success('Gratidão registrada!', {
        description: 'Salva no seu Diário de Gratidão',
      });
      onVoltar();
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FDF8EE' }}>
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
            <h2 className="text-xl">Nova Gratidão</h2>
            <p className="text-sm opacity-90">O que te fez sentir grato hoje?</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Data</label>
            <div className="relative">
              <Input
                type="date"
                value={novaGratidao.data}
                onChange={(e) => setNovaGratidao({ ...novaGratidao, data: e.target.value })}
                className="w-full h-14 px-4 pr-12 bg-white border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                style={{ borderColor: '#D8CEE8' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-5 h-5" style={{ color: '#4A2C60' }} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Pelo que você é grato?</label>
            <Textarea
              placeholder="Ex: Jeová me deu forças para superar um desafio hoje..."
              value={novaGratidao.texto}
              onChange={(e) => setNovaGratidao({ ...novaGratidao, texto: e.target.value })}
              className="resize-none min-h-[240px] px-4 py-4 bg-white border-2 text-base"
              style={{ borderColor: '#D8CEE8' }}
              rows={8}
              autoFocus
            />
          </div>
        </div>

        {/* Botão Salvar fixo na parte inferior */}
        <div className="fixed bottom-6 left-6 right-6 z-10">
          <Button 
            className="w-full text-white shadow-lg py-6 text-lg"
            style={{ backgroundColor: '#4A2C60' }}
            onClick={handleSalvar}
            disabled={!novaGratidao.texto.trim()}
          >
            <Heart className="w-5 h-5 mr-2" />
            Salvar Gratidão
          </Button>
        </div>
      </div>
    </div>
  );
}