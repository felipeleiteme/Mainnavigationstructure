import { Sprout, Heart, GraduationCap, Play } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface DashboardEmptyStateProps {
  userName: string;
  onAddRevisita: () => void;
  onConfigureAlvos: () => void;
  onIniciarSessao: () => void;
}

export default function DashboardEmptyState({ 
  userName, 
  onAddRevisita, 
  onConfigureAlvos, 
  onIniciarSessao 
}: DashboardEmptyStateProps) {
  return (
    <div className="px-4 py-8 space-y-6">
      {/* Welcome Card */}
      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <Sprout className="w-12 h-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl mb-3">Bem-vindo ao Mynis, {userName}!</h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto">
          Vamos começar sua jornada ministerial juntos. Este é seu espaço para crescer e servir com propósito 💚
        </p>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600 px-2">Primeiros passos:</h3>
        
        <Card 
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onAddRevisita}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm">🌱 Adicione suas primeiras revisitas</h4>
              <p className="text-xs text-gray-600">Comece a acompanhar as pessoas que você conhece</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onConfigureAlvos}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm">🙏 Configure seus alvos espirituais</h4>
              <p className="text-xs text-gray-600">Defina metas para seu crescimento pessoal</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={onIniciarSessao}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm">▶ Inicie uma sessão de campo</h4>
              <p className="text-xs text-gray-600">Comece a registrar suas horas de ministério</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Optional Tutorial */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1">Quer conhecer o app?</p>
            <p className="text-xs text-gray-600">Faça um tour rápido pelas funcionalidades</p>
          </div>
          <Button variant="outline" size="sm">
            Ver Tutorial
          </Button>
        </div>
      </Card>
    </div>
  );
}
