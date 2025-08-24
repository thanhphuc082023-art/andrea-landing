import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { PlusIcon, XMarkIcon, EyeIcon } from '@heroicons/react/20/solid';
import { type ProjectFormData } from '@/lib/validations/project';
import ThumbnailPreviewPopover from './ThumbnailPreviewPopover';
import SimpleFileUploader from './SimpleFileUploader';

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
  onLogout?: () => void;
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
  onLogout,
}: HeroSectionProps) {
  const heroVideo = watch('heroVideo');
  const heroBanner = watch('heroBanner');
  const thumbnail = watch('thumbnail');
  const title = watch('title') || '';
  const description = watch('description') || '';

  const removeHeroVideo = () => {
    setValue('heroVideo', undefined);
  };

  const removeHeroBanner = () => {
    setValue('heroBanner', undefined);
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
            onKeyDown={(e) => {
              if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                // Focus vào file input của thumbnail
                setTimeout(() => {
                  const thumbnailInput = document.querySelector(
                    'input[type="file"][accept*="image"]'
                  ) as HTMLInputElement;
                  if (thumbnailInput) {
                    // Focus vào label thay vì input ẩn
                    const label = thumbnailInput.closest(
                      'label'
                    ) as HTMLLabelElement;
                    if (label) {
                      label.focus();
                    }
                  }
                }, 0);
              }
            }}
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
                  <div className="flex items-center space-x-2">
                    {thumbnail.url ? (
                      <div
                        style={{
                          backgroundImage: `url(${thumbnail.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        className="h-8 w-12 shrink-0 rounded border border-gray-200"
                        title={`Preview: ${thumbnail.name || 'thumbnail'}`}
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-100">
                        <span className="text-xs text-gray-400">📷</span>
                      </div>
                    )}
                    <span className="block max-w-[12rem] flex-1 truncate text-sm text-gray-700">
                      {thumbnail.name || thumbnail.fileName}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {thumbnail.uploadId ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        ✓ Đã tải lên
                      </span>
                    ) : thumbnail.file ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Sẵn sàng
                      </span>
                    ) : thumbnail.url ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Đã có
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <SimpleFileUploader
                onFileSelect={(file) => {
                  // Only create blob URL for preview, don't upload immediately
                  setValue('thumbnail', {
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                  });
                }}
                onFileRemove={removeThumbnail}
                selectedFile={thumbnail?.file}
                acceptedTypes={['image/*']}
                maxFileSize={5 * 1024 * 1024} // 5MB
                label="Tải lên thumbnail"
                description="Chọn thumbnail cho dự án (JPG, PNG, WebP) - Tối đa 5MB"
                onLogout={onLogout}
                // Remove onUploadComplete to disable immediate upload
                data-testid="thumbnail-uploader"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video Hero (Background)
          </label>
          <div className="mt-1">
            {heroVideo ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    {heroVideo.url && (
                      <video
                        src={heroVideo.url}
                        className="h-8 w-12 rounded object-cover"
                        muted
                      />
                    )}
                    <span className="block max-w-[12rem] truncate text-sm text-gray-700">
                      {heroVideo.name || heroVideo.fileName}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {heroVideo.uploadId ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        ✓ Đã tải lên
                      </span>
                    ) : heroVideo.file ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Sẵn sàng
                      </span>
                    ) : heroVideo.url ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Đã có
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={removeHeroVideo}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <SimpleFileUploader
                onFileSelect={(file) => {
                  setValue('heroVideo', {
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                  });
                }}
                onFileRemove={removeHeroVideo}
                selectedFile={heroVideo?.file}
                acceptedTypes={['video/*']}
                maxFileSize={100 * 1024 * 1024} // 100MB
                label="Tải lên video hero"
                description="Chọn video hero cho dự án (MP4, WebM, MOV) - Tối đa 100MB"
                onLogout={onLogout}
                // Remove onUploadComplete to disable immediate upload
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hero Banner (Hình ảnh)
          </label>
          <div className="mt-1">
            {heroBanner ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    {heroBanner.url ? (
                      <div
                        style={{
                          backgroundImage: `url(${heroBanner.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                        className="h-8 w-12 rounded border border-gray-200"
                        title={`Preview: ${heroBanner.name || 'hero banner'}`}
                      />
                    ) : (
                      <div className="flex h-8 w-12 items-center justify-center rounded border border-gray-200 bg-gray-100">
                        <span className="text-xs text-gray-400">🖼️</span>
                      </div>
                    )}
                    <span className="block max-w-[12rem] truncate text-sm text-gray-700">
                      {heroBanner.name || heroBanner.fileName}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {heroBanner.uploadId ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        ✓ Đã tải lên
                      </span>
                    ) : heroBanner.file ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Sẵn sàng
                      </span>
                    ) : heroBanner.url ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Đã có
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={removeHeroBanner}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <SimpleFileUploader
                onFileSelect={(file) => {
                  setValue('heroBanner', {
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                  });
                }}
                onFileRemove={removeHeroBanner}
                selectedFile={heroBanner?.file}
                acceptedTypes={['image/*']}
                maxFileSize={10 * 1024 * 1024} // 10MB
                label="Tải lên hero banner"
                description="Chọn hình ảnh hero banner cho dự án (JPG, PNG, WebP) - Tối đa 10MB"
                onLogout={onLogout}
                // Remove onUploadComplete to disable immediate upload
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
