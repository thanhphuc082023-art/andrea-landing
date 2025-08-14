export interface StrapiBaseAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiEntity<T = Record<string, any>> {
  id: number;
  attributes: T & StrapiBaseAttributes;
}

export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Common content types
export interface StrapiSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: StrapiMedia | null;
  shareImage?: StrapiMedia | null;
  keywords?: string;
  metaRobots?: string;
  structuredData?: any;
  metaViewport?: string;
  canonicalURL?: string;
}

export interface StrapiArticle {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featuredImage?: StrapiMedia | null;
  author?: {
    data: StrapiAuthor | null;
  };
  categories?: {
    data: StrapiCategory[];
  };
  tags?: {
    data: StrapiTag[];
  };
  seo?: StrapiSEO;
  featured?: boolean;
  readingTime?: number;
}

export interface StrapiProject {
  id?: number | string;
  title: string;
  description: string;
  content: string;
  slug: string;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  featuredImage?: StrapiMedia | null;
  gallery?: StrapiMedia[];
  images?: {
    data: StrapiMedia[];
  };
  category?: {
    data: StrapiCategory | null;
  };
  seo?: StrapiSEO;
  status?: 'draft' | 'in-progress' | 'completed';
  client?: string;
  year?: number;
  overview?: string;
  challenge?: string;
  solution?: string;
  results?: Array<{
    title: string;
    description: string;
  }>;
  metrics?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  showcaseSections?: any[];
}

export interface StrapiAuthor {
  name: string;
  email: string;
  bio?: string;
  avatar?: StrapiMedia | null;
  social?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface StrapiCategory {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: StrapiMedia | null;
}

export interface StrapiTag {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface StrapiPage {
  title: string;
  slug: string;
  content: string;
  seo?: StrapiSEO;
  components?: any[]; // For dynamic zones
}

export interface StrapiGlobal {
  siteName: string;
  siteDescription: string;
  defaultSeo: StrapiSEO;
  logo?: StrapiMedia | null;
  favicon?: StrapiMedia | null;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  navigation?: {
    header: NavigationItem[];
    footer: NavigationItem[];
  };
}

export interface NavigationItem {
  label: string;
  url: string;
  external?: boolean;
  children?: NavigationItem[];
}

// Helper types for API responses
export type ArticleEntity = StrapiEntity<StrapiArticle>;
export type ProjectEntity = StrapiProject;
export type AuthorEntity = StrapiEntity<StrapiAuthor>;
export type CategoryEntity = StrapiEntity<StrapiCategory>;
export type TagEntity = StrapiEntity<StrapiTag>;
export type PageEntity = StrapiEntity<StrapiPage>;
export type GlobalEntity = StrapiEntity<StrapiGlobal>;
export type PartnersEntity = StrapiEntity<StrapiPartners>;

// Partners types
export interface StrapiPartnerItem {
  id: number;
  position: number;
  name?: string;
  alt: string;
  image: {
    data: StrapiEntity<StrapiMedia>;
  };
}

export interface StrapiPartnerRow {
  id: number;
  position: number;
  items: StrapiPartnerItem[];
}

export interface StrapiPartners {
  title: string;
  partner_rows: StrapiPartnerRow[];
}
