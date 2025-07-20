import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

function Navbar() {
  const [activeItem, setActiveItem] = useState('Về chúng tôi');

  const navigationItems = [
    { title: 'Về chúng tôi', href: '/about' },
    { title: 'Dịch vụ', href: '/services' },
    { title: 'Dự án', href: '/projects' },
    { title: 'Góc nhìn', href: '/insights' },
    { title: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] w-full">
      <div className="h-20 w-full bg-[#EFEFEF]">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 lg:px-[70px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/88c53e90e43b157e0c7a051f1ccb0507c99e0ee9?width=220"
              alt="Andréa"
              className="h-[41px] w-[110px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex lg:gap-[58px]">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={clsx(
                  'text-lg font-sans transition-colors duration-200',
                  activeItem === item.title
                    ? 'font-bold text-[#EE4823]'
                    : 'font-normal text-black/50 hover:text-black/70'
                )}
                onClick={() => setActiveItem(item.title)}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="flex flex-col gap-1 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="h-0.5 w-6 bg-black/50"></span>
            <span className="h-0.5 w-6 bg-black/50"></span>
            <span className="h-0.5 w-6 bg-black/50"></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Hidden by default, can be toggled */}
      <div className="hidden bg-[#EFEFEF] md:hidden">
        <nav className="flex flex-col gap-4 px-4 py-6">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={clsx(
                'text-lg font-sans transition-colors duration-200',
                activeItem === item.title
                  ? 'font-bold text-[#EE4823]'
                  : 'font-normal text-black/50'
              )}
              onClick={() => setActiveItem(item.title)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
