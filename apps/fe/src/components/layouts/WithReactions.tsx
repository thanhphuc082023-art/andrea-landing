import clsx from 'clsx';

import WithTableOfContentsMock from '@/components/layouts/WithTableOfContentsMock';
import Reactions from '@/components/Reactions';

import type { ReactionsProps } from '@/components/Reactions';

function WithReactions(props: ReactionsProps) {
  return (
    <div
      className={clsx(
        'pointer-events-none sticky bottom-8 z-[902]',
        'lg:bottom-8',
        'fm:static'
      )}
    >
      <div className={clsx('content-wrapper')}>
        <div className={clsx('flex items-center justify-end')}>
          <div
            className={clsx(
              'w-full max-w-[360px] px-4',
              'sm:max-w-[420px] sm:px-0'
            )}
          >
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Reactions {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithReactions;
