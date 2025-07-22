import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy components with loading fallbacks
export const LazyNewPosts = dynamic(() => import('./NewPosts'), {
  ssr: true,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-6 bg-slate-200 rounded mb-4 w-32"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="h-12 w-12 bg-slate-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}) as ComponentType<any>;

export const LazyActivity = dynamic(() => import('./Activity'), {
  ssr: false, // Not critical for SEO
  loading: () => (
    <div className="animate-pulse">
      <div className="h-4 bg-slate-200 rounded mb-2 w-24"></div>
      <div className="h-20 bg-slate-200 rounded"></div>
    </div>
  ),
}) as ComponentType<any>;

export const LazyReactions = dynamic(() => import('./Reactions'), {
  ssr: false, // Interactive component, not needed for SEO
  loading: () => (
    <div className="animate-pulse">
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-8 bg-slate-200 rounded-full"></div>
        ))}
      </div>
    </div>
  ),
}) as ComponentType<any>;

export const LazyQuickAccess = dynamic(() => import('./QuickAccess'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-200 rounded"></div>
        ))}
      </div>
    </div>
  ),
}) as ComponentType<any>;

export const LazyShareButton = dynamic(() => import('./ShareButton'), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
  ),
}) as ComponentType<any>;

export const LazyTableOfContents = dynamic(() => import('./TableOfContents'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-4 bg-slate-200 rounded mb-3 w-32"></div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 rounded w-full" style={{width: `${Math.random() * 40 + 60}%`}}></div>
        ))}
      </div>
    </div>
  ),
}) as ComponentType<any>;

// Higher-order component for lazy loading with intersection observer
export function withLazyLoad<T extends {}>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  const LazyComponent = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => (
      <div className="min-h-[100px] animate-pulse bg-slate-100 rounded">
        {fallback}
      </div>
    ),
  });

  return LazyComponent;
}

// Preload components for better UX
export const preloadComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload after page load
    setTimeout(() => {
      import('./NewPosts');
      import('./Activity');
      import('./Reactions');
      import('./QuickAccess');
      import('./ShareButton');
      import('./TableOfContents');
    }, 1000);
  }
};
