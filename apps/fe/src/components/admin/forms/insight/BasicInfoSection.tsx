import {
  UseFormRegister,
  UseFormWatch,
  Control,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import {
  type InsightFormData,
  INSIGHT_CATEGORIES,
} from '@/lib/validations/insight';
import {
  DocumentTextIcon,
  LinkIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  StarIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

interface BasicInfoSectionProps {
  register: UseFormRegister<InsightFormData>;
  watch: UseFormWatch<InsightFormData>;
  control: any;
  errors: FieldErrors<InsightFormData>;
  setValue: UseFormSetValue<InsightFormData>;
}

export default function BasicInfoSection({
  register,
  watch,
  control,
  errors,
  setValue,
}: BasicInfoSectionProps) {
  const status = watch('status');
  const featured = watch('featured');

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Thông tin cơ bản
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Nhập thông tin cơ bản cho insight của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Title */}
        <div className="lg:col-span-2">
          <label
            htmlFor="title"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
            Tiêu đề *
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              {...register('title')}
              className={`block w-full rounded-lg border-2 px-4 py-3 text-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none ${
                errors.title
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
              placeholder="Nhập tiêu đề insight của bạn..."
            />
            {errors.title && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-1">⚠️</span>
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
            Slug (URL)
          </label>
          <div className="mt-2">
            <div className="relative">
              <input
                type="text"
                id="slug"
                {...register('slug')}
                className={`block w-full rounded-lg border-2 px-4 py-3 text-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none ${
                  errors.slug
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
                placeholder="slug-tu-dong-tao"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-400">.html</span>
              </div>
            </div>
            {errors.slug && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-1">⚠️</span>
                {errors.slug.message}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
            Danh mục *
          </label>
          <div className="mt-2">
            <div className="relative">
              <select
                id="category"
                {...register('category')}
                className={`block w-full appearance-none rounded-lg border-2 pl-4 pr-10 py-3 text-sm transition-colors duration-200 focus:outline-none ${
                  errors.category
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              >
              <option value="" className="text-gray-400">
                Chọn danh mục...
              </option>
              {INSIGHT_CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="text-gray-900"
                >
                  {category}
                </option>
              ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.category && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-1">⚠️</span>
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="lg:col-span-2">
          <label
            htmlFor="excerpt"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <ChatBubbleLeftRightIcon className="mr-2 h-4 w-4 text-gray-500" />
            Tóm tắt *
          </label>
          <div className="mt-2">
            <textarea
              id="excerpt"
              rows={4}
              {...register('excerpt')}
              className={`block w-full resize-none rounded-lg border-2 px-4 py-3 text-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none ${
                errors.excerpt
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
              placeholder="Nhập tóm tắt ngắn gọn về insight của bạn. Điều này sẽ hiển thị trong danh sách insights..."
            />
            {errors.excerpt && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-1">⚠️</span>
                {errors.excerpt.message}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <EyeIcon className="mr-2 h-4 w-4 text-gray-500" />
            Trạng thái
          </label>
          <div className="mt-2">
            <div className="relative">
              <select
                id="status"
                {...register('status')}
                className="block w-full appearance-none rounded-lg border-2 border-gray-200 bg-white pl-4 pr-10 py-3 text-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
              <option value="draft" className="text-gray-900">
                📝 Bản nháp
              </option>
              <option value="published" className="text-gray-900">
                ✅ Đã xuất bản
              </option>
              <option value="archived" className="text-gray-900">
                📦 Lưu trữ
              </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="flex flex-col">
          <div className="shrink-0">
            <label
              htmlFor="featured"
              className="flex cursor-pointer items-center text-sm font-semibold text-gray-800"
              onClick={() => setValue('featured', !featured)}
            >
              <StarIcon className="mr-2 h-4 w-4 text-yellow-500" />
              Insight nổi bật
            </label>
          </div>
          <div className="mt-2 flex flex-1 items-center">
            <button
              type="button"
              role="switch"
              aria-checked={featured}
              onClick={() => setValue('featured', !featured)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
                featured ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  featured ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Collection Info */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border-2 border-gray-100 bg-gray-50 p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                <FolderIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Thông tin bộ sưu tập
                </h4>
                <p className="text-xs text-gray-600">
                  Cấu hình thông tin bộ sưu tập cho insight
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="collectionName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên bộ sưu tập
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="collectionName"
                    {...register('collectionName')}
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    placeholder="Góc nhìn của Andrea"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="collectionHref"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link bộ sưu tập
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="collectionHref"
                    {...register('collectionHref')}
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 transition-colors duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    placeholder="/insights"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
