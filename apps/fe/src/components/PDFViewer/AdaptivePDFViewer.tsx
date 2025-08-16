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

/**
 * Adaptive PDF Viewer that renders different components based on device type:
 * - Desktop: 3D FlipBook viewer with Three.js
 * - Mobile: KeenSlider with PDF pages extracted as images
 */
export default function AdaptivePDFViewer({
  pdfUrl = '',
  height, // Destructure height
  bookData,
  isHideActions = false,
  isHideScrollDown = false,
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
        <PDFMobileViewer
          isHideActions={isHideActions}
          isHideScrollDown={isHideScrollDown}
          pdfUrl={pdfUrl}
          height={height} // Pass height to mobile viewer
          bookData={bookData}
        />
      ) : (
        <PDFDesktopViewer
          isHideActions={isHideActions}
          isHideScrollDown={isHideScrollDown}
          pdfUrl={pdfUrl}
          height={height} // Pass height to desktop viewer
          bookData={bookData}
        />
      )}
    </div>
  );
}
