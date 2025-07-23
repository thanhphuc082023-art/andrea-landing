import type { GetStaticProps } from 'next';
import {
  getGlobalSettings,
  getMenuSettings,
  getHeroSettings,
} from '@/lib/strapi-server';

export interface PagePropsWithGlobal {
  serverGlobal?: any;
  menuItems?: any[];
  heroData?: any;
}

export const getStaticPropsWithGlobal: GetStaticProps<
  PagePropsWithGlobal
> = async () => {
  try {
    const [globalResult, menuResult, heroResult] = await Promise.all([
      getGlobalSettings(),
      getMenuSettings(),
      getHeroSettings(),
    ]);

    return {
      props: {
        serverGlobal: globalResult.global || null,
        menuItems: menuResult?.menu?.items || [],
        heroData: heroResult?.hero || null,
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
      },
      revalidate: 3600,
    };
  }
};
