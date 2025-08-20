'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ScrollHideWrapper } from './ScrollHideWrapper';
import { InfiniteScroll } from './InfiniteScroll';

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
  // Grid system configuration - 3 items per row
  const ITEMS_PER_ROW_DESKTOP = 3;
  const ITEMS_PER_ROW_MOBILE = 2; // Responsive: 2 items on mobile for better display

  // State để handle responsive screen size, avoid hydration error
  const [isMobile, setIsMobile] = useState(false);

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

  // Tạo rows động với grid system 3 items/hàng
  const rows = Array.from({ length: totalRows }, (_, index) => {
    const start = index * ITEMS_PER_ROW;
    const end = start + ITEMS_PER_ROW;
    return products.slice(start, end);
  });

  // Reveal logic: switch from InfiniteScroll -> static grid after hide threshold + in-view
  const SCROLL_THRESHOLD = isMobile ? 100 : 300;
  const [isHidden, setIsHidden] = useState(false);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const revealTimeoutsRef = useRef<number[]>([]);
  const [rowsMountGrid, setRowsMountGrid] = useState<boolean[]>(
    Array(rows.length).fill(false)
  );
  const [rowsRevealed, setRowsRevealed] = useState<boolean[]>(
    Array(rows.length).fill(false)
  );
  // control visibility of the InfiniteScroll overlay separately so we can delay its opacity when reverting
  const [rowsOverlayVisible, setRowsOverlayVisible] = useState<boolean[]>(
    Array(rows.length).fill(true)
  );
  // key used to force remounting the InfiniteScroll overlay for a smooth restart
  const [rowsOverlayKey, setRowsOverlayKey] = useState<number[]>(
    Array(rows.length).fill(0)
  );

  useEffect(() => {
    // keep rowsRevealed length in sync
    setRowsRevealed(Array(rows.length).fill(false));
    // keep overlay keys array in sync
    setRowsOverlayKey((prev) => {
      const next = Array(rows.length).fill(0);
      // preserve existing counters where possible
      for (let i = 0; i < Math.min(prev.length, next.length); i++) {
        next[i] = prev[i] || 0;
      }
      return next;
    });
    // keep rowsOverlayVisible length in sync (default visible)
    setRowsOverlayVisible((prev) => {
      const next = Array(rows.length).fill(true);
      for (let i = 0; i < Math.min(prev.length, next.length); i++) {
        next[i] = prev[i] ?? true;
      }
      return next;
    });
  }, [rows.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Wait for InfiniteScroll to finish hide transition before revealing static grid
  useEffect(() => {
    const hideTransitionDuration = 500; // matches hide transition duration (ms)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = rowRefs.current.findIndex((el) => el === entry.target);
          if (idx === -1) return;

          // trigger only when infinite scroller is hidden
          if (entry.isIntersecting && isHidden && !rowsRevealed[idx]) {
            // if already scheduled, skip
            if (revealTimeoutsRef.current[idx]) return;

            // Mount grid immediately (keeps it in DOM offscreen) to avoid reflow flicker
            setRowsMountGrid((prev) => {
              const copy = [...prev];
              copy[idx] = true;
              return copy;
            });

            // hide InfiniteScroll overlay immediately (we'll reveal the grid)
            setRowsOverlayVisible((prev) => {
              const copy = [...prev];
              copy[idx] = false;
              return copy;
            });

            // schedule reveal after hide transition finishes
            const t = window.setTimeout(() => {
              setRowsRevealed((prev) => {
                const copy = [...prev];
                copy[idx] = true;
                return copy;
              });
              // clear scheduled marker
              revealTimeoutsRef.current[idx] = 0;
            }, hideTransitionDuration);

            revealTimeoutsRef.current[idx] = t as unknown as number;
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      // clear pending timeouts
      if (revealTimeoutsRef.current.length) {
        revealTimeoutsRef.current.forEach((id) => {
          if (id) window.clearTimeout(id);
        });
        revealTimeoutsRef.current = [];
      }
    };
  }, [isHidden, rowsRevealed, rows.length]);

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
      [isMobile ? -625 : -980, isMobile ? 260 : 0]
    ),
    springConfig
  );

  // Dynamic translateX cho container dựa trên scroll progress - responsive
  const containerTranslateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [isMobile ? -245 : -295, 0]),
    springConfig
  );

  // Dynamic width dựa trên scrollYProgress và isMobile
  const containerWidth = useTransform(
    scrollYProgress,
    [0, 0.1],
    isMobile ? ['200%', '200%'] : ['170%', '170%']
  );

  // Khi scroll trở lên (window.scrollY < SCROLL_THRESHOLD) -> revert animations về vị trí ban đầu
  useEffect(() => {
    if (!isHidden) {
      // Clear any pending reveal timeouts
      if (revealTimeoutsRef.current.length) {
        revealTimeoutsRef.current.forEach((id) => {
          if (id) window.clearTimeout(id);
        });
        revealTimeoutsRef.current = [];
      }

      // Immediately hide revealed rows (trigger slide-out/opacity -> initial state)
      setRowsRevealed(() => Array(rows.length).fill(false));

      // After the slide-out transition finishes, unmount each grid row (with a tiny stagger)
      // and bump the overlay key to force remount of InfiniteScroll so its animation restarts smoothly.
      const unmountDelay = 400; // should match the reveal transition duration
      const timers: number[] = [];
      for (let i = 0; i < rows.length; i++) {
        const t = window.setTimeout(
          () => {
            setRowsMountGrid((prev) => {
              const copy = [...prev];
              copy[i] = false;
              return copy;
            });

            setRowsOverlayKey((prev) => {
              const copy = [...prev];
              copy[i] = (copy[i] || 0) + 1;
              return copy;
            });
            // after unmount, delay showing the InfiniteScroll overlay by 200ms
            const tShow = window.setTimeout(() => {
              setRowsOverlayVisible((prev) => {
                const copy = [...prev];
                copy[i] = true;
                return copy;
              });
            }, 100);

            timers.push(tShow as unknown as number);
          },
          unmountDelay + i * 50
        ); // small stagger avoids layout thrash when multiple rows unmount at once

        timers.push(t as unknown as number);
      }

      return () => timers.forEach((id) => window.clearTimeout(id));
    }
  }, [isHidden, rows.length]);

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
          // If any row's grid is mounted/revealed, force full width so grid doesn't overflow
          width: isHidden ? '100%' : containerWidth,
        }}
        className="space-y-6 overflow-visible max-md:space-y-4"
      >
        {/* Grid System: 3 items per row with alternating slide directions */}
        {rows.map((row, rowIndex) => {
          // Even rows slide from left (forwards), odd rows from right (reverse)
          const slideDirection = rowIndex % 2 === 0 ? 'left' : 'right';

          // outer ref to observe row visibility
          return (
            <div
              key={`row-${rowIndex}`}
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className="relative overflow-visible px-4 md:px-10"
            >
              {/* Invisible placeholder reserves height. Match InfiniteScroll height until grid mounts, then switch to grid height */}

              {!rowsMountGrid[rowIndex] && (
                <div
                  aria-hidden
                  style={{ visibility: 'hidden' }}
                  className={`w-full`}
                >
                  {!rowsMountGrid[rowIndex] ? (
                    // placeholder matching InfiniteScroll item height (non-grid)
                    <div className="flex">
                      {row[0] && (
                        <ProductCard
                          product={row[0]}
                          key={`placeholder-item-${rowIndex}`}
                        />
                      )}
                    </div>
                  ) : (
                    // placeholder matching final grid height
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-${ITEMS_PER_ROW} gap-6 max-md:gap-4`}
                    >
                      {row.map((product, productIndex) => (
                        <ProductCard
                          product={product}
                          gridMode
                          key={`placeholder-${product.title}-${rowIndex}-${productIndex}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* InfiniteScroll overlay (absolute) so it doesn't affect layout height */}
              {/* showInfinite: only show InfiniteScroll when overlayVisible AND grid is not revealed */}
              {(() => {
                const showInfinite =
                  rowsOverlayVisible[rowIndex] && !rowsRevealed[rowIndex];
                return (
                  <div
                    className={`absolute inset-0 flex items-stretch transition-opacity duration-500 ease-in-out ${
                      showInfinite
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0'
                    }`}
                  >
                    <InfiniteScroll
                      key={`infinite-${rowIndex}-${rowsOverlayKey[rowIndex]}`}
                      direction={slideDirection}
                      pauseOnHover={true}
                      className="w-full"
                      duplicateCount={2}
                      hideOnScroll={true}
                      scrollThreshold={SCROLL_THRESHOLD}
                      hideMode="all"
                    >
                      {row.map((product, productIndex) => (
                        <ProductCard
                          product={product}
                          key={`${product.title}-${rowIndex}-${productIndex}`}
                        />
                      ))}
                    </InfiniteScroll>
                  </div>
                );
              })()}

              {/* Animated overlay for the static grid that slides in on reveal */}
              {rowsMountGrid[rowIndex] && (
                <div
                  aria-hidden={!rowsRevealed[rowIndex]}
                  style={{
                    position: 'relative',
                    inset: 0,
                    transform: rowsRevealed[rowIndex]
                      ? 'translateX(0)'
                      : slideDirection === 'left'
                        ? 'translateX(-100%)'
                        : 'translateX(100%)',
                    opacity: rowsRevealed[rowIndex] ? 1 : 0,
                    transition:
                      'transform 700ms cubic-bezier(.22,.9,.33,1), opacity 700ms',
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                >
                  <div className={`w-full`}>
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-${ITEMS_PER_ROW} gap-6 max-md:gap-4`}
                    >
                      {row.map((product, productIndex) => (
                        <ProductCard
                          product={product}
                          gridMode
                          key={`${product.title}-${rowIndex}-${productIndex}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300"
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
