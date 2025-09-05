import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InfoCardProps } from '@/types';

const InfoCard: React.FC<InfoCardProps> = ({
  variant,
  title,
  content,
  jurisdiction,
  language = 'en',
  isPremium = false,
  onUpgrade
}) => {
  const renderContent = () => {
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-2">
          {content.map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-primary-custom rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-text-primary leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    return (
      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    );
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'legal':
        return {
          headerBg: 'bg-blue-50',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'script':
        return {
          headerBg: 'bg-green-50',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      default:
        return {
          headerBg: 'bg-gray-50',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={cn(
      'relative transition-all duration-base ease-out hover:shadow-modal',
      styles.borderColor,
      isPremium && 'ring-2 ring-yellow-400 ring-opacity-50'
    )}>
      {isPremium && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
          <Crown className="w-4 h-4" />
        </div>
      )}
      
      <CardHeader className={cn('pb-3', styles.headerBg)}>
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-text-primary">
          <span className="flex items-center space-x-2">
            {variant === 'legal' && <MapPin className={cn('w-5 h-5', styles.iconColor)} />}
            {variant === 'script' && <Globe className={cn('w-5 h-5', styles.iconColor)} />}
            <span>{title}</span>
          </span>
          
          {isPremium && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
              Premium
            </span>
          )}
        </CardTitle>
        
        {jurisdiction && (
          <div className="flex items-center space-x-1 text-xs text-text-secondary">
            <MapPin className="w-3 h-3" />
            <span className="capitalize">{jurisdiction.replace('_', ' ')}</span>
            {language === 'es' && (
              <>
                <span>•</span>
                <span>Español</span>
              </>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        {renderContent()}
        
        {isPremium && !onUpgrade && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-custom-md">
            <p className="text-xs text-yellow-800">
              This is premium content that has been reviewed by legal experts.
            </p>
          </div>
        )}
        
        {isPremium && onUpgrade && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-custom-md">
            <p className="text-xs text-yellow-800 mb-2">
              Unlock premium content reviewed by legal experts
            </p>
            <Button 
              size="sm" 
              onClick={onUpgrade}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;

