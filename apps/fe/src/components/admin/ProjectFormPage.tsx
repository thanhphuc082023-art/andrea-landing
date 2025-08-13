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
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';
import { useState } from 'react';

interface ProjectFormPageProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  categories?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
  uploadProgress?: number;
  onLogout?: () => void;
}

export default function ProjectFormPage({
  onSubmit,
  initialData,
  categories = [],
  isLoading = false,
  uploadProgress: externalUploadProgress,
  onLogout,
}: ProjectFormPageProps) {
  const router = useRouter();
  const [internalUploadProgress, setInternalUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Use external upload progress if provided, otherwise use internal
  const uploadProgress = externalUploadProgress ?? internalUploadProgress;

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
    handleFormSubmit,
    resetForm,
    saveDataForPreview,
    cleanup: formCleanup,
  } = useProjectForm({ initialData, onSubmit });

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
    saveDataForPreview();
    const isEdit = !!initialData;
    const projectId = router.query.id;

    if (isEdit && projectId) {
      router.push(`/admin/projects/preview?mode=edit&id=${projectId}`);
    } else {
      router.push('/admin/projects/preview?mode=create');
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
    setInternalUploadProgress(0);
    console.log('handleEnhancedFormSubmit', data);
    try {
      // Submit form data directly
      await onSubmit({ ...data, showcase: showcaseSections });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsUploading(false);
      setInternalUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="content-wrapper">
          <div className="flex min-h-16 items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
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
                disabled={isLoading || isUploading || uploadProgress > 0}
                className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleSubmit(handleEnhancedFormSubmit)}
              >
                {isLoading || isUploading || uploadProgress > 0
                  ? `Đang ${uploadProgress > 0 ? 'upload...' : isUploading ? 'upload...' : 'lưu...'}`
                  : initialData
                    ? 'Cập nhật'
                    : 'Tạo dự án'}
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {(isUploading || uploadProgress > 0) && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tiến trình upload</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
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
