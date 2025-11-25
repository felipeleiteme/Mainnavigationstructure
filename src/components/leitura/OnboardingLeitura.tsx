import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { ConfiguracaoLeitura } from '../../utils/storage/leituraStorage';

interface OnboardingLeituraProps {
  onConcluir: (config: ConfiguracaoLeitura) => void;
  onVoltar: () => void;
}

export default function OnboardingLeitura({ onConcluir, onVoltar }: OnboardingLeituraProps) {
  const [etapa, setEtapa] = useState(1);
  const [plano, setPlano] = useState<ConfiguracaoLeitura['plano']>('cronologico');
  const [metaDiaria, setMetaDiaria] = useState<ConfiguracaoLeitura['metaDiaria']>('1capitulo');
  const [notificacoesDiarias, setNotificacoesDiarias] = useState(true);
  const [lembreteReflexao, setLembreteReflexao] = useState(true);

  const handleProximaEtapa = () => {
    if (etapa < 3) {
      setEtapa(etapa + 1);
    } else {
      // Concluir onboarding
      const config: ConfiguracaoLeitura = {
        plano,
        metaDiaria,
        notificacoesDiarias,
        lembreteReflexao,
        dataInicio: new Date().toISOString(),
      };
      onConcluir(config);
    }
  };

  const handleVoltarEtapa = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    } else {
      onVoltar();
    }
  };

  return (
    <div className="min-h-screen bg-neutral pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary-500 text-white">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoltarEtapa}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl">Configure seu Plano</h1>
            <p className="text-sm text-primary-100">Etapa {etapa} de 3</p>
          </div>
        </div>
        
        {/* Indicador de progresso */}
        <div className="h-1 bg-white/20">
          <div 
            className="h-full bg-secondary-400 transition-all duration-300"
            style={{ width: `${(etapa / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 pb-32">
        {/* Etapa 1: Tipo de Plano */}
        {etapa === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-primary-50 rounded-full mb-4">
                <BookOpen className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl text-primary-700 mb-2">Escolha seu Plano</h2>
              <p className="text-gray-600">Como você deseja ler a Bíblia?</p>
            </div>

            <RadioGroup value={plano} onValueChange={setPlano} className="space-y-3">
              <div className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                plano === 'cronologico' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}>
                <RadioGroupItem value="cronologico" id="cronologico" className="sr-only" />
                <Label htmlFor="cronologico" className="cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary-700">Cronológico</span>
                        {plano === 'cronologico' && (
                          <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Leia a Bíblia na ordem histórica dos eventos
                      </p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                plano === 'tematico' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}>
                <RadioGroupItem value="tematico" id="tematico" className="sr-only" />
                <Label htmlFor="tematico" className="cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary-700">Temático</span>
                        {plano === 'tematico' && (
                          <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Explore temas e assuntos bíblicos específicos
                      </p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                plano === 'sequencial' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}>
                <RadioGroupItem value="sequencial" id="sequencial" className="sr-only" />
                <Label htmlFor="sequencial" className="cursor-pointer">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary-700">Sequencial</span>
                        {plano === 'sequencial' && (
                          <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Leia do Gênesis ao Apocalipse em ordem
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Etapa 2: Meta Diária */}
        {etapa === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-secondary-50 rounded-full mb-4">
                <Target className="w-12 h-12 text-secondary-700" />
              </div>
              <h2 className="text-2xl text-primary-700 mb-2">Defina sua Meta</h2>
              <p className="text-gray-600">Quantos capítulos por dia?</p>
            </div>

            <RadioGroup value={metaDiaria} onValueChange={setMetaDiaria} className="space-y-3">
              <div className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                metaDiaria === '1capitulo' 
                  ? 'border-secondary-400 bg-secondary-50' 
                  : 'border-gray-200 hover:border-secondary-300'
              }`}>
                <RadioGroupItem value="1capitulo" id="1cap" className="sr-only" />
                <Label htmlFor="1cap" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary-700">1 capítulo por dia</span>
                        {metaDiaria === '1capitulo' && (
                          <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Ritmo tranquilo e reflexivo</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                metaDiaria === '3capitulos' 
                  ? 'border-secondary-400 bg-secondary-50' 
                  : 'border-gray-200 hover:border-secondary-300'
              }`}>
                <RadioGroupItem value="3capitulos" id="3cap" className="sr-only" />
                <Label htmlFor="3cap" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary-700">3 capítulos por dia</span>
                        {metaDiaria === '3capitulos' && (
                          <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Ritmo moderado e equilibrado</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                metaDiaria === '5capitulos' 
                  ? 'border-secondary-400 bg-secondary-50' 
                  : 'border-gray-200 hover:border-secondary-300'
              }`}>
                <RadioGroupItem value="5capitulos" id="5cap" className="sr-only" />
                <Label htmlFor="5cap" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-primary-700">5 capítulos por dia</span>
                        {metaDiaria === '5capitulos' && (
                          <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Ritmo intenso e dedicado</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Etapa 3: Notificações */}
        {etapa === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-primary-50 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl text-primary-700 mb-2">Quase lá!</h2>
              <p className="text-gray-600">Configure seus lembretes</p>
            </div>

            <Card className="p-5 border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.04)', borderColor: 'rgba(74, 44, 96, 0.15)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="notif1" className="font-medium cursor-pointer text-primary-700">
                    Lembrete diário
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Receba um lembrete para ler todos os dias às 9h
                  </p>
                </div>
                <Switch
                  id="notif1"
                  checked={notificacoesDiarias}
                  onCheckedChange={setNotificacoesDiarias}
                />
              </div>
            </Card>

            <Card className="p-5 border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.04)', borderColor: 'rgba(74, 44, 96, 0.15)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="notif2" className="font-medium cursor-pointer text-primary-700">
                    Lembrete de reflexão
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Sugestão para refletir após completar a leitura
                  </p>
                </div>
                <Switch
                  id="notif2"
                  checked={lembreteReflexao}
                  onCheckedChange={setLembreteReflexao}
                />
              </div>
            </Card>

            <Card className="p-5 border-2 bg-primary-50 border-primary-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-700">
                  <strong>Tudo pronto!</strong> Você receberá notificações quando desbloquear conquistas e poderá acompanhar seu progresso a cada leitura.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Botão de Continuar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t z-[60] shadow-lg">
          <Button
            className="w-full shadow-lg"
            style={{ backgroundColor: '#4A2C60', color: 'white' }}
            size="lg"
            onClick={handleProximaEtapa}
          >
            {etapa < 3 ? 'Continuar' : 'Começar Jornada'}
            {etapa === 3 && <Sparkles className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}