import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectFormPage from '@/components/admin/ProjectFormPage';
import AdminLayout from '@/components/admin/AdminLayout';
import { type ProjectFormData } from '@/lib/validations/project';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  // Session cleanup on unmount
  const { cleanup } = useSessionCleanup(sessionCleanupConfigs.projectForm);

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] =
    useState<Partial<ProjectFormData> | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch project data
  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      // TODO: Implement API call to fetch project data
      console.log('Fetching project data for ID:', id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual API call
      const mockData: Partial<ProjectFormData> = {
        title: 'Sample Project',
        description: 'This is a sample project description',
        projectIntroTitle: 'Sample Intro Title',
        status: 'completed',
        featured: true,
        categoryId: 'web-development',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        projectMetaInfo: ['Client: Sample Client', 'Duration: 3 months'],
        credits: {
          title: 'Project Credits',
          date: '2024-01-15',
          projectManager: 'John Doe\nJane Smith',
        },
        seo: {
          title: 'Sample Project - SEO Title',
          description: 'Sample project SEO description',
          keywords: ['react', 'typescript', 'web development'],
        },
      };

      setInitialData(mockData);
    } catch (error) {
      console.error('Error fetching project data:', error);
      // TODO: Show error message and redirect
      router.push('/admin/projects');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update project
      console.log('Updating project:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to project detail or projects list
      router.push(`/admin/projects/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu dự án...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy dự án</p>
          <button
            onClick={() => {
              cleanup();
              router.push('/admin/projects');
            }}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Chỉnh sửa dự án">
      <ProjectFormPage
        onSubmit={handleSubmit}
        initialData={initialData}
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}
