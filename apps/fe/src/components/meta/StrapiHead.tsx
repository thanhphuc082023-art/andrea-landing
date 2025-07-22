import NextHead from 'next/head';
import { useGlobal } from '@/providers/GlobalProvider';
import useCurrentUrl from '@/hooks/useCurrentUrl';
import type { StrapiSEO } from '@/types/strapi';

interface StrapiHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  overrideTitle?: boolean;
  structuredData?: string;
  seo?: StrapiSEO;
}

function StrapiHead({
  title = '',
  description = '',
  ogImage = '',
  overrideTitle = false,
  structuredData = '',
  seo = {},
}: StrapiHeadProps) {
  const currentUrl = useCurrentUrl();
  const { global, isLoading } = useGlobal();

  // Use Strapi global data as fallback
  const siteName = global?.attributes?.siteName || 'ANDREA';
  const siteDescription =
    global?.attributes?.siteDescription ||
    'Creative agency specializing in brand design';
  const defaultSeo = global?.attributes?.defaultSeo;
  const logoUrl = global?.attributes?.logo?.url;
  const faviconUrl = global?.attributes?.favicon?.url;

  // Combine props with Strapi SEO data
  const finalTitle = seo?.metaTitle || title || siteName;
  const finalDescription =
    seo?.metaDescription ||
    description ||
    defaultSeo?.metaDescription ||
    siteDescription;
  const finalOgImage =
    seo?.metaImage?.url || ogImage || defaultSeo?.metaImage?.url;
  const keywords = seo?.keywords || defaultSeo?.keywords;
  const robots = seo?.metaRobots || defaultSeo?.metaRobots || 'index,follow';
  const viewport =
    seo?.metaViewport ||
    defaultSeo?.metaViewport ||
    'width=device-width, initial-scale=1';
  const canonical = seo?.canonicalURL || currentUrl;

  const htmlTitle = overrideTitle ? finalTitle : `${finalTitle} — ${siteName}`;

  // Structured data from Strapi or fallback
  const finalStructuredData =
    seo?.structuredData || defaultSeo?.structuredData || structuredData;

  return (
    <NextHead>
      <title>{htmlTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="viewport" content={viewport} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />

      {/* Favicon */}
      {faviconUrl ? (
        <link rel="icon" href={faviconUrl} />
      ) : (
        <link rel="icon" href="/favicon.ico" />
      )}

      {/* SEO */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />

      {finalOgImage && (
        <>
          <meta property="og:image" content={finalOgImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta
            property="og:image:alt"
            content={`${finalTitle} - ${siteName}`}
          />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {finalOgImage && (
        <>
          <meta name="twitter:image" content={finalOgImage} />
          <meta
            name="twitter:image:alt"
            content={`${finalTitle} - ${siteName}`}
          />
        </>
      )}

      {/* Additional meta tags from global settings */}
      {global?.attributes?.socialLinks?.twitter && (
        <>
          <meta
            name="twitter:site"
            content={`@${global.attributes.socialLinks.twitter.replace('@', '')}`}
          />
          <meta
            name="twitter:creator"
            content={`@${global.attributes.socialLinks.twitter.replace('@', '')}`}
          />
        </>
      )}

      {/* Structured Data */}
      {finalStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              typeof finalStructuredData === 'string'
                ? finalStructuredData
                : JSON.stringify(finalStructuredData),
          }}
        />
      )}
    </NextHead>
  );
}

export default StrapiHead;
