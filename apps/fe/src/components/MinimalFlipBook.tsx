'use client';

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    jQuery: any;
    $: any;
    pdfjsLib: any;
  }
}

interface MinimalFlipBookProps {
  pdfUrl?: string;
}

export default function MinimalFlipBook({
  pdfUrl = '/sample.pdf',
}: MinimalFlipBookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Initializing...');
  const [isReady, setIsReady] = useState(false);
  const initStartedRef = useRef(false);

  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    initFlipBook();
  }, [pdfUrl]);

  const initFlipBook = async () => {
    try {
      setStatus('Loading scripts...');

      // Load all scripts
      await loadScript('/3d-flipbook/js/jquery.min.js');
      (window as any).$ = window.jQuery;

      // Try to load PDF.js, with CDN fallback
      try {
        await loadScript('/3d-flipbook/js/pdf.min.js');
      } catch (error) {
        console.warn(
          'Failed to load local PDF.js, trying CDN fallback:',
          error
        );
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js'
        );
      }

      // Wait a bit for PDF.js to initialize
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Configure PDF.js worker - check if pdfjsLib exists and has GlobalWorkerOptions
      console.log('🔍 Checking PDF.js availability:', {
        pdfjsLib: !!(window as any).pdfjsLib,
        PDFJS: !!(window as any).PDFJS,
        GlobalWorkerOptions: !!(window as any).pdfjsLib?.GlobalWorkerOptions,
        windowKeys: Object.keys(window).filter((key) =>
          key.toLowerCase().includes('pdf')
        ),
        allScripts: Array.from(document.querySelectorAll('script'))
          .map((s) => s.src)
          .filter((src) => src.includes('pdf')),
      });

      // Try multiple approaches to configure PDF.js worker
      let workerConfigured = false;

      // Determine worker source (local or CDN)
      const workerSrc = document.querySelector(
        'script[src*="cdnjs.cloudflare.com"]'
      )
        ? 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
        : '/3d-flipbook/js/pdf.worker.js';

      // Approach 1: Modern PDF.js with pdfjsLib.GlobalWorkerOptions
      if (
        (window as any).pdfjsLib &&
        (window as any).pdfjsLib.GlobalWorkerOptions
      ) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        console.log(
          '✅ PDF.js worker configured with pdfjsLib.GlobalWorkerOptions:',
          workerSrc
        );
        workerConfigured = true;
      }

      // Approach 2: Legacy PDF.js with PDFJS.workerSrc
      if (!workerConfigured && (window as any).PDFJS) {
        (window as any).PDFJS.workerSrc = workerSrc;
        console.log(
          '✅ PDF.js worker configured with PDFJS.workerSrc:',
          workerSrc
        );
        workerConfigured = true;
      }

      // Approach 3: Try to find PDF.js in global scope
      if (!workerConfigured) {
        const pdfKeys = Object.keys(window).filter(
          (key) =>
            key.toLowerCase().includes('pdf') ||
            key.toLowerCase().includes('pdfjs')
        );
        console.log('🔍 Found PDF-related keys:', pdfKeys);

        for (const key of pdfKeys) {
          const obj = (window as any)[key];
          if (obj && typeof obj === 'object') {
            if (obj.GlobalWorkerOptions) {
              obj.GlobalWorkerOptions.workerSrc = workerSrc;
              console.log(
                `✅ PDF.js worker configured via ${key}.GlobalWorkerOptions:`,
                workerSrc
              );
              workerConfigured = true;
              break;
            }
            if (obj.workerSrc !== undefined) {
              obj.workerSrc = workerSrc;
              console.log(
                `✅ PDF.js worker configured via ${key}.workerSrc:`,
                workerSrc
              );
              workerConfigured = true;
              break;
            }
          }
        }
      }

      // Approach 4: Create fallback configuration
      if (!workerConfigured) {
        console.warn(
          '⚠️ PDF.js library not found, creating fallback configuration'
        );
        (window as any).PDFJS = (window as any).PDFJS || {};
        (window as any).PDFJS.workerSrc = workerSrc;

        // Also try to create pdfjsLib structure
        (window as any).pdfjsLib = (window as any).pdfjsLib || {};
        (window as any).pdfjsLib.GlobalWorkerOptions =
          (window as any).pdfjsLib.GlobalWorkerOptions || {};
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        console.log(
          '✅ Created fallback PDF.js configuration with worker:',
          workerSrc
        );
      }

      await loadScript('/3d-flipbook/js/three.min.js');
      await loadScript('/3d-flipbook/js/html2canvas.min.js');
      await loadScript('/3d-flipbook/js/3dflipbook.min.js');

      setStatus('Waiting for FlipBook plugin...');
      await waitForPlugin();

      setStatus('Creating FlipBook...');
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay

      if (!containerRef.current) {
        throw new Error('Container not found');
      }

      const $ = window.jQuery;
      const container = $(containerRef.current);

      console.log('🚀 Creating minimal FlipBook...');

      // Minimal FlipBook configuration with proper sizing
      const flipbook = container.FlipBook({
        pdf: pdfUrl,
        template: {
          html: '/3d-flipbook/templates/default-book-view.html',
          styles: ['/3d-flipbook/css/short-black-book-view.css'],
          links: [
            {
              rel: 'stylesheet',
              href: '/3d-flipbook/css/font-awesome.min.css',
            },
          ],
          script: '/3d-flipbook/js/default-book-view.js',
          sounds: {
            startFlip: '/3d-flipbook/sounds/start-flip.mp3',
            endFlip: '/3d-flipbook/sounds/end-flip.mp3',
          },
        },

        // Add explicit sizing
        width: '100%',
        height: '100%',
        // Ensure proper rendering
        autoSize: true,
        ready: () => {
          console.log('🎉 FlipBook ready!');
          setStatus('FlipBook ready! PDF should be visible now.');
          setIsReady(true);

          // Force a resize after ready
          setTimeout(() => {
            if (window.jQuery && containerRef.current) {
              const $container = window.jQuery(containerRef.current);
              const flipbookInstance = $container.data('FlipBook');
              if (flipbookInstance && flipbookInstance.resize) {
                flipbookInstance.resize();
                console.log('🔄 FlipBook resized');
              }
            }
          }, 100);
        },
        error: (error: any) => {
          console.error('❌ FlipBook error:', error);
          setStatus(`FlipBook error: ${error}`);
        },
        loadComplete: () => {
          console.log('📖 PDF loaded successfully!');
          setStatus('PDF loaded! FlipBook should show content now.');
        },
        loadError: (error: any) => {
          console.error('❌ PDF load error:', error);
          setStatus(`PDF load error: ${error}`);
        },
      });

      console.log('✅ FlipBook instance created:', typeof flipbook);
    } catch (error) {
      console.error('❌ Init error:', error);
      setStatus(`Error: ${error}`);
    }
  };

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => setTimeout(resolve, 100);
      script.onerror = () => reject(new Error(`Failed: ${src}`));
      document.head.appendChild(script);
    });
  };

  const waitForPlugin = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        attempts++;
        if (window.jQuery?.fn?.FlipBook) {
          resolve();
        } else if (attempts > 30) {
          reject(new Error('Plugin timeout'));
        } else {
          setTimeout(check, 200);
        }
      };
      check();
    });
  };

  return (
    <div className="h-full w-full">
      <div
        ref={containerRef}
        className='overflow-hidden relative max-sd:h-[calc(100vh-124px)] h-[calc(100vh-129px)] max-sd:min-h-[calc(100vh-124px)] min-h-[calc(100vh-129px)]'
      />
    </div>
  );
}
