import { ArrowLeft, BookOpen, TrendingUp, Clock, Users, Target, Calendar, CheckCircle, Award, Star, MapPin, Heart, BarChart3 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { DataService, Estudo } from '../../services/dataService';

interface EstudosDetalhesProps {
  onClose: () => void;
  onNavigateToEstudos?: () => void;
}

export default function EstudosDetalhes({ onClose, onNavigateToEstudos }: EstudosDetalhesProps) {
  // Buscar dados reais do DataService
  const estudos = DataService.getEstudos();
  const estudosMes = DataService.getEstudosPorMes(new Date().getMonth(), new Date().getFullYear());
  const estudantesPorNome = DataService.getEstudantesPorEstudo();
  
  // Agrupar estudantes com suas estatísticas
  const estudantes = Array.from(estudantesPorNome.entries()).map(([nome, estudosEstudante]) => {
    const ultimoEstudo = estudosEstudante[estudosEstudante.length - 1];
    const primeiroEstudo = estudosEstudante[0];
    
    return {
      nome,
      publicacao: ultimoEstudo.publicacao + (ultimoEstudo.licao ? ` - Lição ${ultimoEstudo.licao}` : ''),
      estudosMes: estudosEstudante.filter(e => {
        const data = new Date(e.data);
        return data.getMonth() === new Date().getMonth();
      }).length,
      datas: estudosEstudante.map(e => new Date(e.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
      status: ultimoEstudo.status === 'iniciando' ? 'Iniciando' : 
              ultimoEstudo.status === 'progredindo' ? 'Progredindo' : 'Avançado',
      progresso: ultimoEstudo.progresso,
      avatar: ultimoEstudo.estudanteAvatar || nome.split(' ').map(n => n[0]).join(''),
      cor: ['blue', 'green', 'purple', 'pink', 'orange', 'indigo'][Math.floor(Math.random() * 6)]
    };
  });

  // Criar calendário com estudos
  const calendario: { dia: number; estudos: number }[] = [];
  for (let dia = 1; dia <= 30; dia++) {
    const estudosNoDia = estudosMes.filter(e => {
      const data = new Date(e.data);
      return data.getDate() === dia;
    }).length;
    
    if (estudosNoDia > 0) {
      calendario.push({ dia, estudos: estudosNoDia });
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-primary-500 text-white px-6 pt-12 pb-6 sticky top-0 z-10">
        <button onClick={onClose} className="flex items-center gap-2 mb-4 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span>Início</span>
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <div>
            <h1 className="text-2xl">Estudos Bíblicos</h1>
            <p className="text-sm opacity-90">Novembro 2025</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Resumo do Mês */}
        <Card className="p-6 bg-primary-50 border-2 border-primary-200">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-primary-500">
              <Target className="w-5 h-5" />
              Resumo de Novembro
            </h3>
            <p className="text-gray-700">
              Você conduziu <strong>11 estudos bíblicos</strong> este mês, com <strong>7 estudantes diferentes</strong>.
            </p>
            <p className="text-gray-700">
              Isso representa <strong className="text-secondary-500">+2 estudos</strong> comparado ao mês anterior. Continue assim! 📈
            </p>
          </div>
        </Card>

        {/* Métricas Comparativas */}
        <Card className="p-6">
          <h3 className="mb-4">Comparação Mensal</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Total de estudos</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl text-primary-500">11</p>
                <Badge variant="secondary" className="text-xs bg-secondary-100 text-primary-500">
                  +2 ↗️
                </Badge>
              </div>
              <p className="text-xs text-gray-500">vs. 9 (mês anterior)</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Estudantes ativos</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl text-primary-500">7</p>
                <Badge variant="secondary" className="text-xs bg-secondary-100 text-primary-500">
                  +1 ↗️
                </Badge>
              </div>
              <p className="text-xs text-gray-500">vs. 6 (mês anterior)</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Frequência média</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl text-primary-500">1.6x</p>
                <Badge variant="secondary" className="text-xs bg-secondary-100 text-primary-500">
                  +0.1 ↗️
                </Badge>
              </div>
              <p className="text-xs text-gray-500">por semana</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600">Taxa de conclusão</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl text-primary-500">91%</p>
                <Badge variant="secondary" className="text-xs bg-secondary-100 text-primary-500">
                  +2% ↗️
                </Badge>
              </div>
              <p className="text-xs text-gray-500">vs. 89% (mês anterior)</p>
            </div>
          </div>
        </Card>

        {/* Estudos por Estudante */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-primary-500">
            <Users className="w-5 h-5" />
            Estudos por Estudante
          </h3>
          
          {estudantes.map((estudante, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full bg-${estudante.cor}-100 flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-${estudante.cor}-700`}>{estudante.avatar}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="truncate">{estudante.nome}</h4>
                      <p className="text-sm text-gray-600 truncate">{estudante.publicacao}</p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {estudante.status === 'Progredindo' && <BookOpen className="w-3 h-3" />}
                      {estudante.status === 'Iniciando' && <Sprout className="w-3 h-3" />}
                      {estudante.status === 'Avançado' && <Star className="w-3 h-3" />}
                      {' '}{estudante.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm mb-1">
                        <strong>{estudante.estudosMes} estudos</strong> este mês
                      </p>
                      <p className="text-xs text-gray-600">
                        Datas: {estudante.datas.join(', ')}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progresso do livro</span>
                        <span>{estudante.progresso}%</span>
                      </div>
                      <Progress value={estudante.progresso} className="h-2" />
                    </div>
                    
                    {estudante.alerta && (
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        ⚠️ {estudante.alerta}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Ver Perfil
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Agendar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Calendário de Estudos */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary-500" />
            Calendário de Estudos
          </h3>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((dia, idx) => (
              <div key={idx} className="text-xs text-gray-600 pb-2">
                {dia}
              </div>
            ))}
            
            {/* Dias vazios no início */}
            {[...Array(4)].map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}
            
            {/* Dias do mês */}
            {[...Array(30)].map((_, idx) => {
              const dia = idx + 1;
              const estudosDia = calendario.find(c => c.dia === dia);
              
              return (
                <div
                  key={dia}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm relative ${
                    estudosDia 
                      ? 'bg-primary-100 text-primary-500 font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  {dia}
                  {estudosDia && estudosDia.estudos > 1 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                      {estudosDia.estudos}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          
          <p className="text-sm text-gray-600 mt-4 flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-primary-100"></span>
            = Dia com estudo
          </p>
        </Card>

        {/* Insights e Padrões */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h3 className="flex items-center gap-2 mb-4 text-purple-900">
            <BarChart3 className="w-5 h-5" /> Padrões Identificados
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-gray-900"><strong>Melhor dia da semana:</strong> Quinta-feira (4 estudos)</p>
                <p className="text-gray-600 text-xs mt-1">A maioria dos seus estudos acontece nas quintas.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-gray-900"><strong>Horário preferido:</strong> 16h - 19h (6 estudos)</p>
                <p className="text-gray-600 text-xs mt-1">Você prefere estudar no final da tarde.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-gray-900"><strong>Atenção:</strong> Maria está com intervalo longo</p>
                <p className="text-gray-600 text-xs mt-1">Faz 14 dias desde o último estudo com Maria.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 flex-shrink-0 text-primary-500" />
              <div>
                <p className="text-gray-900"><strong>Progresso:</strong> 2 estudantes avançaram de nível</p>
                <p className="text-gray-600 text-xs mt-1">João passou de Iniciando para Progredindo</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Comparação com Meses Anteriores */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Evolução Mensal
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-end justify-between h-32">
              {[
                { mes: 'Jun', valor: 7 },
                { mes: 'Jul', valor: 8 },
                { mes: 'Ago', valor: 8 },
                { mes: 'Set', valor: 9 },
                { mes: 'Out', valor: 9 },
                { mes: 'Nov', valor: 11 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                    <div 
                      className={`w-8 rounded-t ${idx === 5 ? 'bg-primary-500' : 'bg-primary-200'}`}
                      style={{ height: `${(item.valor / 12) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{item.mes}</span>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-700 text-center pt-2">
              <TrendingUp className="w-4 h-4 inline text-green-600" />
              {' '}Seus estudos aumentaram <strong className="text-green-600">22%</strong> nos últimos 3 meses!
            </p>
          </div>
        </Card>

        {/* Espaço final */}
        <div className="h-4" />
      </div>

      {/* Botões de Ação Fixos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2 z-20">
        <Button 
          className="w-full bg-primary-500 hover:bg-primary-600 text-white"
          onClick={onNavigateToEstudos}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Ver Todos os Estudos
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Exportar Relatório
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            Histórico Completo
          </Button>
        </div>
      </div>
    </div>
  );
}