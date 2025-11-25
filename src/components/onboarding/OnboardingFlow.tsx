import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ChevronRight, Sprout, Rocket, BookOpen } from 'lucide-react';

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
    metaHoras: 0,
    cronograma: Array(3).fill(null).map(() => Array(7).fill(false)),
    versiculoAno: '',
    sincronizacao: 'skip',
  });

  const nextStep = () => setStep(step + 1);
  const handleComplete = () => {
    onComplete(userData as OnboardingData);
  };

  const setTipoPublicador = (tipo: 'publicador' | 'auxiliar' | 'regular') => {
    const metaPadrao = tipo === 'regular' ? 70 : tipo === 'auxiliar' ? 50 : 0;
    setUserData({ ...userData, tipoPublicador: tipo, metaHoras: metaPadrao });
    nextStep();
  };

  const toggleCronograma = (periodo: number, dia: number) => {
    const novoCronograma = userData.cronograma!.map((row, i) =>
      i === periodo ? row.map((val, j) => (j === dia ? !val : val)) : row
    );
    setUserData({ ...userData, cronograma: novoCronograma });
  };

  // Tela 1: Boas-vindas
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#4A2C60' }}>
            <Sprout className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl mb-4 text-gray-900">Mynis</h1>
          <p className="text-xl text-gray-600 mb-8">
            Seu melhor no ministério
          </p>
          
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(74, 44, 96, 0.1) 0%, rgba(200, 224, 70, 0.15) 100%)' }}>
              <Sprout className="w-24 h-24" style={{ color: '#4A2C60' }} />
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full hover:opacity-90"
            style={{ backgroundColor: '#4A2C60' }}
            onClick={nextStep}
          >
            Começar
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Tela 2: Como você serve?
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 className="text-3xl mb-2 text-center">Como você serve hoje?</h2>
          <p className="text-gray-600 text-center mb-8">Selecione sua forma de servir</p>

          <div className="space-y-4">
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 transition-all"
              style={{ 
                borderColor: 'transparent',
                ...(userData.tipoPublicador === 'publicador' ? { borderColor: '#4A2C60', backgroundColor: '#F5F2F7' } : {})
              }}
              onClick={() => setTipoPublicador('publicador')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
                  <BookOpen className="w-8 h-8" style={{ color: '#4A2C60' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Publicador</h3>
                  <p className="text-sm text-gray-600">Servindo ao meu ritmo</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 transition-all"
              style={{ 
                borderColor: 'transparent',
                ...(userData.tipoPublicador === 'auxiliar' ? { borderColor: '#4A2C60', backgroundColor: '#F5F2F7' } : {})
              }}
              onClick={() => setTipoPublicador('auxiliar')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E6DFF0' }}>
                  <Sprout className="w-8 h-8" style={{ color: '#4A2C60' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Pioneiro Auxiliar</h3>
                  <p className="text-sm text-gray-600">Meta de 50 horas</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 transition-all"
              style={{ 
                borderColor: 'transparent',
                ...(userData.tipoPublicador === 'regular' ? { borderColor: '#4A2C60', backgroundColor: '#F5F2F7' } : {})
              }}
              onClick={() => setTipoPublicador('regular')}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(200, 224, 70, 0.2)' }}>
                  <Rocket className="w-8 h-8" style={{ color: '#4A2C60' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-1">Pioneiro Regular</h3>
                  <p className="text-sm text-gray-600">Meta de 70 horas</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela 3: Sua meta (apenas para pioneiros)
  if (step === 2 && userData.tipoPublicador !== 'publicador') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 className="text-3xl mb-2 text-center">Qual sua meta de horas?</h2>
          <p className="text-gray-600 text-center mb-8">
            Você pode ajustar isso depois, sem problemas 😊
          </p>

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Meta padrão (recomendado)</label>
                <Button
                  variant={userData.metaHoras === (userData.tipoPublicador === 'regular' ? 70 : 50) ? 'default' : 'outline'}
                  className="w-full text-2xl h-16"
                  onClick={() => setUserData({ 
                    ...userData, 
                    metaHoras: userData.tipoPublicador === 'regular' ? 70 : 50 
                  })}
                >
                  {userData.tipoPublicador === 'regular' ? '70' : '50'} horas
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-gray-500">ou</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Meta personalizada</label>
                <Input
                  type="number"
                  placeholder="Digite suas horas"
                  className="text-center text-xl h-16 bg-white border-2"
                  style={{ borderColor: '#D8CEE8' }}
                  value={userData.metaHoras || ''}
                  onChange={(e) => setUserData({ ...userData, metaHoras: Number(e.target.value) })}
                />
              </div>
            </div>
          </Card>

          <Button 
            size="lg" 
            className="w-full hover:opacity-90"
            style={{ backgroundColor: '#4A2C60' }}
            onClick={nextStep}
            disabled={!userData.metaHoras}
          >
            Continuar
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Tela 4: Seu Cronograma
  if (step === 3 || (step === 2 && userData.tipoPublicador === 'publicador')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
          <h2 className="text-3xl mb-2 text-center">Quando você costuma sair ao campo?</h2>
          <p className="text-gray-600 text-center mb-8">
            Vamos te lembrar nos dias que você escolher
          </p>

          <Card className="p-6 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-3"></th>
                    <th className="text-center p-2">Seg</th>
                    <th className="text-center p-2">Ter</th>
                    <th className="text-center p-2">Qua</th>
                    <th className="text-center p-2">Qui</th>
                    <th className="text-center p-2">Sex</th>
                    <th className="text-center p-2">Sáb</th>
                    <th className="text-center p-2">Dom</th>
                  </tr>
                </thead>
                <tbody>
                  {['☀️ Manhã', '🌤️ Tarde', '🌙 Noite'].map((periodo, pIdx) => (
                    <tr key={pIdx} className="border-b">
                      <td className="py-3 pr-3 text-sm">{periodo}</td>
                      {[0, 1, 2, 3, 4, 5, 6].map((dia) => (
                        <td key={dia} className="p-2">
                          <button
                            onClick={() => toggleCronograma(pIdx, dia)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all`}
                            style={
                              userData.cronograma![pIdx][dia]
                                ? { backgroundColor: '#E6DFF0', borderColor: '#4A2C60' }
                                : { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' }
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-600 mt-4 text-center">
              Toque nos quadrados para marcar os períodos que você pretende sair
            </p>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={nextStep}
            >
              Pular
            </Button>
            <Button 
              size="lg" 
              className="flex-1 hover:opacity-90"
              style={{ backgroundColor: '#4A2C60' }}
              onClick={nextStep}
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela 5: Versículo do Ano
  if (step === 4 || (step === 3 && userData.tipoPublicador === 'publicador')) {
    const sugestoes = [
      { texto: 'Continue firmes, inabaláveis.', ref: '1 Coríntios 15:58' },
      { texto: 'Seja corajoso e forte.', ref: 'Josué 1:9' },
      { texto: 'Confie em Jeová de todo o coração.', ref: 'Provérbios 3:5' },
      { texto: 'Eu posso todas as coisas em Cristo.', ref: 'Filipenses 4:13' },
    ];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h2 className="text-3xl mb-2 text-center">Versículo do Ano</h2>
          <p className="text-gray-600 text-center mb-8">
            Escolha um versículo para te inspirar ao longo do ano 📖
          </p>

          <div className="space-y-3 mb-6">
            {sugestoes.map((sugestao, idx) => (
              <Card
                key={idx}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2"
                style={
                  userData.versiculoAno === `${sugestao.texto} — ${sugestao.ref}`
                    ? { borderColor: '#4A2C60', backgroundColor: '#F5F2F7' }
                    : { borderColor: 'transparent' }
                }
                onClick={() => setUserData({ 
                  ...userData, 
                  versiculoAno: `${sugestao.texto} — ${sugestao.ref}` 
                })}
              >
                <p className="text-sm italic mb-1">"{sugestao.texto}"</p>
                <p className="text-xs text-gray-600">— {sugestao.ref}</p>
              </Card>
            ))}
          </div>

          <Card className="p-4 mb-6">
            <label className="text-sm text-gray-600 mb-2 block">Ou escreva o seu próprio:</label>
            <Input
              placeholder="Digite seu versículo..."
              value={userData.versiculoAno || ''}
              onChange={(e) => setUserData({ ...userData, versiculoAno: e.target.value })}
              className="h-14 px-4 bg-white border-2"
              style={{ borderColor: '#D8CEE8' }}
            />
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={nextStep}
            >
              Pular
            </Button>
            <Button 
              size="lg" 
              className="flex-1 hover:opacity-90"
              style={{ backgroundColor: '#4A2C60' }}
              onClick={nextStep}
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela 6: Privacidade
  if (step === 5 || (step === 4 && userData.tipoPublicador === 'publicador')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-3xl mb-2">Privacidade</h2>
          </div>

          <Card className="p-6 mb-6">
            <div className="space-y-4 text-sm text-gray-700">
              <p className="text-center text-lg">
                <strong>Seus dados são seus 🔒</strong>
              </p>
              <p>
                O Mynis é seu caderno pessoal digital. Não compartilhamos suas informações com ninguém.
              </p>
              <p>
                Você tem total controle sobre tudo o que guardar aqui.
              </p>
              <p className="text-xs text-gray-600 border-t pt-4 mt-4">
                <strong>Importante:</strong> O Mynis não é adequado para coleta de dados sensíveis de outras pessoas.
              </p>
            </div>
          </Card>

          <Button 
            size="lg" 
            className="w-full hover:opacity-90"
            style={{ backgroundColor: '#4A2C60' }}
            onClick={handleComplete}
          >
            Aceitar e Continuar
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}