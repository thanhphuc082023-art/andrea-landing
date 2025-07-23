import clsx from 'clsx';
import Image from 'next/image';
import type { StrapiGlobal } from '@/types/strapi';

interface HeaderVideoProps {
  videoSrc?: string;
  serverGlobal?: StrapiGlobal;
}

// Pure static component - renders at build time, no client-side JavaScript
function HeaderVideo({ videoSrc = '', serverGlobal = null }: HeaderVideoProps) {
  const finalVideoSrc = videoSrc;

  const fallbackImageUrl = '/assets/images/hero_homepage.webp'; // Fallback image URL for header background

  // const strapiImageFallback = serverGlobal?.favicon?.url;

  const imageSizes =
    '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px';

  const primaryImageSrc = `${fallbackImageUrl}?width=1920&format=webp&quality=90`;

  return (
    <div
      className={clsx(
        'header-video-container relative inset-0 z-0 overflow-hidden',
        'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-80px)]'
      )}
    >
      {!finalVideoSrc ? (
        <Image
          src={primaryImageSrc}
          alt="Header background"
          fill
          className="object-cover object-center"
          priority
          fetchPriority="high"
          quality={90}
          sizes={imageSizes}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      ) : (
        <>
          <Image
            src={primaryImageSrc}
            alt="Header background"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            quality={50}
            sizes={imageSizes}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
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
        </>
      )}
    </div>
  );
}

export default HeaderVideo;
