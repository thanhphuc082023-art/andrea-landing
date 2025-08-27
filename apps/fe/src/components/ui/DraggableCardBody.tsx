'use client';
import {
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/utils';

export const DraggableCardBody = ({
  className,
  children,
  style,
  onClick,
  isSelected,
}: {
  isSelected?: boolean;
  onClick?: any;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; // accept inline style nudges
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // prevent click from firing after a drag
  const lastDragTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const CLICK_IGNORE_MS = 200;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // ignore if we're currently dragging or just finished dragging
    if (
      isDraggingRef.current ||
      Date.now() - lastDragTimeRef.current < CLICK_IGNORE_MS
    ) {
      return;
    }
    if (onClick) onClick(e);
  };

  // physics biatch
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

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

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
    springConfig
  );

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== 'undefined') {
        setConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
        });
      }
    };

    updateConstraints();

    // Add resize listener
    window.addEventListener('resize', updateConstraints);

    // Clean up
    return () => {
      window.removeEventListener('resize', updateConstraints);
    };
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

  return (
    <motion.div
      ref={cardRef}
      drag
      onClick={handleClick}
      dragConstraints={constraints}
      onDragStart={() => {
        document.body.style.cursor = 'grabbing';
        isDraggingRef.current = true;
        lastDragTimeRef.current = Date.now();
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = 'default';
        lastDragTimeRef.current = Date.now();
        // keep isDragging true for a short moment to avoid click firing
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 50);

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: 'spring',
            ...springConfig,
          },
        });
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(
          currentVelocityX * currentVelocityX +
            currentVelocityY * currentVelocityY
        );
        const bounce = Math.min(0.8, velocityMagnitude / 1000);

        animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: 'spring',
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });

        animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: 'spring',
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });
      }}
      style={{
        ...(style as any), // merge developer-provided inline nudges
        rotateX,
        rotateY,
        opacity,
        willChange: 'transform',
      }}
      animate={controls}
      whileHover={
        isSelected ? { scale: 1.02 } : { scale: 1.02, zIndex: 999999 }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'transform-3d rounded-10 relative min-h-96 w-80 overflow-hidden bg-neutral-100 p-4 shadow-2xl dark:bg-neutral-900',
        className
      )}
    >
      {children}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 select-none bg-white"
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn('[perspective:3000px]', className)}>{children}</div>
  );
};
