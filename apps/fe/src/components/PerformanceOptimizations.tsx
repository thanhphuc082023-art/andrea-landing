import Script from 'next/script';
import { memo, useEffect } from 'react';

// Performance optimization helper
// This component helps preload critical resources and optimize rendering

export function PerformanceOptimizations() {
  useEffect(() => {
    // Optimize font loading to prevent layout shifts
    if (typeof window !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        // Fonts are loaded, layout is stable
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    // Optimize scroll behavior to prevent forced reflows
    let ticking = false;
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Batch scroll-related DOM operations here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizeScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizeScroll);
  }, []);
  return (
    <>
      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/fonts/playfair-display-latin-400-normal.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://cdn.builder.io" />
      <link rel="preconnect" href="https://api.builder.io" />
      <link rel="preconnect" href="https://andrea.vn" />

      {/* Preload critical images for LCP optimization */}
      <link
        rel="preload"
        href="https://api.builder.io/api/v1/image/assets/TEMP/aa900ed26675db6e843778c020dcbb13b0f69d38?width=1920&format=webp"
        as="image"
        type="image/webp"
      />

      {/* DNS prefetch for other domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Load Google Analytics with optimal strategy */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FB9QLDNKNN"
        strategy="afterInteractive"
        onLoad={() => {
          // Initialize gtag after script loads
          if (typeof window !== 'undefined') {
            (window as any).dataLayer = (window as any).dataLayer || [];
            const gtag = (...args: any[]) => {
              (window as any).dataLayer.push(args);
            };
            gtag('js', new Date());
            gtag('config', 'G-FB9QLDNKNN', {
              page_title: document.title,
              page_location: window.location.href,
            });
          }
        }}
      />
    </>
  );
}

export default memo(PerformanceOptimizations);
