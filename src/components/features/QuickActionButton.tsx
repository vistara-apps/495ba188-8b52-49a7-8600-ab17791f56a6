import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  AlertTriangle, 
  MessageSquare, 
  Square,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuickActionButtonProps } from '@/types';

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  variant,
  onClick,
  isActive = false,
  disabled = false,
  className
}) => {
  const getButtonConfig = () => {
    switch (variant) {
      case 'record':
        return {
          icon: isActive ? Square : Video,
          label: isActive ? 'Stop Recording' : 'Start Recording',
          variant: isActive ? 'destructive' : 'record',
          description: 'Discreetly record the interaction'
        };
      case 'alert':
        return {
          icon: AlertTriangle,
          label: 'Emergency Alert',
          variant: 'alert',
          description: 'Notify your emergency contacts'
        };
      case 'script':
        return {
          icon: MessageSquare,
          label: 'Get Script',
          variant: 'script',
          description: 'Get de-escalation phrases'
        };
      default:
        return {
          icon: Circle,
          label: 'Action',
          variant: 'default',
          description: 'Perform action'
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        variant={config.variant as any}
        size="xl"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative transition-all duration-base ease-out transform hover:scale-105 active:scale-95',
          'focus:ring-4 focus:ring-opacity-50',
          {
            'animate-pulse': isActive && variant === 'record',
            'focus:ring-red-300': variant === 'record',
            'focus:ring-orange-300': variant === 'alert',
            'focus:ring-blue-300': variant === 'script',
          },
          className
        )}
      >
        <Icon className={cn(
          'w-6 h-6 mr-2',
          isActive && variant === 'record' && 'animate-pulse'
        )} />
        {config.label}
        
        {isActive && variant === 'record' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </Button>
      
      <p className="text-xs text-text-secondary text-center max-w-[120px] leading-tight">
        {config.description}
      </p>
    </div>
  );
};

export default QuickActionButton;

