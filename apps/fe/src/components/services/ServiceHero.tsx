import Image from 'next/image';

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
  return (
    <div className={`w-full ${className}`}>
      <div className="relative aspect-[430/342] w-full overflow-hidden md:aspect-[1440/401]">
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
      </div>
    </div>
  );
}
