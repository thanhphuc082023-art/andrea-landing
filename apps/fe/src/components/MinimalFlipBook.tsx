'use client';

import { AdaptivePDFViewer } from './PDFViewer';

interface MinimalFlipBookProps {
  pdfUrl?: string;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
}

/**
 * MinimalFlipBook component that uses adaptive rendering:
 * - Desktop: 3D FlipBook with Three.js
 * - Mobile: KeenSlider with PDF pages as images
 */
export default function MinimalFlipBook({
  pdfUrl = '',
  bookData,
}: MinimalFlipBookProps) {
  return (
    <div className="max-sd:h-[calc(100vh-60px)] max-sd:min-h-[calc(100vh-60px)] relative h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] overflow-hidden">
      <AdaptivePDFViewer pdfUrl={pdfUrl} bookData={bookData} />
    </div>
  );
}
