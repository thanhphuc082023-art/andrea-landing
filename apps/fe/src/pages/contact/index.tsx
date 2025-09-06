import BrandSection from '@/contents/index/BrandSection';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import { getContactPageSettings } from '@/lib/strapi-server';
import clsx from 'clsx';
import { EmailIcon, PhoneIcon, WebsiteIcon } from '@/assets/icons';
import StrapiHead from '@/components/meta/StrapiHead';
import { getStrapiMediaUrl } from '@/utils/helper';
import { ReactElement } from 'react';

export default function ContactSection({
  brandSectionData,
  contactPageData,
  serverGlobal,
}: any) {
  console.log('contactPageData', contactPageData);
  // Use Google Maps URL from Strapi or fallback to environment variable or default
  const mapSrc =
    contactPageData?.googleMaps?.embedUrl ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1225.051577194311!2d106.67672752805336!3d10.816446213024209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529525b5cda9b%3A0x915fecab6236045!2zQ8OUTkcgVFkgVE5ISCBE4buKQ0ggVuG7pCBUUlVZ4buATiBUSMOUTkcgQU5EUkVB!5e0!3m2!1svi!2s!4v1755756874012!5m2!1svi!2s';

  const currentGlobal = serverGlobal;
  const siteTitle = currentGlobal?.siteName || 'Andrea';

  // Use SEO data from Strapi or fallback
  const pageDescription =
    contactPageData?.seo?.metaDescription ||
    'Liên hệ Andrea — dịch vụ thiết kế thương hiệu và digital. Liên hệ để thảo luận dự án, hợp tác hoặc gửi hồ sơ ứng tuyển.';

  // Merge default SEO with contact-specific overrides
  const contactSeo = {
    ...(currentGlobal?.defaultSeo || {}),
    metaTitle: contactPageData?.seo?.metaTitle || `Liên hệ - ${siteTitle}`,
    metaDescription: pageDescription,
    shareImage: contactPageData?.seo?.shareImage
      ? getStrapiMediaUrl(contactPageData.seo.shareImage)
      : '/assets/images/contact/contact-image.png',
  };

  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        title={contactSeo.metaTitle}
        description={pageDescription}
        ogImage={contactSeo.shareImage}
        seo={contactSeo}
        global={currentGlobal}
        overrideTitle
      />
      <BrandSection brandSectionData={brandSectionData} />
      <section
        id="contact"
        className="content-wrapper pb-[88px] pt-[67px] max-md:pb-[70px]"
      >
        <div className="w-full">
          <div className="grid justify-between gap-12 lg:grid-cols-[420px_1fr] lg:gap-[131px]">
            {/* Left Column - Company Info */}
            <div className="space-y-10 max-md:space-y-5">
              {/* Andrea Branding Image */}
              <div>
                <img
                  src={
                    contactPageData?.heroImage
                      ? getStrapiMediaUrl(contactPageData.heroImage)
                      : '/assets/images/contact/contact-image.png'
                  }
                  alt={
                    contactPageData?.heroImage?.alternativeText ||
                    'Andrea Agency Branding'
                  }
                  className="rounded-10 aspect-[420/271] shadow-sm"
                />
              </div>

              {/* Working Hours */}
              {contactPageData?.workingHours ? (
                <div>
                  <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                    {contactPageData.workingHours.title || 'Giờ làm việc'}
                  </h3>
                  <p className="text-[16px] text-black">
                    {contactPageData.workingHours.days}
                  </p>
                  <p className="text-[16px] text-black">
                    {contactPageData.workingHours.hours}
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                    Giờ làm việc
                  </h3>
                  <p className="text-[16px] text-black">Thứ Hai - Thứ Sáu</p>
                  <p className="text-[16px] text-black">09:00 - 17:30</p>
                </div>
              )}

              {/* Offices */}
              {contactPageData?.offices?.length > 0 ? (
                contactPageData.offices.map((office: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                      {office.title}
                    </h3>
                    <p className="text-[16px]">{office.address}</p>
                  </div>
                ))
              ) : (
                <>
                  {/* Main Office */}
                  <div>
                    <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                      Trụ sở chính tại TP. Hồ Chí Minh
                    </h3>
                    <p className="text-[16px]">
                      Tầng 7 tòa nhà DEYES, số 371 Nguyễn Kiệm, Phường Hạnh
                      Thông, TP. Hồ Chí Minh
                    </p>
                  </div>

                  {/* Hanoi Office */}
                  <div>
                    <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                      Văn phòng Hà Nội
                    </h3>
                    <p className="text-[16px]">
                      Tầng 12, tòa D Việt Đức Complex, 39 Lê Văn Lương, Thanh
                      Xuân, Hà Nội
                    </p>
                  </div>
                </>
              )}

              {/* Contact Information */}
              {contactPageData?.contactInfo ? (
                <div>
                  <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                    {contactPageData.contactInfo.title || 'Thông tin liên hệ'}
                  </h3>
                  <div className="space-y-2">
                    {contactPageData.contactInfo.phones?.length > 0 && (
                      <div className={clsx('flex items-start gap-2')}>
                        <div
                          className={clsx(
                            'h-5 w-5 text-black',
                            'dark:text-slate-400'
                          )}
                        >
                          <PhoneIcon />
                        </div>
                        <div>
                          {contactPageData.contactInfo.phones.map(
                            (phone: string, idx: number) => (
                              <a
                                key={idx}
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                className={clsx(
                                  'inline-block min-h-[22px] text-black hover:text-slate-900',
                                  'dark:text-slate-400 dark:hover:text-slate-100',
                                  idx > 0 && 'block'
                                )}
                              >
                                {phone}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {contactPageData.contactInfo.website && (
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
                          href={contactPageData.contactInfo.website}
                          target="_blank"
                          rel="noreferrer nofollow"
                          className={clsx(
                            'inline-block min-h-[22px] text-black hover:text-slate-900',
                            'text-[16px] dark:text-slate-400 dark:hover:text-slate-100'
                          )}
                        >
                          {contactPageData.contactInfo.websiteDisplay ||
                            contactPageData.contactInfo.website}
                        </a>
                      </div>
                    )}

                    {contactPageData.contactInfo.email && (
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
                          href={`mailto:${contactPageData.contactInfo.email}`}
                          className={clsx(
                            'inline-block min-h-[22px] text-black hover:text-slate-900',
                            'text-[16px] dark:text-slate-400 dark:hover:text-slate-100'
                          )}
                        >
                          {contactPageData.contactInfo.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-text-primary mb-2 text-[20px] font-medium">
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-2">
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
                        href="tel:0899550550"
                        className={clsx(
                          'inline-block min-h-[22px] text-black hover:text-slate-900',
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
                        href="https://www.andrea.com.vn"
                        target="_blank"
                        rel="noreferrer nofollow"
                        className={clsx(
                          'inline-block min-h-[22px] text-black hover:text-slate-900',
                          'text-[16px] dark:text-slate-400 dark:hover:text-slate-100'
                        )}
                      >
                        www.andrea.com.vn
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
                          'inline-block min-h-[22px] text-black hover:text-slate-900',
                          'text-[16px] dark:text-slate-400 dark:hover:text-slate-100'
                        )}
                      >
                        info@andrea.vn
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Google Maps (embedded) */}
              <div className="max-lg:hidden">
                <h3 className="mb-8 text-[24px] font-semibold text-red-500">
                  {contactPageData?.googleMaps?.title ||
                    'Tìm kiếm chúng tôi trên Google Map'}
                </h3>
                <div className="w-full">
                  <div className="rounded-10 aspect-[420/250] w-full max-w-[420px] overflow-hidden">
                    <iframe
                      src={mapSrc}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={
                        contactPageData?.googleMaps?.title ||
                        'Andrea - Google Map'
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Sections */}
            <div className="grid grid-cols-1 grid-rows-3 space-y-5">
              {contactPageData?.contactSections?.map(
                (section: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-10 overflow-hidden bg-[#EFEFEF]"
                  >
                    <div className="aspect-[750/387] min-h-[355px] w-full">
                      <div className="flex h-full flex-col justify-start p-6 lg:p-[48px]">
                        <h3 className="text-brand-orange font-playfair mb-3 break-words text-[40px] font-medium max-md:text-[30px]">
                          {section.title}
                        </h3>
                        <p className="break-words text-[20px] text-black max-md:text-[16px]">
                          {section.description}{' '}
                          {section.linkText && section.linkUrl && (
                            <a
                              href={section.linkUrl}
                              className="break-words underline"
                              target={
                                section.linkUrl.startsWith('http')
                                  ? '_blank'
                                  : '_self'
                              }
                              rel={
                                section.linkUrl.startsWith('http')
                                  ? 'noreferrer nofollow'
                                  : undefined
                              }
                            >
                              {section.linkText}
                            </a>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) || (
                // Fallback content if no data from Strapi
                <>
                  <div className="rounded-10 overflow-hidden bg-[#EFEFEF]">
                    <div className="aspect-[750/387] min-h-[355px] w-full">
                      <div className="flex h-full flex-col justify-start p-6 lg:p-[48px]">
                        <h3 className="text-brand-orange font-playfair mb-3 break-words text-[40px] font-medium max-md:text-[30px]">
                          Liên hệ công việc
                        </h3>
                        <p className="break-words text-[20px] text-black max-md:text-[16px]">
                          Nếu bạn muốn thảo luận về một dự án mới hoặc tìm hiểu
                          thêm về chúng tôi, vui lòng liên hệ{' '}
                          <a href="#" className="break-words underline">
                            tại đây
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-10 overflow-hidden bg-[#EFEFEF]">
                    <div className="aspect-[750/387] min-h-[355px] w-full">
                      <div className="flex h-full flex-col justify-start p-6 lg:p-[48px]">
                        <h3 className="text-brand-orange font-playfair mb-3 break-words text-[40px] font-medium max-md:text-[30px]">
                          Liên hệ hợp tác
                        </h3>
                        <p className="break-words text-[20px] text-black max-md:text-[16px]">
                          Bạn là nhà cung cấp dịch vụ, chuyên gia muốn liên hệ
                          hợp tác? Vui lòng liên hệ chúng tôi{' '}
                          <a href="#" className="break-words underline">
                            tại đây
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-10 overflow-hidden bg-[#EFEFEF]">
                    <div className="aspect-[750/387] min-h-[355px] w-full">
                      <div className="flex h-full flex-col justify-start p-6 lg:p-[48px]">
                        <h3 className="text-brand-orange font-playfair mb-3 break-words text-[40px] font-medium max-md:text-[30px]">
                          Cơ hội nghề nghiệp
                        </h3>
                        <p className="break-words text-[20px] text-black max-md:text-[16px]">
                          Chúng tôi luôn tìm kiếm những tài năng mới. Hãy chia
                          sẻ portfolio của bạn với chúng tôi.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Google Maps */}
          <div className="hidden max-lg:block">
            <h3 className="mb-4 mt-[60px] text-[24px] font-semibold text-red-500">
              {contactPageData?.googleMaps?.title ||
                'Tìm kiếm chúng tôi trên Google Map'}
            </h3>
            <div className="w-full">
              <div className="rounded-10 aspect-[420/250] w-full max-w-[420px] overflow-hidden">
                <iframe
                  src={mapSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={
                    contactPageData?.googleMaps?.title || 'Andrea - Google Map'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

ContactSection.getLayoutNoFooter = (page: ReactElement) => {
  return page;
};

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    const [contactPageResult] = await Promise.all([getContactPageSettings()]);

    return {
      brandSectionData: contactPageResult.data?.brandInfo || null,
      contactPageData: contactPageResult.data || null,
    };
  });
