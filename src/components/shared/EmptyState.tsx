import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ThemeService } from '../../services/themeService';

interface EmptyStateProps {
  emoji?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }>;
  illustration?: React.ReactNode;
}

export default function EmptyState({ 
  emoji, 
  icon,
  title, 
  description, 
  actions,
  illustration 
}: EmptyStateProps) {
  // Hook para monitorar tema
  const [temaAtual, setTemaAtual] = useState(ThemeService.getEffectiveTheme());

  useEffect(() => {
    const handleTemaChange = () => {
      setTemaAtual(ThemeService.getEffectiveTheme());
    };
    ThemeService.on('mynis-theme-change', handleTemaChange);
    return () => ThemeService.off('mynis-theme-change', handleTemaChange);
  }, []);
  return (
    <Card 
      className="p-10 text-center border-0 shadow-sm"
      style={{
        backgroundColor: temaAtual === 'escuro' ? '#2A2A2A' : '#FFFFFF'
      }}
    >
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : icon ? (
        <div className="mb-6 flex justify-center">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: temaAtual === 'escuro' 
                ? 'rgba(200, 224, 70, 0.15)' 
                : 'rgba(74, 44, 96, 0.08)'
            }}
          >
            <div 
              style={{ 
                fontSize: '48px',
                color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
              }}
            >
              {icon}
            </div>
          </div>
        </div>
      ) : emoji ? (
        <div className="text-6xl mb-6">{emoji}</div>
      ) : null}
      
      <h3 
        className="text-lg mb-2"
        style={{
          color: temaAtual === 'escuro' ? '#D1D5DB' : '#1F2937'
        }}
      >
        {title}
      </h3>
      <p 
        className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
        style={{
          color: temaAtual === 'escuro' ? '#9CA3AF' : '#6B7280'
        }}
      >
        {description}
      </p>

      {actions && actions.length > 0 && (
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || (idx === 0 ? 'default' : 'outline')}
              onClick={action.onClick}
              className="h-12 border-0"
              style={
                idx === 0
                  ? {
                      backgroundColor: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60',
                      color: temaAtual === 'escuro' ? '#1F2937' : '#FFFFFF'
                    }
                  : {
                      backgroundColor: 'transparent',
                      borderWidth: '2px',
                      borderColor: temaAtual === 'escuro' ? 'rgba(200, 224, 70, 0.5)' : 'rgba(74, 44, 96, 0.3)',
                      color: temaAtual === 'escuro' ? '#C8E046' : '#4A2C60'
                    }
              }
              onMouseEnter={(e) => {
                if (idx === 0) {
                  e.currentTarget.style.opacity = '0.9';
                } else {
                  e.currentTarget.style.backgroundColor = temaAtual === 'escuro' 
                    ? 'rgba(200, 224, 70, 0.1)' 
                    : 'rgba(74, 44, 96, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (idx === 0) {
                  e.currentTarget.style.opacity = '1';
                } else {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}