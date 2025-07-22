import { Head, Html, Main, NextScript } from 'next/document';
import PerformanceOptimizations from '@/components/PerformanceOptimizations';

function Document() {
  return (
    <Html lang="vi">
      <Head>
        <PerformanceOptimizations />
      </Head>
      <body>
        <div id="skip-navigation" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
