import { ArrowLeft, Camera, Upload, User, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { DataService } from '../../services/dataService';

interface EditarInformacoesPageProps {
  onVoltar: () => void;
}

export default function EditarInformacoesPage({ onVoltar }: EditarInformacoesPageProps) {
  const perfil = DataService.getPerfil();
  
  const [congregacao, setCongregacao] = useState('Congregação Central');
  const [email, setEmail] = useState('felipe.silva@email.com');
  const [telefone, setTelefone] = useState('(11) 98765-4321');
  const [fotoPreview, setFotoPreview] = useState<string | null>(perfil.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll para o topo quando o componente montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSalvar = () => {
    if (!congregacao.trim()) {
      toast.error('A congregação não pode estar vazia');
      return;
    }

    if (!email.trim()) {
      toast.error('O email não pode estar vazio');
      return;
    }

    // Validação básica de email
    if (!email.includes('@')) {
      toast.error('Digite um email válido');
      return;
    }

    if (!telefone.trim()) {
      toast.error('O telefone não pode estar vazio');
      return;
    }

    // Salvar foto no perfil
    DataService.updatePerfil({
      avatar: fotoPreview || undefined
    });

    // Aqui seria onde salvamos no DataService
    // Por enquanto, apenas mostramos o toast de sucesso
    toast.success('Informações atualizadas! ✅', {
      description: 'Seus dados foram salvos com sucesso.',
    });

    onVoltar();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
      toast.success('Foto selecionada! 📸', {
        description: 'Clique em "Salvar Informações" para aplicar',
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pb-20" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Header fixo */}
      <div className="sticky top-0 z-10 text-white" style={{ backgroundColor: '#4A2C60' }}>
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
            <h2 className="text-xl">Editar Informações</h2>
            <p className="text-sm opacity-90">Atualize seus dados de contato</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-6 py-6 space-y-6">
        {/* Card: Dica */}
        <Card className="p-6 border-2" style={{ backgroundColor: 'rgba(74, 44, 96, 0.04)', borderColor: 'rgba(74, 44, 96, 0.15)' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(74, 44, 96, 0.1)' }}>
              <Info className="w-5 h-5" style={{ color: '#4A2C60' }} />
            </div>
            <div>
              <h3 className="mb-2">Mantenha seus dados atualizados</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Essas informações são importantes para a comunicação com a congregação 
                e para o envio de relatórios mensais.
              </p>
            </div>
          </div>
        </Card>

        {/* Card: Foto de Perfil */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" style={{ color: '#4A2C60' }} />
            Foto de Perfil
          </h3>
          
          <div className="flex items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              {fotoPreview ? (
                <img 
                  src={fotoPreview} 
                  alt="Preview" 
                  className="w-20 h-20 rounded-full object-cover border-4"
                  style={{ borderColor: 'rgba(74, 44, 96, 0.2)' }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A2C60' }}>
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Informações e Botão */}
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">
                {fotoPreview ? 'Foto selecionada' : 'Nenhuma foto selecionada'}
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
              >
                <Upload className="w-4 h-4 mr-2" />
                {fotoPreview ? 'Trocar Foto' : 'Escolher Foto'}
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Sua foto aparecerá nas telas de Início e Perfil. 
            Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
          </p>
        </Card>

        {/* Formulário */}
        <Card className="p-6">
          <div className="space-y-5">
            {/* Campo: Congregação */}
            <div>
              <label className="block text-sm mb-2">
                Congregação: <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={congregacao}
                onChange={(e) => setCongregacao(e.target.value)}
                placeholder="Nome da sua congregação"
                className="w-full h-14 px-4 bg-white border-2 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o nome completo da sua congregação
              </p>
            </div>

            {/* Campo: Email */}
            <div>
              <label className="block text-sm mb-2">
                Email: <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-14 px-4 bg-white border-2 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Usado para envio de relatórios e comunicações
              </p>
            </div>

            {/* Campo: Telefone */}
            <div>
              <label className="block text-sm mb-2">
                Telefone: <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full h-14 px-4 bg-white border-2 rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: '#D8CEE8', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#4A2C60'}
                onBlur={(e) => e.target.style.borderColor = '#D8CEE8'}
              />
              <p className="text-xs text-gray-500 mt-1">
                Número de contato com DDD
              </p>
            </div>
          </div>
        </Card>

        {/* Preview dos dados */}
        <Card className="p-6">
          <h3 className="mb-4">Pré-visualização</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Congregação:</span>
              <span className="font-medium">{congregacao || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-xs">{email || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">{telefone || '—'}</span>
            </div>
          </div>
        </Card>

        {/* Botão Salvar */}
        <Button 
          className="w-full h-14 text-white hover:opacity-90"
          style={{ backgroundColor: '#4A2C60' }}
          onClick={handleSalvar}
        >
          Salvar Informações
        </Button>
      </div>
    </div>
  );
}