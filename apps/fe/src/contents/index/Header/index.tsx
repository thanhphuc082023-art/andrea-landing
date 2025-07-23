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
    'Agency tư vấn và thiết kế thương hiệu sáng tạo, đa lĩnh vực, cung cấp các giải pháp thiết kế thương hiệu chuyên sâu, với đội ngũ nhân sự giàu kinh nghiệm, quy trình làm việc rõ ràng và chuyên nghiệp.';

  return (
    <header
      id="page-header"
      className={clsx('relative overflow-hidden', 'max-sd:mt-[60px] mt-20')}
    >
      <HeaderVideo heroData={heroData} />

      {/* Content */}
      <div
        className={clsx(
          'max-sd:pt-[105px] relative z-10 pt-[116px] max-md:pt-[84px]'
        )}
      >
        <div className={clsx('content-wrapper mx-auto')}>
          <div
            className={clsx(
              'max-sd:px-[30px] relative flex flex-wrap items-center justify-between gap-[60px] px-[70px] max-lg:justify-center max-lg:gap-[10px] max-lg:px-0 lg:flex-nowrap'
            )}
          >
            {/* Title positioned like in Figma: left side */}
            <div className={clsx('')}>
              <NewHeaderTitle title={heroTitle} subTitle={heroSubTitle} />
            </div>

            {/* Description luôn bên phải, mọi màn hình */}
            <div className={clsx('max-w-[505px]')}>
              <div
                className={clsx(
                  'font-sans text-base font-[400] text-black',
                  'leading-[26px] max-lg:text-center dark:text-slate-300'
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
