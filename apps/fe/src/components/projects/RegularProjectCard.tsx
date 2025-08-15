import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectCardProps } from '@/types/project';
import { getStrapiMediaUrl } from '@/utils/helper';

function RegularProjectCard({ project, className }: ProjectCardProps) {
  return (
    <div className={clsx('group relative cursor-pointer', className)}>
      <Link href={`/project/${project.slug}`}>
        {/* Project Image */}
        <div
          className={clsx(
            'group-hover:border-brand-orange rounded-10 relative h-[300px] w-full overflow-hidden border-2 border-transparent transition-all duration-200 max-md:rounded-none max-md:border-none max-md:hover:!border-2'
          )}
        >
          <Image
            src={getStrapiMediaUrl(project?.thumbnail) || ''}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
            loading="lazy"
          />
        </div>

        {/* Project Info */}
        <div className="mt-4 max-md:px-[25px]">
          <h3
            className={clsx('text-text-primary mb-2 text-[22px] font-semibold')}
          >
            {project.title}
          </h3>
          <p
            className={clsx(
              'text-text-secondary line-clamp-2 text-base font-normal tracking-wide'
            )}
          >
            {project.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default RegularProjectCard;

export function RegularProjectCardOld({
  project,
  className,
}: ProjectCardProps) {
  return (
    <div className={clsx('group relative cursor-pointer', className)}>
      <Link href={`/project/${project.slug}`}>
        {/* Project Image */}
        <div
          className={clsx(
            'group-hover:border-brand-orange rounded-10 relative h-[300px] w-full overflow-hidden border-2 border-transparent transition-all duration-200 max-md:rounded-none max-md:border-none max-md:hover:!border-2'
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
        <div className="mt-4 max-md:px-[25px]">
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
      </Link>
    </div>
  );
}
