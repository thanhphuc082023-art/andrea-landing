import clsx from 'clsx';

import HeaderMotionWrapper from '@/contents/index/Header/HeaderMotionWrapper';

interface HeaderProps {
  heroData?: any;
}

function Header({ heroData = null }: HeaderProps) {
  return (
    <header id="page-header" className={clsx('relative')}>
      {/* <HeaderVideo heroData={heroData} /> */}
      <HeaderMotionWrapper heroData={heroData} />
    </header>
  );
}

export default Header;
