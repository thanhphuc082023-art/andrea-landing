'use client';

import React, { useState } from 'react';
import { Globe, Phone, Download, Facebook } from 'lucide-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Tooltip component using Headless UI
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
}

const TooltipWrapper: React.FC<TooltipProps> = ({
  children,
  content,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          >
            {children}
          </div>

          <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-x-1"
            enterTo="opacity-100 translate-x-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-1"
          >
            <Popover.Panel
              static
              className="absolute right-full top-1/2 z-50 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg"
            >
              {content}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

interface ActionButtonsProps {
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    facebookUrl?: string;
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

  const handleFacebookClick = () => {
    if (bookData?.facebookUrl) {
      // Luôn mở Facebook trong tab/window mới
      window.open(bookData.facebookUrl, '_blank', 'noopener,noreferrer');
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
        <TooltipWrapper
          content={bookData?.websiteUrl || ''}
          disabled={isMobile}
        >
          <button
            onClick={handleWebsiteClick}
            className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={bookData?.websiteUrl || ''}
          >
            <Globe
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
              className="h-6 w-6 transition-transform group-hover:scale-110"
            />
          </button>
        </TooltipWrapper>

        {/* Phone Button */}
        {bookData?.phoneNumber && (
          <TooltipWrapper
            content={`Gọi ${bookData.phoneNumber}`}
            disabled={isMobile}
          >
            <button
              onClick={handlePhoneClick}
              className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label={`Gọi ${bookData.phoneNumber}`}
            >
              <Phone
                style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
                className="h-6 w-6 transition-transform group-hover:scale-110"
              />
            </button>
          </TooltipWrapper>
        )}

        {/* Facebook Button */}
        {bookData?.facebookUrl && (
          <TooltipWrapper content="Truy cập Facebook" disabled={isMobile}>
            <button
              onClick={handleFacebookClick}
              className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label="Visit Facebook Page"
            >
              <Facebook
                style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
                className="h-6 w-6 transition-transform group-hover:scale-110"
              />
            </button>
          </TooltipWrapper>
        )}

        {/* Download Button */}
        {bookData?.downloadUrl && (
          <TooltipWrapper content={`Tải xuống`} disabled={isMobile}>
            <button
              onClick={handleDownloadClick}
              className="group flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label={`Download`}
            >
              <Download
                style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
                className="h-6 w-6 transition-transform group-hover:scale-110"
              />
            </button>
          </TooltipWrapper>
        )}
      </div>
    );
  }

  // Desktop: Vertical buttons at top right
  return (
    <div className="absolute right-4 top-4 z-[15] flex flex-col space-y-3">
      {/* Website/Home Button */}
      <TooltipWrapper content={bookData?.websiteUrl || ''}>
        <button
          onClick={handleWebsiteClick}
          className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
          aria-label={bookData?.websiteUrl || ''}
        >
          <Globe
            style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
            className="h-6 w-6 transition-transform group-hover:scale-110"
          />
        </button>
      </TooltipWrapper>

      {/* Phone Button */}
      {bookData?.phoneNumber && (
        <TooltipWrapper content={`Gọi ${bookData.phoneNumber}`}>
          <button
            onClick={handlePhoneClick}
            className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={`Call ${bookData.phoneNumber}`}
          >
            <Phone
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
              className="h-6 w-6 transition-transform group-hover:scale-110"
            />
          </button>
        </TooltipWrapper>
      )}

      {/* Facebook Button */}
      {bookData?.facebookUrl && (
        <TooltipWrapper content="Truy cập Facebook">
          <button
            onClick={handleFacebookClick}
            className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label="Visit Facebook Page"
          >
            <Facebook
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
              className="h-6 w-6 transition-transform group-hover:scale-110"
            />
          </button>
        </TooltipWrapper>
      )}

      {/* Download Button */}
      {bookData?.downloadUrl && (
        <TooltipWrapper content={`Tải xuống`}>
          <button
            onClick={handleDownloadClick}
            className="group flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label={`Download`}
          >
            <Download
              style={{ filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))' }}
              className="h-6 w-6 transition-transform group-hover:scale-110"
            />
          </button>
        </TooltipWrapper>
      )}
    </div>
  );
}
