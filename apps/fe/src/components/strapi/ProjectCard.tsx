import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { ProjectEntity } from '@/types/strapi';

interface ProjectCardProps {
  project: ProjectEntity;
  className?: string;
  variant?: 'default' | 'featured';
}

function ProjectCard({
  project,
  className = '',
  variant = 'default',
}: ProjectCardProps) {
  const {
    title,
    description,
    slug,
    technologies,
    projectUrl,
    githubUrl,
    images,
    category,
    status,
  } = project.attributes;

  const imageUrl = images?.data?.[0]?.url;
  const categoryName = category?.data?.name;

  const getStatusColor = (statusValue?: string) => {
    switch (statusValue) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <article
      className={clsx(
        'group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:bg-slate-800',
        className
      )}
    >
      <Link href={`/projects/${slug}`} className="block">
        {imageUrl && (
          <div className="aspect-video overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              width={images?.data?.[0]?.width || 800}
              height={images?.data?.[0]?.height || 600}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            {categoryName && (
              <span className="bg-brand-orange/10 text-brand-orange rounded-full px-2 py-1 text-xs font-medium">
                {categoryName}
              </span>
            )}
            {status && (
              <span
                className={clsx(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  getStatusColor(status)
                )}
              >
                {status === 'in-progress'
                  ? 'In Progress'
                  : status === 'completed'
                    ? 'Completed'
                    : status}
              </span>
            )}
          </div>

          <h3 className="text-text-primary group-hover:text-brand-orange dark:group-hover:text-brand-orange mb-2 text-xl font-semibold transition-colors dark:text-gray-100">
            {title}
          </h3>

          <p className="text-text-secondary mb-4 line-clamp-2 dark:text-gray-300">
            {description}
          </p>

          {technologies && technologies.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  +{technologies.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary text-sm hover:underline dark:text-gray-400 dark:hover:text-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProjectCard;
