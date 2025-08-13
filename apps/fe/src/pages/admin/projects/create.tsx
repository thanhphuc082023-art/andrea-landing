import { useState } from 'react';
import { useRouter } from 'next/router';
import ProjectFormPage from '@/components/admin/ProjectFormPage';
import AdminLayout from '@/components/admin/AdminLayout';
import { type ProjectFormData } from '@/lib/validations/project';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to create project
      console.log('Creating project:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to projects list or project detail
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Tạo dự án mới">
      <ProjectFormPage onSubmit={handleSubmit} isLoading={isLoading} />
    </AdminLayout>
  );
}
