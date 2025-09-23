import {
  ProjectData,
  ProjectShowcaseSection,
  MediaFile,
} from '@/types/project';
import { StrapiAPI } from '@/lib/strapi';
import { replaceMaxWidth } from '@/utils';

// Transform Strapi project response to ProjectData format
export function transformStrapiProject(strapiProject: any): ProjectData {
  console.log('transformStrapiProject input:', strapiProject);

  if (!strapiProject) {
    throw new Error('Project data is null or undefined');
  }

  // Since Strapi no longer uses attributes wrapper, work directly with the object
  const project = strapiProject;

  // Transform media files - handle new Strapi structure
  const transformMediaFile = (mediaData: any): MediaFile | null => {
    if (!mediaData) return null;

    // Handle both old and new formats
    const media = mediaData.data || mediaData;
    if (!media) return null;

    const mediaAttrs = media.attributes || media;

    return {
      id: media.id,
      url: StrapiAPI.getMediaUrl(mediaAttrs.url),
      name: mediaAttrs.name || 'untitled',
      mime: mediaAttrs.mime || 'application/octet-stream',
      width: mediaAttrs.width || null,
      height: mediaAttrs.height || null,
      alt: mediaAttrs.alternativeText || mediaAttrs.alt || null,
    };
  };

  // Transform gallery
  const transformGallery = (galleryData: any): MediaFile[] => {
    if (!galleryData) return [];

    const galleryArray = Array.isArray(galleryData)
      ? galleryData
      : galleryData.data;
    if (!Array.isArray(galleryArray)) return [];

    return galleryArray.map((media: any) => {
      const mediaAttrs = media.attributes || media;
      return {
        id: media.id,
        url: StrapiAPI.getMediaUrl(mediaAttrs.url),
        name: mediaAttrs.name || 'untitled',
        mime: mediaAttrs.mime || 'application/octet-stream',
        width: mediaAttrs.width || null,
        height: mediaAttrs.height || null,
        alt: mediaAttrs.alternativeText || mediaAttrs.alt || null,
      };
    });
  };

  // Transform showcase sections
  const transformShowcaseSections = (
    sections: any[]
  ): ProjectShowcaseSection[] => {
    if (!Array.isArray(sections)) return [];

    return sections.map((section) => {
      // Handle text sections specially (no media src)
      if (section.type === 'text') {
        const items =
          Array.isArray(section.items) && section.items.length > 0
            ? section.items.map((item: any, idx: number) => ({
                id: item.id || `item-${section.id || 's'}-${idx}`,
                type: 'text',
                title: item.title || '',
                description: item.description || '',
                subtitle: item.subtitle || '',
                largeTitle: item.largeTitle || '',
                width: item.width || 1300,
                height: item.height || 800,
                order: item.order ?? idx,
              }))
            : // No items provided by Strapi -> create defaults depending on layout
              section.layout && section.layout !== 'single'
              ? [
                  {
                    id: `item-${section.id || 's'}-0`,
                    type: 'text',
                    title: '',
                    description: '',
                    subtitle: '',
                    largeTitle: '',
                    width: 1300,
                    height: 800,
                    order: 0,
                  },
                  {
                    id: `item-${section.id || 's'}-1`,
                    type: 'text',
                    title: '',
                    description: '',
                    subtitle: '',
                    largeTitle: '',
                    width: 1300,
                    height: 800,
                    order: 1,
                  },
                ]
              : [
                  {
                    id: `item-${section.id || 's'}-0`,
                    type: 'text',
                    title: '',
                    description: '',
                    subtitle: '',
                    largeTitle: '',
                    width: 1300,
                    height: 800,
                    order: 0,
                  },
                ];

        return {
          ...section,
          items,
        } as ProjectShowcaseSection;
      }

      // Default: media sections - transform src via Strapi helper
      return {
        ...section,
        items: (section.items || []).map((item: any) => ({
          ...item,
          src: item.src ? StrapiAPI.getMediaUrl(item.src) : item.src || null,
        })),
      } as ProjectShowcaseSection;
    });
  };

  return {
    id: project.id,
    title: project.title || '',
    videoLink: project.videoLink || '',
    slug: project.slug || '',
    description: project.description || '',
    projectIntroTitle: project.projectIntroTitle || '',

    overview: project.overview || '',
    challenge: project.challenge || '',
    solution: project.solution || '',

    projectStatus: project.projectStatus || 'draft',
    featured: project.featured || false,
    technologies: project.technologies || [],
    projectMetaInfo: project.projectMetaInfo || [],

    heroBanner: transformMediaFile(project.heroBanner),
    heroVideo: transformMediaFile(project.heroVideo),
    thumbnail: transformMediaFile(project.thumbnail),
    featuredImage: transformMediaFile(project.featuredImage),
    gallery: transformGallery(project.gallery),

    showcaseSections: transformShowcaseSections(project.showcaseSections || []),

    results: project.results || [],
    metrics: project.metrics || [],
    credits: project.credits || [],

    category: project.category
      ? {
          id: project.category.id || project.category.data?.id,
          name:
            project.category.name ||
            project.category.data?.attributes?.name ||
            project.category.attributes?.name,
          slug:
            project.category.slug ||
            project.category.data?.attributes?.slug ||
            project.category.attributes?.slug,
        }
      : null,

    // Fix serialization - use null instead of undefined
    projectUrl: project.projectUrl || null,
    githubUrl: project.githubUrl || null,

    seo: project.seo || null,

    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    publishedAt: project.publishedAt || null,

    body: {
      ...project?.body,
      html: replaceMaxWidth(project?.body?.html || ''),
    },
  };
}

// Validate project data structure for UI compatibility
export function validateProjectData(project: ProjectData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields for UI
  if (!project.title) errors.push('Title is required');
  if (!project.slug) errors.push('Slug is required');
  if (!project.description) errors.push('Description is required');
  if (!project.projectIntroTitle)
    errors.push('Project intro title is required');

  // Check showcase sections structure
  if (Array.isArray(project.showcaseSections)) {
    project.showcaseSections.forEach((section, sectionIndex) => {
      if (!section.id)
        errors.push(`Showcase section ${sectionIndex} is missing id`);
      if (!section.layout)
        errors.push(`Showcase section ${sectionIndex} is missing layout`);

      if (Array.isArray(section.items)) {
        section.items.forEach((item, itemIndex) => {
          if (!item.id)
            errors.push(
              `Showcase section ${sectionIndex}, item ${itemIndex} is missing id`
            );
          if (!item.src && item.type !== 'flipbook')
            errors.push(
              `Showcase section ${sectionIndex}, item ${itemIndex} is missing src`
            );
          if (!item.type)
            errors.push(
              `Showcase section ${sectionIndex}, item ${itemIndex} is missing type`
            );
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Create default showcase structure for UI
export function createDefaultShowcaseStructure(): ProjectShowcaseSection[] {
  return [
    {
      id: 'section-1',
      title: 'Project Overview',
      type: 'image',
      layout: 'single',
      order: 0,
      items: [
        {
          id: 'item-1',
          type: 'image',
          title: 'Overview Image',
          src: '',
          alt: 'Project overview',
          width: 1300,
          height: 800,
          order: 0,
        },
      ],
    },
  ];
}

// Prepare project data for Strapi API
export function prepareProjectDataForStrapi(projectData: ProjectData) {
  return {
    data: {
      title: projectData.title,
      slug: projectData.slug,
      description: projectData.description,
      projectIntroTitle: projectData.projectIntroTitle,
      content: projectData.content,
      overview: projectData.overview,
      challenge: projectData.challenge,
      solution: projectData.solution,
      projectStatus: projectData.projectStatus,
      featured: projectData.featured,
      technologies: projectData.technologies,
      projectMetaInfo: projectData.projectMetaInfo,
      projectUrl: projectData.projectUrl,
      githubUrl: projectData.githubUrl,
      results: projectData.results,
      metrics: projectData.metrics,
      credits: projectData.credits,
      seo: projectData.seo,
      showcaseSections: projectData.showcaseSections,

      // Media relations (IDs only)
      ...(projectData.heroVideo && { heroVideo: projectData.heroVideo.id }),
      ...(projectData.thumbnail && { thumbnail: projectData.thumbnail.id }),
      ...(projectData.featuredImage && {
        featuredImage: projectData.featuredImage.id,
      }),
      ...(projectData.gallery.length > 0 && {
        gallery: projectData.gallery.map((img) => img.id),
      }),
      ...(projectData.category && { category: projectData.category.id }),

      publishedAt:
        projectData.projectStatus === 'completed'
          ? new Date().toISOString()
          : null,
    },
  };
}

// Debug utilities
export function debugProjectData(project: ProjectData) {
  console.log('=== PROJECT DATA DEBUG ===');
  console.log('Title:', project.title);
  console.log('Slug:', project.slug);
  console.log('Status:', project.projectStatus);
  console.log('Featured:', project.featured);

  console.log('\n--- Media Assets ---');
  console.log('Hero Video:', !!project.heroVideo);
  console.log('Thumbnail:', !!project.thumbnail);
  console.log('Featured Image:', !!project.featuredImage);
  console.log('Gallery Count:', project.gallery.length);

  console.log('\n--- Showcase Sections ---');
  console.log('Total Sections:', project.showcaseSections.length);
  project.showcaseSections.forEach((section, index) => {
    console.log(`Section ${index + 1}:`, {
      id: section.id,
      title: section.title,
      layout: section.layout,
      itemCount: section.items.length,
    });
  });

  console.log('\n--- Additional Data ---');
  console.log('Technologies:', project.technologies.length);
  console.log('Results:', project.results.length);
  console.log('Metrics:', project.metrics.length);
  console.log('Credits:', project.credits.length);
  console.log('========================');
}

// Validate showcase section compatibility with UI layouts
export function validateShowcaseLayout(section: ProjectShowcaseSection): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  switch (section.layout) {
    case 'single':
      if (section.items.length > 1) {
        warnings.push(
          `Single layout section "${section.title}" has ${section.items.length} items, but should have only 1`
        );
      }
      break;

    case 'half-half':
      if (section.items.length !== 2) {
        warnings.push(
          `Half-half layout section "${section.title}" has ${section.items.length} items, but should have exactly 2`
        );
      }
      break;

    case 'one-third':
      if (section.items.length !== 2) {
        warnings.push(
          `One-third layout section "${section.title}" has ${section.items.length} items, but should have exactly 2`
        );
      }
      break;

    case 'grid':
      if (!section.gridCols) {
        warnings.push(
          `Grid layout section "${section.title}" is missing gridCols property`
        );
      }
      if (section.items.length === 0) {
        warnings.push(`Grid layout section "${section.title}" has no items`);
      }
      break;
  }

  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
