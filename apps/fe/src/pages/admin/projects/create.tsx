import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectFormPage from '@/components/admin/ProjectFormPage';
import ProjectPreviewContent from '@/components/admin/ProjectPreviewContent';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import AuthLayout from '@/components/auth/AuthLayout';
import { type ProjectFormData } from '@/lib/validations/project';
import { uploadProjectMedia } from '@/utils/project-media-upload';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

// Component Preview Wrapper để hiển thị preview
const ProjectPreviewWrapper = ({
  onBack,
  onSubmit,
  isLoading,
  formData,
  showcaseSections,
}: {
  onBack: () => void;
  onSubmit: (data: ProjectFormData) => void; // Nhận callback với data
  isLoading: boolean;
  formData?: Partial<ProjectFormData> | null; // Nhận data trực tiếp
  showcaseSections?: any[]; // Nhận showcase sections trực tiếp
}) => {
  // Không cần state nữa vì data được pass từ bên ngoài

  console.log('📋 ProjectPreviewWrapper received data:');
  console.log('formData thumbnail:', {
    name: formData?.thumbnail?.name,
    url: formData?.thumbnail?.url
      ? formData.thumbnail.url.substring(0, 50) + '...'
      : null,
    hasFile: !!formData?.thumbnail?.file,
    fileType: formData?.thumbnail?.file?.type,
    fileSize: formData?.thumbnail?.file?.size,
  });
  console.log('formData heroVideo:', {
    name: formData?.heroVideo?.name,
    hasFile: !!formData?.heroVideo?.file,
    fileType: formData?.heroVideo?.file?.type,
  });
  console.log('formData heroBanner:', {
    name: formData?.heroBanner?.name,
    hasFile: !!formData?.heroBanner?.file,
    fileType: formData?.heroBanner?.file?.type,
  });
  console.log('showcaseSections count:', showcaseSections?.length || 0);

  if (!formData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Không có dữ liệu để preview</p>
          <button
            onClick={onBack}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Quay lại form
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // Submit với data hiện tại, kèm showcase
    onSubmit({
      ...(formData as ProjectFormData),
      showcase: showcaseSections || [],
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="content-wrapper sticky top-0 z-40 border-b border-gray-200 bg-white py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center space-x-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Quay lại chỉnh sửa</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Preview Mode</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Đang tạo...</span>
              </>
            ) : (
              <span>Tạo dự án</span>
            )}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="pb-8">
        <ProjectPreviewContent
          formData={formData}
          showcaseSections={showcaseSections}
        />
      </div>
    </div>
  );
};

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'create' | 'preview'>('create'); // State để chuyển đổi view
  const [previewData, setPreviewData] = useState<{
    formData: Partial<ProjectFormData> | null;
    showcaseSections: any[];
  }>({
    formData: null,
    showcaseSections: [],
  }); // State để lưu data cho preview

  // Custom cleanup logic - only cleanup when NOT navigating to create or preview pages
  const { cleanup } = useSessionCleanup({
    ...sessionCleanupConfigs.projectForm,
    disableAutoCleanup: true, // Disable automatic cleanup, we'll handle it manually
  });

  // Handle route changes for conditional cleanup
  const handleRouteChange = (url: string) => {
    const isProjectFormRelated =
      url.includes('/admin/projects/create') ||
      url.includes('/admin/projects/preview');

    if (!isProjectFormRelated) {
      cleanup();
    }
  };

  // Set up route change listener
  useEffect(() => {
    // Check current sessionStorage content on mount
    const savedFormData = sessionStorage.getItem('projectFormData');
    const savedShowcaseSections = sessionStorage.getItem(
      'projectShowcaseSections'
    );

    if (savedFormData) {
      try {
        JSON.parse(savedFormData);
      } catch (e) {
        // Error parsing saved form data - silently ignore
      }
    }

    if (savedShowcaseSections) {
      try {
        JSON.parse(savedShowcaseSections);
      } catch (e) {
        // Error parsing saved showcase sections - silently ignore
      }
    }

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Handler để chuyển đổi giữa create và preview mode
  const handleViewModeChange = (
    mode: 'create' | 'preview',
    data?: { formData: Partial<ProjectFormData>; showcaseSections: any[] }
  ) => {
    console.log(`🔄 ViewMode changing: ${viewMode} -> ${mode}`);

    if (mode === 'preview' && data) {
      console.log('🎯 handleViewModeChange: Received data for preview:');
      console.log('thumbnail:', {
        name: data.formData.thumbnail?.name,
        url: data.formData.thumbnail?.url
          ? data.formData.thumbnail.url.substring(0, 50) + '...'
          : null,
        hasFile: !!data.formData.thumbnail?.file,
        fileType: data.formData.thumbnail?.file?.type,
        fileSize: data.formData.thumbnail?.file?.size,
      });
      console.log('heroVideo:', {
        name: data.formData.heroVideo?.name,
        url: data.formData.heroVideo?.url ? 'has URL' : 'no URL',
        hasFile: !!data.formData.heroVideo?.file,
        fileType: data.formData.heroVideo?.file?.type,
        fileSize: data.formData.heroVideo?.file?.size,
      });
      console.log('heroBanner:', {
        name: data.formData.heroBanner?.name,
        hasFile: !!data.formData.heroBanner?.file,
        fileType: data.formData.heroBanner?.file?.type,
      });

      // Lưu data từ form vào state thay vì sessionStorage
      setPreviewData({
        formData: data.formData,
        showcaseSections: data.showcaseSections,
      });

      console.log('✅ Preview data saved to state successfully');
    }

    console.log('📋 Form will remain mounted, only CSS visibility changes');
    setViewMode(mode);
  };

  // Handler để submit từ preview mode
  const handlePreviewSubmit = (data: ProjectFormData) => {
    // Trực tiếp call handleSubmit với data được pass từ preview
    handleSubmit(data);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('strapiToken');
      if (!token) {
        throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.');
      }

      // Extract media files from the form data
      const mediaFiles = {
        heroVideo: data.heroVideo?.file || undefined,
        heroBanner: data.heroBanner?.file || undefined,
        thumbnail: data.thumbnail?.file || undefined,
        featuredImage: data.featuredImage?.file || undefined,
        gallery: data.gallery?.map((item) => item.file).filter(Boolean) || [],
        showcase: data.showcase || [],
      };

      // Upload media files first if any exist
      let uploadResults: {
        heroVideoUploadId?: string;
        heroBannerUploadId?: string;
        thumbnailUploadId?: string;
        featuredImageUploadId?: string;
        galleryUploadIds: string[];
        showcaseUploadIds: string[];
      } = {
        heroVideoUploadId: undefined,
        heroBannerUploadId: undefined,
        thumbnailUploadId: undefined,
        featuredImageUploadId: undefined,
        galleryUploadIds: [],
        showcaseUploadIds: [],
      };

      // Check if showcase has actual files
      const showcaseHasFiles = mediaFiles.showcase?.some((section) =>
        section.items?.some((item) => item.file)
      );

      const hasMediaFiles =
        mediaFiles.heroVideo ||
        mediaFiles.heroBanner ||
        mediaFiles.thumbnail ||
        mediaFiles.featuredImage ||
        mediaFiles.gallery.length > 0 ||
        showcaseHasFiles;

      // Since we're using lazy upload, no more hasExistingUploadIds check needed
      // Files will only have uploadIds after they're uploaded during submission

      // Check if we have existing URLs (from previous uploads/sessionStorage)
      const hasExistingMediaUrls =
        (data.heroVideo?.url &&
          !data.heroVideo?.file &&
          !data.heroVideo?.url.startsWith('blob:')) ||
        (data.heroBanner?.url &&
          !data.heroBanner?.file &&
          !data.heroBanner?.url.startsWith('blob:')) ||
        (data.thumbnail?.url &&
          !data.thumbnail?.file &&
          !data.thumbnail?.url.startsWith('blob:')) ||
        (data.featuredImage?.url &&
          !data.featuredImage?.file &&
          !data.featuredImage?.url.startsWith('blob:'));

      // Check if we have blob URLs that lost their file objects (sessionStorage issue)
      const hasBlobUrlsWithoutFiles =
        (data.heroVideo?.url?.startsWith('blob:') && !data.heroVideo?.file) ||
        (data.heroBanner?.url?.startsWith('blob:') && !data.heroBanner?.file) ||
        (data.thumbnail?.url?.startsWith('blob:') && !data.thumbnail?.file) ||
        (data.featuredImage?.url?.startsWith('blob:') &&
          !data.featuredImage?.file);

      if (hasMediaFiles) {
        uploadResults = await uploadProjectMedia(mediaFiles, (progress) => {
          // Upload progress - can add UI feedback here if needed
        });
      } else if (hasBlobUrlsWithoutFiles) {
        // Show error to user
        setError(
          'Tệp đã được chọn nhưng bị mất khi chuyển trang. Vui lòng chọn lại các tệp (Hero Video, Hero Banner, Thumbnail) và thử lại.'
        );
        setIsLoading(false);
        return;
      }

      // Prepare data for API call
      const projectData = {
        ...data,
        // Use upload IDs from media upload process OR existing URLs
        heroVideoUploadId: uploadResults.heroVideoUploadId,
        heroBannerUploadId: uploadResults.heroBannerUploadId,
        thumbnailUploadId: uploadResults.thumbnailUploadId,
        featuredImageUploadId: uploadResults.featuredImageUploadId,
        galleryUploadIds: uploadResults.galleryUploadIds,
        showcaseUploadIds: uploadResults.showcaseUploadIds,
        // Pass existing URLs if no new upload happened (and they're not blob URLs)
        existingHeroVideoUrl:
          !uploadResults.heroVideoUploadId &&
          data.heroVideo?.url &&
          !data.heroVideo.url.startsWith('blob:')
            ? data.heroVideo.url
            : undefined,
        existingHeroBannerUrl:
          !uploadResults.heroBannerUploadId &&
          data.heroBanner?.url &&
          !data.heroBanner.url.startsWith('blob:')
            ? data.heroBanner.url
            : undefined,
        existingThumbnailUrl:
          !uploadResults.thumbnailUploadId &&
          data.thumbnail?.url &&
          !data.thumbnail.url.startsWith('blob:')
            ? data.thumbnail.url
            : undefined,
        existingFeaturedImageUrl:
          !uploadResults.featuredImageUploadId &&
          data.featuredImage?.url &&
          !data.featuredImage.url.startsWith('blob:')
            ? data.featuredImage.url
            : undefined,
        // Original file names for processing
        originalHeroVideoName: data.heroVideo?.name,
        originalHeroBannerName: data.heroBanner?.name,
        originalThumbnailName: data.thumbnail?.name,
        originalFeaturedImageName: data.featuredImage?.name,
        originalGalleryNames: data.gallery
          ?.map((item) => item.name)
          .filter(Boolean),
      };

      const response = await fetch('/api/admin/projects/create-from-chunks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if unauthorized - redirect to login
        if (response.status === 401) {
          localStorage.removeItem('strapiToken');
          localStorage.removeItem('strapiUser');
          router.push('/admin/projects/create');
          return;
        }

        throw new Error(errorData.message || 'Lỗi khi tạo dự án');
      }

      const result = await response.json();

      // Show success message
      alert('Tạo dự án thành công!');

      // Redirect to projects list
      router.push('/admin/projects');
    } catch (error: any) {
      setError(error.message || 'Lỗi khi tạo dự án');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('strapiToken');
    localStorage.removeItem('strapiUser');
    router.push('/admin/projects/create');
  };

  return (
    <AuthLayout
      title={viewMode === 'preview' ? 'Preview dự án' : 'Tạo dự án mới'}
      description={
        viewMode === 'preview'
          ? 'Xem trước dự án trước khi tạo'
          : 'Đăng nhập để tạo dự án mới'
      }
      backUrl="/admin/projects"
      backText="Quay lại danh sách dự án"
    >
      <>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="relative">
          {/* Form Component - Always rendered but hidden when in preview mode */}
          <div
            className={`transition-opacity duration-300 ${
              viewMode === 'preview'
                ? 'pointer-events-none opacity-0'
                : 'opacity-100'
            }`}
          >
            <ProjectFormPage
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onLogout={handleLogout}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
          </div>

          {/* Preview Overlay - Positioned absolutely over the form */}
          <div
            className={`absolute inset-0 z-50 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
              viewMode === 'preview'
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
            style={{
              minHeight: '100vh',
            }}
          >
            <div className="h-full bg-white">
              <ProjectPreviewWrapper
                onBack={() => handleViewModeChange('create')}
                onSubmit={handlePreviewSubmit}
                isLoading={isLoading}
                formData={previewData.formData}
                showcaseSections={previewData.showcaseSections}
              />
            </div>
          </div>
        </div>
      </>
    </AuthLayout>
  );
}
