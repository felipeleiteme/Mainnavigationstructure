import { ArrowLeft, Trash2, Plus, Heart, BarChart3, Edit2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ThemeService } from '../../services/themeService';
import { toast } from 'sonner';
import { useTranslations } from '../../utils/i18n/translations';

interface DiarioGratidaoPageProps {
  onVoltar: () => void;
  onAbrirNovaGratidao: () => void;
  onEditarGratidao?: (entry: GratidaoEntry) => void;
}

interface GratidaoEntry {
  id: string;
  data: string;
  texto: string;
}

export default function DiarioGratidaoPage({ onVoltar, onAbrirNovaGratidao, onEditarGratidao }: DiarioGratidaoPageProps) {
  const t = useTranslations();
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  const [gratidaoEntries, setGratidaoEntries] = useState<GratidaoEntry[]>([]);

  // Load gratidão entries from localStorage
  useEffect(() => {
    const gratidaoSaved = localStorage.getItem('diarioGratidao');
    if (gratidaoSaved) {
      setGratidaoEntries(JSON.parse(gratidaoSaved));
    }
  }, []);

  const handleDeletarGratidao = (id: string) => {
    const updatedEntries = gratidaoEntries.filter(entry => entry.id !== id);
    setGratidaoEntries(updatedEntries);
    localStorage.setItem('diarioGratidao', JSON.stringify(updatedEntries));
    toast.success(t.gratitudeDiary.toastDeleted, {
      icon: <Trash2 className="w-5 h-5" />
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-neutral">
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white"
        style={{
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'
        }}
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
            <h2 className="text-xl">{t.gratitudeDiary.headerTitle}</h2>
            <p className="text-sm opacity-90">{t.gratitudeDiary.headerSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Sobre - APENAS quando não há entradas */}
        {gratidaoEntries.length === 0 && (
          <Card 
            className="p-6 border-2"
            style={{
              backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.08)' : 'rgba(74, 44, 96, 0.05)',
              borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.2)'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              >
                <Heart 
                  className="w-6 h-6" 
                  style={{
                    color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                  }}
                />
              </div>
              <div>
                <h3 
                  className="mb-2"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#1F2937'
                  }}
                >
                  {t.gratitudeDiary.whyTitle}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
                  }}
                >
                  {t.gratitudeDiary.whyDescription}
                </p>
                <p 
                  className="text-xs mt-2 italic"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.gratitudeDiary.bibleVerse}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Gratidões */}
        {gratidaoEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.12)' : 'rgba(74, 44, 96, 0.1)'
              }}
            >
              <Heart 
                className="w-10 h-10" 
                style={{
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              />
            </div>
            <h3 
              className="mb-2"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              {t.gratitudeDiary.startTitle}
            </h3>
            <p 
              className="text-sm mb-6"
              style={{
                color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
              }}
            >
              {t.gratitudeDiary.startDescription}
            </p>
            <p 
              className="text-sm"
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
              }}
            >
              {t.gratitudeDiary.startTip}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {gratidaoEntries.map((entry) => (
              <Card key={entry.id} className="p-5 hover:shadow-lg transition-all border-0 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Data */}
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        }}
                      ></div>
                      <p 
                        className="text-xs uppercase tracking-wider opacity-70"
                        style={{
                          color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        }}
                      >
                        {new Date(entry.data).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {/* Texto */}
                    <p 
                      className="text-base leading-relaxed"
                      style={{
                        color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                      }}
                    >
                      {entry.texto}
                    </p>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditarGratidao && onEditarGratidao(entry);
                      }}
                      className="h-9 w-9 p-0 rounded-lg transition-colors"
                      style={{
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeletarGratidao(entry.id)}
                      className="h-9 w-9 p-0 rounded-lg transition-colors"
                      style={{
                        color: temaAtual === 'escuro' ? '#F87171' : '#EF4444'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Card: Estatísticas */}
        {gratidaoEntries.length > 0 && (
          <Card className="p-6">
            <h3 
              className="flex items-center gap-2 mb-4"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <BarChart3 className="w-5 h-5" />
              {t.gratitudeDiary.summaryTitle}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="text-center p-4 rounded-lg"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)'
                }}
              >
                <p 
                  className="text-3xl font-bold"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {gratidaoEntries.length}
                </p>
                <p 
                  className="text-xs mt-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.gratitudeDiary.totalRecords}
                </p>
              </div>
              <div 
                className="text-center p-4 rounded-lg"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)'
                }}
              >
                <p 
                  className="text-3xl font-bold"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {Math.floor((Date.now() - new Date(gratidaoEntries[gratidaoEntries.length - 1]?.data).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p 
                  className="text-xs mt-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.gratitudeDiary.daysPracticing}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* FAB - Botão de Ação Flutuante */}
      <button
        onClick={onAbrirNovaGratidao}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
          color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
        }}
        aria-label={t.gratitudeDiary.addButtonLabel}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}