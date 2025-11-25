import { ArrowLeft, BookOpen, Bell, Calendar, Target, ClipboardList, Save, CheckCircle2, AlertTriangle, Flame, Trophy, FileText, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { carregarDados, salvarConfiguracao, ConfiguracaoLeitura } from '../../utils/storage/leituraStorage';

interface ConfiguracoesLeituraPageProps {
  onVoltar: () => void;
}

export default function ConfiguracoesLeituraPage({ onVoltar }: ConfiguracoesLeituraPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [planoSelecionado, setPlanoSelecionado] = useState('cronologico');
  const [notificacoesDiarias, setNotificacoesDiarias] = useState(true);
  const [lembreteReflexao, setLembreteReflexao] = useState(true);
  const [metaDiaria, setMetaDiaria] = useState('1capitulo');
  
  // Estados para valores originais (antes de editar)
  const [planoOriginal, setPlanoOriginal] = useState('cronologico');
  const [metaOriginal, setMetaOriginal] = useState('1capitulo');
  
  // Estado para controlar o dialog de confirmação
  const [mostrarAlertaReset, setMostrarAlertaReset] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    const dados = carregarDados();
    
    if (dados.configurado && dados.configuracao) {
      const config = dados.configuracao;
      
      setPlanoSelecionado(config.plano);
      setPlanoOriginal(config.plano);
      
      setNotificacoesDiarias(config.notificacoesDiarias);
      setLembreteReflexao(config.lembreteReflexao);
      
      setMetaDiaria(config.metaDiaria);
      setMetaOriginal(config.metaDiaria);
      
      // Debug log
      console.log('📋 Configurações carregadas:', {
        plano: config.plano,
        meta: config.metaDiaria
      });
    } else {
      console.log('📋 Nenhuma configuração salva, usando padrões');
    }
  }, []);

  const resetarProgresso = () => {
    // Limpar a chave principal de dados de leitura
    localStorage.removeItem('mynis_leitura_biblia');
    
    console.log('Progresso resetado devido à mudança de configuração');
  };

  const handleSalvarConfiguracoes = () => {
    // Verificar se houve mudança no plano ou meta
    const mudouPlano = planoSelecionado !== planoOriginal;
    const mudouMeta = metaDiaria !== metaOriginal;
    
    // Debug logs
    console.log('=== VERIFICANDO MUDANÇAS ===');
    console.log('Plano selecionado:', planoSelecionado);
    console.log('Plano original:', planoOriginal);
    console.log('Mudou plano?', mudouPlano);
    console.log('Meta selecionada:', metaDiaria);
    console.log('Meta original:', metaOriginal);
    console.log('Mudou meta?', mudouMeta);
    console.log('==========================');
    
    if (mudouPlano || mudouMeta) {
      // Mostrar alerta de confirmação
      console.log('🚨 Mostrando alerta de reset');
      setMostrarAlertaReset(true);
    } else {
      // Salvar sem resetar
      console.log('✅ Salvando sem reset');
      salvarSemReset();
    }
  };
  
  const salvarSemReset = () => {
    // Salvar todas as configurações sem resetar
    const configuracao: ConfiguracaoLeitura = {
      plano: planoSelecionado as 'cronologico' | 'tematico' | 'sequencial',
      metaDiaria: metaDiaria as '1capitulo' | '3capitulos' | '5capitulos',
      notificacoesDiarias: notificacoesDiarias,
      lembreteReflexao: lembreteReflexao,
      dataInicio: new Date().toISOString()
    };
    salvarConfiguracao(configuracao);

    toast.success('Configurações salvas! ✅', {
      description: 'Suas preferências foram atualizadas',
    });

    // Voltar para a página anterior após salvar
    setTimeout(() => {
      onVoltar();
    }, 1000);
  };
  
  const confirmarResetESalvar = () => {
    // Resetar progresso
    resetarProgresso();
    
    // Salvar configurações
    const configuracao: ConfiguracaoLeitura = {
      plano: planoSelecionado as 'cronologico' | 'tematico' | 'sequencial',
      metaDiaria: metaDiaria as '1capitulo' | '3capitulos' | '5capitulos',
      notificacoesDiarias: notificacoesDiarias,
      lembreteReflexao: lembreteReflexao,
      dataInicio: new Date().toISOString()
    };
    salvarConfiguracao(configuracao);

    // Fechar o dialog
    setMostrarAlertaReset(false);

    toast.success('Progresso resetado! 🔄', {
      description: 'Suas novas configurações foram salvas. Você começará do zero!',
    });

    // Voltar para a página anterior
    setTimeout(() => {
      onVoltar();
    }, 1500);
  };

  const getNomePlano = (plano: string) => {
    switch (plano) {
      case 'cronologico':
        return 'Cronológico';
      case 'tematico':
        return 'Temático';
      case 'sequencial':
        return 'Sequencial';
      default:
        return 'Cronológico';
    }
  };

  const getNomeMeta = (meta: string) => {
    switch (meta) {
      case '1capitulo':
        return '1 capítulo';
      case '3capitulos':
        return '3 capítulos';
      case '5capitulos':
        return '5 capítulos';
      case 'personalizado':
        return 'Personalizado';
      default:
        return '1 capítulo';
    }
  };

  return (
    <div className="min-h-screen bg-neutral pb-20">
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
            <h2 className="text-xl">Configurações</h2>
            <p className="text-sm text-primary-100">Personalize sua experiência</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Tipo de Plano */}
        <Card className="p-6 bg-white border-primary-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h3 className="text-primary-700">Tipo de Plano</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Escolha como deseja ler a Bíblia
          </p>
          <RadioGroup
            value={planoSelecionado}
            onValueChange={setPlanoSelecionado}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-primary-400 transition-colors">
              <RadioGroupItem value="cronologico" id="cronologico" />
              <Label htmlFor="cronologico" className="flex-1 cursor-pointer">
                <div className="font-medium text-primary-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  Cronológico
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Leia a Bíblia na ordem histórica dos eventos
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-primary-400 transition-colors">
              <RadioGroupItem value="tematico" id="tematico" />
              <Label htmlFor="tematico" className="flex-1 cursor-pointer">
                <div className="font-medium text-primary-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-600" />
                  Temático
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Explore temas e assuntos bíblicos específicos
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-primary-400 transition-colors">
              <RadioGroupItem value="sequencial" id="sequencial" />
              <Label htmlFor="sequencial" className="flex-1 cursor-pointer">
                <div className="font-medium text-primary-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary-600" />
                  Sequencial
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Leia do Gênesis ao Apocalipse em ordem
                </div>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Card: Meta Diária */}
        <Card className="p-6 bg-white border-2 border-secondary-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Target className="w-5 h-5 text-secondary-700" />
            </div>
            <h3 className="text-primary-700">Meta Diária</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Quantos capítulos deseja ler por dia?
          </p>
          <RadioGroup
            value={metaDiaria}
            onValueChange={setMetaDiaria}
            className="space-y-3"
          >
            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
              metaDiaria === '1capitulo' 
                ? 'border-secondary-400 bg-secondary-50' 
                : 'border-gray-200 hover:border-secondary-300'
            }`}>
              <RadioGroupItem value="1capitulo" id="1capitulo" />
              <Label htmlFor="1capitulo" className="flex-1 cursor-pointer">
                <div className="font-medium text-primary-700">1 capítulo por dia</div>
                <div className="text-xs text-gray-500 mt-1">
                  Ritmo tranquilo e reflexivo
                </div>
              </Label>
              {metaDiaria === '1capitulo' && (
                <CheckCircle2 className="w-5 h-5 text-secondary-600 flex-shrink-0" />
              )}
            </div>
            
            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
              metaDiaria === '3capitulos' 
                ? 'border-secondary-400 bg-secondary-50' 
                : 'border-gray-200 hover:border-secondary-300'
            }`}>
              <RadioGroupItem value="3capitulos" id="3capitulos" />
              <Label htmlFor="3capitulos" className="flex-1 cursor-pointer">
                <div className="font-medium text-primary-700">3 capítulos por dia</div>
                <div className="text-xs text-gray-500 mt-1">
                  Ritmo moderado e equilibrado
                </div>
              </Label>
              {metaDiaria === '3capitulos' && (
                <CheckCircle2 className="w-5 h-5 text-secondary-600 flex-shrink-0" />
              )}
            </div>
            
            <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
              metaDiaria === '5capitulos' 
                ? 'border-secondary-400 bg-secondary-50' 
                : 'border-gray-200 hover:border-secondary-300'
            }`}>
              <RadioGroupItem value="5capitulos" id="5capitulos" />
              <Label htmlFor="5capitulos" className="flex-1 cursor-pointer">
                <div className="font-medium text-primary-700">5 capítulos por dia</div>
                <div className="text-xs text-gray-500 mt-1">
                  Ritmo intenso e dedicado
                </div>
              </Label>
              {metaDiaria === '5capitulos' && (
                <CheckCircle2 className="w-5 h-5 text-secondary-600 flex-shrink-0" />
              )}
            </div>
          </RadioGroup>
        </Card>

        {/* Card: Notificações */}
        <Card className="p-6 bg-white border-primary-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary-600" />
            <h3 className="text-primary-700">Notificações</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configure lembretes para sua rotina de leitura
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.04)', borderColor: 'rgba(74, 44, 96, 0.15)' }}>
              <div className="flex-1">
                <Label htmlFor="notif-diarias" className="font-medium cursor-pointer text-primary-700">
                  Lembrete diário
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Receba um lembrete para ler todos os dias às 9h
                </p>
              </div>
              <Switch
                id="notif-diarias"
                checked={notificacoesDiarias}
                onCheckedChange={setNotificacoesDiarias}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.04)', borderColor: 'rgba(74, 44, 96, 0.15)' }}>
              <div className="flex-1">
                <Label htmlFor="lembrete-reflexao" className="font-medium cursor-pointer text-primary-700">
                  Lembrete de reflexão
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Sugestão para refletir após completar a leitura
                </p>
              </div>
              <Switch
                id="lembrete-reflexao"
                checked={lembreteReflexao}
                onCheckedChange={setLembreteReflexao}
              />
            </div>
          </div>
        </Card>

        {/* Card: Resumo das Configurações */}
        <Card className="p-6 bg-secondary-50 border-2 border-secondary-500">
          <h3 className="mb-4 flex items-center gap-2 text-primary-700">
            <ClipboardList className="w-5 h-5 text-secondary-500" />
            Resumo das Configurações
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
              <span className="text-sm text-gray-700">Plano de leitura:</span>
              <span className="font-medium text-primary-500">{getNomePlano(planoSelecionado)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
              <span className="text-sm text-gray-700">Meta diária:</span>
              <span className="font-medium text-secondary-700">{getNomeMeta(metaDiaria)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
              <span className="text-sm text-gray-700">Lembretes:</span>
              <span className="font-medium text-secondary-700">
                {notificacoesDiarias && lembreteReflexao ? 'Todos ativos' : 
                 notificacoesDiarias || lembreteReflexao ? 'Parcialmente ativos' : 
                 'Desativados'}
              </span>
            </div>
          </div>
        </Card>

        {/* Botão de Salvar */}
        <div className="sticky bottom-6">
          <Button
            className="w-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg border-0"
            size="lg"
            onClick={handleSalvarConfiguracoes}
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      {/* Dialog de confirmação para resetar progresso */}
      <AlertDialog open={mostrarAlertaReset} onOpenChange={setMostrarAlertaReset}>
        <AlertDialogContent className="max-w-[calc(100%-3rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <AlertDialogTitle className="text-xl">Resetar Progresso?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Alterar o plano de leitura ou meta diária irá resetar seu progresso atual incluindo leituras, ofensiva, conquistas e reflexões.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="text-left space-y-3 pt-2 px-1">
            <p className="text-sm text-gray-700">
              Esta ação irá <strong>resetar</strong> os seguintes dados:
            </p>
            <ul className="text-sm text-gray-600 space-y-2.5">
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span>Leituras concluídas</span>
              </li>
              <li className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>Dias de ofensiva</span>
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <span>Conquistas desbloqueadas</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Reflexões registradas</span>
              </li>
            </ul>
            <div className="text-sm text-primary-700 mt-4 p-3 bg-primary-50 rounded-lg border-2 border-primary-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-secondary-600 flex-shrink-0 mt-0.5" />
              <span>Você começará uma nova jornada de leitura com as novas configurações.</span>
            </div>
          </div>
          
          <AlertDialogFooter className="flex gap-3 mt-4">
            <AlertDialogCancel 
              onClick={() => setMostrarAlertaReset(false)}
              className="flex-1"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarResetESalvar}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Confirmar Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}