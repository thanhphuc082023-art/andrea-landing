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
    ] = await Promise.all([
      getGlobalSettings(),
      getMenuSettings(),
      getHeroSettings(),
      getBrandSectionSettings(),
      getServicesSettings(),
      getWorkflowSettings(),
      getPartnersSettings(),
      getFooterSettings(),
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
      },
      revalidate: 3600,
    };
  }
};
