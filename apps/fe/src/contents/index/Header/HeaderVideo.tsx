import clsx from 'clsx';
import { getStrapiMediaUrl } from '@/utils/helper';
import ScrollDownButton from '@/components/ScrollDownButton';

interface HeaderVideoProps {
  heroData?: any;
}

function HeaderVideo({ heroData = {} }: HeaderVideoProps) {
  const desktopVideo =
    getStrapiMediaUrl(heroData?.desktopVideo) ||
    'https://andrea.vn/uploads/videos/intro-website_3.mp4';
  const mobileVideo =
    getStrapiMediaUrl(heroData?.mobileVideo) ||
    'https://andrea.vn/uploads/videos/intro-website_3.mp4';
  // const desktopPoster = getStrapiMediaUrl(heroData?.desktopPoster) || '';
  // const mobilePoster = getStrapiMediaUrl(heroData?.mobilePoster) || '';

  return (
    <div
      className={clsx(
        'header-video-container relative inset-0 z-0 overflow-hidden',
        'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-65px)]'
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
      >
        <source src={desktopVideo || mobileVideo} type="video/mp4" />
        <track
          src={desktopVideo || mobileVideo}
          kind="captions"
          label="Vietnamese"
        />
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
      >
        <source src={mobileVideo || desktopVideo} type="video/mp4" />
        <track
          src={mobileVideo || desktopVideo}
          kind="captions"
          label="Vietnamese"
        />
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
