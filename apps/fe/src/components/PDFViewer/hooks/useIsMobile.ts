'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device is mobile based on screen width
 * Uses 768px as breakpoint (standard tablet/mobile breakpoint)
 */
export const useIsMobile = (breakpoint: number = 767) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkIsMobile();

    // Listen for window resize
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return { isMobile, isClient };
};
