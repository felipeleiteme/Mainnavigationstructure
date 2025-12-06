import { ArrowLeft, Calendar, Clock, BookOpen, MapPin, Users, ChevronLeft, ChevronRight, MessageCircle, BookMarked } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ThemeService } from '../../services/themeService';
import { DataService, Estudo, Revisita } from '../../services/dataService';
import { useTranslations } from '../../utils/i18n/translations';
import { LanguageService } from '../../services/languageService';

interface CronogramaPageProps {
  onVoltar: () => void;
  diaSelecionado?: any;
  onNavigateToEstudo?: (estudoId: string) => void;
  onNavigateToRevisita?: (revisitaId: string) => void;
}

interface DiaComAgendamentos {
  dia: string;
  data: Date;
  dataFormatada: string;
  estudos: Estudo[];
  revisitas: Revisita[];
  isHoje: boolean;
  isPast: boolean;
}

export default function CronogramaPage({ onVoltar, diaSelecionado, onNavigateToEstudo, onNavigateToRevisita }: CronogramaPageProps) {
  const t = useTranslations();
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [idiomaAtual, setIdiomaAtual] = useState(LanguageService.getLanguage());

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
    const handleIdiomaChange = () => {
      setIdiomaAtual(LanguageService.getLanguage());
    };

    LanguageService.on('mynis-language-change', handleIdiomaChange);
    return () => LanguageService.off('mynis-language-change', handleIdiomaChange);
  }, []);

  // Estado da semana selecionada (0 = semana atual, 1 = próxima, -1 = anterior)
  const [offsetSemana, setOffsetSemana] = useState(0);
  const [semana, setSemana] = useState<DiaComAgendamentos[]>([]);

  // Load data whenever selected week or language changes
  useEffect(() => {
    carregarSemana();
    
    // Listen for data changes
    const handleDataChange = () => carregarSemana();
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, [offsetSemana, idiomaAtual]);

  const carregarSemana = () => {
    // Get all estudos and revisitas
    const todosEstudos = DataService.getEstudos();
    const todasRevisitas = DataService.getRevisitas();

    // Calculate week range
    const hoje = new Date();
    const primeiroDiaSemana = new Date(hoje);
    primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay() + 1 + (offsetSemana * 7)); // Monday
    primeiroDiaSemana.setHours(0, 0, 0, 0);

    const diasDaSemana: DiaComAgendamentos[] = [];
    const diasNomes = [t.schedule.monday, t.schedule.tuesday, t.schedule.wednesday, t.schedule.thursday, t.schedule.friday, t.schedule.saturday, t.schedule.sunday];

    for (let i = 0; i < 7; i++) {
      const diaAtual = new Date(primeiroDiaSemana);
      diaAtual.setDate(primeiroDiaSemana.getDate() + i);
      
      const dataStr = diaAtual.toISOString().split('T')[0];
      const hojeStr = hoje.toISOString().split('T')[0];
      
      // Filter estudos for this day (check both ISO full date and date-only)
      const estudosDoDia = todosEstudos.filter(e => {
        const estudoDate = e.data.split('T')[0]; // Extract YYYY-MM-DD from ISO
        return estudoDate === dataStr;
      });
      
      // Filter revisitas with proximaVisita for this day
      const revisitasDoDia = todasRevisitas.filter(r => {
        if (!r.proximaVisita) return false;
        const proximaVisitaDate = r.proximaVisita.split('T')[0]; // Extract YYYY-MM-DD
        return proximaVisitaDate === dataStr;
      });

      const locale = idiomaAtual === 'pt-BR' ? 'pt-BR' : idiomaAtual === 'es' ? 'es' : 'en-US';
      
      diasDaSemana.push({
        dia: diasNomes[i],
        data: diaAtual,
        dataFormatada: diaAtual.toLocaleDateString(locale, { day: '2-digit', month: 'short' }),
        estudos: estudosDoDia,
        revisitas: revisitasDoDia,
        isHoje: dataStr === hojeStr,
        isPast: diaAtual < hoje && dataStr !== hojeStr,
      });
    }

    setSemana(diasDaSemana);
  };

  const handleSemanaAnterior = () => {
    setOffsetSemana(prev => prev - 1);
  };

  const handleProximaSemana = () => {
    setOffsetSemana(prev => prev + 1);
  };

  const handleVoltarHoje = () => {
    setOffsetSemana(0);
  };

  // Get week range text
  const getTextoSemana = () => {
    if (semana.length === 0) return '';
    const primeiroDia = semana[0].data;
    const ultimoDia = semana[6].data;
    
    const locale = idiomaAtual === 'pt-BR' ? 'pt-BR' : idiomaAtual === 'es' ? 'es' : 'en-US';
    const mesInicio = primeiroDia.toLocaleDateString(locale, { month: 'short' });
    const mesFim = ultimoDia.toLocaleDateString(locale, { month: 'short' });
    const ano = primeiroDia.getFullYear();
    
    if (mesInicio === mesFim) {
      return `${primeiroDia.getDate()} - ${ultimoDia.getDate()} ${mesInicio.charAt(0).toUpperCase() + mesInicio.slice(1)} ${ano}`;
    } else {
      return `${primeiroDia.getDate()} ${mesInicio} - ${ultimoDia.getDate()} ${mesFim} ${ano}`;
    }
  };

  const getBadgeSemana = () => {
    if (offsetSemana === 0) return t.schedule.thisWeek;
    if (offsetSemana === 1) return t.schedule.nextWeek;
    if (offsetSemana === -1) return t.schedule.lastWeek;
    if (offsetSemana > 1) return t.schedule.weeksAhead.replace('{n}', offsetSemana.toString());
    return t.schedule.weeksAgo.replace('{n}', Math.abs(offsetSemana).toString());
  };

  return (
    <div className="min-h-screen pb-20 bg-neutral">
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-50 text-white"
        style={{
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'
        }}
      >
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl">{t.schedule.title}</h2>
          </div>
        </div>
      </div>

      {/* Week Navigator - FORA DO HEADER ROXO */}
      <div className="px-6 pt-6 pb-4 bg-neutral">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSemanaAnterior}
              className="p-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex flex-col items-center gap-1.5">
              <h3 
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                {getTextoSemana()}
              </h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="nova"
                  className="text-xs px-2.5 py-0.5"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : undefined,
                    color: temaAtual === 'escuro' ? '#C8E046' : undefined
                  }}
                >
                  {getBadgeSemana()}
                </Badge>
                {offsetSemana !== 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoltarHoje}
                    className="text-xs h-6 px-2"
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {t.schedule.today}
                  </Button>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProximaSemana}
              className="p-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-4">
        {semana.filter(dia => !dia.isPast).length === 0 ? (
          // Empty state quando todos os dias já passaram
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(156, 163, 175, 0.15)' : '#F3F4F6'
                }}
              >
                <Calendar 
                  className="w-8 h-8" 
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#9CA3AF'
                  }}
                />
              </div>
              <div>
                <h3 
                  className="mb-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {t.schedule.weekFinished}
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                  }}
                >
                  {t.schedule.allDaysPassed}
                </p>
                {offsetSemana === 0 && (
                  <Button
                    onClick={handleProximaSemana}
                    className="mt-4 hover:opacity-90"
                    style={{ 
                      backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                      color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                    }}
                  >
                    {t.schedule.seeNextWeek}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          semana
            .filter(dia => !dia.isPast) // Ocultar dias que já passaram
            .map((dia, idx) => {
            const totalAgendamentos = dia.estudos.length + dia.revisitas.length;
            const temAgendamentos = totalAgendamentos > 0;

            return (
              <Card 
                key={idx} 
                className="p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: dia.isHoje 
                          ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                          : (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.12)' : 'rgba(74, 44, 96, 0.1)'),
                        color: dia.isHoje 
                          ? (temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF')
                          : (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                      }}
                    >
                      <span className="text-lg font-semibold">
                        {dia.data.getDate()}
                      </span>
                    </div>
                    <div>
                      <h3
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {dia.dia}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{
                          color: temaAtual === 'escuro' ? '#9CA3AF' : '#4B5563'
                        }}
                      >
                        {dia.dataFormatada}
                      </p>
                    </div>
                  </div>
                  
                  {dia.isHoje && (
                    <Badge 
                      variant="estudo"
                      style={{
                        backgroundColor: temaAtual === 'escuro' ? '#C8E046' : undefined,
                        color: temaAtual === 'escuro' ? '#1F2937' : undefined
                      }}
                    >
                      {t.schedule.today}
                    </Badge>
                  )}
                  
                  {!dia.isHoje && temAgendamentos && (
                    <Badge 
                      variant="iniciando"
                      style={{
                        backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : undefined,
                        color: temaAtual === 'escuro' ? '#C8E046' : undefined
                      }}
                    >
                      {totalAgendamentos} {totalAgendamentos === 1 ? t.schedule.appointment : t.schedule.appointments}
                    </Badge>
                  )}
                  
                  {!dia.isHoje && !temAgendamentos && (
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: temaAtual === 'escuro' ? 'rgba(156, 163, 175, 0.15)' : '#F3F4F6',
                        color: temaAtual === 'escuro' ? '#9CA3AF' : '#4B5563'
                      }}
                    >
                      {t.schedule.free}
                    </Badge>
                  )}
                </div>

                {/* Estudos Bíblicos */}
                {dia.estudos.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {dia.estudos.map((estudo) => (
                      <div 
                        key={estudo.id}
                        className="p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ 
                          backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                          borderColor: temaAtual === 'escuro' ? 'rgba(138, 101, 168, 0.3)' : '#E6DFF0'
                        }}
                        onClick={() => onNavigateToEstudo && onNavigateToEstudo(estudo.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(138, 101, 168, 0.08)' : '#FAF5FF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF';
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: temaAtual === 'escuro' ? 'rgba(138, 101, 168, 0.15)' : 'rgba(74, 44, 96, 0.1)'
                            }}
                          >
                            <BookOpen 
                              className="w-5 h-5" 
                              style={{
                                color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 
                                className="text-sm"
                                style={{
                                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                                }}
                              >
                                {estudo.estudanteNome}
                              </h4>
                              <Badge 
                                variant="estudo" 
                                className="text-xs"
                                style={{
                                  backgroundColor: temaAtual === 'escuro' ? 'rgba(138, 101, 168, 0.25)' : undefined,
                                  color: temaAtual === 'escuro' ? '#C7B3E5' : undefined,
                                  borderColor: temaAtual === 'escuro' ? 'rgba(138, 101, 168, 0.4)' : undefined,
                                  borderWidth: temaAtual === 'escuro' ? '1px' : undefined,
                                  borderStyle: temaAtual === 'escuro' ? 'solid' : undefined
                                }}
                              >
                                {t.schedule.bibleStudy}
                              </Badge>
                            </div>
                            <p 
                              className="text-xs mt-1"
                              style={{
                                color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                              }}
                            >
                              {estudo.publicacao}
                            </p>
                            {estudo.licao && (
                              <p 
                                className="text-xs"
                                style={{
                                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                                }}
                              >
                                {t.schedule.lesson} {estudo.licao}
                              </p>
                            )}
                            <div 
                              className="flex items-center flex-wrap gap-3 mt-2 text-xs"
                              style={{
                                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                              }}
                            >
                              {estudo.horario && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {estudo.horario}
                                </span>
                              )}
                              {estudo.endereco && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {estudo.endereco}
                                </span>
                              )}
                            </div>
                            {estudo.observacoes && (
                              <div className="flex items-start gap-1.5 mt-2">
                                <MessageCircle 
                                  className="w-3 h-3 flex-shrink-0 mt-0.5" 
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                />
                                <p 
                                  className="text-xs italic"
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                >
                                  {estudo.observacoes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Revisitas Agendadas */}
                {dia.revisitas.length > 0 && (
                  <div className={`space-y-3 ${dia.estudos.length > 0 ? 'mt-3' : 'mt-4'}`}>
                    {dia.revisitas.map((revisita) => (
                      <div 
                        key={revisita.id}
                        className="p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ 
                          backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                          borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.4)' : '#C8E046'
                        }}
                        onClick={() => onNavigateToRevisita && onNavigateToRevisita(revisita.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.08)' : '#F0FDF4';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF';
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : '#C8E046'
                            }}
                          >
                            <Users 
                              className="w-5 h-5" 
                              style={{
                                color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60'
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 
                                className="text-sm"
                                style={{
                                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                                }}
                              >
                                {revisita.nome}
                              </h4>
                              <Badge 
                                variant="nova" 
                                className="text-xs"
                                style={{
                                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : undefined,
                                  color: temaAtual === 'escuro' ? '#D4E969' : undefined,
                                  borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.5)' : undefined,
                                  borderWidth: temaAtual === 'escuro' ? '1px' : undefined,
                                  borderStyle: temaAtual === 'escuro' ? 'solid' : undefined
                                }}
                              >
                                {t.schedule.returnVisit}
                              </Badge>
                            </div>
                            <div 
                              className="flex items-center flex-wrap gap-3 mt-2 text-xs"
                              style={{
                                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {revisita.endereco}
                              </span>
                              {revisita.quantidadeVisitas > 0 && (
                                <span 
                                  style={{ 
                                    color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60',
                                    fontWeight: 600
                                  }}
                                >
                                  {revisita.quantidadeVisitas}ª {t.schedule.visit}
                                </span>
                              )}
                            </div>
                            {revisita.primeiraConversa && (
                              <div className="flex items-start gap-1.5 mt-2">
                                <MessageCircle 
                                  className="w-3 h-3 flex-shrink-0 mt-0.5" 
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                />
                                <p 
                                  className="text-xs"
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                >
                                  {revisita.primeiraConversa.substring(0, 80)}
                                  {revisita.primeiraConversa.length > 80 ? '...' : ''}
                                </p>
                              </div>
                            )}
                            {revisita.publicacoesEntregues && revisita.publicacoesEntregues.length > 0 && (
                              <div className="flex items-start gap-1.5 mt-1">
                                <BookMarked 
                                  className="w-3 h-3 flex-shrink-0 mt-0.5" 
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                />
                                <p 
                                  className="text-xs"
                                  style={{
                                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                                  }}
                                >
                                  {revisita.publicacoesEntregues.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!temAgendamentos && (
                  <p 
                    className="text-sm text-center py-4"
                    style={{
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                    }}
                  >
                    {dia.isPast 
                      ? t.schedule.noActivityScheduled 
                      : t.schedule.noActivityPlanned}
                  </p>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Info Card at bottom */}
      <div className="px-6 pb-6">
        <Card 
          className="p-4 border-2"
          style={{
            backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.08)' : 'rgba(74, 44, 96, 0.05)',
            borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.2)'
          }}
        >
          <div className="flex items-start gap-3">
            <Calendar 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            />
            <div className="flex-1">
              <p 
                className="text-sm mb-1 font-semibold"
                style={{
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              >
                {t.schedule.howItWorks}
              </p>
              <p 
                className="text-xs leading-relaxed"
                style={{
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
                }}
              >
                {t.schedule.howItWorksDescription}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}