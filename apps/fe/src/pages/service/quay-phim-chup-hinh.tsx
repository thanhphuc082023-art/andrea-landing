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
import Divider from '@/components/services/Divider';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const router = useRouter();
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Quay phim & Chụp hình',
    metaDescription:
      'Truyền tải đúng bản sắc, giá trị cốt lõi và hình ảnh chuyên nghiệp. Lan tỏa cảm xúc, kết nối khách hang, đối tác, cộng đồng.',
    shareImage:
      servicesData?.supermarket?.image ||
      defaultSeo?.shareImage ||
      '/assets/images/services/quayphim/quayphim_thumb_mobile.png',
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/quayphim/quayphim_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/quayphim/quayphim_thumb.png'}
        mobileSrc={'/assets/images/services/quayphim/quayphim_thumb_mobile.png'}
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />

      <StrategyServicesSection
        className="mx-auto max-w-[1080px] max-md:max-w-full"
        data={servicesData.strategyServices}
      />
      <div className="content-wrapper mt-[56px] max-md:mt-[29px]">
        <Divider />
      </div>
      <WhyProfessionalSection data={servicesData?.whyProfessional} />

      <QuoteSection data={servicesData?.quote} />
      <ProcessSection data={servicesData?.process} />

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
        title: 'Quay phim & Chụp hình',
        description:
          'Truyền tải đúng bản sắc, giá trị cốt lõi và hình ảnh chuyên nghiệp. Lan tỏa cảm xúc, kết nối khách hang, đối tác, cộng đồng.',
      },
      strategyServices: [
        {
          description: [
            {
              type: 'image',
              src: '/assets/images/services/quayphim/quayphim1.png',
              alt: 'Tư vấn chiến lược định vị thương hiệu',
            },
            {
              type: 'html',
              content:
                '<div class="mb-4 mt-8"><p class="text-[16px] text-[#3F3F3F] mb-1">Andrea đồng hành cùng khách hàng lên idea ý tưởng cho thương hiệu của bạn một cách nhất quán, định vị đúng giá trị và thông điệp muốn truyền tải, ghi những dấu những khoảnh khắc quan trọng trong hành trình phát triển và cung cấp dịch vụ của chính của thương hiệu.</p></br><p class="text-[16px] text-[#3F3F3F] mb-1">Chúng tôi mang đến giải pháp hình ảnh vừa tinh tế, vừa chiến lược, giúp thương hiệu không chỉ được nhìn thấy mà còn được cảm nhận.</p></div>',
            },
          ],
        },
      ],

      whyProfessional: {
        title: `Vì sao khách hàng chọn Andrea?`,
        items: [
          {
            id: '01',
            title: 'Cảm xúc & Chiến lược',
            image: '/assets/images/services/quayphim/quayphim2.png',
            body: 'Hình ảnh được xây dựng dựa trên câu chuyện thương hiệu, không đơn thuần là quay chụp.',
          },
          {
            id: '02',
            title: 'Đội ngũ sáng tạo giàu kinh nghiệm',
            image: '/assets/images/services/quayphim/quayphim3.png',
            body: 'Kết hợp góc nhìn nghệ thuật, truyền thông và thương hiệu.',
          },
          {
            id: '03',
            title: 'Đồng bộ nhận diện',
            image: '/assets/images/services/quayphim/quayphim4.png',
            body: 'Đảm bảo mọi thước phim, khung hình phù hợp với hệ thống nhận diện của doanh nghiệp.',
          },
          {
            id: '04',
            title: 'Lan tỏa giá trị bền vững',
            image: '/assets/images/services/quayphim/quayphim5.png',
            body: 'Giúp thương hiệu tạo ảnh hưởng lâu dài, chạm đến trái tim người xem.',
          },
        ],
      },

      quote: {
        text: 'Với Andrea, mỗi bộ ảnh, mỗi video, mỗi TVC không chỉ là sản phẩm hình ảnh, mà là một phần câu chuyện thương hiệu sống động, truyền cảm hứng và tạo dấu ấn lâu dài.',
      },
      process: {
        title: 'Quy trình thực hiện dự án tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Lắng nghe & Tư vấn',
            bullets: [
              'Tìm hiểu về thương hiệu, mục tiêu truyền thông, đối tượng khách hàng.',
              'Đề xuất ý tưởng & định hướng phong cách hình ảnh.',
            ],
          },
          {
            id: 2,
            title: 'Xây dựng kịch bản & Kế hoạch',
            bullets: [
              'Khảo sát thực tế',
              'Lên kịch bản quay phim / bố cục quay chụp hình.',
              'Chuẩn bị bối cảnh, ekip và thiết bị phù hợp.',
            ],
          },
          {
            id: 3,
            title: 'Thực hiện sản xuất',
            bullets: [
              'Quay phim, chụp hình theo kịch bản đã duyệt.',
              'Đảm bảo chất lượng kỹ thuật & cảm xúc trong từng chi tiết.',
            ],
          },
          {
            id: 4,
            title: 'Hậu kỳ sáng tạo',
            bullets: [
              'Dựng phim, chỉnh sửa hình ảnh, thiết kế motion/graphic nếu cần.',
              'Đảm bảo đồng bộ với hệ thống thương hiệu và thông điệp truyền thông.',
            ],
          },
          {
            id: 5,
            title: 'Bàn giao & Đồng hành',
            bullets: [
              'Giao sản phẩm hoàn chỉnh với nhiều định dạng.',
              'Hỗ trợ lan tỏa trên các kênh truyền thông doanh nghiệp.',
            ],
          },
        ],
      },
    };

    return { servicesData };
  });
