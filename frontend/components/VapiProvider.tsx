'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

interface VapiContextType {
  vapi: Vapi | null;
  isCallActive: boolean;
  startCall: () => Promise<void>;
  endCall: () => void;
  error: string | null;
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

export function VapiProvider({ children }: { children: ReactNode }) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Vapi instance on mount
  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsCallActive(true);
      setError(null);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsCallActive(false);
    });

    vapiInstance.on('error', (err) => {
      console.error('Vapi error:', err);
      setError(err.message || 'An error occurred');
      setIsCallActive(false);
    });

    // Cleanup on unmount
    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapi) {
      setError('Vapi is not initialized');
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setError('Assistant ID not configured');
      return;
    }

    try {
      setError(null);
      await vapi.start(assistantId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start call';
      setError(errorMessage);
      console.error('Failed to start call:', err);
    }
  }, [vapi]);

  const endCall = useCallback(() => {
    if (!vapi) return;
    
    try {
      vapi.stop();
      setIsCallActive(false);
    } catch (err) {
      console.error('Failed to end call:', err);
    }
  }, [vapi]);

  return (
    <VapiContext.Provider value={{ vapi, isCallActive, startCall, endCall, error }}>
      {children}
    </VapiContext.Provider>
  );
}

export function useVapi() {
  const context = useContext(VapiContext);
  if (context === undefined) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
}
