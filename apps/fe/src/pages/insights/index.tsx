import Blog, { BlogCard } from '@/contents/index/Blog';
import clsx from 'clsx';
import Image from 'next/image';
import SubmitButton from '@/components/SubmitButton';
import StrapiHead from '@/components/meta/StrapiHead';
import { useRouter } from 'next/router';
import ContactForm from '@/contents/index/ContactForm';
import { GetStaticProps } from 'next';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';

import { getInsights } from '@/lib/strapi-server';

interface InsightsPageProps extends PagePropsWithGlobal {
  insights: InsightsItem[];
}

export default function InsightsPage({
  serverGlobal = null,
  insights,
}: InsightsPageProps) {
  const router = useRouter();
  const { category } = router.query;

  // Filter insights by category on client side
  const filteredInsights =
    category && typeof category === 'string'
      ? insights.filter(
          (insight) =>
            insight.category &&
            insight.category === decodeURIComponent(category)
        )
      : insights;

  const items = filteredInsights;

  // Check if we have a category filter but no results
  const hasCategory = category && typeof category === 'string';
  const hasNoResults = hasCategory && items.length === 0;

  // heroTop: first hero in the list
  const heroTop = items.find((item) => item.type === 'hero') as InsightsItem & {
    type: 'hero';
  };

  // heroMid: second hero in the list (around position 8)
  const heroItems = items.filter((item) => item.type === 'hero');
  const heroMid =
    heroItems.length > 1
      ? (heroItems[1] as InsightsItem & { type: 'hero' })
      : undefined;

  // posts: all non-hero items
  const posts = items.filter(
    (item) => item.type === 'post'
  ) as (InsightsItem & { type: 'post' })[];

  return (
    <div className="max-sd:mt-[60px] max-sd:pt-[60px] mt-[65px] min-h-screen bg-white pt-[65px]">
      <StrapiHead
        title="Góc nhìn"
        description="Bài viết và câu chuyện về thương hiệu từ ANDREA."
        ogImage={heroTop?.image || '/assets/images/insights/coffee/coffee1.png'}
        global={serverGlobal}
        overrideTitle
      />

      {/* Top hero (item 1) */}
      {heroTop && (
        <div className="content-wrapper">
          <div
            onClick={() => heroTop.link && router.push(heroTop.link)}
            className="group grid cursor-pointer grid-cols-1 items-center gap-8 lg:grid-cols-3"
          >
            <div className="lg:col-span-2">
              <div className="rounded-15 relative aspect-video w-full overflow-hidden">
                <Image
                  src={heroTop.image}
                  alt={heroTop.title}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div>
                {heroTop.date && (
                  <div className="text-[14px] text-black/50">
                    {heroTop.date}
                  </div>
                )}
                <h1 className="text-[24px] font-semibold leading-tight max-md:text-[20px]">
                  {heroTop.title}
                </h1>
              </div>

              {heroTop.excerpt && (
                <p className="text-[17px] leading-relaxed">{heroTop.excerpt}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main grid of posts */}
      <div className={clsx('py-[100px] max-md:py-[50px]')}>
        <section>
          <div className={clsx('content-wrapper mx-auto')}>
            {hasNoResults ? (
              <div className="py-20 text-center">
                <h2 className="mb-4 text-2xl font-semibold">
                  Không tìm thấy bài viết
                </h2>
                <p className="mb-6 text-gray-600">
                  Không có bài viết nào trong danh mục "
                  {decodeURIComponent(category as string)}"
                </p>
                <button
                  onClick={() => router.push('/insights')}
                  className="bg-brand-orange hover:bg-brand-orange-dark rounded-lg px-6 py-3 text-white transition-colors"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            ) : (
              <div
                className={clsx(
                  'grid grid-cols-1 gap-8 md:grid-cols-3',
                  'max-md:gap-4'
                )}
              >
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Middle hero (item 8) */}
      {heroMid && (
        <div className="content-wrapper">
          <div
            onClick={() => heroMid.link && router.push(heroMid.link)}
            className="group grid cursor-pointer grid-cols-1 items-center gap-8 lg:grid-cols-3"
          >
            <div className="lg:col-span-2">
              <div className="rounded-15 relative aspect-video w-full overflow-hidden">
                <Image
                  src={heroMid.image}
                  alt={heroMid.title}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div>
                {heroMid.date && (
                  <div className="text-[14px] text-black/50">
                    {heroMid.date}
                  </div>
                )}
                <h2 className="text-[24px] font-semibold leading-tight max-md:text-[20px]">
                  {heroMid.title}
                </h2>
              </div>

              {heroMid.excerpt && (
                <p className="text-[17px] leading-relaxed">{heroMid.excerpt}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <ContactForm />
      </div>
    </div>
  );
}

export type InsightsItem =
  | {
      id: number;
      type: 'hero';
      date: string;
      title: string;
      excerpt?: string;
      image: string;
      link?: string;
      category?: string;
    }
  | {
      id: number;
      type: 'post';
      date: string;
      title: string;
      image: string;
      slug?: string;
      excerpt?: string;
      category?: string;
    };

export const insightsPageItems: InsightsItem[] = [
  // Hero item 1
  {
    id: 1001,
    type: 'hero',
    date: '01/08/2025',
    title: 'Đã đến lúc phải kể câu chuyện về thương hiệu của chính mình',
    excerpt:
      'Cốt lõi của câu chuyện thương hiệu vốn đã được hình thành từ trước khi khởi nghiệp và vẫn luôn tiếp tục trải dài theo từng năm tháng phát triển của thương hiệu.',
    image: '/assets/images/insights/coffee/coffee1.png',
    link: '/insight/bao-bi',
    category: 'Thiết kế thương hiệu',
  },

  // regular posts
  {
    id: 1,
    type: 'post',
    date: '01/08/2025',
    title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
    image: '/assets/images/blog/blog-1.png',
    slug: 'thiet-ke-bao-bi-gia-tri-van-hoa',
    category: 'Thiết kế bao bì',
  },
  {
    id: 2,
    type: 'post',
    date: '28/07/2025',
    title: 'Kể câu chuyện thương hiệu: Bắt đầu từ đâu?',
    image: '/assets/images/blog/blog-1.png',
    slug: 'ke-cau-chuyen-thuong-hieu',
    category: 'Thiết kế thương hiệu',
  },
  {
    id: 3,
    type: 'post',
    date: '20/07/2025',
    title: 'Thiết kế bao bì và giá trị cảm xúc',
    image: '/assets/images/blog/blog-1.png',
    slug: 'thiet-ke-bao-bi-cam-xuc',
  },
  {
    id: 4,
    type: 'post',
    date: '12/07/2025',
    title: 'Nghệ thuật kể chuyện trên nhãn hàng',
    image: '/assets/images/blog/blog-1.png',
    slug: 'nghe-thuat-ke-chuyen-nhan-hang',
  },
  {
    id: 5,
    type: 'post',
    date: '02/07/2025',
    title: 'Phong cách thị giác cho thương hiệu Việt',
    image: '/assets/images/blog/blog-1.png',
    slug: 'phong-cach-thi-giac-thuong-hieu-viet',
  },
  {
    id: 6,
    type: 'post',
    date: '20/06/2025',
    title: 'Case study: Bao bì kể chuyện văn hoá',
    image: '/assets/images/blog/blog-1.png',
    slug: 'case-study-bao-bi-van-hoa',
  },

  // Hero item 2 (middle)
  {
    id: 1002,
    type: 'hero',
    date: '15/06/2025',
    title: 'Tập trung vào trải nghiệm khách hàng qua bao bì',
    excerpt:
      'Cốt lõi của câu chuyện thương hiệu vốn đã được hình thành từ trước khi khởi nghiệp và vẫn luôn tiếp tục trải dài theo từng năm tháng phát triển của thương hiệu.',
    image: '/assets/images/insights/coffee/coffee1.png',
    link: '/insight/bao-bi',
  },

  // additional posts (optional)
  {
    id: 7,
    type: 'post',
    date: '01/06/2025',
    title: 'Thiết kế tối giản cho bao bì hiện đại',
    image: '/assets/images/blog/blog-1.png',
    slug: 'thiet-ke-toi-gian-bao-bi',
  },
  {
    id: 8,
    type: 'post',
    date: '28/05/2025',
    title: 'Xu hướng màu sắc cho bao bì 2025',
    image: '/assets/images/blog/blog-1.png',
    slug: 'xu-huong-mau-sac-bao-bi-2025',
  },
  {
    id: 9,
    type: 'post',
    date: '15/05/2025',
    title: 'Tối ưu trải nghiệm unboxing cho thương hiệu nhỏ',
    image: '/assets/images/blog/blog-1.png',
    slug: 'toi-uu-unboxing-thuong-hieu-nho',
  },
];

export const getStaticProps: GetStaticProps<InsightsPageProps> = async () => {
  try {
    return await getStaticPropsWithGlobalAndData(async () => {
      const insightsResponse = await getInsights();
      const insights = insightsResponse?.data || [];

      // Transform Strapi data to match InsightsItem format
      const transformedInsights: InsightsItem[] = insights.map(
        (insight: any, index: number) => {
          const insightId =
            typeof insight.id === 'string'
              ? parseInt(insight.id, 10)
              : insight.id;

          // Create hero items for featured insights (first and middle)
          if (insight.featured && (index === 0 || index === 7)) {
            return {
              id: insightId + 1000, // Ensure unique ID for hero items
              type: 'hero' as const,
              date: new Date(insight.createdAt).toLocaleDateString('vi-VN'),
              title: insight.title,
              excerpt: insight.excerpt,
              image: insight.thumbnail?.url.includes('http')
                ? insight.thumbnail?.url
                : `${process.env.NEXT_PUBLIC_STRAPI_URL}${insight.thumbnail.url}`,
              link: `/insight/${insight.slug}`,
              category: insight.category,
            };
          }

          // Regular post items
          return {
            id: insightId,
            type: 'post' as const,
            date: new Date(insight.createdAt).toLocaleDateString('vi-VN'),
            title: insight.title,
            image: insight.thumbnail?.url.includes('http')
              ? insight.thumbnail?.url
              : `${process.env.NEXT_PUBLIC_STRAPI_URL}${insight.thumbnail.url}`,
            slug: insight.slug,
            excerpt: insight.excerpt,
            category: insight.category,
          };
        }
      );

      return {
        insights: transformedInsights,
      };
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    // Fallback to static data if API fails
    return await getStaticPropsWithGlobalAndData(async () => ({
      insights: insightsPageItems,
    }));
  }
};
