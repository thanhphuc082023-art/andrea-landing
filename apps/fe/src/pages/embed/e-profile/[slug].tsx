import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStrapiMediaUrl } from '@/utils/helper';
import MinimalFlipBook from '@/components/MinimalFlipBook';

interface BookAttributes {
  title: string;
  slug: string;
  pages?: string[];
  pdfFile?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  websiteUrl?: string;
  phoneNumber?: string;
  downloadUrl?: string;
}

interface EmbedBookPageProps {
  book: BookAttributes | null;
  error?: string;
}

export default function EmbedBookPage({ book, error }: EmbedBookPageProps) {
  const router = useRouter();

  // Handle fallback state
  if (router.isFallback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Đang tải E-Profile...</p>
        </div>
      </div>
    );
  }

  // Thông báo cho parent window rằng iframe đã load
  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'IFRAME_LOADED',
          source: 'e-profile-embed',
          data: {
            title: book?.title,
            status: error ? 'error' : 'success',
          },
        },
        '*'
      );
    }
  }, [book?.title, error]);

  if (error || !book) {
    return (
      <>
        <Head>
          <title>E-Profile không khả dụng</title>
          <meta name="robots" content="noindex, nofollow" />
          <style jsx global>{`
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              font-family:
                -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                sans-serif;
            }
          `}</style>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              E-Profile không khả dụng
            </h1>
            <p className="max-w-md text-gray-600">
              {error ||
                'Không thể tìm thấy E-Profile được yêu cầu. Vui lòng kiểm tra lại đường dẫn.'}
            </p>
          </div>
        </div>
      </>
    );
  }

  const pdfUrl = getStrapiMediaUrl(book.pdfFile);

  if (!pdfUrl) {
    return (
      <>
        <Head>
          <title>PDF không khả dụng</title>
          <meta name="robots" content="noindex, nofollow" />
          <style jsx global>{`
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              font-family:
                -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                sans-serif;
            }
          `}</style>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              PDF không khả dụng
            </h1>
            <p className="text-gray-600">
              Tệp PDF cho E-Profile này không khả dụng hoặc đã bị xóa.
            </p>
          </div>
        </div>
      </>
    );
  }

  const bookData = {
    title: book.title,
    websiteUrl: book.websiteUrl,
    phoneNumber: book.phoneNumber,
    downloadUrl: book.downloadUrl || pdfUrl,
  };

  return (
    <>
      <Head>
        <title>{book.title ? `${book.title} - E-Profile` : 'E-Profile'}</title>
        <meta
          name="description"
          content={`Đọc ${book.title || ''} dưới dạng E-Profile tương tác`}
        />

        {/* Thumbnail for better social sharing */}
        {book.thumbnail && (
          <>
            <meta
              property="og:image"
              content={getStrapiMediaUrl(book.thumbnail)}
            />
            <meta
              name="twitter:image"
              content={getStrapiMediaUrl(book.thumbnail)}
            />
            <meta property="og:image:alt" content={`${book.title} thumbnail`} />
          </>
        )}

        <meta property="og:title" content={`${book.title} - E-Profile`} />
        <meta
          property="og:description"
          content={`Đọc ${book.title} dưới dạng E-Profile tương tác`}
        />
        <meta property="og:type" content="article" />

        {/* Embed-specific meta tags */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer-when-downgrade" />

        {/* Optimize for embedding */}
        <style jsx global>{`
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #000;
          }

          /* Prevent scrolling in iframe */
          html,
          body {
            height: 100%;
            width: 100%;
          }

          /* Optimize for iframe rendering */
          * {
            box-sizing: border-box;
          }
        `}</style>
      </Head>

      <div className="h-screen w-full">
        <MinimalFlipBook isSimpleLayout pdfUrl={pdfUrl} bookData={bookData} />
      </div>
    </>
  );
}

// Set custom layout để không có navigation/footer
EmbedBookPage.getLayout = (page: React.ReactElement) => <>{page}</>;

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books?fields[0]=slug`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch book paths for embed: ${response.status}`);
      return {
        paths: [],
        fallback: 'blocking',
      };
    }

    const data = await response.json();
    const paths = data.data.map((book: any) => ({
      params: { slug: book.slug },
    }));

    return {
      paths,
      fallback: 'blocking', // Enable ISR với fallback
    };
  } catch (error) {
    console.error('Error fetching book paths for embed:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<EmbedBookPageProps> = async ({
  params,
}) => {
  const { slug } = params!;

  if (!slug || typeof slug !== 'string') {
    return {
      props: {
        book: null,
        error: 'Slug không hợp lệ',
      },
      revalidate: 60, // Revalidate every minute
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Strapi API error for embed: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return {
        props: {
          book: null,
          error: 'Không tìm thấy E-Profile với slug này',
        },
        revalidate: 60,
      };
    }

    const bookData = data.data[0];

    // Validate required fields
    if (!bookData.title || !bookData.pdfFile) {
      return {
        props: {
          book: null,
          error: 'E-Profile thiếu thông tin cần thiết',
        },
        revalidate: 60,
      };
    }

    const book: BookAttributes = {
      title: bookData.title,
      slug: bookData.slug,
      pages: bookData.pages || [],
      pdfFile: bookData.pdfFile,
      thumbnail: bookData.thumbnail,
      websiteUrl: bookData.websiteUrl,
      phoneNumber: bookData.phoneNumber,
      downloadUrl: bookData.downloadUrl,
    };

    return {
      props: {
        book,
      },
      revalidate: 60, // ISR: Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching book for embed:', error);
    return {
      props: {
        book: null,
        error: 'Không thể tải E-Profile. Vui lòng thử lại sau.',
      },
      revalidate: 60,
    };
  }
};
