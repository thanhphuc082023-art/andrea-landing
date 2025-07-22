import clsx from 'clsx';
import ServiceCard from './ServiceCard';
import { ConsultingIcon } from '@/assets/icons/ConsultingIcon';
import PackagingIcon from '@/assets/icons/PackagingIcon';
import ProfileCatalogueIcon from '@/assets/icons/ProfileCatalogueIcon';
import EventIdentityIcon from '@/assets/icons/EventIdentityIcon';
import WebDesignIcon from '@/assets/icons/WebDesignIcon';
import SocialBrandingIcon from '@/assets/icons/SocialBrandingIcon';
import MediaProductionIcon from '@/assets/icons/MediaProductionIcon';
import ServiceIcon from '@/assets/icons/ServiceIcon';

const services = [
  {
    id: 1,
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
    title: 'Tư vấn chiến lược',
    description:
      'Đồng hành tư vấn để tìm ra câu chuyện ý nghĩa và giá trị khác biệt của thương hiệu.',
    isLarge: false,
  },
  {
    id: 3,
    title: 'Thiết kế bao bì',
    description:
      "Lorem ipsum ullisae adipisci hul remonte al industrie de l'imprimerie au XVIe siècle. Un imprimeur inconnue à utilisé une version modifiée du livre philosophique de Cicéron.",
    isLarge: false,
  },
  {
    id: 4,
    title: 'Profile, Catalogue',
    description: 'Biến tài liệu doanh nghiệp thành tuyên ngôn thương hiệu.',
    isLarge: false,
  },
  {
    id: 5,
    title: 'Thiết kế nhận diện sự kiện',
    description: 'Tạo dấu ấn sâu sắc – Kết nối cảm xúc – Nâng tầm trải nghiệm',
    isLarge: false,
  },
  {
    id: 6,
    title: 'Thiết kế web',
    description:
      'Thiết kế không gian số có linh hồn – kết nối cảm xúc, thể hiện tầm vóc thương hiệu.',
    isLarge: false,
  },
  {
    id: 7,
    title: 'Social Branding',
    description:
      "Lorem ipsum ullisae adipisci hul remonte al industrie de l'imprimerie au XVIe siècle. Un imprimeur inconnue à utilisé une version modifiée du livre philosophique de Cicéron.",
    isLarge: false,
  },
  {
    id: 8,
    title: 'Quay phim, chụp hình',
    description:
      "Lorem ipsum ullisae adipisci hul remonte al industrie de l'imprimerie au XVIe siècle. Un imprimeur inconnue à utilisé une version modifiée du livre philosophique de Cicéron.",
    isLarge: false,
  },
];

function Services() {
  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-12 max-sd:mb-14 max-md:mb-11')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            Dịch vụ
          </h2>
        </div>

        {/* Services Grid */}
        <div
          className={clsx(
            'max-sd:grid-cols-4 grid grid-cols-6 gap-6 max-md:grid-cols-1'
          )}
        >
          {/* Card lớn chiếm 2 cột, 4 hàng */}
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-4 max-md:col-span-1'
            )}
          >
            <ServiceCard
              active
              service={services[0]}
              icon={
                <div className="text-brand-orange">
                  <ServiceIcon className="text-brand-orange" />
                </div>
              }
            />
          </div>
          {/* Các card còn lại */}
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[1]}
              icon={
                <div className="text-grayECO">
                  <ConsultingIcon />
                </div>
              }
            />
          </div>
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[2]}
              icon={
                <div className="text-grayECO">
                  <PackagingIcon />
                </div>
              }
            />
          </div>
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[3]}
              icon={
                <div className="text-grayECO">
                  <ProfileCatalogueIcon />
                </div>
              }
            />
          </div>
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[4]}
              icon={
                <div className="text-grayECO">
                  <EventIdentityIcon />
                </div>
              }
            />
          </div>
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[5]}
              icon={
                <div className="text-grayECO">
                  <WebDesignIcon />
                </div>
              }
            />
          </div>
          <div
            className={clsx(
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[6]}
              icon={
                <div className="text-grayECO">
                  <SocialBrandingIcon />
                </div>
              }
            />
          </div>
          <div
            className={clsx(
              'max-sd:col-span-4 col-span-2 row-span-2 max-md:col-span-1'
            )}
          >
            <ServiceCard
              service={services[7]}
              icon={
                <div className="text-grayECO">
                  <MediaProductionIcon />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
