import React from 'react';

type Step = {
  id: number | string;
  title: string;
  bullets: string[];
};

const defaultSteps: Step[] = [
  {
    id: 1,
    title: 'Khai vấn & tiếp nhận thông tin',
    bullets: [
      'Khám phá nhu cầu, mong muốn và những trăn trở về bao bì hiện tại',
      'Hiểu rõ sản phẩm, khách hàng mục tiêu, thông điệp cần truyền tải',
      'Lập brief chiến lược sáng tạo',
    ],
  },
  {
    id: 2,
    title: 'Nghiên cứu & xây dựng concept',
    bullets: [
      'Phân tích thị trường, đối thủ, hành vi mua hàng',
      'Xây dựng thông điệp & câu chuyện thương hiệu',
      'Lên moodboard định hướng hình ảnh, màu sắc, phong cách',
    ],
  },
  {
    id: 3,
    title: 'Thiết kế & sáng tạo',
    bullets: [
      'Khám phá nhu cầu, mong muốn và những trăn trở về bao bì hiện tại',
      'Hiểu rõ sản phẩm, khách hàng mục tiêu, thông điệp cần truyền tải',
      'Lập brief chiến lược sáng tạo',
    ],
  },
  {
    id: 4,
    title: 'Chỉnh sửa & hoàn thiện',
    bullets: [
      'Lấy các ý kiến phản hồi, phản biện từ góc nhìn từ khách hàng và nhà sản xuất',
      'Chỉnh sửa sau in kiểm thử và bàn giao thiết kế',
      'Kiểm tra và in kiểm thử trải nghiệm trước khi sản xuất hàng loạt',
    ],
  },
  {
    id: 5,
    title: 'Hỗ trợ truyền thông',
    bullets: [
      'Tư vấn và thiết kế hình ảnh truyền thông cho sản phẩm: ảnh phối cảnh, video, showcase...',
    ],
  },
  {
    id: 6,
    title: 'Sản xuất & kiểm soát chất lượng',
    bullets: [
      'Hỗ trợ lựa chọn nhà in, vật liệu và thông số kỹ thuật sản xuất',
      'Giám sát in ấn, kiểm tra màu sắc, chất lượng vật liệu',
      'Quản lý tiến độ và nghiệm thu sản phẩm mẫu trước sản xuất hàng loạt',
    ],
  },
  {
    id: 7,
    title: 'Bàn giao & hỗ trợ sau sản xuất',
    bullets: [
      'Bàn giao file thiết kế, hướng dẫn in ấn và tài liệu kỹ thuật',
      'Hỗ trợ giải quyết các vấn đề phát sinh sau sản xuất',
      'Tư vấn tối ưu chi phí và lựa chọn nhà cung cấp cho các lần tiếp theo',
    ],
  },
];

function StepCard({ step, className }: { step: Step; className?: string }) {
  return (
    <div
      className={`rounded-10 bg-[#F2F2F2] ${
        className || 'px-[21px] py-[35px] max-md:px-[16px] max-md:py-[29px]'
      }`}
    >
      <div className="text-text-primary mb-3 text-[24px] font-medium leading-[30px]">
        {step.id}. {step.title}
      </div>
      {step.bullets?.length === 1 ? (
        <div className="text-[16px] leading-relaxed text-[#7D7D7D]">
          {step.bullets[0]}
        </div>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-[16px] leading-relaxed text-[#7D7D7D]">
          {(step.bullets || []).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProcessSection({ data }: any) {
  const steps: Step[] = (
    data && data.steps && data.steps.length ? data.steps : defaultSteps
  ) as Step[];

  // Define rows with slice ranges and grid classes
  const rows = [
    {
      items: steps.slice(0, 2),
      gridCols: 'grid-cols-2',
      gapClass: 'mb-5',
      cardClass: 'px-[43px] py-[34px] max-sd:py-[35px]',
    },
    {
      items: steps.slice(2, 5),
      gridCols: 'grid-cols-3',
      gapClass: 'mb-5',
      cardClass: 'px-[21px] py-[35px] min-h-[418px] max-sd:min-h-[300px]',
    },
    {
      items: steps.slice(5, 7),
      gridCols: 'grid-cols-2',
      gapClass: 'mb-16',
      cardClass: 'px-[43px] py-[34px] max-sd:py-[35px]',
    },
  ];

  return (
    <section className="content-wrapper my-[56px] max-md:my-[29px]">
      <h2 className="text-brand-orange font-playfair mb-6 max-w-[869px] text-left text-[40px] font-medium !leading-[60px] max-md:text-[27px] max-md:!leading-[40px]">
        {data?.title}
      </h2>

      {rows
        .filter((r) => r.items && r.items.length > 0)
        .map((row, idx) => {
          const colsClass =
            row.items.length === 1
              ? 'grid-cols-1'
              : row.items.length === 2
                ? 'grid-cols-2'
                : row.gridCols;
          return (
            <div
              key={idx}
              className={`${row.gapClass} grid ${colsClass} max-sd:grid-cols-1 gap-5`}
            >
              {row.items.map((s: Step) => (
                <StepCard
                  key={`${s.id}-${idx}`}
                  step={s}
                  className={`${row.cardClass} max-md:px-[16px] max-md:py-[29px]`}
                />
              ))}
            </div>
          );
        })}
    </section>
  );
}
