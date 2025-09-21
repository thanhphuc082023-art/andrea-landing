import { useEffect, useState } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  Control,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { type InsightFormData } from '@/lib/validations/insight';
import clsx from 'clsx';
import { getStrapiMediaUrl } from '@/utils/helper';

interface MediaSectionProps {
  register: UseFormRegister<InsightFormData>;
  watch: UseFormWatch<InsightFormData>;
  control: any;
  errors: any;
  setValue: UseFormSetValue<InsightFormData>;
}

export default function MediaSection({
  register,
  watch,
  control,
  errors,
  setValue,
}: MediaSectionProps) {
  const [heroDesktopPreview, setHeroDesktopPreview] = useState<string | null>(
    null
  );
  const [heroMobilePreview, setHeroMobilePreview] = useState<string | null>(
    null
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const heroImage = watch('hero');
  const thumbnail = watch('thumbnail');

  // Helper function để kiểm tra kích thước file (3MB = 3 * 1000 * 1000 bytes)
  const validateFileSize = (file: File): boolean => {
    console.log('file.size', file.size);
    const maxSize = 3 * 1000 * 1000; // 3MB in bytes
    return file.size <= maxSize;
  };

  // Helper function để tạo preview từ file
  const createFilePreview = (
    file: File,
    setPreview: (preview: string) => void
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (heroImage?.desktop?.file) {
      createFilePreview(heroImage.desktop.file, setHeroDesktopPreview);
    }
  }, [heroImage?.desktop?.file]);

  useEffect(() => {
    if (heroImage?.mobile?.file) {
      createFilePreview(heroImage.mobile.file, setHeroMobilePreview);
    }
  }, [heroImage?.mobile?.file]);

  useEffect(() => {
    if (thumbnail?.file) {
      createFilePreview(thumbnail.file, setThumbnailPreview);
    }
  }, [thumbnail?.file]);

  const handleHeroImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'desktop' | 'mobile'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous error
      setFileSizeError(null);

      // Validate file size
      if (!validateFileSize(file)) {
        setFileSizeError(`Kích thước tối đa là 3MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'desktop') {
          setHeroDesktopPreview(e.target?.result as string);
        } else {
          setHeroMobilePreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Set form values
      setValue(`hero.${type}.file`, file);
      setValue(`hero.${type}.name`, file.name);
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous error
      setFileSizeError(null);

      // Validate file size
      if (!validateFileSize(file)) {
        setFileSizeError(`Kích thước tối đa là 3MB`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Set form values
      setValue('thumbnail.file', file);
      setValue('thumbnail.name', file.name);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <PhotoIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Hình ảnh & Media
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Thêm hình ảnh hero và thumbnail cho insight
            </p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <label className="mb-4 flex items-center text-sm font-semibold text-gray-800">
          <PhotoIcon className="mr-2 h-4 w-4 text-gray-500" />
          Hình ảnh Hero *
        </label>

        {/* Hero Image Upload */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Desktop Hero */}
          <label
            htmlFor="hero-desktop-upload"
            className={clsx(
              'relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-100',
              heroDesktopPreview || heroImage?.desktop?.url
                ? 'border-blue-300 p-0'
                : 'border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50'
            )}
          >
            {heroDesktopPreview || heroImage?.desktop?.url ? (
              <div className="relative w-full">
                <img
                  src={
                    heroDesktopPreview || getStrapiMediaUrl(heroImage?.desktop)
                  }
                  alt="Desktop hero preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setHeroDesktopPreview(null);
                    setValue('hero.desktop.url', '');
                    setValue('hero.desktop.name', '');
                  }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  ×
                </button>
                <input
                  id="hero-desktop-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroImageChange(e, 'desktop')}
                  className="hidden"
                />
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-8 w-8 text-blue-400" />
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Desktop Hero
                    </span>
                    <input
                      id="hero-desktop-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageChange(e, 'desktop')}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Khuyến nghị: 1200x600px, tối đa 3MB
                  </p>
                </div>
              </label>
            )}
          </label>

          {/* Mobile Hero */}
          <label
            htmlFor="hero-mobile-upload"
            className={clsx(
              'relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-100',
              heroMobilePreview || heroImage?.mobile?.url
                ? 'border-blue-300 p-0'
                : 'border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50'
            )}
          >
            {heroMobilePreview || heroImage?.mobile?.url ? (
              <div className="relative w-full">
                <img
                  src={
                    heroMobilePreview || getStrapiMediaUrl(heroImage?.mobile)
                  }
                  alt="Mobile hero preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setHeroMobilePreview(null);
                    setValue('hero.mobile.url', '');
                    setValue('hero.mobile.name', '');
                  }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  ×
                </button>
                <input
                  id="hero-mobile-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroImageChange(e, 'mobile')}
                  className="hidden"
                />
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-8 w-8 text-blue-400" />
                  <div className="mt-2">
                    <span className="text-sm font-semibold text-gray-800">
                      Mobile Hero
                    </span>
                    <input
                      id="hero-mobile-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageChange(e, 'mobile')}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Khuyến nghị: 600x800px, tối đa 3MB
                  </p>
                </div>
              </label>
            )}
          </label>
        </div>

        {/* File Size Error Message */}
        {fileSizeError && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {fileSizeError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Image URLs */}
        {/* <label
          htmlFor="heroDesktopUrl"
          className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <div>
            <label
              htmlFor="heroDesktopUrl"
              className="block text-sm font-medium text-gray-700"
            >
              URL Desktop Hero
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="heroDesktopUrl"
                {...register('hero.desktop.url')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com/desktop-hero.jpg"
              />
              {errors.hero?.desktop?.url && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.hero.desktop.url.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="heroMobileUrl"
              className="block text-sm font-medium text-gray-700"
            >
              URL Mobile Hero
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="heroMobileUrl"
                {...register('hero.mobile.url')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com/mobile-hero.jpg"
              />
              {errors.hero?.mobile?.url && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.hero.mobile.url.message}
                </p>
              )}
            </div>
          </div>
        </label>

        {errors.hero && (
          <p className="mt-1 text-sm text-red-600">{errors.hero.message}</p>
        )} */}
      </div>

      {/* Thumbnail */}
      <div>
        <label className="mb-4 flex items-center text-sm font-semibold text-gray-800">
          <PhotoIcon className="mr-2 h-4 w-4 text-gray-500" />
          Thumbnail
        </label>

        {/* Thumbnail Upload */}
        <label
          htmlFor="thumbnail-upload"
          className={clsx(
            'relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-100',
            thumbnailPreview || thumbnail?.url
              ? 'border-blue-300 p-0'
              : 'border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50'
          )}
        >
          {thumbnailPreview || thumbnail?.url ? (
            <div className="relative w-full">
              <img
                src={thumbnailPreview || getStrapiMediaUrl(thumbnail)}
                alt="Thumbnail preview"
                className="h-48 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailPreview(null);
                  setValue('thumbnail.url', '');
                  setValue('thumbnail.name', '');
                }}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                ×
              </button>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-8 w-8 text-blue-400" />
                <div className="mt-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Chọn Thumbnail
                  </span>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF tối đa 3MB. Khuyến nghị: 800x400px
                </p>
              </div>
            </label>
          )}
        </label>

        {/* Thumbnail URL */}
        {/* <div className="mt-4">
          <label
            htmlFor="thumbnailUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Hoặc nhập URL thumbnail
          </label>
          <div className="mt-1">
            <input
              type="url"
              id="thumbnailUrl"
              {...register('thumbnail.url')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://example.com/thumbnail.jpg"
            />
            {errors.thumbnail?.url && (
              <p className="mt-1 text-sm text-red-600">
                {errors.thumbnail.url.message}
              </p>
            )}
          </div>
        </div> */}

        {errors.thumbnail && (
          <p className="mt-2 flex items-center text-sm text-red-600">
            <span className="mr-1">⚠️</span>
            {errors.thumbnail.message}
          </p>
        )}
      </div>
    </div>
  );
}
