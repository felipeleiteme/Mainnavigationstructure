import { Sprout, Heart, Target, Play, BookOpen, Sparkles } from 'lucide-react';
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
    <div className="px-6 py-8 space-y-6">
      {/* Welcome Card - Hero com iconografia consistente */}
      <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-primary-100 shadow-sm">
        {/* Ícone grande com contraste: verde-claro + roxo */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary-100 flex items-center justify-center shadow-inner">
          <Sprout className="w-12 h-12 text-primary-500" />
        </div>
        
        <h2 className="text-2xl mb-3 text-primary-700">Bem-vindo ao Mynis, {userName}!</h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
          Vamos começar sua jornada ministerial juntos. Este é seu espaço para crescer e servir com propósito ✨
        </p>
      </Card>

      {/* Quick Actions - Cards interativos com feedback visual */}
      <div className="space-y-3">
        <h3 className="text-sm text-gray-600 px-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary-500" />
          Primeiros passos:
        </h3>
        
        {/* Card 1: Adicionar Revisitas */}
        <Card 
          className="p-5 bg-white border-0 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200 active:scale-95"
          onClick={onAddRevisita}
        >
          <div className="flex items-center gap-4">
            {/* Ícone: verde-claro com roxo */}
            <div className="w-14 h-14 rounded-2xl bg-secondary-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sprout className="w-7 h-7 text-primary-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-base mb-1 text-primary-700">Adicione suas primeiras revisitas</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Comece a acompanhar as pessoas que você conhece</p>
            </div>
            {/* Seta indicativa */}
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Card>

        {/* Card 2: Configurar Alvos */}
        <Card 
          className="p-5 bg-white border-0 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200 active:scale-95"
          onClick={onConfigureAlvos}
        >
          <div className="flex items-center gap-4">
            {/* Ícone: roxo-claro com roxo */}
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Target className="w-7 h-7 text-primary-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-base mb-1 text-primary-700">Configure seus alvos espirituais</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Defina metas para seu crescimento pessoal</p>
            </div>
            {/* Seta indicativa */}
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Card>

        {/* Card 3: Iniciar Sessão */}
        <Card 
          className="p-5 bg-white border-0 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-200 active:scale-95"
          onClick={onIniciarSessao}
        >
          <div className="flex items-center gap-4">
            {/* Ícone: rosa-claro com roxo */}
            <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Play className="w-7 h-7 text-primary-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-base mb-1 text-primary-700">Inicie uma sessão de campo</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Comece a registrar suas horas de ministério</p>
            </div>
            {/* Seta indicativa */}
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Card>
      </div>

      {/* Optional Tutorial - CTA secundário */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <BookOpen className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm mb-1 text-primary-700">Quer conhecer o app?</p>
              <p className="text-xs text-gray-600">Faça um tour rápido pelas funcionalidades</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-primary-300 text-primary-600 hover:bg-primary-50 transition-all duration-200 active:scale-95 flex-shrink-0"
          >
            Ver Tutorial
          </Button>
        </div>
      </Card>
    </div>
  );
}
