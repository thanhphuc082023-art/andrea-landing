import clsx from 'clsx';
import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import { ArrowUpIcon } from '@/components/Icons';
import Portal from '@/components/Portal';

import useOnScroll from '@/hooks/useOnScroll';

function ScrollToTopButton() {
  const isScrolled = useOnScroll(300); // Show when scrolled down 300px
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(!!isScrolled);
  }, [isScrolled]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Portal selector="#scroll-to-top">
      <m.button
        className={clsx('fixed bottom-4 right-4 z-[1000] -translate-y-1/2')}
        initial={{ opacity: 0, x: 100 }}
        animate={
          showButton
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: 100, pointerEvents: 'none' }
        }
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
        onClick={handleScrollToTop}
      >
        <div
          className={clsx(
            'bg-brand-orange/30 flex flex-col items-center justify-center rounded-md p-2 text-white shadow-lg backdrop-blur-sm'
          )}
        >
          <ArrowUpIcon className="h-6 w-6" />
        </div>
      </m.button>
    </Portal>
  );
}

export default ScrollToTopButton;
