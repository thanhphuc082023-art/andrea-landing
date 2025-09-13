import clsx from 'clsx';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';

// Fallback data khi API không khả dụng
const fallbackBlogPosts = [
  {
    id: 1,
    date: '01/08/2025',
    title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
    excerpt:
      'Thiết kế bao bì văn hóa không chỉ đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu...',
    image: '/assets/images/blog/blog-1.png',
    category: 'Thiết kế',
    slug: '/insight/thiet-ke-bao-bi-van-hoa',
  },
  {
    id: 2,
    date: '01/08/2025',
    title: 'Đã đến lúc phải kể câu chuyện về thương hiệu của chính mình',
    excerpt:
      'Cốt lõi của câu chuyện thương hiệu vốn dĩ đã được hình thành từ trước khi khởi nghiệp và vẫn luôn tiếp tục trải dài theo từng năm tháng phát triển của.....',
    image: '/assets/images/blog/blog-1.png',
    category: 'Thương hiệu',
    slug: '/insight/cau-chuyen-thuong-hieu',
  },
  {
    id: 3,
    date: '01/08/2025',
    title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
    excerpt:
      'Thiết kế bao bì văn hóa không chỉ đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu...',
    image: '/assets/images/blog/blog-1.png',
    category: 'Thiết kế',
    slug: '/insight/thiet-ke-bao-bi-van-hoa-2',
  },
];

export function BlogCard({
  post,
}: {
  post: {
    id: number;
    date: string;
    title: string;
    image: string;
    excerpt?: string;
    slug?: string;
    category?: string;
  };
}) {
  return (
    <Link href={`/insight/${post?.slug}` || ''}>
      <div className={clsx('group cursor-pointer')}>
        {/* Desktop/Tablet Layout */}
        <div className={clsx('hidden md:block')}>
          {/* Image */}
          <div
            className={clsx(
              'rounded-15 relative mb-6 h-[276px] w-full overflow-hidden'
            )}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className={clsx(
                'object-cover object-center',
                'transition-transform duration-300 group-hover:scale-105'
              )}
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={75}
            />
          </div>

          {/* Content */}
          <div className={clsx('mb-4')}>
            <p className={clsx('mb-2 text-sm text-gray-600')}>{post.date}</p>
            <h3
              className={clsx(
                'text-lg font-semibold text-gray-900',
                'line-clamp-2 leading-tight'
              )}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className={clsx(
                  'mt-3 text-sm leading-relaxed text-gray-600',
                  'line-clamp-3'
                )}
              >
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className={clsx('flex gap-4 overflow-hidden bg-white md:hidden')}>
          {/* Image */}
          <div
            className={clsx(
              'rounded-10 relative h-[127px] w-[177px] flex-shrink-0 overflow-hidden'
            )}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className={clsx(
                'object-cover object-center',
                'transition-transform duration-300 group-hover:scale-105'
              )}
              sizes="177px"
              quality={75}
            />
          </div>

          {/* Content */}
          <div
            className={clsx('flex flex-1 flex-col items-start justify-between')}
          >
            <div>
              <p className={clsx('mb-2 text-xs text-black/50')}>{post.date}</p>
              <h3
                className={clsx(
                  'text-sm font-medium text-black',
                  'mb-2 line-clamp-2 leading-tight'
                )}
              >
                {post.title}
              </h3>
            </div>
            <p
              className={clsx(
                'text-xs leading-relaxed text-gray-600',
                'line-clamp-2'
              )}
            >
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Blog({ title, category, excludeSlug }: { title?: string; category?: string; excludeSlug?: string }) {
  const [blogPosts, setBlogPosts] = useState(fallbackBlogPosts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch insights từ Strapi API
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const strapiUrl =
          process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

        // Tạo query params cho category filter
        const params = new URLSearchParams({
          populate: 'thumbnail',
          'sort[0]': 'createdAt:desc',
          publicationState: 'live',
          'pagination[page]': currentPage.toString(),
          'pagination[pageSize]': '3', // Chỉ lấy 3 bài mỗi lần
        });

        // Thêm filter category nếu có
        if (category) {
          params.append('filters[category][$eq]', category);
        }

        // Loại bỏ bài viết hiện tại nếu có excludeSlug
        if (excludeSlug) {
          params.append('filters[slug][$ne]', excludeSlug);
        }

        const response = await fetch(
          `${strapiUrl}/api/insights?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();

        // Transform Strapi data thành format phù hợp
        const transformedPosts = data.data.map((insight: any) => ({
          id: insight.id,
          date: new Date(insight.createdAt).toLocaleDateString('vi-VN'),
          title: insight.title,
          excerpt: insight.excerpt,
          image: insight.thumbnail?.url
            ? `${strapiUrl}${insight.thumbnail.url}`
            : '/assets/images/blog/blog-1.png',
          category: insight.category,
          slug: `/insight/${insight.slug}`,
        }));

        if (currentPage === 1) {
          setBlogPosts(transformedPosts);
        } else {
          setBlogPosts((prev) => [...prev, ...transformedPosts]);
        }

        // Kiểm tra còn bài viết nữa không dựa trên pagination metadata
        const pagination = data.meta?.pagination;
        if (pagination) {
          setHasMore(pagination.page < pagination.pageCount);
        } else {
          // Fallback: nếu không có metadata, kiểm tra theo length
          setHasMore(transformedPosts.length >= 3);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Không thể tải dữ liệu từ API');
        // Sử dụng fallback data khi có lỗi
        setBlogPosts(fallbackBlogPosts);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchInsights();
  }, [category, currentPage]);

  // Function để load thêm bài viết
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  };

  // Reset khi category thay đổi
  useEffect(() => {
    setCurrentPage(1);
    setBlogPosts([]);
    setHasMore(true);
  }, [category]);

  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            {title || 'Góc nhìn của Andrea'}
          </h2>
        </div>

        {/* Error State */}
        {error && (
          <div className={clsx('py-8 text-center')}>
            <p className={clsx('text-red-600')}>{error}</p>
          </div>
        )}

        {/* Blog Grid */}
        <div
          className={clsx(
            'grid grid-cols-1 gap-8 md:grid-cols-3',
            'max-md:gap-4'
          )}
        >
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className={clsx('mt-6 text-center')}>
            <SubmitButton
              onClick={loadMorePosts}
              disabled={loadingMore}
              textColor="text-brand-orange"
              borderColor="border-brand-orange"
              beforeBgColor="before:bg-brand-orange"
              hoverBgColor="hover:bg-brand-orange"
              hoverTextColor="hover:text-white"
              focusRingColor="focus:ring-brand-orange"
              focusRingOffsetColor="focus:ring-offset-brand-orange-dark"
            >
              {loadingMore ? 'Đang tải...' : 'Xem thêm'}
            </SubmitButton>
          </div>
        )}
      </div>
    </section>
  );
}

export default Blog;
