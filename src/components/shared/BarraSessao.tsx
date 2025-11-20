import { Clock, Pause, Square, FileEdit } from 'lucide-react';
import { Button } from '../ui/button';

interface BarraSessaoProps {
  sessao: {
    tempoDecorrido: number;
    pausada: boolean;
    tipo?: string;
  };
  onPausar: () => void;
  onFinalizar: () => void;
  onAbrirControles: () => void;
}

export default function BarraSessao({ sessao, onPausar, onFinalizar, onAbrirControles }: BarraSessaoProps) {
  // Formatar tempo
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h${mins.toString().padStart(2, '0')}min`;
    }
    return `${mins}min`;
  };

  // Formatar tipo
  const formatarTipo = (tipo?: string) => {
    if (!tipo) return 'Sessão em andamento';
    
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

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 shadow-lg z-30">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Info da Sessão */}
        <button 
          onClick={onAbrirControles}
          className="flex items-center gap-3 flex-1"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs opacity-90">
              {sessao.pausada ? '⏸️ Pausado' : 'Sessão em andamento'}
            </p>
            <p className="text-lg tabular-nums">{formatarTempo(sessao.tempoDecorrido)}</p>
          </div>
        </button>

        {/* Botões Rápidos */}
        <div className="flex items-center gap-2">
          {!sessao.pausada ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={onPausar}
              className="text-white hover:bg-white/20"
            >
              <Pause className="w-4 h-4" />
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="ghost"
            onClick={onFinalizar}
            className="text-white hover:bg-white/20"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}