import { ArrowLeft, Sprout, TrendingUp, MapPin, Home, Store, Building2, Calendar, User2, PartyPopper, Zap, Sparkles, AlertTriangle, Target, CheckCircle2, BarChart3, BookOpen, Flame, CircleDot, Moon as MoonIcon, BookMarked } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DataService } from '../../services/dataService';

interface RevisitasDetalhesProps {
  onClose: () => void;
  onNavigateToCampo?: () => void;
}

export default function RevisitasDetalhes({ onClose, onNavigateToCampo }: RevisitasDetalhesProps) {
  // Buscar dados reais do DataService
  const todasRevisitas = DataService.getRevisitas();
  const revisitasNovasMes = DataService.getRevisitasNovasMes();
  
  // Mapear ícones por origem
  const getIconeOrigem = (origem: string) => {
    switch (origem) {
      case 'casa-em-casa': return <Home className="w-4 h-4" />;
      case 'testemunho-publico': return <Building2 className="w-4 h-4" />;
      case 'testemunho-informal': return <Store className="w-4 h-4" />;
      default: return <User2 className="w-4 h-4" />;
    }
  };
  
  // Formatar nome da origem
  const getNomeOrigem = (origem: string) => {
    switch (origem) {
      case 'casa-em-casa': return 'Casa em Casa';
      case 'testemunho-publico': return 'Testemunho Público';
      case 'testemunho-informal': return 'Testemunho Informal';
      default: return 'Outro';
    }
  };
  
  // Calcular dias desde última visita
  const calcularDiasDesdeVisita = (dataVisita?: string) => {
    if (!dataVisita) return null;
    const hoje = new Date();
    const visita = new Date(dataVisita);
    const diff = Math.floor((hoje.getTime() - visita.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };
  
  // Formatar revisitas para exibição
  const revisitas = revisitasNovasMes.map(r => {
    const diasDesdeVisita = calcularDiasDesdeVisita(r.ultimaVisita);
    const alerta = diasDesdeVisita && diasDesdeVisita > 10 ? `Faz ${diasDesdeVisita} dias. Considere retornar.` : undefined;
    
    return {
      nome: r.nome,
      data: new Date(r.dataAdicao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
      origem: getNomeOrigem(r.origem),
      icone: getIconeOrigem(r.origem),
      endereco: r.endereco,
      status: r.status === 'nova' ? 'Nova' : 
              r.status === 'quente' ? 'Quente' : 
              r.status === 'interessado' ? 'Interessado' : 'Descanso',
      visitas: r.quantidadeVisitas,
      ultimaVisita: diasDesdeVisita ? `${diasDesdeVisita} ${diasDesdeVisita === 1 ? 'dia' : 'dias'}` : 'Primeira visita',
      nota: r.primeiraConversa + (r.publicacoesEntregues.length > 0 ? `. Entregue: ${r.publicacoesEntregues.join(', ')}` : ''),
      avatar: r.avatar || r.nome.split(' ').map(n => n[0]).join(''),
      cor: ['pink', 'blue', 'green', 'purple', 'orange'][Math.floor(Math.random() * 5)],
      alerta,
      converteuEstudo: r.interesseEstudo
    };
  });

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="text-white px-6 pt-12 pb-6 sticky top-0 z-10" style={{ background: 'linear-gradient(to bottom right, #4A2C60, #5A3C70)' }}>
        <button onClick={onClose} className="flex items-center gap-2 mb-4 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span>Início</span>
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Sprout className="w-8 h-8" />
          <div>
            <h1 className="text-2xl">Revisitas Novas</h1>
            <p className="text-sm opacity-90">Novembro 2025</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-32">
        {/* Resumo do Mês */}
        <Card className="p-6 border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
          <div className="space-y-3">
            <h3 className="flex items-center gap-2" style={{ color: '#4A2C60' }}>
              <PartyPopper className="w-5 h-5" /> Parabéns!
            </h3>
            <p className="text-gray-700">
              Você adicionou <strong>5 novas revisitas</strong> este mês!
            </p>
            <p className="text-gray-700">
              Isso mostra seu excelente trabalho no campo. Continue plantando sementes!
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-600">Este mês</p>
                <p className="text-2xl" style={{ color: '#C8E046' }}>5</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mês anterior</p>
                <p className="text-2xl text-gray-400">3</p>
              </div>
              <Badge variant="secondary" style={{ backgroundColor: 'rgba(200, 224, 70, 0.2)', color: '#4A2C60' }}>
                +2 (+67%) ↗️
              </Badge>
            </div>
          </div>
        </Card>

        {/* Lista de Novas Revisitas */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2">
            <Sprout className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Suas Novas Revisitas
          </h3>
          
          {revisitas.map((revisita, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full bg-${revisita.cor}-100 flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-${revisita.cor}-700`}>{revisita.avatar}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="truncate">{revisita.nome}</h4>
                      <p className="text-xs text-gray-600">{revisita.data}</p>
                    </div>
                    <Badge variant="secondary" className={`flex-shrink-0 ${
                      revisita.status === 'Quente' 
                        ? 'bg-orange-100 text-orange-700' 
                        : ''
                    }`} style={revisita.status !== 'Quente' ? { backgroundColor: 'rgba(74, 44, 96, 0.1)', color: '#4A2C60' } : {}}>
                      {revisita.status === 'Quente' ? '⚡' : '🆕'} {revisita.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {revisita.icone}
                      <span className="text-gray-600">{revisita.origem}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{revisita.endereco}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Visitada {revisita.visitas}x</span>
                      <span>•</span>
                      <span>Há {revisita.ultimaVisita}</span>
                    </div>
                    
                    {revisita.converteuEstudo && (
                      <Badge className="text-white text-xs flex items-center gap-1" style={{ backgroundColor: '#4A2C60' }}>
                        <Sparkles className="w-3 h-3" /> Convertida em estudo!
                      </Badge>
                    )}
                    
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded italic">
                      "{revisita.nota}"
                    </p>
                    
                    {revisita.alerta && (
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        ⚠️ {revisita.alerta}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="text-xs flex-1" style={{ backgroundColor: '#4A2C60', color: 'white' }}>
                      Agendar Visita
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Origem das Revisitas */}
        <Card className="p-6">
          <h3 className="mb-4">Origem das Revisitas</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-600" />
                <span className="text-sm">Casa em Casa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">3 pessoas</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">60%</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" style={{ color: '#4A2C60' }} />
                <span className="text-sm">Testemunho Informal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">1 pessoa</span>
                <Badge variant="secondary" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)', color: '#4A2C60' }}>20%</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Testemunho Público</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">1 pessoa</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">20%</Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4 bg-green-50 p-3 rounded flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span>A maioria das suas revisitas vem do trabalho casa em casa. Bom trabalho!</span>
            <Target className="w-4 h-4 text-green-600" />
          </p>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="p-6" style={{ background: 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.05), rgba(74, 44, 96, 0.1))', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
          <h3 className="mb-4" style={{ color: '#4A2C60' }}>Funil de Conversão</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div className="absolute inset-0 rounded-full" style={{ width: '100%', backgroundColor: '#4A2C60' }}>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                    Contatos: 23 (100%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div className="absolute inset-0 rounded-full" style={{ width: '35%', backgroundColor: 'rgba(74, 44, 96, 0.7)' }}>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                    Interessados: 8 (35%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-600 rounded-full" style={{ width: '22%' }}>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                    Revisitas: 5 (22%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-600 rounded-full" style={{ width: '9%' }}>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                    Estudos: 2 (9%)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>• De 23 contatos este mês, <strong>5 se tornaram revisitas (22%)</strong></p>
            <p>• <strong className="text-purple-600">2 revisitas progrediram para estudos bíblicos!</strong> 🎉</p>
          </div>
        </Card>

        {/* Linha do Tempo */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Linha do Tempo
          </h3>
          
          <div className="space-y-4">
            {revisitas.map((revisita, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full bg-${revisita.cor}-100 flex items-center justify-center flex-shrink-0`}>
                    {revisita.icone}
                  </div>
                  {idx < revisitas.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <p className="text-sm text-gray-600">{revisita.data}</p>
                  <p className="font-medium">{revisita.nome}</p>
                  <p className="text-sm text-gray-600">{revisita.origem}</p>
                  <p className="text-sm text-gray-700 mt-1">"{revisita.nota.split('.')[0]}"</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Progresso das Revisitas */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <h3 className="mb-4 text-orange-900">Como estão suas novas revisitas?</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">⚡</p>
              <p className="text-xl text-orange-600">2</p>
              <p className="text-xs text-gray-600">Estão quentes</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">📚</p>
              <p className="text-xl text-purple-600">2</p>
              <p className="text-xs text-gray-600">Viraram estudos</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">🆕</p>
              <p className="text-xl" style={{ color: '#4A2C60' }}>1</p>
              <p className="text-xs text-gray-600">Ainda não revisitada</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">💤</p>
              <p className="text-xl text-gray-400">0</p>
              <p className="text-xs text-gray-600">Em descanso</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="text-sm text-center">
              <strong className="text-green-600">Taxa de retenção: 80%</strong>
              <br />
              <span className="text-gray-600 text-xs">(4 de 5 continuam ativas)</span>
            </p>
          </div>
        </Card>

        {/* Comparação Mensal */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Evolução Mensal
          </h3>
          
          <div className="flex items-end justify-between h-32">
            {[
              { mes: 'Jun', valor: 2 },
              { mes: 'Jul', valor: 3 },
              { mes: 'Ago', valor: 2 },
              { mes: 'Set', valor: 4 },
              { mes: 'Out', valor: 3 },
              { mes: 'Nov', valor: 5 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                  <div 
                    className={`w-8 ${idx === 5 ? 'bg-green-600' : 'bg-green-300'} rounded-t`}
                    style={{ height: `${(item.valor / 6) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{item.mes}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-700 text-center pt-2">
            <TrendingUp className="w-4 h-4 inline text-green-600" />
            {' '}Tendência positiva! Continue plantando sementes 🌱
          </p>
        </Card>
      </div>

      {/* Botões de Ação Fixos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <Button 
          style={{ backgroundColor: '#4A2C60', color: 'white' }}
          className="w-full"
          onClick={onNavigateToCampo}
        >
          <Sprout className="w-4 h-4 mr-2" />
          Ver Todas as Revisitas
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            📍 Ver no Mapa
          </Button>
          <Button variant="outline" size="sm">
            📊 Histórico
          </Button>
        </div>
      </div>
    </div>
  );
}