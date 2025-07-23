import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import StrapiLogo from '@/components/StrapiLogo';
import { getMenuSettings } from '@/lib/strapi-server';
import type { NavigationItem, StrapiGlobal } from '@/types/strapi';
import { GetStaticProps } from 'next';

interface NavbarProps {
  // Optional server-side data for static generation
  serverGlobal?: StrapiGlobal;
  menuItems?: NavigationItem[];
}

function Navbar({ serverGlobal = null, menuItems = [] }: NavbarProps) {
  const [activeItem, setActiveItem] = useState('Về chúng tôi');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const defaultNavigationItems = [
    { label: 'Về chúng tôi', url: '/about' },
    { label: 'Dịch vụ', url: '/services' },
    { label: 'Dự án', url: '/projects' },
    { label: 'Góc nhìn', url: '/insights' },
    { label: 'Liên hệ', url: '/contact' },
  ];

  // Use server navigation if available, otherwise use client navigation or fallback
  const navigationItems = menuItems.length ? menuItems : defaultNavigationItems;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClick = (title: string) => {
    setActiveItem(title);
    setIsMobileMenuOpen(false); // Đóng menu sau khi click
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] w-full">
      <div className="max-sd:h-[60px] h-20 w-full bg-[#F5F5F5]">
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
          <nav className="hidden items-center gap-8 md:flex lg:gap-[58px]">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.url || '/'}
                className={clsx(
                  'text-lg transition-colors duration-200',
                  activeItem === item.label
                    ? 'text-brand-orange hover:text-brand-orange-dark font-bold' // Now uses WCAG AA compliant colors
                    : 'font-normal text-gray-700 hover:text-gray-900'
                )}
                onClick={() => setActiveItem(item.label)}
              >
                {item.label}
              </Link>
            ))}
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
              {navigationItems.map((item, index) => (
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
                    href={item.url || '/'}
                    className={clsx(
                      'block border-b border-gray-200/50 py-4 text-xl transition-all duration-300',
                      'hover:border-brand-orange/30 hover:translate-x-2',
                      activeItem === item.label
                        ? 'text-brand-orange translate-x-1 font-bold' // Now uses WCAG AA compliant color
                        : 'font-normal text-gray-700 hover:text-gray-900'
                    )}
                    onClick={() => handleMobileMenuClick(item.label)}
                  >
                    {item.label}
                  </Link>
                </m.div>
              ))}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { menu, error } = await getMenuSettings();

    return {
      props: {
        menuItems: menu?.attributes?.items || [],
      },
      revalidate: 3600, // ISR 1 hour
    };
  } catch (error) {
    return {
      props: {
        menuItems: [],
      },
      revalidate: 3600,
    };
  }
};

export default Navbar;
