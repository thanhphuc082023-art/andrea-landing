import Image from 'next/image';

export default function ContentSection() {
  return (
    <div className="content-wrapper py-[140px] max-md:py-[67px]">
      <div className="flex flex-wrap items-center justify-center gap-12 max-md:flex-col lg:gap-[130px]">
        {/* Left side - Image */}
        <div className="aspect-[420/490] w-full max-w-md shrink-0">
          <Image
            src="/assets/images/about-us/content.png"
            alt="Andrea agency hexagonal logo with decorative branches"
            width={420}
            height={490}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="flex-1 space-y-6">
          <p className="leading-relaxed text-gray-800">
            Kính gửi Quý khách hàng thân mến,
          </p>

          <p className="leading-relaxed text-gray-800">
            Andrea là Agency chuyên cung cấp dịch vụ tư vấn và thiết kế thương
            hiệu. Chúng tôi luôn xem mình là người bạn đồng hành thấu hiểu, sẵn
            sàng lắng nghe và chia sẻ để mang đến những giải pháp tối ưu cho sự
            phát triển của doanh nghiệp.
          </p>

          <p className="leading-relaxed text-gray-800">
            Với sự tận tâm trong quá trình tư vấn và trách nhiệm trong từng sản
            phẩm thiết kế, Andrea luôn hướng tới tạo nên những hình ảnh thương
            hiệu không chỉ đẹp mắt mà còn phản ánh đúng cá tính, phù hợp định
            hướng kinh doanh và chạm đến cảm xúc khách hàng.
          </p>

          <p className="leading-relaxed text-gray-800">
            Thương hiệu không chỉ là hình ảnh nhận diện, mà còn mang trong mình
            giá trị cảm xúc, ý nghĩa nhân văn và khát vọng vươn xa. Andrea đồng
            hành cùng doanh nghiệp để xây dựng hệ sinh thái bền vững, góp phần
            tạo ra nhiều cơ hội việc làm và lan tỏa những giá trị tốt đẹp cho
            cộng đồng.
          </p>

          <p className="leading-relaxed text-gray-800">
            Đó cũng chính là thành công lớn nhất mà Andrea luôn hướng tới và
            định vị mình trong hành trình phát triển.
          </p>

          <p className="leading-relaxed text-gray-800">
            Trân trọng cảm ơn Quý khách đã tin tưởng và đồng hành cùng Andrea.
          </p>

          <p className="font-medium leading-relaxed text-gray-800">
            Andrea Agency!
          </p>
        </div>
      </div>
    </div>
  );
}
