'use client';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import { useImageDimensions } from '@/hooks/useImageDimensions';

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
              className={`flex flex-col items-center gap-8 border-black/20 max-md:gap-0 lg:gap-[8rem] ${
                isLast ? '' : 'lg:border-b'
              } ${isReverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
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
              <div className="flex flex-1 items-stretch">
                <div className="relative h-full w-full">
                  <ResponsiveImage
                    className={clsx(
                      isReverse ? 'justify-start' : 'justify-end'
                    )}
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

function ResponsiveImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const { width, height, aspectRatio, isLoading, error } =
    useImageDimensions(src);

  if (isLoading) {
    return (
      <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-200">
        <div className="h-64 w-full rounded bg-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-200">
        <span className="text-sm text-gray-400">Error loading image</span>
      </div>
    );
  }

  // Calculate responsive dimensions
  const getResponsiveDimensions = () => {
    // Base width for different screen sizes
    const baseWidth = 400; // Base width for desktop
    const maxWidth = 600; // Maximum width
    const minWidth = 280; // Minimum width for mobile

    // Calculate width based on aspect ratio
    let calculatedWidth = Math.min(maxWidth, Math.max(minWidth, baseWidth));

    // For very wide images, reduce the width
    if (aspectRatio > 2) {
      calculatedWidth *= 0.8;
    }

    // For very tall images, increase the width slightly
    if (aspectRatio < 0.8) {
      calculatedWidth *= 1.1;
    }

    const calculatedHeight = calculatedWidth / aspectRatio;

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const { width: displayWidth, height: displayHeight } =
    getResponsiveDimensions();

  return (
    <div
      className={clsx(
        'flex w-full items-center max-md:justify-center',
        className
      )}
    >
      <Image
        src={src}
        alt={alt || ''}
        width={displayWidth}
        height={displayHeight}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={clsx('object-contain', className)}
      />
    </div>
  );
}
