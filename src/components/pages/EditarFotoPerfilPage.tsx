import { ArrowLeft, Camera, Trash2, Upload, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';
import { ThemeService } from '../../services/themeService';

interface EditarFotoPerfilPageProps {
  onVoltar: () => void;
}

export default function EditarFotoPerfilPage({ onVoltar }: EditarFotoPerfilPageProps) {
  const perfil = DataService.getPerfil();
  const [fotoPreview, setFotoPreview] = useState<string | null>(perfil.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  // Scroll para o topo quando o componente montar
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

  // Sincronizar com o perfil sempre que o componente montar
  useEffect(() => {
    const perfilAtualizado = DataService.getPerfil();
    setFotoPreview(perfilAtualizado.avatar || null);
  }, []);

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
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverFoto = () => {
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSalvar = () => {
    DataService.updatePerfil({
      avatar: fotoPreview || undefined
    });

    toast.success(fotoPreview ? 'Foto atualizada!' : 'Foto removida!', {
      description: fotoPreview 
        ? 'Sua nova foto de perfil está visível no app' 
        : 'Você voltou a usar o avatar padrão',
      icon: fotoPreview ? <Check className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />
    });

    onVoltar();
  };

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
            <h2 className="text-xl">Editar Foto de Perfil</h2>
            <p className="text-sm opacity-90">Personalize seu avatar</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Dica */}
        <Card className="p-6 border-2" style={{ backgroundColor: '#F5F2F7', borderColor: '#D8CEE8' }}>
          <div className="flex items-start gap-3">
            <Camera className="w-8 h-8 flex-shrink-0" style={{ color: '#4A2C60' }} />
            <div>
              <h3 className="mb-2">Escolha sua foto</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                Sua foto aparecerá na tela de Início e no Perfil. Use uma imagem clara e que represente você.
              </p>
              <p className="text-xs text-gray-600">
                Formatos aceitos: JPG, PNG, GIF | Tamanho máximo: 5MB
              </p>
            </div>
          </div>
        </Card>

        {/* Preview da Foto */}
        <Card className="p-6">
          <h3 className="mb-4 text-center">Pré-visualização</h3>
          
          <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              {fotoPreview ? (
                <div className="relative group">
                  <img 
                    src={fotoPreview} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-full object-cover border-4"
                    style={{ borderColor: '#D8CEE8' }}
                  />
                  <button
                    onClick={handleRemoverFoto}
                    className="absolute top-0 right-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A2C60' }}>
                  <Camera className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* Input de arquivo (oculto) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Botões de ação */}
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {fotoPreview ? 'Trocar Foto' : 'Escolher Foto'}
              </Button>
              
              {fotoPreview && (
                <Button
                  variant="outline"
                  className="border-2"
                  style={temaAtual === 'escuro' ? {
                    borderColor: 'rgba(239, 68, 68, 0.5)',
                    color: '#FCA5A5',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)'
                  } : {
                    borderColor: '#FCA5A5',
                    color: '#B91C1C',
                    backgroundColor: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    if (temaAtual === 'escuro') {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.7)';
                    } else {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                      e.currentTarget.style.borderColor = '#F87171';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (temaAtual === 'escuro') {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    } else {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#FCA5A5';
                    }
                  }}
                  onClick={handleRemoverFoto}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Exemplos de onde a foto aparece */}
        <Card className="p-6">
          <h3 className="mb-4">Onde sua foto aparece</h3>
          
          <div className="space-y-4">
            {/* Preview Início */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F2F7' }}>
              <p className="text-xs text-gray-600 mb-3">Tela de Início</p>
              <div className="text-white p-4 rounded-xl" style={{ backgroundColor: '#4A2C60' }}>
                <div className="flex items-center gap-3">
                  {fotoPreview ? (
                    <img 
                      src={fotoPreview} 
                      alt="Preview Início" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm opacity-75">Olá,</p>
                    <p className="text-xl">{perfil.nome}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Perfil */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F2F7' }}>
              <p className="text-xs text-gray-600 mb-3">Tela de Perfil</p>
              <div className="text-white p-4 rounded-xl" style={{ backgroundColor: '#4A2C60' }}>
                <div className="flex items-center gap-4">
                  {fotoPreview ? (
                    <img 
                      src={fotoPreview} 
                      alt="Preview Perfil" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Camera className="w-10 h-10" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl">{perfil.nome}</h2>
                    <p className="text-sm opacity-90">
                      {DataService.getTipoPublicadorLabel(perfil.tipoPublicador)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          className="w-full py-6 border-0"
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
          Salvar Foto de Perfil
        </Button>

        {!fotoPreview && (
          <p className="text-xs text-gray-500 text-center">
            Sem foto, o ícone padrão será exibido
          </p>
        )}
      </div>
    </div>
  );
}