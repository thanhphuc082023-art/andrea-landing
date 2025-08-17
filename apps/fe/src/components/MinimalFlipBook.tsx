'use client';

import { AdaptivePDFViewer } from './PDFViewer';
import clsx from 'clsx';

interface MinimalFlipBookProps {
  pdfUrl?: string;
  height?: number;
  className?: string;
  style?: any;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
  isSimpleLayout?: boolean;
  isHideActions?: boolean;
  isHideScrollDown?: boolean;
}

/**
 * MinimalFlipBook component that uses adaptive rendering:
 * - Desktop: 3D FlipBook with Three.js
 * - Mobile: KeenSlider with PDF pages as images
 */
export default function MinimalFlipBook({
  pdfUrl = '',
  className = '',
  style,
  height,
  bookData,
  isSimpleLayout = false,
  isHideActions = false,
  isHideScrollDown = false,
}: MinimalFlipBookProps) {
  return (
    <div
      className={clsx(
        height
          ? 'h-full'
          : isSimpleLayout
            ? 'h-screen min-h-screen'
            : 'max-sd:h-[calc(100vh-60px)] max-sd:min-h-[calc(100vh-60px)] h-[calc(100vh-65px)] min-h-[calc(100vh-65px)]',
        'relative overflow-hidden',
        className
      )}
      style={{ ...(height ? { height: `${height}px` } : undefined), ...style }}
    >
      <AdaptivePDFViewer
        isHideActions={isHideActions}
        isHideScrollDown={isHideScrollDown}
        pdfUrl={pdfUrl}
        height={height} // Pass height to AdaptivePDFViewer
        bookData={bookData}
      />
    </div>
  );
}
