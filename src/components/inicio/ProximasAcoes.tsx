import { toast } from 'sonner@2.0.3';
import { 
  gerarProximasAcoes, 
  marcarAcaoConcluida, 
  adiarAcao, 
  removerAcao,
  ProximaAcao 
} from '../../utils/helpers/proximasAcoes';

interface ProximasAcoesProps {
  onNavigate: (destino: any) => void;
}

export default function ProximasAcoes({ onNavigate }: ProximasAcoesProps) {
  const [acoes, setAcoes] = useState<ProximaAcao[]>([]);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [showAdiarModal, setShowAdiarModal] = useState(false);
  const [acaoParaAdiar, setAcaoParaAdiar] = useState<ProximaAcao | null>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);

  useEffect(() => {
    carregarAcoes();
  }, []);

  const carregarAcoes = () => {
    const acoesGeradas = gerarProximasAcoes();
    setAcoes(acoesGeradas);
  };

  const handleTapAcao = (acao: ProximaAcao) => {
    if (swipedId) {
      setSwipedId(null);
      return;
    }

    // Navegar para destino
    onNavigate(acao.destino);
  };

  const handleConcluir = (acao: ProximaAcao) => {
    marcarAcaoConcluida(acao.id);
    
    // Animação de conclusão
    const acaoElement = document.getElementById(`acao-${acao.id}`);
    if (acaoElement) {
      acaoElement.style.transform = 'translateX(100%)';
      acaoElement.style.opacity = '0';
      
      setTimeout(() => {
        setAcoes(acoes.filter(a => a.id !== acao.id));
        toast.success('Ação concluída! ✅', {
          description: 'Parabéns por manter-se em dia',
        });
      }, 300);
    }
  };

  const handleAdiar = (acao: ProximaAcao) => {
    setAcaoParaAdiar(acao);
    setShowAdiarModal(true);
    setSwipedId(null);
  };

  const handleRemover = (acao: ProximaAcao) => {
    if (confirm('Tem certeza que quer remover esta ação?')) {
      removerAcao(acao.id);
      setAcoes(acoes.filter(a => a.id !== acao.id));
      toast('Ação removida', {
        description: 'Você pode ver novamente mais tarde',
      });
    }
    setSwipedId(null);
  };

  const handleConfirmarAdiar = (opcao: string) => {
    if (!acaoParaAdiar) return;

    let novaData = new Date();
    
    switch (opcao) {
      case 'mais-tarde':
        novaData.setHours(novaData.getHours() + 3);
        break;
      case 'amanha':
        novaData.setDate(novaData.getDate() + 1);
        break;
      case 'semana':
        novaData.setDate(novaData.getDate() + 7);
        break;
    }

    adiarAcao(acaoParaAdiar.id, novaData);
    setAcoes(acoes.filter(a => a.id !== acaoParaAdiar.id));
    
    toast('Ação adiada', {
      description: `Te lembramos ${opcao === 'mais-tarde' ? 'mais tarde' : opcao === 'amanha' ? 'amanhã' : 'na próxima semana'}`,
    });

    setShowAdiarModal(false);
    setAcaoParaAdiar(null);
  };

  // Touch handlers para swipe
  const handleTouchStart = (e: React.TouchEvent, acaoId: string) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent, acaoId: string) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    
    const element = document.getElementById(`acao-${acaoId}`);
    if (element && Math.abs(diff) > 10) {
      element.style.transform = `translateX(${diff}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, acaoId: string) => {
    const diff = touchCurrentX.current - touchStartX.current;
    const element = document.getElementById(`acao-${acaoId}`);
    
    if (element) {
      if (diff < -100) {
        // Swipe left - mostrar ações
        element.style.transform = 'translateX(-120px)';
        setSwipedId(acaoId);
      } else if (diff > 100) {
        // Swipe right - remover
        element.style.transform = 'translateX(0)';
        setSwipedId(null);
      } else {
        // Voltar ao normal
        element.style.transform = 'translateX(0)';
        setSwipedId(null);
      }
    }
  };

  if (acoes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(200, 224, 70, 0.2)' }}>
          <PartyPopper className="w-8 h-8" style={{ color: '#4A2C60' }} />
        </div>
        <h3 className="mb-2">Tudo em dia!</h3>
        <p className="text-sm text-gray-600">
          Você está em dia com suas atividades. Continue assim!
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Próximas Ações</h3>
          <Badge variant="secondary">{acoes.length}</Badge>
        </div>

        <div className="space-y-2">
          {acoes.map((acao) => (
            <div key={acao.id} className="relative overflow-hidden">
              {/* Botões de ação (revelados no swipe) */}
              {swipedId === acao.id && (
                <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-4">
                  <Button
                    size="sm"
                    className="h-full hover:opacity-90"
                    style={{ backgroundColor: '#4A2C60' }}
                    onClick={() => handleConcluir(acao)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-orange-500 hover:bg-orange-600 text-white h-full"
                    onClick={() => handleAdiar(acao)}
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Card da ação */}
              <div
                id={`acao-${acao.id}`}
                className={`${acao.cor} border-2 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all`}
                onClick={() => handleTapAcao(acao)}
                onTouchStart={(e) => handleTouchStart(e, acao.id)}
                onTouchMove={(e) => handleTouchMove(e, acao.id)}
                onTouchEnd={(e) => handleTouchEnd(e, acao.id)}
                style={{ touchAction: 'pan-y' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{acao.icone}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm truncate">{acao.titulo}</p>
                      {acao.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {acao.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{acao.subtexto}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Deslize para concluir ou adiar
        </p>
      </Card>

      {/* Modal de Adiar */}
      {showAdiarModal && acaoParaAdiar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Adiar para quando?</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAdiarModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleConfirmarAdiar('mais-tarde')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mais tarde hoje (3 horas)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleConfirmarAdiar('amanha')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Amanhã (mesmo horário)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleConfirmarAdiar('semana')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Próxima semana (7 dias)
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}