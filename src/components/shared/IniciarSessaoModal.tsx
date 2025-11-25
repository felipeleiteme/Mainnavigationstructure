import { useState } from 'react';
import { X, MapPin, Building2, Phone, Briefcase, Clock, Mail, Users, BookOpen, Edit3, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface IniciarSessaoModalProps {
  onClose: () => void;
  onIniciarSessao: (tipo: string) => void;
  onCadastroManual?: (dados: { tipo: string; horas: number; minutos: number }) => void;
}

export default function IniciarSessaoModal({ onClose, onCadastroManual }: IniciarSessaoModalProps) {
  const [etapa, setEtapa] = useState<'selecionar-atividade' | 'configurar-tempo'>('selecionar-atividade');
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(30);

  const tiposMinisterio = [
    {
      id: 'casa-em-casa',
      nome: 'Casa em Casa',
      emoji: '🚶',
      icon: MapPin,
      descricao: 'Visitação porta a porta',
      cor: 'bg-green-50 border-green-200 hover:bg-green-100',
      corSelecionada: 'bg-green-500 text-white border-green-500',
    },
    {
      id: 'testemunho-publico',
      nome: 'Testemunho Público',
      emoji: '🏢',
      icon: Building2,
      descricao: 'Carrinho ou banca pública',
      cor: 'border-gray-200 hover:bg-gray-50',
      corSelecionada: 'border text-white',
      corSelecionadaStyle: { backgroundColor: '#4A2C60', borderColor: '#4A2C60' },
    },
    {
      id: 'telefone',
      nome: 'Testemunho por Telefone',
      emoji: '📞',
      icon: Phone,
      descricao: 'Chamadas e mensagens',
      cor: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      corSelecionada: 'bg-purple-500 text-white border-purple-500',
    },
    {
      id: 'carta',
      nome: 'Testemunho por Carta',
      emoji: '✉️',
      icon: Mail,
      descricao: 'Cartas e mensagens escritas',
      cor: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      corSelecionada: 'bg-indigo-500 text-white border-indigo-500',
    },
    {
      id: 'informal',
      nome: 'Testemunho Informal',
      emoji: '💼',
      icon: Briefcase,
      descricao: 'Conversas casuais no dia a dia',
      cor: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      corSelecionada: 'bg-orange-500 text-white border-orange-500',
    },
    {
      id: 'revisita',
      nome: 'Revisita',
      emoji: '🌱',
      icon: Users,
      descricao: 'Visitar interesse manifestado',
      cor: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
      corSelecionada: 'bg-emerald-500 text-white border-emerald-500',
    },
    {
      id: 'estudo-biblico',
      nome: 'Estudo Bíblico',
      emoji: '📚',
      icon: BookOpen,
      descricao: 'Conduzir estudo regular',
      cor: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      corSelecionada: 'bg-amber-500 text-white border-amber-500',
    },
  ];

  const tipoAtual = tiposMinisterio.find(t => t.id === tipoSelecionado);

  const handleCadastrarManual = () => {
    if (tipoSelecionado && onCadastroManual) {
      onCadastroManual({ tipo: tipoSelecionado, horas, minutos });
      // Não fechar aqui - deixar o componente pai controlar
    }
  };

  const handleSelecionarTipo = (tipoId: string) => {
    setTipoSelecionado(tipoId);
    setEtapa('configurar-tempo');
  };

  const totalMinutos = horas * 60 + minutos;
  const tempoFormatado = totalMinutos > 0 
    ? `${horas}h ${minutos.toString().padStart(2, '0')}min`
    : '0min';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            {etapa === 'configurar-tempo' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEtapa('selecionar-atividade')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h2 className="text-xl">
                {etapa === 'selecionar-atividade' ? 'Selecione a Atividade' : 'Quanto tempo durou?'}
              </h2>
              <p className="text-sm text-gray-600">
                {etapa === 'selecionar-atividade' 
                  ? 'Qual atividade você realizou?' 
                  : tipoAtual?.nome}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {/* ETAPA 1: Selecionar Atividade */}
          {etapa === 'selecionar-atividade' && (
            <div className="space-y-3 pb-24">
              {tiposMinisterio.map((tipo) => {
                const Icon = tipo.icon;
                
                return (
                  <button
                    key={tipo.id}
                    onClick={() => handleSelecionarTipo(tipo.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all w-full ${tipo.cor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <span className="text-2xl">{tipo.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base mb-1">
                          {tipo.nome}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {tipo.descricao}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ETAPA 2: Configurar Tempo */}
          {etapa === 'configurar-tempo' && tipoAtual && (
            <>
              {/* Badge da atividade selecionada */}
              <Card className={`p-4 ${tipoAtual.cor.replace('hover:bg', 'bg')}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-xl">{tipoAtual.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm">{tipoAtual.nome}</p>
                    <p className="text-xs text-gray-600">{tipoAtual.descricao}</p>
                  </div>
                </div>
              </Card>

              {/* Picker de Tempo */}
              <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">⏱️ Quanto tempo durou?</p>
                  <p className="text-xs text-gray-600">Ajuste o tempo que você passou no ministério</p>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-4">
                  {/* Horas */}
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-600 mb-2">Horas</label>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => setHoras(Math.min(23, horas + 1))}
                        className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
                      >
                        +
                      </button>
                      <div className="w-16 h-16 rounded-xl bg-white border-2 border-purple-300 flex items-center justify-center">
                        <span className="text-2xl text-purple-900">{horas}</span>
                      </div>
                      <button
                        onClick={() => setHoras(Math.max(0, horas - 1))}
                        className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
                      >
                        −
                      </button>
                    </div>
                  </div>

                  <span className="text-2xl text-purple-900 mt-8">:</span>

                  {/* Minutos */}
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-600 mb-2">Minutos</label>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          const novosMinutos = minutos + 15;
                          if (novosMinutos >= 60) {
                            setHoras(Math.min(23, horas + 1));
                            setMinutos(0);
                          } else {
                            setMinutos(novosMinutos);
                          }
                        }}
                        className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
                      >
                        +
                      </button>
                      <div className="w-16 h-16 rounded-xl bg-white border-2 border-purple-300 flex items-center justify-center">
                        <span className="text-2xl text-purple-900">{minutos.toString().padStart(2, '0')}</span>
                      </div>
                      <button
                        onClick={() => {
                          const novosMinutos = minutos - 15;
                          if (novosMinutos < 0) {
                            if (horas > 0) {
                              setHoras(horas - 1);
                              setMinutos(45);
                            } else {
                              setMinutos(0);
                            }
                          } else {
                            setMinutos(novosMinutos);
                          }
                        }}
                        className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
                      >
                        −
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-700" />
                  <p className="text-sm text-purple-900">
                    Tempo total: <strong>{tempoFormatado}</strong>
                  </p>
                </div>
              </Card>

              {/* Botão de Ação */}
              <Button
                size="lg"
                className="w-full bg-purple-600 hover:bg-purple-700 mb-24"
                onClick={handleCadastrarManual}
                disabled={totalMinutos === 0}
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Salvar no Relatório
              </Button>
              {totalMinutos === 0 && (
                <p className="text-xs text-center text-red-600">
                  ⚠️ Configure um tempo maior que 0
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}