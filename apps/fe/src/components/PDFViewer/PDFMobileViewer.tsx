'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { SpinnerIcon } from '@/components/Icons';
import ScrollDownButton from '@/components/ScrollDownButton';
import ActionButtons from './ActionButtons';
import styles from './PDFMobileViewer.module.css';
import {
  getOptimalRenderSettings,
  type PDFPageData,
  loadPDFJS,
  renderPDFPage,
} from './utils/pdfUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PDFMobileViewerProps {
  pdfUrl?: string;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
}

export default function PDFMobileViewer({
  pdfUrl = '',
  bookData,
}: PDFMobileViewerProps) {
  // Only essential state that needs to trigger re-renders
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const router = useRouter();
  // Use refs instead of state to avoid unnecessary re-renders
  const pagesRef = useRef<Map<number, PDFPageData>>(new Map());
  const loadingPagesRef = useRef<Set<number>>(new Set());
  const pdfDocRef = useRef<any>(null);
  const renderOptionsRef = useRef(getOptimalRenderSettings());
  const isInitializedRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSimpleLayout = router.query.simpleLayout === 'true';

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

  // Force component update when needed
  const triggerUpdate = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  // Update slider when total pages change
  useEffect(() => {
    if (instanceRef.current && totalPages > 0) {
      instanceRef.current.update();
    }
  }, [totalPages]);

  // Load pages with optimized batching
  const loadPagesBatch = useCallback(
    async (pdf: any, startPage: number, endPage: number) => {
      const actualEndPage = Math.min(endPage, pdf.numPages);

      for (let pageNum = startPage; pageNum <= actualEndPage; pageNum++) {
        if (
          pagesRef.current.has(pageNum) ||
          loadingPagesRef.current.has(pageNum)
        ) {
          continue;
        }

        try {
          loadingPagesRef.current.add(pageNum);
          const page = await pdf.getPage(pageNum);
          const pageData = await renderPDFPage(
            page,
            pageNum,
            renderOptionsRef.current
          );

          pagesRef.current.set(pageNum, pageData);
          loadingPagesRef.current.delete(pageNum);

          // Trigger update only after every 3 pages to reduce re-renders
          if (pageNum % 3 === 0 || pageNum === actualEndPage) {
            triggerUpdate();
          }

          // Small delay to prevent blocking UI
          if (pageNum % 2 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error(`Failed to load page ${pageNum}:`, error);
          loadingPagesRef.current.delete(pageNum);
        }
      }
    },
    [triggerUpdate]
  );

  const loadPDF = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      isInitializedRef.current = true;

      // Load PDF document
      await loadPDFJS();
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);

      // Clear previous data
      pagesRef.current.clear();
      loadingPagesRef.current.clear();

      // Stop loading immediately to allow sliding
      setIsLoading(false);

      // Update slider
      setTimeout(() => {
        if (instanceRef.current) {
          instanceRef.current.update();
        }
      }, 100);

      // Phase 1: Load first 5 pages quickly
      await loadPagesBatch(pdf, 1, 5);

      // Phase 2: Load remaining pages in background
      if (pdf.numPages > 5) {
        setTimeout(async () => {
          await loadPagesBatch(pdf, 6, pdf.numPages);
        }, 500);
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError('Failed to load PDF');
      setIsLoading(false);
      isInitializedRef.current = false;
    }
  }, [pdfUrl, loadPagesBatch]);

  useEffect(() => {
    if (pdfUrl && pdfUrl.trim() !== '') {
      loadPDF();
    } else {
      setError('No PDF URL provided');
      setIsLoading(false);
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [pdfUrl, loadPDF]);

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
  const getPageContent = useCallback(
    (pageIndex: number) => {
      const pageNumber = pageIndex + 1;
      const pageData = pagesRef.current.get(pageNumber);
      const isLoading = loadingPagesRef.current.has(pageNumber);

      if (pageData && pageData.imageData) {
        return (
          <img
            src={pageData.imageData}
            alt={`Page ${pageData.pageNumber}`}
            className={styles.pageImage}
            loading="lazy"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        );
      }

      // Return loading placeholder for unloaded pages
      return (
        <div className={`${styles.pageImage} flex items-center justify-center`}>
          <div className="text-center">
            <SpinnerIcon className="text-brand-orange mx-auto h-10 w-10 animate-spin" />
          </div>
        </div>
      );
    },
    [forceUpdate]
  ); // Include forceUpdate to trigger re-render when pages are loaded

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
          style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
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
          style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
        />
      </button>

      {/* PDF Slider */}
      <div ref={sliderRef} className={`keen-slider ${styles.pageSlider}`}>
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index + 1}
            className={`keen-slider__slide ${styles.pageSlide}`}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          >
            {getPageContent(index)}
          </div>
        ))}
      </div>

      {/* Page counter */}
      <div className="absolute left-4 top-4 z-[15] rounded-lg bg-black/70 px-3 py-2 text-white backdrop-blur-sm">
        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Action Buttons - Mobile: Horizontal at bottom center */}
      <ActionButtons bookData={bookData} pdfUrl={pdfUrl} isMobile={true} />

      {/* Scroll Down */}
      {!isSimpleLayout && (
        <ScrollDownButton
          variant="simple"
          text=""
          className="absolute bottom-6 left-1/2 z-[10] -translate-x-1/2 opacity-80 hover:opacity-100"
        />
      )}
    </div>
  );
}
