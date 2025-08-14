import clsx from 'clsx';

import HeaderVideo from '@/contents/index/Header/HeaderVideo';
import NewHeaderTitle from '@/contents/index/Header/NewHeaderTitle';

interface HeaderProps {
  heroData?: any;
}

function Header({ heroData = null }: HeaderProps) {
  const heroTitle = heroData?.slogan?.title || 'Xin chào!';
  const heroSubTitle =
    heroData?.slogan?.subTitle || 'Chúng tôi là Andrea Agency';
  const heroDescription =
    heroData?.slogan?.description ||
    `Andrea là Agency tư vấn và thiết kế thương hiệu sáng tạo, chuyên sâu và giàu cảm xúc. Hơn 10 năm kinh nghiệm, với đam mê và tình yêu chúng tôi không chỉ muốn tạo ra logo hay bộ nhận diện mà giúp thương hiệu kết nối với bản chất thật của mình.
    Chúng tôi tin rằng một thương hiệu có hồn có cảm xúc bắt đầu từ sự thấu hiểu con người, trực giác thiết kế và chiến lược thương hiệu sâu sắc kết hợp với sự thực thi và nội lực mạnh mẽ sẽ giúp thương hiệu phát triển bền vững.`;

  return (
    <header
      id="page-header"
      className={clsx('relative overflow-hidden', 'max-sd:mt-[60px] mt-[65px]')}
    >
      <HeaderVideo heroData={heroData} />

      {/* Content */}
      <div
        className={clsx(
          'relative z-10 flex min-h-[509px] items-center py-[50px]'
        )}
      >
        <div className={clsx('content-wrapper mx-auto')}>
          <div
            className={clsx(
              'relative flex flex-wrap items-center justify-between space-x-[120px] max-lg:justify-center max-lg:space-x-[10px] max-lg:px-0 max-md:space-x-0 max-md:space-y-[20px] lg:flex-nowrap'
            )}
          >
            {/* Title positioned like in Figma: left side */}
            <div className={clsx('')}>
              <NewHeaderTitle title={heroTitle} subTitle={heroSubTitle} />
            </div>

            {/* Description luôn bên phải, mọi màn hình */}
            <div className={clsx('max-w-[566px]')}>
              <div
                className={clsx(
                  'font-sans text-base font-[400] text-black',
                  'leading-[26px] max-lg:text-center dark:text-slate-300',
                  'whitespace-pre-line'
                )}
              >
                <p className="font-normal">{heroDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
