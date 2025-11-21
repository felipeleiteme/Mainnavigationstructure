import { useState } from 'react';
import { ArrowLeft, BookOpen, Sprout, FileText, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataService } from '../../services/dataService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EstatisticasPageProps {
  onVoltar: () => void;
}

type TabCategoria = 'estudos' | 'revisitas' | 'publicacoes' | 'videos';

export default function EstatisticasPage({ onVoltar }: EstatisticasPageProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<TabCategoria>('estudos');

  // Buscar dados do DataService
  const estudos = DataService.getEstudosBiblicos();
  const revisitas = DataService.getRevisitas();
  const sessoes = DataService.getSessoes();
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  // Calcular estatísticas
  const totalEstudos = estudos.length;
  const totalRevisitasNovas = revisitas.filter(r => {
    const dataAdicao = new Date(r.dataAdicao);
    const mesRevisita = `${dataAdicao.getFullYear()}-${String(dataAdicao.getMonth() + 1).padStart(2, '0')}`;
    return mesRevisita === mesAtual;
  }).length;

  const totalPublicacoes = sessoes
    .filter(s => s.data.startsWith(mesAtual))
    .reduce((acc, s) => acc + (s.publicacoes?.reduce((sum, p) => sum + p.quantidade, 0) || 0), 0);

  const totalVideos = sessoes
    .filter(s => s.data.startsWith(mesAtual))
    .reduce((acc, s) => acc + (s.videos?.length || 0), 0);

  // Dados para gráficos (últimos 4 meses)
  const getUltimos4Meses = () => {
    const meses = [];
    for (let i = 3; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
        mesCompleto: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`,
      });
    }
    return meses;
  };

  const meses = getUltimos4Meses();

  // Dados para cada categoria
  const dadosEstudos = meses.map(m => ({
    mes: m.mes,
    total: estudos.filter(e => e.data.startsWith(m.mesCompleto)).length,
  }));

  const dadosRevisitas = meses.map(m => ({
    mes: m.mes,
    total: revisitas.filter(r => {
      const dataAdicao = new Date(r.dataAdicao);
      const mesRevisita = `${dataAdicao.getFullYear()}-${String(dataAdicao.getMonth() + 1).padStart(2, '0')}`;
      return mesRevisita === m.mesCompleto;
    }).length,
  }));

  const dadosPublicacoes = meses.map(m => ({
    mes: m.mes,
    total: sessoes
      .filter(s => s.data.startsWith(m.mesCompleto))
      .reduce((acc, s) => acc + (s.publicacoes?.reduce((sum, p) => sum + p.quantidade, 0) || 0), 0),
  }));

  const dadosVideos = meses.map(m => ({
    mes: m.mes,
    total: sessoes
      .filter(s => s.data.startsWith(m.mesCompleto))
      .reduce((acc, s) => acc + (s.videos?.length || 0), 0),
  }));

  // Configuração das tabs
  const tabs = [
    { 
      id: 'estudos' as TabCategoria, 
      label: 'Estudos Bíblicos', 
      icon: BookOpen, 
      cor: 'blue',
      total: totalEstudos,
      dados: dadosEstudos,
    },
    { 
      id: 'revisitas' as TabCategoria, 
      label: 'Revisitas Novas', 
      icon: Sprout, 
      cor: 'green',
      total: totalRevisitasNovas,
      dados: dadosRevisitas,
    },
    { 
      id: 'publicacoes' as TabCategoria, 
      label: 'Publicações', 
      icon: FileText, 
      cor: 'purple',
      total: totalPublicacoes,
      dados: dadosPublicacoes,
    },
    { 
      id: 'videos' as TabCategoria, 
      label: 'Vídeos', 
      icon: Video, 
      cor: 'orange',
      total: totalVideos,
      dados: dadosVideos,
    },
  ];

  const tabAtiva = tabs.find(t => t.id === categoriaAtiva)!;
  const Icon = tabAtiva.icon;

  // Renderizar lista baseada na categoria
  const renderLista = () => {
    switch (categoriaAtiva) {
      case 'estudos':
        return (
          <div className="space-y-3">
            {estudos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum estudo cadastrado</p>
            ) : (
              estudos.map((estudo) => (
                <Card key={estudo.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{estudo.estudanteNome}</h4>
                      <p className="text-sm text-gray-600">{estudo.publicacao}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={`bg-${getStatusColor(estudo.status)}-100 text-${getStatusColor(estudo.status)}-700`}>
                          {getStatusLabel(estudo.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Progresso: {estudo.progresso}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );

      case 'revisitas':
        const revisitasNovas = revisitas.filter(r => {
          const dataAdicao = new Date(r.dataAdicao);
          const mesRevisita = `${dataAdicao.getFullYear()}-${String(dataAdicao.getMonth() + 1).padStart(2, '0')}`;
          return mesRevisita === mesAtual;
        });

        return (
          <div className="space-y-3">
            {revisitasNovas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma revisita nova este mês</p>
            ) : (
              revisitasNovas.map((revisita) => (
                <Card key={revisita.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{revisita.nome}</h4>
                      <p className="text-sm text-gray-600">{revisita.endereco}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={`bg-${getStatusColorRevisita(revisita.status)}-100 text-${getStatusColorRevisita(revisita.status)}-700`}>
                          {getStatusLabelRevisita(revisita.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {revisita.quantidadeVisitas} visita{revisita.quantidadeVisitas !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );

      case 'publicacoes':
        const sessoesComPublicacoes = sessoes
          .filter(s => s.data.startsWith(mesAtual) && s.publicacoes && s.publicacoes.length > 0);

        return (
          <div className="space-y-3">
            {sessoesComPublicacoes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma publicação entregue este mês</p>
            ) : (
              sessoesComPublicacoes.map((sessao) => (
                <Card key={sessao.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-600">
                        {new Date(sessao.data).toLocaleDateString('pt-BR')}
                      </h4>
                      <div className="space-y-2 mt-2">
                        {sessao.publicacoes?.map((pub, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm">{pub.titulo}</span>
                            <Badge variant="secondary">
                              {pub.quantidade}x
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );

      case 'videos':
        const sessoesComVideos = sessoes
          .filter(s => s.data.startsWith(mesAtual) && s.videos && s.videos.length > 0);

        return (
          <div className="space-y-3">
            {sessoesComVideos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum vídeo compartilhado este mês</p>
            ) : (
              sessoesComVideos.map((sessao) => (
                <Card key={sessao.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-600">
                        {new Date(sessao.data).toLocaleDateString('pt-BR')}
                      </h4>
                      <div className="space-y-2 mt-2">
                        {sessao.videos?.map((video, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm">{video.titulo}</p>
                              <p className="text-xs text-gray-500">{video.duracao}</p>
                            </div>
                            {video.reacao && (
                              <Badge variant="secondary" className={`bg-${getReacaoColor(video.reacao)}-100 text-${getReacaoColor(video.reacao)}-700`}>
                                {getReacaoEmoji(video.reacao)}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl">Estatísticas do Mês</h1>
        </div>

        {/* Tabs scrolláveis */}
        <div className="flex gap-2 px-6 pb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.id === categoriaAtiva;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCategoriaAtiva(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? `bg-${tab.cor}-100 text-${tab.cor}-700 border-2 border-${tab.cor}-300`
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                <Badge variant="secondary" className={isActive ? `bg-${tab.cor}-200` : 'bg-gray-200'}>
                  {tab.total}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card com ícone e total */}
        <Card className={`p-6 bg-gradient-to-br from-${tabAtiva.cor}-50 to-white border-${tabAtiva.cor}-200`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full bg-${tabAtiva.cor}-100 flex items-center justify-center`}>
              <Icon className={`w-8 h-8 text-${tabAtiva.cor}-600`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{tabAtiva.total}</p>
              <p className="text-sm text-gray-600">{tabAtiva.label} este mês</p>
            </div>
          </div>
        </Card>

        {/* Gráfico */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Últimos 4 meses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tabAtiva.dados}>
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
              <Bar 
                dataKey="total" 
                fill={`var(--${tabAtiva.cor}-500, #3b82f6)`}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Lista de itens */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Detalhes</h3>
          {renderLista()}
        </div>
      </div>
    </div>
  );
}

// Funções auxiliares
function getStatusColor(status: string): string {
  switch (status) {
    case 'iniciando': return 'blue';
    case 'progredindo': return 'yellow';
    case 'avancado': return 'green';
    default: return 'gray';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'iniciando': return 'Iniciando';
    case 'progredindo': return 'Em progresso';
    case 'avancado': return 'Avançado';
    default: return status;
  }
}

function getStatusColorRevisita(status: string): string {
  switch (status) {
    case 'nova': return 'blue';
    case 'quente': return 'orange';
    case 'fria': return 'gray';
    case 'descanso': return 'purple';
    default: return 'gray';
  }
}

function getStatusLabelRevisita(status: string): string {
  switch (status) {
    case 'nova': return 'Nova';
    case 'quente': return 'Quente';
    case 'fria': return 'Fria';
    case 'descanso': return 'Descanso';
    default: return status;
  }
}

function getReacaoColor(reacao: string): string {
  switch (reacao) {
    case 'positiva': return 'green';
    case 'neutra': return 'yellow';
    case 'negativa': return 'red';
    default: return 'gray';
  }
}

function getReacaoEmoji(reacao: string): string {
  switch (reacao) {
    case 'positiva': return '😊';
    case 'neutra': return '😐';
    case 'negativa': return '😟';
    default: return '';
  }
}
