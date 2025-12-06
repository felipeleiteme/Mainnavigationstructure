import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Target, CheckCircle2, Sparkles, History } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { ConfiguracaoLeitura } from '../../utils/storage/leituraStorage';
import { useTranslations } from '../../utils/i18n/translations';
import { ThemeService } from '../../services/themeService';

interface OnboardingLeituraProps {
  onConcluir: (config: ConfiguracaoLeitura) => void;
  onVoltar: () => void;
}

export default function OnboardingLeitura({ onConcluir, onVoltar }: OnboardingLeituraProps) {
  const t = useTranslations();
  const [etapa, setEtapa] = useState(1);
  const [plano, setPlano] = useState<ConfiguracaoLeitura['plano']>('cronologico');
  const [metaDiaria, setMetaDiaria] = useState<ConfiguracaoLeitura['metaDiaria']>('3capitulos');
  const [notificacoesDiarias, setNotificacoesDiarias] = useState(true);
  const [lembreteReflexao, setLembreteReflexao] = useState(true);

  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  const handleProximaEtapa = () => {
    if (etapa < 3) {
      setEtapa(etapa + 1);
    } else {
      // Concluir onboarding
      const config: ConfiguracaoLeitura = {
        plano,
        metaDiaria,
        notificacoesDiarias,
        lembreteReflexao,
        dataInicio: new Date().toISOString(),
      };
      onConcluir(config);
    }
  };

  const handleVoltarEtapa = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    } else {
      onVoltar();
    }
  };

  return (
    <div 
      className="min-h-screen pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
      >
        <div className="flex items-center gap-4 px-6 pt-12 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoltarEtapa}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl">{t.bibleOnboarding.headerTitle}</h1>
            <p className="text-sm opacity-90">{t.bibleOnboarding.step} {etapa} {t.bibleOnboarding.stepOf} 3</p>
          </div>
        </div>
        
        {/* Indicador de progresso */}
        <div className="h-1 bg-white/20">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${(etapa / 3) * 100}%`,
              backgroundColor: '#C8E046'
            }}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Etapa 1: Tipo de Plano */}
        {etapa === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div 
                className="inline-flex p-4 rounded-full mb-4"
                style={{ 
                  backgroundColor: temaAtual === 'escuro' 
                    ? 'rgba(200, 224, 70, 0.15)' 
                    : 'rgba(74, 44, 96, 0.1)' 
                }}
              >
                <BookOpen 
                  className="w-12 h-12" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                />
              </div>
              <h2 
                className="text-2xl mb-2" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                {t.bibleOnboarding.step1Title}
              </h2>
              <p style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>
                {t.bibleOnboarding.step1Subtitle}
              </p>
            </div>

            <RadioGroup value={plano} onValueChange={(value) => setPlano(value as ConfiguracaoLeitura['plano'])} className="space-y-4">
              {/* Opção 1: CRONOLÓGICO */}
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  plano === 'cronologico' 
                    ? 'shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: plano === 'cronologico' 
                    ? '#4A2C60' 
                    : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                }}
                onClick={() => setPlano('cronologico')}
              >
                <RadioGroupItem value="cronologico" id="cronologico" className="sr-only" />
                <Label htmlFor="cronologico" className="cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{ 
                        backgroundColor: temaAtual === 'escuro' 
                          ? 'rgba(200, 224, 70, 0.15)' 
                          : 'rgba(74, 44, 96, 0.1)' 
                      }}
                    >
                      <History 
                        className="w-6 h-6" 
                        style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="font-semibold" 
                          style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                        >
                          {t.bibleOnboarding.chronological}
                        </span>
                        {plano === 'cronologico' && (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#C8E046' }} />
                        )}
                      </div>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {t.bibleOnboarding.chronologicalDesc}
                      </p>
                    </div>
                  </div>
                </Label>
              </Card>

              {/* Opção 2: SEQUENCIAL */}
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  plano === 'sequencial' 
                    ? 'shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: plano === 'sequencial' 
                    ? '#4A2C60' 
                    : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                }}
                onClick={() => setPlano('sequencial')}
              >
                <RadioGroupItem value="sequencial" id="sequencial" className="sr-only" />
                <Label htmlFor="sequencial" className="cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{ 
                        backgroundColor: temaAtual === 'escuro' 
                          ? 'rgba(200, 224, 70, 0.15)' 
                          : 'rgba(74, 44, 96, 0.1)' 
                      }}
                    >
                      <BookOpen 
                        className="w-6 h-6" 
                        style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="font-semibold" 
                          style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                        >
                          {t.bibleOnboarding.sequential}
                        </span>
                        {plano === 'sequencial' && (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#C8E046' }} />
                        )}
                      </div>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {t.bibleOnboarding.sequentialDesc}
                      </p>
                    </div>
                  </div>
                </Label>
              </Card>

              {/* Opção 3: TEMÁTICO */}
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  plano === 'tematico' 
                    ? 'shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: plano === 'tematico' 
                    ? '#4A2C60' 
                    : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                }}
                onClick={() => setPlano('tematico')}
              >
                <RadioGroupItem value="tematico" id="tematico" className="sr-only" />
                <Label htmlFor="tematico" className="cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{ 
                        backgroundColor: temaAtual === 'escuro' 
                          ? 'rgba(200, 224, 70, 0.15)' 
                          : 'rgba(74, 44, 96, 0.1)' 
                      }}
                    >
                      <Target 
                        className="w-6 h-6" 
                        style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="font-semibold" 
                          style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                        >
                          {t.bibleOnboarding.thematic}
                        </span>
                        {plano === 'tematico' && (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#C8E046' }} />
                        )}
                      </div>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {t.bibleOnboarding.thematicDesc}
                      </p>
                    </div>
                  </div>
                </Label>
              </Card>
            </RadioGroup>
          </div>
        )}

        {/* Etapa 2: Meta Diária */}
        {etapa === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div 
                className="inline-flex p-4 rounded-full mb-4"
                style={{ backgroundColor: 'rgba(200, 224, 70, 0.15)' }}
              >
                <Target className="w-12 h-12" style={{ color: '#B5CC3D' }} />
              </div>
              <h2 
                className="text-2xl mb-2" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                {t.bibleOnboarding.step2Title}
              </h2>
              <p style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>
                {t.bibleOnboarding.step2Subtitle}
              </p>
            </div>

            <RadioGroup value={metaDiaria} onValueChange={(value) => setMetaDiaria(value as ConfiguracaoLeitura['metaDiaria'])} className="space-y-4">
              {/* 1 capítulo */}
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  metaDiaria === '1capitulo' 
                    ? 'shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: metaDiaria === '1capitulo' 
                    ? '#C8E046' 
                    : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                }}
                onClick={() => setMetaDiaria('1capitulo')}
              >
                <RadioGroupItem value="1capitulo" id="1cap" className="sr-only" />
                <Label htmlFor="1cap" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-semibold" 
                          style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                        >
                          {t.bibleOnboarding.oneChapter}
                        </span>
                        {metaDiaria === '1capitulo' && (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#C8E046' }} />
                        )}
                      </div>
                      <p 
                        className="text-sm"
                        style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {t.bibleOnboarding.oneChapterDesc}
                      </p>
                    </div>
                  </div>
                </Label>
              </Card>

              {/* 3 capítulos */}
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  metaDiaria === '3capitulos' 
                    ? 'shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: metaDiaria === '3capitulos' 
                    ? '#C8E046' 
                    : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                }}
                onClick={() => setMetaDiaria('3capitulos')}
              >
                <RadioGroupItem value="3capitulos" id="3cap" className="sr-only" />
                <Label htmlFor="3cap" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-semibold" 
                          style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                        >
                          {t.bibleOnboarding.threeChapters}
                        </span>
                        {metaDiaria === '3capitulos' && (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#C8E046' }} />
                        )}
                      </div>
                      <p 
                        className="text-sm"
                        style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {t.bibleOnboarding.threeChaptersDesc}
                      </p>
                    </div>
                  </div>
                </Label>
              </Card>

              {/* 5 capítulos */}
              <Card 
                className={`p-5 cursor-pointer transition-all border-2 ${
                  metaDiaria === '5capitulos' 
                    ? 'shadow-md' 
                    : 'hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                  borderColor: metaDiaria === '5capitulos' 
                    ? '#C8E046' 
                    : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                }}
                onClick={() => setMetaDiaria('5capitulos')}
              >
                <RadioGroupItem value="5capitulos" id="5cap" className="sr-only" />
                <Label htmlFor="5cap" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="font-semibold" 
                          style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                        >
                          {t.bibleOnboarding.fiveChapters}
                        </span>
                        {metaDiaria === '5capitulos' && (
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#C8E046' }} />
                        )}
                      </div>
                      <p 
                        className="text-sm"
                        style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                      >
                        {t.bibleOnboarding.fiveChaptersDesc}
                      </p>
                    </div>
                  </div>
                </Label>
              </Card>
            </RadioGroup>

            <Card 
              className="p-4 border-2" 
              style={{ 
                backgroundColor: 'rgba(200, 224, 70, 0.1)', 
                borderColor: 'rgba(200, 224, 70, 0.3)' 
              }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#B5CC3D' }} />
                <p 
                  className="text-sm" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                >
                  <strong>{t.bibleOnboarding.step2Tip.split(':')[0]}:</strong> {t.bibleOnboarding.step2Tip.split(':')[1]}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Etapa 3: Notificações */}
        {etapa === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div 
                className="inline-flex p-4 rounded-full mb-4"
                style={{ 
                  backgroundColor: temaAtual === 'escuro' 
                    ? 'rgba(200, 224, 70, 0.15)' 
                    : 'rgba(74, 44, 96, 0.1)' 
                }}
              >
                <Sparkles 
                  className="w-12 h-12" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                />
              </div>
              <h2 
                className="text-2xl mb-2" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                {t.bibleOnboarding.step3Title}
              </h2>
              <p style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>
                {t.bibleOnboarding.step3Subtitle}
              </p>
            </div>

            <Card 
              className="p-5 border-2" 
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#D8CEE8'
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label 
                    htmlFor="notif1" 
                    className="font-semibold cursor-pointer" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  >
                    {t.bibleOnboarding.dailyReminder}
                  </Label>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                  >
                    {t.bibleOnboarding.dailyReminderDesc}
                  </p>
                </div>
                <Switch
                  id="notif1"
                  checked={notificacoesDiarias}
                  onCheckedChange={setNotificacoesDiarias}
                />
              </div>
            </Card>

            <Card 
              className="p-5 border-2" 
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#D8CEE8'
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label 
                    htmlFor="notif2" 
                    className="font-semibold cursor-pointer" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  >
                    {t.bibleOnboarding.reflectionReminder}
                  </Label>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                  >
                    {t.bibleOnboarding.reflectionReminderDesc}
                  </p>
                </div>
                <Switch
                  id="notif2"
                  checked={lembreteReflexao}
                  onCheckedChange={setLembreteReflexao}
                />
              </div>
            </Card>

            <Card 
              className="p-5 border-2" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' 
                  ? 'rgba(74, 44, 96, 0.2)' 
                  : 'rgba(74, 44, 96, 0.05)', 
                borderColor: temaAtual === 'escuro' 
                  ? 'rgba(200, 224, 70, 0.3)' 
                  : 'rgba(74, 44, 96, 0.2)' 
              }}
            >
              <div className="flex items-start gap-3">
                <Sparkles 
                  className="w-5 h-5 flex-shrink-0 mt-0.5" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                />
                <p 
                  className="text-sm" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                >
                  {t.bibleOnboarding.step3Message}
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Botão de Continuar - Fixo no rodapé */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-6 border-t z-[60] shadow-lg"
        style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF' }}
      >
        <button
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
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
          onClick={handleProximaEtapa}
        >
          {etapa < 3 ? t.bibleOnboarding.continueButton : t.bibleOnboarding.startReadingButton}
        </button>
      </div>
    </div>
  );
}