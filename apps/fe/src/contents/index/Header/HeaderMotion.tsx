'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  m,
  AnimatePresence,
  useAnimation,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import clsx from 'clsx';
import HeaderVideo16x9 from './HeaderVideo16x9';

interface Props {
  heroData?: any;
}

export default function HeaderMotion({ heroData }: Props) {
  const titleControls = useAnimation();
  const subtitleControls = useAnimation();
  const bgControls = useAnimation();
  const inertiaControls = useAnimation();
  const studiosControls = useAnimation();
  const videoControls = useAnimation();

  // References
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [scale, setScale] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [videoFullScale, setVideoFullScale] = useState(false);
  const [containerHeight, setContainerHeight] = useState('125vh'); // Default height
  const [isMobile, setIsMobile] = useState(false); // State để theo dõi kích thước màn hình

  // Custom scroll system
  const customScrollProgress = useMotionValue(0);

  // Calculate the scale factor needed to fill the viewport
  const calculateFullscaleRatio = useCallback(() => {
    // Original video dimensions are 586x330
    if (typeof window !== 'undefined') {
      return Math.max(window.innerWidth / 586, window.innerHeight / 330);
    }
    return 2; // Default fallback value for server-side rendering
  }, []);

  // States for transform configs
  const [scaleConfig, setScaleConfig] = useState({
    // More interpolation points to create a proper easeInOut effect
    inputRange: [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.27, 0.3],
    outputRange: [
      1, // Start point
      1.005, // Almost no change - very slow start (ease-in phase)
      1.01, // 1% change - still very slow
      1.02, // 2% change - gradually speeding up
      1.04, // 4% change - acceleration begins
      1.08, // 8% change - middle acceleration
      1.16, // 16% change - peak acceleration (middle of curve)
      1.32, // 32% change - still fast but beginning to slow
      1.6, // 60% change - decelerating
      1.85, // 85% change - final gentle approach (ease-out phase)
      2, // End point
    ], // Ultra slow start with easeInOut simulation
  });

  // Sử dụng cấu hình mới với nhiều điểm trung gian hơn để tạo chuyển động mượt mà
  const [yConfig, setYConfig] = useState({
    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    outputRange: [
      window.innerWidth >= 768 ? 32.5 : 30, // Bắt đầu cách mép trên 32.5px (desktop) hoặc 30px (mobile)
      (window.innerWidth >= 768 ? 32.5 : 30) + window.innerHeight * 0.01, // Di chuyển nhẹ lên trên
      (window.innerWidth >= 768 ? 32.5 : 30) + window.innerHeight * 0.02, // Tiếp tục di chuyển lên
      -window.innerHeight * 0.1, // Khi scale full viewport, đặt gần trên cùng màn hình
      -window.innerHeight * 0.1, // Giữ ở vị trí gần trên cùng
      -window.innerHeight * 0.1, // Duy trì vị trí gần trên cùng
      // Sau đây là quá trình di chuyển container lên trên để hiển thị nội dung phía dưới, bắt đầu chậm và nhanh dần dần
      -window.innerHeight * 0.18, // Bắt đầu di chuyển chậm từ vị trí gần trên cùng
      -window.innerHeight * 0.35, // Tăng tốc dần
      -window.innerHeight * 0.6, // Tăng tốc mạnh
      -window.innerHeight * 0.95, // Đạt tốc độ cao nhất
      -window.innerHeight * 1.3, // Di chuyển hết màn hình
    ],
  });

  // Transform values based on scroll configs - these will animate as user scrolls
  // without preventing the natural page scrolling
  const videoScale = useTransform(
    customScrollProgress,
    scaleConfig.inputRange,
    scaleConfig.outputRange
  );

  const videoY = useTransform(
    customScrollProgress,
    yConfig.inputRange,
    yConfig.outputRange
  );

  // Update transform ranges with proper window values when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Kiểm tra và cập nhật state isMobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Kiểm tra lần đầu
    checkMobile();

    // Theo dõi sự kiện resize
    window.addEventListener('resize', checkMobile);

    // Update the configs with proper window-based values
    const maxScale = calculateFullscaleRatio();

    setScaleConfig({
      // More interpolation points to create a proper easeInOut effect
      inputRange: [
        0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.27, 0.3,
      ],
      outputRange: [
        1, // Start point
        1 + (maxScale - 1) * 0.005, // 0.5% change - almost imperceptible start
        1 + (maxScale - 1) * 0.01, // 1% change - still very slow
        1 + (maxScale - 1) * 0.02, // 2% change - gradually speeding up
        1 + (maxScale - 1) * 0.04, // 4% change - acceleration begins
        1 + (maxScale - 1) * 0.08, // 8% change - middle acceleration
        1 + (maxScale - 1) * 0.16, // 16% change - peak acceleration (middle of curve)
        1 + (maxScale - 1) * 0.32, // 32% change - still fast but beginning to slow
        1 + (maxScale - 1) * 0.6, // 60% change - decelerating
        1 + (maxScale - 1) * 0.85, // 85% change - final gentle approach (ease-out phase)
        maxScale, // End point with gentle landing
      ],
    });

    // Cấu hình di chuyển Y khi scroll - đơn giản hóa
    const vh = window.innerHeight;
    const width = window.innerWidth;
    setYConfig({
      inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      outputRange: [
        width >= 768 ? 32.5 : 30, // Bắt đầu cách mép trên 32.5px (desktop) hoặc 30px (mobile)
        (width >= 768 ? 32.5 : 30) + vh * 0.01, // Di chuyển nhẹ lên trên
        (width >= 768 ? 32.5 : 30) + vh * 0.02, // Tiếp tục di chuyển lên
        0, // Khi scale full viewport, đặt gần trên cùng màn hình
        0, // Giữ ở vị trí gần trên cùng
        0, // Duy trì vị trí gần trên cùng
        // Sau đây là quá trình di chuyển container lên trên để hiển thị nội dung phía dưới, bắt đầu chậm và nhanh dần dần
        -vh * 0.18, // Bắt đầu di chuyển chậm từ vị trí gần trên cùng
        -vh * 0.35, // Tăng tốc dần
        -vh * 0.6, // Tăng tốc mạnh
        -vh * 0.95, // Đạt tốc độ cao nhất
        -vh * 1.3, // Di chuyển hết màn hình
      ],
    });

    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [calculateFullscaleRatio]);

  // Set up event listeners for scrolling and track page scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!ref.current) return;

      // Calculate scroll progress based on scroll position
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const width = window.innerWidth;

      // Dynamically calculate maxScroll based on the viewport dimensions
      // This should match the calculation in the resize handler
      let heightMultiplier;
      if (width < 640) {
        // Mobile
        heightMultiplier = 1.6;
      } else if (width < 1024) {
        // Tablet
        heightMultiplier = 1.5;
      } else {
        // Desktop
        const aspectRatio = width / viewportHeight;
        heightMultiplier = aspectRatio > 1.6 ? 1.4 : 1.35;
      }

      const maxScroll = viewportHeight * heightMultiplier;

      // Convert to progress between 0-1
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      customScrollProgress.set(progress);

      // Chỉ cần cập nhật trạng thái videoFullScale để UI biết khi nào đã hoàn thành phase 1
      // Không cần thay đổi position, vì animation được xử lý bằng transform
      if (progress >= 0.3 && !videoFullScale) {
        setVideoFullScale(true);
      } else if (progress < 0.3 && videoFullScale) {
        setVideoFullScale(false);
      }
    };

    // Handle scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [customScrollProgress, videoFullScale, videoScale]);

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const width =
        window.innerWidth || document.documentElement.clientWidth || 0;
      const height = window.innerHeight;
      const maxWidth = 1280; // full-size breakpoint
      const s = Math.min(1, width / maxWidth);
      const rounded = Math.round(s * 100) / 100;
      setScale(rounded);

      // Calculate dynamic container height based on viewport dimensions and device ratio
      // Small devices need more height, large devices can use less
      const aspectRatio = width / height;
      let heightMultiplier;

      if (width < 640) {
        // Mobile
        heightMultiplier = 1.6; // More scroll space for small screens
      } else if (width < 1024) {
        // Tablet
        heightMultiplier = 1.5;
      } else {
        // Desktop
        heightMultiplier = aspectRatio > 1.6 ? 1.25 : 1.35; // Wide screens vs standard
      }

      // Set the dynamic height
      setContainerHeight(`${heightMultiplier * 100}vh`);

      // Also update the maxScroll value for consistent animation
      const maxScroll = height * heightMultiplier;

      // Update transform configurations on resize
      const vh = height;
      const maxScale = calculateFullscaleRatio();

      setScaleConfig({
        // More interpolation points to create a proper easeInOut effect
        inputRange: [
          0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24, 0.27, 0.3,
        ],
        outputRange: [
          1, // Start point
          1 + (maxScale - 1) * 0.005, // 0.5% change - almost imperceptible start
          1 + (maxScale - 1) * 0.01, // 1% change - still very slow
          1 + (maxScale - 1) * 0.02, // 2% change - gradually speeding up
          1 + (maxScale - 1) * 0.04, // 4% change - acceleration begins
          1 + (maxScale - 1) * 0.08, // 8% change - middle acceleration
          1 + (maxScale - 1) * 0.16, // 16% change - peak acceleration (middle of curve)
          1 + (maxScale - 1) * 0.32, // 32% change - still fast but beginning to slow
          1 + (maxScale - 1) * 0.6, // 60% change - decelerating
          1 + (maxScale - 1) * 0.85, // 85% change - final gentle approach (ease-out phase)
          maxScale, // End point with gentle landing
        ],
      });

      setYConfig({
        inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        outputRange: [
          width >= 768 ? 32.5 : 30, // Bắt đầu cách mép trên 32.5px (desktop) hoặc 30px (mobile)
          (width >= 768 ? 32.5 : 30) + vh * 0.01, // Di chuyển nhẹ lên trên
          (width >= 768 ? 32.5 : 30) + vh * 0.02, // Tiếp tục di chuyển lên
          0, // Khi scale full viewport, đặt gần trên cùng màn hình
          0, // Giữ ở vị trí gần trên cùng
          0, // Duy trì vị trí gần trên cùng
          // Sau đây là quá trình di chuyển container lên trên để hiển thị nội dung phía dưới, bắt đầu chậm và nhanh dần dần
          -vh * 0.18, // Bắt đầu di chuyển chậm từ vị trí gần trên cùng
          -vh * 0.35, // Tăng tốc dần
          -vh * 0.6, // Tăng tốc mạnh
          -vh * 0.95, // Đạt tốc độ cao nhất
          -vh * 1.3, // Di chuyển hết màn hình
        ],
      });
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [calculateFullscaleRatio]);

  // Initial animation sequence
  useEffect(() => {
    let mounted = true;

    const runSequence = async () => {
      // initial background to black
      await bgControls.start({
        backgroundColor: '#000000',
        transition: { duration: 0.2 },
      });

      // reveal title + subtitle
      const isMobile = window.innerWidth <= 767;

      const p1 = titleControls.start({
        opacity: 1,
        x: isMobile ? 10 : 40, // Vẫn slide từ phải vào ở cả mobile và desktop
        transition: { type: 'spring', stiffness: 70, damping: 16 },
      });

      const p2 = subtitleControls.start({
        opacity: 1,
        x: isMobile ? 10 : 40, // Vẫn slide từ phải vào ở cả mobile và desktop
        transition: { type: 'spring', stiffness: 70, damping: 16, delay: 0.2 },
      });

      await Promise.all([p1, p2]);

      const customEase = [0.2, 0.8, 0.2, 1];
      const endEase = [0.15, 0.9, 0.35, 1];

      await new Promise((res) => setTimeout(res, 500));
      if (!mounted) return;

      // fade-out title/subtitle
      const f1 = titleControls.start({
        x: isMobile ? 15 : 80, // Slide ra khỏi màn hình bên phải ở cả mobile và desktop
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 70,
          damping: 16,
          duration: 0.2,
        },
      });
      const f2 = subtitleControls.start({
        x: isMobile ? 15 : 80, // Slide ra khỏi màn hình bên phải ở cả mobile và desktop
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 70,
          damping: 16,
          delay: 0.1,
        },
      });

      const bgSlidePromise = bgControls.start({
        y: '100%',
        transition: {
          type: 'tween',
          ease: [1, 0.1, 0.3, 1],
          duration: 1.5,
          delay: 0.5,
        },
      });

      // start inertia/studios concurrently with the bg sliding (no delay)
      inertiaControls.start({
        x: isMobile ? '-50%' : '-50%', // Giữ nguyên logic slide từ left cho ANDREA
        opacity: 1,
        transition: {
          type: 'tween',
          ease: endEase,
          duration: 1.2,
          delay: 1.4,
        },
      });

      studiosControls.start({
        x: isMobile ? '50%' : '50%', // Giữ nguyên logic slide từ right cho AGENCY
        opacity: 1,
        transition: {
          type: 'tween',
          ease: endEase,
          duration: 1.2,
          delay: 1.4,
        },
      });

      videoControls.start({
        scale: 1,
        opacity: 1,
        transition: {
          type: 'tween',
          ease: customEase,
          duration: 1.2,
          delay: 1.5,
        },
      });

      await Promise.all([f1, f2]);

      if (!mounted) return;

      // after the bg slide finishes, ensure it no longer captures pointer events
      await bgSlidePromise;
      await bgControls.start({ pointerEvents: 'none' } as any);

      // Mark animation as complete to enable scroll behavior
      setAnimationComplete(true);
    };

    runSequence();

    return () => {
      mounted = false;
    };
  }, [
    titleControls,
    subtitleControls,
    bgControls,
    inertiaControls,
    studiosControls,
    videoControls,
    calculateFullscaleRatio,
    setScaleConfig,
    setYConfig,
    isMobile, // Thêm isMobile vào dependencies để animation cập nhật khi giá trị thay đổi
  ]);

  return (
    // Container with dynamic height based on device characteristics
    <div
      ref={ref}
      className="relative h-screen"
      {...(isMobile
        ? { style: { overflow: 'visible' } }
        : { style: { height: containerHeight, overflow: 'visible' } })}
    >
      <AnimatePresence>
        <m.div
          className={clsx(
            'pointer-events-none fixed inset-0 z-[9999999] h-screen w-screen overflow-hidden'
          )}
        >
          <m.div // full-bleed background that animates color and will slide away
            initial={{ backgroundColor: '#ffffff', y: 0, opacity: 1 }}
            animate={bgControls}
            className="z-1 absolute left-0 top-0 h-full w-full"
          />

          <div className="z-2 absolute left-0 top-1/2 flex w-screen -translate-y-1/2 flex-row items-center gap-[30%] whitespace-nowrap max-md:flex-col max-md:items-start">
            <m.h1
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={titleControls}
              className="text-[40px] font-semibold text-white max-md:mb-3 md:text-[20px]"
              style={{ willChange: 'transform' }}
            >
              ANDREA
            </m.h1>

            <m.span
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={subtitleControls}
              className="whitespace-pre-line break-words text-[24px] uppercase leading-[28px] text-white md:text-[16px]"
              style={{ willChange: 'transform, opacity' }}
            >
              Moving People, Brands and Visual Culture
            </m.span>
          </div>
        </m.div>

        {/* Main video container with white background wrapper */}
        <m.div
          className="fixed inset-0 block h-screen w-screen bg-white max-md:hidden"
          style={{
            zIndex: animationComplete ? 40 : 'auto',
            y: videoY, // Di chuyển container chính theo scroll
            // Thêm will-change để tối ưu hóa hiệu suất animation
            willChange: 'transform',
          }}
        >
          {/* Main video container */}
          <m.div
            className={clsx('flex h-screen items-center justify-center')}
            style={{
              zIndex: animationComplete ? 50 : 'auto',
              position: 'relative',
              // y đã được chuyển lên container ngoài
            }}
          >
            <div className="flex w-full items-center justify-center">
              <div
                style={{ width: isMobile ? '100vw' : 'min(90vw, 586px)' }}
                className="relative"
                ref={containerRef}
              >
                {/* Responsive scale wrapper */}
                <m.div
                  initial={{ scale: 1 }}
                  {...(!isMobile && { animate: { scale } })}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  style={{
                    transform: 'translate3d(0px, 0px, 0px)',
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                  }}
                  className="relative"
                >
                  {/* ANDREA text top-left trên desktop, top-center trên mobile */}
                  <m.div
                    initial={{
                      x: isMobile ? '-100%' : '-100%',
                      y: '-100%',
                      opacity: 0,
                    }}
                    animate={inertiaControls}
                    className="pointer-events-auto z-20 text-[83px] font-medium leading-[170px] text-black md:text-[175px]"
                    style={{
                      position: 'absolute',
                      left: isMobile ? '50%' : 0,
                      top: 0,
                      transform: isMobile ? 'translateX(-50%)' : 'none',
                      transformOrigin: isMobile ? 'center' : 'top left',
                    }}
                  >
                    ANDREA
                  </m.div>

                  {/* AGENCY text bottom-right trên desktop, bottom-center trên mobile */}
                  <m.div
                    initial={{
                      x: isMobile ? '100%' : '100%',
                      y: '100%',
                      opacity: 0,
                    }}
                    animate={studiosControls}
                    className="pointer-events-auto z-20 text-[83px] font-medium leading-[155px] text-black md:text-[170px]"
                    style={{
                      position: 'absolute',
                      right: isMobile ? '50%' : 0,
                      bottom: 0,
                      transform: isMobile ? 'translateX(50%)' : 'none',
                      transformOrigin: isMobile ? 'center' : 'bottom right',
                    }}
                  >
                    AGENCY
                  </m.div>

                  {/* Video container with 16:9 aspect ratio */}
                  <div
                    style={{
                      paddingTop: isMobile ? '56.25%' : `${(330 / 586) * 100}%`,
                    }}
                    className="relative z-[21] w-full"
                  >
                    {/* Video element */}
                    <div className="absolute inset-0">
                      <m.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={videoControls}
                        {...(animationComplete &&
                          !isMobile && {
                            style: {
                              scale: animationComplete ? videoScale : undefined,
                            },
                          })}
                        className="pointer-events-auto absolute inset-0 z-10"
                      >
                        <div className="h-full w-full">
                          <HeaderVideo16x9 src={heroData?.desktopVideo?.url} />
                        </div>
                      </m.div>
                    </div>
                  </div>
                </m.div>
              </div>
            </div>
          </m.div>
        </m.div>

        <m.div className="content-wrapper inset-0 hidden h-screen w-screen bg-white max-md:block">
          {/* Main video container */}
          <m.div
            className={clsx('flex h-screen items-center justify-center')}
            style={{
              zIndex: animationComplete ? 50 : 'auto',
              position: 'relative',
              // y đã được chuyển lên container ngoài
            }}
          >
            <div className="flex w-full items-center justify-center">
              <div
                style={{ width: isMobile ? '100vw' : 'min(90vw, 586px)' }}
                className="relative"
                ref={containerRef}
              >
                {/* Responsive scale wrapper */}
                <m.div
                  initial={{ scale: 1 }}
                  {...(!isMobile && { animate: { scale } })}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  style={{
                    transform: 'translate3d(0px, 0px, 0px)',
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                  }}
                  className="relative"
                >
                  {/* ANDREA text top-left trên desktop, top-center trên mobile */}
                  <m.div
                    initial={{
                      x: isMobile ? '-100%' : '-100%',
                      y: '-100%',
                      opacity: 0,
                    }}
                    animate={inertiaControls}
                    className="pointer-events-auto z-20 text-[83px] font-medium leading-[95px] text-black md:text-[175px]"
                    style={{
                      position: 'absolute',
                      left: isMobile ? '50%' : 0,
                      top: 0,
                      transform: isMobile ? 'translateX(-50%)' : 'none',
                      transformOrigin: isMobile ? 'center' : 'top left',
                    }}
                  >
                    ANDREA
                  </m.div>

                  {/* AGENCY text bottom-right trên desktop, bottom-center trên mobile */}
                  <m.div
                    initial={{
                      x: isMobile ? '100%' : '100%',
                      y: '100%',
                      opacity: 0,
                    }}
                    animate={studiosControls}
                    className="pointer-events-auto z-20 text-[83px] font-medium leading-[90px] text-black md:text-[170px]"
                    style={{
                      position: 'absolute',
                      right: isMobile ? '50%' : 0,
                      bottom: 0,
                      transform: isMobile ? 'translateX(50%)' : 'none',
                      transformOrigin: isMobile ? 'center' : 'bottom right',
                    }}
                  >
                    AGENCY
                  </m.div>

                  {/* Video container with 16:9 aspect ratio */}
                  <div
                    style={{
                      paddingTop: isMobile ? '56.25%' : `${(477 / 848) * 100}%`,
                    }}
                    className="relative z-[21] w-full"
                  >
                    {/* Video element */}
                    <div className="absolute inset-0">
                      <m.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={videoControls}
                        {...(animationComplete &&
                          !isMobile && {
                            style: {
                              scale: animationComplete ? videoScale : undefined,
                            },
                          })}
                        className="pointer-events-auto absolute inset-0 z-10"
                      >
                        <div className="h-full w-full">
                          <HeaderVideo16x9 src={heroData?.desktopVideo?.url} />
                        </div>
                      </m.div>
                    </div>
                  </div>
                </m.div>
              </div>
            </div>
          </m.div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
