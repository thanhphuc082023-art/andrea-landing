import clsx from 'clsx';
import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeaderVideoProps {
  videoSrc?: string;
}

function HeaderVideo({ videoSrc = '' }: HeaderVideoProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Check if device is mobile and has good connection
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only show video on mobile if connection is good
      if (mobile && 'connection' in navigator) {
        const { effectiveType, saveData } = (navigator as any).connection || {};
        setShouldShowVideo(effectiveType === '4g' && !saveData);
      } else if (!mobile) {
        setShouldShowVideo(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
    setShouldShowVideo(false);
  };

  const baseImageUrl =
    'https://api.builder.io/api/v1/image/assets/TEMP/aa900ed26675db6e843778c020dcbb13b0f69d38';
  const imageSizes =
    '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px';
  const primaryImageSrc = `${baseImageUrl}?width=${isMobile ? '768' : '1920'}&format=webp`;

  return (
    <m.div
      className={clsx(
        'header-video-container relative inset-0 z-0 overflow-hidden',
        'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-80px)]'
      )}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1.2 }}
    >
      {videoSrc && shouldShowVideo && !isMobile && !videoError ? (
        <video
          className={clsx('h-full w-full object-cover')}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${baseImageUrl}?width=1920&format=webp`}
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/mp4" onError={handleVideoError} />
          <track kind="captions" src="" srcLang="vi" label="Vietnamese" />
        </video>
      ) : (
        /* Optimized responsive image using Next.js Image */
        <Image
          src={primaryImageSrc}
          alt="Header background"
          fill
          className="object-cover object-center"
          priority
          fetchPriority="high"
          quality={75}
          sizes={imageSizes}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      )}
    </m.div>
  );
}

export default HeaderVideo;
