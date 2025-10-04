'use client';

import Image from 'next/image';
import { useRef } from 'react';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

interface ImageTextSectionProps {
  title?: string;
  image?: string;
  heading?: string;
  subheadingHtml?: string;
  defaultImage?: string;
  defaultAlt?: string;
}

export default function ImageTextSection({
  title,
  image,
  heading,
  subheadingHtml = '',
  defaultImage = '/assets/images/services/baobi/baobi1.png',
  defaultAlt = 'Supermarket aisle with products',
}: ImageTextSectionProps) {
  // Ref để control skeleton loading - học từ HeaderVideo.tsx
  const skeletonRef = useRef<HTMLDivElement | null>(null);

  // Function ẩn skeleton khi image đã load - học từ HeaderVideo.tsx
  const hideSkeleton = () => {
    skeletonRef.current?.classList.add('hidden');
  };

  return (
    <div className="content-wrapper my-[60px] max-md:my-[29px]">
      {title && (
        <h2 className="font-playfair text-brand-orange mb-3 flex max-w-[748px] items-center justify-start text-[40px] font-medium leading-[50px] max-md:max-w-full max-md:text-[27px] max-md:leading-[36px]">
          {title}
        </h2>
      )}
      <div className="max-sd:gap-[35px] flex flex-col items-center gap-[67px] lg:flex-row">
        <div className="w-full max-md:w-[calc(100%+58px)] lg:w-1/2">
          <div className="max-sd:aspect-video max-sd:max-w-full max-sd:h-auto relative aspect-[594/410] h-[410px] w-full max-w-[594px] overflow-hidden">
            {/* Skeleton Loading - sử dụng reusable component */}
            <SkeletonLoader ref={skeletonRef} variant="shimmer" />

            <Image
              src={image || defaultImage}
              alt={heading || defaultAlt}
              fill
              sizes="(min-width: 1024px) 512px, 100vw"
              className="object-contain max-md:object-cover"
              // Ẩn skeleton khi image đã load xong
              onLoadingComplete={hideSkeleton}
              // Ẩn skeleton ngay cả khi có lỗi
              onError={hideSkeleton}
            />
          </div>
        </div>
        <div className="lg:w-1/2">
          {heading && (
            <div className="text-[16px] leading-relaxed text-[#3F3F3F]">
              {heading}
            </div>
          )}
          <div
            className="max-sd:mt-0 mt-8 text-[16px] leading-relaxed text-[#3F3F3F]"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: subheadingHtml }}
          />
        </div>
      </div>
    </div>
  );
}
