import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import { StrapiAPI } from '@/lib/strapi';
import { useArticle } from '@/hooks/useStrapi';
import SEOHead from '@/components/strapi/SEOHead';
import Page from '@/contents-layouts/Page';
import type { ArticleEntity } from '@/types/strapi';

interface ArticlePageProps {
  article: ArticleEntity | null;
}

function ArticlePage({ article: initialArticle }: ArticlePageProps) {
  const router = useRouter();
  const { slug } = router.query;

  // Use SWR for client-side updates while having SSG for initial load
  const { article: clientArticle } = useArticle(slug as string);
  const article = clientArticle || initialArticle;

  if (router.isFallback) {
    return (
      <Page
        frontMatter={{
          title: 'Đang tải...',
          description: '',
          caption: undefined,
        }}
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="border-brand-orange h-32 w-32 animate-spin rounded-full border-b-2" />
        </div>
      </Page>
    );
  }

  if (!article) {
    return (
      <Page
        frontMatter={{
          title: 'Bài viết không tìm thấy',
          description: '',
          caption: undefined,
        }}
      >
        <div className="mx-auto max-w-4xl px-4 py-12 text-center lg:px-16">
          <h1 className="text-text-primary mb-4 text-4xl font-bold">
            Bài viết không tìm thấy
          </h1>
          <p className="text-text-secondary mb-8">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/blog"
            className="bg-brand-orange hover:bg-brand-orange/90 inline-block rounded-lg px-6 py-3 text-white transition-colors"
          >
            Quay lại Blog
          </Link>
        </div>
      </Page>
    );
  }

  const {
    title,
    content,
    excerpt,
    publishedAt,
    featuredImage,
    author,
    categories,
    tags,
    seo,
    readingTime,
  } = article.attributes;

  const imageUrl = featuredImage?.url;
  const authorName = author?.data?.name;
  const authorAvatar = author?.data?.avatar?.url;
  const categoryNames = categories?.data?.map((cat) => cat.name) || [];
  const tagNames = tags?.data?.map((tag) => tag.name) || [];

  return (
    <Page frontMatter={{ title, description: excerpt || '', caption: title }}>
      <SEOHead
        seo={seo}
        fallback={{
          title: `${title} - Andrea`,
          description: excerpt || '',
          image: imageUrl,
        }}
      />

      <article className="content-wrapper mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="text-text-secondary flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="hover:text-brand-orange transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <li>•</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-brand-orange transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>•</li>
            <li className="text-text-primary truncate">{title}</li>
          </ol>
        </nav>

        {/* Featured Image */}
        {imageUrl && (
          <div className="mb-8 aspect-video overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={featuredImage?.alternativeText || title}
              width={featuredImage?.width || 1200}
              height={featuredImage?.height || 630}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Categories */}
          {categoryNames.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categoryNames.map((category) => (
                <span
                  key={category}
                  className="bg-brand-orange/10 text-brand-orange rounded-full px-3 py-1 text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-text-primary mb-4 text-4xl font-bold lg:text-5xl">
            {title}
          </h1>

          {excerpt && (
            <p className="text-text-secondary mb-6 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Article Meta */}
          <div className="flex items-center gap-6 border-b border-t border-gray-200 py-4 dark:border-gray-700">
            {/* Author */}
            <div className="flex items-center gap-3">
              {authorAvatar && (
                <Image
                  src={authorAvatar}
                  alt={authorName || 'Author'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-text-primary text-sm font-medium">
                  {authorName || 'Andrea'}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="text-text-secondary text-sm">
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Reading Time */}
            {readingTime && (
              <div className="text-text-secondary text-sm">
                {readingTime} phút đọc
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div
          className={clsx(
            'prose prose-lg max-w-none',
            'prose-headings:text-text-primary prose-p:text-text-primary',
            'prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline',
            'prose-strong:text-text-primary prose-code:text-brand-orange',
            'prose-blockquote:border-brand-orange prose-blockquote:text-text-secondary',
            'dark:prose-invert dark:prose-headings:text-gray-100',
            'dark:prose-p:text-gray-300 dark:prose-strong:text-gray-100'
          )}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {tagNames.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h3 className="text-text-primary mb-4 text-lg font-semibold">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagNames.map((tag) => (
                <span
                  key={tag}
                  className="text-text-secondary rounded-md bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <Link
            href="/blog"
            className="text-brand-orange inline-flex items-center gap-2 hover:underline"
          >
            ← Quay lại Blog
          </Link>
        </div>
      </article>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await StrapiAPI.getCollection<ArticleEntity>('articles', {
      pagination: { pageSize: 100 },
      publicationState: 'live',
    });

    const paths = response.data.map((article) => ({
      params: { slug: article.attributes.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching article paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const article = await StrapiAPI.getEntryBySlug<ArticleEntity>(
      'articles',
      slug,
      {
        populate: [
          'featuredImage',
          'author.avatar',
          'categories',
          'tags',
          'seo.metaImage',
        ],
        publicationState: 'live',
      }
    );

    if (!article) {
      return {
        notFound: true,
      };
    }

    // Transform image URLs to full URLs
    const transformedArticle = {
      ...article,
      attributes: {
        ...article.attributes,
        featuredImage: article.attributes.featuredImage
          ? {
              ...article.attributes.featuredImage,
              url: StrapiAPI.getMediaUrl(article.attributes.featuredImage.url),
            }
          : null,
        author: article.attributes.author
          ? {
              ...article.attributes.author,
            }
          : null,
        seo: article.attributes.seo
          ? {
              ...article.attributes.seo,
              metaImage: article.attributes.seo.metaImage
                ? {
                    ...article.attributes.seo.metaImage,
                    url: StrapiAPI.getMediaUrl(
                      article.attributes.seo.metaImage.url
                    ),
                  }
                : null,
            }
          : undefined,
      },
    };

    return {
      props: {
        article: transformedArticle,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true,
    };
  }
};

export default ArticlePage;
