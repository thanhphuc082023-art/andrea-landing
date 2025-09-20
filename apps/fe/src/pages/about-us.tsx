import StrapiHead from '@/components/meta/StrapiHead';
// import ContentSection from '@/contents/about-us/Content';
import SloganSection from '@/contents/about-us/Slogan';
import ParallaxSection from '@/contents/about-us/ParallaxSection';
import CoreValues from '@/components/CoreValues';
import ScrollReveal from '@/components/ScrollReveal';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getAboutUsPageSettings } from '@/lib/strapi-server';
import {
  transformWorkflowDataForSlogan,
  extractAboutUsSEO,
} from '@/utils/about-us-transform';
import { AboutUsPageData } from '@/types/about-us';
import { useRouter } from 'next/router';
import ContactForm from '@/contents/index/ContactForm';

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
  const workflowData = transformWorkflowDataForSlogan(aboutUsData?.workflow);
  console.log('aboutUsData', aboutUsData);
  console.log('workflowData', workflowData);
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

      <SloganSection
        slogan={aboutUsData?.workflow?.slogan || ''}
        workflowData={workflowData || []}
        rotationMode={rotationMode}
        disableDrag={true}
      />

      <ParallaxSection data={aboutUsData?.visions} />

      <CoreValues data={aboutUsData?.coreValue} />

      <div className="content-wrapper">
        <ScrollReveal fullContent={aboutUsData?.aboutUsContent?.introduction} />
      </div>

      <ContactForm />
    </>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    const aboutUsResult = await getAboutUsPageSettings();

    return { aboutUsData: aboutUsResult?.data || {} };
  });

export default AboutUsPage;
