import { useState } from 'react';
import { X, FileText, Heart, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

interface EnviarRelatorioFlowProps {
  onClose: () => void;
  relatorio: {
    horasCampo: number;
    horasCredito: number;
    estudos: number;
    revisitas: number;
    publicacoes: number;
    videos: number;
  };
  temaMes: string;
}

export default function EnviarRelatorioFlow({ onClose, relatorio, temaMes }: EnviarRelatorioFlowProps) {
  const [step, setStep] = useState<'revisao' | 'reflexao'>('revisao');
  const [reflexao, setReflexao] = useState({
    alegria: '',
    qualidade: '',
  });

  const totalHoras = relatorio.horasCampo + relatorio.horasCredito;

  const handleEnviarSemReflexao = () => {
    // Salvar relatório
    const relatorios = JSON.parse(localStorage.getItem('relatorios') || '[]');
    const novoRelatorio = {
      ...relatorio,
      data: new Date().toISOString(),
      mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    };
    relatorios.push(novoRelatorio);
    localStorage.setItem('relatorios', JSON.stringify(relatorios));

    toast.success('Relatório enviado! Parabéns pelo mês 🌟', {
      description: `${totalHoras} horas de dedicação registradas`,
      duration: 3000,
    });
    onClose();
  };

  const handleEnviarComReflexao = () => {
    // Salvar relatório com reflexão
    const relatorios = JSON.parse(localStorage.getItem('relatorios') || '[]');
    const diarioGratidao = JSON.parse(localStorage.getItem('diarioGratidao') || '[]');
    
    const novoRelatorio = {
      ...relatorio,
      data: new Date().toISOString(),
      mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      reflexao,
    };
    
    relatorios.push(novoRelatorio);
    localStorage.setItem('relatorios', JSON.stringify(relatorios));

    // Salvar no diário de gratidão
    if (reflexao.alegria || reflexao.qualidade) {
      const entradaDiario = {
        data: new Date().toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
        }),
        mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        temaMes,
        reflexao,
        estatisticas: relatorio,
      };
      diarioGratidao.push(entradaDiario);
      localStorage.setItem('diarioGratidao', JSON.stringify(diarioGratidao));
    }

    toast.success('Relatório enviado! Parabéns pelo mês 🌟', {
      description: 'Sua reflexão foi salva no Diário de Gratidão ✨',
      duration: 3000,
    });
    onClose();
  };

  // Tela 1: Revisão do Relatório
  if (step === 'revisao') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Enviar Relatório
            </h2>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Resumo do Mês */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <h3 className="mb-4">Resumo do Mês</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-3xl text-green-600">{totalHoras}h</p>
                  <p className="text-xs text-gray-600 mt-1">Total de Horas</p>
                  <p className="text-xs text-gray-500">Campo: {relatorio.horasCampo}h | Crédito: {relatorio.horasCredito}h</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-3xl text-blue-600">{relatorio.estudos}</p>
                  <p className="text-xs text-gray-600 mt-1">Estudos</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xl text-green-700">{relatorio.revisitas}</p>
                  <p className="text-xs text-gray-600">Revisitas</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xl text-purple-700">{relatorio.publicacoes}</p>
                  <p className="text-xs text-gray-600">Publicações</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xl text-orange-700">{relatorio.videos}</p>
                  <p className="text-xs text-gray-600">Vídeos</p>
                </div>
              </div>
            </Card>

            {/* Informação */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-2xl">💡</span>
              <div className="flex-1 text-sm">
                <p className="text-blue-900 mb-1">
                  Além dos números, o que realmente importa é como você cresceu.
                </p>
                <p className="text-blue-700">
                  Quer adicionar uma reflexão pessoal ao seu relatório?
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                onClick={() => setStep('reflexao')}
              >
                Adicionar Reflexão
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleEnviarSemReflexao}
              >
                Enviar Sem Reflexão
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela 2: Reflexão do Mês
  if (step === 'reflexao') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Reflexão do Mês
            </h2>
            <Button size="sm" variant="ghost" onClick={() => setStep('revisao')}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Tema do Mês */}
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🕊️</span>
                <div>
                  <p className="text-sm text-gray-600">Tema do mês:</p>
                  <p className="text-lg text-purple-900">{temaMes}</p>
                </div>
              </div>
            </Card>

            {/* Mensagem Inspiradora */}
            <div className="text-center py-4">
              <p className="text-gray-700 italic">
                "O que realmente importa é a pessoa que você está se tornando 💚"
              </p>
            </div>

            {/* Perguntas */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2">
                  <span className="text-sm">O que te trouxe alegria este mês?</span>
                </label>
                <Textarea
                  placeholder="Momentos especiais, experiências, aprendizados..."
                  value={reflexao.alegria}
                  onChange={(e) => setReflexao({ ...reflexao, alegria: e.target.value })}
                  className="resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block mb-2">
                  <span className="text-sm">Como você cultivou "{temaMes}" este mês?</span>
                </label>
                <Textarea
                  placeholder="Situações onde você praticou..."
                  value={reflexao.qualidade}
                  onChange={(e) => setReflexao({ ...reflexao, qualidade: e.target.value })}
                  className="resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {/* Mostrar anotações prévias se existir */}
                  {(() => {
                    const qualidadeMes = JSON.parse(localStorage.getItem('userData') || '{}').qualidadeMes || 'brandura';
                    const reflexaoSalva = localStorage.getItem(`reflexao_${qualidadeMes}`);
                    if (reflexaoSalva && !reflexao.qualidade) {
                      setReflexao({ ...reflexao, qualidade: reflexaoSalva });
                    }
                    return null;
                  })()}
                </p>
              </div>
            </div>

            {/* Opcional */}
            <p className="text-xs text-center text-gray-500">
              Estas perguntas são opcionais. Não há pressão — apenas reflexão 💭
            </p>

            {/* Botões */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-12"
                onClick={handleEnviarComReflexao}
              >
                Salvar Reflexão e Enviar
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleEnviarSemReflexao}
              >
                Pular e Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}