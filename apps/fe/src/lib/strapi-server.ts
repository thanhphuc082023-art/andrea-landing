import type { GlobalEntity } from '@/types/strapi';

interface GlobalResponse {
  global: GlobalEntity | undefined;
  error?: any;
}

interface MenuResponse {
  menu: any | undefined;
  error?: any;
}

interface HeroResponse {
  hero: any | undefined;
  error?: any;
}

/**
 * Server-side function to fetch global settings directly from Strapi
 * Used for static generation and ISR
 */
export async function getGlobalSettings(): Promise<GlobalResponse> {
  try {
    // Use Strapi URL from environment variables
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
    const apiUrl = `${strapiUrl}/global?populate=*`;

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
      throw new Error(`Failed to fetch global settings: ${response.status}`);
    }

    const data = await response.json();
    return { global: data.data };
  } catch (error) {
    console.error('Error fetching global settings from Strapi:', error);
    // Return undefined when failed, let client-side handle fallback
    return { global: undefined, error };
  }
}

/**
 * Alternative function for static generation without revalidation
 */
export async function getStaticGlobalSettings(): Promise<GlobalResponse> {
  // For now, use the same implementation
  return getGlobalSettings();
}

/**
 * Server-side function to fetch menu directly from Strapi
 * Used for static generation and ISR
 */
export async function getMenuSettings(): Promise<MenuResponse> {
  try {
    // Use Strapi URL from environment variables
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
    const apiUrl = `${strapiUrl}/header-menu?populate=*`;

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
      throw new Error(`Failed to fetch menu settings: ${response.status}`);
    }

    const data = await response.json();
    return { menu: data.data };
  } catch (error) {
    console.error('Error fetching menu settings from Strapi:', error);
    // Return undefined when failed, let client-side handle fallback
    return { menu: undefined, error };
  }
}

/**
 * Alternative function for static menu generation without revalidation
 */
export async function getStaticMenuSettings(): Promise<MenuResponse> {
  // For now, use the same implementation
  return getMenuSettings();
}

/**
 * Server-side function to fetch hero directly from Strapi
 * Used for static generation and ISR
 */
export async function getHeroSettings(): Promise<HeroResponse> {
  try {
    // Use Strapi URL from environment variables
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
    const apiUrl = `${strapiUrl}/hero?populate=*`;

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
      throw new Error(`Failed to fetch hero settings: ${response.status}`);
    }

    const data = await response.json();
    return { hero: data.data };
  } catch (error) {
    console.error('Error fetching hero settings from Strapi:', error);
    // Return undefined when failed, let client-side handle fallback
    return { hero: undefined, error };
  }
}

/**
 * Alternative function for static hero generation without revalidation
 */
export async function getStaticHeroSettings(): Promise<HeroResponse> {
  // For now, use the same implementation
  return getHeroSettings();
}
