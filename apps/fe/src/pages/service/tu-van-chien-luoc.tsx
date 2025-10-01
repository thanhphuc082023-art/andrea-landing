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
        ogImage={
          '/assets/images/services/chienluoc/chien_luoc_thumb_mobile.png'
        }
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/chienluoc/chien_luoc_thumb.png'}
        mobileSrc={
          '/assets/images/services/chienluoc/chien_luoc_thumb_mobile.png'
        }
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />

      <StrategyServicesSection data={servicesData.strategyServices} />

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
        title:
          'Tư vấn chiến lược, xây dựng bộ máy vận hành và văn hóa doanh nghiệp',
      },
      supermarket: {
        image: '/assets/images/services/chienluoc/chienluoc1.png',
        heading: '',
        subheading:
          '<div class="mb-[40px] max-md:mb-[20px] text-[16px]">Chúng tôi đồng hành cùng chủ đầu tư thiết kế bộ máy vận hành doanh nghiệp và xây dựng hệ thống quy trình đủ mạnh để thực thi. Đội ngũ chuyên gia của chúng tôi có nhiều năm kinh nghiệm thực chiến ở các tập đoàn lớn và các doanh nghiệp vừa và nhỏ tại Việt Nam.</div><div class="text-[18px] font-playfair text-brand-orange max-md:text-[15px]">Tư vấn chiến lược định vị thương hiệu</div><div class="h-[1px] w-full bg-black/20 my-4"></div><div class="text-[18px] font-playfair text-brand-orange max-md:text-[15px]">Đồng hành và xây dựng bộ máy hoạt động của doanh nghiệp</div><div class="h-[1px] w-full bg-black/20 my-4"></div><div class="text-[18px] font-playfair text-brand-orange max-md:text-[15px]">Tư vấn đồng hành xây dựng văn hóa doanh nghiệp</div>',
      },
      strategyServices: [
        {
          id: '01',
          title:
            '<h3 class="font-playfair flex items-center justify-start text-[40px] max-md:text-[27px] leading-[50px] max-md:leading-[36px] text-brand-orange max-sd:mt-[20px] max-md:mt-[25px] mb-3 mt-[25px] font-semibold">Tư vấn chiến lược định vị thương hiệu</h3>',
          description: [
            {
              type: 'html',
              content:
                '<div class="mb-4"><p class="text-[16px] text-[#3F3F3F] mb-1">Tại Andrea, chúng tôi:</p><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Lắng nghe trăn trở, thách thức và mong muốn của nhà sáng lập</li><li>Đồng hành tìm ra giá trị cốt lõi, bản sắc khác biệt, tầm nhìn thương hiệu</li><li>Định hình định vị rõ ràng trong tâm trí khách hàng là điều gì, từ khóa cụ thể.</li><li>Xây dựng tính cách thương hiệu: qua giọng nói, hành vi, cảm xúc</li><li>Kết nối thương hiệu với đội ngũ nội bộ và môi trường bên ngoài</li></ul></div>',
            },
            {
              type: 'image',
              src: '/assets/images/services/chienluoc/chienluoc2.png',
              alt: 'Tư vấn chiến lược định vị thương hiệu',
            },
            {
              type: 'html',
              content:
                '<div class="mb-4 mt-8"><p class="text-[25px] font-playfair text-brand-orange mb-1 leading-[32px]">Tại sao doanh nghiệp cần dịch vụ này?</p><p class="text-[16px] text-[#3F3F3F] mb-1">Hầu hết doanh nghiệp khởi đầu bằng thiết kế hoặc marketing, nhưng lại chưa thực sự hiểu thương hiệu là ai.<br/>Điều này dẫn đến:</p><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Thiết kế thiếu nhất quán, truyền thông không rõ ràng</li><li>Đội ngũ không kết nối được với thương hiệu mình phục vụ</li><li>Khách hàng khó nhận diện và không nhớ bạn là ai</li></ul><p class="text-[16px] text-[#3F3F3F] mt-1">Andrea giúp bạn xây móng vững chắc trước khi bước vào giai đoạn truyền thông hay thiết kế.</p></div>',
            },
            {
              type: 'html',
              content:
                '<div class="mb-16 max-md:mb-8"><p class="text-[25px] font-playfair text-brand-orange mb-1 leading-[32px]">Lợi ích của tư vấn định vị thương hiệu tại Andrea</p><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Làm rõ giá trị, mục đích & định vị thương hiệu</li><li>Xác lập tính cách thương hiệu: giọng nói, cảm xúc, hành vi</li><li>Kết nối chiến lược thương hiệu với văn hóa nội bộ</li><li>Tạo nền tảng cho các hoạt động thiết kế nhận diện, nội dung và truyền thông sau này</li></ul><p class="text-[16px] text-[#3F3F3F] mt-1">Đây là bước đi không thể thiếu nếu bạn muốn thương hiệu phát triển lâu dài và bền vững.</p></div>',
            },
          ],
        },
        {
          id: '02',
          title:
            '<h3 class="font-playfair flex items-center justify-start text-[40px] max-md:text-[27px] leading-[50px] max-md:leading-[36px] text-brand-orange mb-3 mt-[5px] max-md:mt-[25px] font-semibold">Đồng hành và xây dựng bộ máy vận hành và văn hóa doanh nghiệp</h3>',
          description: [
            {
              type: 'image',
              src: '/assets/images/services/chienluoc/chienluoc3.png',
              alt: 'Tư vấn chiến lược định vị thương hiệu',
            },
            {
              type: 'html',
              content:
                '<div class="mb-4 mt-8"><p class="text-[16px] text-[#3F3F3F] mt-1">Andrea đồng hành cùng bộ máy của công ty hiện có để  triển khai các công cụ quản trị, xây dựng bộ máy nhân sự và tham gia hoạt động tuyển dụng, tham gia cố vấn điều hành cho nhà sáng lập, đồng thời xây dựng bộ quy trình và quy chế hoạt động cho doanh nghiệp theo lộ trình phát triển định hướng 3 năm tài chính.<br/>Thời gian đồng hành theo từng dự án: 3 tháng, 6 tháng, 9 tháng, 12 tháng</p></div>',
            },
          ],
        },
      ],

      quote: {
        text: 'Không chỉ là chiến lược trên giấy - chúng tôi giúp bạn sống cùng thương hiệu mình đang xây dựng.',
      },
      process: {
        title: 'Quy trình thiết kế Social Branding tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Khai vấn thương hiệu',
            bullets: ['Đối thoại sâu cùng nhà sáng lập & đội ngũ cốt lõi'],
          },
          {
            id: 2,
            title: 'Phân tích ngành',
            bullets: [
              'Nghiên cứu thị trường, hành vi khách hàng, xác định lợi thế cạnh tranh',
            ],
          },
          {
            id: 3,
            title: 'Xác lập nền tảng chiến lược',
            bullets: [
              'Định vị – Tính cách thương hiệu – Thông điệp cốt lõi – Mục tiêu 3 năm',
            ],
          },
          {
            id: 4,
            title: 'Gợi ý hệ thống hình ảnh & concept thị giác',
            bullets: [
              'Thiết kế mẫu template cho từng nền tảng',
              'Soạn quy chuẩn phản hồi, tương tác, triển khai nội dung',
            ],
          },
          {
            id: 5,
            title: 'Đồng hành triển khai nhận diện & truyền thông',
            bullets: [
              'Giám sát thực thi – Tư vấn nội dung – Hỗ trợ nội bộ thương hiệu',
            ],
          },
        ],
      },
    };

    return { servicesData };
  });
