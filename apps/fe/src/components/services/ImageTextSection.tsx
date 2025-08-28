export default function ImageTextSection() {
  return (
    <section className="content-wrapper py-[60px] max-md:!px-0">
      <div className="relative mb-2">
        <div className="w-full" style={{ aspectRatio: '1300/666' }}>
          <img
            src="/assets/images/services/thietkethuonghieu/thietke6.png"
            alt="Andrea Agency Portfolio Presentations"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* About Text Content */}
      <div className="mx-auto max-w-4xl text-center max-md:px-[28px]">
        <p className="text-lg leading-relaxed text-gray-700">
          Tại Andrea, chúng tôi tin rằng mỗi thương hiệu là một thực thể sống,
          có linh hồn, cảm xúc, tính cách và có hành trình phát triển riêng. Sự
          kết hợp giữa chiến lược thương hiệu, chiến lược kinh doanh, chiến lược
          công ty và hình ảnh thương hiệu thể hiện nhất quán, chúng tôi đảm bảo
          mỗi thiết kế không chỉ đẹp mà còn đúng định hướng, đúng mục tiêu
          truyền thông và tầm nhìn thương hiệu.
        </p>
      </div>
    </section>
  );
}
