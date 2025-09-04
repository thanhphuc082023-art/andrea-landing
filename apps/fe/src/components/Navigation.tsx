import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { m, AnimatePresence } from 'framer-motion';
import StrapiLogo from '@/components/StrapiLogo';
import type { NavigationItem, StrapiGlobal } from '@/types/strapi';
import SwapText from '@/components/ui/SwapText';

interface NavbarProps {
  // Optional server-side data for static generation
  serverGlobal?: StrapiGlobal;
  menuItems?: NavigationItem[];
}

function Navbar({ serverGlobal = undefined, menuItems = [] }: NavbarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const defaultNavigationItems = [
    { label: 'Về chúng tôi', url: '/about' },
    { label: 'Dịch vụ', url: '/services' },
    { label: 'E-Profile', url: '/e-profile' },
    { label: 'Dự án', url: '/projects' },
    { label: 'Góc nhìn', url: '/insights' },
    { label: 'Liên hệ', url: '/contact' },
  ];

  // Use server navigation if available, otherwise use client navigation or fallback
  const navigationItems = menuItems.length ? menuItems : defaultNavigationItems;

  // Helper function to check if an item is active
  const isItemActive = (item: NavigationItem) => {
    const rawPath = router.asPath || '';
    // path without hash for most comparisons
    const currentPath = rawPath.split('#')[0];
    if (!item.url) return false;

    // Exact match for homepage
    if (item.url === '/') return currentPath === '/';

    // Special case for E-Profile - also match /upload/e-profile
    if (item.url === '/e-profile') {
      return (
        currentPath.startsWith('/e-profile') ||
        currentPath.startsWith('/upload/e-profile')
      );
    }

    // Special case for Projects - match both /projects and /project/[slug]
    if (item.url === '/projects') {
      return currentPath === '/projects' || currentPath.startsWith('/project/');
    }

    // Special case for Services - treat as active when on a /services route
    // OR when the raw URL contains the #services anchor.
    if (item.url === '/services' || item.url === '/#services') {
      return (
        currentPath.startsWith('/service') || rawPath.includes('#services')
      );
    }

    // Default: compare path-only prefix matches
    return currentPath.startsWith(item.url);
  };

  // Prefetch navigation routes for faster navigation (modern approach)
  useEffect(() => {
    const prefetchNavigationRoutes = () => {
      navigationItems.forEach((item) => {
        if (item.url && item.url !== router.asPath) {
          // Prefetch all navigation routes including homepage
          router.prefetch(item.url).catch((error) => {
            // Silently handle errors to avoid console spam
            console.debug(`Prefetch skipped for ${item.url}:`, error.message);
          });
        }
      });
    };

    // Prefetch after initial page load to avoid blocking
    const timer = setTimeout(prefetchNavigationRoutes, 1500);
    return () => clearTimeout(timer);
  }, [navigationItems, router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClick = (title: string) => {
    setIsMobileMenuOpen(false); // Đóng menu sau khi click
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] w-full">
      <div className="max-sd:h-[60px] h-[65px] w-full bg-white shadow-md">
        <div className="content-wrapper flex h-full items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0"
            aria-label="Andrea - Trang chủ"
          >
            <StrapiLogo
              width={110}
              height={41}
              className="max-sd:w-[84px] max-sd:h-[31px] h-[41px] w-[110px]"
              fallbackToDefault
              serverGlobal={serverGlobal}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex lg:space-x-[58px]">
            {navigationItems.map((item) => {
              const href = item.url || '/';

              return (
                <Link key={item.label} href={href}>
                  <SwapText
                    finalText={item.label}
                    initialText={item.label}
                    supportsHover
                    textClassName={clsx(
                      'text-lg transition-colors duration-200 cursor-pointer',
                      isItemActive(item)
                        ? 'text-brand-orange hover:text-brand-orange-dark !font-semibold'
                        : 'hover:text-brand-orange font-normal text-gray-700'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="relative flex h-8 w-8 cursor-pointer flex-col justify-center md:hidden"
            onClick={toggleMobileMenu}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
              }
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <m.span
              className="bg-brand-orange absolute top-1/2 h-1 w-full origin-center -translate-x-1/2 rounded"
              animate={
                isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -10 }
              }
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <m.span
              className="bg-brand-orange absolute top-1/2 h-1 w-full origin-center -translate-x-1/2 rounded"
              animate={
                isMobileMenuOpen
                  ? { opacity: 0, scale: 0 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            />
            <m.span
              className="bg-brand-orange absolute top-1/2 h-1 w-full origin-center -translate-x-1/2 rounded"
              animate={
                isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 10 }
              }
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full screen slide from left */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.2 },
            }}
            className="max-sd:top-[60px] fixed inset-0 top-[60px] z-[999] bg-[#EFEFEF] md:hidden lg:top-20"
            id="mobile-navigation"
          >
            <nav className="flex h-full flex-col gap-6 px-6 py-8">
              {navigationItems.map((item, index) => {
                const href = item.url || '/';
                return (
                  <m.div
                    key={item.label}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.1 + index * 0.1,
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Link
                      href={href}
                      onClick={() => handleMobileMenuClick(item.label)}
                    >
                      <SwapText
                        finalText={item.label}
                        initialText={item.label}
                        supportsHover
                        className="my-4"
                        textClassName={clsx(
                          'block border-b border-gray-200/50  text-xl transition-colors duration-300',
                          'hover:border-brand-orange/30',
                          isItemActive(item)
                            ? 'text-brand-orange border-brand-orange/30 translate-x-1 font-semibold'
                            : 'hover:text-brand-orange font-normal text-gray-700'
                        )}
                      />
                    </Link>
                  </m.div>
                );
              })}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
