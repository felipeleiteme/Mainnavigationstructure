import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Sprout, Leaf, TreeDeciduous, Sparkles, Info, BookOpen } from 'lucide-react';
import { DataService, TipoPublicador } from '../../services/dataService';
import { toast } from 'sonner@2.0.3';
import { ThemeService } from '../../services/themeService';
import { LanguageService } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';

interface Props {
  onVoltar: () => void;
}

export default function EditarTipoPublicadorPage({ onVoltar }: Props) {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoPublicador>('publicador-regular');
  const [metaPersonalizada, setMetaPersonalizada] = useState(15);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());
  const [language, setLanguage] = useState(LanguageService.getLanguage());
  const t = useTranslations(language);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const perfil = DataService.getPerfil();
    setTipoSelecionado(perfil.tipoPublicador);
    setMetaPersonalizada(perfil.metaHoras || 15);
  }, []);

  useEffect(() => {
    const handleTemaChange = () => setTemaAtual(ThemeService.getEffectiveTheme());
    const handleLanguageChange = () => setLanguage(LanguageService.getLanguage());

    ThemeService.on('mynis-theme-change', handleTemaChange);
    LanguageService.on('mynis-language-change', handleLanguageChange);

    return () => {
      ThemeService.off('mynis-theme-change', handleTemaChange);
      LanguageService.off('mynis-language-change', handleLanguageChange);
    };
  }, []);

  const handleSalvar = () => {
    try {
      // Salvar tipo de publicador e meta (se for pioneiro auxiliar)
      DataService.updatePerfil({
        tipoPublicador: tipoSelecionado,
        metaHoras: tipoSelecionado === 'pioneiro-auxiliar' ? metaPersonalizada : undefined
      });
      toast.success(t.editPublisherType.saveChanges + ' ✅');
      onVoltar();
    } catch (error) {
      toast.error('Erro ao atualizar tipo de publicador');
    }
  };

  const opcoes: { 
    valor: TipoPublicador; 
    label: string; 
    meta: string; 
    descricao: string; 
    icone: any 
  }[] = [
    {
      valor: 'publicador-regular',
      label: t.editPublisherType.regularPublisher,
      meta: '10h',
      descricao: t.editPublisherType.regularPublisherDesc,
      icone: BookOpen
    },
    {
      valor: 'pioneiro-auxiliar',
      label: t.editPublisherType.auxiliaryPioneer15,
      meta: `${metaPersonalizada}h`,
      descricao: 'Meta configurável (15h, 30h ou personalizada)',
      icone: Sprout
    },
    {
      valor: 'pioneiro-regular',
      label: t.editPublisherType.regularPioneer,
      meta: '50h',
      descricao: t.editPublisherType.regularPioneerDesc,
      icone: Sparkles
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto pb-20" 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#1A1A1A' : '#FDF8EE' }}
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
            <h2 className="text-xl">{t.editPublisherType.title}</h2>
            <p className="text-sm opacity-90">{t.editPublisherType.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Opções de Tipo */}
        <Card 
          className="p-6"
          style={{
            backgroundColor: temaAtual === 'escuro' ? '#1A1A1F' : '#FFFFFF'
          }}
        >
          <div className="space-y-4">
            {opcoes.map((opcao) => {
              const Icone = opcao.icone;
              const selecionado = tipoSelecionado === opcao.valor;
              
              return (
                <div
                  key={opcao.valor}
                  onClick={() => setTipoSelecionado(opcao.valor)}
                  className="rounded-2xl p-4 cursor-pointer transition-all border-2"
                  style={{
                    backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                    borderColor: selecionado 
                      ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                      : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB')
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: temaAtual === 'escuro' ? '#5A5F3A' : 'rgba(74, 44, 96, 0.08)'
                      }}
                    >
                      <Icone 
                        className="w-6 h-6" 
                        style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 
                          className="font-medium text-base"
                          style={{ 
                            color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937' 
                          }}
                        >
                          {opcao.label}
                        </h3>
                        <span 
                          className="text-sm px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: temaAtual === 'escuro' ? '#5A5F3A' : 'rgba(74, 44, 96, 0.08)',
                            color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                          }}
                        >
                          {opcao.meta}
                        </span>
                      </div>
                      <p 
                        className="text-sm"
                        style={{ 
                          color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' 
                        }}
                      >
                        {opcao.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Configurar Meta (apenas para Pioneiro Auxiliar) */}
        {tipoSelecionado === 'pioneiro-auxiliar' && (
          <Card 
            className="p-6"
            style={{
              backgroundColor: temaAtual === 'escuro' ? '#1A1A1F' : '#FFFFFF'
            }}
          >
            <Label 
              htmlFor="meta" 
              className="flex items-center gap-2 mb-3"
              style={{ color: temaAtual === 'escuro' ? '#F3F4F6' : '#374151' }}
            >
              <TreeDeciduous 
                className="w-4 h-4" 
                style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
              />
              Meta de Horas Mensal
            </Label>
            
            <div className="space-y-4">
              {/* Opções rápidas */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  style={{
                    backgroundColor: metaPersonalizada === 15 
                      ? (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.1)')
                      : (temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF'),
                    borderColor: metaPersonalizada === 15
                      ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                      : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8'),
                    color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937'
                  }}
                  onClick={() => setMetaPersonalizada(15)}
                >
                  15 horas
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  style={{
                    backgroundColor: metaPersonalizada === 30 
                      ? (temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.2)' : 'rgba(74, 44, 96, 0.1)')
                      : (temaAtual === 'escuro' ? '#3A3050' : '#FFFFFF'),
                    borderColor: metaPersonalizada === 30
                      ? (temaAtual === 'escuro' ? '#C8E046' : '#4A2C60')
                      : (temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8'),
                    color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937'
                  }}
                  onClick={() => setMetaPersonalizada(30)}
                >
                  30 horas
                </Button>
              </div>

              {/* Input personalizado */}
              <div>
                <Label htmlFor="metaCustom" className="text-sm mb-2 block" style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}>
                  Ou defina uma meta personalizada:
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="metaCustom"
                    type="number"
                    value={metaPersonalizada}
                    onChange={(e) => setMetaPersonalizada(parseInt(e.target.value) || 15)}
                    className="h-14 border-2 bg-white text-center text-xl focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8', 
                      outline: 'none',
                      backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF',
                      color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'}
                    onBlur={(e) => e.currentTarget.style.borderColor = temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#D8CEE8'}
                    min="1"
                    max="100"
                  />
                  <span 
                    className="text-lg whitespace-nowrap"
                    style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}
                  >
                    horas/mês
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Dica */}
        <Card 
          className="p-4" 
          style={{ 
            backgroundColor: temaAtual === 'escuro' ? '#1F1A2E' : 'rgba(74, 44, 96, 0.05)' 
          }}
        >
          <div className="flex gap-3">
            <Info 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60' }} 
            />
            <div>
              <h4 className="mb-1" style={{ color: temaAtual === 'escuro' ? '#F3F4F6' : '#1F2937' }}>
                {t.editPublisherType.tipTitle}
              </h4>
              <p className="text-sm" style={{ color: temaAtual === 'escuro' ? '#C9C9D6' : '#6B7280' }}>
                {t.editPublisherType.tipDesc}
              </p>
            </div>
          </div>
        </Card>

        {/* Botão Salvar */}
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
          onClick={handleSalvar}
        >
          {t.editPublisherType.saveChanges}
        </button>
      </div>
    </div>
  );
}