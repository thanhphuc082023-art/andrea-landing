import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import { SkeletonMd } from '@/components/wireframes/Skeletons';

import type { PropsWithChildren, ReactNode } from 'react';

interface BrowserTabProps {
  icon: ReactNode;
  title: string;
  isActive: boolean;
  onClick?: any;
}

function BrowserTab({
  icon,
  title,
  isActive,
  onClick = () => {},
}: BrowserTabProps) {
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && tabRef.current) {
      const container = tabRef.current.parentElement;
      if (container) {
        const tabRect = tabRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Check if tab is outside the visible area
        if (
          tabRect.left < containerRect.left ||
          tabRect.right > containerRect.right
        ) {
          tabRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }
    }
  }, [isActive]);

  return (
    <div
      ref={tabRef}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      className={clsx(
        'flex flex-shrink-0 cursor-pointer items-center truncate rounded-lg px-2 py-1',
        [
          isActive
            ? [
                'bg-slate-200 text-slate-600',
                'dark:bg-slate-100/20 dark:text-slate-300',
              ]
            : ['bg-slate-200/50 text-slate-500', 'dark:bg-slate-100/5'],
        ]
      )}
      style={{ width: 200 }}
    >
      <div className={clsx('flex w-full gap-2 text-xs')}>
        {icon}
        <div className={clsx('flex flex-1 items-center truncate')}>{title}</div>
      </div>
    </div>
  );
}

interface AppWindowProps {
  type?: 'browser' | 'app';
  browserTabs?: Array<BrowserTabProps>;
}

function AppWindow({
  children = null,
  type = 'app',
  browserTabs = [],
}: PropsWithChildren<AppWindowProps>) {
  const isWithBrowserTabs = type === 'browser' && browserTabs;

  return (
    <div
      role="presentation"
      className={clsx(
        'border-divider-light flex h-full w-full select-none flex-col overflow-hidden rounded-xl border bg-white',
        'dark:border-divider-dark dark:bg-[#0c1222]'
      )}
    >
      <div
        className={clsx(
          'border-divider-light relative box-border border-b',
          'dark:border-divider-dark',
          [isWithBrowserTabs ? 'h-20' : 'h-10']
        )}
      >
        <div
          className={clsx(
            'absolute left-4 top-0 flex h-10 items-center gap-1.5'
          )}
        >
          <div
            className={clsx(
              'h-3 w-3 rounded-full bg-red-300',
              'dark:bg-slate-500'
            )}
          />
          <div
            className={clsx(
              'h-3 w-3 rounded-full bg-amber-300',
              'dark:bg-slate-500'
            )}
          />
          <div
            className={clsx(
              'h-3 w-3 rounded-full bg-green-300',
              'dark:bg-slate-500'
            )}
          />
        </div>
        {type === 'browser' && (
          <>
            <div className={clsx('flex h-10 items-center justify-center')}>
              <SkeletonMd w={160} />
            </div>
            {isWithBrowserTabs && (
              <div
                className={clsx(
                  'mt-y flex w-full flex-nowrap gap-2 overflow-x-auto px-3'
                )}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {browserTabs.map(({ icon, title, isActive, onClick }) => (
                  <BrowserTab
                    key={title}
                    icon={icon}
                    title={title}
                    isActive={isActive}
                    onClick={onClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className={clsx('flex-1 overflow-hidden')}>{children}</div>
    </div>
  );
}

export default AppWindow;
