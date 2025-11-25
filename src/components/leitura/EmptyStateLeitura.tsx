import { BookOpen, Sparkles, Target, Calendar, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface EmptyStateLeituraProps {
  onIniciarConfiguracao: () => void;
  onVoltar?: () => void;
}

export default function EmptyStateLeitura({ onIniciarConfiguracao, onVoltar }: EmptyStateLeituraProps) {
  return (
    <div className="min-h-screen bg-neutral pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
        <div className="flex items-center gap-4 px-6 pt-12 pb-4">
          {onVoltar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="p-2 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <h2 className="text-xl">Leitura da Bíblia</h2>
            <p className="text-sm opacity-90">Sua base espiritual para jogar sementes</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-8 space-y-6">
        {/* Card principal de Empty State */}
        <Card className="p-8 text-center border-2 border-primary-200">
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-primary-50 rounded-full">
              <BookOpen className="w-16 h-16 text-primary-600" strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="text-2xl mb-3 text-primary-700">
            Comece sua jornada
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Configure seu plano de leitura personalizado e acompanhe seu progresso espiritual com metas diárias e conquistas.
          </p>

          <Button
            className="w-full shadow-lg"
            style={{ backgroundColor: '#4A2C60', color: 'white' }}
            size="lg"
            onClick={onIniciarConfiguracao}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Configurar Plano de Leitura
          </Button>
        </Card>

        {/* Benefícios */}
        <div className="space-y-4">
          <h3 className="text-primary-700 px-2">O que você vai conseguir:</h3>
          
          <Card className="p-5 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-50 rounded-xl">
                <Target className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-700 mb-1">Metas Personalizadas</h4>
                <p className="text-sm text-gray-600">
                  Escolha quantos capítulos ler por dia de acordo com sua rotina
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-50 rounded-xl">
                <Calendar className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-700 mb-1">Acompanhamento Diário</h4>
                <p className="text-sm text-gray-600">
                  Registre suas leituras e mantenha uma ofensiva de dias seguidos
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary-50 rounded-xl">
                <Sparkles className="w-6 h-6 text-secondary-700" />
              </div>
              <div className="flex-1">
                <h4 className="text-primary-700 mb-1">Conquistas e Reflexões</h4>
                <p className="text-sm text-gray-600">
                  Desbloqueie conquistas e registre suas reflexões espirituais
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}