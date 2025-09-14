import clsx from 'clsx';
import { getStrapiMediaUrl } from '@/utils/helper';
import ScrollDownButton from '@/components/ScrollDownButton';
import React, { useEffect, useMemo, useRef } from 'react';

interface HeaderVideoProps {
  heroData?: any;
  mobileAspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | '';
}

const DEFAULT_VIDEO = 'https://andrea.vn/uploads/videos/intro-website_3.mp4';

function HeaderVideo({
  heroData = {},
  mobileAspectRatio = '',
}: HeaderVideoProps) {
  // Robust video url extractor (handles string, {url}, Strapi shapes)
  const getVideoUrl = (videoData: any): string | null => {
    if (!videoData) return null;

    if (typeof videoData === 'string') {
      return videoData;
    }
    // Common shape: { url: '/uploads/..' } or { url: 'https://...' }
    if (videoData.url && typeof videoData.url === 'string') {
      return videoData.url.startsWith('/') && getStrapiMediaUrl(videoData.url)
        ? (getStrapiMediaUrl(videoData.url) ?? null)
        : videoData.url;
    }

    // Strapi v4 shape: { data: { attributes: { url: '...' } } }
    if (videoData.data?.attributes?.url) {
      const u = videoData.data.attributes.url;
      return typeof u === 'string'
        ? u.startsWith('/')
          ? (getStrapiMediaUrl(u) ?? null)
          : u
        : null;
    }

    return null;
  };

  const isYouTubeUrl = (u?: string | null) =>
    !!u && (u.includes('youtube.com') || u.includes('youtu.be'));

  const getYouTubeId = (u: string) => {
    const match =
      u.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/) ||
      u.match(/([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const getYouTubeEmbedUrl = (u: string) => {
    const id = getYouTubeId(u);
    if (!id) return null;
    // autoplay, muted, loop (loop needs playlist=id)
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playsinline=1&disablekb=1&modestbranding=1&rel=0`;
  };

  const getMobileAspectRatioClasses = (ratio: string) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16]';
      case 'auto':
        return 'h-auto';
      default:
        return 'aspect-[9/16]';
    }
  };

  const mobileClasses = getMobileAspectRatioClasses(mobileAspectRatio);

  const desktopSrc = useMemo(
    () => getVideoUrl(heroData?.desktopVideo) ?? null,
    [heroData?.desktopVideo]
  );
  const mobileSrc = useMemo(
    () => getVideoUrl(heroData?.mobileVideo) ?? null,
    [heroData?.mobileVideo]
  );

  const fallbackSrc = useMemo(
    () => desktopSrc ?? mobileSrc ?? DEFAULT_VIDEO,
    [desktopSrc, mobileSrc]
  );

  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const skeletonRef = useRef<HTMLDivElement | null>(null);

  // YouTube mounts and player refs
  const desktopYouTubeRef = useRef<HTMLDivElement | null>(null);
  const mobileYouTubeRef = useRef<HTMLDivElement | null>(null);
  const desktopYtPlayerRef = useRef<any>(null);
  const mobileYtPlayerRef = useRef<any>(null);

  const hideSkeleton = () => {
    skeletonRef.current?.classList.add('hidden');
  };

  // Load YouTube IFrame API once and return a promise that resolves when ready
  const loadYouTubeAPI = (() => {
    let promise: Promise<void> | null = null;
    return () => {
      if (promise) return promise;
      promise = new Promise<void>((resolve) => {
        if ((window as any).YT && (window as any).YT.Player) return resolve();
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        // do not overwrite existing handler — compose
        const prev = (window as any).onYouTubeIframeAPIReady;
        (window as any).onYouTubeIframeAPIReady = () => {
          if (typeof prev === 'function') prev();
          resolve();
        };
      });
      return promise;
    };
  })();

  // create a player for a container ref and video id
  const createYouTubePlayer = async (
    container: HTMLDivElement | null,
    videoId: string | null,
    playerRef: React.MutableRefObject<any>
  ) => {
    if (!container || !videoId) return;
    await loadYouTubeAPI();
    // destroy existing if any
    if (playerRef.current && playerRef.current.destroy) {
      try {
        playerRef.current.destroy();
      } catch (e) {}
    }

    playerRef.current = new (window as any).YT.Player(container, {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        loop: 1,
        playlist: videoId, // required for loop
        playsinline: 1,
        disablekb: 1,
        modestbranding: 1,
        showInfo: 0,
        rel: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e: any) => {
          try {
            e.target.mute();
            e.target.playVideo();
          } catch (err) {}
          hideSkeleton();
        },
        onError: (e: any) => {
          console.log('error', e);
          hideSkeleton();
        },
      },
    });
  };

  // Effects to mount desktop/mobile YouTube players when urls are YouTube links
  useEffect(() => {
    if (!isYouTubeUrl(desktopSrc)) return;
    const id = getYouTubeId(desktopSrc!);
    createYouTubePlayer(desktopYouTubeRef.current, id, desktopYtPlayerRef);
    return () => {
      if (desktopYtPlayerRef.current && desktopYtPlayerRef.current.destroy) {
        try {
          desktopYtPlayerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [desktopSrc]);

  useEffect(() => {
    if (!isYouTubeUrl(mobileSrc)) return;
    const id = getYouTubeId(mobileSrc!);
    createYouTubePlayer(mobileYouTubeRef.current, id, mobileYtPlayerRef);
    return () => {
      if (mobileYtPlayerRef.current && mobileYtPlayerRef.current.destroy) {
        try {
          mobileYtPlayerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [mobileSrc]);

  const loadAndPlay = (el: HTMLVideoElement | null, src: string | null) => {
    if (!el || !src) return;
    try {
      // reload sources and attempt autoplay
      el.load();
      el.play().catch(() => {});
    } catch (err) {
      // silent
      // console.warn('Video reload error', err);
    }
  };

  useEffect(() => {
    loadAndPlay(desktopVideoRef.current, desktopSrc ?? fallbackSrc);
  }, [desktopSrc, fallbackSrc]);

  useEffect(() => {
    loadAndPlay(mobileVideoRef.current, mobileSrc ?? fallbackSrc);
  }, [mobileSrc, fallbackSrc]);

  useEffect(() => {
    // ensure fallback tries to play if others missing
    if (!desktopSrc && !mobileSrc) {
      loadAndPlay(fallbackVideoRef.current, fallbackSrc);
    }
  }, [desktopSrc, mobileSrc, fallbackSrc]);

  const commonVideoProps = {
    autoPlay: true,
    muted: false,
    loop: true,
    playsInline: true,
    preload: 'metadata' as const,
    onLoadedData: hideSkeleton,
    onError: hideSkeleton,
  };

  return (
    <div
      className={clsx(
        'header-video-container relative inset-0 z-0 w-full overflow-hidden',
        'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-65px)]',
        mobileAspectRatio ? `max-sd:${mobileClasses} max-sd:!h-auto` : ''
      )}
    >
      <div
        ref={skeletonRef}
        className={clsx(
          'skeleton-video pointer-events-none absolute inset-0 z-10 h-[calc(100vh-65px)]'
        )}
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />

      {/* Desktop: if YouTube -> iframe embed, else <video> */}
      {isYouTubeUrl(desktopSrc) ? (
        (() => {
          const embed = getYouTubeEmbedUrl(desktopSrc!);
          return embed ? (
            // ensure wrapper has full height so YT iframe can fill
            <div className="video-responsive h-full">
              <div
                ref={desktopYouTubeRef}
                // make the inner container absolute so iframe gets full size
                className={clsx(
                  'absolute inset-0 z-20 object-cover',
                  'pointer-events-none max-md:pointer-events-auto'
                )}
                aria-hidden="true"
              />
            </div>
          ) : null;
        })()
      ) : (
        <video
          ref={desktopVideoRef}
          className={clsx(
            'relative z-20 h-full w-full object-cover',
            'hidden md:block'
          )}
          {...commonVideoProps}
        >
          <source src={desktopSrc ?? fallbackSrc} type="video/mp4" />
          <track
            src={desktopSrc ?? fallbackSrc}
            kind="captions"
            label="Vietnamese"
          />
        </video>
      )}

      {/* Mobile: if YouTube -> iframe (mounted via API), else <video> */}
      {isYouTubeUrl(mobileSrc) ? (
        <></>
      ) : (
        <video
          ref={mobileVideoRef}
          className={clsx(
            'relative z-20 h-full w-full object-cover',
            'block md:hidden'
          )}
          {...commonVideoProps}
        >
          <source src={mobileSrc ?? fallbackSrc} type="video/mp4" />
          <track
            src={mobileSrc ?? fallbackSrc}
            kind="captions"
            label="Vietnamese"
          />
        </video>
      )}

      {/* Explicit fallback if neither desktop nor mobile provided */}
      {!desktopSrc && !mobileSrc && (
        <video
          ref={fallbackVideoRef}
          className={clsx('relative z-20 h-full w-full object-cover')}
          {...commonVideoProps}
        >
          <source src={fallbackSrc} type="video/mp4" />
          <track src={fallbackSrc} kind="captions" label="Vietnamese" />
        </video>
      )}

      <ScrollDownButton
        className={clsx(
          'absolute bottom-6 left-1/2 z-30 -translate-x-1/2',
          mobileAspectRatio ? 'max-sd:hidden' : ''
        )}
        text="Kéo xuống"
      />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default HeaderVideo;
