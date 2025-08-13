import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Project {
  id: number;
  title: string;
  description: string;
  slug: string;
  status: string;
  featured: boolean;
  thumbnail?: {
    url: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refresh projects when returning from form pages
  useEffect(() => {
    const handleFocus = () => {
      fetchProjects();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    router.push('/admin/projects/create');
  };

  const handleUpdateProject = (project: Project) => {
    router.push(`/admin/projects/${project.id}/edit`);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditProject = (project: Project) => {
    router.push(`/admin/projects/${project.id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
      'in-progress': {
        label: 'Đang thực hiện',
        color: 'bg-yellow-100 text-yellow-800',
      },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="mt-[65px] flex min-h-screen items-center justify-center bg-gray-50 max-md:mt-[60px]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[65px] min-h-screen bg-gray-50 max-md:mt-[60px]">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Dự án
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Tạo, chỉnh sửa và quản lý các dự án của bạn
              </p>
            </div>
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Tạo dự án mới
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="px-4 sm:px-0">
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            {projects.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <PlusIcon className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Chưa có dự án nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bắt đầu bằng cách tạo dự án đầu tiên của bạn.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateProject}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Tạo dự án mới
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {project.thumbnail ? (
                              <div className="h-10 w-10 overflow-hidden rounded-full">
                                <Image
                                  src={project.thumbnail.url}
                                  alt={project.title}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                <span className="font-medium text-indigo-600">
                                  {project.title.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {project.title}
                              </p>
                              {project.featured && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                  Nổi bật
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {project.description}
                            </p>
                            <div className="mt-1 flex items-center space-x-4">
                              <span className="text-xs text-gray-400">
                                /{project.slug}
                              </span>
                              {getStatusBadge(project.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              window.open(`/project/${project.slug}`, '_blank')
                            }
                            className="text-gray-400 hover:text-gray-600"
                            title="Xem dự án"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-400 hover:text-red-600"
                            title="Xóa"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
