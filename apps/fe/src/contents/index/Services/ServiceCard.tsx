import React from 'react';
import clsx from 'clsx';

interface Service {
  id: number;
  title: string;
  description: string;
  slogan?: string[];
}

interface ServiceCardProps {
  service: Service;
  active?: boolean;
  icon?: React.ReactNode;
}
function ServiceIcon({ active = false }: { active?: boolean }) {
  return (
    <svg
      width="32"
      height="33"
      viewBox="0 0 33 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M32.1531 15.6796C32.1531 17.2232 31.4275 18.5545 30.3665 19.2812V29.2691C30.3665 29.8736 29.9707 31.3593 28.5799 31.3593C28.1566 31.3593 27.7718 31.1856 27.464 30.9027L22.7144 26.4586C20.3286 24.2269 17.3382 22.9985 14.2872 22.9985H12.7205C12.5666 23.6674 12.4731 24.362 12.4731 25.0887C12.4731 26.986 13.0174 28.7417 13.9354 30.1502C14.815 31.5008 13.9464 33.4495 12.4896 33.4495H6.55816C5.893 33.4495 5.26082 33.0314 4.97497 32.3369C4.06243 30.1438 3.5457 27.687 3.5457 25.0887L3.57318 22.9985C1.59968 22.9985 0 21.127 0 18.8181V12.5476C0 10.2387 1.59968 8.36719 3.57318 8.36719H14.2927C17.3437 8.36719 20.3396 7.1388 22.7199 4.90712L27.4695 0.463058C27.7883 0.154353 28.1841 0 28.5799 0C29.9762 0 30.3665 1.5178 30.3665 2.09019V12.0781C31.4275 12.8048 32.1531 14.1361 32.1531 15.6796ZM14.2872 20.9019V10.451H3.56768C2.58369 10.451 1.7811 11.3899 1.7811 12.5411V18.8117C1.7811 19.9629 2.58369 20.9019 3.56768 20.9019H14.2872ZM10.6866 25.0823C10.6866 24.3941 10.769 23.6931 10.9009 22.9921H5.35427V23.0243L5.32679 25.1144C5.32679 27.2882 5.74458 29.3527 6.57465 31.3529H12.4841C11.3132 29.5778 10.6866 27.3911 10.6866 25.0823ZM28.5799 2.09019V2.10305L23.8414 6.54069C21.6095 8.63088 18.9049 9.92358 16.0793 10.3159V21.0434C18.8994 21.4357 21.604 22.7348 23.8358 24.8186L28.5744 29.2498C28.5744 29.2498 28.5854 29.2048 28.5909 29.1919V2.09019H28.5799Z"
        fill={active ? '#F15A24' : '#E5E7EB'}
      />
    </svg>
  );
}

function ServiceCard({
  service,
  active = false,
  icon = null,
}: ServiceCardProps) {
  const { id, title, description, slogan } = service;

  return (
    <div
      className={clsx(
        'relative h-full min-h-[295px] cursor-pointer rounded-2xl transition-all duration-300 hover:shadow-lg',
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
              'text-text-primary text-2xl font-normal leading-normal',
              'flex-1 dark:text-white'
            )}
          >
            {id}. {title}
          </h3>

          {/* Icon positioned absolutely in top right */}
          <div className={clsx('shrink-0')}>
            {icon ?? <ServiceIcon active={active} />}
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

          <ul>
            {slogan?.map((item, idx) => (
              <li
                key={`${item}-${id}`}
                className={clsx(
                  'text-brand-orange text-base font-normal leading-6 tracking-wide',
                  'dark:text-slate-300',
                  'mt-1'
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
