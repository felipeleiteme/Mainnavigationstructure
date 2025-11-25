import { ArrowLeft, TrendingUp, Sprout, Leaf, TreeDeciduous, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { DataService, TipoPublicador } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';

interface EditarTipoPublicadorPageProps {
  onVoltar: () => void;
}

export default function EditarTipoPublicadorPage({ onVoltar }: EditarTipoPublicadorPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const perfil = DataService.getPerfil();
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPublicador>(perfil.tipoPublicador);

  const opcoes: { valor: TipoPublicador; label: string; meta: number; descricao: string; icone: any }[] = [
    {
      valor: 'publicador-regular',
      label: 'Publicador Regular',
      meta: 10,
      descricao: 'Meta sugerida de 10 horas mensais',
      icone: Sprout
    },
    {
      valor: 'pioneiro-auxiliar-30',
      label: 'Pioneiro Auxiliar (30h)',
      meta: 30,
      descricao: 'Compromisso de 30 horas mensais',
      icone: Leaf
    },
    {
      valor: 'pioneiro-auxiliar-50',
      label: 'Pioneiro Auxiliar (50h)',
      meta: 50,
      descricao: 'Compromisso de 50 horas mensais',
      icone: TreeDeciduous
    },
    {
      valor: 'pioneiro-regular',
      label: 'Pioneiro Regular',
      meta: 70,
      descricao: 'Compromisso de 70 horas mensais',
      icone: Sparkles
    },
  ];

  const handleSalvar = () => {
    DataService.updatePerfil({ tipoPublicador: tipoSelecionado });
    toast.success('Tipo de publicador atualizado!', {
      description: `Meta mensal: ${DataService.getMetaMensal()}h`,
    });
    onVoltar();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl">Tipo de Publicador</h2>
              <p className="text-sm opacity-90">Escolha seu tipo de serviço</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-4 pb-32">
        {opcoes.map((opcao) => {
          const IconeComponente = opcao.icone;
          return (
            <button
              key={opcao.valor}
              onClick={() => setTipoSelecionado(opcao.valor)}
              className="w-full text-left p-5 rounded-xl border-2 transition-all bg-white"
              style={{
                borderColor: tipoSelecionado === opcao.valor ? '#4A2C60' : 'rgba(0, 0, 0, 0.1)',
                backgroundColor: tipoSelecionado === opcao.valor ? 'rgba(74, 44, 96, 0.04)' : '#FFFFFF'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
                    <IconeComponente className="w-6 h-6" style={{ color: '#4A2C60' }} />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">{opcao.label}</p>
                    <p className="text-sm text-gray-600 mb-3">{opcao.descricao}</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                        style={{
                          backgroundColor: tipoSelecionado === opcao.valor ? '#4A2C60' : 'rgba(74, 44, 96, 0.1)',
                          color: tipoSelecionado === opcao.valor ? '#FFFFFF' : '#4A2C60'
                        }}
                      >
                        <TrendingUp className="w-3 h-3" />
                        Meta: {opcao.meta}h/mês
                      </div>
                    </div>
                  </div>
                </div>
                {tipoSelecionado === opcao.valor && (
                  <div className="ml-3 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4A2C60' }}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Informação adicional */}
        <div className="p-5 rounded-xl border-2 mt-6" style={{ backgroundColor: 'rgba(74, 44, 96, 0.04)', borderColor: 'rgba(74, 44, 96, 0.15)' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
              <Lightbulb className="w-5 h-5" style={{ color: '#4A2C60' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Dica:</strong> A meta mensal é ajustada automaticamente de acordo com o tipo selecionado.
              </p>
              <p className="text-sm text-gray-600">
                Você pode acompanhar seu progresso na tela Início e no card de Relatório do Mês.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 border-t px-6 py-4 flex gap-3" style={{ backgroundColor: '#FDF8EE' }}>
        <Button 
          variant="outline" 
          onClick={onVoltar}
          className="flex-1 h-14"
        >
          Cancelar
        </Button>
        <Button 
          className="flex-1 h-14 text-white hover:opacity-90"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={handleSalvar}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}