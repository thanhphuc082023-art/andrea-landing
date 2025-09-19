import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import { type InsightFormData } from '@/lib/validations/insight';
import { useEffect } from 'react';
import {
  BasicInfoSection,
  ContentSection,
  AuthorSection,
  MediaSection,
  SeoSection as InsightSeoSection,
  useInsightForm,
} from './forms/insight';

interface InsightFormPageProps {
  onSubmit: (data: InsightFormData) => void;
  initialData?: Partial<InsightFormData>;
  isLoading?: boolean;
  title?: string;
}

export default function InsightFormPage({
  onSubmit,
  initialData,
  isLoading = false,
  title = 'Tạo Insight Mới',
}: InsightFormPageProps) {
  const router = useRouter();
  const form = useInsightForm(initialData);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const sections = [
    {
      title: 'Thông tin cơ bản',
      component: (
        <BasicInfoSection
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
    {
      title: 'Nội dung',
      component: (
        <ContentSection
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
    {
      title: 'Tác giả',
      component: (
        <AuthorSection
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
    {
      title: 'Hình ảnh',
      component: (
        <MediaSection
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
    {
      title: 'SEO',
      component: (
        <InsightSeoSection
          register={register}
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
  ];

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="content-wrapper">
          <div className="max-sd:h-[60px] flex h-[65px] items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm sm:inline">Quay lại</span>
              </button>
              <div className="hidden h-6 w-px bg-gray-300 sm:block" />
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                form="insight-form"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit(onSubmit as any)();
                }}
                className="bg-brand-orange hover:bg-brand-orange-dark flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu Insight</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="content-wrapper py-8">
        <form
          id="insight-form"
          onSubmit={handleSubmit(onSubmit as any)}
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow">
              {section.component}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
