import React from 'react';
import { cn } from '@/lib/utils';
import type { FrameContainerProps } from '@/types';

const FrameContainer: React.FC<FrameContainerProps> = ({
  children,
  variant = 'default',
  className
}) => {
  return (
    <div
      className={cn(
        // Base styles
        'w-full max-w-3xl mx-auto px-4 py-6 bg-surface rounded-custom-lg shadow-card',
        // Variant styles
        {
          'border border-gray-200': variant === 'default',
          'border-2 border-primary-custom bg-gradient-to-br from-surface to-bg': variant === 'interactive',
        },
        className
      )}
    >
      <div className="space-y-custom-md">
        {children}
      </div>
    </div>
  );
};

export default FrameContainer;

