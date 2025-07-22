import { useEffect } from 'react';

export default function FontLoaderEffect() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'fonts' in document) {
      console.log('document.fonts supported');
      document.fonts.ready.then(() => {
        console.log('Fonts loaded!');
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      console.log('document.fonts NOT supported');
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
  return null;
}
