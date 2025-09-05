// Core data model types based on specifications

export interface UserConfiguration {
  userId: string;
  predefinedContacts: EmergencyContact[];
  preferredLanguage: 'en' | 'es';
  defaultJurisdiction: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

export interface InteractionLog {
  logId: string;
  userId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    jurisdiction: string;
  };
  recordingUrl?: string;
  notes?: string;
  contactAlertSent: boolean;
  interactionType: 'traffic_stop' | 'questioning' | 'search' | 'arrest' | 'other';
  status: 'active' | 'completed' | 'emergency';
}

export interface LegalCardContent {
  cardId: string;
  jurisdiction: string;
  title: string;
  contentJson: {
    rights: string[];
    dosDonts: {
      dos: string[];
      donts: string[];
    };
    keyLaws: string[];
    emergencyNumbers: string[];
    scripts: DeescalationScript[];
  };
  version: string;
  lastUpdated: string;
  isVerified: boolean;
}

export interface DeescalationScript {
  id: string;
  scenario: string;
  language: 'en' | 'es';
  script: string;
  context: string;
  isPremium: boolean;
}

export interface RecordingSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  fileUrl?: string;
  ipfsHash?: string;
  isActive: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'USD' | 'ETH';
  type: 'stripe' | 'crypto';
  status: 'pending' | 'completed' | 'failed';
  productType: 'premium_scripts' | 'cloud_storage' | 'lawyer_review';
  transactionHash?: string;
  createdAt: string;
}

// UI Component Props Types
export interface FrameContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive';
  className?: string;
}

export interface InfoCardProps {
  variant: 'legal' | 'script';
  title: string;
  content: string | string[];
  jurisdiction?: string;
  language?: 'en' | 'es';
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export interface QuickActionButtonProps {
  variant: 'record' | 'alert' | 'script';
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ContactSelectorProps {
  contacts: EmergencyContact[];
  selectedContacts: string[];
  onSelectionChange: (contactIds: string[]) => void;
  maxSelections?: number;
}

export interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'es';
  onLanguageChange: (language: 'en' | 'es') => void;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  jurisdiction?: string;
}

// Farcaster Frame Types
export interface FrameMetadata {
  title: string;
  image: string;
  buttons: FrameButton[];
  postUrl?: string;
  inputText?: string;
}

export interface FrameButton {
  label: string;
  action: 'post' | 'link' | 'mint';
  target?: string;
}

export interface FrameRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    inputText?: string;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

// Utility Types
export type Jurisdiction = 
  | 'federal'
  | 'alabama' | 'alaska' | 'arizona' | 'arkansas' | 'california' | 'colorado'
  | 'connecticut' | 'delaware' | 'florida' | 'georgia' | 'hawaii' | 'idaho'
  | 'illinois' | 'indiana' | 'iowa' | 'kansas' | 'kentucky' | 'louisiana'
  | 'maine' | 'maryland' | 'massachusetts' | 'michigan' | 'minnesota'
  | 'mississippi' | 'missouri' | 'montana' | 'nebraska' | 'nevada'
  | 'new_hampshire' | 'new_jersey' | 'new_mexico' | 'new_york'
  | 'north_carolina' | 'north_dakota' | 'ohio' | 'oklahoma' | 'oregon'
  | 'pennsylvania' | 'rhode_island' | 'south_carolina' | 'south_dakota'
  | 'tennessee' | 'texas' | 'utah' | 'vermont' | 'virginia' | 'washington'
  | 'west_virginia' | 'wisconsin' | 'wyoming' | 'district_of_columbia';

export type InteractionScenario = 
  | 'traffic_stop'
  | 'street_questioning'
  | 'home_visit'
  | 'workplace_visit'
  | 'search_request'
  | 'arrest_situation'
  | 'checkpoint'
  | 'protest_or_demonstration'
  | 'general_interaction';

export type PremiumFeature = 
  | 'lawyer_vetted_scripts'
  | 'cloud_recording_backup'
  | 'priority_emergency_response'
  | 'legal_consultation_access'
  | 'advanced_location_tracking'
  | 'multi_language_support';

