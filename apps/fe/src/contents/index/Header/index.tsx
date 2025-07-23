import clsx from 'clsx';

import HeaderVideo from '@/contents/index/Header/HeaderVideo';
import NewHeaderTitle from '@/contents/index/Header/NewHeaderTitle';
import type { StrapiGlobal } from '@/types/strapi';

interface HeaderProps {
  serverGlobal?: StrapiGlobal;
}

function Header({ serverGlobal = null }: HeaderProps) {
  return (
    <header
      id="page-header"
      className={clsx('relative overflow-hidden', 'max-sd:mt-[60px] mt-20')}
    >
      <HeaderVideo
        videoSrc="https://andrea.vn/uploads/videos/intro-website_3.mp4"
        serverGlobal={serverGlobal}
      />

      {/* Content */}
      <div
        className={clsx(
          'max-sd:pt-[105px] relative z-10 pt-[116px] max-md:pt-[84px]'
        )}
      >
        <div className={clsx('content-wrapper mx-auto')}>
          <div
            className={clsx(
              'max-sd:px-[30px] relative flex flex-wrap items-center justify-between gap-[30px] px-[70px] max-lg:justify-center max-lg:gap-[10px] max-lg:px-0 lg:flex-nowrap'
            )}
          >
            {/* Title positioned like in Figma: left side */}
            <div className={clsx('')}>
              <NewHeaderTitle />
            </div>

            {/* Description luôn bên phải, mọi màn hình */}
            <div className={clsx('max-w-xl')}>
              <div
                className={clsx(
                  'font-sans text-base font-[400] text-black',
                  'leading-[26px] max-lg:text-center dark:text-slate-300'
                )}
              >
                <p className="font-normal">
                  Agency tư vấn và thiết kế thương hiệu sáng tạo, đa lĩnh vực,
                  cung cấp các giải pháp thiết kế thương hiệu chuyên sâu, với
                  đội ngũ nhân sự giàu kinh nghiệm, quy trình làm việc rõ ràng
                  và chuyên nghiệp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
