import { Heart, Book, Calendar, Target, Lightbulb, Dice6, Pencil, Flame, X, Mic } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { DataService } from '../../services/dataService';
import TemaDoMes from '../tema-mes/TemaDoMes';
import { getQualidadeMes } from '../../data/qualidades';

interface ReflexaoEntry {
  data: string;
  capitulo: string;
  aprendizado: string;
  aplicacao: string;
  palavra: string;
}

export default function EspiritualTab() {
  const [showReflexao, setShowReflexao] = useState(false);
  const [reflexaoAtual, setReflexaoAtual] = useState({
    aprendizado: '',
    aplicacao: '',
    palavra: '',
  });
  const [diarioEntries, setDiarioEntries] = useState<ReflexaoEntry[]>([]);
  
  // Buscar ofensiva de leitura do DataService (dados reais)
  const [ofensivaLeitura, setOfensivaLeitura] = useState(DataService.getOfensivaLeitura());
  
  const [showNovoAlvo, setShowNovoAlvo] = useState(false);
  const [novoAlvo, setNovoAlvo] = useState({ titulo: '', meta: '', prazo: '' });
  const [showHistorico, setShowHistorico] = useState(false);
  const [showTemaDoMes, setShowTemaDoMes] = useState(false);

  // Buscar alvos ativos do DataService
  const alvosAtivos = DataService.getAlvosAtivos();
  
  // Buscar qualidade do mês
  const qualidadeMes = getQualidadeMes();

  // Load diario entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('diarioEspiritual');
    if (saved) {
      setDiarioEntries(JSON.parse(saved));
    }
  }, []);

  const handleMarcarComoLido = () => {
    // Mostrar toast de confirmação
    toast.success('Parabéns! Mais um dia de leitura ✅', {
      duration: 2000,
      description: 'Continue firme nessa jornada!',
    });

    // Atualizar ofensiva
    setOfensivaLeitura(ofensivaLeitura + 1);

    // Mostrar mini-card de reflexão após 500ms
    setTimeout(() => {
      setShowReflexao(true);
    }, 500);
  };

  const handleSalvarReflexao = () => {
    const novaEntry: ReflexaoEntry = {
      data: new Date().toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      }),
      capitulo: 'Lucas 10',
      aprendizado: reflexaoAtual.aprendizado,
      aplicacao: reflexaoAtual.aplicacao,
      palavra: reflexaoAtual.palavra,
    };

    const updatedEntries = [novaEntry, ...diarioEntries];
    setDiarioEntries(updatedEntries);
    localStorage.setItem('diarioEspiritual', JSON.stringify(updatedEntries));

    toast.success('Que reflexão linda! 💚', {
      description: 'Salva no seu Diário Espiritual',
    });
    setShowReflexao(false);
    setReflexaoAtual({ aprendizado: '', aplicacao: '', palavra: '' });
  };

  const handlePularReflexao = () => {
    setShowReflexao(false);
    setReflexaoAtual({ aprendizado: '', aplicacao: '', palavra: '' });
  };

  const ideiasAdoracao = [
    'Ler um anuário antigo',
    'Ensaiar cânticos novos',
    'Entrevistar alguém da família',
    'Assistir biografia de servo fiel',
    'Estudar profecia bíblica',
    'Fazer pesquisa sobre nome bíblico',
    'Assistir vídeo de experiência',
    'Estudar um costume bíblico',
    'Preparar uma apresentação',
    'Pesquisar sobre um país',
  ];

  const [ideiaAtual, setIdeiaAtual] = useState(ideiasAdoracao[0]);

  const gerarNovaIdeia = () => {
    const randomIndex = Math.floor(Math.random() * ideiasAdoracao.length);
    setIdeiaAtual(ideiasAdoracao[randomIndex]);
  };

  const leituraRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8" />
          <div>
            <h1 className="text-2xl">Preparando o Solo</h1>
            <p className="text-sm opacity-90">Sua base espiritual para jogar sementes</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Card: Tema do Mês */}
        <Card 
          className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowTemaDoMes(true)}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">{qualidadeMes.emoji}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Este mês, cultive:</p>
              <h3 className="text-xl mb-2 text-blue-900">{qualidadeMes.nome}</h3>
              <p className="text-sm text-gray-700 italic">
                "{qualidadeMes.versiculo.texto}"
              </p>
              <p className="text-xs text-gray-600 mt-1">— {qualidadeMes.versiculo.referencia}</p>
            </div>
          </div>
        </Card>

        {/* Card: Ofensiva de Leitura */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Ofensiva de Leitura
            </h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              🔥 {ofensivaLeitura} dias
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Continue firme! Mantenha sua sequência de leitura diária.
          </p>
        </Card>

        {/* Card: Leitura da Bíblia (com ref para scroll) */}
        <div ref={leituraRef} className="transition-all duration-300">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600" />
                Leitura da Bíblia
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Plano de Leitura 2025</span>
                  <span className="text-sm">23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Próxima leitura:</p>
                <p className="text-lg text-blue-900">Lucas 10:1-24</p>
                <Button 
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                  onClick={handleMarcarComoLido}
                >
                  Marcar como Lido
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Ver Calendário</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Mini-card de Reflexão */}
        {showReflexao && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-300 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Que tal refletir um pouco?</h3>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handlePularReflexao}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block flex items-center gap-2">
                  💭 O que você aprendeu sobre Jeová?
                </label>
                <Textarea
                  placeholder="Escreva sua reflexão..."
                  value={reflexaoAtual.aprendizado}
                  onChange={(e) => setReflexaoAtual({ 
                    ...reflexaoAtual, 
                    aprendizado: e.target.value 
                  })}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block flex items-center gap-2">
                  ✨ Como pode aplicar isso?
                </label>
                <Textarea
                  placeholder="Escreva sua aplicação..."
                  value={reflexaoAtual.aplicacao}
                  onChange={(e) => setReflexaoAtual({ 
                    ...reflexaoAtual, 
                    aplicacao: e.target.value 
                  })}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block flex items-center gap-2">
                  📝 Alguma palavra ou expressão nova?
                </label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite aqui..."
                    value={reflexaoAtual.palavra}
                    onChange={(e) => setReflexaoAtual({ 
                      ...reflexaoAtual, 
                      palavra: e.target.value 
                    })}
                    className="resize-none flex-1"
                    rows={2}
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-auto"
                    title="Usar voz (em breve)"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handlePularReflexao}
                >
                  Pular
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSalvarReflexao}
                  disabled={!reflexaoAtual.aprendizado && !reflexaoAtual.aplicacao && !reflexaoAtual.palavra}
                >
                  Salvar Reflexão
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Diário Espiritual */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-green-600" />
              Diário Espiritual
            </h3>
          </div>
          
          {diarioEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✨</div>
              <p className="text-sm text-gray-600 mb-2">
                Suas reflexões aparecerão aqui
              </p>
              <p className="text-xs text-gray-500">
                Comece marcando uma leitura da Bíblia
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {diarioEntries.slice(0, 3).map((entry, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{entry.data}</span>
                    <span className="text-xs text-gray-600">{entry.capitulo}</span>
                  </div>
                  {entry.aprendizado && (
                    <p className="text-sm text-gray-700 mb-1">
                      💭 {entry.aprendizado}
                    </p>
                  )}
                  {entry.aplicacao && (
                    <p className="text-sm text-gray-700 mb-1">
                      ✨ {entry.aplicacao}
                    </p>
                  )}
                  {entry.palavra && (
                    <p className="text-sm text-gray-700">
                      📝 {entry.palavra}
                    </p>
                  )}
                </div>
              ))}
              
              {diarioEntries.length > 3 && (
                <Button variant="ghost" className="w-full text-sm" onClick={() => setShowHistorico(true)}>
                  Ver Todo o Histórico ({diarioEntries.length} entradas)
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* Alvos Espirituais */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Alvos Espirituais
            </h3>
            <Button variant="outline" size="sm" onClick={() => setShowNovoAlvo(true)}>+ Novo Alvo</Button>
          </div>
          
          <div className="space-y-3">
            {alvosAtivos.map((alvo, idx) => (
              <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{alvo.titulo}</span>
                  <span className="text-xs text-purple-700">{alvo.progresso}%</span>
                </div>
                <Progress value={alvo.progresso} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">Em andamento</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recursos de Treinamento */}
        <Card className="p-6">
          <h3 className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Recursos de Treinamento
          </h3>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { titulo: 'Ferro a Fio', status: 'Em progresso', cor: 'blue' },
              { titulo: 'Apresentações Curtas', status: 'Não iniciado', cor: 'gray' },
              { titulo: 'Curso de Ensino', status: 'Concluído', cor: 'green' },
            ].map((recurso, idx) => (
              <div key={idx} className="flex-shrink-0 w-40 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm mb-2">{recurso.titulo}</p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    recurso.cor === 'blue' ? 'bg-blue-100 text-blue-700' :
                    recurso.cor === 'green' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {recurso.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Ideias para Adoração em Família */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <h3 className="flex items-center gap-2 mb-4">
            <Dice6 className="w-5 h-5 text-yellow-600" />
            Sem ideias para a adoração?
          </h3>
          
          <div className="p-4 bg-white rounded-lg border border-yellow-300 mb-3">
            <p className="text-sm text-center text-gray-700">
              "{ideiaAtual}"
            </p>
          </div>
          
          <Button 
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            onClick={gerarNovaIdeia}
          >
            🎲 Sugerir uma Ideia
          </Button>
        </Card>
      </div>

      {/* Modal: Novo Alvo */}
      {showNovoAlvo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-purple-700 text-white px-6 pt-6 pb-4 z-10">
              <div className="flex items-start justify-between">
                <h2 className="text-xl">Novo Alvo Espiritual</h2>
                <button 
                  onClick={() => {
                    setShowNovoAlvo(false);
                    setNovoAlvo({ titulo: '', meta: '', prazo: '' });
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm mb-2">Qual seu alvo?</label>
                <input
                  type="text"
                  placeholder="Ex: Ler toda a Bíblia"
                  value={novoAlvo.titulo}
                  onChange={(e) => setNovoAlvo({...novoAlvo, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Meta (opcional):</label>
                <input
                  type="text"
                  placeholder="Ex: 3 capítulos por dia"
                  value={novoAlvo.meta}
                  onChange={(e) => setNovoAlvo({...novoAlvo, meta: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Prazo (opcional):</label>
                <input
                  type="date"
                  value={novoAlvo.prazo}
                  onChange={(e) => setNovoAlvo({...novoAlvo, prazo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNovoAlvo(false);
                  setNovoAlvo({ titulo: '', meta: '', prazo: '' });
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  if (novoAlvo.titulo.trim()) {
                    toast.success('Alvo criado! 🎯', {
                      description: 'Boa sorte nessa jornada!',
                    });
                    setShowNovoAlvo(false);
                    setNovoAlvo({ titulo: '', meta: '', prazo: '' });
                  }
                }}
                disabled={!novoAlvo.titulo.trim()}
              >
                Criar Alvo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Histórico Completo */}
      {showHistorico && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 text-white px-6 pt-6 pb-4 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl">Histórico Completo</h2>
                  <p className="text-sm opacity-90">{diarioEntries.length} entradas</p>
                </div>
                <button 
                  onClick={() => setShowHistorico(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-3">
              {diarioEntries.map((entry, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{entry.data}</span>
                    <span className="text-xs text-gray-600">{entry.capitulo}</span>
                  </div>
                  {entry.aprendizado && (
                    <p className="text-sm text-gray-700 mb-1">
                      💭 {entry.aprendizado}
                    </p>
                  )}
                  {entry.aplicacao && (
                    <p className="text-sm text-gray-700 mb-1">
                      ✨ {entry.aplicacao}
                    </p>
                  )}
                  {entry.palavra && (
                    <p className="text-sm text-gray-700">
                      📝 {entry.palavra}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => setShowHistorico(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tema do Mês */}
      {showTemaDoMes && (
        <TemaDoMes onClose={() => setShowTemaDoMes(false)} />
      )}
    </div>
  );
}