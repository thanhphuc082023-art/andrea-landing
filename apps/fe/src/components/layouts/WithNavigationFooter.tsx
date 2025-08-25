import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
// import QuickAccess from '@/components/QuickAccess';
// import Shortcuts from '@/components/Shortcuts';
import Toaster from '@/components/Toaster';
import type { NavigationItem, StrapiGlobal } from '@/types/strapi';
import type { FooterSettings } from '@/types/footer';

import type { PropsWithChildren } from 'react';

interface WithNavigationFooterProps extends PropsWithChildren {
  serverGlobal?: StrapiGlobal;
  menuItems?: NavigationItem[];
  footerData?: FooterSettings;
}

function WithNavigationFooter({
  children,
  serverGlobal = undefined,
  menuItems = [],
  footerData = undefined,
}: WithNavigationFooterProps) {
  return (
    <>
      {/* <QuickAccess /> */}
      <Navigation menuItems={menuItems} serverGlobal={serverGlobal} />
      <main>{children}</main>
      <Toaster />
      {footerData && <Footer footerData={footerData} />}
    </>
  );
}

export default WithNavigationFooter;
