'use client';

import { AdaptivePDFViewer } from './PDFViewer';
import clsx from 'clsx';

interface MinimalFlipBookProps {
  pdfUrl?: string;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
  isSimpleLayout?: boolean;
}

/**
 * MinimalFlipBook component that uses adaptive rendering:
 * - Desktop: 3D FlipBook with Three.js
 * - Mobile: KeenSlider with PDF pages as images
 */
export default function MinimalFlipBook({
  pdfUrl = '',
  bookData,
  isSimpleLayout = false,
}: MinimalFlipBookProps) {
  return (
    <div
      className={clsx(
        isSimpleLayout
          ? 'h-screen min-h-screen'
          : 'max-sd:h-[calc(100vh-60px)] max-sd:min-h-[calc(100vh-60px)] h-[calc(100vh-65px)] min-h-[calc(100vh-65px)]',
        'relative overflow-hidden'
      )}
    >
      <AdaptivePDFViewer pdfUrl={pdfUrl} bookData={bookData} />
    </div>
  );
}
