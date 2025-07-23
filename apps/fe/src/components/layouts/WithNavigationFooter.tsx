import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
// import QuickAccess from '@/components/QuickAccess';
// import Shortcuts from '@/components/Shortcuts';
import Toaster from '@/components/Toaster';
import type { NavigationItem, StrapiGlobal } from '@/types/strapi';

import type { PropsWithChildren } from 'react';

interface WithNavigationFooterProps extends PropsWithChildren {
  serverGlobal?: StrapiGlobal;
  menuItems?: NavigationItem[];
}

function WithNavigationFooter({
  children,
  serverGlobal = null,
  menuItems = [],
}: WithNavigationFooterProps) {
  return (
    <>
      {/* <QuickAccess /> */}
      <Navigation menuItems={menuItems} serverGlobal={serverGlobal} />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </>
  );
}

export default WithNavigationFooter;
