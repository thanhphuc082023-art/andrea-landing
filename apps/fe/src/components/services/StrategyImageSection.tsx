'use client';

import Image from 'next/image';
import { useImageAspectRatio } from '../../hooks/useImageAspectRatio';

interface StrategyImageSectionProps {
  imageSrc: string;
  alt?: string;
  className?: string;
}

export default function StrategyImageSection({
  imageSrc,
  alt = 'Strategy Image',
  className = '',
}: StrategyImageSectionProps) {
  const { aspectRatio, loading, error } = useImageAspectRatio(imageSrc);

  // Fallback aspect ratio nếu không lấy được
  const finalAspectRatio = aspectRatio || 16 / 9;

  const containerStyle = {
    aspectRatio: finalAspectRatio.toString(),
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative w-full overflow-hidden max-md:mx-[-25px] max-md:w-[calc(100%+50px)]"
        style={containerStyle}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <p>Không thể tải ảnh</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        )}
      </div>
    </div>
  );
}
