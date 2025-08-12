import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectCardProps } from '@/types/project';

function FeaturedProjectCard({ project, className }: ProjectCardProps) {
  if (project.isLarge) {
    return (
      <div className={clsx('lg:col-span-7', className)}>
        <Link href={`/project/${project.slug}`}>
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
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx('lg:col-span-5', className)}>
      <Link href={`/project/${project.slug}`}>
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
              className={clsx(
                'text-text-primary mb-2 text-[22px] font-semibold'
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
      </Link>
    </div>
  );
}

export default FeaturedProjectCard;
