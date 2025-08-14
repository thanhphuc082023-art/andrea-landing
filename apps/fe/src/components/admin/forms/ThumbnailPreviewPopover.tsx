import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface ThumbnailPreviewPopoverProps {
  thumbnailUrl?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ThumbnailPreviewPopover({
  thumbnailUrl,
  title,
  description,
  children,
}: ThumbnailPreviewPopoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Popover */}
      {isHovered && thumbnailUrl && (
        <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 transform">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            {/* Arrow */}
            <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 -rotate-45 transform border-l border-t border-gray-200 bg-white"></div>

            {/* Preview Card */}
            <div className="w-[420px]">
              {/* Thumbnail Image */}
              <div className="relative mb-4 h-[300px] w-full overflow-hidden rounded-10">
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>

              {/* Project Info */}
              <div>
                <h4 className="text-text-primary mb-2 text-[22px] font-semibold">
                  {title}
                </h4>
                <p className="text-text-secondary line-clamp-3 text-base font-normal tracking-wide">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
