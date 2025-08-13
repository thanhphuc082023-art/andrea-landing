import { useEffect } from 'react';

interface SessionCleanupOptions {
  clearSessionStorage?: boolean;
  clearLocalStorage?: boolean;
  sessionKeys?: string[];
  localKeys?: string[];
  // Add option to disable automatic cleanup on unmount
  disableAutoCleanup?: boolean;
}

/**
 * Custom hook to clean up session data when component unmounts
 * @param options Configuration for what to clean up
 */
export function useSessionCleanup(options: SessionCleanupOptions = {}) {
  const {
    clearSessionStorage = false,
    clearLocalStorage = false,
    sessionKeys = [],
    localKeys = [],
    disableAutoCleanup = false,
  } = options;

  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      if (typeof window === 'undefined' || disableAutoCleanup) return;

      // Clear specific sessionStorage keys
      if (clearSessionStorage || sessionKeys.length > 0) {
        if (clearSessionStorage) {
          sessionStorage.clear();
        } else {
          sessionKeys.forEach((key) => {
            sessionStorage.removeItem(key);
          });
        }
      }

      // Clear specific localStorage keys
      if (clearLocalStorage || localKeys.length > 0) {
        if (clearLocalStorage) {
          localStorage.clear();
        } else {
          localKeys.forEach((key) => {
            localStorage.removeItem(key);
          });
        }
      }
    };
  }, [
    clearSessionStorage,
    clearLocalStorage,
    sessionKeys,
    localKeys,
    disableAutoCleanup,
  ]);

  // Return manual cleanup function
  const cleanup = () => {
    if (typeof window === 'undefined') return;

    // Clear specific sessionStorage keys
    if (clearSessionStorage || sessionKeys.length > 0) {
      if (clearSessionStorage) {
        sessionStorage.clear();
      } else {
        sessionKeys.forEach((key) => {
          sessionStorage.removeItem(key);
        });
      }
    }

    // Clear specific localStorage keys
    if (clearLocalStorage || localKeys.length > 0) {
      if (clearLocalStorage) {
        localStorage.clear();
      } else {
        localKeys.forEach((key) => {
          localStorage.removeItem(key);
        });
      }
    }
  };

  return { cleanup };
}

/**
 * Predefined cleanup configurations for common use cases
 */
export const sessionCleanupConfigs = {
  // Clean up project form data
  projectForm: {
    sessionKeys: ['projectFormData', 'projectShowcaseSections'] as string[],
  },

  // Clean up authentication data
  auth: {
    localKeys: ['strapiToken', 'strapiUser'] as string[],
  },

  // Clean up all session data
  all: {
    clearSessionStorage: true,
    clearLocalStorage: true,
  },
} as const;
