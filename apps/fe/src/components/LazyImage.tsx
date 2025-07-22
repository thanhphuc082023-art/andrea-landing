import { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface LazyImageProps extends Omit<ImageProps, 'loading'> {
  loading?: 'lazy' | 'eager';
}

function LazyImage({ loading = 'lazy', ...props }: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return () => {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div ref={imgRef}>
      {isInView && <Image {...props} loading={loading} />}
    </div>
  );
}

export default LazyImage;
