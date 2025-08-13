import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { PlusIcon, XMarkIcon, EyeIcon } from '@heroicons/react/20/solid';
import { type ProjectFormData } from '@/lib/validations/project';
import ThumbnailPreviewPopover from './ThumbnailPreviewPopover';

interface HeroSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  projectMetaInfo: string[];
  newMetaInfo: string;
  setNewMetaInfo: (value: string) => void;
  addMetaInfo: () => void;
  removeMetaInfo: (info: string) => void;
}

export default function HeroSection({
  register,
  errors,
  setValue,
  watch,
  projectMetaInfo,
  newMetaInfo,
  setNewMetaInfo,
  addMetaInfo,
  removeMetaInfo,
}: HeroSectionProps) {
  const heroVideo = watch('heroVideo');
  const thumbnail = watch('thumbnail');
  const title = watch('title') || '';
  const description = watch('description') || '';

  const handleHeroVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Vui lòng chọn file video hợp lệ');
        return;
      }

      // Validate file size (100MB max)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('File video quá lớn. Kích thước tối đa là 100MB');
        return;
      }

      // Create object URL for preview
      const videoUrl = URL.createObjectURL(file);
      setValue('heroVideo', {
        file,
        url: videoUrl,
        name: file.name,
      });
    }
  };

  const removeHeroVideo = () => {
    setValue('heroVideo', undefined);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh hợp lệ');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File hình ảnh quá lớn. Kích thước tối đa là 5MB');
        return;
      }

      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setValue('thumbnail', {
        file,
        url: imageUrl,
        name: file.name,
      });
    }
  };

  const removeThumbnail = () => {
    setValue('thumbnail', undefined);
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
          <span className="text-sm font-bold text-white">1</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Thông tin Hero Section
        </h3>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Thông tin chính sẽ hiển thị ở phần đầu trang dự án
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Tiêu đề dự án <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="Nhập tiêu đề dự án..."
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thông tin meta <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMetaInfo}
              onChange={(e) => setNewMetaInfo(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addMetaInfo())
              }
              placeholder="Nhập thông tin meta..."
              className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addMetaInfo}
              className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {projectMetaInfo.map((info) => (
              <span
                key={info}
                className="inline-flex items-center rounded-full bg-blue-100/80 px-2.5 py-0.5 text-xs font-medium text-blue-800 backdrop-blur-sm"
              >
                {info}
                <button
                  type="button"
                  onClick={() => removeMetaInfo(info)}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mỗi thông tin sẽ được hiển thị như một dòng riêng biệt trong hero
            section
          </p>
        </div>

        <div>
          <label
            htmlFor="projectIntroTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Tiêu đề giới thiệu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('projectIntroTitle')}
            placeholder="Nhập tiêu đề giới thiệu..."
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.projectIntroTitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.projectIntroTitle.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả dự án (Hero) <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Mô tả ngắn gọn về dự án cho hero section..."
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Thumbnail <span className="text-red-500">*</span>
            {thumbnail && (
              <ThumbnailPreviewPopover
                thumbnailUrl={thumbnail.url}
                title={title}
                description={description}
              >
                <button
                  type="button"
                  className="ml-2 inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
                >
                  <EyeIcon className="mr-1 h-3 w-3" />
                  Xem preview
                </button>
              </ThumbnailPreviewPopover>
            )}
          </label>
          <div className="mt-1">
            {thumbnail ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                  <span className="text-sm text-gray-700">
                    {thumbnail.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Hình ảnh sẽ hiển thị trong danh sách dự án. Hỗ trợ: JPG, PNG, WebP.
            Kích thước tối đa: 5MB
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video Hero (Background)
          </label>
          <div className="mt-1">
            {heroVideo ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                  <span className="text-sm text-gray-700">
                    {heroVideo.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeHeroVideo}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="video/*"
                onChange={handleHeroVideoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Hỗ trợ: MP4, WebM, MOV. Kích thước tối đa: 100MB
          </p>
        </div>
      </div>
    </div>
  );
}
