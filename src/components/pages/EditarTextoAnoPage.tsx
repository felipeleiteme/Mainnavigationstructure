import { ArrowLeft, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';
import { ThemeService } from '../../services/themeService';
import { LanguageService } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';

interface EditarTextoAnoPageProps {
  onVoltar: () => void;
}

export default function EditarTextoAnoPage({ onVoltar }: EditarTextoAnoPageProps) {
  const perfil = DataService.getPerfil();
  const [languageCode, setLanguageCode] = useState(LanguageService.getLanguage());
  const t = useTranslations(languageCode);
  
  const [texto, setTexto] = useState(
    perfil.textoAno?.texto || 'Dêem a Jeová a glória que o seu nome merece.'
  );
  const [referencia, setReferencia] = useState(
    perfil.textoAno?.referencia || 'Sal. 96:8'
  );
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

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageCode(LanguageService.getLanguage());
    };
    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, []);

  const handleSalvar = () => {
    if (!texto.trim()) {
      toast.error('Precisamos do texto do versículo');
      return;
    }

    if (!referencia.trim()) {
      toast.error('Precisamos da referência bíblica');
      return;
    }

    DataService.updatePerfil({
      textoAno: {
        texto: texto.trim(),
        referencia: referencia.trim()
      }
    });

    toast.success('Texto do Ano atualizado!', {
      description: 'Visível na tela de Início',
    });

    onVoltar();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1A1A1A' : '#FDF8EE' }}
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
            <h2 className="text-xl">{t.editYearText.title}</h2>
            <p className="text-sm opacity-90">{t.editYearText.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Dica */}
        <Card 
          className="p-6 border-2" 
          style={temaAtual === 'escuro' ? {
            backgroundColor: '#2A2A2A',
            borderColor: 'rgba(167, 139, 202, 0.3)'
          } : {
            backgroundColor: '#F5F2F7',
            borderColor: '#D8CEE8'
          }}
        >
          <div className="flex items-start gap-3">
            <Lightbulb 
              className="w-8 h-8 flex-shrink-0" 
              style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
            />
            <div>
              <h3 
                className="mb-2"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {t.editYearText.howItWorks}
              </h3>
              <p 
                className="text-sm leading-relaxed mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.editYearText.howItWorksDesc}
              </p>
              <p 
                className="text-xs italic"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.editYearText.tip}
              </p>
            </div>
          </div>
        </Card>

        {/* Formulário */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : { backgroundColor: '#FFFFFF' }}
        >
          <div className="space-y-5">
            {/* Campo: Texto */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.editYearText.biblicalTextLabel} <span className="text-red-600">*</span>
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex: Dêem a Jeová a glória que o seu nome merece."
                rows={3}
                className="w-full px-4 py-3 border-2 rounded-lg resize-none"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  color: '#111827',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.editYearText.biblicalTextPlaceholder}
              </p>
            </div>

            {/* Campo: Referência Bíblica */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.editYearText.biblicalRefLabel} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                placeholder="Ex: Filipenses 4:13"
                className="w-full h-14 px-4 border-2 rounded-lg"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  color: '#111827',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.editYearText.biblicalRefPlaceholder}
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : { backgroundColor: '#FFFFFF' }}
        >
          <h3 
            className="mb-4"
            style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
          >
            {t.editYearText.preview}
          </h3>
          <div 
            className="text-white rounded-xl p-4" 
            style={{ backgroundColor: '#6B4C8A' }}
          >
            <p className="text-xs font-medium opacity-75 mb-1">{t.editYearText.yearTextTitle}</p>
            <p className="text-sm opacity-90 italic">
              "{texto || 'Seu texto aparecerá aqui...'}"
            </p>
            <p className="text-xs opacity-75 mt-1">
              — {referencia || 'Referência'}
            </p>
          </div>
        </Card>

        {/* Botão Salvar */}
        <button 
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
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
        >
          {t.editYearText.saveYearText}
        </button>
      </div>
    </div>
  );
}