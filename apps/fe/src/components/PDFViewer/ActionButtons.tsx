'use client';

import React from 'react';
import { Globe, Phone, Download } from 'lucide-react';
import { useRouter } from 'next/router';

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
  pdfUrl,
  isMobile = false,
}: ActionButtonsProps) {
  const router = useRouter();

  const handleWebsiteClick = () => {
    if (bookData?.websiteUrl) {
      window.open(bookData.websiteUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to homepage
      router.push('/');
    }
  };

  const handlePhoneClick = () => {
    if (bookData?.phoneNumber) {
      window.open(`tel:${bookData.phoneNumber}`, '_self');
    }
  };

  const handleDownloadClick = () => {
    window.open(
      bookData.downloadUrl || pdfUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (isMobile) {
    // Mobile: Horizontal buttons at bottom center
    return (
      <div className="absolute bottom-[60px] left-1/2 z-[15] flex -translate-x-1/2 space-x-4">
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
