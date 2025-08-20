'use client';
import { cn } from '@/utils';
import React, { useEffect, useState } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
  duplicateCount?: number;
}

export const InfiniteScroll = ({
  children,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
  duplicateCount = 2,
}: InfiniteScrollProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate items multiple times for seamless infinite scroll
      for (let i = 0; i < duplicateCount; i++) {
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });
      }

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '250s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '250s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '250s');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative mb-6 overflow-hidden', className)}
    >
      <div
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-6',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
    </div>
  );
};
