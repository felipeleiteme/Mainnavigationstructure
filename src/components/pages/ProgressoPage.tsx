import { ArrowLeft, ChevronLeft, ChevronRight, Target, Calendar, Clock, TrendingUp, BookOpen, Package, Plus, Edit2, Trash2, Sprout, Timer, BookMarked, Home, Phone, Mail, Briefcase, Users, Building2, Sparkles, MessageCircle, CheckCircle, BarChart3, Trophy, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DataService, Sessao } from '../../services/dataService';
import CadastrarTempoPage from './CadastrarTempoPage';
import FAB from '../shared/FAB';
import { toast } from 'sonner@2.0.3';

interface ProgressoPageProps {
  onVoltar: () => void;
}

export default function ProgressoPage({ onVoltar }: ProgressoPageProps) {
  // Navegação de páginas
  const [paginaAtual, setPaginaAtual] = useState<'progresso' | 'cadastrar-tempo'>('progresso');
  
  // Estados para edição e exclusão
  const [sessaoParaExcluir, setSessaoParaExcluir] = useState<Sessao | null>(null);
  const [sessaoParaEditar, setSessaoParaEditar] = useState<Sessao | null>(null);
  const [mostrarDialogExcluir, setMostrarDialogExcluir] = useState(false);

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
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
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
      'casa-em-casa': { label: 'Casa em Casa', icon: Home },
      'testemunho-publico': { label: 'Testemunho Público', icon: Building2 },
      'telefone': { label: 'Por Telefone', icon: Phone },
      'carta': { label: 'Por Carta', icon: Mail },
      'informal': { label: 'Informal', icon: Briefcase },
      'revisita': { label: 'Revisita', icon: Users },
      'estudo-biblico': { label: 'Estudo Bíblico', icon: BookMarked },
      'estudo': { label: 'Estudo Bíblico', icon: BookMarked },
      'credito': { label: 'Crédito', icon: Timer },
      'outro': { label: 'Outro', icon: Sparkles },
    };
    const config = nomes[tipo] || { label: tipo, icon: Sparkles };
    return { ...config, tipo };
  };
  
  // Get publisher type label
  const getTipoPublicadorLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'publicador-regular': 'Publicador Regular',
      'pioneiro-auxiliar-30': 'Pioneiro Auxiliar (30h)',
      'pioneiro-auxiliar-50': 'Pioneiro Auxiliar (50h)',
      'pioneiro-regular': 'Pioneiro Regular',
    };
    return tipos[tipo] || tipo;
  };

  // Get goal based on publisher type
  const perfil = DataService.getPerfil();
  const metasPorTipo: Record<string, number> = {
    'publicador-regular': 10,
    'pioneiro-auxiliar-30': 30,
    'pioneiro-auxiliar-50': 50,
    'pioneiro-regular': 70,
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
      toast.success('Registro excluído com sucesso');
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
    
    // Gerar texto do relatório
    let texto = `*RELATÓRIO DE MINISTÉRIO*\n`;
    texto += `${monthName}\n`;
    texto += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    texto += `*Nome:* ${perfil.nome}\n`;
    texto += `*Tipo:* ${tipoPublicador}\n\n`;
    
    texto += `*HORAS DE MINISTÉRIO*\n`;
    texto += `━━━━━━━━━━━━━━━━━━━━━\n`;
    texto += `• Total: *${formatarHoras(stats.horasTotal)}*\n`;
    texto += `• Meta: ${metaMensal}h\n`;
    texto += `• Progresso: *${progressoPercentual.toFixed(0)}%*\n\n`;
    
    texto += `*DETALHAMENTO*\n`;
    texto += `• Campo: ${formatarHoras(stats.horasCampo)}\n`;
    if (stats.horasCredito > 0) {
      texto += `• Crédito: ${formatarHoras(stats.horasCredito)}\n`;
    }
    texto += `\n`;
    
    // Adicionar estatísticas de atividades
    if (stats.totalEstudos > 0 || stats.totalRevisitas > 0 || stats.totalPublicacoes > 0) {
      texto += `*ATIVIDADES REALIZADAS*\n`;
      texto += `━━━━━━━━━━━━━━━━━━━━━\n`;
      if (stats.totalEstudos > 0) {
        texto += `• Estudos Bíblicos: *${stats.totalEstudos}*\n`;
      }
      if (stats.totalRevisitas > 0) {
        texto += `• Revisitas: *${stats.totalRevisitas}*\n`;
      }
      if (stats.totalPublicacoes > 0) {
        texto += `• Publicações: *${stats.totalPublicacoes}*\n`;
      }
      texto += `\n`;
    }
    
    // Adicionar mensagem motivacional
    texto += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (stats.horasTotal >= metaMensal) {
      texto += `*META ATINGIDA!*\n`;
      texto += `Parabéns pelo excelente trabalho!\n\n`;
    } else if (stats.horasTotal > 0) {
      texto += `Continue firme!\n`;
      texto += `Você está indo muito bem!\n\n`;
    }
    
    texto += `_Gerado pelo Mynis_\n`;
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
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
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
              <h2>Progresso do Mês</h2>
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
      <div className="px-6 pt-6 pb-4" style={{ backgroundColor: '#FDF8EE' }}>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100"
              style={{ color: '#4A2C60' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-gray-900">
              {getMonthName(selectedDate.month, selectedDate.year)}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              disabled={isFutureMonth}
              className="p-2 hover:bg-gray-100 disabled:opacity-30"
              style={{ color: '#4A2C60' }}
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
              <h3 className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#C8E046' }} />
                Horas de Ministério
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {getTipoPublicadorLabel(perfil.tipoPublicador)}
              </p>
            </div>
            {stats.horasTotal >= metaMensal ? (
              <Badge className="text-white border flex items-center gap-1.5" style={{ backgroundColor: '#C8E046', color: '#4A2C60', borderColor: '#C8E046' }}>
                <CheckCircle className="w-3.5 h-3.5" />
                Meta atingida!
              </Badge>
            ) : isCurrentMonth && stats.horasTotal > 0 ? (
              <Badge className="border flex items-center gap-1.5" style={{ backgroundColor: '#E6DFF0', color: '#4A2C60', borderColor: '#E6DFF0' }}>
                <BarChart3 className="w-3.5 h-3.5" />
                No ritmo!
              </Badge>
            ) : null}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl" style={{ color: '#4A2C60' }}>{formatarHoras(stats.horasTotal)}</p>
                <p className="text-sm text-gray-500">de {metaMensal}h/mês</p>
              </div>
            </div>
            
            {/* Barra de progresso dupla */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-secondary-400">
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
              <span className="text-gray-600">0h</span>
              <span style={{ color: '#4A2C60' }}>{progressoPercentual.toFixed(0)}%</span>
              <span className="text-gray-600">{formatarHoras(metaMensal)}</span>
            </div>

            {stats.horasTotal > 0 && (
              <p className="text-sm text-center p-3 rounded-lg border flex items-center justify-center gap-2" style={{ backgroundColor: '#F3F9E6', borderColor: '#C8E046', color: '#4A2C60' }}>
                <Trophy className="w-4 h-4" style={{ color: '#C8E046' }} />
                {stats.horasTotal >= metaMensal 
                  ? 'Parabéns! Você atingiu sua meta mensal!' 
                  : 'Continue assim, você está indo muito bem!'}
              </p>
            )}
          </div>
        </Card>

        {/* History List - SIMPLIFICADO */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 px-1">
            <Clock className="w-5 h-5 text-gray-600" />
            Histórico de Atividades
          </h3>
          
          {sortedDates.length === 0 ? (
            // Empty state
            <Card className="p-12 text-center bg-white">
              <div className="text-5xl mb-4">📅</div>
              <h4 className="mb-2">Nenhum registro neste mês</h4>
              <p className="text-sm text-gray-600 mb-4">
                {isCurrentMonth 
                  ? 'Use o botão "+" para adicionar suas atividades.'
                  : 'Não há registros para este mês.'}
              </p>
            </Card>
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
                <Card key={dateKey} className="overflow-hidden bg-white">
                  {/* Header do dia */}
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: '#F3F9E6', borderColor: '#C8E046' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg text-white flex items-center justify-center" style={{ backgroundColor: '#C8E046', color: '#4A2C60' }}>
                        <span className="text-lg">{day}</span>
                      </div>
                      <div>
                        <p className="text-sm capitalize">
                          {dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                    <Badge className="text-white" style={{ backgroundColor: '#C8E046', color: '#4A2C60' }}>
                      {totalDayHours}
                    </Badge>
                  </div>
                  
                  {/* Sessões do dia */}
                  <div className="divide-y">
                    {dateSessions.map((sessao) => {
                      const duracao = formatarHoras((sessao.duracaoMinutos || 0) / 60);
                      
                      // Determinar o título da sessão baseado nas atividades
                      let tituloSessao = sessao.tipo === 'campo' ? 'Ministério de Campo' : 'Tempo de Crédito';
                      if (sessao.atividades && sessao.atividades.length === 1) {
                        // Se há apenas uma atividade, usar o nome dela como título
                        const atividadeUnica = formatarTipoAtividade(sessao.atividades[0].tipo);
                        tituloSessao = atividadeUnica.label;
                      }
                      
                      return (
                        <div key={sessao.id} className="p-4 hover:bg-gray-50 transition-colors">
                          {/* Linha principal */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {sessao.tipo === 'campo' ? (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3F9E6' }}>
                                  <Sprout className="w-5 h-5" style={{ color: '#4A2C60' }} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3F9E6' }}>
                                  <Timer className="w-5 h-5" style={{ color: '#4A2C60' }} />
                                </div>
                              )}
                              <div>
                                <p className="text-sm" style={{ color: '#4A2C60' }}>
                                  {tituloSessao}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {sessao.horaInicio} {sessao.horaFim && `- ${sessao.horaFim}`}
                                  {' • '}
                                  <span className="capitalize">{sessao.periodo}</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-sm" style={{ color: '#4A2C60' }}>{duracao}</span>
                          </div>
                          
                          {/* Atividades (se houver) */}
                          {sessao.atividades && sessao.atividades.length > 0 && (
                            <div className="space-y-1.5 mt-2">
                              {sessao.atividades.map((atividade, idx) => {
                                const atividadeInfo = formatarTipoAtividade(atividade.tipo);
                                const IconComponent = atividadeInfo.icon;
                                return (
                                  <div key={idx} className="flex items-center gap-2">
                                    <Badge 
                                      className="text-xs border flex items-center gap-1.5"
                                      style={{ backgroundColor: '#F3F9E6', color: '#4A2C60', borderColor: '#C8E046' }}
                                    >
                                      <IconComponent className="w-3 h-3" style={{ color: '#4A2C60' }} />
                                      {atividadeInfo.label}
                                    </Badge>
                                    {atividade.detalhes && (
                                      <span className="text-xs" style={{ color: '#4A2C60' }}>
                                        {atividade.detalhes}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Observações (se houver) */}
                          {sessao.observacoes && (
                            <div className="flex items-start gap-2 mt-2">
                              <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600 italic">
                                {sessao.observacoes}
                              </p>
                            </div>
                          )}
                          
                          {/* Botões de ação */}
                          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarClick(sessao)}
                              className="h-8 px-3 text-xs text-gray-600 hover:bg-white/20"
                              style={{ color: '#4A2C60' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(74, 44, 96, 0.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExcluirClick(sessao)}
                              className="h-8 px-3 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Registro</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza de que deseja excluir este registro de ministério?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelarExclusao}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarExclusao}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}