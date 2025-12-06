import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeService } from '../../services/themeService';
import { useState, useEffect } from 'react';

/**
 * PageHeader - Componente reutilizável para headers de páginas internas
 * 
 * Design System Mynis (Brandbook):
 * - Container: sticky top-0 z-50 (fixo no topo)
 * - Background: bg-primary-500 (roxo #4A2C60)
 * - Text: text-white
 * - Padding: px-6 pt-12 pb-6 (Grid 8pt)
 * - Botão voltar: hover:bg-white/20
 * - Altura mínima: min-h-[120px]
 * 
 * Uso:
 * ```tsx
 * <PageHeader
 *   title="Título da Página"
 *   subtitle="Descrição ou contexto"
 *   icon={BookOpen}
 *   onBack={() => console.log('Voltar')}
 * />
 * ```
 */

interface PageHeaderProps {
  /** Título principal da página */
  title: string;
  
  /** Subtítulo ou descrição (opcional) */
  subtitle?: string;
  
  /** Ícone do lucide-react (opcional) */
  icon?: LucideIcon;
  
  /** Callback ao clicar no botão voltar */
  onBack: () => void;
  
  /** Ação adicional no header (opcional) - ex: botão de editar */
  action?: React.ReactNode;
  
  /** Classes adicionais (opcional) */
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  onBack,
  action,
  className = ''
}: PageHeaderProps) {
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleThemeChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleThemeChange);
    return () => ThemeService.off('mynis-theme-change', handleThemeChange);
  }, []);

  return (
    <div 
      className={`sticky top-0 z-50 text-white ${className}`} 
      style={{ backgroundColor: temaAtual === 'escuro' ? '#2A2040' : '#4A2C60' }}
    >
      <div className="flex items-center gap-4 px-6 pt-12 pb-6">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 text-white hover:bg-white/20 active:bg-white/30"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        {/* Título + Subtítulo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-6 h-6 shrink-0" />}
            <h2 className="text-xl truncate">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-sm opacity-90 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Ação adicional (opcional) */}
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}