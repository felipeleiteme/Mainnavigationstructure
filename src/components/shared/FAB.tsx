import { useState, useEffect } from 'react';
import { Clock, Pause, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeService } from '@/services/themeService';
import { LanguageService } from '@/services/languageService';
import { useTranslations } from '@/utils/i18n/translations';

interface FABProps {
  variant: 'inicio-ministerio' | 'novo-estudo' | 'nova-revisita';
  sessaoAtiva?: {
    tempoDecorrido: number; // em minutos
    pausada: boolean;
  };
  onIniciarMinisterio?: () => void;
  onAbrirControles?: () => void;
  onNovoEstudo?: () => void;
  onNovaRevisita?: () => void;
}

export default function FAB({ 
  variant, 
  sessaoAtiva, 
  onIniciarMinisterio,
  onAbrirControles,
  onNovoEstudo,
  onNovaRevisita
}: FABProps) {
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [languageCode, setLanguageCode] = useState(LanguageService.getLanguage());
  const t = useTranslations(languageCode);

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

  // Animar quando sessão está ativa
  useEffect(() => {
    if (sessaoAtiva && !sessaoAtiva.pausada) {
      setPulseAnimation(true);
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [sessaoAtiva]);

  // Formatar tempo decorrido
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h${mins.toString().padStart(2, '0')}min`;
    }
    return `${mins}min`;
  };

  // Cores do FAB baseadas no tema
  const getFABColors = () => {
    if (temaAtual === 'escuro') {
      // Modo escuro: Verde lima
      return {
        backgroundColor: '#C8E046',
        color: '#1C1C1C'
      };
    } else {
      // Modo claro: Roxo
      return {
        backgroundColor: '#4A2C60',
        color: '#FFFFFF'
      };
    }
  };

  const fabColors = getFABColors();

  // FAB para Novo Estudo (Tab Estudos)
  if (variant === 'novo-estudo') {
    return (
      <Button
        size="lg"
        onClick={onNovoEstudo}
        className="fixed bottom-20 right-4 rounded-full h-12 px-5 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0"
        style={fabColors}
      >
        <Plus className="w-5 h-5 mr-2" />
        {t.fab.newStudy}
      </Button>
    );
  }

  // FAB para Nova Revisita (Tab Campo)
  if (variant === 'nova-revisita') {
    return (
      <Button
        size="lg"
        onClick={onNovaRevisita}
        className="fixed bottom-20 right-4 rounded-full h-12 px-5 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0"
        style={fabColors}
      >
        <Plus className="w-5 h-5 mr-2" />
        <span className="font-medium">{t.fab.newReturnVisit}</span>
      </Button>
    );
  }

  // FAB para Iniciar Ministério (sem sessão ativa)
  if (!sessaoAtiva) {
    return (
      <Button
        size="lg"
        onClick={onIniciarMinisterio}
        className="fixed bottom-20 right-4 rounded-full h-12 px-5 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0"
        style={fabColors}
      >
        <Plus className="w-5 h-5 mr-2" />
        <span className="font-medium">{t.fab.newActivity}</span>
      </Button>
    );
  }

  // FAB para Sessão Ativa
  // Sessão pausada: laranja com branco (mantém em qualquer tema)
  // Sessão ativa: usa cores do tema
  const sessaoPausada = sessaoAtiva.pausada;
  
  return (
    <Button
      size="lg"
      onClick={onAbrirControles}
      className={`fixed bottom-20 right-4 rounded-full h-12 px-5 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0 ${ 
        pulseAnimation && !sessaoPausada ? 'animate-pulse' : ''
      }`}
      style={{ 
        backgroundColor: sessaoPausada ? '#F97316' : fabColors.backgroundColor,
        color: sessaoPausada ? '#FFFFFF' : fabColors.color
      }}
    >
      {sessaoPausada ? (
        <Pause className="w-5 h-5 mr-2" />
      ) : (
        <Clock className="w-5 h-5 mr-2" />
      )}
      <span className="font-medium">
        {sessaoPausada ? `${t.fab.paused} - ` : ''}
        {formatarTempo(sessaoAtiva.tempoDecorrido)}
      </span>
    </Button>
  );
}