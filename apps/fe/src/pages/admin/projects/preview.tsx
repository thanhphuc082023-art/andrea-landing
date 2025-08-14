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
    // Lấy data từ sessionStorage hoặc localStorage
    const savedFormData = sessionStorage.getItem('projectFormData');
    const savedShowcaseSections = sessionStorage.getItem(
      'projectShowcaseSections'
    );

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }

    if (savedShowcaseSections) {
      try {
        const parsedSections = JSON.parse(savedShowcaseSections);
        setShowcaseSections(parsedSections);
      } catch (error) {
        console.error('Error parsing showcase sections:', error);
      }
    }

    setIsLoading(false);
  }, []);

  const handleBackToForm = () => {
    // Quay lại trang create hoặc edit
    const isEdit = router.query.mode === 'edit';
    const projectId = router.query.id;

    if (isEdit && projectId) {
      router.push(`/admin/projects/${projectId}/edit`);
    } else {
      router.push('/admin/projects/create');
    }
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
