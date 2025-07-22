import { useGlobal } from '@/providers/GlobalProvider';
import type { StrapiNavigationItem } from '@/types/strapi';

interface UseNavigationResult {
  headerNavigation: StrapiNavigationItem[];
  footerNavigation: StrapiNavigationItem[];
  isLoading: boolean;
}

export function useNavigation(): UseNavigationResult {
  const { global, isLoading } = useGlobal();

  const headerNavigation = global?.attributes?.navigation?.header || [];
  const footerNavigation = global?.attributes?.navigation?.footer || [];

  return {
    headerNavigation,
    footerNavigation,
    isLoading,
  };
}

// Helper function to get social links
export function useSocialLinks() {
  const { global, isLoading } = useGlobal();

  return {
    socialLinks: global?.attributes?.socialLinks || {},
    isLoading,
  };
}

export default useNavigation;
