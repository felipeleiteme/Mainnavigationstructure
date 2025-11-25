import { ArrowLeft, Trash2, Plus, Heart, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';

interface DiarioGratidaoPageProps {
  onVoltar: () => void;
  onAbrirNovaGratidao: () => void;
}

interface GratidaoEntry {
  id: string;
  data: string;
  texto: string;
}

export default function DiarioGratidaoPage({ onVoltar, onAbrirNovaGratidao }: DiarioGratidaoPageProps) {
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
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FDF8EE' }}>
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
            <h2 className="text-xl">Diário de Gratidão</h2>
            <p className="text-sm opacity-90">{gratidaoEntries.length} {gratidaoEntries.length === 1 ? 'entrada' : 'entradas'}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Sobre */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#F5F2F7', borderColor: '#D8CEE8' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4A2C60' }}>
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

        {/* Lista de Gratidões */}
        {gratidaoEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F5F2F7' }}>
              <Heart className="w-10 h-10" style={{ color: '#4A2C60' }} />
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
              <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow border-primary-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(entry.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {entry.texto}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletarGratidao(entry.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Card: Estatísticas */}
        {gratidaoEntries.length > 0 && (
          <Card className="p-6">
            <h3 className="flex items-center gap-2 mb-4" style={{ color: '#4A2C60' }}>
              <BarChart3 className="w-5 h-5" />
              Resumo
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F5F2F7' }}>
                <p className="text-3xl" style={{ color: '#4A2C60' }}>{gratidaoEntries.length}</p>
                <p className="text-xs text-gray-600 mt-1">Total de registros</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F5F2F7' }}>
                <p className="text-3xl" style={{ color: '#4A2C60' }}>
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
        className="fixed bottom-24 right-6 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        style={{ backgroundColor: '#4A2C60' }}
        aria-label="Adicionar nova gratidão"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}