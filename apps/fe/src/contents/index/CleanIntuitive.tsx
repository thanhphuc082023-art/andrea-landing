import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { Type, Grid, Palette, Sparkles } from 'lucide-react';

import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';

import TodoItem from '@/contents/index/Cards/TodoItem';

import type { TodoItemState } from '@/contents/index/Cards/TodoItem';

type Content = {
  state: TodoItemState;
  shows: Array<TodoItemState>;
  title: string;
  description: string;
  step: number;
  icon: React.ReactNode;
};

const contentItems: Array<Content> = [
  {
    state: 'typography',
    shows: ['typography'],
    title: 'Typography',
    description:
      'Selecting the font type, font size, and font weight for better readability.',
    step: 1,
    icon: <Type className="h-5 w-5" />,
  },
  {
    state: 'spacing',
    shows: ['typography', 'spacing'],
    title: 'Spacing',
    description:
      'Positioning and adding spacing between elements for improved layout.',
    step: 2,
    icon: <Grid className="h-5 w-5" />,
  },
  {
    state: 'colors',
    shows: ['typography', 'spacing', 'colors'],
    title: 'Colors',
    description:
      'Choosing a color scheme with sufficient contrast for visual hierarchy.',
    step: 3,
    icon: <Palette className="h-5 w-5" />,
  },
  {
    state: 'effects',
    shows: ['typography', 'spacing', 'colors', 'effects'],
    title: 'Effects',
    description:
      'Add effects like borders, shadows, and rounded corners for depth.',
    step: 4,
    icon: <Sparkles className="h-5 w-5" />,
  },
];

function CleanIntuitive() {
  const [currentState, setCurrentState] = useState<Content | null>(null);

  // Default to showing all effects if no state is selected
  const activeState = useMemo(
    () => currentState || contentItems[3],
    [currentState]
  );

  return (
    <>
      <header className={clsx('mb-12')}>
        <SectionTitle
          title="Eye Catching, Modern & Minimalist Design."
          caption="Clean & Intuitive"
          description="Keep the User Interface clean with a modern touch without
            compromising the User Experience."
        />
      </header>

      <SectionContent>
        {/* Mobile design elements tabs */}
        <div className="mb-8 flex overflow-x-auto py-4 pt-20 lg:hidden">
          <div className="flex gap-3">
            {contentItems.map((item) => (
              <button
              type='button'
                key={item.state}
                onClick={() => setCurrentState(item)}
                className={clsx(
                  'flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 transition-colors',
                  currentState?.state === item.state
                    ? 'border-accent-400 bg-accent-50 text-accent-700 dark:border-accent-500 dark:bg-accent-900/30 dark:text-accent-300'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                )}
              >
                <div
                  className={clsx(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    currentState?.state === item.state
                      ? 'bg-accent-500 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  )}
                >
                  {item.step}
                </div>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Background decorative elements */}
          <div className="bg-accent-100/40 dark:bg-accent-900/20 absolute -left-24 -top-16 h-48 w-48 rounded-full blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl max-md:hidden dark:bg-blue-900/10"/>

          <div className={clsx('flex flex-col', 'lg:flex-row lg:gap-14')}>
            {/* Design Element Selection Panel */}
            <div
              className={clsx('-mt-8 hidden flex-1 flex-col gap-4', 'lg:flex')}
            >
              {contentItems.map((item) => (
                <button
                type='button'
                  key={item.state}
                  onClick={() => setCurrentState(item)}
                  className={clsx(
                    'group relative overflow-hidden rounded-xl border bg-white p-5 text-left backdrop-blur-sm transition-all dark:bg-slate-900',
                    'hover:border-accent-200 hover:bg-accent-50/40 dark:hover:border-accent-800 dark:hover:bg-accent-900/20',
                    currentState?.state === item.state
                      ? 'border-accent-500 bg-accent-50/60 dark:border-accent-600 dark:bg-accent-900/30'
                      : 'border-slate-200 dark:border-slate-800'
                  )}
                >
                  {/* Background pattern for active item */}
                  {currentState?.state === item.state && (
                    <div className="absolute inset-0 opacity-10">
                      <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id={`smallGrid-${item.step}`}
                            width="8"
                            height="8"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 8 0 L 0 0 0 8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect
                          width="100%"
                          height="100%"
                          fill={`url(#smallGrid-${item.step})`}
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={clsx(
                        'flex h-12 w-12 flex-none items-center justify-center rounded-lg text-lg font-bold transition-colors',
                        currentState?.state === item.state
                          ? 'bg-accent-500 text-white'
                          : 'group-hover:bg-accent-100 group-hover:text-accent-600 dark:group-hover:bg-accent-900 dark:group-hover:text-accent-300 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      )}
                    >
                      {item.step}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3
                          className={clsx(
                            'font-semibold',
                            currentState?.state === item.state
                              ? 'text-accent-700 dark:text-accent-400'
                              : 'text-slate-800 dark:text-slate-200'
                          )}
                        >
                          {item.title}
                        </h3>
                        <div className="ml-2 flex h-5 w-5 items-center justify-center">
                          {item.icon}
                        </div>
                      </div>

                      <p
                        className={clsx(
                          'mt-1 text-sm',
                          currentState?.state === item.state
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-slate-500 dark:text-slate-400'
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* TodoItem Preview Area */}
            <div
              className={clsx(
                'relative flex flex-1 items-center justify-center'
              )}
            >
              <div
                className={clsx(
                  'my-auto flex flex-col justify-center',
                  'sm:flex-row sm:gap-6 lg:justify-end'
                )}
              >
                <div className="group relative">
                  {/* Step Indicator */}
                  <div className="bg-accent-500 absolute -left-4 -top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white max-md:hidden dark:ring-slate-900">
                    {activeState.step}
                  </div>

                  {/* Card Glow Effect */}
                  <div
                    className={clsx(
                      'absolute -inset-0.5 -z-10 opacity-0 blur transition-all duration-700 group-hover:opacity-100',
                      activeState.state === 'effects' &&
                        'rounded-xl bg-gradient-to-br from-blue-300 to-indigo-600/70 dark:from-blue-300 dark:to-indigo-700/70'
                    )}
                  />

                  <TodoItem
                    state={activeState.shows}
                    title="UI Components"
                    description="Build and test UI components using React and Tailwind CSS for our design system."
                    date="2:00 PM · Tomorrow"
                    tag1="Development"
                    tag2="UI"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContent>
    </>
  );
}

export default CleanIntuitive;
