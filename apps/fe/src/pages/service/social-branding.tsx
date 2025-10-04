import SupermarketContent from '@/components/services/SupermarketContent';
import StrategyServicesSection from '@/components/services/StrategyServicesSection';
import QuoteSection from '@/components/services/QuoteSection';
import ProcessSection from '@/components/services/ProcessSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import StrapiHead from '@/components/meta/StrapiHead';
import ServiceHero from '@/components/services/ServiceHero';
import ContactForm from '@/contents/index/ContactForm';
import SubmitButton from '@/components/SubmitButton';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import WhyProfessionalSection from '@/components/services/WhyProfessionalSection';
import ImageTextSection from '@/components/services/ImageTextSection';
import FinalSection from '@/components/services/FinalSection';
import Divider from '@/components/services/Divider';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const router = useRouter();
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Chiến lược thương hiệu',
    metaDescription:
      'Tư vấn chiến lược, xây dựng bộ máy vận hành và văn hóa doanh nghiệp',
    shareImage: servicesData?.supermarket?.image || defaultSeo?.shareImage,
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/branding/branding_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/branding/branding_thumb.png'}
        mobileSrc={'/assets/images/services/branding/branding_thumb_mobile.png'}
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />

      <StrategyServicesSection data={servicesData.strategyServices} />
      <div className="content-wrapper mt-[56px] max-md:mt-[29px]">
        <Divider />
      </div>
      <WhyProfessionalSection data={servicesData?.whyProfessional} />

      <ImageTextSection
        title={servicesData?.imageText?.title}
        image={servicesData?.imageText?.image}
        heading={servicesData?.imageText?.heading}
        subheadingHtml={servicesData?.imageText?.subheadingHtml}
      />

      <QuoteSection data={servicesData?.quote} />
      <ProcessSection data={servicesData?.process} />

      <FinalSection data={servicesData?.final} />
      <div className={clsx('my-9 text-center')}>
        <SubmitButton
          onClick={() => router.back()}
          textColor="text-brand-orange"
          borderColor="border-brand-orange"
          beforeBgColor="before:bg-brand-orange"
          hoverBgColor="hover:before:bg-brand-orange"
          hoverTextColor="hover:text-white"
          focusRingColor="focus:ring-brand-orange"
          focusRingOffsetColor="focus:ring-offset-brand-orange-dark"
        >
          Trở về
        </SubmitButton>
      </div>
      <ContactForm />
    </div>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    // Mock page-specific data for child components (replace with CMS fetch later)
    const servicesData = {
      brand: {
        title: 'Thiết kế Social Branding',
        description: 'Xây dựng thương hiệu nhất quán trên mạng xã hội',
      },
      strategyServices: [
        {
          description: [
            {
              type: 'html',
              content:
                '<div class="mb-4"><p class="text-[16px] text-[#3F3F3F] mb-1">Thương hiệu không chỉ hiện diện trên website hay văn phòng đại diện, mà còn cần hiện diện mạnh mẽ, và đúng chất, trên các nền tảng mạng xã hội. Dịch vụ thiết kế Social Branding của Andrea giúp doanh nghiệp định hình rõ ràng tính cách thương hiệu, xây dựng hệ thống nhận diện đồng bộ và truyền thông hiệu quả trên môi trường digital.</p></div>',
            },
            {
              type: 'image',
              src: '/assets/images/services/branding/branding1.png',
              alt: 'Tư vấn chiến lược định vị thương hiệu',
            },
            {
              type: 'html',
              content:
                '<div class="mb-4 mt-8"><p class="text-[25px] font-playfair text-brand-orange mb-1 leading-[32px]">Social Branding là gì?</p><p class="text-[16px] text-[#3F3F3F] mb-1">Social Branding là chiến lược xây dựng và thể hiện hình ảnh thương hiệu trên mạng xã hội một cách nhất quán, có tính cách và tạo kết nối cảm xúc. Đây là bước nền tảng quan trọng giúp doanh nghiệp:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Tạo ấn tượng chuyên nghiệp trên mọi nền tảng (Facebook, Instagram, LinkedIn, TikTok…)</li><li>Định hình tính cách, tone giọng và phong cách hình ảnh đặc trưng</li><li>Truyền tải đúng thông điệp đến đúng khách hàng mục tiêu</li></ul></div>',
            },
          ],
        },
      ],

      whyProfessional: {
        title: `Dịch vụ thiết kế Social Branding của Andrea bao gồm những gì?`,
        items: [
          {
            id: '01',
            title: 'Social Identity Design',
            image: '/assets/images/services/branding/branding2.png',
            body: '<div class=""><p class="text-[16px] text-[#3F3F3F] mb-1">Thiết kế hệ thống nhận diện thương hiệu trên nền tảng social media, bao gồm:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Ảnh đại diện (avatar), ảnh bìa (cover)</li><li>Template bài viết (post & story)</li><li>Bộ màu sắc – typography – icon thống nhất</li><li>Hướng dẫn sử dụng hình ảnh và bố cục trình bày</li></ul></div>',
          },
          {
            id: '02',
            title: 'Social Branding Guidelines',
            image: '/assets/images/services/branding/branding3.png',
            body: '<div class=""><p class="text-[16px] text-[#3F3F3F] mb-1">Xây dựng bộ quy chuẩn thương hiệu cho môi trường mạng xã hội:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Định nghĩa tính cách thương hiệu trên mạng xã hội</li><li>Tone giọng & cách phản hồi bình luận</li><li>Định hướng nội dung phù hợp với hành vi khách hàng số</li><li>Ví dụ bài viết mẫu & template truyền thông</li></ul></div>',
          },
        ],
      },
      imageText: {
        title: 'Vì sao doanh nghiệp cần Social Branding Guideline?',
        image: '/assets/images/services/branding/branding4.png',
        heading: '',
        subheadingHtml:
          '<div class="text-[16px]">Việt Nam có hơn 76 triệu người dùng mạng xã hội – nếu không nổi bật, bạn sẽ bị lãng quên.</div><div class="h-[1px] w-full bg-black/20 my-4"></div><div class="text-[16px]">Các bài đăng thiếu định hướng khiến thương hiệu mỗi bài một kiểu, loãng thông điệp</div><div class="h-[1px] w-full bg-black/20 my-4"></div><div class="text-[16px]">Social Branding Guideline giúp tiết kiệm thời gian, truyền thông chuyên nghiệp và dễ dàng vận hành đội ngũ nội bộ.</div>',
      },
      quote: {
        text: 'Social Branding không chỉ là truyền thông, mà là chiến lược định hình thương hiệu và kết nối cảm xúc.',
      },
      process: {
        title: 'Quy trình thiết kế Social Branding tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Tiếp nhận & tư vấn',
            bullets: [
              'Tư vấn định vị, tính cách và mục tiêu thương hiệu',
              'Đề xuất gói dịch vụ phù hợp (branding mới, mở rộng hoặc đồng bộ hóa hình ảnh)',
            ],
          },
          {
            id: 2,
            title: 'Đánh giá thông tin hiện có',
            bullets: [
              'Rà soát hệ thống nhận diện thương hiệu',
              'Phân tích hành vi người dùng trên các nền tảng mạng xã hội',
            ],
          },
          {
            id: 3,
            title: 'Xây dựng định hướng Social Branding',
            bullets: [
              'Lên moodboard hình ảnh',
              'Định hình tone giọng – key message',
              'Phân bổ màu sắc, hình ảnh, font chữ phù hợp nền tảng',
            ],
          },
          {
            id: 4,
            title: 'Thiết kế guideline & template',
            bullets: [
              'Thiết kế mẫu template cho từng nền tảng',
              'Soạn quy chuẩn phản hồi, tương tác, triển khai nội dung',
            ],
          },
          {
            id: 5,
            title: 'Bàn giao & hướng dẫn triển khai',
            bullets: [
              'Bàn giao tài liệu Social Branding Guideline',
              'Tổ chức buổi training cho đội ngũ nội bộ',
            ],
          },
        ],
      },

      final: {
        title: 'Nhóm khách hàng cần đến dịch vụ Social Branding',
        highlights: [
          'Doanh nghiệp mới xây thương hiệu, muốn định hình rõ chất riêng',
          'Thương hiệu đang hoạt động social nhưng thiếu nhất quán',
          'Đội ngũ marketing nội bộ cần công cụ triển khai đồng bộ, tiết kiệm thời gian',
        ],
      },
    };

    return { servicesData };
  });
