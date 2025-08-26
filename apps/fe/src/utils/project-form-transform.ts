import { ProjectEntity } from '@/types/strapi';
import { type ProjectFormData } from '@/lib/validations/project';
import { getStrapiMediaUrl } from '@/utils/helper';

/**
 * Transform Strapi project entity to form data format
 * Based on the actual API response structure
 */
export function transformStrapiProjectToFormData(
  project: any
): Partial<ProjectFormData> {
  return {
    // Basic info
    title: project.title || '',
    description: project.description || '',
    slug: project.slug || '',
    projectIntroTitle: project.projectIntroTitle || '',

    // Status and settings
    status: project.projectStatus || 'draft',
    featured: project.featured || false,

    // Media files - transform to form format with URLs
    heroVideo: project.heroVideo
      ? {
          url: getStrapiMediaUrl(project.heroVideo),
          name:
            project.heroVideo.name || project.heroVideo.data?.attributes?.name,
          file: undefined, // No file object for existing media
          uploadId: project.heroVideo.id || project.heroVideo.data?.id,
        }
      : undefined,

    heroBanner: project.heroBanner
      ? {
          url: getStrapiMediaUrl(project.heroBanner),
          name:
            project.heroBanner.name ||
            project.heroBanner.data?.attributes?.name,
          file: undefined,
          uploadId: project.heroBanner.id || project.heroBanner.data?.id,
        }
      : undefined,

    thumbnail: project.thumbnail
      ? {
          url: getStrapiMediaUrl(project.thumbnail),
          name:
            project.thumbnail.name || project.thumbnail.data?.attributes?.name,
          file: undefined,
          uploadId: project.thumbnail.id || project.thumbnail.data?.id,
          // Store all relevant ID information for debugging and backup
          id:
            project.thumbnail.id ||
            (project.thumbnail.data && project.thumbnail.data.id) ||
            project.thumbnail.data?.attributes?.id,
          // Store raw data for fallback
          raw: project.thumbnail,
          format:
            project.thumbnail.format ||
            project.thumbnail.data?.attributes?.format,
        }
      : undefined,

    featuredImage: project.featuredImage
      ? {
          url: getStrapiMediaUrl(project.featuredImage),
          name:
            project.featuredImage.name ||
            project.featuredImage.data?.attributes?.name,
          file: undefined,
          uploadId: project.featuredImage.id || project.featuredImage.data?.id,
        }
      : undefined,

    // Gallery - transform array
    gallery:
      project.gallery?.map((item: any, index: number) => ({
        id: item.id?.toString() || `gallery-${index}`,
        url: getStrapiMediaUrl(item),
        name: item.name || item.data?.attributes?.name,
        alt:
          item.alt ||
          item.alternativeText ||
          item.data?.attributes?.alternativeText ||
          item.name ||
          '',
        file: undefined,
      })) || [],

    // Showcase sections - transform to form format
    showcase:
      project.showcaseSections?.map((section: any, sectionIndex: number) => ({
        id: section.id || `section-${sectionIndex}`,
        title: section.title || `Section ${sectionIndex + 1}`,
        layout: section.layout || 'single',
        type: section.type || 'image',
        order: section.order || sectionIndex,
        gridCols:
          section.gridCols || (section.layout === 'grid' ? 2 : undefined),
        // For 'text' and 'image-text' layouts treat items as text blocks
        items:
          section.type === 'text' || section.type === 'image-text'
            ? section.items && section.items.length > 0
              ? section.items.map((item: any, itemIndex: number) => ({
                  id: item.id || `item-${sectionIndex}-${itemIndex}`,
                  title: item.title || item.alt || '',
                  description: item.description || '',
                  type: 'text',
                  order: item.order || itemIndex,
                  width: item.width || 1300,
                  height: item.height || 800,
                }))
              : // No items in source: create default depending on layout
                section.layout && section.layout !== 'single'
                ? [
                    {
                      id: `item-${sectionIndex}-0`,
                      title: '',
                      description: '',
                      type: 'text',
                      order: 0,
                      width: 1300,
                      height: 800,
                    },
                    {
                      id: `item-${sectionIndex}-1`,
                      title: '',
                      description: '',
                      type: 'text',
                      order: 1,
                      width: 1300,
                      height: 800,
                    },
                  ]
                : [
                    {
                      id: `item-${sectionIndex}-0`,
                      title: '',
                      description: '',
                      type: 'text',
                      order: 0,
                      width: 1300,
                      height: 800,
                    },
                  ]
            : // Non-text sections: existing mapping for media/flipbook/etc.
              section.items?.map((item: any, itemIndex: number) => ({
                id: item.id || `item-${sectionIndex}-${itemIndex}`,
                title: item.title || item.alt || '',
                alt: item.alt || item.title || '',
                src: getStrapiMediaUrl(item) || item.src || item.url,
                url: getStrapiMediaUrl(item) || item.src || item.url,
                type: item.type || 'image',
                width: item.width || 1300,
                height: item.height || 800,
                size: item.size || 0,
                order: item.order || itemIndex,
                colSpan: item.colSpan || 1,
                file: undefined, // No file object for existing items
                uploadId: item.uploadId || undefined,
                // FlipBook specific data
                bookData:
                  item.bookData ||
                  (item.type === 'flipbook'
                    ? {
                        title: 'Project Title',
                        websiteUrl: 'https://example.com',
                        phoneNumber: '+1234567890',
                        downloadUrl: '/download-file.pdf',
                      }
                    : undefined),
              })) || [],
        // For image-text sections, also expose section-level image/background data for the admin form
        ...(section.type === 'image-text'
          ? {
              title: section.title || '',
              subtitle: section.subtitle || '',
              description: section.description || '',
              imageWidth: section.imageWidth,
              imageHeight: section.imageHeight,
              width: section.width,
              height: section.height,
              // Keep original objects if present (used by server)
              image: section.image || undefined,
              background: section.background || undefined,
              // Convenience URLs for previews (client-side)
              imageSrc:
                (section.image && getStrapiMediaUrl(section.image)) ||
                section.imageSrc ||
                undefined,
              backgroundSrc:
                (section.background && getStrapiMediaUrl(section.background)) ||
                section.backgroundSrc ||
                undefined,
              backgroundAlt: section.backgroundAlt || undefined,
              imageAlt: section.imageAlt || undefined,
              contentImagePosition: section.contentImagePosition || 'left',
              imageFile: undefined,
              backgroundFile: undefined,
              imageUploadId: section.imageUploadId || undefined,
              backgroundUploadId: section.backgroundUploadId || undefined,
            }
          : {}),
      })) || [],

    // Arrays
    technologies: project.technologies || [],
    projectMetaInfo: project.projectMetaInfo || [],
    results: project.results || [],
    metrics: project.metrics || [],

    // Credits
    credits: project.credits
      ? {
          title: project.credits.title || 'Thank for watching',
          date: project.credits.date || new Date().toISOString().split('T')[0],
          creditLabel: project.credits.creditLabel || 'Credit:',
          projectManager: project.credits.projectManager || '',
        }
      : {
          title: 'Thank for watching',
          date: new Date().toISOString().split('T')[0],
          creditLabel: 'Credit:',
          projectManager: '',
        },

    // Category ID (if available)
    categoryId:
      project.category?.id?.toString() ||
      project.categoryId?.toString() ||
      undefined,

    // SEO
    seo: project.seo
      ? {
          title: project.seo.title || project.seo.metaTitle || '',
          description:
            project.seo.description || project.seo.metaDescription || '',
          ogTitle: project.seo.ogTitle || '',
          ogDescription: project.seo.ogDescription || '',
          twitterTitle: project.seo.twitterTitle || '',
          twitterDescription: project.seo.twitterDescription || '',
          keywords: Array.isArray(project.seo.keywords)
            ? project.seo.keywords
            : typeof project.seo.keywords === 'string'
              ? project.seo.keywords.split(',').map((k: string) => k.trim())
              : [],
          canonicalUrl:
            project.seo.canonicalUrl || project.seo.canonicalURL || '',
        }
      : {
          title: '',
          description: '',
          ogTitle: '',
          ogDescription: '',
          twitterTitle: '',
          twitterDescription: '',
          keywords: [],
          canonicalUrl: '',
        },
  };
}

/**
 * Helper function to validate transformed data
 */
export function validateTransformedFormData(data: Partial<ProjectFormData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Tiêu đề dự án không được để trống');
  }

  if (!data.description?.trim()) {
    errors.push('Mô tả dự án không được để trống');
  }

  if (!data.slug?.trim()) {
    errors.push('Slug dự án không được để trống');
  }

  // Check for showcase sections
  if (!data.showcase || data.showcase.length === 0) {
    errors.push('Dự án cần có ít nhất một showcase section');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
