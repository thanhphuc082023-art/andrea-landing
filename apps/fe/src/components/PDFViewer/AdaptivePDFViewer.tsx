'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useIsMobile } from './hooks/useIsMobile';
import { SpinnerIcon } from '@/components/Icons';

// Dynamically import viewers to avoid SSR issues and optimize bundle
const PDFDesktopViewer = dynamic(() => import('./PDFDesktopViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <SpinnerIcon className="text-brand-orange h-10 w-10 animate-spin" />
    </div>
  ),
});

const PDFMobileViewer = dynamic(() => import('./PDFMobileViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <SpinnerIcon className="text-brand-orange h-10 w-10 animate-spin" />
    </div>
  ),
});

interface AdaptivePDFViewerProps {
  pdfUrl?: string;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
}

/**
 * Adaptive PDF Viewer that renders different components based on device type:
 * - Desktop: 3D FlipBook viewer with Three.js
 * - Mobile: KeenSlider with PDF pages extracted as images
 */
export default function AdaptivePDFViewer({
  pdfUrl = '',
  bookData,
}: AdaptivePDFViewerProps) {
  const { isMobile, isClient } = useIsMobile();

  // Show loading state until client-side hydration
  if (!isClient) {
    return (
      <div className="bg-pdf relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SpinnerIcon className="text-brand-orange h-10 w-10 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isMobile ? (
        <PDFMobileViewer pdfUrl={pdfUrl} bookData={bookData} />
      ) : (
        <PDFDesktopViewer pdfUrl={pdfUrl} bookData={bookData} />
      )}
    </div>
  );
}
