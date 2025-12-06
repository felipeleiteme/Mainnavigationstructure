import { useState, useEffect } from 'react';
import { Sprout, BookOpen, Heart, Target, Settings, Plus, TrendingUp, Calendar, CheckCircle2, Clock, Sparkles, ChevronRight, Book, Dice6 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { DataService, Alvo } from '../../services/dataService';
import { ThemeService } from '@/services/themeService';
import LeituraBibliaPage from '../pages/LeituraBibliaPage';
import DiarioGratidaoPage from '../pages/DiarioGratidaoPage';
import AlvosEspirituaisPage from '../pages/AlvosEspirituaisPage';
import ConfiguracoesLeituraPage from '../pages/ConfiguracoesLeituraPage';
import NovaGratidaoPage from '../pages/NovaGratidaoPage';
import NovoAlvoPage from '../pages/NovoAlvoPage';
import EditarAlvoPage from '../pages/EditarAlvoPage';
import { carregarDados, calcularProgresso, obterProximaLeitura } from '../../utils/storage/leituraStorage';
import { useTranslations } from '../../utils/i18n/translations';

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
  | 'novo-alvo'
  | 'editar-alvo'
  | 'editar-gratidao';

export default function EspiritualTab() {
  const [paginaAtual, setPaginaAtual] = useState<PaginaEspiritual>('home');
  const [alvoEditando, setAlvoEditando] = useState<Alvo | undefined>();
  const [gratidaoEditando, setGratidaoEditando] = useState<GratidaoEntry | undefined>();
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  
  // Hook de traduções
  const t = useTranslations();

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Buscar dados de leitura real
  const [dadosLeitura, setDadosLeitura] = useState(carregarDados());

  // Diário de Gratidão
  const [gratidaoEntries, setGratidaoEntries] = useState<GratidaoEntry[]>([]);

  // Buscar alvos ativos do DataService
  const [alvosAtivos, setAlvosAtivos] = useState(DataService.getAlvosAtivos());

  // Load gratidão entries from localStorage
  useEffect(() => {
    const loadGratidao = () => {
      const gratidaoSaved = localStorage.getItem('diarioGratidao');
      if (gratidaoSaved) {
        setGratidaoEntries(JSON.parse(gratidaoSaved));
      }
    };
    
    const loadLeitura = () => {
      setDadosLeitura(carregarDados());
    };
    
    const loadAlvos = () => {
      setAlvosAtivos(DataService.getAlvosAtivos());
    };
    
    loadGratidao();
    loadLeitura();
    loadAlvos();
    
    // Escutar mudanças de dados
    const handleDataChange = () => {
      loadGratidao();
      loadLeitura();
      loadAlvos();
    };
    
    window.addEventListener('mynis-data-change', handleDataChange);
    return () => window.removeEventListener('mynis-data-change', handleDataChange);
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
  const handleSalvarGratidao = (data: string, texto: string, id?: string) => {
    if (id) {
      // Editar entrada existente
      const updatedEntries = gratidaoEntries.map(entry => 
        entry.id === id ? { ...entry, data, texto } : entry
      );
      setGratidaoEntries(updatedEntries);
      localStorage.setItem('diarioGratidao', JSON.stringify(updatedEntries));
    } else {
      // Nova entrada
      const novaEntry: GratidaoEntry = {
        id: Date.now().toString(),
        data: data,
        texto: texto,
      };

      const updatedEntries = [novaEntry, ...gratidaoEntries];
      setGratidaoEntries(updatedEntries);
      localStorage.setItem('diarioGratidao', JSON.stringify(updatedEntries));
    }
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
      onEditarGratidao={(entry) => {
        setGratidaoEditando(entry);
        setPaginaAtual('editar-gratidao');
      }}
    />;
  }

  if (paginaAtual === 'alvos-espirituais') {
    return <AlvosEspirituaisPage 
      onVoltar={() => setPaginaAtual('home')} 
      onAbrirNovoAlvo={() => setPaginaAtual('novo-alvo')}
      onEditarAlvo={(alvo) => {
        setAlvoEditando(alvo);
        setPaginaAtual('editar-alvo');
      }}
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

  if (paginaAtual === 'editar-alvo') {
    return alvoEditando ? (
      <EditarAlvoPage 
        alvo={alvoEditando}
        onVoltar={() => setPaginaAtual('alvos-espirituais')} 
      />
    ) : null;
  }

  if (paginaAtual === 'editar-gratidao') {
    return <NovaGratidaoPage 
      onVoltar={() => setPaginaAtual('diario-gratidao')} 
      onSalvar={handleSalvarGratidao}
      entryEditando={gratidaoEditando}
    />;
  }

  return (
    <div 
      className="min-h-full" 
      style={{ 
        backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' 
      }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-50 text-white" 
        style={{ 
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' 
        }}
      >
        <div className="px-6 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold">{t.spiritualTab.onboardingTitle}</h1>
              <p className="text-sm text-primary-100">{t.spiritualTab.onboardingSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 pb-24">
        {/* Card 1: Leitura da Bíblia - CLICÁVEL */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-0"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
          }}
          onClick={() => setPaginaAtual('leitura-biblia')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <Book 
                className="w-5 h-5" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                }}
              />
              {t.spiritualTab.bibleReadingTitle}
            </h3>
            <ChevronRight 
              className="w-5 h-5" 
              style={{
                color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF'
              }}
            />
          </div>
          
          {!dadosLeitura.configurado ? (
            // Empty State: Não configurado
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : 'rgba(74, 44, 96, 0.1)'
                  }}
                >
                  <Book 
                    className="w-8 h-8" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                    }}
                  />
                </div>
              </div>
              <p 
                className="text-sm mb-2"
                style={{
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                }}
              >
                {t.spiritualTab.bibleReadingSetup}
              </p>
              <p 
                className="text-xs"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.spiritualTab.bibleReadingTrack}
              </p>
            </div>
          ) : (
            // Estado Configurado: Mostrar progresso
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-sm" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
                    }}
                  >
                    Plano de Leitura 2025
                  </span>
                  <span 
                    className="text-sm" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                    }}
                  >
                    {calcularProgresso(dadosLeitura)}%
                  </span>
                </div>
                <Progress value={calcularProgresso(dadosLeitura)} className="h-2 bg-primary-100" />
              </div>
              
              {dadosLeitura.configuracao && (
                <>
                  <div 
                    className="p-4 rounded-lg border-2"
                    style={{
                      backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)',
                      borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#D8CEE8'
                    }}
                  >
                    <p 
                      className="text-sm mb-2" 
                      style={{ 
                        color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
                      }}
                    >
                      Próxima leitura:
                    </p>
                    <p 
                      className="text-lg" 
                      style={{ 
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                      }}
                    >
                      {(() => {
                        const proxima = obterProximaLeitura(dadosLeitura.configuracao.plano, dadosLeitura.capitulosLidos);
                        return `${proxima.livro} ${proxima.capitulo}`;
                      })()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Badge 
                      className="border-0" 
                      style={{ 
                        backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                        color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                      }}
                    >
                      {dadosLeitura.ofensiva.atual} dias
                    </Badge>
                    <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>de ofensiva</span>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* Card 2: Diário de Gratidão - CLICÁVEL */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-0"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
          }}
          onClick={() => setPaginaAtual('diario-gratidao')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <Heart 
                className="w-5 h-5" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                }}
              />
              {t.spiritualTab.gratitudeTitle}
            </h3>
            <ChevronRight 
              className="w-5 h-5" 
              style={{
                color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF'
              }}
            />
          </div>
          
          {gratidaoEntries.length === 0 ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : 'rgba(74, 44, 96, 0.1)'
                  }}
                >
                  <Heart 
                    className="w-8 h-8" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                    }}
                  />
                </div>
              </div>
              <p 
                className="text-sm mb-2"
                style={{
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                }}
              >
                {t.spiritualTab.gratitudeStart}
              </p>
              <p 
                className="text-xs"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.spiritualTab.gratitudeStrength}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {gratidaoEntries.slice(0, 2).map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-3 rounded-lg border-2"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)',
                    borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#D8CEE8'
                  }}
                >
                  <p 
                    className="text-xs mb-1" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
                    }}
                  >
                    {new Date(entry.data).toLocaleDateString('pt-BR')}
                  </p>
                  <p 
                    className="text-sm line-clamp-2" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#D1D5DB' : '#1F2937' 
                    }}
                  >
                    {entry.texto}
                  </p>
                </div>
              ))}
              {gratidaoEntries.length > 2 && (
                <p 
                  className="text-xs text-center pt-2" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
                  }}
                >
                  +{gratidaoEntries.length - 2} {gratidaoEntries.length - 2 === 1 ? 'entrada' : 'entradas'}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Card 3: Alvos Espirituais - CLICÁVEL */}
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-0"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
          }}
          onClick={() => setPaginaAtual('alvos-espirituais')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="flex items-center gap-2"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              <Target 
                className="w-5 h-5" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                }}
              />
              {t.spiritualTab.goalsTitle}
            </h3>
            <ChevronRight 
              className="w-5 h-5" 
              style={{
                color: temaAtual === 'escuro' ? '#6B7280' : '#9CA3AF'
              }}
            />
          </div>
          
          {alvosAtivos.length === 0 ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-3">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.15)' : 'rgba(74, 44, 96, 0.1)'
                  }}
                >
                  <Target 
                    className="w-8 h-8" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                    }}
                  />
                </div>
              </div>
              <p 
                className="text-sm"
                style={{
                  color: temaAtual === 'escuro' ? '#D1D5DB' : '#4B5563'
                }}
              >
                {t.spiritualTab.goalsEstablish}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alvosAtivos.slice(0, 2).map((alvo, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)',
                    borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#D8CEE8'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-sm" 
                      style={{ 
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                      }}
                    >
                      {alvo.titulo}
                    </span>
                    <span 
                      className="text-xs" 
                      style={{ 
                        color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
                      }}
                    >
                      {alvo.progresso}%
                    </span>
                  </div>
                  <Progress value={alvo.progresso} className="h-2 bg-primary-100" />
                </div>
              ))}
              {alvosAtivos.length > 2 && (
                <p 
                  className="text-xs text-center pt-2" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' 
                  }}
                >
                  +{alvosAtivos.length - 2} {alvosAtivos.length - 2 === 1 ? 'alvo' : 'alvos'}
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Card 4: Ideias para Adoração - NÃO CLICÁVEL */}
        <Card className="p-6 bg-white border-primary-100">
          <h3 
            className="flex items-center gap-2 mb-4"
            style={{
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
            }}
          >
            <Sparkles 
              className="w-5 h-5" 
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' 
              }}
            />
            {t.spiritualTab.worshipIdeasTitle}
          </h3>
          
          <div 
            className="p-4 rounded-lg mb-3 border-2"
            style={{
              backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(200, 224, 70, 0.2)',
              borderColor: '#C8E046'
            }}
          >
            <p 
              className="text-sm text-center"
              style={{
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              "{ideiaAtual}"
            </p>
          </div>
          
          <Button 
            className="w-full hover:opacity-90 text-white flex items-center justify-center gap-2 border-0"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
            }}
            onClick={gerarNovaIdeia}
          >
            <Dice6 className="w-5 h-5" />
            {t.spiritualTab.suggestIdea}
          </Button>
        </Card>
      </div>
    </div>
  );
}