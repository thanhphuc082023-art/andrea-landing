import SupermarketContent from '@/components/services/SupermarketContent';
import WhyProfessionalSection from '@/components/services/WhyProfessionalSection';
import CriteriaSection from '@/components/services/CriteriaSection';
import QuoteSection from '@/components/services/QuoteSection';
import ProcessSection from '@/components/services/ProcessSection';
import FinalSection from '@/components/services/FinalSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import StrapiHead from '@/components/meta/StrapiHead';
import ServiceHero from '@/components/services/ServiceHero';
import ContactForm from '@/contents/index/ContactForm';
import clsx from 'clsx';
import SubmitButton from '@/components/SubmitButton';
import { useRouter } from 'next/router';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const router = useRouter();
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Thiết kế bao bì',
    metaDescription: 'Dịch vụ thiết kế bao bì chuyên nghiệp',
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
      <ServiceHero
        desktopSrc={'/assets/images/services/baobi/baobi_thumb.png'}
        mobileSrc={'/assets/images/services/baobi/baobi_thumb_mobile.png'}
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />
      <WhyProfessionalSection data={servicesData?.whyProfessional} />
      <CriteriaSection data={servicesData?.criteria} />
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
        title: 'Thiết kế bao bì',
        description:
          'Thiết kế bao bì sáng tạo, chuyên nghiệp, đúng nhận diện thương hiệu',
      },
      supermarket: {
        image: '/assets/images/services/baobi/baobi1.png',
        heading:
          'Bao bì là một trong những điểm chạm đầu tiên với khách hàng để tạo ấn tượng và truyền tải bản sắc',
        subheading:
          'Bao bì cũng là <span class="font-playfair text-brand-orange text-[20px]">công cụ truyền thông</span> trực tiếp nhất của thương hiệu. Một thiết kế bao bì chuyên nghiệp, sáng tạo và đúng chiến lược không chỉ bảo vệ sản phẩm mà còn nâng cao giá trị thương hiệu trong mắt người tiêu dùng.',
      },
      whyProfessional: {
        title: `Vì sao doanh nghiệp cần thiết kế <br /> bao bì chuyên nghiệp?`,
        items: [
          {
            id: '01',
            title: 'Tăng khả năng nhận diện thương hiệu',
            image: '/assets/images/services/baobi/baobi2.png',
            body: 'Bao bì truyền tải màu sắc, cảm xúc và thông điệp rõ ràng về thương hiệu.',
          },
          {
            id: '02',
            title: 'Tạo ấn tượng đầu tiên',
            image: '/assets/images/services/baobi/baobi3.png',
            body: 'Theo khảo sát 30% khách hàng quyết định mua hàng dựa vào thiết kế bao bì',
          },
          {
            id: '03',
            title: 'Thể hiện sự chuyên nghiệp & đáng tin cậy',
            image: '/assets/images/services/baobi/baobi4.png',
            body: 'Bao bì đẹp, chuẩn nhận diện thương hiệu nhất quán sẽ tăng độ uy tín và nâng tầm thương hiệu.',
          },
          {
            id: '04',
            title: 'Tăng lợi thế cạnh tranh',
            image: '/assets/images/services/baobi/baobi5.png',
            body: 'Thiết kế bao bì thông minh giúp sản phẩm nổi bật trên kệ hàng và thu hút người tiêu dùng.',
          },
        ],
      },
      criteria: {
        title: 'Bao bì tốt cần đáp ứng tiêu chí nào?',
        image: '/assets/images/services/baobi/baobi6.png',
        list: [
          {
            title: 'Đảm bảo công năng',
            description: 'Bảo vệ sản phẩm, dễ đóng gói, vận chuyển, lưu kho',
          },
          {
            title: 'Truyền thông thương hiệu tốt',
            description:
              'Thể hiện đúng tính cách và giá trị cốt lõi của thương hiệu.',
          },
          {
            title: 'Thông tin rõ ràng, minh bạch',
            description:
              'Tạo niềm tin với khách hàng qua ngôn ngữ và hình ảnh thể hiện.',
          },
          {
            title: 'Tối ưu chi phí, hiệu quả cao',
            description:
              'Giảm chi phí marketing, giảm lỗi sản phẩm, tối ưu quy trình sản xuất - vận hành.',
          },
          {
            title: 'Hiểu sản phẩm, hiểu bao bì',
            description:
              'Bao bì cần được thiết kế phù hợp với sản phẩm và có hành trình rõ ràng từ sản xuất đến phân huỷ, góp phần bảo vệ môi trường.',
          },
        ],
      },
      quote: {
        text: 'Bao bì không chỉ là lớp vỏ mà là chiến lược gắn liền với thương hiệu, sản phẩm và vận hành doanh nghiệp.',
      },
      process: {
        title: 'Quy trình thiết kế bao bì tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Khai vấn & tiếp nhận thông tin',
            bullets: [
              'Khám phá nhu cầu, mong muốn và những trăn trở về bao bì hiện tại',
              'Hiểu rõ sản phẩm, khách hàng mục tiêu, thông điệp cần truyền tải',
              'Lập brief chiến lược sáng tạo',
            ],
          },
          {
            id: 2,
            title: 'Nghiên cứu & xây dựng concept',
            bullets: [
              'Phân tích thị trường, đối thủ, hành vi mua hàng',
              'Xây dựng thông điệp & câu chuyện thương hiệu',
              'Lên moodboard định hướng hình ảnh, màu sắc, phong cách',
            ],
          },
          {
            id: 3,
            title: 'Thiết kế & sáng tạo',
            bullets: [
              'Khám phá nhu cầu, mong muốn và những trăn trở về bao bì hiện tại',
              'Hiểu rõ sản phẩm, khách hàng mục tiêu, thông điệp cần truyền tải',
              'Lập brief chiến lược sáng tạo',
            ],
          },
          {
            id: 4,
            title: 'Chỉnh sửa & hoàn thiện',
            bullets: [
              'Lấy các ý kiến phản hồi, phản biện từ góc nhìn từ khách hàng và nhà sản xuất, khách hàng mục tiêu, hiệu chỉnh, chốt phương án cuối và in kiểm thử lần 1',
              'Chỉnh sửa sau in kiểm thử và bàn giao thiết kế',
              'Lưu ý kiểm tra và in kiểm thử trải nghiệm thử, rồi mới thực hiện in và sản xuất hàng loạt',
            ],
          },
          {
            id: 5,
            title: 'Hỗ trợ truyền thông',
            bullets: [
              'Tư vấn và thiết kế hình ảnh truyền thông cho sản phẩm: ảnh phối cảnh, video, showcase...',
            ],
          },
        ],
      },
      final: {
        title: 'Khác biệt của Andrea khi thiết kế bao bì',
        highlights: [
          'Thiết kế không chỉ đẹp – mà kể được <span class="text-brand-orange">câu chuyện thương hiệu</span>',
          'Kết hợp nghệ thuật, kỹ thuật và cảm xúc',
          'Lồng ghép yếu tố <span class="text-brand-orange">văn hóa Việt</span> một cách tinh tế, tạo chất riêng',
          'Tạo ra những sản phẩm bao bì khiến khách hàng <span class="text-brand-orange">muốn chạm - muốn giữ - muốn tin.</span>',
        ],
      },
    };

    return { servicesData };
  });
