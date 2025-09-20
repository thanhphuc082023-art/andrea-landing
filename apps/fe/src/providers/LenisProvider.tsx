'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';

import type { PropsWithChildren } from 'react';

function LenisProvider({ children }: PropsWithChildren) {
  const router = useRouter();

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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [router.pathname]);

  return <>{children}</>;
}

export default LenisProvider;
