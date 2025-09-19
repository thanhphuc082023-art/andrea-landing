import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getStrapiMediaUrl } from '@/utils/helper';
import { StrapiAPI } from '@/lib/strapi';
import StrapiHead from '@/components/meta/StrapiHead';
import Blog from '@/contents/index/Blog';
import ContactForm from '@/contents/index/ContactForm';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { replaceMaxWidth } from '@/utils';

interface Insight {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  content: {
    html: string;
  };
  status: string;
  featured: boolean;
  thumbnail?: {
    url: string;
    name: string;
  } | null;
  hero?: {
    desktop: {
      url: string;
      name: string;
    } | null;
    mobile: {
      url: string;
      name: string;
    } | null;
  };
  category: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: {
      url: string;
    };
  };
  author: any;
}

interface InsightPageProps extends PagePropsWithGlobal {
  insight: Insight | null;
}

function InsightPage({
  serverGlobal = null,
  insight = null,
}: InsightPageProps) {
  const router = useRouter();
  const [processedContent, setProcessedContent] = useState<string>('');
  const [tocItems, setTocItems] = useState<{ id: string; label: string }[]>([]);

  // Process content to add IDs to headings
  useEffect(() => {
    if (!insight?.content?.html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(insight.content.html, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const items: { id: string; label: string }[] = [];

    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim() || '';
      if (text) {
        const id = `heading-${index + 1}-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')}`;
        heading.id = id;
        items.push({ id, label: text });
      }
    });

    setTocItems(items);
    setProcessedContent(doc.body.innerHTML);
  }, [insight?.content?.html]);

  if (router.isFallback) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-brand-orange h-32 w-32 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Insight không tìm thấy</h1>
          <p className="mb-8 text-gray-600">
            Insight bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/insights"
            className="bg-brand-orange hover:bg-brand-orange-dark inline-block rounded-lg px-6 py-3 text-white transition-colors"
          >
            Quay lại danh sách Insights
          </Link>
        </div>
      </div>
    );
  }

  // Merge insight SEO with global defaults
  const defaultSeo = serverGlobal?.defaultSeo || {};
  const insightSeo = {
    metaTitle: insight?.title || defaultSeo?.metaTitle,
    metaDescription: insight?.excerpt || defaultSeo?.metaDescription,
    shareImage: insight?.thumbnail,
  };
  const seo = { ...defaultSeo, ...insightSeo };
  return (
    <div className="max-sd:mt-[60px] mt-[65px]">
      <StrapiHead
        ogImage={insight?.thumbnail?.url}
        global={serverGlobal}
        seo={seo}
      />

      {/* Hero Section */}
      <div className="w-full">
        <div className="relative aspect-[430/342] w-full overflow-hidden md:aspect-[1440/401]">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={
                getStrapiMediaUrl(insight?.hero?.mobile) ||
                '/assets/images/insights/coffee/coffee-insight-mobile.png'
              }
            />
            <source
              media="(min-width: 768px)"
              srcSet={
                getStrapiMediaUrl(insight?.hero?.desktop) ||
                '/assets/images/insights/coffee/coffee-insight.png'
              }
            />
            <Image
              src={
                getStrapiMediaUrl(insight?.hero?.desktop) ||
                '/assets/images/insights/coffee/coffee-insight.png'
              }
              alt={insight?.title || 'Insight'}
              fill
              sizes="(min-width: 768px) 1440px, 430px"
              className="object-cover"
            />
          </picture>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="content-wrapper my-[56px] max-md:my-[29px]">
        <nav className="flex items-center space-x-2 overflow-hidden text-[17px] text-[#979797]">
          {/** Collection / Index link */}
          <Link
            href="/insights"
            className="min-w-0 max-w-[220px] truncate font-[300] hover:text-gray-900"
          >
            Góc nhìn của Andrea
          </Link>
          <span
            className="inline-block h-6 w-px bg-[#D9D9D9]"
            aria-hidden="true"
          />

          {/** Category (optional) */}
          {insight?.category && (
            <>
              <Link
                href={`/insights?category=${encodeURIComponent(insight.category)}`}
                className="min-w-0 max-w-[140px] truncate font-[300] text-[#979797] hover:text-gray-900"
              >
                {insight.category}
              </Link>
              <span
                className="inline-block h-6 w-px bg-[#D9D9D9]"
                aria-hidden="true"
              />
            </>
          )}

          {/** Current insight title */}
          <span className="min-w-0 max-w-[120px] truncate font-[300] text-[#979797]">
            {insight?.title}
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <h1 className="mb-8 hidden text-[28px] font-bold leading-tight text-gray-900 max-md:block lg:text-[50px]">
              {insight?.title}
            </h1>

            <div className="sticky top-24">
              <h3 className="mb-4 text-[28px] font-bold max-md:text-[20px]">
                Mục lục
              </h3>
              {/* TOC entries will scroll to section ids and highlight active */}
              <TOC items={tocItems} />
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            <h1 className="mb-8 text-[28px] font-bold leading-tight text-gray-900 max-md:hidden lg:text-[50px]">
              {insight?.title}
            </h1>

            {/* Content HTML */}
            {processedContent && (
              <div
                className="prose prose-lg mb-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            )}
          </div>
        </div>
      </div>

      {insight?.author?.name && (
        <div className="content-wrapper mt-8 flex items-end justify-between gap-4">
          <div className="mb-1 h-[1px] flex-1 bg-black/20" />
          <div className="shrink-0 text-right">
            <p className="text-brand-orange text-[17px]">
              {insight?.author?.name || 'Theo Mộng Nghi'}
            </p>
            {insight?.author?.role && (
              <p className="text-brand-orange text-[17px]">
                {insight?.author?.role}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Related articles */}
      <div className={clsx('py-[50px]')}>
        <Blog
          category={insight?.category}
          title="Bài viết liên quan"
          excludeSlug={insight?.slug}
        />
      </div>

      {/* Contact form */}
      <div>
        <ContactForm />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch insights from Strapi
    const response = await StrapiAPI.getCollection('insights', {
      pagination: { pageSize: 100 },
      publicationState: 'live',
    });

    const paths = response.data.map((insight: any) => ({
      params: { slug: insight.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching insight paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<InsightPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  console.log('slug', slug);

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    return await getStaticPropsWithGlobalAndData(async () => {
      const strapiUrl =
        process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Fetch insight by slug
      const populateParams = new URLSearchParams({
        'filters[slug][$eq]': slug,
        'populate[hero][populate][desktop]': 'true',
        'populate[hero][populate][mobile]': 'true',
        'populate[thumbnail]': 'true',
        'populate[author][populate][avatar]': 'true',
      });

      let response = await fetch(
        `${strapiUrl}/api/insights?${populateParams.toString()}`,
        {
          headers,
        }
      );
      console.log('response', response);

      const result = await response?.json();

      if (!result.data || result?.data.length === 0) {
        throw new Error('Insight not found');
      }

      const insightData = result?.data[0] as any;

      const insight: Insight = {
        id: insightData.id,
        title: insightData.title,
        excerpt: insightData.excerpt,
        slug: insightData.slug,
        content: {
          ...insightData?.content,
          html: replaceMaxWidth(insightData?.content?.html || ''),
        },
        status: insightData.insightStatus,
        featured: insightData.featured,
        thumbnail: insightData.thumbnail,
        hero: insightData.hero,
        category: insightData.category,
        createdAt: insightData.createdAt,
        updatedAt: insightData.updatedAt,
        seo: insightData.seo,
        author: insightData.author,
      };

      return {
        insight,
      };
    });
  } catch (error) {
    console.error('Error fetching insight:', error);
    return {
      notFound: true,
    };
  }
};

// Table of Contents component with scrollspy
function TOC({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    setActiveId(items[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0.1 }
    );

    // Wait for content to be rendered before observing
    const timeoutId = setTimeout(() => {
      items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return <div className="text-sm text-gray-500">Không có mục lục</div>;
  }

  return (
    <ul className="space-y-3 text-sm">
      {items.map((item, index) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }
            }}
            className={`block hover:text-gray-900 ${
              activeId === item.id
                ? 'text-brand-orange font-semibold'
                : 'text-[#6B6B6B]'
            }`}
          >
            {index + 1}. {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default InsightPage;
