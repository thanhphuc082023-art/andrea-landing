import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import ProjectFormPage from '@/components/admin/ProjectFormPage';
import ProjectPreviewContent from '@/components/admin/ProjectPreviewContent';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import AuthLayout from '@/components/auth/AuthLayout';
import { type ProjectFormData } from '@/lib/validations/project';
import { uploadProjectMedia } from '@/utils/project-media-upload';
import { handleProjectMediaChanges } from '@/utils/project-edit-media-upload';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';
import { StrapiAPI } from '@/lib/strapi';
import { ProjectEntity } from '@/types/strapi';
import { transformStrapiProjectToFormData } from '@/utils/project-form-transform';

// Component Preview Wrapper để hiển thị preview
const ProjectPreviewWrapper = ({
  onBack,
  onSubmit,
  isLoading,
  formData,
  showcaseSections,
}: {
  onBack: () => void;
  onSubmit: (data: ProjectFormData) => void;
  isLoading: boolean;
  formData?: Partial<ProjectFormData> | null;
  showcaseSections?: any[];
}) => {
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

interface EditProjectPageProps {
  project: any;
  error?: string;
}

export default function EditProjectPage({
  project,
  error,
}: EditProjectPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [viewMode, setViewMode] = useState<'create' | 'preview'>('create');
  const [previewData, setPreviewData] = useState<{
    formData: Partial<ProjectFormData> | null;
    showcaseSections: any[];
  }>({
    formData: null,
    showcaseSections: [],
  });

  // Transform project data to form data on mount
  const [initialFormData, setInitialFormData] =
    useState<Partial<ProjectFormData> | null>(null);

  useEffect(() => {
    if (project) {
      const formData = transformStrapiProjectToFormData(project);
      setInitialFormData(formData);

      // Extract showcase sections from project data for preview
      const showcaseSections = project.showcaseSections || [];
      console.log(
        '🔄 Loading showcase sections from project:',
        showcaseSections
      );

      // Set initial preview data with showcase sections
      setPreviewData((prev) => ({
        ...prev,
        showcaseSections: showcaseSections,
      }));
    }
  }, [project]);

  // Custom cleanup logic
  const { cleanup } = useSessionCleanup({
    ...sessionCleanupConfigs.projectForm,
    disableAutoCleanup: true,
  });

  const handleRouteChange = (url: string) => {
    const isProjectFormRelated =
      url.includes('/admin/projects/create') ||
      (url.includes('/admin/projects/') && url.includes('/edit')) ||
      url.includes('/admin/projects/preview');

    if (!isProjectFormRelated) {
      cleanup();
    }
  };

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const handleViewModeChange = (
    mode: 'create' | 'preview',
    data?: { formData: Partial<ProjectFormData>; showcaseSections: any[] }
  ) => {
    if (mode === 'preview' && data) {
      setPreviewData({
        formData: data.formData,
        showcaseSections: data.showcaseSections,
      });
    }
    setViewMode(mode);
  };

  const handlePreviewSubmit = (data: ProjectFormData) => {
    handleSubmit(data);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('strapiToken');
      if (!token) {
        throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.');
      }

      // Check for blob URLs without file objects - this means the session was lost
      const hasBlobUrlsWithoutFiles =
        (data.heroVideo?.url?.startsWith('blob:') && !data.heroVideo?.file) ||
        (data.heroBanner?.url?.startsWith('blob:') && !data.heroBanner?.file) ||
        (data.thumbnail?.url?.startsWith('blob:') && !data.thumbnail?.file) ||
        (data.featuredImage?.url?.startsWith('blob:') &&
          !data.featuredImage?.file);

      if (hasBlobUrlsWithoutFiles) {
        setSubmitError(
          'Tệp đã được chọn nhưng bị mất khi chuyển trang. Vui lòng chọn lại các tệp và thử lại.'
        );
        setIsLoading(false);
        return;
      }

      // Tách riêng xử lý showcase
      const showcaseMediaFiles = {
        showcase: data.showcase || [],
      };

      // Check if showcase has actual files
      const showcaseHasFiles = showcaseMediaFiles.showcase?.some((section) =>
        section.items?.some((item) => item.file)
      );

      // Prepare showcase sections in the required format
      let formattedShowcaseSections =
        data.showcase?.map((section, sectionIndex) => ({
          id: section.id || `section-${Date.now() + sectionIndex}`,
          type: section.type || 'image',
          items:
            section.items?.map((item, itemIndex) => ({
              id: item.id || `item-${Date.now() + itemIndex}`,
              alt: item.title || item.name || '',
              src: item.url || '',
              file: null,
              size: item.size || 0,
              type: item.type || 'image',
              order: itemIndex,
              title: item.title || item.name || '',
              width: item.width || 1300,
              height: item.height || 800,
              uploadId: item.uploadId || '',
            })) || [],
          order: sectionIndex,
          title: section.title || `Section ${sectionIndex + 1}`,
          layout: section.layout || 'single',
        })) || [];

      // Process showcase files if any have the file property
      if (showcaseHasFiles) {
        // Upload showcase media files
        const uploadResults = await uploadProjectMedia(
          showcaseMediaFiles,
          (progress) => {
            // Upload progress feedback can be added here
          }
        );
        console.log('showcaseMediaFiles', showcaseMediaFiles);
        console.log('uploadResults', uploadResults);

        // Update upload IDs in the formatted showcase sections
        if (
          uploadResults.showcaseUploadIds &&
          uploadResults.showcaseUploadIds.length > 0
        ) {
          let uploadIdIndex = 0;
          formattedShowcaseSections = formattedShowcaseSections.map(
            (section) => ({
              ...section,
              items: section.items.map((item) => {
                if (
                  item.file &&
                  uploadIdIndex < uploadResults.showcaseUploadIds.length
                ) {
                  const uploadId =
                    uploadResults.showcaseUploadIds[uploadIdIndex++];
                  return {
                    ...item,
                    uploadId,
                    src: `/uploads/${uploadId}`,
                  };
                }
                return item;
              }),
            })
          );
        }
      }

      // Handle media changes cho các loại media còn lại - only processes files that have been changed
      const uploadResults = await handleProjectMediaChanges(
        data,
        (progress) => {
          // Upload progress feedback can be added here
        }
      );

      // Extract the ID from the thumbnail directly if available
      const thumbnailId = data.thumbnail?.id || data.thumbnail?.uploadId;

      // Prepare data for API call
      const projectData = {
        ...data,
        id: project.id,
        documentId: project.id,
        heroVideoUploadId: uploadResults.heroVideoUploadId,
        heroBannerUploadId: uploadResults.heroBannerUploadId,
        thumbnailUploadId: uploadResults.thumbnailUploadId || thumbnailId,
        featuredImageUploadId: uploadResults.featuredImageUploadId,
        galleryUploadIds: uploadResults.galleryUploadIds,
        // Use the properly formatted showcase sections
        showcaseSections: formattedShowcaseSections,
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
        // Include original file names for new uploads
        ...(uploadResults.originalHeroVideoName && {
          originalHeroVideoName: uploadResults.originalHeroVideoName,
        }),
        ...(uploadResults.originalHeroBannerName && {
          originalHeroBannerName: uploadResults.originalHeroBannerName,
        }),
        ...(uploadResults.originalThumbnailName && {
          originalThumbnailName: uploadResults.originalThumbnailName,
        }),
        ...(uploadResults.originalFeaturedImageName && {
          originalFeaturedImageName: uploadResults.originalFeaturedImageName,
        }),
        // Pass all thumbnail related information for better debugging and reliability
        _originalThumbnail: {
          ...(data.thumbnail || {}),
          rawData: data.thumbnail?.raw,
          strapi_id: data.thumbnail?.id || data.thumbnail?.uploadId,
          initialId: project.thumbnail?.id,
          initialData: project.thumbnail,
        },
        _dataFormat: 'enhanced_v2',
      };

      console.log('DEBUG - Client sending to API:', projectData);

      // Determine if we need to use the chunked upload endpoint
      const useChunkedEndpoint =
        showcaseHasFiles || // Sử dụng chunked endpoint nếu có showcase files
        !!uploadResults.heroVideoUploadId ||
        !!uploadResults.heroBannerUploadId ||
        !!uploadResults.thumbnailUploadId ||
        !!uploadResults.featuredImageUploadId;
      console.log('updateData', projectData);

      // Import the project service function
      const { updateProject } = await import('@/utils/project');

      let result;

      // Check if we need to use the chunked endpoint for large media files
      if (!useChunkedEndpoint) {
        // Use the improved v2 endpoint for better thumbnail handling
        const apiUrl = `/api/admin/projects/${project.documentId}/update-from-chunks`;

        // Create a JSON representation for the API
        const jsonString = JSON.stringify(projectData);
        console.log(
          'DEBUG - Client sending to API:',
          jsonString.substring(0, 1000) + '...'
        );

        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: jsonString,
        });

        if (!response.ok) {
          const errorData = await response.json();

          if (response.status === 401) {
            localStorage.removeItem('strapiToken');
            localStorage.removeItem('strapiUser');
            router.push('/admin/projects');
            return;
          }

          throw new Error(errorData.message || 'Lỗi khi cập nhật dự án');
        }

        result = await response.json();
      } else {
        // Use the new project service function for regular updates
        // Extract the media files if they exist
        const thumbnailFile = data.thumbnail?.file || null;
        const heroBannerFile = data.heroBanner?.file || null;
        const heroVideoFile = data.heroVideo?.file || null;

        // Prepare fields for the updateProject function
        // We need to extract the relevant project data fields without the metadata
        const projectFields = {
          title: projectData.title,
          description: projectData.description,
          slug: projectData.slug,
          projectIntroTitle: projectData.projectIntroTitle,
          content: projectData.content,
          overview: projectData.overview,
          challenge: projectData.challenge,
          solution: projectData.solution,
          projectStatus: projectData.status,
          featured: projectData.featured,
          technologies: projectData.technologies,
          projectMetaInfo: projectData.projectMetaInfo,
          results: projectData.results,
          metrics: projectData.metrics,
          credits: projectData.credits,
          seo: projectData.seo,
          showcaseSections: formattedShowcaseSections,
        };

        // Call the updateProject function
        result = await updateProject(
          project.documentId,
          projectFields,
          thumbnailFile,
          heroBannerFile,
          heroVideoFile,
          token
        );
      }
      console.log('DEBUG - API response:', result);

      // Kiểm tra debug data nếu có
      if (result.debug) {
        console.log(
          'DEBUG - Thumbnail processing details:',
          result.debug.processing || 'No processing info available'
        );
        console.log(
          'DEBUG - Strapi response:',
          result.debug.strapiResponse || 'No Strapi response info available'
        );
      }

      alert('Cập nhật dự án thành công!');
      router.push('/admin/projects');
    } catch (error: any) {
      setSubmitError(error.message || 'Lỗi khi cập nhật dự án');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('strapiToken');
    localStorage.removeItem('strapiUser');
    router.push('/admin/projects');
  };

  if (error) {
    return (
      <AuthLayout
        title="Lỗi"
        description="Có lỗi xảy ra khi tải dự án"
        backUrl="/admin/projects"
        backText="Quay lại danh sách dự án"
      >
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Lỗi</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!initialFormData) {
    return (
      <AuthLayout
        title="Đang tải..."
        description="Đang tải thông tin dự án"
        backUrl="/admin/projects"
        backText="Quay lại danh sách dự án"
      >
        <div className="flex h-64 items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={
        viewMode === 'preview' ? 'Preview dự án' : `Chỉnh sửa: ${project.title}`
      }
      description={
        viewMode === 'preview'
          ? 'Xem trước dự án trước khi cập nhật'
          : 'Chỉnh sửa thông tin dự án'
      }
      backUrl="/admin/projects"
      backText="Quay lại danh sách dự án"
    >
      <>
        {submitError && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <div className="relative">
          {/* Form Component */}
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
              initialData={initialFormData}
            />
          </div>

          {/* Preview Overlay */}
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

export const getServerSideProps: GetServerSideProps<
  EditProjectPageProps
> = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?filters[slug][$eq]=${slug}&populate=*&publicationState=live`;
    console.log('DEBUG - Fetching project data from:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return {
        notFound: true,
      };
    }

    const project = data.data[0];
    console.log('DEBUG - Thumbnail in project data:', project.thumbnail);
    return {
      props: {
        project,
      },
    };
  } catch (error) {
    return {
      props: {
        project: null,
        error: 'Không thể tải thông tin dự án. Vui lòng thử lại sau.',
      },
    };
  }
};
