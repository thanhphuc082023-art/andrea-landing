import WithNavigationFooter from '@/components/layouts/WithNavigationFooter';
import type { GlobalEntity } from '@/types/strapi';
import type { PropsWithChildren } from 'react';

interface StaticLayoutProps extends PropsWithChildren {
  serverGlobal?: GlobalEntity;
}

function StaticLayout({ children, serverGlobal = null }: StaticLayoutProps) {
  return (
    <WithNavigationFooter serverGlobal={serverGlobal}>
      {children}
    </WithNavigationFooter>
  );
}

export default StaticLayout;
