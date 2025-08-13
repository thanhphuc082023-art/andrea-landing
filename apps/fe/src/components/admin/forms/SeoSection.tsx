import { Fragment } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
} from '@heroicons/react/20/solid';
import { type ProjectFormData } from '@/lib/validations/project';

interface SeoSectionProps {
  register: UseFormRegister<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  control: any;
  setValue: UseFormSetValue<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  newKeyword: string;
  setNewKeyword: (value: string) => void;
  addKeyword: () => void;
  removeKeyword: (index: number) => void;
}

export default function SeoSection({
  register,
  watch,
  control,
  setValue,
  errors,
  newKeyword,
  setNewKeyword,
  addKeyword,
  removeKeyword,
}: SeoSectionProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-slate-500 to-gray-600 shadow-sm">
          <span className="text-sm font-bold text-white">5</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Thông tin SEO</h3>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Tối ưu hóa cho công cụ tìm kiếm
      </p>

      <div className="space-y-6">
        {/* Basic SEO */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">
            Thông tin cơ bản
          </h4>

          <div>
            <label
              htmlFor="seo.title"
              className="block text-sm font-medium text-gray-700"
            >
              SEO Title
            </label>
            <input
              type="text"
              {...register('seo.title')}
              placeholder="Tiêu đề SEO..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="seo.description"
              className="block text-sm font-medium text-gray-700"
            >
              SEO Description
            </label>
            <textarea
              {...register('seo.description')}
              rows={3}
              placeholder="Mô tả SEO..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SEO Keywords
            </label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addKeyword())
                }
                placeholder="Nhập keyword..."
                className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-slate-600 to-gray-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:from-slate-700 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watch('seo.keywords')?.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-slate-100/80 px-3 py-1 text-sm text-slate-800 backdrop-blur-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-500"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">
            Open Graph (Social Media)
          </h4>

          <div>
            <label
              htmlFor="seo.ogTitle"
              className="block text-sm font-medium text-gray-700"
            >
              OG Title
            </label>
            <input
              type="text"
              {...register('seo.ogTitle')}
              placeholder="Tiêu đề cho social media..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="seo.ogDescription"
              className="block text-sm font-medium text-gray-700"
            >
              OG Description
            </label>
            <textarea
              {...register('seo.ogDescription')}
              rows={2}
              placeholder="Mô tả cho social media..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              OG Type
            </label>
            <Controller
              name="seo.ogType"
              control={control}
              render={({ field }) => (
                <Listbox value={field.value || ''} onChange={field.onChange}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {field.value || 'Chọn loại...'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {[
                          { id: '', name: 'Chọn loại...' },
                          { id: 'website', name: 'Website' },
                          { id: 'article', name: 'Article' },
                          { id: 'project', name: 'Project' },
                          { id: 'portfolio', name: 'Portfolio' },
                        ].map((option) => (
                          <Listbox.Option
                            key={option.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-900'
                              }`
                            }
                            value={option.id}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {option.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              OG Image (Social Media Preview)
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Hình ảnh hiển thị khi chia sẻ trên Facebook, LinkedIn, Twitter.
              Khuyến nghị: 1200x630px, tối đa 5MB
            </p>
            <div className="mt-1">
              {watch('seo.ogImage') ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(watch('seo.ogImage'))}
                    alt="OG Image Preview"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('seo.ogImage', null)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setValue('seo.ogImage', file);
                    }}
                    className="hidden"
                  />
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click để upload OG Image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP (1200x630px)
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Twitter Card */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">Twitter Card</h4>
          <p className="text-xs text-gray-500">
            Tùy chỉnh hiển thị khi chia sẻ trên Twitter
          </p>

          <div>
            <label
              htmlFor="seo.twitterTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Twitter Title
            </label>
            <input
              type="text"
              {...register('seo.twitterTitle')}
              placeholder="Tiêu đề cho Twitter..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="seo.twitterDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Twitter Description
            </label>
            <textarea
              {...register('seo.twitterDescription')}
              rows={2}
              placeholder="Mô tả cho Twitter..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Twitter Image
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Hình ảnh riêng cho Twitter. Nếu không upload, sẽ dùng OG Image.
              Khuyến nghị: 1200x600px, tối đa 5MB
            </p>
            <div className="mt-1">
              {watch('seo.twitterImage') ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(watch('seo.twitterImage'))}
                    alt="Twitter Image Preview"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('seo.twitterImage', null)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setValue('seo.twitterImage', file);
                    }}
                    className="hidden"
                  />
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click để upload Twitter Image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WebP (1200x600px)
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Twitter Card Type
            </label>
            <Controller
              name="seo.twitterCard"
              control={control}
              render={({ field }) => (
                <Listbox value={field.value || ''} onChange={field.onChange}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {field.value || 'Mặc định (summary)'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {[
                          { id: '', name: 'Mặc định (summary)' },
                          { id: 'summary', name: 'Summary' },
                          {
                            id: 'summary_large_image',
                            name: 'Summary Large Image',
                          },
                          { id: 'app', name: 'App' },
                          { id: 'player', name: 'Player' },
                        ].map((option) => (
                          <Listbox.Option
                            key={option.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-900'
                              }`
                            }
                            value={option.id}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {option.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              )}
            />
          </div>
        </div>

        {/* Advanced SEO */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">
            Cài đặt nâng cao
          </h4>

          <div>
            <label
              htmlFor="seo.canonicalUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Canonical URL
            </label>
            <input
              type="url"
              {...register('seo.canonicalUrl')}
              placeholder="https://example.com/project-slug"
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Robots
            </label>
            <Controller
              name="seo.metaRobots"
              control={control}
              render={({ field }) => (
                <Listbox value={field.value || ''} onChange={field.onChange}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {field.value || 'Mặc định'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {[
                          { id: '', name: 'Mặc định' },
                          { id: 'index,follow', name: 'index, follow' },
                          { id: 'noindex,follow', name: 'noindex, follow' },
                          { id: 'index,nofollow', name: 'index, nofollow' },
                          { id: 'noindex,nofollow', name: 'noindex, nofollow' },
                        ].map((option) => (
                          <Listbox.Option
                            key={option.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-900'
                              }`
                            }
                            value={option.id}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {option.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
