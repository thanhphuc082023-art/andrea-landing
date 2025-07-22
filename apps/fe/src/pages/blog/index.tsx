import { useState } from 'react';
import { GetStaticProps } from 'next';
import clsx from 'clsx';
import { useArticles } from '@/hooks/useStrapi';
import ArticleCard from '@/components/strapi/ArticleCard';
import SEOHead from '@/components/strapi/SEOHead';
import Page from '@/contents-layouts/Page';

// Import existing blog functionality
import useContentMeta from '@/hooks/useContentMeta';
import PostPreview from '@/contents/blog/PostPreview';
import type { TPostFrontMatter } from '@/types';

interface BlogPageProps {
  mdxPosts: Array<{
    slug: string;
    frontMatter: TPostFrontMatter;
  }>;
}

function BlogPage({ mdxPosts }: BlogPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'posts'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Strapi articles
  const { articles, meta, isLoading, error } = useArticles({
    page: currentPage,
    pageSize: 12,
    sort: 'publishedAt:desc',
  });

  // Get content meta for MDX posts
  const { data: contentMeta } = useContentMeta();

  // Transform MDX posts to include metadata
  const postsWithMeta = mdxPosts.map(({ slug, frontMatter }) => ({
    slug,
    frontMatter,
    shares: contentMeta?.[`blog/${slug}`]?.meta?.shares || 0,
    views: contentMeta?.[`blog/${slug}`]?.meta?.views || 0,
  }));

  const tabs = [
    {
      key: 'all',
      label: 'Tất cả',
      count: articles.length + postsWithMeta.length,
    },
    { key: 'articles', label: 'Bài viết', count: articles.length },
    { key: 'posts', label: 'Posts', count: postsWithMeta.length },
  ] as const;

  const renderTabContent = () => {
    if (activeTab === 'articles') {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      );
    }

    if (activeTab === 'posts') {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {postsWithMeta.map((post) => (
            <PostPreview
              key={post.slug}
              slug={post.slug}
              title={post.frontMatter.title}
              date={post.frontMatter.date}
              description={post.frontMatter.description}
              tags={post.frontMatter.tags}
              category={post.frontMatter.category}
              lang={post.frontMatter.lang}
              shares={post.shares}
              views={post.views}
            />
          ))}
        </div>
      );
    }

    // All content combined
    return (
      <div className="space-y-8">
        {articles.length > 0 && (
          <section>
            <h2 className="text-text-primary mb-6 text-2xl font-bold">
              Bài viết mới nhất
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {postsWithMeta.length > 0 && (
          <section>
            <h2 className="text-text-primary mb-6 text-2xl font-bold">Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postsWithMeta.slice(0, 6).map((post) => (
                <PostPreview
                  key={post.slug}
                  slug={post.slug}
                  title={post.frontMatter.title}
                  date={post.frontMatter.date}
                  description={post.frontMatter.description}
                  tags={post.frontMatter.tags}
                  category={post.frontMatter.category}
                  lang={post.frontMatter.lang}
                  shares={post.shares}
                  views={post.views}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <Page
        frontMatter={{
          title: 'Blog',
          description: 'Latest articles and insights',
        }}
      >
        <SEOHead
          fallback={{
            title: 'Blog - Andrea',
            description: 'Latest articles and insights from Andrea',
          }}
        />
        <div className="text-center text-red-600">
          Error loading content. Please try again later.
        </div>
      </Page>
    );
  }

  return (
    <Page
      frontMatter={{
        title: 'Blog',
        description: 'Latest articles and insights',
      }}
    >
      <SEOHead
        fallback={{
          title: 'Blog - Andrea',
          description: 'Latest articles and insights from Andrea',
        }}
      />

      <div className="content-wrapper">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-text-primary mb-4 text-4xl font-bold lg:text-5xl">
            Blog
          </h1>
          <p className="text-text-secondary text-lg">
            Chia sẻ kiến thức và kinh nghiệm về thiết kế, phát triển web và
            nhiều hơn nữa
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={clsx(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'text-brand-orange bg-white shadow-sm dark:bg-gray-700'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 text-xs opacity-60">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading && activeTab !== 'posts' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`page-${i + 1}`} className="animate-pulse">
                <div className="mb-4 aspect-video rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        ) : (
          renderTabContent()
        )}

        {/* Pagination for Strapi articles */}
        {activeTab === 'articles' &&
          meta?.pagination &&
          meta.pagination.pageCount > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: meta.pagination.pageCount }).map((_, i) => (
                <button
                  key={`page-${i + 1}`}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={clsx(
                    'rounded-md px-4 py-2 transition-colors',
                    currentPage === i + 1
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  try {
    const allPosts = [];

    return {
      props: {
        mdxPosts: allPosts,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        mdxPosts: [],
      },
      revalidate: 60,
    };
  }
};

export default BlogPage;
