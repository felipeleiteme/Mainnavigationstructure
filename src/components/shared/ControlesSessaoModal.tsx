import { X, Pause, Play, Square, FileEdit } from 'lucide-react';
import { Button } from '../ui/button';

interface ControlesSessaoModalProps {
  sessao: {
    tempoDecorrido: number; // em minutos
    pausada: boolean;
    tipo: string;
    revisitasVisitadas: number;
    estudosRealizados: number;
  } | null;
  onClose: () => void;
  onPausarSessao: () => void;
  onRetomarSessao: () => void;
  onAdicionarVisita: () => void;
  onFinalizarSessao: () => void;
}

export default function ControlesSessaoModal({
  sessao,
  onClose,
  onPausarSessao,
  onRetomarSessao,
  onAdicionarVisita,
  onFinalizarSessao,
}: ControlesSessaoModalProps) {
  if (!sessao) return null;

  // Formatar tempo decorrido
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return {
      horas: horas.toString().padStart(2, '0'),
      minutos: mins.toString().padStart(2, '0'),
    };
  };

  // Formatar tipo para exibição
  const formatarTipo = (tipo: string) => {
    const nomes: Record<string, string> = {
      'casa-em-casa': 'Casa em Casa',
      'testemunho-publico': 'Testemunho Público',
      'telefone': 'Telefone',
      'carta': 'Carta',
      'informal': 'Informal',
      'revisita': 'Revisita',
      'estudo-biblico': 'Estudo Bíblico',
      'cronometro-simples': 'Ministério',
    };
    
    return nomes[tipo] || 'Ministério';
  };

  const tempo = formatarTempo(sessao.tempoDecorrido);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white px-6 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Sessão em Andamento</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cronômetro Grande */}
          <div className="text-center py-6">
            <div className="text-6xl mb-2 tabular-nums tracking-tight">
              {tempo.horas}:{tempo.minutos}
            </div>
            <p className="text-sm opacity-90 flex items-center justify-center gap-2">
              {sessao.pausada ? (
                <><Pause className="w-4 h-4" /> Pausado</>
              ) : (
                <><Play className="w-4 h-4" /> Em andamento</>
              )}
            </p>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{sessao.revisitasVisitadas}</p>
              <p className="text-xs opacity-90">Revisitas</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{sessao.estudosRealizados}</p>
              <p className="text-xs opacity-90">Estudos</p>
            </div>
          </div>

          {/* Tipo(s) de Atividade */}
          <div className="mt-4 text-center">
            <p className="text-xs opacity-75 mb-1">Atividade(s)</p>
            <p className="text-sm">{formatarTipo(sessao.tipo)}</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-3">
          {/* Botão Pausar/Retomar */}
          {sessao.pausada ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={onRetomarSessao}
            >
              <Play className="w-5 h-5 mr-2" />
              Retomar
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={onPausarSessao}
            >
              <Pause className="w-5 h-5 mr-2" />
              Pausar
            </Button>
          )}

          {/* Botão Adicionar Visita */}
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={onAdicionarVisita}
          >
            <FileEdit className="w-5 h-5 mr-2" />
            Adicionar Visita
          </Button>

          {/* Botão Finalizar */}
          <Button
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={onFinalizarSessao}
          >
            <Square className="w-5 h-5 mr-2" />
            Finalizar Sessão
          </Button>
        </div>
      </div>
    </div>
  );
}