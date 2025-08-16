// Project showcase item for UI display
export interface ProjectShowcaseItem {
  id: string;
  type: 'image' | 'video' | 'flipbook';
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  colSpan?: number;
  order: number;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
  // For file upload handling
  file?: File;
  uploadId?: string;
  size?: number;
}

// Project showcase section for UI display
export interface ProjectShowcaseSection {
  id: string;
  title: string;
  type: 'image' | 'video' | 'mixed';
  layout: 'single' | 'half-half' | 'one-third' | 'grid';
  gridCols?: number;
  items: ProjectShowcaseItem[];
  order: number;
}

// Project metrics
export interface ProjectMetrics {
  value: string;
  label: string;
  description?: string;
}

// Project results
export interface ProjectResults {
  title: string;
  description: string;
}

// Project credits
export interface ProjectCredits {
  role: string;
  names: string[];
}

// Project SEO data
export interface ProjectSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

// Media file reference
export interface MediaFile {
  id: number;
  url: string;
  name: string;
  mime: string;
  width?: number;
  height?: number;
  alt?: string;
}

// Complete project data for UI display
export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  description: string;
  projectIntroTitle: string;

  content?: string;
  overview?: string;
  challenge?: string;
  solution?: string;

  projectStatus: 'draft' | 'in-progress' | 'completed';
  featured: boolean;
  technologies: string[];
  projectMetaInfo: string[];

  heroVideo?: MediaFile | null;
  heroBanner?: MediaFile | null;
  thumbnail?: MediaFile | null;
  featuredImage?: MediaFile | null;
  gallery: MediaFile[];

  showcaseSections: ProjectShowcaseSection[];

  results: ProjectResults[];
  metrics: ProjectMetrics[];
  credits: ProjectCredits[];

  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;

  projectUrl?: string;
  githubUrl?: string;

  seo?: ProjectSEO;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

// Legacy project interface for backward compatibility
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  isLarge?: boolean;
  slug?: string;
}

// Legacy project card props
export interface ProjectCardProps {
  project: any;
  className?: string;
}

// Form data for project creation/editing
export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  projectIntroTitle: string;

  content?: string;
  overview?: string;
  challenge?: string;
  solution?: string;

  projectStatus: 'draft' | 'in-progress' | 'completed';
  featured: boolean;
  technologies: string[];
  projectMetaInfo: string[];

  categoryId?: number | null;
  projectUrl?: string;
  githubUrl?: string;

  heroVideo?: {
    file: File;
    name: string;
  } | null;

  thumbnail?: {
    file: File;
    name: string;
  } | null;

  featuredImage?: {
    file: File;
    name: string;
  } | null;

  gallery: Array<{
    file: File;
    name: string;
  }>;

  showcase: Array<{
    id: string;
    title: string;
    type: 'image' | 'video' | 'mixed';
    layout: 'single' | 'half-half' | 'one-third' | 'grid';
    gridCols?: number;
    items: Array<{
      id: string;
      type: 'image' | 'video' | 'flipbook';
      title: string;
      alt: string;
      width: number;
      height: number;
      colSpan?: number;
      order: number;
      file?: File;
      src?: string;
      bookData?: {
        title?: string;
        websiteUrl?: string;
        phoneNumber?: string;
        downloadUrl?: string;
      };
    }>;
    order: number;
  }>;

  results: ProjectResults[];
  metrics: ProjectMetrics[];
  credits: ProjectCredits[];

  seo?: ProjectSEO;
}

// Type guards
export function isValidShowcaseLayout(
  layout: string
): layout is ProjectShowcaseSection['layout'] {
  return ['single', 'half-half', 'one-third', 'grid'].includes(layout);
}

export function isValidShowcaseItemType(
  type: string
): type is ProjectShowcaseItem['type'] {
  return ['image', 'video', 'flipbook'].includes(type);
}

export function isValidProjectStatus(
  status: string
): status is ProjectData['projectStatus'] {
  return ['draft', 'in-progress', 'completed'].includes(status);
}
