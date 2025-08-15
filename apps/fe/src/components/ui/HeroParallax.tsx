'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

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
  const [start, setStart] = useState(false);

  // Refs for infinite animation
  const rowRefs = React.useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    // Add animation after component mounts
    addAnimation();
  }, []);

  const addAnimation = () => {
    rowRefs.current.forEach((ref, index) => {
      if (ref) {
        const items = ref.children;
        const itemsArray = Array.from(items);

        // Duplicate items for infinite scroll
        itemsArray.forEach((item) => {
          const duplicated = item.cloneNode(true) as HTMLElement;
          ref.appendChild(duplicated);
        });

        // Set animation direction and speed
        const direction = index % 2 === 0 ? 'forwards' : 'reverse';
        ref.style.setProperty('--animation-direction', direction);
        ref.style.setProperty('--animation-duration', '40s');
      }
    });

    setStart(true);
  };

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
    useTransform(
      scrollYProgress,
      [0, 0.2],
      [isMobile ? -560 : -940, isMobile ? 50 : 100]
    ),
    springConfig
  );

  // Dynamic translateX cho container dựa trên scroll progress - responsive
  const containerTranslateX = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.2],
      [isMobile ? -200 : -280, isMobile ? -2.5 : -5]
    ),
    springConfig
  );

  // Dynamic width dựa trên scrollYProgress và isMobile
  const containerWidth = useTransform(
    scrollYProgress,
    [0, 0.1],
    isMobile ? ['200%', '200%'] : ['170%', '170%']
  );

  return (
    <div
      ref={ref}
      className="relative flex flex-col self-auto overflow-hidden py-[65px] antialiased [perspective:1000px] [transform-style:preserve-3d] max-md:py-[60px]"
    >
      <Header />
      {/* Content parallax */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          translateX: containerTranslateX, // Use translateX instead of marginLeft
          opacity,
          width: containerWidth, // Dynamic width based on scroll and mobile state
        }}
        className="overflow-hidden"
      >
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            ref={(el) => {
              rowRefs.current[rowIndex] = el;
            }}
            className={`flex w-max min-w-full shrink-0 flex-nowrap px-4 md:px-10 ${
              start ? 'animate-scroll' : ''
            } hover:[animation-play-state:paused]`}
            style={{
              animationDirection: rowIndex % 2 === 0 ? 'normal' : 'reverse',
            }}
          >
            {row.map((product) => (
              <ProductCard product={product} key={product.title} />
            ))}
          </div>
        ))}
      </motion.div>
      {/* Content parallax */}
    </div>
  );
};

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
}: {
  product: {
    title: string;
    description?: string;
    link: string;
    thumbnail: string;
  };
}) => {
  return (
    <motion.div
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-[300px] w-[350px] max-w-full shrink-0 md:h-[400px] md:w-[450px]" // Fixed width for infinite scroll
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="400"
          width="400"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
        />
      </a>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 transition-opacity duration-300 ease-in-out group-hover/product:opacity-50"></div>
      <div className="absolute bottom-4 left-4 right-4 translate-y-4 transform text-white opacity-0 transition-all duration-300 ease-in-out group-hover/product:translate-y-0 group-hover/product:opacity-100">
        <h2 className="mb-2 text-lg font-semibold">{product.title}</h2>
        {product.description && (
          <p className="line-clamp-2 text-sm text-gray-200">
            {product.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};
