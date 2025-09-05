'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { FrameContainer } from '@/components/FrameContainer';
import { InfoCard } from '@/components/InfoCard';
import { QuickActionButton } from '@/components/QuickActionButton';
import { ContactSelector } from '@/components/ContactSelector';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getCurrentLocation, getStateFromCoordinates, generateEmergencyMessage } from '@/lib/utils';
import type { 
  UserConfiguration, 
  EmergencyContact, 
  LegalRights, 
  DeescalationScript, 
  LocationData 
} from '@/lib/types';
import { 
  Shield, 
  MessageSquare, 
  Settings2, 
  MapPin, 
  AlertTriangle,
  Video,
  Phone,
  Home
} from 'lucide-react';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  
  // State management
  const [currentView, setCurrentView] = useState<'home' | 'legal' | 'scripts' | 'settings'>('home');
  const [userConfig, setUserConfig] = useState<UserConfiguration | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [legalCard, setLegalCard] = useState<LegalRights | null>(null);
  const [currentScript, setCurrentScript] = useState<DeescalationScript | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Get user location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const locationData = await getCurrentLocation();
        const state = await getStateFromCoordinates(locationData.latitude, locationData.longitude);
        
        const fullLocation = {
          ...locationData,
          state,
          address: `${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`
        };
        
        setLocation(fullLocation);
        
        // Initialize user config with detected location
        if (!userConfig) {
          setUserConfig({
            userId: 'demo-user',
            predefinedContacts: [],
            preferredLanguage: 'en',
            defaultJurisdiction: state,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setError('Unable to get location. Some features may be limited.');
      }
    };

    initializeLocation();
  }, [userConfig]);

  // Generate legal card when jurisdiction changes
  useEffect(() => {
    if (userConfig?.defaultJurisdiction && !legalCard) {
      generateLegalCard();
    }
  }, [userConfig?.defaultJurisdiction, legalCard]);

  const generateLegalCard = async () => {
    if (!userConfig) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-legal-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jurisdiction: userConfig.defaultJurisdiction,
          language: userConfig.preferredLanguage,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setLegalCard(result.data.content);
      } else {
        throw new Error(result.error || 'Failed to generate legal card');
      }
    } catch (error) {
      console.error('Error generating legal card:', error);
      setError('Failed to generate legal information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateScripts = async (scenario: string) => {
    if (!userConfig) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          language: userConfig.preferredLanguage,
          jurisdiction: userConfig.defaultJurisdiction,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCurrentScript(result.data);
        setCurrentView('scripts');
      } else {
        throw new Error(result.error || 'Failed to generate scripts');
      }
    } catch (error) {
      console.error('Error generating scripts:', error);
      setError('Failed to generate de-escalation scripts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop actual recording
    if (!isRecording) {
      console.log('Starting recording...');
    } else {
      console.log('Stopping recording...');
    }
  };

  const handleEmergencyAlert = async () => {
    if (!userConfig || !location || userConfig.predefinedContacts.length === 0) {
      setError('Please add emergency contacts first.');
      return;
    }

    try {
      const message = generateEmergencyMessage(location, userConfig);
      
      // In a real app, this would send actual SMS/notifications
      console.log('Emergency alert sent:', message);
      
      // Show confirmation
      alert('Emergency alert sent to your contacts!');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      setError('Failed to send emergency alert.');
    }
  };

  const updateUserConfig = (updates: Partial<UserConfiguration>) => {
    if (userConfig) {
      setUserConfig({
        ...userConfig,
        ...updates,
        updatedAt: new Date(),
      });
    }
  };

  const renderHomeView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">KnowYourRights Now</h1>
        <p className="text-white text-opacity-70">
          Your instant guide to rights and de-escalation
        </p>
        {location && (
          <div className="flex items-center justify-center text-sm text-white text-opacity-60">
            <MapPin className="w-4 h-4 mr-1" />
            {location.state || 'Unknown Location'}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <QuickActionButton
          variant="record"
          onClick={handleRecording}
          isActive={isRecording}
        />
        
        <QuickActionButton
          variant="alert"
          onClick={handleEmergencyAlert}
          disabled={!userConfig?.predefinedContacts.length}
        />
        
        <QuickActionButton
          variant="script"
          onClick={() => generateScripts('traffic_stop')}
          disabled={isLoading}
        />
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentView('legal')}
          className="glass-card-hover p-4 text-center"
        >
          <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-white font-medium">Legal Rights</div>
          <div className="text-white text-opacity-60 text-sm">Know your rights</div>
        </button>
        
        <button
          onClick={() => setCurrentView('settings')}
          className="glass-card-hover p-4 text-center"
        >
          <Settings2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-white font-medium">Settings</div>
          <div className="text-white text-opacity-60 text-sm">Configure app</div>
        </button>
      </div>

      {/* Status Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white text-opacity-70">Emergency Contacts:</span>
          <span className="text-white">
            {userConfig?.predefinedContacts.length || 0} configured
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-white text-opacity-70">Location:</span>
          <span className="text-white">
            {location ? 'Detected' : 'Not available'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-card p-4 border-red-500 border-opacity-50">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderLegalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="text-white text-opacity-70 hover:text-white flex items-center"
        >
          <Home className="w-4 h-4 mr-2" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-white">Legal Rights</h2>
        <div></div>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-opacity-20 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-white text-opacity-70">Generating legal information...</p>
        </div>
      ) : legalCard ? (
        <InfoCard
          variant="legal"
          title={`Rights in ${userConfig?.defaultJurisdiction || 'Your Area'}`}
          content={legalCard}
          onAction={generateLegalCard}
          actionLabel="Refresh Information"
        />
      ) : (
        <div className="glass-card p-6 text-center">
          <Shield className="w-12 h-12 text-white text-opacity-50 mx-auto mb-4" />
          <p className="text-white text-opacity-70 mb-4">
            No legal information available yet.
          </p>
          <button
            onClick={generateLegalCard}
            className="btn-primary"
          >
            Generate Legal Card
          </button>
        </div>
      )}
    </div>
  );

  const renderScriptsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="text-white text-opacity-70 hover:text-white flex items-center"
        >
          <Home className="w-4 h-4 mr-2" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-white">De-escalation Scripts</h2>
        <div></div>
      </div>

      {currentScript ? (
        <InfoCard
          variant="script"
          title="De-escalation Scripts"
          content={currentScript}
          onAction={() => generateScripts('traffic_stop')}
          actionLabel="Generate New Scripts"
        />
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-6 text-center">
            <MessageSquare className="w-12 h-12 text-white text-opacity-50 mx-auto mb-4" />
            <p className="text-white text-opacity-70 mb-4">
              Choose a scenario to get helpful de-escalation scripts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'traffic_stop', label: 'Traffic Stop', icon: '🚗' },
              { id: 'street_encounter', label: 'Street Encounter', icon: '🚶' },
              { id: 'home_visit', label: 'Home Visit', icon: '🏠' },
              { id: 'general', label: 'General Interaction', icon: '👮' },
            ].map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => generateScripts(scenario.id)}
                disabled={isLoading}
                className="glass-card-hover p-4 text-left disabled:opacity-50"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{scenario.icon}</span>
                  <span className="text-white font-medium">{scenario.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('home')}
          className="text-white text-opacity-70 hover:text-white flex items-center"
        >
          <Home className="w-4 h-4 mr-2" />
          Back
        </button>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <div></div>
      </div>

      <div className="space-y-6">
        {/* Language Switcher */}
        <div className="glass-card p-4">
          <h3 className="text-white font-medium mb-4">Language Preference</h3>
          <LanguageSwitcher
            currentLanguage={userConfig?.preferredLanguage || 'en'}
            onLanguageChange={(language) => updateUserConfig({ preferredLanguage: language })}
          />
        </div>

        {/* Location Settings */}
        <div className="glass-card p-4">
          <h3 className="text-white font-medium mb-4">Location</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-opacity-70">Current State:</span>
              <span className="text-white">{userConfig?.defaultJurisdiction || 'Unknown'}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Refresh Location
            </button>
          </div>
        </div>

        {/* Emergency Contacts */}
        {userConfig && (
          <ContactSelector
            contacts={userConfig.predefinedContacts}
            onContactsChange={(contacts) => updateUserConfig({ predefinedContacts: contacts })}
          />
        )}
      </div>
    </div>
  );

  return (
    <FrameContainer variant="interactive">
      {currentView === 'home' && renderHomeView()}
      {currentView === 'legal' && renderLegalView()}
      {currentView === 'scripts' && renderScriptsView()}
      {currentView === 'settings' && renderSettingsView()}
    </FrameContainer>
  );
}
