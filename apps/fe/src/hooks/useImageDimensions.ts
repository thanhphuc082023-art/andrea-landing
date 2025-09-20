import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isLoading: boolean;
  error: string | null;
}

export const useImageDimensions = (src: string): ImageDimensions => {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 1,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!src) {
      setDimensions({
        width: 0,
        height: 0,
        aspectRatio: 1,
        isLoading: false,
        error: 'No image source provided',
      });
      return;
    }

    setDimensions((prev) => ({ ...prev, isLoading: true, error: null }));

    const img = new Image();

    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio,
        isLoading: false,
        error: null,
      });
    };

    img.onerror = () => {
      setDimensions({
        width: 0,
        height: 0,
        aspectRatio: 1,
        isLoading: false,
        error: 'Failed to load image',
      });
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return dimensions;
};

export default useImageDimensions;
