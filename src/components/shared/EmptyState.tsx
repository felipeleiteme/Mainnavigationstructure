import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }>;
  illustration?: React.ReactNode;
}

export default function EmptyState({ 
  emoji, 
  title, 
  description, 
  actions,
  illustration 
}: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : emoji ? (
        <div className="text-6xl mb-6">{emoji}</div>
      ) : null}
      
      <h3 className="text-xl mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {actions && actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              className={idx === 0 ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}
