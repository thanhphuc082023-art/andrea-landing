import clsx from 'clsx';
import { RegularProjectCard } from '@/components/projects';
import SubmitButton from '@/components/SubmitButton';
import { useRouter } from 'next/router';

interface NextProjectsProps {
  projects?: any[];
}

function NextProjects({ projects = [] }: NextProjectsProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <section className={clsx('content-wrapper mx-auto max-md:!px-0')}>
        <div className={clsx('mb-6')}>
          <h2
            className={clsx(
              'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:text-[35px]'
            )}
          >
            Dự án tiếp theo
          </h2>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-600">Không có dự án nào</p>
        </div>
      </section>
    );
  }

  return (
    <section className={clsx('content-wrapper mx-auto max-md:!px-0')}>
      {/* Title */}
      <div className={clsx('mb-6')}>
        <h2
          className={clsx(
            'font-playfair text-brand-orange max-sd:text-[40px] text-[50px] font-medium max-md:px-[25px] max-md:text-[35px]'
          )}
        >
          Dự án tiếp theo
        </h2>
      </div>

      {/* Regular Projects Grid - 3 columns, 2 rows */}
      <div
        className={clsx(
          'grid grid-cols-1 gap-x-[15px] gap-y-10 max-md:gap-y-[50px] md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {projects.map((project) => (
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
          onClick={() => router.push('/projects')}
        >
          Xem thêm
        </SubmitButton>
      </div>
    </section>
  );
}

export default NextProjects;
