import clsx from 'clsx';

function BrandSection({ title = '', description = '' }: any) {
  // Extract data with fallbacks

  return (
    <section
      className={clsx(
        'relative mb-[56px] flex h-[300px] items-center justify-center max-md:mb-[29px] max-md:h-auto'
      )}
    >
      <div className={clsx('w-full text-center leading-[70px]')}>
        {/* Main Title - Andrea */}
        <h2
          className={clsx(
            'font-playfair max-sd:text-[40px] text-brand-orange text-[55px]',
            'max-370:!text-[40px] max-370:leading-[55px] font-medium max-md:mb-2'
          )}
        >
          {title}
        </h2>

        {/* Decorative Line */}
        <div className={clsx('my-3 flex justify-center md:my-5')}>
          <div className={clsx('h-0.5 w-32 md:w-40 lg:w-44', 'bg-[#979797]')} />
        </div>

        {/* Description */}
        <p
          className={clsx(
            'font-playfair text-[27px] text-black md:text-xl lg:text-[30px]',
            'max-sd:!leading-[40px] font-medium !leading-[55px] tracking-wide',
            'mx-auto max-w-[644px]'
          )}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

export default BrandSection;
