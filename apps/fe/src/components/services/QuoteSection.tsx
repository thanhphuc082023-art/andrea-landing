import Image from 'next/image';
import React from 'react';

export default function QuoteSection({ data, layout = '', image }: any) {
  return (
    <>
      {layout === 'image-right' ? (
        <section className="bg-text-primary text-white">
          <div className="content-wrapper">
            <div className="mx-auto flex flex-col items-center gap-12 py-[26px] lg:flex-row lg:items-stretch">
              <div className="flex w-full flex-1 items-center justify-center">
                <blockquote className="font-playfair relative px-[60px] text-center text-[30px] font-medium leading-relaxed max-md:py-[50px] lg:text-[40px]">
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
                  className="relative w-[750px] max-w-full"
                  style={{ aspectRatio: '750 / 562' }}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={data?.imageAlt || 'quote image'}
                      width={750}
                      height={562}
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/assets/images/default-quote-right.jpg"
                      alt="quote image"
                      width={750}
                      height={562}
                      className="object-cover"
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
              <div className="max-sd:max-w-full mx-auto w-fit max-w-[75%] py-[123px]">
                <blockquote className="font-playfair relative px-[60px] text-center text-[30px] font-medium leading-relaxed max-md:py-[50px] lg:text-[40px]">
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
            <div className="max-sd:max-w-full mx-auto w-fit max-w-[75%] py-[123px]">
              <blockquote className="font-playfair relative px-[60px] text-center text-[30px] font-medium leading-relaxed max-md:py-[50px] lg:text-[40px]">
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
