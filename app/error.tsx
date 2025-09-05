'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 text-center max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-white text-opacity-70 mb-6">
          We encountered an error while loading the app. This might be a temporary issue.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="btn-primary w-full flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
        
        {error.digest && (
          <p className="text-white text-opacity-50 text-xs mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
