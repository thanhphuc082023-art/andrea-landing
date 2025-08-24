'use client';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';

const FlipWords = ({
  words,
  duration = 3000,
  className,
  activeClassName,
  shimmer = false, // new prop to toggle TextShimmerWave
}: {
  words: (string | { label: string; url?: string })[];
  duration?: number;
  className?: string;
  activeClassName?: string;
  shimmer?: boolean;
}) => {
  const router = useRouter();

  if (!words || words.length === 0) return null;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [fixedWidth, setFixedWidth] = useState<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // NEW: track when the entrance animation has finished
  const [entranceComplete, setEntranceComplete] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setIsAnimating(true);
  }, [words.length]);

  useEffect(() => {
    if (!isAnimating) {
      const t = setTimeout(() => startAnimation(), duration);
      return () => clearTimeout(t);
    }
  }, [isAnimating, duration, startAnimation]);

  // measure max width of all labels (including spaces) using canvas + computed font
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const cs = window.getComputedStyle(el);
    const font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = font;
    let max = 0;
    for (const w of words) {
      const label = typeof w === 'string' ? w : w.label;
      const measured = ctx.measureText(label).width;
      if (measured > max) max = measured;
    }

    const paddingLeft = parseFloat(cs.paddingLeft || '0') || 0;
    const paddingRight = parseFloat(cs.paddingRight || '0') || 0;
    const extra = 6; // safety padding to avoid clipping during transforms
    setFixedWidth(Math.ceil(max + paddingLeft + paddingRight + extra));
  }, [words, className]);

  const current = words[currentIndex];
  const label = typeof current === 'string' ? current : current.label;
  const url = typeof current === 'string' ? undefined : current.url;

  // Reset entranceComplete whenever the word changes, will be set true by onAnimationComplete
  useEffect(() => {
    setEntranceComplete(false);
  }, [currentIndex]);

  // Pause animations while hovered (desktop & touch) without causing re-renders
  const isHoveredRef = useRef(false);

  // Compute shimmer timing based on number of chars to avoid mid-cycle conflicts
  // const charCount = label.length;
  const shimmerDuration = 1; // between 0.6s and 2s
  // const shimmerDuration = Math.max(0.6, Math.min(2, charCount * 0.12)); // between 0.6s and 2s

  // const shimmerSpread = Math.max(1, Math.floor(charCount / 6) || 1);
  const shimmerSpread = 2;

  // determine active state by checking current route against any word url
  const isPathActive = (url?: string) => {
    const currentPath = router.asPath;
    // Special case for Services - the nav may point to an anchor on the homepage
    if (url === '/') {
      // Treat as active when on a dedicated /services route or when the URL contains the #services anchor
      return (
        currentPath === '/' ||
        currentPath.startsWith('/services') ||
        currentPath.includes('#services')
      );
    }

    // Special case for E-Profile - also match /upload/e-profile
    if (url === '/e-profile') {
      return (
        currentPath.startsWith('/e-profile') ||
        currentPath.startsWith('/upload/e-profile')
      );
    }

    // Special case for Projects - match both /projects and /project/[slug]
    if (url === '/projects') {
      return currentPath === '/projects' || currentPath.startsWith('/project/');
    }

    return currentPath.startsWith(url || '');
  };

  // Determine active state based on the currently displayed word's url
  const isActive = isPathActive(url);

  const stateClass = isActive
    ? activeClassName
    : isHoveredRef.current
      ? `${activeClassName} !font-normal`
      : '';
  const combinedClass = cn(className, stateClass);

  // Simplified rendering helpers
  const renderShimmer = () => {
    const node = (
      <TextShimmerWave
        as="span"
        className={cn('inline-block', combinedClass)}
        duration={shimmerDuration}
        spread={shimmerSpread}
      >
        {label}
      </TextShimmerWave>
    );
    return url ? (
      <Link href={url} className={cn('inline-block', combinedClass)}>
        {node}
      </Link>
    ) : (
      node
    );
  };

  const renderStatic = () => {
    const node = (
      <span className={cn('inline-block', combinedClass)}>{label}</span>
    );
    return url ? (
      <Link href={url} className={cn('inline-block', combinedClass)}>
        {node}
      </Link>
    ) : (
      node
    );
  };

  const renderAnimatedWords = () => {
    const wordNodes = label.split(' ').map((word, wordIndex) => (
      <motion.span
        key={`${currentIndex}-w-${wordIndex}`}
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: wordIndex * 0.3, duration: 0.3 }}
        className="inline-block whitespace-nowrap"
      >
        {word.split('').map((letter, letterIndex) => (
          <motion.span
            key={`${currentIndex}-w-${wordIndex}-l-${letterIndex}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              delay: wordIndex * 0.3 + letterIndex * 0.05,
              duration: 0.2,
            }}
            className={cn('inline-block')}
          >
            {letter}
          </motion.span>
        ))}
        <span className="inline-block">
          {wordIndex < label.split(' ').length - 1 ? '\u00A0' : ''}
        </span>
      </motion.span>
    ));

    return url ? (
      <Link href={url} className={cn('inline-block', combinedClass)}>
        {wordNodes}
      </Link>
    ) : (
      <>{wordNodes}</>
    );
  };

  // Decide final content in a single place
  const content =
    shimmer && entranceComplete
      ? renderShimmer()
      : // : isHovered
        //   ? renderStatic()
        renderAnimatedWords();

  return (
    <div ref={rootRef} className="inline-block w-full">
      <AnimatePresence
        onExitComplete={() => {
          setIsAnimating(false);
        }}
      >
        <motion.div
          key={currentIndex}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 10,
          }}
          // NEW: set entranceComplete true when entrance animation finished
          onAnimationComplete={() => {
            setEntranceComplete(true);
          }}
          // hover / touch handlers to pause/resume flip animations (use ref to avoid re-render)
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onTouchStart={() => {
            isHoveredRef.current = true;
          }}
          onTouchEnd={() => {
            isHoveredRef.current = false;
          }}
          onFocus={() => {
            isHoveredRef.current = true;
          }}
          onBlur={() => {
            isHoveredRef.current = false;
          }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: 'blur(8px)',
            scale: 2,
            position: 'absolute',
          }}
          className={cn('relative z-10 inline-block max-md:!w-full')}
          // set fixed width to avoid layout jumps when words change
          style={{
            width: fixedWidth ? `${fixedWidth}px` : undefined,
            whiteSpace: 'nowrap', // prevent wrapping between words/letters
          }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipWords;

// Inline TextShimmerWave component (kept local to avoid extra file)
function TextShimmerWave({
  children,
  as: Component = 'span',
  className,
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.01,
  rotateYDistance = 10,
  transition,
}: {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  transition?: any;
}) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  return (
    <MotionComponent
      className={cn(
        'relative inline-block [perspective:500px]',
        '[--base-color:#374151] [--base-gradient-color:#dedede]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]',
        className
      )}
      style={{ color: 'var(--base-color)' }}
    >
      {children.split('').map((char, i) => {
        const delay = (i * duration * (1 / spread)) / children.length;

        return (
          <motion.span
            key={i}
            className={cn(
              'inline-block whitespace-pre [transform-style:preserve-3d]'
            )}
            initial={{
              translateZ: 0,
              scale: 1,
              rotateY: 0,
              color: 'var(--base-color)',
            }}
            animate={{
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: [
                'var(--base-color)',
                'var(--base-gradient-color)',
                'var(--base-color)',
              ],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatDelay: (children.length * 0.05) / spread,
              delay,
              ease: 'easeInOut',
              ...transition,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}
