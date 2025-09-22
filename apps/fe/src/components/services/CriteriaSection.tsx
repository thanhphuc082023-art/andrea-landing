import Divider from '@/components/services/Divider';
import Image from 'next/image';
import React from 'react';

export default function CriteriaSection({ data }: any) {
  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <div>
        <h2 className="text-brand-orange font-playfair mb-8 text-left text-[40px] font-medium !leading-[60px] max-md:text-[27px] max-md:!leading-[40px]">
          {data?.title}
        </h2>

        <div className="max-sd:gap-[55px] mb-12 flex flex-col items-center gap-[120px] lg:flex-row">
          <div className="w-full max-md:w-[calc(100%+58px)] lg:w-1/2">
            <div className="max-sd:aspect-video max-sd:h-auto max-sd:max-w-full rounded-15 relative aspect-[650/466] h-[466px] w-full max-w-[650px] overflow-hidden max-md:rounded-none max-sm:aspect-[487/469] max-sm:h-[469px]">
              <Image
                src={data?.image}
                alt="Supermarket aisle with products"
                fill
                sizes="(min-width: 1024px) 512px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="w-full space-y-5 lg:w-1/2">
            <div className="flex flex-col gap-5">
              {data?.list ? (
                data.list.map((item: any, i: number) => (
                  <React.Fragment key={i}>
                    <div className="mb-2">
                      <h3 className="text-[24px] font-semibold text-black max-sm:text-[20px]">
                        {item?.title}
                      </h3>
                      <p className="text-[16px] text-black">
                        {item?.description}
                      </p>
                    </div>
                    {i < data.list.length - 1 && (
                      <div className="h-[1px] w-full bg-black/20" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <>
                  <div>
                    <h3 className="mb-2 text-[24px] font-semibold text-black max-sm:text-[20px]">
                      Dựa trên công nghiệp
                    </h3>
                    <p className="text-[16px] text-black">
                      Hiểu rõ ngành nghề và đặc thù sản phẩm, khách hàng mục
                      tiêu.
                    </p>
                  </div>
                  <div className="h-[1px] w-full bg-black/20" />
                  <div>
                    <h3 className="mb-2 text-[24px] font-semibold text-black max-sm:text-[20px]">
                      Truyền thông thương hiệu tốt
                    </h3>
                    <p className="text-[16px] text-black">
                      Thể hiện rõ ràng thông điệp và giá trị cốt lõi của thương
                      hiệu.
                    </p>
                  </div>
                  <div className="h-[1px] w-full bg-black/20" />
                  <div>
                    <h3 className="mb-2 text-[24px] font-semibold text-black max-sm:text-[20px]">
                      Thiết kế riêng, mạnh bạch
                    </h3>
                    <p className="text-[16px] text-black">
                      Tạo sự khác biệt rõ rệt so với đối thủ cạnh tranh trên thị
                      trường.
                    </p>
                  </div>
                  <div className="h-[1px] w-full bg-black/20" />
                  <div>
                    <h3 className="mb-2 text-[24px] font-semibold text-black max-sm:text-[20px]">
                      Tâm lý người tiêu dùng
                    </h3>
                    <p className="text-[16px] text-black">
                      Hiểu và áp dụng marketing, tâm lý học vào thiết kế để thu
                      hút khách hàng.
                    </p>
                  </div>
                  <div className="h-[1px] w-full bg-black/20" />
                  <div>
                    <h3 className="mb-2 text-[24px] font-semibold text-black max-sm:text-[20px]">
                      Hiệu suất phân, hiệu hoá tối
                    </h3>
                    <p className="text-[16px] text-black">
                      Đảm bảo tính khả thi trong sản xuất và phù hợp với ngân
                      sách của doanh nghiệp.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
