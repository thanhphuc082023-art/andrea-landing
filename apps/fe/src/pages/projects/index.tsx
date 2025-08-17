import { GetStaticProps } from 'next';
import { HeroParallax } from '@/components/ui/HeroParallax';
import Head from 'next/head';
import React from 'react';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getStrapiMediaUrl } from '@/utils/helper';

interface Project {
  id: number;
  title: string;
  description: string;
  slug: string;
  status: string;
  featured: boolean;
  thumbnail?: {
    url: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsPageProps extends PagePropsWithGlobal {
  projects: Project[];
  error?: string;
}

export default function ProjectsList({ projects, error }: ProjectsPageProps) {
  // Đảm bảo có đủ items cho layout (tối thiểu 12 items cho 4 rows x 3 items)
  const MIN_ITEMS = 12;
  let allProjects = [...projects];

  // Duplicate projects nếu không đủ items
  while (allProjects.length < MIN_ITEMS && projects.length > 0) {
    const remaining = MIN_ITEMS - allProjects.length;
    const duplicateCount = Math.min(remaining, projects.length);
    allProjects = [...allProjects, ...projects.slice(0, duplicateCount)];
  }

  // Chuyển đổi format dữ liệu từ projects để phù hợp với HeroParallax
  const products = allProjects.map((project, index) => ({
    title: project.title,
    description: project.description,
    link: `/project/${project.slug}`,
    thumbnail:
      getStrapiMediaUrl(project.thumbnail) ||
      '/assets/images/projects/project-sample.jpg',
    // Thêm unique key để tránh duplicate key warning
    key: `${project.id}-${index}`,
  }));

  if (error) {
    return (
      <>
        <Head>
          <title>Lỗi - Danh Sách Dự Án</title>
          <meta
            name="description"
            content="Có lỗi xảy ra khi tải danh sách dự án"
          />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="mt-[65px] flex min-h-screen items-center justify-center bg-gray-50 max-md:mt-[60px]">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Lỗi</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

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

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  return getStaticPropsWithGlobalAndData(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?populate=*&sort=createdAt:desc`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const projects: Project[] = data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        slug: item.slug,
        status: item.projectStatus,
        featured: item.featured,
        thumbnail: item.thumbnail,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      return {
        projects: projects,
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return {
        projects: [],
        error: 'Không thể tải danh sách dự án. Vui lòng thử lại sau.',
      };
    }
  });
};
