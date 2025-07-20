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
    setShowButton(isScrolled);
  }, [isScrolled]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Portal selector="#scroll-to-top">
      <m.button
        className={clsx('fixed right-0 top-1/2 z-[1000] -translate-y-1/2')}
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
            'flex flex-col items-center rounded-l-lg bg-purple-500 px-2 py-3 pt-2 text-white shadow-lg max-md:p-2'
          )}
        >
          <ArrowUpIcon className="h-5 w-5 translate-x-[2px] transform" />
          <p
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            className="hidden text-xs font-medium tracking-wider md:block"
          >
            Scroll to top
          </p>
        </div>
      </m.button>
    </Portal>
  );
}

export default ScrollToTopButton;
