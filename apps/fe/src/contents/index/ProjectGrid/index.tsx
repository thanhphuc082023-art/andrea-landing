import clsx from 'clsx';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'DECOFI',
    description:
      'Logo, Bộ nhận diện thương hiệu, Profile, Website, Hệ thống chỉ dẫn công trường, Báo cáo thường niên, Thiết kế nhận diện sự kiện',
    image: '/assets/images/projects/project-sample.jpg',
  },
  {
    id: 2,
    title: 'HSME',
    description: 'Logo, Bộ nhận diện thương hiệu, Profile, ',
    image: '/assets/images/projects/project-sample.jpg',
  },
  {
    id: 3,
    title: 'BĂNG RỪNG NGẬP MẶN',
    description: 'Thiết kế nhận diện sự kiện, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
  },
  {
    id: 4,
    title: 'DELAFÉE',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
  },
  {
    id: 5,
    title: 'LEN SÔNG QUÁN',
    description: 'Logo, Bộ nhận diện thương hiệu, Social branding',
    image: '/assets/images/projects/project-sample.jpg',
  },
  {
    id: 6,
    title: 'HUROLUX',
    description:
      'Logo, Bộ nhận diện thương hiệu, Social branding, Thiết kế bao bì',
    image: '/assets/images/projects/project-sample.jpg',
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className={clsx('group cursor-pointer')}>
      {/* Project Image */}
      <div
        className={clsx(
          'relative mb-6 h-[300px] w-full overflow-hidden rounded-2xl'
        )}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
        />
      </div>

      {/* Project Info */}
      <div>
        <h3
          className={clsx(
            'text-text-primary mb-2 text-2xl font-normal lg:text-3xl'
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
  );
}

function ProjectGrid() {
  return (
    <section>
      <div className={clsx('content-wrapper mx-auto')}>
        {/* Projects Grid - 3 columns, 2 rows */}
        <div
          className={clsx(
            'grid grid-cols-1 gap-x-5 gap-y-10 max-md:gap-y-[60px] md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectGrid;
