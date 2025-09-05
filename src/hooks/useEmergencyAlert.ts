import { useState, useCallback } from 'react';
import { generateEmergencyMessage } from '@/lib/openai';
import { interactionLogService } from '@/lib/supabase';
import type { EmergencyContact, LocationData } from '@/types';

interface UseEmergencyAlertReturn {
  sendEmergencyAlert: (
    userId: string,
    contacts: EmergencyContact[],
    location: LocationData,
    userInfo: { name?: string; phone?: string },
    language?: 'en' | 'es'
  ) => Promise<void>;
  isSending: boolean;
  error: string | null;
  lastAlertSent: Date | null;
}

export function useEmergencyAlert(): UseEmergencyAlertReturn {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAlertSent, setLastAlertSent] = useState<Date | null>(null);

  const sendSMS = async (phone: string, message: string): Promise<boolean> => {
    try {
      // In a real implementation, you would use a service like Twilio
      // For now, we'll simulate the SMS sending
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message
        })
      });

      return response.ok;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  };

  const sendEmail = async (email: string, subject: string, message: string): Promise<boolean> => {
    try {
      // In a real implementation, you would use a service like SendGrid or AWS SES
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject,
          message
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };

  const sendEmergencyAlert = useCallback(async (
    userId: string,
    contacts: EmergencyContact[],
    location: LocationData,
    userInfo: { name?: string; phone?: string },
    language: 'en' | 'es' = 'en'
  ) => {
    setIsSending(true);
    setError(null);

    try {
      // Generate emergency message
      const message = await generateEmergencyMessage(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        },
        userInfo,
        language
      );

      const subject = language === 'es' 
        ? '🚨 Alerta de Emergencia - KnowYourRights Now'
        : '🚨 Emergency Alert - KnowYourRights Now';

      // Send alerts to all contacts
      const alertPromises = contacts.map(async (contact) => {
        const results = await Promise.allSettled([
          sendSMS(contact.phone, message),
          contact.email ? sendEmail(contact.email, subject, message) : Promise.resolve(true)
        ]);

        return {
          contactId: contact.id,
          smsSuccess: results[0].status === 'fulfilled' && results[0].value,
          emailSuccess: results[1].status === 'fulfilled' && results[1].value
        };
      });

      const alertResults = await Promise.all(alertPromises);
      
      // Check if at least one alert was sent successfully
      const anySuccess = alertResults.some(result => 
        result.smsSuccess || result.emailSuccess
      );

      if (!anySuccess) {
        throw new Error('Failed to send alerts to any contacts');
      }

      // Log the interaction
      await interactionLogService.create({
        userId,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          jurisdiction: location.jurisdiction || 'unknown'
        },
        contactAlertSent: true,
        interactionType: 'other',
        status: 'emergency',
        notes: `Emergency alert sent to ${contacts.length} contacts`
      });

      setLastAlertSent(new Date());
      
      // Show success feedback
      const successCount = alertResults.filter(r => r.smsSuccess || r.emailSuccess).length;
      console.log(`Emergency alert sent successfully to ${successCount}/${contacts.length} contacts`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send emergency alert';
      setError(errorMessage);
      console.error('Emergency alert error:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    sendEmergencyAlert,
    isSending,
    error,
    lastAlertSent
  };
}

