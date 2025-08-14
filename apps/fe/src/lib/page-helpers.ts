import type { GetStaticProps } from 'next';
import {
  getGlobalSettings,
  getMenuSettings,
  getHeroSettings,
  getBrandSectionSettings,
  getServicesSettings,
  getWorkflowSettings,
  getPartnersSettings,
  getFooterSettings,
  getFeaturedProjectsSettings,
} from '@/lib/strapi-server';

export interface PagePropsWithGlobal {
  serverGlobal?: any;
  menuItems?: any[];
  heroData?: any;
  brandSectionData?: any;
  servicesData?: any[];
  workflowData?: any[];
  partnersData?: any;
  footerData?: any;
  featuredProjectsData?: any;
}

export const getStaticPropsWithGlobal: GetStaticProps<
  PagePropsWithGlobal
> = async () => {
  try {
    const [
      globalResult,
      menuResult,
      heroResult,
      brandSectionResult,
      servicesResult,
      workflowResult,
      partnersResult,
      footerResult,
      featuredProjectsResult,
    ] = await Promise.all([
      getGlobalSettings(),
      getMenuSettings(),
      getHeroSettings(),
      getBrandSectionSettings(),
      getServicesSettings(),
      getWorkflowSettings(),
      getPartnersSettings(),
      getFooterSettings(),
      getFeaturedProjectsSettings(),
    ]);

    return {
      props: {
        serverGlobal: globalResult.data || null,
        menuItems: menuResult.data || [],
        heroData: heroResult.data || null,
        brandSectionData: brandSectionResult.data || null,
        servicesData: servicesResult.data || [],
        workflowData: workflowResult.data || [],
        partnersData: partnersResult.data || null,
        footerData: footerResult.data || null,
        featuredProjectsData: featuredProjectsResult.data || null,
      },
      revalidate: 3600, // ISR 1 hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        serverGlobal: null,
        menuItems: [],
        heroData: null,
        brandSectionData: null,
        servicesData: [],
        workflowData: [],
        partnersData: null,
        footerData: null,
        featuredProjectsData: null,
      },
      revalidate: 3600,
    };
  }
};

export const getStaticPropsLayout: GetStaticProps<
  PagePropsWithGlobal
> = async () => {
  try {
    const [globalResult, menuResult, footerResult] = await Promise.all([
      getGlobalSettings(),
      getMenuSettings(),
      getFooterSettings(),
    ]);

    return {
      props: {
        serverGlobal: globalResult.data || null,
        menuItems: menuResult.data || [],
        footerData: footerResult.data || null,
      },
      revalidate: 3600, // ISR 1 hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        serverGlobal: null,
        menuItems: [],
        footerData: null,
      },
      revalidate: 3600,
    };
  }
};

// Helper function to combine global data with page-specific data
export const getStaticPropsWithGlobalAndData = async <
  T extends Record<string, any>,
>(
  getPageData: () => Promise<T>
): Promise<{
  props: PagePropsWithGlobal & T;
  revalidate?: number;
}> => {
  try {
    const [globalPropsResult, pageData] = (await Promise.all([
      getStaticPropsLayout({} as any),
      getPageData(),
    ])) as any;

    return {
      props: {
        ...globalPropsResult.props,
        ...pageData,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticPropsWithGlobalAndData:', error);
    const globalPropsResult = (await getStaticPropsLayout({} as any)) as any;

    return {
      props: {
        ...globalPropsResult.props,
      } as PagePropsWithGlobal & T,
      revalidate: 3600,
    };
  }
};
