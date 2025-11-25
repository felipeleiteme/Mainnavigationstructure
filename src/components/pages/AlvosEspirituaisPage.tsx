import { ArrowLeft, Plus, Check, Target, Flame, BarChart3, CheckCircle, Pause, Play, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { DataService, Alvo } from '../../services/dataService';

interface AlvosEspirituaisPageProps {
  onVoltar: () => void;
  onAbrirNovoAlvo: () => void;
  onEditarAlvo?: (alvo: Alvo) => void;
}

export default function AlvosEspirituaisPage({ onVoltar, onAbrirNovoAlvo, onEditarAlvo }: AlvosEspirituaisPageProps) {
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
      toast.success('Alvo concluído! 🎉', {
        description: `Parabéns por alcançar: ${alvo.titulo}`,
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
      toast.success('Alvo pausado');
    });
  };

  const handleRetomarAlvo = (alvoId: string) => {
    setAlvosPausados(prev => {
      const newSet = new Set(prev);
      newSet.delete(alvoId);
      return newSet;
    });

    import('sonner@2.0.3').then(({ toast }) => {
      toast.success('Alvo retomado');
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
      <div className="sticky top-0 z-10 bg-primary-500 text-white">
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
            <h2 className="text-xl">Alvos Espirituais</h2>
            <p className="text-sm opacity-90">{alvosAtivosLista.length} {alvosAtivosLista.length === 1 ? 'alvo ativo' : 'alvos ativos'}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Sobre Alvos - APENAS quando não há alvos */}
        {todosAlvos.length === 0 && (
          <Card className="p-6 bg-primary-50 border-2 border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2">Por que ter alvos espirituais?</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Estabelecer alvos espirituais nos ajuda a crescer em nossa relação com Jeová e nos motiva a progredir espiritualmente. 
                  São como mapas que guiam nossa jornada cristã.
                </p>
                <p className="text-xs text-gray-600 mt-2 italic">
                  "Certifique-se das coisas mais importantes." — Filipenses 1:10
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Seção: Alvos Ativos */}
        {alvosAtivosLista.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-primary-500 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Em Andamento
            </h3>
            <div className="space-y-3">
              {alvosAtivosLista.map((alvo) => (
                <Card key={alvo.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{alvo.titulo}</h4>
                        {alvo.descricao && (
                          <p className="text-sm text-gray-600">{alvo.descricao}</p>
                        )}
                        {alvo.prazo && (
                          <p className="text-xs text-gray-500 mt-1">
                            Prazo: {new Date(alvo.prazo).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <Badge variant="estudo">
                        {alvo.progresso}%
                      </Badge>
                    </div>
                    <Progress value={alvo.progresso} className="h-2" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => onEditarAlvo && onEditarAlvo(alvo)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handlePausarAlvo(alvo.id)}>
                        Pausar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50" 
                        onClick={() => handleConcluirAlvo(alvo)}
                      >
                        Concluir
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
            <h3 className="mb-3 text-sm font-medium text-gray-700">⏸️ Pausados</h3>
            <div className="space-y-3">
              {alvosListaPausados.map((alvo, idx) => (
                <Card key={idx} className="p-5 bg-gray-50 opacity-75">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{alvo.titulo}</h4>
                        {alvo.meta && (
                          <p className="text-sm text-gray-600">Meta: {alvo.meta}</p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {alvo.progresso}%
                      </Badge>
                    </div>
                    <Progress value={alvo.progresso} className="h-2" />
                    <Button size="sm" variant="outline" className="w-full" onClick={() => handleRetomarAlvo(alvo.id)}>
                      Retomar
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
            <h3 className="mb-3 text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Concluídos
            </h3>
            <div className="space-y-3">
              {alvosConcluidos.map((alvo, idx) => (
                <Card key={idx} className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{alvo.titulo}</h4>
                      {alvo.descricao && (
                        <p className="text-sm text-gray-600">{alvo.descricao}</p>
                      )}
                      <Badge className="mt-2 bg-green-600 text-white">
                        Concluído! 🎉
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
            <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center">
              <Target className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="mb-2">Estabeleça seu primeiro alvo</h3>
            <p className="text-sm text-gray-600 mb-6">
              Comece criando um alvo espiritual para sua jornada
            </p>
            <p className="text-sm text-gray-500">
              Clique no botão + abaixo para criar seu primeiro alvo
            </p>
          </Card>
        )}

        {/* Card: Estatísticas */}
        {todosAlvos.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4 text-primary-500 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumo
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl text-primary-500">{alvosAtivosLista.length}</p>
                <p className="text-xs text-gray-600 mt-1">Em andamento</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-700">{alvosConcluidos.length}</p>
                <p className="text-xs text-gray-600 mt-1">Concluídos</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl text-gray-700">{alvosListaPausados.length}</p>
                <p className="text-xs text-gray-600 mt-1">Pausados</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* FAB - Botão de Ação Flutuante */}
      <button
        onClick={onAbrirNovoAlvo}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        aria-label="Criar novo alvo"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}