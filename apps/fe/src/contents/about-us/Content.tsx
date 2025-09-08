import Image from 'next/image';
import { AboutUsContent } from '@/types/about-us';

interface ContentSectionProps {
  content?: AboutUsContent;
  heroImage?: {
    url: string;
    alternativeText?: string;
  };
}

export default function ContentSection({ content }: ContentSectionProps) {
  // Use default content if not provided from Strapi
  const defaultContent: AboutUsContent = {
    introduction:
      'Kính gửi Quý khách hàng thân mến, Andrea là Agency chuyên cung cấp dịch vụ tư vấn và thiết kế thương hiệu. Chúng tôi luôn xem mình là người bạn đồng hành thấu hiểu, sẵn sàng lắng nghe và chia sẻ để mang đến những giải pháp tối ưu cho sự phát triển của doanh nghiệp. Với sự tận tâm trong quá trình tư vấn và trách nhiệm trong từng sản phẩm thiết kế, Andrea luôn hướng tới tạo nên những hình ảnh thương hiệu không chỉ đẹp mắt mà còn phản ánh đúng cá tính, phù hợp định hướng kinh doanh và chạm đến cảm xúc khách hàng. Thương hiệu không chỉ là hình ảnh nhận diện, mà còn mang trong mình giá trị cảm xúc, ý nghĩa nhân văn và khát vọng vươn xa. Andrea đồng hành cùng doanh nghiệp để xây dựng hệ sinh thái bền vững, góp phần tạo ra nhiều cơ hội việc làm và lan tỏa những giá trị tốt đẹp cho cộng đồng. Đó cũng chính là thành công lớn nhất mà Andrea luôn hướng tới và định vị mình trong hành trình phát triển Trân trọng cảm ơn Quý khách đã tin tưởng và đồng hành cùng Andrea. Andrea Agency!',
    signature: 'Andrea Agency!',
    image: {
      url: '/assets/images/about-us/content.png',
      alternativeText: 'Andrea agency hexagonal logo with decorative branches',
    },
  };

  const finalContent = content || defaultContent;

  // Handle image URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  const imageUrl = finalContent?.image?.url;
  const finalImageUrl = imageUrl?.startsWith('http')
    ? imageUrl
    : `${strapiUrl}${imageUrl || '/assets/images/about-us/content.png'}`;

  const imageAlt =
    finalContent?.image?.alternativeText ||
    'Andrea agency hexagonal logo with decorative branches';

  return (
    <div className="content-wrapper py-[140px] max-md:py-[67px]">
      <div className="flex flex-wrap items-center justify-center gap-12 max-md:flex-col lg:gap-[130px]">
        {/* Left side - Image */}
        <div className="aspect-[420/490] w-full max-w-md shrink-0">
          <Image
            src={finalImageUrl}
            alt={imageAlt}
            width={420}
            height={490}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="flex-1 space-y-6">
          <p
            className="leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: finalContent.introduction }}
          />
          {finalContent.signature && (
            <p
              className="font-medium leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: finalContent.signature }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
