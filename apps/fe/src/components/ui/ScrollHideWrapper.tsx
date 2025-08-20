'use client';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';

interface ScrollHideWrapperProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  hideMode?: 'opacity' | 'translate' | 'scale' | 'all';
  // Grid + slide-in options
  grid?: boolean;
  itemsPerRow?: number; // number of columns on md+ (defaults to 3)
  // slideMode: 'forwards' -> slide from left, 'reverse' -> slide from right
  slideMode?: 'forwards' | 'reverse';
  // delay before revealing (ms)
  stagger?: number;
  // duration of slide animation (ms)
  slideDuration?: number;
}

export const ScrollHideWrapper = ({
  children,
  threshold = 300,
  className,
  hideMode = 'opacity',
  grid = false,
  itemsPerRow = 3,
  slideMode = 'forwards',
  stagger = 0,
  slideDuration = 700,
}: ScrollHideWrapperProps) => {
  const [isHidden, setIsHidden] = useState(false);

  // track hide-on-scroll state
  useEffect(() => {
    const handleScroll = () => {
      const shouldHide = window.scrollY > threshold;
      setIsHidden(shouldHide);
    };

    // initial
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Different hide modes
  const getHideStyles = () => {
    if (!isHidden) return '';

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

  // Grid slide-in logic: only triggers after isHidden === true
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimatedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!grid) return;
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Only trigger slide-in when element is in view AND the hide-on-scroll
        // threshold has been passed (isHidden === true)
        if (entry.isIntersecting && !hasAnimatedRef.current && isHidden) {
          timeoutRef.current = window.setTimeout(() => {
            setIsInView(true);
            hasAnimatedRef.current = true;
          }, stagger);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [grid, stagger, isHidden]);

  // Compute inline styles for slide animation
  const initialTransform =
    slideMode === 'forwards' ? 'translateX(-100%)' : 'translateX(100%)';
  const finalTransform = 'translateX(0)';

  const transitionStyle: React.CSSProperties = {
    transitionProperty: 'transform, opacity',
    transitionDuration: `${Math.max(50, slideDuration)}ms`,
    transitionTimingFunction: 'cubic-bezier(.22,.9,.33,1)',
  };

  if (grid) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'w-full overflow-hidden',
          'transition-all ease-in-out',
          getHideStyles(),
          className
        )}
      >
        <div
          style={{
            transform: isInView ? finalTransform : initialTransform,
            opacity: isInView ? 1 : 0,
            ...transitionStyle,
          }}
        >
          {/* render children as a single-row grid; HeroParallax passes a row's items as children */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-${itemsPerRow} gap-6`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Default behavior (non-grid): keep existing wrapper behavior
  return (
    <div
      className={cn(
        'transition-all duration-500 ease-in-out',
        getHideStyles(),
        className
      )}
    >
      {children}
    </div>
  );
};
