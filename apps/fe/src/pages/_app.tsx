import { GoogleAnalytics } from '@next/third-parties/google';

import RootLayout from '@/components/layouts/Root';
import WithNavigationFooter from '@/components/layouts/WithNavigationFooter';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Provider from '@/providers';
import { playfairDisplay } from '@/lib/fonts';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { GlobalEntity, NavigationItem } from '@/types/strapi';
import FontLoaderEffect from '@/components/FontLoaderEffect';

import '@/styles/main.css';
import '@/styles/header-video.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';

type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
  getLayoutNoFooter?: (page: ReactElement, pageProps?: any) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: {
    serverGlobal?: GlobalEntity;
    menuItems?: NavigationItem[];
    heroData?: any;
    brandSectionData?: any;
    footerData?: any;
    [key: string]: any;
  };
};

function getDefaultLayout(page: ReactElement, pageProps?: any): ReactNode {
  return (
    <WithNavigationFooter
      serverGlobal={pageProps?.serverGlobal}
      menuItems={pageProps?.menuItems}
      footerData={pageProps?.footerData}
    >
      {page}
    </WithNavigationFooter>
  );
}

function getLayoutNoFooter(page: ReactElement, pageProps?: any): ReactNode {
  return (
    <WithNavigationFooter
      serverGlobal={pageProps?.serverGlobal}
      menuItems={pageProps?.menuItems}
    >
      {page}
    </WithNavigationFooter>
  );
}

function App({ Component, pageProps, router }: AppPropsWithLayout) {
  let getLayout;

  if (router.query.simpleLayout) {
    getLayout = (page: ReactElement) => <main>{page}</main>;
  } else if (Component.getLayout) {
    getLayout = (page: ReactElement) => Component.getLayout!(page, pageProps);
  } else if (Component.getLayoutNoFooter) {
    getLayout = (page: ReactElement) => getLayoutNoFooter(page, pageProps);
  } else {
    getLayout = (page: ReactElement) => getDefaultLayout(page, pageProps);
  }

  return (
    <Provider>
      <RootLayout>
        <div className={playfairDisplay.variable}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <FontLoaderEffect />
          {getLayout(<Component {...pageProps} />)}
          <div id="scroll-to-top" />
          <ScrollToTopButton />
          <GoogleAnalytics gaId="G-FB9QLDNKNN" />
        </div>
      </RootLayout>
    </Provider>
  );
}

export default App;
