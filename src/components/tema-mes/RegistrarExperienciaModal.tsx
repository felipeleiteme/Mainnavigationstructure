import { useState } from 'react';
import { X, Smile, Heart, Zap, Sparkles, Bird } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { Qualidade } from '../../data/qualidades';
import { Calendar } from 'lucide-react';

interface RegistrarExperienciaModalProps {
  qualidade: Qualidade;
  onClose: () => void;
  onSalvar: (exp: { data: string; descricao: string; sentimento?: string }) => void;
}

export default function RegistrarExperienciaModal({
  qualidade,
  onClose,
  onSalvar,
}: RegistrarExperienciaModalProps) {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [descricao, setDescricao] = useState('');
  const [sentimento, setSentimento] = useState<string | undefined>();

  const sentimentos = [
    { icon: Smile, label: 'Alegre', color: '#F59E0B' },
    { icon: Heart, label: 'Grato', color: '#EC4899' },
    { icon: Zap, label: 'Forte', color: '#8B5CF6' },
    { icon: Sparkles, label: 'Inspirado', color: '#10B981' },
    { icon: Bird, label: 'Em paz', color: '#3B82F6' },
  ];

  const handleSalvar = () => {
    if (!descricao.trim()) {
      toast.error('Descreva o que aconteceu');
      return;
    }

    onSalvar({
      data,
      descricao: descricao.trim(),
      sentimento,
    });

    toast.success('Experiência registrada!', {
      description: `Mais um passo cultivando ${qualidade.nome.toLowerCase()}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className="sticky top-0 p-6 border-b flex items-center justify-between"
          style={{ backgroundColor: qualidade.cor.secundaria }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{qualidade.emoji}</span>
            <div>
              <h3 className="text-lg" style={{ color: qualidade.cor.texto }}>
                Registrar Experiência
              </h3>
              <p className="text-xs opacity-70" style={{ color: qualidade.cor.texto }}>
                {qualidade.nome}
              </p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Data */}
          <div>
            <Label htmlFor="data">Data (opcional)</Label>
            <div className="relative">
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="h-14 px-4 pr-12 bg-white border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                style={{ borderColor: '#D8CEE8' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-5 h-5" style={{ color: '#4A2C60' }} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Padrão: Hoje</p>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">
              O que aconteceu? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descricao"
              placeholder={`Descreva a situação onde você praticou ${qualidade.nome.toLowerCase()}...`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={5}
              className="resize-none min-h-[120px] bg-white"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {descricao.length}/500 caracteres
            </p>
          </div>

          {/* Sentimento */}
          <div>
            <Label>Como você se sentiu? (opcional)</Label>
            <div className="flex gap-3 mt-2">
              {sentimentos.map((s) => {
                const IconComponent = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => setSentimento(sentimento === s.label ? undefined : s.label)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                      sentimento === s.label
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: sentimento === s.label ? s.color : '#9CA3AF' }}
                    />
                    <span className="text-xs text-gray-600">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleSalvar}
              disabled={!descricao.trim()}
            >
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}