import StrapiHead from '@/components/meta/StrapiHead';
import ContentSection from '@/contents/about-us/Content';
import Header from '@/contents/about-us/Header';
import VisionsSection from '@/contents/about-us/Visions';
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
  // transformHeroVideoForHeader,
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
  // const heroData = transformHeroVideoForHeader(aboutUsData?.heroVideo);
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

      {/* <Header heroData={heroData} /> */}

      <SloganSection
        slogan={aboutUsData?.workflow?.slogan || ''}
        workflowData={workflowData || []}
        rotationMode={rotationMode}
        disableDrag={true}
      />

      <ParallaxSection />

      <CoreValues />

      <div className="content-wrapper">
        <ScrollReveal
          children={[
            'Với sự tận tâm trong quá trình tư vấn và trách ',
            'nhiệm trong từng sản phẩm thiết kế, Andrea',
            'luôn hướng tới tạo nên những hình ảnh thương',
            'hiệu không chỉ đẹp mắt mà còn phản ánh đúng',
            'cá tính, phù hợp định hướng kinh doanh và',
            'chạm đến cảm xúc khách hàng. ',
            '<br>',
            'Thương hiệu không chỉ là hình ảnh nhận diện,',
            'mà còn mang trong mình giá trị cảm xúc, ý',
            'nghĩa nhân văn và khát vọng vươn xa. Andrea ',
            'đồng hành cùng doanh nghiệp để xây dựng hệ',
            'sinh thái bền vững, góp phần tạo ra nhiều cơ hội',
            'việc làm và lan tỏa những giá trị tốt đẹp cho',
            'cộng đồng.',
          ]}
          className="font-playfair my-[100px] text-left text-[50px] leading-relaxed"
        />
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
