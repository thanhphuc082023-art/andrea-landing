'use client';

import BrandSection from '@/components/services/BrandSection';
import Divider from '@/components/services/Divider';
import Image from 'next/image';

export default function SupermarketContent({ data }: any) {
  const subheadingHtml = data?.subheading || '';
  return (
    <>
      {/* Supermarket Section */}
      <section className="content-wrapper my-[56px] max-md:my-[29px]">
        <BrandSection title={data.title} description={data.description} />

        {/* Section one */}
        <div className="max-md:hidden">
          <Divider />
        </div>

        <div className="max-sd:gap-[35px] my-[60px] flex flex-col items-center gap-[67px] lg:flex-row">
          <div className="w-full max-md:w-[calc(100%+58px)] lg:w-1/2">
            <div className="max-sd:aspect-video max-sd:max-w-full max-sd:h-auto relative aspect-[594/410] h-[410px] w-full max-w-[594px] overflow-hidden">
              <Image
                src={data?.image || '/assets/images/services/baobi/baobi1.png'}
                alt={data?.heading || 'Supermarket aisle with products'}
                fill
                sizes="(min-width: 1024px) 512px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
          <div className="lg:w-1/2">
            {data?.heading && (
              <div className="text-[16px] leading-relaxed text-[#3F3F3F]">
                {data?.heading}
              </div>
            )}
            <div
              className="max-sd:mt-0 mt-8 text-[16px] leading-relaxed text-[#3F3F3F]"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: subheadingHtml }}
            />
          </div>
        </div>

        <Divider />
        {/* Section one */}
      </section>
    </>
  );
}
