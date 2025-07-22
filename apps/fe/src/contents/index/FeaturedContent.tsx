import clsx from 'clsx';
import Link from 'next/link';
import { useFeaturedArticles, useFeaturedProjects } from '@/hooks/useStrapi';
import ArticleCard from '@/components/strapi/ArticleCard';
import ProjectCard from '@/components/strapi/ProjectCard';

function FeaturedContent() {
  const { articles, isLoading: articlesLoading } = useFeaturedArticles(3);
  const { projects, isLoading: projectsLoading } = useFeaturedProjects(3);

  const hasContent = articles.length > 0 || projects.length > 0;
  const isLoading = articlesLoading || projectsLoading;

  if (!hasContent && !isLoading) {
    return null;
  }

  return (
    <section className={clsx('py-12', 'lg:py-24')}>
      <div className={clsx('content-wrapper')}>
        {/* Featured Articles */}
        {(articles.length > 0 || articlesLoading) && (
          <div className={clsx('mb-16')}>
            <div className={clsx('mb-8 flex items-center justify-between')}>
              <h2
                className={clsx(
                  'font-playfair text-brand-orange text-3xl font-normal lg:text-4xl'
                )}
              >
                Bài viết nổi bật
              </h2>
              <Link
                href="/blog"
                className={clsx(
                  'text-text-secondary hover:text-brand-orange transition-colors',
                  'text-sm font-medium'
                )}
              >
                Xem tất cả →
              </Link>
            </div>

            {articlesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`article-skeleton-${i + 1}`}
                    className="animate-pulse"
                  >
                    <div className="mb-4 aspect-video rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured Projects */}
        {(projects.length > 0 || projectsLoading) && (
          <div>
            <div className={clsx('mb-8 flex items-center justify-between')}>
              <h2
                className={clsx(
                  'font-playfair text-brand-orange text-3xl font-normal lg:text-4xl'
                )}
              >
                Dự án nổi bật
              </h2>
              <Link
                href="/projects"
                className={clsx(
                  'text-text-secondary hover:text-brand-orange transition-colors',
                  'text-sm font-medium'
                )}
              >
                Xem tất cả →
              </Link>
            </div>

            {projectsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`project-skeleton-${i + 1}`}
                    className="animate-pulse"
                  >
                    <div className="mb-4 aspect-video rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedContent;
