import { ArrowLeft, BookOpen, Bell, Calendar, Target, ClipboardList, Save, CheckCircle2, AlertTriangle, Flame, Trophy, FileText, Lightbulb, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { carregarDados, salvarConfiguracao, ConfiguracaoLeitura } from '../../utils/storage/leituraStorage';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';

interface ConfiguracoesLeituraPageProps {
  onVoltar: () => void;
}

export default function ConfiguracoesLeituraPage({ onVoltar }: ConfiguracoesLeituraPageProps) {
  const t = useTranslations();

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [planoSelecionado, setPlanoSelecionado] = useState('cronologico');
  const [notificacoesDiarias, setNotificacoesDiarias] = useState(true);
  const [lembreteReflexao, setLembreteReflexao] = useState(true);
  const [metaDiaria, setMetaDiaria] = useState('1capitulo');
  
  // Estados para valores originais (antes de editar)
  const [planoOriginal, setPlanoOriginal] = useState('cronologico');
  const [metaOriginal, setMetaOriginal] = useState('1capitulo');
  
  // Estado para controlar o dialog de confirmação
  const [mostrarAlertaReset, setMostrarAlertaReset] = useState(false);
  
  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Carregar configurações salvas
  useEffect(() => {
    const dados = carregarDados();
    
    if (dados.configurado && dados.configuracao) {
      const config = dados.configuracao;
      
      setPlanoSelecionado(config.plano);
      setPlanoOriginal(config.plano);
      
      setNotificacoesDiarias(config.notificacoesDiarias);
      setLembreteReflexao(config.lembreteReflexao);
      
      setMetaDiaria(config.metaDiaria);
      setMetaOriginal(config.metaDiaria);
      
      // Debug log
      console.log('📋 Configurações carregadas:', {
        plano: config.plano,
        meta: config.metaDiaria
      });
    } else {
      console.log('📋 Nenhuma configuração salva, usando padrões');
    }
  }, []);

  const resetarProgresso = () => {
    // Limpar a chave principal de dados de leitura
    localStorage.removeItem('mynis_leitura_biblia');
    
    console.log('Progresso resetado devido à mudança de configuração');
  };

  const handleSalvarConfiguracoes = () => {
    // Verificar se houve mudança no plano ou meta
    const mudouPlano = planoSelecionado !== planoOriginal;
    const mudouMeta = metaDiaria !== metaOriginal;
    
    // Debug logs
    console.log('=== VERIFICANDO MUDANÇAS ===');
    console.log('Plano selecionado:', planoSelecionado);
    console.log('Plano original:', planoOriginal);
    console.log('Mudou plano?', mudouPlano);
    console.log('Meta selecionada:', metaDiaria);
    console.log('Meta original:', metaOriginal);
    console.log('Mudou meta?', mudouMeta);
    console.log('==========================');
    
    if (mudouPlano || mudouMeta) {
      // Mostrar alerta de confirmação
      console.log('🚨 Mostrando alerta de reset');
      setMostrarAlertaReset(true);
    } else {
      // Salvar sem resetar
      console.log('✅ Salvando sem reset');
      salvarSemReset();
    }
  };
  
  const salvarSemReset = () => {
    // Salvar todas as configurações sem resetar
    const configuracao: ConfiguracaoLeitura = {
      plano: planoSelecionado as 'cronologico' | 'tematico' | 'sequencial',
      metaDiaria: metaDiaria as '1capitulo' | '3capitulos' | '5capitulos',
      notificacoesDiarias: notificacoesDiarias,
      lembreteReflexao: lembreteReflexao,
      dataInicio: new Date().toISOString()
    };
    salvarConfiguracao(configuracao);

    toast.success(t.bibleSettingsPage.toastSaveSuccess, {
      description: t.bibleSettingsPage.toastSaveSuccessDesc,
      icon: <Check className="w-5 h-5" />
    });

    // Voltar para a página anterior após salvar
    setTimeout(() => {
      onVoltar();
    }, 1000);
  };
  
  const confirmarResetESalvar = () => {
    // Resetar progresso
    resetarProgresso();
    
    // Salvar configurações
    const configuracao: ConfiguracaoLeitura = {
      plano: planoSelecionado as 'cronologico' | 'tematico' | 'sequencial',
      metaDiaria: metaDiaria as '1capitulo' | '3capitulos' | '5capitulos',
      notificacoesDiarias: notificacoesDiarias,
      lembreteReflexao: lembreteReflexao,
      dataInicio: new Date().toISOString()
    };
    salvarConfiguracao(configuracao);

    // Fechar o dialog
    setMostrarAlertaReset(false);

    toast.success(t.bibleSettingsPage.toastReset, {
      description: t.bibleSettingsPage.toastResetDesc,
      icon: <Check className="w-5 h-5" />
    });

    // Voltar para a página anterior
    setTimeout(() => {
      onVoltar();
    }, 1500);
  };

  const getNomePlano = (plano: string) => {
    switch (plano) {
      case 'cronologico':
        return t.bibleSettingsPage.chronological;
      case 'tematico':
        return t.bibleSettingsPage.thematic;
      case 'sequencial':
        return t.bibleSettingsPage.sequential;
      default:
        return t.bibleSettingsPage.chronological;
    }
  };

  const getNomeMeta = (meta: string) => {
    switch (meta) {
      case '1capitulo':
        return t.bibleSettingsPage.oneChapter;
      case '3capitulos':
        return t.bibleSettingsPage.threeChapters;
      case '5capitulos':
        return t.bibleSettingsPage.fiveChapters;
      default:
        return t.bibleSettingsPage.oneChapter;
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
            <h2 className="text-xl">{t.bibleSettingsPage.headerTitle}</h2>
            <p className="text-sm opacity-90">{t.bibleSettingsPage.headerSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Tipo de Plano */}
        <Card 
          className="p-6"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
            <h3 style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}>
              {t.bibleSettingsPage.planTypeTitle}
            </h3>
          </div>
          <p 
            className="text-sm mb-4"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            {t.bibleSettingsPage.planTypeSubtitle}
          </p>
          <RadioGroup
            value={planoSelecionado}
            onValueChange={setPlanoSelecionado}
            className="space-y-3"
          >
            <div 
              className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                borderColor: planoSelecionado === 'cronologico' 
                  ? '#C8E046' 
                  : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
              }}
            >
              <RadioGroupItem value="cronologico" id="cronologico" />
              <Label htmlFor="cronologico" className="flex-1 cursor-pointer">
                <div 
                  className="flex items-center gap-2"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}
                >
                  <Calendar 
                    className="w-4 h-4" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  />
                  {t.bibleSettingsPage.chronological}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.chronologicalShort}
                </div>
              </Label>
            </div>
            
            <div 
              className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                borderColor: planoSelecionado === 'tematico' 
                  ? '#C8E046' 
                  : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
              }}
            >
              <RadioGroupItem value="tematico" id="tematico" />
              <Label htmlFor="tematico" className="flex-1 cursor-pointer">
                <div 
                  className="flex items-center gap-2"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}
                >
                  <Target 
                    className="w-4 h-4" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  />
                  {t.bibleSettingsPage.thematic}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.thematicShort}
                </div>
              </Label>
            </div>
            
            <div 
              className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                borderColor: planoSelecionado === 'sequencial' 
                  ? '#C8E046' 
                  : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
              }}
            >
              <RadioGroupItem value="sequencial" id="sequencial" />
              <Label htmlFor="sequencial" className="flex-1 cursor-pointer">
                <div 
                  className="flex items-center gap-2"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}
                >
                  <BookOpen 
                    className="w-4 h-4" 
                    style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                  />
                  {t.bibleSettingsPage.sequential}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.sequentialShort}
                </div>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Card: Meta Diária */}
        <Card 
          className="p-6 border-2"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: '#C8E046'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(200, 224, 70, 0.2)' }}
            >
              <Target className="w-5 h-5" style={{ color: '#C8E046' }} />
            </div>
            <h3 style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}>
              {t.bibleSettingsPage.dailyGoalTitle}
            </h3>
          </div>
          <p 
            className="text-sm mb-4"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            {t.bibleSettingsPage.dailyGoalSubtitle}
          </p>
          <RadioGroup
            value={metaDiaria}
            onValueChange={setMetaDiaria}
            className="space-y-3"
          >
            <div 
              className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: metaDiaria === '1capitulo' 
                  ? (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(200, 224, 70, 0.1)')
                  : (temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF'),
                borderColor: metaDiaria === '1capitulo' 
                  ? '#C8E046' 
                  : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
              }}
            >
              <RadioGroupItem value="1capitulo" id="1capitulo" />
              <Label htmlFor="1capitulo" className="flex-1 cursor-pointer">
                <div style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}>
                  {t.bibleSettingsPage.oneChapterShort}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.oneChapterPace}
                </div>
              </Label>
              {metaDiaria === '1capitulo' && (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#C8E046' }} />
              )}
            </div>
            
            <div 
              className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: metaDiaria === '3capitulos' 
                  ? (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(200, 224, 70, 0.1)')
                  : (temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF'),
                borderColor: metaDiaria === '3capitulos' 
                  ? '#C8E046' 
                  : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
              }}
            >
              <RadioGroupItem value="3capitulos" id="3capitulos" />
              <Label htmlFor="3capitulos" className="flex-1 cursor-pointer">
                <div style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}>
                  {t.bibleSettingsPage.threeChaptersShort}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.threeChaptersPace}
                </div>
              </Label>
              {metaDiaria === '3capitulos' && (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#C8E046' }} />
              )}
            </div>
            
            <div 
              className="flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: metaDiaria === '5capitulos' 
                  ? (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(200, 224, 70, 0.1)')
                  : (temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF'),
                borderColor: metaDiaria === '5capitulos' 
                  ? '#C8E046' 
                  : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
              }}
            >
              <RadioGroupItem value="5capitulos" id="5capitulos" />
              <Label htmlFor="5capitulos" className="flex-1 cursor-pointer">
                <div style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}>
                  {t.bibleSettingsPage.fiveChaptersShort}
                </div>
                <div 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.fiveChaptersPace}
                </div>
              </Label>
              {metaDiaria === '5capitulos' && (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#C8E046' }} />
              )}
            </div>
          </RadioGroup>
        </Card>

        {/* Card: Notificações */}
        <Card 
          className="p-6"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
            <h3 style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}>
              {t.bibleSettingsPage.notificationsTitle}
            </h3>
          </div>
          <p 
            className="text-sm mb-4"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            {t.bibleSettingsPage.notificationsSubtitle}
          </p>
          
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between p-4 rounded-lg border-2" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : 'rgba(74, 44, 96, 0.04)', 
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.15)' 
              }}
            >
              <div className="flex-1">
                <Label 
                  htmlFor="notif-diarias" 
                  className="cursor-pointer"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}
                >
                  {t.bibleSettingsPage.dailyReminderShort}
                </Label>
                <p 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.dailyReminderShortDesc}
                </p>
              </div>
              <Switch
                id="notif-diarias"
                checked={notificacoesDiarias}
                onCheckedChange={setNotificacoesDiarias}
              />
            </div>

            <div 
              className="flex items-center justify-between p-4 rounded-lg border-2" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : 'rgba(74, 44, 96, 0.04)', 
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.15)' 
              }}
            >
              <div className="flex-1">
                <Label 
                  htmlFor="lembrete-reflexao" 
                  className="cursor-pointer"
                  style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#4A2C60' }}
                >
                  {t.bibleSettingsPage.reflectionReminderShort}
                </Label>
                <p 
                  className="text-xs mt-1"
                  style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
                >
                  {t.bibleSettingsPage.reflectionReminderShortDesc}
                </p>
              </div>
              <Switch
                id="lembrete-reflexao"
                checked={lembreteReflexao}
                onCheckedChange={setLembreteReflexao}
              />
            </div>
          </div>
        </Card>

        {/* Card: Resumo das Configurações */}
        <Card 
          className="p-6 border-2" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FAF8FF', 
            borderColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
          }}
        >
          <h3 
            className="mb-4 flex items-center gap-2" 
            style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
          >
            <ClipboardList 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
            />
            {t.bibleSettingsPage.summaryTitle}
          </h3>
          <div className="space-y-3">
            <div 
              className="flex justify-between items-center p-3 rounded-lg border" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E8DFFF' 
              }}
            >
              <span 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#4B5563' }}
              >
                {t.bibleSettingsPage.summaryPlan}
              </span>
              <span 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                {getNomePlano(planoSelecionado)}
              </span>
            </div>
            <div 
              className="flex justify-between items-center p-3 rounded-lg border" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E8DFFF' 
              }}
            >
              <span 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#4B5563' }}
              >
                {t.bibleSettingsPage.summaryGoal}
              </span>
              <span 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                {getNomeMeta(metaDiaria)}
              </span>
            </div>
            <div 
              className="flex justify-between items-center p-3 rounded-lg border" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E8DFFF' 
              }}
            >
              <span 
                className="text-sm"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#4B5563' }}
              >
                {t.bibleSettingsPage.summaryReminders}
              </span>
              <span 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
              >
                {notificacoesDiarias && lembreteReflexao ? t.bibleSettingsPage.remindersAll : 
                 notificacoesDiarias || lembreteReflexao ? t.bibleSettingsPage.remindersPartial : 
                 t.bibleSettingsPage.remindersNone}
              </span>
            </div>
          </div>
        </Card>

        {/* Botão de Salvar */}
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
          onClick={handleSalvarConfiguracoes}
        >
          <Save className="w-5 h-5 mr-2" />
          {t.bibleSettingsPage.saveButton}
        </button>
      </div>

      {/* Dialog de confirmação para resetar progresso */}
      <AlertDialog open={mostrarAlertaReset} onOpenChange={setMostrarAlertaReset}>
        <AlertDialogContent 
          className="max-w-[calc(100%-3rem)] sm:max-w-lg"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB'
          }}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <AlertDialogTitle 
                className="text-xl"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937' }}
              >
                {t.bibleSettingsPage.resetDialogTitle}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>
              {t.bibleSettingsPage.resetDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="text-left space-y-3 pt-2 px-1">
            <p 
              className="text-sm"
              style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
            >
              {t.bibleSettingsPage.resetDialogText} <strong>{t.bibleSettingsPage.resetDialogTextBold}</strong> {t.bibleSettingsPage.resetDialogTextContinue}
            </p>
            <ul 
              className="text-sm space-y-2.5"
              style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
            >
              <li className="flex items-center gap-2">
                <BookOpen 
                  className="w-4 h-4 flex-shrink-0" 
                  style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
                />
                <span>{t.bibleSettingsPage.resetItem1}</span>
              </li>
              <li className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>{t.bibleSettingsPage.resetItem2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <span>{t.bibleSettingsPage.resetItem3}</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>{t.bibleSettingsPage.resetItem4}</span>
              </li>
            </ul>
            <div 
              className="text-sm mt-4 p-3 rounded-lg border-2 flex items-start gap-2"
              style={{
                backgroundColor: temaAtual === 'escuro' ? 'rgba(74, 44, 96, 0.2)' : 'rgba(74, 44, 96, 0.05)',
                borderColor: temaAtual === 'escuro' ? '#C8E046' : 'rgba(74, 44, 96, 0.2)',
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#C8E046' }} />
              <span>{t.bibleSettingsPage.resetDialogTip}</span>
            </div>
          </div>
          
          <AlertDialogFooter className="flex gap-3 mt-4">
            <AlertDialogCancel 
              onClick={() => setMostrarAlertaReset(false)}
              className="flex-1"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FFFFFF',
                color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937',
                borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB'
              }}
            >
              {t.bibleSettingsPage.resetDialogCancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarResetESalvar}
              className="flex-1 text-white hover:opacity-90"
              style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t.bibleSettingsPage.resetDialogConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}