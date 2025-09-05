import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LanguageSwitcherProps } from '@/types';

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ] as const;

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-text-secondary" />
      <div className="flex bg-gray-100 rounded-custom-md p-1">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language.code)}
            className={cn(
              'px-3 py-1 text-xs font-medium transition-all duration-fast',
              {
                'bg-white shadow-sm text-text-primary': currentLanguage === language.code,
                'text-text-secondary hover:text-text-primary': currentLanguage !== language.code
              }
            )}
          >
            <span className="mr-1">{language.flag}</span>
            {language.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;

