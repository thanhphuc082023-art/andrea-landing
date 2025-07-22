import { GoogleAnalytics } from '@next/third-parties/google';

import RootLayout from '@/components/layouts/Root';
import WithNavigationFooter from '@/components/layouts/WithNavigationFooter';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Provider from '@/providers';
import { playfairDisplay } from '@/lib/fonts';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

import '@/styles/main.css';
import '@/styles/header-video.css';
import FontLoaderEffect from '@/components/FontLoaderEffect';

type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function getDefaultLayout(page: ReactElement): ReactNode {
  return <WithNavigationFooter>{page}</WithNavigationFooter>;
}

function App({ Component, pageProps, router }: AppPropsWithLayout) {
  let getLayout;

  if (router.query.simpleLayout) {
    getLayout = (page: ReactElement) => <main>{page}</main>;
  } else if (Component.getLayout) {
    getLayout = Component.getLayout;
  } else {
    getLayout = getDefaultLayout;
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
