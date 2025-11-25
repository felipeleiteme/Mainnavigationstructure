import { useState, useEffect } from 'react';
import { Sprout, BookOpen, Heart, Target, Settings, Plus, TrendingUp, Calendar, CheckCircle2, Clock, Sparkles, ChevronRight, Book, Dice6 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { DataService } from '../../services/dataService';
import LeituraBibliaPage from '../pages/LeituraBibliaPage';
import DiarioGratidaoPage from '../pages/DiarioGratidaoPage';
import AlvosEspirituaisPage from '../pages/AlvosEspirituaisPage';
import ConfiguracoesLeituraPage from '../pages/ConfiguracoesLeituraPage';
import NovaGratidaoPage from '../pages/NovaGratidaoPage';
import NovoAlvoPage from '../pages/NovoAlvoPage';
import { carregarDados, calcularProgresso, obterProximaLeitura } from '../../utils/storage/leituraStorage';

interface GratidaoEntry {
  id: string;
  data: string;
  texto: string;
}

type PaginaEspiritual = 
  | 'home' 
  | 'leitura-biblia' 
  | 'diario-gratidao' 
  | 'alvos-espirituais' 
  | 'configuracoes-leitura'
  | 'nova-gratidao'
  | 'novo-alvo';

export default function EspiritualTab() {
  const [paginaAtual, setPaginaAtual] = useState<PaginaEspiritual>('home');
  
  // Buscar dados de leitura real
  const [dadosLeitura, setDadosLeitura] = useState(carregarDados());

  // Diário de Gratidão
  const [gratidaoEntries, setGratidaoEntries] = useState<GratidaoEntry[]>([]);

  // Buscar alvos ativos do DataService
  const alvosAtivos = DataService.getAlvosAtivos();

  // Load gratidão entries from localStorage
  useEffect(() => {
    const gratidaoSaved = localStorage.getItem('diarioGratidao');
    if (gratidaoSaved) {
      setGratidaoEntries(JSON.parse(gratidaoSaved));
    }
  }, []);

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

  // Função para salvar nova gratidão
  const handleSalvarGratidao = (data: string, texto: string) => {
    const novaEntry: GratidaoEntry = {
      id: Date.now().toString(),
      data: data,
      texto: texto,
    };

    const updatedEntries = [novaEntry, ...gratidaoEntries];
    setGratidaoEntries(updatedEntries);
    localStorage.setItem('diarioGratidao', JSON.stringify(updatedEntries));
  };

  // Função para salvar novo alvo
  const handleSalvarAlvo = (titulo: string, meta: string, prazo: string) => {
    DataService.adicionarAlvo({
      titulo,
      tipo: 'outro', // Tipo padrão
      descricao: meta,
      prazo: prazo || new Date().toISOString().split('T')[0],
      progresso: 0,
    });
  };

  // Navegação: Se não estiver na home, mostrar a página correspondente
  if (paginaAtual === 'leitura-biblia') {
    return <LeituraBibliaPage 
      onVoltar={() => {
        setDadosLeitura(carregarDados()); // Atualizar dados ao voltar
        setPaginaAtual('home');
      }} 
      onAbrirConfiguracoes={() => setPaginaAtual('configuracoes-leitura')}
    />;
  }

  if (paginaAtual === 'diario-gratidao') {
    return <DiarioGratidaoPage 
      onVoltar={() => setPaginaAtual('home')} 
      onAbrirNovaGratidao={() => setPaginaAtual('nova-gratidao')}
    />;
  }

  if (paginaAtual === 'alvos-espirituais') {
    return <AlvosEspirituaisPage 
      onVoltar={() => setPaginaAtual('home')} 
      onAbrirNovoAlvo={() => setPaginaAtual('novo-alvo')}
    />;
  }

  if (paginaAtual === 'configuracoes-leitura') {
    return <ConfiguracoesLeituraPage onVoltar={() => {
      setDadosLeitura(carregarDados()); // Atualizar dados ao voltar
      setPaginaAtual('leitura-biblia');
    }} />;
  }

  if (paginaAtual === 'nova-gratidao') {
    return <NovaGratidaoPage 
      onVoltar={() => setPaginaAtual('diario-gratidao')} 
      onSalvar={handleSalvarGratidao}
    />;
  }

  if (paginaAtual === 'novo-alvo') {
    return <NovoAlvoPage 
      onVoltar={() => setPaginaAtual('alvos-espirituais')} 
      onSalvar={handleSalvarAlvo}
    />;
  }

  return (
    <div className="min-h-full bg-neutral">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-primary-500 text-white">
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7" />
            <div>
              <h2 className="text-xl">Preparando o Solo</h2>
              <p className="text-xs text-primary-100">Sua base espiritual para jogar sementes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4 pb-24">
        {/* Card 1: Leitura da Bíblia - CLICÁVEL */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-white border-primary-100"
          onClick={() => setPaginaAtual('leitura-biblia')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-primary-700">
              <Book className="w-5 h-5 text-primary-600" />
              Leitura da Bíblia
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          {!dadosLeitura.configurado ? (
            // Empty State: Não configurado
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-50">
                  <Book className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Configure seu plano de leitura
              </p>
              <p className="text-xs text-gray-500">
                Acompanhe seu progresso espiritual
              </p>
            </div>
          ) : (
            // Estado Configurado: Mostrar progresso
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Plano de Leitura 2025</span>
                  <span className="text-sm text-primary-700">{calcularProgresso(dadosLeitura)}%</span>
                </div>
                <Progress value={calcularProgresso(dadosLeitura)} className="h-2 bg-primary-100" />
              </div>
              
              {dadosLeitura.configuracao && (
                <>
                  <div className="p-4 rounded-lg bg-primary-50 border-2 border-primary-200">
                    <p className="text-sm text-gray-600 mb-2">Próxima leitura:</p>
                    <p className="text-lg text-primary-700">
                      {(() => {
                        const proxima = obterProximaLeitura(dadosLeitura.configuracao.plano, dadosLeitura.capitulosLidos);
                        return `${proxima.livro} ${proxima.capitulo}`;
                      })()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge className="bg-primary-600 text-white border-0">{dadosLeitura.ofensiva.atual} dias</Badge>
                    <span>de ofensiva</span>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Card 2: Diário de Gratidão - CLICÁVEL */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-white border-primary-100"
          onClick={() => setPaginaAtual('diario-gratidao')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-primary-700">
              <Heart className="w-5 h-5 text-primary-600" />
              Diário de Gratidão
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          {gratidaoEntries.length === 0 ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-50">
                  <Heart className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Comece registrando pelo que você é grato hoje
              </p>
              <p className="text-xs text-gray-500">
                Cultivar gratidão fortalece sua espiritualidade
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {gratidaoEntries.slice(0, 2).map((entry) => (
                <div key={entry.id} className="p-3 rounded-lg bg-primary-50 border-2 border-primary-200">
                  <p className="text-xs text-gray-600 mb-1">
                    {new Date(entry.data).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-800 line-clamp-2">{entry.texto}</p>
                </div>
              ))}
              {gratidaoEntries.length > 2 && (
                <p className="text-xs text-gray-600 text-center pt-2">
                  +{gratidaoEntries.length - 2} {gratidaoEntries.length - 2 === 1 ? 'entrada' : 'entradas'}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Card 3: Alvos Espirituais - CLICÁVEL */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-white border-primary-100"
          onClick={() => setPaginaAtual('alvos-espirituais')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-primary-700">
              <Target className="w-5 h-5 text-primary-600" />
              Alvos Espirituais
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          {alvosAtivos.length === 0 ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-50">
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Estabeleça seus alvos espirituais
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alvosAtivos.slice(0, 2).map((alvo, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-primary-50 border-2 border-primary-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-700">{alvo.titulo}</span>
                    <span className="text-xs text-primary-600">{alvo.progresso}%</span>
                  </div>
                  <Progress value={alvo.progresso} className="h-2 bg-primary-100" />
                </div>
              ))}
              {alvosAtivos.length > 2 && (
                <p className="text-xs text-gray-600 text-center pt-2">
                  +{alvosAtivos.length - 2} {alvosAtivos.length - 2 === 1 ? 'alvo' : 'alvos'}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Card 4: Ideias para Adoração - NÃO CLICÁVEL */}
        <Card className="p-6 bg-white border-primary-100">
          <h3 className="flex items-center gap-2 mb-4 text-primary-700">
            <Sparkles className="w-5 h-5 text-secondary-600" />
            Sem ideias para a adoração?
          </h3>
          
          <div className="p-4 rounded-lg mb-3 bg-secondary-50 border-2 border-secondary-300">
            <p className="text-sm text-center text-secondary-800">
              "{ideiaAtual}"
            </p>
          </div>
          
          <Button 
            className="w-full hover:opacity-90 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2 border-0"
            onClick={gerarNovaIdeia}
          >
            <Dice6 className="w-5 h-5" />
            Sugerir uma Ideia
          </Button>
        </Card>
      </div>
    </div>
  );
}