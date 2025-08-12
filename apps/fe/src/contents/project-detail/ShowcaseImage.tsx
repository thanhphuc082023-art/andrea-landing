import Image from 'next/image';

interface ShowcaseImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function ShowcaseImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
}: ShowcaseImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

export default ShowcaseImage;
