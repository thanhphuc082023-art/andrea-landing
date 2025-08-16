import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import AdminLayout from '@/components/admin/AdminLayout';
import { type ProjectFormData } from '@/lib/validations/project';
import ProjectPreviewContent from '@/components/admin/ProjectPreviewContent';

export default function ProjectPreviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ProjectFormData> | null>(
    null
  );
  const [showcaseSections, setShowcaseSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('=== PREVIEW PAGE MOUNT DEBUG ===');
    console.log('Loading preview data from sessionStorage...');

    // Lấy data từ sessionStorage hoặc localStorage
    const savedFormData = sessionStorage.getItem('projectFormData');
    const savedShowcaseSections = sessionStorage.getItem(
      'projectShowcaseSections'
    );

    console.log('Raw sessionStorage data:');
    console.log('- projectFormData length:', savedFormData?.length || 0);
    console.log(
      '- projectShowcaseSections length:',
      savedShowcaseSections?.length || 0
    );

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        console.log('Parsed form data for preview:', {
          title: parsedData.title,
          description: parsedData.description?.substring(0, 50) + '...',
          heroVideo: parsedData.heroVideo
            ? {
                name: parsedData.heroVideo.name,
                url: parsedData.heroVideo.url,
                hasFile: !!parsedData.heroVideo.file,
              }
            : null,
          thumbnail: parsedData.thumbnail
            ? {
                name: parsedData.thumbnail.name,
                url: parsedData.thumbnail.url,
                hasFile: !!parsedData.thumbnail.file,
              }
            : null,
          technologiesCount: parsedData.technologies?.length || 0,
          projectMetaInfoCount: parsedData.projectMetaInfo?.length || 0,
          creditsInfo: parsedData.credits
            ? {
                title: parsedData.credits.title,
                projectManager:
                  parsedData.credits.projectManager?.substring(0, 50) + '...',
              }
            : null,
        });
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    } else {
      console.log('No saved form data found in sessionStorage');
    }

    if (savedShowcaseSections) {
      try {
        const parsedSections = JSON.parse(savedShowcaseSections);
        console.log('Parsed showcase sections for preview:', {
          sectionsCount: parsedSections.length,
          sectionsWithItems: parsedSections.filter((s) => s.items?.length > 0)
            .length,
          sectionsWithFiles: parsedSections.filter((s) =>
            s.items?.some((i) => i.file)
          ).length,
          totalItems: parsedSections.reduce(
            (acc, s) => acc + (s.items?.length || 0),
            0
          ),
          itemsWithFiles: parsedSections.reduce(
            (acc, s) => acc + (s.items?.filter((i) => i.file).length || 0),
            0
          ),
        });

        // Log each section details
        parsedSections.forEach((section, index) => {
          console.log(`Section ${index + 1}:`, {
            id: section.id,
            title: section.title,
            type: section.type,
            layout: section.layout,
            itemsCount: section.items?.length || 0,
            itemsWithFiles: section.items?.filter((i) => i.file).length || 0,
            itemsWithSrc: section.items?.filter((i) => i.src).length || 0,
          });
        });

        setShowcaseSections(parsedSections);
      } catch (error) {
        console.error('Error parsing showcase sections:', error);
      }
    } else {
      console.log('No saved showcase sections found in sessionStorage');
    }

    setIsLoading(false);
    console.log('=== END PREVIEW PAGE MOUNT DEBUG ===');
  }, []);

  const handleBackToForm = () => {
    console.log('=== PREVIEW BACK TO FORM DEBUG ===');
    console.log('Navigating back to form...');

    // Check if data still exists in sessionStorage before navigating
    const savedFormData = sessionStorage.getItem('projectFormData');
    const savedShowcaseSections = sessionStorage.getItem(
      'projectShowcaseSections'
    );

    console.log('Data preservation check:');
    console.log('- projectFormData still exists:', !!savedFormData);
    console.log(
      '- projectShowcaseSections still exists:',
      !!savedShowcaseSections
    );

    // Quay lại trang create hoặc edit
    const isEdit = router.query.mode === 'edit';
    const projectId = router.query.id;

    if (isEdit && projectId) {
      console.log('Navigating to edit mode for project:', projectId);
      router.push(`/admin/projects/${projectId}/edit`);
    } else {
      console.log('Navigating to create mode');
      router.push('/admin/projects/create');
    }
    console.log('=== END PREVIEW BACK TO FORM DEBUG ===');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Preview Dự án">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Đang tải preview...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!formData) {
    return (
      <AdminLayout title="Preview Dự án">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Không có dữ liệu để preview
            </h1>
            <p className="mb-8 text-gray-600">
              Vui lòng quay lại form để nhập dữ liệu dự án.
            </p>
            <button
              onClick={() => {
                handleBackToForm();
              }}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Quay lại Form
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Preview - ${formData.title || 'Dự án'}`}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="content-wrapper">
            <div className="flex min-h-16 items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    handleBackToForm();
                  }}
                  className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Quay lại Form</span>
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Preview Dự án
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="w-full">
          <ProjectPreviewContent
            formData={formData}
            showcaseSections={showcaseSections}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
