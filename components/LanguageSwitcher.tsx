'use client';

import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'es';
  onLanguageChange: (language: 'en' | 'es') => void;
  className?: string;
}

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange, 
  className 
}: LanguageSwitcherProps) {
  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇺🇸' },
    { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Globe className="w-5 h-5 text-white text-opacity-70" />
      <div className="flex bg-white bg-opacity-10 rounded-lg p-1">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              currentLanguage === language.code
                ? 'bg-white bg-opacity-20 text-white'
                : 'text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10'
            )}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}
