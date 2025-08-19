import clsx from 'clsx';

import ServiceCard from './ServiceCard';

interface Service {
  id?: number;
  position: number;
  title: string;
  description: string;
  slogan?: unknown[];
  icon?: unknown;
  iconActive?: unknown;
}

interface ServicesData {
  title?: string;
  items?: Service[];
}

interface ServicesProps {
  servicesData?: ServicesData;
}

function Services({ servicesData = {} }: ServicesProps) {
  const services = servicesData?.items || servicesExample;

  // Layout config cho 5 items đầu
  const layoutConfig = [
    { colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 7, active: false }, // Item 1
    { colStart: 3, colEnd: 5, rowStart: 1, rowEnd: 5, active: false }, // Item 2
    { colStart: 5, colEnd: 7, rowStart: 1, rowEnd: 4, active: false }, // Item 3
    { colStart: 3, colEnd: 5, rowStart: 5, rowEnd: 7, active: false }, // Item 4
    { colStart: 5, colEnd: 7, rowStart: 4, rowEnd: 7, active: false }, // Item 5
  ];

  interface LayoutConfig {
    colStart: number;
    colEnd: number;
    rowStart: number;
    rowEnd: number;
    active: boolean;
  }

  const renderServiceCard = (
    service: Service,
    config: LayoutConfig,
    index: number
  ) => {
    if (!service) return null;

    const gridClass = clsx(
      // Desktop grid positioning
      `col-start-${config.colStart} col-end-${config.colEnd} row-start-${config.rowStart} row-end-${config.rowEnd}`,
      // Tablet large (max-sd: 1194px) - simplify to 2x2 grid
      'max-sd:col-span-2 max-sd:row-span-3',
      // Tablet (max-lg: 1024px) - stack vertically with larger cards
      'max-lg:col-span-3 max-lg:row-span-4',
      // Mobile (max-md: 768px) - single column
      'max-md:col-span-1 max-md:row-span-auto'
    );

    return (
      <div key={`service-${service.id || index}`} className={gridClass}>
        <ServiceCard service={service} active={config.active} />
      </div>
    );
  };

  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange font-medium',
              'max-sd:text-[40px] max-370:text-[28px] text-[50px] max-lg:text-[36px] max-md:text-[35px]'
            )}
          >
            {servicesData?.title || 'Dịch vụ'}
          </h2>
        </div>

        {/* Services Grid */}
        <div
          className={clsx(
            'grid grid-cols-6 grid-rows-4 gap-[15px]',
            'max-sd:grid-cols-4',
            'max-lg:grid-cols-3',
            'max-md:grid-cols-1'
          )}
        >
          {/* Render 5 items đầu với layout cố định */}
          {services
            .slice(0, 5)
            .map((service, index) =>
              renderServiceCard(service, layoutConfig[index], index)
            )}

          {/* Các item còn lại (từ item 6 trở đi) */}
          {services.slice(5).map((service, index) => {
            const actualIndex = index + 6; // Vị trí thực tế trong mảng services
            const remainingServices = services.slice(5);
            const isLastItem = index === remainingServices.length - 1;

            let gridClass = clsx(
              // Desktop default
              'col-span-2 row-span-3',
              // Tablet large (max-sd: 1194px)
              'max-sd:col-span-2 max-sd:row-span-3',
              // Tablet (max-lg: 1024px)
              'max-lg:col-span-3 max-lg:row-span-4',
              // Mobile (max-md: 768px)
              'max-md:col-span-1 max-md:row-span-auto'
            );

            if (isLastItem && actualIndex >= 6) {
              const pattern1 = Array.from(
                { length: Math.ceil((services.length - 5) / 3) },
                (_, i) => 6 + i * 3
              );
              const pattern2 = Array.from(
                { length: Math.ceil((services.length - 6) / 3) },
                (_, i) => 7 + i * 3
              );

              if (pattern1.includes(actualIndex)) {
                gridClass = clsx(
                  // Desktop
                  'col-span-6 row-span-3',
                  // Tablet large (max-sd: 1194px)
                  'max-sd:col-span-4 max-sd:row-span-3',
                  // Tablet (max-lg: 1024px)
                  'max-lg:col-span-3 max-lg:row-span-4',
                  // Mobile (max-md: 768px)
                  'max-md:col-span-1 max-md:row-span-auto'
                );
              } else if (pattern2.includes(actualIndex)) {
                gridClass = clsx(
                  // Desktop
                  'col-span-4 row-span-3',
                  // Tablet large (max-sd: 1194px)
                  'max-sd:col-span-4 max-sd:row-span-3',
                  // Tablet (max-lg: 1024px)
                  'max-lg:col-span-3 max-lg:row-span-4',
                  // Mobile (max-md: 768px)
                  'max-md:col-span-1 max-md:row-span-auto'
                );
              }
            }

            return (
              <div
                key={`service-${service.id || actualIndex}`}
                className={gridClass}
              >
                <ServiceCard service={service} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;

const servicesExample = [
  {
    id: 1,
    position: 1,
    title: 'Thiết kế thương hiệu',
    description:
      'Không chỉ dừng lại ở việc tạo ra logo hay bộ nhận diện, mà là quá trình khai mở bản chất thương hiệu và thể hiện nó bằng hình ảnh một cách nhất quán, có chiều sâu.',
    isLarge: true,
    slogan: [
      'Đặt tên thương hiệu',
      'Sáng tác Slogan',
      'Thiết kế logo',
      'Bộ nhận diện thương hiệu',
    ],
  },
  {
    id: 2,
    position: 2,
    title: 'Tư vấn chiến lược',
    description:
      'Đồng hành tư vấn để tìm ra câu chuyện ý nghĩa và giá trị khác biệt của thương hiệu.',
    isLarge: false,
  },
  {
    id: 3,
    position: 3,
    title: 'Thiết kế bao bì',
    description:
      "Lorem ipsum ullisae adipisci hul remonte al industrie de l'imprimerie au XVIe siècle. Un imprimeur inconnue à utilisé une version modifiée du livre philosophique de Cicéron.",
    isLarge: false,
  },
  {
    id: 4,
    position: 4,
    title: 'Profile, Catalogue',
    description: 'Biến tài liệu doanh nghiệp thành tuyên ngôn thương hiệu.',
    isLarge: false,
  },
  {
    id: 5,
    position: 5,
    title: 'Thiết kế nhận diện sự kiện',
    description: 'Tạo dấu ấn sâu sắc – Kết nối cảm xúc – Nâng tầm trải nghiệm',
    isLarge: false,
  },
  {
    id: 6,
    position: 6,
    title: 'Thiết kế web',
    description:
      'Thiết kế không gian số có linh hồn – kết nối cảm xúc, thể hiện tầm vóc thương hiệu.',
    isLarge: false,
  },
  {
    id: 7,
    position: 7,
    title: 'Social Branding',
    description:
      "Lorem ipsum ullisae adipisci hul remonte al industrie de l'imprimerie au XVIe siècle. Un imprimeur inconnue à utilisé une version modifiée du livre philosophique de Cicéron.",
    isLarge: false,
  },
  {
    id: 8,
    position: 8,
    title: 'Quay phim, chụp hình',
    description:
      "Lorem ipsum ullisae adipisci hul remonte al industrie de l'imprimerie au XVIe siècle. Un imprimeur inconnue à utilisé une version modifiée du livre philosophique de Cicéron.",
    isLarge: false,
  },
];
