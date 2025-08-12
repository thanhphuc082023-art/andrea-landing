import clsx from 'clsx';

interface ProjectCreditsProps {
  project?: any;
}

function ProjectCredits({ project = null }: ProjectCreditsProps) {
  // Default credits data - can be made dynamic if needed
  const credits = {
    date: '01/07/2025',
    projectManager: 'Mai Xuân Hưng',
    graphicDesigner: 'Mnghi',
    showcase: 'MNghi',
  };

  return (
    <section className={clsx('content-wrapper pt-[82px] max-lg:pt-12')}>
      {/* Content Container */}
      <div className="flex flex-col items-center justify-center gap-[82px] max-lg:gap-12">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <h2
            className={clsx(
              'font-playfair text-[55px] font-medium leading-[80px] text-black dark:text-white',
              'max-lg:text-4xl max-lg:leading-[1.2] max-md:text-3xl'
            )}
          >
            Thanks for watching
          </h2>

          {/* Credits Content */}
          <div
            className={clsx(
              'mt-[26px] max-w-[480px] text-center text-[17px] font-normal leading-7 text-[#979797] dark:text-gray-400',
              'max-lg:mt-6 max-lg:text-base'
            )}
          >
            {/* Date */}
            <div className="mb-4">{credits.date}</div>

            {/* Credits Section */}
            <div className="space-y-1">
              <div className="font-bold">Credit:</div>
              <div>Project manager: {credits.projectManager}</div>
              <div>Graphic Designer: {credits.graphicDesigner}</div>
              <div>Showcase: {credits.showcase}</div>
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className={clsx('h-px w-full bg-black/20 dark:bg-white/20')} />
      </div>
    </section>
  );
}

export default ProjectCredits;
