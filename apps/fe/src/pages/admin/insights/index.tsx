'use client';

import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import AuthLayout from '@/components/auth/AuthLayout';
import { getStrapiMediaUrl } from '@/utils/helper';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

interface Insight {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  status: string;
  featured: boolean;
  thumbnail?: {
    url: string;
    name: string;
  } | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInsights() {
  const router = useRouter();

  // client-side state
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleCreateInsight = () => {
    router.push('/admin/insights/create');
  };

  const handleEditInsight = (insight: Insight) => {
    router.push(`/admin/insights/${insight.slug}/edit`);
  };

  const handleBack = () => router.push('/');

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setClientError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/insights?populate=*&sort=createdAt:desc`,
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

        const fetched: Insight[] = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          slug: item.slug,
          status: item.status,
          featured: item.featured,
          thumbnail: item.thumbnail,
          category: item.category,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setInsights(fetched);
      } catch (err) {
        console.error('Error fetching insights (client):', err);
        setClientError(
          'Không thể tải danh sách insights. Vui lòng thử lại sau.'
        );
      } finally {
        setLoading(false);
      }
    };

    // always fetch on client mount to get latest data
    fetchInsights();
  }, []);

  return (
    <AuthLayout
      title="Quản lý Insights - Admin"
      description="Trang quản lý insights - tạo, chỉnh sửa và quản lý các bài viết insights"
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
                  {'Quản lý Insights'}
                </h1>
              </div>

              {/* Desktop actions */}
              <div className="hidden items-center space-x-3 sm:flex">
                <button
                  onClick={handleCreateInsight}
                  className="bg-brand-orange hover:bg-brand-orange-dark inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none"
                >
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Tạo insight mới
                </button>
              </div>
            </div>

            {/* Mobile stacked actions */}
            <div className="mt-2 flex flex-col space-y-2 pb-2 sm:hidden">
              <button
                onClick={handleCreateInsight}
                className="bg-brand-orange hover:bg-brand-orange-dark inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none"
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Tạo insight mới
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 pt-6">
          <div className="content-wrapper">
            {/* Insights List */}
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
                  </div>
                ) : clientError ? (
                  <div className="py-12 text-center">
                    <h3 className="text-sm font-medium text-gray-900">Lỗi</h3>
                    <p className="mt-1 text-sm text-gray-500">{clientError}</p>
                  </div>
                ) : insights.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <PlusIcon className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Chưa có insight nào
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Bắt đầu bằng cách tạo insight đầu tiên của bạn.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleCreateInsight}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <PlusIcon className="mr-2 h-5 w-5" />
                        Tạo insight mới
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {insights.map((insight) => (
                      <li key={insight.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between gap-16">
                            <div className="flex flex-1 items-center">
                              <div className="flex-shrink-0">
                                {insight.thumbnail ? (
                                  <div className="h-10 w-10 overflow-hidden rounded-full">
                                    <img
                                      src={
                                        getStrapiMediaUrl(insight.thumbnail) ||
                                        ''
                                      }
                                      alt={insight.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="bg-brand-orange/10 flex h-10 w-10 items-center justify-center rounded-full">
                                    <span className="text-brand-orange font-medium">
                                      {insight.title.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900">
                                    {insight.title}
                                  </p>
                                  {insight.featured && (
                                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                      Nổi bật
                                    </span>
                                  )}
                                  <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    {insight.category}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center space-x-4">
                                  <p className="text-xs text-gray-500">
                                    {insight.excerpt}
                                  </p>
                                </div>
                                <div className="mt-1 flex items-center space-x-4">
                                  <span className="text-xs text-gray-400">
                                    /{insight.slug}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center space-x-2">
                              <button
                                onClick={() =>
                                  window.open(
                                    `/insight/${insight.slug}`,
                                    '_blank'
                                  )
                                }
                                className="text-gray-400 hover:text-gray-600"
                                title="Xem insight"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleEditInsight(insight)}
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

AdminInsights.getLayout = (page: React.ReactElement) => <>{page}</>;
