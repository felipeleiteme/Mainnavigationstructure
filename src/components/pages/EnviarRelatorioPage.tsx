import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Heart, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

interface EnviarRelatorioPageProps {
  onVoltar: () => void;
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

export default function EnviarRelatorioPage({ onVoltar, relatorio, temaMes }: EnviarRelatorioPageProps) {
  const [step, setStep] = useState<'revisao' | 'reflexao'>('revisao');
  const [reflexao, setReflexao] = useState({
    alegria: '',
    qualidade: '',
  });

  const totalHoras = relatorio.horasCampo + relatorio.horasCredito;

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
    onVoltar();
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
    onVoltar();
  };

  // Tela 1: Revisão do Relatório
  if (step === 'revisao') {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
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
            <div className="flex-1 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl">Enviar Relatório</h2>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-6">
          {/* Resumo do Mês */}
          <Card className="p-6 border-2" style={{ 
            background: 'linear-gradient(135deg, rgba(74, 44, 96, 0.05) 0%, rgba(200, 224, 70, 0.1) 100%)',
            borderColor: 'rgba(74, 44, 96, 0.2)'
          }}>
            <h3 className="mb-4" style={{ color: '#4A2C60' }}>Resumo do Mês</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl" style={{ color: '#C8E046' }}>{totalHoras.toFixed(1)}h</p>
                <p className="text-xs text-gray-600 mt-1">Total de Horas</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl" style={{ color: '#4A2C60' }}>{relatorio.estudos}</p>
                <p className="text-xs text-gray-600 mt-1">Estudos</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xl" style={{ color: '#4A2C60' }}>{relatorio.revisitas}</p>
                <p className="text-xs text-gray-600">Revisitas</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xl" style={{ color: '#4A2C60' }}>{relatorio.publicacoes}</p>
                <p className="text-xs text-gray-600">Publicações</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xl" style={{ color: '#4A2C60' }}>{relatorio.videos}</p>
                <p className="text-xs text-gray-600">Vídeos</p>
              </div>
            </div>
          </Card>

          {/* Informação */}
          <div className="flex items-start gap-3 p-4 rounded-lg border-2" style={{ 
            backgroundColor: 'rgba(200, 224, 70, 0.1)', 
            borderColor: 'rgba(200, 224, 70, 0.3)' 
          }}>
            <span className="text-2xl">💡</span>
            <div className="flex-1 text-sm">
              <p className="mb-1" style={{ color: '#4A2C60' }}>
                Além dos números, o que realmente importa é como você cresceu.
              </p>
              <p style={{ color: '#4A2C60' }}>
                Quer adicionar uma reflexão pessoal ao seu relatório?
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-white"
              style={{ backgroundColor: '#4A2C60' }}
              onClick={() => setStep('reflexao')}
            >
              Adicionar Reflexão
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              className="w-full h-12"
              style={{ 
                borderColor: '#4A2C60',
                color: '#4A2C60'
              }}
              onClick={handleEnviarSemReflexao}
            >
              Enviar Sem Reflexão
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela 2: Reflexão do Mês
  if (step === 'reflexao') {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
          <div className="flex items-center gap-4 px-6 pt-12 pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('revisao')}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <h2 className="text-xl">Reflexão do Mês</h2>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-6">
          {/* Tema do Mês */}
          <Card className="p-4 border-2" style={{ 
            background: 'linear-gradient(135deg, rgba(74, 44, 96, 0.05) 0%, rgba(200, 224, 70, 0.1) 100%)',
            borderColor: 'rgba(74, 44, 96, 0.2)'
          }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🕊️</span>
              <div>
                <p className="text-sm text-gray-600">Tema do mês:</p>
                <p className="text-lg" style={{ color: '#4A2C60' }}>{temaMes}</p>
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
                <span className="text-sm" style={{ color: '#4A2C60' }}>O que te trouxe alegria este mês?</span>
              </label>
              <Textarea
                placeholder="Momentos especiais, experiências, aprendizados..."
                value={reflexao.alegria}
                onChange={(e) => setReflexao({ ...reflexao, alegria: e.target.value })}
                className="resize-none min-h-[100px] bg-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block mb-2">
                <span className="text-sm" style={{ color: '#4A2C60' }}>Como você cultivou "{temaMes}" este mês?</span>
              </label>
              <Textarea
                placeholder="Situações onde você praticou..."
                value={reflexao.qualidade}
                onChange={(e) => setReflexao({ ...reflexao, qualidade: e.target.value })}
                className="resize-none min-h-[100px] bg-white"
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
              className="w-full h-12 text-white"
              style={{ backgroundColor: '#4A2C60' }}
              onClick={handleEnviarComReflexao}
            >
              Salvar Reflexão e Enviar
            </Button>
            
            <Button 
              variant="outline"
              className="w-full h-12"
              style={{ 
                borderColor: '#4A2C60',
                color: '#4A2C60'
              }}
              onClick={handleEnviarSemReflexao}
            >
              Pular e Enviar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}