import { X, Play, MessageSquare, MapPin, BookOpen, CheckCircle2, Circle, Calendar, Edit, Sparkles, PartyPopper, FileText, Sun, CloudSun, Moon, Clock, Bell, BookMarked, BarChart3, Users, Heart } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { useState, useEffect } from 'react';
import { DataService } from '../../services/dataService';

interface DiaDetalhesProps {
  dia: {
    dia: string;
    data: string;
    status: string;
    estudos: number;
  };
  onClose: () => void;
  onIniciarMinisterio?: () => void;
  onNavigateToEstudos?: () => void;
}

export default function DiaDetalhes({ dia, onClose, onIniciarMinisterio, onNavigateToEstudos }: DiaDetalhesProps) {
  // Buscar atividades do dia do DataService
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const diaNumero = parseInt(dia.data);
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  
  const dataEsteDia = new Date(anoAtual, mesAtual, diaNumero).toISOString().split('T')[0];
  const atividadesDia = DataService.getAtividadeDia(dataEsteDia);
  
  const [checklistItems, setChecklistItems] = useState([
    { id: 'leituraBiblica', label: 'Leitura da Bíblia', checked: atividadesDia?.leituraBiblica || false, icon: BookOpen },
    { id: 'textoDiario', label: 'Texto Diário', checked: atividadesDia?.textoDiario || false, icon: FileText },
    { id: 'oracao', label: 'Oração', checked: atividadesDia?.oracao || false, icon: Heart },
    { id: 'adoracaoFamilia', label: 'Adoração em Família', checked: atividadesDia?.adoracaoFamilia || false, icon: Users }
  ]);

  const [anotacoes, setAnotacoes] = useState('');
  const [showAnotacoes, setShowAnotacoes] = useState(false);

  // Sincronizar checklist com DataService
  useEffect(() => {
    if (atividadesDia) {
      setChecklistItems([
        { id: 'leituraBiblica', label: 'Leitura da Bíblia', checked: atividadesDia.leituraBiblica, icon: BookOpen },
        { id: 'textoDiario', label: 'Texto Diário', checked: atividadesDia.textoDiario, icon: FileText },
        { id: 'oracao', label: 'Oração', checked: atividadesDia.oracao, icon: Heart },
        { id: 'adoracaoFamilia', label: 'Adoração em Família', checked: atividadesDia.adoracaoFamilia, icon: Users }
      ]);
    }
  }, [atividadesDia]);
  
  // Determinar tipo de dia (passado, atual, futuro)
  let tipoDia: 'passado' | 'atual' | 'futuro' = 'futuro';
  if (diaNumero === diaAtual) tipoDia = 'atual';
  else if (diaNumero < diaAtual) tipoDia = 'passado';

  // Subtexto contextual
  const getSubtexto = () => {
    if (tipoDia === 'atual' && dia.status !== 'Livre') {
      return { icon: Sparkles, texto: 'Veja o que você planejou para hoje' };
    } else if (tipoDia === 'atual' && dia.status === 'Livre') {
      return { icon: CloudSun, texto: 'Um dia tranquilo pela frente' };
    } else if (tipoDia === 'passado' && dia.status !== 'Livre') {
      return { icon: PartyPopper, texto: 'Veja o que você realizou neste dia' };
    } else if (tipoDia === 'passado' && dia.status === 'Livre') {
      return { icon: Moon, texto: 'Um dia de descanso' };
    } else {
      return { icon: Sparkles, texto: 'Veja o que você planejou' };
    }
  };

  const subtextoInfo = getSubtexto();
  const SubtextoIcon = subtextoInfo.icon;
  
  // Buscar estudos REAIS do DataService para este dia
  const todosEstudos = DataService.getEstudos();
  const estudosNoDia = todosEstudos.filter(e => {
    const dataEstudo = new Date(e.data);
    return dataEstudo.getDate() === diaNumero && 
           dataEstudo.getMonth() === mesAtual &&
           dataEstudo.getFullYear() === anoAtual;
  });
  
  const estudos = estudosNoDia.map(e => ({
    nome: e.estudanteNome,
    avatar: e.estudanteAvatar || e.estudanteNome.split(' ').map(n => n[0]).join(''),
    horario: e.horario || 'Horário não definido',
    publicacao: e.publicacao + (e.licao ? ` - Lição ${e.licao}` : ''),
    endereco: e.endereco || 'Endereço não definido',
    lembrete: 'Ativo - 1h antes',
    telefone: e.estudanteTelefone || '',
    realizado: tipoDia === 'passado'
  }));

  // Cronograma do dia
  const cronograma = {
    manha: dia.status.includes('Manhã'),
    tarde: dia.status.includes('Tarde'),
    noite: false
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    
    // Atualizar no DataService
    const item = checklistItems.find(i => i.id === id);
    if (item) {
      DataService.marcarAtividade(
        dataEsteDia,
        id as 'leituraBiblica' | 'textoDiario' | 'oracao' | 'adoracaoFamilia',
        !item.checked
      );
    }
  };

  const handleWhatsApp = (telefone: string, nome: string) => {
    const mensagem = encodeURIComponent(`Olá ${nome}! Tudo bem? Sobre nosso estudo bíblico de hoje...`);
    window.open(`https://wa.me/${telefone.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
  };

  const handleNavegar = (endereco: string) => {
    const enderecoEncoded = encodeURIComponent(endereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${enderecoEncoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
      <div 
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 text-white px-6 pt-6 pb-4 border-b z-10" style={{ backgroundColor: '#4A2C60' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-2xl">
                {dia.dia}-feira, {dia.data} de novembro
              </h2>
              <p className="text-sm opacity-90 mt-1">
                <SubtextoIcon className="w-5 h-5 mr-1" />
                {subtextoInfo.texto}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Seção: Cronograma Ideal */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Seu Cronograma
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Manhã */}
              <div 
                className="p-3 rounded-lg text-center border-2"
                style={
                  cronograma.manha
                    ? { backgroundColor: '#F5F2F7', borderColor: '#D1C4E0' }
                    : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }
                }
              >
                <Sun className="w-8 h-8 mx-auto mb-1 text-amber-500" />
                <p className="text-xs font-medium">
                  {cronograma.manha ? 'Manhã planejada' : 'Manhã livre'}
                </p>
                {cronograma.manha && tipoDia === 'passado' && (
                  <Badge variant="secondary" className="text-xs mt-2" style={{ backgroundColor: '#E6DFF0', color: '#4A2C60' }}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Concluído - 2h30min
                  </Badge>
                )}
              </div>

              {/* Tarde */}
              <div 
                className="p-3 rounded-lg text-center border-2"
                style={
                  cronograma.tarde
                    ? { backgroundColor: '#F5F2F7', borderColor: '#D1C4E0' }
                    : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }
                }
              >
                <CloudSun className="w-8 h-8 mx-auto mb-1 text-orange-500" />
                <p className="text-xs font-medium">
                  {cronograma.tarde ? 'Tarde planejada' : 'Tarde livre'}
                </p>
                {cronograma.tarde && tipoDia === 'passado' && (
                  <Badge variant="secondary" className="text-xs mt-2" style={{ backgroundColor: '#E6DFF0', color: '#4A2C60' }}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Concluído - 1h45min
                  </Badge>
                )}
              </div>

              {/* Noite */}
              <div 
                className="p-3 rounded-lg text-center border-2"
                style={
                  cronograma.noite
                    ? { backgroundColor: '#F5F2F7', borderColor: '#D1C4E0' }
                    : { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }
                }
              >
                <Moon className="w-8 h-8 mx-auto mb-1 text-indigo-500" />
                <p className="text-xs font-medium">
                  {cronograma.noite ? 'Noite planejada' : 'Noite livre'}
                </p>
              </div>
            </div>

            {tipoDia !== 'passado' && (cronograma.manha || cronograma.tarde || cronograma.noite) && (
              <Button 
                className="w-full mt-3 hover:opacity-90"
                style={{ backgroundColor: '#4A2C60' }}
                onClick={onIniciarMinisterio}
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Ministério
              </Button>
            )}
          </div>

          {/* Seção: Estudos Agendados */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: '#4A2C60' }} />
              {tipoDia === 'atual' ? 'Estudos de Hoje' : tipoDia === 'passado' ? 'Estudos Realizados' : 'Estudos Agendados'}
            </h3>
            
            {estudos.length > 0 ? (
              <div className="space-y-3">
                {estudos.map((estudo: any, idx) => (
                  <Card key={idx} className="p-4 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E6DFF0' }}>
                        <span className="font-medium" style={{ color: '#4A2C60' }}>{estudo.avatar}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium">{estudo.nome}</h4>
                          <Badge className="text-white text-xs" style={{ backgroundColor: '#4A2C60' }}>
                            Estudo Bíblico
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {estudo.horario}
                          </p>
                          <p className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> {estudo.publicacao}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {estudo.endereco}
                          </p>
                          {!estudo.realizado && (
                            <p className="flex items-center gap-2 text-orange-600">
                              <Bell className="w-4 h-4" /> {estudo.lembrete}
                            </p>
                          )}
                        </div>
                        
                        {!estudo.realizado && (
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs flex-1"
                              onClick={() => handleWhatsApp(estudo.telefone, estudo.nome)}
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              WhatsApp
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs flex-1"
                              onClick={() => handleNavegar(estudo.endereco)}
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              Navegar
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              Ver Detalhes
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center bg-gray-50">
                <BookMarked className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-700 mb-1">Nenhum estudo agendado para este dia</p>
                <p className="text-xs text-gray-600 mb-3">Que tal aproveitar para revisitar?</p>
                {tipoDia !== 'passado' && (
                  <Button size="sm" variant="outline">
                    + Agendar Estudo
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* Seção: Atividades do Dia */}
          {tipoDia === 'atual' && (
            <div>
              <h3 className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: '#4A2C60' }} />
                Suas Atividades
              </h3>
              
              <Card className="p-4">
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => toggleChecklistItem(item.id)}
                    >
                      <Checkbox 
                        checked={item.checked}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                        className="w-5 h-5"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xl">{item.icon}</span>
                        <span className={`text-sm ${item.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {item.label}
                        </span>
                      </div>
                      {item.checked && (
                        <CheckCircle2 className="w-4 h-4" style={{ color: '#4A2C60' }} />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Seção: Atividades Realizadas (Dias Passados) */}
          {tipoDia === 'passado' && (
            <div>
              <h3 className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: '#4A2C60' }} />
                Atividades Realizadas
              </h3>
              
              <Card className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#4A2C60' }} />
                    <span className="text-gray-700">Sessão de ministério: <strong>2h30min (Manhã)</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#4A2C60' }} />
                    <span className="text-gray-700">Estudos realizados: <strong>2 estudos</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#4A2C60' }} />
                    <span className="text-gray-700">Leitura bíblica: <strong>Lucas 10</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#4A2C60' }} />
                    <span className="text-gray-700">Texto diário: <strong>Concluído</strong></span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Seção: Planejamento (Dias Futuros) */}
          {tipoDia === 'futuro' && (
            <div>
              <h3 className="mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Planejamento
              </h3>
              
              <Card className="p-4 bg-indigo-50 border-indigo-200">
                <p className="text-sm text-gray-700 text-center">
                  Planeje suas atividades para este dia
                </p>
              </Card>
            </div>
          )}

          {/* Seção: Anotações */}
          <div>
            <button 
              onClick={() => setShowAnotacoes(!showAnotacoes)}
              className="flex items-center justify-between w-full mb-3 hover:opacity-70 transition-opacity"
            >
              <h3 className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-gray-600" />
                Anotações
              </h3>
              <span className="text-sm text-gray-500">
                {showAnotacoes ? '▼' : '▶'}
              </span>
            </button>
            
            {showAnotacoes && (
              <Card className="p-4">
                <textarea
                  value={anotacoes}
                  onChange={(e) => setAnotacoes(e.target.value)}
                  placeholder="Adicione suas anotações sobre este dia..."
                  className="w-full min-h-[100px] p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {anotacoes.length > 0 ? 'Salvando automaticamente...' : 'Suas anotações são salvas automaticamente'}
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Rodapé Fixo com Botões de Ação */}
        <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
          {tipoDia !== 'passado' ? (
            <>
              {(cronograma.manha || cronograma.tarde || cronograma.noite) && (
                <Button 
                  className="w-full hover:opacity-90"
                  style={{ backgroundColor: '#4A2C60' }}
                  onClick={onIniciarMinisterio}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Ministério
                </Button>
              )}
              <Button variant="outline" className="w-full">
                + Adicionar Estudo
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Relatório do Dia
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Editar Atividades
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}