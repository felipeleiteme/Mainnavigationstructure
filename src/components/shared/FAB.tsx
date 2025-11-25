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
        className="fixed bottom-20 right-4 rounded-full h-14 px-6 shadow-lg z-40 transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: '#4A2C60', color: 'white' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3D234D'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A2C60'}
      >
        <Plus className="w-5 h-5 mr-2" />
        Novo Estudo
      </Button>
    );
  }

  // FAB para Iniciar Ministério (sem sessão ativa)
  if (!sessaoAtiva) {
    return (
      <Button
        size="lg"
        onClick={onIniciarMinisterio}
        className="fixed bottom-20 right-4 rounded-full h-14 px-6 shadow-lg z-40 transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: '#4A2C60', color: 'white' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3D234D'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A2C60'}
      >
        <Plus className="w-5 h-5 mr-2" />
        Nova Atividade
      </Button>
    );
  }

  // FAB para Sessão Ativa
  const corSessao = sessaoAtiva.pausada 
    ? { backgroundColor: '#FF9800', hoverColor: '#F57C00' } // Warning laranja
    : { backgroundColor: '#C8E046', hoverColor: '#A0B638' }; // Verde lima ativo
  
  return (
    <Button
      size="lg"
      onClick={onAbrirControles}
      className={`fixed bottom-20 right-4 rounded-full h-14 px-6 shadow-lg z-40 transition-all duration-300 ${
        pulseAnimation && !sessaoAtiva.pausada ? 'animate-pulse' : ''
      }`}
      style={{ backgroundColor: corSessao.backgroundColor, color: sessaoAtiva.pausada ? 'white' : '#4A2C60' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = corSessao.hoverColor}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = corSessao.backgroundColor}
    >
      {sessaoAtiva.pausada ? (
        <Pause className="w-5 h-5 mr-2" />
      ) : (
        <Clock className="w-5 h-5 mr-2" />
      )}
      {sessaoAtiva.pausada ? '⏸️ Pausado - ' : '⏱️ '}
      {formatarTempo(sessaoAtiva.tempoDecorrido)}
    </Button>
  );
}