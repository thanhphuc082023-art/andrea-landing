import Image from 'next/image';
import clsx from 'clsx';

import AgencyLogo from '@/assets/icons/AgencyLogo';
import { StrapiGlobal } from '@/types/strapi';
import { getStrapiMediaUrl } from '@/utils/helper';

interface StrapiLogoProps {
  active?: boolean;
  className?: string;
  width?: number;
  height?: number;
  fallbackToDefault?: boolean;
  serverGlobal?: StrapiGlobal | null;
}

function StrapiLogo({
  active = false,
  className = '',
  width = 120,
  height = 40,
  fallbackToDefault = true,
  serverGlobal = undefined,
}: StrapiLogoProps) {
  const currentGlobal = serverGlobal;
  const logoUrl = getStrapiMediaUrl(currentGlobal?.logo);
  const siteName = currentGlobal?.siteName || 'ANDREA';

  if (logoUrl) {
    return (
      <div className={clsx('flex items-center', className)}>
        <Image
          src={logoUrl}
          alt={`${siteName} Logo`}
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  // If no logoUrl, show AgencyLogo
  if (!logoUrl) {
    return (
      <div className={clsx('flex items-center', className)}>
        <AgencyLogo width={width} height={height} />
      </div>
    );
  }

  // Fallback to default logo or site name
  if (fallbackToDefault) {
    return (
      <div
        className={clsx(
          'flex items-center gap-1.5 font-[1000] leading-none',
          className
        )}
      >
        <div
          className={clsx(
            'border-box flex h-8 w-8 items-center justify-center rounded-xl border-2',
            'sm:h-6 sm:w-6 sm:rounded-lg',
            [
              active
                ? 'border-accent-600 bg-accent-600 dark:border-accent-500 dark:bg-accent-500'
                : 'border-accent-600 dark:border-accent-500',
            ]
          )}
        >
          <div
            className={clsx(
              'h-3.5 w-0.5 rotate-12 rounded-full',
              'sm:h-3 sm:w-0.5',
              [active ? 'bg-white' : 'bg-accent-600 dark:bg-accent-400']
            )}
          />
        </div>
        <div className={clsx('-mt-1 hidden text-xl', 'sm:block')}>
          <span className={clsx('text-slate-900', 'dark:text-slate-200')}>
            {siteName}
          </span>
        </div>
      </div>
    );
  }

  // If no fallback, show site name only
  return (
    <div className={clsx('flex items-center text-xl font-bold', className)}>
      <span className={clsx('text-slate-900', 'dark:text-slate-200')}>
        {siteName}
      </span>
    </div>
  );
}

export default StrapiLogo;
