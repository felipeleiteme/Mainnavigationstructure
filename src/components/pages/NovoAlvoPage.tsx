import { ArrowLeft, Target, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

interface NovoAlvoPageProps {
  onVoltar: () => void;
  onSalvar: (titulo: string, meta: string, prazo: string) => void;
}

export default function NovoAlvoPage({ onVoltar, onSalvar }: NovoAlvoPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [novoAlvo, setNovoAlvo] = useState({ 
    titulo: '', 
    meta: '', 
    prazo: '' 
  });

  const handleSalvar = () => {
    if (novoAlvo.titulo.trim()) {
      onSalvar(novoAlvo.titulo, novoAlvo.meta, novoAlvo.prazo);
      toast.success('Alvo criado! 🎯', {
        description: 'Boa sorte nessa jornada!',
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
            <h2 className="text-xl">Novo Alvo Espiritual</h2>
            <p className="text-sm opacity-90">Estabeleça um objetivo espiritual</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Qual seu alvo? *</label>
            <Input
              type="text"
              placeholder="Ex: Ler toda a Bíblia"
              value={novoAlvo.titulo}
              onChange={(e) => setNovoAlvo({...novoAlvo, titulo: e.target.value})}
              className="h-14 px-4 bg-white border-2"
              style={{ borderColor: '#D8CEE8' }}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Meta (opcional)</label>
            <Textarea
              placeholder="Ex: 3 capítulos por dia"
              value={novoAlvo.meta}
              onChange={(e) => setNovoAlvo({...novoAlvo, meta: e.target.value})}
              className="resize-none min-h-[100px] px-4 py-4 bg-white border-2"
              style={{ borderColor: '#D8CEE8' }}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Prazo (opcional)</label>
            <div className="relative">
              <Input
                type="date"
                value={novoAlvo.prazo}
                onChange={(e) => setNovoAlvo({...novoAlvo, prazo: e.target.value})}
                className="h-14 px-4 pr-12 bg-white border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                style={{ borderColor: '#D8CEE8' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-5 h-5" style={{ color: '#4A2C60' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Botão Salvar fixo na parte inferior */}
        <div className="fixed bottom-6 left-6 right-6 z-10">
          <Button 
            className="w-full text-white shadow-lg py-6 text-lg"
            style={{ backgroundColor: '#4A2C60' }}
            onClick={handleSalvar}
            disabled={!novoAlvo.titulo.trim()}
          >
            <Target className="w-5 h-5 mr-2" />
            Criar Alvo
          </Button>
        </div>
      </div>
    </div>
  );
}