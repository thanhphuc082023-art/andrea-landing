import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useGlobalSettings } from '@/hooks/useStrapi';
import type { GlobalEntity } from '@/types/strapi';

interface GlobalContextType {
  global: GlobalEntity | undefined;
  isLoading: boolean;
  error: any;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const { global, isLoading, error } = useGlobalSettings();
  const contextValue = useMemo(
    () => ({ global, isLoading, error }),
    [global, isLoading, error]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}

export default GlobalProvider;
