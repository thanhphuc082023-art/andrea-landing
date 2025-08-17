import clsx from 'clsx';
import { getStrapiMediaUrl } from '@/utils/helper';
import ScrollDownButton from '@/components/ScrollDownButton';

interface HeaderVideoProps {
  heroData?: any;
  aspectRatio?: 'full' | '16:9' | '4:3' | '1:1' | 'auto';
  mobileAspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | 'auto';
}

function HeaderVideo({
  heroData = {},
  aspectRatio = 'full',
  mobileAspectRatio = '9:16',
}: HeaderVideoProps) {
  // Handle different video data formats
  const getVideoUrl = (videoData: any) => {
    if (!videoData) return null;

    // If it's a string URL
    if (typeof videoData === 'string') {
      return videoData;
    }

    // If it's an object with url property (from form)
    if (videoData.url) {
      return videoData.url;
    }

    // If it's a Strapi media object
    if (videoData.url) {
      return getStrapiMediaUrl(videoData.url);
    }

    return null;
  };

  // Get aspect ratio classes for desktop
  const getDesktopAspectRatioClasses = (ratio: string) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video'; // Tailwind's 16:9 aspect ratio
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case 'auto':
        return 'h-auto';
      case 'full':
      default:
        return 'h-[calc(100vh-65px)]'; // Full viewport height on desktop
    }
  };

  // Get aspect ratio classes for mobile
  const getMobileAspectRatioClasses = (ratio: string) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video'; // 16:9 aspect ratio
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16]'; // Portrait aspect ratio for mobile
      case 'auto':
        return 'h-auto';
      default:
        return 'aspect-[9/16]'; // Default mobile portrait
    }
  };

  const desktopClasses = getDesktopAspectRatioClasses(aspectRatio);
  const mobileClasses = getMobileAspectRatioClasses(mobileAspectRatio);

  const desktopVideo =
    getVideoUrl(heroData?.desktopVideo) ||
    'https://andrea.vn/uploads/videos/intro-website_3.mp4';
  const mobileVideo =
    getVideoUrl(heroData?.mobileVideo) ||
    'https://andrea.vn/uploads/videos/intro-website_3.mp4';

  return (
    <div
      className={clsx(
        'header-video-container relative inset-0 z-0 w-full overflow-hidden',
        // Desktop aspect ratio
        `md:${desktopClasses}`,
        // Mobile aspect ratio
        `max-md:${mobileClasses}`
      )}
    >
      {/* Custom shimmer skeleton */}
      <div
        className={clsx(
          'skeleton-video pointer-events-none absolute inset-0 z-10'
        )}
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />

      {/* Desktop Video - Show on desktop, fallback to any available video */}
      <video
        className={clsx(
          'relative z-20 h-full w-full object-cover',
          'hidden md:block' // Show only on desktop
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => {
          const skeleton = document.querySelector('.skeleton-video');
          if (skeleton) skeleton.classList.add('hidden');
        }}
        onError={(e) => {
          console.error('Desktop video error:', e);
          const skeleton = document.querySelector('.skeleton-video');
          if (skeleton) skeleton.classList.add('hidden');
        }}
      >
        <source src={desktopVideo} type="video/mp4" />
        <track src={desktopVideo} kind="captions" label="Vietnamese" />
      </video>

      {/* Mobile Video - Show on mobile, fallback to desktop if no mobile video */}
      <video
        className={clsx(
          'relative z-20 h-full w-full object-cover',
          'block md:hidden' // Show only on mobile
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => {
          const skeleton = document.querySelector('.skeleton-video');
          if (skeleton) skeleton.classList.add('hidden');
        }}
        onError={(e) => {
          console.error('Mobile video error:', e);
          const skeleton = document.querySelector('.skeleton-video');
          if (skeleton) skeleton.classList.add('hidden');
        }}
      >
        <source src={mobileVideo} type="video/mp4" />
        <track src={mobileVideo} kind="captions" label="Vietnamese" />
      </video>

      {/* Fallback Video nếu không có mobile/desktop riêng */}
      {!mobileVideo && !desktopVideo && (desktopVideo || mobileVideo) && (
        <video
          className={clsx('relative z-20 h-full w-full object-cover')}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => {
            const skeleton = document.querySelector('.skeleton-video');
            if (skeleton) skeleton.classList.add('hidden');
          }}
          onError={(e) => {
            console.error('Fallback video error:', e);
            const skeleton = document.querySelector('.skeleton-video');
            if (skeleton) skeleton.classList.add('hidden');
          }}
        >
          <source src={desktopVideo || mobileVideo} type="video/mp4" />
          <track
            src={desktopVideo || mobileVideo}
            kind="captions"
            label="Vietnamese"
          />
        </video>
      )}

      {/* Scroll Down Button */}
      <ScrollDownButton
        className={clsx('absolute bottom-6 left-1/2 z-30 -translate-x-1/2')}
        text="Kéo xuống"
      />

      {/* Shimmer keyframes */}
      <style>{`
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

export default HeaderVideo;
