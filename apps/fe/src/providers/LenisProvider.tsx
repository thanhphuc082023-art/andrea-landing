'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactLenis, { useLenis } from 'lenis/dist/lenis-react';

import type { PropsWithChildren } from 'react';

function LenisProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.stop();
      requestAnimationFrame(() => {
        lenis.start();
      });
    }
  }, [pathname, lenis]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeInOut mạnh hơn
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default LenisProvider;
