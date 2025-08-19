import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getStrapiMediaUrl } from '@/utils/helper';

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

  const handleCreateProject = () => {
    router.push('/admin/projects/create');
  };

  const handleEditProject = (project: Project) => {
    router.push(`/admin/projects/${project.slug}/edit`);
  };

  // const getStatusBadge = (status: string) => {
  //   const statusConfig = {
  //     draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
  //     'in-progress': {
  //       label: 'Đang thực hiện',
  //       color: 'bg-yellow-100 text-yellow-800',
  //     },
  //     completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  //   };

  //   const config =
  //     statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  //   return (
  //     <span
  //       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
  //     >
  //       {config.label}
  //     </span>
  //   );
  // };

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
    <>
      <Head>
        <title>Quản lý Dự án - Admin</title>
        <meta
          name="description"
          content="Trang quản lý dự án - tạo, chỉnh sửa và quản lý các dự án"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="mt-[65px] min-h-screen bg-gray-50 max-md:mt-[60px]">
        <div className="content-wrapper">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý Dự án
                </h1>
                {/* <p className="mt-2 text-sm text-gray-600">
                  Tạo, chỉnh sửa và quản lý các dự án của bạn
                </p> */}
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
          <div className="px-4 pb-6 sm:px-0">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              {initialProjects.length === 0 ? (
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
                  {initialProjects.map((project) => (
                    <li key={project.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-16">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {project.thumbnail ? (
                                <div className="h-10 w-10 overflow-hidden rounded-full">
                                  <Image
                                    src={
                                      getStrapiMediaUrl(project.thumbnail) || ''
                                    }
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
                              <p className="line-clamp-2 text-sm text-gray-500">
                                {project.description}
                              </p>
                              <div className="mt-1 flex items-center space-x-4">
                                <span className="text-xs text-gray-400">
                                  /{project.slug}
                                </span>
                                {/* {getStatusBadge(project.status)} */}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
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
  );
}

export const getStaticProps: GetStaticProps<
  AdminProjectsPageProps
> = async () => {
  return getStaticPropsWithGlobalAndData(async () => {
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

      const projects: Project[] = data.data.map((item: any) => ({
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

      return {
        initialProjects: projects,
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return {
        initialProjects: [],
        error: 'Không thể tải danh sách dự án. Vui lòng thử lại sau.',
      };
    }
  });
};
