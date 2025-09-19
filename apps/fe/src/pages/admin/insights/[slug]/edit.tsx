import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { type InsightFormData } from '@/lib/validations/insight';
import InsightFormPage from '@/components/admin/InsightFormPage';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

// Helper function to add Strapi domain to URL if needed
const addStrapiDomain = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${strapiUrl}${url.startsWith('/') ? url : '/' + url}`;
};

// Helper function to convert URL to File object
const urlToFile = async (
  url: string,
  filename: string
): Promise<File | undefined> => {
  try {
    const fullUrl = addStrapiDomain(url);
    const response = await fetch(fullUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to file:', error);
    return undefined;
  }
};

export default function EditInsightPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<InsightFormData | null>(null);
  const [insight, setInsight] = useState<any | null>(null);

  // Session cleanup
  useSessionCleanup(sessionCleanupConfigs.projectForm);

  // Fetch insight data
  useEffect(() => {
    const fetchInsight = async () => {
      if (!slug || typeof slug !== 'string') return;

      try {
        setIsLoadingData(true);

        // First try to get insight by slug using Strapi API directly
        const strapiUrl =
          process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Try to fetch by slug first (assuming slug might be a slug)
        const populateParams = new URLSearchParams({
          'filters[slug][$eq]': slug,
          'populate[hero][populate][desktop]': 'true',
          'populate[hero][populate][mobile]': 'true',
          'populate[thumbnail]': 'true',
          'populate[author][populate][avatar]': 'true',
        });

        let response = await fetch(
          `${strapiUrl}/api/insights?${populateParams.toString()}`,
          {
            headers,
          }
        );

        let insightData: any = null;

        if (response.ok) {
          const result = await response.json();
          if (result.data && result.data.length > 0) {
            insightData = result.data[0];
            console.log('Found insight by slug:', insightData);
            console.log('Hero data:', insightData.hero);
            console.log('Thumbnail data:', insightData.thumbnail);
          }
        }

        if (!insightData) {
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              localStorage.removeItem('strapiToken');
              localStorage.removeItem('strapiUser');
              throw new Error(
                'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
              );
            }
            throw new Error('Không thể tải dữ liệu insight');
          }

          const result = await response.json();
          insightData = result.data;
        }

        if (!insightData) {
          throw new Error('Không tìm thấy insight');
        }
        console.log('insightData', insightData);
        const insightItem = insightData;
        setInsight(insightItem);

        // Transform insight data to form format
        const formData: InsightFormData = {
          title: insightItem.title || '',
          excerpt: insightItem.excerpt || '',
          category: insightItem.category || '',
          content:
            typeof insightItem.content === 'string'
              ? insightItem.content
              : JSON.stringify(insightItem.content || ''),
          slug: insightItem.slug || '',
          status: insightItem.status || 'draft',
          featured: insightItem.featured || false,
          author: {
            name: insightItem.author?.name || '',
            role: insightItem.author?.role || '',
            avatar: insightItem.author?.avatar
              ? {
                  url: insightItem.author.avatar.url,
                  name: insightItem.author.avatar.name,
                  file: await urlToFile(
                    insightItem.author.avatar.url,
                    insightItem.author.avatar.name || 'avatar'
                  ),
                }
              : undefined,
          },
          hero: insightItem.hero
            ? {
                desktop: insightItem.hero.desktop
                  ? {
                      url: insightItem.hero.desktop.url,
                      name: insightItem.hero.desktop.name,
                      file: await urlToFile(
                        insightItem.hero.desktop.url,
                        insightItem.hero.desktop.name || 'hero-desktop'
                      ),
                    }
                  : undefined,
                mobile: insightItem.hero.mobile
                  ? {
                      url: insightItem.hero.mobile.url,
                      name: insightItem.hero.mobile.name,
                      file: await urlToFile(
                        insightItem.hero.mobile.url,
                        insightItem.hero.mobile.name || 'hero-mobile'
                      ),
                    }
                  : undefined,
              }
            : undefined,
          thumbnail: insightItem.thumbnail
            ? {
                url: insightItem.thumbnail.url,
                name: insightItem.thumbnail.name,
                file: await urlToFile(
                  insightItem.thumbnail.url,
                  insightItem.thumbnail.name || 'thumbnail'
                ),
              }
            : undefined,
          collectionName: insightItem.collectionName || 'Góc nhìn của Andrea',
          collectionHref: insightItem.collectionHref || '/insights',
          seo: insightItem.seo
            ? {
                metaTitle: insightItem.seo.metaTitle || '',
                metaDescription: insightItem.seo.metaDescription || '',
                keywords: insightItem.seo.keywords || [],
                canonicalUrl: insightItem.seo.canonicalUrl || '',
                metaRobots: insightItem.seo.metaRobots || 'index,follow',
                ogTitle: insightItem.seo.ogTitle || '',
                ogDescription: insightItem.seo.ogDescription || '',
                ogImage: insightItem.seo.ogImage
                  ? {
                      url: insightItem.seo.ogImage.url,
                      name: insightItem.seo.ogImage.name,
                      file: await urlToFile(
                        insightItem.seo.ogImage.url,
                        insightItem.seo.ogImage.name || 'og-image'
                      ),
                    }
                  : undefined,
                ogType: insightItem.seo.ogType || 'article',
                twitterTitle: insightItem.seo.twitterTitle || '',
                twitterDescription: insightItem.seo.twitterDescription || '',
                twitterImage: insightItem.seo.twitterImage
                  ? {
                      url: insightItem.seo.twitterImage.url,
                      name: insightItem.seo.twitterImage.name,
                      file: await urlToFile(
                        insightItem.seo.twitterImage.url,
                        insightItem.seo.twitterImage.name || 'twitter-image'
                      ),
                    }
                  : undefined,
                twitterCard:
                  insightItem.seo.twitterCard || 'summary_large_image',
                schemaMarkup: insightItem.seo.schemaMarkup || '',
              }
            : undefined,
          publishedAt: insightItem.publishedAt,
          readingTime: insightItem.readingTime,
        };

        setInitialData(formData);
      } catch (error: any) {
        console.error('Error fetching insight:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu insight');
        toast.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu insight');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInsight();
  }, [slug]);

  const handleSubmit = async (data: InsightFormData) => {
    if (!insight?.documentId) {
      setError('Không tìm thấy documentId của insight');
      return;
    }
    console.log('insight documentId', insight.documentId);
    setIsLoading(true);
    setError('');
    try {
      console.log('Updating insight data:', data);

      // Get Strapi token from localStorage
      const strapiToken = localStorage.getItem('strapiToken');

      // Create FormData for file uploads
      const formData = new FormData();
      console.log('data.content', data.content);
      // Add basic fields
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('category', data.category);
      formData.append('content', data.content);
      formData.append('slug', data.slug || '');
      formData.append('insightStatus', data.status);
      formData.append('featured', data.featured.toString());

      // Add author data
      if (data.author) {
        formData.append('author', JSON.stringify(data.author));
      }

      // Add SEO data
      if (data.seo) {
        formData.append('seo', JSON.stringify(data.seo));
      }

      // Add files (only if new files are uploaded)
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

      // Update insight
      const headers: Record<string, string> = {};

      // Add authorization header if token exists
      if (strapiToken) {
        headers.Authorization = `Bearer ${strapiToken}`;
      }

      const response = await fetch(
        `/api/admin/insights/${insight.documentId}`,
        {
          method: 'PUT',
          headers,
          body: formData,
        }
      );

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
            'Có lỗi xảy ra khi cập nhật insight'
        );
      }

      const result = await response.json();
      console.log('Insight updated successfully:', result);

      toast.success('Insight đã được cập nhật thành công!');

      router.push('/admin/insights');
    } catch (error: any) {
      console.error('Error updating insight:', error);
      setError(error.message || 'Có lỗi xảy ra khi cập nhật insight');
      toast.error(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi cập nhật insight'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <AuthLayout
        title="Chỉnh sửa insight"
        description="Đang tải dữ liệu insight..."
        backUrl="/admin/insights"
        backText="Quay lại danh sách insights"
      >
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <svg
            className="text-brand-orange mb-4 h-10 w-10 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      </AuthLayout>
    );
  }

  if (!initialData) {
    return (
      <AuthLayout
        title="Chỉnh sửa insight"
        description="Không tìm thấy insight"
        backUrl="/admin/insights"
        backText="Quay lại danh sách insights"
      >
        <div className="py-12 text-center">
          <p className="text-gray-600">Không tìm thấy insight với slug này.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Chỉnh sửa insight"
      description="Chỉnh sửa thông tin insight"
      backUrl="/admin/insights"
      backText="Quay lại danh sách insights"
    >
      <>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <InsightFormPage
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={initialData}
          title="Chỉnh sửa Insight"
        />
      </>
    </AuthLayout>
  );
}

EditInsightPage.getLayout = (page: React.ReactElement) => <>{page}</>;
