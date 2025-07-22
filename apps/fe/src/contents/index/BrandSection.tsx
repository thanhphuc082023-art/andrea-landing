import clsx from 'clsx';

function BrandSection() {
  return (
    <section
      className={clsx(
        'max-sd:h-[500px] relative flex h-[600px] items-center justify-center',
        'bg-text-primary' // #1A253A
      )}
    >
      <div className={clsx('content-wrapper')}>
        <div className={clsx('text-center leading-[70px]')}>
          {/* Main Title - Andrea */}
          <h2
            className={clsx(
              'font-playfair max-sd:text-[65px] text-[85px] text-white max-md:text-[55px]',
              'font-medium max-md:mb-2'
            )}
          >
            Andrea
          </h2>

          {/* Subtitle */}
          <h3
            className={clsx(
              'font-playfair max-sd:text-[28px] max-md: text-[35px] text-white',
              'mb-6 font-medium md:mb-8',
              'max-sd:leading-[60px] leading-[80px] max-md:leading-[45px]'
            )}
          >
            Tư vấn & thiết kế <br className="hidden max-md:block" /> thương hiệu{' '}
            <span className="text-brand-orange max-sd:text-[40px] max-md: text-[55px] italic">
              Cảm xúc
            </span>
          </h3>

          {/* Decorative Line */}
          <div className={clsx('mb-6 flex justify-center md:mb-8')}>
            <div
              className={clsx(
                'h-0.5 w-32 md:w-40 lg:w-44',
                'bg-brand-orange' // #F15A24 matches the orange line in design
              )}
            />
          </div>

          {/* Description */}
          <p
            className={clsx(
              'font-playfair text-lg text-white md:text-xl lg:text-[24px]',
              'max-sd:leading-[32px] font-medium leading-[39px] tracking-wide',
              'mx-auto max-w-md'
            )}
          >
            Kết nối bản sắc
            <br />
            Kiến tạo hình ảnh.
            <br />
            Nâng tầm giá trị thương hiệu
          </p>
        </div>
      </div>
    </section>
  );
}

export default BrandSection;
