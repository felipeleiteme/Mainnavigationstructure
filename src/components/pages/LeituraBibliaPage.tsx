import { Settings, BookOpen, Trophy, Medal, Star, Sparkles, CheckCircle, Award, Flame, TrendingUp, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { useTranslations } from '../../utils/i18n/translations';
import ConfettiEffect from '../ConfettiEffect';
import EmptyStateLeitura from '../leitura/EmptyStateLeitura';
import OnboardingLeitura from '../leitura/OnboardingLeitura';
import MarcarLeituraDialog from '../leitura/MarcarLeituraDialog';
import {
  carregarDados,
  salvarConfiguracao,
  marcarLeituraConcluida,
  obterProximaLeitura,
  calcularProgresso,
  jaLeuHoje,
  ConfiguracaoLeitura,
} from '../../utils/storage/leituraStorage';

interface LeituraBibliaPageProps {
  onVoltar: () => void;
  onAbrirConfiguracoes: () => void;
}

// Definição das conquistas/badges
const CONQUISTAS = [
  { id: 'primeira-semana', dias: 3, icon: Medal },
  { id: 'semana-completa', dias: 7, icon: Trophy },
  { id: 'duas-semanas', dias: 14, icon: Star },
  { id: 'mes-completo', dias: 30, icon: Sparkles },
];

export default function LeituraBibliaPage({ onVoltar, onAbrirConfiguracoes }: LeituraBibliaPageProps) {
  const t = useTranslations();

  const getNomeConquista = (id: string): string => {
    const nomes: Record<string, string> = {
      'primeira-semana': t.biblePage.achievement3Days,
      'semana-completa': t.biblePage.achievement7Days,
      'duas-semanas': t.biblePage.achievement14Days,
      'mes-completo': t.biblePage.achievement30Days,
    };
    return nomes[id] || 'Conquista';
  };

  const getNomeConquistaCard = (id: string): string => {
    const nomes: Record<string, string> = {
      'primeira-semana': t.biblePage.achievementFirstWeek,
      'semana-completa': t.biblePage.achievementWeekComplete,
      'duas-semanas': t.biblePage.achievementTwoWeeks,
      'mes-completo': t.biblePage.achievementMonthComplete,
    };
    return nomes[id] || 'Conquista';
  };

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [dados, setDados] = useState(carregarDados());
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [mostrarDialogLeitura, setMostrarDialogLeitura] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Recarregar dados sempre que o componente for montado (detecta mudanças após reset)
  useEffect(() => {
    const dadosAtualizados = carregarDados();
    setDados(dadosAtualizados);
  }, []);

  const proximaLeitura = dados.configurado && dados.configuracao
    ? obterProximaLeitura(dados.configuracao.plano, dados.capitulosLidos)
    : null;

  const progresso = calcularProgresso(dados);
  const jaLeu = jaLeuHoje(dados);

  const handleIniciarOnboarding = () => {
    setMostrarOnboarding(true);
  };

  const handleConcluirOnboarding = (config: ConfiguracaoLeitura) => {
    salvarConfiguracao(config);
    setDados(carregarDados());
    setMostrarOnboarding(false);
    toast.success(t.biblePage.toastConfigured, {
      description: t.biblePage.toastConfiguredDesc,
    });
  };

  const handleVoltarOnboarding = () => {
    setMostrarOnboarding(false);
  };

  const handleMarcarLeitura = () => {
    if (jaLeu) {
      toast.info(t.biblePage.toastAlreadyRead, {
        description: t.biblePage.toastAlreadyReadDesc,
      });
      return;
    }
    setMostrarDialogLeitura(true);
  };

  const handleConfirmarLeitura = (reflexao?: { aprendizado: string; aplicacao: string; palavra: string }) => {
    if (!proximaLeitura) return;

    const resultado = marcarLeituraConcluida(
      proximaLeitura.livro,
      proximaLeitura.capitulo,
      reflexao
    );

    // Atualizar estado local
    setDados(carregarDados());
    setMostrarDialogLeitura(false);

    // Feedback de sucesso
    toast.success(t.biblePage.toastReadingRegistered, {
      description: t.biblePage.toastReadingRegisteredDesc(proximaLeitura.livro, proximaLeitura.capitulo.toString()),
    });

    // Se desbloqueou conquistas, mostrar notificações
    if (resultado.novasConquistas.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);

      resultado.novasConquistas.forEach((conquistaId, index) => {
        setTimeout(() => {
          toast.success(t.biblePage.toastNewAchievement, {
            description: getNomeConquista(conquistaId),
            duration: 5000,
          });
        }, index * 1500);
      });
    }
  };

  const handleCancelarLeitura = () => {
    setMostrarDialogLeitura(false);
  };

  // Se não está configurado e não está no onboarding, mostrar empty state
  if (!dados.configurado && !mostrarOnboarding) {
    return <EmptyStateLeitura onIniciarConfiguracao={handleIniciarOnboarding} onVoltar={onVoltar} />;
  }

  // Se está no onboarding, mostrar fluxo de configuração
  if (mostrarOnboarding) {
    return (
      <OnboardingLeitura
        onConcluir={handleConcluirOnboarding}
        onVoltar={handleVoltarOnboarding}
      />
    );
  }

  // Página principal com dados
  return (
    <div 
      className="min-h-screen pb-20"
      style={{
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE'
      }}
    >
      {showConfetti && <ConfettiEffect />}

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
            <h2 className="text-xl">{t.biblePage.headerTitle}</h2>
            <p className="text-sm opacity-90">{t.biblePage.headerSubtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAbrirConfiguracoes}
            className="p-2 text-white hover:bg-white/20"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Próxima Leitura */}
        {proximaLeitura && (
          <Card 
            className="p-6 border-2"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
              borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.2)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p 
                  className="text-sm mb-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.biblePage.nextReading}
                </p>
                <h2 
                  className="text-2xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {proximaLeitura.livro} {proximaLeitura.capitulo}
                </h2>
              </div>
              {jaLeu && (
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2"
                  style={{
                    backgroundColor: temaAtual === 'escuro' 
                      ? 'rgba(200, 224, 70, 0.15)' 
                      : 'rgba(200, 224, 70, 0.1)',
                    borderColor: temaAtual === 'escuro'
                      ? 'rgba(200, 224, 70, 0.5)'
                      : '#C8E046'
                  }}
                >
                  <CheckCircle 
                    className="w-4 h-4" 
                    style={{ color: '#C8E046' }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: '#C8E046' }}
                  >
                    {t.biblePage.completed}
                  </span>
                </div>
              )}
            </div>

            <Button
              className="w-full border-0"
              style={{ 
                backgroundColor: jaLeu 
                  ? (temaAtual === 'escuro' ? '#3A3A3A' : '#9CA3AF')
                  : (temaAtual === 'escuro' ? '#2A2040' : '#4A2C60'), 
                color: 'white',
                opacity: jaLeu ? 0.6 : 1
              }}
              size="lg"
              onClick={handleMarcarLeitura}
              disabled={jaLeu}
            >
              {jaLeu ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t.biblePage.alreadyRead}
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t.biblePage.markAsRead}
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Card: Ofensiva */}
        <Card 
          className="p-6 border-2" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' 
              ? 'rgba(200, 224, 70, 0.1)' 
              : '#FFFCF8', 
            borderColor: '#C8E046' 
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="p-4 rounded-2xl shadow-sm"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              <Flame className="w-10 h-10" style={{ color: '#C8E046' }} />
            </div>
            <div className="flex-1">
              <p 
                className="text-sm"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.biblePage.streakDays}
              </p>
              <p 
                className="text-4xl"
                style={{
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              >
                {dados.ofensiva.atual}
              </p>
              {dados.ofensiva.melhor > dados.ofensiva.atual && (
                <p 
                  className="text-xs mt-1"
                  style={{
                    color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF'
                  }}
                >
                  {t.biblePage.record}: {dados.ofensiva.melhor} dias
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Card: Progresso do Plano */}
        <Card 
          className="p-6"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <TrendingUp 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
            />
            {t.biblePage.yourProgress}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.biblePage.readingPlan2025}
                </span>
                <span 
                  className="text-sm"
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                  }}
                >
                  {progresso}%
                </span>
              </div>
              <Progress value={progresso} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div 
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: temaAtual === 'escuro' 
                    ? 'rgba(200, 224, 70, 0.1)' 
                    : 'rgba(74, 44, 96, 0.05)',
                  borderColor: temaAtual === 'escuro'
                    ? 'rgba(200, 224, 70, 0.3)'
                    : 'rgba(74, 44, 96, 0.2)'
                }}
              >
                <p 
                  className="text-2xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {dados.capitulosLidos}
                </p>
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.biblePage.chapters}
                </p>
              </div>
              <div 
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: temaAtual === 'escuro' 
                    ? 'rgba(200, 224, 70, 0.1)' 
                    : 'rgba(74, 44, 96, 0.05)',
                  borderColor: temaAtual === 'escuro'
                    ? 'rgba(200, 224, 70, 0.3)'
                    : 'rgba(74, 44, 96, 0.2)'
                }}
              >
                <p 
                  className="text-2xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {dados.livrosLidos.length}
                </p>
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.biblePage.books}
                </p>
              </div>
              <div 
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: temaAtual === 'escuro' 
                    ? 'rgba(200, 224, 70, 0.1)' 
                    : 'rgba(74, 44, 96, 0.05)',
                  borderColor: temaAtual === 'escuro'
                    ? 'rgba(200, 224, 70, 0.3)'
                    : 'rgba(74, 44, 96, 0.2)'
                }}
              >
                <p 
                  className="text-2xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                >
                  {dados.ofensiva.atual}
                </p>
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.biblePage.consecutiveDays}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Conquistas */}
        <Card 
          className="p-6"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
            borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-2 mb-6"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <Award 
              className="w-5 h-5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
            />
            {t.biblePage.achievements}
          </h3>

          {/* Grid de Badges em formato pill */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {CONQUISTAS.map((conquista) => {
              const desbloqueada = dados.conquistasDesbloqueadas.includes(conquista.id);
              const IconeConquista = conquista.icon;
              
              return (
                <div 
                  key={conquista.id}
                  className="flex flex-col items-center justify-center py-6 px-3 rounded-full border-2 transition-all"
                  style={{
                    minHeight: '160px',
                    backgroundColor: desbloqueada 
                      ? '#C8E046' 
                      : (temaAtual === 'escuro' ? '#1C1C1C' : '#F9FAFB'),
                    borderColor: desbloqueada
                      ? '#B5CC3D'
                      : (temaAtual === 'escuro' ? '#3A3A3A' : '#E5E7EB')
                  }}
                >
                  {/* Ícone */}
                  <div className="mb-3">
                    <IconeConquista 
                      className="w-10 h-10"
                      style={{
                        color: desbloqueada 
                          ? '#4A2C60' 
                          : (temaAtual === 'escuro' ? '#3A3A3A' : '#D1D5DB')
                      }}
                      strokeWidth={desbloqueada ? 2 : 1.5}
                    />
                  </div>
                  
                  {/* Nome da conquista */}
                  <p 
                    className="text-xs text-center leading-tight mb-2 whitespace-pre-line px-1"
                    style={{
                      color: desbloqueada 
                        ? '#4A2C60' 
                        : (temaAtual === 'escuro' ? '#4A4A4A' : '#D1D5DB'),
                      fontWeight: desbloqueada ? 500 : 400
                    }}
                  >
                    {getNomeConquistaCard(conquista.id)}
                  </p>
                  
                  {/* Dias */}
                  <p 
                    className="text-sm"
                    style={{
                      color: desbloqueada 
                        ? '#4A2C60' 
                        : (temaAtual === 'escuro' ? '#4A4A4A' : '#D1D5DB'),
                      fontWeight: desbloqueada ? 600 : 400
                    }}
                  >
                    {conquista.dias}d
                  </p>
                </div>
              );
            })}
          </div>

          {/* Texto motivacional */}
          <div 
            className="p-5 rounded-2xl text-center" 
            style={{ 
              backgroundColor: temaAtual === 'escuro'
                ? 'rgba(200, 224, 70, 0.1)'
                : 'rgba(74, 44, 96, 0.05)' 
            }}
          >
            <p 
              className="text-sm"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              {dados.conquistasDesbloqueadas.length === 0 && t.biblePage.motivationalNoAchievements}
              {dados.conquistasDesbloqueadas.length > 0 && dados.conquistasDesbloqueadas.length < 4 && 
                t.biblePage.motivationalSomeAchievements(dados.conquistasDesbloqueadas.length)}
              {dados.conquistasDesbloqueadas.length === 4 && 
                t.biblePage.motivationalAllAchievements}
            </p>
          </div>
        </Card>

        {/* Histórico de Reflexões */}
        {dados.registros.filter(r => r.reflexao).length > 0 && (
          <Card 
            className="p-6"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
              borderColor: temaAtual === 'escuro' ? '#3A3A3A' : 'rgba(74, 44, 96, 0.1)'
            }}
          >
            <h3 
              className="flex items-center gap-2 mb-4"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <Sparkles 
                className="w-5 h-5" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
              />
              {t.biblePage.recentReflections}
            </h3>
            <div className="space-y-3">
              {dados.registros
                .filter(r => r.reflexao)
                .slice(-3)
                .reverse()
                .map((registro, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border-2"
                    style={{
                      backgroundColor: temaAtual === 'escuro'
                        ? 'rgba(200, 224, 70, 0.08)'
                        : 'rgba(200, 224, 70, 0.1)',
                      borderColor: temaAtual === 'escuro'
                        ? 'rgba(200, 224, 70, 0.2)'
                        : 'rgba(200, 224, 70, 0.3)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p 
                        className="text-sm"
                        style={{
                          color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                        }}
                      >
                        {registro.livro} {registro.capitulo}
                      </p>
                      <p 
                        className="text-xs"
                        style={{
                          color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF'
                        }}
                      >
                        {new Date(registro.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {registro.reflexao?.palavra && (
                      <div 
                        className="inline-block px-3 py-1 rounded-full border text-sm"
                        style={{
                          backgroundColor: temaAtual === 'escuro'
                            ? 'rgba(200, 224, 70, 0.15)'
                            : 'rgba(200, 224, 70, 0.2)',
                          borderColor: temaAtual === 'escuro'
                            ? 'rgba(200, 224, 70, 0.4)'
                            : '#C8E046',
                          color: '#C8E046'
                        }}
                      >
                        {registro.reflexao.palavra}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>

      {/* Dialog de Marcar Leitura */}
      {mostrarDialogLeitura && proximaLeitura && (
        <MarcarLeituraDialog
          livro={proximaLeitura.livro}
          capitulo={proximaLeitura.capitulo}
          onConfirmar={handleConfirmarLeitura}
          onCancelar={handleCancelarLeitura}
        />
      )}
    </div>
  );
}