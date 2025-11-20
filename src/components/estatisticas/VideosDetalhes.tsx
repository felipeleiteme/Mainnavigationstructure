import { ArrowLeft, Video, TrendingUp, Play, ThumbsUp, MessageSquare, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DataService } from '../../services/dataService';

interface VideosDetalhesProps {
  onClose: () => void;
}

export default function VideosDetalhes({ onClose }: VideosDetalhesProps) {
  // Buscar dados reais do DataService
  const totalVideos = DataService.getTotalVideosMes();
  const videosPorCategoria = DataService.getVideosPorCategoria();
  const sessoes = DataService.getSessoesMes();
  
  // Agrupar vídeos com mais detalhes
  const todosVideos = sessoes.flatMap(s => s.videos || []);
  
  // Vídeos mais usados (agrupando por título)
  const videosAgrupados = new Map<string, any>();
  todosVideos.forEach(v => {
    const key = v.titulo;
    if (!videosAgrupados.has(key)) {
      videosAgrupados.set(key, {
        titulo: v.titulo,
        categoria: v.categoria,
        duracao: v.duracao,
        exibicoes: 0,
        reacoes: { positiva: 0, neutra: 0, negativa: 0 },
        pessoas: [] as string[]
      });
    }
    const grupo = videosAgrupados.get(key)!;
    grupo.exibicoes++;
    if (v.reacao) grupo.reacoes[v.reacao]++;
  });
  
  const videosMaisUsados = Array.from(videosAgrupados.values())
    .sort((a, b) => b.exibicoes - a.exibicoes)
    .slice(0, 5)
    .map((v, idx) => ({
      ...v,
      reacao: v.reacoes.positiva > v.reacoes.negativa ? 'positiva' : 
              v.reacoes.negativa > v.reacoes.positiva ? 'negativa' : 'neutra',
      cor: ['blue', 'purple', 'green', 'orange', 'pink'][idx]
    }));
  
  // Categorias de vídeos
  const categorias = Array.from(videosPorCategoria.entries())
    .map(([nome, quantidade]) => ({
      nome,
      quantidade,
      percentual: Math.round((quantidade / totalVideos) * 100),
      cor: nome === 'Ensino' ? 'blue' :
           nome === 'Família' ? 'green' :
           nome === 'Reino' ? 'purple' :
           nome === 'Propósito' ? 'orange' : 'pink',
      emoji: nome === 'Ensino' ? '🎯' :
             nome === 'Família' ? '👨‍👩‍👧' :
             nome === 'Reino' ? '📚' :
             nome === 'Propósito' ? '🌟' : '🔬'
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const contextos = [
    { nome: 'Em Estudos Bíblicos', quantidade: 5, percentual: 63, descricao: 'Complemento da lição' },
    { nome: 'Em Revisitas', quantidade: 2, percentual: 25, descricao: 'Para despertar interesse' },
    { nome: 'Testemunho Informal', quantidade: 1, percentual: 12, descricao: 'Mostrou no celular' }
  ];

  const videosSugeridos = [
    {
      titulo: 'O Reino de Deus — O Que Fará Por Você?',
      duracao: '5:32',
      categoria: 'Esperança',
      destaque: 'Popular entre pioneiros'
    },
    {
      titulo: 'A Bíblia Muda a Vida das Pessoas',
      duracao: '6:15',
      categoria: 'Testemunhos',
      destaque: 'Ótimo para céticos'
    },
    {
      titulo: 'O Que É o Reino de Deus?',
      duracao: '2:47',
      categoria: 'Doutrina',
      destaque: 'Explicação clara e simples'
    }
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6 pt-12 pb-6 sticky top-0 z-10">
        <button onClick={onClose} className="flex items-center gap-2 mb-4 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span>Início</span>
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-8 h-8" />
          <div>
            <h1 className="text-2xl">Vídeos</h1>
            <p className="text-sm opacity-90">Novembro 2025</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-32">
        {/* Resumo do Mês */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-indigo-900">
              🎬 Excelente uso de recursos!
            </h3>
            <p className="text-gray-700">
              Você mostrou <strong>8 vídeos</strong> este mês, usando ferramentas visuais para ensinar verdades bíblicas.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-600">Este mês</p>
                <p className="text-2xl text-indigo-600">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mês anterior</p>
                <p className="text-2xl text-gray-400">6</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +2 (+33%) ↗️
              </Badge>
            </div>
          </div>
        </Card>

        {/* Vídeos Mais Utilizados */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2">
            <Play className="w-5 h-5 text-indigo-600" />
            Vídeos Mais Utilizados
          </h3>
          
          {videosMaisUsados.map((video, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg bg-${video.cor}-100 flex items-center justify-center flex-shrink-0`}>
                  <Play className={`w-6 h-6 text-${video.cor}-700`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="line-clamp-2">{video.titulo}</h4>
                      <p className="text-xs text-gray-600 mt-1">{video.categoria} • {video.duracao}</p>
                    </div>
                    <Badge variant="secondary" className={`bg-${video.cor}-100 text-${video.cor}-700 flex-shrink-0`}>
                      {video.exibicoes}x
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Exibições:</strong> {video.exibicoes} {video.exibicoes === 1 ? 'vez' : 'vezes'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Pessoas: {video.pessoas.join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Reações positivas</span>
                    </div>
                    
                    {video.destaque && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-900">{video.destaque}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      <Play className="w-3 h-3 mr-1" />
                      Ver Novamente
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Vídeos por Categoria */}
        <Card className="p-6">
          <h3 className="mb-4">Vídeos por Categoria</h3>
          
          <div className="space-y-3 mb-4">
            {categorias.map((cat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-sm">{cat.nome}</span>
                  </div>
                  <span className="text-sm font-medium">{cat.quantidade} ({cat.percentual}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${cat.cor}-600 h-2 rounded-full`}
                    style={{ width: `${cat.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
            💡 Você usa principalmente vídeos motivacionais. Boa estratégia para interessados!
          </p>
        </Card>

        {/* Contexto de Exibição */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <h3 className="mb-4 text-green-900">Contexto de Exibição</h3>
          
          <div className="space-y-3">
            {contextos.map((contexto, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{contexto.nome}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {contexto.quantidade} ({contexto.percentual}%)
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 italic">"{contexto.descricao}"</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Reações e Follow-up */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="mb-4 text-blue-900">Reações e Follow-up</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">😊</p>
              <p className="text-xl text-green-600">7</p>
              <p className="text-xs text-gray-600">Positivas<br />88%</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">😐</p>
              <p className="text-xl text-gray-400">1</p>
              <p className="text-xs text-gray-600">Neutras<br />12%</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl">😞</p>
              <p className="text-xl text-gray-300">0</p>
              <p className="text-xs text-gray-600">Negativas<br />0%</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-3 bg-white rounded">
              <span className="text-xl">✨</span>
              <span><strong>2 pessoas</strong> iniciaram estudo após assistir</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded">
              <span className="text-xl">🎥</span>
              <span><strong>3 pessoas</strong> pediram mais vídeos</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded">
              <span className="text-xl">📖</span>
              <span><strong>2 pessoas</strong> aceitaram publicação relacionada</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-purple-100 border-2 border-purple-300 rounded-lg">
            <p className="text-sm text-purple-900 text-center">
              <strong className="text-lg">🎉 Destaque:</strong>
              <br />
              <strong>25% dos vídeos resultaram em novos estudos bíblicos!</strong>
              <br />
              <span className="text-xs">Excelente taxa de conversão 🎯</span>
            </p>
          </div>
        </Card>

        {/* Sugestões de Vídeos */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <h3 className="mb-4 text-orange-900">
            💡 Vídeos Populares que Você Ainda Não Usou
          </h3>
          
          <div className="space-y-3">
            {videosSugeridos.map((video, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-2">{video.titulo}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {video.categoria} • {video.duracao}
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      ⭐ {video.destaque}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            Ver Catálogo Completo (JW.org)
          </Button>
        </Card>

        {/* Comparação Mensal */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Evolução Mensal
          </h3>
          
          <div className="flex items-end justify-between h-32">
            {[
              { mes: 'Jun', valor: 3 },
              { mes: 'Jul', valor: 4 },
              { mes: 'Ago', valor: 5 },
              { mes: 'Set', valor: 6 },
              { mes: 'Out', valor: 6 },
              { mes: 'Nov', valor: 8 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                  <div 
                    className={`w-8 ${idx === 5 ? 'bg-indigo-600' : 'bg-indigo-300'} rounded-t`}
                    style={{ height: `${(item.valor / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{item.mes}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-700 text-center pt-2">
            <TrendingUp className="w-4 h-4 inline text-green-600" />
            {' '}Aumento constante no uso de vídeos: <strong className="text-green-600">+100%</strong> em 6 meses 📈
          </p>
        </Card>
      </div>

      {/* Botões de Ação Fixos */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
          <Video className="w-4 h-4 mr-2" />
          Registrar Novo Vídeo
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            📚 Catálogo
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            📊 Histórico
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            💾 Baixar
          </Button>
        </div>
      </div>
    </div>
  );
}