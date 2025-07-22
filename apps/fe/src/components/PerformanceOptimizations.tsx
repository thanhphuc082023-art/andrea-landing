import Script from 'next/script';
import { memo } from 'react';

// Performance optimization helper
// This component helps preload critical resources and optimize rendering

export function PerformanceOptimizations() {
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
