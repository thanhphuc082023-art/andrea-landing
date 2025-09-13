import {
  UseFormRegister,
  UseFormWatch,
  Control,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { UserIcon } from '@heroicons/react/24/outline';
import { type InsightFormData } from '@/lib/validations/insight';

interface AuthorSectionProps {
  register: UseFormRegister<InsightFormData>;
  watch: UseFormWatch<InsightFormData>;
  control: any;
  errors: FieldErrors<InsightFormData>;
  setValue: UseFormSetValue<InsightFormData>;
}

export default function AuthorSection({
  register,
  watch,
  control,
  errors,
  setValue,
}: AuthorSectionProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <UserIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Thông tin tác giả
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Nhập thông tin về tác giả của insight
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Author Name */}
        <div>
          <label
            htmlFor="authorName"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
            Tên tác giả *
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="authorName"
              {...register('author.name')}
              className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none ${
                errors.author?.name
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
              placeholder="Nhập tên tác giả"
            />
            {errors.author?.name && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-1">⚠️</span>
                {errors.author.name.message}
              </p>
            )}
          </div>
        </div>

        {/* Author Role */}
        <div>
          <label
            htmlFor="authorRole"
            className="flex items-center text-sm font-semibold text-gray-800"
          >
            <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
            Vai trò
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="authorRole"
              {...register('author.role')}
              className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none ${
                errors.author?.role
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
              placeholder="Ví dụ: CEO, Founder, Expert..."
            />
            {errors.author?.role && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-1">⚠️</span>
                {errors.author.role.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
