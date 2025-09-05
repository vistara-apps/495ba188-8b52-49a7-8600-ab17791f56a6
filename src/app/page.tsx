'use client';

import React, { useState, useEffect } from 'react';
import { Shield, MapPin, MessageSquare, Video, AlertTriangle, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FrameContainer from '@/components/features/FrameContainer';
import InfoCard from '@/components/features/InfoCard';
import QuickActionButton from '@/components/features/QuickActionButton';
import ContactSelector from '@/components/features/ContactSelector';
import LanguageSwitcher from '@/components/features/LanguageSwitcher';
import { useLocation } from '@/hooks/useLocation';
import { useRecording } from '@/hooks/useRecording';
import { useEmergencyAlert } from '@/hooks/useEmergencyAlert';
import { cn } from '@/lib/utils';
import type { 
  LegalCardContent, 
  DeescalationScript, 
  EmergencyContact, 
  UserConfiguration 
} from '@/types';

export default function HomePage() {
  // State management
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es'>('en');
  const [legalCard, setLegalCard] = useState<LegalCardContent | null>(null);
  const [currentScript, setCurrentScript] = useState<DeescalationScript | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [userConfig, setUserConfig] = useState<UserConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'rights' | 'scripts' | 'contacts'>('rights');

  // Custom hooks
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const { isRecording, startRecordingSession, stopRecordingSession, error: recordingError } = useRecording();
  const { sendEmergencyAlert, isSending: alertSending, error: alertError } = useEmergencyAlert();

  // Mock user ID - in production, get from authentication
  const userId = 'demo-user-123';

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user configuration
        const mockUserConfig: UserConfiguration = {
          userId,
          predefinedContacts: [],
          preferredLanguage: 'en',
          defaultJurisdiction: location?.jurisdiction || 'california',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUserConfig(mockUserConfig);

        // Load mock emergency contacts
        const mockContacts: EmergencyContact[] = [
          {
            id: '1',
            name: 'John Doe',
            phone: '+1234567890',
            email: 'john@example.com',
            relationship: 'spouse',
            isPrimary: true
          },
          {
            id: '2',
            name: 'Jane Smith',
            phone: '+1987654321',
            email: 'jane@example.com',
            relationship: 'friend',
            isPrimary: false
          },
          {
            id: '3',
            name: 'Legal Aid Society',
            phone: '+1555123456',
            email: 'help@legalaid.org',
            relationship: 'legal_aid',
            isPrimary: true
          }
        ];
        setEmergencyContacts(mockContacts);
        setSelectedContacts(mockContacts.filter(c => c.isPrimary).map(c => c.id));

        // Load legal card if location is available
        if (location?.jurisdiction) {
          await loadLegalCard(location.jurisdiction);
        }

      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!locationLoading) {
      initializeApp();
    }
  }, [location, locationLoading]);

  // Load legal card content
  const loadLegalCard = async (jurisdiction: string) => {
    try {
      const response = await fetch('/api/ai/generate-legal-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jurisdiction, language: currentLanguage })
      });

      if (response.ok) {
        const result = await response.json();
        setLegalCard(result.data);
      }
    } catch (error) {
      console.error('Failed to load legal card:', error);
    }
  };

  // Generate de-escalation script
  const generateScript = async (scenario: string = 'general_interaction') => {
    try {
      const response = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario, 
          language: currentLanguage, 
          isPremium: false,
          userId 
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentScript(result.data);
        setActiveSection('scripts');
      }
    } catch (error) {
      console.error('Failed to generate script:', error);
    }
  };

  // Handle recording toggle
  const handleRecordingToggle = async () => {
    if (!location) return;

    try {
      if (isRecording) {
        const recordingBlob = await stopRecordingSession();
        if (recordingBlob) {
          console.log('Recording saved:', recordingBlob);
          // In production, upload to IPFS or cloud storage
        }
      } else {
        await startRecordingSession(userId, {
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  // Handle emergency alert
  const handleEmergencyAlert = async () => {
    if (!location || selectedContacts.length === 0) return;

    try {
      const contactsToAlert = emergencyContacts.filter(c => 
        selectedContacts.includes(c.id)
      );

      await sendEmergencyAlert(
        userId,
        contactsToAlert,
        location,
        { name: 'Demo User', phone: '+1234567890' },
        currentLanguage
      );

      alert(currentLanguage === 'es' 
        ? 'Alerta de emergencia enviada exitosamente'
        : 'Emergency alert sent successfully'
      );
    } catch (error) {
      console.error('Emergency alert error:', error);
      alert(currentLanguage === 'es' 
        ? 'Error al enviar la alerta de emergencia'
        : 'Failed to send emergency alert'
      );
    }
  };

  // Language change handler
  const handleLanguageChange = (language: 'en' | 'es') => {
    setCurrentLanguage(language);
    if (location?.jurisdiction) {
      loadLegalCard(location.jurisdiction);
    }
  };

  if (isLoading || locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto mb-4"></div>
          <p className="text-text-secondary">
            {currentLanguage === 'es' ? 'Cargando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <FrameContainer variant="interactive">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary-custom" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                KnowYourRights Now
              </h1>
              <p className="text-sm text-text-secondary">
                {currentLanguage === 'es' 
                  ? 'Tu guía instantánea de derechos'
                  : 'Your instant rights guide'
                }
              </p>
            </div>
          </div>
          
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Location Status */}
        {location && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {currentLanguage === 'es' ? 'Ubicación detectada: ' : 'Location detected: '}
                  <span className="font-medium capitalize">
                    {location.jurisdiction?.replace('_', ' ')}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <QuickActionButton
            variant="record"
            onClick={handleRecordingToggle}
            isActive={isRecording}
            disabled={!location}
          />
          <QuickActionButton
            variant="alert"
            onClick={handleEmergencyAlert}
            disabled={!location || selectedContacts.length === 0 || alertSending}
          />
          <QuickActionButton
            variant="script"
            onClick={() => generateScript()}
            disabled={!location}
          />
        </div>

        {/* Section Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-custom-md p-1">
          {[
            { key: 'rights', label: currentLanguage === 'es' ? 'Derechos' : 'Rights', icon: Shield },
            { key: 'scripts', label: currentLanguage === 'es' ? 'Scripts' : 'Scripts', icon: MessageSquare },
            { key: 'contacts', label: currentLanguage === 'es' ? 'Contactos' : 'Contacts', icon: User }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection(key as any)}
              className={cn(
                'flex-1 transition-all duration-fast',
                {
                  'bg-white shadow-sm text-text-primary': activeSection === key,
                  'text-text-secondary hover:text-text-primary': activeSection !== key
                }
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Legal Rights Section */}
          {activeSection === 'rights' && legalCard && (
            <div className="space-y-4">
              <InfoCard
                variant="legal"
                title={currentLanguage === 'es' ? 'Tus Derechos' : 'Your Rights'}
                content={legalCard.contentJson.rights}
                jurisdiction={location?.jurisdiction}
                language={currentLanguage}
              />
              
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard
                  variant="legal"
                  title={currentLanguage === 'es' ? 'Qué Hacer' : 'Do\'s'}
                  content={legalCard.contentJson.dosDonts.dos}
                  jurisdiction={location?.jurisdiction}
                  language={currentLanguage}
                />
                <InfoCard
                  variant="legal"
                  title={currentLanguage === 'es' ? 'Qué NO Hacer' : 'Don\'ts'}
                  content={legalCard.contentJson.dosDonts.donts}
                  jurisdiction={location?.jurisdiction}
                  language={currentLanguage}
                />
              </div>
            </div>
          )}

          {/* Scripts Section */}
          {activeSection === 'scripts' && (
            <div className="space-y-4">
              {currentScript ? (
                <InfoCard
                  variant="script"
                  title={currentLanguage === 'es' ? 'Script de Des-escalamiento' : 'De-escalation Script'}
                  content={currentScript.script}
                  jurisdiction={location?.jurisdiction}
                  language={currentLanguage}
                  isPremium={currentScript.isPremium}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-text-secondary mb-4">
                        {currentLanguage === 'es' 
                          ? 'Haz clic en "Obtener Script" para generar frases de des-escalamiento'
                          : 'Click "Get Script" to generate de-escalation phrases'
                        }
                      </p>
                      <Button onClick={() => generateScript()}>
                        {currentLanguage === 'es' ? 'Generar Script' : 'Generate Script'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Contacts Section */}
          {activeSection === 'contacts' && (
            <ContactSelector
              contacts={emergencyContacts}
              selectedContacts={selectedContacts}
              onSelectionChange={setSelectedContacts}
              maxSelections={3}
            />
          )}
        </div>

        {/* Error Messages */}
        {(locationError || recordingError || alertError) && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">
                  {locationError || recordingError || alertError}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-text-secondary">
            <p>
              {currentLanguage === 'es' 
                ? 'Esta información es solo para fines educativos. Consulte con un abogado para asesoramiento legal específico.'
                : 'This information is for educational purposes only. Consult with an attorney for specific legal advice.'
              }
            </p>
            <p className="mt-2">
              {currentLanguage === 'es' 
                ? 'Desarrollado para Base Mini Apps'
                : 'Built for Base Mini Apps'
              }
            </p>
          </div>
        </div>
      </FrameContainer>
    </div>
  );
}

