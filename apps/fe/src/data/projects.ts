import type { Project } from '@/types/project';

export const projects: Project[] = [
  // Featured Projects
  {
    id: 1,
    title: 'HOROLUX',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/horolux.jpg',
    isFeatured: true,
    isLarge: true,
    slug: 'horolux',
  },
  {
    id: 2,
    title: 'BĂNG RỪNG NGẬP MẶN',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/rungngapman.jpg',
    isFeatured: true,
    isLarge: false,
    slug: 'rungngapman',
  },
  // Regular Projects
  {
    id: 3,
    title: 'DECOFI',
    description:
      'Logo, Bộ nhận diện thương hiệu, Profile, Website, Hệ thống chỉ dẫn công trường, Báo cáo thường niên, Thiết kế nhận diện sự kiện',
    image: '/assets/images/featured-projects/decofi.jpg',
    isFeatured: false,
    slug: 'decofi',
  },
  {
    id: 4,
    title: 'HSME',
    description: 'Logo, Bộ nhận diện thương hiệu, Profile, ',
    image: '/assets/images/featured-projects/hsme-catalog.jpg',
    isFeatured: false,
    slug: 'hsme',
  },
  {
    id: 5,
    title: 'MOBIFONE',
    description: 'Thiết kế nhận diện sự kiện, Thiết kế bao bì',
    image: '/assets/images/featured-projects/mobifone.jpg',
    isFeatured: false,
    slug: 'mobifone',
  },
  {
    id: 6,
    title: 'DELAFÉE',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/delafree.jpg',
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
    title: 'MITSUBISHI',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/featured-projects/mitsubishi.jpg',
    isFeatured: false,
    slug: 'mitsubishi',
  },
];

export const featuredProjects = projects.filter(
  (project) => project.isFeatured
);
export const regularProjects = projects.filter(
  (project) => !project.isFeatured
);
