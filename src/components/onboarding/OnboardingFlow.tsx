import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ChevronRight, Sprout, Rocket, BookOpen, Sun, Cloud, Moon, Lock, Clock, ArrowLeft, Check } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ThemeService } from '../../services/themeService';

interface OnboardingFlowProps {
  onComplete: (userData: OnboardingData) => void;
}

export interface OnboardingData {
  tipoPublicador: 'publicador' | 'auxiliar' | 'regular';
  metaHoras: number;
  cronograma: boolean[][];
  versiculoAno: string;
  sincronizacao: 'google' | 'apple' | 'skip';
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<Partial<OnboardingData>>({
    tipoPublicador: 'publicador',
    metaHoras: 10,
    cronograma: Array(3).fill(null).map(() => Array(7).fill(false)),
    versiculoAno: '',
    sincronizacao: 'skip',
  });
  const [metaPersonalizada, setMetaPersonalizada] = useState('15');
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Escutar mudanças de tema
  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };

    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);

  const nextStep = () => setStep(step + 1);
  const handleComplete = () => {
    onComplete(userData as OnboardingData);
  };

  const setTipoPublicador = (tipo: 'publicador' | 'auxiliar' | 'regular') => {
    if (tipo === 'auxiliar') {
      // Para pioneiro auxiliar, mostrar tela de meta
      setUserData({ ...userData, tipoPublicador: tipo });
      nextStep();
    } else {
      // Para outros tipos, definir meta e pular para próxima tela
      const metaPadrao = tipo === 'regular' ? 50 : 10;
      setUserData({ ...userData, tipoPublicador: tipo, metaHoras: metaPadrao });
      // Pular para tela de versículo (step 2)
      setStep(2);
    }
  };

  const definirMetaAuxiliar = (tipo: 'padrao' | 'personalizada') => {
    const meta = tipo === 'padrao' ? 30 : parseInt(metaPersonalizada) || 15;
    setUserData({ ...userData, metaHoras: meta });
    nextStep();
  };

  const toggleCronograma = (periodo: number, dia: number) => {
    const novoCronograma = userData.cronograma!.map((row, i) =>
      i === periodo ? row.map((val, j) => (j === dia ? !val : val)) : row
    );
    setUserData({ ...userData, cronograma: novoCronograma });
  };

  // Tela 0: Boas-vindas
  if (step === 0) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{
          backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#FDF8EE'
        }}
      >
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <ImageWithFallback 
              src="https://i.ibb.co/SD0CyMBq/logo.png" 
              alt="Mynis Logo" 
              className="w-48 h-48 object-contain"
            />
          </div>
          
          <h1 
            className="text-3xl mb-4"
            style={{ color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937' }}
          >
            Bem-vindo ao Mynis!
          </h1>
          <p 
            className="mb-2"
            style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#6B7280' }}
          >
            Vamos organizar seu ministério juntos para que ninguém seja esquecido.
          </p>
          <p 
            className="text-sm mb-8"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            Leva apenas 2 minutos!
          </p>
          
          <button
            className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
            }}
            onClick={nextStep}
          >
            Começar
          </button>
        </div>
      </div>
    );
  }

  // Tela 1: Como você serve?
  if (step === 1) {
    return (
      <div 
        className="min-h-screen flex flex-col p-6"
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#FDF8EE' }}
      >
        {/* Botão Voltar */}
        <div className="max-w-md mx-auto w-full mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(step - 1)}
            className="p-2"
            style={{ 
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 
            className="text-3xl mb-2 text-center"
            style={{ color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937' }}
          >
            Como você serve hoje?
          </h2>
          <p 
            className="text-center mb-8"
            style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
          >
            Escolha a opção que melhor descreve você
          </p>

          <div className="space-y-4">
            {/* Publicador Regular */}
            <Card
              className="p-6 cursor-pointer transition-all border-2"
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF',
                borderColor: userData.tipoPublicador === 'publicador' 
                  ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                  : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.08)' : 'transparent')
              }}
              onClick={() => setTipoPublicador('publicador')}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center" 
                  style={{ 
                    backgroundColor: temaAtual === 'escuro' 
                      ? '#4A4060' 
                      : 'rgba(74, 44, 96, 0.1)' 
                  }}
                >
                  <BookOpen 
                    className="w-8 h-8" 
                    style={{ color: temaAtual === 'escuro' ? '#C8B3E0' : '#4A2C60' }} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 
                      className="text-base"
                      style={{ color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937' }}
                    >
                      Publicador Regular
                    </h3>
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.1)',
                        color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60',
                        border: 'none'
                      }}
                    >
                      10h
                    </Badge>
                  </div>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: temaAtual === 'escuro' ? '#B8B8D0' : '#6B7280' }}
                  >
                    Servindo ao meu ritmo
                  </p>
                </div>
              </div>
            </Card>

            {/* Pioneiro Auxiliar */}
            <Card
              className="p-6 cursor-pointer transition-all border-2"
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF',
                borderColor: userData.tipoPublicador === 'auxiliar' 
                  ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                  : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.08)' : 'transparent')
              }}
              onClick={() => setTipoPublicador('auxiliar')}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center" 
                  style={{ 
                    backgroundColor: temaAtual === 'escuro' 
                      ? '#4A4060' 
                      : '#E6DFF0' 
                  }}
                >
                  <Sprout 
                    className="w-8 h-8" 
                    style={{ color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60' }} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 
                      className="text-base"
                      style={{ color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937' }}
                    >
                      Pioneiro Auxiliar
                    </h3>
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: '#FF9800',
                        color: '#FFFFFF',
                        border: 'none'
                      }}
                    >
                      Oficial
                    </Badge>
                  </div>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: temaAtual === 'escuro' ? '#B8B8D0' : '#6B7280' }}
                  >
                    Escolha sua meta: 15h ou 30h
                  </p>
                </div>
              </div>
            </Card>

            {/* Pioneiro Regular */}
            <Card
              className="p-6 cursor-pointer transition-all border-2"
              style={{ 
                backgroundColor: temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF',
                borderColor: userData.tipoPublicador === 'regular' 
                  ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                  : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.08)' : 'transparent')
              }}
              onClick={() => setTipoPublicador('regular')}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center" 
                  style={{ 
                    backgroundColor: temaAtual === 'escuro' 
                      ? '#4A4060' 
                      : 'rgba(200, 224, 70, 0.2)' 
                  }}
                >
                  <Rocket 
                    className="w-8 h-8" 
                    style={{ color: temaAtual === 'escuro' ? '#D4E969' : '#4A2C60' }} 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 
                      className="text-base"
                      style={{ color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937' }}
                    >
                      Pioneiro Regular
                    </h3>
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: '#FF9800',
                        color: '#FFFFFF',
                        border: 'none'
                      }}
                    >
                      Oficial
                    </Badge>
                  </div>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: temaAtual === 'escuro' ? '#B8B8D0' : '#6B7280' }}
                  >
                    Meta de 50 horas
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela 1.5: Escolher meta (apenas para Pioneiro Auxiliar)
  if (step === 2 && userData.tipoPublicador === 'auxiliar') {
    return (
      <div 
        className="min-h-screen flex flex-col p-6"
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#FDF8EE' }}
      >
        {/* Botão Voltar */}
        <div className="max-w-md mx-auto w-full mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="p-2"
            style={{ 
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 
            className="text-3xl mb-2 text-center"
            style={{ color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937' }}
          >
            Qual sua meta de horas?
          </h2>
          <p 
            className="text-center mb-8"
            style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
          >
            Você pode ajustar isso depois, sem problemas
          </p>

          <Card 
            className="p-6 mb-8"
            style={{ 
              backgroundColor: temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF',
              borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
            }}
          >
            <div className="space-y-6">
              {/* Meta padrão (30h) */}
              <div>
                <p 
                  className="text-sm mb-3"
                  style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
                >
                  Meta padrão (recomendado)
                </p>
                <Button
                  className="w-full h-16 text-2xl hover:opacity-90 border-2 transition-all"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : '#F3F0FA',
                    color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937',
                    borderColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                  }}
                  onClick={() => definirMetaAuxiliar('padrao')}
                >
                  30 horas
                </Button>
              </div>

              <div className="text-center" style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>
                ou
              </div>

              {/* Meta personalizada */}
              <div>
                <p 
                  className="text-sm mb-3"
                  style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
                >
                  Meta personalizada
                </p>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={metaPersonalizada}
                    onChange={(e) => setMetaPersonalizada(e.target.value)}
                    className="h-16 text-2xl text-center border-2"
                    style={{
                      backgroundColor: temaAtual === 'escuro' ? '#4A4060' : '#FFFFFF',
                      color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937',
                      borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8'
                    }}
                    min="1"
                    max="100"
                  />
                  <span 
                    className="text-lg"
                    style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
                  >
                    horas
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <button
            className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
            }}
            onClick={() => definirMetaAuxiliar('personalizada')}
          >
            Continuar
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Tela 2 (ou 3 para auxiliar): Versículo do Ano
  if ((step === 2 && userData.tipoPublicador !== 'auxiliar') || (step === 3 && userData.tipoPublicador === 'auxiliar')) {
    return (
      <div 
        className="min-h-screen flex flex-col p-6"
        style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#FDF8EE' }}
      >
        {/* Botão Voltar */}
        <div className="max-w-md mx-auto w-full mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(step - 1)}
            className="p-2"
            style={{ 
              color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.1)' : 'rgba(74, 44, 96, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 
            className="text-3xl mb-2 text-center"
            style={{ color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937' }}
          >
            Qual é o seu versículo do ano?
          </h2>
          <p 
            className="text-center mb-8"
            style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
          >
            Um texto bíblico que guia seu ministério este ano
          </p>

          <textarea
            placeholder="Ex: Filhos, vocês são de Deus — 1 João 4:4"
            value={userData.versiculoAno}
            onChange={(e) => setUserData({ ...userData, versiculoAno: e.target.value })}
            className="w-full h-32 p-4 rounded-lg resize-none mb-8 border-2"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF',
              color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937',
              borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8',
              outline: 'none'
            }}
          />

          <div className="space-y-3">
            <button
              className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
                border: 'none',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
              }}
              onClick={nextStep}
              disabled={!userData.versiculoAno?.trim()}
            >
              Continuar
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>

            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              style={{ 
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                backgroundColor: 'transparent'
              }}
              onClick={nextStep}
            >
              Pular esta etapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Última tela: Sincronização
  return (
    <div 
      className="min-h-screen flex flex-col p-6"
      style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#FDF8EE' }}
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.1)' }}
          >
            <Lock 
              className="w-10 h-10" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }}
            />
          </div>
          
          <h2 
            className="text-3xl mb-2"
            style={{ color: temaAtual === 'escuro' ? '#E5E7EB' : '#1F2937' }}
          >
            Tudo pronto! 🎉
          </h2>
          <p 
            className="mb-2"
            style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
          >
            Seus dados ficam 100% no seu dispositivo. Nenhuma informação é enviada para servidores externos.
          </p>
          <p 
            className="text-sm"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#9CA3AF' }}
          >
            Mynis respeita sua privacidade. Você tem controle total.
          </p>
        </div>

        <button
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
            color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF',
            border: 'none',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#B5CC3D' : '#5A3C70';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60';
          }}
          onClick={handleComplete}
        >
          Começar a usar o Mynis
          <Check className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}