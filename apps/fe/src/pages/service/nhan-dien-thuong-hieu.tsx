import SupermarketContent from '@/components/services/SupermarketContent';
import StrategyServicesSection from '@/components/services/StrategyServicesSection';
import QuoteSection from '@/components/services/QuoteSection';
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
    metaTitle: 'Thiết kế nhận diện sự kiện',
    metaDescription:
      'Giải pháp thiết kế sự kiện đồng bộ thương hiệu – tạo dấu ấn khác biệt',
    shareImage:
      servicesData?.supermarket?.image ||
      defaultSeo?.shareImage ||
      '/assets/images/services/nhandien/nhandien_thumb_mobile.png',
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/nhandien/nhandien_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/nhandien/nhandien_thumb.png'}
        mobileSrc={'/assets/images/services/nhandien/nhandien_thumb_mobile.png'}
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

      <ImageTextSection
        title={servicesData?.imageText?.title}
        image={servicesData?.imageText?.image}
        heading={servicesData?.imageText?.heading}
        subheadingHtml={servicesData?.imageText?.subheadingHtml}
      />

      <QuoteSection data={servicesData?.quote} />

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
        title: 'Thiết kế nhận diện sự kiện',
        description:
          'Giải pháp thiết kế sự kiện đồng bộ thương hiệu – tạo dấu ấn khác biệt',
      },
      strategyServices: [
        {
          description: [
            {
              type: 'html',
              content:
                '<div class="mb-4"><p class="text-[16px] text-[#3F3F3F] mb-1">Tại Andrea, chúng tôi cung cấp dịch vụ thiết kế nhận diện sự kiện doanh nghiệp từ ý tưởng đến triển khai trọn gói. Với tư duy chiến lược và khả năng thiết kế thẩm mỹ cao, Andrea giúp doanh nghiệp kiến tạo không gian sự kiện ấn tượng, nhất quán với thương hiệu và chạm đến cảm xúc người tham dự.</p></div>',
            },
            {
              type: 'image',
              src: '/assets/images/services/nhandien/nhandien1.png',
              alt: 'Thiết kế nhận diện sự kiện',
            },
            {
              type: 'html',
              content:
                '<div class="mb-4 mt-8"><p class="text-[25px] font-playfair text-brand-orange mb-1 leading-[32px]">Vì sao doanh nghiệp cần thiết kế sự kiện chuyên nghiệp?</p><p class="text-[16px] text-[#3F3F3F] mb-1">Một sự kiện không chỉ là dịp gặp gỡ – mà là cơ hội xây dựng hình ảnh, lan tỏa thông điệp và tạo ra trải nghiệm gắn kết. Thiết kế đồng bộ từ nhận diện đến không gian sự kiện giúp doanh nghiệp:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Truyền tải thông điệp thương hiệu một cách nhất quán</li><li>Tăng độ chuyên nghiệp và đẳng cấp trong mắt khách mời</li><li>Gây ấn tượng mạnh mẽ về hình ảnh và cảm xúc</li><li>Gia tăng sự gắn kết nội bộ và niềm tự hào với thương hiệu</li></ul></div>',
            },
          ],
        },
      ],

      whyProfessional: {
        title: `Dịch vụ thiết kế sự kiện bao gồm những gì?`,
        items: [
          {
            id: '01',
            title: 'Thiết kế concept sự kiện',
            image: '/assets/images/services/nhandien/nhandien2.png',
            body: '<div class=""><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Xây dựng chủ đề, thông điệp và phong cách sự kiện</li><li>Định hướng trải nghiệm tổng thể (tone cảm xúc, hành trình người tham dự)</li><li>Gắn kết với chiến lược thương hiệu hoặc mục tiêu truyền thông</li></ul></div>',
          },
          {
            id: '02',
            title: 'Thiết kế bộ nhận diện sự kiện',
            image: '/assets/images/services/nhandien/nhandien3.png',
            body: '<div class=""><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Logo hoặc biểu tượng sự kiện</li><li>Tagline, thông điệp chính, hệ thống visual (màu sắc, typography)</li><li>Key visual áp dụng trên đa nền tảng</li></ul></div>',
          },
          {
            id: '03',
            title: 'Thiết kế ấn phẩm truyền thông & sân khấu',
            image: '/assets/images/services/nhandien/nhandien4.png',
            body: '<div class=""><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Backdrop sân khấu – photobooth – standee</li><li>Vé mời, thư mời, slide trình chiếu, banner digital</li><li>Tài liệu in ấn: brochure, profile, báo cáo, thư cảm ơn</li></ul></div>',
          },
          {
            id: '04',
            title: 'Thiết kế quà tặng & vật phẩm trải nghiệm',
            image: '/assets/images/services/nhandien/nhandien5.png',
            body: '<div class=""><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Giftset mang dấu ấn sự kiện</li><li>Đồng phục, name tag, thẻ sự kiện, khung ảnh check-in</li><li>Vật phẩm trò chơi, tương tác, minigame, mạng xã hội…</li><li>Thiết kế sản xuất linh vật cho thương hiệu.</li></ul></div>',
          },
          {
            id: '05',
            title: 'Thiết kế không gian và hành trình trải nghiệm',
            image: '/assets/images/services/nhandien/nhandien6.png',
            body: '<div class=""><ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Bố trí không gian sự kiện theo sơ đồ hành trình cảm xúc</li><li>Thiết kế biển chỉ dẫn, layout triển lãm, khu vực đón tiếp</li><li>Kết hợp âm thanh, ánh sáng, màu sắc, chất liệu tạo trải nghiệm "sống" với thương hiệu</li></ul></div>',
          },
        ],
      },
      imageText: {
        title: 'Đối tượng sự kiện Andrea đã đồng hành',
        image: '/assets/images/services/nhandien/nhandien7.png',
        heading: '',
        subheadingHtml:
          '<div class="text-[16px]">Sự kiện kỷ niệm thành lập doanh nghiệp</div><div class="h-[1px] w-full bg-black/20 my-4"></div><div class="text-[16px]">Lễ công bố chiến lược, tái định vị thương hiệu</div><div class="h-[1px] w-full bg-black/20 my-4"></div><div class="text-[16px]">Hội nghị chiến lược, lễ tri ân, gala dinner</div>',
      },
      quote: {
        text: 'Bạn đang lên kế hoạch cho một sự kiện quan trọng? Hãy để Andrea giúp bạn biến sự kiện thành dấu ấn thương hiệu đáng nhớ.',
      },

      final: {
        title: 'Giá trị khi thiết kế nhận diện sự kiện tại Andrea',
        highlights: [
          '<span class="text-brand-orange">Tư duy chiến lược</span>, thiết kế nhất quán với bộ nhận diện thương hiệu',
          'Truyền tải <span class="text-brand-orange">thông điệp rõ ràng</span> qua từng điểm chạm trong sự kiện',
          '<span class="text-brand-orange">Đồng hành</span> từ ý tưởng, triển khai, bàn giao thiết kế trọn gói',
          'Tối ưu chi phí, đảm bảo tiến độ và <span class="text-brand-orange">hiệu quả truyền thông</span>',
        ],
      },
    };

    return { servicesData };
  });
