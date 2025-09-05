// User Configuration Types
export interface UserConfiguration {
  userId: string;
  predefinedContacts: EmergencyContact[];
  preferredLanguage: 'en' | 'es';
  defaultJurisdiction: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// Interaction Log Types
export interface InteractionLog {
  logId: string;
  userId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  recordingUrl?: string;
  notes?: string;
  contactAlertSent: boolean;
  interactionType: 'traffic_stop' | 'street_encounter' | 'home_visit' | 'other';
  status: 'active' | 'completed' | 'emergency';
}

// Legal Card Content Types
export interface LegalCardContent {
  cardId: string;
  jurisdiction: string;
  title: string;
  contentJson: LegalRights;
  version: string;
  lastUpdated: Date;
  isVerified: boolean;
}

export interface LegalRights {
  dos: string[];
  donts: string[];
  keyRights: string[];
  importantNumbers: {
    name: string;
    number: string;
    description: string;
  }[];
  specificLaws: {
    title: string;
    description: string;
    reference: string;
  }[];
}

// De-escalation Script Types
export interface DeescalationScript {
  id: string;
  scenario: string;
  language: 'en' | 'es';
  scripts: {
    situation: string;
    response: string;
    tone: 'calm' | 'assertive' | 'cooperative';
  }[];
  isPremium: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Component Props Types
export interface FrameContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive';
  className?: string;
}

export interface InfoCardProps {
  variant: 'legal' | 'script';
  title: string;
  content: string | LegalRights | DeescalationScript;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export interface QuickActionButtonProps {
  variant: 'record' | 'alert' | 'script';
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  className?: string;
}

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  state?: string;
  country?: string;
}

// Recording Types
export interface RecordingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  fileUrl?: string;
  isUploaded: boolean;
  metadata: {
    location: LocationData;
    quality: 'low' | 'medium' | 'high';
    fileSize?: number;
  };
}

// Premium Feature Types
export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'ETH';
  type: 'one_time' | 'subscription';
  features: string[];
}
