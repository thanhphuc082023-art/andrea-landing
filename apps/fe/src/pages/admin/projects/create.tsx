import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectFormPage from '@/components/admin/ProjectFormPage';
import AuthLayout from '@/components/auth/AuthLayout';
import { type ProjectFormData } from '@/lib/validations/project';
import { uploadProjectMedia } from '@/utils/project-media-upload';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

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
        thumbnail: data.thumbnail?.file || undefined,
        featuredImage: data.featuredImage?.file || undefined,
        gallery: data.gallery?.map((item) => item.file).filter(Boolean) || [],
        showcase: data.showcase || [],
      };

      // Upload media files first if any exist
      let uploadResults: {
        heroVideoUploadId?: string;
        thumbnailUploadId?: string;
        featuredImageUploadId?: string;
        galleryUploadIds: string[];
        showcaseUploadIds: string[];
      } = {
        heroVideoUploadId: undefined,
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
        mediaFiles.thumbnail ||
        mediaFiles.featuredImage ||
        mediaFiles.gallery.length > 0 ||
        showcaseHasFiles;

      if (hasMediaFiles) {
        uploadResults = await uploadProjectMedia(mediaFiles, (progress) => {});
      }

      // Prepare data for API call
      const projectData = {
        ...data,
        // Use upload IDs from media upload process
        heroVideoUploadId: uploadResults.heroVideoUploadId,
        thumbnailUploadId: uploadResults.thumbnailUploadId,
        featuredImageUploadId: uploadResults.featuredImageUploadId,
        galleryUploadIds: uploadResults.galleryUploadIds,
        showcaseUploadIds: uploadResults.showcaseUploadIds,
        // Original file names for processing
        originalHeroVideoName: data.heroVideo?.name,
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
      console.error('Error creating project:', error);
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
      title="Tạo dự án mới"
      description="Đăng nhập để tạo dự án mới"
      backUrl="/admin/projects"
      backText="Quay lại danh sách dự án"
    >
      <>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <ProjectFormPage
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onLogout={handleLogout}
        />
      </>
    </AuthLayout>
  );
}
