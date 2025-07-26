import React from 'react';
import clsx from 'clsx';

interface Service {
  id?: number;
  position: number;
  title: string;
  description: string;
  slogan?: any[];
  icon?: string;
}

interface ServiceCardProps {
  service: Service;
  active?: boolean;
  iconUrl?: string;
}

function ServiceCard({
  service,
  active = false,
  iconUrl = '',
}: ServiceCardProps) {
  if (!service) {
    return null;
  }

  const { id, position, title, description, slogan } = service;

  return (
    <div
      className={clsx(
        'rounded-10 relative h-full min-h-[295px] cursor-pointer transition-all duration-300 hover:shadow-lg',
        'dark:bg-slate-800',
        active
          ? 'border-brand-orange border-[2px] bg-transparent'
          : 'bg-card-bg'
      )}
    >
      {/* Content Container */}
      <div className={clsx('flex h-full flex-col p-8')}>
        {/* Title with Number */}
        <div className={clsx('mb-6 flex items-start justify-between gap-2')}>
          <h3
            className={clsx(
              'text-text-primary text-2xl leading-normal',
              'flex-1 dark:text-white',
              active ? 'font-semibold' : 'font-normal'
            )}
          >
            {position}. {title}
          </h3>

          {/* Icon positioned absolutely in top right */}
          <div className={clsx('shrink-0')}>
            {iconUrl && (
              <img
                src={iconUrl}
                alt={`${title} icon`}
                className={clsx(
                  'h-8 w-8 object-contain',
                  active ? 'opacity-100' : 'opacity-70'
                )}
                style={{
                  filter: active ? 'none' : 'grayscale(100%)',
                }}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className={clsx('flex flex-1 flex-col justify-between gap-14')}>
          <p
            className={clsx(
              'text-base font-normal leading-6 tracking-wide',
              'text-gray-700 dark:text-slate-300'
            )}
            style={{
              lineHeight: '24px',
              letterSpacing: '0.5px',
            }}
          >
            {description}
          </p>
          {active && slogan?.length > 0 && (
            <ul>
              {slogan?.map((item, index) => (
                <li
                  key={`${item}-${id}-${index + 1}`}
                  className={clsx(
                    'text-brand-orange text-base font-normal leading-6 tracking-wide',
                    'dark:text-slate-300',
                    'mt-1'
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
