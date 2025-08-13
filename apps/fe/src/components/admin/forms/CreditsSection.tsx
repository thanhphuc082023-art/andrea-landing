import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { type ProjectFormData } from '@/lib/validations/project';

interface CreditsSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  credits: string[];
  newCredit: string;
  setNewCredit: (value: string) => void;
  addCredit: () => void;
  removeCredit: (credit: string) => void;
}

export default function CreditsSection({
  register,
  errors,
  credits,
  newCredit,
  setNewCredit,
  addCredit,
  removeCredit,
}: CreditsSectionProps) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm">
          <span className="text-sm font-bold text-white">3</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Thông tin Credits
        </h3>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Thông tin về team và credits của dự án
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="credits.title"
            className="block text-sm font-medium text-gray-700"
          >
            Tiêu đề chính <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('credits.title')}
            placeholder="Nhập tiêu đề chính..."
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.credits?.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.credits.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="credits.creditLabel"
            className="block text-sm font-medium text-gray-700"
          >
            Nhãn Credits
          </label>
          <input
            type="text"
            {...register('credits.creditLabel')}
            placeholder="Nhập nhãn credits (VD: Credit:, Team:, Thành viên:)"
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Nhãn hiển thị trước danh sách credits (mặc định: "Credit:")
          </p>
        </div>

        <div>
          <label
            htmlFor="credits.date"
            className="block text-sm font-medium text-gray-700"
          >
            Ngày tháng <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('credits.date')}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.credits?.date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.credits.date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credits (mỗi dòng một credit){' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCredit}
              onChange={(e) => setNewCredit(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addCredit())
              }
              placeholder="Nhập credit..."
              className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addCredit}
              className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {credits.map((credit) => (
              <span
                key={credit}
                className="inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-medium text-emerald-800 backdrop-blur-sm"
              >
                {credit}
                <button
                  type="button"
                  onClick={() => removeCredit(credit)}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-emerald-400 hover:bg-emerald-200 hover:text-emerald-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Mỗi dòng sẽ được hiển thị như một credit riêng biệt
          </p>
        </div>
      </div>
    </div>
  );
}
