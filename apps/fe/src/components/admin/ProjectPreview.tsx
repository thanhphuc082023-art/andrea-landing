import { Fragment } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { type ProjectFormData } from '@/lib/validations/project';
import ShowcasePreview from './ShowcasePreview';

interface ProjectPreviewProps {
  formData: Partial<ProjectFormData>;
  showcaseSections?: any[];
  isVisible: boolean;
  onToggle: () => void;
}

export default function ProjectPreview({
  formData,
  showcaseSections = [],
  isVisible,
  onToggle,
}: ProjectPreviewProps) {
  const {
    title = 'Tiêu đề dự án',
    description = 'Mô tả dự án sẽ hiển thị ở đây...',
    projectIntroTitle = 'Giới thiệu dự án:',
    projectMetaInfo = [],
    technologies = [],
    credits,
    status = 'draft',
  } = formData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in-progress':
        return 'Đang thực hiện';
      case 'draft':
      default:
        return 'Bản nháp';
    }
  };

  return (
    <div className="fixed right-4 top-20 z-50 max-h-[calc(100vh-6rem)] w-[500px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center space-x-2">
          <EyeIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">Preview</h3>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <EyeSlashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Preview Content - Scrollable */}
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Hero Section - giống ProjectHero */}
        <header className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="relative z-10 flex min-h-[300px] items-center py-8">
            <div className="mx-auto w-full px-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                {/* Left side - Title and Meta Info */}
                <div className="lg:max-w-[250px]">
                  {/* Project Title */}
                  <h1 className="font-playfair text-primary text-2xl font-medium leading-tight max-lg:text-xl max-md:text-lg dark:text-white">
                    {title || 'Tiêu đề dự án'}
                  </h1>

                  {/* Project Meta Info */}
                  <div className="mt-6 text-sm leading-relaxed tracking-wide text-black max-lg:mt-4 dark:text-white">
                    {projectMetaInfo.map((info, index) => (
                      <div key={index} className="mb-1">
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side - Project Description */}
                <div className="mt-4 flex-1 lg:mt-0">
                  <h2 className="mb-3 text-lg font-bold text-gray-800 dark:text-gray-300">
                    {projectIntroTitle}
                  </h2>
                  <div className="text-sm font-normal leading-relaxed tracking-wide text-gray-600 dark:text-gray-400">
                    <p>{description || 'Mô tả dự án sẽ hiển thị ở đây...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Showcase Section - giống ProjectShowcase */}
        <section className="px-6 py-8">
          <div>
            {showcaseSections.length > 0 ? (
              showcaseSections.map((section, index) => (
                <div key={section.id} className="mb-6">
                  <ShowcasePreview sections={[section]} />
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">
                  Chưa có showcase nào được tạo
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Credits Section - giống ProjectCredits */}
        <section className="border-t border-gray-200 px-6 py-8">
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Main Content */}
            <div className="flex flex-col items-center text-center">
              {/* Title */}
              <h2 className="font-playfair text-2xl font-medium leading-tight text-black max-lg:text-xl max-md:text-lg dark:text-white">
                Thanks for watching
              </h2>

              {/* Credits Content */}
              <div className="mt-4 max-w-[300px] text-center text-sm font-normal leading-relaxed text-gray-600 dark:text-gray-400">
                {/* Date */}
                {credits?.date && <div className="mb-3">{credits.date}</div>}

                {/* Credits Section */}
                {credits?.projectManager && (
                  <div className="space-y-1">
                    <div className="font-bold">Credit:</div>
                    <div>Project manager: {credits.projectManager}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Divider */}
            <div className="h-px w-full bg-black/20 dark:bg-white/20" />
          </div>
        </section>

        {/* Technologies Section - nếu có */}
        {technologies.length > 0 && (
          <section className="border-t border-gray-200 px-6 py-8">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Công nghệ sử dụng
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Status Badge */}
        <section className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {getStatusText(status)}
            </span>
          </div>
        </section>
      </div>

      {/* Preview Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <p className="text-center text-xs text-gray-500">
          Preview -{' '}
          {formData.slug ? `/project/${formData.slug}` : '/project/[slug]'}
        </p>
      </div>
    </div>
  );
}
