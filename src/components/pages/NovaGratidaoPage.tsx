import { ArrowLeft, Heart, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

interface GratidaoEntry {
  id: string;
  data: string;
  texto: string;
}

interface NovaGratidaoPageProps {
  onVoltar: () => void;
  onSalvar: (data: string, texto: string, id?: string) => void;
  entryEditando?: GratidaoEntry;
}

export default function NovaGratidaoPage({ onVoltar, onSalvar, entryEditando }: NovaGratidaoPageProps) {
  const t = useTranslations();
  
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [novaGratidao, setNovaGratidao] = useState({ 
    data: entryEditando?.data || new Date().toISOString().split('T')[0], 
    texto: entryEditando?.texto || '' 
  });

  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  const handleSalvar = () => {
    const { texto } = novaGratidao;
    if (!texto.trim()) {
      toast.error(t.newGratitude.toastErrorEmpty);
      return;
    }
    onSalvar(novaGratidao.data, novaGratidao.texto, entryEditando?.id);
    toast.success(
      entryEditando ? t.newGratitude.toastSuccessEdit : t.newGratitude.toastSuccessNew, 
      {
        description: entryEditando ? t.newGratitude.toastSuccessEditDesc : t.newGratitude.toastSuccessNewDesc,
      }
    );
    onVoltar();
  };

  return (
    <div 
      className="min-h-screen pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
      >
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
            <h2 className="text-xl">{entryEditando ? t.newGratitude.headerTitleEdit : t.newGratitude.headerTitleNew}</h2>
            <p className="text-sm opacity-90">{entryEditando ? t.newGratitude.headerSubtitleEdit : t.newGratitude.headerSubtitleNew}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label 
              className="text-sm"
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            >
              {t.newGratitude.dateLabel}
            </label>
            <div className="relative">
              <Input
                type="date"
                value={novaGratidao.data}
                onChange={(e) => setNovaGratidao({ ...novaGratidao, data: e.target.value })}
                className="w-full h-14 px-4 pr-12 border-2 [&::-webkit-calendar-picker-indicator]:opacity-0"
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: '#D8CEE8',
                  color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
                }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar 
                  className="w-5 h-5" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label 
              className="text-sm"
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            >
              {t.newGratitude.gratitudeLabel}
            </label>
            <Textarea
              placeholder={t.newGratitude.gratitudePlaceholder}
              value={novaGratidao.texto}
              onChange={(e) => setNovaGratidao({ ...novaGratidao, texto: e.target.value })}
              className="resize-none min-h-[240px] px-4 py-4 border-2 text-base"
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                borderColor: '#D8CEE8',
                color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
              }}
              rows={8}
              autoFocus
            />
          </div>
        </div>

        {/* Botão Salvar abaixo do textarea */}
        <button 
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer"
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
            border: 'none',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
          }}
          onClick={handleSalvar}
          disabled={!novaGratidao.texto.trim()}
        >
          <Heart className="w-5 h-5 mr-2" />
          {entryEditando ? t.newGratitude.buttonSaveEdit : t.newGratitude.buttonSaveNew}
        </button>
      </div>
    </div>
  );
}