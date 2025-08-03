import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '@/constants/app';
import { NextApiRequest, NextApiResponse } from 'next';

// Types
interface Book {
  id: number;
  title: string;
  slug: string;
  pdfFile?: any;
  thumbnail?: any;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface SearchResponse {
  books: Book[];
  pagination: PaginationInfo;
}

// Helper function to validate and parse query parameters
export const parseQueryParams = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string, 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit as string, 10) || DEFAULT_LIMIT)
  );
  const searchTerm = typeof query.q === 'string' ? query.q.trim() : '';

  return { page, limit, searchTerm };
};

// Helper function to build Strapi API URL
export const buildStrapiUrl = (
  page: number,
  limit: number,
  searchTerm?: string
): string => {
  const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books`;
  const params = new URLSearchParams({
    populate: '*',
    sort: 'createdAt:desc',
    'pagination[page]': page.toString(),
    'pagination[pageSize]': limit.toString(),
  });

  // Add search filters if search term is provided
  if (searchTerm) {
    const encodedTerm = encodeURIComponent(searchTerm);
    params.append('filters[$or][0][title][$containsi]', encodedTerm);
    params.append('filters[$or][1][slug][$containsi]', encodedTerm);
  }

  return `${baseUrl}?${params.toString()}`;
};

// Helper function to transform Strapi data to our Book interface
export const transformBooksData = (data: any[]): Book[] => {
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    pdfFile: item.pdfFile,
    thumbnail: item.thumbnail,
    createdAt: item.createdAt,
  }));
};

// Helper function to create fallback pagination
export const createFallbackPagination = (
  page: number,
  pageSize: number,
  totalBooks: number
): PaginationInfo => {
  return {
    page,
    pageSize,
    pageCount: Math.ceil(totalBooks / pageSize),
    total: totalBooks,
  };
};

// Helper function to handle API errors
export const handleApiError = (error: any, res: NextApiResponse) => {
  console.error('Search API error:', error);

  let errorMessage = 'Không thể tìm kiếm E-Profile. Vui lòng thử lại sau.';
  let statusCode = 500;

  if (error.message?.includes('ECONNREFUSED')) {
    errorMessage = 'Không thể kết nối tới server. Vui lòng thử lại sau.';
  } else if (error.message?.includes('timeout')) {
    errorMessage = 'Yêu cầu bị timeout. Vui lòng thử lại.';
  } else if (error.message?.includes('404')) {
    errorMessage = 'Không tìm thấy dữ liệu.';
    statusCode = 404;
  }

  return res.status(statusCode).json({
    error: errorMessage,
    books: [],
    pagination: createFallbackPagination(1, DEFAULT_LIMIT, 0),
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | SearchResponse
    | { error: string; books?: Book[]; pagination?: PaginationInfo }
  >
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed. Only GET requests are supported.',
    });
  }

  try {
    // Parse and validate query parameters
    const { page, limit, searchTerm } = parseQueryParams(req.query);

    // Build Strapi API URL
    const apiUrl = buildStrapiUrl(page, limit, searchTerm);

    // Fetch data from Strapi
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform and validate data
    const books = transformBooksData(data.data || []);
    const pagination =
      data.meta?.pagination ||
      createFallbackPagination(page, limit, books.length);

    return res.status(200).json({
      books,
      pagination,
    });
  } catch (error) {
    return handleApiError(error, res);
  }
}
