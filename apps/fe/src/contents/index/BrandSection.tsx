import clsx from 'clsx';

interface BrandSectionProps {
  brandSectionData?: any;
}

function BrandSection({ brandSectionData = null }: BrandSectionProps) {
  // Extract data with fallbacks
  const title = brandSectionData?.title || 'Andrea';
  const subtitleMarkdown =
    brandSectionData?.subtitle ||
    `Tư vấn & thiết kế <br /> thương hiệu <strong>Cảm xúc</strong>`;

  // Enhanced markdown parser: only <br /> and <strong>...</strong>
  const parseMarkdown = (text: string) => {
    // Only accept <br /> (not <br>) and <strong>...</strong>
    const withBreaks = text.replace(/<br\s*\/>/g, '<BREAK>');
    // Split by <strong>...</strong> and <BREAK>
    const parts = withBreaks.split(/(<strong>.*?<\/strong>|<BREAK>)/g);

    return parts.map((part, index) => {
      if (!part) return null;
      if (part === '<BREAK>') {
        return <br className="hidden max-md:block" key={index + 1} />;
      }
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        const content = part.slice(8, -9); // 8 for <strong>, -9 for </strong>
        return (
          <span
            key={index + 1}
            className="text-brand-orange max-sd:!text-[40px] max-370:!text-[30px] !text-[55px] italic"
          >
            {content}
          </span>
        );
      }
      return <span key={index + 1}>{part}</span>;
    });
  };

  const brandSlogan = brandSectionData?.brandSlogan || [
    { label: 'Kết nối bản sắc' },
    { label: 'Kiến tạo hình ảnh' },
    { label: 'Nâng tầm giá trị thương hiệu' },
  ];

  return (
    <section
      className={clsx(
        'max-sd:h-[500px] relative flex h-[509px] items-center justify-center',
        'bg-text-primary' // #1A253A
      )}
    >
      <div className={clsx('content-wrapper')}>
        <div className={clsx('text-center leading-[70px]')}>
          {/* Main Title - Andrea */}
          <h2
            className={clsx(
              'font-playfair max-sd:text-[65px] text-[85px] text-white max-md:text-[55px]',
              'max-370:!text-[40px] max-370:leading-[55px] font-medium max-md:mb-2'
            )}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <h3
            className={clsx(
              'font-playfair max-sd:text-[28px] text-white',
              'mb-6 font-medium md:mb-8',
              'max-sd:leading-[60px] max-370:text-[20px] max-370:leading-[30px] text-[35px] leading-[80px] max-md:leading-[45px]'
            )}
          >
            {parseMarkdown(subtitleMarkdown)}
          </h3>

          {/* Decorative Line */}
          {brandSlogan?.length > 0 && (
            // Only render the line if there are slogans
            <div className={clsx('mb-6 flex justify-center md:mb-8')}>
              <div
                className={clsx(
                  'h-0.5 w-32 md:w-40 lg:w-44',
                  'bg-brand-orange' // #F15A24 matches the orange line in design
                )}
              />
            </div>
          )}

          {/* Description */}
          <p
            className={clsx(
              'font-playfair text-lg text-white md:text-xl lg:text-[24px]',
              'max-sd:!leading-[39px] font-medium !leading-[39px] tracking-wide',
              'mx-auto max-w-md'
            )}
          >
            {brandSlogan.map((slogan, index) => (
              <span key={index + 1}>
                {slogan?.label}
                {index < brandSlogan.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

export default BrandSection;
