import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'motion/react';

import { cn } from '@/utils';

interface ScrollRevealProps {
  fullContent: any;
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
  // Nhóm 3 dòng cùng lúc để sweep chậm hơn, mỗi dòng có offset khác nhau
  const groupIndex = Math.floor(index / 3);
  const totalGroups = Math.ceil(total / 3);
  const lineInGroup = index % 3; // 0, 1, 2

  // Đảm bảo nhóm cuối cùng có thể hoàn thành animation
  const adjustedTotalGroups = totalGroups === 1 ? 1 : totalGroups - 0.1;
  const baseStartProgress = groupIndex / adjustedTotalGroups;
  const baseEndProgress = (groupIndex + 1) / adjustedTotalGroups;

  // Tạo offset cho mỗi dòng trong nhóm
  const offsetDelay = lineInGroup * 0.03; // Delay nhỏ cho mỗi dòng
  const startProgress = Math.min(baseStartProgress + offsetDelay, 1);
  const endProgress = Math.min(baseEndProgress + offsetDelay, 1);

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
  fullContent,
  scrollContainerRef,
  enableBlur = false,
  baseOpacity = 0.1,
  blurStrength = 2,
  containerClassName = '',
  textClassName = '',
  className,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const [charsPerLine, setCharsPerLine] = useState(50);

  useEffect(() => {
    const handleResize = () => {
      try {
        const container = textContainerRef.current;
        const containerWidth = container?.clientWidth || window.innerWidth;

        // set fontSize theo breakpoint Tailwind
        let fontSize = 25; // base = text-[25px]
        if (window.innerWidth >= 1280) {
          fontSize = 50; // xl:text-[50px]
        } else if (window.innerWidth >= 640) {
          fontSize = 30; // sm:text-[30px]
        }

        const fontFamily = 'Playfair Display, serif'; // đúng với class font-playfair
        const fontWeight = '400';
        const fontStyle = 'normal';

        // tính width trung bình của ký tự
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let avgCharWidth = 0.5 * fontSize; // fallback
        if (ctx) {
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
          const sample =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789';
          const metrics = ctx.measureText(sample);
          avgCharWidth = metrics.width / sample.length;
        }

        const calculated = Math.max(
          10,
          Math.floor(containerWidth / avgCharWidth)
        );
        setCharsPerLine(calculated);
      } catch (e) {
        const fallbackChars = Math.max(10, Math.floor(window.innerWidth / 28));
        setCharsPerLine(fallbackChars);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const contentLines = splitIntoCharacters(fullContent, charsPerLine);

  const processedLines = useMemo(() => {
    return processTextLines(contentLines);
  }, [contentLines]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start end', 'end center'],
  });

  const lineCount = processedLines.length;

  if (!fullContent) return;

  return (
    <div
      ref={textContainerRef}
      className="about-text font-playfair my-[100px] text-left text-[50px] leading-relaxed"
    >
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
    </div>
  );
}

// Helper function to split text into lines with a maximum number of characters
const splitIntoCharacters = (text: string, charsPerLine: number): string[] => {
  const paragraphs = text?.split('\n'); // Split by double newline for paragraphs
  const result: string[] = [];

  paragraphs?.forEach((paragraph, pIndex) => {
    let currentLine = '';
    const words = paragraph.split(' '); // Split by words to avoid breaking words in half

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        if (currentLine !== '') {
          result.push(currentLine.trim());
        }
        currentLine = word;
      }
    }
    if (currentLine !== '') {
      result.push(currentLine.trim());
    }

    if (pIndex < paragraphs.length - 1) {
      result.push('<br>'); // Add <br> between paragraphs
    }
  });

  return result;
};
