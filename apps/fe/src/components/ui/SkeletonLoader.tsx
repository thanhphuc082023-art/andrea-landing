'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'shimmer' | 'pulse';
}

/**
 * Skeleton Loading Component
 * Học từ HeaderVideo.tsx - tạo hiệu ứng loading mượt mà
 * 
 * Cách sử dụng:
 * 1. Tạo ref: const skeletonRef = useRef<HTMLDivElement>(null);
 * 2. Thêm component: <SkeletonLoader ref={skeletonRef} />
 * 3. Ẩn khi load xong: skeletonRef.current?.classList.add('hidden');
 */
const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ className, variant = 'shimmer' }, ref) => {
    return (
      <>
        <div
          ref={ref}
          className={clsx(
            'pointer-events-none absolute inset-0 z-10',
            className
          )}
          aria-hidden="true"
          style={
            variant === 'shimmer'
              ? {
                  background:
                    'linear-gradient(90deg, #e0e0e0 10%, #f5f5f5 20%, #e0e0e0 30%, #e0e0e0 40%, #f5f5f5 50%, #e0e0e0 60%, #e0e0e0 70%, #f5f5f5 80%, #e0e0e0 90%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite',
                }
              : {
                  backgroundColor: '#e0e0e0',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }
          }
        />

        {/* Animation CSS */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </>
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;

