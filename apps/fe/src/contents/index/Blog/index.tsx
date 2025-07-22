import clsx from 'clsx';
import Image from 'next/image';

const blogPosts = [
  {
    id: 1,
    date: '01/08/2025',
    title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
    excerpt:
      'Thiết kế bao bì văn hóa không chỉ đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu...',
    image: '/assets/images/blog/blog-1.png',
  },
  {
    id: 2,
    date: '01/08/2025',
    title: 'Đã đến lúc phải kể câu chuyện về thương hiệu của chính mình',
    excerpt:
      'Cốt lõi của câu chuyện thương hiệu vốn dĩ đã được hình thành từ trước khi khởi nghiệp và vẫn luôn tiếp tục trải dài theo từng năm tháng phát triển của.....',
    image: '/assets/images/blog/blog-1.png',
  },
  {
    id: 3,
    date: '01/08/2025',
    title: 'Tạo tính riêng trong thiết kế bao bì qua giá trị văn hóa',
    excerpt:
      'Thiết kế bao bì văn hóa không chỉ đơn thuần là làm đẹp sản phẩm mà còn là một phương tiện truyền tải thông điệp văn hóa, giá trị thương hiệu...',
    image: '/assets/images/blog/blog-1.png',
  },
];

function BlogCard({ post }: { post: (typeof blogPosts)[0] }) {
  return (
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
              'object-cover',
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
              'mb-3 text-lg font-medium text-gray-900',
              'line-clamp-2 leading-tight'
            )}
          >
            {post.title}
          </h3>
          <p
            className={clsx(
              'text-sm leading-relaxed text-gray-600',
              'line-clamp-3'
            )}
          >
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={clsx('md:hidden flex gap-4 overflow-hidden bg-white')}>
        {/* Image */}
        <div className={clsx('relative w-[177px] h-[127px] flex-shrink-0 rounded-10 overflow-hidden')}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className={clsx(
              'object-cover',
              'transition-transform duration-300 group-hover:scale-105'
            )}
            sizes="177px"
            quality={75}
          />
        </div>

        {/* Content */}
        <div className={clsx('flex-1 flex flex-col items-start justify-between')}>
          <div>
            <p className={clsx('mb-2 text-xs text-black/50')}>{post.date}</p>
            <h3
              className={clsx(
                'text-sm font-medium text-black',
                'line-clamp-2 leading-tight mb-2'
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
  );
}

function Blog() {
  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Section Title */}
        <div className={clsx('mb-12 max-sd:mb-14 max-md:mb-11')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            Góc nhìn của Andrea
          </h2>
        </div>

        {/* Blog Grid */}
        <div className={clsx('grid grid-cols-1 gap-8 md:grid-cols-3', 'max-md:gap-4')}>
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* See More Button */}
        <div className={clsx('mt-6 text-center')}>
          <button
            type="button"
            className={clsx(
              'min-w-[143px] rounded-md px-9 py-2.5',
              'bg-brand-orange text-white',
              'transition-all duration-300 hover:bg-orange-600'
            )}
            aria-label="Xem thêm bài viết blog"
          >
            Xem thêm
          </button>
        </div>
      </div>
    </section>
  );
}

export default Blog;
