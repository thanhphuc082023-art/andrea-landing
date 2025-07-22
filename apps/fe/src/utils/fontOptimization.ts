// Font optimization utilities
export const preloadFonts = () => {
  if (typeof window !== 'undefined') {
    // Create link elements for font preloading
    const fontPreloads = [
      {
        href: '/assets/fonts/inter-var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        href: '/assets/fonts/playfair-display-var.woff2', 
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ];

    fontPreloads.forEach(({ href, as, type, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      link.type = type;
      link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    });
  }
};

// Font display optimization CSS
export const fontDisplayCSS = `
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url('/assets/fonts/inter-var.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Playfair Display';
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url('/assets/fonts/playfair-display-var.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* Fallback fonts for better CLS */
  .font-sans {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  }

  .font-playfair {
    font-family: 'Playfair Display', Georgia, 'Times New Roman', Times, serif;
  }
`;

// Critical CSS for above-the-fold content
export const criticalCSS = `
  /* Reset and base styles */
  *, *::before, *::after { box-sizing: border-box; }
  html { line-height: 1.15; -webkit-text-size-adjust: 100%; }
  body { margin: 0; font-family: 'Inter', system-ui, sans-serif; }
  
  /* Critical layout styles */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  .flex { display: flex; }
  .grid { display: grid; }
  .hidden { display: none; }
  .block { display: block; }
  .w-full { width: 100%; }
  .h-full { height: 100%; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  
  /* Critical typography */
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
  .font-bold { font-weight: 700; }
  .font-medium { font-weight: 500; }
  
  /* Critical colors */
  .text-gray-900 { color: rgb(17 24 39); }
  .text-gray-600 { color: rgb(75 85 99); }
  .bg-white { background-color: rgb(255 255 255); }
  .text-brand-orange { color: #E5511A; }
  
  /* Critical spacing */
  .p-4 { padding: 1rem; }
  .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mt-8 { margin-top: 2rem; }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    .container { padding: 0 0.75rem; }
  }
`;

export default {
  preloadFonts,
  fontDisplayCSS,
  criticalCSS,
};
