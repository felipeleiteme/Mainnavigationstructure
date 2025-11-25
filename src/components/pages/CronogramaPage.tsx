import { ArrowLeft, Calendar, Clock, BookOpen, MapPin, Users, ChevronLeft, ChevronRight, MessageCircle, BookMarked } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataService, Estudo, Revisita } from '../../services/dataService';

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
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Estado da semana selecionada (0 = semana atual, 1 = próxima, -1 = anterior)
  const [offsetSemana, setOffsetSemana] = useState(0);
  const [semana, setSemana] = useState<DiaComAgendamentos[]>([]);

  // Load data whenever selected week changes
  useEffect(() => {
    carregarSemana();
    
    // Listen for data changes
    const handleDataChange = () => carregarSemana();
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, [offsetSemana]);

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
    const diasNomes = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

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

      diasDaSemana.push({
        dia: diasNomes[i],
        data: diaAtual,
        dataFormatada: diaAtual.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
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
    
    const mesInicio = primeiroDia.toLocaleDateString('pt-BR', { month: 'short' });
    const mesFim = ultimoDia.toLocaleDateString('pt-BR', { month: 'short' });
    const ano = primeiroDia.getFullYear();
    
    if (mesInicio === mesFim) {
      return `${primeiroDia.getDate()} - ${ultimoDia.getDate()} ${mesInicio.charAt(0).toUpperCase() + mesInicio.slice(1)} ${ano}`;
    } else {
      return `${primeiroDia.getDate()} ${mesInicio} - ${ultimoDia.getDate()} ${mesFim} ${ano}`;
    }
  };

  const getBadgeSemana = () => {
    if (offsetSemana === 0) return 'Esta Semana';
    if (offsetSemana === 1) return 'Próxima Semana';
    if (offsetSemana === -1) return 'Semana Passada';
    if (offsetSemana > 1) return `Daqui a ${offsetSemana} semanas`;
    return `${Math.abs(offsetSemana)} semanas atrás`;
  };

  return (
    <div className="min-h-screen pb-20 bg-neutral">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-primary-500 text-white">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="p-0 text-white hover:bg-white/20 hover:text-white h-8 w-8"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl">Cronograma da Semana</h2>
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
              className="p-2 text-primary-500 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex flex-col items-center gap-1.5">
              <h3 className="text-gray-900">{getTextoSemana()}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="nova"
                  className="text-xs px-2.5 py-0.5"
                >
                  {getBadgeSemana()}
                </Badge>
                {offsetSemana !== 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoltarHoje}
                    className="text-xs h-6 px-2 hover:bg-gray-100"
                    style={{ color: '#4A2C60' }}
                  >
                    Hoje
                  </Button>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProximaSemana}
              className="p-2 hover:bg-gray-100"
              style={{ color: '#4A2C60' }}
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
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Semana finalizada</h3>
                <p className="text-sm text-gray-600">
                  {offsetSemana === 0 
                    ? 'Todos os dias desta semana já passaram.' 
                    : 'Todos os dias desta semana já passaram.'}
                </p>
                {offsetSemana === 0 && (
                  <Button
                    onClick={handleProximaSemana}
                    className="mt-4 text-white hover:opacity-90"
                    style={{ backgroundColor: '#4A2C60' }}
                  >
                    Ver Próxima Semana
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
                      className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${
                        dia.isHoje 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-primary-100 text-primary-500'
                      }`}
                    >
                      <span className="text-lg">
                        {dia.data.getDate()}
                      </span>
                    </div>
                    <div>
                      <h3>{dia.dia}</h3>
                      <p className="text-sm text-gray-600">{dia.dataFormatada}</p>
                    </div>
                  </div>
                  
                  {dia.isHoje && (
                    <Badge variant="estudo">
                      Hoje
                    </Badge>
                  )}
                  
                  {!dia.isHoje && temAgendamentos && (
                    <Badge variant="iniciando">
                      {totalAgendamentos} {totalAgendamentos === 1 ? 'agendamento' : 'agendamentos'}
                    </Badge>
                  )}
                  
                  {!dia.isHoje && !temAgendamentos && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Livre
                    </Badge>
                  )}
                </div>

                {/* Estudos Bíblicos */}
                {dia.estudos.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {dia.estudos.map((estudo) => (
                      <div 
                        key={estudo.id}
                        className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-purple-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ borderColor: '#E6DFF0' }}
                        onClick={() => onNavigateToEstudo && onNavigateToEstudo(estudo.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-primary-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm">{estudo.estudanteNome}</h4>
                              <Badge variant="estudo" className="text-xs">
                                Estudo Bíblico
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{estudo.publicacao}</p>
                            {estudo.licao && (
                              <p className="text-xs text-gray-600">Lição {estudo.licao}</p>
                            )}
                            <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-gray-600">
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
                                <MessageCircle className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600 italic">
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
                        className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-green-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ borderColor: '#C8E046' }}
                        onClick={() => onNavigateToRevisita && onNavigateToRevisita(revisita.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-primary-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm">{revisita.nome}</h4>
                              <Badge variant="nova" className="text-xs">
                                Revisita
                              </Badge>
                            </div>
                            <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {revisita.endereco}
                              </span>
                              {revisita.quantidadeVisitas > 0 && (
                                <span style={{ color: '#4A2C60' }}>
                                  {revisita.quantidadeVisitas}ª visita
                                </span>
                              )}
                            </div>
                            {revisita.primeiraConversa && (
                              <div className="flex items-start gap-1.5 mt-2">
                                <MessageCircle className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600">
                                  {revisita.primeiraConversa.substring(0, 80)}
                                  {revisita.primeiraConversa.length > 80 ? '...' : ''}
                                </p>
                              </div>
                            )}
                            {revisita.publicacoesEntregues && revisita.publicacoesEntregues.length > 0 && (
                              <div className="flex items-start gap-1.5 mt-1">
                                <BookMarked className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600">
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
                  <p className="text-sm text-gray-500 text-center py-4">
                    {dia.isPast 
                      ? 'Nenhuma atividade foi agendada' 
                      : 'Nenhuma atividade planejada'}
                  </p>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Info Card at bottom */}
      <div className="px-6 pb-6">
        <Card className="p-4 bg-primary-50 border-2 border-primary-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-primary-500">
                <strong>Como funciona?</strong>
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                Esta tela mostra seus <strong>estudos bíblicos</strong> agendados (data + horário) e 
                suas <strong>revisitas com próxima visita</strong> marcada para cada dia da semana.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}