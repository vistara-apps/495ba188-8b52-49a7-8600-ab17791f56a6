import { createClient } from '@supabase/supabase-js';
import type { UserConfiguration, InteractionLog, LegalCardContent } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// User Configuration Operations
export async function createUserConfiguration(config: Omit<UserConfiguration, 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('user_configurations')
    .insert([{
      ...config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserConfiguration(userId: string) {
  const { data, error } = await supabase
    .from('user_configurations')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserConfiguration(userId: string, updates: Partial<UserConfiguration>) {
  const { data, error } = await supabase
    .from('user_configurations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Interaction Log Operations
export async function createInteractionLog(log: Omit<InteractionLog, 'logId' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('interaction_logs')
    .insert([{
      ...log,
      timestamp: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInteractionLogs(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('interaction_logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function updateInteractionLog(logId: string, updates: Partial<InteractionLog>) {
  const { data, error } = await supabase
    .from('interaction_logs')
    .update(updates)
    .eq('log_id', logId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Legal Card Content Operations
export async function getLegalCardContent(jurisdiction: string) {
  const { data, error } = await supabase
    .from('legal_card_content')
    .select('*')
    .eq('jurisdiction', jurisdiction)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createLegalCardContent(content: Omit<LegalCardContent, 'cardId' | 'lastUpdated'>) {
  const { data, error } = await supabase
    .from('legal_card_content')
    .insert([{
      ...content,
      last_updated: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Emergency Contact Operations
export async function sendEmergencyAlert(userId: string, message: string, location: any) {
  // This would integrate with SMS/email services
  // For now, we'll log the alert attempt
  const { data, error } = await supabase
    .from('emergency_alerts')
    .insert([{
      user_id: userId,
      message,
      location,
      sent_at: new Date().toISOString(),
      status: 'sent',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Recording Operations
export async function saveRecordingMetadata(userId: string, recordingData: any) {
  const { data, error } = await supabase
    .from('recordings')
    .insert([{
      user_id: userId,
      ...recordingData,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
