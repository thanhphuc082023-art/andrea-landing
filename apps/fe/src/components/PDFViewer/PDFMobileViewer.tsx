'use client';

import React, { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { SpinnerIcon } from '@/components/Icons';
import ScrollDownButton from '@/components/ScrollDownButton';
import styles from './PDFMobileViewer.module.css';
import { getOptimalRenderSettings, type PDFPageData } from './utils/pdfUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PDFMobileViewerProps {
  pdfUrl?: string;
}

export default function PDFMobileViewer({ pdfUrl = '' }: PDFMobileViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<PDFPageData[]>([]);
  const [placeholderPages, setPlaceholderPages] = useState<number[]>([]);
  const [totalPdfPages, setTotalPdfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // KeenSlider setup
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 0,
    },
    slideChanged(slider) {
      setCurrentPage(slider.track.details.rel + 1);
    },
  });

  // Update slider when placeholder pages change
  useEffect(() => {
    if (instanceRef.current && placeholderPages.length > 0) {
      instanceRef.current.update();
    }
  }, [placeholderPages.length]);

  const totalPages = totalPdfPages || pages.length;

  useEffect(() => {
    if (pdfUrl) {
      loadPDF();
    }
  }, [pdfUrl]);

  const loadPDF = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load PDF document first
      await loadPDFJS();
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      setTotalPdfPages(pdf.numPages);

      // Create placeholder pages for all pages immediately
      const allPlaceholderPages = Array.from(
        { length: pdf.numPages },
        (_, i) => i + 1
      );
      setPlaceholderPages(allPlaceholderPages);

      // Initialize pages array with empty slots for all pages
      const emptyPagesArray = new Array(pdf.numPages).fill(null);
      setPages(emptyPagesArray);

      // Stop loading state immediately so user can slide
      setIsLoading(false);

      // Update slider to recognize all slides
      setTimeout(() => {
        if (instanceRef.current) {
          instanceRef.current.update();
        }
      }, 100);

      const renderOptions = getOptimalRenderSettings();

      // Phase 1: Load first 5 pages quickly
      const pagesToLoadInitially = Math.min(5, pdf.numPages);

      for (let pageNum = 1; pageNum <= pagesToLoadInitially; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const pageData = await renderPage(page, pageNum);

        // Update specific page in array
        setPages((prevPages) => {
          const updatedPages = [...prevPages];
          updatedPages[pageNum - 1] = pageData;
          return updatedPages;
        });
      }

      // Phase 2: Load remaining pages in background
      if (pdf.numPages > 5) {
        // Load remaining pages gradually in background
        const loadRemainingPages = async () => {
          for (let pageNum = 6; pageNum <= pdf.numPages; pageNum++) {
            try {
              const page = await pdf.getPage(pageNum);
              const pageData = await renderPage(page, pageNum);

              // Update specific page in array
              setPages((prevPages) => {
                const updatedPages = [...prevPages];
                updatedPages[pageNum - 1] = pageData;
                return updatedPages;
              });

              // Small delay to prevent blocking UI
              if (pageNum % 3 === 0) {
                await new Promise((resolve) => setTimeout(resolve, 100));
              }
            } catch (pageError) {
              console.warn(`Failed to load page ${pageNum}:`, pageError);
            }
          }
        };

        // Start loading remaining pages in background
        loadRemainingPages();
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError('Failed to load PDF');
      setIsLoading(false);
    }
  };

  const loadPDFJS = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.onload = () => {
        // Configure worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        setTimeout(resolve, 100);
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js'));
      document.head.appendChild(script);
    });
  };

  const renderPage = async (
    page: any,
    pageNumber: number
  ): Promise<PDFPageData> => {
    const scale = 2; // For better quality on mobile screens
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    const imageData = canvas.toDataURL('image/jpeg', 0.9);

    return {
      pageNumber,
      canvas,
      imageData,
      width: viewport.width,
      height: viewport.height,
    };
  };

  const goToPage = (pageNumber: number) => {
    if (instanceRef.current && pageNumber >= 1 && pageNumber <= totalPages) {
      instanceRef.current.moveToIdx(pageNumber - 1);
    }
  };

  const nextPage = () => {
    if (instanceRef.current && currentPage < totalPages) {
      instanceRef.current.next();
    }
  };

  const prevPage = () => {
    if (instanceRef.current && currentPage > 1) {
      instanceRef.current.prev();
    }
  };

  // Helper function to get page data or placeholder
  const getPageContent = (pageIndex: number) => {
    const pageData = pages[pageIndex];
    if (pageData && pageData.imageData) {
      return (
        <img
          src={pageData.imageData}
          alt={`Page ${pageData.pageNumber}`}
          className={styles.pageImage}
          loading="lazy"
        />
      );
    }

    // Return white placeholder for unloaded pages
    return (
      <div className={`${styles.pageImage} flex items-center justify-center`}>
        <div className="text-center">
          <SpinnerIcon className="text-brand-orange mx-auto h-10 w-10 animate-spin" />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} bg-pdf`}>
        <div className={styles.loadingContent}>
          <SpinnerIcon className="text-brand-orange mx-auto h-10 w-10 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <p className="text-red-600">{error}</p>
          <button onClick={loadPDF} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pdf relative h-full w-full">
      {/* Left Navigation Button */}
      <button
        onClick={prevPage}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="absolute left-2 top-1/2 z-[10] -translate-y-1/2"
      >
        <ChevronLeft
          className="h-10 w-10 text-white"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))' }}
        />
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="absolute right-2 top-1/2 z-[10] -translate-y-1/2"
      >
        <ChevronRight
          className="h-10 w-10 text-white"
          style={{ filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))' }}
        />
      </button>

      {/* PDF Slider */}
      <div ref={sliderRef} className={`keen-slider ${styles.pageSlider}`}>
        {placeholderPages.map((pageNum, index) => (
          <div
            key={pageNum}
            className={`keen-slider__slide ${styles.pageSlide}`}
          >
            {getPageContent(index)}
          </div>
        ))}
      </div>

      {/* Page counter */}
      <div className="absolute left-4 top-4 z-[15] rounded-lg bg-black/70 px-3 py-2 text-white backdrop-blur-sm">
        <span className="text-sm">
          {currentPage} / {totalPdfPages > 0 ? totalPdfPages : pages.length}
        </span>
      </div>

      {/* Scroll Down to Next Page Button */}
      {currentPage < totalPages && (
        <ScrollDownButton
          variant="simple"
          text=""
          className="absolute bottom-6 left-1/2 z-[10] -translate-x-1/2 opacity-80 hover:opacity-100"
        />
      )}
    </div>
  );
}
