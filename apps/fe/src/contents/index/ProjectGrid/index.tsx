import clsx from 'clsx';
import Image from 'next/image';

import SubmitButton from '@/components/SubmitButton';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  isLarge?: boolean; // For the large featured project layout
}

const projects: Project[] = [
  // Featured Projects
  {
    id: 1,
    title: 'MITSUBISHI',
    description: 'Profile, Quay phim chụp hình',
    image: '/assets/images/featured-projects/mitsubishi-project.jpg',
    isFeatured: true,
    isLarge: true,
  },
  {
    id: 2,
    title: 'MOBIFONE',
    description: 'Profile, Catalogue, Thiết kế nhận diện sự kiện',
    image: '/assets/images/featured-projects/mobifone-project.jpg',
    isFeatured: true,
    isLarge: false,
  },
  // Regular Projects
  {
    id: 3,
    title: 'DECOFI',
    description:
      'Logo, Bộ nhận diện thương hiệu, Profile, Website, Hệ thống chỉ dẫn công trường, Báo cáo thường niên, Thiết kế nhận diện sự kiện',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
  },
  {
    id: 4,
    title: 'HSME',
    description: 'Logo, Bộ nhận diện thương hiệu, Profile, ',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
  },
  {
    id: 5,
    title: 'BĂNG RỪNG NGẬP MẶN',
    description: 'Thiết kế nhận diện sự kiện, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
  },
  {
    id: 6,
    title: 'DELAFÉE',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
  },
  {
    id: 7,
    title: 'LEN SÔNG QUÁN',
    description: 'Logo, Bộ nhận diện thương hiệu, Social branding',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
  },
  {
    id: 8,
    title: 'HUROLUX',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
    isFeatured: false,
  },
];

function FeaturedProjectCard({ project }: { project: Project }) {
  if (project.isLarge) {
    return (
      <div className={clsx('lg:col-span-7')}>
        <div className={clsx('group relative cursor-pointer')}>
          {/* Main Image */}
          <div
            className={clsx(
              'group-hover:border-brand-orange relative h-[400px] w-full overflow-hidden rounded-2xl border-2 border-transparent transition-all duration-200 lg:h-[600px]'
            )}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              quality={85}
              priority={true}
            />
          </div>

          {/* Project Info */}
          <div className={clsx('mt-4')}>
            <h3
              className={clsx(
                'text-text-primary mb-2 text-[22px] font-semibold lg:text-[22px]'
              )}
            >
              {project.title}
            </h3>
            <p
              className={clsx(
                'text-text-secondary text-base font-normal tracking-wide'
              )}
            >
              {project.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('lg:col-span-5')}>
      <div className={clsx('group relative cursor-pointer')}>
        {/* Featured Image */}
        <div
          className={clsx(
            'group-hover:border-brand-orange relative h-[300px] w-full overflow-hidden rounded-2xl border-2 border-transparent transition-all duration-200 lg:h-[300px]'
          )}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
            quality={85}
            loading="eager"
          />
        </div>

        {/* Project Info */}
        <div className={clsx('mt-4 lg:mt-6')}>
          <h3
            className={clsx('text-text-primary mb-2 text-[22px] font-semibold')}
          >
            {project.title}
          </h3>
          <p
            className={clsx(
              'text-text-secondary text-base font-normal tracking-wide'
            )}
          >
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function RegularProjectCard({ project }: { project: Project }) {
  return (
    <div className={clsx('group relative cursor-pointer')}>
      {/* Project Image */}
      <div
        className={clsx(
          'group-hover:border-brand-orange relative mb-4 h-[300px] w-full overflow-hidden rounded-2xl border-2 border-transparent transition-all duration-200'
        )}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
          loading="lazy"
        />
      </div>

      {/* Project Info */}
      <div>
        <h3
          className={clsx('text-text-primary mb-2 text-[22px] font-semibold')}
        >
          {project.title}
        </h3>
        <p
          className={clsx(
            'text-text-secondary text-base font-normal tracking-wide'
          )}
        >
          {project.description}
        </p>
      </div>
    </div>
  );
}

function ProjectGrid() {
  const featuredProjects = projects.filter((project) => project.isFeatured);
  const regularProjects = projects.filter((project) => !project.isFeatured);

  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Featured Projects Section */}
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[42px] font-medium max-md:text-[35px]'
            )}
          >
            Dự án tiêu biểu
          </h2>
        </div>

        {/* Featured Projects Grid */}
        <div
          className={clsx(
            'mb-[75px] grid grid-cols-1 gap-x-5 gap-y-10 max-md:gap-y-[60px] lg:grid-cols-12'
          )}
        >
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Regular Projects Grid - 3 columns, 2 rows */}
        <div
          className={clsx(
            'grid grid-cols-1 gap-x-5 gap-y-10 max-md:gap-y-[60px] md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {regularProjects.map((project) => (
            <RegularProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* See More Button */}
        <div className={clsx('mt-9 text-center')}>
          <SubmitButton
            textColor="text-brand-orange"
            borderColor="border-brand-orange"
            beforeBgColor="before:bg-brand-orange"
            hoverBgColor="hover:bg-brand-orange"
            hoverTextColor="hover:text-white"
            focusRingColor="focus:ring-brand-orange"
            focusRingOffsetColor="focus:ring-offset-brand-orange-dark"
          >
            Xem thêm
          </SubmitButton>
        </div>
      </div>
    </section>
  );
}

export default ProjectGrid;
