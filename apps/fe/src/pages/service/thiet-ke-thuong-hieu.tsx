import SupermarketContent from '@/components/services/SupermarketContent';
import WhyProfessionalSection from '@/components/services/WhyProfessionalSection';
import QuoteSection from '@/components/services/QuoteSection';
import ProcessSection from '@/components/services/ProcessSection';
import FinalSection from '@/components/services/FinalSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import StrapiHead from '@/components/meta/StrapiHead';
import ServiceHero from '@/components/services/ServiceHero';
import ImageTextSection from '@/components/services/ImageTextSection';
import Image from 'next/image';
import WhyProfessionalSectionSimple from '@/components/services/WhyProfessionalSectionSimple';
import ContactForm from '@/contents/index/ContactForm';

export default function ServicesPage({ servicesData, currentGlobal }: any) {
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const pageSeo = {
    metaTitle: 'Thiết kế thương hiệu',
    metaDescription: 'Dịch vụ thiết kế thương hiệu chuyên nghiệp',
    shareImage: servicesData?.supermarket?.image || defaultSeo?.shareImage,
  };

  const seo = { ...defaultSeo, ...pageSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        global={currentGlobal}
        seo={seo}
        ogImage={
          '/assets/images/services/thietkethuonghieu/thietke_thumb_mobile.png'
        }
      />
      {/* Hero Section */}
      <ServiceHero
        desktopSrc={
          '/assets/images/services/thietkethuonghieu/thietke_thumb.png'
        }
        mobileSrc={
          '/assets/images/services/thietkethuonghieu/thietke_thumb_mobile.png'
        }
        alt="Services"
      />

      <SupermarketContent
        data={{ ...servicesData?.supermarket, ...servicesData?.brand }}
      />
      <WhyProfessionalSection data={servicesData?.whyProfessional} />
      <QuoteSection data={servicesData?.quote} />
      <ImageTextSection />
      <QuoteSection
        data={servicesData?.quoteTwo}
        layout="image-right"
        image={servicesData?.quoteTwo?.image}
      />
      <ProcessSection data={servicesData?.process} />

      <QuoteSection
        data={servicesData?.quoteThree}
        layout="center"
        image={servicesData?.quoteThree?.image}
      />

      <div className="content-wrapper flex shrink-0 items-center justify-center pt-10 max-md:px-0 max-md:pt-0">
        <div className="relative w-full" style={{ aspectRatio: '1300 / 665' }}>
          {servicesData?.image ? (
            <Image
              src={servicesData?.image}
              alt={servicesData?.imageAlt || 'quote image'}
              layout="fill"
              className="object-cover"
            />
          ) : (
            <Image
              src="/assets/images/default-quote-right.jpg"
              alt="quote image"
              layout="fill"
              className="object-cover"
            />
          )}
        </div>
      </div>
      <ProcessSection data={servicesData?.processTwo} />
      <WhyProfessionalSectionSimple
        data={servicesData?.whyProfessionalSimple}
      />
      <FinalSection data={servicesData?.final} />
      <ContactForm />
    </div>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    // Mock page-specific data for child components (replace with CMS fetch later)
    const servicesData = {
      brand: {
        title: 'Thiết kế thương hiệu',
        description: 'Dịch vụ thiết kế thương hiệu trọn gói',
      },
      supermarket: {
        image: '/assets/images/services/thietkethuonghieu/thietke1.png',
        heading: '',
        subheading:
          'Chúng tôi cung cấp giải pháp thiết kế thương hiệu toàn diện, bao gồm từ việc đặt tên thương hiệu, sáng tác slogan, thiết kế logo, cho đến xây dựng bộ nhận diện thương hiệu chuyên nghiệp. Ngoài ra, bạn hoàn toàn có thể lựa chọn từng hạng mục dịch vụ riêng lẻ, phù hợp với nhu cầu hiện tại và chiến lược kinh doanh của doanh nghiệp mình. <br/> Các hạng mục dịch vụ bao gồm: <br/><ul class="list-disc pl-6 ml-0"><li>Đặt tên thương hiệu</li><li>Sáng tác Slogan</li><li>Thiết kế Logo</li><li>Thiết kế Bộ nhận diện thương hiệu</li></ul>',
      },
      whyProfessional: {
        title: `Vì sao doanh nghiệp cần thiết kế <br /> bao bì chuyên nghiệp?`,
        items: [
          {
            id: '01',
            title: 'Dịch vụ Đặt Tên Thương Hiệu',
            image: '/assets/images/services/thietkethuonghieu/thietke2.png',
            body: 'Tên thương hiệu là bước khởi đầu định hình ấn tượng đầu tiên với khách hàng. Andrea giúp bạn tạo ra những tên gọi độc đáo, dễ nhớ, giàu ý nghĩa, phản ánh đúng tính cách và giá trị thương hiệu.<br/>Ưu điểm khi đặt tên tại Andrea:<br/><ul class="list-disc pl-6 ml-0"><li>Nghiên cứu sâu thị trường và đối thủ</li><li>Phù hợp văn hóa, ngôn ngữ, dễ phát âm</li><li>Đăng ký bảo hộ dễ dàng</li></ul>',
          },
          {
            id: '02',
            title: 'Dịch vụ Sáng Tác Slogan',
            image: '/assets/images/services/thietkethuonghieu/thietke3.png',
            body: 'Slogan không chỉ là một câu nói – đó là lời hứa thương hiệu. Andrea sáng tác slogan ngắn gọn, truyền cảm, dễ thuộc và thể hiện đúng tinh thần doanh nghiệp.<br/>Quy trình sáng tác slogan:<br/><ul class="list-disc pl-6 ml-0"><li>Khai vấn và khám phá thông điệp cốt lõi</li><li>Gợi mở ý tưởng sáng tạo &amp; từ khóa cảm xúc</li><li>Hoàn thiện 3–5 phương án chất lượng</li></ul>',
          },
          {
            id: '03',
            title: 'Dịch vụ Thiết kế Logo Chuyên Nghiệp',
            image: '/assets/images/services/thietkethuonghieu/thietke4.png',
            body: 'Từ biểu tượng đến cảm xúc – Andrea tạo ra logo phản ánh linh hồn thương hiệu.<br/>Tại sao chọn dịch vụ thiết kế logo của Andrea?<br/><ul class="list-disc pl-6 ml-0"><li>Logo sáng tạo: Được phát triển dựa trên câu chuyện, tầm nhìn và bản sắc thương hiệu.</li><li>Thiết kế phù hợp với xu hướng: Dễ nhận diện, đơn giản nhưng tinh tế.</li><li>Đa dạng ứng dụng: Đáp ứng mọi nền tảng từ digital, in ấn, đến thương mại.</li><li>Bàn giao đầy đủ định dạng: PNG, AI, PDF, JPG.</li></ul>',
          },
          {
            id: '04',
            title: 'Thiết Kế Bộ Nhận Diện Thương Hiệu',
            image: '/assets/images/services/thietkethuonghieu/thietke5.png',
            body: 'Andrea thiết kế bộ nhận diện thương hiệu gồm:<br/><ul class="list-disc pl-6 ml-0"><li>Logo – Danh thiếp – Letterhead – Bao thư – Folder.</li><li>Template mạng xã hội, brochure, standee, backdrop.</li><li>Bao bì sản phẩm, tem nhãn, đồng phục nhân viên.</li><li>Brand Guidelines chi tiết để duy trì sự nhất quán.</li><li>Các hạng mục sẽ được tư vấn phù hợp với ngành nghề và phục vụ cho kinh doanh và Marketing thương hiệu.</li></ul>',
          },
        ],
      },
      whyProfessionalSimple: {
        items: [
          {
            title: 'Andrea – Thương hiệu không chỉ đẹp mà còn có hồn',
            image: '/assets/images/services/thietkethuonghieu/thietke10.png',
          },
          {
            title: 'Bạn cần gì ngay bây giờ?',
            image: '/assets/images/services/thietkethuonghieu/thietke11.png',
            body: '<ul class="text-[#7D7D7D] list-disc pl-6 ml-0"><li>Một đội ngũ hiểu thương hiệu như hiểu chính mình?</li><li>Một bộ nhận diện vừa đẹp, vừa có chiều sâu?</li><li>Một logo và slogan tạo cảm xúc và kết nối khách hàng?</li></ul>',
          },
          {
            title:
              'Mỗi thương hiệu là một linh hồn, một hành trình, một câu chuyện cần được kể đúng cách và chúng tôi giúp bạn kể điều đó bằng hình ảnh.',
            image: '/assets/images/services/thietkethuonghieu/thietke12.png',
          },
        ],
      },
      quote: {
        text: 'Một thương hiệu mạnh luôn cần hệ thống nhận diện đồng bộ, chuyên nghiệp và khác biệt.',
      },
      quoteTwo: {
        text: 'Andrea là sự kết hợp giữa nghệ thuật trực giác và kỹ năng triển khai chiến lược thương hiệu chuyên nghiệp.',
        image: '/assets/images/services/thietkethuonghieu/thietke7.png',
      },
      quoteThree: {
        text: 'Một thương hiệu mạnh luôn cần hệ thống nhận diện đồng bộ, chuyên nghiệp và khác biệt.',
        image: '/assets/images/services/thietkethuonghieu/thietke8.png',
      },
      image: '/assets/images/services/thietkethuonghieu/thietke9.png',
      process: {
        title: 'Quy trình tiến hành dự án của Andrea',
        steps: [
          {
            id: 1,
            title: 'Lắng nghe & khai vấn thương hiệu',
            bullets: [
              'Hiểu đúng  giá trị cốt lõi, cảm xúc, mục tiêu & bản sắc thương hiệu qua các buổi đối thoại với Ban lãnh đạo doanh nghiệp hoặc thông qua bản định hướng những nhu cầu và mong muốn rõ từ Ban lãnh đạo doanh nghiệp.',
            ],
          },
          {
            id: 2,
            title: 'Phân tích và phát triển concept thị giác/ Lên moodboard',
            bullets: [
              'Gợi mở hình tượng biểu trưng, bảng màu, phong cách hình ảnh,chất liệu thiết kế và phong cách thể hiện phù hợp với Ban lãnh đạo doanh nghiệp',
            ],
          },
          {
            id: 3,
            title: 'Thiết kế các concept ý tưởng',
            bullets: [
              'Gợi mở biểu trưng, bảng màu, phong cách hình ảnh, chất liệu thiết kế',
            ],
          },
          {
            id: 4,
            title: 'Chỉnh sửa và  hoàn thiện hạng mục',
            bullets: [
              'Triển khai thiết kế chi tiết từng hạng mục, hiệu chỉnh theo phản hồi',
            ],
          },
          {
            id: 5,
            title: 'Chuyển giao & hướng dẫn sử dụng',
            bullets: [
              'Giao file + tài liệu hướng dẫn sử dụng bộ nhận diện & logo chuyên nghiệp',
            ],
          },
        ],
      },
      processTwo: {
        title:
          'Giá trị sản phẩm bạn nhận là một cuốn hướng dẫn sử dụng hình ảnh thương khi thực hiện dịch vụ thiết kế thương hiệu tại Andrea',
        steps: [
          {
            id: 1,
            title: 'Logo',
            bullets: [
              'Logo chính (Master logo)',
              'Logo rút gọn (Icon / Brandmark)',
              'Logo âm bản/dương bản (Phiên bản đen trắng)',
              'Logo các định dạng (JPEG, PNG, PDF, AI, ...)',
            ],
          },
          {
            id: 2,
            title: 'Bộ quy chuẩn logo (Logo Guidelines)',
            bullets: [
              'Tỷ lệ – kích thước tối thiểu',
              'Khoảng cách an toàn (safe zone)',
              'Quy chuẩn màu sắc logo (CMYK, RGB, Pantone, Hex)',
              'Cách sử dụng và không nên sử dụng logo',
              'Font chữ thương hiệu đi kèm logo',
            ],
          },
          {
            id: 3,
            title: 'Bản sắc hình ảnh thương hiệu',
            bullets: [
              'Bảng màu thương hiệu (Color Palette)',
              'Font chữ thương hiệu (Typography)',
              'Phong cách hình ảnh (photography/illustration style)',
              'Texture hoặc Pattern thương hiệu (nếu có)',
              'Icon nhận diện (nếu có)',
            ],
          },
          {
            id: 4,
            title: 'Ứng dụng cơ bản',
            bullets: [
              'Danh thiếp (Business Card)',
              'Giấy tiêu đề (Letterhead)',
              'Phong bì thư (Envelope)',
              'Folder hồ sơ (Company Folder)',
              'Email Signature',
            ],
          },
          {
            id: 5,
            title: 'Ứng dụng thương mại & marketing',
            bullets: [
              'Clip intro logo',
              'Bao bì sản phẩm (Packaging)',
              'Tem nhãn, thẻ treo sản phẩm',
              'Túi giấy, hộp đựng hàng, standee, Poster, Brochure...',
              'Template mạng xã hội (Facebook, Instagram...)',
              'Background Zoom / Slide PowerPoint',
              'Mascot (nếu có)',
            ],
          },
          {
            id: 6,
            title: 'Ứng dụng nội bộ & văn phòng',
            bullets: [
              'Đồng phục nhân viên. Thẻ nhân viên. Huy hiệu cài áo',
              'Biển bản biển phòng (Signage)',
              'Mẫu phiếu, biểu mẫu nội bộ',
            ],
          },
          {
            id: 7,
            title: 'Brand Guidelines (Sổ tay thương hiệu)',
            bullets: [
              'Tổng hợp toàn bộ tài liệu hướng dẫn sử dụng thương hiệu một cách đồng bộ, chuyên nghiệp, dễ triển khai.',
            ],
          },
        ],
      },
      final: {
        title: 'Khác biệt khi thiết kế thương hiệu tại Andrea',
        highlights: [
          'Ứng dụng thương hiệu (Brand Applications).',
          'Chiến lược thương hiệu (Brand Strategy).',
          'Tính cách và Giọng nói thương hiệu (Brand Personality & Tone of Voice).',
          'Quy chuẩn thương hiệu (Brand Guidelines).',
        ],
      },
    };

    return { servicesData };
  });
