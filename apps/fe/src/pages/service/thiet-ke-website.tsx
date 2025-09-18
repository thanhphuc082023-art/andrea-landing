import SupermarketContent from '@/components/services/SupermarketContent';
import WhyProfessionalSection from '@/components/services/WhyProfessionalSection';
import QuoteSection from '@/components/services/QuoteSection';
import ProcessSection from '@/components/services/ProcessSection';
import FinalSection from '@/components/services/FinalSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import StrapiHead from '@/components/meta/StrapiHead';
import ServiceHero from '@/components/services/ServiceHero';
import ContactForm from '@/contents/index/ContactForm';
import ImageTextSectionWithTitle from '@/components/services/ImageTextSectionWithTitle';
import SubmitButton from '@/components/SubmitButton';
import clsx from 'clsx';
import { useRouter } from 'next/router';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const router = useRouter();
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Thiết kế website',
    metaDescription: 'Dịch vụ thiết kế website chuyên nghiệp',
    shareImage: servicesData?.supermarket?.image || defaultSeo?.shareImage,
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/website/website_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/website/website_thumb.png'}
        mobileSrc={'/assets/images/services/website/website_thumb_mobile.png'}
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />
      <WhyProfessionalSection data={servicesData?.whyProfessional} />
      <ImageTextSectionWithTitle data={servicesData?.imageText} />
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
        title: 'Thiết kế website',
        description:
          'Dịch vụ thiết kế Website chuyên nghiệp, đúng định vị, nâng cao hình ảnh thương hiệu.',
      },
      imageText: {
        title: 'Andrea <br/> Không chỉ là thiết kế, mà là đồng hành chiến lược',
        image: '/assets/images/services/website/website7.png',
        description:
          'Chúng tôi thiết kế website dựa trên đặc trưng ngành nghề, định vị thương hiệu và hành vi người dùng. Andrea không dùng mẫu có sẵn, mỗi thiết kế là một giải pháp được cá nhân hóa, mang đậm dấu ấn riêng:<ul class="list-disc pl-6 ml-0"><li>Thiết kế độc quyền, đúng hệ thống nhận diện thương hiệu.</li><li>Giao diện đẹp, tối ưu hành vi người dùng trên mọi thiết bị.</li><li>Kết hợp giữa trải nghiệm cảm xúc (UX) và giao diện thân thiện (UI).</li><li>Đồng bộ nội dung, hình ảnh, tone giọng truyền thông.</li><li>Hệ thống quản trị dễ dùng, dễ mở rộng, phù hợp cả với đội ngũ không chuyên.</li></ul>',
      },
      supermarket: {
        image: '/assets/images/services/website/website1.png',
        heading: '',
        subheading:
          'Trong thời đại số, website là điểm chạm cốt lõi trong hành trình xây dựng thương hiệu. Một website chuyên nghiệp không chỉ cần đẹp mà còn phải đúng định vị và tạo kết nối cảm xúc với khách hàng. Tại Andrea, chúng tôi mang đến giải pháp thiết kế website độc quyền, chuẩn UX/UI, chuẩn SEO, được xây dựng từ chính câu chuyện và chiến lược thương hiệu của bạn.',
      },
      whyProfessional: {
        title: `Vì sao doanh nghiệp nên đầu tư vào một website chuyên nghiệp?`,
        items: [
          {
            id: '01',
            title: 'Khẳng định uy tín & bản sắc thương hiệu trên môi trường số',
            image: '/assets/images/services/website/website2.png',
            body: 'Website chuyên nghiệp truyền tải rõ giá trị thương hiệu, kết hợp màu sắc và phong cách đồng nhất để tạo niềm tin ngay từ lần đầu truy cập.',
          },
          {
            id: '02',
            title:
              'Tối ưu hành trình trải nghiệm khách hàng (UX), từ tiếp cận đến chuyển đổi',
            image: '/assets/images/services/website/website3.png',
            body: 'Giao diện rõ ràng, điều hướng hợp lý và trải nghiệm mượt mà giúp khách hàng dễ tìm thông tin, tăng tỷ lệ mua hàng hoặc liên hệ.',
          },
          {
            id: '03',
            title:
              'Tăng khả năng hiển thị trên Google nhờ thiết kế chuẩn SEO & nội dung chiến lược',
            image: '/assets/images/services/website/website4.png',
            body: 'Website được tối ưu kỹ thuật và nội dung giúp thương hiệu xuất hiện nhiều hơn trên các công cụ tìm kiếm, tiếp cận đúng nhóm khách hàng mục tiêu.',
          },
          {
            id: '04',
            title:
              'Tiết kiệm chi phí quảng cáo & duy trì kết nối với khách hàng 24/7',
            image: '/assets/images/services/website/website5.png',
            body: 'Website là kênh truyền thông và bán hàng không giới hạn thời gian, giúp bạn tiếp cận và tương tác với khách hàng mọi lúc',
          },
          {
            id: '05',
            title:
              'Website là kênh truyền thông và bán hàng không giới hạn thời gian, giúp bạn tiếp cận và tương tác với khách hàng mọi lúc',
            image: '/assets/images/services/website/website6.png',
            body: 'Sở hữu website chuyên nghiệp giúp thương hiệu nổi bật và sẵn sàng đáp ứng nhu cầu tìm kiếm thông tin, hợp tác hay giao dịch trong không gian số.',
          },
        ],
      },

      quote: {
        text: 'Website không chỉ là giao diện, mà còn là chiến lược kết nối thương hiệu, trải nghiệm người  dùng và tăng trưởng kinh doanh.',
      },
      process: {
        title: 'Quy trình thiết kế website tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Tiếp nhận & Tư vấn',
            bullets: [
              'Phân tích định vị thương hiệu, khách hàng mục tiêu và mục tiêu kinh doanh.',
              'Đề xuất loại website, cấu trúc nội dung, tính năng và  nền tảng công nghệ xây dựng website phù hợp.',
            ],
          },
          {
            id: 2,
            title: 'Phân tích & Lập kiến trúc thông tin',
            bullets: [
              'Xây dựng sitemap (sơ đồ trang).',
              'Phác thảo hành trình người dùng & wireframe các trang chính.',
              'Xác định phạm vi công việc và thống nhất định hướng thiết kế lập trình website.',
            ],
          },
          {
            id: 3,
            title: 'Thiết kế giao diện (UI design)',
            bullets: [
              'Thiết kế độc quyền theo brand guideline.',
              'Tối ưu hiển thị trên desktop & mobile.',
              'Thể hiện đúng tinh thần, màu sắc và thông điệp thương hiệu.',
            ],
          },
          {
            id: 4,
            title: 'Lập trình & Tích hợp',
            bullets: [
              'Lập trình chuẩn SEO, tối ưu tốc độ tải và tương thích đa nền tảng.',
              'Tích hợp các chức năng theo yêu cầu nếu có như (blog, chatbot, form đăng ký, liên kết mạng xã hội…).',
            ],
          },
          {
            id: 5,
            title: 'Test - Bàn giao - Hỗ trợ',
            bullets: [
              'Kiểm thử đa thiết bị, trình duyệt.',
              'Bàn giao và hướng dẫn quản trị nội dung, hình ảnh cho Website.',
              'Bàn giao tài khoản & bảo hành kỹ thuật sau 01 năm khi hoàn tất.',
            ],
          },
        ],
      },
      final: {
        title: 'Khác biệt khi thiết kế website tại Andrea',
        highlights: [
          'Giao diện sáng tạo, đúng định vị thương hiệu.',
          'Tối ưu SEO, chuẩn UX/UI.',
          'Tư vấn nội dung bố cục, và điều hướng website phù hợp cho người xem thuận lợi cho việc kinh doanh.',
          'Quản trị dễ dàng, mở rộng linh hoạt.',
        ],
      },
    };

    return { servicesData };
  });
