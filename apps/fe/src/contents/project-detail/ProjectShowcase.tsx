import clsx from 'clsx';
import Image from 'next/image';
import { memo, useEffect, useRef } from 'react';
import MinimalFlipBook from '@/components/MinimalFlipBook';
import {
  ProjectData,
  ProjectShowcaseSection,
  ProjectShowcaseItem,
} from '@/types/project';

// Types
interface ProjectShowcaseProps {
  project?: ProjectData | null;
}

interface ShowcaseItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  colSpan?: number;
  type?: 'image' | 'video' | 'flipbook' | 'text';
  title?: string;
  description?: string;
  subtitle?: string;
  largeTitle?: string;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
  videoLink?: string;
}

// Legacy data for backward compatibility
const legacyShowcaseData: any[] = [
  {
    id: 'moodboard',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/69c14e46d1db67de2a2dd5f04e7a103bbd640f36?width=2600',
        alt: 'Moodboard - Mangrove ecosystem inspiration',
        width: 1300,
        height: 1220,
      },
    ],
  },
  {
    id: 'design-process',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/c2466bdb67294577597ec5f42d934d8822b8e88f?width=2602',
        alt: 'Design process and logo development',
        width: 1301,
        height: 1445,
      },
    ],
  },
  {
    id: 'brand-identity',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/6118edd92ff11a0ac7f998a08429a89b67c38012?width=2718',
        alt: 'Final logo animation and branding',
        width: 1359,
        height: 849,
      },
    ],
  },
  {
    id: 'flipbook-section',
    layout: 'single',
    items: [
      {
        src: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf',
        alt: 'Interactive 3D FlipBook Portfolio',
        width: 1300,
        height: 800,
        type: 'flipbook',
        bookData: {
          title: 'Project Title',
          websiteUrl: 'https://example.com',
          phoneNumber: '+1234567890',
          downloadUrl: '/download-file.pdf',
        },
      },
    ],
  },
  {
    id: 'identity-system',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/6d1e23fb2acdcc203d186bb8cf1396a6eceec58d?width=2602',
        alt: 'Brand identity system - Business cards, letterhead, and collateral',
        width: 1301,
        height: 911,
      },
    ],
  },
  {
    id: 'marketing-materials',
    layout: 'grid',
    gridCols: 2,
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/e93b41a0ebe440653cae0bab043a858852d020a4?width=1350',
        alt: 'Brochure mockup - Marketing materials and publications',
        width: 675,
        height: 521,
      },
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/8563048a5c712bf88623168b6b717f8e2641846a?width=1250',
        alt: 'Invitation design - Event materials and correspondence',
        width: 625,
        height: 521,
      },
    ],
  },
  {
    id: 'gift-packaging',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/adda31fa59c292418f39460a5a1c7e17856f7a45?width=2602',
        alt: 'Gift packaging and promotional materials - Branded merchandise and packaging design',
        width: 1301,
        height: 813,
      },
    ],
  },
  {
    id: 'standee-poster',
    layout: 'grid',
    gridCols: 3,
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/8ad09fac0c3b6f47983555624c7446ad703cb216?width=1092',
        alt: 'Standee displays - Banner and promotional standee designs',
        width: 546,
        height: 545,
        colSpan: 1,
      },
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/60aab9ca38356f9ba4dee71b78a7a4c1eb26f693?width=1510',
        alt: 'Poster displays - Billboard and poster campaign designs',
        width: 755,
        height: 547,
        colSpan: 2,
      },
    ],
  },
];

// Memoized components for better performance
const ShowcaseItem = memo(
  ({ item, priority = false }: { item: ShowcaseItem; priority?: boolean }) => {
    const commonClasses =
      'object-cover transition-transform duration-700 group-hover:scale-[1.02] z-[10]';
    const html = item.description?.replace(/\n/g, '<br/>') || '';

    // Refs and helpers for YouTube mounting (applies when item.type === 'video')
    const ytContainerRef = useRef<HTMLDivElement | null>(null);
    const ytPlayerRef = useRef<any>(null);
    const skeletonRef = useRef<HTMLDivElement | null>(null);

    const hideSkeleton = () => {
      try {
        skeletonRef.current?.classList.add('hidden');
      } catch (e) {}
    };

    // Load YouTube IFrame API once (preserve existing onYouTubeIframeAPIReady)
    const loadYouTubeAPI = (() => {
      let promise: Promise<void> | null = null;
      return () => {
        if (promise) return promise;
        promise = new Promise<void>((resolve) => {
          if ((window as any).YT && (window as any).YT.Player) return resolve();

          // only append script once
          if (
            !document.querySelector(
              'script[src="https://www.youtube.com/iframe_api"]'
            )
          ) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
          }

          // preserve previous handler so multiple components can coexist
          const prev = (window as any).onYouTubeIframeAPIReady;
          (window as any).onYouTubeIframeAPIReady = () => {
            try {
              if (typeof prev === 'function') prev();
            } catch (e) {}
            resolve();
          };
        });
        return promise;
      };
    })();

    const createYouTubePlayer = async (
      container: HTMLDivElement | null,
      videoId: string | null
    ) => {
      if (!container || !videoId) return;
      await loadYouTubeAPI();
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
      }
      ytPlayerRef.current = new (window as any).YT.Player(container, {
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
              hideSkeleton();
            } catch (err) {}
          },
          onError: () => {
            hideSkeleton();
          },
        },
      });
    };

    if (item.type === 'text') {
      return (
        <div
          className={clsx(
            'pointer-events-none flex h-full w-full items-center justify-center bg-white max-lg:h-fit max-md:!h-auto max-md:p-[28px]',
            !item?.description && !item?.title ? 'max-lg:hidden' : ''
          )}
          style={{ height: item?.height }}
        >
          <div className="max-w-full">
            {item.subtitle ? (
              <span className="text-[24px] text-black">{item.subtitle}</span>
            ) : null}
            {item.title ? (
              <h3 className="mt-1 text-[24px] font-semibold text-black">
                {item.title}
              </h3>
            ) : null}
            {item.largeTitle ? (
              <h3 className="text-[35px] font-semibold leading-[43px] text-black max-md:text-[28px] max-md:leading-[36px]">
                {item.largeTitle}
              </h3>
            ) : null}
            {item.description ? (
              <div
                className="mt-3 whitespace-pre-wrap text-sm text-[#7D7D7D]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}
          </div>
        </div>
      );
    }

    if (item.type === 'video') {
      const src = item.src || item.videoLink || '';

      const isYouTubeUrl = (u?: string | null) =>
        !!u && (u.includes('youtube.com') || u.includes('youtu.be'));

      const getYouTubeId = (u: string) => {
        const match =
          u.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/) ||
          u.match(/([A-Za-z0-9_-]{11})/);
        return match ? match[1] : null;
      };

      useEffect(() => {
        if (!isYouTubeUrl(src)) return;
        const id = getYouTubeId(src!);
        createYouTubePlayer(ytContainerRef.current, id);
        return () => {
          if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
            try {
              ytPlayerRef.current.destroy();
            } catch (e) {}
          }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [src]);

      if (isYouTubeUrl(src)) {
        return (
          <div className="video-responsive pointer-events-none relative max-md:pointer-events-auto">
            {/* skeleton overlay */}
            <div
              ref={skeletonRef}
              className="skeleton-video absolute inset-0 z-10"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
            <div
              ref={ytContainerRef}
              className={clsx('relative z-20 h-full w-full object-cover')}
              style={{ width: '100%', height: '100%' }}
              aria-hidden="true"
            />
            {/* visual overlays (can't inject into iframe) */}
            <div className="video-overlay-top" aria-hidden="true" />
            <div className="video-overlay-watermark" aria-hidden="true" />
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>
          </div>
        );
      }

      return (
        <div className="relative h-full w-full">
          <div
            ref={skeletonRef}
            className="skeleton-video absolute inset-0 z-10"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
          <video
            src={src}
            className="pointer-events-none relative z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            controls
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            onLoadedData={() => hideSkeleton()}
            onError={() => hideSkeleton()}
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

    if (item.type === 'flipbook') {
      // Validate PDF URL and provide fallback
      let pdfUrl = item.src;

      return (
        <div className="w-full overflow-hidden bg-[#dedede]">
          <MinimalFlipBook
            className={`!h-auto max-md:!aspect-[1]`}
            height={item?.height}
            style={{
              aspectRatio: `${item?.width || 1300} / ${item?.height || 800}`,
            }}
            pdfUrl={pdfUrl}
            bookData={
              item.bookData || {
                title: 'Project Title',
                websiteUrl: 'https://example.com',
                phoneNumber: '+1234567890',
                downloadUrl: '/download-file.pdf',
              }
            }
            isSimpleLayout={false}
            isHideActions
            isHideScrollDown
          />
        </div>
      );
    }

    return (
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className={commonClasses}
        sizes={
          item.width > 1000
            ? '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1300px'
            : '(max-width: 1024px) 100vw, 50vw'
        }
        priority={priority}
        // style={{ objectFit: 'contain' }}
      />
    );
  }
);

ShowcaseItem.displayName = 'ShowcaseItem';

const ShowcaseSection = memo(
  ({ section, index }: { section: any; index: number }) => {
    const transformItem = (item: any, index: number = 0) => {
      // Helper to resolve source URLs coming from admin/Strapi or local blobs
      const resolveSrc = (rawSrc?: string) => {
        const src = rawSrc || '';
        if (!src) return '';

        // Keep absolute URLs, data or blob URLs unchanged
        if (
          src.startsWith('http') ||
          src.startsWith('data:') ||
          src.startsWith('blob:')
        ) {
          return src;
        }

        // If it's a server-relative path (e.g. /uploads/...), prepend public Strapi base URL
        if (src.startsWith('/')) {
          const base = process.env.NEXT_PUBLIC_STRAPI_URL || '';
          // Ensure no double slash
          if (base) {
            return `${base.replace(/\/+$/, '')}${src}`;
          }
          return src; // fallback to relative path
        }

        // Otherwise return as-is
        return src;
      };

      // Normalize type to the expected union
      const normalizeType = (
        t: any
      ): 'image' | 'video' | 'flipbook' | 'text' => {
        if (!t) return 'image';
        const tt = String(t).toLowerCase();
        if (tt === 'flipbook') return 'flipbook';
        if (tt === 'video') return 'video';
        if (tt === 'text') return 'text';
        return 'image';
      };

      const itemType = normalizeType(item?.type);

      // Handle flipbook items specially
      if (itemType === 'flipbook') {
        // Validate and clean the PDF URL
        let pdfUrl = resolveSrc(item.src || item.url || '');

        return {
          id: item.id || `item-${index}`,
          src: pdfUrl,
          alt: item.alt || item.title || 'Interactive FlipBook',
          width: item.width || 1300,
          height: item.height || 800,
          type: 'flipbook' as const,
          bookData: item.bookData || {
            title: 'Project Portfolio',
            websiteUrl: 'https://example.com',
            phoneNumber: '+1234567890',
            downloadUrl: '/download-file.pdf',
          },
          colSpan: item.colSpan || 1,
        };
      }

      const resolvedSrc = resolveSrc(item.src || item.url || '');

      return {
        id: item.id || `item-${index}`,
        src: resolvedSrc,
        alt: item.alt || item.title || '',
        title: item?.title || '',
        description: item?.description || '',
        subtitle: item?.subtitle || '',
        largeTitle: item?.largeTitle || '',
        width: item.width || 1300,
        height: item.height || 600, // Default height for better UX
        type: itemType,
        bookData: item.bookData || {},
        colSpan: item.colSpan || 1,
        videoLink: item.videoLink || '',
      };
    };

    // New: render image-text section type
    if (section.type === 'image-text') {
      const resolveSrcTop = (raw?: string) => {
        if (!raw) return '';
        if (
          raw.startsWith('http') ||
          raw.startsWith('data:') ||
          raw.startsWith('blob:')
        )
          return raw;
        if (raw.startsWith('/')) {
          const base = process.env.NEXT_PUBLIC_STRAPI_URL || '';
          return base ? `${base.replace(/\/+$/, '')}${raw}` : raw;
        }
        return raw;
      };

      const bgSrc = resolveSrcTop(
        section.backgroundSrc ||
          section.background?.url ||
          section.background ||
          ''
      );
      // content image may be stored as section.imageSrc or as the first image item
      let contentSrc = '';
      let contentAlt = '';
      // Prefer explicit section.image (server object with url), then imageSrc (client blob), then first image item
      if (
        section.image &&
        (section.image.url || typeof section.image === 'string')
      ) {
        const raw = section.image.url || section.image;
        contentSrc = resolveSrcTop(raw);
        contentAlt = section.imageAlt || section.image.name || '';
      } else if (section.imageSrc) {
        contentSrc = resolveSrcTop(section.imageSrc);
        contentAlt = section.imageAlt || '';
      } else if (Array.isArray(section.items) && section.items.length > 0) {
        const imgItem =
          section.items.find(
            (it: any) => (it.type || '').toLowerCase() === 'image'
          ) || section.items[0];
        if (imgItem) {
          contentSrc = resolveSrcTop(imgItem.src || imgItem.url || '');
          contentAlt = imgItem.alt || imgItem.title || '';
        }
      }

      const title = section.title || '';
      const subtitle = section.subtitle || '';
      const description = section.description || '';
      const position =
        section.contentImagePosition === 'right' ? 'right' : 'left';

      // Use section.width and section.height (if present) to control aspect ratio of the image area
      const secWidth = section.width ? Number(section.width) : null;
      const secHeight = section.height ? Number(section.height) : null;
      // Instead of using aspect-ratio, apply an explicit height (px) to the whole section when provided
      const secHeightStyle = secHeight
        ? { height: `${secHeight}px`, maxWidth: `${secWidth}px` }
        : undefined;

      // Content image specific dimensions (from admin editor)
      const imgWidth = section.imageWidth ? Number(section.imageWidth) : null;
      const imgHeight = section.imageHeight
        ? Number(section.imageHeight)
        : null;
      const imageStyle =
        imgWidth && imgHeight
          ? {
              aspectRatio: `${imgWidth} / ${imgHeight}`,
              width: `${imgWidth}px`,
              height: `${imgHeight}`,
            }
          : imgHeight
            ? { height: `${imgHeight}px` }
            : undefined;

      return (
        <div key={section.id} className="w-full overflow-hidden">
          <div
            className="mx-auto w-full max-lg:!h-auto max-lg:!w-full lg:bg-[image:var(--bg-url)]"
            style={{
              ['--bg-url' as any]: `url('${bgSrc || ''}')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              ...secHeightStyle,
            }}
          >
            <div className="flex h-full flex-col items-stretch p-8 max-lg:p-0 lg:flex-row">
              {position === 'right' ? (
                <div className="flex h-full w-full items-center justify-center gap-9 max-lg:flex-col">
                  <div className="flex h-full max-w-[548px] items-center justify-end max-lg:w-full max-lg:max-w-full max-lg:justify-center max-md:px-[25px]">
                    <div className="max-w-full">
                      {title ? (
                        <h3 className="font-playfair text-center text-2xl font-semibold text-gray-900">
                          {title}
                        </h3>
                      ) : null}
                      {subtitle ? (
                        <h4 className="mt-2 text-center text-sm text-gray-700">
                          {subtitle}
                        </h4>
                      ) : null}
                      {description ? (
                        <p className="mt-9 text-sm text-gray-600">
                          {description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Content image: small screens use fixed h-64, md+ use configured image size when provided */}
                  <div
                    className={`relative py-[65px] max-lg:flex max-lg:w-full max-lg:items-center max-lg:justify-center max-lg:bg-[image:var(--bg-url)]`}
                    style={{
                      ['--bg-url' as any]: `url('${bgSrc || ''}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'left',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div
                      className={`relative max-md:!w-1/2`}
                      style={{
                        ...imageStyle,
                      }}
                    >
                      {contentSrc ? (
                        <Image
                          src={contentSrc}
                          alt={contentAlt || title}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center gap-9 max-lg:flex-col">
                  <div
                    className={`relative py-[65px] max-lg:flex max-lg:w-full max-lg:items-center max-lg:justify-center max-lg:bg-[image:var(--bg-url)]`}
                    style={{
                      ['--bg-url' as any]: `url('${bgSrc || ''}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'left',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div
                      className={`relative max-md:!w-1/2`}
                      style={{
                        ...imageStyle,
                      }}
                    >
                      {contentSrc ? (
                        <Image
                          src={contentSrc}
                          alt={contentAlt || title}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="flex h-full max-w-[548px] items-center justify-start max-lg:justify-center max-md:px-[25px]">
                    <div className="max-w-full">
                      <div className="flex flex-col items-center justify-center">
                        {title ? (
                          <h3 className="font-playfair text-center text-[50px] font-semibold text-[#003974]">
                            {title}
                          </h3>
                        ) : null}
                        {subtitle ? (
                          <h4 className="mt-2 text-center text-[24px] text-[#003974] max-lg:text-[20px]">
                            {subtitle}
                          </h4>
                        ) : null}
                      </div>
                      {description ? (
                        <p className="mt-9 text-[16px] leading-[24px] text-[#7D7D7D] max-lg:mt-6">
                          {description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (section.layout === 'single') {
      // Handle both admin structure (items array) and legacy structure
      const items = Array.isArray(section.items)
        ? section.items
        : [section.items];
      const item = items[0];

      if (!item) return null;
      const transformedItem = transformItem(item, 0);
      // Special handling for flipbook sections
      if (transformedItem.type === 'flipbook') {
        return (
          <div
            key={section.id}
            style={{ maxWidth: section?.width, margin: '0 auto' }}
          >
            <ShowcaseItem item={transformedItem} priority={index === 0} />
          </div>
        );
      }

      return (
        <div
          style={{ maxWidth: section?.width, margin: '0 auto' }}
          key={section.id}
          className="group"
        >
          <div
            className="relative w-full bg-white"
            style={{
              aspectRatio:
                transformedItem.type !== 'text'
                  ? `${Number(transformedItem.width || 1300)} / ${Number(
                      transformedItem.height || 800
                    )}`
                  : undefined,
            }}
          >
            <ShowcaseItem item={transformedItem} priority={index === 0} />
          </div>
        </div>
      );
    }

    // Handle half-half layout (50% - 50%)
    if (section.layout === 'half-half') {
      const items = Array.isArray(section.items)
        ? section.items
        : [section.items];

      return (
        <div
          style={{ maxWidth: section?.width, margin: '0 auto' }}
          key={section.id}
          className={clsx(
            'grid grid-cols-2',
            section.type === 'text' ? 'max-lg:grid-cols-1' : '',
            section.type === 'text' &&
              items?.length > 1 &&
              (items?.[1]?.title ||
                items?.[1]?.subtitle ||
                items?.[1]?.largeTitle ||
                items?.[1]?.description)
              ? 'gap-6'
              : ''
          )}
        >
          {items.map((item: any, itemIndex: number) => {
            const transformedItem = transformItem(item, itemIndex);
            // For half-half layout, divide width by 2 for proper aspect ratio
            const adjustedWidth = section.width
              ? section.width / 2
              : items[0]?.width;
            return (
              <div key={itemIndex} className="group">
                <div
                  className="relative w-full bg-white"
                  style={{
                    aspectRatio:
                      transformedItem.type !== 'text'
                        ? `${adjustedWidth} / ${transformedItem.height}`
                        : undefined,
                  }}
                >
                  <ShowcaseItem
                    item={transformedItem}
                    priority={index === 0 && itemIndex === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Handle one-third layout (33% - 67%)
    if (section.layout === 'one-third') {
      const items = Array.isArray(section.items)
        ? section.items
        : [section.items];

      return (
        <div
          style={{ maxWidth: section?.width, margin: '0 auto' }}
          key={section.id}
          className="grid grid-cols-3 max-md:grid-cols-1"
        >
          {items.map((item: any, itemIndex: number) => {
            const transformedItem = transformItem(item, itemIndex);
            // For one-third layout: first item gets 1/3 width, second item gets 2/3 width
            const adjustedWidth =
              itemIndex === 0
                ? section?.width
                  ? section?.width / 3
                  : items[0]?.width // First item: 33%
                : section?.width
                  ? (section?.width / 3) * 2
                  : items[0]?.width * 2; // Second item: 67%
            return (
              <div
                key={itemIndex}
                className={`group ${itemIndex === 1 ? 'col-span-2' : ''}`}
              >
                <div
                  className="relative w-full bg-white"
                  style={{
                    aspectRatio:
                      transformedItem.type !== 'text'
                        ? `${adjustedWidth} / ${transformedItem.height}`
                        : undefined,
                  }}
                >
                  <ShowcaseItem
                    item={transformedItem}
                    priority={index === 0 && itemIndex === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Handle one-third-equal layout (33% - 33% - 33%)
    if (section.layout === 'one-third-equal') {
      const items = Array.isArray(section.items)
        ? section.items
        : [section.items];

      return (
        <div
          style={{ maxWidth: section?.width, margin: '0 auto' }}
          key={section.id}
          className="grid grid-cols-3 max-md:grid-cols-1"
        >
          {items.map((item: any, itemIndex: number) => {
            const transformedItem = transformItem(item, itemIndex);
            // Use one third of the first item's width for aspect ratio calculations
            const adjustedWidth = section?.width
              ? section?.width / 3
              : items[0]?.width
                ? items[0]?.width
                : 1300 / 3;

            return (
              <div key={itemIndex} className="group">
                <div
                  className="relative w-full bg-white"
                  style={{
                    aspectRatio:
                      transformedItem.type !== 'text'
                        ? `${adjustedWidth} / ${transformedItem.height}`
                        : undefined,
                  }}
                >
                  <ShowcaseItem
                    item={transformedItem}
                    priority={index === 0 && itemIndex === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Handle grid layout
    const items = Array.isArray(section.items)
      ? section.items
      : [section.items];
    const gridCols = section.gridCols || 2;

    // Use specific grid classes instead of dynamic ones
    const getGridClass = (cols: number) => {
      switch (cols) {
        case 1:
          return 'grid-cols-1';
        case 2:
          return 'grid-cols-2';
        case 3:
          return 'grid-cols-3';
        case 4:
          return 'grid-cols-2 lg:grid-cols-4'; // 2 cols on mobile, 4 on desktop
        case 5:
          return 'grid-cols-2 lg:grid-cols-5'; // 2 cols on mobile, 5 on desktop
        case 6:
          return 'grid-cols-2 lg:grid-cols-6'; // 2 cols on mobile, 6 on desktop
        default:
          return 'grid-cols-2';
      }
    };

    const getColSpanClass = (colSpan: number) => {
      switch (colSpan) {
        case 1:
          return 'lg:col-span-1';
        case 2:
          return 'lg:col-span-2';
        case 3:
          return 'lg:col-span-3';
        case 4:
          return 'lg:col-span-4';
        case 5:
          return 'lg:col-span-5';
        case 6:
          return 'lg:col-span-6';
        default:
          return '';
      }
    };

    return (
      <div
        style={{ maxWidth: section?.width, margin: '0 auto' }}
        key={section.id}
        className={`grid ${getGridClass(gridCols)}`}
      >
        {items.map((item: any, itemIndex: number) => {
          const transformedItem = transformItem(item, itemIndex);
          // For grid layout, adjust width based on column span and total columns
          const effectiveColSpan = transformedItem.colSpan || 1;
          const adjustedWidth = section?.width
            ? (section?.width * effectiveColSpan) / gridCols
            : items[0]?.width;
          return (
            <div
              key={itemIndex}
              className={`group ${transformedItem.colSpan ? getColSpanClass(transformedItem.colSpan) : ''}`}
            >
              <div
                className="relative w-full bg-white"
                style={{
                  aspectRatio:
                    transformedItem.type !== 'text'
                      ? `${adjustedWidth} / ${transformedItem.height}`
                      : undefined,
                }}
              >
                <ShowcaseItem item={transformedItem} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

ShowcaseSection.displayName = 'ShowcaseSection';

function ProjectShowcase({ project = null }: ProjectShowcaseProps) {
  const sections = project?.showcaseSections || legacyShowcaseData;

  return (
    <section className="content-wrapper max-md:px-0">
      <div>
        {sections.map((section, index) => (
          <ShowcaseSection key={section.id} section={section} index={index} />
        ))}
      </div>
    </section>
  );
}

export default memo(ProjectShowcase);
