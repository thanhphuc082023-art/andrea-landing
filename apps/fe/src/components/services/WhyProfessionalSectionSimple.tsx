'use client';
import Image from 'next/image';
import React from 'react';
import { useImageDimensions } from '@/hooks/useImageDimensions';
import clsx from 'clsx';

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
              <div className="flex flex-1 items-stretch">
                <div className="relative h-full w-full">
                  <ResponsiveImage
                    className={clsx(
                      isReverse ? 'justify-start' : 'justify-end'
                    )}
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

function ResponsiveImage({
  className,
  src,
  alt,
}: {
  className?: string;
  src: string;
  alt?: string;
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
        className="object-contain"
      />
    </div>
  );
}
