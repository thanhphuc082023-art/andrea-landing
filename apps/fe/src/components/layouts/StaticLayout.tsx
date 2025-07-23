import WithNavigationFooter from '@/components/layouts/WithNavigationFooter';
import type { StrapiGlobal } from '@/types/strapi';
import type { PropsWithChildren } from 'react';

interface StaticLayoutProps extends PropsWithChildren {
  serverGlobal?: StrapiGlobal;
}

function StaticLayout({ children, serverGlobal = null }: StaticLayoutProps) {
  return (
    <WithNavigationFooter serverGlobal={serverGlobal}>
      {children}
    </WithNavigationFooter>
  );
}

export default StaticLayout;
