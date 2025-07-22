import StrapiHead from '@/components/meta/StrapiHead';
import { useGlobal } from '@/providers/GlobalProvider';

import { getBaseUrl } from '@/helpers/url';

import IndexContents from '@/contents/index';

function Index() {
  const { global } = useGlobal();

  // Get SEO data from Strapi global settings
  const defaultSeo = global?.attributes?.defaultSeo;
  const siteName = global?.attributes?.siteName || 'ANDREA';
  const siteDescription =
    global?.attributes?.siteDescription ||
    'ANDREA is a creative agency specializing in brand design, providing high-quality solutions with a professional team.';

  return (
    <>
      <StrapiHead
        title={siteName}
        description={siteDescription}
        ogImage={`${getBaseUrl()}/assets/images/og-image.png`}
        seo={defaultSeo}
        overrideTitle
      />
      <IndexContents />
    </>
  );
}

export default Index;
