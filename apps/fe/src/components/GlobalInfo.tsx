import { useGlobal } from '@/providers/GlobalProvider';

interface GlobalInfoProps {
  id: string;
  type: 'siteName' | 'siteDescription' | 'email' | 'phone' | 'address';
  fallback?: string;
  className?: string;
}

function GlobalInfo({
  id,
  type,
  fallback = '',
  className = '',
}: GlobalInfoProps) {
  const { global, isLoading } = useGlobal();

  if (isLoading) {
    return (
      <span
        className={`inline-block h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      />
    );
  }

  const getValue = () => {
    switch (type) {
      case 'siteName':
        return global?.attributes?.siteName || fallback;
      case 'siteDescription':
        return global?.attributes?.siteDescription || fallback;
      case 'email':
        return global?.attributes?.contactInfo?.email || fallback;
      case 'phone':
        return global?.attributes?.contactInfo?.phone || fallback;
      case 'address':
        return global?.attributes?.contactInfo?.address || fallback;
      default:
        return fallback;
    }
  };

  const value = getValue();

  if (!value) {
    return null;
  }

  return (
    <span id={id} className={className}>
      {value}
    </span>
  );
}

export default GlobalInfo;
