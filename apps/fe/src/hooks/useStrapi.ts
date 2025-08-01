import React from 'react';
import useSWR from 'swr';
import type {
  ArticleEntity,
  ProjectEntity,
  GlobalEntity,
  CategoryEntity,
  TagEntity,
} from '@/types/strapi';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  });

// Articles hooks
export function useArticles(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize)
    searchParams.set('pageSize', params.pageSize.toString());
  if (params?.category) searchParams.set('category', params.category);
  if (params?.tag) searchParams.set('tag', params.tag);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  const url = `/api/strapi/articles${query ? `?${query}` : ''}`;

  // const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const data = { data: { articles: [] }, meta: {} as any };

  const isLoading = false; // Replace with actual loading state
  const error = null; // Replace with actual error state
  const mutate = () => {}; // Replace with actual mutate function

  return {
    articles: (data?.data?.articles || []) as ArticleEntity[],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}

export function useArticle(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/strapi/articles/${slug}` : null,
    fetcher
  );

  return {
    article: data?.data as ArticleEntity | undefined,
    isLoading,
    error,
    mutate,
  };
}

// Projects hooks
export function useProjects(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  status?: string;
  sort?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize)
    searchParams.set('pageSize', params.pageSize.toString());
  if (params?.category) searchParams.set('category', params.category);
  if (params?.featured) searchParams.set('featured', 'true');
  if (params?.status) searchParams.set('status', params.status);
  if (params?.sort) searchParams.set('sort', params.sort);

  const query = searchParams.toString();
  const url = `/api/strapi/projects${query ? `?${query}` : ''}`;

  // const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const data = { data: { projects: [] }, meta: {} };
  const isLoading = false; // Replace with actual loading state
  const error = null; // Replace with actual error state
  const mutate = () => {}; // Replace with actual mutate function

  return {
    projects: (data?.data?.projects || []) as ProjectEntity[],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}

export function useProject(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/strapi/projects/${slug}` : null,
    fetcher
  );

  return {
    project: data?.data as ProjectEntity | undefined,
    isLoading,
    error,
    mutate,
  };
}

// Global settings hook
export function useGlobalSettings() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/strapi/global',
    fetcher
  );

  return {
    global: data?.data as GlobalEntity | undefined,
    isLoading,
    error,
    mutate,
  };
}

// Categories hook
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/strapi/categories',
    fetcher
  );

  return {
    categories: (data?.data || []) as CategoryEntity[],
    isLoading,
    error,
    mutate,
  };
}

// Tags hook
export function useTags() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/strapi/tags',
    fetcher
  );

  return {
    tags: (data?.data || []) as TagEntity[],
    isLoading,
    error,
    mutate,
  };
}

// Featured content hooks
export function useFeaturedArticles(limit = 3) {
  return useArticles({
    featured: true,
    pageSize: limit,
    sort: 'publishedAt:desc',
  });
}

export function useFeaturedProjects(limit = 6) {
  return useProjects({
    featured: true,
    pageSize: limit,
    sort: 'publishedAt:desc',
  });
}

// Search hook with debouncing
export function useSearchArticles(query: string, debounceMs = 500) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  return useArticles({
    search: debouncedQuery || undefined,
    pageSize: 20,
  });
}
