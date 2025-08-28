'use client';
import Image from 'next/image';
import React from 'react';

export default function WhyProfessionalSection({ data }: any) {
  const items = data?.items || [];

  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <h2 className="text-brand-orange font-playfair mb-8 text-left text-[40px] font-medium !leading-[60px] max-md:text-[27px] max-md:!leading-[40px]">
        <div
          className=""
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: data?.title || '' }}
        />
      </h2>

      <div className="grid grid-cols-1">
        {items.map((item: any, idx: number) => {
          const isReverse = idx % 2 === 1;
          const isLast = idx === items.length - 1;

          return (
            <div
              key={item?.id || idx}
              className={`flex flex-col items-stretch gap-8 border-black/20 lg:gap-[8rem] ${
                isLast ? '' : 'lg:border-b'
              } ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'} md:items-stretch`}
            >
              <div className="flex flex-1 items-center py-8">
                <div className="max-sm:max-w-full">
                  <div className="font-playfair text-[100px] font-light leading-[50px] tracking-[-5px] text-[#D9D9D9]">
                    {item?.id || String(idx + 1).padStart(2, '0')}
                  </div>
                  <h3 className="max-sd:mt-8 mb-3 mt-10 text-[24px] font-semibold">
                    {item?.title || ''}
                  </h3>
                  {item?.body && (
                    <div
                      dangerouslySetInnerHTML={{ __html: item?.body || '' }}
                    />
                  )}
                </div>
              </div>

              {/* Image column: stretch to the same height as the text column */}
              <div className="flex min-h-[380px] flex-1 items-stretch">
                <div className="relative h-full w-full">
                  <ResponsiveImage
                    src={
                      item?.image || '/assets/images/services/baobi/baobi2.png'
                    }
                    alt={item?.title || 'Why professional image'}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ResponsiveImage({ src, alt }: { src: string; alt?: string }) {
  // Render Image with fill so it always covers the parent height
  // Parent must provide a height (we use h-full on parent wrapper)
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt || ''}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
