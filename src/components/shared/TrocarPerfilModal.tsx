import { X, User, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner@2.0.3';

interface Perfil {
  id: string;
  nome: string;
  tipo: string;
  cor: string;
  avatar?: string;
}

interface TrocarPerfilModalProps {
  onClose: () => void;
  perfilAtual: string;
  perfis: Perfil[];
  onTrocarPerfil: (perfilId: string) => void;
}

export default function TrocarPerfilModal({ 
  onClose, 
  perfilAtual, 
  perfis, 
  onTrocarPerfil 
}: TrocarPerfilModalProps) {
  
  const handleTrocarPerfil = (perfil: Perfil) => {
    if (perfil.id === perfilAtual) {
      onClose();
      return;
    }

    onTrocarPerfil(perfil.id);
    toast.success(`Olá, ${perfil.nome}! 👋`, {
      description: 'Perfil trocado com sucesso',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl">Trocar Perfil</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {perfis.map((perfil) => {
            const isAtivo = perfil.id === perfilAtual;
            
            return (
              <button
                key={perfil.id}
                onClick={() => handleTrocarPerfil(perfil)}
                className={`w-full p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isAtivo 
                    ? `border-${perfil.cor}-500 bg-${perfil.cor}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isAtivo 
                        ? `bg-${perfil.cor}-100 ring-4 ring-${perfil.cor}-500 ring-opacity-50` 
                        : 'bg-gray-100'
                    }`}
                  >
                    {perfil.avatar ? (
                      <img src={perfil.avatar} alt={perfil.nome} className="w-full h-full rounded-full" />
                    ) : (
                      <User className={`w-8 h-8 ${isAtivo ? `text-${perfil.cor}-600` : 'text-gray-400'}`} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <p className={`text-lg ${isAtivo ? `text-${perfil.cor}-900` : 'text-gray-900'}`}>
                      {perfil.nome}
                    </p>
                    <p className="text-sm text-gray-600">{perfil.tipo}</p>
                  </div>

                  {/* Indicador */}
                  {isAtivo && (
                    <div className={`w-8 h-8 bg-${perfil.cor}-500 rounded-full flex items-center justify-center`}>
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-6"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </Card>
    </div>
  );
}