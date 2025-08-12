import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { ProjectCardProps } from '@/types/project';

function RegularProjectCard({ project, className }: ProjectCardProps) {
  return (
    <div className={clsx('group relative cursor-pointer', className)}>
      <Link href={`/project/${project.slug}`}>
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
      </Link>
    </div>
  );
}

export default RegularProjectCard;
