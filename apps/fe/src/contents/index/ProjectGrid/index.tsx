import clsx from 'clsx';
import SubmitButton from '@/components/SubmitButton';
import { FeaturedProjectCard, RegularProjectCard } from '@/components/projects';
import { useRouter } from 'next/router';

interface ProjectGridProps {
  featuredProjectsData?: {
    title?: string;
    projects?: any[];
  };
}

function ProjectGrid({ featuredProjectsData }: ProjectGridProps) {
  const router = useRouter();
  const featuredTitle = featuredProjectsData?.title || 'Dự án tiêu biểu';
  const allProjects = featuredProjectsData?.projects || [];
  const featuredProjects = allProjects.slice(0, 2).map((project, index) => ({
    ...project?.projectItem?.project,
    isLarge: index === 0, // First item is large
  }));

  const regularProjects = allProjects
    .slice(2)
    ?.map((item) => item?.projectItem?.project);
  console.log('regularProjects', regularProjects);
  return (
    <section>
      <div className={clsx('content-wrapper mx-auto max-md:!px-0')}>
        {/* Featured Projects Section - Only show if we have featured projects */}
        {featuredProjects.length > 0 && (
          <>
            <div className={clsx('mb-6')}>
              <h2
                className={clsx(
                  'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:px-[25px] max-md:text-[35px]'
                )}
              >
                {featuredTitle}
              </h2>
            </div>

            {/* Featured Projects Grid */}
            <div
              className={clsx(
                'mb-[50px] grid grid-cols-1 gap-x-[15px] gap-y-10 max-md:gap-y-[50px] lg:grid-cols-12'
              )}
            >
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}

        {/* Regular Projects Grid - Show remaining projects */}
        {regularProjects.length > 0 && (
          <div
            className={clsx(
              'grid grid-cols-1 gap-x-[15px] gap-y-10 max-md:gap-y-[50px] md:grid-cols-2 lg:grid-cols-3'
            )}
          >
            {regularProjects.map((project) => (
              <RegularProjectCard key={project?.id} project={project} />
            ))}
          </div>
        )}

        <div className={clsx('mt-9 text-center')}>
          <SubmitButton
            onClick={() => router.push('/projects')}
            textColor="text-brand-orange"
            borderColor="border-brand-orange"
            beforeBgColor="before:bg-brand-orange"
            hoverBgColor="hover:before:bg-brand-orange"
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
