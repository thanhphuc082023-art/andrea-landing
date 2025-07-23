import clsx from 'clsx';
import Image from 'next/image';
import type { GlobalEntity } from '@/types/strapi';

interface HeaderVideoProps {
  videoSrc?: string;
  serverGlobal?: GlobalEntity;
}

// Pure static component - renders at build time, no client-side JavaScript
function HeaderVideo({ videoSrc = '', serverGlobal = null }: HeaderVideoProps) {
  // Static video source - determined at build time
  const finalVideoSrc = videoSrc;

  // Optimize image loading - use server data if available for better performance
  const fallbackImageUrl =
    'https://api.builder.io/api/v1/image/assets/TEMP/aa900ed26675db6e843778c020dcbb13b0f69d38';

  // Use site favicon or logo as fallback image if available
  const strapiImageFallback = serverGlobal?.attributes?.favicon?.url;

  // Use optimized image URL for better performance - static values at build time
  const imageSizes =
    '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px';

  // Static image source - optimized for desktop by default, responsive via CSS
  const primaryImageSrc =
    strapiImageFallback ||
    `${fallbackImageUrl}?width=1920&format=webp&quality=85`;

  // Static video display logic - no client-side JavaScript
  const shouldShowVideo = Boolean(finalVideoSrc);

  return (
    <div
      className={clsx(
        'header-video-container relative inset-0 z-0 overflow-hidden',
        'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-80px)]'
      )}
    >
      {/* Static image - always rendered at build time for optimal LCP */}
      <Image
        src={primaryImageSrc}
        alt="Header background"
        fill
        className="object-cover object-center"
        priority
        fetchPriority="high"
        quality={85}
        sizes={imageSizes}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />

      {/* Static video element - rendered at build time, auto-plays on desktop */}
      {finalVideoSrc && shouldShowVideo && (
        <video
          className={clsx(
            'absolute inset-0 h-full w-full object-cover',
            // CSS-only responsive behavior - hide on mobile
            'max-md:hidden'
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={finalVideoSrc} type="video/mp4" />
          <track kind="captions" src="" srcLang="vi" label="Vietnamese" />
        </video>
      )}
    </div>
  );
}

export default HeaderVideo;
