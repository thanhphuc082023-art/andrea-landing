import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';

import HeaderVideo from '@/contents/index/Header/HeaderVideo';

interface ProjectHeroProps {
  heroData?: any;
  project?: any;
}

function ProjectHero({ heroData = null, project = null }: ProjectHeroProps) {
  const projectTitle = project?.title || 'Dự án';
  const projectCategory = project?.category?.name || 'Thiết kế';
  const projectDescription = project?.description || '';
  const projectMetaInfo = project?.projectMetaInfo || [];
  const projectIntroTitle = project?.projectIntroTitle || 'Giới thiệu dự án:';
  const projectYear = project?.year || new Date().getFullYear();
  const projectUrl = project?.projectUrl || '';

  const router = useRouter();

  const mode = router.query.mode;

  return (
    <header
      id="project-header"
      className={clsx(
        'relative overflow-hidden',
        mode === 'edit' || mode === 'create' ? '' : 'max-sd:mt-[60px] mt-[65px]'
      )}
    >
      {/* Background Video - giống homepage */}
      <HeaderVideo heroData={heroData} />

      {/* Content */}
      <div
        className={clsx(
          'relative z-10 flex min-h-[511px] items-center py-[75px]'
        )}
      >
        <div className={clsx('content-wrapper')}>
          <div
            className={clsx(
              'flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-[120px]',
              'max-lg:gap-8'
            )}
          >
            {/* Left side - Title and Meta Info */}
            <div className={clsx('lg:max-w-[508px]')}>
              {/* Project Title */}
              <h1
                className={clsx(
                  'font-playfair text-primary text-[50px] font-medium leading-[80px]',
                  'max-lg:text-4xl max-lg:leading-[1.2] max-md:text-3xl dark:text-white'
                )}
              >
                {projectTitle}
              </h1>

              {/* Project Meta Info */}
              <div className="mt-[117px] text-xl leading-[35px] tracking-[0.5px] text-black max-lg:mt-8 max-lg:text-lg dark:text-white">
                {projectMetaInfo.map((info, index) => (
                  <div key={index} className="mb-0">
                    <span>{info}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Project Description */}
            <div className="max-w-[642px] max-lg:flex-1">
              <h2 className="mb-4 text-2xl font-bold text-[#484848] dark:text-gray-300">
                {projectIntroTitle}
              </h2>
              <div
                className={clsx(
                  'text-base font-normal leading-6 tracking-[0.5px] text-[#7D7D7D] dark:text-gray-400'
                )}
              >
                <p>{projectDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ProjectHero;
