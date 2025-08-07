'use client';

import { SpinnerIcon } from '@/components/Icons';
import ScrollDownButton from '@/components/ScrollDownButton';
import ActionButtons from './ActionButtons';
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    jQuery: any;
    $: any;
    pdfjsLib: any;
  }
}

interface PDFDesktopViewerProps {
  pdfUrl?: string;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
}

export default function PDFDesktopViewer({
  pdfUrl = '',
  bookData,
}: PDFDesktopViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const initStartedRef = useRef(false);

  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    initFlipBook();
  }, [pdfUrl]);

  const initFlipBook = async () => {
    try {
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

      // Try multiple approaches to configure PDF.js worker
      let workerConfigured = false;

      // Determine worker source (local or CDN)
      const workerSrc = document.querySelector(
        'script[src*="cdnjs.cloudflare.com"]'
      )
        ? 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
        : '/3d-flipbook/js/pdf.worker.js';

      // Configure PDF.js worker
      if (
        (window as any).pdfjsLib &&
        (window as any).pdfjsLib.GlobalWorkerOptions
      ) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        workerConfigured = true;
      }

      // Legacy PDF.js support
      if (!workerConfigured && (window as any).PDFJS) {
        (window as any).PDFJS.workerSrc = workerSrc;
        workerConfigured = true;
      }

      // Fallback configuration
      if (!workerConfigured) {
        console.warn(
          '⚠️ PDF.js library not found, creating fallback configuration'
        );
        (window as any).PDFJS = (window as any).PDFJS || {};
        (window as any).PDFJS.workerSrc = workerSrc;

        (window as any).pdfjsLib = (window as any).pdfjsLib || {};
        (window as any).pdfjsLib.GlobalWorkerOptions =
          (window as any).pdfjsLib.GlobalWorkerOptions || {};
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      }

      await loadScript('/3d-flipbook/js/three.min.js');
      await loadScript('/3d-flipbook/js/html2canvas.min.js');
      await loadScript('/3d-flipbook/js/3dflipbook.min.js');

      await waitForPlugin();

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!containerRef.current) {
        throw new Error('Container not found');
      }

      const $ = window.jQuery;
      const container = $(containerRef.current);

      // Desktop-optimized FlipBook configuration
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
        },
        width: '100%',
        height: '100%',
        autoSize: true,
        singlePageMode: 0, // Always use double page mode for desktop
        controlsProps: {
          actions: {
            cmdSinglePage: {
              activeForMobile: false,
              active: false,
            },
            cmdFullScreen: {
              active: true,
            },
            cmdZoomIn: {
              active: true,
            },
            cmdZoomOut: {
              active: true,
            },
          },
        },
        ready: () => {
          setIsReady(true);

          // Force a resize after ready
          setTimeout(() => {
            if (window.jQuery && containerRef.current) {
              const $container = window.jQuery(containerRef.current);
              const flipbookInstance = $container.data('FlipBook');
              if (flipbookInstance && flipbookInstance.resize) {
                flipbookInstance.resize();
              }
            }
          }, 100);
        },
        error: (error: any) => {
          console.error('❌ Desktop FlipBook error:', error);
        },
      });
    } catch (error) {
      console.error('❌ Desktop Init error:', error);
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
    <div className="bg-pdf relative h-full w-full">
      {!isReady && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpinnerIcon className="text-brand-orange h-10 w-10 animate-spin" />
        </div>
      )}
      <div
        ref={containerRef}
        className="relative h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] overflow-hidden"
      />

      {/* Action Buttons - Desktop: Vertical at top right */}
      <ActionButtons bookData={bookData} pdfUrl={pdfUrl} isMobile={false} />

      <ScrollDownButton
        variant="simple"
        text=""
        className="absolute bottom-6 left-1/2 z-[10] -translate-x-1/2 opacity-80 hover:opacity-100 max-md:bottom-12"
      />
    </div>
  );
}
