import { useState } from 'react';
import { X, Clock, Users, BookOpen, FileText, Video, Plus, Minus, PartyPopper, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';

interface ResumoSessaoModalProps {
  sessao: {
    tempoDecorrido: number; // em minutos
    tipo: string;
    revisitasVisitadas: number;
    estudosRealizados: number;
  } | null;
  onClose: () => void;
  onSalvarResumo: (dados: {
    tempoTotal: number;
    publicacoes: number;
    videos: number;
    observacoes: string;
    categoria: 'campo' | 'credito';
  }) => void;
}

export default function ResumoSessaoModal({ sessao, onClose, onSalvarResumo }: ResumoSessaoModalProps) {
  const [publicacoes, setPublicacoes] = useState(0);
  const [videos, setVideos] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [categoria, setCategoria] = useState<'campo' | 'credito'>('campo');

  if (!sessao) return null;

  // Formatar tempo
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h${mins > 0 ? mins + 'min' : ''}`;
    }
    return `${mins}min`;
  };

  const handleSalvar = () => {
    onSalvarResumo({
      tempoTotal: sessao.tempoDecorrido,
      publicacoes,
      videos,
      observacoes,
      categoria,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 text-white px-6 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl mb-1">Resumo da Sessão</h2>
              <p className="text-sm opacity-90 flex items-center gap-1">
                Parabéns pelo esforço!
                <PartyPopper className="w-4 h-4" />
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tempo Total */}
          <div className="text-center py-4">
            <div className="text-5xl mb-2">⏱️</div>
            <div className="text-4xl mb-1">{formatarTempo(sessao.tempoDecorrido)}</div>
            <p className="text-sm opacity-90">Tempo total</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Estatísticas Automáticas */}
          <div>
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Atividades registradas:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-green-50 border-green-200">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl text-green-900">{sessao.revisitasVisitadas}</p>
                <p className="text-xs text-gray-600">Revisitas</p>
              </Card>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl text-blue-900">{sessao.estudosRealizados}</p>
                <p className="text-xs text-gray-600">Estudos</p>
              </Card>
            </div>
          </div>

          {/* Perguntas Contextuais */}
          <div>
            <h3 className="text-sm mb-3">📝 Informações adicionais:</h3>
            
            {/* Publicações */}
            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-2 block">
                Colocou publicações?
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPublicacoes(Math.max(0, publicacoes - 1))}
                  disabled={publicacoes === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-3xl text-purple-600">{publicacoes}</div>
                  <p className="text-xs text-gray-600">publicações</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPublicacoes(publicacoes + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Vídeos */}
            <div className="mb-4">
              <label className="text-sm text-gray-700 mb-2 block">
                Mostrou vídeos?
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideos(Math.max(0, videos - 1))}
                  disabled={videos === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-3xl text-orange-600">{videos}</div>
                  <p className="text-xs text-gray-600">vídeos</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideos(videos + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-sm text-gray-700 mb-2 block">
              Como foi? (opcional)
            </label>
            <Textarea
              placeholder="Escreva suas reflexões sobre a sessão..."
              rows={5}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="resize-none min-h-[120px] bg-white"
            />
          </div>

          {/* Categorização */}
          <div>
            <label className="text-sm text-gray-700 mb-2 block">
              Categorizar como:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCategoria('campo')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  categoria === 'campo'
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-2xl mb-1">🚶</div>
                <p className="text-sm">Campo</p>
              </button>
              <button
                onClick={() => setCategoria('credito')}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  categoria === 'credito'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-1">📚</div>
                <p className="text-sm">Crédito</p>
              </button>
            </div>
          </div>

          {/* Botão Salvar */}
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 mb-24"
            onClick={handleSalvar}
          >
            <FileText className="w-5 h-5 mr-2" />
            Salvar no Relatório
          </Button>
        </div>
      </div>
    </div>
  );
}