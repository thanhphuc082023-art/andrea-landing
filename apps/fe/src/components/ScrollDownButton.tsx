'use client';

import clsx from 'clsx';

interface ScrollDownButtonProps {
  onClick?: () => void;
  className?: string;
  text?: string;
  variant?: 'default' | 'simple';
}

export default function ScrollDownButton({
  onClick,
  className = '',
  text = 'Kéo xuống',
  variant = 'default',
}: ScrollDownButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default scroll behavior
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  if (variant === 'simple') {
    return (
      <button
        type="button"
        aria-label={text}
        onClick={handleClick}
        className={clsx('group flex flex-col items-center', className)}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-chevron-simple text-white"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {text && (
          <span className="mt-1 text-xs text-white drop-shadow">{text}</span>
        )}

        <style jsx>{`
          @keyframes chevronSimple {
            0%,
            100% {
              opacity: 0.5;
              transform: translateY(0);
            }
            50% {
              opacity: 1;
              transform: translateY(4px);
            }
          }
          .animate-chevron-simple {
            animation: chevronSimple 2s infinite;
          }
        `}</style>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={text}
      onClick={handleClick}
      className={clsx('group flex flex-col items-center', className)}
    >
      <span className="flex flex-col items-center space-y-[-12px]">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-orange animate-chevron opacity-0"
          style={{ animationDelay: '0s' }}
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-orange animate-chevron opacity-0"
          style={{ animationDelay: '0.15s' }}
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-orange animate-chevron opacity-0"
          style={{ animationDelay: '0.3s' }}
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      {text && <span className="text-xs text-white drop-shadow">{text}</span>}

      {/* Animations */}
      <style jsx>{`
        @keyframes chevronFade {
          0% {
            opacity: 0.1;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.1;
          }
        }
        .animate-chevron {
          animation: chevronFade 1.2s infinite;
        }
      `}</style>
    </button>
  );
}
