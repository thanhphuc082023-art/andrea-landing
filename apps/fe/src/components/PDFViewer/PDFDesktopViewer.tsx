'use client';

import { SpinnerIcon } from '@/components/Icons';
import ScrollDownButton from '@/components/ScrollDownButton';
import ActionButtons from './ActionButtons';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    jQuery: any;
    $: any;
    pdfjsLib: any;
  }
}

interface PDFDesktopViewerProps {
  pdfUrl?: string;
  height?: number; // Add height prop
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
  isHideActions?: boolean;
  isHideScrollDown?: boolean;
}

export default function PDFDesktopViewer({
  pdfUrl = '',
  height, // Destructure height
  bookData,
  isHideActions = false,
  isHideScrollDown = false,
}: PDFDesktopViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const initStartedRef = useRef(false);
  const router = useRouter();

  const isSimpleLayout = router.query.simpleLayout === 'true';

  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    initFlipBook();
  }, [pdfUrl]);

  // Manual PDF preloading as backup
  const preloadPDFPages = async (pdfUrl: string, numPages: number = 15) => {
    if (!window.pdfjsLib) {
      console.warn('PDF.js not loaded');
      return;
    }

    try {
      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 1050;
      canvas.height = 1485;

      for (let i = 1; i <= Math.min(numPages, pdf.numPages); i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.0 });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
        } catch (e) {
          console.log(`❌ Manual preload page ${i} failed:`, e);
        }
      }
    } catch (e) {
      console.error('Manual preload failed:', e);
    }
  };

  // Force preload useEffect
  useEffect(() => {
    if (!isReady || !pdfUrl) return;

    const forcePreload = () => {
      const flipbookInstance = window
        .jQuery(containerRef.current)
        .data('FlipBook');

      if (flipbookInstance && flipbookInstance.book) {
        const book = flipbookInstance.book;
        const totalPages = book.getPages();

        console.log('🚀 Force preloading', totalPages, 'pages');

        // Method 1: Direct page loading
        for (let i = 0; i < Math.min(20, totalPages); i++) {
          setTimeout(() => {
            if (book.pageManager && book.pageManager.pageCallback) {
              try {
                const pageInfo = book.pageManager.pageCallback(i);
                if (pageInfo && pageInfo.src) {
                  // Force load page
                  const img = new Image();
                  img.onload = () => console.log(`✅ Preloaded page ${i}`);
                  img.onerror = () =>
                    console.log(`❌ Failed to preload page ${i}`);
                  img.src = pageInfo.src;
                }
              } catch (e) {
                console.log(`Skip page ${i}:`, e.message);
              }
            }
          }, i * 100); // Stagger loading
        }
      }
    };

    // Start force preload after 3 seconds
    setTimeout(forcePreload, 3000);

    // Start manual preload after 5 seconds
    setTimeout(() => {
      preloadPDFPages(pdfUrl, 15);
    }, 5000);
  }, [isReady, pdfUrl]);

  const initFlipBook = async () => {
    try {
      console.log('🎬 Initializing FlipBook with URL:', pdfUrl);

      if (!pdfUrl || pdfUrl.trim() === '') {
        throw new Error('Empty PDF URL');
      }

      // Handle blob URLs by converting them to data URLs
      let processedPdfUrl = pdfUrl;
      if (pdfUrl.startsWith('blob:')) {
        console.log('🔄 Converting blob URL to data URL...');
        try {
          const response = await fetch(pdfUrl);
          if (response.ok) {
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(arrayBuffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            processedPdfUrl = `data:application/pdf;base64,${base64}`;
            console.log('✅ Successfully converted blob to data URL');
          } else {
            console.error('❌ Failed to fetch blob URL:', response.status);
            throw new Error(`Failed to fetch blob: ${response.status}`);
          }
        } catch (error) {
          console.error('❌ Failed to convert blob URL:', error);
          // Fallback to a working PDF
          processedPdfUrl =
            'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf';
          console.log('🔄 Using fallback PDF URL:', processedPdfUrl);
        }
      }

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
      console.log('📖 Creating FlipBook with processed URL:', processedPdfUrl);

      // Calculate dimensions based on height prop
      let flipbookHeight = '100%';
      let flipbookWidth = '100%';

      if (height) {
        flipbookHeight = `${height}px`;
        console.log(
          '🖥️ [PDFDesktopViewer] Using custom height:',
          flipbookHeight
        );
      }

      const flipbook = container.FlipBook({
        pdf: processedPdfUrl,
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
        width: flipbookWidth,
        height: flipbookHeight,
        autoSize: !height, // Disable autoSize when height is provided

        // Tăng cache và preload settings
        cachedPages: 100,
        renderInactivePages: true,
        renderInactivePagesOnMobile: true,
        renderWhileFlipping: true,
        preloadPages: 15, // Tăng từ 10 lên 15
        pagesForPredicting: 15, // Tăng từ 10 lên 15

        // Thêm config này để force preload
        predictPages: true,

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
        ready: (scene) => {
          setIsReady(true);

          // Aggressive preloading strategy
          const book = scene.book;
          const totalPages = book.getPages();

          if (book.pageManager) {
            const originalSetTexture = book.pageManager.setTexture.bind(
              book.pageManager
            );
            book.pageManager.setTexture = function (material, n) {
              console.log(`📄 Loading page texture: ${n}`);
              return originalSetTexture(material, n);
            };
          }

          // Strategy 1: Immediate preload first batch
          const immediateLoad = Math.min(8, totalPages);
          for (let i = 0; i < immediateLoad; i++) {
            if (book.pageManager) {
              book.pageManager.setTexture(null, i);
              console.log(`Immediate preload page ${i}`);
            }
          }

          // Strategy 2: Background preload with queue
          let backgroundIndex = immediateLoad;
          const backgroundLoader = () => {
            if (backgroundIndex < totalPages && !book.isProcessing()) {
              if (book.pageManager) {
                book.pageManager.setTexture(null, backgroundIndex);
                console.log(`Background preload page ${backgroundIndex}`);
              }
              backgroundIndex++;
            }

            if (backgroundIndex < totalPages) {
              setTimeout(backgroundLoader, 150); // Preload every 150ms
            } else {
              console.log('✅ All pages preloaded!');
            }
          };

          // Start background loading after 2 seconds
          setTimeout(backgroundLoader, 2000);

          // Strategy 3: Smart preload on page change
          book.addEventListener('afterAnimation', () => {
            const currentPage = book.getPage();
            console.log(`Page changed to: ${currentPage}`);

            // Preload surrounding pages with priority
            const surroundingPages = [
              currentPage - 3,
              currentPage - 2,
              currentPage - 1,
              currentPage + 1,
              currentPage + 2,
              currentPage + 3,
              currentPage + 4,
            ];

            surroundingPages.forEach((pageNum) => {
              if (pageNum >= 0 && pageNum < totalPages && book.pageManager) {
                book.pageManager.setTexture(null, pageNum);
              }
            });
          });

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
    <div className="relative h-full w-full">
      {!isReady && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpinnerIcon className="text-brand-orange h-10 w-10 animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="relative h-full overflow-hidden" />

      {/* Action Buttons - Desktop: Vertical at top right */}
      {!isHideActions && <ActionButtons bookData={bookData} isMobile={false} />}
      {!isSimpleLayout && !isHideScrollDown && (
        <ScrollDownButton
          variant="simple"
          text=""
          className="absolute bottom-6 left-1/2 z-[10] -translate-x-1/2 opacity-80 hover:opacity-100 max-md:bottom-12"
        />
      )}
    </div>
  );
}
