import Script from 'next/script';
import { memo } from 'react';

export function PerformanceOptimizations() {
  return (
    <>
      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/fonts/PlayfairDisplay-Regular.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://api.builder.io" />
      <link rel="preconnect" href="https://cdn.builder.io" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://andrea.com.vn" />

      {/* Preload critical images for LCP optimization */}
      <link
        rel="preload"
        href="https://api.builder.io/api/v1/image/assets/TEMP/aa900ed26675db6e843778c020dcbb13b0f69d38?width=1920&format=webp&quality=85"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />

      {/* Preload mobile version too */}
      <link
        rel="preload"
        href="https://api.builder.io/api/v1/image/assets/TEMP/aa900ed26675db6e843778c020dcbb13b0f69d38?width=768&format=webp&quality=85"
        as="image"
        type="image/webp"
        media="(max-width: 768px)"
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
