import type { GlobalEntity } from '@/types/strapi';

interface GlobalResponse {
  global: GlobalEntity | undefined;
  error?: any;
}

/**
 * Server-side function to fetch global settings directly from Strapi
 * Used for static generation and ISR
 */
export async function getGlobalSettings(): Promise<GlobalResponse> {
  try {
    // Use Strapi URL from environment variables
    const strapiUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://joyful-basket-ea764d9c28.strapiapp.com/api';
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
