import StrapiHead from '@/components/meta/StrapiHead';
import ContentSection from '@/contents/about-us/Content';
import Header from '@/contents/about-us/Header';
import InsightsSection from '@/contents/about-us/Insights';
import SloganSection from '@/contents/about-us/Slogan';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getHeroSettings, getWorkflowSettings } from '@/lib/strapi-server';
import { getStrapiMediaUrl } from '@/utils/helper';
import { useRouter } from 'next/router';

function AboutUsPage({
  serverGlobal = null,
  heroData = null,
  workflowData = [],
}: PagePropsWithGlobal) {
  const { query } = useRouter();
  const currentGlobal = serverGlobal;
  const siteName = currentGlobal?.siteName || 'ANDREA';
  const siteDescription =
    currentGlobal?.siteDescription ||
    'Liên hệ Andrea — dịch vụ thiết kế thương hiệu và digital. Liên hệ để thảo luận dự án, hợp tác hoặc gửi hồ sơ ứng tuyển.';

  // Normalize and validate the query param so it matches the expected union type
  const rawRotation = Array.isArray(query?.sloganMode)
    ? query?.sloganMode[0]
    : query?.sloganMode;
  const rotationMode =
    rawRotation === 'random' || rawRotation === 'radial'
      ? rawRotation
      : undefined;

  return (
    <>
      <StrapiHead
        title={`Về chúng tôi - ${siteName}`}
        description={siteDescription}
        ogImage={getStrapiMediaUrl(currentGlobal?.defaultSeo?.shareImage)}
        seo={currentGlobal?.defaultSeo}
        global={currentGlobal}
        overrideTitle
      />

      <Header
        heroData={{
          desktopVideo: { url: '/assets/video/about-us.mp4' },
          mobileVideo: { url: '/assets/video/about-us.mp4' },
        }}
      />

      <ContentSection />
      <InsightsSection />
      <SloganSection workflowData={workflowData} rotationMode={rotationMode} />
    </>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    // const heroResult = await getHeroSettings();
    const workflowResult = await getWorkflowSettings();
    // return { props: { heroData: heroResult.data || null } };
    return { workflowData: workflowResult.data || [] };
  });

export default AboutUsPage;
