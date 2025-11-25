import { ArrowLeft, Trash2, Plus, Heart, BarChart3, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';

interface DiarioGratidaoPageProps {
  onVoltar: () => void;
  onAbrirNovaGratidao: () => void;
  onEditarGratidao?: (entry: GratidaoEntry) => void;
}

interface GratidaoEntry {
  id: string;
  data: string;
  texto: string;
}

export default function DiarioGratidaoPage({ onVoltar, onAbrirNovaGratidao, onEditarGratidao }: DiarioGratidaoPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [gratidaoEntries, setGratidaoEntries] = useState<GratidaoEntry[]>([]);

  // Load gratidão entries from localStorage
  useEffect(() => {
    const gratidaoSaved = localStorage.getItem('diarioGratidao');
    if (gratidaoSaved) {
      setGratidaoEntries(JSON.parse(gratidaoSaved));
    }
  }, []);

  const handleDeletarGratidao = (id: string) => {
    const updatedEntries = gratidaoEntries.filter(entry => entry.id !== id);
    setGratidaoEntries(updatedEntries);
    localStorage.setItem('diarioGratidao', JSON.stringify(updatedEntries));
    toast.success('Entrada removida');
  };

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
            <h2 className="text-xl">Diário de Gratidão</h2>
            <p className="text-sm opacity-90">Cultivando um coração grato</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Sobre - APENAS quando não há entradas */}
        {gratidaoEntries.length === 0 && (
          <Card className="p-6 bg-primary-50 border-2 border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-2">Por que cultivar gratidão?</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Registrar pelo que somos gratos fortalece nossa espiritualidade e nos ajuda a ver as bênçãos de Jeová em nossa vida. 
                  A Bíblia nos incentiva a sermos gratos em todas as circunstâncias.
                </p>
                <p className="text-xs text-gray-600 mt-2 italic">
                  "Sejam gratos." — Colossenses 3:15
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Gratidões */}
        {gratidaoEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="mb-2">Comece seu diário</h3>
            <p className="text-sm text-gray-600 mb-6">
              Registre pelo que você é grato hoje
            </p>
            <p className="text-sm text-gray-500">
              Clique no botão + abaixo para adicionar sua primeira entrada
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {gratidaoEntries.map((entry) => (
              <Card key={entry.id} className="p-5 hover:shadow-lg transition-all border-0 shadow-sm bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Data */}
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                      <p className="text-xs uppercase tracking-wider text-primary-500 opacity-70">
                        {new Date(entry.data).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {/* Texto */}
                    <p className="text-base text-gray-800 leading-relaxed">
                      {entry.texto}
                    </p>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditarGratidao && onEditarGratidao(entry);
                      }}
                      className="h-9 w-9 p-0 text-primary-500 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeletarGratidao(entry.id)}
                      className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Card: Estatísticas */}
        {gratidaoEntries.length > 0 && (
          <Card className="p-6">
            <h3 className="flex items-center gap-2 mb-4 text-primary-500">
              <BarChart3 className="w-5 h-5" />
              Resumo
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary-50">
                <p className="text-3xl text-primary-500">{gratidaoEntries.length}</p>
                <p className="text-xs text-gray-600 mt-1">Total de registros</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary-50">
                <p className="text-3xl text-primary-500">
                  {Math.floor((Date.now() - new Date(gratidaoEntries[gratidaoEntries.length - 1]?.data).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-xs text-gray-600 mt-1">Dias praticando</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* FAB - Botão de Ação Flutuante */}
      <button
        onClick={onAbrirNovaGratidao}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        aria-label="Adicionar nova gratidão"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}