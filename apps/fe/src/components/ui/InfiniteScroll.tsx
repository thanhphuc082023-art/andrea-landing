'use client';
import { cn } from '@/utils';
import React, { useEffect, useState, useRef } from 'react';
import type { MotionValue } from 'motion';
import { motion, useMotionValue } from 'motion/react';
import { animate } from 'motion';

interface InfiniteScrollProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
  duplicateCount?: number;
  progress?: MotionValue<number>; // listen to external scroll progress
}

export const InfiniteScroll = ({
  children,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
  duplicateCount = 2,
  progress,
}: InfiniteScrollProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLDivElement & { __isMotion?: boolean }>(
    null
  );
  const [start, setStart] = useState(false);
  const pendingTimeoutRef = useRef<number | null>(null);
  const originalCountRef = useRef<number>(0);
  const isGridRef = useRef(false);
  const [isGrid, setIsGrid] = useState(false); // trigger re-render for class swap

  // motion compensation
  const outerX = useMotionValue(0);
  const currentAnimRef = useRef<any>(null);
  const isPausedRef = useRef<boolean | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // sanitize a node and its descendants to remove inline styles that break layout
  const sanitizeNode = (node: HTMLElement) => {
    try {
      node.removeAttribute('style');
      node.classList.remove('animate-scroll');
      node.removeAttribute('data-duplicate');
      Array.from(node.querySelectorAll('*')).forEach((child) => {
        if (child instanceof HTMLElement) {
          child.removeAttribute('style');
          child.classList.remove('animate-scroll');
          child.removeAttribute('data-duplicate');
        }
      });
    } catch (e) {
      // ignore sanitize failures
    }
  };

  useEffect(() => {
    if (innerRef.current && originalCountRef.current === 0) {
      originalCountRef.current = innerRef.current.children.length; // initial children count
      // mark originals
      Array.from(innerRef.current.children).forEach((el) => {
        (el as HTMLElement).setAttribute('data-original', 'true');
      });
    }
    addAnimation();
    return () => {
      if (pendingTimeoutRef.current) {
        window.clearTimeout(pendingTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!innerRef.current) return;

    // determine threshold per device (mobile gets lower threshold)
    const getScrollThreshold = () => {
      try {
        return window.innerWidth < 768 ? 200 : 300;
      } catch (e) {
        return 300;
      }
    };

    const stopAnim = () => {
      const a = currentAnimRef.current;
      if (!a) return;
      try {
        if (typeof a.cancel === 'function') a.cancel();
        else if (typeof a.stop === 'function') a.stop();
      } catch (e) {}
      currentAnimRef.current = null;
    };

    const removeDuplicates = () => {
      if (!innerRef.current) return;
      const total = innerRef.current.children.length;
      for (let i = total - 1; i >= originalCountRef.current; i--) {
        innerRef.current.removeChild(innerRef.current.children[i]);
      }
    };

    const addDuplicates = () => {
      if (!innerRef.current) return;
      if (duplicateCount <= 0) return;

      // Ensure we have a sensible originalCount (fallback if not set)
      if (!originalCountRef.current) {
        originalCountRef.current = innerRef.current.children.length || 0;
        Array.from(innerRef.current.children).forEach((el, idx) => {
          if (idx < originalCountRef.current)
            (el as HTMLElement).setAttribute('data-original', 'true');
        });
      }

      const expected = originalCountRef.current * (duplicateCount + 1);
      if (originalCountRef.current === 0) return; // nothing to clone
      if (innerRef.current.children.length >= expected) return;

      // Prefer querying marked originals, fall back to slicing the first N children
      let originals = Array.from(
        innerRef.current.querySelectorAll('[data-original="true"]')
      ) as HTMLElement[];

      if (originals.length === 0) {
        originals = Array.from(innerRef.current.children).slice(
          0,
          originalCountRef.current
        ) as HTMLElement[];
      }

      if (originals.length === 0) {
        // If still empty, bail out to avoid errors
        return;
      }

      for (let i = 0; i < duplicateCount; i++) {
        originals.forEach((item) => {
          try {
            // Only clone HTMLElements
            if (!(item instanceof HTMLElement)) return;
            const clone = item.cloneNode(true) as HTMLElement;
            // remove attributes that could carry layout/transform state
            clone.removeAttribute('data-original');
            sanitizeNode(clone);
            // mark as duplicate and append
            clone.setAttribute('data-duplicate', 'true');
            innerRef.current?.appendChild(clone);
          } catch (e) {
            // swallow per-item clone errors to avoid breaking the whole scroller
            // eslint-disable-next-line no-console
            console.warn('InfiniteScroll.addDuplicates: clone failed', e);
          }
        });
      }
    };

    const wrapToSmallest = (value: number, modulus: number) => {
      if (!isFinite(value) || !isFinite(modulus) || modulus === 0) return value;
      const half = modulus / 2;
      const r = (((value + half) % modulus) + modulus) % modulus;
      return r - half;
    };

    const applyPausedState = (paused: boolean) => {
      if (!innerRef.current) return;
      stopAnim();
      if (paused) {
        // Switch to grid mode
        outerX.set(0);
        removeDuplicates();
        innerRef.current.classList.remove('animate-scroll');
        innerRef.current.style.animation = 'none';
        innerRef.current.style.transform = 'translateX(0px)';
        // Use responsive tailwind classes instead of inline grid-template so mobile shows 1 item per row
        // layout will be handled via className 'grid w-full grid-cols-1 md:grid-cols-3 gap-6'
        isGridRef.current = true;
        setIsGrid(true);
      } else {
        if (isGridRef.current) {
          // Restore flex scroller
          // clearing inline styles (if any) and switch back to flex layout via className
          innerRef.current.style.display = '';
          innerRef.current.style.transform = '';
          isGridRef.current = false;
          setIsGrid(false);
          // Defer duplication until after React re-render applies new classes
          requestAnimationFrame(() => {
            addDuplicates();
            startAnimation();
          });
          return; // exit early, animation will start in callback
        }
        // Start animation fresh (non-grid -> non-grid transition)
        startAnimation();
      }
    };

    const startAnimation = () => {
      if (!innerRef.current) return;
      outerX.set(0);
      currentAnimRef.current = animate(outerX.get(), 0, {
        duration: 0.1,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (val: number) => outerX.set(val),
      });
      innerRef.current.classList.remove('animate-scroll');
      innerRef.current.offsetWidth; // reflow
      innerRef.current.style.animation = '';
      innerRef.current.style.transform = '';
      innerRef.current.classList.add('animate-scroll');
      innerRef.current.style.animationPlayState = 'running';
    };

    // initial state
    try {
      innerRef.current.classList.remove('animate-scroll');
      innerRef.current.style.animation = 'none';
      outerX.set(0);
    } catch (e) {}

    const startTimeout = window.setTimeout(() => {
      if (innerRef.current && !isGridRef.current) {
        innerRef.current.style.animation = '';
        innerRef.current.classList.add('animate-scroll');
        innerRef.current.style.animationPlayState = 'running';
        setStart(true);
      }
    }, 80);

    const evaluatePaused = () => {
      // Only use window.scrollY to decide paused state to avoid early triggers from external MotionValue
      let byPixel = false;
      try {
        const threshold = getScrollThreshold();
        byPixel = window.scrollY > threshold;
      } catch (e) {
        byPixel = false;
      }

      const paused = byPixel;
      if (isPausedRef.current === paused) return;
      isPausedRef.current = paused;
      applyPausedState(paused);
    };

    const onScrollDebounced = () => {
      if (debounceTimerRef.current)
        window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(evaluatePaused, 40);
    };

    window.addEventListener('scroll', onScrollDebounced, { passive: true });

    // NOTE: ignore `progress` MotionValue here to prevent premature pausing.

    // initial evaluation
    evaluatePaused();

    return () => {
      window.clearTimeout(startTimeout);
      window.removeEventListener('scroll', onScrollDebounced);
      if (pendingTimeoutRef.current) {
        window.clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      stopAnim();
    };
  }, [start, outerX, duplicateCount]);

  function addAnimation() {
    if (containerRef.current && innerRef.current) {
      // ensure originals tagged
      Array.from(innerRef.current.children).forEach((el, idx) => {
        if (idx < originalCountRef.current)
          (el as HTMLElement).setAttribute('data-original', 'true');
      });
      if (duplicateCount > 0) {
        addDuplicates();
      }
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  // replace previous addDuplicates with a sanitized, robust version
  const addDuplicates = () => {
    if (!innerRef.current) return;
    if (duplicateCount <= 0) return;

    // Ensure we have a sensible originalCount (fallback if not set)
    if (!originalCountRef.current) {
      originalCountRef.current = innerRef.current.children.length || 0;
      Array.from(innerRef.current.children).forEach((el, idx) => {
        if (idx < originalCountRef.current)
          (el as HTMLElement).setAttribute('data-original', 'true');
      });
    }

    const expected = originalCountRef.current * (duplicateCount + 1);
    if (originalCountRef.current === 0) return; // nothing to clone
    if (innerRef.current.children.length >= expected) return;

    // Prefer querying marked originals, fall back to slicing the first N children
    let originals = Array.from(
      innerRef.current.querySelectorAll('[data-original="true"]')
    ) as HTMLElement[];

    if (originals.length === 0) {
      originals = Array.from(innerRef.current.children).slice(
        0,
        originalCountRef.current
      ) as HTMLElement[];
    }

    if (originals.length === 0) {
      // If still empty, bail out to avoid errors
      return;
    }

    for (let i = 0; i < duplicateCount; i++) {
      originals.forEach((item) => {
        try {
          if (!(item instanceof HTMLElement)) return;
          const clone = item.cloneNode(true) as HTMLElement;
          clone.removeAttribute('data-original');
          sanitizeNode(clone);
          clone.setAttribute('data-duplicate', 'true');
          innerRef.current?.appendChild(clone);
        } catch (e) {
          console.warn('InfiniteScroll.addDuplicates: clone failed', e);
        }
      });
    }
  };

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
        containerRef.current.style.setProperty('--animation-duration', '200s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '200s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '300s');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative mb-6 overflow-hidden', className)}
    >
      <motion.div style={{ x: outerX }}>
        <motion.div
          ref={innerRef as any}
          layout
          className={cn(
            isGrid
              ? 'grid w-full grid-cols-1 gap-6 md:grid-cols-3'
              : 'flex w-max min-w-full shrink-0 flex-nowrap gap-6',
            !isGrid && start && 'animate-scroll',
            !isGrid && pauseOnHover && 'hover:[animation-play-state:paused]'
          )}
          transition={{
            layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
          }}
        >
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;
            return (
              <motion.div
                layout
                key={index}
                className={isGrid ? 'h-full w-full' : undefined}
              >
                {React.cloneElement(child as any, { gridMode: isGrid })}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

const getInnerTranslateX = (el: HTMLElement) => {
  const style = getComputedStyle(el);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return matrix.m41;
};
