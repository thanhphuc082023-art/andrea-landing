// Footer Types
export interface SocialMediaLink {
  id: number;
  icon: any;
  url: string;
  position: number;
}

export interface OfficeLocation {
  id: number;
  officeName: string;
  address: string;
  isMainOffice: boolean;
  position: number;
}

export interface ContactInfo {
  id: number;
  phone?: {
    href: string;
    label?: string;
  }[];
  email?: {
    href: string;
    label?: string;
  }[];
  website?: {
    href: string;
    label?: string;
  }[];
  phoneIcon?: any;
  mailIcon?: any;
  websiteIcon?: any;
}

export interface FooterSettings {
  id?: number;
  companyName?: string;
  socialMediaTitle?: string;
  contactInfoTitle?: string;
  companyDescription?: string;
  socialMedia?: SocialMediaLink[];
  offices?: OfficeLocation[];
  contactInfo?: ContactInfo;
  logo?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  signatureIcon?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
}

export interface FooterEntity {
  id: number;
  attributes: FooterSettings;
}
