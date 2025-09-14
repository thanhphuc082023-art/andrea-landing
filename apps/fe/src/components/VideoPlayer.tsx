import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface VideoPlayerProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  onLoadStart?: () => void;
  onLoadedData?: () => void;
  onError?: () => void;
}

const VideoPlayer = memo(
  ({
    src,
    alt = 'Video content',
    className = '',
    width,
    height,
    autoPlay = true,
    controls = true,
    loop = true,
    muted = true,
    playsInline = true,
    preload = 'metadata',
    onLoadStart,
    onLoadedData,
    onError,
  }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const skeletonRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const hideSkeleton = () => {
      try {
        skeletonRef.current?.classList.add('hidden');
        setIsLoading(false);
      } catch (e) {
        console.warn('Error hiding skeleton:', e);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
      onLoadStart?.();
    };

    const handleLoadedData = () => {
      // Keep loading until video can play through completely
      onLoadedData?.();
    };

    const handleCanPlayThrough = () => {
      // Video is fully loaded and can play through without buffering
      hideSkeleton();
    };

    const handleProgress = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const duration = video.duration;
          if (duration > 0) {
            const progress = (bufferedEnd / duration) * 100;
            setLoadingProgress(Math.min(progress, 100));
          }
        }
      }
    };

    const handleError = () => {
      hideSkeleton();
      setHasError(true);
      onError?.();
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => observer.disconnect();
    }, []);

    // YouTube video handling
    const isYouTubeUrl = (url: string) => {
      return url.includes('youtube.com') || url.includes('youtu.be');
    };

    const getYouTubeId = (url: string) => {
      const match =
        url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/) ||
        url.match(/([A-Za-z0-9_-]{11})/);
      return match ? match[1] : null;
    };

    if (isYouTubeUrl(src)) {
      const videoId = getYouTubeId(src);
      if (!videoId) {
        return (
          <div
            className={clsx(
              'flex items-center justify-center bg-gray-200',
              className
            )}
          >
            <span className="text-sm text-gray-500">Invalid YouTube URL</span>
          </div>
        );
      }

      return (
        <div className={clsx('relative overflow-hidden', className)}>
          {/* Skeleton loader */}
          <div
            ref={skeletonRef}
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{
              background:
                'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          ></div>

          {/* YouTube iframe */}
          {isIntersecting && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=${playsInline ? 1 : 0}&playlist=${videoId}`}
              title={alt}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleCanPlayThrough}
              onError={handleError}
            />
          )}

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

    // Regular video handling
    return (
      <div className={clsx('relative overflow-hidden', className)}>
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
        >
          <div className="text-center">
            <span className="text-sm text-gray-400">
              {hasError
                ? 'Error loading video'
                : `Loading video... ${Math.round(loadingProgress)}%`}
            </span>
            {!hasError && (
              <div className="mt-2 h-1 w-32 rounded-full bg-gray-300">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="mb-2 text-2xl text-gray-400">⚠️</div>
              <span className="text-sm text-gray-500">
                Failed to load video
              </span>
            </div>
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          className={clsx(
            'relative z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]',
            hasError && 'hidden'
          )}
          width={width}
          height={height}
          controls={controls}
          autoPlay={autoPlay && isIntersecting}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={isIntersecting ? preload : 'none'}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onCanPlayThrough={handleCanPlayThrough}
          onProgress={handleProgress}
          onError={handleError}
          aria-label={alt}
        >
          {/* Only load source when in viewport */}
          {isIntersecting && <source src={src} type="video/mp4" />}
          Your browser does not support the video tag.
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
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
