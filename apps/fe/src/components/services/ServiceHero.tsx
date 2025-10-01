import Image from 'next/image';
import { useImageAspectRatio } from '../../hooks/useImageAspectRatio';
import { useState, useEffect } from 'react';

type Props = {
  desktopSrc: string;
  mobileSrc?: string;
  alt?: string;
  className?: string;
};

export default function ServiceHero({
  desktopSrc,
  mobileSrc,
  alt = 'Services',
  className = '',
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const desktopAspectRatio = useImageAspectRatio(desktopSrc);
  const mobileAspectRatio = useImageAspectRatio(mobileSrc || '');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sử dụng aspect ratio của ảnh mobile nếu có, ngược lại dùng desktop
  const currentAspectRatio =
    isMobile && mobileAspectRatio.aspectRatio
      ? mobileAspectRatio.aspectRatio
      : desktopAspectRatio.aspectRatio;

  // Kiểm tra loading state
  const isLoading = isMobile
    ? mobileSrc
      ? mobileAspectRatio.loading
      : desktopAspectRatio.loading
    : desktopAspectRatio.loading;

  // Kiểm tra error state
  const hasError = isMobile
    ? mobileSrc
      ? mobileAspectRatio.error
      : desktopAspectRatio.error
    : desktopAspectRatio.error;

  // Fallback aspect ratio nếu không lấy được dimensions
  const aspectRatio = currentAspectRatio || (isMobile ? 430 / 342 : 1440 / 401);

  // Tạo style cho aspect ratio động
  const containerStyle = {
    aspectRatio: aspectRatio.toString(),
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full overflow-hidden" style={containerStyle}>
         {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <p>Không thể tải ảnh</p>
              <p className="text-sm">{hasError}</p>
            </div>
          </div>
        )}

        {!isLoading && !hasError && (
          <picture>
            {mobileSrc && (
              <source media="(max-width: 767px)" srcSet={mobileSrc} />
            )}
            <source media="(min-width: 768px)" srcSet={desktopSrc} />
            <Image
              src={desktopSrc}
              alt={alt}
              fill
              sizes="(min-width: 768px) 1440px, 430px"
              className="object-cover"
            />
          </picture>
        )}
      </div>
    </div>
  );
}
