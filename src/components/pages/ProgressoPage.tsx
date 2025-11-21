import { ArrowLeft, TrendingUp, Target, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { DataService } from '../../services/dataService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProgressoPageProps {
  onVoltar: () => void;
}

export default function ProgressoPage({ onVoltar }: ProgressoPageProps) {
  // Buscar dados do DataService
  const relatorio = DataService.getRelatorioMensal();
  const metaMensal = DataService.getMetaMensal();
  
  const horasCampo = relatorio.horasCampo || 0;
  const horasCredito = relatorio.horasCredito || 0;
  const horasTotal = horasCampo + horasCredito;
  
  const progressoPercentual = Math.min(100, (horasTotal / metaMensal) * 100);
  const progressoCampo = Math.min(100, (horasCampo / metaMensal) * 100);

  const formatarHoras = (horas: number) => {
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return m > 0 ? `${h}h${m}min` : `${h}h`;
  };

  // Dados de progresso semanal (últimas 4 semanas)
  const semanas = [
    { semana: 'Sem 1', campo: 15, credito: 3 },
    { semana: 'Sem 2', campo: 18, credito: 2 },
    { semana: 'Sem 3', campo: 20, credito: 4 },
    { semana: 'Sem 4', campo: 12, credito: 1 },
  ];

  // Comparação mensal (últimos 6 meses)
  const meses = [
    { mes: 'Jun', horas: 65 },
    { mes: 'Jul', horas: 70 },
    { mes: 'Ago', horas: 68 },
    { mes: 'Set', horas: 72 },
    { mes: 'Out', horas: 69 },
    { mes: 'Nov', horas: horasTotal },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-green-600 to-green-700 text-white">
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
            <h1 className="text-xl">Progresso do Mês</h1>
            <p className="text-sm opacity-90">Novembro 2024</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card principal de progresso */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Horas de Ministério
            </h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              ✅ No ritmo!
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-green-600">{formatarHoras(horasTotal)}</p>
                <p className="text-sm text-gray-500">de {formatarHoras(metaMensal)}</p>
              </div>
              <p className="text-xs text-gray-600">
                Campo: {formatarHoras(horasCampo)} | Crédito: {formatarHoras(horasCredito)}
              </p>
            </div>
            
            {/* Barra de progresso dupla */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              {/* Barra de campo (verde sólido) */}
              <div 
                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
                style={{ width: `${progressoCampo}%` }}
              />
              {/* Barra de crédito (verde hachurado) */}
              <div 
                className="absolute top-0 h-full bg-green-300 opacity-60 transition-all duration-300"
                style={{ 
                  left: `${progressoCampo}%`,
                  width: `${progressoPercentual - progressoCampo}%`,
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
                }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">0h</span>
              <span className="text-green-600 font-medium">{progressoPercentual.toFixed(0)}%</span>
              <span className="text-gray-600">{formatarHoras(metaMensal)}</span>
            </div>

            <p className="text-sm text-gray-600 text-center bg-green-50 p-3 rounded-lg">
              💪 Você está no caminho certo! Continue assim.
            </p>
          </div>
        </Card>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{relatorio.estudos || 0}</p>
            <p className="text-xs text-gray-600">Estudos</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">{relatorio.revisitas || 0}</p>
            <p className="text-xs text-gray-600">Revisitas</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{relatorio.publicacoes || 0}</p>
            <p className="text-xs text-gray-600">Publicações</p>
          </Card>
        </div>

        {/* Gráfico de progresso semanal */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Progresso Semanal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="semana" 
                tick={{ fontSize: 12 }}
                stroke="#999"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#999"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
              />
              <Bar 
                dataKey="campo" 
                name="Campo"
                fill="#16a34a"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="credito" 
                name="Crédito"
                fill="#86efac"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Comparação mensal */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Últimos 6 Meses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={meses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12 }}
                stroke="#999"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#999"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="horas" 
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Média mensal:</span>{' '}
              {formatarHoras(meses.reduce((acc, m) => acc + m.horas, 0) / meses.length)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
