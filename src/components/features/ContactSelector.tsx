import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Phone, Mail, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPhoneNumber } from '@/lib/utils';
import type { ContactSelectorProps } from '@/types';

const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  selectedContacts,
  onSelectionChange,
  maxSelections = 3
}) => {
  const handleContactToggle = (contactId: string) => {
    const isSelected = selectedContacts.includes(contactId);
    
    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedContacts.filter(id => id !== contactId));
    } else {
      // Add to selection if under limit
      if (selectedContacts.length < maxSelections) {
        onSelectionChange([...selectedContacts, contactId]);
      }
    }
  };

  const selectAll = () => {
    const primaryContacts = contacts
      .filter(contact => contact.isPrimary)
      .slice(0, maxSelections)
      .map(contact => contact.id);
    
    if (primaryContacts.length === 0) {
      // If no primary contacts, select first few contacts
      const firstContacts = contacts.slice(0, maxSelections).map(contact => contact.id);
      onSelectionChange(firstContacts);
    } else {
      onSelectionChange(primaryContacts);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary mb-4">No emergency contacts configured</p>
            <Button variant="outline" size="sm">
              Add Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Emergency Contacts</span>
          </span>
          <span className="text-sm font-normal text-text-secondary">
            {selectedContacts.length}/{maxSelections} selected
          </span>
        </CardTitle>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAll}
            disabled={selectedContacts.length === maxSelections}
          >
            Select Primary
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAll}
            disabled={selectedContacts.length === 0}
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {contacts.map((contact) => {
            const isSelected = selectedContacts.includes(contact.id);
            const canSelect = isSelected || selectedContacts.length < maxSelections;
            
            return (
              <div
                key={contact.id}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-custom-md border transition-all duration-base cursor-pointer',
                  {
                    'border-primary-custom bg-blue-50': isSelected,
                    'border-gray-200 hover:border-gray-300 hover:bg-gray-50': !isSelected && canSelect,
                    'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed': !canSelect
                  }
                )}
                onClick={() => canSelect && handleContactToggle(contact.id)}
              >
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  {
                    'border-primary-custom bg-primary-custom': isSelected,
                    'border-gray-300': !isSelected
                  }
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-text-primary truncate">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-xs text-text-secondary">
                      <Phone className="w-3 h-3" />
                      <span>{formatPhoneNumber(contact.phone)}</span>
                    </div>
                    
                    {contact.email && (
                      <div className="flex items-center space-x-1 text-xs text-text-secondary">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{contact.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-text-secondary mt-1 capitalize">
                    {contact.relationship}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedContacts.length === maxSelections && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-custom-md">
            <p className="text-xs text-blue-800">
              Maximum number of contacts selected. Deselect a contact to choose a different one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSelector;

