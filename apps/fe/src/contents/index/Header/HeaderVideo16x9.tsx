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
  const [userInteracted, setUserInteracted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
  };

  const handleCanPlayThrough = () => {
    hideSkeleton();
  };

  const handleError = () => {
    hideSkeleton();
    setHasError(true);
  };

  useEffect(() => {
    if (!videoRef.current || !source) return;

    const video = videoRef.current;

    // Đảm bảo video được muted để autoplay
    video.muted = true;

    // Load video
    video.load();

    // Thử autoplay ngay lập tức
    const tryAutoplay = () => {
      video.play().catch((error) => {
        console.warn('Autoplay failed:', error);
        // Thử lại sau 500ms
        setTimeout(() => {
          video.play().catch((error) => {
            console.warn('Retry autoplay failed:', error);
            // Nếu vẫn thất bại, hiển thị play button
            setShowPlayButton(true);
          });
        }, 500);
      });
    };

    // Thử autoplay ngay lập tức
    tryAutoplay();

    // Thử autoplay khi video có thể phát
    const handleCanPlay = () => {
      video.play().catch((error) => {
        console.warn('Canplay autoplay failed:', error);
        setShowPlayButton(true);
      });
    };

    // Thử autoplay khi video có thể phát qua
    const handleCanPlayThrough = () => {
      video.play().catch((error) => {
        console.warn('CanPlayThrough autoplay failed:', error);
        setShowPlayButton(true);
      });
    };

    // Thử autoplay khi video load xong
    const handleLoadedData = () => {
      video.play().catch((error) => {
        console.warn('LoadedData autoplay failed:', error);
        setShowPlayButton(true);
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [source]);

  // Global click handler để enable autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      if (videoRef.current && !videoRef.current.playing) {
        videoRef.current.play().catch(console.warn);
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, {
      once: true,
    });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Intersection Observer để autoplay khi video visible
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Video visible - thử autoplay
            video.play().catch((error) => {
              console.warn('Intersection autoplay failed:', error);
              setShowPlayButton(true);
            });
          } else {
            setIsVisible(false);
            // Video không visible - pause để tiết kiệm bandwidth
            video.pause();
          }
        });
      },
      {
        threshold: 0.1, // Trigger khi 10% video visible
        rootMargin: '0px',
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [source]);

  // Force autoplay khi component visible và user đã tương tác
  useEffect(() => {
    if (isVisible && userInteracted && videoRef.current) {
      videoRef.current.play().catch(console.warn);
    }
  }, [isVisible, userInteracted]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setShowPlayButton(false);
        })
        .catch(console.warn);
    }
  };

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

      {/* Play button fallback */}
      {showPlayButton && !hasError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <button
            onClick={handlePlayClick}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-90 text-black transition-all hover:scale-110 hover:bg-opacity-100"
          >
            <svg
              className="ml-1 h-8 w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={clsx(
          'absolute inset-0 h-full w-full object-cover',
          hasError && 'hidden'
        )}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
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
