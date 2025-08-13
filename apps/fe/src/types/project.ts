export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  isLarge?: boolean;
  slug?: string;
}

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

// New interfaces for admin control
export interface ProjectFormData {
  title: string;
  description: string;
  content?: string;
  slug?: string;
  technologies?: string[];
  featured: boolean;
  status: 'draft' | 'in-progress' | 'completed';
  overview?: string;
  challenge?: string;
  solution?: string;
  categoryId?: string;
  featuredImage?: File | null;
  gallery?: File[];
  results?: Array<{
    title: string;
    description: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    metaRobots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: File | null;
    ogType?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: File | null;
    twitterCard?: string;
    schemaMarkup?: string;
  };
  projectIntroTitle: string;
  projectMetaInfo: string[];
  credits?: {
    title?: string;
    date?: string;
    projectManager: string;
  };
  heroVideo?: File | null;
  thumbnail?: File | null;
}

export interface ShowcaseSection {
  id: string;
  title: string;
  type: 'image' | 'video' | 'flipbook' | 'text' | 'gallery';
  layout:
    | 'single'
    | 'grid'
    | 'masonry'
    | 'carousel'
    | 'half-half'
    | 'one-third';
  items: ShowcaseItem[];
  gridCols?: number;
  order: number;
}

export interface ShowcaseItem {
  id: string;
  type: 'image' | 'video' | 'text' | 'flipbook';
  title: string;
  description?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  colSpan?: number;
  bookData?: any;
  order: number;
  size?: number; // Add file size property
  file?: File; // Add file property for upload
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
}
