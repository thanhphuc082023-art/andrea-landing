import clsx from 'clsx';
import React from 'react';
import Link from 'next/link';

import ServiceIcon from '@/assets/icons/ServiceIcon';
import { getStrapiMediaUrl } from '@/utils/helper';
import { useRouter } from 'next/router';

interface Service {
  id?: number;
  position: number;
  title: string;
  description: string;
  slogan?: any[];
  icon?: any;
  iconActive?: any;
  url?: string;
}

interface ServiceCardProps {
  service: Service;
  active?: boolean;
}

function ServiceCard({ service, active = false }: ServiceCardProps) {
  const router = useRouter();
  if (!service) {
    return null;
  }

  const { id, position, title, description, slogan, icon, iconActive } =
    service;

  const iconUrl = icon ? getStrapiMediaUrl(icon) : null;
  const iconActiveUrl = iconActive ? getStrapiMediaUrl(iconActive) : null;

  // Safely render slogan items which may be string or object ({ id, title, subtitle, description })
  const getText = (val: any) =>
    typeof val === 'string'
      ? val
      : (val?.title ??
        val?.subtitle ??
        val?.description ??
        (val ? String(val) : '--'));

  return (
    <div
      className={clsx(
        'rounded-10 group relative h-full transition-all duration-300 hover:shadow-lg',
        'dark:bg-slate-800',
        'hover:bg-white',
        active ? 'bg-white' : 'bg-card-bg'
      )}
    >
      {/* <div className="absolute bottom-2 right-2 z-[20] translate-y-2 transform text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <span className="relative inline-block shrink-0">
            <button
              onClick={() =>
                service.url ? router.push(`/service/${service.url}`) : null
              }
              className="after:bg-brand-orange relative z-30 shrink-0 overflow-hidden rounded-md bg-black/10 px-2 py-1 text-sm font-semibold text-white after:absolute after:bottom-0 after:left-0 after:-z-20 after:h-1 after:w-1 after:translate-y-full after:rounded-md after:transition-all after:duration-700 after:hover:scale-[300] after:hover:transition-all after:hover:duration-700"
            >
              Xem thêm
            </button>
          </span>
        </div>
      </div> */}

      {/* Content Container */}
      <div
        className={clsx(
          'relative flex h-full flex-col',
          'px-[25px] py-[35px] max-md:p-4'
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
                'text-text-primary group-hover:text-brand-orange shrink-0 leading-normal transition-all duration-300',
                'dark:text-white',
                'text-[24px] font-semibold leading-[32px] max-md:text-lg'
              )}
            >
              {position}.
            </h3>
            <h3
              className={clsx(
                'text-text-primary group-hover:text-brand-orange max-w-[80%] leading-normal transition-all duration-300',
                'flex-1 dark:text-white',
                'text-[24px] font-semibold leading-[32px] max-md:text-lg'
              )}
            >
              {title}
            </h3>
          </div>

          {/* Icon positioned absolutely in top right */}
          <div
            className={clsx(
              'absolute shrink-0 opacity-100 group-hover:opacity-0',
              'right-[25px] top-[35px] max-md:right-4 max-md:top-4'
            )}
          >
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={`${title} icon`}
                className={clsx(
                  'object-contain',
                  'h-8 w-8 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:w-5'
                )}
              />
            ) : (
              <ServiceIcon
                className={clsx(
                  'object-contain',
                  'h-8 w-8 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:w-5'
                )}
              />
            )}
          </div>

          <div
            className={clsx(
              'absolute shrink-0 opacity-0 group-hover:opacity-100',
              'right-[25px] top-[35px] max-md:right-4 max-md:top-4',
              active ? 'opacity-100' : 'opacity-0'
            )}
          >
            {iconActiveUrl ? (
              <img
                src={iconActiveUrl || ''}
                alt={`${title} icon`}
                className={clsx(
                  'object-contain',
                  'h-8 w-8 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:w-5'
                )}
              />
            ) : (
              <ServiceIcon
                className={clsx(
                  'text-brand-orange object-contain',
                  'h-8 w-8 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:w-5'
                )}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div
          className={clsx(
            'flex flex-1 flex-col justify-between',
            (slogan?.length ?? 0) > 0 ? 'gap-10 max-md:gap-6' : ''
          )}
        >
          <p
            className={clsx(
              'font-normal leading-6 tracking-wide',
              'text-[#7d7d7d]',
              // Responsive text sizes
              'text-base max-lg:text-sm max-md:text-sm'
            )}
            style={{
              lineHeight: '24px',
              letterSpacing: '0.5px',
            }}
          >
            {description || '--'}
          </p>
          {(slogan?.length ?? 0) > 0 && (
            <ul>
              {slogan?.map((item, index) => (
                <li
                  key={`slogan-${item?.id ?? index}`}
                  className={clsx(
                    'font-normal leading-6 tracking-wide',
                    'group-hover:text-brand-orange text-[#979797] transition-colors duration-300',
                    'mt-1',
                    // Responsive text sizes
                    'text-base max-lg:text-sm max-md:text-sm'
                  )}
                >
                  {typeof item === 'string' ? (
                    item
                  ) : item?.subtitle ? (
                    <Link href={String(item.subtitle)}>
                      {item.title || String(item.subtitle)}
                    </Link>
                  ) : (
                    getText(item)
                  )}
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
