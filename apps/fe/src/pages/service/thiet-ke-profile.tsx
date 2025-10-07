import SupermarketContent from '@/components/services/SupermarketContent';
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
import ImageTextSection from '@/components/services/ImageTextSection';
import FinalSection from '@/components/services/FinalSection';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const router = useRouter();
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Thiết kế profile, catalog, báo cáo thường niên',
    metaDescription:
      'Dịch vụ thiết kế profile, catalog, báo cáo thường niên chuyên nghiệp',
    shareImage:
      servicesData?.supermarket?.image ||
      defaultSeo?.shareImage ||
      '/assets/images/services/profile/profile_thumb_mobile.png',
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={'/assets/images/services/profile/profile_thumb_mobile.png'}
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={'/assets/images/services/profile/profile_thumb.png'}
        mobileSrc={'/assets/images/services/profile/profile_thumb_mobile.png'}
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />

      <ImageTextSection
        title={servicesData?.imageText?.title}
        image={servicesData?.imageText?.image}
        heading={servicesData?.imageText?.heading}
        subheadingHtml={servicesData?.imageText?.subheadingHtml}
      />

      <div className="content-wrapper mt-[56px] max-md:mt-[29px]">
        <Divider />
      </div>

      <WhyProfessionalSection
        halfBorder
        reverse
        data={servicesData?.whyProfessional}
      />

      <QuoteSection
        data={servicesData?.quote}
        isImageQueto
        className="[] py-[93px] max-md:py-[70px] [&>.content-wrapper]:!my-0 [&>div>div>.wrapper-left]:!w-fit [&>div>div>.wrapper-right]:!flex-1 [&>div>div>div>.image-left]:aspect-square [&>div>div>div>.image-left]:h-[212px] [&>div>div>div>.image-left]:w-[212px] [&>div>div>div>.image-left]:max-w-[212px] [&>div>div>div>.image-left]:max-md:h-[50px] [&>div>div>div>.image-left]:max-md:w-[50px] [&>div>div>div>.image-left]:max-md:max-w-[50px] [&>div>div>div>.subheading]:!mt-0 [&>div>div]:justify-center [&>div>div]:gap-[118px] [&>div>div]:max-md:!items-start [&>div>div]:max-md:gap-[20px]"
      />
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
        title: 'Thiết kế profile, catalog,<br/> báo cáo thường niên',
      },

      imageText: {
        image: '/assets/images/services/profile/profile1.png',
        heading: '',
        subheadingHtml:
          '<div class="max-w-[500px] mb-[40px] max-md:mb-[20px] text-[16px]">Giải pháp thiết kế ấn phẩm doanh nghiệp chuyên nghiệp - nâng tầm giá trị thương hiệu.<br/>Tại Andrea, chúng tôi cung cấp dịch vụ thiết kế Profile, Catalogue và Báo cáo thường niên với tính thẩm mỹ cao và định hướng chiến lược rõ ràng.<br/>Chúng tôi không chỉ thiết kế đẹp mà còn tư vấn và xây dựng nội dung nhằm làm nổi bật tầm nhìn, năng lực, tinh thần, văn hóa và giá trị cốt lõi của doanh nghiệp.</div>',
      },

      whyProfessional: {
        title: `Mục tiêu của từng loại ấn phẩm`,
        items: [
          {
            id: '01',
            title: 'Thiết kế Profile công ty (Hồ sơ năng lực) là gì?',
            image: '/assets/images/services/profile/profile2.png',
            body: '<div class=""><p class="text-[16px] text-[#3F3F3F] mb-1">Là tài liệu giới thiệu tổng quan về doanh nghiệp, bao gồm:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Giới thiệu công ty (lịch sử, sứ mệnh, tầm nhìn, giá trị cốt lõi)</li><li>Năng lực chuyên môn, lĩnh vực hoạt động</li><li>Dự án đã thực hiện / khách hàng tiêu biểu</li><li>Đội ngũ nhân sự, máy móc thiết bị, công nghệ</li><li>Thông tin liên hệ</li></ul></div><div class="text-[16px] font-semibold text-[#3F3F3F] mt-4">>>> Mục tiêu: Tạo ấn tượng chuyên nghiệp, xây dựng niềm tin và hỗ trợ chào thầu, bán hàng, tìm đối tác.</div>',
          },
          {
            id: '02',
            title: 'Thiết kế Catalogue sản phẩm / dịch vụ là gì?',
            image: '/assets/images/services/profile/profile3.png',
            body: '<div class=""><p class="text-[16px] text-[#3F3F3F] mb-1">Là ấn phẩm trình bày chi tiết sản phẩm, dịch vụ mà doanh nghiệp cung cấp, bao gồm:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Hình ảnh sản phẩm chất lượng cao</li><li>Thông số kỹ thuật / tính năng</li><li>Ứng dụng thực tế / lợi ích sử dụng</li><li>Giá bán (nếu cần) / chính sách đi kèm</li></ul></div><div class="text-[16px] font-semibold text-[#3F3F3F] mt-4">>>> Mục tiêu: Thuyết phục khách hàng lựa chọn, hỗ trợ đội ngũ bán hàng và thể hiện tính chuyên nghiệp trong truyền thông thương hiệu.</div>',
          },
          {
            id: '03',
            title: 'Thiết kế Báo cáo thường niên (Annual Report) là gì?',
            image: '/assets/images/services/profile/profile4.png',
            body: '<div class=""><p class="text-[16px] text-[#3F3F3F] mb-1">Là tài liệu tổng hợp và đánh giá kết quả hoạt động kinh doanh - tài chính của doanh nghiệp trong 1 năm, thường dành cho:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Cổ đông</li><li>Nhà đầu tư</li><li>Đối tác chiến lược</li><li>Các tổ chức tài chính</li></ul><p class="text-[16px] text-[#3F3F3F] mb-1">Nội dung chính:<ul class="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#3F3F3F]"><li>Tổng quan doanh nghiệp và chiến lược phát triển</li><li>Kết quả hoạt động kinh doanh</li><li>Báo cáo tài chính</li><li>Các chỉ số ESG, CSR, phát triển bền vững</li></ul></div><div class="text-[16px] font-semibold text-[#3F3F3F] mt-4">>>> Mục tiêu: Minh bạch hóa thông tin, nâng cao uy tín, thu hút đầu tư và tạo sự tin tưởng trong cộng đồng tài chính.</div>',
          },
        ],
      },

      quote: {
        image: '/assets/images/services/profile/profile5.png',
        subheadingHtml:
          '<div class="text-[40px] font-playfair !text-brand-orange mb-6 leading-[50px]">Cam kết từ Andrea</div><div class=""><ul class="list-disc space-y-1 pl-5 !text-[16px] leading-relaxed !text-white"><li>Đồng hành cùng doanh nghiệp từ khâu lên nội dung đến hoàn thiện thiết kế</li><li>Tối ưu theo từng lĩnh vực ngành nghề cụ thể</li><li>Bám sát nhận diện thương hiệu & mục tiêu truyền thông dài hạn</li></ul></div><div class="!text-[16px] !text-white mt-6">Thương hiệu của bạn xứng đáng được kể bằng một câu chuyện ấn tượng <br/> Đừng để hồ sơ doanh nghiệp hay catalogue chỉ là tài liệu - hãy biến chúng thành công cụ truyền cảm hứng và tạo dấu ấn riêng.</div>',
      },
      process: {
        title: 'Quy trình thiết kế tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Tư vấn & Khảo sát nhu cầu',
            bullets: [
              'Tiếp nhận yêu cầu từ khách hàng',
              'Phân tích mục tiêu sử dụng (thầu, giới thiệu, đối tác, nhà đầu tư…)',
              'Xác định định vị thương hiệu và đối tượng tiếp nhận ấn phẩm',
            ],
          },
          {
            id: 2,
            title: 'Lên ý tưởng nội dung & Cấu trúc',
            bullets: [
              'Đề xuất bố cục nội dung theo logic truyền thông',
              'Tư vấn định hướng viết bài phù hợp với từng loại ấn phẩm (profile / catalogue / báo cáo)',
              'Hỗ trợ biên tập hoặc viết mới nếu khách hàng chưa có nội dung',
            ],
          },
          {
            id: 3,
            title: 'Thiết kế sáng tạo & Trình bày chuyên nghiệp',
            bullets: [
              'Thiết kế layout với 2 concept sáng tạo, phù hợp nhận diện thương hiệu',
              'Chỉnh sửa và tối ưu hình ảnh, trình bày số liệu trực quan bằng infographics',
              'Đảm bảo tính đồng bộ, thẩm mỹ và đúng định hướng chiến lược',
              'Khách hàng chọn phương án và duyệt nội dung để hoàn thiện bản thiết kế lần 1',
            ],
          },
          {
            id: 4,
            title: 'Hiệu chỉnh & Hoàn thiện',
            bullets: [
              'Gửi bản thiết kế hoàn thiện lần 1 để khách hàng duyệt và phản hồi',
              'Thực hiện các vòng chỉnh sửa theo yêu cầu',
              'Hoàn thiện file in và file PDF xem, bản số hóa (Slide deck, …các định dạng bản xem online nếu yêu cầu…)',
            ],
          },
          {
            id: 5,
            title: 'Bàn giao & Hỗ trợ',
            bullets: [
              'Bàn giao toàn bộ file thiết kế và file in ấn',
              'Tư vấn hỗ trợ in ấn (nếu cần)',
              'Hướng dẫn sử dụng ấn phẩm trên nền tảng số (email, trình chiếu, website nếu cần…)',
            ],
          },
        ],
      },

      final: {
        title: 'Khác biệt khi thiết kế tại Andrea',
        highlights: [
          ' Xây dựng hình ảnh <span class="text-brand-orange">chuyên nghiệp, nhất quán.</span>',
          'Gia tăng độ <span class="text-brand-orange">tin cậy</span> trong mắt đối tác, khách hàng và nhà đầu tư.',
          'Thể hiện <span class="text-brand-orange">bản sắc thương hiệu</span> thông qua từng chi tiết thiết kế và câu chuyện nội dung.',
        ],
      },
    };

    return { servicesData };
  });
