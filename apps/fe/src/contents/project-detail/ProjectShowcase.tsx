import clsx from 'clsx';
import Image from 'next/image';
import { memo } from 'react';
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
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
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
      'object-cover transition-transform duration-700 group-hover:scale-[1.02]';
    const html = item.description?.replace(/\n/g, '<br/>') || '';

    if (item.type === 'text') {
      return (
        <div
          className={clsx(
            'pointer-events-none flex h-full w-full items-center justify-center bg-white p-6 max-lg:h-fit max-md:p-[28px]',
            !item?.description && !item?.title ? 'max-lg:hidden' : ''
          )}
          style={{ height: item?.height }}
        >
          <div className="max-w-full">
            {item.title ? (
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
            ) : null}
            {item.description ? (
              <div
                className="whitespace-pre-wrap text-sm text-[#7D7D7D]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}
          </div>
        </div>
      );
    }
    if (item.type === 'video') {
      return (
        <video
          src={item.src}
          className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          controls
          muted
          loop
          playsInline
          autoPlay
        />
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
        style={{ objectFit: 'cover' }}
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
        width: item.width || 1300,
        height: item.height || 600, // Default height for better UX
        type: itemType,
        bookData: item.bookData || {},
        colSpan: item.colSpan || 1,
      };
    };

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
          <div key={section.id}>
            <ShowcaseItem item={transformedItem} priority={index === 0} />
          </div>
        );
      }

      return (
        <div key={section.id} className="group">
          <div
            className="relative w-full overflow-hidden bg-white"
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
          key={section.id}
          className={clsx(
            'grid grid-cols-2',
            section.type === 'text' ? 'max-lg:grid-cols-1' : ''
          )}
        >
          {items.map((item: any, itemIndex: number) => {
            const transformedItem = transformItem(item, itemIndex);
            // For half-half layout, divide width by 2 for proper aspect ratio
            const adjustedWidth = items[0].width / 2;
            return (
              <div key={itemIndex} className="group">
                <div
                  className="relative w-full overflow-hidden bg-white"
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
        <div key={section.id} className="grid grid-cols-3">
          {items.map((item: any, itemIndex: number) => {
            const transformedItem = transformItem(item, itemIndex);
            // For one-third layout: first item gets 1/3 width, second item gets 2/3 width
            const adjustedWidth =
              itemIndex === 0
                ? items[0].width / 3 // First item: 33%
                : (items[0].width * 2) / 3; // Second item: 67%
            return (
              <div
                key={itemIndex}
                className={`group ${itemIndex === 1 ? 'col-span-2' : ''}`}
              >
                <div
                  className="relative w-full overflow-hidden bg-white"
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
        <div key={section.id} className="grid grid-cols-3">
          {items.map((item: any, itemIndex: number) => {
            const transformedItem = transformItem(item, itemIndex);
            // Use one third of the first item's width for aspect ratio calculations
            const adjustedWidth = items[0]?.width
              ? items[0].width / 3
              : 1300 / 3;

            return (
              <div key={itemIndex} className="group">
                <div
                  className="relative w-full overflow-hidden bg-white"
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
      <div key={section.id} className={`grid ${getGridClass(gridCols)}`}>
        {items.map((item: any, itemIndex: number) => {
          const transformedItem = transformItem(item, itemIndex);
          // For grid layout, adjust width based on column span and total columns
          const effectiveColSpan = transformedItem.colSpan || 1;
          const adjustedWidth = (items[0].width * effectiveColSpan) / gridCols;
          return (
            <div
              key={itemIndex}
              className={`group ${transformedItem.colSpan ? getColSpanClass(transformedItem.colSpan) : ''}`}
            >
              <div
                className="relative w-full overflow-hidden bg-white"
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
