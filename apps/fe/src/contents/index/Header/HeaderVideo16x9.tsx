'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

interface HeaderVideo16x9Props {
  src?: string;
  poster?: string;
  className?: string;
}

export default function HeaderVideo16x9({
  src,
  poster,
  className = '',
}: HeaderVideo16x9Props) {
  const source = src || 'https://andrea.vn/uploads/videos/intro-website_3.mp4';
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !source) return;
    try {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    } catch {}
  }, [source]);

  if (!source) return null;

  return (
    <div className={clsx('relative h-full w-full', className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={source} type="video/mp4" />
      </video>
    </div>
  );
}
