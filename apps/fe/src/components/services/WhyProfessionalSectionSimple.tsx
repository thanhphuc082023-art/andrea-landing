'use client';
import Image from 'next/image';
import React from 'react';

export default function WhyProfessionalSectionSimple({ data }: any) {
  const items = data?.items || [];

  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <div className="grid grid-cols-1">
        {items.map((item: any, idx: number) => {
          const isReverse = idx % 2 === 1;

          return (
            <div
              key={item?.id || idx}
              className={`flex items-stretch border-black/20 ${isReverse ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col-reverse md:items-stretch`}
            >
              <div className="flex flex-1 items-center py-8">
                <div className="px-5 max-sm:max-w-full">
                  <h3 className="font-playfair text-brand-orange mb-3 text-[40px] font-semibold">
                    {item?.title || ''}
                  </h3>
                  <div
                    className="text-[16px] leading-relaxed"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: item?.body || '' }}
                  />
                </div>
              </div>

              {/* Image column: stretch to the same height as the text column */}
              <div className="flex min-h-[380px] flex-1 items-stretch">
                <div className="relative h-full w-full">
                  <ResponsiveImage
                    src={item?.image || ''}
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
