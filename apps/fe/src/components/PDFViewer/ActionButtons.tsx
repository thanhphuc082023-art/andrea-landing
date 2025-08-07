'use client';

import React from 'react';
import { Globe, Phone, Download } from 'lucide-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

interface ActionButtonsProps {
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
  isMobile?: boolean;
}

export default function ActionButtons({
  bookData,
  isMobile = false,
}: ActionButtonsProps) {
  const router = useRouter();
  const isSimpleLayout = router.query.simpleLayout === 'true';
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;
  const isEmbedPage =
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/embed');

  const handleWebsiteClick = () => {
    if (bookData?.websiteUrl) {
      // Luôn mở website trong tab/window mới
      window.open(bookData.websiteUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to homepage
      if (isInIframe || isEmbedPage) {
        // Nếu trong iframe hoặc embed page, mở homepage trong tab mới
        window.open(window.location.origin, '_blank', 'noopener,noreferrer');
      } else {
        // Trong page bình thường, có thể navigate
        router.push('/');
      }
    }
  };

  const handlePhoneClick = () => {
    if (bookData?.phoneNumber) {
      // tel: links hoạt động tốt trong iframe
      window.location.href = `tel:${bookData.phoneNumber}`;
    }
  };

  const handleDownloadClick = () => {
    if (bookData?.downloadUrl) {
      // Tạo download link tạm thời
      const link = document.createElement('a');
      link.href = bookData.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      // Thêm download attribute nếu có title
      if (bookData.title) {
        const fileName = `${bookData.title}.pdf`;
        link.download = fileName;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isMobile) {
    // Mobile: Horizontal buttons at bottom center
    return (
      <div
        className={clsx(
          isSimpleLayout ? 'bottom-[20px]' : 'bottom-[60px]',
          'absolute left-1/2 z-[15] flex -translate-x-1/2 space-x-4'
        )}
      >
        {/* Website/Home Button */}
        <button
          onClick={handleWebsiteClick}
          className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label={bookData?.websiteUrl ? 'Visit Website' : 'Go to Homepage'}
        >
          <Globe
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
            className="h-6 w-6 transition-transform group-hover:scale-110"
          />
        </button>

        {/* Phone Button */}
        {bookData?.phoneNumber && (
          <button
            onClick={handlePhoneClick}
            className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={`Call ${bookData.phoneNumber}`}
          >
            <Phone
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
              className="h-6 w-6 transition-transform group-hover:scale-110"
            />
          </button>
        )}

        {/* Download Button */}
        {bookData?.downloadUrl && (
          <button
            onClick={handleDownloadClick}
            className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={`Download ${bookData.title || 'PDF'}`}
          >
            <Download
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
              className="h-6 w-6 transition-transform group-hover:scale-110"
            />
          </button>
        )}
      </div>
    );
  }

  // Desktop: Vertical buttons at top right
  return (
    <div className="absolute right-4 top-4 z-[15] flex flex-col space-y-3">
      {/* Website/Home Button */}
      <button
        onClick={handleWebsiteClick}
        className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label={bookData?.websiteUrl ? 'Visit Website' : 'Go to Homepage'}
        title={bookData?.websiteUrl ? 'Visit Website' : 'Go to Homepage'}
      >
        <Globe
          style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
          className="h-6 w-6 transition-transform group-hover:scale-110"
        />
      </button>

      {/* Phone Button */}
      {bookData?.phoneNumber && (
        <button
          onClick={handlePhoneClick}
          className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label={`Call ${bookData.phoneNumber}`}
          title={`Call ${bookData.phoneNumber}`}
        >
          <Phone
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
            className="h-6 w-6 transition-transform group-hover:scale-110"
          />
        </button>
      )}

      {/* Download Button */}
      {bookData?.downloadUrl && (
        <button
          onClick={handleDownloadClick}
          className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label={`Download ${bookData.title || 'PDF'}`}
          title={`Download ${bookData.title || 'PDF'}`}
        >
          <Download
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
            className="h-6 w-6 transition-transform group-hover:scale-110"
          />
        </button>
      )}
    </div>
  );
}
