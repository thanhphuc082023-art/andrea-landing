import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { type InsightFormData } from '@/lib/validations/insight';
import InsightFormPage from '@/components/admin/InsightFormPage';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

export default function CreateInsightPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Session cleanup
  useSessionCleanup(sessionCleanupConfigs.projectForm);

  const handleSubmit = async (data: InsightFormData) => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Submitting insight data:', data);

      // Get Strapi token from localStorage
      const strapiToken = localStorage.getItem('strapiToken');

      // Create FormData for file uploads
      const formData = new FormData();

      // Add basic fields
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('category', data.category);
      formData.append('content', data.content);
      formData.append('slug', data.slug || '');
      formData.append('status', data.status);
      formData.append('featured', data.featured.toString());

      // Add author data
      if (data.author) {
        formData.append('author', JSON.stringify(data.author));
      }

      // Add SEO data
      if (data.seo) {
        formData.append('seo', JSON.stringify(data.seo));
      }

      // Add files
      if (data.hero?.desktop?.file) {
        formData.append('heroDesktop', data.hero.desktop.file);
      }
      if (data.hero?.mobile?.file) {
        formData.append('heroMobile', data.hero.mobile.file);
      }
      if (data.thumbnail?.file) {
        formData.append('thumbnail', data.thumbnail.file);
      }
      if (data.author?.avatar?.file) {
        formData.append('authorAvatar', data.author.avatar.file);
      }
      if (data.seo?.ogImage?.file) {
        formData.append('seoOgImage', data.seo.ogImage.file);
      }
      if (data.seo?.twitterImage?.file) {
        formData.append('seoTwitterImage', data.seo.twitterImage.file);
      }

      // Upload files and create insight
      const headers: Record<string, string> = {};

      // Add authorization header if token exists
      if (strapiToken) {
        headers.Authorization = `Bearer ${strapiToken}`;
      }

      const response = await fetch('/api/admin/insights', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('strapiToken');
          localStorage.removeItem('strapiUser');
          throw new Error(
            'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          );
        }

        throw new Error(
          errorData.error ||
            errorData.message ||
            'Có lỗi xảy ra khi tạo insight'
        );
      }

      const result = await response.json();
      console.log('Insight created successfully:', result);

      toast.success('Insight đã được tạo thành công!');

      router.push('/admin/insights');
    } catch (error: any) {
      console.error('Error creating insight:', error);
      setError(error.message || 'Có lỗi xảy ra khi tạo insight');
      toast.error(
        error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo insight'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo insight mới"
      description="Đăng nhập để tạo insight mới"
      backUrl="/admin/insights"
      backText="Quay lại danh sách insights"
    >
      <>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <InsightFormPage onSubmit={handleSubmit} isLoading={isLoading} />
      </>
    </AuthLayout>
  );
}

CreateInsightPage.getLayout = (page: React.ReactElement) => <>{page}</>;
