import clsx from 'clsx';
import React from 'react';

import { getStrapiMediaUrl } from '@/utils/helper';

interface Service {
  id?: number;
  position: number;
  title: string;
  description: string;
  slogan?: any[];
  icon?: any;
  iconActive?: any;
}

interface ServiceCardProps {
  service: Service;
  active?: boolean;
}

function ServiceCard({ service, active = false }: ServiceCardProps) {
  if (!service) {
    return null;
  }

  const { id, position, title, description, slogan, icon, iconActive } =
    service;

  const iconUrl = getStrapiMediaUrl(icon);
  const iconActiveUrl = getStrapiMediaUrl(iconActive);

  return (
    <div
      className={clsx(
        'rounded-10 group relative h-full cursor-pointer transition-all duration-300 hover:shadow-lg',
        'border-card-bg border-[2px] dark:bg-slate-800',
        'hover:border-brand-orange hover:bg-transparent',
        active ? 'border-brand-orange bg-transparent' : 'bg-card-bg'
      )}
    >
      {/* Content Container */}
      <div
        className={clsx(
          'relative flex h-full flex-col',
          'p-8 max-lg:p-6 max-md:p-4'
        )}
      >
        {/* Title with Number */}
        <div
          className={clsx(
            'mb-6 flex items-start justify-between gap-2',
            'max-md:mb-4'
          )}
        >
          <div className="flex w-full gap-1">
            <h3
              className={clsx(
                'text-text-primary shrink-0 leading-normal',
                'dark:text-white',
                'text-2xl font-semibold max-lg:text-xl max-md:text-lg'
              )}
            >
              {position}.
            </h3>
            <h3
              className={clsx(
                'text-text-primary max-w-[63%] leading-normal',
                'flex-1 dark:text-white',
                'text-2xl font-semibold max-lg:text-xl max-md:text-lg'
              )}
            >
              {title}
            </h3>
          </div>

          {/* Icon positioned absolutely in top right */}
          {iconUrl && (
            <div
              className={clsx(
                'absolute shrink-0 opacity-100 group-hover:opacity-0',
                'right-8 top-8 max-lg:right-6 max-lg:top-6 max-md:right-4 max-md:top-4'
              )}
            >
              <img
                src={iconUrl}
                alt={`${title} icon`}
                className={clsx(
                  'object-contain',
                  'h-8 w-8 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:w-5'
                )}
              />
            </div>
          )}
          {iconActiveUrl && (
            <div
              className={clsx(
                'absolute shrink-0 opacity-0 group-hover:opacity-100',
                'right-8 top-8 max-lg:right-6 max-lg:top-6 max-md:right-4 max-md:top-4',
                active ? 'opacity-100' : 'opacity-0'
              )}
            >
              <img
                src={iconActiveUrl}
                alt={`${title} icon`}
                className={clsx(
                  'object-contain',
                  'h-8 w-8 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:w-5'
                )}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div
          className={clsx(
            'flex flex-1 flex-col justify-between',
            slogan?.length > 0 ? 'gap-10 max-md:gap-6' : ''
          )}
        >
          <p
            className={clsx(
              'font-normal leading-6 tracking-wide',
              'text-[#7D7D7D]',
              // Responsive text sizes
              'text-base max-lg:text-sm max-md:text-sm'
            )}
            style={{
              lineHeight: '24px',
              letterSpacing: '0.5px',
            }}
          >
            {description}
          </p>
          {slogan?.length > 0 && (
            <ul>
              {slogan?.map((item, index) => (
                <li
                  key={`${item}-${id}-${index + 1}`}
                  className={clsx(
                    'font-normal leading-6 tracking-wide',
                    'group-hover:text-brand-orange text-[#979797] transition-colors duration-300',
                    'mt-1',
                    // Responsive text sizes
                    'text-base max-lg:text-sm max-md:text-sm'
                  )}
                >
                  {item?.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
