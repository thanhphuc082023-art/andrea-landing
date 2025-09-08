import { AboutUsVision } from '@/types/about-us';
import { clsx } from 'clsx';

interface VisionsSectionProps {
  visions?: AboutUsVision[];
}

export default function VisionsSection({ visions }: VisionsSectionProps) {
  // Default Visions data as fallback
  const defaultVisions: AboutUsVision[] = [
    {
      title: 'Tầm nhìn',
      contents: [
        {
          value:
            'Với khát vọng tôn vinh giá trị thương hiệu Việt và đồng hành cùng doanh nghiệp trong nước vươn tầm quốc tế, Andrea định hướng trở thành đơn vị tư vấn, thiết kế thương hiệu cảm xúc và đồng hành cùng doanh nghiệp phát triển thương hiệu bền vững tại Việt Nam.',
        },
      ],
    },
    {
      title: 'Sứ mệnh',
      contents: [
        {
          value:
            'Andrea ra đời với mong muốn đồng hành cùng các doanh nghiệp trên hành trình kiến tạo những định hướng ý nghĩa, truyền tải trọn vẹn giá trị thương hiệu qua các giải pháp tư vấn chiến lược và sản phẩm thiết kế chất lượng.',
        },
        {
          value:
            'Hơn cả dịch vụ, Andrea hướng tới trở thành người bạn đáng tin cậy, thấu hiểu sâu sắc mỗi thương hiệu, để cùng doanh nghiệp tỏa sáng trên mọi chặng đường phát triển.',
        },
      ],
    },
    {
      title: 'Giá trị cốt lõi',
      contents: [
        {
          value: 'Chú tâm trong từng dịch vụ',
        },
        {
          value: 'Sáng tạo có định hướng',
        },
        {
          value: 'Thẩm mỹ có chiều sâu',
        },
        {
          value: 'Thiết kế chạm cảm xúc',
        },
      ],
    },
  ];

  const finalVisions = visions && visions.length ? visions : defaultVisions;

  return (
    <div className="bg-[#D9D9D9] py-[70px] max-md:py-[48px]">
      <div className="content-wrapper">
        {finalVisions.map((entry, idx) => {
          const isRight = idx % 2 === 0;
          return (
            <section key={idx} className="mb-20">
              <div
                className={clsx(
                  'mb-8 flex items-end',
                  isRight ? '' : 'justify-end'
                )}
              >
                {!isRight ? (
                  <div className="bg-brand-orange h-0.5 flex-1" />
                ) : null}
                <h2
                  className={clsx(
                    isRight ? 'mr-6' : 'ml-6',
                    'font-playfair text-brand-orange text-[50px] leading-[41px] max-md:text-[35px] max-md:leading-[30px]'
                  )}
                >
                  {entry?.title}
                </h2>
                {isRight ? (
                  <div className="bg-brand-orange h-0.5 flex-1" />
                ) : null}
              </div>

              <div
                className={clsx(
                  'max-w-[53%] max-md:max-w-full',
                  isRight ? '' : 'ml-auto'
                )}
              >
                {entry?.contents?.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className={clsx(
                      isRight ? 'text-left' : 'text-right',
                      `text-[16px] leading-relaxed text-black ${
                        pIdx < entry.contents.length - 1 ? 'mb-2' : ''
                      }`
                    )}
                  >
                    {paragraph?.value}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
