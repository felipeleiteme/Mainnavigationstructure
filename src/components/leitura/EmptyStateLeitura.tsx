import { BookOpen, Sparkles, Target, Calendar, ArrowLeft, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useTranslations } from '../../utils/i18n/translations';
import { ThemeService } from '../../services/themeService';

interface EmptyStateLeituraProps {
  onIniciarConfiguracao: () => void;
  onVoltar?: () => void;
}

export default function EmptyStateLeitura({ onIniciarConfiguracao, onVoltar }: EmptyStateLeituraProps) {
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const t = useTranslations();

  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  return (
    <div className="min-h-screen bg-neutral pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary-500 text-white">
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
            <h2 className="text-xl">{t.emptyStateBible.headerTitle}</h2>
            <p className="text-sm opacity-90">{t.emptyStateBible.headerSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Call to Action */}
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="w-20 h-20 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="mb-2">{t.emptyStateBible.ctaTitle}</h3>
          <p className="text-sm text-gray-700 mb-6">
            {t.emptyStateBible.ctaDescription}
          </p>
          <button
            className="w-full shadow-lg h-14 text-lg rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
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
            onClick={onIniciarConfiguracao}
          >
            <Settings className="w-5 h-5 mr-2" />
            {t.emptyStateBible.ctaButton}
          </button>
        </Card>

        {/* Benefícios */}
        <div className="space-y-4">
          <h3 className="text-primary-700 px-2">{t.emptyStateBible.benefitsTitle}</h3>
          
          <Card className="p-5 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-50 rounded-xl">
                <Target className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-700 mb-1">{t.emptyStateBible.benefit1Title}</h4>
                <p className="text-sm text-gray-600">
                  {t.emptyStateBible.benefit1Description}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-50 rounded-xl">
                <Calendar className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-700 mb-1">{t.emptyStateBible.benefit2Title}</h4>
                <p className="text-sm text-gray-600">
                  {t.emptyStateBible.benefit2Description}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-50 rounded-xl">
                <Sparkles className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-700 mb-1">{t.emptyStateBible.benefit3Title}</h4>
                <p className="text-sm text-gray-600">
                  {t.emptyStateBible.benefit3Description}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}