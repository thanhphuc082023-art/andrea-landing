import clsx from 'clsx';
import type { StrapiGlobal } from '@/types/strapi';

interface HeaderVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  serverGlobal?: StrapiGlobal;
}

function HeaderVideo({
  videoSrc = '',
  posterSrc = '',
  serverGlobal = null,
}: HeaderVideoProps) {
  return (
    <div
      className={clsx(
        'header-video-container relative inset-0 z-0 overflow-hidden',
        'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-80px)]'
      )}
    >
      {/* Skeleton overlay */}
      <div
        className={clsx(
          'absolute inset-0 z-10 animate-pulse bg-gray-200',
          'skeleton-video'
        )}
        aria-hidden="true"
      />

      <video
        className={clsx('relative z-20 h-full w-full object-cover')}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        onLoadedData={(e) => {
          // Ẩn skeleton khi video đã load (client-side)
          const skeleton = document.querySelector('.skeleton-video');
          if (skeleton) skeleton.classList.add('hidden');
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        <track src={videoSrc} kind="captions" label="Vietnamese" />
      </video>
    </div>
  );
}

export default HeaderVideo;
