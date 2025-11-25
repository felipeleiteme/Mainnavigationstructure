import { Badge } from '../ui/badge';

export interface FilterOption {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
  color?: string;
}

interface HorizontalFilterListProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function HorizontalFilterList({ 
  options, 
  activeFilter, 
  onFilterChange 
}: HorizontalFilterListProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = option.id === activeFilter;
        
        return (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap 
              text-sm transition-all duration-200 flex-shrink-0
              ${isActive
                ? 'text-white shadow-lg'
                : 'text-white/90 hover:text-white hover:bg-white/10 border-2 border-white/30'
              }
            `}
            style={isActive ? { backgroundColor: '#C8E046', color: '#4A2C60' } : {}}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{option.label}</span>
            {option.count !== undefined && (
              <Badge 
                className={`
                  ml-1 px-2 py-0.5
                  ${isActive 
                    ? 'text-white border-white/30' 
                    : 'bg-white/20 text-white border-white/30'
                  }
                `}
                style={isActive ? { backgroundColor: 'rgba(74, 44, 96, 0.2)' } : {}}
              >
                {option.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}