import React from 'react';
import Head from 'next/head';
import type { StrapiSEO } from '@/types/strapi';

interface SEOHeadProps {
  seo?: StrapiSEO;
  fallback?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

function SEOHead({ seo = {}, fallback = {} }: SEOHeadProps) {
  const title = seo?.metaTitle || fallback?.title || 'Andrea';
  const description = seo?.metaDescription || fallback?.description || '';
  const image = seo?.metaImage?.url || fallback?.image || '';
  const keywords = seo?.keywords || '';
  const robots = seo?.metaRobots || 'index,follow';
  const viewport = seo?.metaViewport || 'width=device-width, initial-scale=1';
  const canonical = seo?.canonicalURL || '';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <meta name="viewport" content={viewport} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured Data */}
      {seo?.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo.structuredData),
          }}
        />
      )}
    </Head>
  );
}

export default SEOHead;
