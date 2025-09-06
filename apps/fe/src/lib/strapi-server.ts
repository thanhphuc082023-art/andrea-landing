import type { GlobalEntity, PartnersEntity } from '@/types/strapi';

interface StrapiResponse<T> {
  data: T | undefined;
  error?: any;
}

type GlobalResponse = StrapiResponse<GlobalEntity>;
type MenuResponse = StrapiResponse<any>;
type HeroResponse = StrapiResponse<any>;
type BrandSectionResponse = StrapiResponse<any>;
type PartnersResponse = StrapiResponse<PartnersEntity>;
type FooterResponse = StrapiResponse<any>;

/**
 * Generic function to fetch from Strapi API
 */
async function fetchStrapiAPI(
  endpoint: string,
  params?: Record<string, any>
): Promise<any> {
  try {
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;

    let queryString = '';
    if (params) {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'populate' && typeof value === 'object') {
            // Handle nested populate object
            const flattenPopulate = (obj: any, prefix: string = 'populate') => {
              Object.entries(obj).forEach(([k, v]) => {
                if (typeof v === 'object' && !Array.isArray(v)) {
                  flattenPopulate(v, `${prefix}[${k}]`);
                } else if (Array.isArray(v)) {
                  v.forEach((item, index) => {
                    searchParams.append(
                      `${prefix}[${k}][${index}]`,
                      String(item)
                    );
                  });
                } else {
                  searchParams.append(`${prefix}[${k}]`, String(v));
                }
              });
            };
            flattenPopulate(value);
          } else {
            searchParams.append(key, String(value));
          }
        }
      });

      queryString = searchParams.toString()
        ? `?${searchParams.toString()}`
        : '';
    }

    const apiUrl = `${strapiUrl}/${endpoint}${queryString}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN && {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
    }

    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    console.error(`Error fetching ${endpoint} from Strapi:`, error);
    return { data: undefined, error };
  }
}

/**
 * Server-side function to fetch global settings directly from Strapi
 */
export async function getGlobalSettings(): Promise<GlobalResponse> {
  return fetchStrapiAPI('global', {
    populate: {
      defaultSeo: {
        populate: 'shareImage',
      },
      logo: true,
      favicon: true,
    },
  });
}

/**
 * Server-side function to fetch menu directly from Strapi
 */
export async function getMenuSettings(): Promise<MenuResponse> {
  return fetchStrapiAPI('menus', { populate: '*', 'sort[0]': 'position:asc' });
}

/**
 * Server-side function to fetch hero directly from Strapi
 */
export async function getHeroSettings(): Promise<HeroResponse> {
  const params = {
    populate: '*',
  };

  return fetchStrapiAPI('hero', params);
}

/**
 * Server-side function to fetch brand section directly from Strapi
 */
export async function getBrandSectionSettings(): Promise<BrandSectionResponse> {
  const params = {
    populate: '*',
  };

  return fetchStrapiAPI('brand-info', params);
}

/**
 * Server-side function to fetch services directly from Strapi
 */
export async function getServicesSettings(): Promise<StrapiResponse<any>> {
  const params = {
    populate: {
      items: {
        populate: ['icon', 'iconActive', 'slogan'],
        sort: ['position:asc'],
      },
    },
  };

  return fetchStrapiAPI('service-list', params);
}

/**
 * Server-side function to fetch workflow directly from Strapi
 */
export async function getWorkflowSettings(): Promise<StrapiResponse<any>> {
  const params = {
    populate: '*',
    'sort[0]': 'position:asc',
  };

  return fetchStrapiAPI('workflow-lists', params);
}

/**
 * Server-side function to fetch partners directly from Strapi
 */
export async function getPartnersSettings(): Promise<PartnersResponse> {
  const params = {
    populate: {
      partner_row: {
        populate: {
          partners: {
            populate: ['image'],
          },
        },
      },
    },
  };

  return fetchStrapiAPI('partner', params);
}

/**
 * Server-side function to fetch footer settings directly from Strapi
 */
export async function getFooterSettings(): Promise<FooterResponse> {
  const params = {
    populate: {
      socialMedia: { populate: ['icon'] },
      offices: true,
      contactInfo: { populate: '*' },
      logo: true,
      signatureIcon: true,
    },
  };

  return fetchStrapiAPI('footer', params);
}

/**
 * Server-side function to fetch featured projects directly from Strapi
 */
export async function getFeaturedProjectsSettings(): Promise<
  StrapiResponse<any>
> {
  const params = {
    populate: {
      projects: {
        populate: {
          projectItem: {
            populate: {
              project: {
                populate: {
                  thumbnail: true,
                },
              },
            },
          },
        },
      },
    },
  };

  const response = await fetchStrapiAPI('home-featured-project', params);
  if (response?.data) {
    response.data.projects.sort(
      (a: any, b: any) =>
        (a?.projectItem?.position || 0) - (b?.projectItem?.position || 0)
    );
  }

  return response;
}

/**
 * Server-side function to fetch contact page settings directly from Strapi
 */
export async function getContactPageSettings(): Promise<StrapiResponse<any>> {
  const params = {
    populate: {
      seo: {
        populate: '*',
      },
      heroImage: true,
      workingHours: true,
      offices: {
        populate: '*',
      },
      contactInfo: {
        populate: '*',
      },
      googleMaps: true,
      contactSections: {
        populate: '*',
        sort: ['position:asc'],
      },
      brandInfo: true,
    },
  };

  return fetchStrapiAPI('contact-page', params);
}

// Static versions (same implementation for now)
export const getStaticGlobalSettings = getGlobalSettings;
export const getStaticMenuSettings = getMenuSettings;
export const getStaticHeroSettings = getHeroSettings;
export const getStaticBrandSectionSettings = getBrandSectionSettings;
export const getStaticServicesSettings = getServicesSettings;
export const getStaticWorkflowSettings = getWorkflowSettings;
export const getStaticPartnersSettings = getPartnersSettings;
export const getStaticFooterSettings = getFooterSettings;
export const getStaticFeaturedProjectsSettings = getFeaturedProjectsSettings;
