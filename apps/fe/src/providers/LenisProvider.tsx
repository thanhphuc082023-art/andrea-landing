'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';

import type { PropsWithChildren } from 'react';

function LenisProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if current route is admin page
    const isAdminPage = router.pathname.startsWith('/admin');

    // Don't initialize Lenis for admin pages
    if (isAdminPage) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeInOut mạnh hơn
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [router.pathname]);

  // Reset Lenis on every page navigation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    }
  }, [router.asPath]);

  return <>{children}</>;
}

export default LenisProvider;
