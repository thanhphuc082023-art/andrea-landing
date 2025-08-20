'use client';
import { HeroParallax } from '@/components/ui/HeroParallaxAutomation';
import { projects } from '@/data/projects';
import Head from 'next/head';
import React from 'react';

export default function ProjectsList() {
  // Chuyển đổi format dữ liệu từ projects để phù hợp với HeroParallax
  const products = projects.map((project) => ({
    title: project.title,
    description: project.description,
    link: `/project/${project.slug}`,
    thumbnail: project.image,
  }));

  return (
    <>
      <Head>
        <title>Danh Sách Dự Án - Studio Thiết Kế Sáng Tạo</title>
        <meta
          name="description"
          content="Xem toàn bộ danh sách các dự án thiết kế sáng tạo của chúng tôi - từ nhận diện thương hiệu độc đáo đến website chuyên nghiệp và các sản phẩm thiết kế ấn tượng."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Danh Sách Dự Án - Studio Thiết Kế Sáng Tạo"
        />
        <meta
          property="og:description"
          content="Xem toàn bộ danh sách các dự án thiết kế sáng tạo của chúng tôi - từ nhận diện thương hiệu độc đáo đến website chuyên nghiệp và các sản phẩm thiết kế ấn tượng."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Danh Sách Dự Án - Studio Thiết Kế Sáng Tạo"
        />
        <meta
          name="twitter:description"
          content="Xem toàn bộ danh sách các dự án thiết kế sáng tạo của chúng tôi - từ nhận diện thương hiệu độc đáo đến website chuyên nghiệp và các sản phẩm thiết kế ấn tượng."
        />
      </Head>
      <HeroParallax products={products} />
    </>
  );
}
