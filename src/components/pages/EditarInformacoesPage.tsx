import { ArrowLeft, Camera, Upload, User, Info, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';
import { ThemeService } from '../../services/themeService';
import { LanguageService } from '../../services/languageService';
import { useTranslations } from '../../utils/i18n/translations';

interface EditarInformacoesPageProps {
  onVoltar: () => void;
}

export default function EditarInformacoesPage({ onVoltar }: EditarInformacoesPageProps) {
  const perfil = DataService.getPerfil();
  const [languageCode, setLanguageCode] = useState(LanguageService.getLanguage());
  const t = useTranslations(languageCode);
  
  const [congregacao, setCongregacao] = useState('Congregação Central');
  const [email, setEmail] = useState('felipe.silva@email.com');
  const [telefone, setTelefone] = useState('(11) 98765-4321');
  const [fotoPreview, setFotoPreview] = useState<string | null>(perfil.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Escutar mudanças de tema
  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  // Escutar mudanças de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageCode(LanguageService.getLanguage());
    };
    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, []);

  const handleSalvar = () => {
    if (!congregacao.trim()) {
      toast.error('Precisamos do nome da congregação', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    if (!email.trim()) {
      toast.error('Precisamos do seu email', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Validação básica de email
    if (!email.includes('@')) {
      toast.error('Digite um email válido', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    if (!telefone.trim()) {
      toast.error('Precisamos do seu telefone', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Salvar foto no perfil
    DataService.updatePerfil({
      avatar: fotoPreview || undefined
    });

    // Aqui seria onde salvamos no DataService
    // Por enquanto, apenas mostramos o toast de sucesso
    toast.success(t.editInfo.saveSuccess || 'Informações atualizadas!', {
      description: t.editInfo.saveSuccessDesc || 'Seus dados foram salvos com sucesso.',
      icon: <Check className="w-5 h-5" />
    });

    onVoltar();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB', {
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
      toast.success('Foto selecionada!', {
        description: 'Clique em "Salvar Informações" para aplicar',
        icon: <Check className="w-5 h-5" />
      });
    };
    reader.readAsDataURL(file);
  };

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
            <h2 className="text-xl">{t.editInfo.title}</h2>
            <p className="text-sm opacity-90">{t.editInfo.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Dica */}
        <Card 
          className="p-6 border-2" 
          style={temaAtual === 'escuro' ? {
            backgroundColor: 'rgba(167, 139, 202, 0.1)',
            borderColor: 'rgba(167, 139, 202, 0.2)'
          } : {
            backgroundColor: 'rgba(74, 44, 96, 0.04)',
            borderColor: 'rgba(74, 44, 96, 0.15)'
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
              style={temaAtual === 'escuro' ? {
                backgroundColor: 'rgba(167, 139, 202, 0.2)'
              } : {
                backgroundColor: 'rgba(74, 44, 96, 0.1)'
              }}
            >
              <Info className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            </div>
            <div>
              <h3 
                className="mb-2"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {t.editInfo.keepUpdated}
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {t.editInfo.keepUpdatedDesc}
              </p>
            </div>
          </div>
        </Card>

        {/* Card: Foto de Perfil */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <h3 
            className="mb-4 flex items-center gap-2"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            <Camera className="w-5 h-5" style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }} />
            {t.editInfo.profilePhoto}
          </h3>
          
          <div className="flex items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              {fotoPreview ? (
                <img 
                  src={fotoPreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-4"
                  style={{ borderColor: temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : 'rgba(74, 44, 96, 0.2)' }}
                />
              ) : (
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
                >
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Informações e Botão */}
            <div className="flex-1">
              <p 
                className="text-sm mb-3"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#374151' }}
              >
                {fotoPreview ? t.editInfo.noPhoto.replace('Nenhuma', 'Foto selecionada') : t.editInfo.noPhoto}
              </p>
              
              {/* Input de arquivo (oculto) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-2"
                style={temaAtual === 'escuro' ? {
                  color: '#C8E046',
                  borderColor: '#C8E046',
                  backgroundColor: 'transparent'
                } : {}}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t.editInfo.choosePhoto}
              </Button>
            </div>
          </div>

          <p 
            className="text-xs mt-4"
            style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
          >
            {t.editInfo.photoNote}
          </p>
        </Card>

        {/* Formulário */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <div className="space-y-5">
            {/* Campo: Congregação */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.editInfo.congregationLabel} <span style={{ color: '#FCA5A5' }}>*</span>
              </label>
              <input
                type="text"
                value={congregacao}
                onChange={(e) => setCongregacao(e.target.value)}
                placeholder={t.editInfo.congregationPlaceholder}
                className="w-full h-14 px-4 border-2 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.editInfo.congregationPlaceholder}
              </p>
            </div>

            {/* Campo: Email */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.editInfo.emailLabel} <span style={{ color: '#FCA5A5' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-14 px-4 border-2 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.editInfo.emailNote}
              </p>
            </div>

            {/* Campo: Telefone */}
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ color: temaAtual === 'escuro' ? '#D1D5DB' : '#111827' }}
              >
                {t.editInfo.phoneLabel} <span style={{ color: '#FCA5A5' }}>*</span>
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full h-14 px-4 border-2 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={temaAtual === 'escuro' ? {
                  backgroundColor: '#1F1F1F',
                  borderColor: 'rgba(167, 139, 202, 0.3)',
                  color: '#FFFFFF',
                  outline: 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8CEE8',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = temaAtual === 'escuro' ? 'rgba(167, 139, 202, 0.3)' : '#D8CEE8';
                }}
              />
              <p 
                className="text-xs mt-1"
                style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}
              >
                {t.editInfo.phoneNote}
              </p>
            </div>
          </div>
        </Card>

        {/* Preview dos dados */}
        <Card 
          className="p-6"
          style={temaAtual === 'escuro' ? { backgroundColor: '#2A2A2A' } : {}}
        >
          <h3 
            className="mb-4"
            style={{ color: temaAtual === 'escuro' ? '#A78BCA' : '#4A2C60' }}
          >
            {t.editInfo.preview}
          </h3>
          <div className="space-y-3 text-sm">
            <div 
              className="flex justify-between items-center py-2 border-b"
              style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
            >
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.profile.congregation}:</span>
              <span 
                className="font-medium"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {congregacao || '—'}
              </span>
            </div>
            <div 
              className="flex justify-between items-center py-2 border-b"
              style={{ borderColor: temaAtual === 'escuro' ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' }}
            >
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.profile.email}:</span>
              <span 
                className="font-medium text-xs"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {email || '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span style={{ color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280' }}>{t.profile.phone}:</span>
              <span 
                className="font-medium"
                style={{ color: temaAtual === 'escuro' ? '#FFFFFF' : '#111827' }}
              >
                {telefone || '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Botão Salvar */}
        <button 
          className="w-full h-14 rounded-md transition-all flex items-center justify-center cursor-pointer border-0"
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
          {t.editInfo.saveInfo}
        </button>
      </div>
    </div>
  );
}