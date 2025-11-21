import { ArrowLeft, Calendar, Clock, BookOpen, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface CronogramaPageProps {
  onVoltar: () => void;
  diaSelecionado?: any;
}

export default function CronogramaPage({ onVoltar, diaSelecionado }: CronogramaPageProps) {
  // Dados da semana (mock - em produção viria do DataService)
  const semana = [
    { 
      dia: 'Segunda-feira', 
      data: '18 Nov', 
      status: 'planejada',
      periodo: 'Manhã',
      estudos: [
        { nome: 'Maria Silva', horario: '09:00', publicacao: 'Bíblia Ensina', local: 'Rua das Flores, 123' },
        { nome: 'João Santos', horario: '10:30', publicacao: 'Boas Notícias', local: 'Av. Central, 456' },
      ]
    },
    { 
      dia: 'Terça-feira', 
      data: '19 Nov', 
      status: 'livre',
      periodo: null,
      estudos: []
    },
    { 
      dia: 'Quarta-feira', 
      data: '20 Nov', 
      status: 'planejada',
      periodo: 'Tarde',
      estudos: [
        { nome: 'Ana Costa', horario: '15:00', publicacao: 'Verdade que Leva à Vida', local: 'Rua do Sol, 789' },
      ]
    },
    { 
      dia: 'Quinta-feira', 
      data: '21 Nov', 
      status: 'planejada',
      periodo: 'Manhã',
      estudos: [
        { nome: 'Pedro Oliveira', horario: '08:30', publicacao: 'Bíblia Ensina', local: 'Rua Verde, 321' },
        { nome: 'Carla Lima', horario: '10:00', publicacao: 'Boas Notícias', local: 'Av. Principal, 654' },
        { nome: 'Lucas Souza', horario: '11:30', publicacao: 'Verdade que Leva à Vida', local: 'Rua Azul, 987' },
      ]
    },
    { 
      dia: 'Sexta-feira', 
      data: '22 Nov', 
      status: 'livre',
      periodo: null,
      estudos: []
    },
    { 
      dia: 'Sábado', 
      data: '23 Nov', 
      status: 'planejada',
      periodo: 'Manhã',
      estudos: [
        { nome: 'Sofia Alves', horario: '09:00', publicacao: 'Boas Notícias', local: 'Rua das Palmeiras, 147' },
        { nome: 'Roberto Dias', horario: '10:30', publicacao: 'Bíblia Ensina', local: 'Av. das Américas, 258' },
      ]
    },
    { 
      dia: 'Domingo', 
      data: '24 Nov', 
      status: 'livre',
      periodo: null,
      estudos: []
    },
  ];

  const diaAtual = diaSelecionado || semana[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl">Cronograma da Semana</h1>
            <p className="text-sm opacity-90">Novembro 2024</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-4">
        {semana.map((dia, idx) => (
          <Card key={idx} className={`p-4 ${dia.status === 'planejada' ? 'border-indigo-200' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{dia.dia}</h3>
                <p className="text-sm text-gray-600">{dia.data}</p>
              </div>
              {dia.status === 'planejada' ? (
                <Badge className="bg-indigo-100 text-indigo-700">
                  {dia.periodo} planejada
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  Livre
                </Badge>
              )}
            </div>

            {dia.estudos.length > 0 && (
              <div className="space-y-3 mt-4">
                {dia.estudos.map((estudo, estudoIdx) => (
                  <div 
                    key={estudoIdx}
                    className="p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-indigo-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{estudo.nome}</h4>
                        <p className="text-xs text-gray-600 mt-1">{estudo.publicacao}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {estudo.horario}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {estudo.local}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {dia.status === 'livre' && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma atividade planejada
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
