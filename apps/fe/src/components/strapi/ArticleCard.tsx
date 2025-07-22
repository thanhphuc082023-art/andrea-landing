import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { ArticleEntity } from '@/types/strapi';

interface ArticleCardProps {
  article: ArticleEntity;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

function ArticleCard({
  article,
  className = '',
  variant = 'default',
}: ArticleCardProps) {
  const {
    title,
    excerpt,
    slug,
    publishedAt,
    featuredImage,
    author,
    categories,
  } = article.attributes;

  const imageUrl = featuredImage?.url;
  const authorName = author?.data?.name;
  const categoryNames = categories?.data?.map((cat) => cat.name) || [];

  const cardClasses = clsx(
    'group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:bg-slate-800',
    {
      'col-span-2': variant === 'featured',
    },
    className
  );

  const imageClasses = clsx(
    'h-full w-full object-cover transition-transform duration-200 group-hover:scale-105',
    {
      'aspect-video': variant !== 'compact',
      'aspect-square': variant === 'compact',
    }
  );

  return (
    <article className={cardClasses}>
      <Link href={`/blog/${slug}`} className="block">
        {imageUrl && (
          <div
            className={clsx(
              'overflow-hidden',
              variant === 'compact' ? 'aspect-square' : 'aspect-video'
            )}
          >
            <Image
              src={imageUrl}
              alt={featuredImage?.alternativeText || title}
              width={featuredImage?.width || 800}
              height={featuredImage?.height || 600}
              className={imageClasses}
              sizes={
                variant === 'featured'
                  ? '(max-width: 768px) 100vw, 66vw'
                  : '(max-width: 768px) 100vw, 33vw'
              }
            />
          </div>
        )}

        <div className={clsx('p-6', { 'p-4': variant === 'compact' })}>
          {categoryNames.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {categoryNames.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="bg-brand-orange/10 text-brand-orange rounded-full px-2 py-1 text-xs font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <h3
            className={clsx(
              'text-text-primary group-hover:text-brand-orange dark:group-hover:text-brand-orange font-semibold transition-colors dark:text-gray-100',
              {
                'mb-3 text-2xl': variant === 'featured',
                'mb-2 text-xl': variant === 'default',
                'mb-2 text-lg': variant === 'compact',
              }
            )}
          >
            {title}
          </h3>

          {excerpt && variant !== 'compact' && (
            <p className="text-text-secondary mb-4 line-clamp-3 dark:text-gray-300">
              {excerpt}
            </p>
          )}

          <div className="text-text-secondary flex items-center justify-between text-sm dark:text-gray-400">
            {authorName && <span>By {authorName}</span>}
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('vi-VN')}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ArticleCard;
