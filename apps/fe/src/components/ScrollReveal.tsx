import React, { useRef, useMemo } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'motion/react';

import { cn } from '@/utils';

interface ScrollRevealProps {
  children: string[];
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  className?: string;
}

const processTextLines = (textArray: string[]) => {
  return textArray.map((line, lineIndex) => ({
    type: 'line',
    content: line,
    index: lineIndex,
  }));
};

function LineReveal({
  children,
  index,
  total,
  progress,
  baseOpacity = 0.1,
  enableBlur = false,
  blurStrength = 4,
}: {
  children: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  baseOpacity?: number;
  enableBlur?: boolean;
  blurStrength?: number;
}) {
  // Nhóm 6 dòng cùng lúc để sweep chậm hơn, mỗi dòng có offset khác nhau
  const groupIndex = Math.floor(index / 3);
  const totalGroups = Math.ceil(total / 3);
  const lineInGroup = index % 3; // 0, 1, 2, 3, 4, hoặc 5
  const baseStartProgress = groupIndex / totalGroups;
  const baseEndProgress = (groupIndex + 1) / totalGroups;

  // Tạo offset cho mỗi dòng trong nhóm
  const offsetDelay = lineInGroup * 0.03; // Delay nhỏ cho mỗi dòng
  const startProgress = baseStartProgress + offsetDelay;
  const endProgress = baseEndProgress + offsetDelay;

  // Transform background position for line processing effect - sweep từ trái qua phải
  const backgroundPosition = useTransform(
    progress,
    [startProgress, endProgress],
    ['100% 0%', '0% 0%']
  );

  const blur = useTransform(
    progress,
    [startProgress, endProgress],
    [enableBlur ? blurStrength : 0, 0]
  );

  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.div
      style={{
        display: 'inline',
        position: 'relative',
        whiteSpace: 'nowrap',
        background:
          '-webkit-gradient(linear, left top, right top, color-stop(50%, rgb(68, 68, 68)), color-stop(50%, #3333334D))',
        backgroundImage:
          'linear-gradient(to right, rgb(68, 68, 68) 50%, #3333334D 50%)',
        backgroundSize: '200% 100%',
        WebkitTextFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        backgroundPosition,
        filter: enableBlur ? filter : undefined,
        willChange: 'background-position, filter',
      }}
      className="block"
    >
      {children}
    </motion.div>
  );
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = false,
  baseOpacity = 0.1,
  blurStrength = 2,
  containerClassName = '',
  textClassName = '',
  className,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const processedLines = useMemo(() => {
    return processTextLines(children);
  }, [children]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start end', 'end center'],
  });

  // Debug scroll progress
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      console.log('Scroll progress:', value);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const lineCount = processedLines.length;

  return (
    <motion.h2
      ref={containerRef}
      style={{
        transformOrigin: '0% 50%',
      }}
      className={cn('scroll-reveal', containerClassName, className)}
    >
      <div
        className={cn(
          'scroll-reveal-text mx-auto flex w-fit flex-col text-[25px] leading-relaxed sm:text-[30px] md:leading-relaxed lg:text-[40px] lg:leading-relaxed xl:text-[50px] xl:leading-relaxed',
          textClassName
        )}
      >
        {processedLines.map((line, index) => {
          if (line.content === '<br>') {
            return <br key={line.index} />;
          }
          return (
            <LineReveal
              key={line.index}
              index={index}
              total={lineCount}
              progress={scrollYProgress}
              baseOpacity={baseOpacity}
              enableBlur={enableBlur}
              blurStrength={blurStrength}
            >
              {line.content}
            </LineReveal>
          );
        })}
      </div>
    </motion.h2>
  );
}
