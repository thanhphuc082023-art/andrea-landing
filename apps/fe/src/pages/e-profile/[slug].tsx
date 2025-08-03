import { GetServerSideProps } from 'next';
import Head from 'next/head';
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
}

interface PDFBookPageProps {
  book: BookAttributes | null;
  error?: string;
}

const PDFBookPage: React.FC<PDFBookPageProps> = ({ book, error }) => {
  const router = useRouter();

  if (error || !book) {
    return (
      <>
        <Head>
          <title>{'Không tìm E-Profile'}</title>
        </Head>
        <div className="max-sd:mt-[60px] mt-[65px] flex min-h-screen items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <h1 className="mb-4 text-2xl font-bold">Không tìm E-Profile</h1>
            <p className="mb-4">
              {error || 'Không thể tìm thấy E-Profile được yêu cầu.'}
            </p>
            <button
              type="button"
              onClick={() => router.push('/e-profile')}
              className="bg-brand-orange hover:bg-brand-orange-light rounded-md px-4 py-2 font-semibold text-white transition-colors"
            >
              Quay về danh sách
            </button>
          </div>
        </div>
      </>
    );
  }

  // Get PDF URL
  const pdfUrl = getStrapiMediaUrl(book.pdfFile);
  const thumbnailUrl = book.thumbnail
    ? getStrapiMediaUrl(book.thumbnail)
    : null;

  if (!pdfUrl) {
    return (
      <>
        <Head>
          <title>{'PDF không khả dụng'}</title>
        </Head>
        <div className="max-sd:mt-[60px] mt-[65px] flex min-h-screen items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <h1 className="mb-4 text-2xl font-bold">PDF không khả dụng</h1>
            <p className="mb-4">Tệp PDF cho E-Profile này không khả dụng.</p>
            <button
              type="button"
              onClick={() => router.push('/e-profile')}
              className="bg-brand-orange hover:bg-brand-orange-light rounded-md px-4 py-2 font-semibold text-white transition-colors"
            >
              Quay về danh sách
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{book.title ? `${book.title} - E-Profile` : 'E-Profile'} </title>
        <meta
          name="description"
          content={`Đọc ${book.title || ''} dưới dạng E-Profile tương tác`}
        />
        {thumbnailUrl && (
          <>
            <meta property="og:image" content={thumbnailUrl} />
            <meta name="twitter:image" content={thumbnailUrl} />
            <meta property="og:image:alt" content={`${book.title} thumbnail`} />
          </>
        )}
        <meta property="og:title" content={`${book.title} - E-Profile`} />
        <meta
          property="og:description"
          content={`Đọc ${book.title} dưới dạng E-Profile tương tác`}
        />
        <meta property="og:type" content="article" />
      </Head>
      <div className="max-sd:mt-[60px] mt-[65px] bg-gray-100 p-10">
        <div className="mx-auto max-w-full">
          <MinimalFlipBook pdfUrl={pdfUrl} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!;

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return {
        props: {
          book: null,
          error: 'Không tìm thấy E-Profile',
        },
      };
    }

    const bookData = data.data[0];

    const book: BookAttributes = {
      title: bookData.title,
      slug: bookData.slug,
      pages: bookData.pages || [],
      pdfFile: bookData.pdfFile,
      thumbnail: bookData.thumbnail,
    };

    return {
      props: {
        book,
      },
    };
  } catch (error) {
    console.error('Error fetching book:', error);
    return {
      props: {
        book: null,
        error: 'Không thể tải E-Profile',
      },
    };
  }
};

export default PDFBookPage;
