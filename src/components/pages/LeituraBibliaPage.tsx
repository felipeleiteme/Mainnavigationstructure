import { Settings, BookOpen, Trophy, Medal, Star, Sparkles, CheckCircle, Award, Flame, TrendingUp, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
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
  { id: 'primeira-semana', nome: 'Início\nHumilde', dias: 3, icon: Medal },
  { id: 'semana-completa', nome: 'Semana\nCompleta', dias: 7, icon: Trophy },
  { id: 'duas-semanas', nome: 'Leitor\nDedicado', dias: 14, icon: Star },
  { id: 'mes-completo', nome: 'Leitor\nVoraz', dias: 30, icon: Sparkles },
];

const getNomeConquista = (id: string): string => {
  const nomes: Record<string, string> = {
    'primeira-semana': '3 Dias Seguidos',
    'semana-completa': 'Semana Completa',
    'duas-semanas': '14 Dias Seguidos',
    'mes-completo': 'Mês Completo',
  };
  return nomes[id] || 'Conquista';
};

export default function LeituraBibliaPage({ onVoltar, onAbrirConfiguracoes }: LeituraBibliaPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [dados, setDados] = useState(carregarDados());
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [mostrarDialogLeitura, setMostrarDialogLeitura] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfiguracoes, setShowConfiguracoes] = useState(false);

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
    toast.success('Plano configurado com sucesso!', {
      description: 'Comece sua jornada de leitura agora',
    });
  };

  const handleVoltarOnboarding = () => {
    setMostrarOnboarding(false);
  };

  const handleMarcarLeitura = () => {
    if (jaLeu) {
      toast.info('Você já registrou sua leitura hoje!', {
        description: 'Continue amanhã para manter sua ofensiva',
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
    toast.success('Leitura registrada!', {
      description: `${proximaLeitura.livro} ${proximaLeitura.capitulo} concluído`,
    });

    // Se desbloqueou conquistas, mostrar notificações
    if (resultado.novasConquistas.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);

      resultado.novasConquistas.forEach((conquistaId, index) => {
        setTimeout(() => {
          toast.success(`🏆 Nova Conquista Desbloqueada!`, {
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
    <div className="min-h-screen bg-neutral pb-20">
      {showConfetti && <ConfettiEffect />}

      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
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
            <h2 className="text-xl">Leitura da Bíblia</h2>
            <p className="text-sm opacity-90">Sua base espiritual para jogar sementes</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfiguracoes(true)}
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
          <Card className="p-6 bg-white border-2 border-primary-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Próxima leitura:</p>
                <h2 className="text-2xl text-primary-700">
                  {proximaLeitura.livro} {proximaLeitura.capitulo}
                </h2>
              </div>
              {jaLeu && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-50 rounded-full border-2 border-secondary-400">
                  <CheckCircle className="w-4 h-4 text-secondary-700" />
                  <span className="text-sm text-secondary-700">Concluído</span>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              style={{ backgroundColor: jaLeu ? '#9CA3AF' : '#4A2C60', color: 'white' }}
              size="lg"
              onClick={handleMarcarLeitura}
              disabled={jaLeu}
            >
              {jaLeu ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Já li hoje
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Marcar como Lido
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Card: Ofensiva */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#FFFCF8', borderColor: '#C8E046' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <Flame className="w-10 h-10" style={{ color: '#C8E046' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Dias de ofensiva</p>
              <p className="text-4xl text-primary-700">{dados.ofensiva.atual}</p>
              {dados.ofensiva.melhor > dados.ofensiva.atual && (
                <p className="text-xs text-gray-500 mt-1">
                  Recorde: {dados.ofensiva.melhor} dias
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Card: Progresso do Plano */}
        <Card className="p-6 bg-white border-primary-100">
          <h3 className="flex items-center gap-2 mb-4 text-primary-700">
            <TrendingUp className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Seu Progresso
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Plano de Leitura 2025</span>
                <span className="text-sm" style={{ color: '#4A2C60' }}>{progresso}%</span>
              </div>
              <Progress value={progresso} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-primary-50 border border-primary-200">
                <p className="text-2xl text-primary-700">{dados.capitulosLidos}</p>
                <p className="text-xs text-gray-600">Capítulos</p>
              </div>
              <div className="p-3 rounded-lg bg-primary-50 border border-primary-200">
                <p className="text-2xl text-primary-700">{dados.livrosLidos.length}</p>
                <p className="text-xs text-gray-600">Livros</p>
              </div>
              <div className="p-3 rounded-lg bg-primary-50 border border-primary-200">
                <p className="text-2xl text-primary-700">{dados.ofensiva.atual}</p>
                <p className="text-xs text-gray-600">Dias seguidos</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Conquistas */}
        <Card className="p-6 bg-white border-primary-100">
          <h3 className="flex items-center gap-2 mb-6 text-primary-700">
            <Award className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Conquistas
          </h3>

          {/* Grid de Badges em formato pill */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {CONQUISTAS.map((conquista) => {
              const desbloqueada = dados.conquistasDesbloqueadas.includes(conquista.id);
              const IconeConquista = conquista.icon;
              
              return (
                <div 
                  key={conquista.id}
                  className={`flex flex-col items-center justify-center py-6 px-3 rounded-full border-2 transition-all ${
                    desbloqueada 
                      ? 'bg-secondary-500 border-secondary-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  style={{
                    minHeight: '160px',
                  }}
                >
                  {/* Ícone */}
                  <div className="mb-3">
                    <IconeConquista 
                      className={`w-10 h-10 ${
                        desbloqueada ? 'text-primary-700' : 'text-gray-300'
                      }`}
                      strokeWidth={desbloqueada ? 2 : 1.5}
                    />
                  </div>
                  
                  {/* Nome da conquista */}
                  <p 
                    className={`text-xs text-center leading-tight mb-2 whitespace-pre-line px-1 ${
                      desbloqueada ? 'text-primary-700 font-medium' : 'text-gray-300'
                    }`}
                  >
                    {conquista.nome}
                  </p>
                  
                  {/* Dias */}
                  <p 
                    className={`text-sm ${
                      desbloqueada ? 'text-primary-700 font-semibold' : 'text-gray-300'
                    }`}
                  >
                    {conquista.dias}d
                  </p>
                </div>
              );
            })}
          </div>

          {/* Texto motivacional */}
          <div className="p-5 rounded-2xl text-center" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
            <p className="text-sm text-primary-700">
              {dados.conquistasDesbloqueadas.length === 0 && 'Continue lendo para desbloquear conquistas!'}
              {dados.conquistasDesbloqueadas.length > 0 && dados.conquistasDesbloqueadas.length < 4 && 
                `Você desbloqueou ${dados.conquistasDesbloqueadas.length} de 4 conquistas! Continue assim!`}
              {dados.conquistasDesbloqueadas.length === 4 && 
                '🎉 Parabéns! Você desbloqueou todas as conquistas!'}
            </p>
          </div>
        </Card>

        {/* Histórico de Reflexões */}
        {dados.registros.filter(r => r.reflexao).length > 0 && (
          <Card className="p-6 bg-white border-primary-100">
            <h3 className="flex items-center gap-2 mb-4 text-primary-700">
              <Sparkles className="w-5 h-5" style={{ color: '#4A2C60' }} />
              Reflexões Recentes
            </h3>
            <div className="space-y-3">
              {dados.registros
                .filter(r => r.reflexao)
                .slice(-3)
                .reverse()
                .map((registro, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border-2 border-secondary-100 bg-secondary-50/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-primary-700">
                        {registro.livro} {registro.capitulo}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(registro.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {registro.reflexao?.palavra && (
                      <div className="inline-block px-3 py-1 rounded-full bg-secondary-100 border border-secondary-300 text-sm text-secondary-700">
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