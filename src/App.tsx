import { useState, useEffect } from 'react';
import { Home, Heart, Sprout, BookOpen, User } from 'lucide-react';
import { Toaster, toast } from 'sonner@2.0.3';
import './styles/globals.css';
import InicioTab from './components/tabs/InicioTab';
import EspiritualTab from './components/tabs/EspiritualTab';
import CampoTab from './components/tabs/CampoTab';
import EstudosTab from './components/tabs/EstudosTab';
import PerfilTab from './components/tabs/PerfilTab';
import OnboardingFlow, { OnboardingData } from './components/onboarding/OnboardingFlow';
import TrocarPerfilModal from './components/shared/TrocarPerfilModal';
import { NotificationScheduler } from './utils/notifications/notifications';
import { DataService } from './services/dataService';
import IniciarSessaoModal from './components/shared/IniciarSessaoModal';
import ControlesSessaoModal from './components/shared/ControlesSessaoModal';
import ResumoSessaoModal from './components/shared/ResumoSessaoModal';

type TabId = 'inicio' | 'espiritual' | 'campo' | 'estudos' | 'perfil';

interface TabOptions {
  filtro?: string;
  scroll?: string;
  acao?: string;
  highlight?: boolean;
  estudoId?: string;
  revisitaId?: string;
  abrirDetalhes?: boolean;
}

interface Perfil {
  id: string;
  nome: string;
  tipo: string;
  cor: string;
  avatar?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [tabOptions, setTabOptions] = useState<TabOptions>({});
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [showTrocarPerfil, setShowTrocarPerfil] = useState(false);
  const [perfilAtual, setPerfilAtual] = useState('1');
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Perfis da família (exemplo)
  const perfis: Perfil[] = [
    { id: '1', nome: 'Felipe Silva', tipo: 'Pioneiro Regular', cor: 'indigo' },
    { id: '2', nome: 'Ana Silva', tipo: 'Publicadora', cor: 'pink' },
  ];

  const perfilAtivo = perfis.find(p => p.id === perfilAtual) || perfis[0];

  // Check if user has completed onboarding
  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete === 'true') {
      setShowOnboarding(false);
      // Load user data from localStorage
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
      // Load perfil atual
      const savedPerfil = localStorage.getItem('perfilAtual');
      if (savedPerfil) {
        setPerfilAtual(savedPerfil);
      }
    }
  }, []);

  // Initialize notification system
  useEffect(() => {
    if (!showOnboarding) {
      NotificationScheduler.initializeDailyChecks();
    }
  }, [showOnboarding]);

  // Listen for custom navigation events (for empty states and proximas acoes)
  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (typeof e.detail === 'string') {
        setActiveTab(e.detail);
        setTabOptions({});
      } else {
        setActiveTab(e.detail.tab);
        setTabOptions(e.detail.options || {});
      }
    };
    window.addEventListener('navigate-to-tab', handleNavigate);
    return () => window.removeEventListener('navigate-to-tab', handleNavigate);
  }, []);

  const handleNavigateToTab = (tab: TabId, options?: TabOptions) => {
    setActiveTab(tab);
    setTabOptions(options || {});
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserData(data);
    setShowOnboarding(false);
    // Save to localStorage
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('userData', JSON.stringify(data));
  };

  const handleTrocarPerfil = (perfilId: string) => {
    setPerfilAtual(perfilId);
    localStorage.setItem('perfilAtual', perfilId);
    // Força re-render das tabs (poderia recarregar dados específicos do perfil)
  };

  // Long press handlers para o avatar
  const handleAvatarTouchStart = () => {
    const timer = setTimeout(() => {
      setShowTrocarPerfil(true);
    }, 500); // 500ms para long press
    setLongPressTimer(timer);
  };

  const handleAvatarTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Show onboarding if not completed
  if (showOnboarding) {
    return (
      <>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
        <Toaster position="top-center" />
      </>
    );
  }

  const tabs = [
    { id: 'inicio' as TabId, label: 'Início', icon: Home },
    { id: 'espiritual' as TabId, label: 'Espiritual', icon: Heart },
    { id: 'campo' as TabId, label: 'Campo', icon: Sprout },
    { id: 'estudos' as TabId, label: 'Estudos', icon: BookOpen },
    { id: 'perfil' as TabId, label: 'Perfil', icon: User },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#FDF8EE' }}>
      {/* Toast Notifications */}
      <Toaster position="top-center" />
      
      {/* Indicador de Perfil Ativo (borda colorida no topo) */}
      <div className={`h-1 bg-${perfilAtivo.cor}-500`} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'inicio' && <InicioTab onNavigateToTab={handleNavigateToTab} />}
        {activeTab === 'espiritual' && <EspiritualTab />}
        {activeTab === 'campo' && (
          <CampoTab 
            filtro={tabOptions.filtro} 
            onNavigateToTab={handleNavigateToTab}
            revisitaId={tabOptions.revisitaId}
            abrirDetalhes={tabOptions.abrirDetalhes}
          />
        )}
        {activeTab === 'estudos' && (
          <EstudosTab 
            filtro={tabOptions.filtro} 
            onNavigateToTab={handleNavigateToTab}
            estudoId={tabOptions.estudoId}
            abrirDetalhes={tabOptions.abrirDetalhes}
          />
        )}
        {activeTab === 'perfil' && <PerfilTab scrollTo={tabOptions.scroll} acao={tabOptions.acao} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50" style={{ borderColor: 'rgba(74, 44, 96, 0.1)' }}>
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {/* Ícone e label */}
                <div className={`relative z-10 flex flex-col items-center transition-colors duration-200 ${
                  isActive ? 'text-primary-500' : 'text-gray-400'
                }`}>
                  <Icon className={`w-6 h-6 mb-1 transition-all duration-200 ${
                    isActive ? 'stroke-[2.5] scale-110' : 'stroke-2'
                  }`} />
                  <span className={`text-xs transition-all duration-200 ${
                    isActive ? 'font-medium' : ''
                  }`}>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modal Trocar Perfil */}
      {showTrocarPerfil && (
        <TrocarPerfilModal
          onClose={() => setShowTrocarPerfil(false)}
          perfilAtual={perfilAtual}
          perfis={perfis}
          onTrocarPerfil={handleTrocarPerfil}
        />
      )}
    </div>
  );
}