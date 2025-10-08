import clsx from 'clsx';

function BrandSection({ title = '', description = '' }: any) {
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
            'max-sd:mb-2 max-sd:text-[40px] max-sd:leading-[55px] font-medium max-md:text-[34px] max-md:leading-[40px]'
          )}
        >
          <div dangerouslySetInnerHTML={{ __html: title }} />
        </h2>
        {description ? (
          <>
            {/* Decorative Line */}
            <div className={clsx('my-3 flex justify-center md:my-5')}>
              <div
                className={clsx('h-0.5 w-32 md:w-40 lg:w-44', 'bg-[#979797]')}
              />
            </div>

            {/* Description */}
            <div
              className={clsx(
                'font-playfair text-[24px] text-black md:text-[30px]',
                'max-sd:leading-[36px] font-medium leading-[55px] tracking-wide',
                'mx-auto max-w-[644px]'
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default BrandSection;
