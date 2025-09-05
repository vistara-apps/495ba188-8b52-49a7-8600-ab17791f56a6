import { useState, useRef, useCallback } from 'react';
import { startRecording, stopRecording } from '@/lib/utils';
import { recordingService } from '@/lib/supabase';
import type { RecordingSession } from '@/types';

interface UseRecordingReturn {
  isRecording: boolean;
  recordingSession: RecordingSession | null;
  startRecordingSession: (userId: string, location: { latitude: number; longitude: number }) => Promise<void>;
  stopRecordingSession: () => Promise<Blob | null>;
  error: string | null;
}

export function useRecording(): UseRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSession, setRecordingSession] = useState<RecordingSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecordingSession = useCallback(async (
    userId: string, 
    location: { latitude: number; longitude: number }
  ) => {
    try {
      setError(null);
      
      // Start media recording
      const mediaRecorder = await startRecording();
      mediaRecorderRef.current = mediaRecorder;
      
      // Create recording session in database
      const session = await recordingService.create({
        userId,
        location,
        isActive: true
      });

      if (!session) {
        throw new Error('Failed to create recording session');
      }

      setRecordingSession(session);
      setIsRecording(true);
      
      // Start recording
      mediaRecorder.start();
      
      console.log('Recording started successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      console.error('Recording start error:', err);
    }
  }, []);

  const stopRecordingSession = useCallback(async (): Promise<Blob | null> => {
    try {
      setError(null);
      
      if (!mediaRecorderRef.current || !recordingSession) {
        throw new Error('No active recording session');
      }

      // Stop media recording and get blob
      const recordingBlob = await stopRecording(mediaRecorderRef.current);
      
      // Update recording session in database
      const endTime = new Date().toISOString();
      const duration = Math.floor(
        (new Date(endTime).getTime() - new Date(recordingSession.startTime).getTime()) / 1000
      );

      await recordingService.update(recordingSession.id, {
        endTime,
        duration,
        isActive: false
      });

      setIsRecording(false);
      setRecordingSession(null);
      mediaRecorderRef.current = null;
      
      console.log('Recording stopped successfully');
      return recordingBlob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      console.error('Recording stop error:', err);
      return null;
    }
  }, [recordingSession]);

  return {
    isRecording,
    recordingSession,
    startRecordingSession,
    stopRecordingSession,
    error
  };
}

