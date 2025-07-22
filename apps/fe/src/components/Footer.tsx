import clsx from 'clsx';
import {
  AgencyLogo,
  FacebookIcon,
  InstagramIcon,
  PhoneIcon,
  EmailIcon,
  WebsiteIcon,
  NumberDesignElement,
  ZaloIcon,
} from '@/assets/icons';
import {  FaBehance, FaLinkedinIn } from 'react-icons/fa';
import { FaTiktok } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-[#D9D9D980]">
      <div
        className={clsx(
          'content-wrapper relative min-h-[388px] py-[30px] dark:border-slate-800 dark:bg-slate-900'
        )}
      >
        {/* Main content layout */}
        <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className={clsx('lg:col-span-2')}>
            <div className={clsx('')}>
              <AgencyLogo width={136} height={51} />
            </div>
          </div>
          <div className="lg:col-span-3" />
        </div>

        <div className={clsx('grid grid-cols-1 gap-6 lg:grid-cols-5')}>
          {/* Logo và tên công ty */}
          <div className={clsx('flex flex-col justify-between lg:col-span-2')}>
            <p className="text-14 mb-2 font-medium">
              CTY TNHH DỊCH VỤ TRUYỀN THÔNG ANDREA
            </p>

            <div>
              <h2 className={clsx('mb-3 text-sm font-medium text-orange-500')}>
                Kết nối với chúng tôi
              </h2>
              <div className={clsx('flex gap-3')}>
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    'group'
                  )}
                  aria-label="Facebook"
                >
                  <FacebookIcon
                    className={clsx(
                      'h-8 w-8 text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                </a>

                <a
                  href="https://zalo.me/"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx('flex items-center justify-center')}
                  aria-label="Zalo"
                >
                  <ZaloIcon className={clsx('h-8 w-8')} />
                </a>
                <a
                  href="https://www.tiktok.com/@andrea.vn"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-[4px] bg-gray-400',
                    'transition-colors hover:bg-gray-500'
                  )}
                  aria-label="Tiktok"
                >
                  <FaTiktok className={clsx('h-5 w-5 text-white')} />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full bg-gray-400',
                    'transition-colors hover:bg-gray-500'
                  )}
                  aria-label="Instagram"
                >
                  <InstagramIcon className={clsx('h-5 w-5 text-white')} />
                </a>
                <a
                  href="https://behance.net/"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-[4px] bg-gray-400',
                    'transition-colors hover:bg-gray-500'
                  )}
                  aria-label="Behance"
                >
                  <FaBehance className={clsx('h-5 w-5 text-white')} />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-[4px] bg-gray-400',
                    'transition-colors hover:bg-gray-500'
                  )}
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className={clsx('h-5 w-5 text-white')} />
                </a>
              </div>
            </div>
          </div>

          {/* Chi nhánh TP. Hồ Chí Minh */}
          <div className={clsx('lg:col-span-1')}>
            <h3
              className={clsx(
                'text-sm font-medium text-slate-900',
                'dark:text-slate-100'
              )}
            >
              Trụ sở chính TP. Hồ Chí Minh
            </h3>
            <div
              className={clsx(
                'my-3 h-px max-w-[52px] bg-black/10',
                'dark:bg-slate-700'
              )}
            />
            <p
              className={clsx(
                'text-sm leading-relaxed text-slate-600',
                'dark:text-slate-400'
              )}
            >
              Tầng 7 tòa nhà DEYES, số 371 Nguyễn Kiệm, Phường Hạnh Thông, TP.
              Hồ Chí Minh
            </p>
          </div>

          {/* Chi nhánh Hà Nội */}
          <div className={clsx('lg:col-span-1')}>
            <h3
              className={clsx(
                'mb-3 text-sm font-medium text-slate-900',
                'dark:text-slate-100'
              )}
            >
              Văn phòng Hà Nội
            </h3>
            <div
              className={clsx(
                'my-3 h-px max-w-[52px] bg-black/10',
                'dark:bg-slate-700'
              )}
            />
            <p
              className={clsx(
                'text-sm leading-relaxed text-slate-600',
                'dark:text-slate-400'
              )}
            >
              Tầng 12, tòa D Việt Đức Complex, 39 Lê Văn Lương, Thanh Xuân, Hà
              Nội
            </p>
          </div>

          {/* Thông tin liên hệ */}
          <div className={clsx('lg:col-span-1')}>
            <h3 className={clsx('mb-3 text-sm font-medium text-orange-500')}>
              Thông tin liên hệ
            </h3>
            <div
              className={clsx(
                'my-3 h-px max-w-[52px] bg-black/10',
                'dark:bg-slate-700'
              )}
            />
            <div className={clsx('space-y-2')}>
              <div className={clsx('flex items-start gap-2')}>
                <div
                  className={clsx(
                    'h-5 w-5 text-slate-600',
                    'dark:text-slate-400'
                  )}
                >
                  <PhoneIcon />
                </div>
                <a
                  href="tel:0906219926"
                  className={clsx(
                    'text-sm text-slate-600 hover:text-slate-900',
                    'dark:text-slate-400 dark:hover:text-slate-100'
                  )}
                >
                  0899 550 550
                  <br />
                  076 617 6699
                </a>
              </div>
              <div className={clsx('flex items-center gap-2')}>
                <div
                  className={clsx(
                    'h-5 w-5 text-slate-600',
                    'dark:text-slate-400'
                  )}
                >
                  <WebsiteIcon />
                </div>
                <a
                  href="https://www.andrea.vn"
                  target="_blank"
                  rel="noreferrer nofollow"
                  className={clsx(
                    'text-sm text-slate-600 hover:text-slate-900',
                    'dark:text-slate-400 dark:hover:text-slate-100'
                  )}
                >
                  www.andrea.vn
                </a>
              </div>
              <div className={clsx('flex items-center gap-2')}>
                <div
                  className={clsx(
                    'h-5 w-5 text-slate-600',
                    'dark:text-slate-400'
                  )}
                >
                  <EmailIcon />
                </div>
                <a
                  href="mailto:info@andrea.vn"
                  className={clsx(
                    'text-sm text-slate-600 hover:text-slate-900',
                    'dark:text-slate-400 dark:hover:text-slate-100'
                  )}
                >
                  info@andrea.vn
                </a>
              </div>
            </div>
          </div>

          {/* Large Number Design Element */}
          <div
            className={clsx(
              'absolute bottom-0 right-[20px] flex items-center justify-center'
            )}
          >
            <NumberDesignElement
              width={170}
              height={232}
              className="max-md:h-[202px] max-md:w-[147px]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
