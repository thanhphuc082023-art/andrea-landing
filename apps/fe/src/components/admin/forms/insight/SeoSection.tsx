import { useState } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  Control,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { CogIcon, DocumentTextIcon, TagIcon, LinkIcon, PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { type InsightFormData } from '@/lib/validations/insight';

interface SeoSectionProps {
  register: UseFormRegister<InsightFormData>;
  watch: UseFormWatch<InsightFormData>;
  control: any;
  errors: FieldErrors<InsightFormData>;
  setValue: UseFormSetValue<InsightFormData>;
}

export default function SeoSection({
  register,
  watch,
  control,
  errors,
  setValue,
}: SeoSectionProps) {
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
  const [twitterImagePreview, setTwitterImagePreview] = useState<string | null>(
    null
  );

  const seo = watch('seo');
  const title = watch('title');
  const excerpt = watch('excerpt');

  const handleOgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setOgImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Set form values
      setValue('seo.ogImage.file', file);
      setValue('seo.ogImage.name', file.name);
    }
  };

  const handleTwitterImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setTwitterImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Set form values
      setValue('seo.twitterImage.file', file);
      setValue('seo.twitterImage.name', file.name);
    }
  };

  const autoFillSeo = () => {
    if (title) {
      setValue('seo.metaTitle', title);
      setValue('seo.ogTitle', title);
      setValue('seo.twitterTitle', title);
    }
    if (excerpt) {
      setValue('seo.metaDescription', excerpt);
      setValue('seo.ogDescription', excerpt);
      setValue('seo.twitterDescription', excerpt);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CogIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                SEO & Social Media
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Tối ưu hóa SEO và chia sẻ mạng xã hội
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={autoFillSeo}
            className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
          >
            Tự động điền
          </button>
        </div>
      </div>

      {/* Basic SEO */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5 text-gray-500" />
          <h4 className="text-lg font-semibold text-gray-800">SEO cơ bản</h4>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Meta Title */}
          <div>
            <label
              htmlFor="metaTitle"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              Meta Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="metaTitle"
                {...register('seo.metaTitle')}
                className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none ${
                  errors.seo?.metaTitle
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
                placeholder="Tiêu đề SEO (khuyến nghị 50-60 ký tự)"
                maxLength={60}
              />
              {errors.seo?.metaTitle && (
                <p className="mt-2 flex items-center text-sm text-red-600">
                  <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
                  {errors.seo.metaTitle.message}
                </p>
              )}
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label
              htmlFor="metaDescription"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              Meta Description
            </label>
            <div className="mt-2">
              <textarea
                id="metaDescription"
                rows={3}
                {...register('seo.metaDescription')}
                className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none resize-none ${
                  errors.seo?.metaDescription
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
                placeholder="Mô tả SEO (khuyến nghị 150-160 ký tự)"
                maxLength={160}
              />
              {errors.seo?.metaDescription && (
                <p className="mt-2 flex items-center text-sm text-red-600">
                  <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
                  {errors.seo.metaDescription.message}
                </p>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label
              htmlFor="keywords"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
              Keywords (phân cách bằng dấu phẩy)
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="keywords"
                className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="thiết kế bao bì, branding, marketing"
                onChange={(e) => {
                  const keywords = e.target.value
                    .split(',')
                    .map((k) => k.trim())
                    .filter((k) => k);
                  setValue('seo.keywords', keywords);
                }}
              />
            </div>
          </div>

          {/* Canonical URL */}
          <div>
            <label
              htmlFor="canonicalUrl"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
              Canonical URL
            </label>
            <div className="mt-2">
              <input
                type="url"
                id="canonicalUrl"
                {...register('seo.canonicalUrl')}
                className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none ${
                  errors.seo?.canonicalUrl
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
                placeholder="https://example.com/insights/slug"
              />
              {errors.seo?.canonicalUrl && (
                <p className="mt-2 flex items-center text-sm text-red-600">
                  <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
                  {errors.seo.canonicalUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <PhotoIcon className="h-5 w-5 text-gray-500" />
          <h4 className="text-lg font-semibold text-gray-800">
            Open Graph (Facebook)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* OG Title */}
          <div>
            <label
              htmlFor="ogTitle"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              OG Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="ogTitle"
                {...register('seo.ogTitle')}
                className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Tiêu đề khi chia sẻ Facebook"
              />
            </div>
          </div>

          {/* OG Description */}
          <div>
            <label
              htmlFor="ogDescription"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              OG Description
            </label>
            <div className="mt-2">
              <textarea
                id="ogDescription"
                rows={2}
                {...register('seo.ogDescription')}
                className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="Mô tả khi chia sẻ Facebook"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Twitter */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <PhotoIcon className="h-5 w-5 text-gray-500" />
          <h4 className="text-lg font-semibold text-gray-800">Twitter Cards</h4>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Twitter Title */}
          <div>
            <label
              htmlFor="twitterTitle"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              Twitter Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="twitterTitle"
                {...register('seo.twitterTitle')}
                className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Tiêu đề khi chia sẻ Twitter"
              />
            </div>
          </div>

          {/* Twitter Description */}
          <div>
            <label
              htmlFor="twitterDescription"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              Twitter Description
            </label>
            <div className="mt-2">
              <textarea
                id="twitterDescription"
                rows={2}
                {...register('seo.twitterDescription')}
                className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="Mô tả khi chia sẻ Twitter"
              />
            </div>
          </div>

          {/* Twitter Card Type */}
          <div>
            <label
              htmlFor="twitterCard"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
              Twitter Card Type
            </label>
            <div className="mt-2">
              <div className="relative">
                <select
                  id="twitterCard"
                  {...register('seo.twitterCard')}
                  className="block w-full appearance-none rounded-lg border-2 border-gray-200 bg-white pl-4 pr-10 py-3 text-sm transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" className="text-gray-400">Chọn loại card</option>
                  <option value="summary" className="text-gray-900">📄 Summary</option>
                  <option value="summary_large_image" className="text-gray-900">🖼️ Summary Large Image</option>
                  <option value="app" className="text-gray-900">📱 App</option>
                  <option value="player" className="text-gray-900">▶️ Player</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <CogIcon className="h-5 w-5 text-gray-500" />
          <h4 className="text-lg font-semibold text-gray-800">Nâng cao</h4>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Meta Robots */}
          <div>
            <label
              htmlFor="metaRobots"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <CogIcon className="mr-2 h-4 w-4 text-gray-500" />
              Meta Robots
            </label>
            <div className="mt-2">
              <div className="relative">
                <select
                  id="metaRobots"
                  {...register('seo.metaRobots')}
                  className="block w-full appearance-none rounded-lg border-2 border-gray-200 bg-white pl-4 pr-10 py-3 text-sm transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" className="text-gray-400">Mặc định</option>
                  <option value="index, follow" className="text-gray-900">🔍 Index, Follow</option>
                  <option value="noindex, follow" className="text-gray-900">🚫 No Index, Follow</option>
                  <option value="index, nofollow" className="text-gray-900">📄 Index, No Follow</option>
                  <option value="noindex, nofollow" className="text-gray-900">⛔ No Index, No Follow</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Schema Markup */}
          <div>
            <label
              htmlFor="schemaMarkup"
              className="flex items-center text-sm font-semibold text-gray-800"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4 text-gray-500" />
              Schema Markup (JSON-LD)
            </label>
            <div className="mt-2">
              <textarea
                id="schemaMarkup"
                rows={6}
                {...register('seo.schemaMarkup')}
                className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-mono transition-colors duration-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {
    "@type": "Person",
    "name": "..."
  }
}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
