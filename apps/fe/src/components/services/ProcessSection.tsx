import React from 'react';

export default function ProcessSection({ data }: any) {
  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <h2 className="text-brand-orange font-playfair mb-6 text-left text-[40px] font-medium !leading-[60px] max-md:text-[27px] max-md:!leading-[40px]">
        Quy trình thiết kế bao bì tại Andrea
      </h2>

      {/* Process cards */}
      {/* Row 1: items 1 & 2 (2 columns on md+) */}
      {data?.steps ? (
        <div className="max-sd:grid-cols-1 mb-5 grid grid-cols-2 gap-5">
          {data.steps.slice(0, 2).map((s: any) => (
            <div
              key={s.id}
              className="rounded-10 max-sd:py-[35px] min-h-[272px] bg-[#F2F2F2] px-[43px] py-[34px] max-md:px-[16px] max-md:py-[29px]"
            >
              <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
                {s.id}. {s.title}
              </div>
              <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
                {s.bullets.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-sd:grid-cols-1 mb-5 grid grid-cols-2 gap-5">
          <div className="rounded-10 max-sd:py-[35px] min-h-[272px] bg-[#F2F2F2] px-[43px] py-[34px] max-md:px-[16px] max-md:py-[29px]">
            <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
              1. Khai vấn & tiếp nhận thông tin
            </div>
            <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
              <li>
                Khám phá nhu cầu, mong muốn và những trăn trở về bao bì hiện tại
              </li>
              <li>
                Hiểu rõ sản phẩm, khách hàng mục tiêu, thông điệp cần truyền tải
              </li>
              <li>Lập brief chiến lược sáng tạo</li>
            </ul>
          </div>

          <div className="rounded-10 min-h-[272px] bg-[#F2F2F2] px-[43px] py-[34px] max-md:px-[16px] max-md:py-[29px]">
            <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
              2. Nghiên cứu & xây dựng concept
            </div>
            <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
              <li>Phân tích thị trường, đối thủ, hành vi mua hàng</li>
              <li>Xây dựng thông điệp & câu chuyện thương hiệu</li>
              <li>Lên moodboard định hướng hình ảnh, màu sắc, phong cách</li>
            </ul>
          </div>
        </div>
      )}

      {/* Row 2: items 3, 4 & 5 (3 columns on md+) */}
      {data?.steps ? (
        <div className="max-sd:grid-cols-1 mb-16 grid grid-cols-3 gap-5">
          {data.steps.slice(2).map((s: any) => (
            <div
              key={s.id}
              className="rounded-10 max-sd:min-h-[300px] max-sd:px-[16px] min-h-[418px] bg-[#F2F2F2] px-[21px] py-[35px] max-md:px-[16px] max-md:py-[29px]"
            >
              <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
                {s.id}. {s.title}
              </div>
              <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
                {s.bullets.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-sd:grid-cols-1 mb-16 grid grid-cols-3 gap-5">
          <div className="rounded-10 max-sd:min-h-[300px] max-sd:px-[16px] py min-h-[418px] bg-[#F2F2F2] px-[21px] py-[35px] max-md:py-[29px]">
            <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
              3. Thiết kế & sáng tạo
            </div>
            <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
              <li>
                Khám phá nhu cầu, mong muốn và những trăn trở về bao bì hiện tại
              </li>
              <li>
                Hiểu rõ sản phẩm, khách hàng mục tiêu, thông điệp cần truyền tải
              </li>
              <li>Lập brief chiến lược sáng tạo</li>
            </ul>
          </div>

          <div className="rounded-10 max-sd:min-h-[300px] max-sd:px-[16px] py min-h-[418px] bg-[#F2F2F2] px-[21px] py-[35px] max-md:py-[29px]">
            <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
              4. Chỉnh sửa & hoàn thiện
            </div>
            <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
              <li>
                Lấy các ý kiến phản hồi, phản biện từ góc nhìn từ khách hàng và
                nhà sản xuất, khách hàng mục tiêu, hiệu chỉnh, chốt phương án
                cuối và in kiểm thử lần 1
              </li>
              <li>Chỉnh sửa sau in kiểm thử và bàn giao thiết kế</li>
              <li>
                Lưu ý kiểm tra và in kiểm thử trải nghiệm thử, rồi mới thực hiện
                in và sản xuất hàng loạt.
              </li>
            </ul>
          </div>

          <div className="rounded-10 max-sd:min-h-[300px] max-sd:px-[16px] py min-h-[418px] bg-[#F2F2F2] px-[21px] py-[35px] max-md:py-[29px]">
            <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
              5. Hỗ trợ truyền thông
            </div>
            <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
              <li>
                Tư vấn và thiết kế hình ảnh truyền thông cho sản phẩm: ảnh phối
                cảnh, video, showcase...
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
