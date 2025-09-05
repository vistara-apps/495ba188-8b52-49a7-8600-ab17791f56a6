'use client';

import { cn } from '@/lib/utils';
import type { FrameContainerProps } from '@/lib/types';

export function FrameContainer({ 
  children, 
  variant = 'default', 
  className 
}: FrameContainerProps) {
  return (
    <div className={cn(
      'w-full max-w-md mx-auto min-h-screen',
      variant === 'interactive' && 'p-4',
      variant === 'default' && 'p-6',
      className
    )}>
      <div className="glass-card p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}
