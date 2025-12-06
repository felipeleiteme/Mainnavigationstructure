import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Plus, Check, ChevronLeft, ChevronRight, Dumbbell, BookOpen, Sparkles, Sprout, Flame, BarChart3, MessageSquare, HelpCircle, PartyPopper } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { getQualidadeMes, getProximaQualidade, Qualidade } from '../../data/qualidades';
import RegistrarExperienciaModal from './RegistrarExperienciaModal';

interface TemaDoMesProps {
  onClose: () => void;
}

interface Experiencia {
  id: string;
  data: string;
  descricao: string;
  sentimento?: string;
  qualidadeId: string;
}

export default function TemaDoMes({ onClose }: TemaDoMesProps) {
  // Estado para navegação entre meses
  const [mesOffset, setMesOffset] = useState(0); // 0 = mês atual, -1 = mês anterior, +1 = próximo mês
  
  // Calcular mês baseado no offset
  const getMesAtual = () => {
    const hoje = new Date();
    const mesCalculado = hoje.getMonth() + 1 + mesOffset;
    if (mesCalculado < 1) return 12 + mesCalculado;
    if (mesCalculado > 12) return mesCalculado - 12;
    return mesCalculado;
  };
  
  const qualidade = getQualidadeMes(getMesAtual());
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [exemplosVisiveis, setExemplosVisiveis] = useState(false);
  const [contadorDesafio, setContadorDesafio] = useState(0);
  const [reflexaoFinal, setReflexaoFinal] = useState('');
  
  const isMesAtual = mesOffset === 0;
  const isMesFuturo = mesOffset > 0;
  const isMesPassado = mesOffset < 0;

  // Carregar experiências do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`experiencias_${qualidade.id}`);
    if (saved) {
      setExperiencias(JSON.parse(saved));
    }
    
    const contador = localStorage.getItem(`contador_${qualidade.id}`);
    if (contador) {
      setContadorDesafio(Number(contador));
    }

    const reflexao = localStorage.getItem(`reflexao_${qualidade.id}`);
    if (reflexao) {
      setReflexaoFinal(reflexao);
    }
  }, [qualidade.id]);

  const handleSalvarExperiencia = (exp: Omit<Experiencia, 'id' | 'qualidadeId'>) => {
    const novaExperiencia: Experiencia = {
      ...exp,
      id: Date.now().toString(),
      qualidadeId: qualidade.id,
    };

    const updated = [novaExperiencia, ...experiencias];
    setExperiencias(updated);
    localStorage.setItem(`experiencias_${qualidade.id}`, JSON.stringify(updated));

    // Incrementar contador se for hoje
    const hoje = new Date().toDateString();
    const dataExp = new Date(exp.data).toDateString();
    if (hoje === dataExp && contadorDesafio < 3) {
      const novoContador = contadorDesafio + 1;
      setContadorDesafio(novoContador);
      localStorage.setItem(`contador_${qualidade.id}`, novoContador.toString());
    }
  };

  // Gerar calendário do mês
  const gerarCalendario = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const dias = [];

    // Adicionar dias vazios do início
    for (let i = 0; i < primeiroDia.getDay(); i++) {
      dias.push(null);
    }

    // Adicionar dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
      const temExperiencia = experiencias.some(
        (exp) => new Date(exp.data).toDateString() === data.toDateString()
      );
      const isHoje = data.toDateString() === hoje.toDateString();

      dias.push({
        dia,
        temExperiencia,
        isHoje,
      });
    }

    return dias;
  };

  const calendario = gerarCalendario();
  const diasConsecutivos = calcularOfensiva();

  function calcularOfensiva() {
    if (experiencias.length === 0) return 0;

    const hoje = new Date();
    let count = 0;
    let dataCheck = new Date(hoje);

    while (true) {
      const temExp = experiencias.some(
        (exp) => new Date(exp.data).toDateString() === dataCheck.toDateString()
      );
      
      if (!temExp) break;
      
      count++;
      dataCheck.setDate(dataCheck.getDate() - 1);
    }

    return count;
  }

  const mensagensEncorajamento = [
    `${qualidade.nome} é uma das qualidades mais fortes que você pode ter`,
    `Cultivar ${qualidade.nome.toLowerCase()} é plantar paz onde quer que você vá`,
    'Cada dia é uma chance de responder com amor',
    `Jeová valoriza sua ${qualidade.nome.toLowerCase()}. Continue praticando! ${qualidade.emoji}`,
  ];

  const mensagemAleatoria = mensagensEncorajamento[
    Math.floor(Math.random() * mensagensEncorajamento.length)
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      {/* Header com gradiente consistente */}
      <div
        className="px-6 pt-12 pb-8 rounded-b-3xl"
        style={{
          background: `linear-gradient(135deg, ${qualidade.cor.primaria} 0%, ${qualidade.cor.secundaria} 100%)`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMesOffset(mesOffset - 1)}
            className="text-white hover:bg-white/20 mt-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="text-6xl animate-in zoom-in-95 duration-500">
            {qualidade.emoji}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl mb-1 text-white">
              {qualidade.nome}
            </h1>
            <p className="text-sm text-white/90">
              {isMesAtual && `Tema do mês de ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}`}
              {isMesPassado && `Tema de ${new Date(new Date().getFullYear(), new Date().getMonth() + mesOffset, 1).toLocaleDateString('pt-BR', { month: 'long' })}`}
              {isMesFuturo && `Próximo tema: ${new Date(new Date().getFullYear(), new Date().getMonth() + mesOffset, 1).toLocaleDateString('pt-BR', { month: 'long' })}`}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMesOffset(mesOffset + 1)}
            className="text-white hover:bg-white/20 mt-2"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Stats rápidos */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white">
            <p className="text-2xl mb-0">{experiencias.length}</p>
            <p className="text-xs opacity-90">Experiências</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white">
            <p className="text-2xl mb-0 flex items-center justify-center gap-1">
              {diasConsecutivos}
              <Flame className="w-5 h-5" />
            </p>
            <p className="text-xs opacity-90">Dias seguidos</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white">
            <p className="text-2xl mb-0">{contadorDesafio}/3</p>
            <p className="text-xs opacity-90">Desafio</p>
          </div>
        </div>
      </div>

      {/* Mensagem de Encorajamento */}
      <div className="px-4 -mt-4 mb-4">
        <Card className="p-4 bg-white shadow-lg border-0">
          <p className="text-sm text-center text-gray-800">
            {mensagemAleatoria}
          </p>
        </Card>
      </div>

      <div className="px-4 pb-24 space-y-6">
        {/* Conteúdo para Mês Futuro */}
        {isMesFuturo && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <div className="text-6xl mb-4">{qualidade.emoji}</div>
              <p className="text-sm text-gray-600 mb-2">Tema Futuro</p>
              <h3 className="text-2xl mb-3">{qualidade.nome}</h3>
              
              {/* Preview do significado */}
              <div className="bg-white/50 p-4 rounded-lg mb-4 text-left">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {qualidade.significado}
                </p>
              </div>
              
              <p className="text-xs text-gray-500 mb-4">
                Este tema estará disponível em {new Date(new Date().getFullYear(), new Date().getMonth() + mesOffset, 1).toLocaleDateString('pt-BR', { month: 'long' })}
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMesOffset(0)}
                className="mt-2"
              >
                Voltar para o mês atual
              </Button>
            </div>
          </Card>
        )}
        
        {/* Conteúdo para Mês Passado */}
        {isMesPassado && (
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="text-center">
              <div className="text-6xl mb-4">{qualidade.emoji}</div>
              <p className="text-sm text-gray-600 mb-2">Histórico</p>
              <h3 className="text-2xl mb-3">{qualidade.nome}</h3>
              <p className="text-xs text-gray-500 mb-4">
                Tema de {new Date(new Date().getFullYear(), new Date().getMonth() + mesOffset, 1).toLocaleDateString('pt-BR', { month: 'long' })}
              </p>
              
              {experiencias.length > 0 ? (
                <div className="text-left space-y-4">
                  <div>
                    <p className="text-sm mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Seu progresso neste mês:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-2xl">{experiencias.length}</p>
                        <p className="text-xs text-gray-600">Experiências</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-2xl">{contadorDesafio}/3</p>
                        <p className="text-xs text-gray-600">Desafio</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lista de experiências do mês passado */}
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h4 className="text-sm mb-3">Experiências registradas:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {experiencias.map((exp) => (
                        <div key={exp.id} className="p-3 bg-white rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-xs text-gray-600">
                              {new Date(exp.data).toLocaleDateString('pt-BR')}
                            </p>
                            {exp.sentimento && <span className="text-sm">{exp.sentimento}</span>}
                          </div>
                          <p className="text-sm text-gray-800">{exp.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 p-6 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">Nenhuma experiência registrada neste mês.</p>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMesOffset(0)}
                className="mt-4"
              >
                Voltar para o mês atual
              </Button>
            </div>
          </Card>
        )}
        
        {/* Conteúdo para Mês Atual */}
        {isMesAtual && (
          <>
        {/* 1. Significado */}
        <Card className="p-6">
          <h2 className="text-lg mb-4 flex items-center gap-2" style={{ color: qualidade.cor.texto }}>
            <MessageSquare className="w-5 h-5" />
            O que é {qualidade.nome}?
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{qualidade.significado}</p>

          <div
            className="p-6 rounded-lg border-l-4"
            style={{
              backgroundColor: qualidade.cor.secundaria,
              borderColor: qualidade.cor.primaria,
            }}
          >
            <p className="text-lg italic mb-3" style={{ color: qualidade.cor.texto }}>
              "{qualidade.versiculo.texto}"
            </p>
            <p className="text-sm" style={{ color: qualidade.cor.texto }}>
              — {qualidade.versiculo.referencia}
            </p>
          </div>
        </Card>

        {/* 2. Reflexões Semanais */}
        <Card className="p-6">
          <h2 className="text-lg mb-4 flex items-center gap-2" style={{ color: qualidade.cor.texto }}>
            <BookOpen className="w-5 h-5" />
            Reflexões Semanais
          </h2>

          <div className="space-y-6">
            {/* Semana 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Semana 1
                </Badge>
                <h3 className="text-sm">Reflexão</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{qualidade.reflexoesSemanais.semana1.titulo}</span>
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExemplosVisiveis(!exemplosVisiveis)}
                className="mb-3"
              >
                {exemplosVisiveis ? 'Ocultar' : 'Ver'} exemplos práticos
              </Button>

              {exemplosVisiveis && (
                <ul className="space-y-2 ml-4">
                  {qualidade.reflexoesSemanais.semana1.exemplos.map((exemplo, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-600 mt-1" />
                      {exemplo}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Semana 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Semana 2
                </Badge>
                <h3 className="text-sm">Desafio</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3 flex items-start gap-2">
                <Dumbbell className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: qualidade.cor.primaria }} />
                <span>{qualidade.reflexoesSemanais.semana2.titulo}</span>
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <p className="text-3xl" style={{ color: qualidade.cor.texto }}>
                    {contadorDesafio}/{qualidade.reflexoesSemanais.semana2.meta}
                  </p>
                  <p className="text-xs text-gray-600">Completo</p>
                </div>
                <Progress 
                  value={(contadorDesafio / qualidade.reflexoesSemanais.semana2.meta) * 100} 
                  className="flex-1"
                />
              </div>

              {contadorDesafio >= qualidade.reflexoesSemanais.semana2.meta && (
                <p className="text-sm text-green-700 mt-3 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <PartyPopper className="w-4 h-4" />
                  Parabéns! Desafio completo!
                </p>
              )}
            </div>

            {/* Semana 3 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Semana 3
                </Badge>
                <h3 className="text-sm">Meditação</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3 flex items-start gap-2">
                <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: qualidade.cor.primaria }} />
                <span>{qualidade.reflexoesSemanais.semana3.titulo}</span>
              </p>
              
              <div className="space-y-2">
                {qualidade.reflexoesSemanais.semana3.estudos.map((estudo, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm">{estudo.titulo}</p>
                      <p className="text-xs text-gray-600">{estudo.referencia}</p>
                    </div>
                    <Checkbox />
                  </div>
                ))}
              </div>
            </div>

            {/* Semana 4 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Semana 4
                </Badge>
                <h3 className="text-sm">Revisão</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3 flex items-start gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{qualidade.reflexoesSemanais.semana4.titulo}</span>
              </p>
              
              <textarea
                className="w-full p-3 border rounded-lg text-sm resize-none"
                rows={4}
                placeholder="Escreva suas reflexões aqui..."
                value={reflexaoFinal}
                onChange={(e) => {
                  setReflexaoFinal(e.target.value);
                  localStorage.setItem(`reflexao_${qualidade.id}`, e.target.value);
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                Esta reflexão será incluída ao enviar seu relatório mensal
              </p>
            </div>
          </div>
        </Card>

        {/* 3. Meu Progresso */}
        <Card className="p-6">
          <h2 className="text-lg mb-4 flex items-center gap-2" style={{ color: qualidade.cor.texto }}>
            <BarChart3 className="w-5 h-5" />
            Meu Progresso
          </h2>

          {/* Calendário */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <div key={dia} className="text-center text-xs text-gray-600">
                  {dia}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendario.map((dia, idx) => (
                <div
                  key={idx}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                    !dia
                      ? ''
                      : dia.isHoje
                      ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                      : dia.temExperiencia
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {dia?.dia}
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl text-blue-900">{experiencias.length}</p>
              <p className="text-xs text-gray-600">Experiências</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl text-orange-900 flex items-center justify-center gap-1">
                {diasConsecutivos}
                <Flame className="w-5 h-5" />
              </p>
              <p className="text-xs text-gray-600">Dias seguidos</p>
            </div>
          </div>

          {/* Mini-diário */}
          <div>
            <h3 className="text-sm mb-3">Minhas Experiências</h3>
            {experiencias.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Nenhuma experiência registrada ainda.<br />
                Comece registrando sua primeira!
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {experiencias.slice(0, 5).map((exp) => (
                  <div key={exp.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs text-gray-600">
                        {new Date(exp.data).toLocaleDateString('pt-BR')}
                      </p>
                      {exp.sentimento && <span className="text-sm">{exp.sentimento}</span>}
                    </div>
                    <p className="text-sm text-gray-800">{exp.descricao}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* 4. Preview Próximo Mês */}
        <Card className="p-6 opacity-60">
          <div className="text-center">
            <div className="text-4xl mb-3">{getQualidadeMes(getMesAtual() + 1 > 12 ? 1 : getMesAtual() + 1).emoji}</div>
            <p className="text-sm text-gray-600">Próximo mês:</p>
            <h3 className="text-lg mb-2">{getQualidadeMes(getMesAtual() + 1 > 12 ? 1 : getMesAtual() + 1).nome}</h3>
            <p className="text-xs text-gray-500">
              Em breve você poderá começar a cultivar essa qualidade
            </p>
          </div>
        </Card>
        </>
        )}
      </div>

      {/* Botões de Ação Fixos */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
        <Button
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => setShowRegistrar(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Experiência
        </Button>
        <Button size="lg" variant="outline" className="w-12">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal Registrar */}
      {showRegistrar && (
        <RegistrarExperienciaModal
          qualidade={qualidade}
          onClose={() => setShowRegistrar(false)}
          onSalvar={handleSalvarExperiencia}
        />
      )}
    </div>
  );
}