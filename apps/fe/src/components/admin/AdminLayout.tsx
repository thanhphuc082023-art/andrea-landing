import { ReactNode } from 'react';
import Head from 'next/head';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({
  children,
  title = 'Admin Dashboard',
}: AdminLayoutProps) {
  // Session cleanup on unmount for admin area - disable auto cleanup to avoid conflicts
  useSessionCleanup({
    ...sessionCleanupConfigs.all,
    disableAutoCleanup: true,
  });

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Admin dashboard for project management"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="mt-[65px] min-h-screen bg-gray-50 max-md:mt-[60px]">
        {children}
      </div>
    </>
  );
}
