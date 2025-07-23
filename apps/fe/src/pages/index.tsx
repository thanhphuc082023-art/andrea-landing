import type { GetStaticProps } from 'next';
import StrapiHead from '@/components/meta/StrapiHead';
import { getGlobalSettings } from '@/lib/strapi-server';
import { getBaseUrl } from '@/helpers/url';
import IndexContents from '@/contents/index';
import type { StrapiGlobal } from '@/types/strapi';

interface HomePageProps {
  serverGlobal?: StrapiGlobal;
}

function HomePage({ serverGlobal = null }: HomePageProps) {
  const currentGlobal = serverGlobal;

  // Get SEO data from global settings
  const defaultSeo = currentGlobal?.defaultSeo;
  const siteName = currentGlobal?.siteName || 'ANDREA';
  const siteDescription =
    currentGlobal?.siteDescription ||
    'ANDREA is a creative agency specializing in brand design, providing high-quality solutions with a professional team.';

  return (
    <>
      <StrapiHead
        title={siteName}
        description={siteDescription}
        ogImage={`${getBaseUrl()}/assets/images/og-image.png`}
        seo={defaultSeo}
        global={currentGlobal}
        overrideTitle
      />
      <IndexContents serverGlobal={serverGlobal} />
    </>
  );
}

// Static generation with ISR (revalidate every hour)
export const getStaticProps: GetStaticProps = async () => {
  try {
    const { global, error } = await getGlobalSettings();

    if (error) {
      console.error('Error fetching global settings:', error);
    }

    return {
      props: {
        serverGlobal: global || null,
      },
      // ISR: Revalidate every 3600 seconds (1 hour)
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    return {
      props: {
        serverGlobal: null,
      },
      // Still enable ISR even on error
      revalidate: 3600,
    };
  }
};

export default HomePage;
