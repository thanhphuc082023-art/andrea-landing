'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface HeaderVideo16x9Props {
  src?: string;
  poster?: string;
  className?: string;
}

export default function HeaderVideo16x9({
  src,
  poster,
  className = '',
}: HeaderVideo16x9Props) {
  const source = src || 'https://andrea.vn/uploads/videos/intro-website_3.mp4';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const hideSkeleton = () => {
    try {
      skeletonRef.current?.classList.add('hidden');
      setIsLoading(false);
    } catch (e) {
      console.warn('Error hiding skeleton:', e);
    }
  };

  const handleLoadedData = () => {
    hideSkeleton();
    // Đảm bảo autoplay sau khi load xong
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn('Autoplay failed on loadedData:', error);
      });
    }
  };

  const handleCanPlayThrough = () => {
    hideSkeleton();
    // Đảm bảo autoplay sau khi có thể phát
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn('Autoplay failed on canPlayThrough:', error);
      });
    }
  };

  const handleError = () => {
    hideSkeleton();
    setHasError(true);
  };

  useEffect(() => {
    if (!videoRef.current || !source) return;
    try {
      videoRef.current.load();
      // Thử autoplay ngay sau khi load
      videoRef.current.play().catch((error) => {
        console.warn('Initial autoplay failed:', error);
      });
    } catch (error) {
      console.warn('Error in useEffect:', error);
    }
  }, [source]);

  if (!source) return null;

  return (
    <div className={clsx('relative h-full w-full', className)}>
      {/* Skeleton loader */}
      <div
        ref={skeletonRef}
        className={clsx(
          'absolute inset-0 z-10 flex items-center justify-center',
          !isLoading && 'hidden'
        )}
        style={{
          background:
            'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="mb-2 text-2xl text-gray-400">⚠️</div>
            <span className="text-sm text-gray-500">Failed to load video</span>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={clsx(
          'absolute inset-0 h-full w-full object-cover',
          hasError && 'hidden'
        )}
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster={poster}
        onLoadedData={handleLoadedData}
        onCanPlayThrough={handleCanPlayThrough}
        onError={handleError}
      >
        <source src={source} type="video/mp4" />
      </video>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
