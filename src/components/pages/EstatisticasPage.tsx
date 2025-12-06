import { ArrowLeft, BookOpen, Sprout, Home, MapPin, Phone, Mail, Briefcase, Award, TrendingUp, Target, ChevronLeft, ChevronRight, Calendar, Clock, MessageCircle, Sparkles, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataService, Sessao } from '../../services/dataService';
import { ThemeService } from '../../services/themeService';
import { LanguageService } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';
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
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [idiomaAtual, setIdiomaAtual] = useState(LanguageService.getLanguage());
  const t = useTranslations();
  
  // Estado para navegação de mês na aba Metas
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  // Estado para navegação de Ano de Serviço (setembro a agosto) nas abas Atividades e Horas
  const getAnoServicoAtual = () => {
    const mesAtual = hoje.getMonth(); // 0-11
    const anoAtual = hoje.getFullYear();
    // Se estamos entre setembro (8) e dezembro (11), o ano de serviço é o ano seguinte
    // Se estamos entre janeiro (0) e agosto (7), o ano de serviço é o ano atual
    // Exemplo: outubro/2024 = ano de serviço 2025, janeiro/2025 = ano de serviço 2025
    return mesAtual >= 8 ? anoAtual + 1 : anoAtual;
  };
  
  const [anoServicoSelecionado, setAnoServicoSelecionado] = useState(getAnoServicoAtual());

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleIdiomaChange = () => {
      setIdiomaAtual(LanguageService.getLanguage());
    };

    LanguageService.on('mynis-language-change', handleIdiomaChange);
    return () => LanguageService.off('mynis-language-change', handleIdiomaChange);
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

  const locale = idiomaAtual === 'pt-BR' ? 'pt-BR' : idiomaAtual === 'es' ? 'es-ES' : 'en-US';
  const nomeMes = new Date(anoSelecionado, mesSelecionado, 1).toLocaleDateString(locale, { 
    month: 'long', 
    year: 'numeric' 
  });

  // Função para obter nome do mês traduzido (apenas o nome, sem o ano)
  const getNomeMesApenas = () => {
    const meses = [
      t.statistics.january, t.statistics.february, t.statistics.march,
      t.statistics.april, t.statistics.may, t.statistics.june,
      t.statistics.july, t.statistics.august, t.statistics.september,
      t.statistics.october, t.statistics.november, t.statistics.december
    ];
    return meses[mesSelecionado];
  };

  // Navegação de Ano de Serviço (setembro a agosto)
  const navegarAnoServico = (direcao: 'anterior' | 'proximo') => {
    if (direcao === 'anterior') {
      setAnoServicoSelecionado(anoServicoSelecionado - 1);
    } else {
      // Não permitir avançar além do ano de serviço atual
      const anoServicoAtual = getAnoServicoAtual();
      if (anoServicoSelecionado < anoServicoAtual) {
        setAnoServicoSelecionado(anoServicoSelecionado + 1);
      }
    }
  };

  // Formatar nome do Ano de Serviço
  const getNomeAnoServico = (anoInicio: number) => {
    return `${anoInicio}/${(anoInicio + 1).toString().slice(-2)}`;
  };

  // Obter meses do Ano de Serviço (setembro a agosto)
  const getMesesAnoServico = (anoInicio: number) => {
    const mesesAnoServico = [];
    // Setembro a Dezembro do ano anterior ao ano de serviço
    for (let mes = 8; mes <= 11; mes++) {
      const mesCompleto = `${anoInicio - 1}-${String(mes + 1).padStart(2, '0')}`;
      mesesAnoServico.push({
        mes: new Date(anoInicio - 1, mes, 1).toLocaleDateString(locale, { month: 'short' }),
        mesCompleto,
      });
    }
    // Janeiro a Agosto do ano de serviço
    for (let mes = 0; mes <= 7; mes++) {
      const mesCompleto = `${anoInicio}-${String(mes + 1).padStart(2, '0')}`;
      mesesAnoServico.push({
        mes: new Date(anoInicio, mes, 1).toLocaleDateString(locale, { month: 'short' }),
        mesCompleto,
      });
    }
    return mesesAnoServico;
  };

  const mesesAnoServico = getMesesAnoServico(anoServicoSelecionado);

  // Dados para gráficos (últimos 6 meses) - DEPRECATED - usar mesesAnoServico
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

  // Função genérica para gerar dados de atividade (quantidades)
  const getDadosAtividade = (tipo: string) => {
    return mesesAnoServico.map(m => ({
      mes: m.mes,
      total: contarAtividades(tipo, m.mesCompleto),
    }));
  };

  // Função genérica para gerar dados de horas por atividade
  const getDadosHorasAtividade = (tipo: string) => {
    return mesesAnoServico.map(m => ({
      mes: m.mes,
      total: Number(calcularHorasAtividade(tipo, m.mesCompleto).toFixed(1)),
    }));
  };

  // Dados para gráfico de pizza - Quantidades
  const dadosPizzaQuantidades = [
    { nome: t.statistics.houseToHouse, valor: totalCasaEmCasa, cor: CORES_ATIVIDADES['casa-em-casa'] },
    { nome: t.statistics.returnVisit, valor: totalRevisitaOcorrencias, cor: CORES_ATIVIDADES['revisita'] },
    { nome: t.statistics.bibleStudy, valor: totalEstudoOcorrencias, cor: CORES_ATIVIDADES['estudo-biblico'] },
    { nome: t.statistics.publicWitnessing, valor: totalTestemunhoPublico, cor: CORES_ATIVIDADES['testemunho-publico'] },
    { nome: t.statistics.phone, valor: totalTelefone, cor: CORES_ATIVIDADES['telefone'] },
    { nome: t.statistics.letter, valor: totalCarta, cor: CORES_ATIVIDADES['carta'] },
    { nome: t.statistics.informal, valor: totalInformal, cor: CORES_ATIVIDADES['informal'] },
    { nome: t.statistics.credit, valor: totalCredito, cor: CORES_ATIVIDADES['credito'] },
  ].filter(item => item.valor > 0);

  // Dados para gráfico de pizza - Horas
  const dadosPizzaHoras = [
    { nome: t.statistics.houseToHouse, valor: Number(horasCasaEmCasa.toFixed(1)), cor: CORES_ATIVIDADES['casa-em-casa'] },
    { nome: t.statistics.returnVisit, valor: Number(horasRevisita.toFixed(1)), cor: CORES_ATIVIDADES['revisita'] },
    { nome: t.statistics.bibleStudy, valor: Number(horasEstudo.toFixed(1)), cor: CORES_ATIVIDADES['estudo-biblico'] },
    { nome: t.statistics.publicWitnessing, valor: Number(horasTestemunhoPublico.toFixed(1)), cor: CORES_ATIVIDADES['testemunho-publico'] },
    { nome: t.statistics.phone, valor: Number(horasTelefone.toFixed(1)), cor: CORES_ATIVIDADES['telefone'] },
    { nome: t.statistics.letter, valor: Number(horasCarta.toFixed(1)), cor: CORES_ATIVIDADES['carta'] },
    { nome: t.statistics.informal, valor: Number(horasInformal.toFixed(1)), cor: CORES_ATIVIDADES['informal'] },
    { nome: t.statistics.credit, valor: Number(horasCredito.toFixed(1)), cor: CORES_ATIVIDADES['credito'] },
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
          ? t.statistics.monthlyGoalReached
          : t.statistics.yearlyGoalReached
      };
    }
    if (progresso >= 75) {
      return {
        icon: Sparkles,
        texto: tipo === 'mensal'
          ? t.statistics.almostMonthly
          : t.statistics.almostYearly
      };
    }
    if (progresso >= 50) {
      return {
        icon: Sprout,
        texto: t.statistics.keepGoing
      };
    }
    return {
        icon: Sparkles,
        texto: tipo === 'mensal'
          ? t.statistics.everyHourCounts
          : t.statistics.everyMonthOpportunity
      };
  };

  // Tabs de quantidades - TODOS OS TIPOS (com Total primeiro)
  const tabsQuantidades: FilterOption[] = [
    { 
      id: 'total', 
      label: t.statistics.total, 
      icon: TrendingUp, 
      count: totalGeralAtividades,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'casa-em-casa', 
      label: t.statistics.houseToHouse, 
      icon: Home, 
      count: totalCasaEmCasa,
      color: 'from-orange-500 to-orange-600',
    },
    { 
      id: 'revisita', 
      label: t.statistics.returnVisit, 
      icon: Sprout, 
      count: totalRevisitaOcorrencias,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'estudo-biblico', 
      label: t.statistics.bibleStudy, 
      icon: BookOpen, 
      count: totalEstudoOcorrencias,
      color: 'from-blue-500 to-blue-600',
    },
    { 
      id: 'testemunho-publico', 
      label: t.statistics.publicWitnessing, 
      icon: MapPin, 
      count: totalTestemunhoPublico,
      color: 'from-purple-500 to-purple-600',
    },
    { 
      id: 'telefone', 
      label: t.statistics.phone, 
      icon: Phone, 
      count: totalTelefone,
      color: 'from-cyan-500 to-cyan-600',
    },
    { 
      id: 'carta', 
      label: t.statistics.letter, 
      icon: Mail, 
      count: totalCarta,
      color: 'from-pink-500 to-pink-600',
    },
    { 
      id: 'informal', 
      label: t.statistics.informal, 
      icon: Briefcase, 
      count: totalInformal,
      color: 'from-indigo-500 to-indigo-600',
    },
    { 
      id: 'credito', 
      label: t.statistics.credit, 
      icon: Award, 
      count: totalCredito,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  // Tabs de horas - MESMAS ATIVIDADES (com Total primeiro)
  const tabsHoras: FilterOption[] = [
    { 
      id: 'total', 
      label: t.statistics.total, 
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'casa-em-casa', 
      label: t.statistics.houseToHouse, 
      icon: Home,
      color: 'from-orange-500 to-orange-600',
    },
    { 
      id: 'revisita', 
      label: t.statistics.returnVisit, 
      icon: Sprout,
      color: 'from-green-500 to-green-600',
    },
    { 
      id: 'estudo-biblico', 
      label: t.statistics.bibleStudy, 
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
    },
    { 
      id: 'testemunho-publico', 
      label: t.statistics.publicWitnessing, 
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
    },
    { 
      id: 'telefone', 
      label: t.statistics.phone, 
      icon: Phone,
      color: 'from-cyan-500 to-cyan-600',
    },
    { 
      id: 'carta', 
      label: t.statistics.letter, 
      icon: Mail,
      color: 'from-pink-500 to-pink-600',
    },
    { 
      id: 'informal', 
      label: t.statistics.informal, 
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600',
    },
    { 
      id: 'credito', 
      label: t.statistics.credit, 
      icon: Award,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  // Mapeamento de nomes amigáveis
  const nomesAtividades: Record<string, string> = {
    'casa-em-casa': t.statistics.houseToHouse,
    'testemunho-publico': t.statistics.publicWitnessing,
    'telefone': t.statistics.phone,
    'carta': t.statistics.letter,
    'informal': t.statistics.informal,
    'revisita': t.statistics.returnVisit,
    'estudo-biblico': t.statistics.bibleStudy,
    'estudo': t.statistics.bibleStudy,
    'credito': t.statistics.credit,
  };

  // Configuração da visualização ativa
  const getVisualizacaoConfig = () => {
    if (visualizacao === 'quantidades') {
      if (categoriaQuantidade === 'total') {
        return {
          titulo: t.statistics.overview,
          valor: totalGeralAtividades,
          subtitulo: t.statistics.activitiesThisMonth,
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
        subtitulo: t.statistics.occurrencesThisMonth,
        cor: cores[categoriaQuantidade as Exclude<CategoriaQuantidade, 'total'>],
        icon: icons[categoriaQuantidade as Exclude<CategoriaQuantidade, 'total'>],
        dados: getDadosAtividade(categoriaQuantidade),
      };
    } else {
      // Aba Horas
      if (categoriaHoras === 'total') {
        return {
          titulo: t.statistics.overview,
          valor: formatarHoras(totalGeralHoras),
          subtitulo: t.statistics.inThisMonth,
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
        subtitulo: t.statistics.inThisMonth,
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
              className="p-2"
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 
              className="capitalize"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              {nomeMes}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navegarMes('proximo')}
              className="p-2"
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              disabled={mesSelecionado === hoje.getMonth() && anoSelecionado === hoje.getFullYear()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Card Meta Mensal */}
        <Card 
          className="p-6 border-2" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FAF8FF', 
            borderColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#E8DFFF'
          }}
        >
          <div className="space-y-5">
            {/* Header com ícone e labels */}
            <div className="flex items-start gap-4">
              <Target 
                className="w-7 h-7 flex-shrink-0 mt-1" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                }} 
              />
              <div className="flex-1 flex items-end justify-between">
                <div>
                  <p 
                    className="text-xs mb-1"
                    style={{
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                    }}
                  >
                    {t.statistics.monthlyGoal}
                  </p>
                  <p 
                    className="text-2xl" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C7B3E5' : '#4A2C60'
                    }}
                  >
                    {metaMensal}h
                  </p>
                </div>
                <div className="text-right">
                  <p 
                    className="text-xs mb-1"
                    style={{
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                    }}
                  >
                    {t.statistics.completed}
                  </p>
                  <p 
                    className="text-2xl"
                    style={{
                      color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                    }}
                  >
                    {formatarHoras(horasMesSelecionado)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span 
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.percentComplete.replace('{n}', progressoMensal.toFixed(0))}
                </span>
                <span 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C7B3E5' : '#4A2C60'
                  }}
                >
                  {metaMensal - horasMesSelecionado > 0 
                    ? t.statistics.remaining.replace('{time}', formatarHoras(metaMensal - horasMesSelecionado))
                    : t.statistics.monthlyGoalReached}
                </span>
              </div>
              <div 
                className="w-full rounded-full h-3 overflow-hidden" 
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.15)' : '#E8DFFF'
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressoMensal}%`,
                    backgroundColor: '#C8E046'
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <IconMensal 
                  className="w-4 h-4" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                  }} 
                />
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
                  }}
                >
                  {mensagemMensal.texto}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card Meta Anual */}
        <Card 
          className="p-6 border-2" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FAF8FF', 
            borderColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#E8DFFF'
          }}
        >
          <div className="space-y-5">
            {/* Header com ícone e labels */}
            <div className="flex items-start gap-4">
              <TrendingUp 
                className="w-7 h-7 flex-shrink-0 mt-1" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                }} 
              />
              <div className="flex-1 flex items-end justify-between">
                <div>
                  <p 
                    className="text-xs mb-1"
                    style={{
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                    }}
                  >
                    {t.statistics.yearlyGoal.replace('2025', anoSelecionado.toString())}
                  </p>
                  <p 
                    className="text-2xl" 
                    style={{ 
                      color: temaAtual === 'escuro' ? '#C7B3E5' : '#4A2C60'
                    }}
                  >
                    {metaAnual}h
                  </p>
                </div>
                <div className="text-right">
                  <p 
                    className="text-xs mb-1"
                    style={{
                      color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                    }}
                  >
                    {t.statistics.completed}
                  </p>
                  <p 
                    className="text-2xl"
                    style={{
                      color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                    }}
                  >
                    {formatarHoras(horasAnoAtual)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Barra de Progresso */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span 
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.percentComplete.replace('{n}', progressoAnual.toFixed(0))}
                </span>
                <span 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C7B3E5' : '#4A2C60'
                  }}
                >
                  {metaAnual - horasAnoAtual > 0 
                    ? t.statistics.remaining.replace('{time}', formatarHoras(metaAnual - horasAnoAtual))
                    : t.statistics.yearlyGoalReached}
                </span>
              </div>
              <div 
                className="w-full rounded-full h-3 overflow-hidden" 
                style={{ 
                  backgroundColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.15)' : '#E8DFFF'
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressoAnual}%`,
                    backgroundColor: '#C8E046'
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <IconAnual 
                  className="w-4 h-4" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60'
                  }} 
                />
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151'
                  }}
                >
                  {mensagemAnual.texto}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Mini estatísticas do mês selecionado */}
        <div className="space-y-3">
          <h3 
            style={{
              color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
            }}
          >
            {t.statistics.summaryOf.replace('{month}', getNomeMesApenas())}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className="p-5"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              <div className="text-center">
                <p 
                  className="text-4xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {contarAtividades('casa-em-casa', mesAtualSelecionado)}
                </p>
                <p 
                  className="text-xs mt-2"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.houseToHouse}
                </p>
              </div>
            </Card>
            <Card 
              className="p-5"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              <div className="text-center">
                <p 
                  className="text-4xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {contarAtividades('revisita', mesAtualSelecionado)}
                </p>
                <p 
                  className="text-xs mt-2"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.returnVisits}
                </p>
              </div>
            </Card>
            <Card 
              className="p-5"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              <div className="text-center">
                <p 
                  className="text-4xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {contarAtividades('estudo-biblico', mesAtualSelecionado)}
                </p>
                <p 
                  className="text-xs mt-2"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.bibleStudies}
                </p>
              </div>
            </Card>
            <Card 
              className="p-5"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              <div className="text-center">
                <p 
                  className="text-4xl"
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {sessoes.filter(s => s.data.startsWith(mesAtualSelecionado)).length}
                </p>
                <p 
                  className="text-xs mt-2"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.sessions}
                </p>
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
        <Card 
          className="p-6 border-2" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#F3F9E6', 
            borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#C8E046'
          }}
        >
          <div className="text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" 
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : '#C8E046'
              }}
            >
              <TrendingUp 
                className="w-8 h-8" 
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }} 
              />
            </div>
            <div>
              <p 
                className="text-5xl mb-1"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                {totalGeralAtividades}
              </p>
              <p 
                className="text-xs"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#374151'
                }}
              >
                {t.statistics.activitiesThisMonthCount}
              </p>
            </div>
            <div className="flex items-center justify-center gap-8 pt-1">
              <div>
                <p 
                  className="text-2xl" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C7B3E5' : '#4A2C60'
                  }}
                >
                  {totalPessoasRevisita}
                </p>
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#374151'
                  }}
                >
                  {t.statistics.returnVisitsCount}
                </p>
              </div>
              <div>
                <p 
                  className="text-2xl" 
                  style={{ 
                    color: temaAtual === 'escuro' ? '#C7B3E5' : '#4A2C60'
                  }}
                >
                  {totalPessoasEstudo}
                </p>
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#374151'
                  }}
                >
                  {t.statistics.studentsCount}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Pizza */}
        {dadosPizzaQuantidades.length > 0 && (
          <Card 
            className="p-6"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
            }}
          >
            <h3 
              className="mb-6"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
              }}
            >
              {t.statistics.activityDistribution}
            </h3>
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
          <h3 
            style={{
              color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
            }}
          >
            {t.statistics.breakdownByActivity}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t.statistics.houseToHouse, valor: totalCasaEmCasa, icon: Home, cor: '#F59E0B' },
              { label: t.statistics.returnVisits, valor: totalRevisitaOcorrencias, icon: Sprout, cor: '#C8E046' },
              { label: t.statistics.bibleStudies, valor: totalEstudoOcorrencias, icon: BookOpen, cor: '#4A2C60' },
              { label: t.statistics.publicWitnessing, valor: totalTestemunhoPublico, icon: MapPin, cor: '#8B5CF6' },
              { label: t.statistics.phone, valor: totalTelefone, icon: Phone, cor: '#06B6D4' },
              { label: t.statistics.letter, valor: totalCarta, icon: Mail, cor: '#EC4899' },
              { label: t.statistics.informal, valor: totalInformal, icon: Briefcase, cor: '#6366F1' },
              { label: t.statistics.credit, valor: totalCredito, icon: Award, cor: '#F97316' },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <Card 
                  key={item.label} 
                  className="p-5"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
                  }}
                >
                  <div className="text-center space-y-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                      style={{ 
                        backgroundColor: temaAtual === 'escuro' 
                          ? `${item.cor}30` 
                          : `${item.cor}20` 
                      }}
                    >
                      <ItemIcon className="w-6 h-6" style={{ color: item.cor }} />
                    </div>
                    <div>
                      <p 
                        className="text-3xl mb-1"
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {item.valor}
                      </p>
                      <p 
                        className="text-xs"
                        style={{
                          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        {item.label}
                      </p>
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
        <Card 
          className="p-6 border-2"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#F3F9E6',
            borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.3)' : '#C8E046'
          }}
        >
          <div className="text-center space-y-4">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{
                backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(200, 224, 70, 0.3)'
              }}
            >
              <TrendingUp 
                className="w-10 h-10" 
                style={{
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                }}
              />
            </div>
            <div>
              <p 
                className="text-5xl mb-2"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                }}
              >
                {formatarHoras(totalGeralHoras)}
              </p>
              <p 
                className="text-sm"
                style={{
                  color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                }}
              >
                {t.statistics.dedicatedToMinistry}
              </p>
            </div>
          </div>
        </Card>

        {/* Gráfico de Pizza */}
        {dadosPizzaHoras.length > 0 && (
          <Card 
            className="p-6"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
            }}
          >
            <h3 
              className="text-sm mb-4"
              style={{
                color: temaAtual === 'escuro' ? '#E5E7EB' : '#374151'
              }}
            >
              {t.statistics.timeDistribution}
            </h3>
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
          <h3 
            className="text-sm"
            style={{
              color: temaAtual === 'escuro' ? '#E5E7EB' : '#374151'
            }}
          >
            {t.statistics.breakdownByActivity}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t.statistics.houseToHouse, valor: horasCasaEmCasa, icon: Home, cor: '#F59E0B' },
              { label: t.statistics.returnVisits, valor: horasRevisita, icon: Sprout, cor: '#C8E046' },
              { label: t.statistics.bibleStudies, valor: horasEstudo, icon: BookOpen, cor: '#4A2C60' },
              { label: t.statistics.publicWitnessing, valor: horasTestemunhoPublico, icon: MapPin, cor: '#8B5CF6' },
              { label: t.statistics.phone, valor: horasTelefone, icon: Phone, cor: '#06B6D4' },
              { label: t.statistics.letter, valor: horasCarta, icon: Mail, cor: '#EC4899' },
              { label: t.statistics.informal, valor: horasInformal, icon: Briefcase, cor: '#6366F1' },
              { label: t.statistics.credit, valor: horasCredito, icon: Award, cor: '#F97316' },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <Card 
                  key={item.label} 
                  className="p-4"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon className="w-6 h-6 flex-shrink-0" style={{ color: item.cor }} />
                    <div className="flex-1">
                      <p 
                        className="text-lg"
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {formatarHoras(item.valor)}
                      </p>
                      <p 
                        className="text-xs"
                        style={{
                          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        {item.label}
                      </p>
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
          <p 
            className="text-center py-8"
            style={{
              color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
            }}
          >
            {t.statistics.noOccurrencesThisMonth.replace('{activity}', nomesAtividades[categoriaQuantidade])}
          </p>
        ) : (
          sessoesFiltradas.map((sessao) => {
            const atividadeEspecifica = sessao.atividades?.find(ativ => {
              const tipoNormalizado = categoriaQuantidade === 'estudo-biblico' ? 'estudo' : categoriaQuantidade;
              const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
              return ativTipoNormalizado === categoriaQuantidade || ativ.tipo === tipoNormalizado;
            });

            return (
              <Card 
                key={sessao.id} 
                className="p-4"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {sessao.tipo === 'campo' ? (
                        <Sprout className="w-4 h-4" style={{ color: '#C8E046' }} />
                      ) : (
                        <Clock 
                          className="w-4 h-4" 
                          style={{ 
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }} 
                        />
                      )}
                      <h4 
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {nomesAtividades[categoriaQuantidade]}
                      </h4>
                    </div>
                    <p 
                      className="text-sm"
                      style={{
                        color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                      }}
                    >
                      {new Date(sessao.data).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                      {' • '}
                      {sessao.horaInicio}
                      {sessao.horaFim && ` - ${sessao.horaFim}`}
                    </p>
                    {atividadeEspecifica?.detalhes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle 
                          className="w-3 h-3 flex-shrink-0 mt-0.5" 
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        />
                        <p 
                          className="text-xs"
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        >
                          {atividadeEspecifica.detalhes}
                        </p>
                      </div>
                    )}
                    {sessao.observacoes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle 
                          className="w-3 h-3 flex-shrink-0 mt-0.5" 
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        />
                        <p 
                          className="text-xs italic"
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        >
                          {sessao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge 
                    className="text-white"
                    style={{
                      backgroundColor: '#C8E046',
                      color: '#1F2937'
                    }}
                  >
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
          <p 
            className="text-center py-8"
            style={{
              color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
            }}
          >
            {t.statistics.noSessionsThisMonth.replace('{activity}', nomesAtividades[categoriaHoras])}
          </p>
        ) : (
          sessoesFiltradas.map((sessao) => {
            const atividadeEspecifica = sessao.atividades?.find(ativ => {
              const tipoNormalizado = categoriaHoras === 'estudo-biblico' ? 'estudo' : categoriaHoras;
              const ativTipoNormalizado = ativ.tipo === 'estudo' ? 'estudo-biblico' : ativ.tipo;
              return ativTipoNormalizado === categoriaHoras || ativ.tipo === tipoNormalizado;
            });

            return (
              <Card 
                key={sessao.id} 
                className="p-4"
                style={{
                  backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {sessao.tipo === 'campo' ? (
                        <Sprout className="w-4 h-4" style={{ color: '#C8E046' }} />
                      ) : (
                        <Clock 
                          className="w-4 h-4" 
                          style={{ 
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }} 
                        />
                      )}
                      <h4 
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {nomesAtividades[categoriaHoras]}
                      </h4>
                    </div>
                    <p 
                      className="text-sm"
                      style={{
                        color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                      }}
                    >
                      {new Date(sessao.data).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                      {' • '}
                      {sessao.horaInicio}
                      {sessao.horaFim && ` - ${sessao.horaFim}`}
                    </p>
                    {atividadeEspecifica?.detalhes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle 
                          className="w-3 h-3 flex-shrink-0 mt-0.5" 
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        />
                        <p 
                          className="text-xs"
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        >
                          {atividadeEspecifica.detalhes}
                        </p>
                      </div>
                    )}
                    {sessao.observacoes && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <MessageCircle 
                          className="w-3 h-3 flex-shrink-0 mt-0.5" 
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        />
                        <p 
                          className="text-xs italic"
                          style={{
                            color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                          }}
                        >
                          {sessao.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge 
                    className="text-white"
                    style={{
                      backgroundColor: '#C8E046',
                      color: '#1F2937'
                    }}
                  >
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
    <div 
      className="min-h-screen pb-20" 
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
        <div className="flex items-center gap-4 px-6 pt-12 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVoltar}
            className="p-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl">{t.statistics.title}</h2>
          </div>
        </div>

        {/* Tabs principais - Metas, Atividades, Horas */}
        <div className="px-6 pb-4">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setVisualizacao('metas')}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                visualizacao === 'metas'
                  ? 'shadow-md'
                  : ''
              }`}
              style={visualizacao === 'metas' ? { 
                backgroundColor: '#C8E046', 
                color: '#1F2937',
                fontWeight: 600
              } : {
                backgroundColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: 400
              }}
              onMouseEnter={(e) => {
                if (visualizacao !== 'metas') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (visualizacao !== 'metas') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <Target className="w-4 h-4" />
              <span>{t.statistics.goals}</span>
            </button>
            <button
              onClick={() => setVisualizacao('quantidades')}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                visualizacao === 'quantidades'
                  ? 'shadow-md'
                  : ''
              }`}
              style={visualizacao === 'quantidades' ? { 
                backgroundColor: '#C8E046', 
                color: '#1F2937',
                fontWeight: 600
              } : {
                backgroundColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: 400
              }}
              onMouseEnter={(e) => {
                if (visualizacao !== 'quantidades') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (visualizacao !== 'quantidades') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.statistics.activities}</span>
            </button>
            <button
              onClick={() => setVisualizacao('horas')}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                visualizacao === 'horas'
                  ? 'shadow-md'
                  : ''
              }`}
              style={visualizacao === 'horas' ? { 
                backgroundColor: '#C8E046', 
                color: '#1F2937',
                fontWeight: 600
              } : {
                backgroundColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontWeight: 400
              }}
              onMouseEnter={(e) => {
                if (visualizacao !== 'horas') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (visualizacao !== 'horas') {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <Clock className="w-4 h-4" />
              <span>{t.statistics.hours}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtabs - apenas para Atividades e Horas - FORA DO HEADER ROXO */}
      {visualizacao !== 'metas' && (
        <div 
          className="px-6 pt-6 pb-4" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE'
          }}
        >
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
                      : temaAtual === 'escuro' 
                        ? 'bg-[#2A2A2A] text-gray-200 hover:bg-[#333333] border-2' 
                        : 'bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-900'
                    }
                  `}
                  style={isActive ? { 
                    backgroundColor: '#C8E046', 
                    color: '#1F2937', 
                    border: 'none' 
                  } : temaAtual === 'escuro' ? {
                    borderColor: 'rgba(200, 224, 70, 0.3)'
                  } : {}}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span 
                      className="ml-1 px-2 py-0.5 rounded-full text-xs"
                      style={isActive 
                        ? { backgroundColor: 'rgba(31, 41, 55, 0.3)', color: '#1F2937' }
                        : temaAtual === 'escuro'
                          ? { backgroundColor: 'rgba(200, 224, 70, 0.2)', color: '#C8E046' }
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
        {/* Controle de Ano de Serviço - Para Atividades e Horas (inclusive Total) */}
        {visualizacao !== 'metas' && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navegarAnoServico('anterior')}
                className="p-2"
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="text-center">
                <p 
                  className="text-xs"
                  style={{
                    color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                  }}
                >
                  {t.statistics.serviceYearLabel}
                </p>
                <h3 
                  style={{
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                  }}
                >
                  {getNomeAnoServico(anoServicoSelecionado)}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navegarAnoServico('proximo')}
                className="p-2"
                style={{ 
                  color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                disabled={anoServicoSelecionado === getAnoServicoAtual()}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        )}

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
            <Card 
              className="p-6"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              {visualizacao === 'quantidades' && (categoriaQuantidade === 'revisita' || categoriaQuantidade === 'estudo-biblico') ? (
                // Layout especial para Revisita e Estudo Bíblico na aba Quantidades
                <div className="text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto flex-shrink-0"
                    style={{ 
                      backgroundColor: temaAtual === 'escuro' 
                        ? `${CORES_ATIVIDADES[categoriaQuantidade]}30`
                        : `${CORES_ATIVIDADES[categoriaQuantidade]}20` 
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: CORES_ATIVIDADES[categoriaQuantidade] }} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Coluna 1: Ocorrências */}
                    <div 
                      className="border-r pr-4"
                      style={{
                        borderColor: temaAtual === 'escuro' ? '#374151' : '#E5E7EB'
                      }}
                    >
                      <p 
                        className="text-3xl mb-1"
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {configAtual!.valor}
                      </p>
                      <p 
                        className="text-sm"
                        style={{
                          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        {t.statistics.occurrencesThisMonth}
                      </p>
                    </div>
                    {/* Coluna 2: Pessoas */}
                    <div className="pl-2">
                      <p 
                        className="text-3xl mb-1"
                        style={{
                          color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                        }}
                      >
                        {categoriaQuantidade === 'revisita' ? totalPessoasRevisita : totalPessoasEstudo}
                      </p>
                      <p 
                        className="text-sm"
                        style={{
                          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        {categoriaQuantidade === 'revisita' 
                          ? (totalPessoasRevisita !== 1 ? t.statistics.peopleRegisteredPlural : t.statistics.peopleRegistered)
                          : (totalPessoasEstudo !== 1 ? t.statistics.activeStudentsPlural : t.statistics.activeStudent)
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Layout padrão para outras categorias
                <div className="text-center space-y-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto"
                    style={{ 
                      backgroundColor: temaAtual === 'escuro'
                        ? `${CORES_ATIVIDADES[visualizacao === 'quantidades' ? categoriaQuantidade : categoriaHoras]}30`
                        : `${CORES_ATIVIDADES[visualizacao === 'quantidades' ? categoriaQuantidade : categoriaHoras]}20` 
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color: CORES_ATIVIDADES[visualizacao === 'quantidades' ? categoriaQuantidade : categoriaHoras] }} />
                  </div>
                  <div>
                    <p 
                      className="text-4xl mb-2"
                      style={{
                        color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937'
                      }}
                    >
                      {configAtual!.valor}
                    </p>
                    <p 
                      className="text-sm"
                      style={{
                        color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
                      }}
                    >
                      {configAtual!.subtitulo}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Gráfico */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
              }}
            >
              <h3 
                className="text-sm mb-4"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#374151'
                }}
              >
                {t.statistics.serviceYearLabel} {getNomeAnoServico(anoServicoSelecionado)}
              </h3>
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
              <h3 
                className="text-sm mb-4"
                style={{
                  color: temaAtual === 'escuro' ? '#E5E7EB' : '#374151'
                }}
              >
                {t.statistics.details}
              </h3>
              {visualizacao === 'quantidades' ? renderListaQuantidades() : renderListaHoras()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}