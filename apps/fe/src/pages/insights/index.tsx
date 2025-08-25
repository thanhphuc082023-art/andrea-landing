import Blog, { BlogCard } from '@/contents/index/Blog';
import clsx from 'clsx';
import Image from 'next/image';
import SubmitButton from '@/components/SubmitButton';
import StrapiHead from '@/components/meta/StrapiHead';
import { useRouter } from 'next/router';
import ContactForm from '@/contents/index/ContactForm';

export default function InsightsPage() {
  const router = useRouter();
  const items = insightsPageItems;

  // heroTop: first hero in the list
  const heroTopIndex = items.findIndex((i) => i.type === 'hero');
  const heroTop = heroTopIndex >= 0 ? (items[heroTopIndex] as any) : undefined;

  // next 6 items after heroTop (only posts)
  const mainSixStart = Math.max(0, heroTopIndex + 1);
  const mainSix = items
    .slice(mainSixStart, mainSixStart + 6)
    .filter((v) => v.type === 'post') as any[];

  // heroMid: prefer the original item at index heroTopIndex + 7 (i.e., item thứ 8),
  // otherwise fallback to the next hero found after heroTop
  const candidateIndex = heroTopIndex + 7;
  const heroMid =
    items[candidateIndex] && items[candidateIndex].type === 'hero'
      ? (items[candidateIndex] as any)
      : (items.find((v, idx) => idx > heroTopIndex && v.type === 'hero') as
          | any
          | undefined);

  // last three posts after heroMid (or after mainSix if heroMid not present)
  const afterHeroMidStart = heroMid
    ? items.findIndex((i) => i === heroMid) + 1
    : mainSixStart + mainSix.length;
  const lastThree = items
    .slice(afterHeroMidStart)
    .filter((v) => v.type === 'post')
    .slice(0, 3) as any[];

  // posts to render in the main grid = the 6 posts after heroTop
  const posts = mainSix;

  return (
    <div className="max-sd:mt-[60px] max-sd:pt-[60px] mt-[65px] min-h-screen bg-white pt-[65px]">
      <StrapiHead
        title="Góc nhìn"
        description="Bài viết và câu chuyện về thương hiệu từ ANDREA."
        ogImage={heroTop?.image || '/assets/images/insights/coffee/coffee1.png'}
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

      {/* CTA / preview slice */}
      <div className={clsx('py-[100px] max-md:py-[50px]')}>
        <section>
          <div className={clsx('content-wrapper mx-auto')}>
            <div
              className={clsx(
                'grid grid-cols-1 gap-8 md:grid-cols-3',
                'max-md:gap-4'
              )}
            >
              {posts.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className={clsx('mt-6 text-center')}>
              <SubmitButton
                textColor="text-brand-orange"
                borderColor="border-brand-orange"
                beforeBgColor="before:bg-brand-orange"
                hoverBgColor="hover:bg-brand-orange"
                hoverTextColor="hover:text-white"
                focusRingColor="focus:ring-brand-orange"
                focusRingOffsetColor="focus:ring-offset-brand-orange-dark"
                onClick={() => router.push('/insights?page=2')}
              >
                Xem thêm
              </SubmitButton>
            </div>
          </div>
        </section>
      </div>

      <div>
        <ContactForm />
      </div>
    </div>
  );
}

export type InsightsItem =
  | {
      id: string | number;
      type: 'hero';
      date?: string;
      title: string;
      excerpt?: string;
      image: string;
      link?: string;
    }
  | {
      id: string | number;
      type: 'post';
      date?: string;
      title: string;
      image: string;
      slug?: string;
      excerpt?: string;
    };

export const insightsPageItems: InsightsItem[] = [
  // item 1 (Large Top Hero)
  {
    id: 'hero-1',
    type: 'hero',
    date: '01/08/2025',
    title: 'Đã đến lúc phải kể câu chuyện về thương hiệu của chính mình',
    excerpt:
      'Cốt lõi của câu chuyện thương hiệu vốn đã được hình thành từ trước khi khởi nghiệp và vẫn luôn tiếp tục trải dài theo từng năm tháng phát triển của thương hiệu.',
    image: '/assets/images/insights/coffee/coffee1.png',
    link: '/insight/bao-bi',
  },

  // regular posts
  {
    id: 1,
    type: 'post',
    date: '01/08/2025',
    title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
    image: '/assets/images/blog/blog-1.png',
    slug: 'thiet-ke-bao-bi-gia-tri-van-hoa',
  },
  {
    id: 2,
    type: 'post',
    date: '28/07/2025',
    title: 'Kể câu chuyện thương hiệu: Bắt đầu từ đâu?',
    image: '/assets/images/blog/blog-1.png',
    slug: 'ke-cau-chuyen-thuong-hieu',
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

  // item 8 (Large Middle Hero at index 7)
  {
    id: 'hero-2',
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
