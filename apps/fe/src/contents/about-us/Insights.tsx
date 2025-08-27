export default function InsightsSection() {
  return (
    <div className="bg-[#D9D9D9] py-[70px] max-md:py-[48px]">
      <div className="content-wrapper">
        {/* Tầm nhìn Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-end">
            <h2 className="font-playfair text-brand-orange mr-6 text-[50px] leading-[41px] max-md:text-[35px] max-md:leading-[30px]">
              Tầm nhìn
            </h2>
            <div className="bg-brand-orange h-0.5 flex-1"></div>
          </div>
          <div className="max-w-[53%] max-md:max-w-full">
            <p className="text-[16px] leading-relaxed text-black">
              Với khát vọng tôn vinh giá trị thương hiệu Việt và đồng hành cùng
              doanh nghiệp trong nước vươn tầm quốc tế, Andrea định hướng trở
              thành đơn vị tư vấn, thiết kế thương hiệu cảm xúc và đồng hành
              cùng doanh nghiệp phát triển thương hiệu bền vững tại Việt Nam.
            </p>
          </div>
        </section>

        {/* Sứ mệnh Section */}
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-end">
            <div className="bg-brand-orange mr-6 h-0.5 flex-1"></div>
            <h2 className="font-playfair text-brand-orange mr-6 text-[50px] leading-[41px] max-md:text-[35px] max-md:leading-[30px]">
              Sứ mệnh
            </h2>
          </div>
          <div className="text-right">
            <div className="ml-auto max-w-[53%] max-md:max-w-full">
              <p className="mb-6 text-[16px] leading-relaxed text-black">
                Andrea ra đời với mong muốn đồng hành cùng các doanh nghiệp trên
                hành trình kiến tạo những định hướng ý nghĩa, truyền tải trọn
                vẹn giá trị thương hiệu qua các giải pháp tư vấn chiến lược và
                sản phẩm thiết kế chất lượng.
              </p>
              <p className="text-[16px] leading-relaxed text-black">
                Hơn cả dịch vụ, Andrea hướng tới trở thành người bạn đáng tin
                cậy, thấu hiểu sâu sắc mỗi thương hiệu, để cùng doanh nghiệp tỏa
                sáng trên mọi chặng đường phát triển.
              </p>
            </div>
          </div>
        </section>

        {/* Giá trị cốt lõi Section */}
        <section>
          <div className="mb-8 flex items-end">
            <h2 className="font-playfair text-brand-orange mr-6 text-[50px] leading-[41px] max-md:text-[35px] max-md:leading-[30px]">
              Giá trị cốt lõi
            </h2>
            <div className="bg-brand-orange h-0.5 flex-1"></div>
          </div>
          <div className="max-w-[52%] max-md:max-w-full">
            <ul className="space-y-2">
              <li className="text-[16px] text-black">
                Chú tâm trong từng dịch vụ
              </li>
              <li className="text-lg text-gray-700">Sáng tạo có định hướng</li>
              <li className="text-lg text-gray-700">Thấm mỹ có chiều sâu</li>
              <li className="text-lg text-gray-700">Thiết kế chạm cảm xúc</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
