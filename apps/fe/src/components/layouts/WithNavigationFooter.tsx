import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
// import QuickAccess from '@/components/QuickAccess';
// import Shortcuts from '@/components/Shortcuts';
import Toaster from '@/components/Toaster';
import type { GlobalEntity } from '@/types/strapi';

import type { PropsWithChildren } from 'react';

interface WithNavigationFooterProps extends PropsWithChildren {
  serverGlobal?: GlobalEntity;
}

function WithNavigationFooter({
  children,
  serverGlobal = null,
}: WithNavigationFooterProps) {
  return (
    <>
      {/* <QuickAccess /> */}
      <Navigation serverGlobal={serverGlobal} />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </>
  );
}

export default WithNavigationFooter;
