import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';

import HeaderVideo from '@/contents/index/Header/HeaderVideo';
import ScrollDownButton from '@/components/ScrollDownButton';
import { ProjectData } from '@/types/project';

interface ProjectHeroProps {
  project?: ProjectData | null;
}

function ProjectHero({ project = null }: ProjectHeroProps) {
  const projectTitle = project?.title || 'Dự án';
  const projectCategory = project?.category?.name || 'Thiết kế';
  const projectDescription = project?.description || '';
  const projectMetaInfo = project?.projectMetaInfo || [];
  const projectIntroTitle = project?.projectIntroTitle || 'Giới thiệu dự án:';
  const projectYear = project
    ? new Date(project.createdAt).getFullYear()
    : new Date().getFullYear();
  const projectUrl = project?.projectUrl || '';
  const router = useRouter();

  const mode = router.query.mode;

  return (
    <header
      id="project-header"
      className={clsx('max-sd:mt-[60px] relative mt-[65px] overflow-hidden')}
    >
      {/* Background Video hoặc Banner */}
      {project?.heroVideo?.url ? (
        <HeaderVideo
          mobileAspectRatio="9:16"
          heroData={{
            desktopVideo: project.heroVideo,
            mobileVideo: project.heroVideo,
          }}
        />
      ) : project?.heroBanner?.url ? (
        <div
          className={clsx(
            'header-video-container relative inset-0 z-0 overflow-hidden',
            'max-sd:h-[calc(100vh-60px)] h-[calc(100vh-65px)]'
          )}
        >
          {/* Hero Banner Image */}
          <Image
            src={project.heroBanner.url}
            alt={project.title || 'Hero Banner'}
            fill
            className="relative z-20 object-cover"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 z-10 bg-black/20" />

          {/* Scroll Down Button */}
          {mode !== 'edit' && mode !== 'create' && (
            <ScrollDownButton
              className={clsx(
                'absolute bottom-6 left-1/2 z-30 -translate-x-1/2'
              )}
              text="Kéo xuống"
            />
          )}
        </div>
      ) : null}

      {/* Content */}
      <div
        className={clsx(
          'relative z-10 flex min-h-[511px] items-center py-[50px] max-md:py-[40px]'
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
                  'max-lg:text-4xl max-lg:leading-[1.2] max-md:text-[30px] dark:text-white'
                )}
              >
                {projectTitle}
              </h1>

              {/* Project Meta Info */}
              <div className="mt-[117px] text-xl leading-[35px] tracking-[0.5px] text-black max-lg:mt-8 max-lg:text-lg max-md:mt-[13px] max-md:text-[16px] dark:text-white">
                {projectMetaInfo.map((info, index) => (
                  <div key={index} className="mb-0">
                    <span>{info}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Project Description */}
            <div className="max-w-[642px] max-lg:flex-1">
              <h2 className="mb-4 text-2xl font-bold text-[#484848] max-md:text-[24px] dark:text-gray-300">
                {projectIntroTitle}
              </h2>
              <div
                className={clsx(
                  'text-base font-normal leading-6 tracking-[0.5px] text-[#7D7D7D] max-md:text-[16px] dark:text-gray-400'
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
