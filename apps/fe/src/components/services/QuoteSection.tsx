import ImageTextSection from '@/components/services/ImageTextSection';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

export default function QuoteSection({
  data,
  layout = '',
  image,
  isImageQueto = false,
  className = '',
}: any) {
  if (isImageQueto)
    return (
      <section className={clsx('bg-text-primary text-white', className)}>
        <ImageTextSection
          image={data?.image}
          subheadingHtml={data?.subheadingHtml}
        />
      </section>
    );

  return (
    <>
      {layout === 'image-right' ? (
        <section className={clsx('bg-text-primary text-white', className)}>
          <div className="content-wrapper">
            <div className="mx-auto flex flex-col items-center gap-12 py-[26px] lg:flex-row lg:items-stretch">
              <div className="flex w-full flex-1 items-center justify-center">
                <blockquote className="font-playfair relative px-[60px] text-center text-[30px] font-medium leading-relaxed max-md:px-0 max-md:py-[50px] lg:text-[40px]">
                  <Image
                    src="/assets/images/queto.svg"
                    alt="quote open"
                    width={50}
                    height={50}
                    className="absolute left-0 top-0 mx-auto"
                  />
                  {data?.text || (
                    <>
                      Bao bì không chỉ là lớp vỏ
                      <br />
                      mà là chiến lược gắn liền với thương hiệu, sản phẩm
                      <br />
                      và vận hành doanh nghiệp.
                    </>
                  )}
                  <Image
                    src="/assets/images/queto.svg"
                    alt="quote close"
                    width={50}
                    height={50}
                    className="absolute bottom-0 right-0 mx-auto rotate-180 transform"
                  />
                </blockquote>
              </div>

              <div className="flex shrink-0 items-center justify-center">
                <div
                  className="relative w-[750px] max-w-full max-md:w-full"
                  style={{ aspectRatio: '750 / 562' }}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={data?.imageAlt || 'quote image'}
                      width={750}
                      height={562}
                      className="object-contain"
                    />
                  ) : (
                    <Image
                      src="/assets/images/default-quote-right.jpg"
                      alt="quote image"
                      width={750}
                      height={562}
                      className="object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : layout === 'center' ? (
        <>
          <div className="content-wrapper mb-10 flex shrink-0 items-center justify-center max-md:mb-0 max-md:px-0">
            <div
              className="relative w-full"
              style={{ aspectRatio: '1300 / 780' }}
            >
              {image ? (
                <Image
                  src={image}
                  alt={data?.imageAlt || 'quote image'}
                  layout="fill"
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/assets/images/default-quote-right.jpg"
                  alt="quote image"
                  layout="fill"
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <section className="bg-text-primary text-white">
            <div className="content-wrapper">
              <div className="max-sd:max-w-full mx-auto w-fit max-w-[85%] py-[123px]">
                <blockquote className="font-playfair relative px-[60px] text-center text-[30px] font-medium leading-relaxed max-md:px-0 max-md:py-[50px] lg:text-[40px]">
                  <Image
                    src="/assets/images/queto.svg"
                    alt="quote open"
                    width={50}
                    height={50}
                    className="absolute left-0 top-0 mx-auto"
                  />
                  {data?.text || (
                    <>
                      Bao bì không chỉ là lớp vỏ
                      <br />
                      mà là chiến lược gắn liền với thương hiệu, sản phẩm
                      <br />
                      và vận hành doanh nghiệp.
                    </>
                  )}
                  <Image
                    src="/assets/images/queto.svg"
                    alt="quote open"
                    width={50}
                    height={50}
                    className="absolute bottom-0 right-0 mx-auto rotate-180 transform"
                  />
                </blockquote>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-text-primary text-white">
          <div className="content-wrapper">
            <div className="max-sd:max-w-full mx-auto w-fit max-w-[85%] py-[123px]">
              <blockquote className="font-playfair relative px-[60px] text-center text-[30px] font-medium leading-relaxed max-md:px-0 max-md:py-[50px] lg:text-[40px]">
                <Image
                  src="/assets/images/queto.svg"
                  alt="quote open"
                  width={50}
                  height={50}
                  className="absolute left-0 top-0 mx-auto"
                />
                {data?.text || (
                  <>
                    Bao bì không chỉ là lớp vỏ
                    <br />
                    mà là chiến lược gắn liền với thương hiệu, sản phẩm
                    <br />
                    và vận hành doanh nghiệp.
                  </>
                )}
                <Image
                  src="/assets/images/queto.svg"
                  alt="quote open"
                  width={50}
                  height={50}
                  className="absolute bottom-0 right-0 mx-auto rotate-180 transform"
                />
              </blockquote>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
