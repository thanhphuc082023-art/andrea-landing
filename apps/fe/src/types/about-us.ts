export interface AboutUsContent {
  introduction: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
  signature: string;
}

export interface AboutUsVision {
  title: string;
  contents: {
    value: string;
  }[];
}

export interface HeroVideoData {
  desktopVideo?: {
    url: string;
    alternativeText?: string;
  };
  mobileVideo?: {
    url: string;
    alternativeText?: string;
  };
}

export interface WorkflowItem {
  file: {
    id: number;
    position: number;
    url: string;
    name: string;
    alternativeText?: string;
    alt?: string;
    className?: string;
  };
}

export interface WorkflowSection {
  slogan?: string;
  images?: WorkflowItem[];
}

export interface AboutUsPageData {
  id: number;
  aboutUsContent: AboutUsContent;
  visions: AboutUsVision[];
  image?: {
    url: string;
    alternativeText?: string;
  };
  coreValue?: any;
  workflow?: WorkflowSection;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaImage?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
  };
}

export interface StrapiAboutUsResponse {
  data: AboutUsPageData | null;
  meta?: any;
  error?: any;
}
