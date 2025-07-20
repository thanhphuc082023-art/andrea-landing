import clsx from 'clsx';
import {
  JetBrains_Mono as JetBrainsMono,
  Plus_Jakarta_Sans as PlusJakartaSans,
} from 'next/font/google';
import { PropsWithChildren, useEffect } from 'react';
import WithReactionsFixed from '@/components/layouts/WithReactionsFixed';

const jetbrainsMono = JetBrainsMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const plusJakartaSans = PlusJakartaSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

function Root({ children }: PropsWithChildren) {
  useEffect(() => {
    document.documentElement.classList.add(
      jetbrainsMono.variable,
      plusJakartaSans.variable
    );
  }, []);

  return (
    <div
      id="__root"
      className={clsx([jetbrainsMono.variable, plusJakartaSans.variable])}
    >
      {children}
      <WithReactionsFixed
        contentTitle="Enterprise Web Applications"
        contentType="PROJECT"
      />
    </div>
  );
}

export default Root;
