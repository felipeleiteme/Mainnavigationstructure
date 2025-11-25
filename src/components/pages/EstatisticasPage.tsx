import { ArrowLeft, BookOpen, Sprout, Home, MapPin, Phone, Mail, Briefcase, Award, TrendingUp, Target, ChevronLeft, ChevronRight, Calendar, Clock, MessageCircle, Sparkles, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataService, Sessao } from '../../services/dataService';
import HorizontalFilterList, { FilterOption } from '../shared/HorizontalFilterList';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EstatisticasPageProps {
  onVoltar: () => void;
}

type VisualizacaoPrincipal = 'metas' | 'quantidades' | 'horas';
type CategoriaQuantidade = 'total' | 'casa-em-casa' | 'testemunho-publico' | 'telefone' | 'carta' | 'informal' | 'revisita' | 'estudo-biblico' | 'credito';
type CategoriaHoras = 'total' | 'casa-em-casa' | 'testemunho-publico' | 'telefone' | 'carta' | 'informal' | 'revisita' | 'estudo-biblico' | 'credito';

// Cores para cada atividade - BRANDBOOK MYNIS
const CORES_ATIVIDADES: Record<string, string> = {
  'casa-em-casa': '#F59E0B',    // Amber
  'revisita': '#C8E046',        // Verde Lima (secundária)
  'estudo-biblico': '#4A2C60',  // Roxo (primária)
  'testemunho-publico': '#8B5CF6', // Violeta
  'telefone': '#06B6D4',        // Cyan
  'carta': '#EC4899',           // Pink
  'informal': '#6366F1',        // Indigo
  'credito': '#F97316',         // Orange
};

export default function EstatisticasPage({ onVoltar }: EstatisticasPageProps) {
  const [visualizacao, setVisualizacao] = useState<VisualizacaoPrincipal>('metas');
  const [categoriaQuantidade, setCategoriaQuantidade] = useState<CategoriaQuantidade>('total');
  const [categoriaHoras, setCategoriaHoras] = useState<CategoriaHoras>('total');
  
  // Estado para navegação de mês na aba Metas
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Buscar dados do DataService
  const sessoes = DataService.getSessoes();
  const revisitas = DataService.getRevisitas();
  const estudos = DataService.getEstudos();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  const mesAtualSelecionado = `${anoSelecionado}-${String(mesSelecionado + 1).padStart(2, '0')}`;

  // Metas
  const metaMensal = DataService.getMetaMensal();
  const metaAnual = DataService.getMetaAnual();

  // Função auxiliar para contar ocorrências de cada tipo de atividade
  const contarAtividades = (tipo: string, mesCompleto: string): number => {
    const sessoesMes = sessoes.filter(s => s.data.startsWith(mesCompleto));
    let count = 0;
    
    sessoesMes.forEach(sessao => {
      if (sessao.atividades && sessao.atividades.length > 0) {
        const temAtividade = sessao.atividades.some(ativ => {
          const tipoNormalizado = tipo === 'estudo-biblico' ? 'estudo' : tipo;
          const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
          return ativTipoNormalizado === tipo || ativ.tipo === tipoNormalizado;
        });
        if (temAtividade) count++;
      }
    });
    
    return count;
  };

  // Função auxiliar para calcular horas (em decimal) de cada tipo de atividade
  const calcularHorasAtividade = (tipo: string, mesCompleto: string): number => {
    const sessoesMes = sessoes.filter(s => s.data.startsWith(mesCompleto));
    let totalMinutos = 0;
    
    sessoesMes.forEach(sessao => {
      if (sessao.atividades && sessao.atividades.length > 0) {
        const temAtividade = sessao.atividades.some(ativ => {
          const tipoNormalizado = tipo === 'estudo-biblico' ? 'estudo' : tipo;
          const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
          return ativTipoNormalizado === tipo || ativ.tipo === tipoNormalizado;
        });
        if (temAtividade) {
          totalMinutos += sessao.duracaoMinutos || 0;
        }
      }
    });
    
    return totalMinutos / 60; // Retorna em horas
  };

  // Calcular horas totais do mês selecionado e do ano
  const calcularHorasTotaisMes = (mesCompleto: string): number => {
    const sessoesMes = sessoes.filter(s => s.data.startsWith(mesCompleto));
    return sessoesMes.reduce((total, s) => total + (s.duracaoMinutos || 0), 0) / 60;
  };

  const calcularHorasTotaisAno = (ano: number): number => {
    const sessoesAno = sessoes.filter(s => s.data.startsWith(String(ano)));
    return sessoesAno.reduce((total, s) => total + (s.duracaoMinutos || 0), 0) / 60;
  };

  const horasMesSelecionado = calcularHorasTotaisMes(mesAtualSelecionado);
  const horasAnoAtual = calcularHorasTotaisAno(anoSelecionado);

  // Função auxiliar para obter sessões com determinada atividade
  const getSessoesComAtividade = (tipo: string, mesCompleto: string): Sessao[] => {
    const sessoesMes = sessoes.filter(s => s.data.startsWith(mesCompleto));
    return sessoesMes.filter(sessao => {
      if (!sessao.atividades || sessao.atividades.length === 0) return false;
      return sessao.atividades.some(ativ => {
        const tipoNormalizado = tipo === 'estudo-biblico' ? 'estudo' : tipo;
        const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
        return ativTipoNormalizado === tipo || ativ.tipo === tipoNormalizado;
      });
    });
  };

  // Calcular estatísticas de quantidades para cada modalidade
  const totalCasaEmCasa = contarAtividades('casa-em-casa', mesAtual);
  const totalTestemunhoPublico = contarAtividades('testemunho-publico', mesAtual);
  const totalTelefone = contarAtividades('telefone', mesAtual);
  const totalCarta = contarAtividades('carta', mesAtual);
  const totalInformal = contarAtividades('informal', mesAtual);
  const totalRevisitaOcorrencias = contarAtividades('revisita', mesAtual);
  const totalEstudoOcorrencias = contarAtividades('estudo-biblico', mesAtual);
  const totalCredito = sessoes.filter(s => s.data.startsWith(mesAtual) && s.tipo === 'credito').length;
  
  // Total geral de atividades
  const totalGeralAtividades = totalCasaEmCasa + totalTestemunhoPublico + totalTelefone + 
    totalCarta + totalInformal + totalRevisitaOcorrencias + totalEstudoOcorrencias + totalCredito;
  
  // Calcular estatísticas de horas para cada modalidade
  const horasCasaEmCasa = calcularHorasAtividade('casa-em-casa', mesAtual);
  const horasTestemunhoPublico = calcularHorasAtividade('testemunho-publico', mesAtual);
  const horasTelefone = calcularHorasAtividade('telefone', mesAtual);
  const horasCarta = calcularHorasAtividade('carta', mesAtual);
  const horasInformal = calcularHorasAtividade('informal', mesAtual);
  const horasRevisita = calcularHorasAtividade('revisita', mesAtual);
  const horasEstudo = calcularHorasAtividade('estudo-biblico', mesAtual);
  const horasCredito = sessoes
    .filter(s => s.data.startsWith(mesAtual) && s.tipo === 'credito')
    .reduce((sum, s) => sum + (s.duracaoMinutos || 0), 0) / 60;
  
  // Total geral de horas
  const totalGeralHoras = horasCasaEmCasa + horasTestemunhoPublico + horasTelefone + 
    horasCarta + horasInformal + horasRevisita + horasEstudo + horasCredito;
  
  // Contar pessoas únicas para Revisita e Estudo Bíblico
  const totalPessoasRevisita = revisitas.length;
  const totalPessoasEstudo = estudos.length;

  // Função para formatar horas
  const formatarHoras = (horas: number): string => {
    const h = Math.floor(horas);
    const min = Math.round((horas - h) * 60);
    if (min === 0) return `${h}h`;
    if (h === 0) return `${min}min`;
    return `${h}h ${min}min`;
  };

  // Navegação de mês
  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    if (direcao === 'anterior') {
      if (mesSelecionado === 0) {
        setMesSelecionado(11);
        setAnoSelecionado(anoSelecionado - 1);
      } else {
        setMesSelecionado(mesSelecionado - 1);
      }
    } else {
      if (mesSelecionado === 11) {
        setMesSelecionado(0);
        setAnoSelecionado(anoSelecionado + 1);
      } else {
        setMesSelecionado(mesSelecionado + 1);
      }
    }
  };

  const nomeMes = new Date(anoSelecionado, mesSelecionado, 1).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Dados para gráficos (últimos 6 meses)
  const getUltimos6Meses = () => {
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
        mesCompleto: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`,
      });
    }
    return meses;
  };

  const meses = getUltimos6Meses();

  // Dados para gráfico anual (12 meses)
  const getMesesAno = () => {
    const mesesAno = [];
    for (let i = 0; i < 12; i++) {
      const data = new Date(anoSelecionado, i, 1);
      const mesCompleto = `${anoSelecionado}-${String(i + 1).padStart(2, '0')}`;
      mesesAno.push({
        mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
        mesCompleto,
        horas: calcularHorasTotaisMes(mesCompleto),
      });
    }
    return mesesAno;
  };

  const dadosAno = getMesesAno();

  // Função genérica para gerar dados de atividade (quantidades)
  const getDadosAtividade = (tipo: string) => {
    return meses.map(m => ({
      mes: m.mes,
      total: contarAtividades(tipo, m.mesCompleto),
    }));
  };

  // Função genérica para gerar dados de horas por atividade
  const getDadosHorasAtividade = (tipo: string) => {
    return meses.map(m => ({
      mes: m.mes,
      total: Number(calcularHorasAtividade(tipo, m.mesCompleto).toFixed(1)),
    }));
  };

  // Dados para gráfico de pizza - Quantidades
  const dadosPizzaQuantidades = [
    { nome: 'Casa em Casa', valor: totalCasaEmCasa, cor: CORES_ATIVIDADES['casa-em-casa'] },
    { nome: 'Revisita', valor: totalRevisitaOcorrencias, cor: CORES_ATIVIDADES['revisita'] },
    { nome: 'Estudo Bíblico', valor: totalEstudoOcorrencias, cor: CORES_ATIVIDADES['estudo-biblico'] },
    { nome: 'Testemunho Público', valor: totalTestemunhoPublico, cor: CORES_ATIVIDADES['testemunho-publico'] },
    { nome: 'Telefone', valor: totalTelefone, cor: CORES_ATIVIDADES['telefone'] },
    { nome: 'Carta', valor: totalCarta, cor: CORES_ATIVIDADES['carta'] },
    { nome: 'Informal', valor: totalInformal, cor: CORES_ATIVIDADES['informal'] },
    { nome: 'Crédito', valor: totalCredito, cor: CORES_ATIVIDADES['credito'] },
  ].filter(item => item.valor > 0);

  // Dados para gráfico de pizza - Horas
  const dadosPizzaHoras = [
    { nome: 'Casa em Casa', valor: Number(horasCasaEmCasa.toFixed(1)), cor: CORES_ATIVIDADES['casa-em-casa'] },
    { nome: 'Revisita', valor: Number(horasRevisita.toFixed(1)), cor: CORES_ATIVIDADES['revisita'] },
    { nome: 'Estudo Bíblico', valor: Number(horasEstudo.toFixed(1)), cor: CORES_ATIVIDADES['estudo-biblico'] },
    { nome: 'Testemunho Público', valor: Number(horasTestemunhoPublico.toFixed(1)), cor: CORES_ATIVIDADES['testemunho-publico'] },
    { nome: 'Telefone', valor: Number(horasTelefone.toFixed(1)), cor: CORES_ATIVIDADES['telefone'] },
    { nome: 'Carta', valor: Number(horasCarta.toFixed(1)), cor: CORES_ATIVIDADES['carta'] },
    { nome: 'Informal', valor: Number(horasInformal.toFixed(1)), cor: CORES_ATIVIDADES['informal'] },
    { nome: 'Crédito', valor: Number(horasCredito.toFixed(1)), cor: CORES_ATIVIDADES['credito'] },
  ].filter(item => item.valor > 0);

  // Calcular progresso das metas
  const progressoMensal = Math.min((horasMesSelecionado / metaMensal) * 100, 100);
  const progressoAnual = Math.min((horasAnoAtual / metaAnual) * 100, 100);

  // Mensagem encorajadora com ícones
  const getMensagemEncorajadora = (progresso: number, tipo: 'mensal' | 'anual') => {
    if (progresso >= 100) {
      return {
        icon: Trophy,
        texto: tipo === 'mensal' 
          ? 'Meta mensal atingida! Continue firme!' 
          : 'Meta anual atingida! Que bênção!'
      };
    }
    if (progresso >= 75) {
      return {
        icon: Sparkles,
        texto: tipo === 'mensal'
          ? 'Falta pouco para sua meta mensal!'
          : 'Você está quase lá no seu alvo anual!'
      };
    }
    if (progresso >= 50) {
      return {
        icon: Sprout,
        texto: tipo === 'mensal'
          ? 'Metade do caminho! Continue assim!'
          : 'Já passou da metade do ano!'
      };
    }
    return {
        icon: Sparkles,
        texto: tipo === 'mensal'
          ? 'Cada hora dedicada conta!'
          : 'Cada mês é uma nova oportunidade!'
      };
  };

  // Tabs de quantidades - TODOS OS TIPOS (com Total primeiro)
  const tabsQuantidades: FilterOption[] = [
    { 
      id: 'total', 
      label: 'Total', 
      icon: TrendingUp, 
      count: totalGeralAtividades,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'casa-em-casa', 
      label: 'Casa em Casa', 
      icon: Home, 
      count: totalCasaEmCasa,
      color: 'from-orange-500 to-orange-600',
    },
    { 
      id: 'revisita', 
      label: 'Revisita', 
      icon: Sprout, 
      count: totalRevisitaOcorrencias,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'estudo-biblico', 
      label: 'Estudo Bíblico', 
      icon: BookOpen, 
      count: totalEstudoOcorrencias,
      color: 'from-blue-500 to-blue-600',
    },
    { 
      id: 'testemunho-publico', 
      label: 'Testemunho Público', 
      icon: MapPin, 
      count: totalTestemunhoPublico,
      color: 'from-purple-500 to-purple-600',
    },
    { 
      id: 'telefone', 
      label: 'Telefone', 
      icon: Phone, 
      count: totalTelefone,
      color: 'from-cyan-500 to-cyan-600',
    },
    { 
      id: 'carta', 
      label: 'Carta', 
      icon: Mail, 
      count: totalCarta,
      color: 'from-pink-500 to-pink-600',
    },
    { 
      id: 'informal', 
      label: 'Informal', 
      icon: Briefcase, 
      count: totalInformal,
      color: 'from-indigo-500 to-indigo-600',
    },
    { 
      id: 'credito', 
      label: 'Crédito', 
      icon: Award, 
      count: totalCredito,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  // Tabs de horas - MESMAS ATIVIDADES (com Total primeiro)
  const tabsHoras: FilterOption[] = [
    { 
      id: 'total', 
      label: 'Total', 
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'casa-em-casa', 
      label: 'Casa em Casa', 
      icon: Home,
      color: 'from-orange-500 to-orange-600',
    },
    { 
      id: 'revisita', 
      label: 'Revisita', 
      icon: Sprout,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'estudo-biblico', 
      label: 'Estudo Bíblico', 
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
    },
    { 
      id: 'testemunho-publico', 
      label: 'Testemunho Público', 
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
    },
    { 
      id: 'telefone', 
      label: 'Telefone', 
      icon: Phone,
      color: 'from-cyan-500 to-cyan-600',
    },
    { 
      id: 'carta', 
      label: 'Carta', 
      icon: Mail,
      color: 'from-pink-500 to-pink-600',
    },
    { 
      id: 'informal', 
      label: 'Informal', 
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600',
    },
    { 
      id: 'credito', 
      label: 'Crédito', 
      icon: Award,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  // Mapeamento de nomes amigáveis
  const nomesAtividades: Record<string, string> = {
    'casa-em-casa': 'Casa em Casa',
    'testemunho-publico': 'Testemunho Público',
    'telefone': 'Por Telefone',
    'carta': 'Por Carta',
    'informal': 'Informal',
    'revisita': 'Revisita',
    'estudo-biblico': 'Estudo Bíblico',
    'estudo': 'Estudo Bíblico',
    'credito': 'Crédito',
  };

  // Configuração da visualização ativa
  const getVisualizacaoConfig = () => {
    if (visualizacao === 'quantidades') {
      if (categoriaQuantidade === 'total') {
        return {
          titulo: 'Visão Geral',
          valor: totalGeralAtividades,
          subtitulo: 'atividades este mês',
          cor: 'green',
          icon: TrendingUp,
          dados: [],
        };
      }

      const counts: Record<Exclude<CategoriaQuantidade, 'total'>, number> = {
        'casa-em-casa': totalCasaEmCasa,
        'testemunho-publico': totalTestemunhoPublico,
        'telefone': totalTelefone,
        'carta': totalCarta,
        'informal': totalInformal,
        'revisita': totalRevisitaOcorrencias,
        'estudo-biblico': totalEstudoOcorrencias,
        'credito': totalCredito,
      };

      const icons: Record<Exclude<CategoriaQuantidade, 'total'>, any> = {
        'casa-em-casa': Home,
        'testemunho-publico': MapPin,
        'telefone': Phone,
        'carta': Mail,
        'informal': Briefcase,
        'revisita': Sprout,
        'estudo-biblico': BookOpen,
        'credito': Award,
      };

      const cores: Record<Exclude<CategoriaQuantidade, 'total'>, string> = {
        'casa-em-casa': 'orange',
        'testemunho-publico': 'purple',
        'telefone': 'cyan',
        'carta': 'pink',
        'informal': 'indigo',
        'revisita': 'green',
        'estudo-biblico': 'blue',
        'credito': 'amber',
      };

      return {
        titulo: nomesAtividades[categoriaQuantidade],
        valor: counts[categoriaQuantidade as Exclude<CategoriaQuantidade, 'total'>],
        subtitulo: 'ocorrências este mês',
        cor: cores[categoriaQuantidade as Exclude<CategoriaQuantidade, 'total'>],
        icon: icons[categoriaQuantidade as Exclude<CategoriaQuantidade, 'total'>],
        dados: getDadosAtividade(categoriaQuantidade),
      };
    } else {
      // Aba Horas
      if (categoriaHoras === 'total') {
        return {
          titulo: 'Visão Geral',
          valor: formatarHoras(totalGeralHoras),
          subtitulo: 'neste mês',
          cor: 'green',
          icon: TrendingUp,
          dados: [],
        };
      }

      const horas: Record<Exclude<CategoriaHoras, 'total'>, number> = {
        'casa-em-casa': horasCasaEmCasa,
        'testemunho-publico': horasTestemunhoPublico,
        'telefone': horasTelefone,
        'carta': horasCarta,
        'informal': horasInformal,
        'revisita': horasRevisita,
        'estudo-biblico': horasEstudo,
        'credito': horasCredito,
      };

      const icons: Record<Exclude<CategoriaHoras, 'total'>, any> = {
        'casa-em-casa': Home,
        'testemunho-publico': MapPin,
        'telefone': Phone,
        'carta': Mail,
        'informal': Briefcase,
        'revisita': Sprout,
        'estudo-biblico': BookOpen,
        'credito': Award,
      };

      const cores: Record<Exclude<CategoriaHoras, 'total'>, string> = {
        'casa-em-casa': 'orange',
        'testemunho-publico': 'purple',
        'telefone': 'cyan',
        'carta': 'pink',
        'informal': 'indigo',
        'revisita': 'green',
        'estudo-biblico': 'blue',
        'credito': 'amber',
      };

      return {
        titulo: nomesAtividades[categoriaHoras],
        valor: formatarHoras(horas[categoriaHoras as Exclude<CategoriaHoras, 'total'>]),
        subtitulo: 'neste mês',
        cor: cores[categoriaHoras as Exclude<CategoriaHoras, 'total'>],
        icon: icons[categoriaHoras as Exclude<CategoriaHoras, 'total'>],
        dados: getDadosHorasAtividade(categoriaHoras),
      };
    }
  };

  const configAtual = visualizacao === 'metas' ? null : getVisualizacaoConfig();
  const Icon = configAtual?.icon;

  // Renderizar visão de Metas
  const renderVisaoMetas = () => {
    const mensagemMensal = getMensagemEncorajadora(progressoMensal, 'mensal');
    const IconMensal = mensagemMensal.icon;
    const mensagemAnual = getMensagemEncorajadora(progressoAnual, 'anual');
    const IconAnual = mensagemAnual.icon;

    return (
      <div className="space-y-6">
        {/* Navegação de Mês */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navegarMes('anterior')}
              className="p-2 hover:bg-gray-100"
              style={{ color: '#4A2C60' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="capitalize text-gray-900">{nomeMes}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navegarMes('proximo')}
              className="p-2 hover:bg-gray-100"
              style={{ color: '#4A2C60' }}
              disabled={mesSelecionado === hoje.getMonth() && anoSelecionado === hoje.getFullYear()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Card Meta Mensal */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#FAF8FF', borderColor: '#E8DFFF' }}>
          <div className="space-y-5">
            {/* Header com ícone e labels */}
            <div className="flex items-start gap-4">
              <Target className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: '#4A2C60' }} />
              <div className="flex-1 flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Meta Mensal</p>
                  <p className="text-2xl" style={{ color: '#4A2C60' }}>{metaMensal}h</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Realizado</p>
                  <p className="text-2xl text-gray-900">{formatarHoras(horasMesSelecionado)}</p>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{progressoMensal.toFixed(0)}% concluído</span>
                <span style={{ color: '#4A2C60' }}>
                  {metaMensal - horasMesSelecionado > 0 
                    ? `Faltam ${formatarHoras(metaMensal - horasMesSelecionado)}`
                    : 'Meta atingida!'}
                </span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#E8DFFF' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressoMensal}%`,
                    backgroundColor: '#C8E046'
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <IconMensal className="w-4 h-4" style={{ color: '#4A2C60' }} />
                <p className="text-xs text-gray-700">{mensagemMensal.texto}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card Meta Anual */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#FAF8FF', borderColor: '#E8DFFF' }}>
          <div className="space-y-5">
            {/* Header com ícone e labels */}
            <div className="flex items-start gap-4">
              <TrendingUp className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: '#4A2C60' }} />
              <div className="flex-1 flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Meta Anual {anoSelecionado}</p>
                  <p className="text-2xl" style={{ color: '#4A2C60' }}>{metaAnual}h</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Realizado</p>
                  <p className="text-2xl text-gray-900">{formatarHoras(horasAnoAtual)}</p>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{progressoAnual.toFixed(0)}% concluído</span>
                <span style={{ color: '#4A2C60' }}>
                  {metaAnual - horasAnoAtual > 0 
                    ? `Faltam ${formatarHoras(metaAnual - horasAnoAtual)}`
                    : 'Meta atingida!'}
                </span>
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#E8DFFF' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressoAnual}%`,
                    backgroundColor: '#C8E046'
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <IconAnual className="w-4 h-4" style={{ color: '#4A2C60' }} />
                <p className="text-xs text-gray-700">{mensagemAnual.texto}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Mini estatísticas do mês selecionado */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Resumo de {nomeMes.split(' ')[0]}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-5">
              <div className="text-center">
                <p className="text-4xl text-gray-900">{contarAtividades('casa-em-casa', mesAtualSelecionado)}</p>
                <p className="text-xs text-gray-600 mt-2">Casa em Casa</p>
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-center">
                <p className="text-4xl text-gray-900">{contarAtividades('revisita', mesAtualSelecionado)}</p>
                <p className="text-xs text-gray-600 mt-2">Revisitas</p>
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-center">
                <p className="text-4xl text-gray-900">{contarAtividades('estudo-biblico', mesAtualSelecionado)}</p>
                <p className="text-xs text-gray-600 mt-2">Estudos</p>
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-center">
                <p className="text-4xl text-gray-900">
                  {sessoes.filter(s => s.data.startsWith(mesAtualSelecionado)).length}
                </p>
                <p className="text-xs text-gray-600 mt-2">Sessões</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar visão Total - Quantidades
  const renderVisaoTotalQuantidades = () => {
    return (
      <div className="space-y-6">
        {/* Card Hero */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#F3F9E6', borderColor: '#C8E046' }}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#C8E046' }}>
              <TrendingUp className="w-8 h-8" style={{ color: '#4A2C60' }} />
            </div>
            <div>
              <p className="text-5xl text-gray-900 mb-1">{totalGeralAtividades}</p>
              <p className="text-xs text-gray-700">atividades realizadas este mês</p>
            </div>
            <div className="flex items-center justify-center gap-8 pt-1">
              <div>
                <p className="text-2xl" style={{ color: '#4A2C60' }}>{totalPessoasRevisita}</p>
                <p className="text-xs text-gray-700">revisitas</p>
              </div>
              <div>
                <p className="text-2xl" style={{ color: '#4A2C60' }}>{totalPessoasEstudo}</p>
                <p className="text-xs text-gray-700">estudantes</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Pizza */}
        {dadosPizzaQuantidades.length > 0 && (
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Distribuição de Atividades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizzaQuantidades}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({nome, percent}) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dadosPizzaQuantidades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Cards resumo por atividade */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Detalhamento por Atividade</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Casa em Casa', valor: totalCasaEmCasa, icon: Home, cor: '#F59E0B' },
              { label: 'Revisitas', valor: totalRevisitaOcorrencias, icon: Sprout, cor: '#C8E046' },
              { label: 'Estudos', valor: totalEstudoOcorrencias, icon: BookOpen, cor: '#4A2C60' },
              { label: 'Testemunho', valor: totalTestemunhoPublico, icon: MapPin, cor: '#8B5CF6' },
              { label: 'Telefone', valor: totalTelefone, icon: Phone, cor: '#06B6D4' },
              { label: 'Carta', valor: totalCarta, icon: Mail, cor: '#EC4899' },
              { label: 'Informal', valor: totalInformal, icon: Briefcase, cor: '#6366F1' },
              { label: 'Crédito', valor: totalCredito, icon: Award, cor: '#F97316' },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <Card key={item.label} className="p-4">
                  <div className="flex items-center gap-3">
                    <ItemIcon className="w-6 h-6 flex-shrink-0" style={{ color: item.cor }} />
                    <div className="flex-1">
                      <p className="text-2xl text-gray-900">{item.valor}</p>
                      <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar visão Total - Horas
  const renderVisaoTotalHoras = () => {
    return (
      <div className="space-y-6">
        {/* Card Hero */}
        <Card className="p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <p className="text-5xl text-gray-900 mb-2">{formatarHoras(totalGeralHoras)}</p>
              <p className="text-sm text-gray-600">dedicadas ao ministério este mês</p>
            </div>
          </div>
        </Card>

        {/* Gráfico de Pizza */}
        {dadosPizzaHoras.length > 0 && (
          <Card className="p-6">
            <h3 className="text-sm text-gray-700 mb-4">Distribuição de Tempo</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dadosPizzaHoras}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({nome, percent}) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {dadosPizzaHoras.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}h`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Cards resumo por atividade */}
        <div className="space-y-3">
          <h3 className="text-sm text-gray-700">Detalhamento por Atividade</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Casa em Casa', valor: horasCasaEmCasa, icon: Home, cor: '#F59E0B' },
              { label: 'Revisitas', valor: horasRevisita, icon: Sprout, cor: '#C8E046' },
              { label: 'Estudos', valor: horasEstudo, icon: BookOpen, cor: '#4A2C60' },
              { label: 'Testemunho', valor: horasTestemunhoPublico, icon: MapPin, cor: '#8B5CF6' },
              { label: 'Telefone', valor: horasTelefone, icon: Phone, cor: '#06B6D4' },
              { label: 'Carta', valor: horasCarta, icon: Mail, cor: '#EC4899' },
              { label: 'Informal', valor: horasInformal, icon: Briefcase, cor: '#6366F1' },
              { label: 'Crédito', valor: horasCredito, icon: Award, cor: '#F97316' },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <Card key={item.label} className="p-4">
                  <div className="flex items-center gap-3">
                    <ItemIcon className="w-6 h-6 flex-shrink-0" style={{ color: item.cor }} />
                    <div className="flex-1">
                      <p className="text-lg text-gray-900">{formatarHoras(item.valor)}</p>
                      <p className="text-xs text-gray-600">{item.label}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar lista para quantidades (sessões filtradas por atividade)
  const renderListaQuantidades = () => {
    const sessoesFiltradas = getSessoesComAtividade(categoriaQuantidade, mesAtual);

    return (
      <div className="space-y-3">
        {sessoesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma ocorrência de {nomesAtividades[categoriaQuantidade]} este mês
          </p>
        ) : (
          sessoesFiltradas.map((sessao) => {
            const atividadeEspecifica = sessao.atividades?.find(ativ => {
              const tipoNormalizado = categoriaQuantidade === 'estudo-biblico' ? 'estudo' : categoriaQuantidade;
              const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
              return ativTipoNormalizado === categoriaQuantidade || ativ.tipo === tipoNormalizado;
            });

            return (
              <Card key={sessao.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {sessao.tipo === 'campo' ? (
                        <Sprout className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-600" />
                      )}
                      <h4>{nomesAtividades[categoriaQuantidade]}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(sessao.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      {' • '}
                      {sessao.horaInicio}
                      {sessao.horaFim && ` - ${sessao.horaFim}`}
                    </p>
                    {atividadeEspecifica?.detalhes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500">
                          {atividadeEspecifica.detalhes}
                        </p>
                      </div>
                    )}
                    {sessao.observacoes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500 italic">
                          {sessao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {formatarHoras((sessao.duracaoMinutos || 0) / 60)}
                  </Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>
    );
  };

  // Renderizar lista para horas (sessões filtradas por atividade)
  const renderListaHoras = () => {
    const sessoesFiltradas = getSessoesComAtividade(categoriaHoras, mesAtual);

    return (
      <div className="space-y-3">
        {sessoesFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma sessão de {nomesAtividades[categoriaHoras]} este mês
          </p>
        ) : (
          sessoesFiltradas.map((sessao) => {
            const atividadeEspecifica = sessao.atividades?.find(ativ => {
              const tipoNormalizado = categoriaHoras === 'estudo-biblico' ? 'estudo' : categoriaHoras;
              const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
              return ativTipoNormalizado === categoriaHoras || ativ.tipo === tipoNormalizado;
            });

            return (
              <Card key={sessao.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {sessao.tipo === 'campo' ? (
                        <Sprout className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-600" />
                      )}
                      <h4>{nomesAtividades[categoriaHoras]}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(sessao.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      {' • '}
                      {sessao.horaInicio}
                      {sessao.horaFim && ` - ${sessao.horaFim}`}
                    </p>
                    {atividadeEspecifica?.detalhes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500">
                          {atividadeEspecifica.detalhes}
                        </p>
                      </div>
                    )}
                    {sessao.observacoes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500 italic">
                          {sessao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {formatarHoras((sessao.duracaoMinutos || 0) / 60)}
                  </Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div className="sticky top-0 z-50 text-white" style={{ backgroundColor: '#4A2C60' }}>
        <div className="px-6 pt-12 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="p-0 text-white hover:bg-white/20 hover:text-white h-8 w-8"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl">Estatísticas</h2>
          </div>

          {/* Tabs principais - Metas, Atividades, Horas */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setVisualizacao('metas')}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                visualizacao === 'metas'
                  ? 'shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={visualizacao === 'metas' ? { backgroundColor: '#C8E046', color: '#4A2C60' } : {}}
            >
              <Target className="w-4 h-4" />
              <span>Metas</span>
            </button>
            <button
              onClick={() => setVisualizacao('quantidades')}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                visualizacao === 'quantidades'
                  ? 'shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={visualizacao === 'quantidades' ? { backgroundColor: '#C8E046', color: '#4A2C60' } : {}}
            >
              <Calendar className="w-4 h-4" />
              <span>Atividades</span>
            </button>
            <button
              onClick={() => setVisualizacao('horas')}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                visualizacao === 'horas'
                  ? 'shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              style={visualizacao === 'horas' ? { backgroundColor: '#C8E046', color: '#4A2C60' } : {}}
            >
              <Clock className="w-4 h-4" />
              <span>Horas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtabs - apenas para Atividades e Horas - FORA DO HEADER ROXO */}
      {visualizacao !== 'metas' && (
        <div className="px-6 pt-6 pb-4" style={{ backgroundColor: '#FDF8EE' }}>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {(visualizacao === 'quantidades' ? tabsQuantidades : tabsHoras).map((option) => {
              const Icon = option.icon;
              const isActive = option.id === (visualizacao === 'quantidades' ? categoriaQuantidade : categoriaHoras);
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (visualizacao === 'quantidades') {
                      setCategoriaQuantidade(option.id as CategoriaQuantidade);
                    } else {
                      setCategoriaHoras(option.id as CategoriaHoras);
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap 
                    text-sm transition-all duration-200 flex-shrink-0
                    ${isActive
                      ? 'shadow-sm'
                      : 'text-gray-900 hover:bg-gray-100 border-2 border-gray-900'
                    }
                  `}
                  style={isActive ? { backgroundColor: '#C8E046', color: '#4A2C60', border: 'none' } : {}}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span 
                      className="ml-1 px-2 py-0.5 rounded-full text-xs"
                      style={isActive 
                        ? { backgroundColor: 'rgba(74, 44, 96, 0.2)', color: '#4A2C60' } 
                        : { backgroundColor: '#E5E7EB', color: '#1F2937' }
                      }
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Renderização condicional baseada na visualização */}
        {visualizacao === 'metas' ? (
          renderVisaoMetas()
        ) : visualizacao === 'quantidades' && categoriaQuantidade === 'total' ? (
          renderVisaoTotalQuantidades()
        ) : visualizacao === 'horas' && categoriaHoras === 'total' ? (
          renderVisaoTotalHoras()
        ) : (
          <>
            {/* Card com ícone e total */}
            <Card className={`p-6 bg-gradient-to-br from-${configAtual!.cor}-50 to-white border-${configAtual!.cor}-200`}>
              {visualizacao === 'quantidades' && (categoriaQuantidade === 'revisita' || categoriaQuantidade === 'estudo-biblico') ? (
                // Layout especial para Revisita e Estudo Bíblico na aba Quantidades
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-${configAtual!.cor}-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-8 h-8 text-${configAtual!.cor}-600`} />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-6">
                    {/* Coluna 1: Ocorrências */}
                    <div className="border-r border-gray-200 pr-4">
                      <p className="text-3xl text-gray-900">{configAtual!.valor}</p>
                      <p className="text-sm text-gray-600">ocorrências este mês</p>
                    </div>
                    {/* Coluna 2: Pessoas */}
                    <div className="pl-2">
                      <p className="text-3xl text-gray-900">
                        {categoriaQuantidade === 'revisita' ? totalPessoasRevisita : totalPessoasEstudo}
                      </p>
                      <p className="text-sm text-gray-600">
                        {categoriaQuantidade === 'revisita' 
                          ? `pessoa${totalPessoasRevisita !== 1 ? 's' : ''} cadastrada${totalPessoasRevisita !== 1 ? 's' : ''}`
                          : `estudante${totalPessoasEstudo !== 1 ? 's' : ''} ativo${totalPessoasEstudo !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Layout padrão para outras categorias
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-${configAtual!.cor}-100 flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 text-${configAtual!.cor}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl text-gray-900">{configAtual!.valor}</p>
                    <p className="text-sm text-gray-600">{configAtual!.subtitulo}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Gráfico */}
            <Card className="p-6">
              <h3 className="text-sm text-gray-700 mb-4">Últimos 6 meses</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={configAtual!.dados}>
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
                    fill={
                      configAtual!.cor === 'blue' ? '#3b82f6' : 
                      configAtual!.cor === 'green' ? '#10b981' : 
                      configAtual!.cor === 'purple' ? '#a855f7' :
                      configAtual!.cor === 'orange' ? '#f97316' :
                      configAtual!.cor === 'cyan' ? '#06b6d4' :
                      configAtual!.cor === 'pink' ? '#ec4899' :
                      configAtual!.cor === 'indigo' ? '#6366f1' :
                      configAtual!.cor === 'amber' ? '#f59e0b' :
                      '#10b981'
                    }
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Lista de itens */}
            <div>
              <h3 className="text-sm text-gray-700 mb-4">Detalhes</h3>
              {visualizacao === 'quantidades' ? renderListaQuantidades() : renderListaHoras()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}