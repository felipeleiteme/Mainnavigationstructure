import { ArrowLeft, CheckCircle2, XCircle, Calendar, FileText, BookMarked, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { DataService, Revisita } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { SmartNotificationManager } from '../../utils/notifications/smartNotifications';
import { ThemeService } from '../../services/themeService';

interface RegistrarVisitaPageProps {
  revisitaId: string;
  onVoltar: () => void;
}

export default function RegistrarVisitaPage({ revisitaId, onVoltar }: RegistrarVisitaPageProps) {
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [revisita, setRevisita] = useState<Revisita | null>(null);
  const [formData, setFormData] = useState({
    encontrou: true,
    observacoes: '',
    publicacoesDeixadas: '',
    proximaVisita: '',
    horarioProximaVisita: '14:00', // Novo campo
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  useEffect(() => {
    const revisitas = DataService.getRevisitas();
    const revisitaEncontrada = revisitas.find(r => r.id === revisitaId);
    if (revisitaEncontrada) {
      setRevisita(revisitaEncontrada);
    }
  }, [revisitaId]);

  const handleSalvar = () => {
    if (!revisita) return;

    if (!formData.proximaVisita) {
      toast.error('Precisamos da data da visita');
      return;
    }

    if (!formData.observacoes.trim()) {
      toast.error('Como foi a conversa?');
      return;
    }

    try {
      DataService.registrarVisita(revisita.id, {
        encontrou: formData.encontrou,
        observacoes: formData.observacoes || undefined,
        publicacoesDeixadas: formData.publicacoesDeixadas 
          ? formData.publicacoesDeixadas.split(',').map(p => p.trim()).filter(Boolean)
          : undefined,
        proximaVisita: formData.proximaVisita || undefined,
      });

      // Agendar notificações inteligentes para próxima visita (se agendada)
      if (formData.proximaVisita && formData.horarioProximaVisita) {
        SmartNotificationManager.scheduleRevisitaNotification(
          revisita.id,
          revisita.nome,
          formData.proximaVisita,
          formData.horarioProximaVisita,
          revisita.endereco
        );
      }

      toast.success(
        formData.encontrou 
          ? `Visita registrada! 🌱` 
          : 'Tentativa registrada',
        {
          description: formData.encontrou
            ? `Continue cultivando essa amizade com ${revisita.nome}`
            : `Tente novamente em outro momento`
        }
      );

      onVoltar();
    } catch (error) {
      toast.error('Erro ao registrar visita');
      console.error(error);
    }
  };

  if (!revisita) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' }}
      >
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1C1C1C' : '#FDF8EE' }}
    >
      {/* Header fixo */}
      <div 
        className="sticky top-0 z-10 text-white" 
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
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
            <h2 className="text-xl">Registrar Visita</h2>
            <p className="text-sm opacity-90">Como foi a conversa com {revisita.nome}?</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Resultado da Visita */}
        <Card className="p-6">
          <Label className="mb-3 block text-gray-700">Resultado da Visita *</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, encontrou: true }))}
              className="p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
              style={
                formData.encontrou
                  ? { backgroundColor: '#4A2C60', borderColor: '#4A2C60', color: 'white' }
                  : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#374151' }
              }
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-sm">Encontrei</span>
            </button>

            <button
              onClick={() => setFormData(prev => ({ ...prev, encontrou: false }))}
              className="p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
              style={
                !formData.encontrou
                  ? { backgroundColor: '#4A2C60', borderColor: '#4A2C60', color: 'white' }
                  : { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#374151' }
              }
            >
              <XCircle className="w-6 h-6" />
              <span className="text-sm">Não encontrei</span>
            </button>
          </div>
        </Card>

        {/* Card: Detalhes da Visita */}
        <Card className="p-6">
          <div className="space-y-5">
            {/* Observações */}
            <div>
              <Label htmlFor="observacoes" className="flex items-center gap-2 mb-2 text-gray-700">
                <FileText className="w-4 h-4" style={{ color: '#4A2C60' }} />
                Observações da Visita
              </Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder={
                  formData.encontrou
                    ? "Como foi a conversa? O que vocês discutiram?"
                    : "Deixou recado? Que horas tentou?"
                }
                rows={6}
                className="resize-none border-2 bg-white focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.encontrou 
                  ? "Registre detalhes importantes da conversa"
                  : "Anote o horário e se deixou algum recado"
                }
              </p>
            </div>

            {/* Publicações (apenas se encontrou) */}
            {formData.encontrou && (
              <div>
                <Label htmlFor="publicacoes" className="flex items-center gap-2 mb-2 text-gray-700">
                  <BookMarked className="w-4 h-4" style={{ color: '#4A2C60' }} />
                  Publicações Deixadas
                </Label>
                <Input
                  id="publicacoes"
                  value={formData.publicacoesDeixadas}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicacoesDeixadas: e.target.value }))}
                  placeholder="A Sentinela 15/11, Tratado..."
                  className="h-14 border-2 bg-white focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: '#D8CEE8', outline: 'none' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separe por vírgula se deixou mais de uma
                </p>
              </div>
            )}

            {/* Próxima Visita */}
            <div>
              <Label htmlFor="proximaVisita" className="flex items-center gap-2 mb-2 text-gray-700">
                <Calendar className="w-4 h-4" style={{ color: '#4A2C60' }} />
                Agendar Próxima Visita
              </Label>
              <Input
                id="proximaVisita"
                type="date"
                value={formData.proximaVisita}
                onChange={(e) => setFormData(prev => ({ ...prev, proximaVisita: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="h-14 border-2 bg-white focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.encontrou
                  ? "Quando pretende visitá-la novamente?"
                  : "Quando vai tentar novamente?"
                }
              </p>
            </div>

            {/* Horário da Próxima Visita */}
            {formData.proximaVisita && (
              <div>
                <Label htmlFor="horarioProximaVisita" className="flex items-center gap-2 mb-2 text-gray-700">
                  <Clock className="w-4 h-4" style={{ color: '#4A2C60' }} />
                  Horário da Próxima Visita
                </Label>
                <Input
                  id="horarioProximaVisita"
                  type="time"
                  value={formData.horarioProximaVisita}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioProximaVisita: e.target.value }))}
                  className="h-14 border-2 bg-white focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: '#D8CEE8', outline: 'none' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#4A2C60'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#D8CEE8'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Selecione o horário para a próxima visita
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          className="w-full h-14 border-0"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            if (temaAtual === 'escuro') {
              e.currentTarget.style.backgroundColor = '#B5CC3D';
            } else {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (temaAtual === 'escuro') {
              e.currentTarget.style.backgroundColor = '#C8E046';
            } else {
              e.currentTarget.style.opacity = '1';
            }
          }}
          onClick={handleSalvar}
        >
          Salvar Registro
        </Button>
      </div>
    </div>
  );
}