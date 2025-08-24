import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getStrapiMediaUrl } from '@/utils/helper';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

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

interface AdminProjectsPageProps extends PagePropsWithGlobal {
  initialProjects: Project[];
  error?: string;
}

export default function AdminProjects({
  initialProjects,
  error,
}: AdminProjectsPageProps) {
  const router = useRouter();

  // client-side state
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleCreateProject = () => {
    router.push('/admin/projects/create');
  };

  const handleEditProject = (project: Project) => {
    router.push(`/admin/projects/${project.slug}/edit`);
  };

  const handleBack = () => router.push('/');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setClientError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects?populate=*&sort=createdAt:desc`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const fetched: Project[] = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          slug: item.slug,
          status: item.projectStatus,
          featured: item.featured,
          thumbnail: item.thumbnail,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setProjects(fetched);
      } catch (err) {
        console.error('Error fetching projects (client):', err);
        setClientError('Không thể tải danh sách dự án. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    // always fetch on client mount to get latest data
    fetchProjects();
  }, []);

  if (error) {
    return (
      <>
        <Head>
          <title>Lỗi - Quản lý Dự án - Admin</title>
          <meta
            name="description"
            content="Có lỗi xảy ra khi tải trang quản lý dự án"
          />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="mt-[65px] flex min-h-screen items-center justify-center bg-gray-50 max-md:mt-[60px]">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Lỗi</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <AuthLayout
      title="Quản lý Dự án - Admin"
      description="Trang quản lý dự án - tạo, chỉnh sửa và quản lý các dự án"
      backUrl="/"
      backText="Quay về trang chủ"
    >
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="content-wrapper">
            <div className="max-sd:h-[60px] flex h-[65px] items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span className="text-sm sm:inline">Quay về trang chủ</span>
                </button>
                <div className="hidden h-6 w-px bg-gray-300 sm:block" />
                <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  {'Quản lý Dự án'}
                </h1>
              </div>

              {/* Desktop actions */}
              <div className="hidden items-center space-x-3 sm:flex">
                <button
                  onClick={handleCreateProject}
                  className="bg-brand-orange hover:bg-brand-orange-dark inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none"
                >
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Tạo dự án mới
                </button>
              </div>
            </div>

            {/* Mobile stacked actions */}
            <div className="mt-2 flex flex-col space-y-2 pb-2 sm:hidden">
              <button
                onClick={handleCreateProject}
                className="bg-brand-orange hover:bg-brand-orange-dark inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none"
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Tạo dự án mới
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 pt-6">
          <div className="content-wrapper">
            {/* Projects List */}
            <div className="pb-6 sm:px-0">
              <div className="overflow-hidden rounded-md bg-white shadow">
                {loading ? (
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
                      Đang tải lên, vui lòng chờ...
                    </div>
                  </div>
                ) : clientError ? (
                  <div className="py-12 text-center">
                    <h3 className="text-sm font-medium text-gray-900">Lỗi</h3>
                    <p className="mt-1 text-sm text-gray-500">{clientError}</p>
                  </div>
                ) : projects.length === 0 ? (
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
                          <div className="flex items-center justify-between gap-16">
                            <div className="flex flex-1 items-center">
                              <div className="flex-shrink-0">
                                {project.thumbnail ? (
                                  <div className="h-10 w-10 overflow-hidden rounded-full">
                                    <Image
                                      src={
                                        getStrapiMediaUrl(project.thumbnail) ||
                                        ''
                                      }
                                      alt={project.title}
                                      width={40}
                                      height={40}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="bg-brand-orange/10 flex h-10 w-10 items-center justify-center rounded-full">
                                    <span className="text-brand-orange font-medium">
                                      {project.title.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
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
                                <div className="mt-1 flex items-center space-x-4">
                                  <span className="text-xs text-gray-400">
                                    /{project.slug}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center space-x-2">
                              <button
                                onClick={() =>
                                  window.open(
                                    `/project/${project.slug}`,
                                    '_blank'
                                  )
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
      </>
    </AuthLayout>
  );
}

AdminProjects.getLayout = (page: React.ReactElement) => <>{page}</>;
