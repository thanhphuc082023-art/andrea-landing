const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'https://joyful-basket-ea764d9c28.strapiapp.com/api';

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

export class StrapiAPI {
  private static getAuthHeaders(): HeadersInit {
    const token = process.env.STRAPI_API_TOKEN;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${STRAPI_URL}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData: StrapiError = await response.json();
        throw new Error(`Strapi API Error: ${errorData.error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Strapi API request failed:', error);
      throw error;
    }
  }

  // Get all entries from a collection
  static async getCollection<T>(
    collection: string,
    params?: {
      populate?: string | string[];
      filters?: Record<string, any>;
      sort?: string | string[];
      pagination?: {
        page?: number;
        pageSize?: number;
      };
      publicationState?: 'live' | 'preview';
    }
  ): Promise<StrapiResponse<T[]>> {
    const searchParams = new URLSearchParams();

    if (params?.populate) {
      const populate = Array.isArray(params.populate)
        ? params.populate.join(',')
        : params.populate;
      searchParams.append('populate', populate);
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([operator, operatorValue]) => {
            searchParams.append(
              `filters[${key}][${operator}]`,
              String(operatorValue)
            );
          });
        } else {
          searchParams.append(`filters[${key}]`, String(value));
        }
      });
    }

    if (params?.sort) {
      const sort = Array.isArray(params.sort)
        ? params.sort.join(',')
        : params.sort;
      searchParams.append('sort', sort);
    }

    if (params?.pagination) {
      if (params.pagination.page) {
        searchParams.append(
          'pagination[page]',
          params.pagination.page.toString()
        );
      }
      if (params.pagination.pageSize) {
        searchParams.append(
          'pagination[pageSize]',
          params.pagination.pageSize.toString()
        );
      }
    }

    if (params?.publicationState) {
      searchParams.append('publicationState', params.publicationState);
    }

    const query = searchParams.toString();
    const endpoint = `/${collection}${query ? `?${query}` : ''}`;

    return this.request<StrapiResponse<T[]>>(endpoint);
  }

  // Get single entry by ID
  static async getEntry<T>(params: {
    collection: string;
    id?: string | number;
    populate?: string | string[];
    publicationState?: 'live' | 'preview';
  }): Promise<StrapiResponse<T>> {
    const searchParams = new URLSearchParams();

    if (params.populate) {
      const populate = Array.isArray(params.populate)
        ? params.populate.join(',')
        : params.populate;
      searchParams.append('populate', populate);
    }

    if (params.publicationState) {
      searchParams.append('publicationState', params.publicationState);
    }

    const query = searchParams.toString();

    // Nếu không có id, gọi endpoint collection trực tiếp (cho single-type)
    if (!params.id) {
      return this.request<StrapiResponse<T>>(
        `/${params.collection}${query ? `?${query}` : ''}`
      );
    }

    // Có id thì gọi endpoint với id
    return this.request<StrapiResponse<T>>(
      `/${params.collection}/${params.id}${query ? `?${query}` : ''}`
    );
  }

  // Get single entry by slug
  static async getEntryBySlug<T>(
    collection: string,
    slug: string,
    params?: {
      populate?: string | string[];
      publicationState?: 'live' | 'preview';
    }
  ): Promise<T | null> {
    const response = await this.getCollection<T>(collection, {
      filters: { slug: { $eq: slug } },
      populate: params?.populate,
      publicationState: params?.publicationState,
    });

    return (await response.data[0]) || null;
  }

  // Get media URL helper
  static getMediaUrl(url: string): string {
    if (!url) return '';

    // If URL is already absolute, return as is
    if (url.startsWith('http')) {
      return url;
    }

    // Otherwise, prepend Strapi URL
    return `${STRAPI_URL}${url}`;
  }
}

export default StrapiAPI;
