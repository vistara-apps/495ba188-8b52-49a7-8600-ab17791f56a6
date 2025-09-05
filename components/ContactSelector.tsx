'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { EmergencyContact } from '@/lib/types';
import { Phone, User, Plus, X } from 'lucide-react';

interface ContactSelectorProps {
  contacts: EmergencyContact[];
  onContactsChange: (contacts: EmergencyContact[]) => void;
  className?: string;
}

export function ContactSelector({ 
  contacts, 
  onContactsChange, 
  className 
}: ContactSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship || 'Contact',
        isPrimary: contacts.length === 0,
      };
      
      onContactsChange([...contacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setIsAdding(false);
    }
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    onContactsChange(updatedContacts);
  };

  const setPrimary = (id: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id,
    }));
    onContactsChange(updatedContacts);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Emergency Contacts
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-secondary text-sm px-3 py-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{contact.name}</span>
                  {contact.isPrimary && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <div className="text-white text-opacity-70 text-sm">
                  {contact.relationship}
                </div>
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center mt-1"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                {!contact.isPrimary && (
                  <button
                    onClick={() => setPrimary(contact.id)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="glass-card p-4 space-y-4">
          <h4 className="text-white font-medium">Add Emergency Contact</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Relationship (e.g., Family, Friend)"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              className="w-full px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addContact}
              className="btn-primary flex-1"
            >
              Add Contact
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 && !isAdding && (
        <div className="glass-card p-6 text-center">
          <User className="w-12 h-12 text-white text-opacity-50 mx-auto mb-3" />
          <p className="text-white text-opacity-70">
            No emergency contacts added yet. Add contacts who should be notified in case of an emergency.
          </p>
        </div>
      )}
    </div>
  );
}
