import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import DatePicker, { registerLocale } from 'react-datepicker';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import { type ProjectFormData } from '@/lib/validations/project';

// Register Vietnamese locale
registerLocale('vi', vi);

interface CreditsSectionProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  credits: string[];
  newCredit: string;
  setNewCredit: (value: string) => void;
  addCredit: () => void;
  removeCredit: (credit: string) => void;
  setValue: UseFormSetValue<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
}

export default function CreditsSection({
  register,
  errors,
  credits,
  newCredit,
  setNewCredit,
  addCredit,
  removeCredit,
  setValue,
  watch,
}: CreditsSectionProps) {
  // Update projectManager when credits array changes
  const updateProjectManager = (newCredits: string[]) => {
    const projectManagerText = newCredits.join('\n');
    setValue('credits.projectManager', projectManagerText);
  };

  // Enhanced addCredit function
  const handleAddCredit = () => {
    if (newCredit.trim()) {
      addCredit();
      const updatedCredits = [...credits, newCredit.trim()];
      updateProjectManager(updatedCredits);
      setNewCredit('');
    }
  };

  // Enhanced removeCredit function
  const handleRemoveCredit = (creditToRemove: string) => {
    removeCredit(creditToRemove);
    const updatedCredits = credits.filter(
      (credit) => credit !== creditToRemove
    );
    updateProjectManager(updatedCredits);
  };

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
          {errors.credits?.title && !watch('credits.title') && (
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
            Nhãn Credits <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('credits.creditLabel')}
            placeholder="Nhập nhãn credits (VD: Credit:, Team:, Thành viên:)"
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.credits?.creditLabel && !watch('credits.creditLabel') && (
            <p className="mt-1 text-sm text-red-600">
              {errors.credits.creditLabel.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Nhãn hiển thị trước danh sách credits (mặc định: "Credit:")
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ngày tháng <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DatePicker
              selected={
                watch('credits.date')
                  ? new Date(watch('credits.date') || '')
                  : null
              }
              onChange={(date: Date | null) => {
                if (date) {
                  // use local date (yyyy-MM-dd) to avoid UTC timezone shift
                  setValue('credits.date', format(date, 'yyyy-MM-dd'));
                } else {
                  setValue('credits.date', '');
                }
              }}
              placeholderText="Chọn ngày tháng dự án"
              dateFormat="dd/MM/yyyy"
              locale="vi"
              className={`h-9 w-full rounded-lg border px-4 py-3 pr-12 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:text-sm ${
                errors.credits?.date && !watch('credits.date')
                  ? 'border-red-300 bg-red-50/50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } placeholder:text-gray-400`}
              wrapperClassName="w-full"
              showPopperArrow={false}
              todayButton="Chọn hôm nay"
              shouldCloseOnSelect={true}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              maxDate={new Date()}
              minDate={new Date('2000-01-01')}
              popperClassName="z-50"
              calendarClassName="shadow-2xl border-0 rounded-xl"
              yearDropdownItemNumber={15}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <svg
                className={`h-5 w-5 transition-colors duration-200 ${
                  errors.credits?.date && !watch('credits.date')
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {errors.credits?.date && !watch('credits.date') && (
            <div className="mt-2 flex items-center">
              <p className="text-sm text-red-600">
                {errors.credits.date.message}
              </p>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Chọn ngày hoàn thành dự án hoặc ngày phát hành
          </p>
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
                e.key === 'Enter' && (e.preventDefault(), handleAddCredit())
              }
              placeholder="Nhập credit..."
              className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddCredit}
              className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          {credits?.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {credits.map((credit) => (
                <span
                  key={credit}
                  className="inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-medium text-emerald-800 backdrop-blur-sm"
                >
                  {credit}
                  <button
                    type="button"
                    onClick={() => handleRemoveCredit(credit)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-emerald-400 hover:bg-emerald-200 hover:text-emerald-500"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-1 text-xs text-gray-500">
            Mỗi dòng sẽ được hiển thị như một credit riêng biệt
          </p>
          {/* Show validation error for projectManager */}
          {errors.credits?.projectManager &&
            !watch('credits.projectManager') && (
              <p className="mt-1 text-sm text-red-600">
                {errors.credits.projectManager.message}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
