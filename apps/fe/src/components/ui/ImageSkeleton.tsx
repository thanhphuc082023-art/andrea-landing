import clsx from 'clsx';

interface ImageSkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  style?: React.CSSProperties;
}

export function ImageSkeleton({
  className,
  width = '100%',
  height = '100%',
  aspectRatio,
  style,
}: ImageSkeletonProps) {
  return (
    <div
      className={clsx(
        'relative animate-pulse overflow-hidden rounded-lg bg-gray-200',
        'dark:bg-gray-700',
        className
      )}
      style={{
        width,
        height,
        aspectRatio,
        ...style,
      }}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />

      {/* Placeholder content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  );
}

// CSS animation for shimmer effect (add to your global CSS)
export const shimmerCSS = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;
