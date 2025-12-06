import { ArrowLeft, Palette, Bell, Moon, Sun, Smartphone, Volume2, Vibrate, Languages, Globe, Eye, BellRing, Timer, Calendar as CalendarIcon, BookOpen, Target, Heart, MessageSquare, Settings, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { toast } from 'sonner@2.0.3';
import { ThemeService, TemaType } from '../../services/themeService';
import { SmartNotificationManager } from '../../utils/notifications/smartNotifications';
import { LanguageService, LanguageCode } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';

interface ConfiguracoesPageProps {
  onVoltar: () => void;
}

interface Configuracoes {
  tema: 'claro' | 'escuro' | 'auto';
  notificacoes: {
    ativadas: boolean;
    estudos: boolean;
    revisitas: boolean;
    gratidao: boolean;
    leituraBiblia: boolean;
    alvos: boolean;
    som: boolean;
    vibracao: boolean;
    antecedencia24h: boolean;
    antecedencia1h: boolean;
  };
  interface: {
    tamanhoFonte: number; // 14-20px
    contrasteAlto: boolean;
    animacoes: boolean;
    modoFoco: boolean;
  };
  idioma: string;
}

const CONFIG_STORAGE_KEY = 'mynis-configuracoes';

export default function ConfiguracoesPage({ onVoltar }: ConfiguracoesPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Carregar configurações do localStorage
  const carregarConfiguracoes = (): Configuracoes => {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Configurações padrão
    return {
      tema: 'claro',
      notificacoes: {
        ativadas: true,
        estudos: true,
        revisitas: true,
        gratidao: true,
        leituraBiblia: true,
        alvos: true,
        som: true,
        vibracao: true,
        antecedencia24h: true,
        antecedencia1h: true,
      },
      interface: {
        tamanhoFonte: 16,
        contrasteAlto: false,
        animacoes: true,
        modoFoco: false,
      },
      idioma: 'pt-BR',
    };
  };

  const [config, setConfig] = useState<Configuracoes>(carregarConfiguracoes());
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [idiomaAtual, setIdiomaAtual] = useState(LanguageService.getLanguage());

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
      setIdiomaAtual(LanguageService.getLanguage());
    };

    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, []);

  // Salvar configurações no localStorage
  const salvarConfiguracoes = (novaConfig: Configuracoes) => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(novaConfig));
    setConfig(novaConfig);
  };

  // Handlers
  const handleTemaChange = (tema: 'claro' | 'escuro' | 'auto') => {
    const novaConfig = { ...config, tema };
    salvarConfiguracoes(novaConfig);
    
    // Aplicar o tema usando ThemeService
    ThemeService.setTheme(tema);
    
    toast.success(`Tema alterado para ${tema === 'claro' ? 'Claro' : tema === 'escuro' ? 'Escuro' : 'Automático'}`, {
      icon: <Check className="w-5 h-5" />
    });
  };

  const handleNotificacaoToggle = async (tipo: keyof Configuracoes['notificacoes']) => {
    // Se est ativando notificações e é o toggle principal
    if (tipo === 'ativadas' && !config.notificacoes.ativadas) {
      // Solicitar permissão do navegador
      const permissaoConcedida = await SmartNotificationManager.requestPermission();
      
      if (!permissaoConcedida) {
        toast.error('Permissão negada', {
          description: 'Por favor, ative as notificações nas configurações do navegador'
        });
        return; // Não altera o estado se permissão foi negada
      }
      
      // Iniciar verificação periódica de notificações
      SmartNotificationManager.startPeriodicCheck();
    }
    
    // Se está desativando notificações principal
    if (tipo === 'ativadas' && config.notificacoes.ativadas) {
      // Parar verificação periódica
      SmartNotificationManager.stopPeriodicCheck();
    }
    
    const novaConfig = {
      ...config,
      notificacoes: {
        ...config.notificacoes,
        [tipo]: !config.notificacoes[tipo],
      },
    };
    salvarConfiguracoes(novaConfig);
  };

  const handleInterfaceToggle = (tipo: keyof Configuracoes['interface']) => {
    const novaConfig = {
      ...config,
      interface: {
        ...config.interface,
        [tipo]: !config.interface[tipo],
      },
    };
    salvarConfiguracoes(novaConfig);
    
    if (tipo === 'modoFoco') {
      toast.success(novaConfig.interface.modoFoco ? 'Modo Foco ativado' : 'Modo Foco desativado', {
        icon: <Check className="w-5 h-5" />
      });
    }
  };

  const handleTamanhoFonteChange = (value: number[]) => {
    const novaConfig = {
      ...config,
      interface: {
        ...config.interface,
        tamanhoFonte: value[0],
      },
    };
    salvarConfiguracoes(novaConfig);
  };

  const handleIdiomaChange = (idioma: string) => {
    const novaConfig = { ...config, idioma };
    salvarConfiguracoes(novaConfig);
    
    // Atualizar no LanguageService
    LanguageService.setLanguage(idioma as LanguageCode);
    
    const langData = LanguageService.getAvailableLanguages().find(l => l.code === idioma);
    
    toast.success('Idioma alterado', {
      description: `Agora usando ${langData?.nativeName || idioma}`,
      icon: <Check className="w-5 h-5" />
    });
  };

  const handleInterfaceSelect = (tipo: keyof Configuracoes['interface'], valor: string) => {
    const novaConfig = {
      ...config,
      interface: {
        ...config.interface,
        [tipo]: valor as any,
      },
    };
    salvarConfiguracoes(novaConfig);
  };

  // Obter traduções baseadas no idioma atual
  const t = useTranslations(idiomaAtual);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto pb-20" 
      style={{ 
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' 
      }}
    >
      {/* Header fixo com gradiente */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'
        }}
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
            <h2 className="text-2xl mb-1">{t.settings.title}</h2>
            <p className="text-sm opacity-90">{t.settings.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card 1: Aparência */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : { backgroundColor: '#FFFFFF' }}
        >
          <h3 
            className="mb-5 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
          >
            <Palette className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            {t.settings.appearance}
          </h3>

          <div className="space-y-3">
            {/* Opção: Tema Claro */}
            <button
              onClick={() => handleTemaChange('claro')}
              type="button"
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all`}
              style={temaAtual === 'escuro' ? {
                backgroundColor: config.tema === 'claro' ? 'rgba(167, 139, 202, 0.15)' : '#1F1F1F',
                borderColor: config.tema === 'claro' ? '#A78BCA' : 'rgba(255, 255, 255, 0.1)'
              } : {
                backgroundColor: config.tema === 'claro' ? '#F3F0FF' : '#FFFFFF',
                borderColor: config.tema === 'claro' ? '#4A2C60' : '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (config.tema !== 'claro') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#252525' : '#F9FAFB';
                }
              }}
              onMouseLeave={(e) => {
                if (config.tema !== 'claro') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#1F1F1F' : '#FFFFFF';
                }
              }}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: 'rgba(251, 191, 36, 0.2)'
                } : {
                  backgroundColor: '#FEF3C7'
                }}
              >
                <Sun 
                  className="w-6 h-6" 
                  style={{ color: temaAtual === 'escuro' ? '#FDE68A' : '#D97706' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}>
                  {t.settings.themeLight}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.settings.themeLightDesc}
                </p>
              </div>
              {config.tema === 'claro' && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ backgroundColor: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* Opção: Tema Escuro */}
            <button
              onClick={() => handleTemaChange('escuro')}
              type="button"
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all`}
              style={temaAtual === 'escuro' ? {
                backgroundColor: config.tema === 'escuro' ? 'rgba(167, 139, 202, 0.15)' : '#1F1F1F',
                borderColor: config.tema === 'escuro' ? '#A78BCA' : 'rgba(255, 255, 255, 0.1)'
              } : {
                backgroundColor: config.tema === 'escuro' ? '#F3F0FF' : '#FFFFFF',
                borderColor: config.tema === 'escuro' ? '#4A2C60' : '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (config.tema !== 'escuro') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#252525' : '#F9FAFB';
                }
              }}
              onMouseLeave={(e) => {
                if (config.tema !== 'escuro') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#1F1F1F' : '#FFFFFF';
                }
              }}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: 'rgba(139, 92, 246, 0.2)'
                } : {
                  backgroundColor: '#E0E7FF'
                }}
              >
                <Moon 
                  className="w-6 h-6" 
                  style={{ color: temaAtual === 'escuro' ? '#C4B5FD' : '#6366F1' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}>
                  {t.settings.themeDark}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.settings.themeDarkDesc}
                </p>
              </div>
              {config.tema === 'escuro' && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ backgroundColor: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            {/* Opção: Tema Automático */}
            <button
              onClick={() => handleTemaChange('auto')}
              type="button"
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all`}
              style={temaAtual === 'escuro' ? {
                backgroundColor: config.tema === 'auto' ? 'rgba(167, 139, 202, 0.15)' : '#1F1F1F',
                borderColor: config.tema === 'auto' ? '#A78BCA' : 'rgba(255, 255, 255, 0.1)'
              } : {
                backgroundColor: config.tema === 'auto' ? '#F3F0FF' : '#FFFFFF',
                borderColor: config.tema === 'auto' ? '#4A2C60' : '#E5E7EB'
              }}
              onMouseEnter={(e) => {
                if (config.tema !== 'auto') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#252525' : '#F9FAFB';
                }
              }}
              onMouseLeave={(e) => {
                if (config.tema !== 'auto') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#1F1F1F' : '#FFFFFF';
                }
              }}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: 'rgba(167, 139, 202, 0.2)'
                } : {
                  backgroundColor: '#F3F0FF'
                }}
              >
                <Smartphone 
                  className="w-6 h-6" 
                  style={{ color: temaAtual === 'escuro' ? '#C4B5FD' : '#7C3AED' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}>
                  {t.settings.themeAuto}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.settings.themeAutoDesc}
                </p>
              </div>
              {config.tema === 'auto' && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ backgroundColor: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </Card>

        {/* Card 2: Notificações */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : { backgroundColor: '#FFFFFF' }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
          >
            <Bell className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            {t.settings.notifications}
          </h3>

          <div className="space-y-5">
            {/* Notificações Gerais */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <Label style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}>
                    {t.settings.notificationsEnable}
                  </Label>
                  <p 
                    className="text-xs"
                    style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                  >
                    {t.settings.notificationsControl}
                  </p>
                </div>
              </div>
              <Switch
                checked={config.notificacoes.ativadas}
                onCheckedChange={() => handleNotificacaoToggle('ativadas')}
              />
            </div>

            {config.notificacoes.ativadas && (
              <>
                <Separator />

                {/* Antecedência */}
                <div 
                  className="p-4 rounded-lg border-2" 
                  style={temaAtual === 'escuro' ? {
                    backgroundColor: 'rgba(167, 139, 202, 0.1)',
                    borderColor: 'rgba(167, 139, 202, 0.3)'
                  } : {
                    backgroundColor: '#F3F0FF',
                    borderColor: '#D8CEE8'
                  }}
                >
                  <Label 
                    className="mb-3 block flex items-center gap-2"
                    style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                  >
                    <Timer className="w-4 h-4" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
                    {t.settings.notificationsReminders}
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-sm"
                        style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                      >
                        {t.settings.notifications24h} antes
                      </span>
                      <Switch
                        checked={config.notificacoes.antecedencia24h}
                        onCheckedChange={() => handleNotificacaoToggle('antecedencia24h')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-sm"
                        style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                      >
                        {t.settings.notifications1h} antes
                      </span>
                      <Switch
                        checked={config.notificacoes.antecedencia1h}
                        onCheckedChange={() => handleNotificacaoToggle('antecedencia1h')}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tipos de Notificações */}
                <div>
                  <Label 
                    className="mb-3 block"
                    style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                  >
                    {t.settings.notificationsReceiveFor}
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.notificationsBibleStudies}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.estudos}
                        onCheckedChange={() => handleNotificacaoToggle('estudos')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.notificationsReturnVisits}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.revisitas}
                        onCheckedChange={() => handleNotificacaoToggle('revisitas')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.notificationsBibleReading}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.leituraBiblia}
                        onCheckedChange={() => handleNotificacaoToggle('leituraBiblia')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.notificationsGratitude}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.gratidao}
                        onCheckedChange={() => handleNotificacaoToggle('gratidao')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} 
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.notificationsSpiritualGoals}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.alvos}
                        onCheckedChange={() => handleNotificacaoToggle('alvos')}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Som e Vibração */}
                <div>
                  <Label 
                    className="mb-3 block"
                    style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                  >
                    {t.settings.alertPreferences}
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.sound}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.som}
                        onCheckedChange={() => handleNotificacaoToggle('som')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Vibrate 
                          className="w-4 h-4" 
                          style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                        />
                        <span 
                          className="text-sm"
                          style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
                        >
                          {t.settings.vibration}
                        </span>
                      </div>
                      <Switch
                        checked={config.notificacoes.vibracao}
                        onCheckedChange={() => handleNotificacaoToggle('vibracao')}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Card 3: Idioma */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : { backgroundColor: '#FFFFFF' }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
          >
            <Languages className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            {t.settings.languageRegion}
          </h3>

          <div className="space-y-4">
            <div>
              <Label 
                className="mb-2 block flex items-center gap-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                <Globe className="w-4 h-4" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
                {t.settings.language}
              </Label>
              <Select value={config.idioma} onValueChange={handleIdiomaChange}>
                <SelectTrigger 
                  className="h-14 border-2" 
                  style={temaAtual === 'escuro' ? {
                    backgroundColor: '#1F1F1F',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF'
                  } : {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D8CEE8',
                    color: '#111827'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LanguageService.getAvailableLanguages().map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p 
                className="text-xs mt-2"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.settings.moreLanguages}
              </p>
            </div>
          </div>
        </Card>

        {/* Card 4: Redefinir */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : { backgroundColor: '#FFFFFF' }}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#374151' }}
          >
            <Settings className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            {t.settings.resetSettings}
          </h3>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-14 justify-between border-2"
              style={{
                borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB',
                backgroundColor: 'transparent',
                color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
              }}
              onClick={() => {
                if (confirm('Tem certeza que deseja refazer o onboarding? Suas configurações atuais serão mantidas.')) {
                  localStorage.removeItem('onboardingComplete');
                  localStorage.removeItem('userData');
                  window.location.reload();
                }
              }}
            >
              <span>{t.settings.redoOnboarding}</span>
              <ChevronRight className="w-5 h-5" />
            </Button>

            <p 
              className="text-xs"
              style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
            >
              {t.settings.redoOnboardingDesc}
            </p>
          </div>
        </Card>

        {/* Informação de Privacidade */}
        <div 
          className="p-4 rounded-lg border-2" 
          style={temaAtual === 'escuro' ? {
            backgroundColor: 'rgba(167, 139, 202, 0.1)',
            borderColor: 'rgba(167, 139, 202, 0.3)'
          } : {
            backgroundColor: '#F3F0FF',
            borderColor: '#D8CEE8'
          }}
        >
          <p 
            className="text-sm text-center"
            style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
            dangerouslySetInnerHTML={{ __html: t.settings.privacyLocal }}
          />
          <p 
            className="text-xs text-center mt-1"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            {t.settings.privacyDesc}
          </p>
        </div>
      </div>
    </div>
  );
}