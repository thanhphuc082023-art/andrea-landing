import { useMemo, useState, useEffect, type ReactNode, useRef } from 'react';
import 'keen-slider/keen-slider.min.css';
import { getStrapiMediaUrl } from '@/utils/helper';
import {
  DraggableCardBody,
  DraggableCardContainer,
} from '@/components/ui/DraggableCardBody';
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '@/utils';

interface WorkflowProps {
  workflowData?: any[];
  rotationMode?: 'random' | 'radial';
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
  workflowData = [],
  rotationMode = 'random',
}: WorkflowProps) {
  const [selected, setSelected] = useState<any>(null);
  // initialize as false on SSR, then determine actual value on mount
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
    while (expanded.length < TOTAL_ITEMS) {
      const template =
        sourceData[expanded.length % sourceData.length] ||
        defaultWorkflows[expanded.length % defaultWorkflows.length];
      expanded.push({
        ...template,
        id: expanded.length + 1,
        position: expanded.length + 1,
        // keep same image/alt by default; alt adds clone index for clarity
        alt: template.alt
          ? `${template.alt} (clone ${Math.floor(expanded.length / sourceData.length)})`
          : `Workflow step ${expanded.length + 1}`,
      });
    }

    return expanded.map((workflow, index) => {
      // arrange items evenly around a circle
      const TOTAL = TOTAL_ITEMS; // 32
      const angle = (index / TOTAL) * Math.PI * 2; // radians
      const radiusPercent = 48; // percent radius from center (increased to make circle wider)

      // x/y offset in percent relative to container
      const xPercent = Math.cos(angle) * radiusPercent;
      const yPercent = Math.sin(angle) * radiusPercent * 0.85; // slightly squashed vertically

      // rotation modes: 'radial' = original radial + jitter; 'random' = position-based random
      const maxRotation = 15; // degrees range for 'random' mode
      let rotationDeg: number;
      if (rotationMode === 'radial') {
        // original behavior: face outward around circle with small deterministic jitter
        const baseRotation = (angle * 180) / Math.PI + 90;
        const jitterRange = 6;
        const seedRadial = Math.abs(Math.sin(index * 12.9898) * 43758.5453) % 1;
        const rotationJitter = (seedRadial - 0.5) * jitterRange;
        rotationDeg = baseRotation + rotationJitter;
      } else {
        // current randomized behavior: deterministic by position so layout looks arbitrary
        const seedRaw = Math.sin(
          xPercent * 13.37 + yPercent * 7.13 + index * 0.618
        );
        const seedRandom = Math.abs(seedRaw * 43758.5453) % 1;
        rotationDeg = (seedRandom - 0.5) * 2 * maxRotation;
      }

      // small random jitter so items aren't perfectly symmetric
      const jitter = (index % 5) - 2;
      const jitterX = jitter * 0.6;
      const jitterY = ((index % 3) - 1) * 0.8;

      // use motion's numeric rotate so motion.react applies rotation correctly
      // responsive: on small screens place items in two rows (top / bottom) and spread horizontally
      let style: any;
      if (isMobile) {
        // place even indices on top row, odd on bottom row, distribute horizontally
        const row = index % 2 === 0 ? 'top' : 'bottom';
        const groupIndex = Math.floor(index / 2);
        const groupCount = Math.ceil(TOTAL / 2);
        // increase horizontal spread and adjust start offset so items have more space on mobile
        const H_SPREAD = 180; // larger span -> items distributed more across the row
        const startOffset = -60; // move start left to keep centered with larger spread
        const leftPercentMobile =
          startOffset +
          (groupCount <= 1 ? 0 : (groupIndex / (groupCount - 1)) * H_SPREAD);
        style = {
          position: 'absolute',
          left: `${leftPercentMobile}%`,
          // increase vertical gap between top and bottom rows for more breathing room
          top: row === 'top' ? '6%' : undefined,
          bottom: row === 'bottom' ? '6%' : undefined,
          rotate: rotationDeg,
          zIndex: 100 - index,
        };
      } else {
        style = {
          position: 'absolute',
          left: `${36 + xPercent + jitterX}%`,
          top: `${38 + yPercent + jitterY}%`,
          rotate: rotationDeg,
          zIndex: 100 - index, // stacking so earlier items are on top
        };
      }

      const imageUrl =
        getStrapiMediaUrl(workflow.image) ||
        defaultWorkflows[index % defaultWorkflows.length]?.image ||
        '/assets/images/workflow/workflow-image-3.jpg';
      const altText = workflow.alt || `Workflow step ${index + 1}`;

      const contentNode = (
        <img
          src={imageUrl}
          alt={altText}
          width={450}
          height={300}
          className="rounded-8 pointer-events-none relative z-10 h-[250px] w-[400px] object-cover max-md:mx-auto max-md:h-[120px] max-md:w-[180px]"
        />
      );

      return {
        id: workflow.id || index + 1,
        position: workflow.position || index + 1,
        image: imageUrl,
        alt: altText,
        className: 'absolute', // no dynamic Tailwind rotate class
        style: style as any,
        zIndex: 100 - index,
        content: contentNode,
      };
    });
  }, [workflowData, isMobile, rotationMode]);

  const handleOutsideClick = () => {
    setSelected(null);
  };

  return (
    <DraggableCardContainer className="relative flex min-h-[1300px] w-full items-center justify-center overflow-clip max-md:min-h-[750px]">
      <div className="content-wrapper flex items-center justify-center">
        <p className="max-w-[860px] text-center text-2xl font-semibold text-neutral-700 max-md:max-w-full max-md:text-[20px]">
          Với khát vọng tôn vinh giá trị thương hiệu Việt và đồng hành cùng
          doanh nghiệp trong nước vươn tầm quốc tế, Andrea định hướng trở thành
          đơn vị tư vấn, thiết kế thương hiệu cảm xúc và đồng hành cùng doanh
          nghiệp phát triển thương hiệu bền vững tại Việt Nam.
        </p>
      </div>
      {processedWorkflows.map((item) => (
        <>
          {selected?.id === item.id && (
            <SelectedCard
              handleOutsideClick={handleOutsideClick}
              selected={selected}
            />
          )}

          <DraggableCardBody
            key={`${item.id}`}
            isSelected={selected?.id === item.id}
            className={`absolute min-h-[250px] w-[400px] max-md:mx-3 max-md:my-2 max-md:min-h-[120px] max-md:w-[180px] max-md:p-2`}
            style={item.style}
            onClick={() => setSelected(item)}
          >
            {item.content}
          </DraggableCardBody>
        </>
      ))}
    </DraggableCardContainer>
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
    stiffness: 100,
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
          stiffness: 100,
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
        className="transform-3d rounded-10 relative z-[70] min-h-[250px] w-[400px] overflow-hidden bg-neutral-100 p-6 shadow-2xl max-md:min-h-[120px] max-md:w-[180px] max-md:p-2 dark:bg-neutral-900"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
