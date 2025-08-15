'use client';
import { HeroParallax } from '@/components/ui/HeroParallax';
import { projects } from '@/data/projects';
import React from 'react';

export default function HeroParallaxDemo() {
  // Chuyển đổi format dữ liệu từ projects để phù hợp với HeroParallax
  const products = projects.map((project) => ({
    title: project.title,
    description: project.description,
    link: `/project/${project.slug}`,
    thumbnail: project.image,
  }));

  return <HeroParallax products={products} />;
}
