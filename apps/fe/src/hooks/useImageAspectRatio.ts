import { useState, useEffect } from 'react';

interface ImageAspectRatio {
  width: number;
  height: number;
  aspectRatio: number;
}

interface UseImageAspectRatioReturn {
  aspectRatio: number | null;
  dimensions: ImageAspectRatio | null;
  loading: boolean;
  error: string | null;
}

export function useImageAspectRatio(src: string): UseImageAspectRatioReturn {
  const [dimensions, setDimensions] = useState<ImageAspectRatio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    const img = new Image();

    const handleLoad = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const imageData = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio,
      };

      setDimensions(imageData);
      setLoading(false);
      setError(null);
    };

    const handleError = () => {
      setError('Failed to load image');
      setLoading(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return {
    aspectRatio: dimensions?.aspectRatio || null,
    dimensions,
    loading,
    error,
  };
}
