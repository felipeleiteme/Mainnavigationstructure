import { ArrowLeft, Target, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

interface NovoAlvoPageProps {
  onVoltar: () => void;
  onSalvar: (titulo: string, meta: string, prazo: string) => void;
}

export default function NovoAlvoPage({ onVoltar, onSalvar }: NovoAlvoPageProps) {
  const t = useTranslations();
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  const [novoAlvo, setNovoAlvo] = useState({ 
    titulo: '', 
    meta: '', 
    prazo: '' 
  });

  const handleSalvar = () => {
    if (novoAlvo.titulo.trim()) {
      onSalvar(novoAlvo.titulo, novoAlvo.meta, novoAlvo.prazo);
      toast.success(t.spiritualGoals.toastSuccess);
      onVoltar();
    } else {
      toast.error(t.spiritualGoals.toastError);
    }
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
            <h2 className="text-xl">{t.spiritualGoals.newGoalTitle}</h2>
            <p className="text-sm opacity-90">{t.spiritualGoals.newGoalSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">{t.spiritualGoals.fieldGoalTitle} *</label>
            <Input
              type="text"
              placeholder={t.spiritualGoals.fieldGoalPlaceholder}
              value={novoAlvo.titulo}
              onChange={(e) => setNovoAlvo({...novoAlvo, titulo: e.target.value})}
              className="h-14 px-4 bg-white border-2"
              style={{ borderColor: '#D8CEE8' }}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">{t.spiritualGoals.fieldMeta}</label>
            <Textarea
              placeholder={t.spiritualGoals.fieldMetaPlaceholder}
              value={novoAlvo.meta}
              onChange={(e) => setNovoAlvo({...novoAlvo, meta: e.target.value})}
              className="resize-none min-h-[100px] px-4 py-4 bg-white border-2"
              style={{ borderColor: '#D8CEE8' }}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm">{t.spiritualGoals.fieldDeadline}</label>
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

          {/* Botão Salvar - no fluxo normal após o último campo */}
          <button 
            className="w-full shadow-lg h-14 text-lg border-0 mt-6 rounded-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (!novoAlvo.titulo.trim()) return;
              if (temaAtual === 'escuro') {
                e.currentTarget.style.backgroundColor = '#B5CC3D';
              } else {
                e.currentTarget.style.backgroundColor = '#5A3C70';
              }
            }}
            onMouseLeave={(e) => {
              if (temaAtual === 'escuro') {
                e.currentTarget.style.backgroundColor = '#C8E046';
              } else {
                e.currentTarget.style.backgroundColor = '#4A2C60';
              }
            }}
            onClick={handleSalvar}
            disabled={!novoAlvo.titulo.trim()}
          >
            <Target className="w-5 h-5 mr-2" />
            {t.spiritualGoals.buttonCreate}
          </button>
        </div>
      </div>
    </div>
  );
}