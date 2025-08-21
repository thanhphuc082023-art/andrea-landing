import Blog from '@/contents/index/Blog';
import ContactForm from '@/contents/index/ContactForm';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStaticPropsWithGlobalAndData } from '@/lib/page-helpers';
import { getStrapiMediaUrl } from '@/utils/helper';
import StrapiHead from '@/components/meta/StrapiHead';

export default function InsightsPage({ article, currentGlobal }: any) {
  const sections = article?.sections || [];

  // Merge article SEO with global defaults
  const defaultSeo = currentGlobal?.defaultSeo || {};
  const articleSeo = {
    metaTitle: article?.title || defaultSeo?.metaTitle,
    metaDescription: article?.excerpt || defaultSeo?.metaDescription,
    shareImage:
      getStrapiMediaUrl(article?.hero?.desktop) || defaultSeo?.shareImage,
  };
  const seo = { ...defaultSeo, ...articleSeo };

  return (
    <div className="mt-[65px] max-md:mt-[60px]">
      <StrapiHead global={currentGlobal} seo={seo} />

      {/* Hero Section */}
      <div className="w-full">
        <div className="relative aspect-[430/342] w-full overflow-hidden md:aspect-[1440/401]">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={
                getStrapiMediaUrl(article?.hero?.mobile) ||
                '/assets/images/insights/coffee/coffee-insight-mobile.png'
              }
            />
            <source
              media="(min-width: 768px)"
              srcSet={
                getStrapiMediaUrl(article?.hero?.desktop) ||
                '/assets/images/insights/coffee/coffee-insight.png'
              }
            />
            <Image
              src={
                getStrapiMediaUrl(article?.hero?.desktop) ||
                '/assets/images/insights/coffee/coffee-insight.png'
              }
              alt={article?.title || 'Insight'}
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
          {/** Collection / Index link (e.g. Góc nhìn của Andrea) */}
          <Link
            href={article?.collectionHref || '/insights'}
            className="min-w-0 max-w-[220px] truncate font-[300] hover:text-gray-900"
          >
            {article?.collectionName || 'Góc nhìn của Andrea'}
          </Link>
          <span
            className="inline-block h-6 w-px bg-[#D9D9D9]"
            aria-hidden="true"
          />

          {/** Category (optional) */}
          <Link
            href={
              article?.category
                ? `/insights?category=${encodeURIComponent(article.category)}`
                : '#'
            }
            className="min-w-0 max-w-[140px] truncate font-[300] text-[#979797] hover:text-gray-900"
            onClick={(e) => {
              if (!article?.category) e.preventDefault();
            }}
          >
            {article?.category || 'Danh mục'}
          </Link>

          <span
            className="inline-block h-6 w-px bg-[#D9D9D9]"
            aria-hidden="true"
          />

          {/** Current article title */}
          <span className="min-w-0 max-w-[120px] truncate font-[300] text-[#979797]">
            {article?.title}
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <h1 className="mb-8 hidden text-[28px] font-bold leading-tight text-gray-900 max-md:block lg:text-[50px]">
              {article?.title}
            </h1>

            <div className="sticky top-24">
              <h3 className="mb-4 text-[28px] font-bold max-md:text-[20px]">
                Mục lục
              </h3>
              {/* TOC entries will scroll to section ids and highlight active */}
              <TOC sections={sections} />
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            <h1 className="mb-8 text-[28px] font-bold leading-tight text-gray-900 max-md:hidden lg:text-[50px]">
              {article?.title}
            </h1>

            {/* Main Image */}
            <div className="mb-8">
              <Image
                src={'/assets/images/insights/coffee/coffee1.png'}
                alt={article?.title || 'Insight'}
                width={970}
                height={550}
                className="h-auto w-full"
              />
            </div>

            {/* Content Sections (dynamic) */}
            {sections.map((sec: any, idx: number) => (
              <section
                id={sec.id || `section-${idx + 1}`}
                key={sec.id || idx}
                className="mb-8"
              >
                <h2 className="mb-6 text-[25px] font-bold text-gray-900 lg:text-[37px]">
                  {sec.title}
                </h2>
                {sec.paragraphs &&
                  sec.paragraphs.map((p: string, pi: number) => (
                    <p
                      key={pi}
                      className="mb-8 text-[17px] leading-relaxed text-gray-700"
                    >
                      {p}
                    </p>
                  ))}

                {sec.images && (
                  <div
                    className={
                      sec.images.length === 1
                        ? 'mb-6 grid grid-cols-1'
                        : 'mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'
                    }
                  >
                    {sec.images.map((img: any, i: number) => (
                      <Image
                        key={i}
                        src={img.src}
                        alt={img.alt || ''}
                        width={img.width || 600}
                        height={img.height || 300}
                        className="h-auto w-full"
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
      {article?.author?.name && (
        <div className="content-wrapper mt-8 flex items-end justify-between gap-4">
          <div className="mb-1 h-[1px] flex-1 bg-black/20" />
          <div className="shrink-0 text-right">
            <p className="text-brand-orange text-[17px]">
              {article?.author?.name || 'Theo Mộng Nghi'}
            </p>
            {article?.author?.role && (
              <p className="text-brand-orange text-[17px]">
                {article?.author?.role}
              </p>
            )}
          </div>
        </div>
      )}

      <div className={clsx('py-[50px]')}>
        <Blog title="Bài viết liên quan" />
      </div>

      <div>
        <ContactForm />
      </div>
    </div>
  );
}

export const getStaticProps = async () =>
  getStaticPropsWithGlobalAndData(async () => {
    // Example article data — replace with CMS fetch later
    const article = {
      title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
      hero: {
        desktop: '/assets/images/insights/coffee/coffee-insight.png',
        mobile: '/assets/images/insights/coffee/coffee-insight-mobile.png',
      },
      author: {
        name: 'Theo Mộng Nghi',
        role: 'Brand Designer',
      },
      sections: [
        {
          id: 'section-1',
          title: 'Truyền tải thông điệp qua bao bì',
          paragraphs: [
            'Thiết kế bao bì luôn khiến chúng ta đam mê bởi tính đa dạng và phong phú trong truyền tải thông điệp văn hóa, giá trị thương hiệu. Nó quan tâm ra sự khác biệt, thú hút sự chú ý của khách hàng và nâng cao giá trị sản phẩm. Thiết kế bao bì vận hóa thành công có thể tạo ra sự kết nối cảm xúc với người tiêu dùng, thúc đẩy sự trung thành và góp phần vào sự phát triển bền vững của doanh nghiệp.',
          ],
          images: [
            {
              src: '/assets/images/insights/coffee/coffee2.png',
              alt: 'img1',
              width: 480,
              height: 480,
            },
            {
              src: '/assets/images/insights/coffee/coffee3.png',
              alt: 'img2',
              width: 480,
              height: 480,
            },
          ],
        },
        {
          id: 'section-2',
          title: 'Khai thác giá trị văn hóa',
          paragraphs: [
            'Thiết kế bao bì vận hóa thông qua đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu. Nó quan tâm ra sự khác biệt, thú hút sự chú ý của khách hàng và nâng cao giá trị sản phẩm. Thiết kế bao bì vận hóa thành công có thể tạo ra sự kết nối cảm xúc với người tiêu dùng, thúc đẩy sự trung thành và góp phần vào sự phát triển bền vững của doanh nghiệp.',
            'Thiết kế bao bì vận hóa thông qua đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu.',
          ],
          images: [
            {
              src: '/assets/images/insights/coffee/coffee4.png',
              alt: 'img3',
              width: 970,
              height: 536,
            },
          ],
        },
        {
          id: 'section-3',
          title: 'Văn hóa đã ảnh hưởng tới thiết kế bao bì như thế nào?',
          paragraphs: [
            'Thiết kế bao bì vận hóa thông qua đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu. Nó quan tâm ra sự khác biệt, thú hút sự chú ý của khách hàng và nâng cao giá trị sản phẩm. Thiết kế bao bì vận hóa thành công có thể tạo ra sự kết nối cảm xúc với người tiêu dùng, thúc đẩy sự trung thành và góp phần vào sự phát triển bền vững của doanh nghiệp.',
          ],
        },
      ],
    };

    return { article };
  });

// Table of Contents component with scrollspy
function TOC({ sections }: { sections: any[] }) {
  const items = sections.map((sec) => ({ id: sec.id, label: sec.title }));

  const [activeId, setActiveId] = useState<string | null>(items[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0.1 }
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ul className="space-y-3 text-sm">
      {items.map((it, index) => (
        <li key={it.id}>
          <a
            href={`#${it.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(it.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
            className={`block hover:text-gray-900 ${
              activeId === it.id
                ? 'text-brand-orange font-semibold'
                : 'text-[#6B6B6B]'
            }`}
          >
            {index + 1}. {it.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
