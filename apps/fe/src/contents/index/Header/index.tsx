import clsx from 'clsx';

import HeaderVideo from '@/contents/index/Header/HeaderVideo';
import NewHeaderTitle from '@/contents/index/Header/NewHeaderTitle';
import type { GlobalEntity } from '@/types/strapi';

interface HeaderProps {
  serverGlobal?: GlobalEntity;
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
              'relative flex flex-wrap items-end justify-between gap-[30px] max-md:justify-center max-md:gap-[10px] lg:flex-nowrap'
            )}
          >
            {/* Title positioned like in Figma: left side */}
            <div className={clsx('')}>
              <NewHeaderTitle />
            </div>

            {/* Description luôn bên phải, mọi màn hình */}
            <div className={clsx('mb-5 max-w-xl')}>
              <div
                className={clsx(
                  'font-sans text-base font-[400] text-black',
                  'leading-[26px] max-md:text-center dark:text-slate-300'
                )}
              >
                <p>
                  {`Angency tư vấn, thiết kế sáng tạo đa lĩnh vực, chuyên cung cấp
                  giải pháp thiết kế hình ảnh thương hiệu chất lượng cao, với
                  đội ngũ thiết kế được đào tạo bài bản kết hợp với các cộng sự,
                  chuyên gia uy tín trong ngành, chúng tôi "Andrea" đồng hành
                  cùng bạn xây dựng thương hiệu uy tín và chuyên nghiêp.`}
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
