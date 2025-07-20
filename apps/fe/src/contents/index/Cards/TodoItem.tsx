import clsx from 'clsx';
import { useMemo } from 'react';
import {
  CalendarIcon,
  Clock,
  MoreHorizontal,
} from 'lucide-react';

export type TodoItemState = 'spacing' | 'typography' | 'colors' | 'effects';

interface TodoItemProps {
  state: Array<TodoItemState>;
  title?: string;
  description?: string;
  date?: string;
  tag1?: string;
  tag2?: string;
}

function TodoItem({
  state,
  title = 'Create Documentations',
  description = 'It is good to create early documentation for our new library.',
  date = '10:00 AM · Tomorrow',
  tag1 = 'Docs',
  tag2 = 'Support',
}: TodoItemProps) {
  // Lấy ký tự đầu của title
  const initial = useMemo(() => title.charAt(0).toUpperCase(), [title]);

  // Shorthand để code dễ đọc hơn
  const hasTypography = state.includes('typography');
  const hasSpacing = state.includes('spacing');
  const hasColors = state.includes('colors');
  const hasEffects = state.includes('effects');

  // Tính bước hiện tại
  const currentStep = useMemo(() => {
    if (state.includes('effects')) return 4;
    if (state.includes('colors')) return 3;
    if (state.includes('spacing')) return 2;
    if (state.includes('typography')) return 1;
    return 0;
  }, [state]);

  return (
    <div
      className={clsx(
        'pointer-events-none w-full select-none overflow-hidden',
        'lg:w-[380px]',
        hasEffects
          ? 'rounded-xl border border-transparent shadow-lg'
          : 'border',
        hasTypography ? 'text-sm' : 'font-serif',
        hasColors
          ? [
              'border-slate-200 bg-white',
              'dark:border-slate-800 dark:bg-slate-900',
            ]
          : ['border-black bg-white', 'dark:border-white dark:bg-[#050914]']
      )}
      role="presentation"
    >
      {/* Header */}
      <div className={clsx(hasSpacing ? 'px-5 pt-5' : 'p-4')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={clsx(
                'flex h-10 w-10 flex-none items-center justify-center',
                hasEffects && 'rounded-lg',
                hasTypography && 'text-base font-bold',
                hasColors
                  ? 'from-accent-400 to-accent-600 bg-gradient-to-br text-white'
                  : 'bg-[#050914] text-white dark:bg-white dark:text-black'
              )}
            >
              {initial}
            </div>
            <div className="ml-3">
              <div
                className={clsx(
                  hasTypography && 'text-base font-semibold',
                  hasColors
                    ? 'text-slate-900 dark:text-white'
                    : 'text-black dark:text-white'
                )}
              >
                {title}
              </div>
              {hasSpacing && (
                <div
                  className={clsx(
                    'flex items-center',
                    hasTypography && 'text-xs',
                    hasColors
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-black dark:text-white'
                  )}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Today</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={clsx(
                'flex items-center px-2 py-1',
                hasEffects && 'rounded-full',
                hasTypography && 'text-xs font-semibold',
                hasColors
                  ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300'
                  : 'bg-[#ff0000] text-white'
              )}
            >
              {hasColors && (
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
              )}
              <span>Step {currentStep}</span>
            </div>
            <button
              type="button"
              className={clsx(
                'flex h-8 w-8 items-center justify-center',
                hasEffects && 'rounded-full',
                hasColors
                  ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300'
                  : 'text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={clsx(hasSpacing ? 'p-5' : 'p-4')}>
        <div
          className={clsx(
            hasSpacing && 'mb-4',
            hasTypography && 'leading-relaxed',
            hasColors
              ? 'text-slate-700 dark:text-slate-300'
              : 'text-black dark:text-white'
          )}
        >
          {description}
        </div>

        {/* Progress Bar - Now represents step progress */}
        {hasSpacing && (
          <div className="mb-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div
                className={clsx(
                  hasTypography && 'font-medium',
                  hasColors
                    ? 'text-slate-600 dark:text-slate-400'
                    : 'text-black dark:text-white'
                )}
              >
                Progress
              </div>
              <div
                className={clsx(
                  hasTypography && 'font-semibold',
                  hasColors
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-black dark:text-white'
                )}
              >
                {currentStep * 25}%
              </div>
            </div>
            <div
              className={clsx(
                'h-2 w-full overflow-hidden',
                hasEffects && 'rounded-full',
                hasColors
                  ? 'bg-slate-200 dark:bg-slate-700'
                  : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <div
                className={clsx(
                  'h-full',
                  hasEffects && 'rounded-full',
                  hasColors
                    ? 'bg-accent-500 dark:bg-accent-400'
                    : 'bg-black dark:bg-white'
                )}
                style={{ width: `${currentStep * 25}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className={clsx('flex', hasSpacing && 'mb-4 gap-2')}>
          <div
            className={clsx(
              hasEffects ? 'rounded-md' : 'rounded-full',
              hasSpacing && 'px-3 py-1',
              hasTypography && 'text-xs font-medium',
              hasColors
                ? 'border-accent-200 bg-accent-50 text-accent-600 dark:border-accent-800/30 dark:bg-accent-900/20 dark:text-accent-400 border'
                : 'bg-[#0000ff] text-white'
            )}
          >
            {tag1}
          </div>
          <div
            className={clsx(
              hasEffects ? 'rounded-md' : 'rounded-full',
              hasSpacing && 'px-3 py-1',
              hasTypography && 'text-xs font-medium',
              hasColors
                ? 'border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-[#ffff00] text-black'
            )}
          >
            {tag2}
          </div>
        </div>

        {/* Footer with step indicators */}
        <div className="flex items-center justify-between">
          <div
            className={clsx(
              'flex items-center',
              hasSpacing && 'gap-2',
              hasTypography && 'text-xs',
              hasColors && ''
            )}
          >
            <CalendarIcon
              className={clsx(
                'h-3.5 w-3.5',
                hasColors
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-black dark:text-white'
              )}
            />
            <div
              className={clsx(
                hasTypography && 'font-medium',
                hasColors
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-black dark:text-white'
              )}
            >
              {date}
            </div>
          </div>

          {/* Step checkboxes */}
          {hasSpacing && (
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={clsx(
                    'flex h-5 w-5 items-center justify-center text-xs',
                    hasEffects && 'rounded',
                    step <= currentStep
                      ? hasColors
                        ? 'border-accent-300 bg-accent-50 text-accent-500 dark:border-accent-700 dark:bg-accent-900/30 dark:text-accent-400 border'
                        : 'border border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : hasColors
                        ? 'border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
                        : 'border border-black dark:border-white'
                  )}
                >
                  {step <= currentStep && <span>{step}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
