import { ArrowLeft, Target, Calendar, TrendingUp, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { DataService, Alvo } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';

interface EditarAlvoPageProps {
  alvo: Alvo;
  onVoltar: () => void;
}

export default function EditarAlvoPage({ alvo, onVoltar }: EditarAlvoPageProps) {
  const [titulo, setTitulo] = useState(alvo.titulo);
  const [descricao, setDescricao] = useState(alvo.descricao || '');
  const [prazo, setPrazo] = useState(alvo.prazo || '');
  const [progresso, setProgresso] = useState(alvo.progresso);

  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSalvar = () => {
    if (!titulo.trim()) {
      toast.error('Precisamos de um título para o alvo', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    DataService.atualizarAlvo(alvo.id, {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      prazo,
      progresso,
    });

    toast.success('Alvo atualizado!', {
      description: `Progresso atual: ${progresso}%`,
      icon: <Check className="w-5 h-5" />
    });

    onVoltar();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
      >
        <div className="flex items-center gap-4 px-6 pt-12 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">Editar Alvo Espiritual</h2>
            <p className="text-sm opacity-90">Atualize seu progresso</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card 1: Informações Básicas */}
        <Card 
          className="p-6"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
          >
            <Target 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
            />
            Informações do Alvo
          </h3>
          
          <div className="space-y-5">
            {/* Título */}
            <div>
              <Label 
                htmlFor="titulo" 
                className="flex items-center gap-2 mb-2"
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4B5563' }}
              >
                Título do Alvo *
              </Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Ler a Bíblia inteira em 1 ano"
                className="h-14 border-2 focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                  borderColor: '#D8CEE8', 
                  outline: 'none',
                  color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
              />
            </div>

            {/* Descrição/Meta */}
            <div>
              <Label 
                htmlFor="descricao" 
                className="flex items-center gap-2 mb-2"
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4B5563' }}
              >
                Descrição ou Meta
              </Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Seguir o cronograma de leitura diária para ler toda a Bíblia até dezembro"
                className="resize-none border-2 focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                  borderColor: '#D8CEE8', 
                  outline: 'none',
                  color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
                rows={4}
              />
            </div>

            {/* Prazo */}
            <div>
              <Label 
                htmlFor="prazo" 
                className="flex items-center gap-2 mb-2"
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4B5563' }}
              >
                <Calendar 
                  className="w-4 h-4" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                />
                Prazo
              </Label>
              <div className="relative">
                <Input
                  id="prazo"
                  type="date"
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                  className="h-14 border-2 focus:ring-2 focus:ring-opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={{ 
                    backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                    borderColor: '#D8CEE8', 
                    outline: 'none',
                    color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar 
                    className="w-5 h-5" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Progresso */}
        <Card 
          className="p-6 border-2" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FDFBFF',
            borderColor: temaAtual === 'escuro' ? '#C8E046' : '#D8CEE8'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
          >
            <TrendingUp 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
            />
            Atualizar Progresso
          </h3>

          <div className="space-y-5">
            {/* Porcentagem atual */}
            <div className="text-center">
              <div 
                className="text-6xl mb-2" 
                style={{ color: '#C8E046' }}
              >
                {progresso}%
              </div>
              <p 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                Progresso Atual
              </p>
            </div>

            {/* Slider de progresso */}
            <div className="space-y-3">
              <Label 
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4B5563' }}
              >
                Ajuste o progresso:
              </Label>
              <Slider
                value={[progresso]}
                onValueChange={(value) => setProgresso(value[0])}
                max={100}
                step={5}
                className="w-full"
              />
              <div 
                className="flex justify-between text-xs"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Atalhos rápidos */}
            <div>
              <Label 
                className="mb-2 block"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4B5563' }}
              >
                Atalhos:
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 25, 50, 75, 100].map((valor) => (
                  <Button
                    key={valor}
                    size="sm"
                    variant="outline"
                    onClick={() => setProgresso(valor)}
                    className={`${progresso === valor ? 'border-2' : ''}`}
                    style={progresso === valor 
                      ? { 
                          borderColor: '#C8E046', 
                          backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(200, 224, 70, 0.1)',
                          color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        } 
                      : {
                          backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                          color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937',
                          borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB'
                        }
                    }
                  >
                    {valor}%
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback visual */}
            {progresso === 100 && (
              <div 
                className="p-4 border-2 rounded-lg text-center"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4',
                  borderColor: temaAtual === 'escuro' ? '#22C55E' : '#86EFAC'
                }}
              >
                <p 
                  className="flex items-center justify-center gap-2"
                  style={{ color: temaAtual === 'escuro' ? '#22C55E' : '#15803D' }}
                >
                  <Target className="w-5 h-5" />
                  Parabéns! Você alcançou 100%!
                </p>
                <p 
                  className="text-sm mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#86EFAC' : '#16A34A' }}
                >
                  Ao salvar, este alvo será marcado como concluído.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          className="w-full h-14 border-0"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            if (temaAtual === 'escuro') {
              e.currentTarget.style.backgroundColor = '#B5CC3D';
            } else {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (temaAtual === 'escuro') {
              e.currentTarget.style.backgroundColor = '#C8E046';
            } else {
              e.currentTarget.style.opacity = '1';
            }
          }}
          onClick={handleSalvar}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}