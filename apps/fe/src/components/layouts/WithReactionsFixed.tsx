import clsx from 'clsx';

import Reactions from '@/components/Reactions';

import type { ReactionsProps } from '@/components/Reactions';

function WithReactionsFixed(props: ReactionsProps) {
  return (
    <div
      className={clsx(
        'max-xs:bottom-0 max-xs:right-0 max-xs:w-full max-xs:p-[15px] fixed bottom-8 right-8 z-[902] max-md:bottom-[10px] max-md:right-[10px]',
        'lg:bottom-8',
        'w-[360px]',
        'sm:w-[420px] sm:px-0'
      )}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Reactions {...props} />
    </div>
  );
}

export default WithReactionsFixed;
