import Image from 'next/image';
import CriteriaSection from '@/components/services/CriteriaSection';
import FinalSection from '@/components/services/FinalSection';
import ProcessSection from '@/components/services/ProcessSection';
import QuoteSection from '@/components/services/QuoteSection';
import SupermarketContent from '@/components/services/SupermarketContent';
import WhyProfessionalSection from '@/components/services/WhyProfessionalSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import StrapiHead from '@/components/meta/StrapiHead';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle:
      servicesData?.supermarket?.heading ||
      defaultSeo?.metaTitle ||
      'Thiết kế bao bì',
    metaDescription:
      servicesData?.supermarket?.subheading ||
      defaultSeo?.metaDescription ||
      'Dịch vụ thiết kế bao bì chuyên nghiệp',
    shareImage: servicesData?.supermarket?.image || defaultSeo?.shareImage,
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/baobi/baobi_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <div className="w-full">
        <div className="relative aspect-[430/342] w-full overflow-hidden md:aspect-[1440/401]">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={'/assets/images/services/baobi/baobi_thumb_mobile.png'}
            />
            <source
              media="(min-width: 768px)"
              srcSet={'/assets/images/services/baobi/baobi_thumb.png'}
            />
            <Image
              src={'/assets/images/services/baobi/baobi_thumb.png'}
              alt={'Services'}
              fill
              sizes="(min-width: 768px) 1440px, 430px"
              className="object-cover"
            />
          </picture>
        </div>
      </div>

      <SupermarketContent data={servicesData?.supermarket} />
      <WhyProfessionalSection data={servicesData?.whyProfessional} />
      <CriteriaSection data={servicesData?.criteria} />
      <QuoteSection data={servicesData?.quote} />
      <ProcessSection data={servicesData?.process} />
      <FinalSection data={servicesData?.final} />
    </div>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    // Mock page-specific data for child components (replace with CMS fetch later)
    const servicesData = {
      supermarket: {
        image: '/assets/images/services/baobi/baobi1.png',
        heading:
          'Bao bì là một trong những điểm chạm đầu tiên với khách hàng để tạo ấn tượng và truyền tải bản sắc',
      },
      whyProfessional: {
        items: [
          {
            id: '01',
            title: 'Tăng khả năng nhận diện thương hiệu',
            body: 'Bao bì truyền tải màu sắc, cảm xúc và thông điệp rõ ràng về thương hiệu.',
          },
          {
            id: '02',
            title: 'Tạo sự khác biệt trên thị trường',
            body: 'Với thiết kế bao bì độc đáo giúp sản phẩm nổi bật và khác biệt.',
          },
        ],
      },
      criteria: {
        list: [
          'Dựa trên công nghiệp',
          'Truyền thông thương hiệu tốt',
          'Thiết kế riêng, mạnh bạch',
          'Tâm lý người tiêu dùng',
          'Hiệu suất phân, hiệu hoá tối',
        ],
      },
      quote: {
        text: 'Bao bì không chỉ là lớp vỏ mà là chiến lược gắn liền với thương hiệu, sản phẩm và vận hành doanh nghiệp.',
      },
      process: {
        steps: [
          {
            id: 1,
            title: 'Khai vấn & tiếp nhận thông tin',
            bullets: ['Khám phá nhu cầu', 'Hiểu sản phẩm', 'Lập brief'],
          },
          {
            id: 2,
            title: 'Nghiên cứu & xây dựng concept',
            bullets: ['Phân tích thị trường', 'Lên moodboard'],
          },
          {
            id: 3,
            title: 'Thiết kế & sáng tạo',
            bullets: ['Thiết kế layout', 'Chọn màu sắc'],
          },
        ],
      },
      final: {
        highlights: [
          'Thiết kế đúng chiến lược thương hiệu',
          'Lồng ghép yếu tố văn hóa Việt',
          'Hướng dẫn quy trình sản xuất và tối ưu chi phí',
        ],
      },
    };

    return { props: { servicesData } };
  });
