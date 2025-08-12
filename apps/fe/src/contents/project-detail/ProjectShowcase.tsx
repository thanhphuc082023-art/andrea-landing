import clsx from 'clsx';
import Image from 'next/image';
import { memo } from 'react';
import MinimalFlipBook from '@/components/MinimalFlipBook';

// Types
interface ProjectShowcaseProps {
  project?: any;
}

interface ShowcaseItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  colSpan?: number;
  type?: 'image' | 'video' | 'flipbook';
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
}

interface ShowcaseSection {
  id: string;
  items: ShowcaseItem[];
  layout: 'single' | 'grid';
  gridCols?: number;
}

// Data moved to separate file for better maintainability
const showcaseData: ShowcaseSection[] = [
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
        src: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf', // URL to your HTML file
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
  {
    id: 'additional-1',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/adda31fa59c292418f39460a5a1c7e17856f7a45?width=2602',
        alt: 'Additional project showcase section',
        width: 1300,
        height: 630,
      },
    ],
  },
  {
    id: 'additional-2',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/6d1e23fb2acdcc203d186bb8cf1396a6eceec58d?width=2602',
        alt: 'Additional project showcase section 2',
        width: 1301,
        height: 558,
      },
    ],
  },
  {
    id: 'additional-3',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/6118edd92ff11a0ac7f998a08429a89b67c38012?width=2600',
        alt: 'Additional project showcase section 3',
        width: 1300,
        height: 800,
      },
    ],
  },
  {
    id: 'additional-4',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/c2466bdb67294577597ec5f42d934d8822b8e88f?width=2600',
        alt: 'Additional project showcase section 4',
        width: 1300,
        height: 800,
      },
    ],
  },
  {
    id: 'additional-5',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/69c14e46d1db67de2a2dd5f04e7a103bbd640f36?width=2600',
        alt: 'Additional project showcase section 5',
        width: 1300,
        height: 638,
      },
    ],
  },
  {
    id: 'additional-6',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/image/assets/TEMP/e93b41a0ebe440653cae0bab043a858852d020a4?width=2600',
        alt: 'Additional project showcase section 6',
        width: 1300,
        height: 638,
      },
    ],
  },
  {
    id: 'video-section',
    layout: 'single',
    items: [
      {
        src: 'https://api.builder.io/api/v1/video/assets/TEMP/your-video-url-here',
        alt: 'Additional project showcase video section',
        width: 1300,
        height: 673,
        type: 'video',
      },
    ],
  },
];

// Memoized components for better performance
const ShowcaseItem = memo(
  ({ item, priority = false }: { item: ShowcaseItem; priority?: boolean }) => {
    const commonClasses =
      'h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]';

    if (item.type === 'video') {
      return (
        <video
          src={item.src}
          className={commonClasses}
          controls
          muted
          loop
          playsInline
        />
      );
    }

    if (item.type === 'flipbook') {
      return (
        <div className="h-[800px] w-full overflow-hidden bg-[#dedede]">
          <MinimalFlipBook
            pdfUrl={
              item.src ||
              'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf'
            }
            bookData={{
              title: 'Project Title',
              websiteUrl: 'https://example.com',
              phoneNumber: '+1234567890',
              downloadUrl: '/download-file.pdf',
            }}
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
        width={item.width}
        height={item.height}
        className={commonClasses}
        sizes={
          item.width > 1000
            ? '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1300px'
            : '(max-width: 1024px) 100vw, 50vw'
        }
        priority={priority}
      />
    );
  }
);

ShowcaseItem.displayName = 'ShowcaseItem';

const ShowcaseSection = memo(
  ({ section, index }: { section: ShowcaseSection; index: number }) => {
    if (section.layout === 'single') {
      const item = section.items[0];

      // Special handling for flipbook sections
      if (item.type === 'flipbook') {
        return (
          <div key={section.id}>
            <ShowcaseItem item={item} priority={index === 0} />
          </div>
        );
      }

      return (
        <div key={section.id} className="group">
          <div className="relative h-full overflow-hidden bg-white shadow-sm">
            <ShowcaseItem item={item} priority={index === 0} />
          </div>
        </div>
      );
    }

    return (
      <div
        key={section.id}
        className={`grid grid-cols-1 lg:grid-cols-${section.gridCols}`}
      >
        {section.items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className={`group ${item.colSpan ? `lg:col-span-${item.colSpan}` : ''}`}
          >
            <div className="relative h-full overflow-hidden bg-white shadow-sm">
              <ShowcaseItem item={item} />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

ShowcaseSection.displayName = 'ShowcaseSection';

function ProjectShowcase({ project = null }: ProjectShowcaseProps) {
  return (
    <section className="content-wrapper">
      <div>
        {showcaseData.map((section, index) => (
          <ShowcaseSection key={section.id} section={section} index={index} />
        ))}
      </div>
    </section>
  );
}

export default memo(ProjectShowcase);
