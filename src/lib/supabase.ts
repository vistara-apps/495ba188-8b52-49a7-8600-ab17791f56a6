import { createClient } from '@supabase/supabase-js';
import type { 
  UserConfiguration, 
  InteractionLog, 
  LegalCardContent, 
  EmergencyContact,
  RecordingSession,
  PaymentTransaction 
} from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      user_configurations: {
        Row: UserConfiguration;
        Insert: Omit<UserConfiguration, 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<UserConfiguration, 'userId' | 'createdAt'>>;
      };
      interaction_logs: {
        Row: InteractionLog;
        Insert: Omit<InteractionLog, 'logId' | 'timestamp'>;
        Update: Partial<Omit<InteractionLog, 'logId' | 'userId'>>;
      };
      legal_card_content: {
        Row: LegalCardContent;
        Insert: Omit<LegalCardContent, 'cardId' | 'lastUpdated'>;
        Update: Partial<Omit<LegalCardContent, 'cardId'>>;
      };
      emergency_contacts: {
        Row: EmergencyContact;
        Insert: Omit<EmergencyContact, 'id'>;
        Update: Partial<Omit<EmergencyContact, 'id'>>;
      };
      recording_sessions: {
        Row: RecordingSession;
        Insert: Omit<RecordingSession, 'id' | 'startTime'>;
        Update: Partial<Omit<RecordingSession, 'id' | 'userId'>>;
      };
      payment_transactions: {
        Row: PaymentTransaction;
        Insert: Omit<PaymentTransaction, 'id' | 'createdAt'>;
        Update: Partial<Omit<PaymentTransaction, 'id' | 'userId'>>;
      };
    };
  };
}

// User Configuration operations
export const userConfigService = {
  async get(userId: string): Promise<UserConfiguration | null> {
    const { data, error } = await supabase
      .from('user_configurations')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      console.error('Error fetching user configuration:', error);
      return null;
    }

    return data;
  },

  async create(config: Omit<UserConfiguration, 'createdAt' | 'updatedAt'>): Promise<UserConfiguration | null> {
    const { data, error } = await supabase
      .from('user_configurations')
      .insert({
        ...config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user configuration:', error);
      return null;
    }

    return data;
  },

  async update(userId: string, updates: Partial<UserConfiguration>): Promise<UserConfiguration | null> {
    const { data, error } = await supabase
      .from('user_configurations')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('userId', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user configuration:', error);
      return null;
    }

    return data;
  }
};

// Emergency Contacts operations
export const emergencyContactService = {
  async getByUserId(userId: string): Promise<EmergencyContact[]> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('userId', userId)
      .order('isPrimary', { ascending: false });

    if (error) {
      console.error('Error fetching emergency contacts:', error);
      return [];
    }

    return data || [];
  },

  async create(contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact | null> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contact)
      .select()
      .single();

    if (error) {
      console.error('Error creating emergency contact:', error);
      return null;
    }

    return data;
  },

  async update(id: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact | null> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating emergency contact:', error);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting emergency contact:', error);
      return false;
    }

    return true;
  }
};

// Interaction Logs operations
export const interactionLogService = {
  async getByUserId(userId: string, limit = 50): Promise<InteractionLog[]> {
    const { data, error } = await supabase
      .from('interaction_logs')
      .select('*')
      .eq('userId', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching interaction logs:', error);
      return [];
    }

    return data || [];
  },

  async create(log: Omit<InteractionLog, 'logId' | 'timestamp'>): Promise<InteractionLog | null> {
    const { data, error } = await supabase
      .from('interaction_logs')
      .insert({
        ...log,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating interaction log:', error);
      return null;
    }

    return data;
  },

  async update(logId: string, updates: Partial<InteractionLog>): Promise<InteractionLog | null> {
    const { data, error } = await supabase
      .from('interaction_logs')
      .update(updates)
      .eq('logId', logId)
      .select()
      .single();

    if (error) {
      console.error('Error updating interaction log:', error);
      return null;
    }

    return data;
  }
};

// Legal Card Content operations
export const legalCardService = {
  async getByJurisdiction(jurisdiction: string): Promise<LegalCardContent | null> {
    const { data, error } = await supabase
      .from('legal_card_content')
      .select('*')
      .eq('jurisdiction', jurisdiction)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching legal card content:', error);
      return null;
    }

    return data;
  },

  async create(content: Omit<LegalCardContent, 'cardId' | 'lastUpdated'>): Promise<LegalCardContent | null> {
    const { data, error } = await supabase
      .from('legal_card_content')
      .insert({
        ...content,
        lastUpdated: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating legal card content:', error);
      return null;
    }

    return data;
  }
};

// Recording Sessions operations
export const recordingService = {
  async create(session: Omit<RecordingSession, 'id' | 'startTime'>): Promise<RecordingSession | null> {
    const { data, error } = await supabase
      .from('recording_sessions')
      .insert({
        ...session,
        startTime: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating recording session:', error);
      return null;
    }

    return data;
  },

  async update(id: string, updates: Partial<RecordingSession>): Promise<RecordingSession | null> {
    const { data, error } = await supabase
      .from('recording_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recording session:', error);
      return null;
    }

    return data;
  },

  async getActiveByUserId(userId: string): Promise<RecordingSession | null> {
    const { data, error } = await supabase
      .from('recording_sessions')
      .select('*')
      .eq('userId', userId)
      .eq('isActive', true)
      .single();

    if (error) {
      console.error('Error fetching active recording session:', error);
      return null;
    }

    return data;
  }
};

// Payment Transactions operations
export const paymentService = {
  async create(transaction: Omit<PaymentTransaction, 'id' | 'createdAt'>): Promise<PaymentTransaction | null> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        ...transaction,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment transaction:', error);
      return null;
    }

    return data;
  },

  async update(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment transaction:', error);
      return null;
    }

    return data;
  },

  async getByUserId(userId: string): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching payment transactions:', error);
      return [];
    }

    return data || [];
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToInteractionLogs(userId: string, callback: (log: InteractionLog) => void) {
    return supabase
      .channel('interaction_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'interaction_logs',
          filter: `userId=eq.${userId}`
        },
        (payload) => callback(payload.new as InteractionLog)
      )
      .subscribe();
  },

  subscribeToRecordingSessions(userId: string, callback: (session: RecordingSession) => void) {
    return supabase
      .channel('recording_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recording_sessions',
          filter: `userId=eq.${userId}`
        },
        (payload) => callback(payload.new as RecordingSession)
      )
      .subscribe();
  }
};

