import clsx from 'clsx';

import HeaderVideo from '@/contents/index/Header/HeaderVideo';

interface HeaderProps {
  heroData?: any;
}

function Header({ heroData = null }: HeaderProps) {
  return (
    <header
      id="page-header"
      className={clsx('relative overflow-hidden', 'max-sd:mt-[60px] mt-[65px]')}
    >
      <HeaderVideo mobileAspectRatio="9:16" heroData={heroData} />
    </header>
  );
}

export default Header;
