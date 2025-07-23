import StrapiHead from '@/components/meta/StrapiHead';
import { getBaseUrl } from '@/helpers/url';
import IndexContents from '@/contents/index';
import {
  getStaticPropsWithGlobal,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getStrapiMediaUrl } from '@/utils/helper';

function HomePage({
  serverGlobal = null,
  heroData = null,
}: PagePropsWithGlobal) {
  const currentGlobal = serverGlobal;
  const siteName = currentGlobal?.siteName || 'ANDREA';
  const siteDescription =
    currentGlobal?.siteDescription ||
    'ANDREA is a creative agency specializing in brand design, providing high-quality solutions with a professional team.';

  return (
    <>
      <StrapiHead
        title={siteName}
        description={siteDescription}
        ogImage={getStrapiMediaUrl(currentGlobal?.defaultSeo?.shareImage)}
        seo={currentGlobal?.defaultSeo}
        global={currentGlobal}
        overrideTitle
      />
      <IndexContents heroData={heroData} />
    </>
  );
}

export const getStaticProps = getStaticPropsWithGlobal;

export default HomePage;
