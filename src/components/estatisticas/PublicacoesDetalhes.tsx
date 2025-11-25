import { ArrowLeft, BookOpen, TrendingUp, Calendar, CheckCircle2, Lightbulb, BarChart3, Clock, HelpCircle, FileText, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DataService } from '../../services/dataService';

interface PublicacoesDetalhesProps {
  onClose: () => void;
}

export default function PublicacoesDetalhes({ onClose }: PublicacoesDetalhesProps) {
  // Buscar dados reais do DataService
  const totalPublicacoes = DataService.getTotalPublicacoesMes();
  const publicacoesPorTipoMap = DataService.getPublicacoesPorTipo();
  const sessoes = DataService.getSessoesMes();
  
  // Agrupar publicações por tipo
  const publicacoesPorTipo = Array.from(publicacoesPorTipoMap.entries()).map(([tipo, total]) => ({
    tipo: tipo === 'revista' ? 'Revistas' :
          tipo === 'brochura' ? 'Brochuras' :
          tipo === 'livro' ? 'Livros' :
          tipo === 'tratado' ? 'Tratados' : tipo,
    total,
    cor: tipo === 'revista' ? 'blue' :
         tipo === 'brochura' ? 'green' :
         tipo === 'livro' ? 'purple' : 'orange',
    detalhes: sessoes
      .flatMap(s => s.publicacoes || [])
      .filter(p => p.tipo === tipo)
      .map(p => `${p.titulo}: ${p.quantidade}`)
  }));
  
  // Calcular contextos (onde foram distribuídas)
  const totalRevisitas = sessoes.filter(s => 
    s.atividades.some(a => a.tipo === 'revisita')
  ).reduce((sum, s) => sum + (s.publicacoes?.reduce((pSum, p) => pSum + p.quantidade, 0) || 0), 0);
  
  const totalCasaEmCasa = sessoes.filter(s => 
    s.atividades.some(a => a.tipo === 'casa-em-casa')
  ).reduce((sum, s) => sum + (s.publicacoes?.reduce((pSum, p) => pSum + p.quantidade, 0) || 0), 0);
  
  const totalTestemunhoPublico = sessoes.filter(s => 
    s.atividades.some(a => a.tipo === 'testemunho-publico')
  ).reduce((sum, s) => sum + (s.publicacoes?.reduce((pSum, p) => pSum + p.quantidade, 0) || 0), 0);
  
  const contextos = [
    { 
      nome: 'Casa em Casa', 
      total: totalCasaEmCasa, 
      percentual: Math.round((totalCasaEmCasa / totalPublicacoes) * 100), 
      cor: 'green' 
    },
    { 
      nome: 'Revisitas', 
      total: totalRevisitas, 
      percentual: Math.round((totalRevisitas / totalPublicacoes) * 100), 
      cor: 'blue' 
    },
    { 
      nome: 'Testemunho Público', 
      total: totalTestemunhoPublico, 
      percentual: Math.round((totalTestemunhoPublico / totalPublicacoes) * 100), 
      cor: 'orange' 
    }
  ].filter(c => c.total > 0);
  
  // Temas mais distribuídos (mockado por enquanto - precisaria de tracking adicional)
  const temasMaisDistribuidos = [
    { tema: 'Família/Criação de Filhos', quantidade: 4, emoji: '👨‍👩‍👧' },
    { tema: 'Sofrimento/Consolo', quantidade: 3, emoji: '💔' },
    { tema: 'Profecias Bíblicas', quantidade: 2, emoji: '📜' }
  ];
  
  // Distribuição por semana
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const semanas = [];
  
  for (let semana = 1; semana <= 5; semana++) {
    const inicioSemana = new Date(anoAtual, mesAtual, (semana - 1) * 7 + 1);
    const fimSemana = new Date(anoAtual, mesAtual, semana * 7);
    
    const quantidade = sessoes
      .filter(s => {
        const data = new Date(s.data);
        return data >= inicioSemana && data <= fimSemana;
      })
      .reduce((sum, s) => sum + (s.publicacoes?.reduce((pSum, p) => pSum + p.quantidade, 0) || 0), 0);
    
    if (inicioSemana.getMonth() === mesAtual) {
      semanas.push({
        periodo: `Semana ${semana} (${inicioSemana.getDate()}-${fimSemana.getDate()} nov)`,
        quantidade
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="text-white px-6 pt-12 pb-6 sticky top-0 z-10" style={{ backgroundColor: '#4A2C60' }}>
        <button onClick={onClose} className="flex items-center gap-2 mb-4 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span>Início</span>
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <div>
            <h1 className="text-2xl">Publicações</h1>
            <p className="text-sm opacity-90">Novembro 2025</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-32">
        {/* Resumo do Mês */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-purple-900">
              <CheckCircle2 className="w-5 h-5" /> Ótimo trabalho!
            </h3>
            <p className="text-gray-700">
              Você distribuiu <strong>12 publicações</strong> este mês, levando a mensagem da Bíblia a mais pessoas.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-600">Este mês</p>
                <p className="text-2xl text-purple-600">12</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mês anterior</p>
                <p className="text-2xl text-gray-400">9</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +3 (+33%) ↗️
              </Badge>
            </div>
          </div>
        </Card>

        {/* Publicações por Tipo */}
        <Card className="p-6">
          <h3 className="mb-4">Publicações por Tipo</h3>
          
          <div className="space-y-4">
            {publicacoesPorTipo.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{item.tipo}</span>
                  <span className="text-sm font-medium">{item.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-${item.cor}-600 h-3 rounded-full`}
                    style={{ width: `${(item.total / 12) * 100}%` }}
                  />
                </div>
                <div className="mt-1 space-y-1">
                  {item.detalhes.map((detalhe, detIdx) => (
                    <p key={detIdx} className="text-xs text-gray-600 ml-2">• {detalhe}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <p className="text-2xl" style={{ color: '#4A2C60' }}>8</p>
              <p className="text-xs text-gray-600">Revistas<br />67%</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl text-green-600">3</p>
              <p className="text-xs text-gray-600">Brochuras<br />25%</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl text-purple-600">1</p>
              <p className="text-xs text-gray-600">Livros<br />8%</p>
            </div>
          </div>
        </Card>

        {/* Contexto da Distribuição */}
        <Card className="p-6">
          <h3 className="mb-4">Contexto da Distribuição</h3>
          
          <div className="space-y-3">
            {contextos.map((contexto, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${contexto.cor}-600`} />
                    <span className="text-sm">{contexto.nome}</span>
                  </div>
                  <Badge variant="secondary" className={`bg-${contexto.cor}-100 text-${contexto.cor}-700`}>
                    {contexto.total} ({contexto.percentual}%)
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${contexto.cor}-600 h-2 rounded-full`}
                    style={{ width: `${contexto.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Temas Mais Distribuídos */}
        <Card className="p-6" style={{ background: 'linear-gradient(to bottom right, rgba(74, 44, 96, 0.05), rgba(74, 44, 96, 0.1))', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
          <h3 className="mb-4" style={{ color: '#4A2C60' }}>Temas Mais Distribuídos</h3>
          
          <div className="space-y-3">
            {temasMaisDistribuidos.map((tema, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tema.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{tema.tema}</p>
                    <p className="text-xs text-gray-600">#{idx + 1} mais distribuído</p>
                  </div>
                </div>
                <Badge variant="secondary" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)', color: '#4A2C60' }}>
                  {tema.quantidade}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Linha do Tempo de Distribuição */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Distribuição Semanal
          </h3>
          
          <div className="space-y-3">
            {semanas.map((semana, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{semana.periodo}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(semana.quantidade)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs">
                        <BookOpen className="w-3 h-3" />
                      </div>
                    ))}
                    {semana.quantidade === 0 && (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </div>
                  <span className="text-sm font-medium w-8 text-right">({semana.quantidade})</span>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-700 mt-4 bg-green-50 p-3 rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Você distribuiu publicações de forma consistente ao longo do mês!
          </p>
        </Card>

        {/* Publicações com Follow-up */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <h3 className="mb-4 text-orange-900">Acompanhamento das Publicações</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm">Com follow-up planejado</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                5 (42%)
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: '#4A2C60' }} />
                <span className="text-sm">Aguardando retorno</span>
              </div>
              <Badge variant="secondary" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)', color: '#4A2C60' }}>
                4 (33%)
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Sem follow-up</span>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                3 (25%)
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border-2 border-orange-200">
            <p className="text-sm text-orange-900 flex items-start gap-2">
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Oportunidade:</strong>
                <br />
                Você tem <strong>4 publicações</strong> que podem se tornar revisitas! Considere retornar aos endereços.
              </span>
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
              { mes: 'Jun', valor: 6 },
              { mes: 'Jul', valor: 7 },
              { mes: 'Ago', valor: 8 },
              { mes: 'Set', valor: 9 },
              { mes: 'Out', valor: 9 },
              { mes: 'Nov', valor: 12 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                  <div 
                    className={`w-8 ${idx === 5 ? 'bg-purple-600' : 'bg-purple-300'} rounded-t`}
                    style={{ height: `${(item.valor / 15) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{item.mes}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-700 text-center pt-2">
            <TrendingUp className="w-4 h-4 inline text-green-600" />
            {' '}Crescimento constante: <strong className="text-green-600">+67%</strong> em 6 meses 📈
          </p>
        </Card>
      </div>

      {/* Botões de Ação Fixos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <FileText className="w-4 h-4 mr-2" />
          Registrar Nova Publicação
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Histórico Completo
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Solicitar Publicações
          </Button>
        </div>
      </div>
    </div>
  );
}