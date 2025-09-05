import { useState, useEffect } from 'react';
import { getCurrentLocation, getJurisdictionFromCoords } from '@/lib/utils';
import type { LocationData } from '@/types';

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      
      // Get jurisdiction from coordinates
      const jurisdiction = await getJurisdictionFromCoords(latitude, longitude);
      
      // In a real app, you'd use a reverse geocoding service
      const locationData: LocationData = {
        latitude,
        longitude,
        jurisdiction,
        // Mock address data - in production, use Google Maps API or similar
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: 'Unknown City',
        state: jurisdiction,
        country: 'US'
      };

      setLocation(locationData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    location,
    loading,
    error,
    refetch: fetchLocation
  };
}

