import { useState } from 'react';
import { useRouter } from 'next/router';
import ProjectFormPage from '@/components/admin/ProjectFormPage';
import AuthLayout from '@/components/auth/AuthLayout';
import { type ProjectFormData } from '@/lib/validations/project';
import { uploadProjectMedia } from '@/utils/project-media-upload';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setError('');
    setUploadProgress(0);

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

      // Debug: Log showcase data
      console.log('Showcase data from form:', data.showcase);
      console.log('Showcase media files:', mediaFiles.showcase);
      console.log(
        'Showcase layouts:',
        data.showcase?.map((s) => ({
          id: s.id,
          layout: s.layout,
          title: s.title,
        }))
      );

      // Debug: Check showcase items structure
      if (data.showcase && data.showcase.length > 0) {
        data.showcase.forEach((section, sectionIndex) => {
          console.log(`Section ${sectionIndex}:`, {
            id: section.id,
            layout: section.layout,
            title: section.title,
            items: section.items?.map((item) => ({
              id: item.id,
              title: item.title,
              hasFile: !!item.file,
              fileType: typeof item.file,
              fileIsFile: item.file instanceof File,
            })),
          });
        });
      }

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

      // Debug: Check showcase files logic
      console.log('Checking showcase files logic:');
      if (mediaFiles.showcase && mediaFiles.showcase.length > 0) {
        mediaFiles.showcase.forEach((section, sectionIndex) => {
          const sectionHasFiles = section.items?.some((item) => item.file);
          console.log(`Section ${sectionIndex} has files:`, sectionHasFiles);
          if (section.items) {
            section.items.forEach((item, itemIndex) => {
              console.log(
                `  Item ${itemIndex} has file:`,
                !!item.file,
                'Type:',
                typeof item.file
              );
            });
          }
        });
      }

      const hasMediaFiles =
        mediaFiles.heroVideo ||
        mediaFiles.thumbnail ||
        mediaFiles.featuredImage ||
        mediaFiles.gallery.length > 0 ||
        showcaseHasFiles;

      // Debug: Check if showcase has files
      console.log('Showcase has files:', showcaseHasFiles);
      console.log('Has media files:', hasMediaFiles);

      // Debug: Count total files in showcase
      let totalShowcaseFiles = 0;
      if (mediaFiles.showcase && mediaFiles.showcase.length > 0) {
        mediaFiles.showcase.forEach((section) => {
          if (section.items) {
            section.items.forEach((item) => {
              if (item.file) {
                totalShowcaseFiles++;
                console.log(
                  'Found file in showcase:',
                  item.file.name,
                  item.file.type
                );
              }
            });
          }
        });
      }
      console.log('Total showcase files found:', totalShowcaseFiles);

      if (hasMediaFiles) {
        uploadResults = await uploadProjectMedia(mediaFiles, (progress) => {
          setUploadProgress(progress);
        });
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

      // Debug: Log project data being sent
      console.log('Project data being sent to API:', {
        ...projectData,
        showcase: projectData.showcase?.map((s) => ({
          id: s.id,
          layout: s.layout,
          title: s.title,
          itemsCount: s.items?.length,
        })),
      });

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
          uploadProgress={uploadProgress}
          onLogout={handleLogout}
        />
      </>
    </AuthLayout>
  );
}
