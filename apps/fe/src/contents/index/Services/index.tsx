import clsx from 'clsx';
import ServiceCard from './ServiceCard';
// import { ConsultingIcon } from '@/assets/icons/ConsultingIcon';
// import PackagingIcon from '@/assets/icons/PackagingIcon';
// import ProfileCatalogueIcon from '@/assets/icons/ProfileCatalogueIcon';
// import EventIdentityIcon from '@/assets/icons/EventIdentityIcon';
// import WebDesignIcon from '@/assets/icons/WebDesignIcon';
// import SocialBrandingIcon from '@/assets/icons/SocialBrandingIcon';
// import MediaProductionIcon from '@/assets/icons/MediaProductionIcon';
// import ServiceIcon from '@/assets/icons/ServiceIcon';
import { getStrapiMediaUrl } from '@/utils/helper';

interface ServicesProps {
  servicesData?: any;
}

function Services({ servicesData = [] }: ServicesProps) {
  const services = servicesData?.items || [];

  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            {servicesData?.title || 'Dịch vụ'}
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
              active={true}
              service={services[0]}
              iconUrl={getStrapiMediaUrl(services[0]?.iconActive)}
            />
          </div>
          {/* Các card còn lại */}
          {services.slice(1).map((service, index) => {
            const remainingServices = services.slice(1);
            const isLastItem = index === remainingServices.length - 1;
            let gridClass =
              'max-sd:col-span-2 col-span-2 row-span-2 max-md:col-span-1';
            if (isLastItem) {
              // Vị trí thực tế của last item trong toàn bộ services (bắt đầu từ 1)
              const lastItemPos = index + 2; // +1 vì slice(1), +1 vì index bắt đầu từ 0

              if (lastItemPos >= 6) {
                if (
                  Array.from(
                    {
                      length: Math.ceil((services.length - 5) / 3),
                    },
                    (_, i) => 6 + i * 3
                  ).includes(lastItemPos)
                ) {
                  gridClass = 'col-span-6 row-span-2 max-md:col-span-1';
                } else if (
                  Array.from(
                    { length: Math.ceil((services.length - 6) / 3) },
                    (_, i) => 7 + i * 3
                  ).includes(lastItemPos)
                ) {
                  gridClass = 'col-span-4 row-span-2 max-md:col-span-1';
                } else {
                  gridClass = 'col-span-2 row-span-2 max-md:col-span-1';
                }
              }
            }

            return (
              <div key={`service-${service.id}`} className={clsx(gridClass)}>
                <ServiceCard
                  service={service}
                  iconUrl={getStrapiMediaUrl(service.icon)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
