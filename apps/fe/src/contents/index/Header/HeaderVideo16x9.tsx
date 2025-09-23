'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Simple autoplay attempt
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay failed, that's okay
      });
    };

    // Try to play when video is ready
    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', tryPlay);
    };
  }, [source]);

  // Handle user interaction for autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  if (!source && !poster) return null;

  return (
    <div className={clsx('relative h-full w-full', className)}>
      {/* Loading state - only show for video */}
      {isLoading && !isMobile && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100" />
      )}

      {/* Error state - only show for video */}
      {hasError && !isMobile && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="mb-2 text-2xl text-gray-400">⚠️</div>
            <span className="text-sm text-gray-500">Failed to load video</span>
          </div>
        </div>
      )}

      {/* Mobile: Show poster image */}
      {isMobile && poster && (
        <Image
          src={poster}
          alt="Header poster"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          onLoad={() => setIsLoading(false)}
        />
      )}

      {/* Desktop: Show video */}
      {!isMobile && (
        <video
          ref={videoRef}
          className={clsx(
            'absolute inset-0 h-full w-full object-cover',
            hasError && 'hidden'
          )}
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={poster}
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={source} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
