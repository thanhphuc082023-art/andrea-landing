'use client';
import Divider from '@/components/services/Divider';
import React from 'react';

export default function FinalSection({ data }: any) {
  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <div className="max-sd:grid-cols-1 grid grid-cols-[528px_1fr] gap-5">
        <h2 className="text-brand-orange font-playfair text-left text-[40px] font-medium !leading-[60px] max-md:text-[27px] max-md:!leading-[40px]">
          {data?.title}
        </h2>

        <div className="max-sd:mt-0 mt-[67px] w-full space-y-6">
          {data?.highlights ? (
            data.highlights.map((h: string, i: number) => (
              <React.Fragment key={i}>
                <div className="text-[24px] text-black max-md:text-[20px]">
                  <div dangerouslySetInnerHTML={{ __html: h || '' }} />
                </div>
                {i < data.highlights.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <>
              <div className="text-[24px] text-black max-md:text-[20px]">
                Thiết kế không chỉ đẹp – mà kể được{' '}
                <span className="text-brand-orange">
                  câu chuyện thương hiệu
                </span>
              </div>
              <Divider />
              <div className="text-[24px] text-black max-md:text-[20px]">
                Kết hợp nghệ thuật, kỹ thuật và cảm xúc
              </div>
              <Divider />
              <div className="text-[24px] text-black max-md:text-[20px]">
                Lồng ghép yếu tố{' '}
                <span className="text-brand-orange">văn hóa Việt</span> một cách
                tinh tế, tạo chất riêng
              </div>
              <Divider />
              <div className="text-[24px] text-black max-md:text-[20px]">
                Tạo ra những sản phẩm bao bì khiến khách hàng{' '}
                <span className="text-brand-orange">
                  muốn chạm - muốn giữ - muốn tin.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
