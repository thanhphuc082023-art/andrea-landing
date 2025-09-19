import StrapiHead from '@/components/meta/StrapiHead';
// import ContentSection from '@/contents/about-us/Content';
// import Header from '@/contents/about-us/Header';
// import VisionsSection from '@/contents/about-us/Visions';
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
import { useState, useEffect, useRef } from 'react';
import ContactForm from '@/contents/index/ContactForm';

// Helper function to split text into lines with a maximum number of characters
const splitIntoCharacters = (text: string, charsPerLine: number): string[] => {
  const paragraphs = text.split('\n \n'); // Split by double newline for paragraphs
  const result: string[] = [];

  paragraphs.forEach((paragraph, pIndex) => {
    let currentLine = '';
    const words = paragraph.split(' '); // Split by words to avoid breaking words in half

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        if (currentLine !== '') {
          result.push(currentLine.trim());
        }
        currentLine = word;
      }
    }
    if (currentLine !== '') {
      result.push(currentLine.trim());
    }

    if (pIndex < paragraphs.length - 1) {
      result.push('<br>'); // Add <br> between paragraphs
    }
  });

  return result;
};

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

  const fullContent =
    'Với sự tận tâm trong quá trình tư vấn và trách nhiệm trong từng sản phẩm thiết kế, Andrea luôn hướng tới tạo nên những hình ảnh thương hiệu không chỉ đẹp mắt mà còn phản ánh đúng cá tính, phù hợp định hướng kinh doanh và chạm đến cảm xúc khách hàng. \n \n Thương hiệu không chỉ là hình ảnh nhận diện, mà còn mang trong mình giá trị cảm xúc, ý nghĩa nhân văn và khát vọng vươn xa. Andrea đồng hành cùng doanh nghiệp để xây dựng hệ sinh thái bền vững, góp phần tạo ra nhiều cơ hội việc làm và lan tỏa những giá trị tốt đẹp cho cộng đồng.';

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

  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const [charsPerLine, setCharsPerLine] = useState(50);

  useEffect(() => {
    const handleResize = () => {
      try {
        const container = textContainerRef.current;
        const containerWidth = container?.clientWidth || window.innerWidth;

        // set fontSize theo breakpoint Tailwind
        let fontSize = 25; // base = text-[25px]
        if (window.innerWidth >= 1280) {
          fontSize = 50; // xl:text-[50px]
        } else if (window.innerWidth >= 640) {
          fontSize = 30; // sm:text-[30px]
        }

        const fontFamily = 'Playfair Display, serif'; // đúng với class font-playfair
        const fontWeight = '400';
        const fontStyle = 'normal';

        // tính width trung bình của ký tự
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let avgCharWidth = 0.5 * fontSize; // fallback
        if (ctx) {
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
          const sample =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789';
          const metrics = ctx.measureText(sample);
          avgCharWidth = metrics.width / sample.length;
        }

        const calculated = Math.max(
          10,
          Math.floor(containerWidth / avgCharWidth)
        );
        setCharsPerLine(calculated);
      } catch (e) {
        const fallbackChars = Math.max(10, Math.floor(window.innerWidth / 28));
        setCharsPerLine(fallbackChars);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  console.log('charsPerLine outer', charsPerLine);
  const contentLines = splitIntoCharacters(fullContent, charsPerLine);

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
        <div
          ref={textContainerRef}
          className="about-text font-playfair my-[100px] text-left text-[50px] leading-relaxed"
        >
          <ScrollReveal children={contentLines} />
        </div>
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
