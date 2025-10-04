'use client';

import StrategyImageSection from './StrategyImageSection';
import { useImageAspectRatio } from '../../hooks/useImageAspectRatio';

interface Service {
  id: string;
  title: string;
  description: {
    type: string;
    content?: string;
    src?: string;
    alt?: string;
  }[];
}

interface Props {
  data: Service[];
}

export default function StrategyServicesSection({ data }: Props) {
  if (!data) return null;

  // Lấy tất cả image sources để check loading state
  const allImageSources = data.flatMap(
    (service) =>
      service.description
        ?.filter((item) => item.type === 'image' && item.src)
        .map((item) => item.src) || []
  );

  // Check loading state của tất cả images
  const imageLoadingStates = allImageSources.map((src) =>
    useImageAspectRatio(src || '')
  );
  const isAnyImageLoading = imageLoadingStates.some((state) => state.loading);
  const hasAnyImageError = imageLoadingStates.some((state) => state.error);

  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      {isAnyImageLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      )}

      {hasAnyImageError && !isAnyImageLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center text-gray-500">
            <p>Không thể tải một số hình ảnh</p>
          </div>
        </div>
      )}

      {!isAnyImageLoading && !hasAnyImageError && (
        <>
          {data?.map((service, index) => (
            <div key={index} className="flex items-start gap-4 max-md:flex-col">
              {service.id && (
                <div className="font-playfair flex items-center justify-start text-[100px] font-light leading-[50px] tracking-[-5px] text-[#D9D9D9]">
                  {service.id}
                </div>
              )}
              <div className="flex-1">
                <div dangerouslySetInnerHTML={{ __html: service.title }} />
                {service.description?.map((item, index) => (
                  <div key={index}>
                    {item.type === 'html' && item.content && (
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    )}
                    {item.type === 'image' && item.src && (
                      <StrategyImageSection
                        imageSrc={item.src}
                        alt={item.alt || service.title}
                        className="mt-4"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
