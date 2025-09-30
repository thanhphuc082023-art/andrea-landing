import { Tab } from '@headlessui/react';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { type ProjectFormData } from '@/lib/validations/project';
import {
  HeroSection,
  ShowcaseSection,
  CreditsSection,
  ProjectSettingsSection,
  SeoSection,
  useProjectForm,
} from './forms';
import { ContentSection } from './forms/project';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';
import { useState, useEffect } from 'react';

interface ProjectFormPageProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  categories?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
  onLogout?: () => void;
  viewMode?: 'create' | 'preview'; // Thêm viewMode prop
  onViewModeChange?: (
    mode: 'create' | 'preview',
    data?: { formData: Partial<ProjectFormData>; showcaseSections: any[] }
  ) => void; // Callback với data
}

export default function ProjectFormPage({
  onSubmit,
  initialData,
  categories = [],
  isLoading = false,
  onLogout,
  viewMode = 'create',
  onViewModeChange,
}: ProjectFormPageProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State để lưu file objects riêng (vì React Hook Form có thể không preserve chúng)
  const [fileObjects, setFileObjects] = useState<{
    thumbnail?: File;
    heroVideo?: File;
    heroBanner?: File;
    featuredImage?: File;
  }>({});

  // Session cleanup on unmount - disable auto cleanup to preserve data for preview
  const { cleanup } = useSessionCleanup({
    ...sessionCleanupConfigs.projectForm,
    disableAutoCleanup: true,
  });

  const {
    // Form methods
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    errors,

    // Local state
    technologies,
    newTechnology,
    setNewTechnology,
    projectMetaInfo,
    newMetaInfo,
    setNewMetaInfo,
    newKeyword,
    setNewKeyword,
    credits,
    newCredit,
    setNewCredit,
    showcaseSections,
    setShowcaseSections,

    // Actions
    addTechnology,
    removeTechnology,
    addMetaInfo,
    removeMetaInfo,
    addKeyword,
    removeKeyword,
    addCredit,
    removeCredit,
    saveDataForPreview,
    cleanup: formCleanup,
  } = useProjectForm({ initialData, onSubmit });
  const videoLink = watch('videoLink');
  const heroVideo = watch('heroVideo');
  const heroBanner = watch('heroBanner');
  const thumbnail = watch('thumbnail');

  const handleCancel = () => {
    cleanup();
    formCleanup();
    router.push('/');
  };

  const handleBack = () => {
    cleanup();
    formCleanup();
    router.push('/admin/projects');
  };

  const handlePreview = () => {
    // Bỏ saveDataForPreview() vì chúng ta pass data trực tiếp
    if (onViewModeChange) {
      // Lấy form data từ watch() và merge với file objects từ state riêng
      const baseFormData = watch(); // Base form data
      const currentFormData = {
        ...baseFormData,
        // Merge với file objects từ state riêng
        videoLink: videoLink,
        heroVideo: heroVideo
          ? {
              ...heroVideo,
              file: fileObjects.heroVideo || heroVideo.file, // Ưu tiên từ fileObjects state
            }
          : undefined,
        heroBanner: heroBanner
          ? {
              ...heroBanner,
              file: fileObjects.heroBanner || heroBanner.file,
            }
          : undefined,
        thumbnail: thumbnail
          ? {
              ...thumbnail,
              file: fileObjects.thumbnail || thumbnail.file,
            }
          : undefined,
        featuredImage: baseFormData.featuredImage
          ? {
              ...baseFormData.featuredImage,
              file:
                fileObjects.featuredImage || baseFormData.featuredImage.file,
            }
          : undefined,
        gallery: baseFormData.gallery,
      };

      onViewModeChange('preview', {
        formData: currentFormData,
        showcaseSections,
      }); // Truyền data với File objects
    } else {
      // Fallback: navigate như cũ nếu không có callback
      const isEdit = !!initialData;
      const projectId = router.query.id;

      if (isEdit && projectId) {
        router.push(`/admin/projects/preview?mode=edit&id=${projectId}`);
      } else {
        router.push('/admin/projects/preview?mode=create');
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('strapiToken');
      localStorage.removeItem('strapiUser');
      router.push('/admin/projects/create');
    }
  };
  // Enhanced form submission
  const handleEnhancedFormSubmit = async (data: ProjectFormData) => {
    setIsUploading(true);
    try {
      // Submit form data directly
      await onSubmit({ ...data, showcase: showcaseSections });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Fullscreen Loading Overlay */}
      {(isLoading || isUploading) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <svg
            className="text-brand-orange mb-4 h-10 w-10 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <div className="text-brand-orange text-lg font-semibold">
            Đang tải lên, vui lòng chờ...
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="content-wrapper">
          <div className="max-sd:h-[60px] flex h-[65px] items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm sm:inline">Quay lại</span>
              </button>
              <div className="hidden h-6 w-px bg-gray-300 sm:block" />
              <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {initialData ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
              </h1>
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center space-x-3 sm:flex">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                Xem Preview
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSubmit(handleEnhancedFormSubmit)}
              >
                {isLoading || isUploading
                  ? `Đang lưu...`
                  : initialData
                    ? 'Cập nhật'
                    : 'Tạo dự án'}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                aria-expanded={mobileMenuOpen}
                aria-label="Open actions"
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  // Three vertical dots (kebab-vertical) icon for closed state
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile stacked actions */}
          {mobileMenuOpen && (
            <div className="mt-2 flex flex-col space-y-2 pb-2 sm:hidden">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                Xem Preview
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                onClick={handleSubmit(handleEnhancedFormSubmit)}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-left text-sm font-medium text-white shadow-sm disabled:opacity-50"
              >
                {isLoading || isUploading
                  ? 'Đang lưu...'
                  : initialData
                    ? 'Cập nhật'
                    : 'Tạo dự án'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="content-wrapper pb-6">
        <Tab.Group>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <form
                onSubmit={handleSubmit(handleEnhancedFormSubmit)}
                className="space-y-8"
              >
                {/* Hero Section */}
                <HeroSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  projectMetaInfo={projectMetaInfo}
                  newMetaInfo={newMetaInfo}
                  setNewMetaInfo={setNewMetaInfo}
                  addMetaInfo={addMetaInfo}
                  removeMetaInfo={removeMetaInfo}
                  onLogout={handleLogout}
                />

                {/* Content Section */}
                {/* <ContentSection
                  register={register}
                  watch={watch}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                /> */}

                {/* Showcase Section */}
                <ShowcaseSection
                  showcaseSections={showcaseSections}
                  setShowcaseSections={setShowcaseSections}
                  onLogout={handleLogout}
                />

                {/* Credits Section */}
                <CreditsSection
                  register={register}
                  errors={errors}
                  credits={credits}
                  newCredit={newCredit}
                  setNewCredit={setNewCredit}
                  addCredit={addCredit}
                  removeCredit={removeCredit}
                  setValue={setValue}
                  watch={watch}
                />

                {/* Project Settings Section */}
                <ProjectSettingsSection
                  register={register}
                  watch={watch}
                  control={control}
                  errors={errors}
                  technologies={technologies}
                  newTechnology={newTechnology}
                  setNewTechnology={setNewTechnology}
                  addTechnology={addTechnology}
                  removeTechnology={removeTechnology}
                />

                {/* SEO Section */}
                <SeoSection
                  register={register}
                  watch={watch}
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  newKeyword={newKeyword}
                  setNewKeyword={setNewKeyword}
                  addKeyword={addKeyword}
                  removeKeyword={removeKeyword}
                />
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
