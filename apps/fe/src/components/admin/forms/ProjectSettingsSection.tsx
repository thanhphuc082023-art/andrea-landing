import { Fragment } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  Controller,
  FieldErrors,
} from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { type ProjectFormData } from '@/lib/validations/project';

interface ProjectSettingsSectionProps {
  register: UseFormRegister<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  control: any;
  errors: FieldErrors<ProjectFormData>;
  technologies: string[];
  newTechnology: string;
  setNewTechnology: (value: string) => void;
  addTechnology: () => void;
  removeTechnology: (tech: string) => void;
}

const statusOptions = [
  { id: 'draft', name: 'Bản nháp' },
  { id: 'in-progress', name: 'Đang thực hiện' },
  { id: 'completed', name: 'Hoàn thành' },
];

export default function ProjectSettingsSection({
  register,
  watch,
  control,
  errors,
  technologies,
  newTechnology,
  setNewTechnology,
  addTechnology,
  removeTechnology,
}: ProjectSettingsSectionProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-sm">
          <span className="text-sm font-bold text-white">4</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Cài đặt dự án</h3>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Công nghệ, trạng thái, danh mục và tùy chọn của dự án
      </p>

      <div className="space-y-6">
        {/* Technologies */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Công nghệ sử dụng
          </label>
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addTechnology())
              }
              placeholder="Nhập công nghệ..."
              className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-medium text-amber-800 backdrop-blur-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-amber-400 hover:bg-amber-200 hover:text-amber-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status and Category */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <Controller
              name="status"
              control={control}
              defaultValue="draft"
              render={({ field }) => (
                <Listbox value={field.value} onChange={field.onChange}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {
                          statusOptions.find(
                            (option) => option.id === field.value
                          )?.name
                        }
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
                        {statusOptions.map((option) => (
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
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Danh mục
            </label>
            <input
              type="text"
              {...register('categoryId')}
              placeholder="Nhập tên danh mục..."
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        {/* Featured Option */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
            />
            <span className="ml-2 block text-sm text-gray-900">
              Dự án nổi bật
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
