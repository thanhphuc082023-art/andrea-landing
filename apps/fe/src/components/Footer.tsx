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
import { FaBehance, FaLinkedinIn } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import type { FooterSettings, SocialMediaLink } from '@/types/footer';
import { getStrapiMediaUrl } from '@/utils/helper';

interface FooterProps {
  footerData?: FooterSettings;
}

function Footer({ footerData = {} }: FooterProps) {
  const companyName =
    footerData?.companyName || 'CTY TNHH DỊCH VỤ TRUYỀN THÔNG ANDREA';
  const socialMediaTitle =
    footerData?.socialMediaTitle || 'Kết nối với chúng tôi';
  const contactInfoTitle = footerData?.contactInfoTitle || 'Thông tin liên hệ';
  const socialMediaLinks = footerData?.socialMedia || [];
  const offices = footerData?.offices || [];
  const contactInfo = footerData?.contactInfo;
  const logoUrl = footerData?.logo ? getStrapiMediaUrl(footerData.logo) : null;
  const signatureIconUrl = footerData?.signatureIcon
    ? getStrapiMediaUrl(footerData.signatureIcon)
    : null;

  return (
    <footer className="shadow-top bg-white">
      <div
        className={clsx(
          'content-wrapper relative py-[70px] max-md:py-[55px] dark:border-slate-800 dark:bg-slate-900'
        )}
      >
        <div
          className={clsx(
            'grid grid-cols-1 gap-[92px] max-lg:gap-9 max-md:gap-[18px] lg:grid-cols-[150px_1fr_1fr_1fr]'
          )}
        >
          <div className={clsx('lg:col-span-1')}>
            {/* Large Number Design Element */}
            {signatureIconUrl ? (
              <img
                src={signatureIconUrl}
                alt={
                  footerData?.signatureIcon?.alternativeText || 'Signature Icon'
                }
                className="h-[125px] w-[92px] object-contain max-md:h-[69px] max-md:w-[50px]"
              />
            ) : (
              <div className={clsx('')}>
                <NumberDesignElement
                  width={92}
                  height={125}
                  className="h-[125px] w-[92px] object-contain max-md:h-[69px] max-md:w-[50px]"
                />
              </div>
            )}
          </div>
          {/* Offices - Dynamic từ Strapi - Nằm trong col-3 và col-4 */}
          <div className={clsx('lg:col-span-2')}>
            {offices.length > 0 ? (
              <div
                className={clsx(
                  'grid grid-cols-1 gap-[92px] max-lg:gap-9 max-md:gap-[18px] lg:max-w-full lg:grid-cols-2'
                )}
              >
                {offices
                  .sort((a, b) => a.position - b.position)
                  .map((office) => (
                    <div key={office.id}>
                      <h3
                        className={clsx(
                          'text-sm font-semibold text-slate-900',
                          'dark:text-slate-100'
                        )}
                      >
                        {office.officeName}
                      </h3>
                      <div
                        className={clsx(
                          'my-3 h-px max-w-[52px] bg-black/10',
                          'dark:bg-slate-700'
                        )}
                      />
                      <p
                        className={clsx(
                          'text-sm leading-relaxed text-black',
                          'dark:text-slate-400'
                        )}
                      >
                        {office.address}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              // Fallback offices nếu không có data từ Strapi
              <div className={clsx('grid grid-cols-1 gap-6 lg:grid-cols-2')}>
                {/* Chi nhánh TP. Hồ Chí Minh */}
                <div>
                  <h3
                    className={clsx(
                      'text-sm font-semibold text-slate-900',
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
                      'text-sm leading-relaxed text-black',
                      'dark:text-slate-400'
                    )}
                  >
                    Tầng 7 tòa nhà DEYES, số 371 Nguyễn Kiệm, Phường Hạnh Thông,
                    TP. Hồ Chí Minh
                  </p>
                </div>

                {/* Chi nhánh Hà Nội */}
                <div>
                  <h3
                    className={clsx(
                      'mb-3 text-sm font-semibold text-slate-900',
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
                      'text-sm leading-relaxed text-black',
                      'dark:text-slate-400'
                    )}
                  >
                    Tầng 12, tòa D Việt Đức Complex, 39 Lê Văn Lương, Thanh
                    Xuân, Hà Nội
                  </p>
                </div>
              </div>
            )}
          </div>{' '}
          {/* Thông tin liên hệ */}
          <div className={clsx('lg:col-span-1')}>
            <h3
              className={clsx('text-brand-orange mb-3 text-sm font-semibold')}
            >
              {contactInfoTitle}
            </h3>
            <div className={clsx('space-y-1')}>
              {contactInfo?.phone && contactInfo.phone.length > 0 && (
                <div className={clsx('flex items-start gap-2')}>
                  {/* <div
                      className={clsx(
                        'h-5 w-5 text-black',
                        'dark:text-slate-400'
                      )}
                    >
                      {contactInfo.phoneIcon ? (
                        <img
                          src={getStrapiMediaUrl(contactInfo.phoneIcon)}
                          alt="Phone Icon"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <PhoneIcon />
                      )}
                    </div> */}
                  <p
                    className={clsx(
                      'text-sm leading-relaxed text-black',
                      'flex flex-col space-y-1 dark:text-slate-400'
                    )}
                  >
                    {contactInfo.phone?.map((phone) => (
                      <a
                        key={phone.href}
                        href={`tel:${phone.href}`}
                        className={clsx(
                          'inline-block min-h-[22px] text-sm text-black hover:text-slate-900',
                          'dark:text-slate-400 dark:hover:text-slate-100'
                        )}
                      >
                        {phone.label}
                      </a>
                    ))}
                  </p>
                </div>
              )}

              {contactInfo?.website && contactInfo.website.length > 0 && (
                <div className={clsx('flex items-start gap-2')}>
                  {/* <div
                      className={clsx(
                        'h-5 w-5 text-black',
                        'dark:text-slate-400'
                      )}
                    >
                      {contactInfo.websiteIcon ? (
                        <img
                          src={getStrapiMediaUrl(contactInfo.websiteIcon)}
                          alt="Website Icon"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <WebsiteIcon />
                      )}
                    </div> */}
                  <p
                    className={clsx(
                      'text-sm leading-relaxed text-black',
                      'flex flex-col dark:text-slate-400'
                    )}
                  >
                    {contactInfo.website?.map((website) => (
                      <a
                        key={website.href}
                        href={website.href}
                        className={clsx(
                          'inline-block min-h-[22px] text-sm text-black hover:text-slate-900',
                          'dark:text-slate-400 dark:hover:text-slate-100'
                        )}
                      >
                        {website.label}
                      </a>
                    ))}
                  </p>
                </div>
              )}

              {contactInfo?.email && contactInfo.email.length > 0 && (
                <div className={clsx('flex items-start gap-2')}>
                  {/* <div
                      className={clsx(
                        'h-5 w-5 text-black',
                        'dark:text-slate-400'
                      )}
                    >
                      {contactInfo.mailIcon ? (
                        <img
                          src={getStrapiMediaUrl(contactInfo.mailIcon)}
                          alt="Email Icon"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <EmailIcon />
                      )}
                    </div> */}
                  <p
                    className={clsx(
                      'text-sm leading-relaxed text-black',
                      'dark:text-slate-400'
                    )}
                  >
                    {contactInfo.email?.map((email) => (
                      <a
                        key={email.href}
                        href={`mailto:${email.href}`}
                        className={clsx(
                          'inline-block min-h-[22px] text-sm text-black hover:text-slate-900',
                          'dark:text-slate-400 dark:hover:text-slate-100'
                        )}
                      >
                        {email.label}
                      </a>
                    ))}
                  </p>
                </div>
              )}

              {contactInfo ? (
                <div className={clsx('mt-1 flex flex-wrap space-x-3')}>
                  {socialMediaLinks.length > 0 ? (
                    socialMediaLinks
                      .sort((a, b) => Number(b.position) - Number(a.position))
                      .map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer nofollow"
                          className="flex h-8 w-8 items-center justify-center transition-colors"
                          aria-label={link.url}
                        >
                          <img
                            src={getStrapiMediaUrl(link.icon)}
                            alt={link.url || 'Social Icon'}
                            className="h-full w-full object-contain"
                          />
                        </a>
                      ))
                  ) : (
                    // Fallback social links nếu không có data từ Strapi
                    <>
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
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className={clsx('flex items-start gap-2')}>
                    <div
                      className={clsx(
                        'h-5 w-5 text-black',
                        'dark:text-slate-400'
                      )}
                    >
                      <PhoneIcon />
                    </div>
                    <a
                      href="tel:0906219926"
                      className={clsx(
                        'inline-block min-h-[22px] text-sm text-black hover:text-slate-900',
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
                        'h-5 w-5 text-black',
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
                        'inline-block min-h-[22px] text-sm text-black hover:text-slate-900',
                        'dark:text-slate-400 dark:hover:text-slate-100'
                      )}
                    >
                      www.andrea.vn
                    </a>
                  </div>
                  <div className={clsx('flex items-center gap-2')}>
                    <div
                      className={clsx(
                        'h-5 w-5 text-black',
                        'dark:text-slate-400'
                      )}
                    >
                      <EmailIcon />
                    </div>
                    <a
                      href="mailto:info@andrea.vn"
                      className={clsx(
                        'inline-block min-h-[22px] text-sm text-black hover:text-slate-900',
                        'dark:text-slate-400 dark:hover:text-slate-100'
                      )}
                    >
                      info@andrea.vn
                    </a>
                  </div>
                  <div className={clsx('mt-1 flex flex-wrap space-x-3')}>
                    {socialMediaLinks.length > 0 ? (
                      socialMediaLinks
                        .sort((a, b) => Number(b.position) - Number(a.position))
                        .map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer nofollow"
                            className="flex h-8 w-8 items-center justify-center transition-colors"
                            aria-label={link.url}
                          >
                            <img
                              src={getStrapiMediaUrl(link.icon)}
                              alt={link.url || 'Social Icon'}
                              className="h-full w-full object-contain"
                            />
                          </a>
                        ))
                    ) : (
                      // Fallback social links nếu không có data từ Strapi
                      <>
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
                          <InstagramIcon
                            className={clsx('h-5 w-5 text-white')}
                          />
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
                          <FaLinkedinIn
                            className={clsx('h-5 w-5 text-white')}
                          />
                        </a>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
