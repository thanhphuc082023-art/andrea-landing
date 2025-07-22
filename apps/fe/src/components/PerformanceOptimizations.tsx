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
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}

export default PerformanceOptimizations;
