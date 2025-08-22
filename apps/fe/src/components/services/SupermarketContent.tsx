import BrandSection from '@/components/services/BrandSection';
import Divider from '@/components/services/Divider';
import Image from 'next/image';

export default function SupermarketContent({ data }: any) {
  return (
    <>
      {/* Supermarket Section */}
      <section className="content-wrapper my-[56px] max-md:my-[29px]">
        <BrandSection />

        {/* Section one */}
        <div className="max-md:hidden">
          <Divider />
        </div>

        <div className="my-[60px] flex flex-col items-center gap-[67px] max-lg:gap-[57px] lg:flex-row">
          <div className="w-full max-md:w-[calc(100%+58px)] lg:w-1/2">
            <div className="max-sd:aspect-square max-sd:max-w-full relative aspect-[594/410] h-[410px] w-full max-w-[594px] overflow-hidden max-sm:aspect-[430/510] max-sm:h-[510px]">
              <Image
                src={data?.image || '/assets/images/services/baobi/baobi1.png'}
                alt={data?.heading || 'Supermarket aisle with products'}
                fill
                sizes="(min-width: 1024px) 512px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            <p className="text-[16px] leading-relaxed text-[#3F3F3F]">
              {data?.heading ||
                'Bao bì là một trong những điểm chạm đầu tiên với khách hàng để tạo ấn tượng và truyền tải bản sắc thương hiệu.'}
            </p>
            <p className="mt-8 text-[16px] leading-relaxed text-[#3F3F3F]">
              {data?.subheading || (
                <>
                  Bao bì cũng là{' '}
                  <span className="font-playfair text-brand-orange text-[20px]">
                    công cụ truyền thông
                  </span>{' '}
                  trực tiếp nhất của thương hiệu. Một thiết kế bao bì chuyên
                  nghiệp, sáng tạo và đúng chiến lược không chỉ bảo vệ sản phẩm
                  mà còn nâng cao giá trị thương hiệu trong mắt người tiêu dùng.
                </>
              )}
            </p>
          </div>
        </div>

        <Divider />
        {/* Section one */}
      </section>
    </>
  );
}
