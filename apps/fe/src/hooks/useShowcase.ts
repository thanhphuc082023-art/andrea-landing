import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { type ShowcaseSection } from '@/types/project';

export function useShowcase(projectId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    projectId ? `/api/admin/projects/${projectId}/showcase` : null,
    fetcher
  );

  return {
    showcase: data as ShowcaseSection[] | undefined,
    isLoading,
    error,
    mutate,
  };
}
