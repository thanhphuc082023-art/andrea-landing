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
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="content-wrapper">
          <div className="max-sd:h-[60px] flex h-[65px] items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm sm:inline">Quay lại chỉnh sửa</span>
              </button>
              <div className="hidden h-6 w-px bg-gray-300 sm:block" />
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Chế độ xem trước</span>
              </div>
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

export default function EditProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [viewMode, setViewMode] = useState<'create' | 'preview'>('create');
  const [previewData, setPreviewData] = useState<{
    formData: Partial<ProjectFormData> | null;
    showcaseSections?: any[];
  }>({
    formData: null,
    showcaseSections: [],
  });
  // client-side project state & fetch status
  const [project, setProject] = useState<any | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetchingProject, setIsFetchingProject] = useState<boolean>(true);

  const { slug } = router.query;
  console.log('previewData', previewData);
  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      setIsFetchingProject(true);
      setFetchError(null);

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?filters[slug][$eq]=${slug}&populate=*&publicationState=live`;
        const response = await fetch(apiUrl, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        if (!data.data || data.data.length === 0) {
          setFetchError('Dự án không tồn tại.');
          setProject(null);
        } else {
          setProject(data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching project (client):', err);
        setFetchError('Không thể tải thông tin dự án. Vui lòng thử lại sau.');
        setProject(null);
      } finally {
        setIsFetchingProject(false);
      }
    };

    fetchProject();
  }, [slug]);

  // Transform project data to form data on mount
  const [initialFormData, setInitialFormData] =
    useState<Partial<ProjectFormData> | null>(null);
  console.log('initialFormData', initialFormData);
  useEffect(() => {
    if (project) {
      const formData = transformStrapiProjectToFormData(project);
      setInitialFormData(formData);

      // Extract showcase sections from project data for preview
      const showcaseSections = project.showcaseSections || [];

      // Set initial preview data with showcase sections
      // Also include the formData so the preview component has full data to render
      // Use transformed showcase from formData so item.src/url are normalized
      setPreviewData((prev) => ({
        ...prev,
        formData: formData,
      }));

      // If any showcase items still reference uploadId (no src/url), request server to resolve them so preview can render immediately
      const needsProcessing = (formData.showcase || []).some((section: any) =>
        (section.items || []).some(
          (it: any) => !it.src && !it.url && typeof it.uploadId === 'string'
        )
      );

      if (needsProcessing) {
        (async () => {
          try {
            const token = localStorage.getItem('strapiToken');
            // collect uploadIds and original names in order
            const showcaseUploadIds: string[] = [];
            const showcaseOriginalNames: string[] = [];
            (formData.showcase || []).forEach((section: any) => {
              (section.items || []).forEach((it: any) => {
                if (it.uploadId) {
                  showcaseUploadIds.push(it.uploadId);
                  showcaseOriginalNames.push(
                    it.title || it.name || it.alt || 'showcase'
                  );
                }
              });
            });

            const res = await fetch('/api/admin/projects/process-showcase', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                showcaseSections: formData.showcase || [],
                showcaseUploadIds,
                showcaseOriginalNames,
              }),
            });

            if (res.ok) {
              const json = await res.json();
              const processed =
                json.processedShowcase || formData.showcase || [];
              setPreviewData((prev) => ({
                ...prev,
                formData,
                showcaseSections: processed,
              }));
            } else {
              console.warn('process-showcase failed on mount:', res.status);
            }
          } catch (err) {
            console.warn('Error auto-processing showcase for preview:', err);
          }
        })();
      }
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
      setPreviewData((prev) => {
        const incomingSections =
          data.showcaseSections ?? (data.formData?.showcase as any) ?? [];

        const prevSections = Array.isArray(prev?.showcaseSections)
          ? prev!.showcaseSections!
          : [];

        const mergedSections = Array.isArray(incomingSections)
          ? incomingSections.map((incSec: any, idx: number) => {
              const prevSec = prevSections[idx];
              const prevItems = Array.isArray(prevSec?.items)
                ? prevSec.items
                : [];
              const incItems = Array.isArray(incSec?.items) ? incSec.items : [];

              const mergedItems = incItems.map((incItem: any) => {
                if (incItem && incItem.uploadId) {
                  const match = prevItems.find(
                    (pi: any) =>
                      pi && pi.uploadId && pi.uploadId === incItem.uploadId
                  );
                  if (match && (match.src || match.url)) {
                    return {
                      ...incItem,
                      src: match.src ?? match.url ?? incItem.src,
                      url: incItem.url ?? match.url ?? match.src,
                    };
                  }
                }
                return incItem;
              });

              return {
                ...incSec,
                items: mergedItems,
              };
            })
          : [];

        return {
          ...prev,
          formData: data.formData,
          showcaseSections: mergedSections,
        };
      });
    }
    setViewMode(mode);
  };

  const handlePreviewSubmit = (data: ProjectFormData) => {
    handleSubmit(data);
  };

  // Helper function to upload file to Strapi (client-side version)
  const uploadFileToStrapi = async (
    file: File,
    originalName: string,
    token: string,
    strapiUrl: string,
    category = 'projects'
  ) => {
    const form = new FormData();
    // Client-side: directly use the File object
    form.append('files', file, originalName);
    form.append('path', category);

    const res = await fetch(`${strapiUrl}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(
        `Upload to Strapi failed: ${res.status} ${res.statusText} ${text || ''}`
      );
    }

    const data = await res.json().catch(() => null);
    if (Array.isArray(data) && data.length > 0) return data[0].id;
    if (data && Array.isArray(data.data) && data.data[0])
      return data.data[0].id;
    return null;
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

      const STRAPI_URL =
        process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

      // Upload media files to Strapi first and collect IDs
      const uploadedIds: Record<string, number | null> = {
        thumbnail: null,
        heroBanner: null,
        heroVideo: null,
        featuredImage: null,
      };

      // Upload thumbnail
      if (data.thumbnail?.file) {
        try {
          const id = await uploadFileToStrapi(
            data.thumbnail.file,
            data.thumbnail.file.name,
            token,
            STRAPI_URL
          );
          uploadedIds.thumbnail = id;
        } catch (e) {
          console.error('Thumbnail upload error', e);
          throw new Error('Lỗi khi tải lên thumbnail');
        }
      }

      // Upload heroBanner
      if (data.heroBanner?.file) {
        try {
          const id = await uploadFileToStrapi(
            data.heroBanner.file,
            data.heroBanner.file.name,
            token,
            STRAPI_URL
          );
          uploadedIds.heroBanner = id;
        } catch (e) {
          console.error('Hero banner upload error', e);
          throw new Error('Lỗi khi tải lên heroBanner');
        }
      }

      // Upload heroVideo
      if (data.heroVideo?.file) {
        try {
          const id = await uploadFileToStrapi(
            data.heroVideo.file,
            data.heroVideo.file.name,
            token,
            STRAPI_URL
          );
          uploadedIds.heroVideo = id;
        } catch (e) {
          console.error('Hero video upload error', e);
          throw new Error('Lỗi khi tải lên heroVideo');
        }
      }

      // Upload featuredImage
      if (data.featuredImage?.file) {
        try {
          const id = await uploadFileToStrapi(
            data.featuredImage.file,
            data.featuredImage.file.name,
            token,
            STRAPI_URL
          );
          uploadedIds.featuredImage = id;
        } catch (e) {
          console.error('Featured image upload error', e);
          throw new Error('Lỗi khi tải lên featuredImage');
        }
      }

      // Tách riêng xử lý showcase
      const showcaseMediaFiles = {
        showcase: data.showcase || [],
      };

      // Check if showcase has actual files (including section-level files)
      const showcaseHasFiles = showcaseMediaFiles.showcase?.some(
        (section) =>
          section.items?.some((item) => item.file) ||
          section.backgroundFile ||
          section.imageFile
      );

      // Process showcase data for API
      let showcaseUploadIds: string[] = [];
      let showcaseOriginalNames: string[] = [];

      // Process showcase files if any have the file property
      if (showcaseHasFiles) {
        // Upload showcase media files
        const uploadResults = await uploadProjectMedia(
          showcaseMediaFiles,
          (progress) => {
            // Upload progress feedback can be added here
          }
        );
        // Get upload IDs and original names for processing on the server
        if (
          uploadResults.showcaseUploadIds &&
          uploadResults.showcaseUploadIds.length > 0
        ) {
          showcaseUploadIds = uploadResults.showcaseUploadIds;

          // Build showcaseOriginalNames aligned with uploadProjectMedia order:
          // for each section: items (in order), then backgroundFile (if any), then imageFile (if any)
          if (data.showcase && Array.isArray(data.showcase)) {
            data.showcase.forEach((section: any) => {
              // items
              (section.items || []).forEach((item: any) => {
                if (item.file) {
                  showcaseOriginalNames.push(
                    item.file?.name ||
                      item.title ||
                      `showcase-item-${Date.now()}`
                  );
                }
              });

              // section-level backgroundFile
              if (section.backgroundFile) {
                showcaseOriginalNames.push(
                  section.backgroundFile?.name ||
                    `${section.title || 'background'}`
                );
              }

              // section-level imageFile
              if (section.imageFile) {
                showcaseOriginalNames.push(
                  section.imageFile?.name || `${section.title || 'image'}`
                );
              }
            });
          }
        }
      }

      // Prepare data for API call (include uploaded media IDs)
      const projectData = {
        ...data,
        id: project.id,
        documentId: project.id,
        showcase: data.showcase || [],
        showcaseUploadIds: showcaseUploadIds,
        showcaseOriginalNames: showcaseOriginalNames,
        // Include uploaded media IDs (prefer newly uploaded, fallback to existing)
        thumbnailUploadId: uploadedIds.thumbnail || data.thumbnail?.uploadId,
        heroBannerUploadId: uploadedIds.heroBanner || data.heroBanner?.uploadId,
        heroVideoUploadId: uploadedIds.heroVideo || data.heroVideo?.uploadId,
        featuredImageUploadId:
          uploadedIds.featuredImage || data.featuredImage?.uploadId,
        // Pass all thumbnail related information for better debugging and reliability
        _originalThumbnail: {
          ...(data.thumbnail || {}),
          rawData: data.thumbnail?.raw,
          strapi_id:
            data.thumbnail?.id ||
            data.thumbnail?.uploadId ||
            uploadedIds.thumbnail,
          initialId: project.thumbnail?.id,
          initialData: project.thumbnail,
        },
        _dataFormat: 'enhanced_v3_client_upload',
      };

      // If there are showcase upload IDs, finalize/process them on the server
      let finalProjectData: any = projectData;

      if (
        showcaseUploadIds &&
        Array.isArray(showcaseUploadIds) &&
        showcaseUploadIds.length > 0
      ) {
        try {
          const procRes = await fetch('/api/admin/projects/process-showcase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              showcaseSections: data.showcase || [],
              showcaseUploadIds,
              showcaseOriginalNames,
            }),
          });

          if (!procRes.ok) {
            const errBody = await procRes.json().catch(() => null);
            console.warn('Failed to process showcase on server:', errBody);
            throw new Error(errBody?.message || 'Failed to process showcase');
          }

          const procJson = await procRes.json();
          // server returns processedShowcase (array of sections with src/url fields)
          const processedShowcase =
            procJson.processedShowcase || data.showcase || [];

          // Merge processed showcase into previewData so preview shows resolved src/url immediately
          setPreviewData((prev) => ({
            ...prev,
            showcaseSections:
              Array.isArray(processedShowcase) && processedShowcase.length > 0
                ? processedShowcase
                : prev?.showcaseSections || processedShowcase,
          }));

          // Build finalProjectData with processed showcase
          finalProjectData = {
            ...projectData,
            showcaseSections:
              Array.isArray(processedShowcase) && processedShowcase.length > 0
                ? processedShowcase
                : projectData.showcase || [],
          };
          // Remove transient client-only fields from the final payload
          delete (finalProjectData as any).showcase;
          delete (finalProjectData as any).showcaseUploadIds;
          delete (finalProjectData as any).showcaseOriginalNames;
        } catch (err) {
          console.warn('Showcase processing error, aborting update:', err);
          throw err;
        }
      }

      // Remove file objects from data since they're already uploaded
      const dataForAPI = { ...finalProjectData };
      if (dataForAPI.thumbnail?.file) {
        dataForAPI.thumbnail = {
          ...dataForAPI.thumbnail,
          file: undefined,
        };
      }
      if (dataForAPI.heroBanner?.file) {
        dataForAPI.heroBanner = {
          ...dataForAPI.heroBanner,
          file: undefined,
        };
      }
      if (dataForAPI.heroVideo?.file) {
        dataForAPI.heroVideo = {
          ...dataForAPI.heroVideo,
          file: undefined,
        };
      }
      if (dataForAPI.featuredImage?.file) {
        dataForAPI.featuredImage = {
          ...dataForAPI.featuredImage,
          file: undefined,
        };
      }

      // Send JSON data to the server API (files already uploaded)
      const apiUrl = `/api/admin/projects/${project.documentId}/update`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataForAPI),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 401) {
          localStorage.removeItem('strapiToken');
          localStorage.removeItem('strapiUser');
          router.push('/admin/projects');
          return;
        }

        throw new Error(errorData?.message || 'Lỗi khi cập nhật dự án');
      }

      const result = await response.json();

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

  // use client-side fetch error
  if (fetchError) {
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
            <p className="text-gray-600">{fetchError}</p>
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
          {/* show client fetching spinner while project is loading */}
          {isFetchingProject ? (
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
                Đang tải, vui lòng chờ...
              </div>
            </div>
          ) : fetchError ? (
            <div className="text-center text-gray-600">{fetchError}</div>
          ) : (
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600" />
          )}
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
              initialData={initialFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onViewModeChange={(mode, payload) =>
                handleViewModeChange(mode, payload)
              }
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

EditProjectPage.getLayout = (page: React.ReactElement) => <>{page}</>;
