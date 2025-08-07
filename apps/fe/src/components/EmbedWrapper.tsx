'use client';

import { useEffect, useState } from 'react';

interface EmbedWrapperProps {
  src: string;
  width?: string;
  height?: string;
  title?: string;
  className?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export default function EmbedWrapper({
  src,
  width = '100%',
  height = '100%',
  title = 'E-Profile',
  className = '',
  onLoad,
  onError,
}: EmbedWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Show fallback sau 10s nếu không load được
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowFallback(true);
      }
    }, 10000);

    // Listen for messages từ iframe
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === 'IFRAME_LOADED' &&
        event.data.source === 'e-profile-embed'
      ) {
        setIsLoading(false);
        setError(null);
        if (onLoad) onLoad();

        if (event.data.data.status === 'error') {
          setError('E-Profile không thể tải');
          if (onError) onError('E-Profile không thể tải');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [isLoading, onLoad, onError]);

  const handleIframeLoad = () => {
    // Backup fallback nếu postMessage không hoạt động
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 2000);
  };

  const handleIframeError = () => {
    setError('Không thể tải E-Profile');
    setIsLoading(false);
    if (onError) onError('Không thể tải E-Profile');
  };

  const openInNewTab = () => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  if (error && !showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <div className="p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Không thể tải E-Profile
          </h3>
          <p className="mb-4 text-gray-600">
            Trình duyệt đã chặn việc hiển thị nội dung này hoặc có lỗi xảy ra.
          </p>
          <button
            onClick={openInNewTab}
            className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Mở trong tab mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600">Đang tải E-Profile...</p>
            {showFallback && (
              <button
                onClick={openInNewTab}
                className="mt-4 inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600"
              >
                Mở trong tab mới
              </button>
            )}
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={src}
        width={width}
        height={height}
        style={{
          border: 'none',
          width: width,
          height: height,
          display: 'block',
        }}
        allowFullScreen
        title={title}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      />
    </div>
  );
}
