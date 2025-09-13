import clsx from 'clsx';
import SubmitButton from '@/components/SubmitButton';
import {
  FeaturedProjectCardOld,
  RegularProjectCardOld,
} from '@/components/projects';
import { featuredProjects, regularProjects } from '@/data/projects';

function ProjectGrid() {
  return (
    <section>
      <div className={clsx('content-wrapper mx-auto max-md:!px-0')}>
        {/* Featured Projects Section */}
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[42px] font-medium max-md:px-[25px] max-md:text-[35px]'
            )}
          >
            Dự án tiêu biểu
          </h2>
        </div>

        {/* Featured Projects Grid */}
        <div
          className={clsx(
            'mb-[75px] grid grid-cols-1 gap-x-[15px] gap-y-10 max-md:mb-[50px] max-md:gap-y-[50px] lg:grid-cols-12'
          )}
        >
          {featuredProjects.map((project) => (
            <FeaturedProjectCardOld key={project.id} project={project} />
          ))}
        </div>

        {/* Regular Projects Grid - 3 columns, 2 rows */}
        <div
          className={clsx(
            'grid grid-cols-1 gap-x-[15px] gap-y-10 max-md:gap-y-[50px] md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {regularProjects.map((project) => (
            <RegularProjectCardOld key={project.id} project={project} />
          ))}
        </div>

        {/* See More Button */}
        <div className={clsx('mt-9 text-center')}>
          <SubmitButton
            textColor="text-brand-orange"
            borderColor="border-brand-orange"
            beforeBgColor="before:bg-brand-orange"
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
