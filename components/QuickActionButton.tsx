'use client';

import { cn } from '@/lib/utils';
import type { QuickActionButtonProps } from '@/lib/types';
import { Video, AlertTriangle, MessageSquare, Square } from 'lucide-react';

export function QuickActionButton({ 
  variant, 
  onClick, 
  disabled = false, 
  isActive = false, 
  className 
}: QuickActionButtonProps) {
  const getButtonConfig = () => {
    switch (variant) {
      case 'record':
        return {
          icon: isActive ? Square : Video,
          label: isActive ? 'Stop Recording' : 'Start Recording',
          bgClass: isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
          description: 'Discreetly record the interaction'
        };
      case 'alert':
        return {
          icon: AlertTriangle,
          label: 'Emergency Alert',
          bgClass: 'bg-red-500 hover:bg-red-600',
          description: 'Notify emergency contacts'
        };
      case 'script':
        return {
          icon: MessageSquare,
          label: 'De-escalation Scripts',
          bgClass: 'bg-green-500 hover:bg-green-600',
          description: 'Get helpful phrases'
        };
      default:
        return {
          icon: MessageSquare,
          label: 'Action',
          bgClass: 'bg-gray-500 hover:bg-gray-600',
          description: ''
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-6 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
        config.bgClass,
        isActive && 'animate-pulse-slow',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-3">
        <Icon className="w-8 h-8" />
        <div className="text-center">
          <div className="text-lg font-bold">{config.label}</div>
          {config.description && (
            <div className="text-sm opacity-90">{config.description}</div>
          )}
        </div>
      </div>
    </button>
  );
}
