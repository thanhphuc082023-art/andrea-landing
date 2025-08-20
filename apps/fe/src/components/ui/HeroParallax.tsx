'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { InfiniteScroll } from './InfiniteScroll';
import Link from 'next/link';

// Restore local Header and ProductCard components (remove external imports)
export const Header = () => {
  return (
    <div className="content-wrapper flex h-full w-full items-center justify-center">
      <div className="relative w-full py-20 md:py-40">
        <h1 className="text-2xl font-bold md:text-7xl dark:text-white">
          Studio Thiết Kế <br /> Sáng Tạo Hàng Đầu
        </h1>
        <p className="mt-8 max-w-2xl text-base md:text-xl dark:text-neutral-200">
          Chúng tôi chuyên tạo ra nhận diện thương hiệu độc đáo, website chuyên
          nghiệp và các sản phẩm thiết kế ấn tượng. Với đội ngũ sáng tạo giàu
          kinh nghiệm, chúng tôi đồng hành cùng thương hiệu phát triển bền vững.
        </p>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  gridMode,
}: {
  product: {
    title: string;
    description?: string;
    link: string;
    thumbnail: string;
  };
  gridMode?: boolean;
}) => {
  return (
    <motion.div
      key={product.title}
      className={
        gridMode
          ? 'group/product relative aspect-[4/3] w-full md:aspect-[16/10]'
          : 'group/product relative h-[220px] w-[260px] max-w-full shrink-0 sm:h-[300px] sm:w-[450px] md:h-[400px] md:w-[550px]'
      }
    >
      <div className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="400"
          width="400"
          className="absolute inset-0 h-full w-full object-cover object-left-top transition-opacity duration-300"
          alt={product.title}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 transition-opacity duration-300 ease-in-out group-hover/product:opacity-50"></div>
      <div className="absolute bottom-4 left-4 right-4 translate-y-4 transform text-white opacity-0 transition-all duration-300 ease-in-out group-hover/product:translate-y-0 group-hover/product:opacity-100">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-lg font-semibold">{product.title}</h2>
          <span className="relative inline-block">
            <button className="after:bg-brand-orange relative z-30 overflow-hidden rounded-md bg-black/10 px-2 py-1 text-sm font-semibold text-white after:absolute after:bottom-0 after:left-0 after:-z-20 after:h-1 after:w-1 after:translate-y-full after:rounded-md after:transition-all after:duration-700 after:hover:scale-[300] after:hover:transition-all after:hover:duration-700">
              Xem thêm
            </button>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    description?: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  // Tối ưu: Responsive items per row
  const ITEMS_PER_ROW_DESKTOP = 3;
  const ITEMS_PER_ROW_MOBILE = 3;

  // State để handle responsive screen size, avoid hydration error
  const [isMobile, setIsMobile] = useState(false);
  console.log('isMobile', isMobile);
  console.log('isMobile ? -630 : -980', isMobile ? -630 : -980);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ITEMS_PER_ROW = isMobile ? ITEMS_PER_ROW_MOBILE : ITEMS_PER_ROW_DESKTOP;
  const totalRows = Math.ceil(products.length / ITEMS_PER_ROW);

  // Tạo rows động
  const rows = Array.from({ length: totalRows }, (_, index) => {
    const start = index * ITEMS_PER_ROW;
    const end = start + ITEMS_PER_ROW;
    return products.slice(start, end);
  });

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? -630 : -980, 0]),
    springConfig
  );

  // Dynamic translateX cho container dựa trên scroll progress - responsive
  const containerTranslateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? -220 : -295, 0]),
    springConfig
  );

  // Dynamic width dựa trên scrollYProgress và isMobile
  const containerWidth = useTransform(
    scrollYProgress,
    [0, 0.1],
    isMobile ? ['200%', '200%'] : ['170%', '170%']
  );
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  useEffect(() => {
    // Capture initial scroll position to avoid immediate trigger on mount
    let initialScroll = 0;
    try {
      initialScroll = window.scrollY || 0;
    } catch (e) {
      initialScroll = 0;
    }

    let sustainTimer: number | null = null;

    const onChange = () => {
      try {
        const scrolled = window.scrollY || 0;
        const threshold = isMobile ? 200 : 300;

        // On mobile require the user to have moved from the initial position
        // to avoid immediately toggling to grid if the page initially loads scrolled.
        const userMoved = Math.abs(scrolled - initialScroll) > 10;

        const shouldBePast = scrolled > threshold && (!isMobile || userMoved);

        if (shouldBePast) {
          // require the state to be sustained briefly to avoid jitter
          if (sustainTimer) window.clearTimeout(sustainTimer);
          sustainTimer = window.setTimeout(() => setIsPastThreshold(true), 120);
        } else {
          if (sustainTimer) {
            window.clearTimeout(sustainTimer);
            sustainTimer = null;
          }
          setIsPastThreshold(false);
        }
      } catch (e) {}
    };

    const unsub = (scrollYProgress as any).on('change', onChange);

    return () => {
      if (typeof unsub === 'function') unsub();
      if (sustainTimer) window.clearTimeout(sustainTimer);
    };
  }, [scrollYProgress, isMobile]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col self-auto overflow-hidden py-[65px] antialiased [perspective:1000px] [transform-style:preserve-3d] max-md:py-[60px]"
    >
      <Header />
      {/* Content parallax */}
      <motion.div
        style={{
          rotateX: isPastThreshold && isMobile ? 0 : rotateX,
          rotateZ: isPastThreshold && isMobile ? 0 : rotateZ,
          translateY: isPastThreshold && isMobile ? 0 : translateY,
          translateX: isPastThreshold && isMobile ? 0 : containerTranslateX,
          opacity: isPastThreshold && isMobile ? 1 : opacity,
          width: isPastThreshold ? '100%' : containerWidth,
        }}
        className="overflow-hidden"
      >
        {rows.map((row, rowIndex) => (
          <InfiniteScroll
            key={`row-${rowIndex}`}
            direction={rowIndex % 2 === 0 ? 'left' : 'right'}
            pauseOnHover={true}
            duplicateCount={isPastThreshold ? 0 : 3}
            progress={scrollYProgress}
          >
            {row.map((product) => (
              <ProductCard product={product} key={product.title} />
            ))}
          </InfiniteScroll>
        ))}
      </motion.div>
      {/* Content parallax */}
    </div>
  );
};
