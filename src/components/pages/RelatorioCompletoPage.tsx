import { ArrowLeft, Clock, BookOpen, Users, FileText, Video, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { DataService } from '../../services/dataService';

interface RelatorioCompletoPageProps {
  onVoltar: () => void;
}

export default function RelatorioCompletoPage({ onVoltar }: RelatorioCompletoPageProps) {
  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Calcular estatísticas reais do DataService (igual ao PerfilTab)
  const relatorioAtual = {
    horasCampo: DataService.getTotalHorasCampo(),
    horasCredito: DataService.getTotalHorasCredito(),
    estudos: DataService.getTotalEstudosMes(),
    revisitas: DataService.getTotalRevisitasNovasMes(),
    publicacoes: DataService.getTotalPublicacoesMes(),
    videos: DataService.getTotalVideosMes(),
  };

  const perfil = DataService.getPerfil();
  const metaMensal = DataService.getMetaMensal();
  const horasTotal = relatorioAtual.horasCampo + relatorioAtual.horasCredito;
  const progressoMeta = Math.round((horasTotal / metaMensal) * 100);

  const formatarHoras = (horas: number): string => {
    const h = Math.floor(horas);
    const min = Math.round((horas - h) * 60);
    if (min === 0) return `${h}h`;
    if (h === 0) return `${min}min`;
    return `${h}h${min}`;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
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
            <h2 className="text-xl">Relatório Completo</h2>
            <p className="text-sm opacity-90">Novembro 2025</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Resumo de Horas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" style={{ color: '#4A2C60' }} />
            <h3 className="text-sm">Resumo de Horas</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <span className="text-sm">Horas de Campo</span>
              <span className="text-sm" style={{ color: '#4A2C60' }}>{formatarHoras(relatorioAtual.horasCampo)}</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(200, 224, 70, 0.15)' }}>
              <span className="text-sm">Horas de Crédito</span>
              <span className="text-sm" style={{ color: '#4A2C60' }}>{formatarHoras(relatorioAtual.horasCredito)}</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.08)', borderColor: '#4A2C60' }}>
              <span className="text-sm">Total</span>
              <span className="text-sm" style={{ color: '#4A2C60' }}>{formatarHoras(horasTotal)}</span>
            </div>
            <div className="mt-3">
              <Progress value={progressoMeta} className="h-2 mt-2" />
              <p className="text-xs text-gray-600 text-center mt-2">{progressoMeta}% da meta ({metaMensal}h)</p>
            </div>
          </div>
        </div>

        {/* Atividades */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: '#4A2C60' }} />
            <h3 className="text-sm">Atividades</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 text-center border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
              <BookOpen className="w-6 h-6 mx-auto mb-2" style={{ color: '#4A2C60' }} />
              <p className="text-3xl mb-1" style={{ color: '#4A2C60' }}>{relatorioAtual.estudos}</p>
              <p className="text-xs text-gray-600">Estudos Bíblicos</p>
            </Card>
            <Card className="p-4 text-center border-2" style={{ backgroundColor: 'rgba(200, 224, 70, 0.15)', borderColor: 'rgba(200, 224, 70, 0.4)' }}>
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: '#4A2C60' }} />
              <p className="text-3xl mb-1" style={{ color: '#4A2C60' }}>{relatorioAtual.revisitas}</p>
              <p className="text-xs text-gray-600">Revisitas Novas</p>
            </Card>
            <Card className="p-4 text-center border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
              <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#4A2C60' }} />
              <p className="text-3xl mb-1" style={{ color: '#4A2C60' }}>{relatorioAtual.publicacoes}</p>
              <p className="text-xs text-gray-600">Publicações</p>
            </Card>
            <Card className="p-4 text-center border-2" style={{ backgroundColor: 'rgba(200, 224, 70, 0.15)', borderColor: 'rgba(200, 224, 70, 0.4)' }}>
              <Video className="w-6 h-6 mx-auto mb-2" style={{ color: '#4A2C60' }} />
              <p className="text-3xl mb-1" style={{ color: '#4A2C60' }}>{relatorioAtual.videos}</p>
              <p className="text-xs text-gray-600">Vídeos</p>
            </Card>
          </div>
        </div>

        {/* Progresso Semanal */}
        <div>
          <h3 className="text-sm mb-3">📅 Progresso Semanal</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-600">Semana 1</span>
                <span className="text-xs" style={{ color: '#4A2C60' }}>12h</span>
              </div>
              <Progress value={80} className="h-1" />
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-600">Semana 2</span>
                <span className="text-xs" style={{ color: '#4A2C60' }}>10h</span>
              </div>
              <Progress value={67} className="h-1" />
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-600">Semana 3</span>
                <span className="text-xs" style={{ color: '#4A2C60' }}>15h</span>
              </div>
              <Progress value={100} className="h-1" />
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(200, 224, 70, 0.15)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-600">Semana 4</span>
                <span className="text-xs" style={{ color: '#4A2C60' }}>8h (em andamento)</span>
              </div>
              <Progress value={53} className="h-1" />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <h3 className="text-sm mb-3">💭 Observações</h3>
          <Card className="p-4 border-2" style={{ backgroundColor: '#FDF8EE', borderColor: 'rgba(200, 224, 70, 0.4)' }}>
            <p className="text-sm text-gray-700 leading-relaxed">
              Mês produtivo! Consegui iniciar 2 novos estudos e fazer 5 revisitas novas. 
              Continuar focando na qualidade das conversas.
            </p>
          </Card>
        </div>

        {/* Estatísticas Adicionais */}
        <Card className="p-5 border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.05)', borderColor: 'rgba(74, 44, 96, 0.2)' }}>
          <h3 className="text-sm mb-4">📊 Estatísticas do Mês</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Média semanal</span>
              <span className="text-sm" style={{ color: '#4A2C60' }}>11h15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dias de campo</span>
              <span className="text-sm" style={{ color: '#4A2C60' }}>18 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversas significativas</span>
              <span className="text-sm" style={{ color: '#4A2C60' }}>42</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Botão fixo na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4">
        <Button 
          className="w-full text-white"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={onVoltar}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}