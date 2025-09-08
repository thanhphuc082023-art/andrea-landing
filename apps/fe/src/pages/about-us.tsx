import StrapiHead from '@/components/meta/StrapiHead';
import ContentSection from '@/contents/about-us/Content';
import Header from '@/contents/about-us/Header';
import VisionsSection from '@/contents/about-us/Visions';
import SloganSection from '@/contents/about-us/Slogan';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getAboutUsPageSettings } from '@/lib/strapi-server';
import {
  transformHeroVideoForHeader,
  transformWorkflowDataForSlogan,
  extractAboutUsSEO,
} from '@/utils/about-us-transform';
import { AboutUsPageData } from '@/types/about-us';
import { useRouter } from 'next/router';

interface AboutUsPageProps extends PagePropsWithGlobal {
  aboutUsData?: AboutUsPageData | null;
}

function AboutUsPage({
  serverGlobal = null,
  aboutUsData = null,
}: AboutUsPageProps) {
  const { query } = useRouter();
  const currentGlobal = serverGlobal;
  const siteName = currentGlobal?.siteName || 'ANDREA';

  // Extract SEO data from About Us data or use fallbacks
  const seoData = extractAboutUsSEO(aboutUsData, siteName);

  // Normalize and validate the query param so it matches the expected union type
  const rawRotation = Array.isArray(query?.sloganMode)
    ? query?.sloganMode[0]
    : query?.sloganMode;
  const rotationMode =
    rawRotation === 'random' || rawRotation === 'radial'
      ? rawRotation
      : undefined;

  // Transform data for components
  const heroData = transformHeroVideoForHeader(aboutUsData?.heroVideo);
  const workflowData = transformWorkflowDataForSlogan(aboutUsData?.workflow);

  return (
    <>
      <StrapiHead
        title={seoData.title}
        description={seoData.description}
        ogImage={
          seoData.image?.data?.attributes?.url ||
          '/assets/images/about-us/content.png'
        }
        global={currentGlobal}
        overrideTitle
      />

      <Header heroData={heroData} />

      <ContentSection content={aboutUsData?.aboutUsContent} />

      <VisionsSection visions={aboutUsData?.visions} />

      <SloganSection
        slogan={aboutUsData?.workflow?.slogan || ''}
        workflowData={workflowData || []}
        rotationMode={rotationMode}
      />
    </>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    const aboutUsResult = await getAboutUsPageSettings();

    return { aboutUsData: aboutUsResult?.data || {} };
  });

export default AboutUsPage;
