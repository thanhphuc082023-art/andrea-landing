'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import HeaderMotion with SSR disabled
const HeaderMotion = dynamic(() => import('./HeaderMotion'), {
  ssr: false,
  loading: () => (
    <div className="max-sd:h-[calc(100vh+60px)] flex h-[calc(100vh+65px)]" />
  ),
});

interface Props {
  heroData?: any;
}

export default function HeaderMotionWrapper({ heroData }: Props) {
  return <HeaderMotion heroData={heroData} />;
}
