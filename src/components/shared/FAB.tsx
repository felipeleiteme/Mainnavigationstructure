import { useState, useEffect } from 'react';
import { Clock, Pause, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface FABProps {
  variant: 'inicio-ministerio' | 'novo-estudo';
  sessaoAtiva?: {
    tempoDecorrido: number; // em minutos
    pausada: boolean;
  };
  onIniciarMinisterio?: () => void;
  onAbrirControles?: () => void;
  onNovoEstudo?: () => void;
}

export default function FAB({ 
  variant, 
  sessaoAtiva, 
  onIniciarMinisterio,
  onAbrirControles,
  onNovoEstudo
}: FABProps) {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Animar quando sessão está ativa
  useEffect(() => {
    if (sessaoAtiva && !sessaoAtiva.pausada) {
      setPulseAnimation(true);
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [sessaoAtiva]);

  // Formatar tempo decorrido
  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h${mins.toString().padStart(2, '0')}min`;
    }
    return `${mins}min`;
  };

  // FAB para Novo Estudo (Tab Estudos)
  if (variant === 'novo-estudo') {
    return (
      <Button
        size="lg"
        onClick={onNovoEstudo}
        className="fixed bottom-20 right-4 rounded-full h-14 px-6 bg-secondary-500 text-primary-500 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0"
      >
        <Plus className="w-5 h-5 mr-2" />
        <span className="font-medium">Novo Estudo</span>
      </Button>
    );
  }

  // FAB para Iniciar Ministério (sem sessão ativa)
  if (!sessaoAtiva) {
    return (
      <Button
        size="lg"
        onClick={onIniciarMinisterio}
        className="fixed bottom-20 right-4 rounded-full h-14 px-6 bg-secondary-500 text-primary-500 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0"
      >
        <Plus className="w-5 h-5 mr-2" />
        <span className="font-medium">Nova Atividade</span>
      </Button>
    );
  }

  // FAB para Sessão Ativa
  // Sessão pausada: laranja com branco
  // Sessão ativa: secundária (verde-lima) com primária (roxo)
  const sessaoPausada = sessaoAtiva.pausada;
  
  return (
    <Button
      size="lg"
      onClick={onAbrirControles}
      className={`fixed bottom-20 right-4 rounded-full h-14 px-6 shadow-lg hover:shadow-xl z-40 transition-all duration-200 hover:scale-110 active:scale-100 border-0 ${
        sessaoPausada 
          ? 'bg-orange-500 text-white' 
          : 'bg-secondary-500 text-primary-500'
      } ${
        pulseAnimation && !sessaoPausada ? 'animate-pulse' : ''
      }`}
    >
      {sessaoPausada ? (
        <Pause className="w-5 h-5 mr-2" />
      ) : (
        <Clock className="w-5 h-5 mr-2" />
      )}
      <span className="font-medium">
        {sessaoPausada ? 'Pausado - ' : ''}
        {formatarTempo(sessaoAtiva.tempoDecorrido)}
      </span>
    </Button>
  );
}
