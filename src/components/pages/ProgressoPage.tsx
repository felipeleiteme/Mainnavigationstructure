import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Edit, 
  Trash2, 
  BookOpen, 
  User, 
  Calendar, 
  Plus,
  Share2,
  TrendingUp,
  CheckCircle,
  Trophy,
  Sprout,
  Timer,
  Home,
  Building2,
  Phone,
  Mail,
  Briefcase,
  Users,
  BookMarked,
  Sparkles,
  MessageCircle,
  Edit2,
  Turtle,
  Rabbit,
  Footprints
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DataService, Sessao } from '../../services/dataService';
import { ThemeService } from '@/services/themeService';
import CadastrarTempoPage from './CadastrarTempoPage';
import FAB from '../shared/FAB';
import EmptyState from '../shared/EmptyState';
import { toast } from 'sonner@2.0.3';
import { useTranslations } from '../../utils/i18n/translations';

interface ProgressoPageProps {
  onVoltar: () => void;
}

export default function ProgressoPage({ onVoltar }: ProgressoPageProps) {
  const t = useTranslations();
  
  // Navegação de páginas
  const [paginaAtual, setPaginaAtual] = useState<'progresso' | 'cadastrar-tempo'>('progresso');
  
  // Estados para edição e exclusão
  const [sessaoParaExcluir, setSessaoParaExcluir] = useState<Sessao | null>(null);
  const [sessaoParaEditar, setSessaoParaEditar] = useState<Sessao | null>(null);
  const [mostrarDialogExcluir, setMostrarDialogExcluir] = useState(false);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Current selected month/year
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  // State for sessions and stats
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [stats, setStats] = useState({
    horasTotal: 0,
    horasCampo: 0,
    horasCredito: 0,
    totalEstudos: 0,
    totalRevisitas: 0,
    totalPublicacoes: 0,
  });

  // Load data whenever selected month changes
  useEffect(() => {
    loadMonthData();
    
    // Listen for data changes
    const handleDataChange = () => loadMonthData();
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, [selectedDate]);

  const loadMonthData = () => {
    // Get sessions for selected month
    const monthSessions = DataService.getSessoesMes(selectedDate.month, selectedDate.year);
    setSessoes(monthSessions);

    // Calculate statistics
    const totalMinutes = monthSessions.reduce((total, s) => total + (s.duracaoMinutos || 0), 0);
    const campoMinutes = monthSessions
      .filter(s => s.tipo === 'campo')
      .reduce((total, s) => total + (s.duracaoMinutos || 0), 0);
    const creditoMinutes = monthSessions
      .filter(s => s.tipo === 'credito')
      .reduce((total, s) => total + (s.duracaoMinutos || 0), 0);

    // Count activities
    const totalEstudos = monthSessions.reduce(
      (sum, s) => sum + (s.estudosRealizados?.length || 0), 
      0
    );
    const totalRevisitas = monthSessions.reduce(
      (sum, s) => sum + (s.revisitasFeitas?.length || 0), 
      0
    );
    const totalPublicacoes = monthSessions.reduce(
      (sum, s) => sum + (s.publicacoes?.reduce((pSum, p) => pSum + p.quantidade, 0) || 0), 
      0
    );

    setStats({
      horasTotal: totalMinutes / 60,
      horasCampo: campoMinutes / 60,
      horasCredito: creditoMinutes / 60,
      totalEstudos,
      totalRevisitas,
      totalPublicacoes,
    });
  };

  // Navigation handlers
  const handlePreviousMonth = () => {
    setSelectedDate(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  };

  const handleNextMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Don't allow navigation to future months
    if (selectedDate.year === currentYear && selectedDate.month === currentMonth) {
      return;
    }

    setSelectedDate(prev => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  };

  // Format month name
  const getMonthName = (month: number, year: number) => {
    const monthNames = [
      t.progress.monthJanuary,
      t.progress.monthFebruary,
      t.progress.monthMarch,
      t.progress.monthApril,
      t.progress.monthMay,
      t.progress.monthJune,
      t.progress.monthJuly,
      t.progress.monthAugust,
      t.progress.monthSeptember,
      t.progress.monthOctober,
      t.progress.monthNovember,
      t.progress.monthDecember
    ];
    return `${monthNames[month]} ${year}`;
  };

  // Format hours
  const formatarHoras = (horas: number) => {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  // Format activity type
  const formatarTipoAtividade = (tipo: string) => {
    const nomes: Record<string, { label: string; icon: any }> = {
      'casa-em-casa': { label: t.progress.activityHouseToHouse, icon: Home },
      'testemunho-publico': { label: t.progress.activityPublicWitnessing, icon: Building2 },
      'telefone': { label: t.progress.activityByPhone, icon: Phone },
      'carta': { label: t.progress.activityByLetter, icon: Mail },
      'informal': { label: t.progress.activityInformal, icon: Briefcase },
      'revisita': { label: t.progress.activityReturnVisit, icon: Users },
      'estudo-biblico': { label: t.progress.activityBibleStudy, icon: BookMarked },
      'estudo': { label: t.progress.activityBibleStudy, icon: BookMarked },
      'credito': { label: t.progress.activityCredit, icon: Timer },
      'outro': { label: t.progress.activityOther, icon: Sparkles },
    };
    const config = nomes[tipo] || { label: tipo, icon: Sparkles };
    return { ...config, tipo };
  };

  // Translate weekday name
  const getWeekdayName = (weekdayIndex: number) => {
    const weekdays = [
      t.progress.weekdayMonday,
      t.progress.weekdayTuesday,
      t.progress.weekdayWednesday,
      t.progress.weekdayThursday,
      t.progress.weekdayFriday,
      t.progress.weekdaySaturday,
      t.progress.weekdaySunday
    ];
    return weekdays[weekdayIndex];
  };

  // Translate period
  const getPeriodName = (period: string) => {
    const periods: Record<string, string> = {
      'manha': t.progress.periodMorning,
      'manhã': t.progress.periodMorning,
      'tarde': t.progress.periodAfternoon,
      'noite': t.progress.periodEvening
    };
    return periods[period] || period;
  };

  // Format localized date
  const formatLocalizedDate = (date: Date) => {
    const day = date.getDate();
    const monthNames = [
      t.progress.monthJanuary.toLowerCase(),
      t.progress.monthFebruary.toLowerCase(),
      t.progress.monthMarch.toLowerCase(),
      t.progress.monthApril.toLowerCase(),
      t.progress.monthMay.toLowerCase(),
      t.progress.monthJune.toLowerCase(),
      t.progress.monthJuly.toLowerCase(),
      t.progress.monthAugust.toLowerCase(),
      t.progress.monthSeptember.toLowerCase(),
      t.progress.monthOctober.toLowerCase(),
      t.progress.monthNovember.toLowerCase(),
      t.progress.monthDecember.toLowerCase()
    ];
    return `${day} de ${monthNames[date.getMonth()]}`;
  };
  
  // Get publisher type label
  const getTipoPublicadorLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'publicador-regular': 'Publicador Regular',
      'pioneiro-auxiliar-30': 'Pioneiro Auxiliar (30h)',
      'pioneiro-regular': 'Pioneiro Regular',
    };
    return tipos[tipo] || tipo;
  };

  // Get goal based on publisher type
  const perfil = DataService.getPerfil();
  const metasPorTipo: { [key: string]: number } = {
    'publicador-regular': 10,
    'pioneiro-auxiliar-30': 30,
    'pioneiro-regular': 50,
  };
  const metaMensal = metasPorTipo[perfil.tipoPublicador] || 10;
  const progressoPercentual = Math.min(100, (stats.horasTotal / metaMensal) * 100);
  const progressoCampo = Math.min(100, (stats.horasCampo / metaMensal) * 100);
  const progressoTotal = Math.min(100, (stats.horasTotal / metaMensal) * 100);

  // Check if it's current month
  const now = new Date();
  const isCurrentMonth = selectedDate.month === now.getMonth() && selectedDate.year === now.getFullYear();
  const isFutureMonth = selectedDate.year > now.getFullYear() || 
    (selectedDate.year === now.getFullYear() && selectedDate.month > now.getMonth());

  // Função inteligente para calcular status do progresso (somente para o mês atual)
  const getStatusProgresso = () => {
    // Só calcular status para o mês atual
    if (!isCurrentMonth) return null;
    
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    
    // Não mostrar badge nos primeiros 3 dias do mês (muito cedo para avaliar)
    if (diaAtual <= 3) return null;
    
    // Progresso esperado baseado no dia do mês
    const progressoEsperado = (diaAtual / ultimoDiaMes) * 100;
    
    // Progresso real
    const progressoReal = progressoPercentual;
    
    // Calcular porcentagem do progresso real em relação ao esperado
    const porcentagemDoEsperado = progressoEsperado > 0 ? (progressoReal / progressoEsperado) * 100 : 0;
    
    // Definir status com critérios mais generosos
    if (porcentagemDoEsperado < 60) {
      // ATRASADO: menos de 60% do progresso esperado (muito abaixo)
      return {
        status: 'atrasado',
        label: 'Atrasado',
        icone: Turtle,
        cor: {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          iconColor: '#ea580c' // orange-600
        }
      };
    } else if (porcentagemDoEsperado > 140) {
      // ADIANTADO: mais de 140% do progresso esperado (muito acima)
      return {
        status: 'adiantado',
        label: 'Adiantado',
        icone: Rabbit,
        cor: {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          iconColor: '#2563eb' // blue-600
        }
      };
    } else {
      // NO CAMINHO: entre 60% e 140% do esperado (faixa confortável)
      return {
        status: 'no-caminho',
        label: 'No caminho',
        icone: Footprints,
        cor: {
          bg: 'bg-secondary-100',
          text: 'text-secondary-800',
          border: 'border-secondary-300',
          iconColor: '#C8E046' // verde lima
        }
      };
    }
  };

  const statusProgresso = getStatusProgresso();

  // Group sessions by date
  const groupedSessions = sessoes.reduce((groups, sessao) => {
    // Normalizar a data para formato YYYY-MM-DD sempre
    let dateKey: string;
    try {
      const dateObj = new Date(sessao.data);
      // Adicionar UTC offset para evitar problemas de timezone
      const utcDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
      const year = utcDate.getFullYear();
      const month = String(utcDate.getMonth() + 1).padStart(2, '0');
      const day = String(utcDate.getDate()).padStart(2, '0');
      dateKey = `${year}-${month}-${day}`;
    } catch (e) {
      // Fallback: se já está no formato YYYY-MM-DD
      dateKey = sessao.data.split('T')[0];
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(sessao);
    return groups;
  }, {} as Record<string, Sessao[]>);

  // Sort dates descending (most recent first)
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => b.localeCompare(a));
  
  // Ordenar sessões dentro de cada dia por hora (mais recente primeiro)
  Object.keys(groupedSessions).forEach(dateKey => {
    groupedSessions[dateKey].sort((a, b) => {
      // Comparar por horaInicio em ordem decrescente
      return b.horaInicio.localeCompare(a.horaInicio);
    });
  });
  
  // Handlers para edição e exclusão
  const handleExcluirClick = (sessao: Sessao) => {
    setSessaoParaExcluir(sessao);
    setMostrarDialogExcluir(true);
  };

  const handleEditarClick = (sessao: Sessao) => {
    setSessaoParaEditar(sessao);
    setPaginaAtual('cadastrar-tempo');
  };

  const handleConfirmarExclusao = () => {
    if (sessaoParaExcluir) {
      DataService.excluirSessao(sessaoParaExcluir.id);
      toast.success(t.progress.deleteSuccess);
      setSessaoParaExcluir(null);
      setMostrarDialogExcluir(false);
    }
  };

  const handleCancelarExclusao = () => {
    setSessaoParaExcluir(null);
    setMostrarDialogExcluir(false);
  };

  // Função para compartilhar relatório no WhatsApp
  const handleCompartilharWhatsApp = () => {
    const monthName = getMonthName(selectedDate.month, selectedDate.year);
    const tipoPublicador = getTipoPublicadorLabel(perfil.tipoPublicador);
    
    // Gerar texto do relatório - FORMATAÇÃO MELHORADA
    let texto = `📊 *RELATÓRIO DE MINISTÉRIO*\n`;
    texto += `📅 ${monthName}\n`;
    texto += `\n`;
    
    texto += `👤 *${perfil.nome}*\n`;
    texto += `${tipoPublicador}\n`;
    texto += `\n`;
    texto += `━━━━━━━━━━━━━━━━━━━━━\n`;
    texto += `\n`;
    
    // Estatísticas principais
    texto += `⏱️ *HORAS*\n`;
    texto += `Total: *${formatarHoras(stats.horasTotal)}*\n`;
    texto += `Meta: ${metaMensal}h (${progressoPercentual.toFixed(0)}%)\n`;
    texto += `\n`;
    
    // Detalhamento
    texto += `📋 *DETALHAMENTO*\n`;
    texto += `Campo: ${formatarHoras(stats.horasCampo)}\n`;
    if (stats.horasCredito > 0) {
      texto += `Crédito: ${formatarHoras(stats.horasCredito)}\n`;
    }
    
    // Adicionar estatísticas de atividades
    if (stats.totalEstudos > 0 || stats.totalRevisitas > 0 || stats.totalPublicacoes > 0) {
      texto += `\n`;
      texto += `✅ *ATIVIDADES*\n`;
      if (stats.totalEstudos > 0) {
        texto += `📖 Estudos: ${stats.totalEstudos}\n`;
      }
      if (stats.totalRevisitas > 0) {
        texto += `🌱 Revisitas: ${stats.totalRevisitas}\n`;
      }
      if (stats.totalPublicacoes > 0) {
        texto += `📚 Publicações: ${stats.totalPublicacoes}\n`;
      }
    }
    
    texto += `\n`;
    texto += `━━━━━━━━━━━━━━━━━━━━━\n`;
    texto += `\n`;
    
    // Adicionar mensagem motivacional
    if (stats.horasTotal >= metaMensal) {
      texto += `🎉 *META ATINGIDA!*\n`;
      texto += `Parabéns pelo excelente trabalho!\n`;
    } else if (stats.horasTotal > 0) {
      texto += `💪 Continue firme!\n`;
      texto += `Você está indo muito bem!\n`;
    }
    
    texto += `\n`;
    texto += `_Gerado pelo Mynis 🌱_\n`;
    texto += `_Seu companheiro no ministério_`;
    
    // Criar URL do WhatsApp
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    
    // Abrir WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    toast.success('Compartilhamento preparado!', {
      description: 'Escolha o contato no WhatsApp',
    });
  };
  
  // Renderizar página de cadastro
  if (paginaAtual === 'cadastrar-tempo') {
    return (
      <CadastrarTempoPage 
        onVoltar={() => {
          setPaginaAtual('progresso');
          setSessaoParaEditar(null); // Limpar sessão ao voltar
        }} 
        sessaoParaEditar={sessaoParaEditar}
      />
    );
  }

  return (
    <div 
      className="min-h-screen pb-20" 
      style={{ 
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' 
      }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' 
        }}
      >
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-[20px]">{t.progress.title}</h2>
            </div>
            {stats.horasTotal > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCompartilharWhatsApp}
                className="p-2 text-white hover:bg-white/20"
                title="Compartilhar no WhatsApp"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Month Navigation - FORA DO HEADER ROXO */}
      <div 
        className="px-6 pt-6 pb-4" 
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' 
        }}
      >
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="p-2"
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                backgroundColor: 'transparent'
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 
              className="font-medium"
              style={{
                color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
              }}
            >
              {getMonthName(selectedDate.month, selectedDate.year)}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              disabled={isFutureMonth}
              className="p-2 disabled:opacity-30"
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                backgroundColor: 'transparent'
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card principal de progresso */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h3 
                className="flex items-center gap-2"
                style={{
                  color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
                }}
              >
                <TrendingUp 
                  className="w-5 h-5" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                  }} 
                />
                {t.progress.ministry}
              </h3>
              <p 
                className="text-xs mt-1"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {getTipoPublicadorLabel(perfil.tipoPublicador)}
              </p>
            </div>
            {stats.horasTotal >= metaMensal ? (
              <Badge className="text-white border flex items-center gap-1.5" style={{ backgroundColor: '#C8E046', color: '#4A2C60', borderColor: '#C8E046' }}>
                <CheckCircle className="w-3.5 h-3.5" />
                {t.progress.goalAchieved}
              </Badge>
            ) : statusProgresso ? (
              <Badge 
                variant="secondary" 
                className={`flex items-center gap-1 ${statusProgresso.cor.bg} ${statusProgresso.cor.text} ${statusProgresso.cor.border}`}
              >
                <statusProgresso.icone className="w-3 h-3" style={{ color: statusProgresso.cor.iconColor }} />
                {statusProgresso.label}
              </Badge>
            ) : null}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p 
                  className="text-4xl" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                  }}
                >
                  {formatarHoras(stats.horasTotal)}
                </p>
                <p 
                  className="text-sm"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.progress.of} {metaMensal}h/{t.progress.month}
                </p>
              </div>
            </div>
            
            {/* Barra de progresso dupla */}
            <div 
              className="relative h-4 rounded-full overflow-hidden border-2"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#374151' : '#E5E7EB',
                borderColor: '#C8E046'
              }}
            >
              {/* Barra de campo (verde sólido) */}
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-300"
                style={{ width: `${progressoCampo}%`, backgroundColor: '#C8E046' }}
              />
              {/* Barra de crédito (verde mais claro, sobreposta ao total) */}
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-300"
                style={{ width: `${progressoTotal}%`, backgroundColor: '#D9ED8A' }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                0h
              </span>
              <span 
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                }}
              >
                {progressoPercentual.toFixed(0)}%
              </span>
              <span 
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {formatarHoras(metaMensal)}
              </span>
            </div>

            {stats.horasTotal > 0 && (
              <p 
                className="text-sm text-center p-3 rounded-lg border flex items-center justify-center gap-2" 
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : '#F3F9E6', 
                  borderColor: '#C8E046', 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                }}
              >
                <Trophy className="w-4 h-4" style={{ color: '#C8E046' }} />
                {stats.horasTotal >= metaMensal 
                  ? t.progress.congratsGoalReached
                  : t.progress.keepGoingGreat}
              </p>
            )}
          </div>
        </Card>

        {/* History List - SIMPLIFICADO */}
        <div className="space-y-3">
          <h3 
            className="flex items-center gap-2 px-1"
            style={{
              color: temaAtual === 'escuro' ? '#FFFFFF' : '#1F2937'
            }}
          >
            <Clock 
              className="w-5 h-5" 
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#6B7280'
              }}
            />
            {t.progress.activityHistory}
          </h3>
          
          {sortedDates.length === 0 ? (
            // Empty state
            <EmptyState
              icon={<Calendar className="w-12 h-12" />}
              title={t.progress.noRecordsThisMonth}
              description={isCurrentMonth 
                ? t.progress.useButtonToAdd
                : t.progress.noRecordsForMonth}
            />
          ) : (
            // Lista de sessões agrupadas por dia
            sortedDates.map((dateKey) => {
              const dateSessions = groupedSessions[dateKey];
              const [year, month, day] = dateKey.split('-').map(Number);
              const dateObj = new Date(year, month - 1, day);
              
              // Total de horas do dia
              const totalDayMinutes = dateSessions.reduce((sum, s) => sum + (s.duracaoMinutos || 0), 0);
              const totalDayHours = formatarHoras(totalDayMinutes / 60);
              
              return (
                <Card key={dateKey} className="overflow-hidden">
                  {/* Header do dia */}
                  <div 
                    className="px-4 py-3 border-b flex items-center justify-between" 
                    style={{ 
                      backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.08)' : '#F3F9E6',
                      borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : '#C8E046'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center" 
                        style={{ 
                          backgroundColor: '#C8E046', 
                          color: '#1F2937'
                        }}
                      >
                        <span className="text-lg font-semibold">{day}</span>
                      </div>
                      <div>
                        <p 
                          className="text-sm capitalize font-medium"
                          style={{
                            color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                          }}
                        >
                          {getWeekdayName(dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1)}
                        </p>
                        <p 
                          className="text-xs"
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        >
                          {formatLocalizedDate(dateObj)}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className="font-semibold" 
                      style={{ 
                        backgroundColor: '#C8E046', 
                        color: '#1F2937'
                      }}
                    >
                      {totalDayHours}
                    </Badge>
                  </div>
                  
                  {/* Sessões do dia */}
                  <div className="divide-y">
                    {dateSessions.map((sessao) => {
                      const duracao = formatarHoras((sessao.duracaoMinutos || 0) / 60);
                      
                      // Determinar o título da sessão baseado nas atividades
                      let tituloSessao = sessao.tipo === 'campo' ? t.progress.fieldMinistry : t.progress.creditTime;
                      if (sessao.atividades && sessao.atividades.length === 1) {
                        // Se há apenas uma atividade, usar o nome dela como título
                        const atividadeUnica = formatarTipoAtividade(sessao.atividades[0].tipo);
                        tituloSessao = atividadeUnica.label;
                      }
                      
                      return (
                        <div 
                          key={sessao.id} 
                          className="p-5 transition-colors"
                          style={{
                            backgroundColor: temaAtual === 'escuro' ? 'transparent' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.03)' : '#F9FAFB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {/* Linha principal - Título e Tempo */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {sessao.tipo === 'campo' ? (
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center" 
                                  style={{ 
                                    backgroundColor: temaAtual === 'escuro' 
                                      ? 'rgba(200, 224, 70, 0.12)' 
                                      : 'rgba(200, 224, 70, 0.15)' 
                                  }}
                                >
                                  <Sprout 
                                    className="w-5 h-5" 
                                    style={{ 
                                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                                    }} 
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center" 
                                  style={{ 
                                    backgroundColor: temaAtual === 'escuro' 
                                      ? 'rgba(200, 224, 70, 0.12)' 
                                      : 'rgba(200, 224, 70, 0.15)' 
                                  }}
                                >
                                  <Timer 
                                    className="w-5 h-5" 
                                    style={{ 
                                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                                    }} 
                                  />
                                </div>
                              )}
                              <div>
                                <p 
                                  className="text-base mb-0.5 font-medium" 
                                  style={{ 
                                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                                  }}
                                >
                                  {tituloSessao}
                                </p>
                                <p 
                                  className="text-xs"
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                >
                                  {sessao.horaInicio} - {sessao.horaFim} • <span className="capitalize">{getPeriodName(sessao.periodo)}</span>
                                </p>
                              </div>
                            </div>
                            <Badge 
                              className="h-7 px-3 text-sm border-0 font-semibold" 
                              style={{ 
                                backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60', 
                                color: 'white' 
                              }}
                            >
                              {duracao}
                            </Badge>
                          </div>
                          
                          {/* Botões de ação */}
                          <div 
                            className="flex items-center justify-end gap-2 mt-4 pt-3 border-t" 
                            style={{
                              borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : '#F3F4F6'
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarClick(sessao)}
                              className="h-8 px-3 text-xs"
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
                              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                              {t.progress.edit}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExcluirClick(sessao)}
                              className="h-8 px-3 text-xs"
                              style={{
                                color: temaAtual === 'escuro' ? '#F87171' : '#DC2626'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                              {t.progress.delete}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FAB
        variant="inicio-ministerio"
        onIniciarMinisterio={() => setPaginaAtual('cadastrar-tempo')}
      />
      
      {/* Dialog de exclusão */}
      <AlertDialog open={mostrarDialogExcluir} onOpenChange={setMostrarDialogExcluir}>
        <AlertDialogContent
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB'
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                fontSize: '20px',
                fontWeight: '600'
              }}
            >
              {t.progress.deleteRecordTitle}
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              {t.progress.deleteRecordDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-3 sm:flex-col">
            <button
              onClick={handleConfirmarExclusao}
              className="w-full h-12 rounded-md transition-all cursor-pointer border-0"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
                order: 1,
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
            >
              {t.progress.confirm}
            </button>
            <button
              onClick={handleCancelarExclusao}
              className="w-full h-12 rounded-md transition-all cursor-pointer border-0"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#F3F4F6',
                color: temaAtual === 'escuro' ? '#C8E046' : '#374151',
                order: 2,
                border: 'none',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {t.progress.cancel}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}