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
  hideOnScroll?: boolean;
  scrollThreshold?: number;
  hideMode?: 'opacity' | 'translate' | 'scale' | 'all';
}

export const InfiniteScroll = ({
  children,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
  duplicateCount = 2,
  hideOnScroll = false,
  scrollThreshold = 300,
  hideMode = 'opacity',
}: InfiniteScrollProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const shouldHide = window.scrollY > scrollThreshold;
      setIsHidden(shouldHide);
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, scrollThreshold]);

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
        // Slide từ trái vào: animation forwards (0% → -50%)
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        );
      } else {
        // Slide từ phải vào: animation reverse (-50% → 0%)
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
        containerRef.current.style.setProperty('--animation-duration', '700s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '700s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '800s');
      }
    }
  };

  // Get hide styles based on hideMode
  const getHideStyles = () => {
    if (!isHidden || !hideOnScroll) return '';

    switch (hideMode) {
      case 'opacity':
        return 'opacity-0';
      case 'translate':
        return 'translate-y-10 opacity-75';
      case 'scale':
        return 'scale-95 opacity-50';
      case 'all':
        return 'opacity-0 translate-y-10 scale-95';
      default:
        return 'opacity-0';
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-in-out',
        getHideStyles(),
        className
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-6 max-md:gap-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
    </div>
  );
};
