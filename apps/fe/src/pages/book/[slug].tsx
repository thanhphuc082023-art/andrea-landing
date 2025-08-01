import { GetServerSideProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getStrapiMediaUrl } from '@/utils/helper';

// Dynamic import for JQ 3D Flipbook component
const DynamicJQ3DFlipbook = dynamic(
  async () => {
    console.log('Loading JQ3DFlipbook component...');
    try {
      const module = await import('../../components/MinimalFlipBook');
      console.log('JQ3DFlipbook component loaded successfully!');
      return module;
    } catch (err) {
      console.error('Error loading JQ3DFlipbook:', err);
      // Fallback to simple version
      const fallbackModule = await import('../../components/MinimalFlipBook');
      return fallbackModule;
    }
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl font-bold">Loading 3D Flipbook</div>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <div className="mt-4 text-sm opacity-80">
            Preparing advanced 3D reader...
          </div>
        </div>
      </div>
    ),
  }
);

interface BookAttributes {
  title: string;
  slug: string;
  pages?: string[];
  pdfFile?: {
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
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="mb-4 text-2xl font-bold">Book Not Found</h1>
          <p className="mb-4">
            {error || 'The requested book could not be found.'}
          </p>
          <button
            type="button"
            onClick={() => router.push('/books')}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  // Get PDF URL
  const pdfUrl = getStrapiMediaUrl(book.pdfFile);

  if (!pdfUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="mb-4 text-2xl font-bold">PDF Not Available</h1>
          <p className="mb-4">The PDF file for this book is not available.</p>
          <button
            type="button"
            onClick={() => router.push('/books')}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  // Ensure PDF URL is absolute
  const fullPdfUrl = pdfUrl.startsWith('http')
    ? pdfUrl
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${pdfUrl}`;

  return (
    <>
      <Head>
        <title>{book.title} - 3D PDF Flipbook</title>
        <meta
          name="description"
          content={`Read ${book.title} as an interactive 3D PDF flipbook`}
        />
      </Head>

      <div className="relative">
        <DynamicJQ3DFlipbook
          pdfUrl={fullPdfUrl}
          // title={book.title}
          // theme="white"
          // enableSounds={true}
          // onLoadSuccess={() => console.log('JQ3D Flipbook loaded successfully')}
          // onLoadError={(error) =>
          //   console.error('JQ3D Flipbook load error:', error)
          // }
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params!;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books?filters[slug][$eq]=${slug}&populate=pdfFile`,
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
          error: 'Book not found',
        },
      };
    }

    const bookData = data.data[0];

    const book: BookAttributes = {
      title: bookData.title,
      slug: bookData.slug,
      pages: bookData.pages || [],
      pdfFile: bookData.pdfFile,
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
        error: 'Failed to load book',
      },
    };
  }
};

export default PDFBookPage;
