import Image from 'next/image';
import React from 'react';

export default function QuoteSection({ data }: any) {
  return (
    <section className="bg-text-primary py-[123px] text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto w-fit">
          <blockquote className="font-playfair relative text-center text-[30px] font-medium leading-relaxed max-md:py-[50px] lg:text-[40px]">
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
  );
}
