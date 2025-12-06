import { ArrowLeft, Plus, Check, Target, Flame, BarChart3, CheckCircle, Pause, Play, CheckCheck, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ThemeService } from '../../services/themeService';
import { DataService, Alvo } from '../../services/dataService';
import { useTranslations } from '../../utils/i18n/translations';

interface AlvosEspirituaisPageProps {
  onVoltar: () => void;
  onAbrirNovoAlvo: () => void;
  onEditarAlvo?: (alvo: Alvo) => void;
}

export default function AlvosEspirituaisPage({ onVoltar, onAbrirNovoAlvo, onEditarAlvo }: AlvosEspirituaisPageProps) {
  const t = useTranslations();
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [alvos, setAlvos] = useState<Alvo[]>([]);
  const [alvosPausados, setAlvosPausados] = useState<Set<string>>(new Set());

  // Carregar alvos do DataService
  const carregarAlvos = () => {
    const todosAlvos = DataService.getAlvos();
    setAlvos(todosAlvos);
  };

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    carregarAlvos();
  }, []);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Adicionar listener para mudanças nos alvos
  useEffect(() => {
    const handleDataChange = () => {
      carregarAlvos();
    };
    
    window.addEventListener('mynis-data-change', handleDataChange);
    
    return () => {
      window.removeEventListener('mynis-data-change', handleDataChange);
    };
  }, []);

  // Handlers
  const handleConcluirAlvo = (alvo: Alvo) => {
    DataService.atualizarAlvo(alvo.id, {
      concluido: true,
      progresso: 100,
      dataConclusao: new Date().toISOString()
    });

    import('sonner@2.0.3').then(({ toast }) => {
      toast.success('Alvo concluído', {
        description: `Parabéns por alcançar: ${alvo.titulo}`,
        icon: <CheckCircle2 className="w-5 h-5" />
      });
    });
  };

  const handlePausarAlvo = (alvoId: string) => {
    setAlvosPausados(prev => {
      const newSet = new Set(prev);
      newSet.add(alvoId);
      return newSet;
    });

    import('sonner@2.0.3').then(({ toast }) => {
      toast.success('Alvo pausado', {
        icon: <Pause className="w-5 h-5" />
      });
    });
  };

  const handleRetomarAlvo = (alvoId: string) => {
    setAlvosPausados(prev => {
      const newSet = new Set(prev);
      newSet.delete(alvoId);
      return newSet;
    });

    import('sonner@2.0.3').then(({ toast }) => {
      toast.success('Alvo retomado', {
        icon: <Play className="w-5 h-5" />
      });
    });
  };

  // Filtrar alvos por status
  const alvosAtivosLista = alvos.filter(a => !a.concluido && a.progresso < 100 && !alvosPausados.has(a.id));
  const alvosConcluidos = alvos.filter(a => a.concluido || a.progresso >= 100);
  const alvosListaPausados = alvos.filter(a => alvosPausados.has(a.id) && !a.concluido);

  const todosAlvos = alvos;

  return (
    <div className="min-h-screen pb-20 bg-neutral">
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white"
        style={{
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'
        }}
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
            <h2 className="text-xl">{t.spiritualGoals.headerTitle}</h2>
            <p className="text-sm opacity-90">{t.spiritualGoals.headerSubtitle(alvosAtivosLista.length)}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Sobre Alvos - APENAS quando não há alvos */}
        {todosAlvos.length === 0 && (
          <Card 
            className="p-6 border-2"
            style={{
              backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.08)' : 'rgba(74, 44, 96, 0.05)',
              borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.2)'
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              >
                <Target 
                  className="w-6 h-6" 
                  style={{
                    color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                  }}
                />
              </div>
              <div>
                <h3 
                  className="mb-2"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#1F2937'
                  }}
                >
                  {t.spiritualGoals.whyTitle}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
                  }}
                >
                  {t.spiritualGoals.whyDescription}
                </p>
                <p 
                  className="text-xs mt-2 italic"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.spiritualGoals.bibleVerse}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Seção: Alvos Ativos */}
        {alvosAtivosLista.length > 0 && (
          <div>
            <h3 
              className="mb-3 text-sm font-medium flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <Flame className="w-4 h-4" />
              {t.spiritualGoals.sectionInProgress}
            </h3>
            <div className="space-y-3">
              {alvosAtivosLista.map((alvo) => (
                <Card key={alvo.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 
                          className="font-medium mb-1"
                          style={{
                            color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                          }}
                        >
                          {alvo.titulo}
                        </h4>
                        {alvo.descricao && (
                          <p 
                            className="text-sm"
                            style={{
                              color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                            }}
                          >
                            {alvo.descricao}
                          </p>
                        )}
                        {alvo.prazo && (
                          <p 
                            className="text-xs mt-1"
                            style={{
                              color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                            }}
                          >
                            Prazo: {new Date(alvo.prazo).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant="estudo"
                        style={{
                          backgroundColor: temaAtual === 'escuro' ? '#C8E046' : undefined,
                          color: temaAtual === 'escuro' ? '#1F2937' : undefined
                        }}
                      >
                        {alvo.progresso}%
                      </Badge>
                    </div>
                    <Progress value={alvo.progresso} className="h-2" />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => onEditarAlvo && onEditarAlvo(alvo)}
                        style={{
                          color: temaAtual === 'escuro' ? '#C8E046' : undefined,
                          borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : undefined
                        }}
                      >
                        {t.spiritualGoals.buttonEdit}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => handlePausarAlvo(alvo.id)}
                        style={{
                          color: temaAtual === 'escuro' ? '#9CA3AF' : undefined,
                          borderColor: temaAtual === 'escuro' ? 'rgba(156, 163, 175, 0.3)' : undefined
                        }}
                      >
                        {t.spiritualGoals.buttonPause}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => handleConcluirAlvo(alvo)}
                        style={{
                          color: temaAtual === 'escuro' ? '#86EFAC' : '#16A34A',
                          borderColor: temaAtual === 'escuro' ? 'rgba(134, 239, 172, 0.3)' : undefined
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(134, 239, 172, 0.1)' : 'rgba(22, 163, 74, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {t.spiritualGoals.buttonComplete}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Seção: Alvos Pausados */}
        {alvosListaPausados.length > 0 && (
          <div>
            <h3 
              className="mb-3 text-sm font-medium flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#374151'
              }}
            >
              <Pause className="w-4 h-4" />
              {t.spiritualGoals.sectionPaused}
            </h3>
            <div className="space-y-3">
              {alvosListaPausados.map((alvo, idx) => (
                <Card 
                  key={idx} 
                  className="p-5 opacity-75"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(156, 163, 175, 0.1)' : '#F9FAFB'
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 
                          className="font-medium mb-1"
                          style={{
                            color: temaAtual === 'escuro' ? '#D1D5DB' : '#1F2937'
                          }}
                        >
                          {alvo.titulo}
                        </h4>
                        {alvo.meta && (
                          <p 
                            className="text-sm"
                            style={{
                              color: temaAtual === 'escuro' ? '#9CA3AF' : '#4B5563'
                            }}
                          >
                            Meta: {alvo.meta}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant="secondary"
                        style={{
                          backgroundColor: temaAtual === 'escuro' ? 'rgba(156, 163, 175, 0.2)' : undefined,
                          color: temaAtual === 'escuro' ? '#D1D5DB' : undefined
                        }}
                      >
                        {alvo.progresso}%
                      </Badge>
                    </div>
                    <Progress value={alvo.progresso} className="h-2" />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleRetomarAlvo(alvo.id)}
                      style={{
                        color: temaAtual === 'escuro' ? '#C8E046' : undefined,
                        borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : undefined
                      }}
                    >
                      {t.spiritualGoals.buttonResume}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Seção: Alvos Concluídos */}
        {alvosConcluidos.length > 0 && (
          <div>
            <h3 
              className="mb-3 text-sm font-medium flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#86EFAC' : '#15803D'
              }}
            >
              <CheckCircle className="w-4 h-4" />
              {t.spiritualGoals.sectionCompleted}
            </h3>
            <div className="space-y-3">
              {alvosConcluidos.map((alvo, idx) => (
                <Card 
                  key={idx} 
                  className="p-5"
                  style={{
                    background: temaAtual === 'escuro' 
                      ? 'linear-gradient(to bottom right, rgba(134, 239, 172, 0.08), rgba(134, 239, 172, 0.12))'
                      : 'linear-gradient(to bottom right, #F0FDF4, #DCFCE7)',
                    borderColor: temaAtual === 'escuro' ? 'rgba(134, 239, 172, 0.2)' : '#BBF7D0'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: temaAtual === 'escuro' ? '#86EFAC' : '#22C55E'
                      }}
                    >
                      <Check 
                        className="w-5 h-5" 
                        style={{
                          color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 
                        className="font-medium mb-1"
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {alvo.titulo}
                      </h4>
                      {alvo.descricao && (
                        <p 
                          className="text-sm"
                          style={{
                            color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                          }}
                        >
                          {alvo.descricao}
                        </p>
                      )}
                      <Badge 
                        className="mt-2"
                        style={{
                          backgroundColor: temaAtual === 'escuro' ? '#86EFAC' : '#16A34A',
                          color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                        }}
                      >
                        Concluído!
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {todosAlvos.length === 0 && (
          <Card className="p-12 text-center">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.12)' : 'rgba(74, 44, 96, 0.1)'
              }}
            >
              <Target 
                className="w-10 h-10" 
                style={{
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              />
            </div>
            <h3 
              className="mb-2"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              {t.spiritualGoals.startTitle}
            </h3>
            <p 
              className="text-sm mb-6"
              style={{
                color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
              }}
            >
              {t.spiritualGoals.startDescription}
            </p>
            <p 
              className="text-sm"
              style={{
                color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
              }}
            >
              {t.spiritualGoals.startTip}
            </p>
          </Card>
        )}

        {/* Card: Estatísticas */}
        {todosAlvos.length > 0 && (
          <Card className="p-6">
            <h3 
              className="mb-4 flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <BarChart3 className="w-5 h-5" />
              {t.spiritualGoals.summaryTitle}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div 
                className="text-center p-4 rounded-lg"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)'
                }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {alvosAtivosLista.length}
                </p>
                <p 
                  className="text-xs mt-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.spiritualGoals.summaryInProgress}
                </p>
              </div>
              <div 
                className="text-center p-4 rounded-lg"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(134, 239, 172, 0.1)' : '#F0FDF4'
                }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{
                    color: temaAtual === 'escuro' ? '#86EFAC' : '#15803D'
                  }}
                >
                  {alvosConcluidos.length}
                </p>
                <p 
                  className="text-xs mt-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.spiritualGoals.summaryCompleted}
                </p>
              </div>
              <div 
                className="text-center p-4 rounded-lg"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(156, 163, 175, 0.1)' : '#F9FAFB'
                }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
                  }}
                >
                  {alvosListaPausados.length}
                </p>
                <p 
                  className="text-xs mt-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.spiritualGoals.summaryPaused}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* FAB - Botão de Ação Flutuante */}
      <button
        onClick={onAbrirNovoAlvo}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
          color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
        }}
        aria-label="Criar novo alvo"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}