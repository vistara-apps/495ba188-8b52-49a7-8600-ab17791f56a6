'use client';

import { cn } from '@/lib/utils';
import type { InfoCardProps, LegalRights, DeescalationScript } from '@/lib/types';
import { Shield, MessageSquare, AlertTriangle, Phone } from 'lucide-react';

export function InfoCard({ 
  variant, 
  title, 
  content, 
  onAction, 
  actionLabel, 
  className 
}: InfoCardProps) {
  const renderIcon = () => {
    switch (variant) {
      case 'legal':
        return <Shield className="w-6 h-6 text-blue-400" />;
      case 'script':
        return <MessageSquare className="w-6 h-6 text-green-400" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (typeof content === 'string') {
      return <p className="text-white text-opacity-90">{content}</p>;
    }

    if (variant === 'legal' && typeof content === 'object' && 'dos' in content) {
      const legalContent = content as LegalRights;
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-green-400 font-semibold mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Do's
            </h4>
            <ul className="space-y-1">
              {legalContent.dos.map((item, index) => (
                <li key={index} className="text-white text-opacity-90 text-sm flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-red-400 font-semibold mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Don'ts
            </h4>
            <ul className="space-y-1">
              {legalContent.donts.map((item, index) => (
                <li key={index} className="text-white text-opacity-90 text-sm flex items-start">
                  <span className="text-red-400 mr-2">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {legalContent.keyRights.length > 0 && (
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Key Rights</h4>
              <ul className="space-y-1">
                {legalContent.keyRights.map((right, index) => (
                  <li key={index} className="text-white text-opacity-90 text-sm flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {right}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {legalContent.importantNumbers.length > 0 && (
            <div>
              <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Important Numbers
              </h4>
              <div className="space-y-2">
                {legalContent.importantNumbers.map((contact, index) => (
                  <div key={index} className="glass-card p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{contact.name}</span>
                      <a 
                        href={`tel:${contact.number}`}
                        className="text-blue-400 hover:text-blue-300 font-mono"
                      >
                        {contact.number}
                      </a>
                    </div>
                    <p className="text-white text-opacity-70 text-sm">{contact.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (variant === 'script' && typeof content === 'object' && 'scripts' in content) {
      const scriptContent = content as DeescalationScript;
      return (
        <div className="space-y-4">
          <p className="text-white text-opacity-70 text-sm mb-4">
            Scenario: {scriptContent.scenario}
          </p>
          <div className="space-y-3">
            {scriptContent.scripts.map((script, index) => (
              <div key={index} className="glass-card p-4">
                <div className="mb-2">
                  <span className="text-blue-400 text-sm font-medium">
                    {script.situation}
                  </span>
                  <span className={cn(
                    "ml-2 px-2 py-1 rounded-full text-xs",
                    script.tone === 'calm' && "bg-green-500 bg-opacity-20 text-green-400",
                    script.tone === 'assertive' && "bg-yellow-500 bg-opacity-20 text-yellow-400",
                    script.tone === 'cooperative' && "bg-blue-500 bg-opacity-20 text-blue-400"
                  )}>
                    {script.tone}
                  </span>
                </div>
                <p className="text-white text-opacity-90 italic">
                  "{script.response}"
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn('glass-card p-6 space-y-4', className)}>
      <div className="flex items-center space-x-3">
        {renderIcon()}
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {renderContent()}
      </div>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="btn-primary w-full"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
