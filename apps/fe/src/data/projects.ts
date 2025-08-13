import type { Project } from '@/types/project';

export const projects: Project[] = [
  // Featured Projects
  {
    id: 1,
    title: 'BĂNG RỪNG NGẬP MẶN',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/rungngapman.jpg',
    isFeatured: true,
    isLarge: true,
    slug: 'rungngapman',
  },
  {
    id: 2,
    title: 'DECOFI',
    description:
      'Logo, Bộ nhận diện thương hiệu, Profile, Website, Hệ thống chỉ dẫn công trường, Báo cáo thường niên, Thiết kế nhận diện sự kiện',
    image: '/assets/images/featured-projects/decofi-catalog.jpg',
    isFeatured: true,
    slug: 'decofi',
  },

  // Regular Projects
  {
    id: 3,
    title: 'MOBIFONE',
    description: 'Thiết kế nhận diện sự kiện, Thiết kế bao bì',
    image: '/assets/images/featured-projects/mobifone.jpg',
    isFeatured: false,
    slug: 'mobifone',
  },
  {
    id: 4,
    title: 'MITSUBISHI',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/mitsubishi.jpg',
    isFeatured: false,
    slug: 'mitsubishi',
  },
  {
    id: 5,
    title: 'HSME',
    description: 'Logo, Bộ nhận diện thương hiệu, Profile, ',
    image: '/assets/images/featured-projects/hsme-catalog.jpg',
    isFeatured: false,
    slug: 'hsme',
  },

  {
    id: 6,
    title: 'DELAFÉE',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/delafee.jpg',
    isFeatured: false,
    slug: 'delafee',
  },
  {
    id: 7,
    title: 'LEN SÔNG QUÁN',
    description: 'Logo, Bộ nhận diện thương hiệu, Social branding',
    image: '/assets/images/featured-projects/lensong.jpg',
    isFeatured: false,
    slug: 'len-song-quan',
  },
  {
    id: 8,
    title: 'HOROLUX',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/horolux.jpg',
    isFeatured: false,
    slug: 'horolux',
  },
  {
    id: 9,
    title: 'HUDECO',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
    slug: 'hudeco',
  },
  {
    id: 10,
    title: 'HDCS',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
    slug: 'hdcs',
  },
  {
    id: 11,
    title: 'CUDOHA',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
    slug: 'cudoha',
  },
];

export const featuredProjects = projects.filter(
  (project) => project.isFeatured
);
export const regularProjects = projects.filter(
  (project) => !project.isFeatured
);
