import Image from 'next/image';
import React from 'react';

export default function WhyProfessionalSection({ data }: any) {
  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <h2 className="text-brand-orange font-playfair mb-8 text-left text-[40px] font-medium !leading-[60px] max-md:text-[27px] max-md:!leading-[40px]">
        Vì sao doanh nghiệp cần thiết kế
        <br />
        bao bì chuyên nghiệp?
      </h2>

      <div className="grid grid-cols-1">
        {/* Item 01 */}
        <div className="flex flex-col items-center gap-8 border-black/20 md:flex-row lg:gap-[8rem] lg:border-b">
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-[456px] max-sm:max-w-full">
              <div className="font-playfair text-[100px] font-light leading-[50px] tracking-[-5px] text-[#D9D9D9]">
                {data?.items?.[0]?.id || '01'}
              </div>
              <h3 className="max-sd:mt-8 mb-3 mt-10 text-[24px] font-semibold">
                {data?.items?.[0]?.title ||
                  'Tăng khả năng nhận diện thương hiệu'}
              </h3>
              <p className="text-[16px] leading-relaxed">
                {data?.items?.[0]?.body ||
                  'Bao bì truyền tải màu sắc, cảm xúc và thông điệp rõ ràng về thương hiệu.'}
              </p>
            </div>
          </div>

          <div className="relative aspect-[375/300] min-h-[300px] w-full max-w-[530px] shrink-0 overflow-hidden md:aspect-[530/351]">
            <Image
              src="/assets/images/services/baobi/baobi2.png"
              alt="Colorful soap products"
              fill
              sizes="(min-width: 1024px) 530px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Item 02 */}
        <div className="flex flex-col items-center gap-8 border-black/20 md:flex-row-reverse lg:gap-[8rem] lg:border-b">
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-[456px] max-lg:mt-4 max-sm:max-w-full">
              <div className="font-playfair text-[100px] font-light leading-[50px] tracking-[-5px] text-[#D9D9D9]">
                {data?.items?.[1]?.id || '02'}
              </div>
              <h3 className="mb-3 mt-10 text-[24px] font-semibold">
                {data?.items?.[1]?.title || 'Tạo sự khác biệt trên thị trường'}
              </h3>
              <p className="text-[16px] leading-relaxed">
                {data?.items?.[1]?.body ||
                  'Với thiết kế bao bì độc đáo, sáng tạo giúp sản phẩm nổi bật và khác biệt.'}
              </p>
            </div>
          </div>
          <div className="relative aspect-[375/300] w-full max-w-[530px] shrink-0 overflow-hidden md:aspect-[530/351]">
            <Image
              src="/assets/images/services/baobi/baobi3.png"
              alt="Tech product packaging"
              fill
              sizes="(min-width: 1024px) 530px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Item 03 */}
        <div className="flex flex-col items-center gap-8 border-black/20 md:flex-row lg:gap-[8rem] lg:border-b">
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-[456px] max-lg:mt-4 max-sm:max-w-full">
              <div className="font-playfair text-[100px] font-light leading-[50px] tracking-[-5px] text-[#D9D9D9]">
                {data?.items?.[2]?.id || '03'}
              </div>
              <h3 className="max-sd:mt-8 mb-3 mt-10 text-[24px] font-semibold">
                {data?.items?.[2]?.title || 'Truyền tải câu chuyện & định vị'}
              </h3>
              <p className="text-[16px] leading-relaxed">
                {data?.items?.[2]?.body ||
                  'Bao bì là phương tiện truyền tải câu chuyện thương hiệu và định vị sản phẩm trên thị trường một cách hiệu quả.'}
              </p>
            </div>
          </div>

          <div className="relative aspect-[375/300] w-full max-w-[530px] shrink-0 overflow-hidden md:aspect-[530/351]">
            <Image
              src="/assets/images/services/baobi/baobi4.png"
              alt="Shopping bags with branding"
              fill
              sizes="(min-width: 1024px) 530px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Item 04 */}
        <div className="flex flex-col items-center gap-8 border-black/20 md:flex-row-reverse lg:gap-[8rem] lg:border-b">
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-[456px] max-lg:mt-4 max-sm:max-w-full">
              <div className="font-playfair text-[100px] font-light leading-[50px] tracking-[-5px] text-[#D9D9D9]">
                {data?.items?.[3]?.id || '04'}
              </div>
              <h3 className="max-sd:mt-8 mb-3 mt-10 text-[24px] font-semibold">
                {data?.items?.[3]?.title || 'Tăng lợi nhuận cạnh tranh'}
              </h3>
              <p className="text-[16px] leading-relaxed">
                {data?.items?.[3]?.body ||
                  'Thiết kế bao bì chuyên nghiệp giúp tăng giá trị sản phẩm và lợi nhuận cạnh tranh trên thị trường.'}
              </p>
            </div>
          </div>
          <div className="relative aspect-[375/300] w-full max-w-[530px] shrink-0 overflow-hidden md:aspect-[530/351]">
            <Image
              src="/assets/images/services/baobi/baobi5.png"
              alt="Coffee packaging design"
              fill
              sizes="(min-width: 1024px) 530px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
