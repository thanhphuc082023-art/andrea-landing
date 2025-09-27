import { useMemo, useState, useEffect, type ReactNode, useRef } from 'react';
import {
  DraggableCardBody,
  DraggableCardContainer,
} from '@/components/ui/DraggableCardBody';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'motion/react';
import { useImageDimensions } from '@/hooks/useImageDimensions';

interface WorkflowProps {
  slogan?: string;
  workflowData?: any[];
  rotationMode?: 'random' | 'radial';
  disableDrag?: boolean;
}

interface WorkflowItem {
  id: number;
  position: number;
  image: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties; // allow passing inline styles for small per-item nudges
  content?: ReactNode;
}

// Component to handle auto-sized images
const AutoSizedImage = ({
  src,
  alt,
  maxWidth,
  maxHeight,
}: {
  src: string;
  alt: string;
  maxWidth?: number;
  maxHeight?: number;
}) => {
  const { aspectRatio, isLoading, error } = useImageDimensions(src);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    updateSize();

    // Add event listener
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate responsive max dimensions based on screen size
  const getResponsiveMaxDimensions = () => {
    if (maxWidth && maxHeight) {
      return { maxWidth, maxHeight };
    }

    const isMobile = windowSize.width <= 768;

    if (isMobile) {
      // Mobile: larger size for better visibility
      return {
        maxWidth: 320,
        maxHeight: 220,
        scaleFactor: 0.7,
      };
    }

    // Desktop: use breakpoint-based scaling
    if (windowSize.width >= 1920) {
      // Large screens: full size
      return {
        maxWidth: 480,
        maxHeight: 360,
        scaleFactor: 1,
      };
    } else if (windowSize.width >= 1440) {
      // Medium-large screens: 90%
      return {
        maxWidth: 432,
        maxHeight: 324,
        scaleFactor: 0.9,
      };
    } else if (windowSize.width >= 1200) {
      // Medium screens: 80%
      return {
        maxWidth: 384,
        maxHeight: 288,
        scaleFactor: 0.8,
      };
    } else if (windowSize.width >= 1024) {
      // Small desktop: 70%
      return {
        maxWidth: 336,
        maxHeight: 252,
        scaleFactor: 0.7,
      };
    } else {
      // Very small desktop: 60%
      return {
        maxWidth: 288,
        maxHeight: 216,
        scaleFactor: 0.6,
      };
    }
  };

  const {
    maxWidth: responsiveMaxWidth,
    maxHeight: responsiveMaxHeight,
    scaleFactor,
  } = getResponsiveMaxDimensions();

  if (isLoading && windowSize.width > 768) {
    return (
      <div
        className="flex animate-pulse items-center justify-center bg-gray-200"
        style={{ width: responsiveMaxWidth, height: responsiveMaxHeight }}
      ></div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-gray-200"
        style={{ width: responsiveMaxWidth, height: responsiveMaxHeight }}
      >
        <span className="text-sm text-gray-400">Error loading image</span>
      </div>
    );
  }

  // Detect if image is portrait (height > width)
  const isPortrait = aspectRatio < 1;

  // Calculate dimensions while maintaining aspect ratio and staying within max bounds
  let width = responsiveMaxWidth;
  let height = responsiveMaxWidth / aspectRatio;

  if (height > responsiveMaxHeight) {
    height = responsiveMaxHeight;
    width = responsiveMaxHeight * aspectRatio;
  }

  // Apply mobile scale factor to maintain intrinsic proportions
  let finalWidth = width * (scaleFactor || 1);
  let finalHeight = height * (scaleFactor || 1);

  // Make portrait images larger
  if (isPortrait) {
    const portraitMultiplier = 1.3; // 30% larger for portrait images
    finalWidth *= portraitMultiplier;
    finalHeight *= portraitMultiplier;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="pointer-events-none relative z-10 object-cover max-md:mx-auto"
      style={{
        width: finalWidth,
        height: finalHeight,
        maxWidth: 'none', // Ensure no CSS max-width constraints
        maxHeight: 'none', // Ensure no CSS max-height constraints
      }}
    />
  );
};

// Default workflow data for fallback (expanded / cloned to 16 items)
const defaultWorkflows: WorkflowItem[] = [
  {
    id: 1,
    position: 1,
    image: '/assets/images/workflow/workflow-image-5.jpg',
    alt: 'Workflow step 1',
  },
  {
    id: 2,
    position: 2,
    image: '/assets/images/workflow/workflow-image-4.jpg',
    alt: 'Workflow step 2',
  },
  {
    id: 3,
    position: 3,
    image: '/assets/images/workflow/workflow-image-6.jpg',
    alt: 'Workflow step 3',
  },
  {
    id: 4,
    position: 4,
    image: '/assets/images/workflow/workflow-image-7.jpg',
    alt: 'Workflow step 4',
  },
  {
    id: 5,
    position: 5,
    image: '/assets/images/workflow/workflow-image-2.jpg',
    alt: 'Workflow step 5',
  },
  {
    id: 6,
    position: 6,
    image: '/assets/images/workflow/workflow-image-1.jpg',
    alt: 'Workflow step 6',
  },
  {
    id: 7,
    position: 7,
    image: '/assets/images/workflow/workflow-image-8.jpg',
    alt: 'Workflow step 7',
  },
  {
    id: 8,
    position: 8,
    image: '/assets/images/workflow/workflow-image-3.jpg',
    alt: 'Workflow step 8',
  },
  // clones / additional
  {
    id: 9,
    position: 9,
    image: '/assets/images/workflow/workflow-image-5.jpg',
    alt: 'Workflow step 9',
  },
  {
    id: 10,
    position: 10,
    image: '/assets/images/workflow/workflow-image-4.jpg',
    alt: 'Workflow step 10',
  },
  {
    id: 11,
    position: 11,
    image: '/assets/images/workflow/workflow-image-6.jpg',
    alt: 'Workflow step 11',
  },
  {
    id: 12,
    position: 12,
    image: '/assets/images/workflow/workflow-image-7.jpg',
    alt: 'Workflow step 12',
  },
  {
    id: 13,
    position: 13,
    image: '/assets/images/workflow/workflow-image-2.jpg',
    alt: 'Workflow step 13',
  },
  {
    id: 14,
    position: 14,
    image: '/assets/images/workflow/workflow-image-1.jpg',
    alt: 'Workflow step 14',
  },
  {
    id: 15,
    position: 15,
    image: '/assets/images/workflow/workflow-image-8.jpg',
    alt: 'Workflow step 15',
  },
  {
    id: 16,
    position: 16,
    image: '/assets/images/workflow/workflow-image-3.jpg',
    alt: 'Workflow step 16',
  },
];

function SloganSection({
  slogan = '',
  workflowData = [],
  rotationMode = 'random',
  disableDrag = false,
}: WorkflowProps) {
  const [selected, setSelected] = useState<any>(null);
  // initialize as false on SSR, then determine actual value on mount
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Container ref for scroll tracking
  const containerRef = useRef(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Different parallax speeds for different layers
  const parallaxSlow = useTransform(
    scrollYProgress,
    [0, 2],
    isMobile ? [0, 0] : [250, -700]
  );
  const parallaxFast = useTransform(
    scrollYProgress,
    [0, 2],
    isMobile ? [0, 0] : [500, -600]
  );

  // Floating animation motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for reduced floating effect
  const plane1X = useSpring(
    useTransform(mouseX, [-800, 800], isMobile ? [0, 0] : [-25, 25]),
    {
      stiffness: 50,
      damping: 22,
    }
  );
  const plane1Y = useSpring(
    useTransform(mouseY, [-800, 800], isMobile ? [0, 0] : [-25, 25]),
    {
      stiffness: 50,
      damping: 22,
    }
  );
  const plane2X = useSpring(
    useTransform(mouseX, [-800, 800], isMobile ? [0, 0] : [-35, 35]),
    {
      stiffness: 50,
      damping: 20,
    }
  );
  const plane2Y = useSpring(
    useTransform(mouseY, [-800, 800], isMobile ? [0, 0] : [-35, 35]),
    {
      stiffness: 50,
      damping: 20,
    }
  );
  const plane3X = useSpring(
    useTransform(mouseX, [-800, 800], isMobile ? [0, 0] : [-35, 35]),
    {
      stiffness: 50,
      damping: 22,
    }
  );
  const plane3Y = useSpring(
    useTransform(mouseY, [-800, 800], isMobile ? [0, 0] : [-35, 35]),
    {
      stiffness: 50,
      damping: 22,
    }
  );

  // Handle mouse movement for floating effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(max-width: 768px)');

    // set immediately on mount (use fallback to innerWidth for max compatibility)
    setIsMobile(Boolean(mq.matches || window.innerWidth <= 768));

    // handler works with both addEventListener (MediaQueryListEvent) and old addListener (MediaQueryList)
    const handler = (e: any) => {
      // when called by addListener older API, `e` may be the MediaQueryList itself
      const matches = typeof e?.matches === 'boolean' ? e.matches : mq.matches;
      setIsMobile(Boolean(matches));
    };

    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  // Simplified workflow processing
  const processedWorkflows = useMemo(() => {
    const sourceData =
      workflowData?.length > 0 ? workflowData : defaultWorkflows;

    // Expand / clone items to a larger total (change TOTAL_ITEMS to desired count)
    const TOTAL_ITEMS = 16;
    const expanded: any[] = [...sourceData];

    return expanded.map((workflow, index) => {
      const imageUrl =
        workflow.image ||
        defaultWorkflows[index % defaultWorkflows.length]?.image ||
        '/assets/images/workflow/workflow-image-3.jpg';
      const altText = workflow.alt || `Workflow step ${index + 1}`;

      const contentNode = <AutoSizedImage src={imageUrl} alt={altText} />;

      // Determine which plane this item belongs to for floating effect
      const planeIndex = index % 3; // 0, 1, or 2
      // const brightness = planeIndex === 0 ? 0.7 : planeIndex === 1 ? 0.6 : 0.5;
      const brightness = 1;

      return {
        id: workflow.id || index + 1,
        position: workflow.position || index + 1,
        image: imageUrl,
        alt: altText,
        className: 'absolute', // no dynamic Tailwind rotate class
        zIndex: 100 - index,
        content: contentNode,
        planeIndex,
        brightness,
      };
    });
  }, [workflowData, isMobile, rotationMode]);

  const handleOutsideClick = () => {
    setSelected(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: isMobile ? '130vh' : '185vh' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Title section in center */}
      <div
        className="absolute left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform text-center max-md:w-full"
        style={{ top: isMobile ? '38%' : '42%' }}
      >
        <h1 className="m-0 mb-2.5 max-w-[623px] text-[20px] font-normal leading-[35px] text-black max-md:mx-auto max-md:max-w-[95%] max-md:text-[16px] max-md:leading-[28px]">
          {slogan ? slogan.split('.')[0] : 'Andrea Creative Studio'}
        </h1>
      </div>

      <DraggableCardContainer className="relative z-[51] h-full w-full">
        {processedWorkflows.slice(0, 3).map((item, index) => {
          const positions = [
            { left: isMobile ? '4%' : '25%', top: isMobile ? '9%' : '17%' }, // Ảnh Andrea
            { left: isMobile ? '24%' : '16%', top: isMobile ? '49%' : '57%' }, // Ảnh giữa trái
            { left: isMobile ? '5%' : '20%', top: isMobile ? '67%' : '90%' }, // Ảnh dưới trái
          ];

          // Config cho từng position của plane2
          const positionConfigs = [
            {
              // Position 0 - Ảnh Andrea
              xMultiplier: 1,
              yMultiplier: 1.2,
              parallaxMultiplier: 0.8,
              extraEffects: { scale: 0.00005 },
            },
            {
              // Position 1 - Ảnh giữa trái
              xMultiplier: 0.8,
              yMultiplier: 1,
              parallaxMultiplier: 3.0,
              extraEffects: { rotate: 0.01 },
            },
            {
              // Position 2 - Ảnh dưới trái
              xMultiplier: 1.1,
              yMultiplier: 1,
              parallaxMultiplier: 1.8,
              extraEffects: { opacity: 0.0005 },
            },
          ];

          const config = positionConfigs[index] || positionConfigs[0];

          return (
            <motion.div
              className="absolute h-full w-full"
              style={{
                x: useTransform(() => plane2X.get() * config.xMultiplier),
                y: useTransform(
                  () =>
                    plane2Y.get() * config.yMultiplier +
                    parallaxSlow.get() * config.parallaxMultiplier
                ),
                ...(config.extraEffects?.scale && {
                  scale: useTransform(
                    () => 1 + plane2Y.get() * config.extraEffects.scale!
                  ),
                }),
                ...(config.extraEffects?.rotate && {
                  rotate: useTransform(
                    () => plane2X.get() * config.extraEffects.rotate!
                  ),
                }),
                ...(config.extraEffects?.opacity && {
                  opacity: useTransform(() =>
                    Math.max(
                      0.7,
                      1 - Math.abs(plane2Y.get()) * config.extraEffects.opacity!
                    )
                  ),
                }),
              }}
            >
              <motion.div
                key={`plane1-${item.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 max-md:transform-none"
                style={{
                  left: positions[index]?.left,
                  top: positions[index]?.top,
                }}
                onClick={() => setSelected(item)}
              >
                <DraggableCardBody
                  isSelected={selected?.id === item.id}
                  className=""
                  disableDrag={disableDrag}
                  autoSize={true}
                >
                  {item.content}
                </DraggableCardBody>
              </motion.div>
            </motion.div>
          );
        })}

        {processedWorkflows.slice(3, 6).map((item, index) => {
          const positions = [
            {
              left: isMobile ? 'auto' : '70%',
              right: isMobile ? '2%' : 'auto',
              top: isMobile ? '11%' : '19%',
            }, // Ảnh trên phải
            {
              right: isMobile ? '2%' : '-5%',
              top: isMobile ? '68%' : '55%',
            }, // Ảnh giữa phải
            {
              right: isMobile ? '6%' : 'auto',
              left: isMobile ? 'auto' : '51%',
              top: isMobile ? '86%' : '68%',
            }, // Ảnh center-right
          ];

          // Config cho từng position của plane1
          const positionConfigs = [
            {
              // Position 0 - Ảnh trên phải
              xMultiplier: 1.1,
              yMultiplier: 1,
              parallaxMultiplier: 1.3,
              extraEffects: { scale: 0.0001 },
            },
            {
              // Position 1 - Ảnh giữa phải
              xMultiplier: 0.9,
              yMultiplier: 1.1,
              parallaxMultiplier: 1.2,
              extraEffects: { rotate: -0.008 },
            },
            {
              // Position 1 - Ảnh giữa trái
              xMultiplier: 0.8,
              yMultiplier: 1,
              parallaxMultiplier: 0.9,
              extraEffects: { rotate: 0.01 },
            },
            {
              // Position 2 - Ảnh center-right
              xMultiplier: 1.2,
              yMultiplier: 0.9,
              parallaxMultiplier: 1.1,
              extraEffects: { opacity: 0.0004 },
            },
          ];

          const config = positionConfigs[index] || positionConfigs[0];

          return (
            <motion.div
              className="absolute h-full w-full"
              style={{
                x: useTransform(() => plane1X.get() * config.xMultiplier),
                y: useTransform(
                  () =>
                    plane1Y.get() * config.yMultiplier +
                    parallaxSlow.get() * config.parallaxMultiplier
                ),
                ...(config.extraEffects?.scale && {
                  scale: useTransform(
                    () => 1 + plane1Y.get() * config.extraEffects.scale!
                  ),
                }),
                ...(config.extraEffects?.rotate && {
                  rotate: useTransform(
                    () => plane1X.get() * config.extraEffects.rotate!
                  ),
                }),
                ...(config.extraEffects?.opacity && {
                  opacity: useTransform(() =>
                    Math.max(
                      0.7,
                      1 - Math.abs(plane1Y.get()) * config.extraEffects.opacity!
                    )
                  ),
                }),
              }}
            >
              <motion.div
                key={`plane2-${item.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 max-md:transform-none"
                style={{
                  left: positions[index]?.left,
                  right: positions[index]?.right,
                  top: positions[index]?.top,
                }}
                onClick={() => setSelected(item)}
              >
                <DraggableCardBody
                  isSelected={selected?.id === item.id}
                  className=""
                  disableDrag={disableDrag}
                  autoSize={true}
                >
                  {item.content}
                </DraggableCardBody>
              </motion.div>
            </motion.div>
          );
        })}

        {processedWorkflows.slice(6, 9).map((item, index) => {
          const positions = [
            {
              right: isMobile ? '54%' : '1%',
              bottom: isMobile ? '-7%' : '0%',
            }, // Ảnh dưới phải
          ];

          // Config cho từng position của plane3
          const positionConfigs = [
            {
              // Position 0 - Ảnh dưới phải
              xMultiplier: 1.3,
              yMultiplier: 1.2,
              parallaxMultiplier: 1.5,
              extraEffects: {
                scale: 0.00015,
                rotate: 0.012,
                opacity: 0.0006,
              },
            },
          ];

          const config = positionConfigs[index] || positionConfigs[0];

          return (
            <motion.div
              className="absolute h-full w-full"
              style={{
                x: useTransform(() => plane3X.get() * config.xMultiplier),
                y: useTransform(
                  () =>
                    plane3Y.get() * config.yMultiplier +
                    parallaxFast.get() * config.parallaxMultiplier
                ),
                ...(config.extraEffects?.scale && {
                  scale: useTransform(
                    () => 1 + plane3Y.get() * config.extraEffects.scale!
                  ),
                }),
                ...(config.extraEffects?.rotate && {
                  rotate: useTransform(
                    () => plane3X.get() * config.extraEffects.rotate!
                  ),
                }),
                ...(config.extraEffects?.opacity && {
                  opacity: useTransform(() =>
                    Math.max(
                      0.6,
                      1 - Math.abs(plane3Y.get()) * config.extraEffects.opacity!
                    )
                  ),
                }),
              }}
            >
              <motion.div
                key={`plane3-${item.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 max-md:transform-none"
                style={{
                  right: positions[index]?.right,
                  bottom: positions[index]?.bottom,
                }}
                onClick={() => setSelected(item)}
              >
                <DraggableCardBody
                  isSelected={selected?.id === item.id}
                  className=""
                  disableDrag={disableDrag}
                  autoSize={true}
                >
                  {item.content}
                </DraggableCardBody>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Selected Card Modal */}
        {selected && (
          <SelectedCard
            handleOutsideClick={handleOutsideClick}
            selected={selected}
          />
        )}
      </DraggableCardContainer>
    </div>
  );
}

export default SloganSection;

const SelectedCard = ({
  handleOutsideClick,
  selected,
}: {
  handleOutsideClick?: any;
  selected: any;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig
  );

  return (
    <div className="absolute z-[99999] flex h-full w-full flex-col items-center justify-center rounded-lg bg-transparent p-4 shadow-2xl">
      <motion.div
        onClick={handleOutsideClick}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 z-10 h-full w-full bg-black opacity-60"
      />
      <motion.div
        ref={cardRef}
        layoutId={`content-${selected?.id}`}
        initial={{
          opacity: 0,
          scale: 0.75,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.85,
          y: 20,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          stiffness: 50,
          damping: 20,
        }}
        style={{
          rotateX,
          rotateY,
          opacity,
          transformOrigin: 'center',
          willChange: 'transform',
        }}
        whileHover={{ scale: 1.02, zIndex: 999999 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="transform-3d rounded-10 relative z-[70] flex items-center justify-center overflow-hidden bg-neutral-100 p-4 shadow-2xl dark:bg-neutral-900"
      >
        {/* <AutoSizedImage
          src={selected?.image}
          alt={selected?.alt}
          maxWidth={Math.min(windowSize.width * 0.8, 900)}
          maxHeight={Math.min(windowSize.height * 0.8, 700)}
        /> */}
      </motion.div>
    </div>
  );
};
